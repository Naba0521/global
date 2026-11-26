export const locales = ["ko", "en"] as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return value === "ko" || value === "en";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "ko" ? "en" : "ko";
}
