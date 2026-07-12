import { useState, useRef, useEffect } from "react";
import { navigate } from "vike/client/router";
import { useLocale, useLocalizedPath, type Locale } from "@/i18n";

const localeOptions: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "it", label: "Italiano" },
];

export function SettingsDropdown() {
  const locale = useLocale();
  const localizedPath = useLocalizedPath();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function switchLocale(newLocale: Locale) {
    if (newLocale === locale) {
      setOpen(false);
      return;
    }
    setOpen(false);
    void navigate(localizedPath(newLocale));
  }

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    document.cookie = `theme=${next ? "dark" : "light"};path=/;max-age=31536000`;
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-8 h-8 rounded-lg text-foreground/70 transition-colors hover:text-foreground cursor-pointer"
        aria-label="Settings"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-popover p-2 shadow-lg animate-scale-in origin-top-right">
          {/* Language */}
          <p className="px-2 py-1 text-xs text-muted-foreground tracking-wider uppercase">
            Language
          </p>
          {localeOptions.map((l) => (
            <button
              key={l.code}
              onClick={() => switchLocale(l.code)}
              className={`w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors cursor-pointer ${
                l.code === locale
                  ? "text-primary bg-primary/10"
                  : "text-popover-foreground hover:bg-muted"
              }`}
            >
              {l.label}
            </button>
          ))}

          {/* Divider */}
          <div className="my-2 border-t border-border" />

          {/* Theme */}
          <p className="px-2 py-1 text-xs text-muted-foreground tracking-wider uppercase">
            Theme
          </p>
          <button
            onClick={toggleTheme}
            className="w-full rounded-lg px-3 py-1.5 text-left text-sm text-popover-foreground transition-colors hover:bg-muted cursor-pointer flex items-center gap-2"
          >
            {dark ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
                Light
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                Dark
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
