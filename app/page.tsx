import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MusicalToys – Turn Anything Into Music",
  description:
    "Turn words, dates and numbers into melodies, harmonies and musical postcards. Text-to-music, date-to-music and musical card generators — no music skills needed.",
  openGraph: {
    title: "MusicalToys – Turn Anything Into Music",
    description:
      "Turn words, dates and numbers into melodies, harmonies and musical postcards. Text-to-music, date-to-music and musical card generators — no music skills needed.",
    url: "https://musicaltoys.app",
    siteName: "MusicalToys",
    images: [
      {
        url: "/og/musicaltoys-og.png",
        width: 1200,
        height: 630,
        alt: "MusicalToys – Turn Anything Into Music",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MusicalToys – Turn Anything Into Music",
    description:
      "Turn words, dates and numbers into melodies, harmonies and musical postcards. Text-to-music, date-to-music and musical card generators — no music skills needed.",
    images: ["/og/musicaltoys-og.png"],
  },
};

export default function HomePage() {
  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pb-10 pt-6 md:px-8 md:pb-16 md:pt-10">
        {/* =========================
           HERO
        ========================== */}
        <section className="grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-center">
          <div className="space-y-4">
            
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Turn anything
              <br />
              into music.
            </h1>
            <p className="text-sm text-slate-600 sm:text-base">
              MusicalToys turns words, dates and numbers into playful sound.
              Type something, tap once and hear what it becomes. No music skills
              needed — just curiosity.
            </p>

            <div className="flex flex-wrap gap-3 pt-3">
              <a
                href="/toys/text-to-tone"
                className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-slate-50 shadow-sm hover:bg-slate-800 transition sm:flex-none sm:px-5"
              >
                Start with TextToTone
              </a>
              <a
                href="/toys"
                className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:border-slate-400 hover:bg-slate-100 transition sm:flex-none"
              >
                Explore all toys
              </a>
              <a
                href="/cards/postcard"
                className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:border-slate-400 hover:bg-slate-100 transition sm:flex-none"
              >
                Musical postcards
              </a>
            </div>
          </div>

          {/* Simple visual teaser card (no mini demos) */}
          <div className="md:justify-self-end">
            <div className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-md">
              <div className="mb-3 text-xs font-medium text-slate-500">
                A little taste of the toys:
              </div>
              <ul className="space-y-3 text-xs text-slate-800">
                <li className="flex items-start gap-2">
                  <span className="mt-[3px] inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500 text-[11px] font-bold text-white">
                    A
                  </span>
                  <div>
                    <p className="font-semibold">TextToTone</p>
                    <p className="text-slate-500">Your message becomes a melody.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[3px] inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-500 text-[11px] font-bold text-white">
                    12
                  </span>
                  <div>
                    <p className="font-semibold">KeyClock</p>
                    <p className="text-slate-500">Your date unfolds into harmony.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[3px] inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-[11px] font-bold text-slate-900">
                    #
                  </span>
                  <div>
                    <p className="font-semibold">ToneDial</p>
                    <p className="text-slate-500">Your phone number sings.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* =========================
           SECTION: TOYS (WORKING LINKS)
        ========================== */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            Explore the toys
          </h2>
          <p className="max-w-2xl text-sm text-slate-600">
            Full experiences: text-to-melody, date-to-harmony, number tunes and
            visual harmony shapes.
          </p>

          <div className="rounded-3xl bg-slate-950 text-slate-50 px-4 py-5 md:px-6 md:py-6 shadow-md">
            <div className="grid gap-3 md:grid-cols-4">
              <a
                href="/toys/text-to-tone"
                className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-teal-400/70 hover:bg-slate-900 transition"
              >
                <p className="text-[10px] font-semibold text-teal-300 mb-1 uppercase tracking-wide">
                  Text → melody
                </p>
                <h3 className="text-sm font-semibold">TextToTone</h3>
                <p className="mt-1 text-xs text-slate-300">
                  Turn any message, name or phrase into a unique melody.
                </p>
              </a>

              <a
                href="/toys/key-clock"
                className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-pink-400/70 hover:bg-slate-900 transition"
              >
                <p className="text-[10px] font-semibold text-pink-300 mb-1 uppercase tracking-wide">
                  Date → harmony
                </p>
                <h3 className="text-sm font-semibold">KeyClock</h3>
                <p className="mt-1 text-xs text-slate-300">
                  Hear special dates as harmony and motion.
                </p>
              </a>

              <a
                href="/toys/tone-dial"
                className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-amber-300/70 hover:bg-slate-900 transition"
              >
                <p className="text-[10px] font-semibold text-amber-200 mb-1 uppercase tracking-wide">
                  Number → tune
                </p>
                <h3 className="text-sm font-semibold">ToneDial</h3>
                <p className="mt-1 text-xs text-slate-300">
                  Turn a phone number into a tune with classic keypad magic.
                </p>
              </a>

              <a
                href="/toys/shape-of-harmony"
                className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-violet-400/70 hover:bg-slate-900 transition"
              >
                <p className="text-[10px] font-semibold text-violet-300 mb-1 uppercase tracking-wide">
                  Chords → shapes
                </p>
                <h3 className="text-sm font-semibold">Shape of Harmony</h3>
                <p className="mt-1 text-xs text-slate-300">
                  See chords as glowing shapes and constellations.
                </p>
              </a>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="/toys"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:border-slate-400 hover:bg-slate-100 transition"
            >
              View all toys →
            </a>
          </div>
        </section>

        {/* =========================
           SECTION: POSTCARDS (WORKING LINK)
        ========================== */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            Musical postcards
          </h2>
          <p className="max-w-2xl text-sm text-slate-600">
            Turn moments into musical keepsakes. Pick a theme, type a date or a
            wish, and export a card you can share.
          </p>

          <div className="grid gap-3 md:grid-cols-3">
            <a
              href="/cards/postcard"
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-teal-400/70 hover:shadow-md transition"
            >
              <h3 className="text-sm font-semibold">Musical Postcards</h3>
              <p className="mt-1 text-xs text-slate-600">
                Christmas, New Year, “the day we met” and more themes.
              </p>
              <p className="mt-2 text-[11px] text-slate-500">Open hub →</p>
            </a>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm opacity-80">
              <h3 className="text-sm font-semibold">Stave Cards</h3>
              <p className="mt-1 text-xs text-slate-600">
                Your message shown as real music notation over backgrounds.
              </p>
              <span className="mt-2 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                Coming soon
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm opacity-80">
              <h3 className="text-sm font-semibold">Musical Business Cards</h3>
              <p className="mt-1 text-xs text-slate-600">
                Your details turned into a tiny soundtrack for sharing.
              </p>
              <span className="mt-2 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                Coming soon
              </span>
            </div>
          </div>
        </section>

        {/* =========================
           SECTION: CINEMATIC (COMING SOON)
        ========================== */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            Cinematic
          </h2>

          <div className="rounded-3xl bg-slate-950 text-slate-50 px-4 py-5 md:px-6 md:py-6 shadow-md">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold">Irrational Melodies</h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  Listen to pi, √2, Φ and other numbers as endless flowing
                  harmony. A musical fireplace for focus, curiosity and calm.
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-900">
                Coming soon
              </span>
            </div>
          </div>
        </section>

        {/* =========================
           SEO TEXT / ABOUT
        ========================== */}
        <section className="space-y-3 border-t border-slate-200 pt-6">
          <h2 className="text-base font-semibold tracking-tight sm:text-lg">
            What is MusicalToys?
          </h2>
          <p className="text-sm text-slate-700">
            MusicalToys is a playful place where you can turn text, dates,
            numbers and images into sound. Everything runs in your browser and
            no music skills are required.
          </p>
          <p className="text-sm text-slate-700">
            Start with the toys, then create musical postcards you can export
            and share.
          </p>
        </section>

        {/* =========================
           FOOTER
        ========================== */}
        <footer className="border-t border-slate-200 pt-6 text-xs text-slate-500 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>© {year} MusicalToys. All rights reserved.</p>
          <p>
            Created with love. Powered by{" "}
            <a
              href="https://pianotrainer.app"
              className="underline underline-offset-2 hover:text-slate-700"
            >
              Pianotrainer
            </a>{" "}
            &amp;{" "}
            <a
              href="https://emotionalchords.app"
              className="underline underline-offset-2 hover:text-slate-700"
            >
              EmotionalChords
            </a>
            .
          </p>
        </footer>
      </div>
    </main>
  );
}