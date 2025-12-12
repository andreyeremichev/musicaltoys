export const dynamic = "force-dynamic";
export const revalidate = 0;

import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "TextToTone – Make Text Sound Cool • MusicalToys",
  description:
    "Type anything and it turns into a playful sound sequence. Instant, free, and weirdly satisfying.",
  alternates: { canonical: "/toys/text-to-tone" },
  openGraph: {
    type: "website",
    url: "https://musicaltoys.app/toys/text-to-tone",
    title: "TextToTone – Text → Sound",
    description:
      "Turn words, numbers, and random symbols into a fun sound pattern. Try it and share your best line.",
    images: [
      {
        url: "https://musicaltoys.app/og/texttotone.png",
        width: 1200,
        height: 630,
        alt: "TextToTone – Text → Sound",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TextToTone – Text → Sound",
    description:
      "Paste a phrase and it becomes a fun sound pattern. Free, instant, and shareable.",
    images: ["https://musicaltoys.app/og/texttotone.png"],
  },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}