"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Toy = { slug: string; title: string };

const TOY_ORDER: Toy[] = [
  { slug: "text-to-tone", title: "TextToTone" },
  { slug: "key-clock", title: "KeyClock" },
  { slug: "tone-dial", title: "ToneDial" },
  { slug: "shape-of-harmony", title: "Shape of Harmony" },
];

const HINT_KEY = "mt_toy_nav_hint_seen";

function wrap(i: number, len: number) {
  return (i + len) % len;
}

export type ToyNavHeaderProps = {
  currentSlug: string;
  title?: string;
  q?: string;
  onBeforeNavigate?: () => void;
  rightSlot?: React.ReactNode;
  className?: string;
};

export default function ToyNavHeader({
  currentSlug,
  title,
  q,
  onBeforeNavigate,
  rightSlot,
  className,
}: ToyNavHeaderProps) {
  const router = useRouter();

  const [showHint, setShowHint] = useState(false);
  const hideTimer = useRef<number | null>(null);

  const { prevToy, nextToy, resolvedTitle } = useMemo(() => {
    const idx = Math.max(0, TOY_ORDER.findIndex((t) => t.slug === currentSlug));
    const prev = TOY_ORDER[wrap(idx - 1, TOY_ORDER.length)];
    const next = TOY_ORDER[wrap(idx + 1, TOY_ORDER.length)];
    const fallbackTitle = TOY_ORDER[idx]?.title ?? "Toy";
    return { prevToy: prev, nextToy: next, resolvedTitle: title ?? fallbackTitle };
  }, [currentSlug, title]);

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem(HINT_KEY) === "1";
      if (!seen) {
        setShowHint(true);
        hideTimer.current = window.setTimeout(() => setShowHint(false), 2500);
      }
    } catch {}

    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, [currentSlug]);

  const markHintSeenAndHide = () => {
    try {
      sessionStorage.setItem(HINT_KEY, "1");
    } catch {}
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    setShowHint(false);
  };

  const goTo = (toy: Toy) => {
    markHintSeenAndHide();
    try {
      onBeforeNavigate?.();
    } catch {}

    const safeQ = encodeURIComponent(q ?? "");
    router.push(`/toys/${toy.slug}?q=${safeQ}`);
  };

  return (
    <div className={["w-full overflow-hidden", className ?? ""].join(" ")}>
      {/* Stable width container */}
      <div className="mx-auto w-full max-w-3xl px-3 sm:px-4">
        <div className="flex items-center justify-between gap-3 py-3">
          {/* Left */}
          <button
            type="button"
            aria-label={`Previous: ${prevToy.title}`}
            onClick={() => goTo(prevToy)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-sm backdrop-blur transition hover:bg-white/15 active:scale-[0.98]"
          >
            <span className="text-lg leading-none">←</span>
          </button>

          {/* Center */}
          <div className="min-w-0 flex-1 text-center">
            <div className="flex items-baseline justify-center gap-2">
              <div className="min-w-0 truncate text-[22px] font-extrabold leading-tight tracking-[0.2px] text-white sm:text-[26px]">
                {resolvedTitle}
              </div>

              <div
                className={[
                  "hidden select-none text-xs text-white/70 transition-opacity duration-300 sm:block",
                  showHint ? "opacity-100" : "opacity-0",
                ].join(" ")}
              >
                Explore other toys
              </div>
            </div>

            {/* On very small screens show hint on its own line to avoid width jitter */}
            <div
              className={[
                "mt-0.5 select-none text-[11px] text-white/70 transition-opacity duration-300 sm:hidden",
                showHint ? "opacity-100" : "opacity-0",
              ].join(" ")}
            >
              Explore other toys
            </div>
          </div>

          {/* Right */}
          <div className="flex shrink-0 items-center gap-2">
            {rightSlot}
            <button
              type="button"
              aria-label={`Next: ${nextToy.title}`}
              onClick={() => goTo(nextToy)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-sm backdrop-blur transition hover:bg-white/15 active:scale-[0.98]"
            >
              <span className="text-lg leading-none">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}