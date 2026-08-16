import React from "react";

export function ProgressBar({ value = 0, max = 100, height = 8, label, caption, style }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ width: "100%", ...style }}>
      {(label || caption) && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <span style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>{label}</span>
          <span style={{ fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 12, letterSpacing: "0.1em", color: "var(--bone)" }}>{caption}</span>
        </div>
      )}
      <div style={{ height, background: "var(--panel)", border: "1px solid var(--line)" }}>
        <div style={{ width: pct + "%", height: "100%", background: "var(--orange)", transition: "width var(--dur-slow) var(--ease)" }} />
      </div>
    </div>
  );
}
