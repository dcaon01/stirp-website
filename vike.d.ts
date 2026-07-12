import type { Locale } from "@/i18n/locales";

// Augment Vike's pageContext with our custom i18n props.
declare global {
  namespace Vike {
    interface PageContext {
      locale?: Locale;
      urlLogical?: string;
    }
  }
}

export {};
