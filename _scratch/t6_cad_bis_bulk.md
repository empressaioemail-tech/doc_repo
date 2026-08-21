# T6 BIS bulk CAD probe — 2026-08-05

## GROUND-TRUTH (2026-08-05T~20:00Z)

- Executor: `_scratch/t6_cad_bis_bulk_executor.py`
- Batch summary: `_inbox/t6_cad_batch_bis_bulk.json`
- Method: `{CountyToken}CADWebService` ArcGIS search → four-point probe; one GIS hub fallback; else `honestly_absent`
- Rate limit: 0.5s/request (~2 rps)

## Counts (all 253 probe files regenerated)

| Status | Count |
|--------|------:|
| verified | 173 |
| partial | 19 |
| honestly_absent | 55 |
| not_found | 3 |
| other (probe_failed etc) | 3 |
| **BIS CADWebService verified** | **145** |
| GIS hub verified (non-BIS) | 28 |

Explicit skip (no probe required): 48113 Dallas, 48209 Hays, 48397 Rockwall.

## LESSON

First-pass GIS hub fallback was too permissive (RAMP_Viewer, NC railroads, land_parcels_150 statewide layer marked verified). Fixed by: (1) strict BIS pick requiring `CADWebService` in URL; (2) conservative GIS hub filter; (3) verified status requires `prop_id_candidates`. Re-probed 33 false positives → mostly `honestly_absent`.

## OPEN

- 48107 Crosby: `probe_failed` on prior artifact — needs manual re-probe
- Partial counties (19): mostly BIS CADWebService with sample_query or count failures — adversarial pass
- Harris 48201: honestly_absent REST after tightened filters — HCAD planning object still separate track
