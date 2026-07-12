import { useConfig } from "vike-react/useConfig";
import { useTranslations } from "@/i18n";
import { Navbar } from "@/components/navbar";

export default function Page() {
  const t = useTranslations("privacy");
  const tf = useTranslations("footer");

  useConfig()({
    title: `${t("title")} | STIRP`,
    description:
      "Privacy Policy for STIRP — Learn how we handle your data when you join our waitlist.",
  });

  const sections = t.raw<{ title: string; content: string }[]>("sections");

  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pt-36 pb-20 sm:px-10 sm:pt-40">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground mb-12">
          {t("lastUpdated")}
        </p>

        <div className="flex flex-col gap-10">
          {sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-lg font-bold tracking-tight mb-3">
                {section.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed tracking-wide whitespace-pre-line">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-border bg-background px-6 py-8 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <a
            href={`mailto:${tf("email")}`}
            className="cursor-pointer text-sm text-muted-foreground tracking-wider transition-colors hover:text-primary"
          >
            {tf("email")}
          </a>
          <p className="text-sm text-muted-foreground tracking-wider">
            &copy; {new Date().getFullYear()} STIRP. {tf("rights")}
          </p>
        </div>
      </footer>
    </div>
  );
}
