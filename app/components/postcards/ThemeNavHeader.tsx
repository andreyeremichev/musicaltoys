"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const THEME_ORDER = ["date-we-met", "birthday", "wedding", "new-year", "xmas"] as const;
export type ThemeSlug = (typeof THEME_ORDER)[number];

export default function ThemeNavHeader({
  theme,
  title,
  subtitle,
  typed,
  onBeforeNavigate,
}: {
  theme: ThemeSlug;
  title: string;
  subtitle: string;
  typed: string;
  onBeforeNavigate?: () => void;
}) {
  const router = useRouter();

  const { prevTheme, nextTheme } = useMemo(() => {
    const idx = THEME_ORDER.indexOf(theme);
    const prev = THEME_ORDER[(idx - 1 + THEME_ORDER.length) % THEME_ORDER.length];
    const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
    return { prevTheme: prev, nextTheme: next };
  }, [theme]);

  const [showThemeHint, setShowThemeHint] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const k = "mt_postcard_theme_hint_seen";
    if (sessionStorage.getItem(k) === "1") return;

    setShowThemeHint(true);
    const t = window.setTimeout(() => setShowThemeHint(false), 2500);
    return () => window.clearTimeout(t);
  }, []);

  const goToTheme = useCallback(
    (slug: ThemeSlug) => {
      try {
        sessionStorage.setItem("mt_postcard_theme_hint_seen", "1");
      } catch {}
      setShowThemeHint(false);

      try {
        onBeforeNavigate?.();
      } catch {}

      const q = encodeURIComponent(typed || "");
      router.push(`/cards/postcard/${slug}?q=${q}`);
    },
    [router, typed, onBeforeNavigate]
  );

  return (
    <header style={{ textAlign: "center", paddingTop: 2 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "42px 1fr 42px",
          alignItems: "center",
          gap: 10,
        }}
      >
        <button
          type="button"
          onClick={() => goToTheme(prevTheme)}
          aria-label="Previous theme"
          title="Previous theme"
          style={{
            width: 42,
            height: 42,
            borderRadius: 999,
            border: "1px solid #1E2935",
            background: "transparent",
            color: "rgba(230,235,242,0.9)",
            fontWeight: 900,
            fontSize: 18,
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
          }}
        >
          ←
        </button>

        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontSize: 17, fontWeight: 950, letterSpacing: "0.01em" }}>
            {title}
          </div>

          {showThemeHint ? (
            <div style={{ fontSize: 11, opacity: 0.62, marginTop: 3 }}>
              Explore other postcard themes
            </div>
          ) : (
            <div style={{ fontSize: 12, opacity: 0.72, marginTop: 3 }}>
              {subtitle}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => goToTheme(nextTheme)}
          aria-label="Next theme"
          title="Next theme"
          style={{
            width: 42,
            height: 42,
            borderRadius: 999,
            border: "1px solid #1E2935",
            background: "transparent",
            color: "rgba(230,235,242,0.9)",
            fontWeight: 900,
            fontSize: 18,
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
          }}
        >
          →
        </button>
      </div>
    </header>
  );
}