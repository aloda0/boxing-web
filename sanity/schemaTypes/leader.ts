import { defineField, defineType } from "sanity";

export const leader = defineType({
  name: "leader",
  title: "Руководство",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "ФИО",
      type: "string",
      validation: (Rule) => Rule.required().error("Укажите ФИО"),
    }),
    defineField({
      name: "role",
      title: "Должность",
      type: "string",
      validation: (Rule) => Rule.required().error("Укажите должность"),
    }),
    defineField({
      name: "photo",
      title: "Фото",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "bio",
      title: "Биография / описание",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "order",
      title: "Порядок отображения",
      type: "number",
      description: "Меньше — выше в списке. Оставьте пустым для автосортировки.",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
  orderings: [
    { title: "По порядку", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
});
