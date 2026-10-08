export function getSiteUrl(): URL {
  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const value =
    process.env.SITE_URL ||
    (vercelProductionUrl ? `https://${vercelProductionUrl}` : null) ||
    "http://localhost:3000";

  return new URL(value);
}
