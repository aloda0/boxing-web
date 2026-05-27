export const homePageQuery = `*[_type == "homePage" && _id == "homePage"][0]{
  heroTitle,
  heroSubtitle,
  heroImage,
  heroLinks,
  metaTitle,
  metaDescription
}`;

export const latestNewsQuery = `*[_type == "newsArticle"] | order(publishedAt desc)[0...8]{
  _id,
  title,
  slug,
  publishedAt,
  coverImage,
  "coverImageAspectRatio": coverImage.asset->metadata.dimensions.aspectRatio
}`;

export const allNewsQuery = `*[_type == "newsArticle"] | order(publishedAt desc){
  _id,
  title,
  slug,
  publishedAt,
  coverImage,
  "coverImageAspectRatio": coverImage.asset->metadata.dimensions.aspectRatio
}`;

export const newsBySlugQuery = `*[_type == "newsArticle" && slug.current == $slug][0]{
  title,
  slug,
  publishedAt,
  coverImage,
  body
}`;

export const calendarEventsQuery = `*[_type == "calendarEvent"] | order(eventDate asc){
  _id,
  "eventName": coalesce(competitionName, title),
  eventDate,
  location,
  description,
  "attachmentUrl": attachment.asset->url,
  "attachmentName": attachment.asset->originalFilename
}`;

export const teamDocsQuery = `*[_type == "teamDoc"] | order(publishedAt desc){
  _id,
  title,
  publishedAt,
  shortDescription,
  "fileUrl": file.asset->url,
  "fileName": file.asset->originalFilename
}`;

export const competitionResultsQuery = `*[_type == "competitionResult"] | order(eventDate desc){
  _id,
  title,
  slug,
  eventDate,
  location,
  summary,
  resultsText,
  resultRows,
  winners,
  "finalUrl": finalDocument.asset->url,
  "finalName": finalDocument.asset->originalFilename
}`;

export const competitionResultBySlugQuery = `*[_type == "competitionResult" && slug.current == $slug][0]{
  title,
  slug,
  eventDate,
  location,
  summary,
  resultsText,
  resultRows,
  winners,
  "finalUrl": finalDocument.asset->url,
  "finalName": finalDocument.asset->originalFilename
}`;

export const regulationDocsQuery = `*[_type == "regulationDoc"] | order(docDate desc){
  _id,
  title,
  slug,
  docDate,
  shortDescription,
  "fileUrl": file.asset->url,
  "fileName": file.asset->originalFilename
}`;

export const reportDocsQuery = `*[_type == "reportDoc"] | order(docDate desc){
  _id,
  title,
  slug,
  docDate,
  shortDescription,
  "fileUrl": file.asset->url,
  "fileName": file.asset->originalFilename
}`;

export const latestDocumentsQuery = `{
  "regulations": *[_type == "regulationDoc"] | order(docDate desc)[0...3]{ _id, title, slug, docDate, shortDescription, "fileUrl": file.asset->url },
  "reports": *[_type == "reportDoc"] | order(docDate desc)[0...3]{ _id, title, slug, docDate, shortDescription, "fileUrl": file.asset->url }
}`;

// О нас
export const leadersQuery = `*[_type == "leader"] | order(order asc, _createdAt asc){
  _id,
  name,
  role,
  photo,
  bio
}`;

export const coachesQuery = `*[_type == "coach"] | order(order asc, _createdAt asc){
  _id,
  name,
  specialization,
  photo,
  bio
}`;

export const orgDocsQuery = `*[_type == "orgDoc"] | order(docDate desc){
  _id,
  title,
  slug,
  docDate,
  shortDescription,
  "fileUrl": file.asset->url
}`;

// Музей Югры
export const museumEntriesQuery = `*[_type == "museumEntry"] | order(order asc, _createdAt asc){
  _id,
  title,
  category,
  photo,
  description,
  achievementDate
}`;

// Удар на силу
export const udarNaSiluEventsQuery = `*[_type == "udarNaSiluEvent"] | order(eventDate desc){
  _id,
  title,
  slug,
  eventDate,
  location,
  coverImage,
  description,
  "resultsFileUrl": resultsFile.asset->url
}`;
