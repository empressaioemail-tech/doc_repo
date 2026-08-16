import React from "react";
import { Icon } from "../core/Icon.jsx";

/** INTENTIONAL ADDITION for account surfaces; the live site has no checkbox. */
export function Checkbox({ checked = false, onChange, label, disabled, style }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 12, minHeight: 44, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1, ...style }}>
      <span
        onClick={() => !disabled && onChange && onChange(!checked)}
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 22, height: 22, flex: "0 0 auto", borderRadius: 0,
          background: checked ? "var(--orange)" : "transparent",
          border: "2px solid " + (checked ? "var(--orange)" : "var(--line)"),
          color: "var(--ink)", transition: "all var(--dur-base) var(--ease)"
        }}
      >
        {checked && <Icon name="check" size={14} strokeWidth={3.5} />}
      </span>
      {label && (
        <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--bone)" }}>{label}</span>
      )}
    </label>
  );
}
