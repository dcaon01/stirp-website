"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  function switchLocale(newLocale: string) {
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1 text-sm tracking-wider">
      <button
        onClick={() => switchLocale("it")}
        className={`px-2 py-1 transition-colors cursor-pointer ${
          locale === "it"
            ? "text-primary font-bold"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        IT
      </button>
      <span className="text-muted-foreground">/</span>
      <button
        onClick={() => switchLocale("en")}
        className={`px-2 py-1 transition-colors cursor-pointer ${
          locale === "en"
            ? "text-primary font-bold"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
    </div>
  );
}
