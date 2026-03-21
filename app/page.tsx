"use client";

import { useTranslations } from "next-intl";
import { Navbar } from "@/components/navbar";
import { PricingSection } from "@/components/pricing-section";
import { VantaBackground } from "@/components/vanta-background";

export default function Home() {
  const t = useTranslations("hero");
  const tf = useTranslations("footer");

  return (
    <div className="relative min-h-screen">
      <Navbar />

      {/* Hero with Vanta */}
      <section className="relative flex min-h-screen items-center px-4 pt-20 sm:px-6">
        <VantaBackground />
        <div className="w-full max-w-6xl lg:mx-auto">
          <div className="animate-slide-right flex flex-col gap-6 px-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              {t("title")}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground tracking-wide leading-relaxed">
              {t("subtitle")}
            </p>
            <span
              className="animate-slide-up inline-block w-fit rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs sm:text-sm tracking-wider text-primary"
              style={{ animationDelay: "0.5s" }}
            >
              {t("comingSoon")}
            </span>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <PricingSection />

      {/* Footer */}
      <footer className="border-t border-border bg-background px-6 py-8 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <a
            href={`mailto:${tf("email")}`}
            className="cursor-pointer text-sm text-muted-foreground tracking-wider transition-colors hover:text-primary"
          >
            {tf("email")}
          </a>
          <p className="text-sm text-muted-foreground tracking-wider">
            &copy; {new Date().getFullYear()} STIRP. {tf("rights")}
          </p>
        </div>
      </footer>
    </div>
  );
}
