import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Year Musical Postcard – MusicalToys",
  description:
    "Create a New Year musical postcard from any date or message. Choose a background, play it, and share a link that recreates the same card.",
  alternates: { canonical: "/cards/postcard/new-year" },
  openGraph: {
    title: "New Year Musical Postcard – MusicalToys",
    description:
      "Create a New Year musical postcard from any date or message. Pick a background, play it, and share it.",
    url: "https://musicaltoys.app/cards/postcard/new-year",
    siteName: "MusicalToys",
    images: [
      {
        url: "/og/musicaltoys-og.png",
        width: 1200,
        height: 630,
        alt: "New Year Musical Postcard – MusicalToys",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "New Year Musical Postcard – MusicalToys",
    description:
      "Create a New Year musical postcard from any date or message. Pick a background, play it, and share it.",
    images: ["/og/musicaltoys-og.png"],
  },
};

export default function NewYearLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

