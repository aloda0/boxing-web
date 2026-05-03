import { defineField, defineType } from "sanity";

export const calendarEvent = defineType({
  name: "calendarEvent",
  title: "Событие календарного плана",
  type: "document",
  fields: [
    defineField({
      name: "competitionName",
      title: "Название события",
      type: "string",
      description: "Например: Чемпионат Югры, семинар для тренеров.",
      validation: (Rule) => Rule.required().error("Укажите название"),
    }),
    defineField({
      name: "eventDate",
      title: "Дата и время",
      type: "datetime",
      description: "Когда проходит событие.",
      validation: (Rule) => Rule.required().error("Укажите дату"),
    }),
    defineField({
      name: "location",
      title: "Место проведения",
      type: "string",
      description: "Город, зал, адрес — как вам удобно.",
    }),
    defineField({
      name: "description",
      title: "Описание",
      type: "blockContent",
      description: "Расскажите подробности простым текстом.",
    }),
    defineField({
      name: "attachment",
      title: "Файл",
      type: "file",
      description: "Если нужен документ — загрузите PDF или Word. Не обязательно.",
      options: {
        accept:
          "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    }),
  ],
  preview: {
    select: { title: "competitionName", date: "eventDate", place: "location" },
    prepare({ title, date, place }) {
      return {
        title,
        subtitle: [date && new Date(date).toLocaleString("ru-RU"), place].filter(Boolean).join(" · "),
      };
    },
  },
  orderings: [
    {
      title: "По дате (сначала ближайшие)",
      name: "eventDateAsc",
      by: [{ field: "eventDate", direction: "asc" }],
    },
  ],
});
