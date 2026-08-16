import React from "react";

export function VerticalLockup({ children = "LOVED HERE · FEARED EVERYWHERE", tone = "bone", style }) {
  return (
    <span
      style={{
        writingMode: "vertical-rl",
        fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 10,
        letterSpacing: "0.28em", textTransform: "uppercase",
        color: tone === "orange" ? "var(--orange)" : "var(--muted)", ...style
      }}
    >
      {children}
    </span>
  );
}
