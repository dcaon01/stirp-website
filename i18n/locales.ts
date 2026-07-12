// Supported locales. English is the default and lives at the unprefixed root
// (`/`, `/privacy`), Italian lives under `/it` (`/it`, `/it/privacy`).
export const locales = ["en", "it"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Split a pathname into its locale prefix and the locale-agnostic remainder.
 * `/it/privacy` → { locale: "it", urlWithoutLocale: "/privacy" }
 * `/privacy`    → { locale: "en", urlWithoutLocale: "/privacy" }
 */
export function extractLocale(pathname: string): {
  locale: Locale;
  urlWithoutLocale: string;
} {
  const match = pathname.match(/^\/([a-z]{2})(?=\/|$)/);
  if (match && isLocale(match[1]) && match[1] !== defaultLocale) {
    const locale = match[1];
    const urlWithoutLocale = pathname.slice(3) || "/";
    return { locale, urlWithoutLocale };
  }
  return { locale: defaultLocale, urlWithoutLocale: pathname };
}

/** Prefix a locale-agnostic path with the locale (no prefix for the default). */
export function localizePath(urlWithoutLocale: string, locale: Locale): string {
  const clean = urlWithoutLocale.startsWith("/")
    ? urlWithoutLocale
    : `/${urlWithoutLocale}`;
  if (locale === defaultLocale) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}
