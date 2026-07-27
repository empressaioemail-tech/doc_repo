---
id: 2026-07-27_QA2_site_plan_pdf_craft
title: QA2 dispatch — site-plan PDF craft (collision + font-scale + professional elements)
date: 2026-07-27
status: dispatched
owner: nick
planner: qa
repo: hauska-engine
related: [2026-07-27_bastrop_qa_defect_register]
---

# QA2 — Site-plan PDF craft pass

You are a build agent. Improve the site-plan PDF export CRAFT so it looks like a professional drew it. The geometry/data is correct; the framing (parcel-primary fit + street clipping) is already fixed — do NOT touch geometry, offsets, rings, contours, or the fit/clip transform. This is label-placement + typography + professional drawing elements only.

## M0 warm-start
- Repo: hauska-engine. Work off origin/main. Branch `qa/site-plan-craft`.
- Library: pdf-lib. Entry `emitPdfSitePlan(model)` at `packages/engine-core/src/site-plan/pdf/render.ts:308`. Layout math `pdf/layout.ts`. Collision engine `pdf/annotation-placement.ts`.
- IMPORTANT PARITY RULE: the bearing/property-line-tag formula lives ONCE in `packages/engine-core/src/geometry/gis-property-line-tags.ts`, shared by the PDF and the boundary-edge atoms. `annotation-placement.ts` on origin/main IMPORTS it. Do NOT re-inline or fork that formula. (A separate fix is restoring this import on a branch that forked it — do not reintroduce the fork.)

## Defects to fix (BUCKET A — craft)
1. COLLISION ENGINE SILENTLY GIVES UP — `annotation-placement.ts:149-155`: after 12 iterations it draws the label overlapping anyway. Add a real fallback: a leader line to a relocated label, OR shrink, OR drop-with-honest-note. Never draw a silently-overlapping label.
2. FIXED FONT SIZE vs geometry-scaled drawing — labels are fixed 7pt (`render.ts:154,165,119,176`; `layout.ts:284,312`) on a drawing scaled to fit the parcel, so small parcels overlap by construction. Relate label font size (or leader-line usage) to the parcel draw-scale so small parcels don't collide.
3. TWO DISJOINT LABEL PASSES — property-line tags (`layout.ts:278`, outward) and setback labels (`layout.ts:319`, inward) each call placeNonCollidingEdgeLabels with SEPARATE `placed[]` arrays, so they can collide across sets. Share one collision set across both classes.
4. ESTIMATED COLLISION BOXES — `annotation-placement.ts:90-92` uses `text.length*fontSize*0.52` instead of pdf-lib's real `widthOfTextAtSize` (already used elsewhere for wrapping). Use measured widths so boxes are accurate.
5. LABELS THAT BYPASS COLLISION — street names (`render.ts:110-122`), contour elevation labels (`render.ts:172,176`) placed at fixed offsets, freely overlapping. Route them through the collision engine (or at least the shared placed[] set).

## Professional elements to ADD (BUCKET B-lite — additive, keep honest)
6. NORTH ARROW — currently a bare line + "N" (`render.ts:183-184`). Add a proper north-arrow graphic (arrowhead / simple compass).
7. SCALE BAR — currently a line + one text (`render.ts:185-192`). Add a graphic scale bar: tick marks + 0/mid/max labels + FEET (imperial), computed from the real draw-scale.
8. LEGEND — currently 3 inline words (`render.ts:33-36`). Add a real legend with swatches / line-style samples (solid property line vs dashed setback vs envelope fill vs road).
9. SHEET BORDER / NEATLINE + a bordered TITLE BLOCK (scale ratio, date, sheet id) — currently only a title band exists (`render.ts:25-43`). Add a simple professional border + title block. Keep it honest: no fabricated surveyor/drawn-by if not on file — render "not on file" honestly.
10. Optional: on-drawing lot-area callout (only in page-2 table today).

Do NOT regress the strengths: parcel-primary fit + street clipping (`layout.ts:56,126`), the provenance panel + honesty lines (`provenance.ts`, `render.ts:273-301`), and the single shared bearing formula.

## Verify (you do NOT grade MET)
1. `pnpm -C packages/engine-core build` + vitest clean.
2. Promote a LABEL-NON-OVERLAP mechanical test: on a small dense fixture parcel, no two drawn label boxes overlap (using measured widths). Red on pre-fix code.
3. Regenerate the gold sample PDFs (`scripts/generate-site-plan-gold-34785.mjs` and one small-parcel case) and attach/describe the output so the planner + operator can look. Deploy engine-api preview if the change affects the served PDF path.
4. Report: branch, PR, SHA, build/test result, sample PDF artifacts. Planner + operator LOOK at the PDFs across multiple parcels (a big one and a small dense one — anti-fixture) before MET. You do not claim MET.
