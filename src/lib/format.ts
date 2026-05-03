export function formatDateRu(
  date?: string | null,
  opts?: Intl.DateTimeFormatOptions,
): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(
    "ru-RU",
    opts ?? { day: "numeric", month: "long", year: "numeric" },
  );
}

export function formatDateTimeRu(date?: string | null): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
