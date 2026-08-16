import React, { useState } from "react";
import { Logo } from "../brand/Logo.jsx";
import { IconSquare } from "../core/IconSquare.jsx";

export function JoinInvert({ eyebrow = "ATX Bulls · 2027", title = "Join VIP list", sub, socials = [], base = "", onSubmit, style }) {
  const [email, setEmail] = useState("");
  return (
    <section style={{ background: "var(--orange)", color: "var(--ink)", padding: "96px 0", ...style }}>
      <div className="atx-shell" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <Logo variant="lockup" height={200} base={base} style={{ filter: "var(--logo-shadow-invert)" }} />
        <div style={{ marginTop: 28, fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" }}>{eyebrow}</div>
        <h2 style={{ marginTop: 14, fontSize: "var(--display-invert)", color: "var(--ink)" }}>{title}</h2>
        {sub && (
          <p style={{ margin: "16px 0 0", maxWidth: "34ch", fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 18, lineHeight: 1.2, textTransform: "uppercase" }}>{sub}</p>
        )}
        <form
          onSubmit={(e) => { e.preventDefault(); onSubmit && onSubmit(email); }}
          style={{ display: "grid", gridTemplateColumns: "1fr 60px", alignItems: "end", gap: 0, width: "min(560px,100%)", marginTop: 34, borderBottom: "3px solid var(--ink)" }}
        >
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="YOU@EMAIL.COM"
            aria-label="Email address"
            style={{ background: "transparent", border: 0, outline: "none", padding: "0 0 10px", fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 24, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--ink)" }}
          />
          <button
            type="submit"
            style={{ height: 63, border: 0, background: "var(--ink)", color: "var(--bone)", fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer" }}
          >
            Join
          </button>
        </form>
        {socials.length > 0 && (
          <div style={{ display: "flex", gap: 12, marginTop: 34 }}>
            {socials.map((s) => <IconSquare key={s} icon={s} label={s} variant="ink" />)}
          </div>
        )}
      </div>
    </section>
  );
}
