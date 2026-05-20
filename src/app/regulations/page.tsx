import type { Metadata } from "next";
import { DocTableWithFilter } from "@/components/DocTableWithFilter";
import { getRegulationDocs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Положение соревнований",
  description: "Положения и регламенты соревнований Федерации бокса Югры.",
};

export default async function RegulationsPage() {
  const docs = await getRegulationDocs();

  // Нормализуем docDate → date
  const items = docs.map((d) => ({
    _id: d._id,
    title: d.title,
    date: d.docDate,
    shortDescription: d.shortDescription,
    fileUrl: d.fileUrl,
    fileName: d.fileName,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 lg:px-4 lg:py-20 xl:px-6">
      <h1 className="text-4xl font-bold tracking-tight text-white">Положение соревнований</h1>
      <p className="mt-3 max-w-2xl text-zinc-400">
        Положения и регламенты соревнований. Кнопка «Скачать» появляется, если прикреплён файл.
      </p>
      <div className="mt-10">
        <DocTableWithFilter
          docs={items}
          emptyText="Документы пока не опубликованы."
        />
      </div>
    </div>
  );
}
