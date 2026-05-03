"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

function clampNumber(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return n;
}

export function GlovesLayer() {
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
      const glovesRect = elRef.current?.getBoundingClientRect();
      const glovesHeight = glovesRect?.height ?? 0;

      const cssAnchor = elRef.current
        ? Number.parseFloat(getComputedStyle(elRef.current).getPropertyValue("--gloves-anchor"))
        : NaN;
      const anchorRatio = Number.isFinite(cssAnchor) ? Math.min(0.95, Math.max(0.05, cssAnchor)) : 0.24;
      const attachOffset = glovesHeight > 0 ? glovesHeight * anchorRatio : 0;

      const cssY = elRef.current
        ? Number.parseFloat(getComputedStyle(elRef.current).getPropertyValue("--gloves-y"))
        : NaN;
      const yOffset = Number.isFinite(cssY) ? cssY : 0;

      // Final (post-hero) anchor point is the very top of the viewport,
      // not the header/navigation line.
      // The laces point (anchor) should meet the top edge:
      // elementTop + attachOffset - yOffset == 0  =>  elementTop == -attachOffset + yOffset
      const stickyTop = -attachOffset + yOffset;

      if (!isHome || !heroEl) {
        setStyle({ top: clampNumber(stickyTop) });
        return;
      }

      const heroRect = heroEl.getBoundingClientRect();
      const heroBottom = heroRect.bottom;

      // Continuous anchoring:
      // - attach to hero bottom using a geometry-based offset (not a magic px):
      //   The PNG doesn't fill the whole container, so we anchor using a fraction
      //   of the measured gloves container height.
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
      className="gloves-layer bg-gloves-right pointer-events-none fixed z-[-1]"
      aria-hidden
      style={layerBaseStyle}
    />
  );
}

