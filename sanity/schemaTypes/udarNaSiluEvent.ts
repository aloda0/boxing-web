import { defineField, defineType } from "sanity";

export const udarNaSiluEvent = defineType({
  name: "udarNaSiluEvent",
  title: "Удар на силу — события",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Название мероприятия",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Служебное поле ссылки",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "eventDate",
      title: "Дата проведения",
      type: "date",
    }),
    defineField({
      name: "location",
      title: "Место проведения",
      type: "string",
    }),
    defineField({
      name: "coverImage",
      title: "Фото",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Описание",
      type: "blockContent",
    }),
    defineField({
      name: "resultsFile",
      title: "Файл с результатами",
      type: "file",
      options: { accept: "application/pdf" },
    }),
  ],
  preview: {
    select: { title: "title", date: "eventDate", media: "coverImage" },
    prepare({ title, date, media }) {
      return {
        title,
        subtitle: date ? new Date(date).toLocaleDateString("ru-RU") : "",
        media,
      };
    },
  },
  orderings: [
    { title: "Сначала новые", name: "eventDateDesc", by: [{ field: "eventDate", direction: "desc" }] },
  ],
});
