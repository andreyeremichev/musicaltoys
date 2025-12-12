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
           HERO: LIGHT, WITH MINI DEMO
        ========================== */}
        <section className="grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-center">
          <div className="space-y-4">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-teal-500 uppercase">
              musicaltoys.app
            </p>
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

            {/* Mini text demo placeholder */}
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    Instant preview
                  </p>
                  <p className="text-xs text-slate-500">
                    Type a word and imagine a tiny melody.
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-teal-100 px-3 py-1 text-[11px] font-medium text-teal-700">
                  Coming soon
                </span>
              </div>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="text"
                  placeholder="Try: your name, a wish, a secret..."
                  className="h-9 w-full rounded-full border border-slate-200 bg-slate-50 px-3 text-xs text-slate-800 outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-300"
                  disabled
                />
                <button
                  type="button"
                  disabled
                  className="h-9 rounded-full bg-slate-900 px-4 text-xs font-medium text-slate-50 opacity-40 sm:shrink-0"
                >
                  Play preview
                </button>
              </div>
            </div>

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
            </div>
          </div>

          {/* Simple visual teaser card */}
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
                    <p className="text-slate-500">
                      Your message becomes a melody.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[3px] inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-500 text-[11px] font-bold text-white">
                    12
                  </span>
                  <div>
                    <p className="font-semibold">KeyClock</p>
                    <p className="text-slate-500">
                      Your date unfolds into harmony.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[3px] inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-[11px] font-bold text-slate-900">
                    #
                  </span>
                  <div>
                    <p className="font-semibold">ToneDial</p>
                    <p className="text-slate-500">
                      Your phone number sings.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* =========================
           SECTION 2: INSTANT DEMOS ROW (PLACEHOLDERS)
        ========================== */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            Try the idea right here
          </h2>
          <p className="max-w-2xl text-sm text-slate-600">
            These quick previews give a tiny taste of how MusicalToys works.
            Full versions live inside the toys.
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            {/* Text mini demo */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold text-teal-600 mb-1">
                Text → tiny melody
              </p>
              <h3 className="text-sm font-semibold">Your word as sound</h3>
              <p className="mt-1 text-xs text-slate-600">
                Imagine a short melody made from just one word.
              </p>
              <div className="mt-3 flex flex-col gap-2">
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div className="h-2 w-1/3 rounded-full bg-teal-300/70" />
                </div>
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-500"
                >
                  Preview coming soon
                </button>
              </div>
            </div>

            {/* Date mini demo */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold text-pink-600 mb-1">
                Date → tiny harmony
              </p>
              <h3 className="text-sm font-semibold">A day that sings</h3>
              <p className="mt-1 text-xs text-slate-600">
                Picture a small chord ripple based on a special date.
              </p>
              <div className="mt-3 flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
                  <span className="rounded border border-slate-200 px-2 py-1 bg-slate-50">
                    14
                  </span>
                  <span className="rounded border border-slate-200 px-2 py-1 bg-slate-50">
                    02
                  </span>
                  <span className="rounded border border-slate-200 px-2 py-1 bg-slate-50">
                    2025
                  </span>
                </div>
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-500"
                >
                  Preview coming soon
                </button>
              </div>
            </div>

            {/* Tap mini demo */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold text-indigo-600 mb-1">
                Tap → tiny spark
              </p>
              <h3 className="text-sm font-semibold">Random little tune</h3>
              <p className="mt-1 text-xs text-slate-600">
                Imagine a new mini melody each time you tap.
              </p>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  disabled
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/80 text-[10px] font-semibold text-slate-50 opacity-40"
                >
                  ●
                </button>
                <span className="text-[11px] text-slate-500">
                  Tap-to-play demo coming soon.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
           SECTION 3: TOYS WORLD PREVIEW (DARK PANEL)
        ========================== */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            Explore the toys
          </h2>
          <p className="max-w-2xl text-sm text-slate-600">
            Dive into the full experiences: text-to-melody, date-to-harmony,
            number tunes and visual harmony shapes.
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
                  Hear birthdays, anniversaries and special dates as harmony.
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
                  Use classic T9 magic to turn your phone number into a tune.
                </p>
              </a>

              <a
                href="/toys/shape-of-harmony"
                className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-violet-400/70 hover:bg-slate-900 transition"
              >
                <p className="text-[10px] font-semibold text-violet-300 mb-1 uppercase tracking-wide">
                  Chords → constellations
                </p>
                <h3 className="text-sm font-semibold">Shape of Harmony</h3>
                <p className="mt-1 text-xs text-slate-300">
                  See your chords as glowing shapes and constellations.
                </p>
              </a>
            </div>
          </div>
        </section>

        {/* =========================
           SECTION 4: CARDS WORLD PREVIEW (LIGHT)
        ========================== */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            Create a musical card
          </h2>
          <p className="max-w-2xl text-sm text-slate-600">
            Turn moments into musical keepsakes: postcards, greeting cards and
            tiny sound signatures you can share.
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            <a
              href="/cards/postcard"
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-teal-400/70 hover:shadow-md transition"
            >
              <h3 className="text-sm font-semibold">Musical Postcards</h3>
              <p className="mt-1 text-xs text-slate-600">
                Dates and messages as musical postcards for birthdays, holidays
                and “the day we met”.
              </p>
            </a>
            <a
              href="/cards/stave"
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-pink-400/70 hover:shadow-md transition"
            >
              <h3 className="text-sm font-semibold">Stave Cards</h3>
              <p className="mt-1 text-xs text-slate-600">
                Your words shown as real music notation over themed
                backgrounds.
              </p>
            </a>
            <a
              href="/cards/business"
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-amber-300/70 hover:shadow-md transition"
            >
              <h3 className="text-sm font-semibold">Musical Business Cards</h3>
              <p className="mt-1 text-xs text-slate-600">
                Your details turned into a tiny soundtrack — a memorable sonic
                calling card.
              </p>
            </a>
          </div>
        </section>

        {/* =========================
           SECTION 5: CINEMATIC TEASER (DARK BAND)
        ========================== */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            Cinematic sounds for the curious
          </h2>
          <div className="rounded-3xl bg-slate-950 text-slate-50 px-4 py-5 md:px-6 md:py-6 shadow-md">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold">Irrational Melodies</h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  Listen to pi, √2, Φ and other numbers as endless flowing
                  harmony. A musical fireplace for focus, curiosity and calm.
                </p>
              </div>
              <a
                href="/cinematic/irrationals"
                className="inline-flex items-center justify-center rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-900 hover:bg-white transition"
              >
                Explore irrational melodies
              </a>
            </div>
          </div>
        </section>

        {/* =========================
           SECTION 6: SEO TEXT / ABOUT
        ========================== */}
        <section className="space-y-3 border-t border-slate-200 pt-6">
          <h2 className="text-base font-semibold tracking-tight sm:text-lg">
            What is MusicalToys?
          </h2>
          <p className="text-sm text-slate-700">
            MusicalToys is a playful place where you can turn text, dates,
            numbers and images into sound. It is home to text-to-music,
            date-to-music and number-to-music experiences, plus musical
            postcards and cards you can download and share. Everything runs in
            your browser and no music skills are required.
          </p>
          <p className="text-sm text-slate-700">
            Use MusicalToys to create musical birthday messages, musical
            greeting cards, personal melodies from names or phone numbers,
            ambient number-based harmonies and more. Each toy has its own look
            and feel, but they all share one idea: everyday things can become
            sound.
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