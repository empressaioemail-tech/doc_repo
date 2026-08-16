import React from "react";
import { Logo } from "../brand/Logo.jsx";
import { Button } from "../core/Button.jsx";

export function NavBar({ links = [], cta = "Reserve tickets", solid = false, base = "", onCta, onLink, style }) {
  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 20, height: "var(--nav-h)",
        display: "flex", alignItems: "center",
        background: solid ? "var(--nav-solid)" : "transparent",
        backdropFilter: solid ? "blur(var(--nav-blur))" : undefined,
        borderBottom: solid ? "1px solid var(--line)" : "1px solid transparent",
        transition: "all var(--dur-base) var(--ease)", ...style
      }}
    >
      <div className="atx-shell" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32 }}>
        <Logo variant="mark" height={54} base={base} />
        <nav style={{ display: "flex", gap: 34 }}>
          {links.map((l) => (
            <a
              key={l}
              onClick={() => onLink && onLink(l)}
              style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--bone)", cursor: "pointer" }}
            >
              {l}
            </a>
          ))}
        </nav>
        <Button size="sm" onClick={onCta}>{cta}</Button>
      </div>
    </header>
  );
}
