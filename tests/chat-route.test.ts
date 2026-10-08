import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { POST } from "../src/app/api/chat/route";

const originalApiKey = process.env.OPENROUTER_API_KEY;

function makeRequest(
  body: string,
  headers: Record<string, string> = {},
): Request {
  return new Request("http://localhost:3000/api/chat", {
    method: "POST",
    body,
    headers: {
      "content-type": "application/json",
      origin: "http://localhost:3000",
      ...headers,
    },
  });
}

describe("Digital Twin chat route protections", () => {
  beforeEach(() => {
    process.env.OPENROUTER_API_KEY = "test-key";
  });

  afterEach(() => {
    if (originalApiKey === undefined) {
      delete process.env.OPENROUTER_API_KEY;
    } else {
      process.env.OPENROUTER_API_KEY = originalApiKey;
    }
  });

  it("rejects a cross-origin browser request", async () => {
    const response = await POST(
      makeRequest('{"messages":[]}', {
        origin: "https://attacker.example",
        "x-forwarded-for": "cross-origin-test",
      }),
    );

    expect(response.status).toBe(403);
  });

  it("rejects an oversized request before parsing JSON", async () => {
    const response = await POST(
      makeRequest("x".repeat(70_000), {
        "x-forwarded-for": "oversized-test",
      }),
    );

    expect(response.status).toBe(413);
  });

  it("rate limits repeated requests from one client", async () => {
    const requests = Array.from({ length: 11 }, () =>
      POST(
        makeRequest('{"messages":[]}', {
          "x-forwarded-for": "rate-limit-test",
        }),
      ),
    );
    const responses = await Promise.all(requests);

    expect(
      responses.slice(0, 10).every((response) => response.status === 400),
    ).toBe(true);
    expect(responses[10].status).toBe(429);
    expect(responses[10].headers.get("Retry-After")).toBeTruthy();
  });

  it("does not force a data policy that makes the selected free model unavailable", () => {
    const routeSource = readFileSync(
      new URL("../src/app/api/chat/route.ts", import.meta.url),
      "utf8",
    );

    expect(routeSource).not.toContain('data_collection: "deny"');
  });
});
