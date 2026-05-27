import type { Metadata } from "next";
import { GlassCard } from "@/components/GlassCard";
import { SanityImage } from "@/components/SanityImage";
import { getCoaches } from "@/lib/data";

export const metadata: Metadata = {
  title: "Тренерский состав",
  description: "Тренерский состав Федерации бокса Югры.",
};

export default async function CoachesPage() {
  const coaches = await getCoaches();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6 lg:py-20">
      <h1 className="text-4xl font-bold tracking-tight text-white">Тренерский состав</h1>
      <p className="mt-3 max-w-2xl text-zinc-400">
        Профессиональные тренеры Федерации бокса Ханты-Мансийского автономного округа — Югры.
      </p>

      {coaches.length === 0 ? (
        <GlassCard className="mt-10">
          <p className="text-zinc-300">Информация о тренерском составе появится после публикации в редакторе.</p>
        </GlassCard>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {coaches.map((coach) => (
            <GlassCard key={coach._id} className="flex flex-col gap-4 p-0 overflow-hidden">
              {coach.photo ? (
                <div className="relative h-56 w-full overflow-hidden bg-white/5">
                  <SanityImage
                    image={coach.photo}
                    alt={coach.name ?? ""}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="flex h-56 w-full items-center justify-center bg-white/5">
                  <span className="text-5xl text-white/20">🥊</span>
                </div>
              )}
              <div className="flex flex-col gap-1 p-5 pt-0">
                <h2 className="text-lg font-semibold text-white">{coach.name}</h2>
                {coach.specialization ? (
                  <p className="text-sm font-medium text-[#C62828]">{coach.specialization}</p>
                ) : null}
                {coach.bio ? (
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{coach.bio}</p>
                ) : null}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
