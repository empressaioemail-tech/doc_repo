import React, { useState } from "react";

export function Panel({ variant = "panel", chamfer = false, interactive = false, padding = 24, children, style, ...rest }) {
  const [hover, setHover] = useState(false);
  const skins = {
    panel: { background: "var(--panel)", border: "1px solid var(--line)" },
    hairline: { background: "transparent", border: "1px solid var(--line)" },
    ink: { background: "var(--ink)", border: "1px solid var(--line)" },
    orange: { background: "var(--orange)", border: "1px solid var(--orange)", color: "var(--ink)" },
    frost: { background: "var(--stamp-frost)", border: "1px solid var(--line)" }
  };
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: 0,
        padding,
        clipPath: chamfer ? "var(--clip-panel)" : undefined,
        transition: "all var(--dur-base) var(--ease)",
        cursor: interactive ? "pointer" : undefined,
        ...skins[variant],
        ...(interactive && hover ? { borderColor: "var(--orange)", transform: "translateY(var(--lift))" } : null),
        ...style
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
