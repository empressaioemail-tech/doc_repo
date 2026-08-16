import React from "react";
import { Icon } from "../core/Icon.jsx";

export function TicketStub({ matchup, date, time, venue, section, row, seat, status = "Valid", style }) {
  const meta = [["Sec", section], ["Row", row], ["Seat", seat]];
  return (
    <div style={{ background: "var(--panel)", border: "1px solid var(--line)", ...style }}>
      <div style={{ height: 6, background: "var(--orange)" }} />
      <div style={{ padding: 22 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
          <span style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 10, letterSpacing: "0.17em", textTransform: "uppercase", color: "var(--muted)" }}>{date} · {time}</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 10, letterSpacing: "0.17em", textTransform: "uppercase", color: "var(--orange)" }}>
            <Icon name="shield-check" size={13} />{status}
          </span>
        </div>
        <div style={{ marginTop: 10, fontFamily: "var(--font-display)", fontSize: 42, lineHeight: 0.86, letterSpacing: "-0.06em", textTransform: "uppercase", color: "var(--bone)" }}>{matchup}</div>
        <div style={{ marginTop: 8, fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--lede)" }}>{venue}</div>
      </div>
      <div style={{ display: "flex", borderTop: "1px dashed var(--line)" }}>
        {meta.map(([k, v]) => (
          <div key={k} style={{ flex: 1, padding: "14px 20px", borderRight: "1px solid var(--line)" }}>
            <div style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>{k}</div>
            <div style={{ marginTop: 4, fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 22, letterSpacing: "0.04em", color: "var(--bone)" }}>{v}</div>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 88, background: "var(--ink)", color: "var(--bone)" }}>
          <Icon name="qr-code" size={40} />
        </div>
      </div>
    </div>
  );
}
