import React from "react";

/** Full-bleed photo section: shaded left, faint grid, optional orange glow, copy stack left. */
export function PhotoSection({ image, alt = "", minHeight = 920, glow = true, grid = true, align = "center", children, overlay, style }) {
  return (
    <section style={{ position: "relative", minHeight, display: "flex", alignItems: align, overflow: "hidden", borderTop: "1px solid var(--line)", ...style }}>
      {image && (
        <img src={image} alt={alt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "var(--photo-filter)" }} />
      )}
      <div style={{ position: "absolute", inset: 0, background: "var(--photo-shade)" }} />
      {grid && <div className="atx-grid-overlay" style={{ position: "absolute", inset: 0, maskImage: "linear-gradient(90deg,#000 0%,#000 42%,transparent 72%)", WebkitMaskImage: "linear-gradient(90deg,#000 0%,#000 42%,transparent 72%)" }} />}
      {glow && <div style={{ position: "absolute", inset: 0, background: "var(--photo-glow)" }} />}
      <div style={{ position: "absolute", inset: 0, background: "var(--photo-fade-bottom)" }} />
      {overlay}
      <div className="atx-shell" style={{ position: "relative", zIndex: 2, paddingBlock: 96 }}>{children}</div>
    </section>
  );
}
