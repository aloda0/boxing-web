import type { Metadata } from "next";
import { GlassCard } from "@/components/GlassCard";
import { SanityImage } from "@/components/SanityImage";
import { PortableText } from "@portabletext/react";
import { getMuseumEntries } from "@/lib/data";

export const metadata: Metadata = {
  title: "Музей Югры",
  description:
    "Музей бокса Югры — история, достижения и легенды Федерации бокса Ханты-Мансийского автономного округа.",
};

const CATEGORY_LABELS: Record<string, string> = {
  "hall-of-fame": "Зал славы",
  history: "История федерации",
  archive: "Экспонаты и архив",
};

export default async function MuseumPage() {
  const entries = await getMuseumEntries();

  const grouped = entries.reduce<Record<string, typeof entries>>((acc, e) => {
    const cat = e.category ?? "archive";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(e);
    return acc;
  }, {});

  const categoryOrder = ["hall-of-fame", "history", "archive"];

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6 lg:py-20">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#C62828]">
        Музей Югры
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
        История бокса Югры
      </h1>
      <p className="mt-4 max-w-2xl text-base text-zinc-400 leading-relaxed">
        Живая история бокса Ханты-Мансийского автономного округа. Зал славы,
        архивные материалы и экспонаты, хранящие память о победах.
      </p>

      {entries.length === 0 ? (
        <GlassCard hover={false} className="mt-12 text-center">
          <p className="text-sm text-zinc-400">
            Раздел готовится к запуску. Следите за обновлениями на сайте и в социальных сетях.
          </p>
        </GlassCard>
      ) : (
        <div className="mt-12 space-y-14">
          {categoryOrder
            .filter((cat) => grouped[cat]?.length)
            .map((cat) => (
              <section key={cat}>
                <h2 className="mb-6 text-2xl font-bold text-white">
                  {CATEGORY_LABELS[cat] ?? cat}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {grouped[cat].map((entry) => (
                    <GlassCard key={entry._id} className="flex flex-col gap-3 p-0 overflow-hidden">
                      {entry.photo ? (
                        <div className="relative h-52 w-full overflow-hidden bg-white/5">
                          <SanityImage
                            image={entry.photo}
                            alt={entry.title ?? ""}
                            fill
                            className="object-cover"
                            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                          />
                        </div>
                      ) : null}
                      <div className="flex flex-col gap-2 p-5 pt-3">
                        {entry.achievementDate ? (
                          <p className="text-xs font-semibold text-[#C62828]">{entry.achievementDate}</p>
                        ) : null}
                        <h3 className="text-base font-semibold text-white">{entry.title}</h3>
                        {entry.description ? (
                          <div className="prose prose-sm prose-invert text-zinc-400">
                            <PortableText value={entry.description as Parameters<typeof PortableText>[0]["value"]} />
                          </div>
                        ) : null}
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </section>
            ))}
        </div>
      )}
    </div>
  );
}
