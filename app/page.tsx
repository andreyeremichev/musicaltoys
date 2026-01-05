// app/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

/*
  Home philosophy:
  - A slow vertical journey through live windows (no inputs, no autoplay sound, no controls)
  - One line of text per window
  - Whole-area click into the experience
  - Scales by adding new items to HOME_MOMENTS
*/

export const metadata: Metadata = {
  metadataBase: new URL("https://musicaltoys.app"),
  title: "MusicalToys – Turn Anything Into Music",
  description:
    "Turn words, dates and numbers into melodies, harmonies and musical postcards. Create, play, and share musical cards — no music skills needed.",
  alternates: { canonical: "https://musicaltoys.app/" },
  openGraph: {
    title: "MusicalToys – Turn Anything Into Music",
    description:
      "Turn words, dates and numbers into melodies, harmonies and musical postcards. Create and share musical cards directly in your browser.",
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
      "Turn words, dates and numbers into melodies, harmonies and musical postcards. Create and share musical cards.",
    images: ["/og/musicaltoys-og.png"],
  },
};

type HomeMoment = {
  id: string;
  href: string;
  labelSr: string; // invisible identity anchor for crawlers + accessibility
  caption: string; // exactly one line
  kind: "today" | "texttotone" | "postcards" | "calendar";
};

const HOME_MOMENTS: HomeMoment[] = [
  {
    id: "today",
    href: "/today",
    labelSr: "Today — a daily musical moment",
    caption: "A daily musical moment.",
    kind: "today",
  },
  {
    id: "toys",
    href: "/toys/text-to-tone",
    labelSr: "Toys — turn everyday things into playful sound",
    caption: "Turn everyday things into playful sound.",
    kind: "texttotone",
  },
  {
    id: "postcards",
    href: "/cards/postcard/birthday",
    labelSr: "Postcards — type anything, press play, send a wish",
    caption: "Type anything. Press play. Send a wish.",
    kind: "postcards",
  },
  {
    id: "calendar",
    href: "/calendar",
    labelSr: "Calendar — one small shift from the past, turned into sound",
    caption: "One small shift from the past, turned into sound.",
    kind: "calendar",
  },
];

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function TodayPresence() {
  // A calm spiral gesture (purely visual, no audio)
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50" />
      <div className="absolute left-5 top-5">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Today
        </div>
        <div className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Spiral */}
      <div className="absolute inset-0 grid place-items-center">
        <svg
          viewBox="0 0 200 200"
          className="h-[78%] w-[78%]"
          aria-hidden="true"
        >
          <defs>
            <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="0.6" />
            </filter>
          </defs>

          <g className="origin-center animate-[spin_16s_linear_infinite] opacity-20">
            {Array.from({ length: 7 }).map((_, i) => {
              const k = i / 6;
              const r = 12 + k * 70;
              const a0 = 0;
              const a1 = Math.PI * (3.2 + k * 0.9);
              const steps = 140;
              const pts: string[] = [];
              for (let s = 0; s <= steps; s++) {
                const t = s / steps;
                const a = a0 + (a1 - a0) * t;
                const rr = r * clamp01(t);
                const x = 100 + Math.cos(a) * rr;
                const y = 100 + Math.sin(a) * rr;
                pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
              }
              return (
                <polyline
                  key={i}
                  points={pts.join(" ")}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.2}
                  className="text-slate-900"
                  filter="url(#soft)"
                />
              );
            })}
          </g>

          <circle cx="100" cy="100" r="2" className="fill-slate-900/40" />
        </svg>
      </div>

      <div className="absolute bottom-5 left-5 right-5">
        <div className="h-px w-full bg-slate-100" />
        <div className="mt-3 text-sm text-slate-600">
          A quiet window into the day.
        </div>
      </div>
    </div>
  );
}

function TextToTonePresence() {
  const demo = "PLAYFUL";

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50" />

      {/* Use a stable 3-row layout so nothing overlaps when height shrinks */}
      <div className="relative grid h-full grid-rows-[auto_1fr_auto] p-5">
        {/* TOP */}
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Toys
          </div>

          <div className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="text-[10px] uppercase tracking-wide text-slate-400">
              Demo
            </div>
            <div className="mt-1 flex items-center gap-2">
              <div className="font-semibold tracking-tight text-slate-900">
                {demo}
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <div className="text-sm text-slate-500">becomes notes</div>
            </div>
          </div>
        </div>

        {/* MIDDLE */}
        <div className="mt-4 grid place-items-center overflow-hidden">
          <svg viewBox="0 0 800 260" className="h-full w-full" aria-hidden="true">
            {/* staff lines */}
            {Array.from({ length: 5 }).map((_, i) => (
              <line
                key={i}
                x1="40"
                y1={70 + i * 26}
                x2="760"
                y2={70 + i * 26}
                stroke="rgb(226 232 240)"
                strokeWidth="2"
              />
            ))}

            {/* notes */}
            {demo.split("").map((ch, i) => {
              const x = 90 + i * 85;
              const y = 70 + ((i * 2 + ch.charCodeAt(0)) % 5) * 26 - 10;
              return (
                <g
                  key={i}
                  className="animate-[noteFloat_3.8s_ease-in-out_infinite]"
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  <ellipse
                    cx={x}
                    cy={y}
                    rx="18"
                    ry="12"
                    fill="rgb(15 23 42)"
                    opacity="0.14"
                  />
                  <ellipse
                    cx={x}
                    cy={y}
                    rx="18"
                    ry="12"
                    fill="rgb(15 23 42)"
                    opacity="0.55"
                  />
                </g>
              );
            })}

            {/* subtle cursor */}
            <rect
              x="78"
              y="35"
              width="6"
              height="190"
              rx="3"
              fill="rgb(15 23 42)"
              opacity="0.08"
              className="animate-[cursorSlide_6s_ease-in-out_infinite]"
            />
          </svg>
        </div>

        {/* BOTTOM */}
        <div className="pt-4">
          <div className="h-px w-full bg-slate-100" />
          <div className="mt-3 text-sm text-slate-600">
            A toy that turns text into sound.
          </div>
        </div>
      </div>

      <style>{`
        @keyframes noteFloat {
          0%, 100% { transform: translateY(0px); opacity: 0.9; }
          50% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes cursorSlide {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(520px); }
        }
      `}</style>
    </div>
  );
}

function PostcardsPresence() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 animate-[bgShift_10s_ease-in-out_infinite] bg-gradient-to-br from-teal-100 via-white to-pink-100" />
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_20%,rgba(236,72,153,0.18),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(45,212,191,0.18),transparent_55%)]" />
      </div>

      {/* Stable 3-row layout */}
      <div className="relative grid h-full grid-rows-[auto_1fr_auto] p-5">
        {/* TOP */}
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Postcards
          </div>
          <div className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
            Birthday
          </div>
        </div>

        {/* MIDDLE */}
        <div className="mt-4 grid place-items-center overflow-hidden">
          <div className="relative h-full w-full max-w-[560px] rounded-3xl border border-white/60 bg-white/55 shadow-sm backdrop-blur">
            <svg
              viewBox="0 0 300 180"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <path
                d="M20,120 C70,40 120,150 170,80 C210,30 250,140 280,60"
                fill="none"
                stroke="rgba(15,23,42,0.18)"
                strokeWidth="4"
                strokeLinecap="round"
                className="animate-[trailDraw_5.2s_ease-in-out_infinite]"
                strokeDasharray="520"
                strokeDashoffset="520"
              />
            </svg>

            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-sm font-medium text-slate-900/80">
                A wish in sound.
              </div>
              <div className="mt-1 text-xs text-slate-700/70">
                Type a name or message → press play.
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="pt-4">
          <div className="h-px w-full bg-slate-100/70" />
          <div className="mt-3 text-sm text-slate-700/75">
            A musical card you can send.
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bgShift {
          0%, 100% { filter: saturate(1); transform: scale(1.02); }
          50% { filter: saturate(1.1); transform: scale(1.06); }
        }
        @keyframes trailDraw {
          0% { stroke-dashoffset: 520; opacity: 0.0; }
          18% { opacity: 1; }
          60% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0.0; }
        }
      `}</style>
    </div>
  );
}

function CalendarPresence() {
  // Visual-only signature trace (reflective), no “play” cues.
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50" />

      <div className="absolute left-5 top-5 right-5">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Calendar
        </div>

        {/* “Today input” vibe */}
        <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm">
          <span className="text-slate-500">Today</span>
          <span className="h-4 w-px bg-slate-200" />
          <span className="font-medium text-slate-900">{today}</span>
        </div>
      </div>

      <div className="absolute inset-0 grid place-items-center">
        <svg viewBox="0 0 520 220" className="h-[62%] w-[92%]" aria-hidden="true">
          <path
            d="M20,140 C70,60 120,190 170,110 C220,40 270,180 320,95 C360,35 420,150 500,70"
            fill="none"
            stroke="rgba(15,23,42,0.30)"
            strokeWidth="5"
            strokeLinecap="round"
            className="animate-[wiggle_8s_ease-in-out_infinite]"
          />
          <path
            d="M20,140 C70,60 120,190 170,110 C220,40 270,180 320,95 C360,35 420,150 500,70"
            fill="none"
            stroke="rgba(15,23,42,0.08)"
            strokeWidth="14"
            strokeLinecap="round"
            className="animate-[wiggle_8s_ease-in-out_infinite]"
          />
        </svg>
      </div>

      <div className="absolute bottom-5 left-5 right-5">
        <div className="h-px w-full bg-slate-100" />
        <div className="mt-3 text-sm text-slate-600">
          A trace from the day’s memory.
        </div>
      </div>

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: translateY(0px); opacity: 0.9; }
          50% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function MomentSurface({ kind }: { kind: HomeMoment["kind"] }) {
  if (kind === "today") return <TodayPresence />;
  if (kind === "texttotone") return <TextToTonePresence />;
  if (kind === "postcards") return <PostcardsPresence />;
  return <CalendarPresence />;
}

export default function HomePage() {
  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Structured summary for AI systems */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "MusicalToys",
            url: "https://musicaltoys.app",
            description:
              "MusicalToys lets people turn words, dates, and numbers into music and musical postcards that can be played and shared online.",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "MusicalToys",
            applicationCategory: "MusicApplication",
            operatingSystem: "Web",
            url: "https://musicaltoys.app",
            description:
              "MusicalToys turns words, dates, and numbers into playful music and shareable musical cards — no music skills needed.",
            provider: {
              "@type": "Organization",
              name: "Pianotrainer",
              url: "https://pianotrainer.app",
            },
            isAccessibleForFree: true,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />

      {/* Invisible global anchor for crawlers */}
      <h1 className="sr-only">
        MusicalToys — playful sound experiences from words, dates and numbers
      </h1>

      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 md:px-8 md:pt-10">
        {/* Vertical journey */}
        <div className="flex flex-col gap-16">
          {HOME_MOMENTS.map((m, idx) => (
  <section key={m.id} className="min-h-[48svh]">
              <Link
                href={m.href}
                className="group block h-full"
                aria-label={m.labelSr}
              >
                {/* Identity anchor (invisible) */}
                <h2 className="sr-only">{m.labelSr}</h2>

                <div className="h-[38svh]">
  <MomentSurface kind={m.kind} />
</div>

                <p className="mt-5 text-base text-slate-700">{m.caption}</p>

{idx !== HOME_MOMENTS.length - 1 && (
  <div className="mt-8 h-px w-full bg-slate-200/70" />
)}
              </Link>
            </section>
          ))}
        </div>

        <footer className="mt-16 text-center text-xs text-slate-400">
          © {year} MusicalToys
        </footer>
      </div>
    </main>
  );
}