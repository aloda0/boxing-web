import type { SchemaTypeDefinition } from "sanity";
import { blockContent } from "./blockContent";
import { homePage } from "./homePage";
import { newsArticle } from "./newsArticle";
import { calendarEvent } from "./calendarEvent";
import { teamDoc } from "./teamDoc";
import { competitionResult } from "./competitionResult";
import { regulationDoc } from "./regulationDoc";
import { reportDoc } from "./reportDoc";
import { callDoc } from "./callDoc";

export const schemaTypes: SchemaTypeDefinition[] = [
  blockContent,
  homePage,
  newsArticle,
  calendarEvent,
  teamDoc,
  competitionResult,
  regulationDoc,
  reportDoc,
  callDoc,
];
