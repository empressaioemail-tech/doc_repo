import React from "react";

/* Official art. Local files are screenshot-derived (low resolution, opaque
   background) — see assets/README.md. Prefer the live transparent PNGs when the
   page can reach the network. */
const SRC = {
  mark: "https://atxbulls.com/bulls-logo-official.png",
  lockup: "https://atxbulls.com/atx-bulls-official-logo.png",
  af1: "https://atxbulls.com/af1-logo.png"
};
const LOCAL = {
  mark: "assets/atx-bulls-mark-on-ink.png",
  lockup: "assets/atx-bulls-lockup-on-orange.png"
};

export function Logo({ variant = "mark", height = 56, dropShadow = false, base = "", style, ...rest }) {
  const local = LOCAL[variant] ? base + LOCAL[variant] : null;
  return (
    <img
      src={SRC[variant]}
      alt={variant === "af1" ? "Arena Football One" : "ATX Bulls"}
      onError={(e) => { if (local && e.currentTarget.src !== local) e.currentTarget.src = local; }}
      style={{
        height,
        width: "auto",
        display: "block",
        filter: dropShadow ? "var(--logo-shadow)" : undefined,
        ...style
      }}
      {...rest}
    />
  );
}
