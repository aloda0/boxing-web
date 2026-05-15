import type { Metadata } from "next";
import { DocumentCard } from "@/components/DocumentCard";
import { getReportDocs } from "@/lib/data";


export const metadata: Metadata = {
  title: "Отчёты с соревнований",
  description: "Отчёты и итоговые материалы с соревнований.",
};

export default async function ReportsPage() {
  const docs = await getReportDocs();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6 lg:py-20">
      <h1 className="text-4xl font-bold tracking-tight text-white">Отчёты с соревнований</h1>
      <p className="mt-3 max-w-2xl text-zinc-400">
        Загрузите PDF или документ Word в редакторе — посетители увидят карточку и смогут скачать файл.
      </p>
      <div className="section-surface mt-12 rounded-3xl p-2 sm:p-3">
        <div className="grid gap-6 md:grid-cols-2">
        {docs.length === 0 ? (
          <p className="text-zinc-400 md:col-span-2">Отчёты пока не опубликованы.</p>
        ) : (
          docs.map((d) => (
            <DocumentCard
              key={d._id}
              title={d.title}
              date={d.docDate}
              description={d.shortDescription}
              fileUrl={d.fileUrl}
            />
          ))
        )}
        </div>
      </div>
    </div>
  );
}
