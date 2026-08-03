---
id: REBRAND_UI_citations_and_pdf
title: REBRAND UI — citation/link data-inspection sweep + PDF X-ray template branding
date: 2026-08-03
status: dispatch (2 QA items sharing the brief/print surfaces — one agent, sequential)
owner: nick
related: [REBRAND_IMPL_design_system_wiring, smart-site-rebrand-live-pe-prod]
---

# REBRAND UI — citations + PDF template

Two operator QA items that share the brief/citation surfaces (PropertyBriefPanel.tsx, brief-print-html.ts, brief-view-model.ts, InspectCard.tsx). ONE agent, sequential. Branch off `rebrand/design-system-impl` (design tokens available). No deploy.

## TASK 1 — Citation / link / atom-reference sweep (the data-inspection loop)
OPERATOR: "A lot of links and citations still need work — dead ends and dead links. A broad-sweep fix. All links / citations / atom references should follow a coherent data-inspection loop."
The goal: EVERY reference the user can click resolves to something real and coherent — no dead ends. Define and enforce ONE data-inspection loop:
- A CITATION (e.g. "[1] City of Bastrop zoning map", the §14.04.006 code refs, "Source: FEMA NFHL") → clicking it goes to the actual source (the sourceUrl / citation_url), OR opens a citation detail with the source link + vintage. Never a dead link, never a href that 404s or does nothing.
- An ATOM REFERENCE / chip (the teal atom chips) → clicking opens the atom's detail (provenance, value, vintage, confidence) — the "inspect the atom" loop. Never inert.
- A "Source: X · vintage Y" line → the source is linked or inspectable; vintage is shown.
STEPS:
1. AUDIT: grep the brief/inspect/print surfaces for every `href`, citation ref, `sourceUrl`/`citation_url`, atom-ref, and `§` code link (PropertyBriefPanel.tsx, brief-view-model.ts, brief-print-html.ts, InspectCard.tsx, and the citation appendix). For each, determine: does it resolve? To what? Is it a dead end (no href, `#`, undefined URL, 404-prone, or a click with no handler)?
2. Produce a TABLE: reference type · where · current behavior · dead-end? · fix.
3. FIX the dead ends so each follows the loop: a citation → its source URL / detail; an atom ref → its atom detail; a source line → linked/inspectable. Where a real source URL exists in the data, wire it; where it's genuinely absent, show an honest "source not linked" state (do NOT fabricate a URL). Use `--brand-blue` for links (design system: blue = links).
4. Coherence: the SAME interaction pattern everywhere (a citation behaves the same in the panel, the inspect card, and the print/export). No one-off link styles.
DISCIPLINE: this is a real audit — do NOT claim "fixed" without showing the before/after per reference. If a citation's source genuinely isn't in the data (can't be resolved), that's an honest "unlinked source" state, not a fabricated link. If the scope balloons (hundreds of refs), fix the BRIEF PANEL + INSPECT CARD loops first (the primary surfaces), enumerate the rest, and flag for a follow-up — don't half-fix silently.

## TASK 2 — PDF X-ray template branding
The exported PDF (`brief-print-html.ts`) is unbranded: `HEADER_TEXT = "Property Intel Brief"`, `ACCENT = "#00b4d8"` (old cyan), no crosshair/lockup. OPERATOR: "the PDF template needs brand elements." Bring it onto the Smart Site brand:
- Title/header → Smart Site brand: the crosshair mark + "SMART SITE" lockup (inline SVG, the mark is at docs/smart-site-brand/logo/smart-site-mark-crosshair.svg — white strokes, gold #E8963B center dot; SITE in gold #F5B95C). Keep "Property Intel Brief" as the document subtitle / X-ray label ("SMART SITE X-RAY" is the ratified report name — use it as the header, "Property Intel Brief" can stay as the descriptor).
- ACCENT `#00b4d8` → the brand palette: brand-gold `#E8963B` / `#F5B95C` for accents, `#3B82F6` for links/citations. (This is the print stylesheet — inline hex is fine; mirror the token values.)
- Add a small crosshair mark to the header + the "AN X-RAY FOR REAL ESTATE" eyebrow tone if it fits. Keep the provenance header, per-section pages, and citation appendix STRUCTURE — this is a brand skin of the template, not a rewrite.
- Keep it print-safe (the @page rules, Arial fallbacks for print headers are fine; the mark must render in print — inline SVG or a data-URI).
- The footer / "not legal advice" disclosures stay.

## BOUNDARIES
- Use the design palette; do NOT re-skin the whole app (this is the brief/print surfaces only).
- Do NOT fabricate a citation source URL that isn't in the data — honest "unlinked" state instead.
- Do NOT change the brief's factual content, disclosures, or the honest-absence lines.
- Install-id, interaction-cyan untouched.

## VERIFY + DELIVER
- Task 1: the reference audit TABLE (before/after per reference) + the coherent loop implemented; grep shows no dead `href="#"` / handler-less citation in the primary surfaces.
- Task 2: the PDF template renders the Smart Site brand (crosshair + lockup header, brand palette, blue citations) — show the changed template + a note on print-safety.
- Typecheck green (build @hauska/map-renderer, tsc --noEmit). No non-exiting dev server.
- Commit to a child branch `rebrand/ui-citations-pdf` off `rebrand/design-system-impl`; push. NO merge, NO deploy. Report both tasks + any STOP-flag.

## STANDING DECISIONS
Isolated worktree (other agents elsewhere — no collision). Verification never delegated. Anti-fabrication (no invented citation URLs; honest unlinked state). If the citation scope balloons, fix primary surfaces + enumerate the rest + flag — no silent half-fix. No deploy without operator go. No timeframe estimates. Paste raw audit table + grep/typecheck.
