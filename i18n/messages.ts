import en from "@/messages/en.json";
import it from "@/messages/it.json";
import type { Locale } from "./locales";

// Static imports so both locale bundles are available at prerender time
// (no async in SSG).
export const messages = { en, it } as const;

export type Messages = typeof en;

export function getMessages(locale: Locale): Messages {
  return messages[locale] as Messages;
}
