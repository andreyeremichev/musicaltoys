"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Mountains_of_Christmas, Playfair_Display, Caveat } from "next/font/google";



/* =========================================================
   Christmas Musical Postcard — LIVE TRAILS + WISH MAGIC + AUDIO + INPUT CAPTION
   - Balanced: wiggly node-to-node trails
   - Brighter/Darker: node-influenced spiral (influence = 0.08)
   - Wish: type-on flash + sparkle burst + tilt + pop + 3 fonts
   - Audio: KeyClock-style engine (samples in /public/audio/notes/*.wav)
   - Background: full-card blur(2px) + tint(0.01) + subtle center veil
   - NEW: input caption highlight in sync with audio/trails
========================================================= */

/* -------------------- Wish fonts (3-style system) -------------------- */
const wishFestive = Mountains_of_Christmas({
  subsets: ["latin"],
  weight: ["400", "700"],
  adjustFontFallback: false,
  fallback: ["ui-serif", "Georgia", "serif"],
});
const wishVintage = Playfair_Display({ subsets: ["latin"], weight: ["500", "600", "700", "800"] });
const wishHand = Caveat({ subsets: ["latin"], weight: ["500", "600", "700"] });

type WishFontStyle = "festive" | "vintage" | "hand";
function wishFontClass(style: WishFontStyle): string {
  if (style === "festive") return wishFestive.className;
  if (style === "vintage") return wishVintage.className;
  return wishHand.className;
}

/* -------------------- Palette -------------------- */
const PALETTE = {
  gold: "#E8C547",
  antiqueGold: "#C9A227",
  snowWhite: "#F7F7F7",
  warmWhite: "#FFF2D8",
  ember: "#D94F4F",
  pine: "#2E6B4F",
  emerald: "#3AA17E",
  midnight: "#0B0F14",
  ink: "#1B2430",
  cocoa: "#2F2723",
  frost: "#B8EFEA",
  sky: "#8AB4FF",
  rose: "#FF6F61",
} as const;

type PaletteKey = keyof typeof PALETTE;

/* -------------------- Background presets -------------------- */
type LayoutId = "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09";

type Motion = "glow" | "pulse";
type DemoStyle = "fireworks" | "reveal";

const LAYOUTS: Record<
  LayoutId,
  {
    label: string;
    src: string;
    wishFont: WishFontStyle;
    disableBackdrop?: boolean;
    defaults: { textInk: PaletteKey; trailA: PaletteKey; trailB: PaletteKey };

    defaultMotion: Motion;
    defaultMood: Mood;
    defaultZeroPolicy: ZeroPolicy;

    demo: { style: DemoStyle; bursts?: number };
  }
> = {
  // 01 – green dress + red bow (soft illustration)
  "01": {
    label: "Bow Dress",
    src: "/cards/postcards/newyear/01.jpg",
    wishFont: "hand",
    disableBackdrop: true,
    defaults: { textInk: "cocoa", trailA: "gold", trailB: "pine" },
    defaultMotion: "glow",
    defaultMood: "balanced",
    defaultZeroPolicy: "ticks",
    demo: { style: "reveal" },
  },

  // 02 – woman on blue ornament with champagne (illustration)
  "02": {
    label: "Champagne Ornament",
    src: "/cards/postcards/newyear/02.jpg",
    wishFont: "vintage",
    disableBackdrop: true,
    defaults: { textInk: "cocoa", trailA: "gold", trailB: "sky" },
    defaultMotion: "glow",
    defaultMood: "brighter",
    defaultZeroPolicy: "ticks",
    demo: { style: "reveal" },
  },

  // 03 – red stockings + boots (graphic illustration)
  "03": {
    label: "Red Stockings",
    src: "/cards/postcards/newyear/03.jpg",
    wishFont: "festive",
    disableBackdrop: true,
    defaults: { textInk: "snowWhite", trailA: "gold", trailB: "pine" },
    defaultMotion: "glow",
    defaultMood: "balanced",
    defaultZeroPolicy: "chromatic",
    demo: { style: "reveal" },
  },

  // 04 – woman holding winter greenery (illustration)
  "04": {
    label: "Winter Greenery",
    src: "/cards/postcards/newyear/04.jpg",
    wishFont: "hand",
    disableBackdrop: true,
    defaults: { textInk: "snowWhite", trailA: "gold", trailB: "pine" },
    defaultMotion: "glow",
    defaultMood: "balanced",
    defaultZeroPolicy: "ticks",
    demo: { style: "reveal" },
  },

  // 05 – dark green party + champagne (illustration)
  "05": {
    label: "Midnight Toast",
    src: "/cards/postcards/newyear/05.jpg",
    wishFont: "vintage",
    disableBackdrop: true,
    defaults: { textInk: "warmWhite", trailA: "gold", trailB: "frost" },
    defaultMotion: "glow",
    defaultMood: "brighter",
    defaultZeroPolicy: "ticks",
    demo: { style: "reveal" },
  },

  // 06 – snowy street party crowd (photo, busy)
  "06": {
    label: "Street Celebration",
    src: "/cards/postcards/newyear/06.jpg",
    wishFont: "festive",
    disableBackdrop: true,
    defaults: { textInk: "snowWhite", trailA: "gold", trailB: "sky" },
    defaultMotion: "pulse",
    defaultMood: "balanced",
    defaultZeroPolicy: "chromatic",
    demo: { style: "fireworks", bursts: 3 },
  },

  // 07 – steampunk Christmas tree scene (busy illustration)
  "07": {
    label: "Clockwork Tree",
    src: "/cards/postcards/newyear/07.jpg",
    wishFont: "vintage",
    disableBackdrop: true,
    defaults: { textInk: "warmWhite", trailA: "antiqueGold", trailB: "gold" },
    defaultMotion: "glow",
    defaultMood: "balanced",
    defaultZeroPolicy: "chromatic",
    demo: { style: "reveal" },
  },

  // 08 – midnight clock in snowy crowd (photo, iconic)
  "08": {
    label: "Midnight Clock",
    src: "/cards/postcards/newyear/08.jpg",
    wishFont: "vintage",
    disableBackdrop: true,
    defaults: { textInk: "snowWhite", trailA: "gold", trailB: "sky" },
    defaultMotion: "pulse",
    defaultMood: "balanced",
    defaultZeroPolicy: "chromatic",
    demo: { style: "fireworks", bursts: 3 },
  },

  // 09 – clinking glasses + bokeh tree (photo, warm)
  "09": {
    label: "Cheers",
    src: "/cards/postcards/newyear/09.jpg",
    wishFont: "vintage",
    disableBackdrop: true,
    defaults: { textInk: "warmWhite", trailA: "antiqueGold", trailB: "gold" },
    defaultMotion: "glow",
    defaultMood: "brighter",
    defaultZeroPolicy: "ticks",
    demo: { style: "reveal" },
  },
};

/* -------------------- Wishes -------------------- */
const WISHES = [
  "Your wish…",           // 👈 custom wish FIRST
  "Here’s to what’s next.",
  "Happy New Year.",
  "Hello, new chapter.",
  "Midnight made a wish.",
  "More light ahead.",
  "Tonight we begin.",
  "Same us. New page.",
  "New year, new memories.",
  "Let’s make it count.",
];

const CUSTOM_WISH_LABEL = "Your wish…";

/* -------------------- UI helpers -------------------- */
function sanitizeInput(s: string) {
  return s.replace(/[^0-9A-Za-z\+\#\*\- ,:]/g, "").toUpperCase();
}
function pill(active: boolean): React.CSSProperties {
  return {
    height: 32,
    padding: "0 14px",
    borderRadius: 999,
    border: active ? "1px solid #E8C547" : "1px solid #1E2935",
    background: active ? "rgba(232,197,71,0.12)" : "transparent",
    color: active ? "#E8C547" : "rgba(230,235,242,0.88)",
    fontWeight: 850,
    fontSize: 12,
    letterSpacing: "0.02em",
    whiteSpace: "nowrap",
    cursor: "pointer",
  };
}
function iconBtn(): React.CSSProperties {
  return {
    width: 42,
    height: 42,
    borderRadius: 999,
    border: "1px solid #1E2935",
    background: "transparent",
    color: "rgba(230,235,242,0.9)",
    fontWeight: 900,
    fontSize: 16,
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  };
}
function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

/* =========================================================
   Audio engine (KeyClock-style)
========================================================= */
let _ctx: AudioContext | null = null;
const _buffers = new Map<string, AudioBuffer>();

const NOTE_ORDER = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;
type NoteName = `${(typeof NOTE_ORDER)[number]}${number}`;

function getCtx() {
  if (!_ctx) {
    const AC: any = (window as any).AudioContext || (window as any).webkitAudioContext;
    _ctx = new AC({ latencyHint: "interactive" });
  }
  return _ctx!;
}
async function unlockCtx() {
  const c = getCtx();
  if (c.state === "suspended") {
    try {
      await c.resume();
    } catch {}
  }
}
function midiToNoteName(midi: number): NoteName {
  const pc = NOTE_ORDER[midi % 12];
  const oct = Math.floor(midi / 12) - 1;
  return `${pc}${oct}` as NoteName;
}
async function loadBuffer(noteName: string): Promise<AudioBuffer> {
  if (_buffers.has(noteName)) return _buffers.get(noteName)!;
  const safe = noteName.replace("#", "%23");
  const res = await fetch(`/audio/notes/${safe}.wav`);
  if (!res.ok) throw new Error(`fetch failed: ${safe}.wav`);
  const buf = await getCtx().decodeAudioData(await res.arrayBuffer());
  _buffers.set(noteName, buf);
  return buf;
}
function playOneShotAt(ac: AudioContext, at: number, noteName: string, mode: "normal" | "tick" = "normal", gainMax = 1) {
  loadBuffer(noteName)
    .then((buf) => {
      const src = ac.createBufferSource();
      src.buffer = buf;
      const g = ac.createGain();

      if (mode === "tick") {
        g.gain.setValueAtTime(0, at);
        g.gain.linearRampToValueAtTime(0.45 * gainMax, at + 0.006);
        g.gain.setTargetAtTime(0, at + 0.05, 0.05);
        src.connect(g).connect(ac.destination);
        try {
          src.start(at);
          src.stop(at + 0.1);
        } catch {}
      } else {
        g.gain.setValueAtTime(0, at);
        g.gain.linearRampToValueAtTime(1 * gainMax, at + 0.01);
        g.gain.setTargetAtTime(0, at + 0.2, 0.05);
        src.connect(g).connect(ac.destination);
        try {
          src.start(at);
          src.stop(at + 0.25);
        } catch {}
      }
    })
    .catch(() => {});
}

/* =========================================================
   Mapping + geometry + tokenizer
========================================================= */
type DegLabel = "1" | "5" | "2" | "6" | "3" | "7" | "♯4" | "♭2" | "♭6" | "♭3" | "♭7" | "4";
const DEGREE_ORDER: DegLabel[] = ["1", "5", "2", "6", "3", "7", "♯4", "♭2", "♭6", "♭3", "♭7", "4"];

type Pt = { x: number; y: number };
function nodeAngleRad(i: number): number {
  return (i / 12) * Math.PI * 2 - Math.PI / 2;
}
function nodePosition(i: number, r = 36): Pt {
  const a = nodeAngleRad(i);
  return { x: 50 + Math.cos(a) * r, y: 50 + Math.sin(a) * r };
}
function smoothPath(points: Pt[]): string {
  if (points.length < 2) return "";
  const p0 = points[0];
  let d = `M ${p0.x.toFixed(3)} ${p0.y.toFixed(3)}`;
  for (let i = 1; i < points.length; i++) {
    const pPrev = points[i - 1];
    const p = points[i];
    const mx = (pPrev.x + p.x) / 2;
    const my = (pPrev.y + p.y) / 2;
    if (i === 1) d += ` Q ${pPrev.x.toFixed(3)} ${pPrev.y.toFixed(3)} ${mx.toFixed(3)} ${my.toFixed(3)}`;
    else d += ` T ${mx.toFixed(3)} ${my.toFixed(3)}`;
    if (i === points.length - 1) d += ` T ${p.x.toFixed(3)} ${p.y.toFixed(3)}`;
  }
  return d;
}

/* --- wiggly path (balanced) --- */
function wiggleHash01(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000000) / 1000000;
}
function wiggleClamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}
function wigglyPathFromNodes(indices: number[], seedBase: string): string {
  if (!indices.length) return "";
  const pts = indices.map((i) => nodePosition(i, 36));
  let d = `M ${pts[0].x.toFixed(3)} ${pts[0].y.toFixed(3)}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.max(0.0001, Math.hypot(dx, dy));
    const px = -(dy / len);
    const py = dx / len;
    const ampBase = wiggleClamp(len * 0.18, 1.2, 5.0);
    const r1 = wiggleHash01(`${seedBase}|seg=${i}|a`);
    const r2 = wiggleHash01(`${seedBase}|seg=${i}|b`);
    const r3 = wiggleHash01(`${seedBase}|seg=${i}|c`);
    const sgn1 = r1 < 0.5 ? -1 : 1;
    const sgn2 = r2 < 0.5 ? -1 : 1;
    const t1 = 0.33;
    const t2 = 0.66;
    const amp1 = ampBase * (0.75 + 0.45 * r2) * sgn1;
    const amp2 = ampBase * (0.75 + 0.45 * r3) * sgn2;
    const c1x = a.x + dx * t1 + px * amp1;
    const c1y = a.y + dy * t1 + py * amp1;
    const c2x = a.x + dx * t2 + px * amp2;
    const c2y = a.y + dy * t2 + py * amp2;
    d += ` C ${c1x.toFixed(3)} ${c1y.toFixed(3)} ${c2x.toFixed(3)} ${c2y.toFixed(3)} ${b.x.toFixed(3)} ${b.y.toFixed(3)}`;
  }
  return d;
}

/* ----- musical mapping ----- */
type KeyName = "BbMajor" | "Cminor";
const KEY_TONIC_PC: Record<KeyName, number> = { BbMajor: 10, Cminor: 0 };
const MAJOR_DEG = { "1": 0, "2": 2, "3": 4, "4": 5, "5": 7, "6": 9, "7": 11 } as const;
const MINOR_DEG = { "1": 0, "2": 2, "3": 3, "4": 5, "5": 7, "6": 8, "7": 10 } as const;

type Diatonic = "1" | "2" | "3" | "4" | "5" | "6" | "7";
type Chromatic = "♭2" | "♯4";

function degreeToPcOffset(deg: DegLabel, key: KeyName): number {
  const base = key === "BbMajor" ? MAJOR_DEG : MINOR_DEG;
  switch (deg) {
    case "1": return base["1"];
    case "2": return base["2"];
    case "3": return base["3"];
    case "4": return base["4"];
    case "5": return base["5"];
    case "6": return base["6"];
    case "7": return base["7"];
    case "♯4": return (base["4"] + 1) % 12;
    case "♭2": return (base["2"] + 11) % 12;
    case "♭6": return (base["6"] + 11) % 12;
    case "♭3": return (base["3"] + 11) % 12;
    case "♭7": return (base["7"] + 11) % 12;
  }
}

function minorDisplayLabel(d: Diatonic): DegLabel {
  return d === "3" ? "♭3" : d === "6" ? "♭6" : d === "7" ? "♭7" : d;
}
function degToIndexForKey(d: Diatonic, key: KeyName): number {
  const lab: DegLabel = key === "Cminor" ? minorDisplayLabel(d) : (d as any);
  return DEGREE_ORDER.indexOf(lab);
}

function degreeToMidi(d: Diatonic, key: KeyName, up?: boolean): number {
  const tonic = KEY_TONIC_PC[key];
  const off = degreeToPcOffset(d as any, key);
  const pc = (tonic + off) % 12;
  const base = (up ? 5 : 4) * 12;
  for (let m = base - 12; m <= base + 12; m++) if (m >= 36 && m <= 84 && m % 12 === pc) return m;
  return base + pc;
}
function snapPcToComfortableMidi(pcOffset: number, key: KeyName, preferC4 = true): number {
  const tonic = KEY_TONIC_PC[key];
  const pc = (tonic + pcOffset) % 12;
  const base = (preferC4 ? 4 : 3) * 12;
  for (let m = base - 12; m <= base + 12; m++) if (m >= 36 && m <= 84 && m % 12 === pc) return m;
  return (preferC4 ? 60 : 48) + pc;
}

/* ----- tokenizer ----- */
const T9: Record<string, string> = {
  A: "2", B: "2", C: "2",
  D: "3", E: "3", F: "3",
  G: "4", H: "4", I: "4",
  J: "5", K: "5", L: "5",
  M: "6", N: "6", O: "6",
  P: "7", Q: "7", R: "7", S: "7",
  T: "8", U: "8", V: "8",
  W: "9", X: "9", Y: "9", Z: "9",
};

type ZeroPolicy = "chromatic" | "ticks" | "rest";
type Token =
  | { kind: "rest"; char: "-" }
  | { kind: "deg"; d: Diatonic; up?: boolean; src: string; srcChar?: string }
  | { kind: "chroma"; c: Chromatic; src: "0"; srcChar?: string }
  | { kind: "intro" }
  | { kind: "resolve" }
  | { kind: "toggle" };

const zeroFlipRef = { current: true };

function pushDigit(tokens: Token[], digit: string, zeroPolicy: ZeroPolicy, originChar?: string) {
  if (digit === "0") {
    if (zeroPolicy === "rest") {
      tokens.push({ kind: "rest", char: "-" });
      return;
    }
    const next: Chromatic = zeroFlipRef.current ? "♭2" : "♯4";
    zeroFlipRef.current = !zeroFlipRef.current;
    tokens.push({ kind: "chroma", c: next, src: "0", srcChar: originChar });
    return;
  }
  if ("1234567".includes(digit)) {
    tokens.push({ kind: "deg", d: digit as Diatonic, src: digit, srcChar: originChar });
    return;
  }
  if (digit === "8") {
    tokens.push({ kind: "deg", d: "1", up: true, src: "8", srcChar: originChar });
    return;
  }
  if (digit === "9") {
    tokens.push({ kind: "deg", d: "2", up: true, src: "9", srcChar: originChar });
    return;
  }
}
function tokenizeKeyClock(raw: string, zeroPolicy: ZeroPolicy): Token[] {
  const s = sanitizeInput(raw);
  const out: Token[] = [];
  zeroFlipRef.current = true;
  let i = 0;
  if (s.startsWith("+")) {
    out.push({ kind: "intro" });
    i = 1;
  }
  for (; i < s.length; i++) {
    const ch = s[i];
    if (ch === "," || ch === " " || ch === "-" || ch === ":") { out.push({ kind: "rest", char: "-" }); continue; }
    if (ch === "#") { out.push({ kind: "resolve" }); continue; }
    if (ch === "*") { out.push({ kind: "toggle" }); continue; }
    if (/[A-Z]/.test(ch)) { pushDigit(out, T9[ch], zeroPolicy, ch); continue; }
    if (/[0-9]/.test(ch)) { pushDigit(out, ch, zeroPolicy); continue; }
  }
  return out;
}

/* ----- mood mapping ----- */
type Mood = "balanced" | "brighter" | "darker";
function segmentsForMood(m: Mood): KeyName[] {
  if (m === "brighter") return ["BbMajor", "BbMajor", "BbMajor"];
  if (m === "darker") return ["Cminor", "Cminor", "Cminor"];
  return ["BbMajor", "BbMajor", "Cminor", "Cminor"];
}

/* ----- schedule timing ----- */
const STEP_MS = 250;
function totalForDigitRun(n: number): number {
  if (n <= 1) return 1.0 * STEP_MS;
  if (n === 2) return 1.0 * STEP_MS;
  if (n === 3) return 1.25 * STEP_MS;
  if (n === 4) return 1.5 * STEP_MS;
  const scaled = (1 + 0.15 * (n - 2)) * STEP_MS;
  return Math.min(1.75 * STEP_MS, scaled);
}
type SItem = { tok: Token | null; dur: number };
function buildSchedule(tokens: Token[], zeroPolicy: ZeroPolicy): SItem[] {
  const kinds: ("digit" | "letter" | "rest" | "control" | "other")[] = tokens.map((t) => {
    if (!t) return "other";
    if (t.kind === "deg" || t.kind === "chroma") {
      if ((t as any).srcChar) return "letter";
      const src = (t as any).src;
      if (src >= "0" && src <= "9") return "digit";
      return "other";
    }
    if (t.kind === "rest") return "rest";
    if (t.kind === "intro" || t.kind === "resolve" || t.kind === "toggle") return "control";
    return "other";
  });

  const out: SItem[] = new Array(tokens.length);
  let i = 0;
  while (i < tokens.length) {
    const k = kinds[i];
    if (k === "letter" || k === "rest" || k === "control" || k === "other") {
      out[i] = { tok: tokens[i], dur: STEP_MS };
      i++;
      continue;
    }
    let j = i;
    while (j < tokens.length && kinds[j] === "digit") j++;
    const n = j - i;
    const total = totalForDigitRun(n);
    const per = total / n;
    for (let p = 0; p < n; p++) out[i + p] = { tok: tokens[i + p], dur: per };
    i = j;
  }
  return out;
}

/* =========================================================
   Spiral helpers (node-influenced)
========================================================= */
function wrapAngleRad(a: number): number {
  let x = a;
  while (x <= -Math.PI) x += Math.PI * 2;
  while (x > Math.PI) x -= Math.PI * 2;
  return x;
}
function angleLerp(a: number, b: number, t: number) {
  const d = wrapAngleRad(b - a);
  return a + d * t;
}
function hash01(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000000) / 1000000;
}
function spiralCurlsForCount(nPlayable: number): number {
  if (nPlayable <= 4) return 2;
  if (nPlayable <= 10) return 3;
  return 4;
}
function avgAngularJump(angles: number[]): number {
  if (angles.length < 2) return 0;
  let sum = 0;
  for (let i = 1; i < angles.length; i++) sum += Math.abs(wrapAngleRad(angles[i] - angles[i - 1]));
  return sum / (angles.length - 1);
}

/* =========================================================
   Wish sparkles
========================================================= */
type Sparkle = { id: number; x: number; y: number; vx: number; vy: number; life: number; size: number; color: string; };
function makeSparkles(cx: number, cy: number, colors: string[], count = 12): Sparkle[] {
  const out: Sparkle[] = [];
  for (let i = 0; i < count; i++) {
    const ang = Math.random() * Math.PI * 2;
    const spd = 0.5 + Math.random() * 1.4;
    out.push({
      id: Math.random(),
      x: cx + (Math.random() - 0.5) * 10,
      y: cy + (Math.random() - 0.5) * 6,
      vx: Math.cos(ang) * spd,
      vy: Math.sin(ang) * spd - 0.55,
      life: 1,
      size: 1.2 + Math.random() * 2.4,
      color: colors[(Math.random() * colors.length) | 0],
    });
  }
  return out;
}
// ---------- Fireworks particles (Pulse mode) ----------
type Firework = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 0..1
  r: number;
  color: string;
};

function makeFireworksBurst(x: number, y: number, colors: string[], count = 14): Firework[] {
  const out: Firework[] = [];
  for (let i = 0; i < count; i++) {
    const ang = Math.random() * Math.PI * 2;
    const spd = 0.6 + Math.random() * 1.8;
    out.push({
      id: Math.random(),
      x,
      y,
      vx: Math.cos(ang) * spd,
      vy: Math.sin(ang) * spd - 0.35,
      life: 1,
      r: 0.7 + Math.random() * 1.4,
      color: colors[(Math.random() * colors.length) | 0],
    });
  }
  return out;
}
/* =========================================================
   NEW: build tokenIndex -> source char index map (for caption highlight)
========================================================= */
function buildTokenCharMap(src: string, tokens: Token[], zeroPolicy: ZeroPolicy): number[] {
  const map = new Array(tokens.length).fill(-1);
  let ti = 0;

  for (let ci = 0; ci < src.length && ti < tokens.length; ci++) {
    const ch = src[ci];
    const t = tokens[ti];
    if (!t) continue;

    // tokenizer emits a token for these characters
    const isSep = ch === "," || ch === " " || ch === "-" || ch === ":";
    const isCtrl = ch === "+" || ch === "#" || ch === "*";
    const isAlphaNum = /[A-Z0-9]/.test(ch);

    if (isSep) {
      map[ti] = ci;
      ti++;
      continue;
    }
    if (isCtrl) {
      map[ti] = ci;
      ti++;
      continue;
    }
    if (isAlphaNum) {
      // special: "0" when zeroPolicy = rest becomes rest token, but we do NOT highlight it
      if (ch === "0" && zeroPolicy === "rest") {
        map[ti] = -1;
        ti++;
        continue;
      }
      map[ti] = ci;
      ti++;
      continue;
    }
  }
  return map;
}

function pickRecorderMime(): string {
  const candidates = [
    'video/mp4;codecs="avc1.42E01E,mp4a.40.2"',
    "video/mp4",
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  for (const t of candidates) {
    try {
      if ((window as any).MediaRecorder?.isTypeSupported?.(t)) return t;
    } catch {}
  }
  return "video/webm";
}

async function convertToMp4Server(inputBlob: Blob): Promise<Blob> {
  if (inputBlob.type.includes("mp4")) return inputBlob;
  try {
    const resp = await fetch("/api/convert-webm-to-mp4", {
      method: "POST",
      headers: { "Content-Type": inputBlob.type || "application/octet-stream" },
      body: inputBlob,
    });
    if (!resp.ok) throw new Error(`server convert failed: ${resp.status}`);
    const out = await resp.blob();
    if (out.size === 0) throw new Error("server returned empty blob");
    return out;
  } catch {
    // fallback: return original
    return inputBlob;
  }
}

/* =========================================================
   Page
========================================================= */
export default function XmasPostcardPage() {
  // Core
  const [layoutId, setLayoutId] = useState<LayoutId>("01");
  const layout = LAYOUTS[layoutId];

  const [typed, setTyped] = useState("HAPPY NY 2026");
  const displayText = useMemo(() => sanitizeInput(typed), [typed]);

  const [wishIdx, setWishIdx] = useState(0);
  const wishChoice = WISHES[wishIdx % WISHES.length];
  const [customWish, setCustomWish] = useState("");

const isCustomWish = wishChoice === CUSTOM_WISH_LABEL;
const wish = isCustomWish ? (customWish.trim() || CUSTOM_WISH_LABEL) : wishChoice;

  // Running
  const [isRunning, setIsRunning] = useState(false);
  // ---- Micro-demo (visual only) ----
const [demoMode, setDemoMode] = useState<DemoStyle | "none">("none");
const demoTimerRef = useRef<number | null>(null);

// Demo fireworks particles (separate from Pulse fireworks)
const [demoFireworks, setDemoFireworks] = useState<Firework[]>([]);

// Demo snapshot paths (for "reveal" demo)
const [demoMajPath, setDemoMajPath] = useState<string>("");
const [demoMinPath, setDemoMinPath] = useState<string>("");
const [demoSpiralPrev, setDemoSpiralPrev] = useState<string>("");
const [demoSpiralCur, setDemoSpiralCur] = useState<string>("");

// Quick fade in/out for reveal demo
const [demoRevealOn, setDemoRevealOn] = useState(false);

  // Caption highlight state (NEW)
  const [activeCharIdx, setActiveCharIdx] = useState<number>(-1);
  const [activeKey, setActiveKey] = useState<KeyName>("BbMajor");

  // Tweak panel
  const [tweakOpen, setTweakOpen] = useState(false);

  // Controls (locked order)
  const [textColorMode, setTextColorMode] = useState<"default" | "custom">("default"); // placeholder
  const [motion, setMotion] = useState<"glow" | "pulse">("glow");
  const [mood, setMood] = useState<Mood>("balanced");
  const [zeroPolicy, setZeroPolicy] = useState<ZeroPolicy>("chromatic");

  // Colors
  const [colorsOpen, setColorsOpen] = useState(false);
  const [textInkKey, setTextInkKey] = useState<PaletteKey>(layout.defaults.textInk);
  const [trailAKey, setTrailAKey] = useState<PaletteKey>(layout.defaults.trailA);
  const [trailBKey, setTrailBKey] = useState<PaletteKey>(layout.defaults.trailB);

  const [isExporting, setIsExporting] = useState(false);

  // ---------- Share URL (stateful) ----------
const buildShareUrl = useCallback(() => {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams();

  // card state
  params.set("bg", layoutId);
  params.set("motion", motion);
  params.set("mood", mood);
  params.set("zero", zeroPolicy);

  // user input
  params.set("q", typed || "");

  // wish state
  params.set("wish", String(wishIdx));
  params.set("cw", customWish || "");

  const url = new URL(window.location.href);
  url.search = params.toString();
  return url.toString();
}, [layoutId, motion, mood, zeroPolicy, typed, wishIdx, customWish]);

const onShare = useCallback(async () => {
  const url = buildShareUrl();
  const title = "Musical Postcard";
  const text = "Open my musical postcard";

  try {
    if (navigator.share) {
      await navigator.share({ title, text, url });
      return;
    }
  } catch {}

  try {
    await navigator.clipboard.writeText(url);
    alert("Link copied!");
  } catch {
    try {
      prompt("Copy this link:", url);
    } catch {}
  }
}, [buildShareUrl]);
// ---------- Restore postcard from share URL (one-time on mount) ----------
const didHydrateFromUrlRef = useRef(false);
const urlOverridesRef = useRef<{ motion?: boolean; mood?: boolean; zero?: boolean; q?: boolean; wish?: boolean; cw?: boolean }>({});

useEffect(() => {
  if (typeof window === "undefined") return;
  if (didHydrateFromUrlRef.current) return;
  didHydrateFromUrlRef.current = true;

  try {
    const sp = new URLSearchParams(window.location.search);

    // remember which keys were supplied in the URL (so layout defaults don't overwrite them)
    urlOverridesRef.current = {
      motion: sp.has("motion"),
      mood: sp.has("mood"),
      zero: sp.has("zero"),
      q: sp.has("q"),
      wish: sp.has("wish"),
      cw: sp.has("cw"),
    };

    // restore background first
    const bg = sp.get("bg") as LayoutId | null;
    if (bg && (bg as any) in LAYOUTS) setLayoutId(bg);

    // restore controls
    const motionParam = sp.get("motion") as Motion | null;
    if (motionParam === "glow" || motionParam === "pulse") setMotion(motionParam);

    const moodParam = sp.get("mood") as Mood | null;
    if (moodParam === "balanced" || moodParam === "brighter" || moodParam === "darker") setMood(moodParam);

    const zeroParam = sp.get("zero") as ZeroPolicy | null;
    if (zeroParam === "chromatic" || zeroParam === "ticks" || zeroParam === "rest") setZeroPolicy(zeroParam);

    // restore input
    const q = sp.get("q");
    if (typeof q === "string") setTyped(q);

    // restore wish index + custom wish
    const wishParam = sp.get("wish");
    if (wishParam != null) {
      const n = Number(wishParam);
      if (Number.isFinite(n)) setWishIdx(n);
    }

    const cw = sp.get("cw");
    if (typeof cw === "string") setCustomWish(cw);
  } catch {}
}, []);

  useEffect(() => {
  // Apply locked per-card defaults
  setTextInkKey(layout.defaults.textInk);
  setTrailAKey(layout.defaults.trailA);
  setTrailBKey(layout.defaults.trailB);

  if (!urlOverridesRef.current.motion) setMotion(layout.defaultMotion);
if (!urlOverridesRef.current.mood) setMood(layout.defaultMood);
if (!urlOverridesRef.current.zero) setZeroPolicy(layout.defaultZeroPolicy);

  setTextColorMode("default");

  // Run micro-demo (visual only) when card changes
  // Skip if currently playing
  if (!isRunning) runMicroDemo();

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [layoutId]);

  const textInk = PALETTE[textInkKey];
  const trailA = PALETTE[trailAKey];
  const trailB = PALETTE[trailBKey];

  // Sizes
  const CARD_W = 308;
  const CARD_H = 385;

  // Tokens / schedule / segments
  const tokens = useMemo(() => tokenizeKeyClock(typed, zeroPolicy), [typed, zeroPolicy]);
  const schedule = useMemo(() => buildSchedule(tokens, zeroPolicy), [tokens, zeroPolicy]);
  const segments = useMemo(() => segmentsForMood(mood), [mood]);
  const isSingleMode = mood === "brighter" || mood === "darker";

  // Caption mapping ref (NEW)
  const tokenCharMapRef = useRef<number[]>([]);
  const activeCharRef = useRef<number>(-1);

  // Motion render config
 const showGlow = motion === "glow";
const showPulseOnly = motion === "pulse";
const strokeW = 1.15; // fixed (no lines mode)

  const spiralColor = mood === "darker" ? trailB : trailA;
  const zerosBadge = zeroPolicy === "chromatic" ? "0·Color" : zeroPolicy === "ticks" ? "0·Tick" : "0·Silence";

  const stopFireworks = useCallback(() => {
  if (fireworksRafRef.current) cancelAnimationFrame(fireworksRafRef.current);
  fireworksRafRef.current = 0;
  setFireworks([]);
}, []);

const spawnFireworksAt = useCallback(
  (x: number, y: number, major: boolean) => {
    // Use your existing trail colors, plus gold for pop
    const palette = major ? [trailA, PALETTE.gold, textInk] : [trailB, PALETTE.gold, textInk];

    // Add burst particles at (x,y) in SVG coords (0..100)
    setFireworks((prev) => {
      const burst = makeFireworksBurst(x, y, palette, 16);
      const merged = [...prev, ...burst];
      // cap particles so it never explodes
      return merged.slice(-220);
    });

    // kick animation loop if not running
    if (!fireworksRafRef.current) {
      const tick = () => {
        setFireworks((prev) => {
          const next = prev
            .map((p) => ({
              ...p,
              x: p.x + p.vx,
              y: p.y + p.vy,
              vy: p.vy + 0.04,
              life: p.life - 0.05,
            }))
            .filter((p) => p.life > 0);

          if (next.length) fireworksRafRef.current = requestAnimationFrame(tick);
          else fireworksRafRef.current = 0;

          return next;
        });
      };
      fireworksRafRef.current = requestAnimationFrame(tick);
    }
  },
  [textInk, trailA, trailB]
);

  /* -------------------- Wish animation + sparkles -------------------- */
  const [wishAnimOn, setWishAnimOn] = useState(false);
  const [wishAnimText, setWishAnimText] = useState(wish);
  const [wishPop, setWishPop] = useState(false);
  const wishTimerRef = useRef<number | null>(null);

  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  // Fireworks (Pulse mode)
const [fireworks, setFireworks] = useState<Firework[]>([]);
const fireworksRafRef = useRef<number>(0);
  const sparkleRafRef = useRef<number>(0);

  const cancelSparkles = useCallback(() => {
    if (sparkleRafRef.current) cancelAnimationFrame(sparkleRafRef.current);
    sparkleRafRef.current = 0;
    setSparkles([]);
  }, []);

  const runSparkles = useCallback(() => {
    cancelSparkles();
    const cx = CARD_W * 0.52;
    const cy = CARD_H - 34;
    const colors = [trailA, textInk, PALETTE.gold];

    let items = makeSparkles(cx, cy, colors, 12);
    setSparkles(items);

    const tick = () => {
      items = items
        .map((s) => ({
          ...s,
          x: s.x + s.vx,
          y: s.y + s.vy,
          vy: s.vy + 0.05,
          life: s.life - 0.06,
        }))
        .filter((s) => s.life > 0);

      setSparkles(items);

      if (items.length) sparkleRafRef.current = requestAnimationFrame(tick);
      else sparkleRafRef.current = 0;
    };

    sparkleRafRef.current = requestAnimationFrame(tick);
  }, [CARD_H, CARD_W, cancelSparkles, textInk, trailA]);

  const cancelWishAnim = useCallback(() => {
    if (wishTimerRef.current != null) {
      window.clearTimeout(wishTimerRef.current);
      wishTimerRef.current = null;
    }
    setWishAnimOn(false);
    setWishAnimText(wish);
    setWishPop(false);
  }, [wish]);

  const runWishFlash = useCallback(
    (text: string, then?: () => void) => {
      if (wishTimerRef.current != null) {
        window.clearTimeout(wishTimerRef.current);
        wishTimerRef.current = null;
      }

      setWishAnimOn(true);
      setWishPop(false);
      setWishAnimText("");

      const full = text || "";
      const n = Math.max(1, full.length);
      const totalMs = clamp(250 + n * 8, 250, 450);
      const stepMs = Math.max(14, Math.floor(totalMs / n));

      let i = 0;
      const tick = () => {
        i++;
        setWishAnimText(full.slice(0, i));

        if (i >= full.length) {
          setWishAnimOn(false);
          setWishPop(true);
          runSparkles();
          window.setTimeout(() => setWishPop(false), 140);

          wishTimerRef.current = window.setTimeout(() => {
            wishTimerRef.current = null;
            then?.();
          }, 90);

          return;
        }

        wishTimerRef.current = window.setTimeout(tick, stepMs);
      };

      wishTimerRef.current = window.setTimeout(tick, 10);
    },
    [runSparkles]
  );
  

  /* -------------------- Trails state -------------------- */
  const majNodesRef = useRef<number[]>([]);
  const minNodesRef = useRef<number[]>([]);
  const [paths, setPaths] = useState<{ maj: string; min: string }>({ maj: "", min: "" });

  const spiralPointsRef = useRef<Pt[]>([]);
  const spiralPrevPathRef = useRef<string>("");
  const spiralCurPathRef = useRef<string>("");
  const spiralThetaRef = useRef<number>(0);
  const spiralStepRef = useRef<number>(0);

  const [spiralCurPath, setSpiralCurPath] = useState("");
  const [spiralPrevPath, setSpiralPrevPath] = useState("");

  const [pulse, setPulse] = useState<{ x: number; y: number; color: string; t: number } | null>(null);

  // Playback refs
  const rafRef = useRef<number>(0);
  const audioT0Ref = useRef<number>(0); // seconds
  const stepIndexRef = useRef<number>(0);

  function resetAllTrails() {
    majNodesRef.current = [];
    minNodesRef.current = [];
    setPaths({ maj: "", min: "" });

    spiralPointsRef.current = [];
    spiralPrevPathRef.current = "";
    spiralCurPathRef.current = "";
    setSpiralPrevPath("");
    setSpiralCurPath("");

    setPulse(null);
    stepIndexRef.current = 0;
    spiralThetaRef.current = 0;
    spiralStepRef.current = 0;

    // reset caption highlight
    activeCharRef.current = -1;
    setActiveCharIdx(-1);
    setActiveKey("BbMajor");
  }

  const stopRun = useCallback(
    (endedNaturally: boolean) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      setIsRunning(false);

      // stop highlight
      activeCharRef.current = -1;
      setActiveCharIdx(-1);

      if (endedNaturally) runWishFlash(wish);
    },
    [runWishFlash, wish]
  );

  const appendBalancedTrail = useCallback(
  (spoke: number, key: KeyName) => {
    const dq = key === "BbMajor" ? majNodesRef.current : minNodesRef.current;
    dq.push(spoke);
    if (dq.length > 9999) dq.splice(0, dq.length - 9999);

    const seed = sanitizeInput(typed);
    setPaths({
      maj: wigglyPathFromNodes(majNodesRef.current, `${seed}|maj`),
      min: wigglyPathFromNodes(minNodesRef.current, `${seed}|min`),
    });

    const p = nodePosition(spoke, 36);
    const isMaj = key === "BbMajor";

    // 🔥 NEW: Fireworks in Pulse mode
    if (showPulseOnly) {
      spawnFireworksAt(p.x, p.y, isMaj);
      return; // ⛔ skip pulse dot + trails
    }

    

    // existing pulse marker (Glow mode)
    const col = isMaj ? trailA : trailB;
    setPulse({ x: p.x, y: p.y, color: col, t: performance.now() });
  },
  [typed, trailA, trailB, showPulseOnly, spawnFireworksAt]
);

  function tokenToSpoke(tok: Token, keyNow: KeyName): number {
    if (tok.kind === "deg") return degToIndexForKey(tok.d, keyNow);
    if (tok.kind === "chroma") return DEGREE_ORDER.indexOf(tok.c as any);
    return -1;
  }

  // Spiral params derived from input (influence locked to 0.08)
  const spiralAngles = useMemo(() => {
    const keyNow: KeyName = isSingleMode ? (mood === "brighter" ? "BbMajor" : "Cminor") : "BbMajor";
    const out: number[] = [];
    for (const s of schedule) {
      const tok = s.tok;
      if (!tok) continue;
      if (tok.kind === "rest" || tok.kind === "intro" || tok.kind === "resolve" || tok.kind === "toggle") continue;
      const spoke = tokenToSpoke(tok, keyNow);
      if (spoke >= 0) out.push(nodeAngleRad(spoke));
    }
    return out;
  }, [schedule, isSingleMode, mood]);

  const spiralParams = useMemo(() => {
    const n = spiralAngles.length;
    const curls = spiralCurlsForCount(n);
    const avgJump = avgAngularJump(spiralAngles);
    const jumpNorm = clamp(avgJump / Math.PI, 0, 1);
    const maxR = clamp(20 + jumpNorm * 18, 18, 36);

    const seed = hash01(sanitizeInput(typed));
    const dir = mood === "darker" ? -1 : 1;
    const startAngle = n ? spiralAngles[0] : -Math.PI / 2;

    return { nPlayable: Math.max(1, n), curls, maxR, influence: 0.08, seed, dir, startAngle };
  }, [spiralAngles, typed, mood]);

  function startNewSpiralPass() {
    if (spiralCurPathRef.current) {
      spiralPrevPathRef.current = spiralCurPathRef.current;
      setSpiralPrevPath(spiralPrevPathRef.current);
    } else {
      spiralPrevPathRef.current = "";
      setSpiralPrevPath("");
    }

    spiralPointsRef.current = [{ x: 50, y: 50 }];
    spiralThetaRef.current = spiralParams.startAngle;
    spiralStepRef.current = 0;
    spiralCurPathRef.current = "";
    setSpiralCurPath("");
  }

  function appendSpiralStep(targetAngle: number) {
  const n = spiralParams.nPlayable;
  const baseAdvance = (spiralParams.dir * (Math.PI * 2 * spiralParams.curls)) / n;

  const prevTheta = spiralThetaRef.current;
  const proposed = prevTheta + baseAdvance;
  const theta = angleLerp(proposed, targetAngle, spiralParams.influence);

  const step = spiralStepRef.current;
  const t = clamp((step + 1) / n, 0, 1);
  const r = spiralParams.maxR * t;

  const wobbleAmp = 0.55;
  const wobblePhase = (spiralParams.seed * 1000 + step * 13.37) % (Math.PI * 2);
  const wobble = Math.sin(wobblePhase) * wobbleAmp;

  const rr = r + wobble;
  const x = 50 + Math.cos(theta) * rr;
  const y = 50 + Math.sin(theta) * rr;

  spiralThetaRef.current = theta;
  spiralStepRef.current = step + 1;

  spiralPointsRef.current.push({ x, y });
  const d = smoothPath(spiralPointsRef.current);

  spiralCurPathRef.current = d;
  setSpiralCurPath(d);

  const isMaj = spiralParams.dir === 1; // dir=+1 for Brighter (major), -1 for Darker (minor)

  // 🔥 NEW: Fireworks in Pulse mode
  if (showPulseOnly) {
    spawnFireworksAt(x, y, isMaj);
    return; // ⛔ skip pulse dot
  }

  // existing pulse marker (Glow mode)
  setPulse({ x, y, color: isMaj ? trailA : trailB, t: performance.now() });
}

  /* -------------------- Audio scheduling helpers -------------------- */
  function scheduleIntroChord(ac: AudioContext, at: number, key: KeyName) {
    (["1", "3", "5"] as Diatonic[]).forEach((d, i) => {
      const midi = degreeToMidi(d, key, false);
      playOneShotAt(ac, at + i * 0.06, midiToNoteName(midi), "normal", 0.9);
    });
  }
  function scheduleResolveCadence(ac: AudioContext, at: number, key: KeyName) {
    playOneShotAt(ac, at, midiToNoteName(degreeToMidi("5", key, false)), "normal", 0.9);
    playOneShotAt(ac, at + 0.12, midiToNoteName(degreeToMidi("1", key, false)), "normal", 0.9);
  }
  function scheduleTriad(ac: AudioContext, at: number, root: Diatonic, key: KeyName) {
    const wrap = (n: number) => (["1", "2", "3", "4", "5", "6", "7"][(n - 1 + 7) % 7] as Diatonic);
    const r = Number(root);
    const ds: Diatonic[] = [wrap(r), wrap(r + 2), wrap(r + 4)];
    ds.forEach((d) => playOneShotAt(ac, at, midiToNoteName(degreeToMidi(d, key, false)), "normal", 0.9));
  }
  function scheduleFirstInvTonic(ac: AudioContext, at: number, key: KeyName) {
    playOneShotAt(ac, at, midiToNoteName(degreeToMidi("3", key, false)), "normal", 0.9);
    playOneShotAt(ac, at, midiToNoteName(degreeToMidi("5", key, false)), "normal", 0.9);
    playOneShotAt(ac, at, midiToNoteName(degreeToMidi("1", key, true)), "normal", 0.9);
  }
  function scheduleSecondInvSupertonic(ac: AudioContext, at: number, key: KeyName) {
    playOneShotAt(ac, at, midiToNoteName(degreeToMidi("6", key, false)), "normal", 0.9);
    playOneShotAt(ac, at, midiToNoteName(degreeToMidi("2", key, true)), "normal", 0.9);
    playOneShotAt(ac, at, midiToNoteName(degreeToMidi("4", key, true)), "normal", 0.9);
  }
  function scheduleChroma(ac: AudioContext, at: number, c: Chromatic, key: KeyName, mode: "normal" | "tick") {
    const pcOff = degreeToPcOffset(c as any, key);
    const midi = snapPcToComfortableMidi(pcOff, key, true);
    playOneShotAt(ac, at, midiToNoteName(midi), mode, 0.85);
  }
  function scheduleLetterDeg(ac: AudioContext, at: number, tok: Extract<Token, { kind: "deg" }>, key: KeyName) {
    if (tok.up && tok.src === "8") {
      playOneShotAt(ac, at, midiToNoteName(degreeToMidi("1", key, false)), "normal", 0.9);
      playOneShotAt(ac, at, midiToNoteName(degreeToMidi("1", key, true)), "normal", 0.9);
      return;
    }
    if (tok.up && tok.src === "9") {
      playOneShotAt(ac, at, midiToNoteName(degreeToMidi("1", key, false)), "normal", 0.9);
      playOneShotAt(ac, at, midiToNoteName(degreeToMidi("2", key, true)), "normal", 0.9);
      return;
    }
    const midi = degreeToMidi(tok.d, key, tok.up);
    playOneShotAt(ac, at, midiToNoteName(midi), "normal", 0.9);
  }

  /* -------------------- MAIN PLAY (wish first → audio+trails+caption highlight) -------------------- */
  const playCore = useCallback(async () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;

    resetAllTrails();
    if (!displayText.trim()) return;

    // Build caption mapping for this run
    tokenCharMapRef.current = buildTokenCharMap(displayText, tokens, zeroPolicy);

    await unlockCtx();
    const ac = getCtx();

    setIsRunning(true);
    stepIndexRef.current = 0;
    activeCharRef.current = -1;
    setActiveCharIdx(-1);

    const t0 = ac.currentTime + 0.12;
    audioT0Ref.current = t0;

    const segCount = segments.length;
    const segLen = schedule.length;
    const dursMs = schedule.map((s) => s.dur);
    const cum = new Array(segLen + 1);
    cum[0] = 0;
    for (let i = 0; i < segLen; i++) cum[i + 1] = cum[i] + dursMs[i];
    const segTotalMs = cum[segLen];
    const totalSteps = segCount * segLen;

    const hasIntro = tokens.some((t) => t.kind === "intro");

    if (isSingleMode) startNewSpiralPass();

    // Schedule audio
    for (let segIdx = 0; segIdx < segCount; segIdx++) {
      const keyNow: KeyName = segments[segIdx];
      const segBaseSec = t0 + (segIdx * segTotalMs) / 1000;

      if (hasIntro) scheduleIntroChord(ac, segBaseSec, keyNow);

      for (let i = 0; i < segLen; i++) {
        const tok = schedule[i]?.tok;
        if (!tok) continue;
        const at = segBaseSec + cum[i] / 1000;

        if (tok.kind === "toggle" || tok.kind === "intro") continue;
        if (tok.kind === "resolve") { scheduleResolveCadence(ac, at, keyNow); continue; }
        if (tok.kind === "rest") continue;

        const isLetter = !!(tok as any).srcChar;

        if (tok.kind === "deg") {
          if (isLetter) scheduleLetterDeg(ac, at, tok, keyNow);
          else {
            if ("1234567".includes(tok.src)) scheduleTriad(ac, at, tok.d, keyNow);
            else if (tok.src === "8") scheduleFirstInvTonic(ac, at, keyNow);
            else if (tok.src === "9") scheduleSecondInvSupertonic(ac, at, keyNow);
          }
        } else if (tok.kind === "chroma") {
          const isZeroChroma = (tok as any).src === "0";
          const useTickEnv = isZeroChroma && zeroPolicy === "ticks";
          scheduleChroma(ac, at, tok.c, keyNow, useTickEnv ? "tick" : "normal");
        }
      }
    }

    // Visual loop synced to AudioContext time
    const timeToGlobalStep = (elapsedMs: number) => {
      const segIdx = Math.floor(elapsedMs / segTotalMs);
      if (segIdx >= segCount) return { done: true, global: totalSteps - 1 };
      const inSeg = elapsedMs - segIdx * segTotalMs;
      let idx = 0;
      while (idx + 1 < cum.length && cum[idx + 1] <= inSeg) idx++;
      return { done: false, global: segIdx * segLen + idx };
    };

    const loop = () => {
      const now = ac.currentTime;
      const elapsedMs = (now - t0) * 1000;
      const { done, global } = timeToGlobalStep(Math.max(0, elapsedMs));

      while (stepIndexRef.current <= global) {
        const s = stepIndexRef.current;
        const segIdx = Math.floor(s / segLen);
        const idxInSeg = s % segLen;

        if (idxInSeg === 0 && s !== 0) {
          if (isSingleMode) startNewSpiralPass();
        }

        const keyNow: KeyName = segments[Math.max(0, Math.min(segCount - 1, segIdx))];
        const tok = schedule[idxInSeg]?.tok;

        // Update caption highlight (even if token is control/rest, we just won’t highlight those)
        const charIdx = tokenCharMapRef.current[idxInSeg] ?? -1;

        // Only update state if changed to avoid excessive re-renders
        if (charIdx !== activeCharRef.current) {
          activeCharRef.current = charIdx;
          setActiveCharIdx(charIdx);
        }
        setActiveKey(keyNow);

        if (tok && tok.kind !== "rest" && tok.kind !== "intro" && tok.kind !== "resolve" && tok.kind !== "toggle") {
          const spoke = tokenToSpoke(tok, keyNow);
          if (spoke >= 0) {
            if (isSingleMode) appendSpiralStep(nodeAngleRad(spoke));
            else appendBalancedTrail(spoke, keyNow);
          }
        }

        stepIndexRef.current++;
      }

      if (done) {
        stopRun(true);
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  }, [
    appendBalancedTrail,
    displayText,
    isSingleMode,
    schedule,
    segments,
    stopRun,
    tokens,
    zeroPolicy,
  ]);

  const play = useCallback(async () => {
    cancelWishAnim();
    cancelSparkles();
    runWishFlash(wish, () => void playCore());
  }, [cancelSparkles, cancelWishAnim, playCore, runWishFlash, wish]);

  const onNextWish = useCallback(() => {
    cancelWishAnim();
    cancelSparkles();
    setWishIdx((v) => {
      const next = (v + 1) % WISHES.length;
      const nextChoice = WISHES[next];
runWishFlash(nextChoice === CUSTOM_WISH_LABEL ? (customWish.trim() || CUSTOM_WISH_LABEL) : nextChoice);
      return next;
    });
  }, [cancelSparkles, cancelWishAnim, runWishFlash]);

  

  function clearDemo() {
  if (demoTimerRef.current != null) {
    window.clearTimeout(demoTimerRef.current);
    demoTimerRef.current = null;
  }
  setDemoMode("none");
  setDemoFireworks([]);
  setDemoMajPath("");
  setDemoMinPath("");
  setDemoSpiralPrev("");
  setDemoSpiralCur("");
  setDemoRevealOn(false);
}

function spawnDemoFireworksBurst(count = 2) {
  // Burst near the center area: use 0..100 SVG coords
  // Slightly above center looks best
  const points = [
    { x: 50, y: 46 },
    { x: 58, y: 54 },
    { x: 42, y: 54 },
  ];

  const bursts = Math.max(1, count);
  const out: Firework[] = [];

  for (let i = 0; i < bursts; i++) {
    const p = points[i % points.length];
    const isMaj = true; // demo uses "happy" palette bias
    const cols = isMaj ? [trailA, PALETTE.gold, textInk] : [trailB, PALETTE.gold, textInk];
    out.push(...makeFireworksBurst(p.x, p.y, cols, 16));
  }

  setDemoFireworks(out);
}

function buildRevealSnapshot() {
  // Build a short “final look” without running the engine:
  // - Balanced: take a short slice of steps across segments and build wiggly paths
  // - Single-mode: build one spiral from the first N playable spokes

  const segs = segments; // current (after applying defaults on layout change)
  const segCount = segs.length;
  const segLen = schedule.length;

  const maxSteps = Math.min(segCount * segLen, 18); // short preview, looks good

  // Collect spokes in step order
  const spokes: { spoke: number; key: KeyName }[] = [];
  for (let s = 0; s < maxSteps; s++) {
    const segIdx = Math.floor(s / segLen) % segCount;
    const keyNow = segs[segIdx];
    const tok = schedule[s % segLen]?.tok;
    if (!tok) continue;
    if (tok.kind === "rest" || tok.kind === "intro" || tok.kind === "resolve" || tok.kind === "toggle") continue;

    const spoke = tok.kind === "deg" ? degToIndexForKey(tok.d, keyNow) : DEGREE_ORDER.indexOf(tok.c as any);
    if (spoke >= 0) spokes.push({ spoke, key: keyNow });
  }

  const isSingle = mood === "brighter" || mood === "darker";

  if (!isSingle) {
    const maj: number[] = [];
    const min: number[] = [];
    for (const s of spokes) {
      (s.key === "BbMajor" ? maj : min).push(s.spoke);
    }
    const seed = sanitizeInput(typed || "XMAS");
    setDemoMajPath(wigglyPathFromNodes(maj, `${seed}|demoMaj`));
    setDemoMinPath(wigglyPathFromNodes(min, `${seed}|demoMin`));
    setDemoSpiralPrev("");
    setDemoSpiralCur("");
  } else {
    // One spiral preview using the spokes’ angles
    const angles = spokes.map((s) => nodeAngleRad(s.spoke));
    const n = Math.max(1, angles.length);
    const curls = spiralCurlsForCount(n);

    const avgJump = avgAngularJump(angles);
    const jumpNorm = clamp(avgJump / Math.PI, 0, 1);
    const maxR = clamp(20 + jumpNorm * 18, 18, 36);

    const startAngle = angles[0] ?? -Math.PI / 2;
    const dir = mood === "darker" ? -1 : 1;
    const influence = spiralParams.influence; // keep your tuned value (0.08)

    let theta = startAngle;
    let pts: Pt[] = [{ x: 50, y: 50 }];

    for (let i = 0; i < angles.length; i++) {
      const baseAdvance = (dir * (Math.PI * 2 * curls)) / n;
      const proposed = theta + baseAdvance;
      theta = angleLerp(proposed, angles[i], influence);

      const t = clamp((i + 1) / n, 0, 1);
      const r = maxR * t;

      const x = 50 + Math.cos(theta) * r;
      const y = 50 + Math.sin(theta) * r;
      pts.push({ x, y });
    }

    setDemoMajPath("");
    setDemoMinPath("");
    setDemoSpiralPrev(""); // no prev in demo
    setDemoSpiralCur(smoothPath(pts));
  }
}

function runMicroDemo() {
  clearDemo();

  // Trigger the correct demo for the current layout
  if (layout.demo.style === "fireworks") {
    setDemoMode("fireworks");
    spawnDemoFireworksBurst(layout.demo.bursts ?? 2);

    // auto-clear quickly
    demoTimerRef.current = window.setTimeout(() => clearDemo(), 600);
    return;
  }

  // reveal demo
  setDemoMode("reveal");
  buildRevealSnapshot();
  setDemoRevealOn(true);

  // fade out
  demoTimerRef.current = window.setTimeout(() => {
    setDemoRevealOn(false);
    // clear a bit after fade out
    demoTimerRef.current = window.setTimeout(() => clearDemo(), 250);
  }, 550);
}
  const onDownloadVideo = useCallback(async () => {
  if (!displayText.trim()) return;
  setIsExporting(true);

  try {
    // --- 1) Setup canvas recording ---
    const FRAME_W = 1080;
    const FRAME_H = 1920;
    const FPS = 30;

    const canvas = document.createElement("canvas");
    canvas.width = FRAME_W;
    canvas.height = FRAME_H;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) throw new Error("no canvas context");

    // --- 2) Setup Audio recording (MediaStreamDestination) ---
    await unlockCtx();
    const ac = getCtx();
    const exportDst = ac.createMediaStreamDestination();

    // --- 3) Capture stream + MediaRecorder ---
    const stream = (canvas as any).captureStream(FPS) as MediaStream;
    const mixed = new MediaStream([...stream.getVideoTracks(), ...exportDst.stream.getAudioTracks()]);
    const mimeType = pickRecorderMime();
    const chunks: BlobPart[] = [];
    const rec = new MediaRecorder(mixed, { mimeType });
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);

    // --- 4) Load background image ---
    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.src = layout.src;
    await new Promise<void>((res, rej) => {
      bgImg.onload = () => res();
      bgImg.onerror = () => rej(new Error("background image failed to load"));
    });

    // --- 5) Layout inside the export frame ---
    // Match your live card ratio/feel
    const CARD_W = 860;
    const CARD_H = 1075; // ~4:5
    const CARD_X = Math.round((FRAME_W - CARD_W) / 2);
    const CARD_Y = 210;

    // Circle area inside card
    const CIRCLE_SIZE = CARD_W; // like live
    const CIRCLE_X = CARD_X;
    const CIRCLE_Y = CARD_Y + Math.round((CARD_H - CIRCLE_SIZE) / 2) - 40;

    // Caption + wish positions
    const CAP_Y = CARD_Y + 60;
    const WISH_Y = CARD_Y + CARD_H - 120;

    // --- 6) Rebuild schedule timeline (ms) ---
    const segCount = segments.length;
    const segLen = schedule.length;
    const dursMs = schedule.map((s) => s.dur);
    const cum = new Array(segLen + 1);
    cum[0] = 0;
    for (let i = 0; i < segLen; i++) cum[i + 1] = cum[i] + dursMs[i];
    const segTotalMs = cum[segLen];
    const totalSteps = segCount * segLen;
    const totalMs = segCount * segTotalMs + 250; // tiny tail

    // --- 7) Export audio schedule (same as live) ---
    const t0 = ac.currentTime + 0.25;

    const playExportOneShot = (at: number, name: string, mode: "normal" | "tick" = "normal", gainMax = 1) => {
      loadBuffer(name)
        .then((buf) => {
          const src = ac.createBufferSource();
          src.buffer = buf;
          const g = ac.createGain();

          if (mode === "tick") {
            g.gain.setValueAtTime(0, at);
            g.gain.linearRampToValueAtTime(0.45 * gainMax, at + 0.006);
            g.gain.setTargetAtTime(0, at + 0.05, 0.05);
          } else {
            g.gain.setValueAtTime(0, at);
            g.gain.linearRampToValueAtTime(1 * gainMax, at + 0.01);
            g.gain.setTargetAtTime(0, at + 0.2, 0.05);
          }

          src.connect(g);
          g.connect(exportDst);        // ✅ record audio
          g.connect(ac.destination);   // ✅ also play live while exporting (optional)

          try {
            src.start(at);
            src.stop(at + (mode === "tick" ? 0.12 : 0.3));
          } catch {}
        })
        .catch(() => {});
    };

    const scheduleIntroChordE = (at: number, key: KeyName) => {
      (["1", "3", "5"] as Diatonic[]).forEach((d, i) => {
        playExportOneShot(at + i * 0.06, midiToNoteName(degreeToMidi(d, key, false)), "normal", 0.9);
      });
    };
    const scheduleResolveCadenceE = (at: number, key: KeyName) => {
      playExportOneShot(at, midiToNoteName(degreeToMidi("5", key, false)), "normal", 0.9);
      playExportOneShot(at + 0.12, midiToNoteName(degreeToMidi("1", key, false)), "normal", 0.9);
    };
    const scheduleTriadE = (at: number, root: Diatonic, key: KeyName) => {
      const wrap = (n: number) => (["1","2","3","4","5","6","7"][(n - 1 + 7) % 7] as Diatonic);
      const r = Number(root);
      [wrap(r), wrap(r + 2), wrap(r + 4)].forEach((d) => {
        playExportOneShot(at, midiToNoteName(degreeToMidi(d, key, false)), "normal", 0.9);
      });
    };
    const scheduleFirstInvTonicE = (at: number, key: KeyName) => {
      playExportOneShot(at, midiToNoteName(degreeToMidi("3", key, false)), "normal", 0.9);
      playExportOneShot(at, midiToNoteName(degreeToMidi("5", key, false)), "normal", 0.9);
      playExportOneShot(at, midiToNoteName(degreeToMidi("1", key, true)), "normal", 0.9);
    };
    const scheduleSecondInvSupertonicE = (at: number, key: KeyName) => {
      playExportOneShot(at, midiToNoteName(degreeToMidi("6", key, false)), "normal", 0.9);
      playExportOneShot(at, midiToNoteName(degreeToMidi("2", key, true)), "normal", 0.9);
      playExportOneShot(at, midiToNoteName(degreeToMidi("4", key, true)), "normal", 0.9);
    };
    const scheduleChromaE = (at: number, c: Chromatic, key: KeyName, tick: boolean) => {
      const pcOff = degreeToPcOffset(c as any, key);
      const midi = snapPcToComfortableMidi(pcOff, key, true);
      playExportOneShot(at, midiToNoteName(midi), tick ? "tick" : "normal", 0.85);
    };
    const scheduleLetterDegE = (at: number, tok: Extract<Token, { kind: "deg" }>, key: KeyName) => {
      if (tok.up && tok.src === "8") {
        playExportOneShot(at, midiToNoteName(degreeToMidi("1", key, false)), "normal", 0.9);
        playExportOneShot(at, midiToNoteName(degreeToMidi("1", key, true)), "normal", 0.9);
        return;
      }
      if (tok.up && tok.src === "9") {
        playExportOneShot(at, midiToNoteName(degreeToMidi("1", key, false)), "normal", 0.9);
        playExportOneShot(at, midiToNoteName(degreeToMidi("2", key, true)), "normal", 0.9);
        return;
      }
      playExportOneShot(at, midiToNoteName(degreeToMidi(tok.d, key, tok.up)), "normal", 0.9);
    };

    const hasIntro = tokens.some((t) => t.kind === "intro");

    for (let segIdx = 0; segIdx < segCount; segIdx++) {
      const keyNow: KeyName = segments[segIdx];
      const segBase = t0 + (segIdx * segTotalMs) / 1000;

      if (hasIntro) scheduleIntroChordE(segBase, keyNow);

      for (let i = 0; i < segLen; i++) {
        const tok = schedule[i]?.tok;
        if (!tok) continue;

        const at = segBase + cum[i] / 1000;

        if (tok.kind === "toggle" || tok.kind === "intro") continue;
        if (tok.kind === "resolve") { scheduleResolveCadenceE(at, keyNow); continue; }
        if (tok.kind === "rest") continue;

        const isLetter = !!(tok as any).srcChar;

        if (tok.kind === "deg") {
          if (isLetter) scheduleLetterDegE(at, tok, keyNow);
          else {
            if ("1234567".includes(tok.src)) scheduleTriadE(at, tok.d, keyNow);
            else if (tok.src === "8") scheduleFirstInvTonicE(at, keyNow);
            else if (tok.src === "9") scheduleSecondInvSupertonicE(at, keyNow);
          }
        } else if (tok.kind === "chroma") {
          const isZeroChroma = (tok as any).src === "0";
          const tick = isZeroChroma && zeroPolicy === "ticks";
          scheduleChromaE(at, tok.c, keyNow, tick);
        }
      }
    }

    // --- 8) Simulate visuals (paths/spiral/fireworks) ---
    const isSingleMode = mood === "brighter" || mood === "darker";
    const showGlow = motion === "glow";
    const showPulseOnly = motion === "pulse";

    // build token->char map for caption highlight
    const tokenCharMap = buildTokenCharMap(displayText, tokens, zeroPolicy);

    // working state for export simulation
    const majNodes: number[] = [];
    const minNodes: number[] = [];
    let spiralPts: Pt[] = [];
    let spiralPrev = "";
    let spiralCur = "";
    let spiralTheta = spiralParams.startAngle;
    let spiralStep = 0;

    // Fireworks particles (SVG space 0..100)
    type Fw = { x: number; y: number; vx: number; vy: number; life: number; r: number; color: string; };
    let fw: Fw[] = [];

    const spawnFw = (x: number, y: number, isMaj: boolean) => {
      const cols = isMaj ? [trailA, PALETTE.gold, textInk] : [trailB, PALETTE.gold, textInk];
      const burst = makeFireworksBurst(x, y, cols, 16);
      fw = [...fw, ...burst].slice(-220);
    };

    const updateFw = (dt: number) => {
      fw = fw
        .map((p) => ({
          ...p,
          x: p.x + p.vx * dt,
          y: p.y + p.vy * dt,
          vy: p.vy + 0.04 * dt,
          life: p.life - 0.05 * dt,
        }))
        .filter((p) => p.life > 0);
    };

    const startSpiralPass = () => {
      spiralPrev = spiralCur;
      spiralPts = [{ x: 50, y: 50 }];
      spiralTheta = spiralParams.startAngle;
      spiralStep = 0;
      spiralCur = "";
    };

    if (isSingleMode) startSpiralPass();

    const stepToSpoke = (tok: Token, keyNow: KeyName) => {
      if (tok.kind === "deg") return degToIndexForKey(tok.d, keyNow);
      if (tok.kind === "chroma") return DEGREE_ORDER.indexOf(tok.c as any);
      return -1;
    };

    // --- 9) Recorder loop ---
    rec.start();

    const startWall = performance.now();
    let lastWall = startWall;
    let lastStepDrawn = -1;

    const drawFrame = () => {
      const nowWall = performance.now();
      const elapsedWall = nowWall - startWall;
      const dt = (nowWall - lastWall) / (1000 / 30); // normalized to ~frames
      lastWall = nowWall;

      // background draw (cover)
      ctx.save();
      ctx.clearRect(0, 0, FRAME_W, FRAME_H);

      // draw bg cover
      const scale = Math.max(CARD_W / bgImg.width, CARD_H / bgImg.height);
      const sw = bgImg.width * scale;
      const sh = bgImg.height * scale;
      const sx = CARD_X + (CARD_W - sw) / 2;
      const sy = CARD_Y + (CARD_H - sh) / 2;

      // blur approximation
      ctx.filter = "blur(2px)";
      ctx.drawImage(bgImg, sx, sy, sw, sh);
      ctx.filter = "none";

      // tint
      ctx.fillStyle = "rgba(255,255,255,0.01)";
      ctx.fillRect(CARD_X, CARD_Y, CARD_W, CARD_H);

      // center veil
      const gx = CARD_X + CARD_W / 2;
      const gy = CARD_Y + CARD_H * 0.48;
      const rad = Math.max(CARD_W, CARD_H) * 0.42;
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, rad);
      grad.addColorStop(0, "rgba(0,0,0,0.10)");
      grad.addColorStop(0.42, "rgba(0,0,0,0.05)");
      grad.addColorStop(0.72, "rgba(0,0,0,0.00)");
      ctx.fillStyle = grad;
      ctx.fillRect(CARD_X, CARD_Y, CARD_W, CARD_H);

      ctx.restore();

      // rounded card mask (optional). Keeping simple: draw subtle round rect border
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      const r = 26;
      const x = CARD_X, y = CARD_Y, w = CARD_W, h = CARD_H;
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      // compute step by elapsedWall
      const segIdx = Math.floor(elapsedWall / segTotalMs);
      const done = elapsedWall >= totalMs;

      const inSeg = elapsedWall - segIdx * segTotalMs;
      let idxInSeg = 0;
      while (idxInSeg + 1 < cum.length && cum[idxInSeg + 1] <= inSeg) idxInSeg++;

      const globalStep = clamp(segIdx, 0, segCount - 1) * segLen + idxInSeg;

      // advance steps (discrete)
      while (lastStepDrawn < globalStep) {
        lastStepDrawn++;
        const s = lastStepDrawn;
        const seg = Math.floor(s / segLen);
        const idx = s % segLen;

        // pass boundary
        if (idx === 0 && s !== 0 && isSingleMode) startSpiralPass();

        const keyNow: KeyName = segments[Math.max(0, Math.min(segCount - 1, seg))];
        const tok = schedule[idx]?.tok;
        if (!tok) continue;
        if (tok.kind === "rest" || tok.kind === "intro" || tok.kind === "resolve" || tok.kind === "toggle") continue;

        const spoke = stepToSpoke(tok, keyNow);
        if (spoke < 0) continue;

        // trails or spiral
        if (!showPulseOnly) {
          if (!isSingleMode) {
            const dq = keyNow === "BbMajor" ? majNodes : minNodes;
            dq.push(spoke);
          } else {
            // spiral step
            const target = nodeAngleRad(spoke);
            const nP = spiralParams.nPlayable;
            const baseAdvance = (spiralParams.dir * (Math.PI * 2 * spiralParams.curls)) / nP;
            const proposed = spiralTheta + baseAdvance;
            const theta = angleLerp(proposed, target, spiralParams.influence);

            const t = clamp((spiralStep + 1) / nP, 0, 1);
            const rr = spiralParams.maxR * t;
            const x = 50 + Math.cos(theta) * rr;
            const y = 50 + Math.sin(theta) * rr;

            spiralTheta = theta;
            spiralStep++;
            spiralPts.push({ x, y });
          }
        } else {
          // fireworks burst
          const p = nodePosition(spoke, 36);
          spawnFw(p.x, p.y, keyNow === "BbMajor");
        }
      }

      // update particles
      if (showPulseOnly) updateFw(dt);

      // draw trails / spiral / fireworks into circle region
      ctx.save();
      ctx.translate(CIRCLE_X, CIRCLE_Y);
      ctx.scale(CIRCLE_SIZE / 100, CIRCLE_SIZE / 100);

      if (!showPulseOnly) {
        // glow effect via shadow
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 1.15;

        if (showGlow) {
          ctx.shadowBlur = 14;
          ctx.shadowColor = "rgba(0,0,0,0.0)";
        } else {
          ctx.shadowBlur = 0;
        }

        if (!isSingleMode) {
          const seed = sanitizeInput(typed);
          const majPath = wigglyPathFromNodes(majNodes, `${seed}|maj`);
          const minPath = wigglyPathFromNodes(minNodes, `${seed}|min`);

          if (majPath) {
            ctx.strokeStyle = trailA;
            ctx.globalAlpha = 0.9;
            if (showGlow) ctx.shadowColor = trailA;
            const p = new Path2D(majPath);
            ctx.stroke(p);
          }
          if (minPath) {
            ctx.strokeStyle = trailB;
            ctx.globalAlpha = 0.7;
            if (showGlow) ctx.shadowColor = trailB;
            const p = new Path2D(minPath);
            ctx.stroke(p);
          }
        } else {
          // spiral paths (prev + current)
          if (spiralPts.length) spiralCur = smoothPath(spiralPts);

          if (spiralPrev) {
            ctx.strokeStyle = spiralColor;
            ctx.globalAlpha = 0.25;
            if (showGlow) ctx.shadowColor = spiralColor;
            ctx.stroke(new Path2D(spiralPrev));
          }
          if (spiralCur) {
            ctx.strokeStyle = spiralColor;
            ctx.globalAlpha = 0.88;
            if (showGlow) ctx.shadowColor = spiralColor;
            ctx.stroke(new Path2D(spiralCur));
          }
        }
      } else {
        // fireworks
        ctx.globalAlpha = 1;
        for (const p of fw) {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      ctx.restore();

      // draw caption line (top)
      const keyNow: KeyName = segments[Math.max(0, Math.min(segCount - 1, Math.floor(globalStep / segLen)))];
      const activeIdx = tokenCharMap[idxInSeg] ?? -1;
      const capColor = keyNow === "BbMajor" ? trailA : trailB;

      ctx.save();
      ctx.font = `800 36px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = textInk;
      ctx.shadowBlur = 14;
      ctx.shadowColor = "rgba(0,0,0,0.35)";

      // render per char with highlight (no dots)
      const s = displayText;
      let xCursor = FRAME_W / 2;
      // measure total width
      const widths = Array.from(s).map((ch) => ctx.measureText(ch).width);
      const totalW = widths.reduce((a, b) => a + b, 0);
      xCursor = FRAME_W / 2 - totalW / 2;

      for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        const isActive = i === activeIdx && ch !== " ";
        ctx.fillStyle = isActive ? capColor : textInk;
        ctx.fillText(ch, xCursor + widths[i] / 2, CAP_Y);
        xCursor += widths[i];
      }
      ctx.restore();

      // draw wish (static during playback) — no need to reanimate in export
      ctx.save();
      ctx.translate(FRAME_W / 2, WISH_Y);
      ctx.rotate((-2 * Math.PI) / 180);
      ctx.font = `900 54px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = textInk;
      ctx.shadowBlur = 18;
      ctx.shadowColor = "rgba(0,0,0,0.45)";
      ctx.fillText(wish, 0, 0);
      ctx.restore();

      if (!done) {
        requestAnimationFrame(drawFrame);
      } else {
        rec.stop();
      }
    };

    requestAnimationFrame(drawFrame);

    const recorded: Blob = await new Promise((res) => {
      rec.onstop = () => res(new Blob(chunks, { type: mimeType || "video/webm" }));
    });

    const outBlob = await convertToMp4Server(recorded);
    const safe = (displayText || "postcard").replace(/[^A-Za-z0-9\-_.]+/g, "-");
    const a = document.createElement("a");
    a.download = `${safe}.mp4`;
    a.href = URL.createObjectURL(outBlob);
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (err) {
    console.error("[export] error:", err);
    alert("Could not export video. Please try again.");
  } finally {
    setIsExporting(false);
  }
}, [
  displayText,
  layout.src,
  motion,
  mood,
  zeroPolicy,
  schedule,
  segments,
  tokens,
  typed,
  wish,
  trailA,
  trailB,
  textInk,
  spiralParams,
]);

  // keep wishAnimText synced when idle
  useEffect(() => {
    if (!wishAnimOn) setWishAnimText(wish);
  }, [wish, wishAnimOn]);

  useEffect(() => {
  if (demoMode !== "fireworks" || demoFireworks.length === 0) return;

  let raf = 0;
  let last = performance.now();

  const tick = () => {
    const now = performance.now();
    const dt = Math.min(2, (now - last) / 16.7); // normalized
    last = now;

    setDemoFireworks((prev) =>
      prev
        .map((p) => ({
          ...p,
          x: p.x + p.vx * dt,
          y: p.y + p.vy * dt,
          vy: p.vy + 0.04 * dt,
          life: p.life - 0.05 * dt,
        }))
        .filter((p) => p.life > 0)
    );

    raf = requestAnimationFrame(tick);
  };

  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}, [demoMode, demoFireworks.length]);

  // cleanup
  useEffect(() => {
    return () => {
      if (wishTimerRef.current != null) window.clearTimeout(wishTimerRef.current);
      if (sparkleRafRef.current) cancelAnimationFrame(sparkleRafRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* Caption rendering helpers (NEW) */
  const activeCaptionColor = activeKey === "BbMajor" ? trailA : trailB;

  const CaptionLine = () => {
  const src = displayText || "";
  if (!src) return <span style={{ opacity: 0.8 }}> </span>;

  return (
    <>
      {Array.from(src).map((ch, i) => {
        const isActive = i === activeCharIdx;
        const isSpace = ch === " ";

        return (
          <span
            key={`ch-${i}`}
            style={{
              color: isActive && !isSpace ? activeCaptionColor : textInk,
              opacity: isRunning ? 1 : 0.95,
              textShadow:
                isActive && !isSpace
                  ? "0 0 10px rgba(232,197,71,0.35)"
                  : "0 1px 10px rgba(0,0,0,0.35)",
              transition: "color 80ms linear, opacity 120ms ease",
            }}
          >
            {ch}
          </span>
        );
      })}
    </>
  );
};

  // Sparkles etc. (wish state)
  

  return (
    <div style={{ minHeight: "100svh", background: "#0B0F14", color: "#E6EBF2", display: "flex", justifyContent: "center", padding: 10 }}>
      <main style={{ width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: 8 }}>
        <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "New Year Musical Postcard",
      applicationCategory: "MusicApplication",
      operatingSystem: "Web",
      url: "https://musicaltoys.app/cards/postcard/new-year",
      description:
        "Create a New Year musical postcard from any date or message. Choose a background, play it, and share a link that recreates the same postcard.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      isPartOf: {
        "@type": "WebSite",
        name: "MusicalToys",
        url: "https://musicaltoys.app",
      },
    }),
  }}
/>
        <header style={{ textAlign: "center", paddingTop: 2 }}>
          <div style={{ fontSize: 17, fontWeight: 950, letterSpacing: "0.01em" }}>New Year Musical Postcard</div>
          <div style={{ fontSize: 12, opacity: 0.72 }}>Type anything. Press play. Send a wish.</div>
        </header>

        {/* Postcard */}
        <section style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: CARD_W,
              height: CARD_H,
              borderRadius: 18,
              position: "relative",
              overflow: "hidden",
              backgroundImage: `url(${layout.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
            }}
          >
            {/* Full-card subtle frost (LOCKED tuning) */}
            {!layout.disableBackdrop && (
  <div
    style={{
      position: "absolute",
      inset: 0,
      zIndex: 1,
      pointerEvents: "none",
      backdropFilter: "blur(2px)",
      WebkitBackdropFilter: "blur(2px)",
      background: "rgba(255,255,255,0.01)",
    }}
  />
)}

            {/* Center veil (subtle) */}
           {!layout.disableBackdrop && (
  <div
    style={{
      position: "absolute",
      inset: 0,
      zIndex: 2,
      pointerEvents: "none",
      background:
        "radial-gradient(circle at 50% 48%, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.05) 42%, rgba(0,0,0,0.00) 72%)",
    }}
  />
)}

            {/* Trails layer */}
            <div style={{ position: "absolute", inset: 0, zIndex: 3, display: "grid", placeItems: "center", pointerEvents: "none" }}>
              <svg viewBox="0 0 100 100" width={CARD_W} height={CARD_W} shapeRendering="geometricPrecision" style={{ display: "block" }}>
                <defs>
                  <filter id="vt-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="b1" />
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="b2" />
                    <feMerge>
                      <feMergeNode in="b2" />
                      <feMergeNode in="b1" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* DEMO reveal overlay (on background change only) */}
{demoRevealOn && demoMode === "reveal" && !showPulseOnly ? (
  <>
    {demoMajPath ? (
      <path
        d={demoMajPath}
        fill="none"
        stroke={trailA}
        strokeWidth={1.15}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.65}
        filter={showGlow ? "url(#vt-glow)" : undefined}
      />
    ) : null}

    {demoMinPath ? (
      <path
        d={demoMinPath}
        fill="none"
        stroke={trailB}
        strokeWidth={1.15}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.5}
        filter={showGlow ? "url(#vt-glow)" : undefined}
      />
    ) : null}

    {demoSpiralCur ? (
      <path
        d={demoSpiralCur}
        fill="none"
        stroke={spiralColor}
        strokeWidth={1.15}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.65}
        filter={showGlow ? "url(#vt-glow)" : undefined}
      />
    ) : null}
  </>
) : null}
{/* Demo fireworks overlay (shows briefly on background change) */}
{demoMode === "fireworks"
  ? demoFireworks.map((p) => (
      <circle
        key={p.id}
        cx={p.x}
        cy={p.y}
        r={p.r}
        fill={p.color}
        opacity={Math.max(0, p.life)}
      />
    ))
  : null}
                {/* Single-mode: spiral (prev + current) — ONLY in Glow mode */}
{isSingleMode && !showPulseOnly && spiralPrevPath ? (
  <path
    d={spiralPrevPath}
    fill="none"
    stroke={spiralColor}
    strokeWidth={1.15}
    strokeLinecap="round"
    strokeLinejoin="round"
    opacity={0.25}
    filter={showGlow ? "url(#vt-glow)" : undefined}
  />
) : null}

{isSingleMode && !showPulseOnly && spiralCurPath ? (
  <path
    d={spiralCurPath}
    fill="none"
    stroke={spiralColor}
    strokeWidth={1.15}
    strokeLinecap="round"
    strokeLinejoin="round"
    opacity={0.88}
    filter={showGlow ? "url(#vt-glow)" : undefined}
  />
) : null}
                {showPulseOnly
  ? fireworks.map((p) => (
      <circle
        key={p.id}
        cx={p.x}
        cy={p.y}
        r={p.r}
        fill={p.color}
        opacity={Math.max(0, p.life)}
      />
    ))
  : null}

                {!isSingleMode && !showPulseOnly && paths.maj ? (
                  <path d={paths.maj} fill="none" stroke={trailA} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round" opacity={0.9}
                    filter={showGlow ? "url(#vt-glow)" : undefined} />
                ) : null}

                {!isSingleMode && !showPulseOnly && paths.min ? (
                  <path d={paths.min} fill="none" stroke={trailB} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round" opacity={0.7}
                    filter={showGlow ? "url(#vt-glow)" : undefined} />
                ) : null}

                {pulse ? (
                  <>
                    <circle cx={pulse.x} cy={pulse.y} r={1.8} fill={pulse.color} opacity={0.95} />
                    <circle cx={pulse.x} cy={pulse.y} r={4.2} fill="none" stroke={pulse.color} strokeWidth={0.6} opacity={0.45} />
                  </>
                ) : null}
              </svg>
            </div>

            {/* Sparkles overlay */}
            {sparkles.map((s) => (
              <div
                key={s.id}
                style={{
                  position: "absolute",
                  left: s.x,
                  top: s.y,
                  width: s.size,
                  height: s.size,
                  borderRadius: "50%",
                  background: s.color,
                  opacity: s.life,
                  zIndex: 5,
                  pointerEvents: "none",
                  boxShadow: `0 0 ${Math.max(6, s.size * 3)}px rgba(232,197,71,0.22)`,
                }}
              />
            ))}

            {/* TOP: Input caption line (NEW, replaces static text) */}
            <div
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                right: 10,
                zIndex: 6,
                textAlign: "center",
                fontWeight: 900,
                fontSize: 12,
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
                textShadow: "0 1px 10px rgba(0,0,0,0.35)",
              }}
              title={displayText}
            >
              <CaptionLine />
            </div>

            {/* Wish text */}
            <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, zIndex: 6, display: "grid", placeItems: "center", pointerEvents: "none" }}>
              <div
                className={wishFontClass(layout.wishFont)}
                style={{
                  transform: `rotate(-2deg) ${wishPop ? "scale(1.02)" : wishAnimOn ? "scale(0.99)" : "scale(1)"}`,
                  transition: "transform 140ms ease, opacity 120ms ease",
                  opacity: isRunning ? 0.85 : 1,
                  color: textInk,
                  fontWeight: 900,
                  fontSize: 18,
                  textShadow: "0 1px 12px rgba(0,0,0,0.45)",
                  whiteSpace: "nowrap",
                }}
              >
                {isCustomWish ? (
  <input
  autoFocus
    value={customWish}
    onChange={(e) => setCustomWish(e.target.value)}
placeholder="This year, we…"    style={{
  pointerEvents: "auto",
  background: "transparent",
  border: "none",
  outline: "none",
  textAlign: "center",
  width: "min(92vw, 28ch)",
  color: "inherit",
  font: "inherit",
}}
  />
) : (
  wishAnimText
)}
{wishAnimOn ? <span style={{ opacity: 0.6 }}>▌</span> : null}
              </div>
            </div>

            
          </div>
        </section>

        {/* Under-postcard */}
        <section style={{ display: "grid", gap: 8, marginTop: 6 }}>
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="HAPPY NY 2026"
            style={{
              width: "100%",
              background: "#0F1821",
              color: "#E6EBF2",
              border: "1px solid #1E2935",
              borderRadius: 12,
              padding: "9px 12px",
              fontSize: 14,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
              fontVariantNumeric: "tabular-nums",
              boxSizing: "border-box",
            }}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1.15fr 42px 42px", gap: 10, alignItems: "center" }}>
            <button
              type="button"
              onClick={() => void play()}
              style={{
                height: 42,
                borderRadius: 999,
                border: "none",
                background: "#E8C547",
                color: "#081019",
                fontWeight: 950,
                fontSize: 16,
                cursor: "pointer",
                minWidth: 0,
                opacity: !displayText.trim() ? 0.5 : 1,
              }}
              disabled={!displayText.trim()}
              title="Play"
            >
              {isRunning ? "⟲ Playing" : "▶ Play"}
            </button>

            <button
              type="button"
              onClick={onNextWish}
              style={{
                height: 42,
                borderRadius: 999,
                border: "1px solid #1E2935",
                background: "transparent",
                color: "#E6EBF2",
                fontWeight: 900,
                fontSize: 13,
                cursor: "pointer",
                minWidth: 0,
                whiteSpace: "nowrap",
              }}
              title="Next wish"
            >
              ✨ Next wish
            </button>

             <button type="button" onClick={onDownloadVideo} disabled={isExporting}style={iconBtn()} aria-label="Download" title="Download">
              💾
            </button>
            <button type="button" onClick={onShare} style={iconBtn()} aria-label="Share" title="Share">
  📤
</button>
          </div>

          {/* Background slider */}
          <div style={{ display: "grid", gap: 6, marginTop: 2 }}>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2, WebkitOverflowScrolling: "touch" }}>
              {(Object.keys(LAYOUTS) as LayoutId[]).map((id) => {
                const active = id === layoutId;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setLayoutId(id)}
                    style={{
                      minWidth: 64,
                      height: 48,
                      borderRadius: 10,
                      border: active ? "2px solid #E8C547" : "1px solid #1E2935",
                      padding: 0,
                      backgroundImage: `url(${LAYOUTS[id].src})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundColor: "#0F1821",
                      cursor: "pointer",
                    }}
                    aria-label={`Background ${LAYOUTS[id].label}`}
                    title={LAYOUTS[id].label}
                  />
                );
              })}
            </div>
            <div style={{ fontSize: 12, fontWeight: 900, opacity: 0.82, textAlign: "left" }}>Background</div>
          </div>

          {/* Tweak panel */}
          <div style={{ border: "1px solid #1E2935", borderRadius: 14, background: "rgba(17,24,32,0.65)", overflow: "hidden", marginTop: 4 }}>
            <button
              type="button"
              onClick={() => setTweakOpen((v) => !v)}
              style={{
                width: "100%",
                padding: "12px 14px",
                background: "transparent",
                border: "none",
                color: "#E6EBF2",
                fontWeight: 950,
                fontSize: 14,
                textAlign: "left",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
              aria-expanded={tweakOpen}
            >
              <span>Tweak the card</span>
              <span style={{ opacity: 0.65 }}>{tweakOpen ? "▴" : "▾"}</span>
            </button>

            {tweakOpen && (
              <div style={{ padding: "12px 14px 14px", display: "grid", gap: 16 }}>
                <div style={{ display: "grid", gap: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 900, opacity: 0.8 }}>Text</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button type="button" onClick={() => setTextColorMode("custom")} style={pill(textColorMode === "custom")}>Text color</button>
                    <button type="button" onClick={() => setTextColorMode("default")} style={pill(textColorMode === "default")}>Default</button>
                  </div>
                  <div style={{ fontSize: 11, opacity: 0.55 }}>(Still placeholder.)</div>
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 900, opacity: 0.8 }}>Motion</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button type="button" onClick={() => setMotion("glow")} style={pill(motion === "glow")}>Glow</button>
<button type="button" onClick={() => setMotion("pulse")} style={pill(motion === "pulse")}>Fireworks</button>
                  </div>
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 900, opacity: 0.8 }}>Mood</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button type="button" onClick={() => setMood("balanced")} style={pill(mood === "balanced")}>Balanced</button>
                    <button type="button" onClick={() => setMood("brighter")} style={pill(mood === "brighter")}>Brighter</button>
                    <button type="button" onClick={() => setMood("darker")} style={pill(mood === "darker")}>Darker</button>
                  </div>
                </div>

                <div style={{ display: "grid", gap: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 900, opacity: 0.8 }}>Special</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button type="button" onClick={() => setZeroPolicy("chromatic")} style={pill(zeroPolicy === "chromatic")}>0 · Sound</button>
                    <button type="button" onClick={() => setZeroPolicy("ticks")} style={pill(zeroPolicy === "ticks")}>0 · Tick</button>
                    <button type="button" onClick={() => setZeroPolicy("rest")} style={pill(zeroPolicy === "rest")}>0 · Silence</button>
                  </div>
                </div>

                <div style={{ borderTop: "1px dashed rgba(255,255,255,0.10)", paddingTop: 12, display: "grid", gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setColorsOpen((v) => !v)}
                    style={{ background: "transparent", border: "none", padding: 0, color: "#E6EBF2", fontWeight: 950, fontSize: 13, textAlign: "left", cursor: "pointer" }}
                    aria-expanded={colorsOpen}
                  >
                    Customize colors {colorsOpen ? "▴" : "▾"}
                  </button>

                  {colorsOpen && (
                    <>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <label style={{ display: "grid", gap: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 900, opacity: 0.8 }}>Trail A</span>
                          <select value={trailAKey} onChange={(e) => setTrailAKey(e.target.value as PaletteKey)}
                            style={{ height: 36, borderRadius: 12, border: "1px solid #1E2935", background: "#0F1821", color: "#E6EBF2", paddingInline: 10, fontWeight: 900, fontSize: 13 }}>
                            {(Object.keys(PALETTE) as PaletteKey[]).map((k) => <option key={k} value={k}>{k}</option>)}
                          </select>
                        </label>

                        <label style={{ display: "grid", gap: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 900, opacity: 0.8 }}>Trail B</span>
                          <select value={trailBKey} onChange={(e) => setTrailBKey(e.target.value as PaletteKey)}
                            style={{ height: 36, borderRadius: 12, border: "1px solid #1E2935", background: "#0F1821", color: "#E6EBF2", paddingInline: 10, fontWeight: 900, fontSize: 13 }}>
                            {(Object.keys(PALETTE) as PaletteKey[]).map((k) => <option key={k} value={k}>{k}</option>)}
                          </select>
                        </label>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setTextInkKey(layout.defaults.textInk);
                          setTrailAKey(layout.defaults.trailA);
                          setTrailBKey(layout.defaults.trailB);
                        }}
                        style={{ height: 38, borderRadius: 12, border: "1px solid #1E2935", background: "transparent", color: "rgba(230,235,242,0.88)", fontWeight: 950, fontSize: 12, cursor: "pointer" }}
                      >
                        Reset colors to background defaults
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}