import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../../sanity/env";

export const isSanityConfigured = Boolean(projectId.length > 0);

/**
 * Когда projectId не задан, запросы не выполняются (см. safeFetch в data.ts).
 * Формально нужен валидный формат id (a-z, 0-9, дефисы); реальные запросы не уходят при isSanityConfigured === false.
 */
export const client = createClient({
  projectId: projectId || "invalid-id",
  dataset,
  apiVersion,
  useCdn: false, // build-time fetch must bypass CDN cache to get fresh data
});
