import Link from "next/link";
import { GlassCard } from "./GlassCard";
import { formatDateRu } from "@/lib/format";

type Props = {
  title?: string | null;
  date?: string | null;
  description?: string | null;
  fileUrl?: string | null;
  fileLabel?: string;
  href?: string | null;
};

export function DocumentCard({
  title,
  date,
  description,
  fileUrl,
  fileLabel = "Скачать файл",
  href,
}: Props) {
  const titleNode = href ? (
    <Link
      href={href}
      className="block text-lg font-semibold text-white transition hover:text-accent-soft"
    >
      {title || "Без названия"}
    </Link>
  ) : (
    <h3 className="text-lg font-semibold text-white">{title || "Без названия"}</h3>
  );

  return (
    <GlassCard className="h-full">
      <p className="text-xs font-medium uppercase tracking-wider text-accent-muted">
        {date ? formatDateRu(date) : "Без даты"}
      </p>
      <div className="mt-2">{titleNode}</div>
      {description ? (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400">{description}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-3">
        {href ? (
          <Link
            href={href}
            className="link-accent text-sm font-medium underline decoration-[rgba(122,61,69,0.35)] underline-offset-4 transition"
          >
            Подробнее
          </Link>
        ) : null}
        {fileUrl ? (
          <a
            href={fileUrl}
            className="btn-primary inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-white transition"
            target="_blank"
            rel="noreferrer"
          >
            {fileLabel}
          </a>
        ) : null}
      </div>
    </GlassCard>
  );
}
