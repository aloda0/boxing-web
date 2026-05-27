"use client";

import Link from "next/link";
import { SanityImage } from "@/components/SanityImage";
import { formatDateRu } from "@/lib/format";
import { useEffect, useRef, useState } from "react";

interface NewsItem {
  _id: string;
  title?: string | null;
  slug?: { current?: string | null } | null;
  publishedAt?: string | null;
  coverImage?: unknown;
  coverImageAspectRatio?: number | null;
}

interface Props {
  items: NewsItem[];
}

export function NewsSlider({ items }: Props) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const count = items.length;
  // На десктопе показываем 2 карточки: current и current+1
  const second = count > 1 ? (current + 1) % count : -1;

  const goTo = (idx: number) => {
    if (idx === current) return;
    setFading(true);
    setTimeout(() => {
      setCurrent(idx);
      setFading(false);
    }, 280);
  };

  const advance = () => {
    setFading(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % count);
      setFading(false);
    }, 280);
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, 15000);
  };

  useEffect(() => {
    if (count < 2) return;
    timerRef.current = setInterval(advance, 15000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  if (!items.length) return null;

  const Card = ({ item }: { item: NewsItem }) => {
    const slug = item.slug?.current;
    return (
      <Link
        href={slug ? `/news/${slug}` : "#"}
        className="group relative block h-full min-h-[340px] overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-[0_18px_44px_rgba(0,0,0,0.36)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5 sm:min-h-[380px] lg:min-h-[420px]"
      >
        {/* Фото */}
        <div className="absolute inset-0">
          <SanityImage
            image={item.coverImage}
            alt=""
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width:768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
        </div>

        {/* Контент */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
          {item.publishedAt ? (
            <p className="mb-2 text-xs font-medium text-white/50">
              {formatDateRu(item.publishedAt)}
            </p>
          ) : null}
          <h3 className="text-base font-semibold leading-snug text-white transition group-hover:text-[#E03A3A] sm:text-lg lg:text-xl">
            {item.title}
          </h3>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-white/40 transition group-hover:text-white/60">
            Читать →
          </span>
        </div>
      </Link>
    );
  };

  return (
    <div className="space-y-4">
      {/* Карточки */}
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        style={{
          opacity: fading ? 0 : 1,
          transition: "opacity 0.28s ease",
        }}
      >
        <Card item={items[current]} />
        {second >= 0 ? <Card item={items[second]} /> : null}
      </div>

      {/* Навигация — точки */}
      {count > 2 ? (
        <div className="flex items-center justify-center gap-2 pt-1">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Новость ${i + 1}`}
              onClick={() => {
                goTo(i);
                resetTimer();
              }}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === current ? "1.75rem" : "0.375rem",
                background: i === current ? "#C62828" : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
