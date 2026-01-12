"use client";

import React, { useMemo, useState } from "react";
import FireplaceCanvas from "./FireplaceCanvas";
import { IRRATIONALS, type IrrationalId } from "./irrationals";

function displayName(id: IrrationalId) {
  switch (id) {
    case "pi":
      return "π · The Circle";
    case "e":
      return "e · The Growth";
    case "sqrt2":
      return "√2 · The Balance";
    case "phi":
      return "φ · The Harmony";
    default:
      return "";
  }
}

function displayLine(id: IrrationalId) {
  switch (id) {
    case "pi":
      return "Endless, steady, returning.";
    case "e":
      return "Living, evolving, always unfolding.";
    case "sqrt2":
      return "Precise, tense, quietly restless.";
    case "phi":
      return "Natural, flowing, quietly ordered.";
    default:
      return "";
  }
}

function shortIdLabel(id: IrrationalId) {
  switch (id) {
    case "pi":
      return "The Circle";
    case "e":
      return "The Growth";
    case "sqrt2":
      return "The Balance";
    case "phi":
      return "The Harmony";
    default:
      return "";
  }
}

function pickedNote(id: IrrationalId) {
  switch (id) {
    case "pi":
      return "A steady ritual fire — cycles without repeating.";
    case "e":
      return "A fire with forward motion — like growth in nature.";
    case "sqrt2":
      return "A fire with gentle tension — precise, a little restless.";
    case "phi":
      return "A fire shaped by natural proportion — quiet harmony.";
    default:
      return "";
  }
}

export default function IrrationalFireplacePage() {
  const [selectedId, setSelectedId] = useState<IrrationalId>("pi");
  const [started, setStarted] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  const selected = useMemo(
    () => IRRATIONALS.find((x) => x.id === selectedId) ?? IRRATIONALS[0],
    [selectedId]
  );

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Header offset */}
      <div className="absolute left-0 right-0 top-16 bottom-0 overflow-hidden">
        {/* Only render the fireplace (and its border) AFTER Play */}
        {started && (
          <FireplaceCanvas started={started} soundOn={soundOn} irrational={selected} />
        )}

        {!started && (
          <div className="absolute inset-0 z-50 flex items-center justify-center px-6">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/55 p-4 backdrop-blur">
              <div className="mb-1 text-sm text-white/85">
                Four Fires. Different numbers. Different moods. Same calm.
              </div>
              <div className="mb-4 text-xs text-white/55">Choose a fire to begin. Then tap Play.</div>

              <div className="grid grid-cols-2 gap-2">
                {IRRATIONALS.map((x) => {
                  const active = x.id === selectedId;
                  return (
                    <button
                      key={x.id}
                      onClick={() => setSelectedId(x.id)}
                      className={[
                        "rounded-xl border px-3 py-3 text-left transition",
                        active
  ? "border-amber-400/40 bg-white/10 text-white"
  : "border-white/10 bg-white/5 text-white/85 hover:bg-white/10"
                      ].join(" ")}
                    >
                      <div className="text-lg leading-none">{x.label}</div>
                      <div className="mt-1 text-xs text-white/70">{shortIdLabel(x.id)}</div>
                      <div className="mt-1 text-[11px] leading-snug text-white/45">
                        {displayLine(x.id)}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 px-1">
  <div className="text-sm text-white/85">{displayName(selectedId)}</div>
  <div className="mt-1 text-xs text-white/55">{pickedNote(selectedId)}</div>
</div>

              <button
                onClick={() => {
                  // Prime audio in the gesture handler (Safari-friendly)
                  try {
                    const a = new Audio("/audio/notes/C4.wav");
                    a.volume = 0.001;
                    a.play()
                      .then(() => {
                        a.pause();
                        a.currentTime = 0;
                      })
                      .catch(() => {});
                  } catch {}

                  setSoundOn(true);
                  setStarted(true);
                }}
                className="mt-4 w-full rounded-xl border border-amber-400/40
           bg-gradient-to-b from-amber-500/80 to-amber-600/80
           px-4 py-3 text-white
           shadow-[0_0_24px_rgba(245,158,11,0.35)]
           hover:from-amber-500 hover:to-amber-600
           active:scale-[0.99] transition"
              >
                ▶ Play (10 minutes)
              </button>

              <div className="mt-2 text-xs text-white/45">
                After play starts, the room goes quiet.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}