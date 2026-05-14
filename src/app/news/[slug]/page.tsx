import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableBody } from "@/components/PortableBody";
import { SanityImage } from "@/components/SanityImage";
import { formatDateRu } from "@/lib/format";
import { ogImageFromSanity } from "@/lib/og";
import { getAllNews, getNewsBySlug } from "@/lib/data";

export const dynamicParams = false;

export async function generateStaticParams() {
  const articles = await getAllNews();
  const slugs = articles
    .map((a) => a.slug?.current)
    .filter((s): s is string => Boolean(s));
  return (slugs.length > 0 ? slugs : ["_"]).map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) {
    return { title: "Новость не найдена" };
  }
  const title = article.title || "Новость";
  const description = title;
  const og = ogImageFromSanity(article.coverImage);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.publishedAt ?? undefined,
      images: og ? [{ url: og, width: 1200, height: 630, alt: title }] : undefined,
    },
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) notFound();

  const title = article.title || "Без заголовка";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14 lg:px-6 lg:py-20">
      <article className="news-detail-black-card rounded-3xl p-5 sm:p-8">
        <p className="text-sm text-zinc-400">
          {article.publishedAt ? formatDateRu(article.publishedAt) : ""}
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:mt-4 sm:text-3xl md:text-4xl">
          {title}
        </h1>
        {article.coverImage ? (
          <div className="media-article mt-10">
            <SanityImage
              image={article.coverImage}
              alt={title}
              fill
              className="media-article-image"
              sizes="100vw"
              priority
            />
          </div>
        ) : null}
        <div className="mt-8 max-w-none sm:mt-10">
          <PortableBody value={article.body} tone="dark" />
        </div>
      </article>
    </div>
  );
}
