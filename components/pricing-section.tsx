"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { WaitlistDialog } from "@/components/waitlist-dialog";

export function PricingSection() {
  const t = useTranslations("pricing");
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const plans = [
    { key: "free" as const, highlighted: false },
    { key: "premiumMonthly" as const, highlighted: false },
    { key: "premiumAnnual" as const, highlighted: true },
  ];

  return (
    <>
      <section
        ref={sectionRef}
        id="pricing"
        className="relative px-6 pt-24 pb-56 sm:px-10 bg-background"
      >
        <div className="mx-auto max-w-6xl">
          <div
            className={`mb-16 text-center transition-all duration-700 ${
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {t("title")}
            </h2>
            <p className="mt-4 text-muted-foreground tracking-wide">
              {t("subtitle")}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {plans.map((plan, index) => {
              const features = t.raw(`${plan.key}.features`) as string[];
              const hasBadge = plan.key !== "free";
              return (
                <div
                  key={plan.key}
                  className={`relative rounded-2xl border p-8 transition-all duration-700 ${
                    visible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-12"
                  } ${
                    plan.highlighted
                      ? "border-primary/50 bg-primary/5"
                      : "border-border bg-card/50"
                  }`}
                  style={{
                    transitionDelay: visible ? `${(index + 1) * 150}ms` : "0ms",
                  }}
                >
                  {hasBadge && (
                    <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground tracking-wider">
                      {t(`${plan.key}.badge`)}
                    </span>
                  )}
                  <h3 className="text-xl font-bold tracking-wide">
                    {t(`${plan.key}.name`)}
                  </h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold">
                      {t(`${plan.key}.price`) === "TBD"
                        ? "TBD"
                        : `€${t(`${plan.key}.price`)}`}
                    </span>
                    {t(`${plan.key}.price`) !== "TBD" && (
                      <span className="text-muted-foreground">
                        {t(`${plan.key}.period`)}
                      </span>
                    )}
                  </div>
                  <ul className="mt-8 space-y-3">
                    {features.map((feature: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-sm tracking-wide"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-primary shrink-0"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Button
                      variant={plan.highlighted ? "default" : "outline"}
                      className="w-full cursor-pointer"
                      onClick={() => setDialogOpen(true)}
                    >
                      {t(`${plan.key}.cta`)}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <WaitlistDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
}
