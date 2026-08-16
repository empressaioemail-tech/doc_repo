import React, { useState } from "react";
import { Icon } from "../core/Icon.jsx";

export function VipModal({ open = true, title = "Join VIP list", sub = "Be first to know when tickets drop!", onClose, onSubmit, style }) {
  const [email, setEmail] = useState("");
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "var(--overlay-modal)", backdropFilter: "blur(var(--modal-blur))" }}>
      <div style={{ position: "relative", width: "min(620px,100%)", padding: 52, background: "var(--orange)", color: "var(--ink)", clipPath: "var(--clip-panel)", boxShadow: "var(--shadow-modal)", ...style }}>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ position: "absolute", top: 0, right: 0, width: 48, height: 48, border: 0, background: "var(--ink)", color: "var(--bone)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
        >
          <Icon name="x" size={20} />
        </button>
        <h2 style={{ fontSize: 54, color: "var(--ink)" }}>{title}</h2>
        <p style={{ margin: "14px 0 28px", fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 16, letterSpacing: "0.04em", textTransform: "uppercase" }}>{sub}</p>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit && onSubmit(email); }} style={{ display: "grid", gap: 14 }}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="YOU@EMAIL.COM"
            aria-label="Email address"
            style={{ height: 58, padding: "0 16px", border: "2px solid var(--ink)", background: "#ffffff21", outline: "none", fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 20, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--ink)" }}
          />
          <button
            type="submit"
            style={{ height: 58, border: 0, background: "var(--ink)", color: "var(--bone)", fontFamily: "var(--font-ui)", fontWeight: 900, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer" }}
          >
            Join the VIP list
          </button>
        </form>
      </div>
    </div>
  );
}
