// app/fireplace/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fireplace – A Calm Fire Fed by Numbers",
  description:
    "Irrational numbers, turned into sound and flame. A calm musical fireplace you can leave on.",
  alternates: { canonical: "/fireplace" },
};

export default function FireplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}