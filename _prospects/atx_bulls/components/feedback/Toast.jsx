import React from "react";
import { Icon } from "../core/Icon.jsx";

export function Toast({ tone = "orange", title, detail, icon, style }) {
  const accent = tone === "burnt" ? "var(--burnt)" : "var(--orange)";
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 18px", background: "var(--panel)", border: "1px solid var(--line)", borderLeft: "3px solid " + accent, boxShadow: "var(--shadow-modal)", ...style }}>
      {icon && <Icon name={icon} size={18} style={{ color: accent, marginTop: 2 }} />}
      <div>
        <div style={{ fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 16, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--bone)" }}>{title}</div>
        {detail && (
          <div style={{ marginTop: 3, fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>{detail}</div>
        )}
      </div>
    </div>
  );
}
