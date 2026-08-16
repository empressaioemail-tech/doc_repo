import React, { useState } from "react";
import { Icon } from "./Icon.jsx";

export function IconSquare({ icon, label, variant = "ink", size = 44, style, ...rest }) {
  const [hover, setHover] = useState(false);
  const onOrange = variant === "ink";
  const skin = onOrange
    ? { border: "2px solid var(--ink)", background: hover ? "var(--ink)" : "transparent", color: hover ? "var(--bone)" : "var(--ink)" }
    : { border: "2px solid var(--line)", background: hover ? "var(--bone)" : "transparent", color: hover ? "var(--ink)" : "var(--bone)" };
  return (
    <button
      aria-label={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: size, height: size, borderRadius: 0, cursor: "pointer",
        transition: "all var(--dur-base) var(--ease)", ...skin, ...style
      }}
      {...rest}
    >
      <Icon name={icon} size={Math.round(size * 0.45)} />
    </button>
  );
}
