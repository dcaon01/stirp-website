"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function WaitlistDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("waitlist");
  const [email, setEmail] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const backdropRef = useRef<HTMLDivElement>(null);
  const valid = isValidEmail(email);
  const canSubmit = valid && accepted;

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      setEmail("");
      setAccepted(false);
      setStatus("idle");
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  async function handleSubmit() {
    if (!canSubmit) return;
    setStatus("loading");
    try {
      const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
      if (scriptUrl) {
        await fetch(scriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <div className="relative mx-4 w-full max-w-md rounded-xl border border-border bg-background p-8 shadow-xl animate-scale-in">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <h3 className="text-xl font-bold tracking-tight">{t("successTitle")}</h3>
            <p className="text-sm text-muted-foreground tracking-wide">{t("successMessage")}</p>
            <Button onClick={onClose} className="mt-2 cursor-pointer">
              {t("close")}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-xl font-bold tracking-tight">{t("title")}</h3>
              <p className="mt-2 text-sm text-muted-foreground tracking-wide">{t("description")}</p>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSubmit) handleSubmit();
              }}
              placeholder={t("placeholder")}
              className="w-full rounded-lg border border-input bg-transparent px-4 py-2.5 text-sm tracking-wide outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/50"
              autoFocus
            />
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-primary cursor-pointer"
              />
              <span className="text-xs text-muted-foreground leading-relaxed">
                {t("privacy")}{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  className="text-primary underline underline-offset-2 hover:text-primary/80"
                >
                  {t("privacyLink")}
                </a>
              </span>
            </label>
            {status === "error" && (
              <p className="text-sm text-destructive">{t("error")}</p>
            )}
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || status === "loading"}
              className="w-full cursor-pointer bg-gradient-aurora text-white hover:opacity-90"
            >
              {status === "loading" ? t("sending") : t("submit")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
