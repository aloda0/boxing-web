"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  aboutDropdown,
  documentationDropdown,
  groupActive,
  pathMatches,
  SITE_LOGO_SRC,
} from "@/lib/site-nav";

function desktopLinkClass(active: boolean) {
  return [
    "inline-flex shrink-0 items-center whitespace-nowrap border-b-2 pb-2 pt-2.5 text-[16px] font-medium leading-tight tracking-tight transition-colors lg:text-[17px]",
    active
      ? "border-[#C62828] text-[#F5F7FA]"
      : "border-transparent text-[#E7ECF3] hover:border-[#E03A3A]/70 hover:text-white",
  ].join(" ");
}

const dropdownPanelClass = "hero-glass-panel min-w-[15rem] overflow-hidden rounded-2xl p-4";

const dropdownPanelOpenClass =
  "origin-top opacity-100 transition-[opacity,transform] duration-200 ease-out";

const dropdownItemClass =
  "block rounded-lg bg-transparent px-3 py-2.5 text-left text-[16px] font-medium text-[#F5F7FA] transition-colors hover:bg-white/[0.12] lg:text-[17px]";

function DesktopDropdown({
  label,
  items,
  active,
}: {
  label: string;
  items: readonly { href: string; label: string }[];
  active: boolean;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    },
    [],
  );

  const cancelClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 180);
  };

  const openMenu = () => {
    cancelClose();
    setOpen(true);
  };

  return (
    <div className="relative inline-block w-max shrink-0" onMouseLeave={scheduleClose}>
      <button
        type="button"
        className={desktopLinkClass(active)}
        aria-expanded={open}
        aria-haspopup="true"
        onMouseEnter={openMenu}
      >
        {label}
      </button>
      {open ? (
        <div
          className="absolute left-0 top-full z-[60] -mt-2 pt-2"
          role="menu"
          aria-label={label}
          onMouseEnter={cancelClose}
        >
          <div className={`${dropdownPanelClass} ${dropdownPanelOpenClass} header-dropdown-panel`}>
            {items.map((item) => (
              <Link
                key={`${item.href}::${item.label}`}
                href={item.href}
                prefetch={false}
                className={dropdownItemClass}
                role="menuitem"
                onClick={() => {
                  cancelClose();
                  setOpen(false);
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function DesktopHeader() {
  const pathname = usePathname();
  const aboutActive = groupActive(pathname, aboutDropdown);
  const docsNavActive = groupActive(pathname, documentationDropdown);

  return (
    <div className="hidden lg:block">
      <div className="relative z-10 w-full min-h-[var(--site-header-h)]">
        <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-2 rounded-2xl border-b border-l border-r border-white/12 bg-black/10 py-1.5 pl-3 pr-3 backdrop-blur-sm sm:gap-x-3 sm:pl-4 sm:pr-4 sm:py-2 lg:gap-x-4 lg:pl-5 lg:pr-5 lg:py-2">
          <div className="flex min-w-0 items-center justify-self-start self-center py-0.5">
            <Link
              href="/"
              className="group inline-flex max-w-full min-w-0 shrink-0 items-center"
              aria-label="На главную"
            >
              <span className="inline-flex max-w-full items-center justify-start">
                <Image
                  src={SITE_LOGO_SRC}
                  alt=""
                  width={360}
                  height={120}
                  priority
                  unoptimized
                  className="h-[3.96rem] w-auto max-h-[4.2rem] max-w-[min(100%,19.2rem)] object-contain object-left xl:h-[4.32rem] xl:max-h-[4.5rem]"
                />
              </span>
            </Link>
          </div>

          <nav
            className="flex min-w-0 shrink-0 flex-nowrap items-center justify-center justify-self-center gap-x-[1.125rem]"
            aria-label="Основное меню"
          >
            <Link prefetch={false} href="/" className={desktopLinkClass(pathMatches(pathname, "/"))}>
              Главная
            </Link>
            <DesktopDropdown label="О нас" items={aboutDropdown} active={aboutActive} />
            <DesktopDropdown label="Документация" items={documentationDropdown} active={docsNavActive} />
            <Link prefetch={false} href="/news" className={desktopLinkClass(pathMatches(pathname, "/news"))}>
              Новости
            </Link>
            <Link prefetch={false} href="/museum" className={desktopLinkClass(pathMatches(pathname, "/museum"))}>
              Музей Югры
            </Link>
            <Link
              prefetch={false}
              href="/udar-na-silu"
              className={desktopLinkClass(pathMatches(pathname, "/udar-na-silu"))}
            >
              Удар на силу
            </Link>
          </nav>
          <div className="min-w-0" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
