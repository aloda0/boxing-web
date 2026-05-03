import { defineField, defineType } from "sanity";

function slugifyRu(input: string): string {
  const map: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "yo",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
  };

  return (
    input
      .trim()
      .toLowerCase()
      // translit ru → en
      .split("")
      .map((ch) => map[ch] ?? ch)
      .join("")
      // normalize separators
      .replace(/['"`’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}

function hasBlockText(blocks: unknown): boolean {
  if (!Array.isArray(blocks)) return false;
  return blocks.some((block) => {
    if (!block || typeof block !== "object" || (block as { _type?: string })._type !== "block")
      return false;
    const children = (block as { children?: { text?: string }[] }).children;
    if (!Array.isArray(children)) return false;
    return children.some((c) => typeof c?.text === "string" && c.text.trim().length > 0);
  });
}

export const newsArticle = defineType({
  name: "newsArticle",
  title: "Новость",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Заголовок новости",
      type: "string",
      description: "Короткий заголовок, как на плакате.",
      validation: (Rule) => Rule.required().error("Укажите заголовок"),
    }),
    defineField({
      name: "slug",
      title: "Ссылка для сайта",
      type: "slug",
      description:
        "Автоматически создаётся из заголовка. При необходимости можно отредактировать вручную.",
      options: {
        source: "title",
        maxLength: 96,
        slugify: (input: string) => slugifyRu(input).slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Дата публикации",
      type: "datetime",
      description: "Когда новость должна появиться на сайте.",
      validation: (Rule) => Rule.required().error("Укажите дату"),
    }),
    defineField({
      name: "coverImage",
      title: "Фото для новости",
      type: "image",
      description: "Загрузите фото (можно перетащить файл в это поле).",
      options: { hotspot: true },
    }),
    defineField({
      name: "body",
      title: "Текст новости",
      type: "blockContent",
      description: "Напишите текст как в обычном редакторе. Можно выделять жирным и ставить списки.",
      validation: (Rule) =>
        Rule.custom((blocks) => {
          if (!hasBlockText(blocks)) {
            return "Напишите текст новости — пустую публикацию отправить нельзя.";
          }
          return true;
        }),
    }),
  ],
  preview: {
    select: { title: "title", media: "coverImage", date: "publishedAt" },
    prepare({ title, media, date }) {
      return {
        title,
        media,
        subtitle: date ? new Date(date).toLocaleDateString("ru-RU") : "",
      };
    },
  },
  orderings: [
    {
      title: "Сначала новые по дате",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
