---
id: 2026-07-13_cotality_swap_public_record_migration
title: Cotality swap — active migration to public-record providers, parallel adapters, insurance descoped
status: active
date: 2026-07-13
owner: nick
related: [75l_cotality_data_stack_catalog, 77b_cotality_integration_strategy, 55_spine_data_intelligence_stack, _decisions/2026-06-06_cotality_parcel_provider]
---

# Decision: migrate the spine data feeds off Cotality to public-record providers

## Decision

The 2026-07-06 fallback plan (chat transcript, never ratified) is promoted to an executed migration. Cotality has been dark at OAuth since its demo keys expired (~2026-07-06, `InvalidClientIdentifier` on token mint, vendor unresponsive). The RE wedge surfaces now run on free public-record providers behind the existing adapter ports, with all Cotality adapters left in place dormant behind config so re-entry is a flip, not a rebuild.

Ruled by Nick 2026-07-13: parallel providers, never line-by-line replacement; no Regrid ever (customer service, second ruling); insurance-specific data (RiskMeter successors, First Street/e2Value evals, insurability module) descoped until the RE apps ship; planner ran the program hands-off through deployment with adversarial review replacing the formal premortem as the QA gate.

## What shipped (all live in production 2026-07-14 UTC)

- **Map parcels**: county-GIS provider (Travis, Williamson, Bexar, Bastrop-new-host, Caldwell ArcGIS services) in front of the dormant Cotality Spatial Tile branch; neutral tile cache; honesty envelope (`notSurveyGrade`, provenance). ldt PR #242.
- **Neutral parcel join key**: CLIP when resolvable, else `apn:<fips>:<apn>` via county GIS, else `geo:` — capture never fails on vendor darkness; workspaces no longer strand keyless (they had been since ~07-06, ground-truthed). PR #243.
- **Provider-neutral couplings**: provider catalog replaces `cotality:`-prefix metering/sourceKind hardcoding; NWIS bbox precision fix mirrored; Bastrop county host migration mirrored. PR #244 (+ engine PRs #92/#93; latent tier-gate bug fixed in #246 — non-federal keys were dead on the brief path).
- **CAD property store**: `cad_property` + PACS/Orion ingest CLI (PR #245); production loaded with 1,069,018 properties (Travis 492,848 / Williamson 319,469 / Hays 131,246 / Bastrop 77,073 / Caldwell 48,382), owner/mailing/situs/exemptions/improvements/values with source vintage.
- **CAD brief slots**: `cad:property` / `cad:tax` / `cad:owner-occupancy` (derived absentee, disclosed method; assessed values labeled as assessed, never AVM). PR #246. E2E verified live: Bastrop brief serves all three layers cited to the CAD roll.
- **Engine free-data repairs** (independent of Cotality): NWIS groundwater, SGMC geology, Edwards Aquifer URL, Bastrop host — all live (engine rev 00022-pm4).
- **Command center**: proxied to deployed MCP/retrieval with server-held keys (hauska-map PR #20, cmdcenter deployed); live gate registers 63 tools `{public:6, codex:5, reporting:46, map:6}`.

Deploy state: cortex-api `00318-sin` @100% (rollback `00316-def`→`00314-lon`→`00312-ceh`); hauska-engine-api `00022-pm4` @100% (rollback `00036-hiv`).

## Known gaps (open work, dispatched or queued)

- Hays brief slots no-coverage until the TxGIO self-hosted geometry store lands (in flight: `feat/txgio-parcel-geometry`, also serves Hays/Comal map parcels + cad-ingest CLI URL/vintage fixes). Bexar: geometry+attrs live from county service; no free bulk CAD roll (PIR route).
- Rent/value AVM, comps depth, HOA, propensity: deferred per plan — MLS via eXp + RentCast (ToS verified permissive) later; propensity ships own-model or not at all.
- `ENGINE_API_GATE_TOKEN` unset on live engine (bearer gate off) — fix needs a caller survey before enforce.
- WCAD tax-year semantics (portal "Curr" columns ingested as 2026) to confirm on next roll refresh.

## Reversal criteria

If Cotality returns with production keys + entitlements: flip provider priority config (`TX_PARCEL_PROVIDER`, provider catalog) — no code removal happened, so re-entry is config plus the held engine OAuth-shape port. The public-record providers stay as the permanent free baseline and fallback regardless.
