---
id: 2026-08-05_T2_track_close_report
title: T2 polish + product track close report
date: 2026-08-05
status: amended-failed-operator-qa-2026-08-06
owner: nick
related: [T2_polish_product_track, CATCHUP_program_2026-08-05, QUEUE_parked_work_index]
---

# T2 track close report (2026-08-05)

Planner-verified live evidence for catch-up program TRACK T2. Master planner re-verify before flipping program ledger.

## Workstream grades

| # | Workstream | Grade | Live evidence |
|---|---|---|---|
| 1 | CAD/DXF text regression | MET | Regressing change: **`cdaae2b` / PR #255** — export F/S/R refresh placed SETBACK role labels on same property-ring midpoints as DIMENSION lengths (109 Higgins `48021:31362`). Fix: engine [#257](https://github.com/empressaioemail-tech/hauska-engine/pull/257) (offset DIMENSION outward, SETBACK inward; legend below AABB). Serving: `hauska-engine-api-00165-buz` @100% tag `t2-dxf-text`. Regression: `packages/engine-core/src/site-plan/__tests__/emitters.test.ts`. |
| 2 | Pedestrian-path style | MET | hauska-map [#153](https://github.com/empressaioemail-tech/hauska-map/pull/153). Before: `#c9b88a` dashed `[2,2]`. After: `#60b4ff` dots `[0.5,2]`, opacity 0.45→0.75. Live bundle grep: `index-h2GW8147.js` contains `m5="#60b4ff",g5=[.5,2]`. |
| 3 | Rebrand set | MET | PE `https://property-explorer-xi.vercel.app` — title `Smart Site — Explore your property`; manifest `name/short_name: Smart Site`; favicon crosshair SVG (`aria-label="Smart Site"`). Deploy `dpl_86xbKyJChMmrX3QLbPXeLH8UgJpd`. |
| 4 | PDF Smart Site branding | MET | PE brief print: `SMART SITE X-RAY` in `brief-print-html.ts` (on main since 4f7dbd7). Engine site-plan PDF: `SITE_PLAN_BRAND_KICKER = "SMART SITE"` → eyebrow `SMART SITE · SITE PLAN · SHEET N OF M` (#257). |
| 5 | Paywall E2E support | PARTIAL (operator) | Support doc: `90_runbooks/pe_paywall_e2e_operator.md`. Live probes: `GET .../entitlement` 200; `POST .../claim-session` 401-not-404. Four operator actions (unlock price secret, dev-role, promo checkout, claim smoke) still owed for WDLL 1-3, 8. |
| 6 | Product-surface smoke suite | MET | `90_runbooks/product_surface_smoke_suite.md` + `scripts/product-surface-smoke.mjs`; factory runbook §5 link. Post-deploy run: **16/16 PASS** (`_scratch/product-surface-smoke-last.json`). |
| 7 | Domain attach | PARKED | Operator has not purchased Smart Site domain; item stays parked per T2 spec. |

## Deploys (planner-owned)

| Surface | Revision / deploy | Verify |
|---|---|---|
| PE | `dpl_86xbKyJChMmrX3QLbPXeLH8UgJpd`, bundle `index-h2GW8147.js` | Alias + manifest + favicon curl |
| engine-api | `00165-buz`, tag `t2-dxf-text`, image `t2-dxf-90dea02` | `/health` 200; tag-smoke-shift verified |

## Permanence (per CATCHUP Permanence Rule)

- DXF text separation + regression test → permanent in engine CI (`emitters.test.ts`)
- Smart Site PDF kicker → permanent in engine site-plan renderer
- Product smoke suite → `90_runbooks/product_surface_smoke_suite.md` + factory runbook §5
- Paywall operator path → `90_runbooks/pe_paywall_e2e_operator.md`

## Open for operator

1. Visual confirm pedestrian blue dots on Higgins St map (toggle `pedestrian-ways` layer)
2. Open 109 Higgins DXF export in CAD after fresh site-plan refresh (paid session)
3. Paywall four-action E2E per runbook
4. Domain purchase when ready
