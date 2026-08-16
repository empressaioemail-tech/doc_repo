import React, { useState } from "react";

const H = { sm: 42, md: 56, lg: 64, xl: 68 };
const FS = { sm: 14, md: 14, lg: 15, xl: 17 };

/** The signature component: chamfered orange CTA with a trailing north-east arrow. */
export function Button({
  variant = "primary",
  size = "md",
  arrow = true,
  glow = false,
  full = false,
  disabled = false,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const small = size === "sm";

  const skins = {
    primary: { background: hover ? "var(--bone)" : "var(--orange)", color: "var(--ink)" },
    bone: { background: hover ? "var(--orange)" : "var(--bone)", color: "var(--ink)" },
    ink: { background: hover ? "var(--panel)" : "var(--ink)", color: "var(--bone)" }
  };

  return (
    <button
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: full ? "flex" : "inline-flex",
        width: full ? "100%" : undefined,
        alignItems: "center",
        justifyContent: "space-between",
        gap: small ? "var(--btn-gap-sm)" : "var(--btn-gap)",
        minHeight: H[size],
        padding: "0 " + (small ? 18 : 26) + "px",
        border: 0,
        borderRadius: 0,
        clipPath: "var(--clip-button)",
        fontFamily: "var(--font-ui)",
        fontWeight: 900,
        fontSize: FS[size],
        letterSpacing: "var(--button-tracking)",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        boxShadow: glow ? "var(--glow-cta)" : "none",
        transform: hover && !disabled ? "translateY(var(--lift))" : "none",
        transition: "all var(--dur-base) var(--ease)",
        ...skins[variant],
        ...style
      }}
      {...rest}
    >
      <span>{children}</span>
      {arrow && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="square" aria-hidden="true">
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      )}
    </button>
  );
}
