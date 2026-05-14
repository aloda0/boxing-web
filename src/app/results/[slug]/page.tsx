import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GlassCard } from "@/components/GlassCard";
import { formatDateRu } from "@/lib/format";
import { getCompetitionResultBySlug, getCompetitionResults } from "@/lib/data";

export const dynamicParams = false;

export async function generateStaticParams() {
  const items = await getCompetitionResults();
  const slugs = items
    .map((r) => r.slug?.current)
    .filter((s): s is string => Boolean(s));
  return (slugs.length > 0 ? slugs : ["_"]).map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getCompetitionResultBySlug(slug);
  if (!item) return { title: "Соревнование не найдено" };
  const desc = item.resultsText?.trim() || item.summary || undefined;
  return {
    title: item.title || "Результаты",
    description: desc,
  };
}

export default async function ResultDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getCompetitionResultBySlug(slug);
  if (!item) notFound();

  const rows = item.resultRows?.map((r) => r?.line).filter(Boolean) ?? [];
  const hasNewText = Boolean(item.resultsText?.trim());

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 lg:px-6 lg:py-20">
      <div className="surface-matte rounded-3xl p-6 sm:p-8">
        <p className="text-sm text-zinc-500">
          {item.eventDate ? formatDateRu(item.eventDate) : ""}
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900">{item.title}</h1>
        {item.location ? <p className="mt-4 text-zinc-400">Место: {item.location}</p> : null}

      {hasNewText ? (
        <GlassCard className="mt-10">
          <h2 className="text-lg font-semibold text-zinc-900">Результаты</h2>
          <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-300">
            {item.resultsText}
          </pre>
        </GlassCard>
      ) : (
        <>
          {item.summary ? <p className="mt-6 text-lg text-zinc-200">{item.summary}</p> : null}
          {rows.length > 0 ? (
            <GlassCard className="mt-10">
              <h2 className="text-lg font-semibold text-zinc-900">Список результатов</h2>
              <ul className="mt-4 space-y-2 text-zinc-300">
                {rows.map((line, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-zinc-600">{i + 1}.</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          ) : null}
          {item.winners ? (
            <GlassCard className="mt-6">
              <h2 className="text-lg font-semibold text-zinc-900">Победители и призёры</h2>
              <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-300">
                {item.winners}
              </pre>
            </GlassCard>
          ) : null}
        </>
      )}

      {item.finalUrl ? (
        <div className="mt-10">
          <a
            href={item.finalUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary inline-flex rounded-xl px-6 py-3 text-sm font-semibold text-zinc-900 transition"
          >
            {item.finalName ? `Скачать: ${item.finalName}` : "Скачать итоговый документ"}
          </a>
        </div>
      ) : null}
      </div>
    </div>
  );
}
