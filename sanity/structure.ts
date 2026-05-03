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
      S.documentTypeListItem("newsArticle").title("Новости"),
      S.documentTypeListItem("calendarEvent").title("Календарный план"),
      S.documentTypeListItem("teamDoc").title("Сборная команда (документы)"),
      S.documentTypeListItem("competitionResult").title("Результаты соревнований"),
      S.documentTypeListItem("regulationDoc").title("Положение соревнований"),
      S.documentTypeListItem("reportDoc").title("Отчёты соревнований"),
      S.documentTypeListItem("callDoc").title("Вызовы"),
    ]);
