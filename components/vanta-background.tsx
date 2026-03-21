"use client";

import { useEffect, useRef, useCallback } from "react";

export function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const effectRef = useRef<any>(null);

  const getColors = useCallback(() => {
    const isDark = document.documentElement.classList.contains("dark");
    return isDark
      ? { color: 0x1a0505, shininess: 35, waveHeight: 15 }
      : { color: 0xc8b5b5, shininess: 80, waveHeight: 20 };
  }, []);

  const cleanup = useCallback(() => {
    if (effectRef.current) {
      effectRef.current.destroy();
      effectRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (effectRef.current) return;

    let cancelled = false;

    async function init() {
      if (typeof window === "undefined") return;

      const p5Script = document.createElement("script");
      p5Script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
      p5Script.async = true;

      await new Promise<void>((resolve) => {
        p5Script.onload = () => resolve();
        document.head.appendChild(p5Script);
      });

      if (cancelled || !vantaRef.current) return;

      // @ts-expect-error - vanta loaded via script
      const WAVES = (await import("vanta/dist/vanta.waves.min")).default;

      if (cancelled || !vantaRef.current) return;

      effectRef.current = WAVES({
        el: vantaRef.current,
        // @ts-expect-error - THREE is global from CDN
        THREE: window.THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: getColors().color,
        shininess: getColors().shininess,
        waveHeight: getColors().waveHeight,
        waveSpeed: 0.75,
        zoom: 0.85,
      });
    }

    init();

    const observer = new MutationObserver(() => {
      if (effectRef.current) {
        const c = getColors();
        effectRef.current.setOptions({ color: c.color, shininess: c.shininess, waveHeight: c.waveHeight });
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelled = true;
      observer.disconnect();
      cleanup();
    };
  }, [cleanup, getColors]);

  return <div ref={vantaRef} className="absolute inset-0" />;
}
