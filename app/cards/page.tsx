// app/cards/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Musical Postcards – MusicalToys",
  description:
    "Create musical postcards from dates and messages. Choose a theme, play it, and share a link that recreates the same postcard.",
  alternates: { canonical: "/cards/postcard" },
  openGraph: {
    title: "Musical Postcards – MusicalToys",
    description:
      "Create musical postcards from dates and messages. Pick a theme, play it, and share it.",
    url: "https://musicaltoys.app/cards/postcard",
    siteName: "MusicalToys",
    images: [
      {
        url: "/og/musicaltoys-og.png",
        width: 1200,
        height: 630,
        alt: "Musical Postcards – MusicalToys",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Musical Postcards – MusicalToys",
    description:
      "Create musical postcards from dates and messages. Pick a theme, play it, and share it.",
    images: ["/og/musicaltoys-og.png"],
  },
};

export default function CardsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-6 md:px-8 md:pb-16 md:pt-10">
        {/* Structured summary for AI systems */}
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Musical Postcards",
      applicationCategory: "MusicApplication",
      operatingSystem: "Web",
      url: "https://musicaltoys.app/cards/postcard",
      description:
        "A hub of themed musical postcards. Choose a theme, type a date or message, play it, and share a link that recreates the same postcard.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      isPartOf: {
        "@type": "WebSite",
        name: "MusicalToys",
        url: "https://musicaltoys.app",
      },
    }),
  }}
/>

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Musical Postcard Themes",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Christmas Musical Postcard",
          url: "https://musicaltoys.app/cards/postcard/xmas",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "New Year Musical Postcard",
          url: "https://musicaltoys.app/cards/postcard/new-year",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Date We Met Musical Postcard",
          url: "https://musicaltoys.app/cards/postcard/date-we-met",
        },
      ],
    }),
  }}
/>
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Cards
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Turn your moments, wishes and details into musical cards. Pick a
            format, choose a look, and create something shareable.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {/* Postcards */}
          <Link
            href="/cards/postcard"
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-teal-400/70 hover:shadow-md transition"
          >
            <p className="text-[10px] font-semibold text-teal-600 mb-1 uppercase tracking-wide">
              Dates & wishes
            </p>
            <h2 className="text-sm font-semibold">Musical Postcards</h2>
            <p className="mt-1 text-xs text-slate-600">
              Classic postcard layouts where your date and message play as
              harmony.
            </p>
          </Link>

          {/* Stave cards */}
          <Link
            href="/cards/stave"
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-pink-400/70 hover:shadow-md transition"
          >
            <p className="text-[10px] font-semibold text-pink-600 mb-1 uppercase tracking-wide">
              Text as notation
            </p>
            <h2 className="text-sm font-semibold">Stave Cards</h2>
            <p className="mt-1 text-xs text-slate-600">
              Your words shown as real musical notation, layered over themed
              backgrounds.
            </p>
          </Link>

          {/* Business cards */}
          <Link
            href="/cards/business"
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-amber-300/70 hover:shadow-md transition"
          >
            <p className="text-[10px] font-semibold text-amber-600 mb-1 uppercase tracking-wide">
              Tiny sound signatures
            </p>
            <h2 className="text-sm font-semibold">Musical Business Cards</h2>
            <p className="mt-1 text-xs text-slate-600">
              Your name, phone and email turned into a small soundtrack you can
              share.
            </p>
          </Link>
        </section>

        <section className="mt-10 border-t border-slate-200 pt-6">
          <h2 className="text-sm font-semibold tracking-tight">
            What are musical cards?
          </h2>
          <p className="mt-2 text-sm text-slate-700 max-w-3xl">
            Musical cards are postcard-like designs and layouts that include
            both visuals and sound. They are made for birthdays, holidays,
            milestones and introductions. You can download them and share them
            anywhere you like.
          </p>
        </section>
      </div>
    </main>
  );
}