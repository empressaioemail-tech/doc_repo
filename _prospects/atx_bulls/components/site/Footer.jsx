import React from "react";
import { IconSquare } from "../core/IconSquare.jsx";

export function Footer({ socials = [], legal = "© 2027 ATX BULLS · AUSTIN, TEXAS", style }) {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", padding: "34px 0", ...style }}>
      <div className="atx-shell" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 12 }}>
          {socials.map((s) => <IconSquare key={s} icon={s} label={s} variant="bone" size={40} />)}
        </div>
        <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)" }}>{legal}</span>
      </div>
    </footer>
  );
}
