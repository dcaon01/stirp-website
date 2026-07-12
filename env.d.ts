/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Apps Script endpoint for the waitlist form (POST email). */
  readonly VITE_GOOGLE_SCRIPT_URL?: string;
  /** Canonical site origin, e.g. https://stirp.it */
  readonly VITE_SITE_URL?: string;
  /** Default Vanta background variant: "webgl" (three.js/GPU) | "topology" (p5/CPU). */
  readonly VITE_VANTA_MODE?: "webgl" | "topology";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
