import type { Metadata } from "next";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { formatDateRu } from "@/lib/format";
import { getCompetitionResults } from "@/lib/data";


export const metadata: Metadata = {
  title: "Результаты соревнований",
  description: "Итоги соревнований, списки и призёры.",
};

export default async function ResultsPage() {
  const items = await getCompetitionResults();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6 lg:py-20">
      <h1 className="text-4xl font-bold tracking-tight text-white">Результаты соревнований</h1>
      <p className="mt-3 max-w-2xl text-zinc-400">
        Подробная страница соревнования открывается по карточке. Файл можно прикрепить в редакторе.
      </p>
      <div className="section-surface mt-12 rounded-3xl p-2 sm:p-3">
        <div className="grid gap-6 md:grid-cols-2">
        {items.length === 0 ? (
          <GlassCard className="md:col-span-2">
            <p className="text-zinc-400">Записи появятся после публикации в разделе «Результаты соревнований».</p>
          </GlassCard>
        ) : (
          items.map((item) => {
            const slug = item.slug?.current;
            return (
              <Link key={item._id} href={slug ? `/results/${slug}` : "#"} className="group block">
                <GlassCard className="h-full">
                  <p className="text-xs text-zinc-500">
                    {item.eventDate ? formatDateRu(item.eventDate) : ""}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-white transition group-hover:text-accent-soft">
                    {item.title}
                  </h2>
                  {item.location ? <p className="mt-2 text-sm text-zinc-400">{item.location}</p> : null}
                  {item.summary ? (
                    <p className="mt-4 line-clamp-4 text-sm text-zinc-400">{item.summary}</p>
                  ) : null}
                  <p className="mt-6 text-sm font-medium text-accent-muted">Подробнее →</p>
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
