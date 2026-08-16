import React from "react";

/** Latent in the live CSS (.player) — 600px tall panel with a huge orange number. */
export function PlayerCard({ number, name, position, image, height = 600, style }) {
  return (
    <article style={{ position: "relative", height, background: "var(--panel)", border: "1px solid var(--line)", overflow: "hidden", ...style }}>
      {image
        ? <img src={image} alt={name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "var(--photo-filter)" }} />
        : <div className="atx-grid-overlay" style={{ position: "absolute", inset: 0 }} />}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,#050403 8%,#05040366 46%,transparent 78%)" }} />
      <span style={{ position: "absolute", top: 18, right: 20, fontFamily: "var(--font-display)", fontSize: 112, lineHeight: .86, letterSpacing: "-0.06em", color: "var(--orange)" }}>{number}</span>
      <div style={{ position: "absolute", left: 24, right: 24, bottom: 24 }}>
        <div style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>{position}</div>
        <div style={{ marginTop: 6, fontFamily: "var(--font-display)", fontSize: 34, lineHeight: .86, letterSpacing: "-0.06em", textTransform: "uppercase", color: "var(--bone)" }}>{name}</div>
      </div>
    </article>
  );
}
