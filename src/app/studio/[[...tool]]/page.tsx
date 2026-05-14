import { StudioClient } from "./_StudioClient";

// Pre-render /studio as a static shell — Sanity Studio boots client-side
export function generateStaticParams() {
  return [{ tool: [] as string[] }];
}

export default function StudioPage() {
  return <StudioClient />;
}
