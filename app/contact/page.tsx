// app/contact/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact — MusicalToys",
  description:
    "Contact MusicalToys. Questions, ideas, or feedback — we’d love to hear from you. MusicalToys is powered by Pianotrainer.",
  alternates: { canonical: "/contact" },
  
  twitter: {
    card: "summary_large_image",
    title: "Contact — MusicalToys",
    description:
      "Questions, ideas, or feedback? Contact MusicalToys (powered by Pianotrainer).",
    images: ["https://musicaltoys.app/og/contact.jpg"],
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
          <p className="mt-3 text-base text-neutral-600">
            Have a question, an idea, or something delightful to share? We’d
            love to hear from you.
          </p>
        </header>

        <section className="space-y-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="text-lg font-semibold tracking-tight">
              Email
            </h2>
            <p className="mt-2 text-neutral-700">
              <a
                className="underline hover:text-neutral-900"
                href="mailto:hello@pianotrainer.app"
              >
                hello@pianotrainer.app
              </a>
            </p>
            <p className="mt-3 text-sm text-neutral-600">
              MusicalToys is powered by Pianotrainer, so we’re using one shared
              inbox for now.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="text-lg font-semibold tracking-tight">
              Quick links
            </h2>
            <div className="mt-3 flex flex-wrap gap-3">
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
              <Link
                href="/about"
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900 shadow-sm hover:bg-neutral-50"
              >
                About MusicalToys
              </Link>
            </div>
          </div>
        </section>

        <footer className="mt-12 border-t border-neutral-200 pt-6 text-sm text-neutral-500">
          <p>
            Tip: include the toy name (TextToTone, KeyClock, ToneDial) and a link
            to what you made — it helps us help you faster.
          </p>
        </footer>
      </div>
    </main>
  );
}