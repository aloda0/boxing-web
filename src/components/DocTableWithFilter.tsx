"use client";

import { useMemo, useState } from "react";
import { formatDateRu } from "@/lib/format";

// ─── helpers ────────────────────────────────────────────────────────────────

function fileFormatFromName(
  name?: string | null,
  url?: string | null,
): "PDF" | "XLS" | "XLSX" | "—" {
  const source = (name || url || "").toLowerCase();
  const clean = source.split("?")[0].split("#")[0];
  const ext = clean.includes(".") ? clean.split(".").pop() : "";
  if (ext === "pdf") return "PDF";
  if (ext === "xls") return "XLS";
  if (ext === "xlsx") return "XLSX";
  return "—";
}

/**
 * Возвращает «год фильтра» для строки даты.
 * При decemberShiftsYear=true декабрь засчитывается в следующий год
 * (декабрьские документы сборной уже относятся к новому сезону).
 */
function getFilterYear(
  dateStr: string | null | undefined,
  decemberShiftsYear: boolean,
): number | null {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  if (!year || !month) return null;
  if (decemberShiftsYear && month === 12) return year + 1;
  return year;
}

// ─── icons ──────────────────────────────────────────────────────────────────

function EyeIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M2.5 12s3.5-7.5 9.5-7.5S21.5 12 21.5 12s-3.5 7.5-9.5 7.5S2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 15.25a3.25 3.25 0 1 0 0-6.5a3.25 3.25 0 0 0 0 6.5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function DownloadIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M12 3v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M8 11l4 4l4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 21h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ─── types ───────────────────────────────────────────────────────────────────

export type DocTableItem = {
  _id: string;
  title?: string | null;
  /** ISO date string — publishedAt или docDate, нормализовано снаружи */
  date?: string | null;
  shortDescription?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
};

// ─── component ───────────────────────────────────────────────────────────────

export function DocTableWithFilter({
  docs,
  decemberShiftsYear = false,
  emptyText = "Документы пока не опубликованы.",
}: {
  docs: DocTableItem[];
  decemberShiftsYear?: boolean;
  emptyText?: string;
}) {
  // Уникальные годы, отсортированные от нового к старому
  const years = useMemo(() => {
    const set = new Set<number>();
    docs.forEach((d) => {
      const y = getFilterYear(d.date, decemberShiftsYear);
      if (y) set.add(y);
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [docs, decemberShiftsYear]);

  const [selectedYear, setSelectedYear] = useState<number | null>(years[0] ?? null);

  const filtered = useMemo(() => {
    if (selectedYear === null) return docs;
    return docs.filter((d) => getFilterYear(d.date, decemberShiftsYear) === selectedYear);
  }, [docs, selectedYear, decemberShiftsYear]);

  if (docs.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-[rgba(7,10,16,0.42)] backdrop-blur-xl px-6 py-8">
        <p className="text-zinc-400">{emptyText}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Фильтр по годам */}
      {years.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {years.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setSelectedYear(y)}
              className={[
                "rounded-lg border px-4 py-1.5 text-sm font-semibold transition-colors",
                selectedYear === y
                  ? "border-white/20 bg-white/12 text-white"
                  : "border-white/8 bg-transparent text-zinc-400 hover:border-white/15 hover:text-zinc-200",
              ].join(" ")}
            >
              {y}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[rgba(7,10,16,0.42)] backdrop-blur-xl px-6 py-8">
          <p className="text-zinc-400">За {selectedYear} год документов нет.</p>
        </div>
      ) : (
        <>
          {/* Desktop: таблица */}
          <div className="hidden overflow-hidden rounded-xl border border-white/12 bg-[rgba(7,10,16,0.42)] backdrop-blur-xl md:block md:-mx-2 md:w-[calc(100%+1rem)] lg:-mx-4 lg:w-[calc(100%+2rem)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] table-fixed border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-[rgba(7,10,16,0.62)] text-left text-xs font-semibold uppercase tracking-wider text-zinc-200">
                    <th className="w-[28%] px-6 py-4">Документ</th>
                    <th className="w-[13%] px-6 py-4">Дата</th>
                    <th className="w-[34%] px-6 py-4">Описание</th>
                    <th className="w-[5%] px-4 py-4">Формат</th>
                    <th className="relative left-px w-[20%] py-4 pl-16 pr-2 text-left">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d) => {
                    const fmt = fileFormatFromName(d.fileName, d.fileUrl);
                    return (
                      <tr
                        key={d._id}
                        className="border-b border-white/8 last:border-b-0 hover:bg-white/[0.03] transition-colors"
                      >
                        <td className="px-6 py-4 align-top">
                          <p className="line-clamp-2 break-words hyphens-auto text-pretty text-sm font-semibold leading-snug text-white">
                            {d.title}
                          </p>
                        </td>
                        <td className="px-6 py-4 align-top text-sm text-zinc-300 whitespace-nowrap">
                          {d.date ? formatDateRu(d.date) : "—"}
                        </td>
                        <td className="px-6 py-4 align-top">
                          {d.shortDescription ? (
                            <p className="line-clamp-2 break-words hyphens-auto text-pretty text-sm leading-relaxed text-zinc-300">
                              {d.shortDescription}
                            </p>
                          ) : (
                            <p className="text-sm text-zinc-500">—</p>
                          )}
                        </td>
                        <td className="px-4 py-4 align-top text-sm font-semibold text-zinc-200">
                          {fmt}
                        </td>
                        <td className="pl-16 pr-2 py-4 align-top">
                          {d.fileUrl ? (
                            <div className="flex flex-wrap items-center justify-start gap-1.5">
                              <a
                                href={d.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex whitespace-nowrap rounded-md border border-black/12 bg-white/75 px-2 py-1.5 text-xs font-semibold text-black backdrop-blur-sm transition hover:bg-white/85 hover:border-black/20"
                              >
                                <span className="inline-flex items-center gap-1.5">
                                  <EyeIcon className="text-black/90" />
                                  Открыть
                                </span>
                              </a>
                              <a
                                href={d.fileUrl}
                                download
                                className="inline-flex whitespace-nowrap rounded-md border border-black/14 bg-white/55 px-2 py-1.5 text-xs font-semibold text-black backdrop-blur-sm transition hover:bg-white/65 hover:border-black/22"
                              >
                                <span className="inline-flex items-center gap-1.5">
                                  <DownloadIcon className="text-black/90" />
                                  Скачать
                                </span>
                              </a>
                            </div>
                          ) : (
                            <p className="text-left text-xs text-zinc-500">Файл не загружен</p>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile: список */}
          <div className="overflow-hidden rounded-xl border border-white/12 bg-[rgba(7,10,16,0.42)] backdrop-blur-xl md:hidden -mx-2 w-[calc(100%+1rem)] sm:mx-0 sm:w-full">
            <ul className="divide-y divide-white/8">
              {filtered.map((d) => {
                const fmt = fileFormatFromName(d.fileName, d.fileUrl);
                return (
                  <li key={d._id} className="px-4 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="break-words hyphens-auto text-pretty text-sm font-semibold text-white">
                          {d.title}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">
                          <span>{d.date ? formatDateRu(d.date) : "—"}</span>
                          <span className="text-zinc-600">•</span>
                          <span className="font-semibold text-zinc-200">{fmt}</span>
                        </div>
                      </div>
                    </div>

                    {d.shortDescription ? (
                      <p className="mt-3 break-words hyphens-auto text-pretty text-sm leading-relaxed text-zinc-300">
                        {d.shortDescription}
                      </p>
                    ) : null}

                    {d.fileUrl ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <a
                          href={d.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex rounded-md border border-black/12 bg-white/75 px-2 py-1.5 text-xs font-semibold text-black backdrop-blur-sm transition hover:bg-white/85 hover:border-black/20"
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <EyeIcon className="text-black/90" />
                            Открыть
                          </span>
                        </a>
                        <a
                          href={d.fileUrl}
                          download
                          className="inline-flex rounded-md border border-black/14 bg-white/55 px-2 py-1.5 text-xs font-semibold text-black backdrop-blur-sm transition hover:bg-white/65 hover:border-black/22"
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <DownloadIcon className="text-black/90" />
                            Скачать
                          </span>
                        </a>
                      </div>
                    ) : (
                      <p className="mt-3 text-xs text-zinc-500">Файл не загружен</p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
