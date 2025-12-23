// app/today/page.tsx
import type { Metadata } from "next";
import TodayClient from "./TodayClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Today – A Daily Musical Moment",
  description:
    "Today plays today’s date as a short musical phrase. One day, one sound, no archive.",
  alternates: { canonical: "/today" },
};

export default function TodayPage() {
  return (
    <main>
      {/* Minimal anchor sentence for crawlers (no UI impact) */}
      <p className="sr-only">Today plays today’s date as a short piece of music.</p>

      {/* Structured summary for AI systems */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Today",
            url: "https://musicaltoys.app/today",
            description:
              "Today is a single-page experience that turns the current date into a short piece of music, with no archive or interaction beyond the day itself.",
            isPartOf: {
              "@type": "WebSite",
              name: "MusicalToys",
              url: "https://musicaltoys.app",
            },
          }),
        }}
      />

      <TodayClient />
    </main>
  );
}