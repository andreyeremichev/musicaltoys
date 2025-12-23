// lib/today/keyclockToday.ts
/* =========================================================
   Today KeyClock runner (WebAudio, no Tone.js)
   - Input: e.g. "January 28"
   - Output: schedules a short phrase + calls onChar(rawIndex) on each audible step
========================================================= */

const NOTE_ORDER = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;
type NoteName = `${(typeof NOTE_ORDER)[number]}${number}`;

let _ctx: AudioContext | null = null;
const _buffers = new Map<string, AudioBuffer>();

function getCtx() {
  if (!_ctx) {
    const AC: any = (window as any).AudioContext || (window as any).webkitAudioContext;
    _ctx = new AC({ latencyHint: "interactive" });
  }
  return _ctx!;
}

export async function unlockCtxStrict(): Promise<void> {
  const c = getCtx();
  if (c.state === "suspended") {
    try {
      await c.resume();
    } catch {}
  }
  // Strict: if still suspended, treat as blocked
  if (c.state === "suspended") throw new Error("autoplay blocked");
}

export function primeAudioOutput() {
  try {
    const ac = getCtx();
    const o = ac.createOscillator();
    const g = ac.createGain();
    g.gain.value = 0.0001; // practically silent
    o.frequency.value = 440;
    o.connect(g);
    g.connect(ac.destination);
    const t = ac.currentTime;
    o.start(t);
    o.stop(t + 0.02);
  } catch {}
}

export function estimateTodayPhraseMs(rawText: string, zeroPolicy: ZeroPolicy): number {
  const tokens = tokenizeKeyClock(rawText, zeroPolicy);
  const schedule = buildSchedule(tokens, zeroPolicy);
  const ms = schedule.reduce((sum, s) => sum + (s?.dur ?? 0), 0);
  // small tail so visuals don’t cut before last release
  return ms + 180;
}

function midiToNoteName(midi: number): NoteName {
  const pc = NOTE_ORDER[midi % 12];
  const oct = Math.floor(midi / 12) - 1;
  return `${pc}${oct}` as NoteName;
}
async function preloadNotesForToday(rawText: string, zeroPolicy: ZeroPolicy): Promise<void> {
  const key: KeyName = "BbMajor";
  const tokens = tokenizeKeyClock(rawText, zeroPolicy);
  const schedule = buildSchedule(tokens, zeroPolicy);

  const noteSet = new Set<string>();

  for (const s of schedule) {
    const tok = s?.tok;
    if (!tok) continue;

    if (tok.kind === "rest" || tok.kind === "intro" || tok.kind === "resolve" || tok.kind === "toggle") continue;

    if (tok.kind === "deg") {
      const isLetter = !!(tok as any).srcChar;

      // letter-deg schedules single notes (or 2 notes for 8/9)
      if (isLetter) {
        if (tok.up && tok.src === "8") {
          noteSet.add(midiToNoteName(degreeToMidi("1", key, false)));
          noteSet.add(midiToNoteName(degreeToMidi("1", key, true)));
        } else if (tok.up && tok.src === "9") {
          noteSet.add(midiToNoteName(degreeToMidi("1", key, false)));
          noteSet.add(midiToNoteName(degreeToMidi("2", key, true)));
        } else {
          noteSet.add(midiToNoteName(degreeToMidi(tok.d, key, tok.up)));
        }
        continue;
      }

      // digit-deg schedules triads / inversions
      if ("1234567".includes(tok.src)) {
        const wrap = (n: number) => (["1", "2", "3", "4", "5", "6", "7"][(n - 1 + 7) % 7] as Diatonic);
        const r = Number(tok.d);
        const ds: Diatonic[] = [wrap(r), wrap(r + 2), wrap(r + 4)];
        ds.forEach((d) => noteSet.add(midiToNoteName(degreeToMidi(d, key, false))));
      } else if (tok.src === "8") {
        noteSet.add(midiToNoteName(degreeToMidi("3", key, false)));
        noteSet.add(midiToNoteName(degreeToMidi("5", key, false)));
        noteSet.add(midiToNoteName(degreeToMidi("1", key, true)));
      } else if (tok.src === "9") {
        noteSet.add(midiToNoteName(degreeToMidi("6", key, false)));
        noteSet.add(midiToNoteName(degreeToMidi("2", key, true)));
        noteSet.add(midiToNoteName(degreeToMidi("4", key, true)));
      }
    } else if (tok.kind === "chroma") {
      const pcOff = degreeToPcOffset(tok.c, key);
      const midi = snapPcToComfortableMidi(pcOff, key);
      noteSet.add(midiToNoteName(midi));
    }
  }

  await Promise.all([...noteSet].map((n) => loadBuffer(n)));
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

function playBufferWithEnv(
  ac: AudioContext,
  at: number,
  noteName: string,
  env: "normal" | "tick",
  gainMax = 1,
  dur = 0.22
) {
  loadBuffer(noteName)
    .then((buf) => {
      const src = ac.createBufferSource();
      src.buffer = buf;
      const g = ac.createGain();

      // If buffer loads late, never schedule in the past
      const when = Math.max(at, ac.currentTime + 0.01);

      if (env === "tick") {
        g.gain.setValueAtTime(0, when);
        g.gain.linearRampToValueAtTime(0.42 * gainMax, when + 0.006);
        g.gain.setTargetAtTime(0, when + 0.05, 0.05);
        src.connect(g).connect(ac.destination);
        try {
          src.start(when);
          src.stop(when + 0.1);
        } catch {}
      } else {
        g.gain.setValueAtTime(0, when);
        g.gain.linearRampToValueAtTime(1 * gainMax, when + 0.01);
        g.gain.setTargetAtTime(0, when + 0.18, 0.06);
        src.connect(g).connect(ac.destination);
        try {
          src.start(when);
          src.stop(when + dur);
        } catch {}
      }
    })
    .catch(() => {});
}

/* =========================================================
   KeyClock mapping (copied from your postcard, minimized)
========================================================= */
type KeyName = "BbMajor";
const KEY_TONIC_PC: Record<KeyName, number> = { BbMajor: 10 };
const MAJOR_DEG = { "1": 0, "2": 2, "3": 4, "4": 5, "5": 7, "6": 9, "7": 11 } as const;

type Diatonic = "1" | "2" | "3" | "4" | "5" | "6" | "7";
type Chromatic = "♭2" | "♯4";

function degreeToPcOffset(deg: Diatonic | Chromatic, key: KeyName): number {
  const base = MAJOR_DEG;
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
  }
}

function degreeToMidi(d: Diatonic, key: KeyName, up?: boolean): number {
  const tonic = KEY_TONIC_PC[key];
  const off = degreeToPcOffset(d, key);
  const pc = (tonic + off) % 12;

  // Keep it in a comfortable mid register (C4-ish)
  const base = (up ? 5 : 4) * 12;
  for (let m = base - 12; m <= base + 12; m++) {
    if (m >= 36 && m <= 84 && m % 12 === pc) return m;
  }
  return base + pc;
}

function snapPcToComfortableMidi(pcOffset: number, key: KeyName): number {
  const tonic = KEY_TONIC_PC[key];
  const pc = (tonic + pcOffset) % 12;
  const base = 4 * 12;
  for (let m = base - 12; m <= base + 12; m++) {
    if (m >= 36 && m <= 84 && m % 12 === pc) return m;
  }
  return 60 + pc;
}

/* =========================================================
   Tokenizer (your KeyClock rules, minimized for Today)
========================================================= */
function sanitizeInput(s: string): string {
  return (s || "").replace(/[^0-9A-Za-z\+\#\*\- ,]/g, "").toUpperCase();
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

export type ZeroPolicy = "chromatic" | "ticks" | "rest";

export type Token =
  | { kind: "rest"; char: "-" }
  | { kind: "deg"; d: Diatonic; up?: boolean; src: string; srcChar?: string }
  | { kind: "chroma"; c: Chromatic; src: "0"; srcChar?: string }
  | { kind: "intro" }
  | { kind: "resolve" }
  | { kind: "toggle" };

const zeroFlipRef = { current: true };

// ---- Node geometry (12 spokes) ----
export function nodeAngleRad(i: number): number {
  return (i / 12) * Math.PI * 2 - Math.PI / 2;
}

// Same DEGREE_ORDER as postcards (stable identity)
const DEGREE_ORDER = ["1", "5", "2", "6", "3", "7", "♯4", "♭2", "♭6", "♭3", "♭7", "4"] as const;
type DegLabel = (typeof DEGREE_ORDER)[number];

// For Today in BbMajor, map token -> spoke index
function tokenToSpokeIndex(tok: Token): number {
  if (tok.kind === "deg") {
    const lab = tok.d as unknown as DegLabel; // "1".."7"
    return DEGREE_ORDER.indexOf(lab);
  }
  if (tok.kind === "chroma") {
    const lab = tok.c as unknown as DegLabel; // "♭2" | "♯4"
    return DEGREE_ORDER.indexOf(lab);
  }
  return -1;
}

/**
 * Angles for spiral gesture (LOCKED):
 * derived from the same phrase + tokenizer that drives audio.
 * Includes only playable tokens (deg/chroma), in order.
 */
export function buildTodayAngles(rawText: string, zeroPolicy: ZeroPolicy): number[] {
  const tokens = tokenizeKeyClock(rawText, zeroPolicy);
  const schedule = buildSchedule(tokens, zeroPolicy);
  const angles: number[] = [];

  for (const s of schedule) {
    const tok = s?.tok;
    if (!tok) continue;
    if (tok.kind !== "deg" && tok.kind !== "chroma") continue;

    const spoke = tokenToSpokeIndex(tok);
    if (spoke >= 0) angles.push(nodeAngleRad(spoke));
  }
  return angles;
}

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

export function tokenizeKeyClock(raw: string, zeroPolicy: ZeroPolicy): Token[] {
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
    if (ch === "," || ch === " " || ch === "-" || ch === ":") {
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

/* =========================================================
   Scheduling (Today-short)
========================================================= */
const STEP_MS = 260; // Today is shorter than postcards

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
    // keep it steady and calm in Today — no special digit-run stretching
    out[i] = { tok: tokens[i], dur: STEP_MS };
    i++;
  }

  return out;
}

function scheduleNoteLive(ac: AudioContext, at: number, d: Diatonic, key: KeyName, up?: boolean) {
  const midi = degreeToMidi(d, key, up);
  const name = midiToNoteName(midi);
  playBufferWithEnv(ac, at, name, "normal", 0.9, 0.22);
}

function scheduleTriad(ac: AudioContext, at: number, root: Diatonic, key: KeyName) {
  const wrap = (n: number) => (["1", "2", "3", "4", "5", "6", "7"][(n - 1 + 7) % 7] as Diatonic);
  const r = Number(root);
  const ds: Diatonic[] = [wrap(r), wrap(r + 2), wrap(r + 4)];
  ds.forEach((d) => scheduleNoteLive(ac, at, d, key, false));
}

function scheduleFirstInvTonic(ac: AudioContext, at: number, key: KeyName) {
  scheduleNoteLive(ac, at, "3", key, false);
  scheduleNoteLive(ac, at, "5", key, false);
  scheduleNoteLive(ac, at, "1", key, true);
}

function scheduleSecondInvSupertonic(ac: AudioContext, at: number, key: KeyName) {
  scheduleNoteLive(ac, at, "6", key, false);
  scheduleNoteLive(ac, at, "2", key, true);
  scheduleNoteLive(ac, at, "4", key, true);
}

function scheduleChromaLive(ac: AudioContext, at: number, tok: Extract<Token, { kind: "chroma" }>, key: KeyName, zeroPolicy: ZeroPolicy) {
  const pcOff = degreeToPcOffset(tok.c, key);
  const midi = snapPcToComfortableMidi(pcOff, key);
  const name = midiToNoteName(midi);

  const isZeroChroma = (tok as any).src === "0";
  const useTickEnv = isZeroChroma && zeroPolicy === "ticks";
  playBufferWithEnv(ac, at, name, useTickEnv ? "tick" : "normal", 0.85, 0.16);
}

function scheduleLetterDeg(ac: AudioContext, at: number, tok: Extract<Token, { kind: "deg" }>, key: KeyName) {
  // KeyClock letter-derived behavior (8/9)
  if (tok.up && tok.src === "8") {
    scheduleNoteLive(ac, at, "1", key, false);
    scheduleNoteLive(ac, at, "1", key, true);
    return;
  }
  if (tok.up && tok.src === "9") {
    scheduleNoteLive(ac, at, "1", key, false);
    scheduleNoteLive(ac, at, "2", key, true);
    return;
  }
  scheduleNoteLive(ac, at, tok.d, key, tok.up);
}

/* =========================================================
   Token index -> source char index (your helper, unchanged)
========================================================= */
export function buildTokenCharMap(src: string, tokens: Token[], zeroPolicy: ZeroPolicy): number[] {
  const map = new Array(tokens.length).fill(-1);
  let ti = 0;
  const s = (src || "").toUpperCase();

  for (let ci = 0; ci < s.length && ti < tokens.length; ci++) {
    const ch = s[ci];

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

/* =========================================================
   Public: play Today phrase
========================================================= */
export async function playTodayKeyClockPhrase(opts: {
  rawText: string;
  zeroPolicy: ZeroPolicy;
  onChar: (rawIndex: number) => void;
  onProgress?: (p: number) => void; // 0..1 (drives spiral)
  onDone: () => void;
  isCancelled: () => boolean;
}): Promise<void> {
  const { rawText, zeroPolicy, onChar, onProgress, onDone, isCancelled } = opts;

  // Autoplay attempt: this may throw if blocked
await unlockCtxStrict();
const ac = getCtx();

// ✅ preload to prevent late scheduling drift (fixes “spiral ends early”)
await preloadNotesForToday(rawText, zeroPolicy);

const key: KeyName = "BbMajor";
const tokens = tokenizeKeyClock(rawText, zeroPolicy);
  const schedule = buildSchedule(tokens, zeroPolicy);
  const tokenCharMap = buildTokenCharMap(rawText, tokens, zeroPolicy);

  // precompute cumulative ms
  const dursMs = schedule.map((s) => s.dur);
  const cum: number[] = new Array(schedule.length + 1);
  cum[0] = 0;
  for (let i = 0; i < schedule.length; i++) cum[i + 1] = cum[i] + dursMs[i];
  const totalMs = cum[schedule.length];

  // Anchor
  const t0 = ac.currentTime + 0.12;

  // Schedule audio (single pass, no intro, no resolve)
  for (let i = 0; i < schedule.length; i++) {
    const tok = schedule[i]?.tok;
    if (!tok) continue;

    const at = t0 + cum[i] / 1000;

    if (tok.kind === "toggle" || tok.kind === "intro" || tok.kind === "resolve") continue;
    if (tok.kind === "rest") continue;

    const isLetter = !!(tok as any).srcChar;

    if (tok.kind === "deg") {
      if (isLetter) {
        scheduleLetterDeg(ac, at, tok, key);
      } else {
        if ("1234567".includes(tok.src)) scheduleTriad(ac, at, tok.d, key);
        else if (tok.src === "8") scheduleFirstInvTonic(ac, at, key);
        else if (tok.src === "9") scheduleSecondInvSupertonic(ac, at, key);
      }
    } else if (tok.kind === "chroma") {
      scheduleChromaLive(ac, at, tok, key, zeroPolicy);
    }
  }

  // Visual loop synced to AudioContext time (highlights only on playable steps)
  return await new Promise<void>((resolve) => {
    let stepIndex = 0;
    let raf = 0;

    const loop = () => {
      if (isCancelled()) {
        if (raf) cancelAnimationFrame(raf);
        resolve();
        return;
      }

      const now = ac.currentTime;
const elapsedMs = (now - t0) * 1000;
const clamped = Math.max(0, elapsedMs);

// ✅ drive spiral from audio clock (never from performance.now)
if (onProgress) {
  const p = totalMs > 0 ? Math.max(0, Math.min(1, clamped / totalMs)) : 0;
  onProgress(p);
}

      // find current step index by cum
      let idx = 0;
      while (idx + 1 < cum.length && cum[idx + 1] <= clamped) idx++;

      while (stepIndex <= idx) {
        const tok = schedule[stepIndex]?.tok;

        // highlight only when sound would happen
        if (tok && (tok.kind === "deg" || tok.kind === "chroma")) {
          const charIdx = tokenCharMap[stepIndex] ?? -1;
          if (charIdx >= 0) onChar(charIdx);
        }

        stepIndex++;
      }

      if (clamped >= totalMs + 120) {
  // ✅ ensure final frame hits 1
  onProgress?.(1);
        if (raf) cancelAnimationFrame(raf);
        onDone();
        resolve();
        return;
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
  });
}