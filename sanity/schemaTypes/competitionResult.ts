import { defineField, defineType } from "sanity";

export const competitionResult = defineType({
  name: "competitionResult",
  title: "Результаты соревнований",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Название соревнования",
      type: "string",
      description: "Как в программе или протоколе.",
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
      name: "eventDate",
      title: "Дата",
      type: "datetime",
      validation: (Rule) => Rule.required().error("Укажите дату"),
    }),
    defineField({
      name: "location",
      title: "Место",
      type: "string",
      description: "Город, спорткомплекс и т.п.",
    }),
    defineField({
      name: "resultsText",
      title: "Результаты",
      type: "text",
      rows: 12,
      description:
        "Напишите результаты списком или текстом. Можно скопировать из таблицы. Победителей и призёров — тоже сюда.",
    }),
    defineField({
      name: "summary",
      title: "Старое: краткое описание",
      type: "text",
      rows: 3,
      hidden: true,
    }),
    defineField({
      name: "resultRows",
      title: "Список строк (старый формат)",
      type: "array",
      hidden: true,
      of: [
        {
          type: "object",
          fields: [{ name: "line", title: "Строка", type: "string" }],
        },
      ],
    }),
    defineField({
      name: "winners",
      title: "Победители (старый формат)",
      type: "text",
      hidden: true,
      rows: 4,
    }),
    defineField({
      name: "finalDocument",
      title: "Файл с результатами",
      type: "file",
      description: "Итоговый документ (PDF и др.), если есть.",
      options: {
        accept:
          "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    }),
  ],
  preview: {
    select: { title: "title", date: "eventDate" },
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
      name: "eventDateDesc",
      by: [{ field: "eventDate", direction: "desc" }],
    },
  ],
});
