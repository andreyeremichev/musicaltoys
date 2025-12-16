import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Christmas Musical Postcard – MusicalToys",
  description:
    "Create a Christmas musical postcard from any date or message. Choose a background, play it, and share a link that recreates the same card.",
  alternates: { canonical: "/cards/postcard/xmas" },
  openGraph: {
    title: "Christmas Musical Postcard – MusicalToys",
    description:
      "Create a Christmas musical postcard from any date or message. Pick a background, play it, and share it.",
    url: "https://musicaltoys.app/cards/postcard/xmas",
    siteName: "MusicalToys",
    images: [
      {
        url: "/og/musicaltoys-og.png",
        width: 1200,
        height: 630,
        alt: "Christmas Musical Postcard – MusicalToys",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Christmas Musical Postcard – MusicalToys",
    description:
      "Create a Christmas musical postcard from any date or message. Pick a background, play it, and share it.",
    images: ["/og/musicaltoys-og.png"],
  },
};

export default function XmasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


