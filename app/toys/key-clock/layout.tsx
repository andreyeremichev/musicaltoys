import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "KeyClock – Turn Dates into Sound • MusicalToys",
  description:
    "Type any date (12/25/2025, Dec 25 2025, etc.) and hear it as a short sound sequence. Same date, different spelling → different result. Free and instant.",
  alternates: { canonical: "/toys/key-clock" },
  openGraph: {
    type: "website",
    url: "https://musicaltoys.app/toys/key-clock",
    title: "KeyClock – Dates → Sound",
    description:
      "Turn any date or time into a short sound sequence. Different formats and spellings create different results. Great for quick clips.",
    images: [
      {
        url: "https://musicaltoys.app/og/keyclock.png",
        width: 1200,
        height: 630,
        alt: "KeyClock — turn dates into sound",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KeyClock – Dates → Sound",
    description:
      "Type a date/time in any format and hear it as a short sound sequence. Free and instant.",
    images: ["https://musicaltoys.app/og/keyclock.png"],
  },
  keywords: [
    "KeyClock",
    "date to sound",
    "date to music",
    "text to sound",
    "sound toy",
    "music toy",
    "shareable sound",
    "MusicalToys",
  ],
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}