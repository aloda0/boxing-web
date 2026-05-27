/** Единый источник ссылок для desktop и mobile навигации. */

/** `public/images/logo-transparent-white-text.png` */
export const SITE_LOGO_SRC = "/images/logo-transparent-white-text.png";

export const aboutDropdown = [
  { href: "/about/leadership", label: "Руководство" },
  { href: "/about/coaches", label: "Тренерский состав" },
  { href: "/about/organization", label: "Документы организации" },
] as const;

export const documentationDropdown = [
  { href: "/calendar", label: "Календарный план" },
  { href: "/team", label: "Сборная команда" },
  { href: "/results", label: "Результаты соревнований" },
  { href: "/regulations", label: "Положение соревнований" },
  { href: "/reports", label: "Судейские отчеты" },
] as const;

export function pathMatches(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function groupActive(pathname: string | null, items: readonly { href: string }[]): boolean {
  return items.some((i) => pathMatches(pathname, i.href));
}
