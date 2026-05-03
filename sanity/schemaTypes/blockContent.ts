import { defineType } from "sanity";

/** Простой текст для новостей и описаний — без лишних режимов. */
export const blockContent = defineType({
  name: "blockContent",
  title: "Текст",
  type: "array",
  of: [
    {
      type: "block",
      styles: [
        { title: "Обычный текст", value: "normal" },
        { title: "Заголовок", value: "h2" },
        { title: "Подзаголовок", value: "h3" },
      ],
      lists: [
        { title: "Маркированный список", value: "bullet" },
        { title: "Нумерованный список", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Жирный", value: "strong" },
          { title: "Курсив", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Ссылка",
            fields: [
              {
                name: "href",
                type: "url",
                title: "Адрес ссылки",
                validation: (Rule) =>
                  Rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
              },
            ],
          },
        ],
      },
    },
  ],
});
