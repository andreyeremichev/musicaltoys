// app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About MusicalToys — Turn Text, Dates & Numbers Into Music",
  description:
    "MusicalToys turns text, dates, and numbers into playful music and shareable musical cards — no music skills needed. Powered by Pianotrainer.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    url: "https://musicaltoys.app/about",
    title: "About MusicalToys",
    description:
      "Turn words, dates, and numbers into music and musical postcards. Simple, magical, and made for sharing. Powered by Pianotrainer.",
    images: [{ url: "https://musicaltoys.app/og/about.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About MusicalToys",
    description:
      "Turn text, dates, and numbers into playful music and shareable musical cards. Powered by Pianotrainer.",
    images: ["https://musicaltoys.app/og/about.jpg"],
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "MusicalToys",
              url: "https://musicaltoys.app/about",
              applicationCategory: "MusicApplication",
              operatingSystem: "Web",
              description:
                "MusicalToys turns text, numbers, and dates into playful musical experiences and shareable musical cards — no music skills needed.",
              featureList: [
                "Text to music generator",
                "Date to harmony generator",
                "Number to melody generator",
                "Musical postcard creator",
                "Shareable musical cards",
                "Browser-based music experiences",
              ],
              creator: {
                "@type": "Organization",
                name: "MusicalToys",
                url: "https://musicaltoys.app",
              },
              provider: {
                "@type": "Organization",
                name: "Pianotrainer",
                url: "https://pianotrainer.app",
              },
              isAccessibleForFree: true,
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              sameAs: ["https://pianotrainer.app", "https://emotionalchords.app"],
            }),
          }}
        />

        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            About MusicalToys
          </h1>
          <p className="mt-3 text-base text-neutral-600">
            MusicalToys turns text, dates, and numbers into playful music and
            shareable musical cards — no music skills needed.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">
            A tiny world of musical transformation
          </h2>
          <p className="text-neutral-700">
            Type a message. Hear a melody. Pick a date. Feel a harmony. Turn a
            little moment into something you can send to someone you love.
          </p>
          <p className="text-neutral-700">
            MusicalToys is built for curiosity and sharing — quick to try, fun
            to replay, and always a little surprising.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">
            What you can do here
          </h2>

          <ul className="list-disc space-y-2 pl-5 text-neutral-700">
            <li>
              Turn <strong>text</strong> into a melody (names, wishes, inside
              jokes).
            </li>
            <li>
              Turn <strong>dates</strong> into harmony (birthdays, anniversaries,
              “the day we met”).
            </li>
            <li>
              Turn <strong>numbers</strong> into music (phone digits, patterns,
              playful sequences).
            </li>
            <li>
              Create <strong>musical postcards</strong> — beautiful, personal,
              and ready to share.
            </li>
          </ul>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/toys"
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900 shadow-sm hover:bg-neutral-50"
            >
              Explore the toys
            </Link>
            <Link
              href="/cards/postcard"
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900 shadow-sm hover:bg-neutral-50"
            >
              Make a musical postcard
            </Link>
          </div>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Powered by Pianotrainer
          </h2>
          <p className="text-neutral-700">
            MusicalToys is powered by <strong>Pianotrainer</strong> — the project
            where these playful sound ideas were born and tested.
          </p>
          <p className="text-neutral-700">
            If you’re visiting from Pianotrainer: the toys are moving here.
            Existing links under <strong>pianotrainer.app/toys</strong> will
            redirect to the matching pages on{" "}
            <strong>musicaltoys.app/toys</strong>, so everything still works —
            just in its new home.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">FAQ</h2>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h3 className="font-medium">Do I need music skills?</h3>
            <p className="mt-2 text-neutral-700">
              Nope. Just type something and press play. The toy does the rest.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h3 className="font-medium">Is it free?</h3>
            <p className="mt-2 text-neutral-700">
              You can play instantly in the browser — no sign-up needed.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h3 className="font-medium">Can I share what I make?</h3>
            <p className="mt-2 text-neutral-700">
              Yes — MusicalToys is made for sharing. Postcards and exports are
              designed to travel.
            </p>
          </div>
        </section>

        <footer className="mt-12 border-t border-neutral-200 pt-6 text-sm text-neutral-500">
          <p>
            Want the “train ear and notation” side? Visit Pianotrainer. Want the
            “feel it like cinema” side? Visit EmotionalChords.
          </p>
        </footer>
      </div>
    </main>
  );
}