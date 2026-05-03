"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

function clampNumber(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return n;
}

export function PearLayer() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const rafRef = useRef<number | null>(null);
  const elRef = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<{ top?: number }>({});

  const layerBaseStyle = useMemo(() => {
    const s: CSSProperties = {};
    if (typeof style.top === "number") s.top = style.top;
    return s;
  }, [style.top]);

  useEffect(() => {
    const heroEl = document.getElementById("home-hero");

    function computeAndSet() {
      const pearRect = elRef.current?.getBoundingClientRect();
      const pearHeight = pearRect?.height ?? 0;

      const cssAnchor = elRef.current
        ? Number.parseFloat(getComputedStyle(elRef.current).getPropertyValue("--pear-anchor"))
        : NaN;
      const anchorRatio = Number.isFinite(cssAnchor) ? Math.min(0.95, Math.max(0.05, cssAnchor)) : 0.24;
      const attachOffset = pearHeight > 0 ? pearHeight * anchorRatio : 0;

      const cssY = elRef.current
        ? Number.parseFloat(getComputedStyle(elRef.current).getPropertyValue("--pear-y"))
        : NaN;
      const yOffset = Number.isFinite(cssY) ? cssY : 0;

      const stickyTop = -attachOffset + yOffset;

      if (!isHome || !heroEl) {
        setStyle({ top: clampNumber(stickyTop) });
        return;
      }

      const heroRect = heroEl.getBoundingClientRect();
      const heroBottom = heroRect.bottom;

      const desiredTop = heroBottom - attachOffset + yOffset;
      const clampTop = stickyTop;
      const top = Math.max(clampTop, desiredTop);
      setStyle({ top: clampNumber(top) });
    }

    function schedule() {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        computeAndSet();
      });
    }

    computeAndSet();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    const ro = new ResizeObserver(schedule);
    if (heroEl) ro.observe(heroEl);
    if (elRef.current) ro.observe(elRef.current);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isHome]);

  return (
    <div
      ref={elRef}
      className="pear-layer bg-pear-left pointer-events-none fixed z-[-1]"
      aria-hidden
      style={layerBaseStyle}
    />
  );
}
