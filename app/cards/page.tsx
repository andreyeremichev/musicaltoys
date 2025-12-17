// app/cards/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Musical Cards – MusicalToys",
  description:
    "Create musical postcards, stave cards, and musical business cards. Pick a format, play it, and share a link that recreates the same card.",
  alternates: { canonical: "/cards" },
  openGraph: {
    title: "Musical Cards – MusicalToys",
    description:
      "Create musical postcards, stave cards, and musical business cards. Pick a format, play it, and share it.",
    url: "https://musicaltoys.app/cards",
    siteName: "MusicalToys",
    images: [
      {
        url: "/og/musicaltoys-og.png",
        width: 1200,
        height: 630,
        alt: "Musical Cards – MusicalToys",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Musical Cards – MusicalToys",
    description:
      "Create musical postcards, stave cards, and musical business cards. Pick a format, play it, and share it.",
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
              name: "Musical Cards",
              applicationCategory: "MusicApplication",
              operatingSystem: "Web",
              url: "https://musicaltoys.app/cards",
              description:
                "A hub of musical cards. Create musical postcards, stave cards, and musical business cards — play them and share a link that recreates the same card.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
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
              name: "Musical Card Types",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Musical Postcards",
                  url: "https://musicaltoys.app/cards/postcard",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Stave Cards",
                  url: "https://musicaltoys.app/cards/stave",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Musical Business Cards",
                  url: "https://musicaltoys.app/cards/business",
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
            Turn your moments, wishes, and details into musical cards. Pick a
            format, choose a look, and create something shareable.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {/* Postcards */}
          <Link
            href="/cards/postcard"
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-400/70 hover:shadow-md"
          >
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-teal-600">
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
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-pink-400/70 hover:shadow-md"
          >
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-pink-600">
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
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-amber-300/70 hover:shadow-md"
          >
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-amber-600">
              Tiny sound signatures
            </p>
            <h2 className="text-sm font-semibold">
              Musical Business Cards
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Your name, phone, and email turned into a small soundtrack you can
              share.
            </p>
          </Link>
        </section>

        <section className="mt-10 border-t border-slate-200 pt-6">
          <h2 className="text-sm font-semibold tracking-tight">
            What are musical cards?
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-700">
            Musical cards are shareable designs that combine visuals and sound.
            They’re made for birthdays, holidays, milestones, and introductions.
            You can play them, download them, and share them anywhere you like.
          </p>
        </section>
      </div>
    </main>
  );
}