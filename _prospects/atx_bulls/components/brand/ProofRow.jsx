import React from "react";

export function ProofRow({ items = [], tone = "muted", style }) {
  const color = tone === "ink" ? "var(--ink)" : "var(--muted)";
  const rule = tone === "ink" ? "var(--ink-hairline)" : "var(--line)";
  return (
    <div style={{ display: "flex", flexWrap: "wrap", borderTop: "1px solid " + rule, ...style }}>
      {items.map((t, i) => (
        <span
          key={t}
          style={{
            padding: "16px 22px 16px 0", marginRight: 22,
            borderRight: i === items.length - 1 ? "none" : "1px solid " + rule,
            fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 10,
            letterSpacing: "0.17em", textTransform: "uppercase", color
          }}
        >
          {t}
        </span>
      ))}
    </div>
  );
}
