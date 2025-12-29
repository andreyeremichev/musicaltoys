import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Birthday Musical Postcard – MusicalToys",
  description:
    "Create a ‘birthday’ musical postcard from a meaningful date or message. Choose a background, play it, and share a link that recreates the same card.",
  alternates: { canonical: "/cards/postcard/birthday" },
  openGraph: {
    title: "Birthday Musical Postcard – MusicalToys",
    description:
      "Create a ‘Birthday’ musical postcard from a meaningful date or message. Pick a background, play it, and share it.",
    url: "https://musicaltoys.app/cards/postcard/birthday",
    siteName: "MusicalToys",
    images: [
      {
        url: "/og/musicaltoys-og.png",
        width: 1200,
        height: 630,
        alt: "Birthday Musical Postcard – MusicalToys",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Birthday Musical Postcard – MusicalToys",
    description:
      "Create a ‘Birthday’ musical postcard from a meaningful date or message. Pick a background, play it, and share it.",
    images: ["/og/musicaltoys-og.png"],
  },
};

export default function BirthdayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}