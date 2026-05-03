import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { GlovesLayer } from "@/components/GlovesLayer";
import { PearLayer } from "@/components/PearLayer";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Федерация бокса Югры",
    template: "%s · Федерация бокса Югры",
  },
  description:
    "Официальный сайт Федерации бокса Ханты-Мансийского автономного округа — Югры: новости, календарь, сборная, документы.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Федерация бокса Югры",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${manrope.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-transparent font-sans text-zinc-100 antialiased">
        <div
          className="bg-app pointer-events-none fixed inset-0 z-[-1]"
          aria-hidden
        />
        <div
          className="pointer-events-none fixed inset-0 z-[-1]"
          aria-hidden
        >
          <div className="absolute inset-0 bg-depth" />
          <div className="absolute inset-0 noise-soft" />
        </div>
        <GlovesLayer />
        <PearLayer />
        <SiteHeader />
        <div className="relative z-0 flex flex-1 flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
