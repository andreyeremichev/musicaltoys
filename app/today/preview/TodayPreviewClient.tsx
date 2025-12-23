"use client";

import React, { useMemo } from "react";
import InkSpiral from "../../components/today/InkSpiral";
import { resolveTodaySkin, TODAY_SKINS } from "@/lib/today/skins";
import { formatISODateKey } from "@/lib/today/resolveToday";

function partsFromDate(d: Date) {
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    weekday: d.getDay(),
  };
}

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat(undefined, { month: "long", day: "numeric" }).format(d);
}
function fmtWeekday(d: Date) {
  return new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(d);
}

// deterministic tiny hash -> int
function hashInt(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) || 1;
}

export default function TodayPreviewClient() {
  const dates = useMemo(() => {
    // Dec 23 → Jan 1 (inclusive): 10 days
    const start = new Date(2025, 11, 23); // month is 0-based, 11=Dec
    const out: Date[] = [];
    for (let i = 0; i < 10; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      out.push(d);
    }
    return out;
  }, []);

  return (
    <main style={{ background: "#0B0F14", minHeight: "100svh", padding: 16, color: "rgba(255,255,255,0.9)" }}>
      <div style={{ maxWidth: 920, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontSize: 14, opacity: 0.7 }}>
          Today skins preview (Dec 23 → Jan 1). Dev-only.
        </div>

        {dates.map((d) => {
          const parts = partsFromDate(d);
          const skinId = resolveTodaySkin(parts);
          const skin = TODAY_SKINS[skinId];
          const iso = formatISODateKey(parts);

          // ✅ deterministic spiral seed per day + skin
          const seed = hashInt(`${iso}|${skinId}`);

          return (
            <div
              key={iso}
              style={{
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.10)",
                background: skin.bg,
              }}
            >
              <div style={{ padding: 14, display: "grid", gridTemplateColumns: "1fr 260px", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em" }}>{fmtDate(d)}</div>
                  <div style={{ marginTop: 4, fontSize: 14, opacity: 0.65 }}>{fmtWeekday(d)}</div>
                  <div style={{ marginTop: 10, fontSize: 12, opacity: 0.6 }}>
                    iso: {iso} · skin: {skinId}
                  </div>
                </div>

                <div style={{ position: "relative", height: 190, display: "grid", placeItems: "center" }}>
                  <InkSpiral runId={seed} progress={1} ink={skin.ink} opacity={0.25} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}