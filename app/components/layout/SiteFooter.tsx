// app/components/layout/SiteFooter.tsx
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium">MusicalToys</p>
            <p className="mt-1 text-xs text-neutral-500">
              Turn text, dates & numbers into music.
            </p>
          </div>

          <nav className="flex gap-6 text-sm">
            <Link href="/about" className="text-neutral-600 hover:text-neutral-900">
              About
            </Link>
            <Link href="/contact" className="text-neutral-600 hover:text-neutral-900">
              Contact
            </Link>
            <Link href="/terms" className="text-neutral-600 hover:text-neutral-900">
              Terms
            </Link>
          </nav>
        </div>

        <div className="mt-6 text-xs text-neutral-500">
          Powered by{" "}
          <a className="underline hover:text-neutral-800" href="https://pianotrainer.app">
            Pianotrainer
          </a>
          {" · "}
          <a className="underline hover:text-neutral-800" href="https://emotionalchords.app">
            EmotionalChords
          </a>
        </div>
      </div>
    </footer>
  );
}