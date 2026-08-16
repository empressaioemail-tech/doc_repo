# UI kit — atxbulls.com (marketing site)

Recreation of the live single-page homepage, section for section, at the values recorded in
`uploads/11_design_system_claude_brief.md` (live CSS extract, 2026-08-13).

## Section order (matches live)
Hero (looping video) → orange ticker → Austin Tough banner → Tryouts → Family / opening night →
Origin story → Uniform reveal → Merch Drop 001 → Join VIP (orange invert) → footer.

## Files
- `index.html` — mounts the page. Open directly.
- `Hero.jsx` — video hero, eyebrow, H1 with orange `em`, lede, CTA, proof row, vertical lockup, AF1 badge.
- `Sections.jsx` — the six photo sections, each built from `PhotoSection` + `SectionHeading`.
- `Site.jsx` — nav scroll state, VIP modal wiring, ticker, invert, footer.

## Fidelity notes
- All copy is verbatim from the live site.
- Photography and the hero video load from `https://atxbulls.com/…`. They render in a browser but
  are not embeddable by screenshot tooling, so thumbnails may show the shaded panels without imagery.
- Nav solid state is driven by the scroll container rather than window scroll, so it works inside a preview frame.
- Every CTA except "Register for tryouts" opens the VIP modal, matching live behaviour. Tryouts leaves
  the site to `https://form.fillout.com/t/qVMoDaWhEmus`.
- `/team` is a single hero on the live site ("Texas made. Arena ready.") with no roster published; it is
  not recreated as a separate screen. `PlayerCard` and `ScheduleTable` cover those latent surfaces.
