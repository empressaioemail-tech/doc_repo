import React from "react";

export function EventSplit({ items = [], style }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(" + items.length + ",1fr)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", ...style }}>
      {items.map((it, i) => (
        <div key={it.label} style={{ padding: "20px 24px", borderRight: i === items.length - 1 ? "none" : "1px solid var(--line)" }}>
          <div style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>{it.label}</div>
          <div style={{ marginTop: 6, fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: "var(--value-size)", textTransform: "uppercase", color: "var(--bone)" }}>{it.value}</div>
        </div>
      ))}
    </div>
  );
}
