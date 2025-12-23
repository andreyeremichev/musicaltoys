// lib/today/skins.ts
import type { LocalDateParts } from "./resolveToday";

export type TodaySkinId =
  | "sun"
  | "mon"
  | "tue"
  | "wed"
  | "thu"
  | "fri"
  | "sat"
  | "h1" // Jan 1
  | "h2" // Dec 25
  | "h3"; // Dec 31

export type TodaySkin = {
  bg: string; // light gradients
  ink: string;
  text: string;
  captionBase: string;
  highlight: string;
};

export const TODAY_SKINS: Record<TodaySkinId, TodaySkin> = {
  // Light, calm "paper" tints (weekday variation is subtle)
  sun: {
    bg: "linear-gradient(180deg, #F7F7FA 0%, #F0F1F6 100%)",
    ink: "#2D4AE3",
    text: "rgba(10,12,18,0.90)",
    captionBase: "rgba(10,12,18,0.55)",
    highlight: "rgba(45,74,227,0.88)",
  },
  mon: {
    bg: "linear-gradient(180deg, #FAF8F2 0%, #F3F0E7 100%)",
    ink: "#B78B1E",
    text: "rgba(12,10,6,0.90)",
    captionBase: "rgba(12,10,6,0.55)",
    highlight: "rgba(183,139,30,0.90)",
  },
  tue: {
    bg: "linear-gradient(180deg, #F2FAF9 0%, #EAF3F2 100%)",
    ink: "#0E7F77",
    text: "rgba(6,12,12,0.90)",
    captionBase: "rgba(6,12,12,0.55)",
    highlight: "rgba(14,127,119,0.90)",
  },
  wed: {
    bg: "linear-gradient(180deg, #F7F3FF 0%, #EFEAF7 100%)",
    ink: "#6B35D6",
    text: "rgba(10,8,14,0.90)",
    captionBase: "rgba(10,8,14,0.55)",
    highlight: "rgba(107,53,214,0.90)",
  },
  thu: {
    bg: "linear-gradient(180deg, #F3FBF4 0%, #EAF2EB 100%)",
    ink: "#168A3F",
    text: "rgba(8,12,8,0.90)",
    captionBase: "rgba(8,12,8,0.55)",
    highlight: "rgba(22,138,63,0.90)",
  },
  fri: {
    bg: "linear-gradient(180deg, #FFF6F3 0%, #F6ECE9 100%)",
    ink: "#C14A33",
    text: "rgba(14,8,8,0.90)",
    captionBase: "rgba(14,8,8,0.55)",
    highlight: "rgba(193,74,51,0.90)",
  },
  sat: {
    bg: "linear-gradient(180deg, #F2F9FF 0%, #E8F1F9 100%)",
    ink: "#156EA8",
    text: "rgba(8,10,14,0.90)",
    captionBase: "rgba(8,10,14,0.55)",
    highlight: "rgba(21,110,168,0.90)",
  },

  // Holidays (still light, slightly more “event” tint; no names displayed)
  h1: {
    bg: "linear-gradient(180deg, #F4FAFF 0%, #EAF2FF 100%)",
    ink: "#B86B00",
    text: "rgba(8,10,14,0.92)",
    captionBase: "rgba(8,10,14,0.58)",
    highlight: "rgba(184,107,0,0.92)",
  },
  h2: {
    bg: "linear-gradient(180deg, #FFF5F5 0%, #F6EAEA 100%)",
    ink: "#B21F2D",
    text: "rgba(14,8,8,0.92)",
    captionBase: "rgba(14,8,8,0.58)",
    highlight: "rgba(178,31,45,0.92)",
  },
  h3: {
    bg: "linear-gradient(180deg, #F2FFFD 0%, #E8F7F4 100%)",
    ink: "#0C6D66",
    text: "rgba(6,12,12,0.92)",
    captionBase: "rgba(6,12,12,0.58)",
    highlight: "rgba(12,109,102,0.92)",
  },
};

export function resolveTodaySkin(p: LocalDateParts): TodaySkinId {
  // Holiday overrides (LOCKED): Jan 1, Dec 25, Dec 31
  if (p.month === 1 && p.day === 1) return "h1";
  if (p.month === 12 && p.day === 25) return "h2";
  if (p.month === 12 && p.day === 31) return "h3";

  const map: TodaySkinId[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return map[p.weekday] ?? "mon";
}