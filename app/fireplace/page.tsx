"use client";

import React, { useMemo, useState } from "react";
import FireplaceCanvas from "./FireplaceCanvas";
import { IRRATIONALS, type IrrationalId } from "./irrationals";

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
      {/* Keep your header offset here (top-16) */}
      <div className="absolute left-0 right-0 top-16 bottom-0 overflow-hidden">
        

        <FireplaceCanvas
          started={started}
          soundOn={soundOn}
          irrational={selected}
        />

        {!started && (
          <div className="absolute inset-0 z-50 flex items-center justify-center px-6">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/55 p-4 backdrop-blur">
              <div className="mb-3 text-sm text-white/80">
                Choose an irrational
              </div>

              <div className="grid grid-cols-2 gap-2">
                {IRRATIONALS.map((x) => {
                  const active = x.id === selectedId;
                  return (
                    <button
                      key={x.id}
                      onClick={() => setSelectedId(x.id)}
                      className={[
                        "rounded-xl border px-3 py-3 text-left",
                        active
                          ? "border-white/30 bg-white/10 text-white"
                          : "border-white/10 bg-white/5 text-white/85 hover:bg-white/10",
                      ].join(" ")}
                    >
                      <div className="text-lg">{x.label}</div>
                      <div className="text-xs text-white/55">
                        {x.id === "pi"
                          ? "Pi"
                          : x.id === "sqrt2"
                          ? "Root 2"
                          : x.id === "phi"
                          ? "Phi"
                          : "Euler"}
                      </div>
                    </button>
                  );
                })}
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
                className="mt-4 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white hover:bg-white/15"
              >
                ▶ Play (10 minutes)
              </button>

              <div className="mt-2 text-xs text-white/45">
                After play starts, controls disappear.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}