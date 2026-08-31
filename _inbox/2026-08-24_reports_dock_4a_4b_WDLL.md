---
id: 2026-08-24_reports_dock_4a_4b_WDLL
title: Reports dock — 4a download button + 4b flood deliverable-first
status: approved
date: 2026-08-24
plan_row: P-60
operator_go: verbal 2026-08-24 (do this before deploy; frames at _temp/Smart Site Reports Dock.html)
parent: _inbox/2026-08-24_reports_option_d_WDLL.md
frames: P:\doc_repo\_temp\Smart Site Reports Dock.html (newest 4a, 4b)
---

# WDLL: Reports dock 4a / 4b

Option D (picker + one document) stays. This card is the next cut from the bundled design drop: the finished file is a download button, and the flood study leads with the finding and the sheet.

Phase-close PRs (LDT #474, hauska-map #220) stay unmerged until this lands on the same PE tree so one deploy walks both.

## Done looks like

On a signed-in entitled account, a generated site-plan, terrain, flood, or X-ray file is an outlined download button: arrow glyph left, "Download" plus the format, size monospace on the right when the export actually reported a byte count. It is never a blue underlined text link and never two filled buttons in one card. Generate / Export stays the filled blue primary until a file exists; then that action becomes Re-run (outline) and the download is the deliverable.

Selecting Flood & drainage on a completed study shows the finding first (the first two sentences of the existing briefing, verbatim, no new copy), then Download PDF sheet, then a clipped map preview with Open on the map, then a short legend. Method, sources, full briefing, and the nine-layer legend live under "Method, sources and full findings". Persist still does not auto-paint the main map. Honest-empty still has no viz and no download.

## Acceptance items

1. **Download is a button.** Generated site-plan, terrain, flood, and X-ray use `DownloadFileButton` (glyph + verb + format + size-if-known). No blue text-only download link. | check: render tests assert `Download PDF` / `Download GLB` / `Download PDF sheet` / `Download PDF` and the existing download testids; HTML of those nodes is an outlined control, not `color: var(--brand-blue)` text | grade: [met on tree; live leftover]

2. **Size is earned.** Size text appears only from a real `byteCount`. Missing bytes omit the size, never a fabricated KB/MB. | check: site-plan fixture 204800 bytes paints `200 KB`; flood PDF (no byteCount) paints no size | grade: [met on tree; live leftover]

3. **Two ranks.** Generate/Export is filled primary when no file. After a file exists, that control is outline Re-run and the download is the outlined deliverable. Never two filled primaries in one card. | check: SPPDF with persisted result has `site-plan-export-run` as Re-run and `site-plan-download-link`; first-paint SPPDF has Export site plan and no download | grade: [met on tree; live leftover]

4. **Copy follows the button.** New settle notices say "download above", not "download below". | check: source strings in SitePlanExportSection and TerrainExportSection; seeded persistence tests use the new line | grade: [met on tree; live leftover]

5. **Flood finding first.** A completed study paints `flood-finding-lead` above the download. Lead is the first one or two sentences of `study.briefing`. Empty briefing paints no lead. Full briefing stays under the disclosure as `flood-briefing`. | check: fixture study lead equals its one-sentence briefing; two-sentence unit fixture returns exactly those two sentences; honest-empty has neither lead nor download | grade: [met on tree; live leftover]

6. **Flood sheet second, map third.** Download sits above the clipped viz. Compact legend (Parcel / Ponding-if-drawn / Flow path) is visible. Full legend + provenance + briefing sit in `flood-method-disclosure`. Persist + overlay host still shows Open on the map / idle, not `flood-map-overlay-hint`. | check: flood-tool tests; source order in FloodTool result block | grade: [met on tree; live leftover]

7. **Tokens and scope.** `--brand-blue` only. No gold CTAs. No Oxygen CDN. No Feasibility or Comparison generators. No edits to PricingModal / checkout this card. Isolated tree only (`P:/tmp/hauska-map-phase-close`). | check: grep + git pathspec | grade: [met on tree]

## Do not

- Invent Feasibility or Comparison generators.
- Invent a flood PDF byte count.
- Auto-paint the main map from a persisted study.
- Deploy or alias smartsite.cloud before the operator walk.
- Write `P:/seat-worktrees/property/hauska-map`.

## Amendments

- **A1 — lands on the phase-close PE branch (2026-08-24).** Same tree as hauska-map #220 so checkout popup, owner gate, Find miss, and this chrome ship in one PE deploy. Reason: operator said do the Reports Dock before that deploy.
