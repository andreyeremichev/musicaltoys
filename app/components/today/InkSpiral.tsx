// components/today/InkSpiral.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";

type Pt = { x: number; y: number };

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

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
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

function buildSpiralPathFromAngles(opts: {
  angles: number[];
  seedStr: string;
  influence?: number; // default tuned
  dir?: 1 | -1; // Today uses +1
}): { pathD: string } {
  const { angles, seedStr } = opts;
  const influence = opts.influence ?? 0.12; // slightly stronger than 0.08 for perceptible day-to-day identity
  const dir: 1 | -1 = opts.dir ?? 1;

  const n = Math.max(1, angles.length);

  const curls = spiralCurlsForCount(n);
  const avgJump = avgAngularJump(angles);
  const jumpNorm = clamp(avgJump / Math.PI, 0, 1);
  const maxR = clamp(32 + jumpNorm * 32, 32, 62);

  const seed = hash01(seedStr);

  // start angle = first node (fallback: top)
  const startAngle = angles[0] ?? -Math.PI / 2;

  // small deterministic offset so similar sequences still diverge
  const seedOffset = (seed - 0.5) * 0.55; // ~±0.275 rad (~±16°)

  let theta = startAngle + seedOffset;
  let step = 0;

  const pts: Pt[] = [{ x: 50, y: 50 }];

  for (let i = 0; i < angles.length; i++) {
    const targetAngle = angles[i];

    const baseAdvance = (dir * (Math.PI * 2 * curls)) / n;
    const proposed = theta + baseAdvance;
    theta = angleLerp(proposed, targetAngle, influence);

    const t = clamp((step + 1) / n, 0, 1);
    const r = maxR * t;

    // deterministic subtle wobble
    const wobbleAmp = 0.55;
    const wobblePhase = (seed * 1000 + step * 13.37) % (Math.PI * 2);
    const wobble = Math.sin(wobblePhase) * wobbleAmp;

    const rr = r + wobble;

    const x = 50 + Math.cos(theta) * rr;
    const y = 50 + Math.sin(theta) * rr;

    pts.push({ x, y });
    step++;
  }

  return { pathD: smoothPath(pts) };
}

export default function InkSpiral(props: {
  seed: string;       // deterministic seed string (isoKey|skinId|phrase)
  angles: number[];   // node sequence for the phrase
  progress: number;   // 0..1
  ink: string;
  opacity: number;
}) {
  const { seed, angles, progress, ink, opacity } = props;

  const { pathD } = useMemo(() => {
    return buildSpiralPathFromAngles({
      angles,
      seedStr: seed,
      dir: 1,
      influence: 0.12,
    });
  }, [angles, seed]);

  const clamped = Math.max(0, Math.min(1, progress));

  const pathRef = useRef<SVGPathElement | null>(null);
  const [pathLen, setPathLen] = useState<number>(0);

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    try {
      const len = el.getTotalLength();
      if (Number.isFinite(len) && len > 0) setPathLen(len);
    } catch {}
  }, [pathD]);

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        pointerEvents: "none",
        opacity: clamped <= 0 ? 0 : 1,
        transition: clamped <= 0 ? "opacity 220ms linear" : "none",
      }}
    >
      <div
        style={{
          width: "min(86%, 420px)",
          aspectRatio: "1 / 1",
          display: "grid",
          placeItems: "center",
        }}
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: "visible" }}>
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke={ink}
            strokeWidth={0.9}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              opacity,
              strokeDasharray: pathLen ? pathLen : undefined,
              strokeDashoffset: pathLen ? pathLen * (1 - clamped) : undefined,
              filter: "blur(0.1px)",
            }}
          />
        </svg>
      </div>
    </div>
  );
}