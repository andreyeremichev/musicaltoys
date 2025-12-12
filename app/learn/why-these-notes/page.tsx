// app/learn/why-these-notes/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Why These Notes? • MusicalToys",
  description:
    "Curious how TextToTone chooses its notes? See how your words, dates and numbers turn into simple melodies and harmony without any music theory required.",
  alternates: { canonical: "/learn/why-these-notes" },
  openGraph: {
    type: "article",
    url: "https://musicaltoys.app/learn/why-these-notes",
    title: "Why These Notes? • MusicalToys",
    description:
      "A friendly peek behind TextToTone: how speech patterns, letters, numbers and symbols turn into tiny melodies and harmony colors.",
    images: [
      {
        url: "https://musicaltoys.app/og/texttotone.jpg",
        width: 1200,
        height: 630,
        alt: "TextToTone: Why These Notes — your words turned into simple melodies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Why These Notes? • MusicalToys",
    description:
      "For the curious ones: discover how TextToTone turns speech, letters, numbers and symbols into tiny musical phrases.",
    images: ["https://musicaltoys.app/og/texttotone.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function WhyTheseNotesPage() {
  return (
    <main className="bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-3xl px-4 pb-12 pt-8 md:px-6 md:pb-16 md:pt-12">
        {/* Intro */}
        <header className="mb-6 md:mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-500">
            learn • texttotone
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            🌟 Why These Notes?
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
            Most people type their name, tap <strong>Play</strong>, smile and
            share the clip. But <em>you</em> clicked{" "}
            <strong>Why These Notes?</strong> — which means you’re one of the
            curious ones. Welcome. Let’s open the tiny music box inside
            TextToTone.
          </p>
        </header>

        <div className="space-y-6">
          {/* Speech already is music */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              🎵 Speech Already <span className="italic">Is</span> Music
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              When we talk, our voices naturally rise, fall, stretch, bounce,
              whisper and punch. Every vowel has its own shape, every consonant
              a little percussive moment.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              TextToTone simply takes that invisible melody of speech and lets
              you <strong>hear it on a piano</strong>. Nothing heavy or
              theoretical — just the music that was already hiding in your
              words.
            </p>
          </section>

          {/* Two ways */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              🧭 Two Ways to Hear Your Text
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              TextToTone has <strong>two simple modes</strong> for turning text
              into sound:
            </p>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
              <div>
                <p className="font-semibold">1. Letters Mode — clean &amp; tidy</p>
                <p className="mt-1">
                  Here, each letter plays a small step on a gentle scale. Spaces
                  become little breaths. Numbers and symbols become short,
                  colorful chords. It’s perfect for names, notes, captions and
                  quick “what does this sound like?” moments.
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  2. Speech Mode — closer to how you talk
                </p>
                <p className="mt-1">
                  This mode listens more closely to how language feels when you
                  say it out loud. Open, bright vowels climb upward. Warm,
                  rounded vowels settle downward. Consonants act like tiny drums
                  and transitions. It’s still simple — just a more natural,
                  spoken-melody version of your text.
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              You can swap between the two any time on the TextToTone page and
              hear how the same words sing differently.
            </p>
          </section>

          {/* One friendly key */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              🎼 One Friendly Key for Everything
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              All the notes you hear come from a single, cozy key. It’s warm,
              expressive and sits close to where human speech naturally feels at
              home.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              This keeps your melody:
              <br />
              • <strong>smooth</strong> instead of random
              <br />
              • <strong>familiar</strong> instead of harsh
              <br />
              • <strong>readable</strong> on the stave
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              It also means even nonsense words create lines that feel like tiny
              musical phrases, not noise.
            </p>
          </section>

          {/* Letters become notes */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              🔤 How Letters Become Notes
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              In <strong>Letters Mode</strong>, each letter is assigned to a
              note in that friendly scale. The whole thing stays in a comfortable
              range — low enough to feel warm, high enough to feel clear.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Short texts sound like little motifs. Longer phrases feel like
              gentle musical lines. It’s tidy, easy to read and great for
              sharing clips.
            </p>
          </section>

          {/* Rhythm archetypes */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              🥁 Rhythm Follows How You Speak
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Different words carry different energy:
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
              <li>some bounce</li>
              <li>some stretch</li>
              <li>some rush forward</li>
              <li>some land like a stomp</li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              TextToTone uses simple rhythm “archetypes” inspired by that:
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
              <li>
                <strong>Even</strong> – steady and neutral
              </li>
              <li>
                <strong>Swing</strong> – a little off-center, more movement
              </li>
              <li>
                <strong>Legato</strong> – connected and smooth
              </li>
              <li>
                <strong>Stomp</strong> – strong, punchy emphasis
              </li>
              <li>
                <strong>Bounce</strong> – playful and jumpy
              </li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              They don’t change the notes, just the spacing between them — like
              shifting a drum groove to match your sentence.
            </p>
          </section>

          {/* Numbers */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              🔢 What Happens to Numbers?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Numbers don’t get their own single notes — they get{" "}
              <strong>little harmony colors</strong>.
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
              <li>One-digit numbers → simple, light chords</li>
              <li>Two-digit numbers → slightly richer flavors</li>
              <li>Zeros → quick, soft ticks that keep the flow moving</li>
              <li>
                Larger numbers → broken into smaller pieces that play one after
                another
              </li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              You don’t have to learn which number means what; just know that
              dates and codes bring in quick flashes of harmony to support your
              melody.
            </p>
          </section>

          {/* Tens character */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              ✨ Why 10, 20, 30… Feel Different
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Each “tens” number (10, 20, 30, … 90) has its own character:
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
              <li>
                some feel like <strong>home</strong>
              </li>
              <li>
                some add a bit of <strong>tension</strong>
              </li>
              <li>
                some are extra <strong>bright</strong>
              </li>
              <li>
                some feel <strong>calm</strong> and resolving
              </li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Together they create a tiny emotional map for numbers, so your
              dates and phone-like strings don’t just beep — they glow a little.
            </p>
          </section>

          {/* Timing */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              ⏱️ Tiny Beats That Feel Natural
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Text moves quickly, but speech also needs room to breathe. Your
              melody follows that rhythm:
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
              <li>letters → short notes</li>
              <li>breaks &amp; dashes → tiny rests</li>
              <li>symbols → small sparks and blips</li>
              <li>numbers → short bursts of harmony</li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              The whole clip lasts exactly as long as your text needs to express
              itself — short inputs finish quickly, long ones have time to sing.
            </p>
          </section>

          {/* Sound of thought */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              🧠 The Sound of Thought
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              When you put everything together:
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
              <li>vowels glide</li>
              <li>consonants tap like drums</li>
              <li>numbers shimmer as chords</li>
              <li>symbols whisper and nudge</li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Your text stops being just text. It becomes a{" "}
              <strong>tiny musical gesture</strong> — part melody, part poetry,
              part rhythm game.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              That’s the real trick behind TextToTone:
            </p>
            <blockquote className="mt-2 border-l-4 border-amber-300 pl-3 text-sm italic text-slate-800">
              It plays the music your voice was already speaking.
            </blockquote>
          </section>

          {/* Symbols */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              🔣 Beyond Words: Why Symbols Make Sounds Too
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              People use symbols all the time — %, /, +, !, ? — so TextToTone
              gives each one a small musical meaning:
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
              <li>
                <strong>%</strong> → a tiny breath, then a two-step flourish
              </li>
              <li>
                <strong>/</strong> → a quick “link” chord
              </li>
              <li>
                <strong>+</strong> → a warm lift
              </li>
              <li>
                <strong>.</strong> → a soft tick
              </li>
              <li>
                <strong>?</strong> → a curious upward gesture
              </li>
              <li>
                <strong>!</strong> → a gentle emphasis
              </li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              They’re not rules you have to remember — just little musical
              nudges that make your text feel more alive and expressive.
            </p>
          </section>

          {/* In short */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              ✨ In Short
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              <strong>Your words already sing.</strong> TextToTone simply lets
              you hear them.
            </p>
          </section>

          {/* CTAs */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              🚀 Now That You Know the Secret…
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Why stop at one clip? Try giving music to:
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
              <li>a date</li>
              <li>a phone number</li>
              <li>a friend’s name</li>
              <li>a small wish</li>
              <li>or something completely random</li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              Let’s see what else your world sounds like:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/toys/key-clock"
                className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-slate-50 shadow-sm hover:bg-slate-800"
              >
                KeyClock (Date → Music)
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
              Type your friend’s name. Hit play. Watch their face when the piano
              sings it back. It’s one of the fastest ways to make someone smile
              today.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/toys/text-to-tone"
                className="inline-flex items-center rounded-full bg-amber-300 px-4 py-2 text-xs font-semibold text-slate-900 shadow-sm hover:bg-amber-200"
              >
                Make a new clip →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}