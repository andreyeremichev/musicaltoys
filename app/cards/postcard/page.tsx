// app/cards/postcard/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Musical Postcards – MusicalToys",
  description:
    "Create musical postcards from dates and messages. Birthday, holiday, wedding and custom themes with harmony and trails.",
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
            Date-based musical postcards with themes for birthdays, holidays,
            weddings and more. Start from a preset or imagine how your own
            photo might look.
          </p>
        </header>

        {/* Theme categories – non-clickable placeholders for now */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-tight">
            Popular themes
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-semibold text-teal-600 mb-1 uppercase tracking-wide">
                Birthdays
              </p>
              <h3 className="text-sm font-semibold">Birthday postcards</h3>
              <p className="mt-1 text-xs text-slate-600">
                A special date and a short wish turned into a postcard with
                musical trails and festive backgrounds.
              </p>
              <p className="mt-2 text-[11px] text-slate-500">
                Theme presets and editor coming soon.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-semibold text-pink-600 mb-1 uppercase tracking-wide">
                Weddings & anniversaries
              </p>
              <h3 className="text-sm font-semibold">
                The day we met & more
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                Mark “the day we met”, wedding dates and anniversaries with soft
                colors and flowing harmony.
              </p>
              <p className="mt-2 text-[11px] text-slate-500">
                Romantic layouts and trails coming soon.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-semibold text-indigo-600 mb-1 uppercase tracking-wide">
                Holidays
              </p>
              <h3 className="text-sm font-semibold">
                Christmas & New Year postcards
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                Wintery palettes, holiday lights and your chosen date playing as
                gentle harmony.
              </p>
              <p className="mt-2 text-[11px] text-slate-500">
                Holiday themes and exports coming soon.
              </p>
            </div>
          </div>
        </section>

        {/* Custom / future section */}
        <section className="mt-8 space-y-3">
          <h2 className="text-sm font-semibold tracking-tight">
            Custom and future ideas
          </h2>
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-4">
            <p className="text-xs text-slate-700 max-w-3xl">
              The postcard editor will let you combine KeyClock-style harmony
              with background images, short wishes and trails in the circle. You
              will be able to pick from presets or upload your own photo and
              create a musical card ready to share.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}