"use client";

import { useEffect, useRef, useCallback } from "react";

export function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const effectRef = useRef<any>(null);

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
        color: 0x0a0003,
        shininess: 35.0,
        waveHeight: 15.0,
        waveSpeed: 0.75,
        zoom: 0.85,
      });
    }

    init();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [cleanup]);

  return <div ref={vantaRef} className="fixed inset-0 -z-10" />;
}
