import { defineField, defineType } from "sanity";

export const callDoc = defineType({
  name: "callDoc",
  title: "Вызов",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Название документа",
      type: "string",
      description: "Коротко, о чём вызов.",
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
      description: "Дата вызова или крайний срок.",
    }),
    defineField({
      name: "description",
      title: "Описание",
      type: "text",
      rows: 8,
      description: "Полный текст вызова. Можно с новой строки.",
    }),
    defineField({
      name: "file",
      title: "Файл",
      type: "file",
      description: "Прикрепите PDF или DOCX, если нужен файл для скачивания.",
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
