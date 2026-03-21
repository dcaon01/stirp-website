"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function PricingSection() {
  const t = useTranslations("pricing");

  const plans = [
    {
      key: "free" as const,
      highlighted: false,
    },
    {
      key: "premium" as const,
      highlighted: true,
    },
  ];

  return (
    <section id="pricing" className="relative px-6 py-24 sm:px-10 bg-background">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t("title")}
          </h2>
          <p className="mt-4 text-muted-foreground tracking-wide">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {plans.map((plan) => {
            const features = t.raw(`${plan.key}.features`) as string[];
            return (
              <div
                key={plan.key}
                className={`relative rounded-2xl border p-8 transition-all ${
                  plan.highlighted
                    ? "border-primary/50 bg-primary/5"
                    : "border-border bg-card/50"
                }`}
              >
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
                    className="w-full"
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
  );
}
