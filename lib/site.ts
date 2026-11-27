import type { Locale } from "./locale";

const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl =
  process.env.SITE_URL ?? (production ? `https://${production}` : "http://localhost:3000");

export function alternatesFor(locale: Locale, path = "") {
  return {
    canonical: `/${locale}${path}`,
    languages: { ko: `/ko${path}`, en: `/en${path}`, "x-default": `/ko${path}` },
  };
}
