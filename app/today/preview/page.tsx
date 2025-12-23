// app/today/preview/page.tsx
import TodayPreviewClient from "./TodayPreviewClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function TodayPreviewPage() {
  return <TodayPreviewClient />;
}