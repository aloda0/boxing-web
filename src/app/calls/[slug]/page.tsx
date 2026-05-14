import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GlassCard } from "@/components/GlassCard";
import { PortableBody } from "@/components/PortableBody";
import { formatDateRu } from "@/lib/format";
import { getCallBySlug, getCallDocs } from "@/lib/data";

export const dynamicParams = false;

export async function generateStaticParams() {
  const docs = await getCallDocs();
  const slugs = docs
    .map((d) => d.slug?.current)
    .filter((s): s is string => Boolean(s));
  // Static export requires at least one pre-rendered route for dynamic segments.
  // When Sanity has no documents yet, use a placeholder that resolves to notFound().
  return (slugs.length > 0 ? slugs : ["_"]).map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getCallBySlug(slug);
  if (!doc) return { title: "Вызов не найден" };
  return {
    title: doc.title || "Вызов",
  };
}

function Description({ value }: { value: unknown }) {
  if (typeof value === "string" && value.trim()) {
    return <p className="whitespace-pre-wrap leading-relaxed text-zinc-200">{value}</p>;
  }
  return <PortableBody value={value} />;
}

export default async function CallDetailPage({ params }: Props) {
  const { slug } = await params;
  const doc = await getCallBySlug(slug);
  if (!doc) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 lg:px-6 lg:py-20">
      <div className="surface-matte rounded-3xl p-6 sm:p-8">
      <Link href="/calls" className="link-accent text-sm font-medium transition">
        ← К списку вызовов
      </Link>
      <p className="mt-6 text-sm text-zinc-500">
        {doc.docDate ? formatDateRu(doc.docDate) : ""}
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900">{doc.title}</h1>
      <GlassCard className="mt-10">
        <Description value={doc.description} />
      </GlassCard>
      {doc.fileUrl ? (
        <div className="mt-10">
          <a
            href={doc.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary inline-flex rounded-xl px-6 py-3 text-sm font-semibold text-zinc-900 transition"
          >
            {doc.fileName ? `Скачать: ${doc.fileName}` : "Скачать документ"}
          </a>
        </div>
      ) : null}
      </div>
    </div>
  );
}
