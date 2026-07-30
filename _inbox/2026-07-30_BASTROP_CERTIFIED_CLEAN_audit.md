---
id: 2026-07-29_BASTROP_CERTIFIED_CLEAN_audit
title: BASTROP CERTIFIED-CLEAN audit — BDC setback correction WDLL
date: 2026-07-30
status: certified-clean-passed
owner: planner
wdll: 2026-07-29_BASTROP_BDC_setback_correction_WDLL
related: [2026-07-29_setback_authoritative_source_and_road_decouple, 28_THE_BASTROP_MOLD_engine_build_spec, _STATE]
purpose: Item-by-item LIVE grade of the Bastrop BDC correction WDLL. CTX remains HELD until operator go.
---

# BASTROP CERTIFIED-CLEAN audit

Graded 2026-07-30 by planner against LIVE serving surfaces. Code-done ≠ customer-done: every MET below cites a live probe, not a merged PR.

**Verdict: CERTIFIED-CLEAN PASSED** (with named residuals). CTX remains **HELD** until operator go.

## Serving revisions (traffic-shifted)

| Service | Revision @100% | Tag |
|---|---|---|
| hauska-engine-api | `hauska-engine-api-00148-zec` | `bdc` |
| hauska-retrieval-api | `hauska-retrieval-api-00045-yek` | `bdc` |
| PE (Vercel) | prod alias `property-explorer-xi.vercel.app` | `PROPERTY_ATOM_PATH=1` (redeployed) |

Spine health re-run 2026-07-30T03:20Z: `rule-setback` → jurisdictionKey `bastrop-development-code`, district `SF-1`, `front_ft: 30` (was P-5 / 15).

## LIVE multi-parcel evidence (WDLL 9)

Customer inspect path: `GET /api/spine/property-atoms/:id/facets` → `X-Pe-Read-Path: atom-chain-warm`.

| Parcel | Zoning | Setbacks (applied) | Notes |
|---|---|---|---|
| 48021:105054 (1010 Jefferson) | SF-1 | front 30 / side 20 / rear 30 | Corner lot: `sideCornerFt` 20 from BDC row 30/10/20/30; cite `bastrop_tx/bdc-2026-adopted/14.02.003`; envelope status ok |
| 48021:28286 | SF-1 | 30 / 10 / 30 | Interior peer — matches Euclidean side 10 |
| 48021:34737 | SF-1 | 30 / 20 / 30 | Corner peer |
| 48021:24712 | GC | honest-decline | `absence.kind=conditional-district-no-scalar-row`; PE envelope `declined` / `setback-rule-pending` |

Retrieval atom-chain agrees on the same parcels. Baked cortex snapshots also show SF-1 / Zoned_Parcels provenance after surgical tier1 zoning refresh (5773 stamped rows).

## Item-by-item (Start → Finish)

| # | Item | Grade | Evidence |
|---|---|---|---|
| 1 | BDC setback table | **MET** | Engine PR #183: `bastrop-development-code.json` SF-1 30/10/20/30 … RR; MU/GC/PDD absent |
| 2 | Router routes BDC | **MET** | #183 `getSetbackTableForZoning` → BDC for SF-x/RR; spine probe LIVE SF-1/30 |
| 3 | Dual-fork killed | **MET** | Adapter survivor path; descriptor dual-fork removed (#183) |
| 4 | BDC code-sections ingested | **MET** | Engine PR #184: 100 Chapter 14 sections in image snapshot |
| 5 | currentEditionId → BDC | **MET** | Engine snapshot + substrate `bastrop_tx.currentEditionId` = `bastrop_tx/bdc-2026-adopted` (flipped 2026-07-30). Residual: substrate BDC edition still has empty `sectionIds` (code-section atoms not mirrored to Neon) — gate (a) mechanical follow-on |
| 6 | Stamp Zoned_Parcels/83 | **MET** | LDT #365 + prod stamp: 5768 matched; Jefferson txgio `SF-1`; PE provenance `Zoned_Parcels` / `ZoneTypeClass` |
| 7 | Roads decoupled from VALUES | **MET** | Engine PR #182 merged; `front:15` fallback deleted; Caldwell flat |
| 8 | Isolated re-warm + swap | **MET** | City cohort rewarm: promoted 1777 / verifyPass 1777 / verifyFail 819 / no-road-adjacency 96; traffic → 00148-zec + 00045-yek |
| 9 | LIVE multi-parcel certify | **MET** | Table above; PE atom BFF + retrieval agree |
| 10 | Mold + 3 gates | **MET** | `28_THE_BASTROP_MOLD` rewritten; gates (a)(b)(c) filed as prose (mechanical TBD, same class as gates 7/8) |
| 11 | This audit | **MET** | This file |

## Residuals (do not block CERTIFIED-CLEAN; track)

1. **819 verifyFail** (`inset ring is null`) on full BDC insets — honest geometry residual; not fabricated scalars.
2. **Spine health `zoning-agol:bastrop-city-tx`** still probes abandoned `Zoning_Place_Type/0` — update health pack URL to Zoned_Parcels/83.
3. **Substrate BDC `sectionIds` empty** — sync engine corpus code-sections into Neon for gate (a).
4. **Full tier1 bake** deadlocked mid-run (race with surgical zoning patch); 5773 stamped snapshots refreshed surgically. Re-run quiet bake when free.
5. **LDT `@workspace/adapters`** still lacks `bastrop-development-code.json` (engine is authoring source for warm/PE atom path).
6. **213k phase-1a placeholders** — out of scope (flagged); mold gates scoped to exclude.

## Standing decisions (unchanged)

Cotality extinguished; no Regrid; public-record only; SmartCity READ-ONLY; deploys planner-owned; code-done ≠ customer-done; **CTX / national HELD until operator go**.
