# G1 rrc-pipelines build — scratch

## CP1 PRE-REGISTER (planner, 2026-08-12)

### Contract / identity
- atomTypeName: `rrc-pipeline-fact`
- contractVersion target: `1.20.0` (from published 1.19.0)
- entityIdShape: **bare `parcelNodeId`** (`{countyFips}:{propId}`) — mirror rail-corridor-fact; one atom per parcel; NO `:pipeline:` suffix. Persistence writes `entity_id = parcelNodeId`. Verify DID = `did:hauska:rrc-pipeline-fact:${a.entityId}` using the stored entityId value, never reconstructed.
- dedupeKey: `t4permit|p5_num` (never operator name). County-split segments of one physical pipeline share T4PERMIT+P5_NUM; collapse before composing the parcel claim.
- bufferMeters: **152.4** (exact 500 ft). Chosen to match rail-corridor-fact / sibling LINE proximity discipline and avoid well-fact's integer-152 (498.69 ft) discrepancy. Must appear on every atom body as `bufferMeters`.

### Body fields (attributes, NOT new rails)
- nearPipeline (bool), nearestPipelineDistanceMeters
- t4permit, p5Num, operatorName (display only), systemName, commodity, commodityDescription?, systemType?, status?, diameter?, interstate?
- sourceTier: `rrc-public-gis` | `absent`

### Source
- READ `tx_rrc_pipeline` only (staged). Never live-fetch RRC REST per run.
- Columns verified: pipeline_row_id, p5_num, t4permit, operator, system_name, commodity, commodity_description, system_type, status, diameter, interstate, county_fips, county_name, geometry, west_lng/south_lat/east_lng/north_lat, source*

### Dry-run counties (limit=200 each; NO --apply)
| county | role | segs in tx_rrc_pipeline | expected presentNear (nearPipeline=true) | expected presentOutside/absent |
|---|---|---:|---|---|
| 48329 Midland | Permian dense | 11996 | NON-ZERO; band 5–45% of sample | majority outside buffer (honest) |
| 48201 Harris | Gulf Coast metro | 8475 | NON-ZERO; band 2–35% of sample | majority outside |
| 48043 Brewster | rural sparse | 5 | 0–few (≤5% of sample); may be 0 if no parcel within 500ft of those 5 segs | dominant; ZERO-on-all-three is FAIL (probe source extent first) |

Definitions for close artifact:
- planned = atoms constructed (= parcels evaluated under --limit)
- present = nearPipeline true
- absent = nearPipeline false OR typed absence (no-parcel-geometry / coverage)
- errors = 0 required

### Ending ledger expectation
- after LDT bind + `countyRailRefreshCli --apply`: rrc-pipelines `not-yet` ×254 (NOT satisfied). If satisfied → STOP (eighth instrument defect).
- hasWriter derivation: filesystem probe; confirm writer file visible from refresh cwd/root after S1 #413.

## GROUND-TRUTH (2026-08-12T14:20Z)
- contract 1.20.0 published; eng #314 merged; ldt #415 merged
- PROPERTY_ENTITY_TYPES 15→16; writer on origin/main
- dry-runs: Midland 144/199 near, Harris 128/200 near, Brewster 0/200 near (head sample)
- CP2 resample: Midland rand 26.5%, Harris rand 23% (inside CP1 bands)
- ledger: county_rail dim present+hasWriter; displayState not-yet ×254; coverage 0
- close: `_inbox/2026-08-12_G1_rrc_pipelines_build_close.json`

## LESSON
- Head feature_index LIMIT samples can wildly inflate near-rates on linear rails in corridor-dense counties; CP1 bands should be checked against random/offset samples before declaring a geometry defect.

## OPEN
- Apply lane still owed (dispatch forbade --apply). Until apply+scorer, rail stays not-yet ×254.
