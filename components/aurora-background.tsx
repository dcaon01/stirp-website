/**
 * Lightweight animated background — pure CSS, no JS engine, no libraries.
 *
 * Three large blurred brand-color blobs drift slowly (aurora look). Only
 * transform/opacity animate, so it's GPU-composited and smooth on desktop
 * AND mobile. Respects prefers-reduced-motion (blobs freeze). SSR/SSG-safe,
 * so it can render in the prerendered HTML with no flash.
 *
 * Replaces the previous Vanta (three.js/p5) background: ~0 KB of JS vs ~600 KB.
 */
export function AuroraBackground() {
  return (
    <div className="aurora">
      {/* Base brand tint */}
      <div className="absolute inset-0 bg-gradient-subtle" />

      {/* Drifting aurora blobs */}
      <div className="aurora-blob aurora-blob-a" />
      <div className="aurora-blob aurora-blob-b" />
      <div className="aurora-blob aurora-blob-c" />

      {/* Legibility veil for hero content */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor:
            "color-mix(in oklab, var(--background) 35%, transparent)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      />
    </div>
  );
}
