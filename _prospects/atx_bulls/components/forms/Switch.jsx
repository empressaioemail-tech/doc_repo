import React from "react";

/** INTENTIONAL ADDITION for account settings. Square track, square knob — no pills. */
export function Switch({ checked = false, onChange, label, disabled, style }) {
  return (
    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, minHeight: 44, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1, ...style }}>
      {label && (
        <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--bone)" }}>{label}</span>
      )}
      <span
        onClick={() => !disabled && onChange && onChange(!checked)}
        style={{ position: "relative", width: 48, height: 24, flex: "0 0 auto", background: checked ? "var(--orange)" : "transparent", border: "2px solid " + (checked ? "var(--orange)" : "var(--line)"), transition: "all var(--dur-base) var(--ease)" }}
      >
        <span style={{ position: "absolute", top: 2, left: checked ? 24 : 2, width: 16, height: 16, background: checked ? "var(--ink)" : "var(--muted)", transition: "left var(--dur-base) var(--ease)" }} />
      </span>
    </label>
  );
}
