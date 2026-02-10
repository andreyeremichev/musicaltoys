"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";

type VoiceKey = "PLAIN" | "WRY" | "QUIET" | "WISE";
type Degree = "DO" | "RE" | "MI" | "FA" | "SOL" | "LA";

type VoiceSpec = {
  key: VoiceKey;
  label: string; // UI pill label
  text: string; // what appears on the card
  phrase: Degree[]; // Solresol phrase shape (engine truth)
  imageSrc: string; // you will point these to your assets
};

type GestureSpec = {
  id: string;
  // small internal label; you can show it later if you want
  name: string;

  // Default register for DO. Voices may override via octaveShift if you want later.
  baseOctave: number;

  // Timing defaults for this gesture (ms)
  noteMs: number;
  gapMs: number;

  // Base volume for this gesture
  volume: number;

  voices: VoiceSpec[];
};

const DEGREE_TO_SEMITONE_FROM_C: Record<Degree, number> = {
  DO: 0, // C
  RE: 2, // D
  MI: 4, // E
  FA: 5, // F
  SOL: 7, // G
  LA: 9, // A
};

function noteNameFromC(degree: Degree, octave: number): string {
  // Natural notes only for these phrases.
  const semitone = DEGREE_TO_SEMITONE_FROM_C[degree];
  const map: Record<number, string> = {
    0: "C",
    2: "D",
    4: "E",
    5: "F",
    7: "G",
    9: "A",
  };
  const base = map[semitone];
  return `${base}${octave}`;
}

function makeAudio(noteName: string, volume: number) {
  const safeName = noteName.replace("#", "%23");
  const audio = new Audio(`/audio/notes/${safeName}.wav`);
  audio.volume = volume;
  audio.currentTime = 0;
  return audio;
}

export default function GesturesPage() {
  const gestures: GestureSpec[] = useMemo(
    () => [
      // --- 01 Presence / Support ---
      {
        id: "presence",
        name: "Presence",
        baseOctave: 3,
        noteMs: 900,
        gapMs: 150,
        volume: 0.78,
        voices: [
          {
            key: "PLAIN",
            label: "Plain",
            text: "hey",
            phrase: ["DO", "SOL", "DO"],
            imageSrc: "/gestures/presence-plain.jpg",
          },
          {
            key: "WRY",
            label: "Wry",
            text: "rough one",
            phrase: ["DO", "FA", "DO"],
            imageSrc: "/gestures/presence-wry.jpg",
          },
          {
            key: "QUIET",
            label: "Quiet",
            text: "will pass too",
            phrase: ["MI", "RE", "MI"],
            imageSrc: "/gestures/presence-quiet.jpg",
          },
          {
            key: "WISE",
            label: "Wise",
            text: "with you",
            phrase: ["DO", "SOL", "DO"],
            imageSrc: "/gestures/presence-wise.jpg",
          },
        ],
      },

      // --- 02 Gratitude ---
      {
        id: "gratitude",
        name: "Gratitude",
        baseOctave: 3,
        noteMs: 760,
        gapMs: 140,
        volume: 0.8,
        voices: [
          {
            key: "PLAIN",
            label: "Plain",
            text: "thanks",
            phrase: ["DO", "MI", "DO"],
            imageSrc: "/gestures/gratitude-plain.jpg",
          },
          {
            key: "WRY",
            label: "Wry",
            text: "much appreciated",
            phrase: ["DO", "MI", "SOL", "MI"],
            imageSrc: "/gestures/gratitude-wry.jpg",
          },
          {
            key: "QUIET",
            label: "Quiet",
            text: "meant a lot",
            phrase: ["MI", "SOL", "MI"],
            imageSrc: "/gestures/gratitude-quiet.jpg",
          },
          {
            key: "WISE",
            label: "Wise",
            text: "received",
            phrase: ["DO", "MI", "SOL", "DO"],
            imageSrc: "/gestures/gratitude-wise.jpg",
          },
        ],
      },

      // --- 03 Closeness / Connection ---
      {
        id: "connection",
        name: "Connection",
        baseOctave: 3,
        noteMs: 880,
        gapMs: 150,
        volume: 0.76,
        voices: [
          {
            key: "PLAIN",
            label: "Plain",
            text: "just hey",
            phrase: ["MI", "SOL", "MI"],
            imageSrc: "/gestures/connection-plain.jpg",
          },
          {
            key: "WRY",
            label: "Wry",
            text: "still around",
            phrase: ["DO", "SOL", "FA", "SOL"],
            imageSrc: "/gestures/connection-wry.jpg",
          },
          {
            key: "QUIET",
            label: "Quiet",
            text: "not far",
            phrase: ["MI", "FA", "MI"],
            imageSrc: "/gestures/connection-quiet.jpg",
          },
          {
            key: "WISE",
            label: "Wise",
            text: "within reach",
            phrase: ["SOL", "DO", "SOL"],
            imageSrc: "/gestures/connection-wise.jpg",
          },
        ],
      },

      // --- 04 Calm / Grounding ---
      {
        id: "calm",
        name: "Calm",
        baseOctave: 3,
        noteMs: 820,
        gapMs: 170,
        volume: 0.72,
        voices: [
          {
            key: "PLAIN",
            label: "Plain",
            text: "breathe",
            phrase: ["RE", "DO"],
            imageSrc: "/gestures/calm-plain.jpg",
          },
          {
            key: "WRY",
            label: "Wry",
            text: "why worry",
            phrase: ["FA", "MI", "RE"],
            imageSrc: "/gestures/calm-wry.jpg",
          },
          {
            key: "QUIET",
            label: "Quiet",
            text: "everything passes",
            phrase: ["SOL", "MI", "RE"],
            imageSrc: "/gestures/calm-quiet.jpg",
          },
          {
            key: "WISE",
            label: "Wise",
            text: "this will pass",
            phrase: ["SOL", "FA", "MI", "RE"],
            imageSrc: "/gestures/calm-wise.jpg",
          },
        ],
      },

      // --- 05 Marking a moment ---
      {
        id: "marking",
        name: "Marked Moment",
        baseOctave: 3,
        noteMs: 680,
        gapMs: 140,
        volume: 0.82,
        voices: [
          {
            key: "PLAIN",
            label: "Plain",
            text: "this counts",
            phrase: ["DO", "MI"],
            imageSrc: "/gestures/marking-plain.jpg",
          },
          {
            key: "WRY",
            label: "Wry",
            text: "well done you",
            phrase: ["DO", "RE", "MI"],
            imageSrc: "/gestures/marking-wry.jpg",
          },
          {
            key: "QUIET",
            label: "Quiet",
            text: "worth keeping",
            phrase: ["MI", "SOL", "MI"],
            imageSrc: "/gestures/marking-quiet.jpg",
          },
          {
            key: "WISE",
            label: "Wise",
            text: "marked",
            phrase: ["DO", "MI", "SOL"],
            imageSrc: "/gestures/marking-wise.jpg",
          },
        ],
      },

      // --- 06 Transition ---
      {
        id: "transition",
        name: "Transition",
        baseOctave: 3,
        noteMs: 740,
        gapMs: 150,
        volume: 0.78,
        voices: [
          {
            key: "PLAIN",
            label: "Plain",
            text: "keep moving",
            phrase: ["MI", "FA"],
            imageSrc: "/gestures/transition-plain.jpg",
          },
          {
            key: "WRY",
            label: "Wry",
            text: "next then",
            phrase: ["FA", "SOL"],
            imageSrc: "/gestures/transition-wry.jpg",
          },
          {
            key: "QUIET",
            label: "Quiet",
            text: "onward slowly",
            phrase: ["MI", "FA", "SOL"],
            imageSrc: "/gestures/transition-quiet.jpg",
          },
          {
            key: "WISE",
            label: "Wise",
            text: "next",
            phrase: ["FA", "LA", "DO"],
            imageSrc: "/gestures/transition-wise.jpg",
          },
        ],
      },

      // --- 07 Apology ---
      {
        id: "apology",
        name: "Apology",
        baseOctave: 3,
        noteMs: 980, // slower
        gapMs: 200, // more space
        volume: 0.7, // softer
        voices: [
          {
            key: "PLAIN",
            label: "Plain",
            text: "let it go",
            phrase: ["RE", "DO"],
            imageSrc: "/gestures/apology-plain.jpg",
          },
          {
            key: "WRY",
            label: "Wry",
            text: "my bad",
            phrase: ["DO", "FA", "DO"],
            imageSrc: "/gestures/apology-wry.jpg",
          },
          {
            key: "QUIET",
            label: "Quiet",
            text: "shouldn’t have",
            phrase: ["MI", "RE", "MI"],
            imageSrc: "/gestures/apology-quiet.jpg",
          },
          {
            key: "WISE",
            label: "Wise",
            text: "working on it",
            phrase: ["SOL", "FA", "MI", "FA"],
            imageSrc: "/gestures/apology-wise.jpg",
          },
        ],
      },
    ],
    []
  );

  const [gestureIdx, setGestureIdx] = useState(0);
  const [voiceKey, setVoiceKey] = useState<VoiceKey>("PLAIN");
  const [isPlaying, setIsPlaying] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [sealPulseKey, setSealPulseKey] = useState(0);

  const timersRef = useRef<number[]>([]);
  const audiosRef = useRef<HTMLAudioElement[]>([]);

  const gesture = gestures[gestureIdx];

  const voice: VoiceSpec = useMemo(() => {
    return (
      gesture.voices.find((v) => v.key === voiceKey) ?? gesture.voices[0]
    );
  }, [gesture, voiceKey]);
  // --- URL restore on first load (deep link support) ---
useEffect(() => {
  if (typeof window === "undefined") return;

  const sp = new URLSearchParams(window.location.search);
  const gid = sp.get("g");
  const vk = sp.get("v") as VoiceKey | null;

  if (gid) {
    const i = gestures.findIndex((x) => x.id === gid);
    if (i >= 0) setGestureIdx(i);
  }

  if (vk && (vk === "PLAIN" || vk === "WRY" || vk === "QUIET" || vk === "WISE")) {
    setVoiceKey(vk);
  }
  // run once only
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

// --- Keep URL synced to current moment (so Copy Link is exact) ---
useEffect(() => {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  url.searchParams.set("g", gesture.id);
  url.searchParams.set("v", voiceKey);

  // Avoid page navigation; just update the address bar
  window.history.replaceState(null, "", url.toString());
}, [gesture.id, voiceKey]);

  function clearPlayback() {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
    audiosRef.current.forEach((a) => {
      try {
        a.pause();
        a.currentTime = 0;
      } catch {}
    });
    audiosRef.current = [];
    setIsPlaying(false);
  }

  useEffect(() => {
    clearPlayback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gestureIdx, voiceKey]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 1400);
    return () => window.clearTimeout(t);
  }, [toast]);

  function cycleGesture(dir: -1 | 1) {
    setGestureIdx((prev) => {
      const next = (prev + dir + gestures.length) % gestures.length;
      return next;
    });
  }

  function playPhrase() {
    if (isPlaying) {
      clearPlayback();
      return;
    }
    setSealPulseKey((k) => k + 1);
    setIsPlaying(true);

    // Slight voice nuance: Wise tends to be steadier and slightly lower;
    // Quiet tends to be a touch higher and softer. Keep it subtle.
    const octaveShift =
      voiceKey === "QUIET" ? +1 : voiceKey === "WISE" ? -1 : 0;

    const octave = gesture.baseOctave + octaveShift;
    const noteNames = voice.phrase.map((d) => noteNameFromC(d, octave));

    let tAccum = 0;
    noteNames.forEach((nn, i) => {
      const t = window.setTimeout(() => {
        const a = makeAudio(nn, gesture.volume);
        audiosRef.current.push(a);
        a.play().catch(() => {});
      }, tAccum);
      timersRef.current.push(t);

      tAccum += gesture.noteMs + gesture.gapMs;

      if (i === noteNames.length - 1) {
        const endT = window.setTimeout(() => setIsPlaying(false), tAccum + 10);
        timersRef.current.push(endT);
      }
    });
  }

  async function copyLink() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      setToast("Link copied");
    } catch {
      setToast("Copy failed");
    }
  }

  async function downloadVideo() {
  try {
    setToast("Preparing video…");

    // Export size (16:9). If you later want 1080x1920, we can adapt.
    const W = 1920;
    const H = 1080;
    const FPS = 30;

    // Total duration based on note schedule (+ tail)
    const totalMs =
      voice.phrase.length * (gesture.noteMs + gesture.gapMs) + 600;

    // --- Canvas setup ---
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No canvas context");

    // --- Load background image ---
    const bg = await loadImage(voice.imageSrc);

    // --- WebAudio setup (captures audio into MediaStream) ---
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const dest = audioCtx.createMediaStreamDestination();
    const master = audioCtx.createGain();
    master.gain.value = gesture.volume;
    master.connect(dest);
    master.connect(audioCtx.destination); // so user hears it too (optional)

    // Preload all note buffers
    const octaveShift = voiceKey === "QUIET" ? +1 : voiceKey === "WISE" ? -1 : 0;
    const octave = gesture.baseOctave + octaveShift;
    const noteNames = voice.phrase.map((d) => noteNameFromC(d, octave));
    const buffers = await Promise.all(noteNames.map((nn) => loadWavBuffer(audioCtx, nn)));

    // --- Build combined MediaStream: video + audio ---
    const videoStream = canvas.captureStream(FPS);
    const combined = new MediaStream([
      ...videoStream.getVideoTracks(),
      ...dest.stream.getAudioTracks(),
    ]);

    const mimeType = pickMimeType();
    const recorder = new MediaRecorder(combined, mimeType ? { mimeType } : undefined);
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    // --- Visual timing ---
    const t0 = performance.now();
    const sealPulse = makeSealPulseFn(); // 3 pulses (tasteful)

    // --- Start recording ---
    recorder.start();

    // --- Schedule audio exactly once, aligned to visual start ---
    const startAt = audioCtx.currentTime + 0.12; // small safety offset
    let t = startAt;
    buffers.forEach((buf, i) => {
      const src = audioCtx.createBufferSource();
      src.buffer = buf;
      src.connect(master);
      src.start(t);
      // note duration in seconds
      t += gesture.noteMs / 1000 + gesture.gapMs / 1000;
    });

    // --- Render loop ---
    let raf = 0;
    const draw = () => {
      const now = performance.now();
      const elapsedMs = now - t0;

      renderFrame(ctx, {
        W,
        H,
        bg,
        phraseText: voice.text,
        // Pulse progresses in ms from 0..totalMs
        pulse: sealPulse(elapsedMs),
        // show label under header? (export should be clean)
        drawLabel: false,
      });

      if (elapsedMs < totalMs) {
        raf = requestAnimationFrame(draw);
      }
    };
    draw();

    // Stop recording at end
    await waitMs(totalMs + 120);
    cancelAnimationFrame(raf);

    recorder.stop();

    const blob: Blob = await new Promise((resolve) => {
      recorder.onstop = () => resolve(new Blob(chunks, { type: recorder.mimeType || "video/webm" }));
    });

    // Download
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = `${gesture.id}-${voiceKey}`.toLowerCase() + ".webm";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    setToast("Downloaded");
  } catch (err) {
    console.error(err);
    setToast("Video export failed");
  }
}

// ---------- helpers (export) ----------

function pickMimeType(): string | null {
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  for (const c of candidates) {
    // @ts-ignore
    if (window.MediaRecorder && MediaRecorder.isTypeSupported?.(c)) return c;
  }
  return null;
}

function waitMs(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  const img = new window.Image(); // ← important fix
  img.crossOrigin = "anonymous";
  img.src = src;

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Image failed to load: ${src}`));
  });

  return img;
}

async function loadWavBuffer(audioCtx: AudioContext, noteName: string): Promise<AudioBuffer> {
  const safeName = noteName.replace("#", "%23");
  const res = await fetch(`/audio/notes/${safeName}.wav`);
  if (!res.ok) throw new Error(`WAV fetch failed: ${noteName}`);
  const arr = await res.arrayBuffer();
  return await audioCtx.decodeAudioData(arr);
}

function makeSealPulseFn() {
  // 3 pulses over ~2.2s. Returns {scale, glow} each frame.
  const pulseMs = 2200;
  const peaks = [0.12, 0.44, 0.76]; // normalized times of peaks
  return (tMs: number) => {
    const t = Math.max(0, Math.min(1, tMs / pulseMs));
    let scale = 1;
    let glow = 0;

    for (const p of peaks) {
      const d = Math.abs(t - p);
      const w = 0.08; // width of each pulse
      const k = Math.max(0, 1 - d / w);
      // ease (smooth)
      const e = k * k * (3 - 2 * k);
      scale += 0.04 * e; // up to +4%
      glow += 0.25 * e;  // subtle
    }
    return { scale, glow };
  };
}

function renderFrame(
  ctx: CanvasRenderingContext2D,
  opts: {
    W: number;
    H: number;
    bg: HTMLImageElement;
    phraseText: string;
    pulse: { scale: number; glow: number };
    drawLabel: boolean;
  }
) {
  const { W, H, bg, phraseText, pulse } = opts;

  // Draw background image cover
  const iw = bg.naturalWidth || bg.width;
  const ih = bg.naturalHeight || bg.height;
  const scale = Math.max(W / iw, H / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (W - dw) / 2;
  const dy = (H - dh) / 2;

  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(bg, dx, dy, dw, dh);

  // Lower-third scrim (same as UI)
  const grad = ctx.createLinearGradient(0, H, 0, H * 0.42);
  grad.addColorStop(0, "rgba(0,0,0,0.72)");
  grad.addColorStop(0.55, "rgba(0,0,0,0.38)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, H * 0.42, W, H * 0.58);

  // Phrase text
  ctx.font = "700 110px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillStyle = "rgba(255,255,255,0.96)";
  ctx.textBaseline = "alphabetic";
  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;

  ctx.fillText(phraseText, 90, H - 140);

  // Seal (top-right) with pulse
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  const sealSize = 130; // visual size in export
  const cx = W - 90;
  const cy = 90;

  drawSeal(ctx, voice.phrase, cx, cy, sealSize, pulse);
}

function drawSeal(
  ctx: CanvasRenderingContext2D,
  degrees: Degree[],
  cx: number,
  cy: number,
  size: number,
  pulse: { scale: number; glow: number }
) {
  const s = pulse.scale;
  const r = (size / 2) * s;

  // Glow (gold-ish, subtle)
  if (pulse.glow > 0.01) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r + 6, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(212,175,55,${0.12 * pulse.glow})`;
    ctx.fill();
    ctx.restore();
  }

  // Gold circle
  ctx.beginPath();
  ctx.arc(cx, cy, r - 2, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(168, 142, 84, 0.22)";
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(212, 175, 55, 0.75)";
  ctx.stroke();

  // Sigil curve (white)
  const yFor: Record<Degree, number> = {
    DO: cy - r * 0.45,
    RE: cy - r * 0.22,
    MI: cy + 0,
    FA: cy + r * 0.22,
    SOL: cy + r * 0.45,
    LA: cy + r * 0.07,
  };

  const padX = r * 0.55;
  const step =
    degrees.length > 1 ? ((r * 2 - padX * 2) / (degrees.length - 1)) : 0;

  const pts = degrees.map((d, i) => ({
    x: cx - r + padX + i * step,
    y: yFor[d],
  }));

  ctx.strokeStyle = "rgba(255,255,255,0.92)";
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);

  for (let i = 1; i < pts.length - 1; i++) {
    const cpx = pts[i].x;
    const cpy = pts[i].y;
    const nx = (pts[i].x + pts[i + 1].x) / 2;
    const ny = (pts[i].y + pts[i + 1].y) / 2;
    ctx.quadraticCurveTo(cpx, cpy, nx, ny);
  }
  ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
  ctx.stroke();
}
  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white">
      {/* Top bar */}
      <div className="mx-auto flex w-full max-w-[980px] items-center justify-between px-4 pt-4">
        <button
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          onClick={() => history.back()}
        >
          ← Back
        </button>

        <div className="text-center">
  <div className="text-xs uppercase tracking-[0.18em] text-white/60">
    Gestures
  </div>

  <div className="mt-1 text-sm text-white/80">
    {gesture.name} <span className="text-white/40">—</span> {voice.label}
  </div>
</div>

        <button
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          onClick={() => setToast("Acknowledge without conversation.")}
          aria-label="Info"
          title="Info"
        >
          ⓘ
        </button>
      </div>

      {/* Main card frame */}
      <div className="mx-auto w-full max-w-[980px] px-4 pb-10 pt-4">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/30">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={voice.imageSrc}
              alt={`${gesture.name} — ${voice.label}`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 980px) 100vw, 980px"
            />

            {/* Subtle breathing light */}
            <div
              className="pointer-events-none absolute inset-0 opacity-18"
              style={{
                background:
                  "radial-gradient(80% 60% at 50% 40%, rgba(255,255,255,0.22), rgba(255,255,255,0) 60%)",
                animation: "gestureBreath 7s ease-in-out infinite",
                mixBlendMode: "soft-light",
              }}
            />

            {/* Lower-third scrim for legibility */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%]"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 45%, rgba(0,0,0,0) 100%)",
              }}
            />

            {/* Gesture browsing arrows */}
            <button
              onClick={() => cycleGesture(-1)}
              className="absolute left-3 top-1/2 z-40 -translate-y-1/2 rounded-full border border-white/15 bg-black/35 px-3 py-2 text-lg backdrop-blur hover:bg-black/50"
              aria-label="Previous gesture"
              title="Previous"
            >
              ←
            </button>
            <button
              onClick={() => cycleGesture(1)}
              className="absolute right-3 top-1/2 z-40 -translate-y-1/2 rounded-full border border-white/15 bg-black/35 px-3 py-2 text-lg backdrop-blur hover:bg-black/50"
              aria-label="Next gesture"
              title="Next"
            >
              →
            </button>

            {/* Main text (Voice text) */}
            <div className="absolute bottom-6 left-6 right-6 z-30">
              <div className="max-w-[760px]">
                <div
                  className="text-4xl font-semibold tracking-tight text-white"
                  style={{ textShadow: "0 2px 18px rgba(0,0,0,0.55)" }}
                >
                  {voice.text}
                </div>

                
              </div>
            </div>

            {/* Seal (top-right corner, INSIDE) */}
<div
  className="pointer-events-none absolute top-2 right-2 z-50"
  style={{ opacity: 0.92 }}
  aria-hidden
>
  <div key={sealPulseKey} className="rounded-full p-2 sealPulse">
    <SealGlyph degrees={voice.phrase} size={65} />
  </div>
</div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4">
          {/* Row 1: actions */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={playPhrase}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#f0c94a] px-5 py-3 font-semibold text-black hover:brightness-95"
            >
              <span className="text-lg">▶</span>
              {isPlaying ? "Stop" : "Play"}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={copyLink}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm hover:bg-white/10"
              >
                Copy link
              </button>

              <button
  onClick={downloadVideo}
  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm hover:bg-white/10"
>
  Download video
</button>
            </div>
          </div>

          {/* Row 2: Voice pills under actions */}
          <div className="mt-8 flex justify-end">
            <VoicePills voiceKey={voiceKey} setVoiceKey={setVoiceKey} />
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-2xl border border-white/10 bg-black/60 px-4 py-2 text-sm text-white/90 backdrop-blur">
          {toast}
        </div>
      )}

      {/* Keyframes */}
      <style jsx>{`
  @keyframes gestureBreath {
    0% {
      opacity: 0.14;
      transform: scale(1);
    }
    50% {
      opacity: 0.22;
      transform: scale(1.02);
    }
    100% {
      opacity: 0.14;
      transform: scale(1);
    }
  }

  .sealPulse {
    animation: sealPulse3 2.2s ease-in-out both;
  }

  @keyframes sealPulse3 {
  0% {
    transform: scale(1);
    filter: drop-shadow(0 0 0 rgba(255, 255, 255, 0));
  }
  12% {
    transform: scale(1.04);
    filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.25));
  }
  24% {
    transform: scale(1);
    filter: drop-shadow(0 0 0 rgba(255, 255, 255, 0));
  }

  44% {
    transform: scale(1.035);
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.1));
  }
  56% {
    transform: scale(1);
    filter: drop-shadow(0 0 0 rgba(255, 255, 255, 0));
  }

  76% {
    transform: scale(1.03);
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.08));
  }
  88% {
    transform: scale(1);
    filter: drop-shadow(0 0 0 rgba(255, 255, 255, 0));
  }

  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 0 rgba(255, 255, 255, 0));
  }
}
`}</style>
    </div>
  );
}

function VoicePills({
  voiceKey,
  setVoiceKey,
}: {
  voiceKey: VoiceKey;
  setVoiceKey: (k: VoiceKey) => void;
}) {
  const items: Array<{ key: VoiceKey; label: string }> = [
    { key: "PLAIN", label: "Plain" },
    { key: "WRY", label: "Wry" },
    { key: "QUIET", label: "Quiet" },
    { key: "WISE", label: "Wise" },
  ];

  return (
    <div className="max-w-[520px]">
      <div className="mb-1 text-[11px] uppercase tracking-[0.14em] text-white/55">
        Voice
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
        {items.map((it) => {
          const active = voiceKey === it.key;
          return (
            <button
              key={it.key}
              onClick={() => setVoiceKey(it.key)}
              className={[
                "shrink-0 rounded-full border px-4 py-2 text-sm",
                "transition",
                active
                  ? "border-white/35 bg-white/15 text-white"
                  : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10",
              ].join(" ")}
              aria-pressed={active}
            >
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Wax-stamp style seal: irregular blob + bold sigil stroke derived from contour.
 * Deterministic from degrees, but NOT diagrammatic.
 */
function SealGlyph({
  degrees,
  size = 84,
}: {
  degrees: Degree[];
  size?: number;
}) {
  // Single-circle seal + sigil stroke derived from phrase contour.
  // No inner ring, no diagram nodes.

  const cx = size / 2;
  const cy = size / 2;

  const yFor: Record<Degree, number> = {
    DO: cy - 14,
    RE: cy - 7,
    MI: cy + 0,
    FA: cy + 7,
    SOL: cy + 14,
    LA: cy + 2,
  };

  const padX = size * 0.22;
  const step =
    degrees.length > 1 ? (size - padX * 2) / (degrees.length - 1) : 0;

  const pts = degrees.map((d, i) => {
    const x = padX + i * step;
    const y = yFor[d];
    return { x, y };
  });

  // Smooth sigil stroke
  const smoothPath = (() => {
    if (pts.length === 0) return "";
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const cpx = pts[i].x;
      const cpy = pts[i].y;
      const nx = (pts[i].x + pts[i + 1].x) / 2;
      const ny = (pts[i].y + pts[i + 1].y) / 2;
      d += ` Q ${cpx.toFixed(1)} ${cpy.toFixed(1)} ${nx.toFixed(1)} ${ny.toFixed(
        1
      )}`;
    }
    d += ` T ${pts[pts.length - 1].x.toFixed(1)} ${pts[
      pts.length - 1
    ].y.toFixed(1)}`;
    return d;
  })();

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="block"
      aria-hidden
    >
      {/* Single circle */}
      <circle
  cx={cx}
  cy={cy}
  r={cx - 2}
  fill="rgba(168, 142, 84, 0.22)"      // muted gold fill
  stroke="rgba(212, 175, 55, 0.75)"    // classic gold stroke
  strokeWidth="2.2"
/>

      {/* Sigil */}
      <path
        d={smoothPath}
        fill="none"
        stroke="rgba(255,255,255,0.92)"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}