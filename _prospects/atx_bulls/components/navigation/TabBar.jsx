import React from "react";
import { Icon } from "../core/Icon.jsx";

/** INTENTIONAL ADDITION: the brand has no app yet. Chrome follows the nav's rules. */
export function TabBar({ items = [], active, onChange, style }) {
  return (
    <nav style={{ display: "flex", background: "var(--nav-solid)", backdropFilter: "blur(var(--nav-blur))", borderTop: "1px solid var(--line)", paddingBottom: 8, ...style }}>
      {items.map((it) => {
        const on = it.id === active;
        return (
          <button
            key={it.id}
            onClick={() => onChange && onChange(it.id)}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "12px 0 8px", marginTop: -1, background: "transparent", border: 0, borderTop: "3px solid " + (on ? "var(--orange)" : "transparent"), color: on ? "var(--orange)" : "var(--muted)", cursor: "pointer", transition: "all var(--dur-base) var(--ease)" }}
          >
            <span style={{ position: "relative", display: "inline-flex" }}>
              <Icon name={it.icon} size={21} />
              {it.count ? (
                <span style={{ position: "absolute", top: -5, right: -9, minWidth: 15, height: 15, padding: "0 3px", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "var(--orange)", color: "var(--ink)", fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 10 }}>{it.count}</span>
              ) : null}
            </span>
            <span style={{ fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" }}>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
