import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import { urlForImage } from "@/sanity/image";

type Props = {
  image: unknown;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
};

export function SanityImage({
  image,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority,
  fill,
  width = 1200,
  height = 675,
}: Props) {
  const built = urlForImage(image as SanityImageSource);
  const url = built?.width(fill ? 1920 : width).height(fill ? 1080 : height).url();

  if (!url) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-950 text-zinc-500 ${
          fill ? "absolute inset-0 min-h-full w-full" : "min-h-[200px] w-full"
        } ${className ?? ""}`}
        aria-hidden
      >
        <span className="text-sm">Нет фото</span>
      </div>
    );
  }

  if (fill) {
    return (
      <Image src={url} alt={alt} fill className={className} sizes={sizes} priority={priority} />
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}
