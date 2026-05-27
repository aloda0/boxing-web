import { defineField, defineType } from "sanity";

export const museumEntry = defineType({
  name: "museumEntry",
  title: "Музей Югры",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Заголовок",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Категория",
      type: "string",
      options: {
        list: [
          { title: "Зал славы", value: "hall-of-fame" },
          { title: "История федерации", value: "history" },
          { title: "Экспонаты и архив", value: "archive" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Фото / изображение",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Описание",
      type: "blockContent",
    }),
    defineField({
      name: "achievementDate",
      title: "Дата / период",
      type: "string",
      description: "Например: 2004, 1998–2006",
    }),
    defineField({
      name: "order",
      title: "Порядок отображения",
      type: "number",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "photo" },
    prepare({ title, subtitle, media }) {
      const cats: Record<string, string> = {
        "hall-of-fame": "Зал славы",
        history: "История",
        archive: "Экспонаты",
      };
      return { title, subtitle: cats[subtitle] ?? subtitle, media };
    },
  },
  orderings: [
    { title: "По порядку", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
});
