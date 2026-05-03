import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Главная страница",
  type: "document",
  groups: [
    { name: "main", title: "Главный экран", default: true },
    { name: "extra", title: "Дополнительно" },
  ],
  fields: [
    defineField({
      name: "heroTitle",
      title: "Большой заголовок",
      type: "string",
      group: "main",
      description: "Текст поверх баннера. Обычно: название федерации.",
      validation: (Rule) => Rule.required(),
      initialValue: "Федерация бокса Югры",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Подзаголовок",
      type: "text",
      rows: 4,
      group: "main",
      description: "Текст чуть мельче под заголовком.",
      initialValue:
        "Официальный сайт региональной общественной организации Ханты-Мансийского автономного округа — Югры.",
    }),
    defineField({
      name: "heroImage",
      title: "Фоновая картинка",
      type: "image",
      group: "main",
      description: "Широкое фото для баннера. Можно перетащить файл сюда.",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroLinks",
      title: "Кнопки под баннером",
      type: "array",
      group: "main",
      description: "Необязательно. Название кнопки и ссылка на раздел (например /news).",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Текст на кнопке",
              type: "string",
            },
            {
              name: "href",
              title: "Ссылка",
              type: "string",
              description: "Например: /news или /calendar",
            },
          ],
          preview: {
            select: { title: "label", subtitle: "href" },
          },
        },
      ],
    }),
    defineField({
      name: "metaTitle",
      title: "Заголовок страницы в Google",
      type: "string",
      group: "extra",
      description: "Если не заполнено — подставится название сайта.",
    }),
    defineField({
      name: "metaDescription",
      title: "Описание для поиска",
      type: "text",
      rows: 3,
      group: "extra",
      description: "Коротко, о чём сайт — для поисковиков.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Главная страница" };
    },
  },
});
