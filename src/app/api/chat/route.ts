import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
} from "ai";
import {
  DIGITAL_TWIN_INSTRUCTIONS,
  MODEL_ID,
  OPENROUTER_APP_TITLE,
  sanitizeChatMessages,
} from "@/lib/digital-twin";

export const maxDuration = 30;

const MAX_REQUEST_BYTES = 64 * 1024;
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

class PayloadTooLargeError extends Error {}

function clientAddress(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkRateLimit(request: Request): {
  allowed: boolean;
  retryAfter: number;
} {
  const now = Date.now();
  const key = clientAddress(request);
  const current = rateLimitBuckets.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  if (current.count >= RATE_LIMIT) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");

  if (!origin) {
    return false;
  }

  const configuredSite = process.env.SITE_URL;
  const allowedOrigin = configuredSite
    ? new URL(configuredSite).origin
    : new URL(request.url).origin;

  return origin === allowedOrigin;
}

async function readLimitedJson(request: Request): Promise<unknown> {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);

  if (declaredLength > MAX_REQUEST_BYTES) {
    throw new PayloadTooLargeError("The chat request is too large.");
  }

  if (!request.body) {
    throw new Error("A JSON request body is required.");
  }

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let body = "";
  let bytesRead = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    bytesRead += value.byteLength;
    if (bytesRead > MAX_REQUEST_BYTES) {
      await reader.cancel();
      throw new PayloadTooLargeError("The chat request is too large.");
    }

    body += decoder.decode(value, { stream: true });
  }

  body += decoder.decode();
  return JSON.parse(body);
}

function logStreamError(error: unknown) {
  const details =
    error instanceof Error
      ? { name: error.name, message: error.message }
      : { name: "UnknownError", message: String(error) };

  console.error("Digital Twin upstream error", {
    model: process.env.OPENROUTER_MODEL || MODEL_ID,
    ...details,
  });
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return Response.json({ error: "Origin not allowed." }, { status: 403 });
  }

  const rateLimit = checkRateLimit(request);
  if (!rateLimit.allowed) {
    return Response.json(
      { error: "Too many requests. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfter) },
      },
    );
  }

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "The Digital Twin is not configured." },
      { status: 503 },
    );
  }

  let messages;

  try {
    messages = sanitizeChatMessages(await readLimitedJson(request));
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return Response.json({ error: error.message }, { status: 413 });
    }

    return Response.json(
      {
        error: error instanceof Error ? error.message : "Invalid chat request.",
      },
      { status: 400 },
    );
  }

  const openrouter = createOpenRouter({
    apiKey,
    compatibility: "strict",
    headers: {
      "HTTP-Referer": process.env.SITE_URL || new URL(request.url).origin,
      "X-OpenRouter-Title": OPENROUTER_APP_TITLE,
    },
  });

  const modelId = process.env.OPENROUTER_MODEL || MODEL_ID;
  const fallbackModels = (process.env.OPENROUTER_FALLBACK_MODELS || "")
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean);
  const dataCollection =
    process.env.OPENROUTER_DATA_COLLECTION === "deny" ? "deny" : "allow";
  const result = streamText({
    model: openrouter.chat(modelId, {
      models: fallbackModels.length > 0 ? fallbackModels : undefined,
      provider: {
        allow_fallbacks: true,
        data_collection: dataCollection,
      },
      reasoning: {
        effort: "low",
        exclude: true,
      },
    }),
    instructions: DIGITAL_TWIN_INSTRUCTIONS,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 900,
    maxRetries: 1,
    abortSignal: request.signal,
    timeout: {
      firstChunkMs: 12_000,
      chunkMs: 10_000,
      totalMs: 28_000,
    },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      originalMessages: messages,
      sendReasoning: false,
      onError: (error) => {
        logStreamError(error);
        return "The Digital Twin is temporarily unavailable.";
      },
    }),
  });
}
