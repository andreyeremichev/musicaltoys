// app/today/page.tsx
import type { Metadata } from "next";
import TodayClient from "./TodayClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Today • MusicalToys",
  description: "A daily presence. Today plays once.",
  alternates: { canonical: "/today" },
  openGraph: {
    type: "website",
    url: "https://musicaltoys.app/today",
    title: "Today • MusicalToys",
    description: "A daily presence. Today plays once.",
  },
};

export default function TodayPage() {
  return <TodayClient />;
}