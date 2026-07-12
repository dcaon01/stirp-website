import { createContext, useContext, useMemo } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { defaultLocale, localizePath, type Locale } from "./locales";
import { getMessages, type Messages } from "./messages";

type MessageValue = string | string[] | Record<string, unknown> | unknown;

interface I18nContextValue {
  locale: Locale;
  messages: Messages;
}

const I18nContext = createContext<I18nContextValue | null>(null);

/**
 * Provides the active locale + messages to the tree. The locale is resolved
 * from Vike's pageContext (set by `+onBeforeRoute`).
 */
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const pageContext = usePageContext();
  const locale = ((pageContext as { locale?: Locale }).locale ??
    defaultLocale) as Locale;
  const value = useMemo<I18nContextValue>(
    () => ({ locale, messages: getMessages(locale) }),
    [locale],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Fallback for any component rendered outside the provider.
    return { locale: defaultLocale, messages: getMessages(defaultLocale) };
  }
  return ctx;
}

function resolveKey(root: unknown, key: string): MessageValue {
  return key
    .split(".")
    .reduce<unknown>(
      (acc, part) =>
        acc && typeof acc === "object"
          ? (acc as Record<string, unknown>)[part]
          : undefined,
      root,
    );
}

export interface Translator {
  (key: string): string;
  raw: <T = MessageValue>(key: string) => T;
}

/**
 * next-intl-compatible hook: `const t = useTranslations("nav"); t("login")`.
 * `t.raw("free.features")` returns the underlying value (e.g. an array).
 */
export function useTranslations(namespace?: string): Translator {
  const { messages } = useI18n();
  return useMemo(() => {
    const scope = namespace ? resolveKey(messages, namespace) : messages;
    const t = ((key: string) => {
      const value = resolveKey(scope, key);
      return typeof value === "string" ? value : key;
    }) as Translator;
    t.raw = <T = MessageValue>(key: string) => resolveKey(scope, key) as T;
    return t;
  }, [messages, namespace]);
}

export function useLocale(): Locale {
  return useI18n().locale;
}

/** Current path stripped of its locale prefix (e.g. "/privacy"). */
export function useUrlWithoutLocale(): string {
  const pageContext = usePageContext();
  const logical = (pageContext as { urlLogical?: string }).urlLogical;
  return logical ?? pageContext.urlPathname;
}

/** Build a href for the current page in a target locale. */
export function useLocalizedPath() {
  const urlWithoutLocale = useUrlWithoutLocale();
  return (locale: Locale) => localizePath(urlWithoutLocale, locale);
}

export { localizePath, defaultLocale };
export type { Locale };
