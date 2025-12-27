// app/calendar/page.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as Tone from "tone";
import { buildEvents, type TextToneEvent } from "@/lib/text-to-tone/buildEvents";
import { CALENDAR_BY_MMDD } from "@/lib/calendar/calendarData";

/* Light-only theme (locked) */
const theme = {
  bg: "#F5F6F8",
  card: "#FFFFFF",
  border: "#D9DEE7",
  text: "#1B2430",
  muted: "#667083",
  gold: "#C59B2A",
};
const bgToday = "#F5F6F8";
const bgYesterday = "#F6F4F1";
const bgTomorrow = "#F3F6F9";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function mmddFromDate(d: Date) {
  return `${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function labelFromDate(d: Date) {
  return d.toLocaleString(undefined, { month: "long", day: "numeric" });
}
function addDays(d: Date, delta: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + delta);
  return x;
}

// ---- note/midi helpers ----
function noteNameToMidi(n: string) {
  const m =
    /^([A-Ga-g])([#b]?)(-?\d+)$/.exec(n) ||
    /^([a-g])([#b]?)\/(-?\d+)$/.exec(n);
  if (!m) throw new Error("bad note: " + n);
  const L = m[1].toUpperCase();
  const acc = m[2] || "";
  const oct = parseInt(m[3], 10);
  const BASE: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  let pc = BASE[L];
  if (acc === "#") pc = (pc + 1) % 12;
  else if (acc === "b") pc = (pc + 11) % 12;
  return (oct + 1) * 12 + pc;
}
function midiToNoteName(midi: number) {
  const pc = midi % 12;
  const oct = Math.floor(midi / 12) - 1;
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;
  return `${names[pc]}${oct}`;
}

// Keep pitch-class, shift by octaves into C2..C4
function clampToC2C4(note: string) {
  const MIN = 36; // C2
  const MAX = 60; // C4
  let m = noteNameToMidi(note);
  while (m < MIN) m += 12;
  while (m > MAX) m -= 12;
  return midiToNoteName(m);
}

// Sanitize visible phrase (keep aligned with buildEvents sanitize intent)
function sanitizeVisible(s: string) {
  return s
    .replace(/\u2014|\u2013/g, "-")
    .replace(/\.{3,}/g, "...")
    .replace(/[^A-Za-z0-9 .,;?\-!'/%+=:@#$()&]+/g, "");
}

type Run = {
  events: TextToneEvent[];
  phrase: string; // visible phrase
  duration: number; // seconds
  map: number[]; // eventIndex -> charIndex in phrase (or -1)
};

// Map events to character indices in the visible phrase.
// Visible phrase is "<text> <year>".
function mapEventsToCharIndices(events: TextToneEvent[], phrase: string): number[] {
  const s = phrase;
  let j = 0;

  const takeNext = (pred: (ch: string) => boolean): number => {
    while (j < s.length && !pred(s[j])) j++;
    if (j >= s.length) return -1;
    const idx = j;
    j++;
    return idx;
  };

  const takeDigitRun = (lenGuess: number): number => {
    while (j < s.length && !/[0-9]/.test(s[j])) j++;
    if (j >= s.length) return -1;
    const idx = j;
    let taken = 0;
    while (j < s.length && /[0-9]/.test(s[j]) && taken < Math.max(1, lenGuess)) {
      j++;
      taken++;
    }
    return idx;
  };

  const out: number[] = [];
  for (const ev of events) {
    if (ev.kind === "REST") {
      const idx = takeNext((ch) => ch === " " || ch === "-" || ch === "\t");
      out.push(idx);
      continue;
    }
    if (ev.kind === "MELODY") {
      const idx = takeNext((ch) => /[A-Za-z]/.test(ch));
      out.push(idx);
      continue;
    }
    const label = (ev.label || "").trim();
    if (/^\d+/.test(label)) {
      out.push(takeDigitRun(label.length));
      continue;
    }
    out.push(takeNext((ch) => ch !== " " && ch !== "\t"));
  }
  return out;
}

// ---- Wiggle trace renderer (Canvas) ----
function useWiggleTraceCanvas(opts: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isPlaying: boolean;
  startAtMs: number;
  durationMs: number;
  events: TextToneEvent[];
  seedKey: string; // mmdd
}) {
  const pointsRef = useRef<{ x: number; y: number }[]>([]);
  const rafRef = useRef<number | null>(null);
  const ySmoothRef = useRef<number | null>(null);

  const seed = useMemo(() => {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < opts.seedKey.length; i++) {
      h ^= opts.seedKey.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }, [opts.seedKey]);

  const phases = useMemo(() => {
    const a = (seed % 1000) / 1000;
    const b = (Math.floor(seed / 1000) % 1000) / 1000;
    return { p1: a * Math.PI * 2, p2: b * Math.PI * 2 };
  }, [seed]);

  const easeInOutCubic = (u: number) =>
    u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;

  const getActivePitchMidi = (tSec: number): number | null => {
    let last: TextToneEvent | null = null;
    for (const ev of opts.events) {
      const t0 = ev.t ?? 0;
      const t1 = (ev.t ?? 0) + (ev.d ?? 0);
      if (tSec >= t0 && tSec < t1) {
        last = ev;
        break;
      }
      if (tSec >= t0) last = ev;
    }
    if (!last || last.kind === "REST" || !last.notes?.length) return null;
    return noteNameToMidi(last.notes[0]);
  };

  const draw = useCallback(() => {
    const canvas = opts.canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const W = Math.max(1, Math.floor(rect.width));
    const H = Math.max(1, Math.floor(rect.height));
    const cw = Math.floor(W * dpr);
    const ch = Math.floor(H * dpr);

    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, cw, ch);

    if (!opts.isPlaying) {
      pointsRef.current = [];
      ySmoothRef.current = null;
      return;
    }

    const now = performance.now();
    const tMs = now - opts.startAtMs;
    const u = Math.max(0, Math.min(1, tMs / Math.max(1, opts.durationMs)));
    const tSec = (u * opts.durationMs) / 1000;

    const xLeft = W * 0.08;
    const xRight = W * 0.92;
    const x = xLeft + easeInOutCubic(u) * (xRight - xLeft);

    // Invisible staff mapping C2..C4
    const MIN = 36; // C2
    const MAX = 60; // C4
    const yTop = H * 0.22;
    const yBot = H * 0.78;

    const pitchMidi = getActivePitchMidi(tSec);
    const p = pitchMidi == null ? 0.5 : Math.max(0, Math.min(1, (pitchMidi - MIN) / (MAX - MIN)));
    const yBase = yTop + (1 - p) * (yBot - yTop);

    // smoothing
    const alpha = 0.16;
    const prev = ySmoothRef.current ?? yBase;
    const ySmooth = prev + alpha * (yBase - prev);
    ySmoothRef.current = ySmooth;

    // subtle wiggle
    const Amax = H * 0.010;
    const A = Amax * Math.sin(Math.PI * u);
    const f1 = 6.0,
      f2 = 13.0;
    const wig =
      Math.sin(2 * Math.PI * (f1 * u) + phases.p1) +
      0.5 * Math.sin(2 * Math.PI * (f2 * u) + phases.p2);
    const y = ySmooth + A * wig;

    pointsRef.current.push({ x, y });

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(27,36,48,0.16)"; // subtle on light
    ctx.beginPath();
    const pts = pointsRef.current;
    if (pts.length) {
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.stroke();
    ctx.restore();

    if (u < 1) rafRef.current = requestAnimationFrame(draw);
  }, [opts.canvasRef, opts.durationMs, opts.events, opts.isPlaying, opts.startAtMs, phases.p1, phases.p2]);

  useEffect(() => {
    if (!opts.isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      pointsRef.current = [];
      ySmoothRef.current = null;

      const canvas = opts.canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    pointsRef.current = [];
    ySmoothRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [opts.isPlaying, draw, opts.canvasRef]);
}

export default function CalendarPage() {
  const baseToday = useMemo(() => new Date(), []);
  const [offset, setOffset] = useState<-1 | 0 | 1>(0);

  const dayDate = useMemo(() => addDays(baseToday, offset), [baseToday, offset]);
  const mmdd = useMemo(() => mmddFromDate(dayDate), [dayDate]);
  const dateLabel = useMemo(() => labelFromDate(dayDate), [dayDate]);
  const relLabel = offset === -1 ? "Yesterday" : offset === 1 ? "Tomorrow" : "Today";

  const bg =
  offset === -1 ? bgYesterday :
  offset ===  1 ? bgTomorrow  :
                  bgToday;


  const entry = CALENDAR_BY_MMDD[mmdd];

  // audio + run state
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  const timeoutsRef = useRef<number[]>([]);
  const samplerRef = useRef<Tone.Sampler | null>(null);

  const [run, setRun] = useState<Run | null>(null);
  const [activeCharIdx, setActiveCharIdx] = useState(-1);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [traceStartAtMs, setTraceStartAtMs] = useState(0);
  const [traceDurationMs, setTraceDurationMs] = useState(1);

  useWiggleTraceCanvas({
    canvasRef,
    isPlaying,
    startAtMs: traceStartAtMs,
    durationMs: traceDurationMs,
    events: run?.events ?? [],
    seedKey: mmdd,
  });

  const clearTimers = () => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  };

  const ensureSampler = useCallback(async (evts: TextToneEvent[]) => {
    if (samplerRef.current) {
      try {
        samplerRef.current.dispose();
      } catch {}
      samplerRef.current = null;
    }
    const urls: Record<string, string> = {};
    for (const e of evts) {
      if (e.kind !== "REST") {
        for (const n of e.notes) {
          urls[n] = `${n.replace("#", "%23")}.wav`;
        }
      }
    }
    samplerRef.current = new Tone.Sampler({ urls, baseUrl: "/audio/notes/" }).toDestination();
    await Tone.loaded();
  }, []);

  const triggerNow = (notes: string[], seconds: number) => {
    const s = samplerRef.current;
    if (!s || !notes.length) return;
    try {
      (s as any).triggerAttackRelease(notes, Math.max(0.12, seconds * 0.9));
    } catch {}
  };

  const buildRun = useCallback((phraseVisible: string) => {
    const phrase = sanitizeVisible(phraseVisible);
    const { events: base } = buildEvents(phrase);

    // Clamp notes into C2..C4 (Calendar rule)
    const clamped: TextToneEvent[] = base.map((ev) => {
      if (ev.kind === "REST") return ev;
      const notes = ev.notes.map(clampToC2C4);
      return { ...ev, notes };
    });

    const lastEnd = clamped.reduce((mx, e) => Math.max(mx, (e.t ?? 0) + (e.d ?? 0)), 0);
    const map = mapEventsToCharIndices(clamped, phrase);

    return { phrase, events: clamped, duration: lastEnd, map } satisfies Run;
  }, []);

  const stop = useCallback(() => {
    clearTimers();
    setIsPlaying(false);
    isPlayingRef.current = false;
    setActiveCharIdx(-1);
  }, []);

  const start = useCallback(async () => {
    if (isPlayingRef.current) return;
    if (!entry) return;

    const phraseVisible = `${entry.text} ${entry.year}`;
    const r = buildRun(phraseVisible);

    setRun(r);
    setActiveCharIdx(-1);

    await Tone.start();
    await ensureSampler(r.events);

    clearTimers();
    setIsPlaying(true);
    isPlayingRef.current = true;

    const now = performance.now();
    setTraceStartAtMs(now);
    setTraceDurationMs(Math.round(r.duration * 1000));

    const timers: number[] = [];
    for (let i = 0; i < r.events.length; i++) {
      const ev = r.events[i];
      const startMs = Math.max(0, Math.round((ev.t ?? 0) * 1000));

      timers.push(
        window.setTimeout(() => {
          if (!isPlayingRef.current) return;
          setActiveCharIdx(r.map[i] ?? -1);
        }, startMs)
      );

      if (ev.kind !== "REST" && ev.notes.length) {
        timers.push(
          window.setTimeout(() => {
            if (!isPlayingRef.current) return;
            triggerNow(ev.notes, ev.d ?? 0.3);
          }, startMs)
        );
      }
    }

    timers.push(
      window.setTimeout(() => {
        if (!isPlayingRef.current) return;
        clearTimers();
        setIsPlaying(false);
        isPlayingRef.current = false;
        setActiveCharIdx(-1);
      }, Math.round((r.duration + 0.15) * 1000))
    );

    timeoutsRef.current.push(...timers);
  }, [buildRun, ensureSampler, entry, stop]);

  useEffect(() => {
    stop();
    setRun(null);
  }, [mmdd, stop]);

  const phraseForDisplay = useMemo(() => {
    if (!entry) return "";
    return sanitizeVisible(`${entry.text} ${entry.year}`);
  }, [entry]);

  const phraseRender = useMemo(() => {
    const s = phraseForDisplay;
    if (!s) return null;

    return (
      <div className="cal-phrase" aria-live="off">
        {Array.from(s).map((ch, i) => {
          const isCurrent = isPlaying && i === activeCharIdx;
          return (
            <span
              key={`ch-${i}`}
              style={{
                transition: "color 120ms ease, text-shadow 120ms ease, opacity 120ms ease",
                color: isCurrent ? theme.gold : theme.text,
                textShadow: isCurrent ? "0 0 10px rgba(197,155,42,0.35)" : "none",
                fontWeight: isCurrent ? 800 : 650,
                opacity: !isPlaying ? 0.92 : i < activeCharIdx ? 0.62 : 1.0,
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
    );
  }, [phraseForDisplay, isPlaying, activeCharIdx]);

  return (
    <main style={{ minHeight: "100vh", background: bg, color: theme.text }}>
      <style>{`
        .cal-wrap{
          max-width: 560px;
          margin: 0 auto;
          padding: 12px;
          padding-top: max(12px, env(safe-area-inset-top));
          padding-bottom: max(16px, env(safe-area-inset-bottom));
        }
        .cal-card{
          background: ${theme.card};
          border: 1px solid ${theme.border};
          border-radius: 18px;
          padding: 14px;
          box-shadow: 0 1px 0 rgba(0,0,0,0.03);
          overflow: hidden;
        }
        .cal-date{
          text-align: center;
          margin-top: 2px;
        }
        .cal-dateTitle{
          font-size: clamp(22px, 5.4vw, 30px);
          font-weight: 760;
          letter-spacing: 0.2px;
        }
        .cal-dateSub{
          margin-top: 4px;
          color: ${theme.muted};
          font-size: 14px;
        }
        .cal-trace{
          width: 100%;
          height: 64px;
          margin: 10px 0 2px;
        }
        @media (max-width: 360px){
          .cal-trace{ height: 56px; }
        }
        .cal-phrase{
          font-size: clamp(15px, 4.2vw, 18px);
          line-height: 1.65;
          letter-spacing: 0.15px;
          text-align: center;
          padding: 6px 8px 0;
          word-break: break-word;
          overflow-wrap: anywhere;
        }
        .cal-controls{
          display: flex;
          justify-content: center;
          margin-top: 10px;
        }
        .cal-btn{
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid ${theme.border};
          background: transparent;
          color: ${theme.text};
          font-weight: 800;
          cursor: pointer;
          width: min(240px, 100%);
        }
        .cal-nav{
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
          margin-top: 16px;
        }
        @media (max-width: 360px){
          .cal-nav{ gap: 8px; }
        }
        .cal-navBtn{
          padding: 10px 10px;
          border-radius: 12px;
          border: 1px solid ${theme.border};
          background: transparent;
          font-weight: 800;
          cursor: pointer;
          min-width: 0;
        }
        .cal-navBtnActive{
          color: ${theme.gold};
        }
        .cal-missing{
          text-align: center;
          margin: 20px 0 10px;
          color: ${theme.muted};
          font-size: 14px;
        }
          .cal-play{
  width: 54px;
  height: 54px;
  border-radius: 999px;
  border: 1px solid ${theme.border};
  background: transparent;
  color: ${theme.gold};
  font-size: 22px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
}
.cal-play:active{
  transform: translateY(1px);
}

.cal-strip{
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 16px;
  padding-top: 10px;
  border-top: 1px solid ${theme.border};
}
.cal-stripItem{
  appearance: none;
  border: none;
  background: transparent;
  color: ${theme.muted};
  font-weight: 800;
  font-size: 14px;
  padding: 6px 6px;
  border-radius: 10px;
  cursor: pointer;
}
.cal-stripActive{
  color: ${theme.text};
  text-decoration: underline;
  text-underline-offset: 6px;
}
.cal-stripDot{
  color: ${theme.muted};
  opacity: 0.6;
  font-size: 14px;
}
@media (max-width: 360px){
  .cal-strip{ gap: 8px; }
  .cal-stripItem{ font-size: 13px; padding: 6px 4px; }
}
      `}</style>

      <div className="cal-wrap">
        <div className="cal-card">
          <div className="cal-date">
            <div className="cal-dateTitle">{dateLabel}</div>
            <div className="cal-dateSub">{relLabel}</div>
          </div>

          {entry ? (
            <>
              <div className="cal-trace">
                <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
              </div>

              {phraseRender}

              <div className="cal-controls">
  <button
    className="cal-play"
    onClick={() => (isPlaying ? stop() : start())}
    aria-label={isPlaying ? "Stop" : "Hear it"}
    title={isPlaying ? "Stop" : "Hear it"}
  >
    🎶
  </button>
</div>
            </>
          ) : (
            <div className="cal-missing">Not yet written for this date.</div>
          )}

          <div className="cal-strip" aria-label="Calendar navigation">
  <button
    className={`cal-stripItem ${offset === -1 ? "cal-stripActive" : ""}`}
    onClick={() => setOffset(-1)}
  >
    Yesterday
  </button>

  <span className="cal-stripDot">•</span>

  <button
    className={`cal-stripItem ${offset === 0 ? "cal-stripActive" : ""}`}
    onClick={() => setOffset(0)}
  >
    Today
  </button>

  <span className="cal-stripDot">•</span>

  <button
    className={`cal-stripItem ${offset === 1 ? "cal-stripActive" : ""}`}
    onClick={() => setOffset(1)}
  >
    Tomorrow
  </button>
</div>
        </div>
      </div>
    </main>
  );
}
