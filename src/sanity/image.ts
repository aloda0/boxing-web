import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "./client";

const builder = createImageUrlBuilder(client);

export function urlForImage(source: SanityImageSource | null | undefined) {
  if (!source) return null;
  return builder.image(source).auto("format").fit("max");
}
