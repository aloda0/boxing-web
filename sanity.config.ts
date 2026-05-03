import { ruKZLocale } from "@sanity/locale-ru-kz";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import {
  apiVersion,
  assertSanityProjectIdForStudio,
  dataset,
  projectId,
} from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

assertSanityProjectIdForStudio();

function slugCurrent(doc: unknown): string | undefined {
  if (!doc || typeof doc !== "object") return undefined;
  const slug = (doc as { slug?: { current?: string } }).slug;
  return slug?.current;
}

export default defineConfig({
  name: "boxing-yugra",
  title: "Редактор сайта · Бокс Югры",
  projectId,
  dataset,
  apiVersion,
  basePath: "/studio",
  plugins: [ruKZLocale(), structureTool({ structure })],
  schema: {
    types: schemaTypes,
  },
  document: {
    productionUrl: async (prev, context) => {
      const base =
        typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL
          ? process.env.NEXT_PUBLIC_SITE_URL
          : "http://localhost:3000";
      const doc = context.document as { _type?: string } | null;
      const slug = slugCurrent(doc);
      if (!slug || !doc?._type) return prev;

      if (doc._type === "newsArticle") {
        return `${base.replace(/\/$/, "")}/news/${slug}`;
      }
      if (doc._type === "competitionResult") {
        return `${base.replace(/\/$/, "")}/results/${slug}`;
      }
      if (doc._type === "callDoc") {
        return `${base.replace(/\/$/, "")}/calls/${slug}`;
      }
      return prev;
    },
  },
});
