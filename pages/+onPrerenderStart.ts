import type { PageContext } from "vike/types";
import { defaultLocale, localizePath, locales } from "@/i18n/locales";

// Emit one prerendered HTML page per locale per route:
//   /            /privacy            (en, default — no prefix)
//   /it          /it/privacy         (it)
// https://vike.dev/i18n#pre-rendering-ssg
export function onPrerenderStart(prerenderContext: {
  pageContexts: PageContext[];
}) {
  const pageContexts: PageContext[] = [];

  prerenderContext.pageContexts.forEach((pageContext) => {
    locales.forEach((locale) => {
      // urlOriginal here is already locale-agnostic (thanks to onBeforeRoute).
      const urlLogical = pageContext.urlOriginal || "/";
      const urlOriginal =
        locale === defaultLocale
          ? urlLogical
          : localizePath(urlLogical, locale);
      pageContexts.push({
        ...pageContext,
        urlOriginal,
        locale,
        urlLogical,
      });
    });
  });

  return {
    prerenderContext: {
      pageContexts,
    },
  };
}
