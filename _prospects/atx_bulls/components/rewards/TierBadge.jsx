import React from "react";

export const TIERS = {
  rookie:  { label: "Rookie",  color: "var(--muted)" },
  starter: { label: "Starter", color: "var(--burnt)" },
  captain: { label: "Captain", color: "var(--orange)" },
  legend:  { label: "Legend",  color: "var(--bone)" }
};

/** Tier chevrons: 1–4 stacked bars, no metals, no medals. */
export function TierBadge({ tier = "rookie", size = "md", showLabel = true, style }) {
  const order = ["rookie", "starter", "captain", "legend"];
  const level = Math.max(1, order.indexOf(tier) + 1);
  const t = TIERS[tier] || TIERS.rookie;
  const s = size === "lg" ? { w: 26, h: 5, gap: 3, fs: 13 } : size === "sm" ? { w: 14, h: 3, gap: 2, fs: 10 } : { w: 20, h: 4, gap: 2, fs: 11 };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10, ...style }}>
      <span style={{ display: "inline-flex", flexDirection: "column", gap: s.gap }}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} style={{ width: s.w - i * 2, height: s.h, background: i < level ? t.color : "var(--line)" }} />
        ))}
      </span>
      {showLabel && (
        <span style={{ fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: s.fs, letterSpacing: "0.18em", textTransform: "uppercase", color: t.color }}>{t.label}</span>
      )}
    </span>
  );
}
