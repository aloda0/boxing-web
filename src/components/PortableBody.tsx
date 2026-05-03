import { PortableText, type PortableTextComponents } from "@portabletext/react";

function componentsForTone(tone: "dark" | "light"): PortableTextComponents {
  const isLight = tone === "light";
  return {
    block: {
      normal: ({ children }) => (
        <p
          className={
            isLight ? "mb-4 leading-relaxed text-zinc-700" : "mb-4 leading-relaxed text-zinc-200"
          }
        >
          {children}
        </p>
      ),
      h2: ({ children }) => (
        <h2
          className={
            isLight
              ? "mb-4 mt-10 text-2xl font-semibold tracking-tight text-zinc-900"
              : "mb-4 mt-10 text-2xl font-semibold tracking-tight text-white"
          }
        >
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3
          className={
            isLight ? "mb-3 mt-8 text-xl font-semibold text-zinc-900" : "mb-3 mt-8 text-xl font-semibold text-white"
          }
        >
          {children}
        </h3>
      ),
      blockquote: ({ children }) => (
        <blockquote
          className={
            isLight
              ? "border-l-4 border-accent/50 pl-4 italic text-zinc-600"
              : "border-l-4 border-accent/70 pl-4 italic text-zinc-300"
          }
        >
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul
          className={
            isLight ? "mb-4 list-disc space-y-2 pl-6 text-zinc-700" : "mb-4 list-disc space-y-2 pl-6 text-zinc-200"
          }
        >
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol
          className={
            isLight ? "mb-4 list-decimal space-y-2 pl-6 text-zinc-700" : "mb-4 list-decimal space-y-2 pl-6 text-zinc-200"
          }
        >
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
      number: ({ children }) => <li className="leading-relaxed">{children}</li>,
    },
    marks: {
      strong: ({ children }) => (
        <strong className={isLight ? "font-semibold text-zinc-900" : "font-semibold text-white"}>{children}</strong>
      ),
      em: ({ children }) => <em className="italic">{children}</em>,
      link: ({ children, value }) => {
        const href = value?.href as string | undefined;
        if (!href) return <>{children}</>;
        const external = href.startsWith("http");
        return (
          <a
            href={href}
            className="text-accent-muted underline decoration-accent/40 underline-offset-4 transition hover:text-accent-soft"
            {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
          >
            {children}
          </a>
        );
      },
    },
  };
}

type Props = { value: unknown; tone?: "dark" | "light" };

export function PortableBody({ value, tone = "dark" }: Props) {
  if (!value || !Array.isArray(value)) return null;
  return <PortableText value={value} components={componentsForTone(tone)} />;
}
