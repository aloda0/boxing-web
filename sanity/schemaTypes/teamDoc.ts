import { defineField, defineType } from "sanity";

export const teamDoc = defineType({
  name: "teamDoc",
  title: "Документ сборной команды",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Название документа",
      type: "string",
      validation: (Rule) => Rule.required().error("Укажите название документа"),
    }),
    defineField({
      name: "publishedAt",
      title: "Дата публикации",
      type: "date",
      validation: (Rule) => Rule.required().error("Укажите дату публикации"),
    }),
    defineField({
      name: "shortDescription",
      title: "Краткое описание",
      type: "text",
      rows: 4,
      description: "1–2 предложения: что внутри документа и для кого он.",
    }),
    defineField({
      name: "file",
      title: "Файл (PDF / Excel)",
      type: "file",
      description: "Загрузите PDF / XLS / XLSX. Можно перетащить файл сюда.",
      options: {
        accept: ".pdf,.xls,.xlsx",
      },
    }),
  ],
  preview: {
    select: { title: "title", date: "publishedAt" },
    prepare({ title, date }) {
      return {
        title,
        subtitle: date ? `Дата: ${date}` : undefined,
      };
    },
  },
});

