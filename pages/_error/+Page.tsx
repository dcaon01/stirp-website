import { usePageContext } from "vike-react/usePageContext";
import { useLocale, localizePath } from "@/i18n";

export default function Page() {
  const { is404 } = usePageContext();
  const locale = useLocale();
  const home = localizePath("/", locale);

  const is_it = locale === "it";
  const title = is404
    ? is_it
      ? "Pagina non trovata"
      : "Page not found"
    : is_it
      ? "Errore interno"
      : "Internal error";
  const message = is404
    ? is_it
      ? "La pagina che cerchi non esiste."
      : "This page could not be found."
    : is_it
      ? "Qualcosa è andato storto."
      : "Something went wrong.";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <p className="text-6xl font-bold text-gradient-brand">
        {is404 ? "404" : "500"}
      </p>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground tracking-wide">{message}</p>
      <a
        href={home}
        className="mt-2 text-sm text-primary underline underline-offset-4 hover:text-primary/80"
      >
        {is_it ? "Torna alla home" : "Back to home"}
      </a>
    </div>
  );
}
