import type { Metadata } from "next";
import Link from "next/link";
import { SanityImage } from "@/components/SanityImage";
import { formatDateRu } from "@/lib/format";
import { getAllNews } from "@/lib/data";

export const metadata: Metadata = {
  title: "Новости",
  description: "Новости Федерации бокса Югры: события, турниры, объявления.",
};

export default async function NewsPage() {
  const items = await getAllNews();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6 lg:py-20">
      <h1 className="text-4xl font-bold tracking-tight text-white">Новости</h1>
      <p className="mt-3 text-zinc-400">Актуальные материалы федерации</p>

      <div className="mt-10">
        {items.length === 0 ? (
          <p className="text-zinc-400">Пока нет опубликованных новостей.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const slug = item.slug?.current;
              return (
                <Link
                  key={item._id}
                  href={slug ? `/news/${slug}` : "#"}
                  className="group relative block overflow-hidden rounded-xl border border-white/10 bg-black/30 shadow-md transition hover:-translate-y-0.5 hover:border-white/20"
                >
                  {/* Фото */}
                  <div className="relative h-44 w-full overflow-hidden bg-white/5 sm:h-48">
                    <SanityImage
                      image={item.coverImage}
                      alt=""
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  {/* Текст */}
                  <div className="p-4">
                    {item.publishedAt ? (
                      <p className="mb-1.5 text-[11px] font-medium text-zinc-500">
                        {formatDateRu(item.publishedAt)}
                      </p>
                    ) : null}
                    <h2 className="line-clamp-3 text-sm font-semibold leading-snug text-white transition group-hover:text-[#E03A3A]">
                      {item.title}
                    </h2>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
