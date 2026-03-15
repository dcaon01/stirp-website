import Image from "next/image";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function Home() {
  const t = useTranslations("home");

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <header className="animate-slide-down flex items-center justify-between px-8 py-6">
        <a
          href={`mailto:${t("email")}`}
          className="text-sm tracking-wider text-muted-foreground transition-colors hover:text-primary"
        >
          {t("email")}
        </a>
        <LanguageSwitcher />
      </header>

      <main className="flex flex-1 items-center justify-center -mt-16">
        <div className="flex flex-col items-center gap-8">
          <div
            className="animate-slide-down flex flex-col items-center gap-8"
            style={{ animationDelay: "0.2s" }}
          >
            <Image
              src="/stirp-logo.svg"
              alt="STIRP Logo"
              width={120}
              height={230}
              priority
            />
            <Image
              src="/stirp-write.svg"
              alt="STIRP"
              width={181}
              height={105}
              className="invert"
            />
          </div>
          <p
            className="animate-slide-up text-sm tracking-widest text-muted-foreground"
            style={{ animationDelay: "0.5s" }}
          >
            {t("motto")}
          </p>
        </div>
      </main>
    </div>
  );
}
