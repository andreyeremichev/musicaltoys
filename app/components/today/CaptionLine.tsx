// components/today/CaptionLine.tsx
import React from "react";

export default function CaptionLine(props: {
  text: string;
  activeIndex: number; // -1 = neutral
  baseColor: string;
  highlightColor: string;
}) {
  const { text, activeIndex, baseColor, highlightColor } = props;
  const chars = [...(text || "")];

  return (
    <div
      aria-label="Today caption"
      style={{
        fontSize: 15,
        lineHeight: 1.3,
        letterSpacing: "0.02em",
        color: baseColor,
        userSelect: "none",
        whiteSpace: "pre-wrap",
      }}
    >
      {chars.map((ch, i) => {
        const isOn = i === activeIndex;
        return (
          <span
            key={`${i}-${ch}`}
            style={{
              color: isOn ? highlightColor : baseColor,
              fontWeight: isOn ? 650 : 450,
              textShadow: isOn ? `0 0 10px ${highlightColor}` : "none",
              transition: "color 140ms linear, text-shadow 140ms linear, font-weight 140ms linear",
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
}