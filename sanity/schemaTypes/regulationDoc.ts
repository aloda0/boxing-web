import { defineField, defineType } from "sanity";

export const regulationDoc = defineType({
  name: "regulationDoc",
  title: "Положение соревнований",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Название документа",
      type: "string",
      description: "Как будет на сайте в списке.",
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
      description: "Дата документа или публикации.",
    }),
    defineField({
      name: "shortDescription",
      title: "Краткое описание",
      type: "text",
      rows: 4,
      description: "Пара предложений для карточки на сайте.",
    }),
    defineField({
      name: "file",
      title: "Файл",
      type: "file",
      description: "Прикрепите PDF или DOCX. После публикации появится кнопка «Скачать».",
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
