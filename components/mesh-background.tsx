/**
 * Lightweight animated background — pure CSS, no JS engine, no libraries.
 *
 * Two blurred multi-radial gradient layers slowly counter-rotate, producing a
 * flowing colored mesh (Stripe-like) on the Sephiro palette. Only `transform`
 * animates → GPU-composited, smooth on desktop AND mobile. SSR/SSG-safe (renders
 * in the prerendered HTML, no flash), respects prefers-reduced-motion.
 */
export function MeshBackground() {
  return (
    <div className="mesh-bg">
      <div className="mesh-layer mesh-layer-a" />
      <div className="mesh-layer mesh-layer-b" />
      {/* Legibility veil for hero content (adapts to light/dark). */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor:
            "color-mix(in oklab, var(--background) 42%, transparent)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
        }}
      />
    </div>
  );
}
