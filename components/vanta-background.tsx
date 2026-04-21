"use client";

import { useEffect, useRef, useCallback, useState } from "react";

export function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const effectRef = useRef<any>(null);
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
    const coarse = window.matchMedia("(pointer: coarse)");
    const narrow = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(coarse.matches || narrow.matches);
    update();
    coarse.addEventListener("change", update);
    narrow.addEventListener("change", update);
    return () => {
      coarse.removeEventListener("change", update);
      narrow.removeEventListener("change", update);
    };
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
    if (isMobile) {
      cleanup();
      return;
    }
    if (effectRef.current) return;

    let cancelled = false;
    let idleHandle: number | undefined;

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

    const schedule = (cb: () => void) => {
      if (typeof window === "undefined") return;
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
      cleanup();
    };
  }, [cleanup, getColors, isMobile]);

  useEffect(() => {
    if (!effectRef.current) return;
    const c = getColors();
    effectRef.current.setOptions({
      color: c.color,
      backgroundColor: c.backgroundColor,
    });
  }, [isDark, getColors]);

  const mobileGradient = isDark
    ? "radial-gradient(ellipse at 25% 20%, #9055ff 0%, #5a2fa8 30%, #2a2040 70%, #140a24 100%)"
    : "radial-gradient(ellipse at 25% 20%, #c9b3ff 0%, #e6d6ff 35%, #f5f0ff 70%, #ffffff 100%)";

  return (
    <div className="absolute inset-0 overflow-hidden">
      {isMobile ? (
        <div className="absolute inset-0" style={{ backgroundImage: mobileGradient }} />
      ) : (
        <div ref={vantaRef} className="absolute inset-0" />
      )}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: `color-mix(in oklab, var(--background) ${
            isDark ? 50 : 10
          }%, transparent)`,
          backdropFilter: isMobile ? undefined : "blur(12px)",
          WebkitBackdropFilter: isMobile ? undefined : "blur(12px)",
        }}
      />
    </div>
  );
}
