---
id: 2026-07-25_setback_export_gate_false_refusal_checkin
title: Check-in — setback export gate false refusal closed
status: closed
date: 2026-07-25
applies_to: hauska-engine, hauska-map/apps/property-explorer
related: [75o_site_plan_export_spec, _inbox/2026-07-25_site_plan_export_WDLL, _inbox/2026-07-25_setback_correctness_corner_lots_checkin]
owner: nick
---

# Check-in — setback export gate false refusal

## Observable end state (MET)

Signed-in (or gate-fronted) site-plan export on `48021:47595` (1010 Pecan, P-5) returns real PDF/DXF/IFC drawing F 15' with S/R disclosed as not specified / build-to-line governs. No false `setback_rule_missing` 422. A parcel with no setback-rule atom still 422s.

## Evidence

| Check | Result |
|-------|--------|
| Engine [#121](https://github.com/empressaioemail-tech/hauska-engine/pull/121) + [#122](https://github.com/empressaioemail-tech/hauska-engine/pull/122) | MERGED |
| Serving revision | `hauska-engine-api-00086-hoz` @ 100% (tag `setback-gate`) |
| Health | `service=engine-api` (not retrieval-api) |
| `48021:47595` refresh | 201; artifacts dxf/ifc/pdf-site-plan |
| GET + download | 200; PDF summary has honest F/S/R line; DXF has `not specified` / `build-to-line` |
| `48021:999999001` refresh | 422 `setback_rule_missing` |
| Pre-fix control (`00038`) | still 422 on 47595 |

## Ops note (load-bearing)

Do **not** `gcloud run deploy hauska-engine-api --source=.` from the monorepo root. Root `Dockerfile` is retrieval-api. Build with `cloudbuild.engine-api.yaml` / `services/engine-api/Dockerfile`, canary with `--no-traffic --tag=...`, confirm `/health` says `engine-api`, then shift traffic.

## Acceptance vs operator ask

| Ask | Grade |
|-----|-------|
| Refuse only when no setback atom | MET |
| Allow export when F specified + S/R not_specified | MET |
| Annotate silent axes honestly; do not invent S/R feet | MET (PDF summary + DXF legend) |
| Live verify 47595 + true-missing | MET |
| Watch Cloud Run traffic trap | MET (wrong-image rollback + correct canary shift) |
