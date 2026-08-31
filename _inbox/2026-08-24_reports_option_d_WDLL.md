---
id: 2026-08-24_reports_option_d_WDLL
title: Lane 2 leftover — rebuild Reports dock to Option D
status: live-unwalked
date: 2026-08-24
plan_row: P-60
operator_go: verbal 2026-08-24 (checkout looks good but the report area is still the same)
frames: P:\doc_repo\_temp\Smart Site rebrand project (5)\handoff\Smart Site Reports Dock - Option D.dc.html
---

# WDLL: Reports & exports dock — Option D

A2 pricing (#211 / #212) is live. The operator graded checkout good and the stacked Reports wall as unchanged. This card replaces that wall. It does not reopen pricing, Stripe, G-104, Travis join, or the red-card search bar.

## Done looks like

Opening Reports & exports on a signed-in entitled account (including the dev-mode tester) shows one question, then one answer: a Document picker, then one description (status, format, what it contains), then one action. The full catalog lives inside the picker, including Coming soon rows. Site-plan, flood, and terrain engines still run when that document is selected. They are not stacked. Locked signed-in shows the same picker plus one card whose action is View pricing & unlock. Footer stays "The inspect card and map layers stay free."

## Acceptance items

1. **One document at a time.** Default paint is the picker, not Site-plan + Flood + Terrain stacked. At most one export/study engine is in the DOM. | check: render test `reports-tool` has `reports-doc-picker` and does not contain both `site-plan-export-section` and `flood-drainage-section` on first paint | grade: [met in tests + live bundle `reports-doc-picker`; operator walk owed]

2. **Catalog in the picker.** Packages / Studies / Exports. Coming soon rows (Feasibility Study, Comparison report) are findable in the picker, not a scroll wall. | check: picker menu HTML contains both coming-soon names; no stacked coming-soon cards | grade: [met in tests; live bundle has both names]

3. **Selected card.** Kind, status, name, promise, format/meta, one primary action, Change. | check: selecting SPPDF / FLOOD / TERGLB (store-seeded) renders `reports-doc-card` plus exactly that engine | grade: [met in tests]

4. **Locked signed-in.** Picker + one card + View pricing & unlock. No flood-run, no terrain section. Inspect/map stay free (footer). Signed-out stays sign-in-first. | check: lock-matrix free + anon cases | grade: [met in lock-matrix]

5. **Live engines unchanged.** Selected SPPDF/SPDXF/SPIFC runs `SitePlanExportSection`. FLOOD runs `FloodDrainageSection` on chassis key `flood`. Terrain formats run `TerrainExportSection` when Studio/Team/devRole; otherwise `terrain-pro-lock`. Persistence keys `reports.sitePlan`, `reports.terrain`, `flood` stay. | check: reports-tool persistence tests + lock-matrix terrain cases seeded to a terrain doc | grade: [met in tests]

6. **Tokens.** `--brand-blue` on actions. No gold CTAs. No `--sc-*`. No Oxygen CDN. Studio status may use `--semantic-warning`. | check: grep ReportsTool + new chrome files | grade: [met]

7. **Checkout untouched.** No edits to `PricingModal`, `useCheckoutActions`, or `PE_PRICING`. | check: git diff pathspec | grade: [met]

8. **Do not revive** `feat/pe-workbench-verdict-reports`. Isolated tree from `origin/main` after #212. | check: branch name `fix/pe-reports-option-d` from `origin/main` | grade: [met] `303d11c` from `eb6abb8`

## Do not

- Fold G-104 PDF tagging into this card.
- Invent Feasibility or Comparison generators.
- Change site-plan DXF/IFC entitlement (still paid/unlock, not a new Studio gate).
- Write `P:/seat-worktrees/property/hauska-map`.
- Alias smartsite.cloud before the operator visual.

## Amendments

- **A1 — X-ray, not Property dossier (2026-08-24).** The Option D frame used "Property dossier". Live product name has been X-ray (pricing, FAQ, My properties export). Dock catalog name, promise, paywall line, and download label now say X-ray. Internal id stays `DOSS`.
- **A2 — 4a / 4b before deploy (2026-08-24).** New bundled frames at `_temp/Smart Site Reports Dock.html`. Download is a button (4a). Flood leads with finding + sheet (4b). Card: `_inbox/2026-08-24_reports_dock_4a_4b_WDLL.md`. Option D picker law is unchanged.
