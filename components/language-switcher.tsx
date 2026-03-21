"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const locales = [
  { code: "it", label: "Italiano" },
  { code: "en", label: "English" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function switchLocale(newLocale: string) {
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
    setOpen(false);
    router.refresh();
  }

  const current = locales.find((l) => l.code === locale) ?? locales[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-muted cursor-pointer"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        {current.code.toUpperCase()}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 min-w-30 rounded-lg border border-border bg-popover p-1 shadow-md">
          {locales.map((l) => (
            <button
              key={l.code}
              onClick={() => switchLocale(l.code)}
              className={`w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors cursor-pointer ${
                l.code === locale
                  ? "text-primary bg-primary/10"
                  : "text-popover-foreground hover:bg-muted"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
