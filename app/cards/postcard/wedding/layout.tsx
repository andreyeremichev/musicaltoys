import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding Musical Postcard – MusicalToys",
  description:
    "Create a Wedding musical postcard from a meaningful date or message. Choose a background, play it, and share a link that recreates the same card.",
  alternates: { canonical: "/cards/postcard/wedding" },
  openGraph: {
    title: "Wedding Musical Postcard – MusicalToys",
    description:
      "Create a Wedding musical postcard from a meaningful date or message. Pick a background, play it, and share it.",
    url: "https://musicaltoys.app/cards/postcard/wedding",
    siteName: "MusicalToys",
    images: [
      {
        url: "/og/musicaltoys-og.png",
        width: 1200,
        height: 630,
        alt: "Wedding Musical Postcard – MusicalToys",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding Musical Postcard – MusicalToys",
    description:
      "Create a Wedding musical postcard from a meaningful date or message. Pick a background, play it, and share it.",
    images: ["/og/musicaltoys-og.png"],
  },
};

export default function WeddingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}