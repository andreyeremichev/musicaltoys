// app/learn/why-these-numbers/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Why These Numbers? • MusicalToys",
  description:
    "Curious how KeyClock and ToneDial turn dates and phone numbers into music? A simple, friendly look at how digits, symbols and letters become steps and harmony.",
  alternates: { canonical: "/learn/why-these-numbers" },
  openGraph: {
    type: "article",
    url: "https://musicaltoys.app/learn/why-these-numbers",
    title: "Why These Numbers? • MusicalToys",
    description:
      "A friendly peek behind KeyClock and ToneDial: how dates, digits, phone text and symbols turn into musical steps, trails and tiny melodies.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Why These Numbers? • MusicalToys",
    description:
      "For the curious ones: see how KeyClock and ToneDial turn dates, digits and phone words into musical patterns.",
  },
  robots: { index: true, follow: true },
};

export default function WhyTheseNumbersPage() {
  return (
    <main className="bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-3xl px-4 pb-12 pt-8 md:px-6 md:pb-16 md:pt-12">
        {/* Intro */}
        <header className="mb-6 md:mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-500">
            learn • keyclock &amp; tonedial
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            🔢 Why These Numbers?
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
            Birthdays, anniversaries, phone numbers — even words typed on a
            keypad — all hide little tunes. This page is for the curious people
            who want to know how <strong>KeyClock</strong> and{" "}
            <strong>ToneDial</strong> turn those digits into music.
          </p>
        </header>

        <div className="space-y-6">
          {/* Two toys, one idea */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              🎯 Two Toys, One Simple Idea
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Both toys share the same basic thought:
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">
              <strong>“Your numbers already form a pattern. Let’s let them
              sing.”</strong>
            </p>
            <div className="mt-3 grid gap-3 text-sm leading-relaxed text-slate-700 md:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  KeyClock
                </p>
                <p className="mt-1 font-semibold">Dates → circular harmony</p>
<p className="mt-1 text-xs sm:text-sm">
  KeyClock takes dates and date-like strings and places them
  around a circle of harmony. You can type{" "}
  <span className="font-mono text-[11px]">21.10.2025</span>,{" "}
  <span className="font-mono text-[11px]">Oct 21 2025</span>, or{" "}
  <span className="font-mono text-[11px]">October 21, 2025</span> — same day,
  different spelling, slightly different musical path.
</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  ToneDial
                </p>
                <p className="mt-1 font-semibold">Phone → little melody</p>
                <p className="mt-1 text-xs sm:text-sm">
                  ToneDial takes phone numbers and phone-style text (like{" "}
                  <span className="font-mono text-[11px]">1-800-HELLO</span>) and
                  turns them into a simple melody line, using the classic T9
                  keypad as a bridge between letters and digits.
                </p>
              </div>
            </div>
          </section>

          {/* How KeyClock reads a date */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              🕒 How KeyClock Reads a Date
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
  Think of a single day like <strong>December 25, 2025</strong>. KeyClock is
  happy if you write it as{" "}
  <span className="font-mono text-[11px]">25.12.2025</span>,{" "}
  <span className="font-mono text-[11px]">Dec 25 2025</span> or{" "}
  <span className="font-mono text-[11px]">December 25</span>. Same date,
  different “spelling” — and each version draws a slightly different melody
  around the circle.
</p>
<ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
  <li>
    It looks at each chunk of the input: numbers, short words, and separators.
  </li>
  <li>
    Dots, slashes, commas and spaces become{" "}
    <strong>gentle pauses</strong>, not extra notes.
  </li>
  <li>
    Digits and letters both feed into the same simple step pattern — so a date
    written with numbers only will feel different from a date written with
    month names.
  </li>
  <li>
    Everything stays inside a friendly key, so it never sounds random or harsh,
    just like different routes through the same small town.
  </li>
</ul>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              The result isn’t a math lecture — it’s just your date drawing a
              small path through harmony.
            </p>
          </section>

          {/* ToneDial mapping */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              ☎️ How ToneDial Listens to Your Phone Text
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              ToneDial uses the classic phone keypad as a tiny melody-generator.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              On an old T9 keypad:
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-xs leading-relaxed text-slate-700 sm:text-sm">
              <li>2 → A B C</li>
              <li>3 → D E F</li>
              <li>4 → G H I</li>
              <li>5 → J K L</li>
              <li>6 → M N O</li>
              <li>7 → P Q R S</li>
              <li>8 → T U V</li>
              <li>9 → W X Y Z</li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              ToneDial does this:
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
              <li>
                Letters in your input are first turned into digits using T9
                (like <span className="font-mono text-[11px]">HELLO</span>{" "}
                → <span className="font-mono text-[11px]">43556</span>).
              </li>
              <li>
                Each digit becomes a step of a simple scale, one after another,
                forming a <strong>tiny tune</strong>.
              </li>
              <li>
                Special phone symbols like <span className="font-mono text-[11px]">
                  +
                </span>
                , <span className="font-mono text-[11px]">*</span>,{" "}
                <span className="font-mono text-[11px]">#</span> act as little
                accents, not full chords.
              </li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              You don’t have to think about any of this — you just type a phone
              number or phone-style word and hear what comes out.
            </p>
          </section>

          {/* Zero and separators */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              0️⃣ Zero, Dashes and Little Gaps
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Some characters don’t want to be big musical moments — they just
              help with spacing and feel:
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
              <li>
                <strong>0 (zero)</strong> often becomes a short tick or a tiny
                “side-step” that keeps counting without stealing attention.
              </li>
              <li>
                <strong>spaces, dashes, dots and commas</strong> become{" "}
                <strong>breaths</strong> — tiny pauses so your sequence doesn’t
                feel like one long block.
              </li>
              <li>
                In KeyClock, these pauses also help visually group the date on
                the circle, so you can see each chunk.
              </li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Together, they give your numbers rhythm and shape instead of a
              flat stream of sound.
            </p>
          </section>

          {/* Why it feels musical */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              🎼 Why It Feels Musical, Not Random
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Under the hood, both toys keep a few promises:
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
              <li>
                <strong>Everything stays inside a simple musical space.</strong>{" "}
                No wild jumps, no jarring notes.
              </li>
              <li>
                <strong>Neighbouring digits are related.</strong> Close numbers
                create steps that feel like walking, not teleporting.
              </li>
              <li>
                <strong>Repetition sounds intentional.</strong> When a number
                repeats, you hear it as a pattern, not a glitch.
              </li>
              <li>
                <strong>Widths are capped.</strong> Very long number runs don’t
                speed up forever; they settle into a comfortable pace.
              </li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              All of this makes your inputs feel like little musical ideas,
              rather than a random number station.
            </p>
          </section>

          {/* Examples */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              🔍 A Few Simple Examples
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Here’s roughly how things behave, without needing to memorize
              anything:
            </p>
            <ul className="mt-1 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
              <li>
                <span className="font-mono text-[11px]">10</span> → feels like a
                “start and breathe” moment: first digit steps out, the zero
                gives a little breath.
              </li>
              <li>
                <span className="font-mono text-[11px]">21</span> → two steps in
                a row, like “walk then land”.
              </li>
              <li>
                <span className="font-mono text-[11px]">99</span> → repeated
                high-ish step — more insistent, like knocking twice.
              </li>
              <li>
                <span className="font-mono text-[11px]">1999</span> → one
                starting step followed by a little cluster, like “call, then a
                blur of motion”.
              </li>
              <li>
                <span className="font-mono text-[11px]">2025</span> → number,
                breath, number, final step — a tiny arc that rises and resolves.
              </li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              You don’t need to analyze it while listening. Your ear just feels
              the pattern and remembers the overall shape.
            </p>
          </section>

          {/* Allowed input */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              ✅ What Can You Type In?
            </h2>
            <div className="mt-2 grid gap-3 text-sm leading-relaxed text-slate-700 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  KeyClock
                </p>
                <p className="mt-1">
                  Works best with anything that looks like a{" "}
                  <strong>date, year or code</strong>:
                </p>
                <div className="mt-2 flex flex-wrap gap-1 text-xs">
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">
                    0–9
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">
                    /
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">
                    .
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">
                    ,
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">
                    space
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-600">
  In both KeyClock and ToneDial, whenever you type letters they’re first turned
  into digits using the classic T9 mapping, and then those digits become simple
  melody steps.
</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  ToneDial
                </p>
                <p className="mt-1">
                  Works best with anything that looks like a{" "}
                  <strong>phone number or phone word</strong>:
                </p>
                <div className="mt-2 flex flex-wrap gap-1 text-xs">
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">
                    0–9
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">
                    A–Z
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">
                    #
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">
                    +
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">
                    *
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">
                    -
                  </span>
                </div>
                
              </div>
            </div>
          </section>

          {/* In short */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              ✨ In Short
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              <strong>Your numbers already have shape.</strong> KeyClock and
              ToneDial just turn that shape into sound:
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
              <li>KeyClock draws a path around a circle of harmony.</li>
              <li>ToneDial traces a melody out of phone-style input.</li>
              <li>
                Zeros, breaks and symbols give rhythm so it feels human, not
                robotic.
              </li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              You don’t have to learn the rules — your ears will get it faster
              than your brain.
            </p>
          </section>

          {/* CTAs */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              🚀 Try It With Your Own Numbers
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Now that you’ve peeked behind the curtain, try feeding the toys a
              few different things:
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
              <li>your birthday and someone else’s</li>
              <li>a memorable date (first gig, first trip, first message)</li>
              <li>a real phone number (mask the last digits if you like)</li>
              <li>a phone-style word or helpline name</li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              See which ones feel warm, which feel bright, and which feel a bit
              mysterious.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/toys/key-clock"
                className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-slate-50 shadow-sm hover:bg-slate-800"
              >
                KeyClock (Dates → Music)
              </Link>
              <Link
                href="/toys/tone-dial"
                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-800 hover:border-slate-400 hover:bg-slate-100"
              >
                ToneDial (Phone → Music)
              </Link>
              <Link
                href="/toys/text-to-tone"
                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-800 hover:border-slate-400 hover:bg-slate-100"
              >
                TextToTone (Text → Music)
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              🎶 Share the Fun
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Turn a date or phone-style word into music, record it, and send it
              to someone who was there. It’s a simple way to wrap a memory in
              sound.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/toys/key-clock"
                className="inline-flex items-center rounded-full bg-amber-300 px-4 py-2 text-xs font-semibold text-slate-900 shadow-sm hover:bg-amber-200"
              >
                Play with dates →
              </Link>
              <Link
                href="/toys/tone-dial"
                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-800 hover:border-slate-400 hover:bg-slate-100"
              >
                Play with phone text →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}