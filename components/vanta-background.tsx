"use client";

import { useEffect, useRef, useCallback } from "react";

export function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const effectRef = useRef<any>(null);

  const getColor = useCallback(() => {
    const isDark = document.documentElement.classList.contains("dark");
    return isDark ? 0x1a0505 : 0xf5f0f0;
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
        color: getColor(),
        shininess: 35.0,
        waveHeight: 15.0,
        waveSpeed: 0.75,
        zoom: 0.85,
      });
    }

    init();

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      if (effectRef.current) {
        effectRef.current.setOptions({ color: getColor() });
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Fade out on scroll
    function handleScroll() {
      if (!vantaRef.current) return;
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const opacity = Math.max(0, 1 - scrollY / (vh * 0.6));
      vantaRef.current.style.opacity = String(opacity);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      cleanup();
    };
  }, [cleanup, getColor]);

  return (
    <div
      ref={vantaRef}
      className="absolute inset-0 -z-10 transition-opacity duration-100"
      style={{ height: "100vh" }}
    />
  );
}
