import React, { useState } from "react";

export function TextLink({ variant = "bone", gap, children, style, ...rest }) {
  const [hover, setHover] = useState(false);
  const ink = variant === "ink";
  return (
    <a
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: gap || (ink ? 48 : 34),
        padding: "14px 0",
        borderBottom: "2px solid " + (ink ? "var(--ink)" : hover ? "var(--orange)" : "var(--bone)"),
        color: ink ? "var(--ink)" : hover ? "var(--orange)" : "var(--bone)",
        fontFamily: "var(--font-ui)",
        fontWeight: 900,
        fontSize: 13,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "all var(--dur-base) var(--ease)",
        ...style
      }}
      {...rest}
    >
      <span>{children}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="square" aria-hidden="true">
        <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
      </svg>
    </a>
  );
}
