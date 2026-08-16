import React from "react";

export function Stamp({ lines = [], size = 112, rotate = 8, style }) {
  return (
    <div
      style={{
        width: size, height: size, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        borderRadius: "50%", border: "2px solid var(--orange)",
        background: "var(--stamp-frost)", boxShadow: "var(--glow-stamp)",
        transform: "rotate(" + rotate + "deg)",
        fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 14,
        lineHeight: 0.88, letterSpacing: "0.04em", textTransform: "uppercase",
        color: "var(--orange)", padding: 10, ...style
      }}
    >
      {lines.map((l, i) => <span key={i}>{l}</span>)}
    </div>
  );
}
