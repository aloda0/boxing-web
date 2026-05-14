import type { Metadata } from "next";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { SanityImage } from "@/components/SanityImage";
import { formatDateRu } from "@/lib/format";
import type { DocCard, HomePage } from "@/lib/data";
import { getHomePage, getLatestDocuments, getLatestNews } from "@/lib/data";
import { HERO_FALLBACK_IMAGE } from "@/lib/hero";

export const dynamic = "force-static";

const defaultHome: HomePage = {
  heroTitle: "Федерация бокса Югры",
  heroSubtitle:
    "Развитие любительского бокса в регионе, поддержка спортсменов и тренеров, проведение соревнований и семинаров",
  heroLinks: [
    { label: "Новости", href: "/news/" },
    { label: "Положения", href: "/regulations/" },
    { label: "Сборная команда", href: "/team/" },
    { label: "Судейские отчеты", href: "/reports/" },
  ],
};

const quickTiles = [
  { title: "Положения", href: "/regulations", hint: "Нормативные документы" },
  { title: "Сборная команда", href: "/team", hint: "Документы сборной" },
  { title: "Судейские отчеты", href: "/reports", hint: "Судейские материалы" },
  { title: "Отчёты", href: "/reports", hint: "Отчёты с турниров" },
  { title: "Вызовы", href: "/calls", hint: "Официальные вызовы" },
];

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHomePage();
  return {
    title:
      home?.metaTitle || "Федерация бокса Югры — официальный сайт",
    description:
      home?.metaDescription ||
      "Официальный сайт Федерации бокса Ханты-Мансийского автономного округа — Югры: новости, календарный план, сборная команда, результаты, положения, отчёты и вызовы.",
    keywords: [
      "ФБЮ",
      "Федерация бокса Югры",
      "Федерация бокса ХМАО",
      "Федерация бокса Ханты-Мансийского автономного округа - Югры",
      "официальный сайт Федерации бокса Югры",
      "бокс Югра",
      "бокс ХМАО",
      "сборная Югры по боксу",
      "календарь соревнований по боксу Югра",
    ],
    alternates: {
      canonical: "https://boxing-hmao.ru/",
    },
  };
}

export default async function HomePage() {
  const [homeRaw, news, docsBundle] = await Promise.all([
    getHomePage(),
    getLatestNews(),
    getLatestDocuments(),
  ]);

  const home = { ...defaultHome, ...homeRaw };
  const heroTitle = home.heroTitle || defaultHome.heroTitle;
  const heroLinksSource =
    Array.isArray(home.heroLinks) && home.heroLinks.length > 0 ? home.heroLinks : defaultHome.heroLinks;
  const desiredHeroLinks = defaultHome.heroLinks ?? [];
  const desiredHeroHrefs = new Set(desiredHeroLinks.map((l) => l.href));

  const heroLinks = (heroLinksSource ?? [])
    .map((l) => {
      const href = l?.href ?? "";
      const label = l?.label ?? "";

      // Hero-only точечная подмена ссылок/текста.
      if (label === "Календарный план" || href === "/calendar" || href === "/calendar/") {
        return { ...l, label: "Положения", href: "/regulations/" };
      }
      if (label === "Результаты" || href === "/results" || href === "/results/") {
        return { ...l, label: "Судейские отчеты", href: "/reports/" };
      }
      if (label === "Новости" && (href === "/news" || href === "/news/")) {
        return { ...l, href: "/news/" };
      }
      if (label === "Сборная команда" && (href === "/team" || href === "/team/")) {
        return { ...l, href: "/team/" };
      }
      if (label === "Судейские отчеты" && (href === "/reports" || href === "/reports/")) {
        return { ...l, href: "/reports/" };
      }
      if (label === "Положения" && (href === "/regulations" || href === "/regulations/")) {
        return { ...l, href: "/regulations/" };
      }

      return l;
    })
    .filter((l) => !!l?.href && !!l?.label && desiredHeroHrefs.has(l.href))
    // Жёстко фиксируем порядок и исключаем лишнее.
    .sort((a, b) => desiredHeroLinks.findIndex((x) => x.href === a.href) - desiredHeroLinks.findIndex((x) => x.href === b.href));

  const heroSubtitleRaw =
    typeof home.heroSubtitle === "string" && home.heroSubtitle.trim().length > 0
      ? home.heroSubtitle
      : defaultHome.heroSubtitle;
  const heroSubtitleNormalized = (heroSubtitleRaw ?? "").replace(/\.\s*$/, "");

  const mergedDocs: { doc: DocCard; kind: string }[] = [
    ...(docsBundle?.regulations ?? []).map((d) => ({ doc: d, kind: "Положение" })),
    ...(docsBundle?.reports ?? []).map((d) => ({ doc: d, kind: "Отчёт" })),
    ...(docsBundle?.calls ?? []).map((d) => ({ doc: d, kind: "Вызов" })),
  ]
    .filter((x) => x.doc?.title)
    .sort((a, b) => {
      const ta = a.doc.docDate ? new Date(a.doc.docDate).getTime() : 0;
      const tb = b.doc.docDate ? new Date(b.doc.docDate).getTime() : 0;
      return tb - ta;
    })
    .slice(0, 6);

  const imageClassByRatio = (ratio?: number | null) => {
    if (typeof ratio !== "number" || !Number.isFinite(ratio)) return "media-news-poster";
    if (ratio > 1.15) return "media-news-landscape";
    if (ratio < 0.85) return "media-news-poster";
    return "media-news-square";
  };

  return (
    <>
      <section
        id="home-hero"
        className="relative -mt-[var(--site-header-h)] max-lg:pointer-events-none max-md:mt-0 overflow-hidden rounded-b-[1.25rem] border-b border-black/10 sm:rounded-b-[1.75rem] lg:rounded-b-[2rem]"
      >
        <div className="relative min-h-[calc(100dvh-var(--site-header-h)-env(safe-area-inset-top,0px))] w-full md:min-h-[100dvh]">
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-no-repeat bg-[position:center_22%] md:bg-[position:center_26%] lg:bg-[position:62%_center]"
              style={{ backgroundImage: `url('${HERO_FALLBACK_IMAGE}')` }}
              role="presentation"
            />
            <div className="absolute inset-0 bg-black/26" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/42 via-black/20 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/16 via-transparent to-black/32" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_95%_65%_at_75%_18%,rgba(193,37,50,0.16),transparent_60%)]" />
          </div>
          <div className="absolute inset-0 flex items-end max-md:items-start pointer-events-none max-md:pt-[calc(var(--site-header-h)+env(safe-area-inset-top))]">
            <div className="pointer-events-auto mx-auto w-full max-w-7xl px-4 pb-8 pt-16 md:pb-14 md:pt-24 lg:mb-[430px] lg:px-0 lg:pb-16 lg:pt-24">
              <div className="w-full max-w-[868px]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C62828] sm:text-xs sm:tracking-[0.25em]">
                Ханты-Мансийский автономный округ — Югра
              </p>
              <h1 className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight text-[#ffffff] drop-shadow-sm text-balance sm:mt-4 sm:text-3xl md:text-4xl lg:mt-4 lg:text-5xl">
                {heroTitle}
              </h1>
              {heroSubtitleNormalized ? (
                <p className="mt-3 max-w-xl text-sm text-white/60 leading-relaxed sm:mt-4 sm:text-base">
                  {heroSubtitleNormalized}
                </p>
              ) : null}
              <div className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-3 lg:mt-10">
                {heroLinks?.map((l) =>
                  l?.href && l?.label ? (
                    <Link
                      key={`${l.href}-${l.label}`}
                      href={l.href}
                      className="rounded-xl border border-white/14 bg-[rgba(255,255,255,0.06)] px-4 py-2.5 text-xs font-semibold text-zinc-100 shadow-[0_10px_28px_rgba(0,0,0,0.28)] backdrop-blur-[14px] transition duration-200 hover:border-white/20 hover:bg-[rgba(255,255,255,0.12)] active:translate-y-px sm:rounded-2xl sm:px-5 sm:py-3 sm:text-sm lg:px-6 lg:py-3.5 lg:text-base"
                    >
                      {l.label}
                    </Link>
                  ) : null,
                )}
              </div>
              <div className="mt-8 flex flex-wrap gap-6 sm:mt-10 sm:gap-8 lg:mt-12 lg:gap-10">
                {[
                  { value: "7000+", label: "спортсменов" },
                  { value: "26", label: "лет истории" },
                  { value: "60+", label: "мероприятий в год" },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <span className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">{stat.value}</span>
                    <span className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-white/50 sm:text-xs">{stat.label}</span>
                  </div>
                ))}
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Плавный переход hero → контент */}
      <div className="pointer-events-none relative z-10 -mt-16 h-32 bg-gradient-to-b from-transparent via-black/60 to-[#0a0a0a]" aria-hidden />

      <div className="mx-auto w-full max-w-6xl space-y-20 px-4 py-4 lg:px-6 lg:py-8">
        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">Последние новости</h2>
              <p className="mt-2 text-zinc-400">Актуальные материалы федерации</p>
            </div>
            <Link
              href="/news"
              className="text-sm font-semibold text-accent-muted transition hover:text-accent-soft"
            >
              Все новости →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.length === 0 ? (
              <GlassCard className="md:col-span-2 lg:col-span-3">
                <p className="text-zinc-400">
                  Новости появятся здесь после публикации в редакторе контента.
                </p>
              </GlassCard>
            ) : (
              news.slice(0, 3).map((item) => {
                const slug = item.slug?.current;
                return (
                  <Link key={item._id} href={slug ? `/news/${slug}` : "#"} className="group block">
                    <GlassCard className="h-full overflow-hidden p-0">
                      <div className={imageClassByRatio(item.coverImageAspectRatio)}>
                        <SanityImage
                          image={item.coverImage}
                          alt=""
                          fill
                          className="media-preview-image transition duration-500 group-hover:scale-[1.02]"
                          sizes="(max-width:768px)100vw,33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      </div>
                      <div className="p-6">
                        <p className="text-xs text-zinc-500">
                          {item.publishedAt ? formatDateRu(item.publishedAt) : ""}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-white transition group-hover:text-accent-soft">
                          {item.title}
                        </h3>
                      </div>
                    </GlassCard>
                  </Link>
                );
              })
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">Быстрый доступ</h2>
          <p className="mt-2 text-zinc-400">Основные разделы сайта</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickTiles.map((tile) => (
              <Link key={tile.title} href={tile.href} className="group block">
                <GlassCard className="h-full">
                  <p className="text-xs font-medium uppercase tracking-wider text-accent-muted">
                    {tile.hint}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-white transition group-hover:text-accent-soft">
                    {tile.title}
                  </h3>
                  <p className="mt-4 text-sm text-zinc-500">Перейти в раздел →</p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">Документы и материалы</h2>
              <p className="mt-2 text-zinc-400">Недавно опубликованные файлы</p>
            </div>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {mergedDocs.length === 0 ? (
              <GlassCard className="md:col-span-2">
                <p className="text-zinc-400">
                  Здесь появятся положения, отчёты и вызовы после загрузки в редакторе.
                </p>
              </GlassCard>
            ) : (
              mergedDocs.map(({ doc, kind }) => (
                <GlassCard key={`${kind}-${doc._id}`} className="h-full">
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent-muted">
                    {kind}
                  </p>
                  <p className="mt-2 text-xs text-zinc-500">
                    {doc.docDate ? formatDateRu(doc.docDate) : "Без даты"}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-white">{doc.title}</h3>
                  {doc.shortDescription ? (
                    <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{doc.shortDescription}</p>
                  ) : null}
                  {doc.fileUrl ? (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary mt-4 inline-flex rounded-xl px-4 py-2 text-sm font-semibold text-white transition"
                    >
                      Скачать
                    </a>
                  ) : null}
                </GlassCard>
              ))
            )}
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsOrganization",
            name: "Федерация бокса Югры",
            alternateName: "ФБЮ",
            url: "https://boxing-hmao.ru",
            logo: "https://boxing-hmao.ru/icon.png",
            description:
              "Официальный сайт Федерации бокса Ханты-Мансийского автономного округа — Югры",
            address: {
              "@type": "PostalAddress",
              streetAddress: "улица Павла-Моденцова, 2, третий этаж",
              addressLocality: "Ханты-Мансийск",
              addressRegion: "Ханты-Мансийский автономный округ — Югра",
              postalCode: "628007",
              addressCountry: "RU",
            },
            email: "boxinghmao@mail.ru",
            telephone: "+79220010077",
            sport: "Boxing",
            sameAs: [
              "https://vk.com/id722957998",
              "https://t.me/fbhmao86",
            ],
          }),
        }}
      />
    </>
  );
}
