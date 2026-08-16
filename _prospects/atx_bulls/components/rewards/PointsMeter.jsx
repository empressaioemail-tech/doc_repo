import React from "react";
import { ProgressBar } from "../feedback/ProgressBar.jsx";
import { TierBadge } from "./TierBadge.jsx";

const fmt = (n) => n.toLocaleString("en-US");

export function PointsMeter({ points = 0, tier = "rookie", nextTier, toNext = 0, label = "Horn points", style }) {
  const goal = points + toNext;
  return (
    <div style={{ padding: 24, background: "var(--panel)", border: "1px solid var(--line)", ...style }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--orange)" }}>
            <span style={{ width: 34, height: 3, background: "currentColor" }} />{label}
          </div>
          <div style={{ marginTop: 10, fontFamily: "var(--font-display)", fontSize: 76, lineHeight: 0.86, letterSpacing: "-0.06em", color: "var(--bone)" }}>{fmt(points)}</div>
        </div>
        <TierBadge tier={tier} size="lg" showLabel={false} />
      </div>
      {nextTier && (
        <ProgressBar style={{ marginTop: 22 }} value={points} max={goal} label={fmt(toNext) + " to " + nextTier} caption={fmt(points) + " / " + fmt(goal)} />
      )}
    </div>
  );
}
