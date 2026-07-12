import type { Config } from "vike/types";
import vikeReact from "vike-react/config";

// Global default config (pages can override title/description/lang).
// https://vike.dev/config
const config: Config = {
  title: "Sephiro | Software Design Tool",
  description:
    "Sephiro is a software design tool for creating UML diagrams, ER diagrams, flowcharts, request-response diagrams, graph database schemas, and more. Design at your rules.",

  // Static-generate every page to HTML (deploy anywhere: S3/CDN/static host).
  // https://vike.dev/prerender
  prerender: true,

  // Expose locale info (set in +onBeforeRoute) to the client runtime.
  passToClient: ["locale", "urlLogical"],

  lang: "en",

  extends: [vikeReact],
};

export default config;
