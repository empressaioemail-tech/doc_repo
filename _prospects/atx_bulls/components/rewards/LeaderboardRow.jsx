import React from "react";
import { TierBadge } from "./TierBadge.jsx";
import { Icon } from "../core/Icon.jsx";

export function LeaderboardRow({ rank, name, points, tier = "rookie", you = false, trend, style }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", background: you ? "var(--orange)" : "transparent", color: you ? "var(--ink)" : "var(--bone)", borderBottom: "1px solid var(--line)", ...style }}>
      <span style={{ width: 44, fontFamily: "var(--font-display)", fontSize: 28, lineHeight: 0.86, letterSpacing: "-0.06em", color: you ? "var(--ink)" : rank <= 3 ? "var(--orange)" : "var(--muted)" }}>{rank}</span>
      {!you && <TierBadge tier={tier} size="sm" showLabel={false} />}
      <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 16, letterSpacing: "0.08em", textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {name}{you && " · you"}
      </span>
      {trend && <Icon name={trend === "up" ? "trending-up" : "trending-down"} size={15} style={{ color: you ? "var(--ink)" : "var(--muted)" }} />}
      <span style={{ fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 15, letterSpacing: "0.06em" }}>{points.toLocaleString("en-US")}</span>
    </div>
  );
}
