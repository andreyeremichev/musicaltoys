// lib/today/resolveToday.ts
export type LocalDateParts = {
  year: number;
  month: number; // 1..12
  day: number; // 1..31
  weekday: number; // 0=Sun..6=Sat
};

export function resolveLocalDateParts(d: Date): LocalDateParts {
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    weekday: d.getDay(),
  };
}

export function formatISODateKey(p: LocalDateParts): string {
  const mm = String(p.month).padStart(2, "0");
  const dd = String(p.day).padStart(2, "0");
  return `${p.year}-${mm}-${dd}`;
}

/**
 * Today phrase (LOCKED):
 * Force English + single phrase used for audio, caption, and spiral.
 * Example: "Tuesday December 23"
 */
export function formatTodayPhraseEnglish(p: LocalDateParts): string {
  const dt = new Date(p.year, p.month - 1, p.day);

  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(dt);
  const monthDay = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(dt);

  return `${weekday} ${monthDay}`;
}