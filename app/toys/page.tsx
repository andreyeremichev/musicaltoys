// app/toys/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Toys – MusicalToys",
  description:
    "Explore interactive musical toys: TextToTone, KeyClock, ToneDial and Shape of Harmony. Turn text, dates and numbers into playful music.",
};

export default function ToysPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-6 md:px-8 md:pb-16 md:pt-10">
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Toys
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Play with text, dates and numbers. Each toy has its own little
            world, but they all turn everyday things into sound.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* TextToTone */}
          <Link
            href="/toys/text-to-tone"
            className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-teal-400/70 hover:bg-slate-900 transition"
          >
            <p className="text-[10px] font-semibold text-teal-300 mb-1 uppercase tracking-wide">
              Text → melody
            </p>
            <h2 className="text-sm font-semibold">TextToTone</h2>
            <p className="mt-1 text-xs text-slate-300">
              Type any message, name or phrase and hear it as a unique melody.
            </p>
          </Link>

          {/* KeyClock */}
          <Link
            href="/toys/key-clock"
            className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-pink-400/70 hover:bg-slate-900 transition"
          >
            <p className="text-[10px] font-semibold text-pink-300 mb-1 uppercase tracking-wide">
              Date → harmony
            </p>
            <h2 className="text-sm font-semibold">KeyClock</h2>
            <p className="mt-1 text-xs text-slate-300">
              Turn birthdays, anniversaries and special moments into harmony.
            </p>
          </Link>

          {/* ToneDial */}
          <Link
            href="/toys/tone-dial"
            className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-amber-300/70 hover:bg-slate-900 transition"
          >
            <p className="text-[10px] font-semibold text-amber-200 mb-1 uppercase tracking-wide">
              Number → tune
            </p>
            <h2 className="text-sm font-semibold">ToneDial</h2>
            <p className="mt-1 text-xs text-slate-300">
              Use classic T9 magic to let your phone number sing.
            </p>
          </Link>

          {/* Shape of Harmony */}
          <Link
            href="/toys/shape-of-harmony"
            className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-violet-400/70 hover:bg-slate-900 transition"
          >
            <p className="text-[10px] font-semibold text-violet-300 mb-1 uppercase tracking-wide">
              Chords → constellations
            </p>
            <h2 className="text-sm font-semibold">Shape of Harmony</h2>
            <p className="mt-1 text-xs text-slate-300">
              See your chords as glowing shapes and constellations in motion.
            </p>
          </Link>
        </section>

        <section className="mt-10 border-t border-slate-800 pt-6">
          <h2 className="text-sm font-semibold tracking-tight">
            What are toys?
          </h2>
          <p className="mt-2 text-xs text-slate-300 max-w-2xl">
            Toys are interactive pages where you can freely experiment with
            text, dates and numbers as music. They are made for play, not for
            theory — type something in and see what happens.
          </p>
        </section>
      </div>
    </main>
  );
}