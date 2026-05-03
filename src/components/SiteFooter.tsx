"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isSanityConfigured } from "@/sanity/client";

const footerNav = [
  { href: "/news", label: "Новости" },
  { href: "/calendar", label: "Календарный план" },
  { href: "/team", label: "Сборная команда" },
  { href: "/results", label: "Результаты" },
  { href: "/regulations", label: "Положения" },
  { href: "/reports", label: "Отчеты" },
  { href: "/calls", label: "Вызовы" },
];

/** Заглушки — замените на реальные ссылки при появлении страниц в соцсетях */
const socialLinks = [
  { label: "Telegram", href: "https://t.me/" },
  { label: "VK", href: "https://vk.com/" },
];

/** Плейсхолдеры контактов — уточните и замените на актуальные */
const contacts = {
  phone: "+7 (346) 000-00-00",
  phoneHref: "tel:+73460000000",
  email: "boxinghmao@mail.ru",
  emailHref: "mailto:boxinghmao@mail.ru",
  address:
    "Ханты-Мансийский автономный округ Югра, город Ханты-Мансийск, улица Павла-Моденцова, 2, третий этаж.",
};

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname?.startsWith("/studio")) {
    return null;
  }

  return (
    <footer className="relative mt-auto border-t divider-soft bg-[linear-gradient(180deg,rgba(250,246,236,0.96),rgba(242,236,223,0.96))] py-14 backdrop-blur-xl">
      <div
        className="pointer-events-none absolute top-1/2 left-0 z-0 -translate-y-1/2 select-none"
        aria-hidden
      >
        <Image
          src="/images/footer-crest-yugra.png"
          alt=""
          width={1024}
          height={1536}
          sizes="(max-width:640px) 280px,(max-width:1024px) 320px,400px"
          className="block h-auto w-auto max-w-none max-h-[min(360px,48vh)] object-contain object-left-bottom opacity-[0.14] [filter:grayscale(0.35)_brightness(0.93)_contrast(0.98)] sm:max-h-[min(390px,50vh)] lg:max-h-[min(420px,52vh)]"
        />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl items-start gap-12 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10 lg:px-6">
        <div className="m-0 p-0 pt-0 sm:col-span-2 lg:col-span-1 lg:col-start-1 lg:row-start-1">
          <p className="m-0 max-w-sm text-sm leading-snug text-[#1f2937] uppercase">
            РЕГИОНАЛЬНАЯ ОБЩЕСТВЕННАЯ ОРГАНИЗАЦИЯ ХАНТЫ-МАНСИЙСКОГО АВТОНОМНОГО ОКРУГА ЮГРЫ
          </p>
        </div>

        <div className="m-0 p-0 pt-0 lg:col-start-2 lg:row-start-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#111827]">Контакты</p>
          <ul className="mt-4 space-y-3 text-sm text-[#111827]">
            <li>
              <a href={contacts.phoneHref} className="transition hover:text-black/80">
                {contacts.phone}
              </a>
            </li>
            <li>
              <a href={contacts.emailHref} className="transition hover:text-black/80">
                {contacts.email}
              </a>
            </li>
            <li className="text-[#1f2937]">{contacts.address}</li>
          </ul>
        </div>

        <div className="m-0 p-0 pt-0 lg:col-start-3 lg:row-start-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#111827]">Социальные сети</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {socialLinks.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#111827] transition hover:text-black/80"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="m-0 p-0 pt-0 lg:col-start-4 lg:row-start-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#111827]">Навигация</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-[#111827] transition hover:text-black/80">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-12 max-w-6xl border-t divider-soft px-4 pt-8 text-center text-xs text-[#111827] lg:px-6">
        <p>© {new Date().getFullYear()} Федерация бокса Югры</p>
        {!isSanityConfigured ? (
          <p className="mt-3 text-[#1f2937]">
            Для отображения материалов укажите переменные Sanity в файле{" "}
            <code className="text-[#111827]">.env.local</code> (см. README).
          </p>
        ) : null}
      </div>
    </footer>
  );
}
