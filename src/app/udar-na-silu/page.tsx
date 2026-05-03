import type { Metadata } from "next";
import { GlassCard } from "@/components/GlassCard";

export const metadata: Metadata = {
  title: "Удар на силу",
  description: "Удар на силу — Федерация бокса Югры.",
};

export default function UdarNaSiluPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6 lg:py-20">
      <h1 className="text-4xl font-bold tracking-tight text-white">Удар на силу</h1>
      <p className="mt-3 max-w-2xl text-zinc-400">
        Раздел в разработке. Здесь будет информация о проекте «Удар на силу».
      </p>
      <GlassCard className="mt-10">
        <p className="text-zinc-300">Контент появится позже.</p>
      </GlassCard>
    </div>
  );
}
