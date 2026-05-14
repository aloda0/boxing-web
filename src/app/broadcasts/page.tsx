import type { Metadata } from "next";
import { GlassCard } from "@/components/GlassCard";

export const metadata: Metadata = {
  title: "Трансляции",
  description:
    "Прямые трансляции и записи соревнований по боксу Федерации Ханты-Мансийского автономного округа — Югры.",
};

export default function BroadcastsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6 lg:py-20">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#C62828]">
        В разработке
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
        Трансляции
      </h1>
      <p className="mt-4 max-w-2xl text-base text-zinc-400 leading-relaxed">
        Здесь будут публиковаться ссылки на прямые эфиры соревнований
        Федерации бокса Югры.
      </p>

      <GlassCard hover={false} className="mt-12 text-center py-16">
        <p className="text-base text-zinc-300 font-medium">Скоро здесь появятся прямые эфиры</p>
        <p className="mt-2 text-sm text-zinc-500">
          Следите за обновлениями на сайте и в социальных сетях федерации.
        </p>
      </GlassCard>
    </div>
  );
}
