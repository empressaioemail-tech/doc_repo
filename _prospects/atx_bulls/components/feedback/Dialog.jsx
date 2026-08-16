import React from "react";
import { Icon } from "../core/Icon.jsx";

export function Dialog({ open = true, title, eyebrow, invert = false, onClose, footer, children, width = 440, style }) {
  if (!open) return null;
  const fg = invert ? "var(--ink)" : "var(--bone)";
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "var(--overlay-modal)", backdropFilter: "blur(var(--modal-blur))" }}>
      <div style={{ position: "relative", width: "100%", maxWidth: width, background: invert ? "var(--orange)" : "var(--panel)", border: invert ? "none" : "1px solid var(--line)", clipPath: "var(--clip-panel)", boxShadow: "var(--shadow-modal)", ...style }}>
        {onClose && (
          <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: 0, right: 0, width: 44, height: 44, border: 0, background: invert ? "var(--ink)" : "var(--ink)", color: "var(--bone)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="x" size={18} />
          </button>
        )}
        <div style={{ padding: "28px 28px 0" }}>
          {eyebrow && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: invert ? "var(--ink)" : "var(--orange)" }}>
              <span style={{ width: 34, height: 3, background: "currentColor" }} />{eyebrow}
            </div>
          )}
          <h3 style={{ fontSize: 40, color: fg }}>{title}</h3>
        </div>
        <div style={{ padding: "16px 28px 24px", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 15, letterSpacing: "0.06em", textTransform: "uppercase", color: invert ? "var(--ink)" : "var(--lede)" }}>{children}</div>
        {footer && <div style={{ display: "flex", gap: 12, justifyContent: "flex-start", padding: "0 28px 28px" }}>{footer}</div>}
      </div>
    </div>
  );
}
