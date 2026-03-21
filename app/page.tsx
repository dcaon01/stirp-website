import Image from "next/image";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function Home() {
  const t = useTranslations("home");

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <header className="animate-slide-down flex items-center justify-between px-4 py-4 sm:px-8 sm:py-6">
        <a
          href={`mailto:${t("email")}`}
          className="text-xs sm:text-sm tracking-wider text-muted-foreground transition-colors hover:text-primary"
        >
          {t("email")}
        </a>
        <LanguageSwitcher />
      </header>

      <main className="flex flex-1 items-center justify-center -mt-12 sm:-mt-16">
        <div className="flex flex-col items-center gap-5 sm:gap-8">
          <div
            className="animate-slide-down flex flex-col items-center gap-5 sm:gap-8"
            style={{ animationDelay: "0.2s" }}
          >
            <Image
              src="/stirp-logo-dark.svg"
              alt="STIRP Logo"
              width={120}
              height={230}
              className="w-20 h-auto sm:w-30"
              priority
            />
            <Image
              src="/stirp-root.svg"
              alt="STIRP"
              width={181}
              height={105}
              className="invert w-32.5 h-auto sm:w-45.25"
            />
          </div>
          <p
            className="animate-slide-up text-sm sm:text-lg tracking-widest text-muted-foreground"
            style={{ animationDelay: "0.5s" }}
          >
            {t("motto")}
          </p>
          <span
            className="animate-slide-up inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs sm:text-sm tracking-wider text-primary"
            style={{ animationDelay: "0.7s" }}
          >
            {t("comingSoon")}
          </span>
        </div>
      </main>
    </div>
  );
}
