// app/cinematic/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cinematic – MusicalToys",
  description:
    "Slow, evolving generative sound experiences for focus, curiosity and calm. Cinematic mode is coming soon.",
};

function ComingSoonBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-900">
      Coming soon
    </span>
  );
}

export default function CinematicPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-6 md:px-8 md:pb-16 md:pt-10">
        <header className="mb-6 md:mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Cinematic
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Slow, evolving sound for the curious. These experiences are made
                to run in the background like a digital fireplace.
              </p>
            </div>
            <ComingSoonBadge />
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {/* Irrationals */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold text-teal-300 mb-1 uppercase tracking-wide">
                  Numbers → endless melody
                </p>
                <h2 className="text-sm font-semibold">Irrational Melodies</h2>
              </div>
              <ComingSoonBadge />
            </div>
            <p className="mt-1 text-xs text-slate-300">
              Listen to pi, √2, Φ and other numbers as flowing harmony. Perfect
              for focus, thinking or quiet wonder.
            </p>
          </div>

          {/* Cinematic Trailers */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold text-indigo-300 mb-1 uppercase tracking-wide">
                  Short cues
                </p>
                <h2 className="text-sm font-semibold">Cinematic Trailers</h2>
              </div>
              <ComingSoonBadge />
            </div>
            <p className="mt-1 text-xs text-slate-300">
              Short, film-like cues grown from numbers and chords. A place to
              play with more dramatic musical scenes.
            </p>
          </div>
        </section>

        <section className="mt-10 border-t border-slate-800 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold tracking-tight">
              What is the cinematic section?
            </h2>
            <ComingSoonBadge />
          </div>
          <p className="mt-2 text-xs text-slate-300 max-w-2xl">
            The cinematic section is for slower, more immersive experiences.
            Instead of quick messages or postcards, these toys create long-form
            sound you can leave running in the background while you work, read
            or think.
          </p>
        </section>
      </div>
    </main>
  );
}