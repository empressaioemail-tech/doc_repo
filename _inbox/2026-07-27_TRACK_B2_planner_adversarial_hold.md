---
id: 2026-07-27_TRACK_B2_planner_adversarial_hold
title: Planner adversarial HOLD — Track B2 site-plan design pass (pre-merge)
status: active
date: 2026-07-27
planner: Track B customer-UI planner
related: [2026-07-27_TRACK_B2_site_plan_design_pass, 2026-07-27_TRACK_B_customer_ui_quality_WDLL]
---

# B2 adversarial HOLD (planner)

PR reviewed + gold sample PDF opened. **Do not merge on craft alone** — live customer-surface regenerate still owed (WDLL 6). Offline gold is craft evidence, not live PE/engine-api truth.

## CI

| PR | HEAD | Checks |
|---|---|---|
| [hauska-engine #142](https://github.com/empressaioemail-tech/hauska-engine/pull/142) | `044d552b` | typecheck+test SUCCESS |

Sample: `_inbox/2026-07-27_track_b2_site_plan_samples/48021_34785_site_plan.pdf` (live TxGIO ring + synthetic DEM; STREET honest-absence).

## Visual / text QA on gold PDF (planner, 2026-07-27)

**Met (craft / honesty):**
- Parcel-primary sheet: property tags + setback labels + contour elevs + north/scale readable in extract.
- Bearing+distance tags present (`N 89°58' W 98.3'` …) with page-1 line: *Property-line tags: GIS-approximate … not a boundary survey* and page-2 reinforcement *not survey-grade*. No survey-grade claim.
- Honesty footer exact family: *Derived from public GIS records. Not a boundary survey. Not for legal record.*
- STREET honest-absence (expected until B1).

**PARTIAL / live gaps (block full WDLL 3+6 MET):**
1. Summary zoning **R-1 fixture label** — live PE facets are **P-5**; must re-verify on live refresh, not this offline fixture.
2. Fixture setbacks **15/5/15** + buildable **10504** — live warm 34785 is front-15 + S/R not_specified + area **~13641**. Craft sample ≠ live vocab truth (B3 owns agreement; B2 sample must not be mistaken for live).
3. STREET absence copy still says *road-anchor atom* — stale vs B1 road-node path; refresh copy when B1 merges.
4. Contours sourced from **synthetic DEM** — craft OK; live 3DEP regenerate owed for sellable claim.

## Grade (pre-live)

| WDLL | Grade |
|---|---|
| 3 design pass | PARTIAL — offline gold reads as intentional deliverable; live regenerate unproven |
| 4 property-line tags | MET on sample (GIS-approximate honesty present) — reconfirm on live PDF |
| 6 customer QA | OPEN — live engine-api/PE export after deploy |

## Next

Deploy/merge only after coordinated go with B1 STREET + B3 vocab where they touch the same PDF SUMMARY. Live regenerate `48021:34785` via engine-api; paste PDF evidence.
