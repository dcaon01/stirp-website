"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { SettingsDropdown } from "@/components/settings-dropdown";
import { WaitlistDialog } from "@/components/waitlist-dialog";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const t = useTranslations("nav");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <nav className={`animate-slide-down fixed top-0 left-0 right-0 z-50 backdrop-blur-sm transition-colors duration-300 ${menuOpen ? "bg-background" : ""}`}>
        <div className="flex items-center justify-between px-6 py-3 sm:px-10 sm:py-3.5">
          <a href="/" className="flex items-center gap-3 cursor-pointer">
            <Image
              src="/stirp-logo-root.svg"
              alt="STIRP"
              width={32}
              height={32}
              className="w-5 h-auto sm:w-6"
            />
            <Image
              src="/stirp-root.svg"
              alt="STIRP"
              width={90}
              height={52}
              className="dark:invert w-16 h-auto sm:w-20"
            />
          </a>

          {/* Desktop */}
          <div className="hidden sm:flex items-center gap-4">
            <SettingsDropdown />
            <button
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground tracking-wider cursor-pointer"
            >
              {t("pricing")}
            </button>
            <Button variant="outline" size="sm" className="cursor-pointer text-sm" onClick={() => setDialogOpen(true)}>
              {t("login")}
            </Button>
            <Button size="sm" className="cursor-pointer text-sm" onClick={() => setDialogOpen(true)}>
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
                document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
                setMenuOpen(false);
              }}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground tracking-wider cursor-pointer text-left py-2"
            >
              {t("pricing")}
            </button>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer text-xs w-full"
              onClick={() => { setMenuOpen(false); setDialogOpen(true); }}
            >
              {t("login")}
            </Button>
            <Button
              size="sm"
              className="cursor-pointer text-xs w-full"
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
