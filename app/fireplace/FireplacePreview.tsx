"use client";

import React, { useEffect, useMemo, useRef } from "react";

/**
 * FireplacePreview
 * - Visual-only flame renderer for Homepage.
 * - No audio, no selectors, no user interaction.
 * - Runs a short deterministic digit loop forever.
 *
 * NOTE: This is a lightweight port of the flame+caption visual loop.
 * If you want a perfect 1:1 render with /fireplace, you can import shared
 * helpers from your fireplace canvas file later, but this is safe and isolated.
 */

const TICK_MS = 500;
const MAX_FLAMES_PER_LOG = 4;

// Short deterministic digits (pi sample) for preview only
const DIGITS = "3141592653589793238462643383279502884197";

type Log = { x: number; y: number; color: string };
type Flame = { bornAt: number; digit: number; seed: number };

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

function computeFireplaceBox(w: number, h: number) {
  // Preview box: slightly inset so it looks good in a card
  return {
    left: w * 0.08,
    right: w * 0.92,
    top: h * 0.10,
    bottom: h * 0.80,
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

function computeLogs(w: number, h: number): Log[] {
  const box = computeFireplaceBox(w, h);

  const padX = (box.right - box.left) * 0.09;
  const xMin = box.left + padX;
  const xMax = box.right - padX;

  const baseY = box.bottom - (box.bottom - box.top) * 0.10;
  const arcLift = (box.bottom - box.top) * 0.06;

  const logs: Log[] = [];
  for (let i = 0; i < 10; i++) {
    const t = i / 9;
    const x = xMin + (xMax - xMin) * t;

    const u = t * 2 - 1; // -1..1
    const y = baseY - (1 - u * u) * arcLift;

    logs.push({
      x,
      y,
      color: `hsl(${22 + i * 2} 85% ${40 + i * 1.1}%)`,
    });
  }
  return logs;
}

function heightFromDigit(d: number, baseY: number, boxTop: number) {
  const headroom = 14;
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
  widthScale: number
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

  // outer
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.12 + life * 0.55;
  ctx.beginPath();
  ctx.moveTo(pts[0].x - pts[0].w, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x - pts[i].w, pts[i].y);
  ctx.lineTo(tipX, tipY);
  for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i].x + pts[i].w, pts[i].y);
  ctx.closePath();
  ctx.fill();

  // hollow cavity (preview-safe)
  ctx.globalAlpha = 0.22 + life * 0.10;
  ctx.fillStyle = "rgba(0,0,0,0.70)";
  ctx.beginPath();
  ctx.moveTo(pts[0].x - pts[0].w * 0.45, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x - pts[i].w * 0.45, pts[i].y);
  ctx.lineTo(tipX, tipY + height * 0.45);
  for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i].x + pts[i].w * 0.45, pts[i].y);
  ctx.closePath();
  ctx.fill();

  // contour
  ctx.globalAlpha = 0.25 + life * 0.45;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.1 + life;
  ctx.stroke();

  ctx.restore();
}

export default function FireplacePreview({
  className = "",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const flamesRef = useRef<Flame[][]>(Array.from({ length: 10 }, () => []));
  const stepRef = useRef(0);

  // Balanced “breathing” purely for visuals (no audio): 20 steps bright vs dark
  const globalStepRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let tickId: number | null = null;

    let logs: Log[] = [];

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = parent.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      logs = computeLogs(w, h);
    }

    resize();
    window.addEventListener("resize", resize);

    tickId = window.setInterval(() => {
      const ch = DIGITS[stepRef.current] ?? "0";
      const digit = Number(ch);

      stepRef.current = (stepRef.current + 1) % DIGITS.length;

      // Visual-only: 0 = no flame
      if (digit !== 0) {
        const logIndex = digit % 10;
        const q = flamesRef.current[logIndex];
        q.push({
          bornAt: performance.now(),
          digit,
          seed: stepRef.current * 991 + digit * 131,
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

      const box = computeFireplaceBox(w, h);

      // frame
      ctx.save();
      ctx.shadowColor = "rgba(255,255,255,0.14)";
      ctx.shadowBlur = 6;
      buildFireplacePath(ctx, box);
      ctx.strokeStyle = "rgba(255,255,255,0.22)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();

      // clip
      ctx.save();
      buildFireplacePath(ctx, box);
      ctx.clip();

      const now = performance.now();

      // Visual “breathing”: brighten every other 20-step block
      const brightBlock = Math.floor(globalStepRef.current / 20) % 2 === 0;

      logs.forEach((log, i) => {
        const q = flamesRef.current[i];
        q.forEach((f) => {
          const age = (now - f.bornAt) / 1000;
          const ttl = 3.6;
          if (age > ttl) return;

          const life = 1 - age / ttl;

          const fullH = heightFromDigit(f.digit, log.y, box.top);
          const splitH = fullH * 0.66;
          const childH = fullH - splitH;

          const t = 1 - life;
          const p = Math.min(1, t / 0.55);
          const c = t > 0.60 ? Math.min(1, (t - 0.60) / 0.35) : 0;

          // Slight brightness lift on “bright” blocks
          const color = brightBlock ? log.color : log.color;

          drawFlame(ctx, log.x, log.y, splitH * easeOutCubic(p), age, life, color, f.seed, 1.0);

          if (c > 0) {
            drawFlame(
              ctx,
              log.x,
              log.y - splitH,
              childH * easeOutCubic(c),
              age + 0.15,
              life * 0.95,
              color,
              f.seed + 999,
              0.85
            );
          }
        });
      });

      ctx.restore();

      raf = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      if (tickId) window.clearInterval(tickId);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full pointer-events-none"
      />
    </div>
  );
}