import type { Metadata } from "next";
import { DocTableWithFilter } from "@/components/DocTableWithFilter";
import { getReportDocs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Судейские отчёты",
  description: "Судейские отчёты с соревнований Федерации бокса Югры.",
};

export default async function ReportsPage() {
  const docs = await getReportDocs();

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
      <h1 className="text-4xl font-bold tracking-tight text-white">Судейские отчёты</h1>
      <p className="mt-3 max-w-2xl text-zinc-400">
        Загрузите PDF или документ Word в редакторе — посетители увидят файл и смогут его скачать.
      </p>
      <div className="mt-10">
        <DocTableWithFilter
          docs={items}
          emptyText="Отчёты пока не опубликованы."
        />
      </div>
    </div>
  );
}
