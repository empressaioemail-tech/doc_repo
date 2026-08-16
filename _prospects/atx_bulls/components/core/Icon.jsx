import React, { useEffect, useRef } from "react";

/* Lucide, loaded from CDN. Stroke inherits currentColor; the site draws its arrow
   at stroke-width 2.25, so icons run heavy here too. */
export function Icon({ name, size = 20, strokeWidth = 2.25, style, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const draw = () => window.lucide && window.lucide.createIcons({ nameAttr: "data-lucide", root: ref.current });
    draw();
    const t = setTimeout(draw, 300);
    return () => clearTimeout(t);
  }, [name, size, strokeWidth]);
  return (
    <span ref={ref} aria-hidden="true" style={{ display: "inline-flex", width: size, height: size, flex: "0 0 auto", ...style }} {...rest}>
      <i data-lucide={name} style={{ width: size, height: size, strokeWidth }} />
    </span>
  );
}
