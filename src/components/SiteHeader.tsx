"use client";

import { usePathname } from "next/navigation";
import { DesktopHeader } from "@/components/header/DesktopHeader";
import { MobileHeader } from "@/components/header/MobileHeader";

/**
 * Составная шапка: `MobileHeader` только &lt; lg, `DesktopHeader` только lg+.
 * Разметка и стили desktop не смешиваются с mobile.
 */
export function SiteHeader() {
  const pathname = usePathname();

  if (pathname?.startsWith("/studio")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-[400] border-0 bg-transparent shadow-none backdrop-blur-none before:hidden after:hidden">
      <MobileHeader />
      <DesktopHeader />
    </header>
  );
}
