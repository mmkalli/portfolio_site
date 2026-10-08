# Mehmet Melih Kalli — Professional Website

A Next.js 16 personal portfolio with a streaming, profile-grounded Digital
Twin powered by OpenRouter.

## Requirements

- Node.js 20.9 or newer
- npm
- An OpenRouter API key

## Local setup

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

Set `OPENROUTER_API_KEY` in `.env.local`, then open the URL printed by Next.js.
Do not commit `.env` or `.env.local`.

## Environment variables

- `OPENROUTER_API_KEY` — required server-side OpenRouter credential.
- `OPENROUTER_MODEL` — optional primary model; defaults to the model requested
  for this project.
- `OPENROUTER_FALLBACK_MODELS` — optional comma-separated fallback model IDs.
  Check pricing before adding paid models.
- `OPENROUTER_DATA_COLLECTION` — `allow` by default because the selected free
  model requires it. Set `deny` only after choosing a compatible provider.
- `SITE_URL` — production origin, including protocol. It drives metadata,
  same-origin chat checks, and OpenRouter attribution.

## Commands

```powershell
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm run check
```

## Content model

Verified career data lives in `src/data/profile.ts`. The public timeline and
the Digital Twin prompt both read from that module so titles and dates do not
drift apart. Add only claims that Mehmet has reviewed and can substantiate.

## Digital Twin safeguards

The route accepts same-origin browser requests, caps request and message sizes,
drops client-supplied assistant turns, propagates cancellation, excludes model
reasoning from the client stream, and applies a best-effort per-process rate
limit.

Before production launch:

1. Rotate any OpenRouter key that has appeared in logs or chat history.
2. Set an OpenRouter credit/spend limit.
3. Configure a shared rate limit in the hosting firewall or a durable store.
   The in-process limit does not coordinate across serverless instances.
4. Review OpenRouter and model-provider retention policies.
5. Set `SITE_URL` to the public HTTPS origin.

## Deployment

The project is compatible with Vercel. Add the environment variables in the
deployment settings, run the full check command in CI, and verify the Digital
Twin against the chosen production model before promotion.
