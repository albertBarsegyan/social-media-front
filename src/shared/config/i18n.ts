export const locales = ["en", "ru", "hy"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

export const localeCookie = "locale"

/** Labels shown in the language switcher, written in each language. */
export const localeLabels: Record<Locale, string> = {
  hy: "ՀԱՅ",
  ru: "РУС",
  en: "ENG",
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value)
}
