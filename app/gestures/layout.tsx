import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestures — Acknowledge without conversation • MusicalToys",
  description:
    "Send small musical gestures (presence, calm, apology, gratitude) without typing and without starting a conversation. Choose a gesture and a voice; share as a short video with sound.",
  alternates: { canonical: "/gestures" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    title: "Gestures — Acknowledge without conversation",
    description:
      "Small musical acknowledgments you can send instead of words. Choose a gesture + voice; share as video with sound.",
    url: "https://musicaltoys.app/gestures",
    images: [
      // If you have a dedicated OG image, change this.
      { url: "/og/og-gestures.png", width: 1200, height: 630, alt: "Gestures" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gestures — Acknowledge without conversation",
    description:
      "Small musical acknowledgments you can send instead of words. Choose a gesture + voice; share as video with sound.",
    
  },
};

export default function GesturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}