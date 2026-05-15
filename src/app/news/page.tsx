import type { Metadata } from "next";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { SanityImage } from "@/components/SanityImage";
import { formatDateRu } from "@/lib/format";
import { getAllNews } from "@/lib/data";


export const metadata: Metadata = {
  title: "Новости",
  description: "Новости Федерации бокса Югры: события, турниры, объявления.",
};

export default async function NewsPage() {
  const items = await getAllNews();

  const imageClassByRatio = (ratio?: number | null) => {
    if (typeof ratio !== "number" || !Number.isFinite(ratio)) return "media-news-poster";
    if (ratio > 1.15) return "media-news-landscape";
    if (ratio < 0.85) return "media-news-poster";
    return "media-news-square";
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6 lg:py-20">
      <h1 className="text-4xl font-bold tracking-tight text-white">Новости</h1>
      <p className="mt-3 max-w-2xl text-zinc-400">
        Материалы публикуются через редактор контента. Пустые поля не отображаются на сайте.
      </p>
      <div className="section-surface mt-12 rounded-3xl p-2 sm:p-3">
        <div className="grid gap-6 md:grid-cols-2">
        {items.length === 0 ? (
          <GlassCard className="md:col-span-2">
            <p className="text-zinc-400">Пока нет опубликованных новостей.</p>
          </GlassCard>
        ) : (
          items.map((item) => {
            const slug = item.slug?.current;
            return (
              <Link key={item._id} href={slug ? `/news/${slug}` : "#"} className="group block">
                <GlassCard className="h-full overflow-hidden border-white/12 bg-[rgba(0,0,0,0.92)] p-0 shadow-[0_18px_44px_rgba(0,0,0,0.36)] backdrop-blur-[16px]">
                  <div className={imageClassByRatio(item.coverImageAspectRatio)}>
                    <SanityImage
                      image={item.coverImage}
                      alt=""
                      fill
                      className="media-preview-image transition duration-500 group-hover:scale-[1.02]"
                      sizes="(max-width:768px)100vw,50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-zinc-500">
                      {item.publishedAt ? formatDateRu(item.publishedAt) : ""}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-white transition group-hover:text-accent-soft">
                      {item.title}
                    </h2>
                  </div>
                </GlassCard>
              </Link>
            );
          })
        )}
        </div>
      </div>
    </div>
  );
}
