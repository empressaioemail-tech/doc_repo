import React, { useState } from "react";

/** Two shapes only: 2px bordered field (on ink or orange) and underline-only. */
export function Input({ label, hint, error, variant = "bordered", tone = "bone", full = true, style, ...rest }) {
  const [focus, setFocus] = useState(false);
  const ink = tone === "ink";
  const edge = error ? "var(--burnt)" : focus ? "var(--orange)" : ink ? "var(--ink)" : "var(--line)";
  const underline = variant === "underline";
  return (
    <label style={{ display: full ? "block" : "inline-block", width: full ? "100%" : undefined }}>
      {label && (
        <span style={{ display: "block", marginBottom: 8, fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: ink ? "var(--ink)" : "var(--muted)" }}>{label}</span>
      )}
      <input
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: "100%", height: underline ? 44 : 58,
          padding: underline ? "0 0 10px" : "0 16px",
          background: underline ? "transparent" : ink ? "#ffffff21" : "var(--panel)",
          border: underline ? "none" : "2px solid " + edge,
          borderBottom: underline ? "3px solid " + (ink ? "var(--ink)" : edge) : undefined,
          borderRadius: 0, outline: "none",
          fontFamily: "var(--font-ui)", fontWeight: 900,
          fontSize: underline ? 24 : 20, letterSpacing: "0.04em", textTransform: "uppercase",
          color: ink ? "var(--ink)" : "var(--bone)",
          transition: "border-color var(--dur-base) var(--ease)",
          ...style
        }}
        {...rest}
      />
      {(hint || error) && (
        <span style={{ display: "block", marginTop: 8, fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: error ? "var(--burnt)" : ink ? "var(--ink)" : "var(--muted)" }}>{error || hint}</span>
      )}
    </label>
  );
}
