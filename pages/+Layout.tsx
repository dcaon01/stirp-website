import "./Layout.css";

import { useConfig } from "vike-react/useConfig";
import { usePageContext } from "vike-react/usePageContext";
import { I18nProvider } from "@/i18n";
import { defaultLocale, type Locale } from "@/i18n/locales";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pageContext = usePageContext();
  const locale = ((pageContext as { locale?: Locale }).locale ??
    defaultLocale) as Locale;

  // Set <html lang> per request/locale.
  const config = useConfig();
  config({ lang: locale });

  return <I18nProvider>{children}</I18nProvider>;
}
