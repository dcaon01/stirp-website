"use client";

import { useEffect, useRef, useCallback, useState } from "react";

export function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const effectRef = useRef<any>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const update = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const getColors = useCallback(
    () =>
      isDark
        ? { color: 0x9055ff, backgroundColor: 0x2a2040 }
        : { color: 0x733ff9, backgroundColor: 0xf5f0ff },
    [isDark]
  );

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
        "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.1.9/p5.min.js";
      p5Script.async = true;

      await new Promise<void>((resolve) => {
        p5Script.onload = () => resolve();
        document.head.appendChild(p5Script);
      });

      if (cancelled || !vantaRef.current) return;

      // @ts-expect-error - vanta loaded via script
      const TOPOLOGY = (await import("vanta/dist/vanta.topology.min")).default;

      if (cancelled || !vantaRef.current) return;

      const c = getColors();
      effectRef.current = TOPOLOGY({
        el: vantaRef.current,
        // @ts-expect-error - p5 is global from CDN
        p5: window.p5,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: c.color,
        backgroundColor: c.backgroundColor,
      });
    }

    init();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [cleanup, getColors]);

  useEffect(() => {
    if (!effectRef.current) return;
    const c = getColors();
    effectRef.current.setOptions({
      color: c.color,
      backgroundColor: c.backgroundColor,
    });
  }, [isDark, getColors]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        ref={vantaRef}
        className="absolute -inset-8 blur-md"
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: `color-mix(in oklab, var(--background) ${
            isDark ? 50 : 10
          }%, transparent)`,
        }}
      />
    </div>
  );
}
