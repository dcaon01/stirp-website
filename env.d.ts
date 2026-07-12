/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Apps Script endpoint for the waitlist form (POST email). */
  readonly VITE_GOOGLE_SCRIPT_URL?: string;
  /** Canonical site origin, e.g. https://sephiro.app */
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
