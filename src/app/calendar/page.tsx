import type { Metadata } from "next";
import { GlassCard } from "@/components/GlassCard";
import { PortableBody } from "@/components/PortableBody";
import { formatDateTimeRu } from "@/lib/format";
import { getCalendarEvents } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Календарный план",
  description: "Календарь соревнований и ключевых событий Федерации бокса Югры.",
};

export default async function CalendarPage() {
  const events = await getCalendarEvents();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6 lg:py-20">
      <h1 className="text-4xl font-bold tracking-tight text-white">Календарный план</h1>
      <p className="mt-3 max-w-2xl text-zinc-400">
        Даты, места и документы по событиям. При необходимости прикрепите файл в редакторе.
      </p>
      <div className="mt-12 space-y-6">
        {events.length === 0 ? (
          <GlassCard>
            <p className="text-zinc-400">События появятся после добавления в календарь.</p>
          </GlassCard>
        ) : (
          events.map((ev) => (
            <GlassCard key={ev._id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent-muted">
                    {ev.eventDate ? formatDateTimeRu(ev.eventDate) : "Дата уточняется"}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {ev.eventName || "Событие"}
                  </h2>
                  {ev.location ? (
                    <p className="mt-2 text-sm text-zinc-400">Место: {ev.location}</p>
                  ) : null}
                  <div className="mt-6 max-w-none text-sm">
                    <PortableBody value={ev.description} />
                  </div>
                </div>
                {ev.attachmentUrl ? (
                  <a
                    href={ev.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary shrink-0 self-start rounded-xl px-4 py-2 text-sm font-semibold text-white transition"
                  >
                    {ev.attachmentName ? `Скачать: ${ev.attachmentName}` : "Скачать документ"}
                  </a>
                ) : null}
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}
