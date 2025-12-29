// app/cards/postcard/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Musical Postcards – MusicalToys",
  description:
    "Create musical postcards from dates and messages. Date we met, Birthday, New Year, Christmas and more themes with harmony, trails and motion.",
  alternates: { canonical: "/cards/postcard" },
};

export default function PostcardHubPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-6 md:px-8 md:pb-16 md:pt-10">
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Musical Postcards
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Turn meaningful dates and short messages into musical postcards with
            motion, harmony and visual trails. Pick a theme and make it yours.
          </p>
        </header>

        {/* Live themes */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-tight">Available now</h2>

          <div className="grid gap-3 md:grid-cols-3">
            {/* Date we met */}
            <a
              href="/cards/postcard/date-we-met"
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-pink-600">
                Romantic
              </p>
              <h3 className="text-sm font-semibold">The day we met</h3>
              <p className="mt-1 text-xs text-slate-600">
                A special date turned into a gentle, flowing musical postcard.
                Designed for couples and shared memories.
              </p>
              <p className="mt-2 text-[11px] text-slate-500">Live now →</p>
            </a>

            {/* Birthday */}
            <a
              href="/cards/postcard/birthday"
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-teal-600">
                Birthday
              </p>
              <h3 className="text-sm font-semibold">Birthday postcards</h3>
              <p className="mt-1 text-xs text-slate-600">
                Festive backgrounds and joyful motion. Type a date or message,
                play it, and send a musical wish.
              </p>
              <p className="mt-2 text-[11px] text-slate-500">Live now →</p>
            </a>

            {/* New Year */}
            <a
              href="/cards/postcard/new-year"
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-indigo-600">
                New Year
              </p>
              <h3 className="text-sm font-semibold">New Year postcards</h3>
              <p className="mt-1 text-xs text-slate-600">
                Midnight colors, celebratory motion and a clean musical moment
                to mark the new beginning.
              </p>
              <p className="mt-2 text-[11px] text-slate-500">Live now →</p>
            </a>

            {/* Christmas */}
            <a
              href="/cards/postcard/xmas"
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-red-600">
                Christmas
              </p>
              <h3 className="text-sm font-semibold">Christmas postcards</h3>
              <p className="mt-1 text-xs text-slate-600">
                Festive backgrounds, glowing trails and fireworks. Your date or
                message plays as a short musical moment.
              </p>
              <p className="mt-2 text-[11px] text-slate-500">Live now →</p>
            </a>
          </div>
        </section>

        {/* Coming soon */}
        <section className="mt-8 space-y-4">
          <h2 className="text-sm font-semibold tracking-tight">Coming soon</h2>

          <div className="grid gap-3 md:grid-cols-3">
            {/* Wedding & anniversary */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 opacity-80">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-purple-600">
                Weddings & anniversaries
              </p>
              <h3 className="text-sm font-semibold">Wedding & “X years together”</h3>
              <p className="mt-1 text-xs text-slate-600">
                Wedding dates and relationship anniversaries with elegant motion
                and warm atmosphere.
              </p>
              <span className="mt-2 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                Coming soon
              </span>
            </div>

            {/* Stave / notation cards */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 opacity-80">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                Notation
              </p>
              <h3 className="text-sm font-semibold">Stave cards</h3>
              <p className="mt-1 text-xs text-slate-600">
                Your message shown as real music notation over themed
                backgrounds.
              </p>
              <span className="mt-2 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                Coming soon
              </span>
            </div>

            {/* Custom */}
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-4">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Custom
              </p>
              <h3 className="text-sm font-semibold">Your own photo & style</h3>
              <p className="mt-1 text-xs text-slate-600">
                Upload your own image, pick motion and colors, and create a
                fully personalized musical postcard.
              </p>
              <span className="mt-2 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                Planned
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}