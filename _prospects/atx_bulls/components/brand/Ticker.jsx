import React from "react";

export function Ticker({ items, separator = "×", speed = 22, style }) {
  const run = items && items.length ? items : ["HORNS UP", "HARD HITS", "HEART OF TEXAS"];
  const strip = [...run, ...run, ...run, ...run, ...run, ...run];
  return (
    <div style={{ overflow: "hidden", height: "var(--ticker-h)", display: "flex", alignItems: "center", background: "var(--orange)", ...style }}>
      <style>{"@keyframes atxTicker{from{transform:translateX(0)}to{transform:translateX(-50%)}}@media (prefers-reduced-motion:reduce){.atx-ticker__run{animation:none!important}}"}</style>
      <div className="atx-ticker__run" style={{ display: "flex", alignItems: "center", gap: 18, width: "max-content", animation: "atxTicker " + speed + "s linear infinite" }}>
        {strip.map((t, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 18, fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 19, letterSpacing: "0.11em", textTransform: "uppercase", color: "var(--ink)", whiteSpace: "nowrap" }}>
            {t}
            <span style={{ fontSize: 24, lineHeight: 1 }}>{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
