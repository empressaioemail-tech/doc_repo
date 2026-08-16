import React from "react";
import { Eyebrow } from "./Eyebrow.jsx";

export function SectionHeading({ eyebrow, eyebrowTone, lead, emphasis, trail, lede, size, invert = false, style }) {
  return (
    <div style={style}>
      {eyebrow && <Eyebrow tone={eyebrowTone || (invert ? "ink" : "orange")}>{eyebrow}</Eyebrow>}
      <h2 style={{ fontSize: size || "var(--display-section)", color: invert ? "var(--ink)" : "var(--bone)", maxWidth: "14ch" }}>
        {lead} {emphasis && <em>{emphasis}</em>} {trail}
      </h2>
      {lede && (
        <p style={{ margin: "22px 0 0", maxWidth: "26ch", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "var(--lede-size)", lineHeight: 1.2, textTransform: "uppercase", color: invert ? "var(--ink)" : "var(--lede)" }}>
          {lede}
        </p>
      )}
    </div>
  );
}
