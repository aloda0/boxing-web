import type { Metadata } from "next";
import { GlassCard } from "@/components/GlassCard";
import { formatDateRu } from "@/lib/format";
import { getTeamDocs } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Сборная команда",
  description: "Актуальные документы по сборной команде Югры по боксу.",
};

function fileFormatFromName(name?: string | null, url?: string | null): "PDF" | "XLS" | "XLSX" | "—" {
  const source = (name || url || "").toLowerCase();
  const clean = source.split("?")[0].split("#")[0];
  const ext = clean.includes(".") ? clean.split(".").pop() : "";
  if (ext === "pdf") return "PDF";
  if (ext === "xls") return "XLS";
  if (ext === "xlsx") return "XLSX";
  return "—";
}

function EyeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
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
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M12 3v10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 11l4 4l4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 21h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default async function TeamPage() {
  const docs = await getTeamDocs();

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 lg:px-4 lg:py-20 xl:px-6">
      <h1 className="text-4xl font-bold tracking-tight text-white">Сборная команда</h1>
      <p className="mt-3 max-w-2xl text-zinc-400">
        В разделе публикуются актуальные документы по сборной команде.
      </p>
      <div className="mt-10">
        {docs.length === 0 ? (
          <GlassCard>
            <p className="text-zinc-400">
              Документы сборной команды появятся после публикации в редакторе.
            </p>
          </GlassCard>
        ) : (
          <>
            {/* Desktop/tablet: строгий реестр в виде таблицы */}
            <div className="hidden overflow-hidden rounded-xl border border-white/12 bg-[rgba(7,10,16,0.42)] backdrop-blur-xl md:block md:-mx-2 md:w-[calc(100%+1rem)] lg:-mx-4 lg:w-[calc(100%+2rem)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] table-fixed border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-[rgba(7,10,16,0.62)] text-left text-xs font-semibold uppercase tracking-wider text-zinc-200">
                      <th className="w-[23%] px-6 py-4">Документ</th>
                      <th className="w-[14%] px-6 py-4">Дата</th>
                      <th className="w-[34%] px-6 py-4">Описание</th>
                      <th className="w-[5%] px-4 py-4">Формат</th>
                      <th className="relative left-px w-[24%] py-4 pl-20 pr-2 text-left">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docs.map((d) => {
                      const fmt = fileFormatFromName(d.fileName, d.fileUrl);
                      return (
                        <tr key={d._id} className="border-b border-white/8 last:border-b-0 hover:bg-white/[0.03] transition-colors">
                          <td className="px-6 py-4 align-top">
                            <p className="line-clamp-2 break-words hyphens-auto text-pretty text-sm font-semibold leading-snug text-white">
                              {d.title}
                            </p>
                            {d.fileName ? (
                              <p className="mt-1 truncate text-xs text-zinc-500">{d.fileName}</p>
                            ) : null}
                          </td>
                          <td className="px-6 py-4 align-top text-sm text-zinc-300 whitespace-nowrap">
                            {d.publishedAt ? formatDateRu(d.publishedAt) : "—"}
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
                          <td className="pl-20 pr-2 py-4 align-top">
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

            {/* Mobile: строгий список строк */}
            <div className="overflow-hidden rounded-xl border border-white/12 bg-[rgba(7,10,16,0.42)] backdrop-blur-xl md:hidden -mx-2 w-[calc(100%+1rem)] sm:mx-0 sm:w-full">
              <ul className="divide-y divide-white/8">
                {docs.map((d) => {
                  const fmt = fileFormatFromName(d.fileName, d.fileUrl);
                  return (
                    <li key={d._id} className="px-4 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="break-words hyphens-auto text-pretty text-sm font-semibold text-white">
                            {d.title}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">
                            <span>{d.publishedAt ? formatDateRu(d.publishedAt) : "—"}</span>
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
    </div>
  );
}
