---
id: 2026-07-27_COMPLETE_BASTROP_D1_regrade
title: D1 re-grade — COMPLETE-BASTROP S0/S1 + premortem (mold gate)
date: 2026-07-27
status: planner-regrade
owner: adversarial-audit planner
wdll: 2026-07-27_COMPLETE_BASTROP_hardening_WDLL items 11–12
verdict: Bastrop APPROVABLE (hardening gate)
---

# D1 re-grade — live-verified

Planner-owned. Every S0/S1 line below cites a live observation from this session (2026-07-27). Builder reports are not acceptance.

## Slice close order (this session)

| Slice | Action | Evidence |
|---|---|---|
| A1 | MERGED engine #154 + LDT #360; M0 on main `zoning-provenance-m0.test.ts` | gold SELECT below |
| B1 | Migrated `006_spine_health_probe`; retrieval cutover to `00025-k5b` (tag `complete-bastrop`); live `/health/spine/run` | board JSON `_inbox/2026-07-27_COMPLETE_BASTROP_B1_live_spine_run.json` |
| C2 | MERGED engine #155; `dead-expected` status + honesty header | main `bastrop-tx.ts` + live probe row |
| C1 | Already MERGED prior session | dual SHA + `@empressaio/atom-contract@^1.11.0` |

## Commitment #1 tell (A1)

```text
SELECT atom_did, body->>'district', body->>'sourceAdapter', body->>'sourceUrl'
FROM atoms WHERE atom_did='did:hauska:zoning-fact:48021:33512';

atom_did | district | adapter | url
did:hauska:zoning-fact:48021:33512 | P-5 | txgio-zoning-stamp:bastrop-city-tx
| https://services7.arcgis.com/qOeXJdBtGknaCJC4/arcgis/rest/services/Zoning_Place_Type/FeatureServer/0
```

NOT `hauska.dev/internal/breadth-atom-bake`. District cohort: `district_agol=5769`, `district_bake=0`, `district_total=5769`.

M0 on main: `packages/engine-core/src/property-reasoning/__tests__/zoning-provenance-m0.test.ts` (blob `d1f99640…`) — fails if district && empty `zoning.provenance.sourceUrl`.

## B1 live board (paste summary)

`GET https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app/health/spine/run` → HTTP 200, `persisted=true`, `alertCount=1`, `probedAt=2026-07-27T16:09:29.500Z`.

| probeId | status | alert | note |
|---|---|---|---|
| bastrop-tx:zoning | **dead-expected** | false | replacement zoning-agol:bastrop-city-tx |
| osm-overpass | **dead** | **true** | baseline 1000, Overpass HTTP 504 — silent-zero path CATCHES |
| zoning-agol:bastrop-city-tx | firing | false | count 574 |
| reasoning-chain / rule-setback | firing | false | gold 48021:33512 |

Neon `spine_health_probe` rows match (bastrop-tx:zoning dead-expected; osm-overpass alert=true).

Migration: `006_spine_health_probe.sql` recorded in `schema_migrations` at `2026-07-27T16:05:10.804Z`.

## S0/S1 item-by-item

| ID | Sev | Grade | Live evidence |
|---|---|---|---|
| S-01 | S0 | **CLEARED** | Gold + cohort cite AGOL Zoning_Place_Type (above). 0 district facts cite breadth-atom-bake. |
| S-02 | S0 | **CLEARED** | Tier-1 `zoning_present=5769` = `zoning_has_prov=5769` = `top_zoning_source=5769` (`adapter_key=node-facets:tier1`, `place_key LIKE node:48021:%`). |
| S-03 | S0 | **CLEARED** | Live spine pack + persist; dead-expected quiet; zero/error-vs-baseline alerts (osm-overpass). |
| S-04 | S1 | **CLEARED** | txgio 48021: `with_district=6213`, `with_jurisdiction_bastrop_city=6213`, `zd_without_zj=0`. |
| S-05 | S1 | **CLEARED** | engine vs LDT `bastrop-city-tx.json` SHA256 identical `76f011241644973d648244a3d8c3eef020a5676c67266508e8bf25e092097c14` (19670 bytes each) on origin/main. |
| S-11 | S1 | **CLEARED** | Track B closed MET (`_inbox/2026-07-27_TRACK_B_STATUS.md`). Live retrieval `GET /road-nodes/near-bbox` for gold bbox → `count=400` roads with LineString edges. |
| S-12 | S1 | **CLEARED** | Opaque-origin skeleton gone: gold has GIS `sourceUrl` + citation. `assertedConfidence.provenance=asserted` remains the honest fallback (commitment #2), not a bare unearned number without citation. |

### S2 scrubbed this program (not S0/S1 but WDLL-required)

| ID | Grade | Evidence |
|---|---|---|
| S-06 / H3 | **CLEARED** | engine #155 on main; provider/status `dead-expected`; live probe matches. |
| S-08 / H2 | **CLEARED** (C1) | `@empressaio/atom-contract@^1.11.0`; no live `@hauska/atom-contract`. |
| S-13 | **ACCEPTED** | `FIXTURE-ONLY` header on `property-atom-proof.ts` (main). |
| S-09/S-10/S-14 | **ACCEPTED in writing** | `_decisions/2026-07-27_complete_bastrop_hardening_wdll_approved.md`. |

## Premortem — "Approve Bastrop as the 254-county mold"

Move under test: declare Bastrop the approved mold for factory fan-out after this hardening gate.

1. **Sell reasoning, not data.** GREEN — gold zoning-fact carries sourceUrl, sourceCitation, reasoningChain, readContract axes, timestamps.
2. **Confidence is earned, not asserted.** GREEN for mold gate — asserted baseline carries `provenance=asserted` plus real GIS citation; M0 blocks strip; earning loop not claimed as calibrated. (Was RED when citation was bake-only.)
3. **Cost per jurisdiction.** GREEN — provenance + jurisdiction stamp + hash-lock + health pack are recipe-shaped, not one-off archaeology.
4. **Dual interface.** YELLOW operational — CC Spine Health panel shipped (map #79); customer surfaces still follow product roadmap.
5. **Hauska spine.** GREEN — atoms + retrieval probes + Tier-1 are spine.
6. **Focus queue.** GREEN — COMPLETE-BASTROP was the active mold gate.
7. **Quality gate.** GREEN — attribution + confidence + timestamp present on the commitment-#1 atom.

**Overall: GREEN** (operational yellow on #4 only).

## Verdict

**Bastrop APPROVABLE** for the COMPLETE-BASTROP hardening / mold-approval gate: all S0/S1 cleared with live evidence; S3 acceptances unchanged in writing; commitment #1 premortem green.

Next (out of this WDLL): customer QA / mold stamp ceremony; do not silently fan the recipe across 254 without that stamp. Residual non-blockers: OSM Overpass flaky 504 (now alerts), S-14 bake lag monitored on board, H5 underscore jurisdictionKey residual if still present on some envelopes.
