"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ToyNavHeader from "@/app/components/toys/ToyNavHeader";

// In-file only (no UI): show/hide 2nd caption line (degrees/chords)
const SHOW_DEGREES_CAPTION_LINE = false;

/* =========================
   Fixed iOS keypad look
========================= */
const IOS = {
  pageBg: "#FFFFFF",
  cardBg: "#FFFFFF",
  cardBorder: "#E5E7EB",
  text: "#111827",
  muted: "#6B7280",
  keyStroke: "rgba(17,24,39,0.28)",
  keyFill: "#FFFFFF",
  keyShadow: "rgba(0,0,0,0.12)",
  green: "#1DB954",
  major: "#B08900", // Brighter (BbMajor) — use your previous “gold”
  minor: "#1E7B45", // Darker (Cminor) — use your previous “minor”
};
const STAGE = {
  bg: "#0b0f14",          // deep velvet
  vignette: "#000000",   // for radial fade
  halo: "rgba(176, 137, 0, 0.35)", // gold halo (matches IOS.major)
};
type TrailMode = "pulse" | "glow" | "confetti";

/* =========================
   Musical mapping (B♭ Major / C minor)
========================= */
type DegLabel = "1" | "5" | "2" | "6" | "3" | "7" | "♯4" | "♭2" | "♭6" | "♭3" | "♭7" | "4";
type KeyName = "BbMajor" | "Cminor";
const KEY_TONIC_PC: Record<KeyName, number> = { BbMajor: 10, Cminor: 0 };

const MAJOR_DEG = { "1": 0, "2": 2, "3": 4, "4": 5, "5": 7, "6": 9, "7": 11 } as const;
const MINOR_DEG = { "1": 0, "2": 2, "3": 3, "4": 5, "5": 7, "6": 8, "7": 10 } as const;

type Diatonic = "1" | "2" | "3" | "4" | "5" | "6" | "7";
type Chromatic = "♭2" | "♯4";

function degreeToPcOffset(deg: DegLabel, key: KeyName): number {
  const base = key === "BbMajor" ? MAJOR_DEG : MINOR_DEG;
  switch (deg) {
    case "1":
      return base["1"];
    case "2":
      return base["2"];
    case "3":
      return base["3"];
    case "4":
      return base["4"];
    case "5":
      return base["5"];
    case "6":
      return base["6"];
    case "7":
      return base["7"];
    case "♯4":
      return (base["4"] + 1) % 12;
    case "♭2":
      return (base["2"] + 11) % 12;
    case "♭6":
      return (base["6"] + 11) % 12;
    case "♭3":
      return (base["3"] + 11) % 12;
    case "♭7":
      return (base["7"] + 11) % 12;
  }
}

const NOTE_ORDER = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;
type NoteName = `${(typeof NOTE_ORDER)[number]}${number}`;

/* =========================
   Web Audio (shared)
========================= */
let _ctx: AudioContext | null = null;
const _buffers = new Map<string, AudioBuffer>();

function getCtx() {
  if (!_ctx) {
    const AC: any = (window as any).AudioContext || (window as any).webkitAudioContext;
    _ctx = new AC({ latencyHint: "interactive" });
  }
  return _ctx!;
}
async function unlockCtx() {
  const c = getCtx();
  if (c.state === "suspended")
    try {
      await c.resume();
    } catch {}
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
function degreeToMidi(d: Diatonic, key: KeyName, up?: boolean): number {
  const tonic = KEY_TONIC_PC[key];
  const off = degreeToPcOffset(d as DegLabel, key);
  const pc = (tonic + off) % 12;
  const base = (up ? 5 : 4) * 12; // favor around C4/C5
  for (let m = base - 12; m <= base + 12; m++) if (m >= 36 && m <= 84 && (m % 12) === pc) return m;
  return base + pc;
}
function snapPcToComfortableMidi(pc: number, preferC4 = true): number {
  const base = (preferC4 ? 4 : 3) * 12;
  for (let m = base - 12; m <= base + 12; m++) {
    if (m >= 36 && m <= 84 && (m % 12) === pc) return m;
  }
  return (preferC4 ? 60 : 48) + pc;
}

/* =========================
   Phone input: sanitize + T9 + tokenizer
   (KEEP AS-IS)
========================= */
function sanitizePhoneInput(s: string): string {
  return s.replace(/[^0-9A-Za-z\+\#\*\- ]/g, "").toUpperCase();
}
const T9: Record<string, string> = {
  A: "2",
  B: "2",
  C: "2",
  D: "3",
  E: "3",
  F: "3",
  G: "4",
  H: "4",
  I: "4",
  J: "5",
  K: "5",
  L: "5",
  M: "6",
  N: "6",
  O: "6",
  P: "7",
  Q: "7",
  R: "7",
  S: "7",
  T: "8",
  U: "8",
  V: "8",
  W: "9",
  X: "9",
  Y: "9",
  Z: "9",
};

type ZeroPolicy = "chromatic" | "rest" | "ticks";
type Token =
  | { kind: "rest"; char: "-" }
  | { kind: "deg"; d: Diatonic; up?: boolean; src: string; srcChar?: string }
  | { kind: "chroma"; c: Chromatic; src: "0"; srcChar?: string }
  | { kind: "intro" } // '+'
  | { kind: "resolve" } // '#'
  | { kind: "toggle" }; // '*'

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

function tokenizePhone(raw: string, zeroPolicy: ZeroPolicy): Token[] {
  const s = sanitizePhoneInput(raw);
  const out: Token[] = [];
  zeroFlipRef.current = true;

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    if (ch === "+") {
      out.push({ kind: "intro" });
      continue;
    }
    if (ch === "-") {
      out.push({ kind: "rest", char: "-" });
      continue;
    }
    if (ch === "#") {
      out.push({ kind: "resolve" });
      continue;
    }
    if (ch === "*") {
      out.push({ kind: "toggle" });
      continue;
    }
    if (/[A-Z]/.test(ch)) {
      pushDigit(out, T9[ch], zeroPolicy, ch);
      continue;
    }
    if (/[0-9]/.test(ch)) {
      pushDigit(out, ch, zeroPolicy);
      continue;
    }
  }
  return out;
}

/* =========================
   Export helpers
========================= */
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
    return inputBlob;
  }
}
async function buildEmbeddedFontStyle(): Promise<string> {
  return `text{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace; font-variant-numeric: tabular-nums;}`;
}
function serializeFullSvg(svgEl: SVGSVGElement, w: number, h: number, extraCss = ""): string {
  let raw = new XMLSerializer().serializeToString(svgEl);
  if (!/\swidth=/.test(raw)) raw = raw.replace(/<svg([^>]*?)>/, '<svg$1 width="' + w + '">');
  else raw = raw.replace(/\swidth="[^"]*"/, ' width="' + w + '"');
  if (!/\sheight=/.test(raw)) raw = raw.replace(/<svg([^>]*?)>/, '<svg$1 height="' + h + '">');
  else raw = raw.replace(/\sheight="[^"]*"/, ' height="' + h + '"');
  if (/<style[^>]*>/.test(raw)) raw = raw.replace(/<style[^>]*>/, (m) => `${m}\n${extraCss}\n`);
  else raw = raw.replace(/<svg[^>]*?>/, (m) => `${m}\n<style>${extraCss}</style>\n`);
  return raw;
}
async function svgToImage(rawSvg: string): Promise<HTMLImageElement> {
  const blob = new Blob([rawSvg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  await new Promise<void>((res, rej) => {
    img.onload = () => res();
    img.onerror = rej;
    img.src = url;
  });
  URL.revokeObjectURL(url);
  return img;
}
function pickRecorderMime(): string {
  const candidates = [
    'video/mp4;codecs="avc1.42E01E,mp4a.40.2"',
    "video/mp4",
    "video/webm;codecs=vp9,opus",
    "video/webm",
  ];
  for (const t of candidates) {
    try {
      if ((window as any).MediaRecorder?.isTypeSupported?.(t)) return t;
    } catch {}
  }
  return "video/webm";
}

/* =========================
   Caption helpers (kept)
========================= */
function ordinalLabel(n: number) {
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}
function t9GroupLabel(ch: string): string | null {
  const u = ch.toUpperCase();
  if ("ABC".includes(u)) return "(ABC)";
  if ("DEF".includes(u)) return "(DEF)";
  if ("GHI".includes(u)) return "(GHI)";
  if ("JKL".includes(u)) return "(JKL)";
  if ("MNO".includes(u)) return "(MNO)";
  if ("PQRS".includes(u)) return "(PQRS)";
  if ("TUV".includes(u)) return "(TUV)";
  if ("WXYZ".includes(u)) return "(WXYZ)";
  return null;
}

function renderWithSupers(token: string): React.ReactNode {
  const invMatch = token.match(/^(\d+)(st|nd|rd|th)\s+(inv)$/i);
  if (invMatch) {
    const [, num, suf, tail] = invMatch;
    return (
      <>
        {num}
        <sup style={{ fontSize: "0.65em", verticalAlign: "super" }}>{suf}</sup> {tail}
      </>
    );
  }
  const ordMatch = token.match(/^(\d+)(st|nd|rd|th)$/i);
  if (ordMatch) {
    const [, num, suf] = ordMatch;
    return (
      <>
        {num}
        <sup style={{ fontSize: "0.65em", verticalAlign: "super" }}>{suf}</sup>
      </>
    );
  }
  if (/^[♭♯]\d+(\/[♭♯]\d+)?$/.test(token)) {
    const parts = token.split("/");
    const renderPart = (p: string) => {
      const m = p.match(/^([♭♯])(\d+)$/);
      if (!m) return <>{p}</>;
      const [, acc, num] = m;
      return (
        <>
          {acc}
          <sup style={{ fontSize: "0.65em", verticalAlign: "super" }}>{num}</sup>
        </>
      );
    };
    return (
      <>
        {renderPart(parts[0])}
        {parts[1] ? (
          <>
            <span>/</span>
            {renderPart(parts[1])}
          </>
        ) : null}
      </>
    );
  }
  return <>{token}</>;
}

function buildCaptionAndCurrentChain(
  raw: string,
  tokens: Token[],
  zeroPolicy: ZeroPolicy
): { caption: string[]; currentChain: string[] } {
  const caption: string[] = [];
  let currentChain: string[] = [];

  for (const t of tokens) {
    if (t.kind === "deg") caption.push(ordinalLabel(Number(t.d)));
    else if (t.kind === "chroma") caption.push(t.c);
  }

  const src = (raw || "").toUpperCase();
  if (!src.length) return { caption, currentChain };

  const lastChar = src[src.length - 1];
  const playableTokens = tokens.filter((t) => t.kind === "deg" || t.kind === "chroma");
  const lastPlayable = playableTokens[playableTokens.length - 1];

  if (lastChar === "+") return { caption, currentChain: ["+", "intro"] };
  if (lastChar === "#") return { caption, currentChain: ["#", "resolve"] };
  if (lastChar === "*") return { caption, currentChain: ["*", "rest"] };
  if (lastChar === "-") return { caption, currentChain: ["-", "rest"] };

  if (/[A-Z]/.test(lastChar)) {
    const group = t9GroupLabel(lastChar) ?? "";
    const d = T9[lastChar];
    if (!lastPlayable) return { caption, currentChain: [lastChar, group, d] };

    if (lastPlayable.kind === "deg") {
      const lab = ordinalLabel(Number(lastPlayable.d));
      if ((lastPlayable as any).up) {
        const loopLab =
          lastPlayable.d === "1" ? "loop → 1st" : lastPlayable.d === "2" ? "loop → 2nd" : `loop → ${lab}`;
        currentChain = [lastChar, group, d, loopLab];
      } else {
        currentChain = [lastChar, group, d, lab];
      }
      return { caption, currentChain };
    } else {
      currentChain = [lastChar, group, d, lastPlayable.c];
      return { caption, currentChain };
    }
  }

  if (/[0-9]/.test(lastChar)) {
    if (!lastPlayable) {
      if (lastChar === "8") return { caption, currentChain: ["8", "1st inv"] };
      if (lastChar === "9") return { caption, currentChain: ["9", "2nd inv"] };
      if (lastChar === "0") return { caption, currentChain: ["0", zeroPolicy === "rest" ? "rest" : "chromatic"] };
      if (/[1-7]/.test(lastChar)) return { caption, currentChain: [lastChar, ordinalLabel(Number(lastChar))] };
      return { caption, currentChain: [lastChar] };
    }

    if (lastPlayable.kind === "deg") {
      const lab = ordinalLabel(Number(lastPlayable.d));
      if ((lastPlayable as any).up) {
        const invLab = lastPlayable.src === "8" ? "1st inv" : lastPlayable.src === "9" ? "2nd inv" : lab;
        currentChain = [lastChar, invLab];
      } else {
        currentChain = [lastChar, lab];
      }
      return { caption, currentChain };
    } else {
      currentChain = [lastChar, lastPlayable.c];
      return { caption, currentChain };
    }
  }

  return { caption, currentChain };
}

function buildDegreesLineTokens(raw: string, tokens: Token[], zeroPolicy: ZeroPolicy): string[] {
  const out: string[] = [];
  const playable = tokens.filter((t) => t.kind === "deg" || t.kind === "chroma");
  let pi = 0;
  const s = (raw || "").toUpperCase();

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "+" || ch === "#" || ch === "*" || ch === " ") {
      out.push(ch);
      continue;
    }
    if (ch === "-") {
      out.push("-");
      continue;
    }

    if (/[A-Z0-9]/.test(ch)) {
      if (ch === "0" && zeroPolicy === "rest") {
        out.push("-");
        continue;
      }
      const t = playable[pi++];
      if (!t) {
        if (ch === "8") {
          out.push("1st inv");
          continue;
        }
        if (ch === "9") {
          out.push("2nd inv");
          continue;
        }
        if (ch === "0") {
          out.push(zeroPolicy === "rest" ? "·" : "♭2/#4");
          continue;
        }
        if (/[1-7]/.test(ch)) {
          out.push(ordinalLabel(Number(ch)));
          continue;
        }
        out.push("·");
        continue;
      }

      if (t.kind === "deg") {
        if (t.src === "8") out.push("1st inv");
        else if (t.src === "9") out.push("2nd inv");
        else out.push(ordinalLabel(Number(t.d)));
      } else {
        out.push(t.c);
      }
      continue;
    }

    out.push("·");
  }
  return out;
}

/* =========================
   iOS keypad geometry (0..100 SVG space)
========================= */
type Pt = { x: number; y: number };
function fmt(v: number, p = 3) {
  return Number(v.toFixed(p));
}

// Key centers
const COL_X = [20, 50, 80];
const ROW_Y = [20, 40, 60, 80];

type KeyId = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "*" | "0" | "#";

const KEYPAD_KEYS: Array<{ id: KeyId; digit: string; letters?: string }> = [
  { id: "1", digit: "1" },
  { id: "2", digit: "2", letters: "ABC" },
  { id: "3", digit: "3", letters: "DEF" },
  { id: "4", digit: "4", letters: "GHI" },
  { id: "5", digit: "5", letters: "JKL" },
  { id: "6", digit: "6", letters: "MNO" },
  { id: "7", digit: "7", letters: "PQRS" },
  { id: "8", digit: "8", letters: "TUV" },
  { id: "9", digit: "9", letters: "WXYZ" },
  { id: "*", digit: "*" },
  { id: "0", digit: "0", letters: "+" },
  { id: "#", digit: "#" },
];

function keyCenter(id: KeyId): Pt {
  const idx = KEYPAD_KEYS.findIndex((k) => k.id === id);
  const r = Math.floor(idx / 3);
  const c = idx % 3;
  return { x: COL_X[c], y: ROW_Y[r] };
}

function tokenToKeyId(tok: Token): KeyId | null {
  if (tok.kind === "deg") {
    if (tok.srcChar) {
      const d = T9[tok.srcChar.toUpperCase()];
      if (d && (d as any) !== "0") return d as KeyId;
      return "0";
    }
    if (tok.src === "8") return "8";
    if (tok.src === "9") return "9";
    if ("1234567".includes(tok.src)) return tok.src as KeyId;
    return null;
  }

  if (tok.kind === "chroma") return "0";

  // NEW: treat these as visual hits too
  if (tok.kind === "toggle") return "*";
  if (tok.kind === "resolve") return "#";
  if (tok.kind === "intro") return "0"; // '+' lives under 0 on iOS keypad

  return null;
}

function pathFromKeySequence(keys: KeyId[]): string {
  if (!keys.length) return "";
  const pts = keys.map((k) => keyCenter(k));
  const move = `M ${fmt(pts[0].x)} ${fmt(pts[0].y)}`;
  const rest = pts
    .slice(1)
    .map((p) => `L ${fmt(p.x)} ${fmt(p.y)}`)
    .join(" ");
  return `${move} ${rest}`;
}

/* =========================
   Component
========================= */
type Mood = "3M" | "3m"; // Brighter / Darker

export default function ToneDialPage() {
  /* CSS + Prefill */
  useEffect(() => {
    const css = `
      .vt-card, .vt-panel, .vt-actions { box-sizing: border-box; }
      .vt-panel { width: 100%; max-width: 100%; min-width: 0; position: relative; }
      .vt-card  { padding-inline: 16px; }
      .vt-panel, .vt-actions { padding-inline: 14px; }
      @media (max-width: 390px) {
        .vt-card  { padding-inline: calc(16px + env(safe-area-inset-left)) calc(16px + env(safe-area-inset-right)); }
        .vt-panel { padding-inline: calc(14px + env(safe-area-inset-left)) calc(14px + env(safe-area-inset-right)); }
        .vt-actions { padding-inline: calc(14px + env(safe-area-inset-left)) calc(14px + env(safe-area-inset-right)); }
        .action-text{ display: none !important; }
      }
      @media (max-width: 360px) {
        .vt-card  { padding-inline: calc(20px + env(safe-area-inset-left)) calc(20px + env(safe-area-inset-right)); }
        .vt-panel { padding-inline: calc(18px + env(safe-area-inset-left)) calc(18px + env(safe-area-inset-right)); }
        .vt-actions { padding-inline: calc(18px + env(safe-area-inset-left)) calc(18px + env(safe-area-inset-right)); }
      }
      .vt-actions { display:flex; flex-wrap:wrap; justify-content:center; align-items:center; column-gap:10px; row-gap:8px; }
      .minw0 { min-width:0 !important; }
    /* ToneDial: make ToyNavHeader arrows visible on white */
[data-tonedial="1"] a,
[data-tonedial="1"] button {
  -webkit-tap-highlight-color: transparent;
}

/* ToneDial: high-contrast ToyNavHeader arrows on white */
[data-tonedial="1"] a[aria-label*="Previous"],
[data-tonedial="1"] a[aria-label*="Next"],
[data-tonedial="1"] button[aria-label*="Previous"],
[data-tonedial="1"] button[aria-label*="Next"] {
  background: #e5e7eb !important;
  border: 2px solid #d1d5db !important;    /* visible border */
  box-shadow:
    0 12px 26px rgba(0, 0, 0, 0.14),
    inset 0 0 0 1px rgba(255, 255, 255, 0.6) !important;
  width: 44px !important;
  height: 44px !important;
  border-radius: 12px !important;
}

[data-tonedial="1"] a[aria-label*="Previous"] svg,
[data-tonedial="1"] a[aria-label*="Next"] svg,
[data-tonedial="1"] button[aria-label*="Previous"] svg,
[data-tonedial="1"] button[aria-label*="Next"] svg {
  color: #ffffff !important;
  stroke: #ffffff !important;
  fill: none !important;
  stroke-width: 2.6 !important;
  opacity: 1 !important;
}
  [data-tonedial="1"] a[aria-label*="Previous"]:active,
[data-tonedial="1"] a[aria-label*="Next"]:active,
[data-tonedial="1"] button[aria-label*="Previous"]:active,
[data-tonedial="1"] button[aria-label*="Next"]:active {
  transform: scale(0.96);
  box-shadow:
    0 6px 14px rgba(0, 0, 0, 0.18),
    inset 0 0 0 1px rgba(0, 0, 0, 0.06) !important;
}
   /* ToneDial: header on dark velvet */
[data-tonedial="1"] header,
[data-tonedial="1"] .toy-nav,
[data-tonedial="1"] .toy-nav-header {
  background: rgba(255, 255, 255, 0.92) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
  backdrop-filter: blur(6px);
}
  /* ToneDial: dark velvet vignette */
[data-tonedial="1"] {
  background:
    radial-gradient(
      120% 120% at 50% 10%,
      rgba(255, 255, 255, 0.06) 0%,
      rgba(0, 0, 0, 0.65) 55%,
      #000000 100%
    );
}
      `;
    const el = document.createElement("style");
    el.textContent = css;
    document.head.appendChild(el);
    return () => {
      try {
        document.head.removeChild(el);
      } catch {}
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const sp = new URLSearchParams(window.location.search);
      const q = sp.get("q");
      if (q) setRaw(sanitizePhoneInput(q));
      const t = sp.get("trail");
if (t === "pulse" || t === "glow" || t === "confetti") setTrailMode(t as TrailMode);
      const z = sp.get("zero");
      if (z === "chromatic" || z === "rest" || z === "ticks") setZeroPolicy(z as ZeroPolicy);
      const m = sp.get("mood");
      if (m === "3M" || m === "3m") setMood(m as Mood);
    } catch {}
  }, []);

  /* State */
  const [trailMode, setTrailMode] = useState<TrailMode>("pulse");
  const [zeroPolicy, setZeroPolicy] = useState<ZeroPolicy>("chromatic");
  const [mood, setMood] = useState<Mood>("3M"); // Brighter by default

  const keyNow: KeyName = mood === "3M" ? "BbMajor" : "Cminor";
  const activeColor = keyNow === "BbMajor" ? IOS.major : IOS.minor;

  const [raw, setRaw] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // --- VISUAL RESET on Motion change ---
// Prevents stale SVG state (embers / pulse timers / overlay path) from affecting the next run.
useEffect(() => {
  // kill any pending pulse clear timer
  try {
    if (hotPulseClearRef.current) {
      clearTimeout(hotPulseClearRef.current);
      hotPulseClearRef.current = null;
    }
  } catch {}
  setHotPulse(null);

  // clear overlay path + trail queue
  keysRef.current = [];
  setOverlayPath("");

  // clear confetti DOM + pool whenever leaving confetti OR switching into pulse
  emberPool.length = 0;
  try {
    const g = svgRef.current?.querySelector("#embers") as SVGGElement | null;
    if (g) g.innerHTML = "";
  } catch {}
}, [trailMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Existing transform helper (kept)
  const [showTransformHelper, setShowTransformHelper] = useState(true);

  // Playback-time UI (degrees strip vs aligned labels)
  const [showDegreesStrip, setShowDegreesStrip] = useState(true);

  // Pulse overlay
  const [hotPulse, setHotPulse] = useState<{ x: number; y: number; color: string } | null>(null);
  const hotPulseClearRef = useRef<number | null>(null);

  // Refs
  const svgRef = useRef<SVGSVGElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number>(0);
  const t0Ref = useRef<number>(0);

  // Caption canvas (live)
  const captionCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const playedIdxRef = useRef(0);
  const playableToCharRef = useRef<number[]>([]);
  const charToPlayableRef = useRef<number[]>([]);

  // Trails (single path now)
  const TRAIL_N = 9999;
  const keysRef = useRef<KeyId[]>([]);
  const [overlayPath, setOverlayPath] = useState<string>("");

  // confetti (live)
  type Ember = { x: number; y: number; vx: number; vy: number; life: number; el: SVGCircleElement };
  const emberPool = useRef<Ember[]>([]).current;
  const maxEmbers = 80;

  // Tokens
  const tokens = useMemo(() => tokenizePhone(raw, zeroPolicy), [raw, zeroPolicy]);

  const { caption: captionDegrees, currentChain } = useMemo(() => {
    return buildCaptionAndCurrentChain(raw, tokens, zeroPolicy);
  }, [raw, tokens, zeroPolicy]);

  const degreesStrip = useMemo(() => {
    return buildDegreesLineTokens(raw, tokens, zeroPolicy);
  }, [raw, tokens, zeroPolicy]);

  function appendTrailKey(k: KeyId) {
    const dq = keysRef.current;
    dq.push(k);
    if (dq.length > TRAIL_N + 1) dq.splice(0, dq.length - (TRAIL_N + 1));
    setOverlayPath(pathFromKeySequence(dq));
  }

  function spawnParticles(
    pool: Ember[],
    max: number,
    svg: SVGSVGElement,
    x: number,
    y: number,
    palette: string[],
    count = 5
  ) {
    if (!(trailMode == "confetti")) return;
    const g = svg.querySelector("#embers") as SVGGElement | null;
    if (!g) return;
    for (let k = 0; k < count; k++) {
      const el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      const col = palette[(Math.random() * palette.length) | 0] || IOS.major;
      el.setAttribute("cx", String(x));
      el.setAttribute("cy", String(y));
      el.setAttribute("r", String(0.9 + Math.random() * 0.5));
      el.setAttribute("fill", col);
      el.setAttribute("opacity", "0.9");
      g.appendChild(el);
      const ang = Math.random() * Math.PI * 2;
      const spd = 1.0 + Math.random() * 1.2;
      pool.push({ x, y, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd - 0.12, life: 1.0, el });
      if (pool.length > max) {
        const old = pool.shift()!;
        old.el.remove();
      }
    }
  }
  function updateParticles(pool: Ember[]) {
    if (trailMode !== "confetti") return;
    for (let i = pool.length - 1; i >= 0; i--) {
      const e = pool[i];
      e.x += e.vx;
      e.y += e.vy;
      e.vy += 0.03;
      e.life -= 0.06;
      if (e.life <= 0) {
        e.el.remove();
        pool.splice(i, 1);
        continue;
      }
      e.el.setAttribute("cx", e.x.toFixed(2));
      e.el.setAttribute("cy", e.y.toFixed(2));
      e.el.setAttribute("opacity", Math.max(0.28, e.life).toFixed(2));
    }
  }

  /* =========================
     Live playback
========================= */
  const NOTE_MS = 250;
  const TOK_COUNT = Math.max(1, tokens.length);
  const STEPS = TOK_COUNT; // single pass (no mixed passes)

  const wrapDeg = (n: number): Diatonic => (["1", "2", "3", "4", "5", "6", "7"][(n - 1 + 7) % 7] as Diatonic);

  function triadDegrees(root: Diatonic): [Diatonic, Diatonic, Diatonic] {
    const r = Number(root);
    return [wrapDeg(r), wrapDeg(r + 2), wrapDeg(r + 4)];
  }

  function scheduleNoteLive(ac: AudioContext, at: number, d: Diatonic, key: KeyName, up?: boolean, dur = 0.25) {
    const midi = degreeToMidi(d, key, up);
    const name = midiToNoteName(midi);
    loadBuffer(name)
      .then((buf) => {
        const src = ac.createBufferSource();
        src.buffer = buf;
        const g = ac.createGain();
        g.gain.setValueAtTime(0, at);
        g.gain.linearRampToValueAtTime(1, at + 0.01);
        g.gain.setTargetAtTime(0, at + 0.2, 0.05);
        src.connect(g).connect(ac.destination);
        try {
          src.start(at);
          src.stop(at + dur);
        } catch {}
      })
      .catch(() => {});
  }

  function scheduleTriadLive(ac: AudioContext, at: number, rootDeg: Diatonic, key: KeyName, dur = 0.25) {
    const [r, t3, t5] = triadDegrees(rootDeg);
    scheduleNoteLive(ac, at, r, key, false, dur);
    scheduleNoteLive(ac, at, t3, key, false, dur);
    scheduleNoteLive(ac, at, t5, key, false, dur);
  }

  function scheduleFirstInvTonic(ac: AudioContext, at: number, key: KeyName, dur = 0.25) {
    scheduleNoteLive(ac, at, "3", key, false, dur);
    scheduleNoteLive(ac, at, "5", key, false, dur);
    scheduleNoteLive(ac, at, "1", key, true, dur);
  }
  function scheduleSecondInvSupertonic(ac: AudioContext, at: number, key: KeyName, dur = 0.25) {
    scheduleNoteLive(ac, at, "6", key, false, dur);
    scheduleNoteLive(ac, at, "2", key, true, dur);
    scheduleNoteLive(ac, at, "4", key, true, dur);
  }

  function scheduleIntroChord(ac: AudioContext, at: number, key: KeyName) {
    const degrees: Diatonic[] = ["1", "3", "5"];
    const step = 0.06;
    degrees.forEach((d, idx) => {
      const midi = degreeToMidi(d, key);
      loadBuffer(midiToNoteName(midi))
        .then((buf) => {
          const src = ac.createBufferSource();
          src.buffer = buf;
          const g = ac.createGain();
          const t = at + idx * step;
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(1, t + 0.01);
          g.gain.setTargetAtTime(0, t + 0.2, 0.05);
          src.connect(g).connect(ac.destination);
          try {
            src.start(t);
            src.stop(t + 0.25);
          } catch {}
        })
        .catch(() => {});
    });
  }

  function scheduleResolveCadence(ac: AudioContext, at: number, key: KeyName) {
    const seq: Array<{ d: Diatonic; at: number }> = [
      { d: "5", at },
      { d: "1", at: at + 0.12 },
    ];
    seq.forEach(({ d, at }) => {
      const midi = degreeToMidi(d, key);
      loadBuffer(midiToNoteName(midi))
        .then((buf) => {
          const src = ac.createBufferSource();
          src.buffer = buf;
          const g = ac.createGain();
          g.gain.setValueAtTime(0, at);
          g.gain.linearRampToValueAtTime(1, at + 0.01);
          g.gain.setTargetAtTime(0, at + 0.2, 0.05);
          src.connect(g).connect(ac.destination);
          try {
            src.start(at);
            src.stop(at + 0.25);
          } catch {}
        })
        .catch(() => {});
    });
  }

  function romanMajor(d: Diatonic): string {
    switch (d) {
      case "1":
        return "I";
      case "2":
        return "ii";
      case "3":
        return "iii";
      case "4":
        return "IV";
      case "5":
        return "V";
      case "6":
        return "vi";
      case "7":
        return "vii°";
    }
  }
  function romanMinor(d: Diatonic): string {
    switch (d) {
      case "1":
        return "i";
      case "2":
        return "ii°";
      case "3":
        return "♭III";
      case "4":
        return "iv";
      case "5":
        return "v";
      case "6":
        return "♭VI";
      case "7":
        return "♭VII";
    }
  }

  function drawTokenWithSup(ctx: CanvasRenderingContext2D, text: string, x: number, y: number): number {
    let m = text.match(/^(\d+)(st|nd|rd|th)\s+(inv)$/i);
    if (m) {
      const [, num, suf, tail] = m;
      ctx.fillText(num, x, y);
      const wNum = ctx.measureText(num).width;
      const supSize = Math.round(parseFloat(ctx.font) * 0.65);
      const prev = ctx.font;
      ctx.font = `${supSize}px Inter, system-ui, sans-serif`;
      ctx.fillText(suf, x + wNum, y - supSize * 0.35);
      const wSup = ctx.measureText(suf).width;
      ctx.font = prev;
      ctx.fillText(" " + tail, x + wNum + wSup, y);
      return wNum + wSup + ctx.measureText(" " + tail).width;
    }

    m = text.match(/^(\d+)(st|nd|rd|th)$/i);
    if (m) {
      const [, num, suf] = m;
      ctx.fillText(num, x, y);
      const wNum = ctx.measureText(num).width;
      const supSize = Math.round(parseFloat(ctx.font) * 0.65);
      const prev = ctx.font;
      ctx.font = `${supSize}px Inter, system-ui, sans-serif`;
      ctx.fillText(suf, x + wNum, y - supSize * 0.35);
      const wSup = ctx.measureText(suf).width;
      ctx.font = prev;
      return wNum + wSup;
    }

    if (/^[♭♯]\d+(\/[♭♯]\d+)?$/.test(text)) {
      const parts = text.split("/");
      const drawAcc = (part: string, x0: number) => {
        const mm = part.match(/^([♭♯])(\d+)$/);
        if (!mm) {
          ctx.fillText(part, x0, y);
          return ctx.measureText(part).width;
        }
        const [, acc, num] = mm;
        ctx.fillText(acc, x0, y);
        const wAcc = ctx.measureText(acc).width;
        const supSize = Math.round(parseFloat(ctx.font) * 0.65);
        const prev = ctx.font;
        ctx.font = `${supSize}px Inter, system-ui, sans-serif`;
        ctx.fillText(num, x0 + wAcc, y - supSize * 0.35);
        const wNum = ctx.measureText(num).width;
        ctx.font = prev;
        return wAcc + wNum;
      };
      let dx = 0;
      dx += drawAcc(parts[0], x);
      if (parts[1]) {
        ctx.fillText("/", x + dx, y);
        dx += ctx.measureText("/").width;
        dx += drawAcc(parts[1], x + dx);
      }
      return dx;
    }

    ctx.fillText(text, x, y);
    return ctx.measureText(text).width;
  }

  function measureTokenWithSup(ctx: CanvasRenderingContext2D, text: string): number {
    let m = text.match(/^(\d+)(st|nd|rd|th)\s+(inv)$/i);
    if (m) {
      const [, num, suf, tail] = m;
      const prev = ctx.font;
      const wNum = ctx.measureText(num).width;
      const supSize = Math.round(parseFloat(prev) * 0.65);
      ctx.font = `${supSize}px Inter, system-ui, sans-serif`;
      const wSup = ctx.measureText(suf).width;
      ctx.font = prev;
      const wTail = ctx.measureText(" " + tail).width;
      return wNum + wSup + wTail;
    }

    m = text.match(/^(\d+)(st|nd|rd|th)$/i);
    if (m) {
      const [, num, suf] = m;
      const prev = ctx.font;
      const wNum = ctx.measureText(num).width;
      const supSize = Math.round(parseFloat(prev) * 0.65);
      ctx.font = `${supSize}px Inter, system-ui, sans-serif`;
      const wSup = ctx.measureText(suf).width;
      ctx.font = prev;
      return wNum + wSup;
    }

    if (/^[♭♯]\d+(\/[♭♯]\d+)?$/.test(text)) {
      const parts = text.split("/");
      const prev = ctx.font;
      const supSize = Math.round(parseFloat(prev) * 0.65);
      const measureAcc = (part: string) => {
        const mm = part.match(/^([♭♯])(\d+)$/);
        if (!mm) return ctx.measureText(part).width;
        const [, acc, num] = mm;
        const wAcc = ctx.measureText(acc).width;
        ctx.font = `${supSize}px Inter, system-ui, sans-serif`;
        const wNum = ctx.measureText(num).width;
        ctx.font = prev;
        return wAcc + wNum;
      };
      let w = measureAcc(parts[0]);
      if (parts[1]) w += ctx.measureText("/").width + measureAcc(parts[1]);
      return w;
    }

    return ctx.measureText(text).width;
  }

  function labelForTokenCanvas(tok: Token, key: KeyName): string {
    if (tok.kind === "rest") return "·";
    if (tok.kind === "intro") return "+";
    if (tok.kind === "resolve") return "#";
    if (tok.kind === "toggle") return "*";

    const isMinor = key === "Cminor";
    const isLetter = !!(tok as any).srcChar;

    if (tok.kind === "chroma") return "♭2/♯4";

    if (tok.kind === "deg") {
      if (isLetter) {
        if (tok.up && tok.src === "8") return "⟳1";
        if (tok.up && tok.src === "9") return "⟳2";
        const n = Number(tok.d);
        return n === 1 ? "1st" : n === 2 ? "2nd" : n === 3 ? "3rd" : `${n}th`;
      }
      if ("1234567".includes(tok.src)) return isMinor ? romanMinor(tok.d) : romanMajor(tok.d);
      if (tok.src === "8") return "1st inv";
      if (tok.src === "9") return "2nd inv";
    }

    return "·";
  }

  function drawCaptionCanvas(activePlayableIdx: number, keyForColor: KeyName) {
    const cvs = captionCanvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const cssW = Math.round(cvs.getBoundingClientRect().width || 360);
    const cssH = Math.round(cvs.getBoundingClientRect().height || 68);
    const ratio = window.devicePixelRatio || 1;
    if (cvs.width !== cssW * ratio || cvs.height !== cssH * ratio) {
      cvs.width = cssW * ratio;
      cvs.height = cssH * ratio;
    }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    const src = (raw || "").toUpperCase().split("");
    const playable = tokens.filter((t) => t.kind === "deg" || t.kind === "chroma");

    const labels: string[] = new Array(src.length).fill("");
    {
      let p = 0;
      for (let ci = 0; ci < src.length && p < playable.length; ci++) {
        if (/[A-Z0-9]/.test(src[ci])) {
          if (src[ci] === "0" && zeroPolicy === "rest") {
            labels[ci] = "-";
            continue;
          }
          labels[ci] = labelForTokenCanvas(playable[p], keyForColor);
          p++;
        }
      }
    }

    type Disp = { txt: string; isSep: boolean; charIndex: number };
    const disp: Disp[] = [];
    for (let ci = 0; ci < src.length; ci++) {
      disp.push({ txt: src[ci], isSep: false, charIndex: ci });
      disp.push({ txt: " · ", isSep: true, charIndex: -1 });
    }

    const p2c = playableToCharRef.current;
    const activeChar = activePlayableIdx >= 0 && activePlayableIdx < p2c.length ? p2c[activePlayableIdx] : -1;

    const topPx = 16;
    const botPx = 13;
    const gap = 4;
    const padX = 8;

    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";

    ctx.font = `${topPx}px Inter, system-ui, sans-serif`;
    const widths = disp.map((d) => ctx.measureText(d.txt).width);
    const totalW = widths.reduce((a, b) => a + b, 0);
    let x = Math.max(padX, (cssW - totalW) / 2);
    const topY = Math.round(topPx + 2);
    const botY = Math.round(topY + gap + botPx + 2);

    const activeCol = keyForColor === "BbMajor" ? IOS.major : IOS.minor;

    for (let i = 0; i < disp.length; i++) {
      const el = disp[i];
      if (el.isSep) {
        ctx.fillStyle = IOS.muted;
        ctx.fillText(el.txt, x, topY);
        x += widths[i];
        continue;
      }
      const isActive = el.charIndex === activeChar;
      ctx.fillStyle = isActive ? activeCol : IOS.text;
      ctx.fillText(el.txt, x, topY);
      x += widths[i];
    }

    if (!SHOW_DEGREES_CAPTION_LINE) return;

    x = Math.max(padX, (cssW - totalW) / 2);
    ctx.font = `${botPx}px Inter, system-ui, sans-serif`;
    for (let i = 0; i < disp.length; i++) {
      const el = disp[i];
      if (el.isSep) {
        x += widths[i];
        continue;
      }
      const lab = labels[el.charIndex] || "";
      if (lab) {
        const isActive = el.charIndex === activeChar;
        ctx.fillStyle = isActive ? activeCol : IOS.text;

        if (lab === "♭2/♯4") {
          const topLab = "♭2";
          const botLab = "♯4";
          const wTop = measureTokenWithSup(ctx, topLab);
          const wBot = measureTokenWithSup(ctx, botLab);
          const xTop = x + (widths[i] - wTop) / 2;
          const xBot = x + (widths[i] - wBot) / 2;
          drawTokenWithSup(ctx, topLab, xTop, botY);
          const offset = botPx + 2;
          drawTokenWithSup(ctx, botLab, xBot, botY + offset);
        } else if (/^\d+(st|nd|rd|th)\s+inv$/i.test(lab)) {
          const topLab = lab.replace(/\s+inv$/i, "");
          const botLab = "inv";
          const prev = ctx.font;
          const smallPx = Math.round(parseFloat(ctx.font) * 0.6);
          ctx.font = `${smallPx}px Inter, system-ui, sans-serif`;
          const wTop = measureTokenWithSup(ctx, topLab);
          const wBot = ctx.measureText(botLab).width;
          const xTop = x + (widths[i] - wTop) / 2;
          const xBot = x + (widths[i] - wBot) / 2;
          drawTokenWithSup(ctx, topLab, xTop, botY);
          ctx.fillText(botLab, xBot, botY + smallPx + 2);
          ctx.font = prev;
        } else {
          const wLab = measureTokenWithSup(ctx, lab);
          const xLab = x + (widths[i] - wLab) / 2;
          drawTokenWithSup(ctx, lab, xLab, botY);
        }
      }
      x += widths[i];
    }
  }

  const startCore = useCallback(async () => {
    if (isRunning) return;
    try {
      (document.activeElement as HTMLElement | null)?.blur();
    } catch {}
    await unlockCtx();
    const modeAtStart = trailMode;
    // --- HARD RESET (prevents leftover confetti/pulse between runs) ---
try {
  if (hotPulseClearRef.current) {
    clearTimeout(hotPulseClearRef.current);
    hotPulseClearRef.current = null;
  }
} catch {}
setHotPulse(null);

emberPool.length = 0;
try {
  const svgEl = svgRef.current;
  const g = svgEl?.querySelector("#embers") as SVGGElement | null;
  if (g) g.innerHTML = "";
} catch {}
// --- end reset ---

    keysRef.current = [];
    setOverlayPath("");
    setIsRunning(true);
    drawCaptionCanvas(-1, keyNow);
    setShowTransformHelper(false);
    setShowDegreesStrip(false);
    if (!hasPlayed) setHasPlayed(true);

    const ac = getCtx();
    const t0 = ac.currentTime + 0.12;
    t0Ref.current = t0;

    

    const srcStr = (raw || "").toUpperCase();
    const playable = tokens.filter((t) => t.kind === "deg" || t.kind === "chroma");

    const p2c: number[] = [];
    const c2p: number[] = Array(srcStr.length).fill(-1);
    let ci = 0;

    for (let p = 0; p < playable.length; p++) {
      while (ci < srcStr.length) {
        const ch = srcStr[ci];

        if (/[A-Z0-9]/.test(ch)) {
          if (ch === "0" && zeroPolicy === "rest") {
            ci++;
            continue;
          }
          p2c.push(ci);
          c2p[ci] = p2c.length - 1;
          ci++;
          break;
        }
        ci++;
      }
    }

    playableToCharRef.current = p2c;
    charToPlayableRef.current = c2p;
    playedIdxRef.current = 0;

    for (let i = 0; i < STEPS; i++) {
      const tok = tokens[i];
      const at = t0 + i * (NOTE_MS / 1000);

      if (tok?.kind === "intro") {
  scheduleIntroChord(ac, at, keyNow);
  continue;
}

      if (!tok) continue;
      if (tok.kind === "toggle") continue;
      
      if (tok.kind === "resolve") {
        scheduleResolveCadence(ac, at, keyNow);
        continue;
      }
      if (tok.kind === "rest") continue;

      if (tok.kind === "deg" || tok.kind === "chroma") {
        const isLetter = !!tok.srcChar;

        if (isLetter) {
          if (tok.kind === "deg") {
            if (tok.up && tok.src === "8") {
              scheduleNoteLive(ac, at, "1", keyNow, false);
              scheduleNoteLive(ac, at, "1", keyNow, true);
            } else if (tok.up && tok.src === "9") {
              scheduleNoteLive(ac, at, "1", keyNow, false);
              scheduleNoteLive(ac, at, "2", keyNow, true);
            } else {
              scheduleNoteLive(ac, at, tok.d, keyNow, tok.up);
            }
          } else {
            const pc = degreeToPcOffset(tok.c as DegLabel, keyNow);
            const midi = snapPcToComfortableMidi(pc);
            const name = midiToNoteName(midi);

            const isZeroChroma = (tok as any).src === "0";
            const useTickEnv = isZeroChroma && zeroPolicy === "ticks";

            loadBuffer(name)
              .then((buf) => {
                const src = ac.createBufferSource();
                src.buffer = buf;
                const g = ac.createGain();

                if (useTickEnv) {
                  g.gain.setValueAtTime(0, at);
                  g.gain.linearRampToValueAtTime(0.45, at + 0.006);
                  g.gain.setTargetAtTime(0, at + 0.05, 0.05);
                  src.connect(g).connect(ac.destination);
                  try {
                    src.start(at);
                    src.stop(at + 0.1);
                  } catch {}
                } else {
                  g.gain.setValueAtTime(0, at);
                  g.gain.linearRampToValueAtTime(1, at + 0.01);
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
        } else {
          if (tok.kind === "deg") {
            if ("1234567".includes(tok.src)) scheduleTriadLive(ac, at, tok.d, keyNow);
            else if (tok.src === "8") scheduleFirstInvTonic(ac, at, keyNow);
            else if (tok.src === "9") scheduleSecondInvSupertonic(ac, at, keyNow);
          } else if (tok.kind === "chroma") {
            const pc = degreeToPcOffset(tok.c as DegLabel, keyNow);
            const midi = snapPcToComfortableMidi(pc);
            const name = midiToNoteName(midi);

            const isZeroChroma = (tok as any).src === "0";
            const useTickEnv = isZeroChroma && zeroPolicy === "ticks";

            loadBuffer(name)
              .then((buf) => {
                const src = ac.createBufferSource();
                src.buffer = buf;
                const g = ac.createGain();

                if (useTickEnv) {
                  g.gain.setValueAtTime(0, at);
                  g.gain.linearRampToValueAtTime(0.45, at + 0.006);
                  g.gain.setTargetAtTime(0, at + 0.05, 0.05);
                  src.connect(g).connect(ac.destination);
                  try {
                    src.start(at);
                    src.stop(at + 0.1);
                  } catch {}
                } else {
                  g.gain.setValueAtTime(0, at);
                  g.gain.linearRampToValueAtTime(1, at + 0.01);
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
        }
      }
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const stepDurSec = NOTE_MS / 1000;
    let lastDrawnStep = -1;

    function loopLive() {
      const now = getCtx().currentTime;
      const step = Math.floor((now - t0Ref.current) / stepDurSec);

      if (step > lastDrawnStep) {
        for (let s = lastDrawnStep + 1; s <= step; s++) {
          if (s < 0 || s >= STEPS) continue;

          if (s === 0) {
            keysRef.current = [];
            setOverlayPath("");
            playedIdxRef.current = 0;
          }

          const tok = tokens[s];

          if (!tok || tok.kind === "rest") {
  if (modeAtStart === "confetti") updateParticles(emberPool);
  continue;
}

          const keyId = tokenToKeyId(tok);
          if (keyId) {
            appendTrailKey(keyId);

            drawCaptionCanvas(playedIdxRef.current, keyNow);
            playedIdxRef.current++;

            const p = keyCenter(keyId);
            if (modeAtStart === "pulse") {
  setHotPulse({ x: p.x, y: p.y, color: activeColor });
  if (hotPulseClearRef.current) clearTimeout(hotPulseClearRef.current);
  hotPulseClearRef.current = window.setTimeout(() => {
    setHotPulse(null);
    hotPulseClearRef.current = null;
  }, 320);
} else if (modeAtStart === "confetti") {
  const svgEl = svgRef.current;
  if (svgEl) {
    const palette = [IOS.major, IOS.minor, "#FFD36B"];
    spawnParticles(emberPool, maxEmbers, svgEl, p.x, p.y, palette, 8);
  }
}
          }

          if (modeAtStart === "confetti") updateParticles(emberPool);
        }

        lastDrawnStep = step;
      }

      if (step < STEPS) {
        rafRef.current = requestAnimationFrame(loopLive);
      } else {
        setIsRunning(false);

if (hotPulseClearRef.current) {
  clearTimeout(hotPulseClearRef.current);
  hotPulseClearRef.current = null;
}
setHotPulse(null);

// If confetti was active, stop leaving particles behind after a run
if (trailMode === "confetti") {
  emberPool.length = 0;
  try {
    const svgEl = svgRef.current;
    const g = svgEl?.querySelector("#embers") as SVGGElement | null;
    if (g) g.innerHTML = "";
  } catch {}
}

setShowDegreesStrip(true);
      }
    }

    rafRef.current = requestAnimationFrame(loopLive);
  }, [isRunning, hasPlayed, tokens, NOTE_MS, STEPS, keyNow, activeColor, trailMode, zeroPolicy, emberPool]);

  const start = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setTimeout(() => startCore(), 30);
    } else {
      startCore();
    }
  }, [isRunning, startCore]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      if (!raw.trim()) return;
      start();
    },
    [raw, start]
  );

  const buildShareUrl = useCallback(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams();
    params.set("trail", trailMode);
    params.set("zero", zeroPolicy);
    params.set("mood", mood);
    params.set("q", raw || "");
    const url = new URL(window.location.href);
    url.search = params.toString();
    return url.toString();
  }, [trailMode, zeroPolicy, mood, raw]);

  /* =========================
     Export (Download): keep mp4 logic architecture
     - Updated to keypad SVG + keypad overlay generator
========================= */
  const onDownloadVideo = useCallback(async () => {
    setIsExporting(true);
    try {
      const svgEl = svgRef.current;
      if (!svgEl) {
        setIsExporting(false);
        return;
      }

      await unlockCtx();

      // 1) Snapshot background (keypad only)
      const rect = svgEl.getBoundingClientRect();
      const liveW = Math.max(2, Math.floor(rect.width));
      const liveH = Math.max(2, Math.floor(rect.height));
      const clone = svgEl.cloneNode(true) as SVGSVGElement;

// EXPORT SAFETY: iOS can fail to load SVG-as-image when root has CSS filter/drop-shadow
try {
  clone.removeAttribute("style");
  // keep overflow visible if you need it
  clone.style.overflow = "visible";
} catch {}
try {
  clone.querySelectorAll("[style]").forEach((el) => {
    const s = (el as HTMLElement).getAttribute("style") || "";
    if (s.includes("drop-shadow") || s.includes("filter:")) {
      (el as HTMLElement).setAttribute("style", s.replace(/filter:[^;]+;?/g, ""));
    }
  });
} catch {}

      // remove overlay paths + embers + pulse
      clone.querySelectorAll('[data-ov="1"]').forEach((p) => p.remove());
      const embersClone = clone.querySelector("#embers");
      if (embersClone) embersClone.remove();
      clone.querySelectorAll('[data-pulse="1"]').forEach((n) => n.remove());

      const css = await buildEmbeddedFontStyle();
      const rawBg = serializeFullSvg(clone, liveW, liveH, css);
      const bgImg = await svgToImage(rawBg);

      // 2) Canvas + recorder
      const FRAME_W = 1080,
        FRAME_H = 1920,
        FPS = 30,
        SCALE = 2;
      const canvas = document.createElement("canvas");
      canvas.width = FRAME_W * SCALE;
      canvas.height = FRAME_H * SCALE;
      const c = canvas.getContext("2d") as CanvasRenderingContext2D;

      const ac = getCtx();
      const exportDst = ac.createMediaStreamDestination();
      const stream = (canvas as any).captureStream(FPS) as MediaStream;
      const mixed = new MediaStream([...stream.getVideoTracks(), ...exportDst.stream.getAudioTracks()]);
      const mimeType = pickRecorderMime();
      const chunks: BlobPart[] = [];
      const rec = new MediaRecorder(mixed, { mimeType });
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      function scheduleShortNote(name: string, at: number) {
        loadBuffer(name)
          .then((buf) => {
            const src = ac.createBufferSource();
            src.buffer = buf;
            const g = ac.createGain();
            g.gain.setValueAtTime(0, at);
            g.gain.linearRampToValueAtTime(0.45, at + 0.006);
            g.gain.setTargetAtTime(0, at + 0.05, 0.05);
            src.connect(g);
            g.connect(exportDst);
            g.connect(ac.destination);
            try {
              src.start(at);
              src.stop(at + 0.1);
            } catch {}
          })
          .catch(() => {});
      }

      // 3) Layout
      const SAFE_TOP = 160,
        SAFE_BOTTOM = 120,
        TOP_GAP = 10,
        SIDE_PAD = 48;
      const dateText = raw || "Type a phone number";

      function measurePx(px: number) {
        c.font = `${px * SCALE}px Inter, system-ui, sans-serif`;
        const m = c.measureText(dateText);
        const asc = (m as any).actualBoundingBoxAscent ?? px * 0.8;
        const desc = (m as any).actualBoundingBoxDescent ?? px * 0.25;
        return { w: m.width, h: asc + desc };
      }

      const TARGET = 0.8 * FRAME_W * SCALE;
      let lo = 24,
        hi = 80,
        best = 28;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        const { w } = measurePx(mid);
        if (w <= TARGET) {
          best = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      const datePx = best;
      const { h: dateBlockH } = measurePx(datePx);

      const availW = FRAME_W - SIDE_PAD * 2;
      const goldTop = SAFE_TOP + dateBlockH + TOP_GAP;
      const availH = Math.max(2, FRAME_H - goldTop - SAFE_BOTTOM);
      const scaleContent = Math.min(availW / liveW, availH / liveH);
      const drawW = Math.round(liveW * scaleContent);
      const drawH = Math.round(liveH * scaleContent);
      const drawX = Math.round((FRAME_W - drawW) / 2);
      const CAPTION_TO_STAGE_GAP = 12;
      const drawY = goldTop + CAPTION_TO_STAGE_GAP;

      // 4) Schedule
      const NOTE_MS_E = 250;
      const TOK_COUNT_E = Math.max(1, tokens.length);
      const STEPS_E = TOK_COUNT_E;
      const hasIntro = tokens.some((t) => (t as any).kind === "intro");
      const t0 = ac.currentTime + 0.25;

      function scheduleNote(name: string, at: number, dur = 0.25) {
        loadBuffer(name)
          .then((buf) => {
            const src = ac.createBufferSource();
            src.buffer = buf;
            const g = ac.createGain();
            g.gain.setValueAtTime(0, at);
            g.gain.linearRampToValueAtTime(1, at + 0.01);
            g.gain.setTargetAtTime(0, at + 0.2, 0.05);
            src.connect(g);
            g.connect(exportDst);
            g.connect(ac.destination);
            try {
              src.start(at);
              src.stop(at + dur);
            } catch {}
          })
          .catch(() => {});
      }

      const wrapDegE = (n: number): Diatonic => (["1", "2", "3", "4", "5", "6", "7"][(n - 1 + 7) % 7] as Diatonic);
      function triadDegreesE(root: Diatonic): [Diatonic, Diatonic, Diatonic] {
        const r = Number(root);
        return [wrapDegE(r), wrapDegE(r + 2), wrapDegE(r + 4)];
      }
      function scheduleTriad(at: number, rootDeg: Diatonic, key: KeyName, dur = 0.25) {
        const [r, t3, t5] = triadDegreesE(rootDeg);
        [r, t3, t5].forEach((d) => {
          const midi = degreeToMidi(d, key, false);
          scheduleNote(midiToNoteName(midi), at, dur);
        });
      }
      function scheduleFirstInvTonic(at: number, key: KeyName, dur = 0.25) {
        scheduleNote(midiToNoteName(degreeToMidi("3", key, false)), at, dur);
        scheduleNote(midiToNoteName(degreeToMidi("5", key, false)), at, dur);
        scheduleNote(midiToNoteName(degreeToMidi("1", key, true)), at, dur);
      }
      function scheduleSecondInvSupertonic(at: number, key: KeyName, dur = 0.25) {
        scheduleNote(midiToNoteName(degreeToMidi("6", key, false)), at, dur);
        scheduleNote(midiToNoteName(degreeToMidi("2", key, true)), at, dur);
        scheduleNote(midiToNoteName(degreeToMidi("4", key, true)), at, dur);
      }
      function scheduleIntroChordE(at: number, key: KeyName) {
        (["1", "3", "5"] as Diatonic[]).forEach((d, idx) => {
          const midi = degreeToMidi(d, key);
          scheduleNote(midiToNoteName(midi), at + idx * 0.06);
        });
      }
      function scheduleResolveCadenceE(at: number, key: KeyName) {
        [{ d: "5" as Diatonic, t: at }, { d: "1" as Diatonic, t: at + 0.12 }].forEach(({ d, t }) => {
          const midi = degreeToMidi(d, key);
          scheduleNote(midiToNoteName(midi), t);
        });
      }

      type ExpPoint = { step: number; keyId: KeyId };
      const exportPoints: ExpPoint[] = [];

      for (let i = 0; i < STEPS_E; i++) {
        const tok = tokens[i];
        const at = t0 + i * (NOTE_MS_E / 1000);

        if (hasIntro && i === 0) scheduleIntroChordE(at, keyNow);

        if (!tok) continue;

// --- VISUAL: record trail point for ANY token that maps to a keypad key ---
const kVis = tokenToKeyId(tok);
if (kVis) exportPoints.push({ step: i, keyId: kVis });

// --- AUDIO behavior (unchanged intent) ---
if (tok.kind === "toggle") continue;

if (tok.kind === "intro") {
  scheduleIntroChordE(at, keyNow);
  continue;
}

if (tok.kind === "resolve") {
  scheduleResolveCadenceE(at, keyNow);
  continue;
}

if (tok.kind === "rest") continue;

        if (tok.kind === "deg" || tok.kind === "chroma") {
          const isLetter = !!tok.srcChar;

          if (isLetter) {
            if (tok.kind === "deg") {
              if (tok.up && tok.src === "8") {
                scheduleNote(midiToNoteName(degreeToMidi("1", keyNow, false)), at);
                scheduleNote(midiToNoteName(degreeToMidi("1", keyNow, true)), at);
              } else if (tok.up && tok.src === "9") {
                scheduleNote(midiToNoteName(degreeToMidi("1", keyNow, false)), at);
                scheduleNote(midiToNoteName(degreeToMidi("2", keyNow, true)), at);
              } else {
                scheduleNote(midiToNoteName(degreeToMidi(tok.d, keyNow, tok.up)), at);
              }
            } else {
              const pc = degreeToPcOffset(tok.c as DegLabel, keyNow);
              const midi = snapPcToComfortableMidi(pc);
              scheduleNote(midiToNoteName(midi), at);
            }
          } else {
            if (tok.kind === "deg") {
              if ("1234567".includes(tok.src)) {
                scheduleTriad(at, tok.d, keyNow);
              } else if (tok.src === "8") {
                scheduleFirstInvTonic(at, keyNow);
              } else if (tok.src === "9") {
                scheduleSecondInvSupertonic(at, keyNow);
              }
            } else if (tok.kind === "chroma") {
              const pc = degreeToPcOffset(tok.c as DegLabel, keyNow);
              const midi = snapPcToComfortableMidi(pc);
              const name = midiToNoteName(midi);

              const isZeroChroma = (tok as any).src === "0";
              const useTickEnv = isZeroChroma && zeroPolicy === "ticks";

              if (useTickEnv) scheduleShortNote(name, at);
              else scheduleNote(name, at);
            }
          }

          
        }
      }

      function overlaySvgForStep(stepIdx: number): string {
        const visKeys = exportPoints.filter((p) => p.step <= stepIdx).map((p) => p.keyId);
        const path = visKeys.length ? pathFromKeySequence(visKeys) : "";
        const strokeWidth = trailMode.startsWith("glow") ? 1.15 : 1.4;

        const filterBlock = `
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
`;
        return `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 115" width="${liveW}" height="${liveH}" shape-rendering="geometricPrecision">
            ${trailMode.startsWith("glow") ? filterBlock : ""}
            ${path ? `<path d="${path}" fill="none" stroke="${activeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" ${trailMode.startsWith("glow") ? `filter="url(#vt-glow)"` : ""} />` : ""}
          
            </svg>
        `;
      }

      const overlayImgs: HTMLImageElement[] = [];
if (trailMode === "glow") {
  for (let k = 0; k < STEPS_E; k++) {
    const svgMarkup = overlaySvgForStep(k);
    const img = await svgToImage(svgMarkup);
    overlayImgs.push(img);
  }
}

      // =========================
      // EXPORT: Pulse + Confetti visuals (canvas-drawn)
      // =========================
      function drawPulseForStep(ctx: CanvasRenderingContext2D, stepIdx: number, frac: number) {
        const pts = exportPoints.filter((p) => p.step === stepIdx);
        if (!pts.length) return;

        const t = Math.max(0, Math.min(1, frac));
        const ringR = 1.8 + 3.4 * t; // in 0..100 space
        const ringAlpha = 0.85 * (1 - t);
        const dotR = 1.6;

        ctx.save();

// Map 100×115 viewBox into the drawn rectangle using SVG-like "meet" scaling
const VB_W = 100;
const VB_H = 115;
const s = Math.min(drawW / VB_W, drawH / VB_H);
const offX = (drawW - VB_W * s) / 2;
const offY = (drawH - VB_H * s) / 2;

ctx.translate((drawX + offX) * SCALE, (drawY + offY) * SCALE);
ctx.scale(s * SCALE, s * SCALE);

        for (const p0 of pts) {
          const node = keyCenter(p0.keyId);
          // dot
          ctx.beginPath();
          ctx.globalAlpha = 1;
          ctx.fillStyle = activeColor;
          ctx.arc(node.x, node.y, dotR, 0, Math.PI * 2);
          ctx.fill();

          // ring
          ctx.beginPath();
          ctx.globalAlpha = ringAlpha;
          ctx.strokeStyle = activeColor;
          ctx.lineWidth = 0.6;
          ctx.arc(node.x, node.y, ringR, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();
        ctx.globalAlpha = 1;
      }

      type ExpParticle = { x: number; y: number; vx: number; vy: number; life: number; r: number; color: string };
      const expParticles: ExpParticle[] = [];
      const EXP_MAX_PARTICLES = 220;

      function spawnConfettiForStep(stepIdx: number) {
        if (trailMode !== "confetti") return;
        const pts = exportPoints.filter((p) => p.step === stepIdx);
        if (!pts.length) return;

        const palette = [IOS.major, IOS.minor, "#FFD36B"];

        for (const p0 of pts) {
          const node = keyCenter(p0.keyId);
          const burst = 10;
          for (let i = 0; i < burst; i++) {
            const ang = Math.random() * Math.PI * 2;
            const spd = 0.9 + Math.random() * 1.4;
            expParticles.push({
              x: node.x,
              y: node.y,
              vx: Math.cos(ang) * spd,
              vy: Math.sin(ang) * spd - 0.35,
              life: 1.0,
              r: 0.9 + Math.random() * 0.6,
              color: palette[(Math.random() * palette.length) | 0],
            });
          }
        }
        while (expParticles.length > EXP_MAX_PARTICLES) expParticles.shift();
      }

      function updateAndDrawConfetti(ctx: CanvasRenderingContext2D, dtSec: number) {
        if (trailMode !== "confetti") return;
        const DT = Math.max(0.5, Math.min(2.0, dtSec * 60));
        const GRAV = 0.035;

        for (let i = expParticles.length - 1; i >= 0; i--) {
          const p = expParticles[i];
          p.x += p.vx * DT;
          p.y += p.vy * DT;
          p.vy += GRAV * DT;
          p.life -= 0.035 * DT;
          if (p.life <= 0) expParticles.splice(i, 1);
        }

        ctx.save();

// Map 100×115 viewBox into the drawn rectangle using SVG-like "meet" scaling
const VB_W = 100;
const VB_H = 115;
const s = Math.min(drawW / VB_W, drawH / VB_H);
const offX = (drawW - VB_W * s) / 2;
const offY = (drawH - VB_H * s) / 2;

ctx.translate((drawX + offX) * SCALE, (drawY + offY) * SCALE);
ctx.scale(s * SCALE, s * SCALE);

        for (const p of expParticles) {
          ctx.globalAlpha = Math.max(0.15, p.life);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
        ctx.globalAlpha = 1;
      }

      // export caption helpers (reuse same drawing approach)
      function measureTokenWithSupE(ctx: CanvasRenderingContext2D, text: string): number {
        return measureTokenWithSup(ctx, text);
      }
      function drawTokenWithSupE(ctx: CanvasRenderingContext2D, text: string, x: number, y: number): number {
        return drawTokenWithSup(ctx, text, x, y);
      }

      const srcStrE = (raw || "").toUpperCase();
      // Map each token index -> character index in srcStrE (so export can highlight +/#/* too)
const tokenToCharIdxE: number[] = new Array(tokens.length).fill(-1);
{
  let ci = 0;
  for (let ti = 0; ti < tokens.length; ti++) {
    const tok = tokens[ti];
    // advance to next non-space character
    while (ci < srcStrE.length && srcStrE[ci] === " ") ci++;

    // find the next matching character for this token
    while (ci < srcStrE.length) {
      const ch = srcStrE[ci];

      if (ch === " ") {
        ci++;
        continue;
      }

      // token matching
      if (tok.kind === "intro" && ch === "+") break;
      if (tok.kind === "resolve" && ch === "#") break;
      if (tok.kind === "toggle" && ch === "*") break;
      if (tok.kind === "rest" && ch === "-") break;

      if (tok.kind === "deg" || tok.kind === "chroma") {
        if (/[A-Z]/.test(ch)) {
          if ((tok as any).srcChar && (tok as any).srcChar === ch) break;
          // letters should generally match srcChar; if not present, still accept
          if (!(tok as any).srcChar) break;
        }
        if (/[0-9]/.test(ch)) {
          // special: 0 becomes rest when zeroPolicy=rest
          if (ch === "0" && zeroPolicy === "rest" && tok.kind !== "rest") {
            ci++;
            continue;
          }
          break;
        }
      }

      // not matching, skip this char
      ci++;
    }

    tokenToCharIdxE[ti] = ci < srcStrE.length ? ci : -1;
    if (ci < srcStrE.length) ci++;
  }
}
      const playableE = tokens.filter((t) => t.kind === "deg" || t.kind === "chroma");
      const p2cE: number[] = [];
      {
        let ci = 0;
        for (let p = 0; p < playableE.length; p++) {
          while (ci < srcStrE.length) {
            const ch = srcStrE[ci];
            if (/[A-Z0-9]/.test(ch)) {
              if (ch === "0" && zeroPolicy === "rest") {
                ci++;
                continue;
              }
              p2cE.push(ci);
              ci++;
              break;
            }
            ci++;
          }
        }
      }

      function drawExportCaption(ctx: CanvasRenderingContext2D, activeCharIndex: number, showBottom: boolean) {
        const src = (raw || "").toUpperCase().split("");
        const playable = tokens.filter((t) => t.kind === "deg" || t.kind === "chroma");

        const labels: string[] = new Array(src.length).fill("");
        {
          let p = 0;
          for (let ci = 0; ci < src.length && p < playable.length; ci++) {
            if (/[A-Z0-9]/.test(src[ci])) {
              if (src[ci] === "0" && zeroPolicy === "rest") {
                labels[ci] = "-";
                continue;
              }
              labels[ci] = labelForTokenCanvas(playable[p], keyNow);
              p++;
            }
          }
        }

        type Disp = { txt: string; isSep: boolean; charIndex: number };
        const disp: Disp[] = [];
        for (let ci = 0; ci < src.length; ci++) {
          disp.push({ txt: src[ci], isSep: false, charIndex: ci });
          disp.push({ txt: " · ", isSep: true, charIndex: -1 });
        }

        const topPx = 48,
          botPx = 39,
          gap = 10,
          padX = 48;
        const topFont = `${topPx * SCALE}px Inter, system-ui, sans-serif`;
        const botFont = `${botPx * SCALE}px Inter, system-ui, sans-serif`;
        const capX = (FRAME_W * SCALE - drawW * SCALE) / 2 + padX * SCALE;
        const capW = drawW * SCALE - padX * 2 * SCALE;
        const capLift = 70 * SCALE;

        const topY = goldTop * SCALE + topPx * SCALE + 4 - capLift;
        const botY = topY + gap * SCALE + botPx * SCALE;

        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.font = topFont;

        const widths = disp.map((d) => ctx.measureText(d.txt).width);
        const totalW = widths.reduce((a, b) => a + b, 0);
        let x = capX + Math.max(0, (capW - totalW) / 2);

        const activeChar = activeCharIndex;

        // top line
        for (let i = 0; i < disp.length; i++) {
          const el = disp[i];
          if (el.isSep) {
            ctx.fillStyle = IOS.muted;
            ctx.fillText(el.txt, x, topY);
            x += widths[i];
            continue;
          }
          const isActive = el.charIndex === activeChar;
          ctx.fillStyle = isActive ? activeColor : IOS.text;
          ctx.fillText(el.txt, x, topY);
          x += widths[i];
        }

        if (!showBottom) return;

        x = capX + Math.max(0, (capW - totalW) / 2);
        ctx.font = botFont;
        const lineGapPx = 2 * SCALE;

        for (let i = 0; i < disp.length; i++) {
          const el = disp[i];
          const cellW = widths[i];
          if (el.isSep) {
            x += cellW;
            continue;
          }
          const lab = labels[el.charIndex] || "";
          if (!lab) {
            x += cellW;
            continue;
          }

          const isActive = el.charIndex === activeChar;
          ctx.fillStyle = isActive ? activeColor : IOS.text;

          if (lab === "♭2/♯4") {
            const topLab = "♭2";
            const botLab = "♯4";
            const wTop = measureTokenWithSupE(ctx, topLab);
            const wBot = measureTokenWithSupE(ctx, botLab);
            const xTop = x + (cellW - wTop) / 2;
            const xBot = x + (cellW - wBot) / 2;
            drawTokenWithSupE(ctx, topLab, xTop, botY);
            drawTokenWithSupE(ctx, botLab, xBot, botY + botPx * SCALE + lineGapPx);
          } else if (/^\d+(st|nd|rd|th)\s+inv$/i.test(lab)) {
            const topLab = lab.replace(/\s+inv$/i, "");
            const botLab = "inv";

            const INV_SCALE = 0.7;
            const prevFont = ctx.font;

            const smallBotPx = botPx * INV_SCALE;
            ctx.font = `${Math.round(smallBotPx * SCALE)}px Inter, system-ui, sans-serif`;

            const wTop = measureTokenWithSupE(ctx, topLab);
            const wBot = ctx.measureText(botLab).width;
            const xTop = x + (cellW - wTop) / 2;
            const xBot = x + (cellW - wBot) / 2;

            drawTokenWithSupE(ctx, topLab, xTop, botY);

            const offset = smallBotPx * SCALE + lineGapPx;
            ctx.fillText(botLab, xBot, botY + offset);

            ctx.font = prevFont;
          } else {
            const wLab = measureTokenWithSupE(ctx, lab);
            const xLab = x + (cellW - wLab) / 2;
            drawTokenWithSupE(ctx, lab, xLab, botY);
          }
          x += cellW;
        }
      }

      const TOTAL_MS_FIXED = STEPS_E * NOTE_MS_E + 300;
      const recStart = performance.now();
      rec.start();
      const hardStopTimer = window.setTimeout(() => {
        try {
          rec.stop();
        } catch {}
      }, TOTAL_MS_FIXED + 500);

      let lastTs = 0;
      let prevStep = -1;
      let playedIdxE = 0;

      (function loop() {
        const nowTs = performance.now();
        const elapsed = nowTs - recStart;
        const i = Math.min(STEPS_E - 1, Math.floor(elapsed / NOTE_MS_E));
        const dtSec = lastTs ? (nowTs - lastTs) / 1000 : 1 / FPS;
        lastTs = nowTs;

        // --- STAGE: velvet background (match Live) ---
c.fillStyle = STAGE.bg;
c.fillRect(0, 0, canvas.width, canvas.height);

// Vignette / soft top light (match your CSS radial)
{
  const cx = canvas.width * 0.5;
  const cy = canvas.height * 0.10;
  const r0 = 0;
  const r1 = Math.max(canvas.width, canvas.height) * 0.85;

  const g = c.createRadialGradient(cx, cy, r0, cx, cy, r1);
  g.addColorStop(0.0, "rgba(255,255,255,0.06)");
  g.addColorStop(0.55, "rgba(0,0,0,0.65)");
  g.addColorStop(1.0, "rgba(0,0,0,1)");

  c.fillStyle = g;
  c.fillRect(0, 0, canvas.width, canvas.height);
}
// --- STAGE: gold halo behind keypad (match Live) ---
{
  const cx = (drawX + drawW / 2) * SCALE;
  const cy = (drawY + drawH / 2) * SCALE;

  // Big soft halo radius
  const rOuter = Math.max(drawW, drawH) * SCALE * 0.72;
  const rInner = rOuter * 0.12;

  const halo = c.createRadialGradient(cx, cy, rInner, cx, cy, rOuter);
  halo.addColorStop(0.00, "rgba(176, 137, 0, 0.35)");
  halo.addColorStop(0.35, "rgba(176, 137, 0, 0.18)");
  halo.addColorStop(0.55, "rgba(176, 137, 0, 0.06)");
  halo.addColorStop(0.70, "rgba(176, 137, 0, 0.00)");

  c.fillStyle = halo;
  c.fillRect(0, 0, canvas.width, canvas.height);
}
// Optional: subtle stage shadow under keypad
c.save();
c.shadowColor = "rgba(0,0,0,0.55)";
c.shadowBlur = 40 * SCALE;
c.shadowOffsetY = 18 * SCALE;
c.drawImage(bgImg, 0, 0, liveW, liveH, drawX * SCALE, drawY * SCALE, drawW * SCALE, drawH * SCALE);
c.restore();
        

        if (trailMode === "glow") {
  const ovImg = overlayImgs[i];
  if (ovImg) c.drawImage(ovImg, 0, 0, liveW, liveH, drawX * SCALE, drawY * SCALE, drawW * SCALE, drawH * SCALE);
}

        // EXPORT visuals:
        // - "pulse" => draw pulse each frame
        // - "+confetti" => spawn on new steps + animate each frame
        if (trailMode === "pulse") {
          const stepStartMs = i * NOTE_MS_E;
          const frac = Math.max(0, Math.min(1, (elapsed - stepStartMs) / NOTE_MS_E));
          drawPulseForStep(c, i, frac);
        }

        if (i > prevStep) {
          for (let s = prevStep + 1; s <= i; s++) {
            spawnConfettiForStep(s);

            if (s === 0) playedIdxE = 0;
            const t = tokens[s];
            if (t && (t.kind === "deg" || t.kind === "chroma")) playedIdxE++;
          }
          prevStep = i;
        }

        const activeCharIdx = tokenToCharIdxE[i] ?? -1;
const showBottomThisFrame = SHOW_DEGREES_CAPTION_LINE;
drawExportCaption(c, activeCharIdx, showBottomThisFrame);
        updateAndDrawConfetti(c, dtSec);

        if (elapsed < TOTAL_MS_FIXED) requestAnimationFrame(loop);
        else rec.stop();
      })();

      const recorded: Blob = await new Promise((res) => {
        rec.onstop = () => {
          try {
            try {
              stream.getTracks().forEach((t) => t.stop());
            } catch {}
            try {
              exportDst.stream.getTracks().forEach((t) => t.stop());
            } catch {}
            try {
              window.clearTimeout(hardStopTimer);
            } catch {}
          } finally {
            res(new Blob(chunks, { type: mimeType || "video/webm" }));
          }
        };
      });

      const outBlob = await convertToMp4Server(recorded);
      const safe = (raw || "number").replace(/[^A-Za-z0-9\-_.]+/g, "-");
      const a = document.createElement("a");
      a.download = `${safe}.mp4`;
      a.href = URL.createObjectURL(outBlob);
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("[download] export error:", err);
      try {
        alert("Could not prepare video. Please try again.");
      } catch {}
    } finally {
      setIsExporting(false);
    }
  }, [raw, trailMode, zeroPolicy, tokens, keyNow, mood, activeColor]);

  /* =========================
     Render
========================= */
  const KEY_RADIUS = 10.4;

  return (
  <div
  data-tonedial="1"
  style={{
    minHeight: "100vh",
    background: STAGE.bg,
    color: IOS.text,
    overflowX: "hidden",
  }}
>
      <main
        className="vt-card"
        style={{ width: "100%", margin: "0 auto", padding: 12, boxSizing: "border-box", maxWidth: 520 }}
        ref={panelRef}
      >
        {/* SEO: JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["SoftwareApplication", "WebApplication"],
              name: "ToneDial",
              applicationCategory: "MusicApplication",
              operatingSystem: "Web",
              url: "https://pianotrainer.app/toys/tone-dial",
              image: "https://pianotrainer.app/og/tonedial.png",
              description: "Map phone text or words (T9) to melody. Three zero modes: Chromatic, Ticks, Rest.",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              publisher: { "@type": "Organization", name: "PianoTrainer" },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What does ToneDial do?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "ToneDial converts phone text and words (T9) into melody with a single mood (Brighter major or Darker minor).",
                  },
                },
                {
                  "@type": "Question",
                  name: "How do zeros behave?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Chromatic (♭2/♯4) and Ticks (short ♭2/♯4) are playable and highlighted; Rest is silent and unhighlighted.",
                  },
                },
              ],
            }),
          }}
        />

        <section
          className="vt-panel minw0"
          style={{
            border: `1px solid ${IOS.cardBorder}`,
            borderRadius: 14,
            paddingTop: 12,
            paddingBottom: 12,
            background: IOS.cardBg,
            display: "grid",
            gap: 6,
          }}
        >
          <ToyNavHeader
            currentSlug="tone-dial"
            title="ToneDial"
            q={raw}
            onBeforeNavigate={() => {
              /* stop playback if running */
            }}
          />

          <div
            style={{
              margin: "2px 0 10px",
              textAlign: "center",
              fontSize: 14,
              lineHeight: 1.3,
              fontWeight: 500,
              color: "rgba(255,255,255,0.75)",
              letterSpacing: 0.2,
            }}
          >
            Each number feels different
          </div>

          <form
            className="minw0"
            onSubmit={(e) => {
              e.preventDefault();
              if (raw.trim()) start();
            }}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              paddingInline: 2,
            }}
          >
            <input
              value={raw}
              onChange={(e) => {
                setRaw(sanitizePhoneInput(e.target.value));
                if (SHOW_DEGREES_CAPTION_LINE) setShowTransformHelper(true);
              }}
              placeholder="+1-800 HI*THERE"
type="tel"
inputMode="tel"
autoComplete="tel"
spellCheck={false}
enterKeyHint="done"
              onKeyDown={onKeyDown}
              style={{
                boxSizing: "border-box",
                width: "min(92%, 34ch)",
                background: "#FFFFFF",
                color: IOS.text,
                border: `1px solid ${IOS.cardBorder}`,
                borderRadius: 12,
                padding: "12px 14px",
                fontSize: 16,
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
                fontVariantNumeric: "tabular-nums",
              }}
              aria-label="Type a phone number"
            />
          </form>

          {SHOW_DEGREES_CAPTION_LINE && showTransformHelper && (
            <div style={{ marginTop: 4, display: "flex", gap: 8, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              {currentChain && currentChain.length
                ? currentChain.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <span
                        style={{
                          padding: "1px 6px",
                          borderRadius: 6,
                          background: "#FFFFFF",
                          border: `1px solid ${IOS.cardBorder}`,
                          color: IOS.text,
                          whiteSpace: "nowrap",
                          fontSize: 13,
                        }}
                      >
                        {renderWithSupers(step)}
                      </span>
                      {idx < currentChain.length - 1 ? (
                        <span aria-hidden="true" style={{ opacity: 0.6, fontSize: 12 }}>
                          →
                        </span>
                      ) : null}
                    </React.Fragment>
                  ))
                : null}
            </div>
          )}

          {/* Caption canvas */}
          <div
            className="minw0"
            style={{
              display: "grid",
              justifyContent: "center",
              paddingInline: 2,
              marginTop: -6,
              marginBottom: -8,
            }}
          >
            <canvas
              ref={captionCanvasRef}
              width={360}
              height={SHOW_DEGREES_CAPTION_LINE ? 84 : 44}
              style={{ width: 360, height: SHOW_DEGREES_CAPTION_LINE ? 84 : 44, display: "block" }}
              aria-label="Caption"
            />
          </div>

          {/* Keypad stage (SVG) + HTML overlay button for Call */}
          <div
            className="minw0"
            style={{
              display: "grid",
              justifyContent: "center",
              paddingInline: 2,
              marginTop: -4,
            }}
          >
            <div style={{ position: "relative", width: 360, height: 420 }}>
  {/* Gold halo (background) */}
  <div
    aria-hidden="true"
    style={{
      position: "absolute",
      inset: -40,
      borderRadius: "50%",
      background: `radial-gradient(
        circle at center,
        ${STAGE.halo} 0%,
        rgba(176, 137, 0, 0.18) 35%,
        rgba(176, 137, 0, 0.06) 55%,
        transparent 70%
      )`,
      filter: "blur(18px)",
      zIndex: 0,
      pointerEvents: "none",
    }}
  />

  {/* Foreground: keep your existing SVG + call button here */}
  <div style={{ position: "relative", zIndex: 1 }}>
  
              <svg
                ref={svgRef}
                viewBox="0 0 100 115"
                width={360}
                height={420}
                style={{ overflow: "visible" }}
                shapeRendering="geometricPrecision"
              >
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

                {/* Keys (display-only) */}
                {KEYPAD_KEYS.map((k) => {
                  const p = keyCenter(k.id);
                  return (
                    <g key={k.id} style={{ userSelect: "none", pointerEvents: "none" }}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={KEY_RADIUS}
                        fill={IOS.keyFill}
                        stroke={IOS.keyStroke}
                        strokeWidth={0.6}
                      />
                      <text
  x={p.x}
  y={p.y - 1.2}
  textAnchor="middle"
  dominantBaseline="middle"
  fontSize={k.digit === "*" || k.digit === "#" ? 11 : 13}
  fill={IOS.text}
  style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Inter, sans-serif" }}
>
  {k.digit}
</text>
{k.letters ? (
  <text
    x={p.x}
    y={p.y + 7.0}
    textAnchor="middle"
    dominantBaseline="middle"
    fontSize={4.0}
    fill={IOS.muted}
    style={{
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Inter, sans-serif",
      letterSpacing: "0.18em",
      fontWeight: 600,
    }}
  >
    {k.letters}
  </text>
) : null}
                      {/* subtle key shadow (fake) */}
                      <ellipse
  cx={p.x}
  cy={p.y + KEY_RADIUS + 4.1}
  rx={KEY_RADIUS * 0.72}
  ry={2.0}
  fill={IOS.keyShadow}
  opacity={0.10}
/>
                    </g>
                  );
                })}

                {/* Call button visual (SVG only; click handled by HTML overlay) */}
                {/* Call button visual (SVG only; click handled by HTML overlay) */}
<g style={{ pointerEvents: "none" }}>
  <circle cx={50} cy={104} r={10.2} fill={IOS.major} />
  <path
    d="M46.3 100.6c.6-1 1.3-1.5 2.1-1.5.7 0 1.4.3 2.1.9l1.3 1.2c.3.3.3.7.1 1.1l-1.1 1.9c.7 1.2 1.8 2.4 3 3l1.9-1.1c.4-.2.8-.2 1.1.1l1.2 1.3c.6.7.9 1.4.9 2.1 0 .8-.5 1.5-1.5 2.1-.7.4-1.6.6-2.7.3-2.5-.6-5.3-3.4-7-6-1.1-1.8-1.8-3.6-1.9-5.1-.1-1.1.1-2 .5-2.7z"
    fill="#FFFFFF"
  />
</g>
<circle
  cx={50}
  cy={104}
  r={9.4}
  fill="none"
  stroke="rgba(255,255,255,0.35)"
  strokeWidth={0.8}
/>

                {/* Lines / Glow overlay (single) */}
                {trailMode === "glow" && overlayPath ? (
  <path
    data-ov="1"
    d={overlayPath}
    fill="none"
    stroke={activeColor}
    strokeWidth={1.15}
    strokeLinecap="round"
    strokeLinejoin="round"
    filter="url(#vt-glow)"
  />
) : null}

                <g id="embers" />

                {/* Pulse (live) */}
                {hotPulse ? (
                  <g data-pulse="1">
                    <circle cx={hotPulse.x} cy={hotPulse.y} r="2.2" fill={hotPulse.color} opacity="0.95" />
                    <circle
                      cx={hotPulse.x}
                      cy={hotPulse.y}
                      r="4.4"
                      fill="none"
                      stroke={hotPulse.color}
                      strokeWidth="0.6"
                      opacity="0.45"
                    />
                  </g>
                ) : null}
              </svg>



              {/* HTML overlay button matching call circle */}
              <button
                type="button"
                onClick={() => start()}
                disabled={isRunning || !raw.trim()}
                aria-label="Play"
                title="Play"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: `${(104 / 115) * 420}px`,
                  transform: "translate(-50%, -50%)",
                  width: `${(10.2 / 100) * 360 * 2}px`,
                  height: `${(10.2 / 100) * 360 * 2}px`,
                  borderRadius: 999,
                  border: "none",
                  background: "transparent",
                  cursor: isRunning || !raw.trim() ? "not-allowed" : "pointer",
                }}
              />
              </div>
          </div>
            </div>
           

          {/* Actions */}
          <div className="vt-actions minw0" aria-label="Actions">
            {isExporting && (
              <div style={{ color: IOS.muted, fontSize: 12, textAlign: "center", width: "100%", marginTop: 6 }}>
                ⏺️ Recording…
              </div>
            )}

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button
                onClick={() => onDownloadVideo()}
                disabled={!raw.trim()}
                title="Download"
                style={{
                  background: "transparent",
                  color: activeColor,
                  border: `1px solid ${IOS.cardBorder}`,
                  borderRadius: 999,
                  padding: "8px 12px",
                  fontWeight: 800,
                  cursor: !raw.trim() ? "not-allowed" : "pointer",
                  minHeight: 34,
                  fontSize: 14,
                }}
              >
                💾 <span className="action-text">Save</span>
              </button>
              <button
                onClick={() => setShareOpen(true)}
                title="Share"
                style={{
                  background: "transparent",
                  color: activeColor,
                  border: `1px solid ${IOS.cardBorder}`,
                  borderRadius: 999,
                  padding: "8px 12px",
                  fontWeight: 800,
                  cursor: "pointer",
                  minHeight: 34,
                  fontSize: 14,
                }}
              >
                📤 <span className="action-text">Share</span>
              </button>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "grid", gap: 10, paddingInline: 6 }}>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <select
                value={trailMode}
                onChange={(e) => setTrailMode(e.target.value as TrailMode)}
                style={{
                  background: "#FFFFFF",
                  color: IOS.text,
                  border: `1px solid ${IOS.cardBorder}`,
                  borderRadius: 12,
                  padding: "10px 12px",
                  fontSize: 14,
                }}
              >
                <option value="pulse">Motion: Pulse</option>
<option value="glow">Motion: Glow lines</option>
<option value="confetti">Motion: Confetti</option>
              </select>

              <select
                value={zeroPolicy}
                onChange={(e) => setZeroPolicy(e.target.value as ZeroPolicy)}
                style={{
                  background: "#FFFFFF",
                  color: IOS.text,
                  border: `1px solid ${IOS.cardBorder}`,
                  borderRadius: 12,
                  padding: "10px 12px",
                  fontSize: 14,
                }}
              >
                <option value="chromatic">Zero (0): Sound</option>
                <option value="ticks">Zero (0): Ticks</option>
                <option value="rest">Zero (0): Rest</option>
              </select>

              <select
                value={mood}
                onChange={(e) => setMood(e.target.value as Mood)}
                style={{
                  background: "#FFFFFF",
                  color: IOS.text,
                  border: `1px solid ${IOS.cardBorder}`,
                  borderRadius: 12,
                  padding: "10px 12px",
                  fontSize: 14,
                }}
              >
                <option value="3M">Mood: Brighter</option>
                <option value="3m">Mood: Darker</option>
              </select>
            </div>
          </div>
        </section>

        {/* Outside the card: Why these numbers CTA */}
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
          <a
            href="/learn/why-these-numbers"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: 800,
              fontSize: 15,
              color: activeColor,
              textDecoration: "none",
              border: `1px solid ${IOS.cardBorder}`,
              borderRadius: 14,
              padding: "10px 14px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
            aria-label="Why these numbers explanation"
          >
            Why these numbers →
          </a>
        </div>

        {/* Share Sheet (modal) */}
        <ShareSheet
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          url={typeof window === "undefined" ? "" : buildShareUrl()}
          themeColors={{
            gold: activeColor,
            border: IOS.cardBorder,
            text: IOS.text,
            bg: IOS.cardBg,
          }}
        />
      </main>
    </div>
  );
}

/* =========================
   Share modal
========================= */
function buildTweetIntent(text: string, url: string) {
  const u = new URL("https://twitter.com/intent/tweet");
  u.searchParams.set("text", text);
  u.searchParams.set("url", url);
  return u.toString();
}

function ShareSheet({
  open,
  onClose,
  url,
  themeColors,
}: {
  open: boolean;
  onClose: () => void;
  url: string;
  themeColors: { gold: string; border: string; text: string; bg: string };
}) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: themeColors.bg,
          borderTop: `1px solid ${themeColors.border}`,
          borderLeft: `1px solid ${themeColors.border}`,
          borderRight: `1px solid ${themeColors.border}`,
          borderRadius: "12px 12px 0 0",
          padding: 12,
          boxSizing: "border-box",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: "center", color: themeColors.text, fontWeight: 900, marginBottom: 8 }}>Share your melody</div>

        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(url);
            } catch {}
            onClose();
          }}
          style={{
            width: "100%",
            padding: "10px 12px",
            marginBottom: 6,
            background: themeColors.gold,
            color: "#081019",
            borderRadius: 12,
            border: "none",
            fontWeight: 900,
          }}
        >
          🔗 Copy Link
        </button>

        <a
          href={buildTweetIntent(`My number sings: ${url}`, url)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          style={{
            display: "block",
            textAlign: "center",
            width: "100%",
            padding: "10px 12px",
            marginBottom: 6,
            background: "transparent",
            color: themeColors.gold,
            borderRadius: 12,
            border: `1px solid ${themeColors.border}`,
            textDecoration: "none",
            fontWeight: 900,
          }}
        >
          𝕏 Share on X
        </a>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "8px 12px",
            marginTop: 8,
            background: themeColors.bg,
            color: themeColors.text,
            opacity: 0.7,
            borderRadius: 12,
            border: `1px solid ${themeColors.border}`,
            fontWeight: 800,
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}