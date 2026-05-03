import { defineField, defineType } from "sanity";

export const reportDoc = defineType({
  name: "reportDoc",
  title: "Отчёт с соревнований",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Название документа",
      type: "string",
      description: "Например: Отчёт о турнире в Сургуте.",
      validation: (Rule) => Rule.required().error("Укажите название"),
    }),
    defineField({
      name: "slug",
      title: "Служебное поле ссылки",
      type: "slug",
      hidden: true,
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "docDate",
      title: "Дата",
      type: "date",
      description: "Дата отчёта.",
    }),
    defineField({
      name: "shortDescription",
      title: "Краткое описание",
      type: "text",
      rows: 4,
      description: "Что внутри файла — одним абзацем.",
    }),
    defineField({
      name: "file",
      title: "Файл",
      type: "file",
      description: "Прикрепите PDF или DOCX. Кнопка «Скачать» появится после загрузки.",
      options: {
        accept:
          "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    }),
  ],
  preview: {
    select: { title: "title", date: "docDate" },
    prepare({ title, date }) {
      return {
        title,
        subtitle: date ? new Date(date).toLocaleDateString("ru-RU") : "",
      };
    },
  },
  orderings: [
    {
      title: "Сначала новые по дате",
      name: "docDateDesc",
      by: [{ field: "docDate", direction: "desc" }],
    },
  ],
});
