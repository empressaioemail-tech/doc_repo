import React from "react";

export function Tabs({ items = [], active, onChange, style }) {
  return (
    <div role="tablist" style={{ display: "flex", gap: 28, borderBottom: "1px solid var(--line)", ...style }}>
      {items.map((it) => {
        const id = it.id || it;
        const on = id === active;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={on}
            onClick={() => onChange && onChange(id)}
            style={{ padding: "0 0 12px", marginBottom: -1, background: "transparent", border: 0, borderBottom: "3px solid " + (on ? "var(--orange)" : "transparent"), color: on ? "var(--bone)" : "var(--muted)", fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", transition: "all var(--dur-base) var(--ease)" }}
          >
            {it.label || it}
          </button>
        );
      })}
    </div>
  );
}
