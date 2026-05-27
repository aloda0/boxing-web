import type { StructureResolver } from "sanity/structure";

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

      // О нас
      S.listItem()
        .title("О нас")
        .child(
          S.list()
            .title("О нас")
            .items([
              S.listItem().title("Руководство").schemaType("leader")
                .child(S.documentTypeList("leader").title("Руководство")
                  .defaultOrdering([{ field: "order", direction: "asc" }])),
              S.listItem().title("Тренерский состав").schemaType("coach")
                .child(S.documentTypeList("coach").title("Тренерский состав")
                  .defaultOrdering([{ field: "order", direction: "asc" }])),
              S.listItem().title("Документы организации").schemaType("orgDoc")
                .child(S.documentTypeList("orgDoc").title("Документы организации")
                  .defaultOrdering([{ field: "docDate", direction: "desc" }])),
            ]),
        ),

      S.divider(),

      // Новости
      S.listItem().title("Новости").schemaType("newsArticle")
        .child(S.documentTypeList("newsArticle").title("Новости")
          .defaultOrdering([{ field: "publishedAt", direction: "desc" }])),

      S.divider(),

      // Документация
      S.listItem()
        .title("Документация")
        .child(
          S.list()
            .title("Документация")
            .items([
              S.listItem().title("Календарный план").schemaType("calendarEvent")
                .child(S.documentTypeList("calendarEvent").title("Календарный план")
                  .defaultOrdering([{ field: "eventDate", direction: "desc" }])),
              S.listItem().title("Сборная команда (документы)").schemaType("teamDoc")
                .child(S.documentTypeList("teamDoc").title("Сборная команда")
                  .defaultOrdering([{ field: "publishedAt", direction: "desc" }])),
              S.listItem().title("Результаты соревнований").schemaType("competitionResult")
                .child(S.documentTypeList("competitionResult").title("Результаты")
                  .defaultOrdering([{ field: "eventDate", direction: "desc" }])),
              S.listItem().title("Положение соревнований").schemaType("regulationDoc")
                .child(S.documentTypeList("regulationDoc").title("Положения")
                  .defaultOrdering([{ field: "docDate", direction: "desc" }])),
              S.listItem().title("Отчёты соревнований").schemaType("reportDoc")
                .child(S.documentTypeList("reportDoc").title("Отчёты")
                  .defaultOrdering([{ field: "docDate", direction: "desc" }])),
            ]),
        ),

      S.divider(),

      // Проекты
      S.listItem().title("Музей Югры").schemaType("museumEntry")
        .child(S.documentTypeList("museumEntry").title("Музей Югры")
          .defaultOrdering([{ field: "order", direction: "asc" }])),

      S.listItem().title("Удар на силу").schemaType("udarNaSiluEvent")
        .child(S.documentTypeList("udarNaSiluEvent").title("Удар на силу — события")
          .defaultOrdering([{ field: "eventDate", direction: "desc" }])),
    ]);
