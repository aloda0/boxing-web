import type { Metadata } from "next";
import { GlassCard } from "@/components/GlassCard";

export const metadata: Metadata = {
  title: "Удар на силу",
  description:
    "Удар на силу — специальный проект Федерации бокса Югры по измерению силы удара.",
};

const features = [
  {
    title: "Открытые замеры",
    description:
      "Любой желающий может прийти и измерить силу удара на профессиональном оборудовании.",
  },
  {
    title: "Рейтинг участников",
    description:
      "Таблица лидеров по категориям: возраст, вес, пол. Обновляется после каждого мероприятия.",
  },
  {
    title: "Положения турниров",
    description:
      "Официальные положения и регламенты мероприятий проекта «Удар на силу» для участников.",
  },
];

export default function UdarNaSiluPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6 lg:py-20">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#C62828]">
        В разработке
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
        Удар на силу
      </h1>
      <p className="mt-4 max-w-2xl text-base text-zinc-400 leading-relaxed">
        Специальный проект федерации по измерению силы удара. Открытые
        замеры, рейтинги участников и турниры среди любителей.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {features.map((f) => (
          <GlassCard key={f.title} hover={false} className="flex flex-col gap-3">
            <div className="h-0.5 w-8 bg-[#C62828] rounded-full" />
            <h3 className="text-base font-semibold text-white">{f.title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{f.description}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard hover={false} className="mt-6 text-center">
        <p className="text-sm text-zinc-400">
          Раздел готовится к запуску. Следите за обновлениями на сайте и в социальных сетях.
        </p>
      </GlassCard>
    </div>
  );
}
