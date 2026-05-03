import type { ReactNode } from "react";

export function GlassCard({
  children,
  className = "",
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`surface-glass rounded-2xl p-6 ${
        hover
          ? "transition duration-200 hover:-translate-y-0.5 hover:border-[#E03A3A]/55 hover:shadow-[0_20px_70px_rgba(0,0,0,0.26)]"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
