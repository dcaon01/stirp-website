import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Animated background with two interchangeable engines so the look can be
 * compared live, plus aggressive optimizations so neither one lags:
 *
 *   • "webgl"    — Vanta NET on three.js (GPU). Smooth on desktop AND mobile.
 *   • "topology" — Vanta TOPOLOGY on p5.js (CPU canvas). Heavier; falls back
 *                  to a static gradient on mobile / low-power devices.
 *
 * Pick the default with VITE_VANTA_MODE, or override per-visit with the
 * `?vanta=webgl` / `?vanta=topology` query param.
 *
 * Optimizations (both engines):
 *   1. prefers-reduced-motion → no engine, static gradient only.
 *   2. topology on coarse-pointer / small / low-mem / low-core devices → static.
 *   3. Engine is torn down when scrolled out of view (IntersectionObserver) and
 *      when the tab is hidden (visibilitychange) → zero CPU/GPU when unseen.
 *   4. devicePixelRatio capped; mouse/touch/gyro controls off.
 *   5. Init deferred to requestIdleCallback.
 *
 * Client-only (mounted via vike-react `clientOnly`) — never runs during SSG.
 */

type VantaMode = "webgl" | "topology";
// Vanta ships no type declarations.
type VantaEffect = { destroy: () => void };

const P5_SRC = "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.1.9/p5.min.js";

// STIRP brand colors reused by both engines.
const COLORS = {
  line: { dark: 0x9055ff, light: 0x733ff9 },
  bg: { dark: 0x2a2040, light: 0xf5f0ff },
};

let p5Promise: Promise<void> | null = null;
function ensureP5(): Promise<void> {
  if ((window as unknown as { p5?: unknown }).p5) return Promise.resolve();
  if (p5Promise) return p5Promise;
  p5Promise = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = P5_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load p5.js"));
    document.head.appendChild(s);
  });
  return p5Promise;
}

// Vanta's UMD dist bundles register their factory on window.VANTA[NAME]
// (module.exports isn't the factory under Vite's ESM interop).
function getVantaFactory(name: "NET" | "TOPOLOGY") {
  const VANTA = (window as unknown as { VANTA?: Record<string, unknown> }).VANTA;
  const factory = VANTA?.[name];
  if (typeof factory !== "function") {
    throw new Error(`Vanta ${name} not available on window.VANTA`);
  }
  return factory as (opts: Record<string, unknown>) => { destroy: () => void };
}

function readMode(): VantaMode {
  try {
    const q = new URLSearchParams(window.location.search).get("vanta");
    if (q === "webgl" || q === "topology") return q;
  } catch {
    /* ignore */
  }
  return import.meta.env.VITE_VANTA_MODE === "topology" ? "topology" : "webgl";
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isLowPowerDevice(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const smallViewport = Math.min(window.innerWidth, window.innerHeight) < 640;
  const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
  const lowCores =
    typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4;
  return coarse || smallViewport || lowMemory || lowCores;
}

export default function VantaBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  const mode = useMemo(readMode, []);
  const reduced = useMemo(prefersReducedMotion, []);
  const lowPower = useMemo(isLowPowerDevice, []);
  const staticFallback = reduced || (mode === "topology" && lowPower);

  // Re-init on dark/light toggle.
  useEffect(() => {
    const update = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (staticFallback) return;
    const el = containerRef.current;
    if (!el) return;

    let effect: VantaEffect | null = null;
    let destroyed = false;
    let visible = true;
    let hidden = document.hidden;
    let creating = false;
    let failed = false;
    let idleHandle: number | undefined;

    const wantRun = () => visible && !hidden && !destroyed;

    async function build(): Promise<VantaEffect | null> {
      const dpr = window.devicePixelRatio || 1;
      if (mode === "topology") {
        await ensureP5();
        if (!wantRun()) return null;
        // Importing the dist bundle registers the effect on window.VANTA.
        await import("vanta/dist/vanta.topology.min");
        if (!wantRun()) return null;
        const TOPOLOGY = getVantaFactory("TOPOLOGY");
        return TOPOLOGY({
          el,
          p5: (window as unknown as { p5: unknown }).p5,
          mouseControls: false,
          touchControls: false,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: Math.min(dpr, 1),
          scaleMobile: 1,
          color: isDark ? COLORS.line.dark : COLORS.line.light,
          backgroundColor: isDark ? COLORS.bg.dark : COLORS.bg.light,
        }) as VantaEffect;
      }
      // webgl (three.js) — Vanta NET (uses modern BufferGeometry, three-compatible)
      const THREE = await import("three");
      if (!wantRun()) return null;
      await import("vanta/dist/vanta.net.min");
      if (!wantRun()) return null;
      const NET = getVantaFactory("NET");
      return NET({
        el,
        THREE,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: Math.min(dpr, 1.5),
        scaleMobile: 1,
        color: isDark ? COLORS.line.dark : COLORS.line.light,
        backgroundColor: isDark ? COLORS.bg.dark : COLORS.bg.light,
        points: lowPower ? 6.0 : 10.0,
        maxDistance: 22.0,
        spacing: 18.0,
        showDots: true,
      }) as VantaEffect;
    }

    async function create() {
      if (effect || creating || failed || !wantRun()) return;
      creating = true;
      try {
        const built = await build();
        if (!built) return;
        if (!wantRun()) {
          try {
            built.destroy();
          } catch {
            /* ignore */
          }
          return;
        }
        effect = built;
      } catch (err) {
        // Engine failed to init (e.g. WebGL unavailable). Don't crash — the
        // static gradient backdrop underneath stays visible.
        failed = true;
        if (import.meta.env.DEV) console.warn("Vanta init failed:", err);
      } finally {
        creating = false;
        // A visibility change may have landed mid-build; reconcile.
        reconcile();
      }
    }

    function teardown() {
      if (effect) {
        try {
          effect.destroy();
        } catch {
          /* ignore */
        }
        effect = null;
      }
    }

    function schedule() {
      const ric = (
        window as typeof window & {
          requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
        }
      ).requestIdleCallback;
      idleHandle = ric
        ? ric(() => create(), { timeout: 400 })
        : window.setTimeout(() => create(), 0);
    }

    function reconcile() {
      if (destroyed || failed) return;
      if (wantRun()) {
        if (!effect && !creating && idleHandle === undefined) schedule();
      } else {
        if (idleHandle !== undefined) {
          cancelIdle(idleHandle);
          idleHandle = undefined;
        }
        teardown();
      }
    }

    function cancelIdle(handle: number) {
      const cic = (
        window as typeof window & { cancelIdleCallback?: (h: number) => void }
      ).cancelIdleCallback;
      if (cic) cic(handle);
      else clearTimeout(handle);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        reconcile();
      },
      { threshold: 0 },
    );
    io.observe(el);

    const onVisibility = () => {
      hidden = document.hidden;
      reconcile();
    };
    document.addEventListener("visibilitychange", onVisibility);

    reconcile();

    return () => {
      destroyed = true;
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (idleHandle !== undefined) cancelIdle(idleHandle);
      teardown();
    };
  }, [isDark, mode, staticFallback, lowPower]);

  // Static fallback: brand gradient, no engine.
  if (staticFallback) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-subtle" />
        <div className="absolute inset-0 bg-gradient-glow" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sits under the canvas so there's a branded backdrop before init. */}
      <div className="absolute inset-0 bg-gradient-subtle" />
      <div ref={containerRef} className="absolute inset-0" />
      {/* Soft blur veil for legibility of hero content. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: `color-mix(in oklab, var(--background) ${
            isDark ? 50 : 10
          }%, transparent)`,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      />
    </div>
  );
}
