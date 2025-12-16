import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Date We Met Musical Postcard – MusicalToys",
  description:
    "Create a ‘date we met’ musical postcard from a meaningful date or message. Choose a background, play it, and share a link that recreates the same card.",
  alternates: { canonical: "/cards/postcard/date-we-met" },
  openGraph: {
    title: "Date We Met Musical Postcard – MusicalToys",
    description:
      "Create a ‘date we met’ musical postcard from a meaningful date or message. Pick a background, play it, and share it.",
    url: "https://musicaltoys.app/cards/postcard/date-we-met",
    siteName: "MusicalToys",
    images: [
      {
        url: "/og/musicaltoys-og.png",
        width: 1200,
        height: 630,
        alt: "Date We Met Musical Postcard – MusicalToys",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Date We Met Musical Postcard – MusicalToys",
    description:
      "Create a ‘date we met’ musical postcard from a meaningful date or message. Pick a background, play it, and share it.",
    images: ["/og/musicaltoys-og.png"],
  },
};

export default function DateWeMetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}