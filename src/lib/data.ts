import { client, isSanityConfigured } from "@/sanity/client";
import {
  allNewsQuery,
  calendarEventsQuery,
  callBySlugQuery,
  callDocsQuery,
  competitionResultBySlugQuery,
  competitionResultsQuery,
  homePageQuery,
  teamDocsQuery,
  latestDocumentsQuery,
  latestNewsQuery,
  newsBySlugQuery,
  regulationDocsQuery,
  reportDocsQuery,
} from "@/sanity/queries";

async function safeFetch<T>(query: string, params?: Record<string, unknown>): Promise<T | null> {
  if (!isSanityConfigured) return null;
  try {
    return await client.fetch<T>(query, params ?? {});
  } catch {
    return null;
  }
}

export async function getHomePage() {
  return safeFetch<HomePage>(homePageQuery);
}

export async function getLatestNews() {
  const data = await safeFetch<NewsCard[]>(latestNewsQuery);
  return data ?? [];
}

export async function getAllNews() {
  const data = await safeFetch<NewsCard[]>(allNewsQuery);
  return data ?? [];
}

export async function getNewsBySlug(slug: string) {
  return safeFetch<NewsDetail | null>(newsBySlugQuery, { slug });
}

export async function getCalendarEvents() {
  const data = await safeFetch<CalendarEvent[]>(calendarEventsQuery);
  return data ?? [];
}

export async function getTeamDocs() {
  const data = await safeFetch<TeamDoc[]>(teamDocsQuery);
  return data ?? [];
}

export async function getCompetitionResults() {
  const data = await safeFetch<CompetitionResultCard[]>(competitionResultsQuery);
  return data ?? [];
}

export async function getCompetitionResultBySlug(slug: string) {
  return safeFetch<CompetitionResultDetail | null>(competitionResultBySlugQuery, { slug });
}

export async function getRegulationDocs() {
  const data = await safeFetch<DocCard[]>(regulationDocsQuery);
  return data ?? [];
}

export async function getReportDocs() {
  const data = await safeFetch<DocCard[]>(reportDocsQuery);
  return data ?? [];
}

export async function getCallDocs() {
  const data = await safeFetch<CallCard[]>(callDocsQuery);
  return data ?? [];
}

export async function getCallBySlug(slug: string) {
  return safeFetch<CallDetail | null>(callBySlugQuery, { slug });
}

export async function getLatestDocuments() {
  return safeFetch<LatestDocs>(latestDocumentsQuery);
}

export type HomePage = {
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroImage?: unknown;
  heroLinks?: { label?: string | null; href?: string | null }[] | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

export type NewsCard = {
  _id: string;
  title?: string | null;
  slug?: { current?: string | null } | null;
  publishedAt?: string | null;
  coverImage?: unknown;
  coverImageAspectRatio?: number | null;
};

export type NewsDetail = NewsCard & {
  body?: unknown;
};

export type CalendarEvent = {
  _id: string;
  eventName?: string | null;
  eventDate?: string | null;
  location?: string | null;
  description?: unknown;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
};

export type TeamDoc = {
  _id: string;
  title?: string | null;
  publishedAt?: string | null;
  shortDescription?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
};

export type CompetitionResultCard = {
  _id: string;
  title?: string | null;
  slug?: { current?: string | null } | null;
  eventDate?: string | null;
  location?: string | null;
  summary?: string | null;
  resultsText?: string | null;
  resultRows?: { line?: string | null }[] | null;
  winners?: string | null;
  finalUrl?: string | null;
  finalName?: string | null;
};

export type CompetitionResultDetail = CompetitionResultCard;

export type DocCard = {
  _id: string;
  title?: string | null;
  slug?: { current?: string | null } | null;
  docDate?: string | null;
  shortDescription?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
};

export type CallCard = DocCard & {
  description?: string | null;
};

export type CallDetail = {
  title?: string | null;
  slug?: { current?: string | null } | null;
  docDate?: string | null;
  description?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
};

export type LatestDocs = {
  regulations?: DocCard[];
  reports?: DocCard[];
  calls?: DocCard[];
};
