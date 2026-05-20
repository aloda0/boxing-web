import type { Metadata } from "next";
import { DocTableWithFilter } from "@/components/DocTableWithFilter";
import { getTeamDocs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Сборная команда",
  description: "Актуальные документы по сборной команде Югры по боксу.",
};

export default async function TeamPage() {
  const docs = await getTeamDocs();

  // Нормализуем поле publishedAt → date для универсального компонента
  const items = docs.map((d) => ({
    _id: d._id,
    title: d.title,
    date: d.publishedAt,
    shortDescription: d.shortDescription,
    fileUrl: d.fileUrl,
    fileName: d.fileName,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 lg:px-4 lg:py-20 xl:px-6">
      <h1 className="text-4xl font-bold tracking-tight text-white">Сборная команда</h1>
      <p className="mt-3 max-w-2xl text-zinc-400">
        В разделе публикуются актуальные документы по сборной команде.
      </p>
      <div className="mt-10">
        <DocTableWithFilter
          docs={items}
          decemberShiftsYear
          emptyText="Документы сборной команды появятся после публикации в редакторе."
        />
      </div>
    </div>
  );
}
