import { client, isSanityConfigured } from "@/sanity/client";
import {
  allNewsQuery,
  calendarEventsQuery,
  competitionResultBySlugQuery,
  competitionResultsQuery,
  coachesQuery,
  homePageQuery,
  latestDocumentsQuery,
  latestNewsQuery,
  leadersQuery,
  museumEntriesQuery,
  newsBySlugQuery,
  orgDocsQuery,
  regulationDocsQuery,
  reportDocsQuery,
  teamDocsQuery,
  udarNaSiluEventsQuery,
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

export async function getLatestDocuments() {
  return safeFetch<LatestDocs>(latestDocumentsQuery);
}

// О нас
export async function getLeaders() {
  const data = await safeFetch<Leader[]>(leadersQuery);
  return data ?? [];
}

export async function getCoaches() {
  const data = await safeFetch<Coach[]>(coachesQuery);
  return data ?? [];
}

export async function getOrgDocs() {
  const data = await safeFetch<DocCard[]>(orgDocsQuery);
  return data ?? [];
}

// Музей Югры
export async function getMuseumEntries() {
  const data = await safeFetch<MuseumEntry[]>(museumEntriesQuery);
  return data ?? [];
}

// Удар на силу
export async function getUdarNaSiluEvents() {
  const data = await safeFetch<UdarNaSiluEvent[]>(udarNaSiluEventsQuery);
  return data ?? [];
}

// ===== TYPES =====

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

export type LatestDocs = {
  regulations?: DocCard[];
  reports?: DocCard[];
};

export type Leader = {
  _id: string;
  name?: string | null;
  role?: string | null;
  photo?: unknown;
  bio?: string | null;
};

export type Coach = {
  _id: string;
  name?: string | null;
  specialization?: string | null;
  photo?: unknown;
  bio?: string | null;
};

export type MuseumEntry = {
  _id: string;
  title?: string | null;
  category?: string | null;
  photo?: unknown;
  description?: unknown;
  achievementDate?: string | null;
};

export type UdarNaSiluEvent = {
  _id: string;
  title?: string | null;
  slug?: { current?: string | null } | null;
  eventDate?: string | null;
  location?: string | null;
  coverImage?: unknown;
  description?: unknown;
  resultsFileUrl?: string | null;
};
