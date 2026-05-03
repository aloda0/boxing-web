/**
 * Все значения для Sanity берутся из переменных окружения.
 * Скопируйте .env.example → .env.local и заполните (см. README).
 */

function readProjectId(): string {
  return (
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ||
    process.env.SANITY_STUDIO_PROJECT_ID?.trim() ||
    ""
  );
}

/** Дата API GROQ: https://www.sanity.io/docs/api-versioning */
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || "2024-01-01";

/** Обычно `production` — имя датасета в sanity.io/manage → ваш проект → Datasets */
export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";

/** Project ID из панели Sanity (без кавычек, одна строка) */
export const projectId = readProjectId();

/**
 * Только для конфигурации Studio: без projectId редактор не запускается.
 * Сообщение подсказывает, куда вписать значение.
 */
export function assertSanityProjectIdForStudio(): void {
  if (!projectId) {
    throw new Error(
      "[Sanity] Не задан Project ID. Создайте .env.local в корне проекта, скопируйте из .env.example и укажите NEXT_PUBLIC_SANITY_PROJECT_ID (или SANITY_STUDIO_PROJECT_ID). Где взять ID: https://sanity.io/manage → ваш проект → Project settings → API → Project ID.",
    );
  }
}
