import { defineField, defineType } from "sanity";

export const coach = defineType({
  name: "coach",
  title: "Тренерский состав",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "ФИО",
      type: "string",
      validation: (Rule) => Rule.required().error("Укажите ФИО"),
    }),
    defineField({
      name: "specialization",
      title: "Специализация / категория",
      type: "string",
      description: "Например: Тренер по боксу, Старший тренер, Тренер юношей",
    }),
    defineField({
      name: "photo",
      title: "Фото",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "bio",
      title: "Описание",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "order",
      title: "Порядок отображения",
      type: "number",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "specialization", media: "photo" },
  },
  orderings: [
    { title: "По порядку", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
});
