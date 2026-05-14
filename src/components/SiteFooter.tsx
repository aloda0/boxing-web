"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { isSanityConfigured } from "@/sanity/client";

const socialLinks = [
  { label: "Telegram", href: "https://t.me/fbhmao86" },
  { label: "VK", href: "https://vk.com/id722957998" },
];

const contacts = {
  phone: "+7 922 001 00 77",
  phoneHref: "tel:+79220010077",
  email: "boxinghmao@mail.ru",
  emailHref: "mailto:boxinghmao@mail.ru",
  address:
    "628007, Ханты-Мансийский автономный округ Югра, город Ханты-Мансийск, улица Павла-Моденцова, 2, третий этаж.",
};

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname?.startsWith("/studio")) {
    return null;
  }

  return (
    <footer className="relative mt-auto py-14 bg-transparent overflow-hidden">
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-0 select-none"
        aria-hidden
      >
        <Image
          src="/images/footer-crest-yugra.png"
          alt=""
          width={1024}
          height={1536}
          sizes="(max-width:640px) 260px,(max-width:1024px) 300px,380px"
          className="hidden sm:block h-auto w-auto max-w-none max-h-[min(238px,32vh)] object-contain object-left-bottom opacity-[0.16] [filter:grayscale(1)_invert(1)_brightness(1.3)_contrast(1.4)]"
        />
      </div>

      <div className="mx-auto grid max-w-6xl items-start gap-12 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10 lg:px-6">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="max-w-sm text-sm leading-snug text-white/50 uppercase">
            РЕГИОНАЛЬНАЯ ОБЩЕСТВЕННАЯ ОРГАНИЗАЦИЯ ХАНТЫ-МАНСИЙСКОГО АВТОНОМНОГО ОКРУГА ЮГРЫ
          </p>
          <p className="mt-2 max-w-sm text-xs leading-snug text-white/30">
            Федерация бокса ХМАО (ФБЮ) — официальный сайт Федерации бокса Ханты-Мансийского автономного округа — Югры
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Контакты</p>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li>
              <a href={contacts.phoneHref} className="transition hover:text-white">
                {contacts.phone}
              </a>
            </li>
            <li>
              <a href={contacts.emailHref} className="transition hover:text-white">
                {contacts.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Социальные сети</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {socialLinks.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 transition hover:text-white"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Адрес</p>
          <p className="mt-4 text-sm text-white/70 leading-relaxed">{contacts.address}</p>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-white/10 px-4 pt-8 text-center text-xs text-white/30 lg:px-6">
        <p>© {new Date().getFullYear()} Федерация бокса Югры</p>
        {!isSanityConfigured ? (
          <p className="mt-3 text-white/30">
            Для отображения материалов укажите переменные Sanity в файле{" "}
            <code className="text-white/50">.env.local</code> (см. README).
          </p>
        ) : null}
      </div>
    </footer>
  );
}
