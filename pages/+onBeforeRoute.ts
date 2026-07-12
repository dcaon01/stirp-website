import type { PageContext } from "vike/types";
import { extractLocale } from "@/i18n/locales";

// Strip the locale prefix from the URL before Vike does its route matching,
// and expose the detected locale on pageContext.
// https://vike.dev/i18n
export function onBeforeRoute(pageContext: PageContext) {
  const { locale, urlWithoutLocale } = extractLocale(
    pageContext.urlParsed.pathname,
  );
  return {
    pageContext: {
      locale,
      urlLogical: urlWithoutLocale,
    },
  };
}
