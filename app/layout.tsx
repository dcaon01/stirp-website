import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { cookies } from "next/headers";
import { Comfortaa } from "next/font/google";

import "./globals.css";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  variable: "--font-comfortaa",
});

import type { Metadata } from "next";

const siteUrl = "https://stirp.it";

export const metadata: Metadata = {
  title: {
    default: "STIRP — Software Design Tool",
    template: "%s | STIRP",
  },
  description:
    "STIRP is a software design tool for creating UML diagrams, ER diagrams, flowcharts, request-response diagrams, graph database schemas, and more. Design at your rules.",
  keywords: [
    "software design tool",
    "UML diagram",
    "ER diagram",
    "flowchart",
    "request response diagram",
    "graph database diagram",
    "software architecture",
    "diagram maker",
    "STIRP",
    "strumento di progettazione software",
    "diagramma UML",
    "diagramma ER",
    "diagramma di flusso",
  ],
  authors: [{ name: "STIRP" }],
  creator: "STIRP",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "it_IT",
    url: siteUrl,
    siteName: "STIRP",
    title: "STIRP — Software Design Tool",
    description:
      "Create UML diagrams, ER diagrams, flowcharts, and more. Design at your rules.",
    images: [
      {
        url: "/strip-logo-png.png",
        width: 512,
        height: 512,
        alt: "STIRP Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "STIRP — Software Design Tool",
    description:
      "Create UML diagrams, ER diagrams, flowcharts, and more. Design at your rules.",
    images: ["/strip-logo-png.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const theme = (await cookies()).get("theme")?.value;
  const themeClass = theme === "light" ? "" : "dark";

  return (
    <html lang={locale} className={`${themeClass} ${comfortaa.variable}`.trim()}>
      <head>
        <link
          rel="preload"
          as="script"
          href="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.1.9/p5.min.js"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
