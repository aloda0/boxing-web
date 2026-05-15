import type { Metadata } from "next";
import { DocumentCard } from "@/components/DocumentCard";
import { getCallDocs } from "@/lib/data";


export const metadata: Metadata = {
  title: "Вызовы",
  description: "Официальные вызовы и распоряжения Федерации бокса Югры.",
};

export default async function CallsPage() {
  const docs = await getCallDocs();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6 lg:py-20">
      <h1 className="text-4xl font-bold tracking-tight text-white">Вызовы</h1>
      <p className="mt-3 max-w-2xl text-zinc-400">
        Полный текст вызова открывается на отдельной странице. Файл для скачивания — по кнопке.
      </p>
      <div className="section-surface mt-12 rounded-3xl p-2 sm:p-3">
        <div className="grid gap-6 md:grid-cols-2">
        {docs.length === 0 ? (
          <p className="text-zinc-400 md:col-span-2">Материалы пока не опубликованы.</p>
        ) : (
          docs.map((d) => {
            const slug = d.slug?.current;
            return (
              <DocumentCard
                key={d._id}
                title={d.title}
                date={d.docDate}
                description={undefined}
                fileUrl={d.fileUrl}
                href={slug ? `/calls/${slug}` : null}
              />
            );
          })
        )}
        </div>
      </div>
    </div>
  );
}
