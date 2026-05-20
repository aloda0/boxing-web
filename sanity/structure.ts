import type { StructureResolver } from "sanity/structure";

/** Простое меню: только нужные разделы, без лишних пунктов. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Сайт")
    .items([
      S.listItem()
        .title("Главная страница")
        .id("homePage")
        .child(
          S.document()
            .schemaType("homePage")
            .documentId("homePage")
            .title("Баннер и текст на главной"),
        ),
      S.divider(),
      S.listItem().title("Новости").schemaType("newsArticle")
        .child(S.documentTypeList("newsArticle").title("Новости")
          .defaultOrdering([{ field: "publishedAt", direction: "desc" }])),
      S.listItem().title("Календарный план").schemaType("calendarEvent")
        .child(S.documentTypeList("calendarEvent").title("Календарный план")
          .defaultOrdering([{ field: "eventDate", direction: "desc" }])),
      S.listItem().title("Сборная команда (документы)").schemaType("teamDoc")
        .child(S.documentTypeList("teamDoc").title("Сборная команда (документы)")
          .defaultOrdering([{ field: "publishedAt", direction: "desc" }])),
      S.listItem().title("Результаты соревнований").schemaType("competitionResult")
        .child(S.documentTypeList("competitionResult").title("Результаты соревнований")
          .defaultOrdering([{ field: "eventDate", direction: "desc" }])),
      S.listItem().title("Положение соревнований").schemaType("regulationDoc")
        .child(S.documentTypeList("regulationDoc").title("Положение соревнований")
          .defaultOrdering([{ field: "docDate", direction: "desc" }])),
      S.listItem().title("Отчёты соревнований").schemaType("reportDoc")
        .child(S.documentTypeList("reportDoc").title("Отчёты соревнований")
          .defaultOrdering([{ field: "docDate", direction: "desc" }])),
      S.listItem().title("Вызовы").schemaType("callDoc")
        .child(S.documentTypeList("callDoc").title("Вызовы")
          .defaultOrdering([{ field: "docDate", direction: "desc" }])),
    ]);
