import React from "react";

/** Latent .schedule in the live CSS: the bone-inverted table. */
export function ScheduleTable({ games = [], style }) {
  return (
    <div style={{ background: "var(--bone)", color: "var(--ink)", ...style }}>
      {games.map((g, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr auto", alignItems: "center", gap: 24, padding: "22px 28px", borderTop: i === 0 ? "none" : "1px solid #08070626" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 26, lineHeight: .86, letterSpacing: "-0.06em", textTransform: "uppercase" }}>{g.date}</span>
          <span style={{ fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 20, letterSpacing: "0.04em", textTransform: "uppercase" }}>{g.opponent}</span>
          <span style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6b625b" }}>{g.venue}</span>
        </div>
      ))}
    </div>
  );
}
