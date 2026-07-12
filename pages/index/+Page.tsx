import { useEffect, useRef } from "react";
import { ClientOnly } from "vike-react/ClientOnly";
import { useConfig } from "vike-react/useConfig";
import { useTranslations } from "@/i18n";
import { Navbar } from "@/components/navbar";
import { PricingSection } from "@/components/pricing-section";
// Static import is safe: the component's body only runs on the client
// (ClientOnly strips it server-side), and three.js/p5 are lazy-imported inside.
import VantaBackground from "@/components/vanta-background";

export default function Page() {
  const t = useTranslations("hero");
  const tf = useTranslations("footer");

  // Localized SEO description (title stays the global brand default).
  useConfig()({ description: t("subtitle") });

  const heroContentRef = useRef<HTMLDivElement>(null);
  const vantaWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const progress = Math.min(1, scrollY / (vh * 0.7));

      if (heroContentRef.current) {
        const scale = 1 - progress * 0.15;
        const opacity = 1 - progress;
        heroContentRef.current.style.transform = `scale(${scale})`;
        heroContentRef.current.style.opacity = String(opacity);
      }

      if (vantaWrapperRef.current) {
        vantaWrapperRef.current.style.opacity = String(1 - progress);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen">
      <Navbar />

      {/* Hero - sticky, stays behind pricing */}
      <div className="h-screen" />
      <section className="sticky top-0 flex h-screen items-center px-4 sm:px-6 -mt-[100vh] z-0 overflow-hidden bg-[#d5d5d5] dark:bg-transparent">
        <div ref={vantaWrapperRef} className="absolute inset-0 -z-10">
          <ClientOnly
            fallback={
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-subtle" />
              </div>
            }
          >
            <VantaBackground />
          </ClientOnly>
        </div>
        <div
          ref={heroContentRef}
          className="w-full max-w-6xl lg:mx-auto will-change-transform"
        >
          <div className="animate-slide-right flex flex-col gap-6 px-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              {t("title")}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground tracking-wide leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing - scrolls over the hero */}
      <div className="relative z-10">
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
    </div>
  );
}
