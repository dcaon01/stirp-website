"use client";

import { useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    let cancelled = false;
    let idleHandle: number | undefined;

    async function init() {
      if (typeof window === "undefined" || effectRef.current) return;

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

      const dark = document.documentElement.classList.contains("dark");
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
        color: dark ? 0x9055ff : 0x733ff9,
        backgroundColor: dark ? 0x2a2040 : 0xf5f0ff,
      });
    }

    const schedule = (cb: () => void) => {
      const ric = (
        window as typeof window & {
          requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        }
      ).requestIdleCallback;
      if (ric) {
        idleHandle = ric(cb, { timeout: 400 });
      } else {
        idleHandle = window.setTimeout(cb, 0);
      }
    };
    schedule(() => {
      if (!cancelled) init();
    });

    return () => {
      cancelled = true;
      if (idleHandle !== undefined) {
        const cic = (
          window as typeof window & {
            cancelIdleCallback?: (h: number) => void;
          }
        ).cancelIdleCallback;
        if (cic) cic(idleHandle);
        else clearTimeout(idleHandle);
      }
      if (effectRef.current) {
        effectRef.current.destroy();
        effectRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!effectRef.current) return;
    effectRef.current.setOptions({
      color: isDark ? 0x9055ff : 0x733ff9,
      backgroundColor: isDark ? 0x2a2040 : 0xf5f0ff,
    });
  }, [isDark]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div ref={vantaRef} className="absolute inset-0" />
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
