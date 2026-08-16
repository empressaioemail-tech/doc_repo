import React from "react";
import { Panel } from "../core/Panel.jsx";
import { Tag } from "../core/Tag.jsx";
import { Button } from "../core/Button.jsx";
import { Icon } from "../core/Icon.jsx";

export function RewardCard({ title, category, cost, image, imageAlt, flag, locked = false, onRedeem, style }) {
  return (
    <Panel padding={0} interactive={!locked} style={{ overflow: "hidden", opacity: locked ? 0.6 : 1, ...style }}>
      <div style={{ position: "relative", aspectRatio: "16 / 10", background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {image
          ? <img src={image} alt={imageAlt || title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "var(--photo-filter)" }} />
          : <div className="atx-grid-overlay" style={{ position: "absolute", inset: 0 }} />}
        {!image && <Icon name={locked ? "lock" : "image"} size={26} style={{ color: "var(--line)", position: "relative" }} />}
        {flag && <Tag tone="orange" style={{ position: "absolute", top: 0, left: 0 }}>{flag}</Tag>}
      </div>
      <div style={{ padding: 18 }}>
        {category && (
          <div style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>{category}</div>
        )}
        <div style={{ marginTop: 8, fontFamily: "var(--font-display)", fontSize: 24, lineHeight: 0.86, letterSpacing: "-0.06em", textTransform: "uppercase", color: "var(--bone)" }}>{title}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
          <span style={{ fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 20, letterSpacing: "0.06em", color: "var(--bone)" }}>
            {cost.toLocaleString("en-US")}<span style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--muted)" }}> PTS</span>
          </span>
          <Button size="sm" arrow={!locked} disabled={locked} onClick={onRedeem}>{locked ? "Locked" : "Redeem"}</Button>
        </div>
      </div>
    </Panel>
  );
}
