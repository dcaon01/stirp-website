import { usePageContext } from "vike-react/usePageContext";
import {
  defaultLocale,
  localizePath,
  locales,
  type Locale,
} from "@/i18n/locales";

const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://sephiro.app").replace(
  /\/$/,
  "",
);

// Runs synchronously in <head> before paint & hydration: applies the saved
// theme (default dark) so light-mode users never see a dark flash.
const THEME_FOUC_SCRIPT = `try{var m=document.cookie.match(/(?:^|; )theme=([^;]+)/);var light=m&&decodeURIComponent(m[1])==='light';document.documentElement.classList.toggle('dark',!light);}catch(e){document.documentElement.classList.add('dark');}`;

export default function Head() {
  const pageContext = usePageContext();
  const locale = ((pageContext as { locale?: Locale }).locale ??
    defaultLocale) as Locale;
  const urlLogical =
    (pageContext as { urlLogical?: string }).urlLogical ??
    pageContext.urlPathname;
  const canonical = SITE_URL + localizePath(urlLogical, locale);

  return (
    <>
      {/* Apply theme before first paint (anti-FOUC). */}
      <script dangerouslySetInnerHTML={{ __html: THEME_FOUC_SCRIPT }} />

      {/* Favicons */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;500;600;700&display=swap"
      />

      {/* Canonical + hreflang alternates */}
      <link rel="canonical" href={canonical} />
      {locales.map((l) => (
        <link
          key={l}
          rel="alternate"
          hrefLang={l}
          href={SITE_URL + localizePath(urlLogical, l)}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={SITE_URL + localizePath(urlLogical, defaultLocale)}
      />

      {/* Open Graph / Twitter defaults */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Sephiro" />
      <meta property="og:url" content={canonical} />
      <meta
        property="og:locale"
        content={locale === "it" ? "it_IT" : "en_US"}
      />
      <meta property="og:image" content={`${SITE_URL}/sephiro-logo.png`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:image" content={`${SITE_URL}/sephiro-logo.png`} />
    </>
  );
}
