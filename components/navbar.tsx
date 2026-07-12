import { useEffect, useState } from "react";
import { navigate } from "vike/client/router";
import {
  useTranslations,
  useLocale,
  useUrlWithoutLocale,
  localizePath,
} from "@/i18n";
import { SettingsDropdown } from "@/components/settings-dropdown";
import { WaitlistDialog } from "@/components/waitlist-dialog";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const urlWithoutLocale = useUrlWithoutLocale();

  const goToPricing = () => {
    const el = document.getElementById("pricing");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      void navigate(`${localizePath("/", locale)}#pricing`);
    }
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const isHome = urlWithoutLocale === "/";

  useEffect(() => {
    if (!isHome) {
      setScrollProgress(1);
      return;
    }
    const onScroll = () => {
      const p = Math.min(1, Math.max(0, window.scrollY / 220));
      setScrollProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const bgOpacity = menuOpen ? 1 : scrollProgress;

  return (
    <>
      <nav
        className="animate-slide-down fixed top-0 left-0 right-0 z-50 border-b will-change-[background-color,backdrop-filter]"
        style={{
          backgroundColor: `color-mix(in oklab, var(--background) ${bgOpacity * 100}%, transparent)`,
          backdropFilter: `blur(${bgOpacity * 8}px)`,
          WebkitBackdropFilter: `blur(${bgOpacity * 8}px)`,
          borderBottomColor: `color-mix(in oklab, var(--border) ${bgOpacity * 100}%, transparent)`,
        }}
      >
        <div className="flex items-center justify-between px-6 py-1 sm:px-10">
          <a
            href={localizePath("/", locale)}
            className="flex items-center gap-2.5 cursor-pointer h-14 sm:h-20"
          >
            <img
              src="/sephiro-logo.svg"
              alt="Sephiro"
              width={32}
              height={32}
              className="w-6 h-auto sm:w-7"
            />
            {/* Wordmark: masked so it takes the theme foreground color
                (white on dark, dark on light) automatically. */}
            <span
              role="img"
              aria-label="Sephiro"
              className="inline-block h-10 bg-foreground sm:h-12"
              style={{
                width: "auto",
                aspectRatio: "248.25 / 75.75",
                WebkitMaskImage: "url(/sephiro-wordmark.svg)",
                maskImage: "url(/sephiro-wordmark.svg)",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "left center",
                maskPosition: "left center",
                WebkitMaskSize: "contain",
                maskSize: "contain",
              }}
            />
          </a>

          {/* Desktop */}
          <div className="hidden sm:flex items-center gap-4">
            <SettingsDropdown />
            <button
              onClick={goToPricing}
              className="text-sm text-foreground/70 transition-colors hover:text-foreground tracking-wider cursor-pointer"
            >
              {t("pricing")}
            </button>
            <Button size="sm" className="cursor-pointer text-sm" onClick={() => setDialogOpen(true)}>
              {t("login")}
            </Button>
            <Button size="sm" className="cursor-pointer text-sm bg-gradient-aurora text-white hover:opacity-90" onClick={() => setDialogOpen(true)}>
              {t("register")}
            </Button>
          </div>

          {/* Mobile: settings + hamburger */}
          <div className="sm:hidden flex items-center gap-2">
            <SettingsDropdown />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex flex-col justify-center items-center w-8 h-8 gap-1.5 cursor-pointer"
              aria-label="Menu"
            >
              <span className={`block w-5 h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`sm:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-3 px-6 pb-5 border-b border-border">
            <button
              onClick={() => {
                goToPricing();
                setMenuOpen(false);
              }}
              className="text-sm text-foreground/70 transition-colors hover:text-foreground tracking-wider cursor-pointer text-left py-2"
            >
              {t("pricing")}
            </button>
            <Button
              size="sm"
              className="cursor-pointer text-xs w-full"
              onClick={() => { setMenuOpen(false); setDialogOpen(true); }}
            >
              {t("login")}
            </Button>
            <Button
              size="sm"
              className="cursor-pointer text-xs w-full bg-gradient-aurora text-white hover:opacity-90"
              onClick={() => { setMenuOpen(false); setDialogOpen(true); }}
            >
              {t("register")}
            </Button>
          </div>
        </div>
      </nav>

      <WaitlistDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
}
