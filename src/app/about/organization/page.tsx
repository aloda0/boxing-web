import type { Metadata } from "next";
import { GlassCard } from "@/components/GlassCard";
import { formatDateRu } from "@/lib/format";
import { getOrgDocs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Документы организации",
  description: "Официальные документы Федерации бокса Югры: устав, протоколы, положения.",
};

export default async function OrganizationDocumentsPage() {
  const docs = await getOrgDocs();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6 lg:py-20">
      <h1 className="text-4xl font-bold tracking-tight text-white">Документы организации</h1>
      <p className="mt-3 max-w-2xl text-zinc-400">
        Устав, протоколы, положения и иные официальные документы федерации.
      </p>

      {docs.length === 0 ? (
        <GlassCard className="mt-10">
          <p className="text-zinc-300">Документы появятся после публикации в редакторе.</p>
        </GlassCard>
      ) : (
        <div className="mt-10 space-y-3">
          {docs.map((doc) => (
            <GlassCard key={doc._id} className="flex items-center justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="text-xs text-zinc-500">
                  {doc.docDate ? formatDateRu(doc.docDate) : ""}
                </p>
                <h2 className="mt-0.5 text-base font-semibold text-white">{doc.title}</h2>
                {doc.shortDescription ? (
                  <p className="mt-1 text-sm text-zinc-400">{doc.shortDescription}</p>
                ) : null}
              </div>
              {doc.fileUrl ? (
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary shrink-0 inline-flex rounded-xl px-4 py-2 text-sm font-semibold text-white transition"
                >
                  Скачать
                </a>
              ) : null}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
