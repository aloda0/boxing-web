/**
 * Публичный URL встроенной Sanity Studio.
 * Если задан NEXT_PUBLIC_ADMIN_URL (например https://admin.ваш-домен.ru),
 * редактор открывается на поддомене. Иначе — относительный путь /studio (локальная разработка).
 */
export function getStudioHref(): string {
  const base = process.env.NEXT_PUBLIC_ADMIN_URL?.trim();
  if (!base) return "/studio";
  return `${base.replace(/\/$/, "")}/studio`;
}
