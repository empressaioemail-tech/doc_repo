import React from "react";
import { Icon } from "../core/Icon.jsx";
import { ProgressBar } from "../feedback/ProgressBar.jsx";

export function ChallengeRow({ title, detail, icon = "target", reward, progress, goal, done = false, onClick, style }) {
  return (
    <div
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", background: "var(--panel)", border: "1px solid var(--line)", cursor: onClick ? "pointer" : undefined, ...style }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, flex: "0 0 auto", border: "2px solid " + (done ? "var(--line)" : "var(--orange)"), color: done ? "var(--muted)" : "var(--orange)" }}>
        <Icon name={done ? "check" : icon} size={19} strokeWidth={done ? 3.5 : 2.25} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 14 }}>
          <span style={{ fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 17, letterSpacing: "0.06em", textTransform: "uppercase", color: done ? "var(--muted)" : "var(--bone)" }}>{title}</span>
          {reward != null && (
            <span style={{ fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 15, letterSpacing: "0.08em", color: done ? "var(--muted)" : "var(--orange)", whiteSpace: "nowrap" }}>
              {done ? "Earned" : "+" + reward.toLocaleString("en-US")}
            </span>
          )}
        </div>
        {detail && (
          <div style={{ marginTop: 4, fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 10, letterSpacing: "0.17em", textTransform: "uppercase", color: "var(--muted)" }}>{detail}</div>
        )}
        {typeof progress === "number" && !done && <ProgressBar style={{ marginTop: 10 }} value={progress} max={goal || 100} height={5} />}
      </div>
    </div>
  );
}
