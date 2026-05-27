import type { Metadata } from "next";
import { GlassCard } from "@/components/GlassCard";
import { SanityImage } from "@/components/SanityImage";
import { formatDateRu } from "@/lib/format";
import { getUdarNaSiluEvents } from "@/lib/data";

export const metadata: Metadata = {
  title: "Удар на силу",
  description:
    "Удар на силу — специальный проект Федерации бокса Югры по измерению силы удара.",
};

export default async function UdarNaSiluPage() {
  const events = await getUdarNaSiluEvents();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6 lg:py-20">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#C62828]">
        Проект федерации
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
        Удар на силу
      </h1>
      <p className="mt-4 max-w-2xl text-base text-zinc-400 leading-relaxed">
        Специальный проект федерации по измерению силы удара. Открытые
        замеры, рейтинги участников и турниры среди любителей.
      </p>

      {events.length === 0 ? (
        <GlassCard hover={false} className="mt-12 text-center">
          <p className="text-sm text-zinc-400">
            Раздел готовится к запуску. Следите за обновлениями на сайте и в социальных сетях.
          </p>
        </GlassCard>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <GlassCard key={event._id} className="flex flex-col gap-0 p-0 overflow-hidden">
              {event.coverImage ? (
                <div className="relative h-48 w-full overflow-hidden bg-white/5">
                  <SanityImage
                    image={event.coverImage}
                    alt={event.title ?? ""}
                    fill
                    className="object-cover transition duration-300 hover:scale-[1.02]"
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  />
                </div>
              ) : null}
              <div className="flex flex-col gap-2 p-5">
                {event.eventDate ? (
                  <p className="text-xs text-zinc-500">{formatDateRu(event.eventDate)}</p>
                ) : null}
                <h2 className="text-base font-semibold text-white">{event.title}</h2>
                {event.location ? (
                  <p className="text-sm text-zinc-400">{event.location}</p>
                ) : null}
                {event.resultsFileUrl ? (
                  <a
                    href={event.resultsFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary mt-2 inline-flex rounded-xl px-4 py-2 text-sm font-semibold text-white transition"
                  >
                    Результаты
                  </a>
                ) : null}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
