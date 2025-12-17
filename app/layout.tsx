import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SiteHeader } from "./components/layout/SiteHeader";
import SiteFooter from "./components/layout/SiteFooter";

/* =========================
   Fonts (KEEP AS IS)
========================= */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* =========================
   Metadata
========================= */
export const metadata: Metadata = {
  metadataBase: new URL("https://musicaltoys.app"),
  applicationName: "MusicalToys",
  alternates: { canonical: "/" },
};

/* =========================
   Root Layout
========================= */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />

          <main className="flex-1">
            {children}
          </main>

          <SiteFooter />
        </div>
      </body>
    </html>
  );
}


