import React from "react";

export function Eyebrow({ children, tone = "orange", style, ...rest }) {
  const color = tone === "muted" ? "var(--muted)" : tone === "ink" ? "var(--ink)" : "var(--orange)";
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 12, margin: "0 0 24px",
        color, fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 12,
        lineHeight: 1, letterSpacing: "0.2em", textTransform: "uppercase", ...style
      }}
      {...rest}
    >
      <span style={{ display: "block", width: 34, height: 3, background: "currentColor" }} />
      {children}
    </div>
  );
}
