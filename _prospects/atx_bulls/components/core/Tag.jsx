import React from "react";

const TONES = {
  orange: { background: "var(--orange)", color: "var(--ink)", border: "1px solid var(--orange)" },
  outline: { background: "transparent", color: "var(--muted)", border: "1px solid var(--line)" },
  bone: { background: "var(--bone)", color: "var(--ink)", border: "1px solid var(--bone)" },
  ink: { background: "var(--ink)", color: "var(--bone)", border: "1px solid var(--ink)" }
};

export function Tag({ tone = "outline", children, style, ...rest }) {
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", padding: "5px 10px", borderRadius: 0,
        fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 10,
        letterSpacing: "0.16em", textTransform: "uppercase", whiteSpace: "nowrap",
        ...TONES[tone], ...style
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
