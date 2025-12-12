import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "ToneDial – Turn Text into Sound • MusicalToys",
  description:
    "Type words or phone-style text and hear them as sound. Same text, different spelling → different result. Free and instant.",
  alternates: { canonical: "/toys/tone-dial" },
  openGraph: {
    type: "website",
    url: "https://musicaltoys.app/toys/tone-dial",
    title: "ToneDial – Text → Sound",
    description:
      "Turn words or phone-style text into sound. Great for quick clips and experiments.",
    images: [
      {
        url: "https://musicaltoys.app/og/tonedial.png",
        width: 1200,
        height: 630,
        alt: "ToneDial — turn text into sound",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ToneDial – Text → Sound",
    description:
      "Type words or phone-style text and hear them as sound. Free and instant.",
    images: ["https://musicaltoys.app/og/tonedial.png"],
  },
  keywords: [
    "ToneDial",
    "text to sound",
    "phone text sound",
    "text experiment",
    "sound toy",
    "MusicalToys",
  ],
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}