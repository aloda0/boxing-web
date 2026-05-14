"use client";

import Image from "next/image";
import Link from "next/link";
import { aboutDropdown, documentationDropdown, SITE_LOGO_SRC } from "@/lib/site-nav";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";

function BurgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="text-zinc-100">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function MobileHeader() {
  const detailsRef = useRef<HTMLDetailsElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const shouldRenderPortal = typeof document !== "undefined" && menuOpen;

  const closeDetails = () => {
    setMenuOpen(false);
    detailsRef.current?.removeAttribute("open");
  };

  const onLinkClick = () => {
    closeDetails();
  };

  const leadershipHref =
    aboutDropdown.find((x) => x.label === "Руководство")?.href ??
    aboutDropdown.find((x) => x.href === "/about/leadership")?.href ??
    aboutDropdown[0]?.href ??
    "/about/leadership";

  const organizationHref =
    aboutDropdown.find((x) => x.href === "/about/organization")?.href ??
    aboutDropdown.find((x) => x.label === "Документы организации")?.href ??
    aboutDropdown[1]?.href ??
    "/about/organization";

  const aboutSubLinks = [
    { label: "Руководство", href: leadershipHref },
    { label: "Документы организации", href: organizationHref },
    { label: "Тренерский состав", href: organizationHref },
  ] as const;

  const docsSubLinks = documentationDropdown;

  const overlayMenu = (
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto px-4"
      style={{
        width: "100vw",
        height: "100dvh",
        background: "rgba(0, 0, 0, 0.96)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
      aria-label="Мобильное меню"
      role="dialog"
      aria-modal="true"
    >
      <div className="mx-auto max-w-md pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-[calc(env(safe-area-inset-top)+var(--site-header-h)+16px)]">
        <div className="mb-2 flex items-center justify-between">
          <Link
            href="/"
            className="block min-w-0 max-w-[min(60%,15rem)] shrink touch-manipulation"
            style={{ touchAction: "manipulation" }}
            aria-label="На главную"
            onClick={onLinkClick}
          >
            <span className="block max-w-full">
              <Image
                src={SITE_LOGO_SRC}
                alt=""
                width={360}
                height={120}
                priority
                unoptimized
                className="pointer-events-none h-auto max-h-8 w-auto max-w-full object-contain object-left sm:max-h-9"
              />
            </span>
          </Link>

          <button
            type="button"
            onClick={closeDetails}
            className="inline-flex h-12 w-12 items-center justify-center rounded-md text-zinc-100"
            style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
            aria-label="Закрыть меню"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="text-zinc-100">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-0">
          <Link
            href="/"
            prefetch={false}
            className="block border-b border-white/10 py-3 text-base font-medium text-zinc-100 active:bg-white/5"
            onClick={onLinkClick}
          >
            Главная
          </Link>

          <div className="border-b border-white/10 py-3 text-base font-medium text-zinc-100">
            О нас
          </div>
          <div className="flex flex-col gap-0 bg-transparent">
            {aboutSubLinks.map((item) => (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                prefetch={false}
                className="block py-2 pl-6 pr-2 text-sm font-medium text-zinc-100 active:bg-white/5"
                onClick={onLinkClick}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="border-b border-white/10 py-3 text-base font-medium text-zinc-100">
            Документация
          </div>
          <div className="flex flex-col gap-0 bg-transparent">
            {docsSubLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className="block py-2 pl-6 pr-2 text-sm font-medium text-zinc-100 active:bg-white/5"
                onClick={onLinkClick}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Link
            href="/news"
            prefetch={false}
            className="block border-b border-white/10 py-3 text-base font-medium text-zinc-100 active:bg-white/5"
            onClick={onLinkClick}
          >
            Новости
          </Link>
          <Link
            href="/broadcasts"
            prefetch={false}
            className="block border-b border-white/10 py-3 text-base font-medium text-zinc-100 active:bg-white/5"
            onClick={onLinkClick}
          >
            Трансляции
          </Link>
          <Link
            href="/museum"
            prefetch={false}
            className="block border-b border-white/10 py-3 text-base font-medium text-zinc-100 active:bg-white/5"
            onClick={onLinkClick}
          >
            Музей Югры
          </Link>
          <Link
            href="/udar-na-silu"
            prefetch={false}
            className="block border-b border-white/10 py-3 text-base font-medium text-zinc-100 active:bg-white/5"
            onClick={onLinkClick}
          >
            Удар на силу
          </Link>
          <Link
            href="/calls"
            prefetch={false}
            className="block border-b border-white/10 py-3 text-base font-medium text-zinc-100 active:bg-white/5"
            onClick={onLinkClick}
          >
            Вызовы
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="lg:hidden fixed left-0 right-0 top-0 z-[410] bg-[#0b0f16] border-b border-white/10 pt-[env(safe-area-inset-top)]">
      <div className="relative mx-auto flex h-[var(--site-header-h)] max-w-7xl items-center justify-between px-3 md:px-4">
        <Link
          href="/"
          className="block min-w-0 max-w-[min(60%,15rem)] shrink touch-manipulation"
          style={{ touchAction: "manipulation" }}
          aria-label="На главную"
        >
          <span className="block max-w-full">
            <Image
              src={SITE_LOGO_SRC}
              alt=""
              width={360}
              height={120}
              priority
              unoptimized
              className="pointer-events-none h-auto max-h-8 w-auto max-w-full object-contain object-left sm:max-h-9"
            />
          </span>
        </Link>

        <details
          ref={detailsRef}
          className="relative"
          onToggle={(e) => {
            setMenuOpen((e.currentTarget as HTMLDetailsElement).open);
          }}
        >
          <summary
            aria-label="Открыть меню"
            className="list-none [&::-webkit-details-marker]:hidden"
            style={{
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              borderRadius: 8,
            }}
          >
            <span className="pointer-events-none" aria-hidden>
              <BurgerIcon />
            </span>
          </summary>
        </details>
      </div>
      {shouldRenderPortal ? createPortal(overlayMenu, document.body) : null}
    </div>
  );
}
