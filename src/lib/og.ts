import type { SanityImageSource } from "@sanity/image-url";
import { urlForImage } from "@/sanity/image";

export function ogImageFromSanity(image: unknown): string | undefined {
  const u = urlForImage(image as SanityImageSource)?.width(1200).height(630).url();
  return u ?? undefined;
}
