"use client";

import React, { useEffect, useRef } from "react";

const TICK_MS = 500;
const MAX_FLAMES_PER_LOG = 5;

const SESSION_STEPS = 10 * 60 * 2; // 10 minutes @ 500ms = 1200 steps

// Balanced-only: label for this experience (later you can swap stream/label)


type ScaleMode = "BB_MAJOR" | "C_MINOR";

// Locked mappings (sharps only)
const BB_MAJOR_MAP: Record<number, string> = {
  1: "A#3",
  2: "C4",
  3: "D4",
  4: "D#4",
  5: "F4",
  6: "G4",
  7: "A4",
  8: "A#4",
  9: "C5",
};

const C_MINOR_MAP: Record<number, string> = {
  1: "C4",
  2: "D4",
  3: "D#4",
  4: "F4",
  5: "G4",
  6: "G#4",
  7: "A#4",
  8: "C5",
  9: "D5",
};



function noteForDigit(d: number, mode: ScaleMode) {
  if (d === 0) return null;
  return mode === "BB_MAJOR" ? BB_MAJOR_MAP[d] : C_MINOR_MAP[d];
}

function noteUrl(noteName: string) {
  // encode '#' for filenames like A#3.wav
  const safe = noteName.replace("#", "%23");
  return `/audio/notes/${safe}.wav`;
}
function logIndexForDigit(digitNum: number, mode: "BB_MAJOR" | "C_MINOR"): number | null {
  // Logs left→right indices:
  // 0:b6, 1:b3, 2:b7, 3:4, 4:1, 5:5, 6:2, 7:6, 8:3, 9:7

  if (digitNum === 0) return null;

  // Octave loops
  if (digitNum === 8) digitNum = 1;
  if (digitNum === 9) digitNum = 2;

  // Shared degrees
  if (digitNum === 1) return 4; // 1
  if (digitNum === 2) return 6; // 2
  if (digitNum === 4) return 3; // 4
  if (digitNum === 5) return 5; // 5

  // Degrees that flip to flats in minor
  if (digitNum === 3) return mode === "C_MINOR" ? 1 : 8; // b3 vs 3
  if (digitNum === 6) return mode === "C_MINOR" ? 0 : 7; // b6 vs 6
  if (digitNum === 7) return mode === "C_MINOR" ? 2 : 9; // b7 vs 7

  return null;
}

function playSampleCached(cache: Map<string, HTMLAudioElement>, note: string, volume = 0.9) {
  const src = noteUrl(note);
  let base = cache.get(src);
  if (!base) {
    base = new Audio(src);
    base.preload = "auto";
    cache.set(src, base);
  }

  // Retrigger cleanly: clone if base is already playing
  const a = base.paused ? base : (base.cloneNode(true) as HTMLAudioElement);
  a.volume = volume;
  try { a.currentTime = 0; } catch {}
  a.play().catch(() => {});
}

function playFxCached(cache: Map<string, HTMLAudioElement>, src: string, volume = 0.35, maxMs?: number) {
  let base = cache.get(src);
  if (!base) {
    base = new Audio(src);
    base.preload = "auto";
    cache.set(src, base);
  }

  const a = base.paused ? base : (base.cloneNode(true) as HTMLAudioElement);
  a.volume = volume;
  try { a.currentTime = 0; } catch {}
  a.play().catch(() => {});

  if (typeof maxMs === "number") {
    window.setTimeout(() => {
      try { a.pause(); a.currentTime = 0; } catch {}
    }, maxMs);
  }
}

function playDigitZeroCrackle(cache: Map<string, HTMLAudioElement>) {
  const picks = [
    "/audio/fx/crackle-zero-1.wav",
    "/audio/fx/crackle-zero-2.wav",
      ];
  const src = picks[Math.floor(Math.random() * picks.length)];
  playFxCached(cache, src, 0.35);
}

function playModeSwitchCrackle(
  cache: Map<string, HTMLAudioElement>,
  mode: "BB_MAJOR" | "C_MINOR"
) {
  const majorPicks = [
    "/audio/fx/crackle-shift-1.wav",
    "/audio/fx/crackle-shift-3.wav",
  ];

  const minorPicks = [
    "/audio/fx/crackle-shift-2.wav",
    "/audio/fx/crackle-shift-4.wav"
  ];

  const picks = mode === "BB_MAJOR" ? majorPicks : minorPicks;
  const src = picks[Math.floor(Math.random() * picks.length)];

  // a touch quieter than notes, but clearly perceptible
  playFxCached(cache, src, 0.28);
}


type Log = { x: number; y: number; color: string };
type Flame = { bornAt: number; digit: number; seed: number; accent?: boolean };

// ---------------- utils ----------------

function rand01(seed: number) {
  let x = seed | 0;
  x ^= x << 13;
  x ^= x >> 17;
  x ^= x << 5;
  return ((x >>> 0) % 1_000_000) / 1_000_000;
}

function easeOutCubic(t: number) {
  t = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - t, 3);
}

function getHeaderSafeTopPx() {
  // Measure the actual sticky header (if present)
  const header = document.querySelector("header");
  if (!header) return 0;
  const r = header.getBoundingClientRect();
  return Math.max(0, Math.round(r.bottom)) + 12;
}

// ---------------- fireplace geometry ----------------

function fireplaceBox(w: number, h: number) {
  const isDesktop =
    (typeof window !== "undefined" &&
      window.matchMedia?.("(min-width: 1025px)")?.matches) ||
    false;

  const headerSafePx =
    isDesktop && typeof document !== "undefined" ? getHeaderSafeTopPx() : 0;

  const top = Math.max(h * 0.12, headerSafePx);

  return {
    left: w * 0.08,
    right: w * 0.92,
    top,
    bottom: h * 0.82,
  };
}

function buildFireplacePath(
  ctx: CanvasRenderingContext2D,
  box: { left: number; right: number; top: number; bottom: number }
) {
  const w = box.right - box.left;
  const insetTop = w * 0.06;
  const insetBottom = w * 0.02;
  const r = Math.min(18, w * 0.04);

  const tlx = box.left + insetTop;
  const trx = box.right - insetTop;
  const blx = box.left + insetBottom;
  const brx = box.right - insetBottom;

  ctx.beginPath();
  ctx.moveTo(tlx + r, box.top);
  ctx.lineTo(trx - r, box.top);
  ctx.quadraticCurveTo(trx, box.top, trx, box.top + r);
  ctx.lineTo(brx, box.bottom - r);
  ctx.quadraticCurveTo(brx, box.bottom, brx - r, box.bottom);
  ctx.lineTo(blx + r, box.bottom);
  ctx.quadraticCurveTo(blx, box.bottom, blx, box.bottom - r);
  ctx.lineTo(tlx, box.top + r);
  ctx.quadraticCurveTo(tlx, box.top, tlx + r, box.top);
  ctx.closePath();
}

// ---------------- logs ----------------

function computeLogs(w: number, h: number): Log[] {
  const box = fireplaceBox(w, h);

  const padX = (box.right - box.left) * 0.09;
  const xMin = box.left + padX;
  const xMax = box.right - padX;

  const baseY = box.bottom - (box.bottom - box.top) * 0.10;
  const arcLift = (box.bottom - box.top) * 0.06;

  const logs: Log[] = [];

  for (let i = 0; i < 10; i++) {
    const t = i / 9;
    const x = xMin + (xMax - xMin) * t;

    const u = t * 2 - 1;
    const y = baseY - (1 - u * u) * arcLift;

    logs.push({
      x,
      y,
      color: `hsl(${22 + i * 2} 85% ${40 + i * 1.1}%)`,
    });
  }

  return logs;
}

// ---------------- flame drawing ----------------

function heightFromDigit(d: number, baseY: number, boxTop: number) {
  const headroom = 20;
  const usable = (baseY - (boxTop + headroom)) * 0.95;
  const minH = usable * 0.18;
  const maxH = usable * 0.98;
  return minH + ((d - 1) / 8) * (maxH - minH);
}

function drawFlame(
  ctx: CanvasRenderingContext2D,
  x: number,
  baseY: number,
  height: number,
  age: number,
  life: number,
  color: string,
  seed: number,
  widthScale: number,
  accent: boolean
) {
  const sway =
    Math.sin(age * (2 + rand01(seed) * 1.2)) * 8 +
    Math.sin(age * (4 + rand01(seed + 1) * 1.5)) * 4;

  const tipX = x + sway * 0.8;
  const tipY = baseY - height;

  const stations = 8;
  const pts: Array<{ x: number; y: number; w: number }> = [];

  for (let i = 0; i < stations; i++) {
    const t = i / (stations - 1);
    const bell = Math.sin(Math.PI * t);
    const w = (6 + height * 0.05) * widthScale * bell * (0.7 + 0.3 * life);
    pts.push({
      x: x + sway * t * 0.9,
      y: baseY - height * t,
      w,
    });
  }

  ctx.save();
  const accentMul = accent ? 1.22 : 1.0;

  // outer
  ctx.fillStyle = color;
  ctx.globalAlpha = (0.12 + life * 0.55) * accentMul;
  ctx.beginPath();
  ctx.moveTo(pts[0].x - pts[0].w, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x - pts[i].w, pts[i].y);
  ctx.lineTo(tipX, tipY);
  for (let i = pts.length - 1; i >= 0; i--)
    ctx.lineTo(pts[i].x + pts[i].w, pts[i].y);
  ctx.closePath();
  ctx.fill();

  // hollow
  ctx.globalCompositeOperation = "destination-out";
  ctx.globalAlpha = 0.25;
  ctx.beginPath();
  ctx.moveTo(pts[0].x - pts[0].w * 0.55, pts[0].y);
  for (let i = 1; i < pts.length; i++)
    ctx.lineTo(pts[i].x - pts[i].w * 0.55, pts[i].y);
  ctx.lineTo(tipX, tipY + height * 0.35);
  for (let i = pts.length - 1; i >= 0; i--)
    ctx.lineTo(pts[i].x + pts[i].w * 0.55, pts[i].y);
  ctx.closePath();
  ctx.fill();

  ctx.globalCompositeOperation = "source-over";

  // contour
  ctx.globalAlpha = (0.25 + life * 0.45) * accentMul;
  ctx.strokeStyle = color;
  ctx.lineWidth = (1.2 + life) * (accent ? 1.12 : 1.0);
  ctx.stroke();

  ctx.restore();
}

// ---------------- caption (canvas-drawn, export-safe) ----------------

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.max(0, Math.min(r, Math.min(w, h) / 2));
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}

function drawCaptionBar(opts: {
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  box: { left: number; right: number; top: number; bottom: number };
  labelText: string; // "π" or "π 3.14"
  digits10: string[]; // length 10, oldest->newest (newest is NOW)
}) {
  const { ctx, w, h, box, labelText, digits10 } = opts;

  const openingW = box.right - box.left;
  const centerX = (box.left + box.right) / 2;

  // Caption geometry: attached to fireplace, right under contour
  const barW = openingW * 0.94;
  const barH = Math.max(34, Math.min(46, h * 0.06));
  const barX = centerX - barW / 2;

  const gap = 12;
  let barY = box.bottom + gap;

  // Ensure always visible (if too low, pull up)
  const bottomMargin = 10;
  if (barY + barH > h - bottomMargin) {
    barY = h - bottomMargin - barH;
  }

  // Plate style
  ctx.save();
  ctx.globalAlpha = 1;
  roundRectPath(ctx, barX, barY, barW, barH, barH / 2);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fill();

  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.stroke();
  ctx.restore();

  // Text styling
  const fontSize = Math.max(12, Math.min(16, Math.floor(barH * 0.42)));
  ctx.save();
  ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;
  ctx.textBaseline = "middle";

  // Label on left
  const padX = 14;
  const labelX = barX + padX;
  const labelY = barY + barH / 2;

  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.fillText(labelText, labelX, labelY);

  // Slots: NOW is slot #10 at center
  const nowX = centerX;
  const slotStep = Math.max(14, Math.min(20, barW * 0.035)); // spacing
  const slotBox = Math.max(16, Math.min(22, slotStep * 1.05)); // placeholder box size

  // Opacity gradient oldest->newest (10)
  const alphas = [0.13, 0.14, 0.15, 0.18, 0.25, 0.35, 0.5, 0.7, 0.82, 1.0];

  // Draw placeholders + digits (only left history + NOW)
  for (let i = 0; i < 10; i++) {
    // i=9 is NOW at center, i=8 one step left, ...
    const stepsLeft = 9 - i;
    const xCenter = nowX - stepsLeft * slotStep;
    const yCenter = labelY;

    // placeholder (faint)
    ctx.save();
    const pAlpha = i === 9 ? 0.22 : 0.12;
    ctx.globalAlpha = pAlpha;
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1;
    roundRectPath(
      ctx,
      xCenter - slotBox / 2,
      yCenter - slotBox / 2,
      slotBox,
      slotBox,
      7
    );
    ctx.stroke();
    ctx.restore();

    // digit
    const d = digits10[i] ?? " ";
    const a = alphas[i] ?? 0.15;

    ctx.save();
    ctx.globalAlpha = a;

    if (i === 9) {
      // NOW highlight
      ctx.shadowColor = "rgba(255,255,255,0.28)";
      ctx.shadowBlur = 8;
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.font = `700 ${fontSize + 2}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.90)";
      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;
    }

    // Center the digit in the slot
    const m = ctx.measureText(d);
    ctx.fillText(d, xCenter - m.width / 2, yCenter);

    ctx.restore();
  }

  ctx.restore();
}

// ---------------- component ----------------



import type { Irrational } from "./irrationals";

export default function FireplaceCanvas({
  started,
  soundOn,
  irrational,
}: {
  started: boolean;
  soundOn: boolean;
  irrational: Irrational;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flamesRef = useRef<Flame[][]>(Array.from({ length: 10 }, () => []));
  const stepRef = useRef(0);

  // Caption state (export-safe): 10 slots history with NOW centered
const digits10Ref = useRef<string[]>(Array(10).fill(" "));
const revealDigitsRef = useRef<string>(""); // collect first 3 digits for "<label> x.xx"
const labelTextRef = useRef<string>(irrational.label);
  const audioCacheRef = useRef<Map<string, HTMLAudioElement>>(new Map());
const globalStepRef = useRef(0); // for 20-step blocks
const soundOnRef = useRef(soundOn);
const startedRef = useRef(started);

const irrationalRef = useRef(irrational);

useEffect(() => {
  irrationalRef.current = irrational;
}, [irrational]);

useEffect(() => {
  startedRef.current = started;
}, [started]);

useEffect(() => {
  // Reset state when user selects a new irrational (before Play)
  irrationalRef.current = irrational;

  stepRef.current = 0;
  globalStepRef.current = 0;

  digits10Ref.current = Array(10).fill(" ");
  revealDigitsRef.current = "";
  labelTextRef.current = irrational.label;
}, [irrational.id, irrational]);

useEffect(() => {
  soundOnRef.current = soundOn;
}, [soundOn]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let raf = 0;
    let tickId: number;
    let logs = computeLogs(1, 1);

    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);

      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Recompute logs to match new geometry
      logs = computeLogs(w, h);
    }

    resize();
    window.addEventListener("resize", resize);

    tickId = window.setInterval(() => {
  if (!startedRef.current) return;

// Stop after 10 minutes
if (globalStepRef.current >= SESSION_STEPS) return;

const irr = irrationalRef.current;
const source = irr.digits;
if (!source || source.length === 0) return;

const ch = source[stepRef.current] ?? "0";
const digitNum = Number(ch);
  

  // Balanced-only: 20 steps Bb Major, then 20 steps C minor, repeat
  const mode: ScaleMode =
  Math.floor(globalStepRef.current / 20) % 2 === 0 ? "BB_MAJOR" : "C_MINOR";

  
  // advance within the digit string (loop if shorter)
stepRef.current = (stepRef.current + 1) % source.length;
  const isBlockStart = globalStepRef.current % 20 === 0;
const isInitial = globalStepRef.current === 0;

  // --- CAPTION UPDATE (always, including 0) ---
  const slots = digits10Ref.current.slice(1); // drop oldest
  slots.push(ch); // newest goes into NOW (slot #10)
  digits10Ref.current = slots;

  // Reveal prefix after 3 digits observed (once)
if (revealDigitsRef.current.length < 3) {
  revealDigitsRef.current += ch;

  if (revealDigitsRef.current.length === 3) {
    const s = revealDigitsRef.current;
    labelTextRef.current = `${irr.label} ${s[0]}.${s[1]}${s[2]}`;
  }
}

  // --- AUDIO (if enabled by user gesture) ---
  if (soundOnRef.current) {
  // 🔥 Special crackle exactly when we ENTER a new 10s block (except at start)
  if (isBlockStart && !isInitial) {
    playModeSwitchCrackle(audioCacheRef.current, mode);
  }

  // Digit audio
  if (digitNum === 0) {
    playDigitZeroCrackle(audioCacheRef.current);
  } else {
    const note = noteForDigit(digitNum, mode);
    if (note) playSampleCached(audioCacheRef.current, note, 0.9);
  }
}

  // --- FLAME UPDATE (mode-aware CoF mapping; 0 emits no flame) ---
const logIndex = logIndexForDigit(digitNum, mode);
if (logIndex !== null) {
  const q = flamesRef.current[logIndex];

  const isMinorBlock = mode === "C_MINOR";
  const isFlatDegree = isMinorBlock && (digitNum === 3 || digitNum === 6 || digitNum === 7);

  q.push({
    bornAt: performance.now(),
    digit: digitNum,
    seed: stepRef.current * 991 + digitNum * 131,
    accent: isFlatDegree,
  });

  if (q.length > MAX_FLAMES_PER_LOG) q.shift();
}

  globalStepRef.current++;
}, TICK_MS);

    function draw() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.clearRect(0, 0, w, h);

      const box = fireplaceBox(w, h);

      // frame behind
      ctx.save();
      buildFireplacePath(ctx, box);
      ctx.strokeStyle = "rgba(255,255,255,0.22)";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();

      // clip flames
      ctx.save();
      buildFireplacePath(ctx, box);
      ctx.clip();

      const now = performance.now();

      logs.forEach((log, i) => {
        flamesRef.current[i].forEach((f) => {
          const age = (now - f.bornAt) / 1000;
          if (age > 4) return;

          const life = 1 - age / 4;

          const fullH = heightFromDigit(f.digit, log.y, box.top);
          const splitH = fullH * 0.66;
          const childH = fullH - splitH;

          // timing: parent → pause → child
          const parentEnd = 0.55;
          const childStart = 0.60;
          const t = 1 - life;

          const p = Math.min(1, t / parentEnd);
          const c = t > childStart ? Math.min(1, (t - childStart) / 0.35) : 0;

          drawFlame(
            ctx,
            log.x,
            log.y,
            splitH * easeOutCubic(p),
            age,
            life,
            log.color,
            f.seed,
            1.0,
            !!f.accent
          );

          if (c > 0) {
            drawFlame(
              ctx,
              log.x,
              log.y - splitH,
              childH * easeOutCubic(c),
              age + 0.15,
              life * 0.95,
              log.color,
              f.seed + 999,
              0.85,
              !!f.accent
            );
          }
        });
      });

      ctx.restore();

      // frame on top
      ctx.save();
      ctx.shadowColor = "rgba(255,255,255,0.18)";
      ctx.shadowBlur = 6;
      buildFireplacePath(ctx, box);
      ctx.strokeStyle = "rgba(255,255,255,0.30)";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();

      // --- Caption (canvas-drawn, attached under contour, export-safe) ---
      drawCaptionBar({
        ctx,
        w,
        h,
        box,
        labelText: labelTextRef.current,
        digits10: digits10Ref.current,
      });

      raf = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      clearInterval(tickId);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" />;
}