import { defineField, defineType } from "sanity";

export const orgDoc = defineType({
  name: "orgDoc",
  title: "Документы организации",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Название документа",
      type: "string",
      validation: (Rule) => Rule.required().error("Укажите название"),
    }),
    defineField({
      name: "slug",
      title: "Служебное поле ссылки",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "docDate",
      title: "Дата",
      type: "date",
      description: "Дата документа или публикации.",
    }),
    defineField({
      name: "shortDescription",
      title: "Краткое описание",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "file",
      title: "Файл",
      type: "file",
      description: "Прикрепите PDF или DOCX.",
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
    { title: "Сначала новые", name: "docDateDesc", by: [{ field: "docDate", direction: "desc" }] },
  ],
});
