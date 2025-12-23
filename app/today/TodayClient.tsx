"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CaptionLine from "../components/today/CaptionLine";
import InkSpiral from "../components/today/InkSpiral";

import {
  resolveLocalDateParts,
  formatISODateKey,
  formatTodayPhraseEnglish,
} from "@/lib/today/resolveToday";
import { resolveTodaySkin, TODAY_SKINS, type TodaySkinId } from "@/lib/today/skins";

import {
  playTodayKeyClockPhrase,
  primeAudioOutput,
  buildTodayAngles,
} from "@/lib/today/keyclockToday";
import type { ZeroPolicy } from "@/lib/today/keyclockToday";

type Phase = "idle" | "priming" | "playing" | "done";
type AudioGate = "unknown" | "allowed" | "blocked";

const AUTOPLAY_SILENCE_MS = 500;

export default function TodayClient() {
  // Resolve once per session
  const [phraseText, setPhraseText] = useState<string>(""); // e.g. "Tuesday December 23"
  const [isoKey, setIsoKey] = useState<string>("");
  const [skinId, setSkinId] = useState<TodaySkinId>("mon");

  // Playback state
  const [phase, setPhase] = useState<Phase>("idle");
  const [audioGate, setAudioGate] = useState<AudioGate>("unknown");
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  // Spiral
  const [spiralProgress, setSpiralProgress] = useState<number>(0);

  // Fit below site header
  const [chromeTopPx, setChromeTopPx] = useState(0);

  const cancelRef = useRef<boolean>(false);

  const skin = TODAY_SKINS[skinId];

  const autoplayKey = useMemo(() => {
    if (!isoKey) return "";
    return `today:autoplayed:${isoKey}`;
  }, [isoKey]);

  const zeroPolicy: ZeroPolicy = "chromatic"; // LOCKED for Today

  const angles = useMemo(() => {
    if (!phraseText) return [];
    return buildTodayAngles(phraseText, zeroPolicy);
  }, [phraseText]);

  const spiralSeed = useMemo(() => {
    if (!phraseText || !isoKey) return "seed";
    return `${isoKey}|${skinId}|${phraseText}`;
  }, [isoKey, skinId, phraseText]);

  const resetVisualsToNeutral = useCallback(() => {
    setActiveIndex(-1);
    setSpiralProgress(0);
  }, []);

  const endToStillness = useCallback(() => {
    setPhase("done");
    setActiveIndex(-1);

    // dissolve spiral
    const start = performance.now();
    const DISSOLVE_MS = 550;
    const from = 1;

    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / DISSOLVE_MS);
      setSpiralProgress(from * (1 - k));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  const runOnce = useCallback(
    async (mode: "autoplay" | "manual") => {
      if (!phraseText) return;

      cancelRef.current = false;

      setSpiralProgress(0);
      setActiveIndex(-1);

      if (mode === "autoplay") {
        setPhase("priming");
        await new Promise((r) => setTimeout(r, AUTOPLAY_SILENCE_MS));
        if (cancelRef.current) return;
      }

      try {
        setPhase("playing");
        setAudioGate("allowed");

        if (mode === "manual") primeAudioOutput();

        await playTodayKeyClockPhrase({
          rawText: phraseText,
          zeroPolicy,
          onChar: (rawIndex) => {
            if (cancelRef.current) return;
            setActiveIndex(rawIndex);
          },
          onProgress: (p) => {
            if (cancelRef.current) return;
            setSpiralProgress(p);
          },
          onDone: () => {},
          isCancelled: () => cancelRef.current,
        });

        if (cancelRef.current) return;

        if (mode === "autoplay" && autoplayKey) {
          sessionStorage.setItem(autoplayKey, "1");
        }

        endToStillness();
      } catch {
        setAudioGate("blocked");
        setPhase("done");
        resetVisualsToNeutral();
      }
    },
    [phraseText, autoplayKey, endToStillness, resetVisualsToNeutral]
  );

  // Measure header height so Today fits below site chrome
  useEffect(() => {
    const h =
      (document.querySelector("header") as HTMLElement | null)?.offsetHeight ?? 0;
    setChromeTopPx(h);
  }, []);

  // Resolve Today once (local)
  useEffect(() => {
    const parts = resolveLocalDateParts(new Date());
    const phrase = formatTodayPhraseEnglish(parts);
    const iso = formatISODateKey(parts);
    const s = resolveTodaySkin(parts);

    setPhraseText(phrase);
    setIsoKey(iso);
    setSkinId(s);
  }, []);

  // Autoplay once per day (per sessionStorage)
  useEffect(() => {
    if (!phraseText || !autoplayKey) return;

    if (sessionStorage.getItem(autoplayKey) === "1") {
      setPhase("done");
      return;
    }

    runOnce("autoplay").catch(() => {
      setAudioGate("blocked");
      setPhase("done");
      resetVisualsToNeutral();
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phraseText, autoplayKey]);

  // Backgrounding: stop and become still
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "hidden") {
        cancelRef.current = true;
        setPhase("done");
        resetVisualsToNeutral();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [resetVisualsToNeutral]);

  const showPlayAgain = phase !== "priming";

  return (
    <div style={{ background: skin.bg, color: skin.text }}>
      <div
        style={{
          height: `calc(100svh - ${chromeTopPx}px)`,
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          padding: "18px 16px",
          paddingBottom: "max(18px, env(safe-area-inset-bottom))",
          overflow: "hidden",
        }}
      >
        {/* Top: big phrase */}
        <div style={{ paddingTop: "max(10px, env(safe-area-inset-top))" }}>
          <div
            style={{
              fontSize: 18,
              lineHeight: 1.2,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              opacity: 0.65,
            }}
          >
            {phraseText ? phraseText.split(" ")[0] : " "}
          </div>

          <div
            style={{
              marginTop: 4,
              fontSize: 40,
              lineHeight: 1.08,
              fontWeight: 560,
              letterSpacing: "-0.02em",
              opacity: 0.95,
            }}
          >
            {phraseText ? phraseText.split(" ").slice(1).join(" ") : " "}
          </div>
        </div>

        {/* Middle: spiral gesture */}
        <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
          <InkSpiral
            seed={spiralSeed}
            angles={angles}
            progress={spiralProgress}
            ink={skin.ink}
            opacity={0.26}
          />
        </div>

        {/* Bottom: caption proof + control */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <CaptionLine
            text={phraseText}
            activeIndex={activeIndex}
            baseColor={skin.captionBase}
            highlightColor={skin.highlight}
          />

          {showPlayAgain && (
            <button
              type="button"
              onClick={() => runOnce("manual")}
              style={{
                alignSelf: "flex-start",
                background: "transparent",
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 999,
                padding: "10px 14px",
                fontSize: 14,
                letterSpacing: "0.01em",
                color: skin.text,
                opacity: audioGate === "blocked" ? 0.92 : 0.75,
              }}
              aria-label="Play again"
            >
              Play again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}