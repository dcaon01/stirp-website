import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

const LOCALES = ["it", "en"] as const;
const DEFAULT_LOCALE = "it";

function detectBrowserLocale(acceptLanguage: string | null): string | undefined {
  if (!acceptLanguage) return undefined;
  const preferred = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase())
    .map((tag) => tag.split("-")[0]);
  return preferred.find((lang) =>
    LOCALES.includes(lang as (typeof LOCALES)[number])
  );
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("locale")?.value;

  const headerStore = await headers();
  const browserLocale = detectBrowserLocale(
    headerStore.get("accept-language")
  );

  const locale =
    (cookieLocale && LOCALES.includes(cookieLocale as (typeof LOCALES)[number])
      ? cookieLocale
      : undefined) ??
    browserLocale ??
    DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
