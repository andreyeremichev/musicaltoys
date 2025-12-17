// app/terms/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms — MusicalToys",
  description:
    "Terms and conditions for using MusicalToys. MusicalToys is a playful, browser-based music experience powered by Pianotrainer.",
  alternates: { canonical: "/terms" },

  twitter: {
    card: "summary_large_image",
    title: "Terms — MusicalToys",
    description:
      "Terms and conditions for using MusicalToys (powered by Pianotrainer).",
    images: ["https://musicaltoys.app/og/terms.jpg"],
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Terms &amp; Conditions
          </h1>
          <p className="mt-3 text-base text-neutral-600">
            MusicalToys is a playful, browser-based music experience. By using
            the site, you agree to the terms below.
          </p>
        </header>

        <section className="space-y-6 text-neutral-700">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="text-lg font-semibold tracking-tight">Use</h2>
            <p className="mt-2">
              MusicalToys is provided “as is” for personal, creative, and
              entertainment use. Please use it responsibly and respectfully.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="text-lg font-semibold tracking-tight">
              What you create
            </h2>
            <p className="mt-2">
              You’re free to share what you create with MusicalToys. If you use
              the output publicly, please make sure you have the rights to any
              text or images you upload or include.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="text-lg font-semibold tracking-tight">
              Availability
            </h2>
            <p className="mt-2">
              We may update, change, or pause features at any time. We do our
              best to keep everything running smoothly, but we can’t guarantee
              uninterrupted access.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="text-lg font-semibold tracking-tight">
              Powered by Pianotrainer
            </h2>
            <p className="mt-2">
              MusicalToys is powered by Pianotrainer. Some older links and
              references may redirect from Pianotrainer to MusicalToys as the
              toy collection moves to its new home.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="text-lg font-semibold tracking-tight">Contact</h2>
            <p className="mt-2">
              Questions about these terms? Reach us at{" "}
              <a
                className="underline hover:text-neutral-900"
                href="mailto:hello@pianotrainer.app"
              >
                hello@pianotrainer.app
              </a>
              .
            </p>
          </div>
        </section>

        <footer className="mt-12 border-t border-neutral-200 pt-6 text-sm text-neutral-500">
          <p>
            Back to{" "}
            <Link href="/" className="underline hover:text-neutral-800">
              MusicalToys
            </Link>
            .
          </p>
        </footer>
      </div>
    </main>
  );
}