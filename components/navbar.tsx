"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { SettingsDropdown } from "@/components/settings-dropdown";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const t = useTranslations("nav");

  return (
    <nav className="animate-slide-down fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 sm:px-10 sm:py-3.5 backdrop-blur-sm">
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

      <div className="flex items-center gap-2 sm:gap-4">
        <SettingsDropdown />
        <button
          onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
          className="hidden sm:block text-sm text-muted-foreground transition-colors hover:text-foreground tracking-wider cursor-pointer"
        >
          {t("pricing")}
        </button>
        <Button variant="outline" size="sm" className="cursor-pointer text-xs sm:text-sm">
          {t("login")}
        </Button>
        <Button size="sm" className="cursor-pointer text-xs sm:text-sm">
          {t("register")}
        </Button>
      </div>
    </nav>
  );
}
