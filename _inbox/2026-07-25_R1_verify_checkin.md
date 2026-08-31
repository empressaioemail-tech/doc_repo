---
id: 2026-07-25_R1_verify_checkin
title: Check-in — R1 planner verify (road nodes live in ledger; inspect hotfix owed)
status: check-in
date: 2026-07-25
planner: depth-engine planning agent
---

# R1 verify check-in

## Merges / publish

| Artifact | Result |
|---|---|
| atom-contract #10 | merged `4e32a74`; tag `v1.11.0`; npm `@empressaio/atom-contract@1.11.0` |
| engine #123 | merged `e3e3883` |
| map #68 | retargeted main (F1c already landed), conflicts fixed, merged `3223d3bd` |

## Live ledger evidence (G1 — pasted)

Ingest (planner-run against substrate Neon via `DATABASE_URL` / hauska-prod-497015):

```json
{"sprint":"R1-road-node","countyFips":"48021","ingested":1,"roads":[{"roadNodeId":"48021:road:123456789","displayName":"Spring Street"}]}
```

psql SELECT:

```
 bastrop_road_nodes 
--------------------
                  1

 road_node_id         | display_name  | width_ft | prov
 48021:road:123456789 | Spring Street | 50       | approximate-assumed-per-class

 attach_n | classification | geom
        1 | residential    | LineString
```

retrieval-api canary `hauska-retrieval-api-00027-jac` → shifted 100%:

```
roadRollup={"road_nodes":1,"named_roads":1,"byCounty":[{"fips":"48021","county":"Bastrop","road_nodes":1,"named_roads":1}],"sampleNamed":[{"roadNodeId":"48021:road:123456789","displayName":"Spring Street"}]}
```

## Inspect path — FAIL (hotfix in flight)

```
GET /road-nodes/48021:road:123456789/atom-chain → 500
UNDEFINED_VALUE in findCalibratedConfidence (property calibration applied to road-node)
```

R1.1 hotfix dispatched; WDLL 3 inspect not MET until fixed + redeployed.

## Grade

| Item | Grade | Evidence |
|---|---|---|
| 27c WDLL 3 | **PARTIAL** | Road nodes on one substrate + live tally + assumed-ROW provenance MET. Inspect atom-chain 500 blocks full MET. Pilot uses fixture OSM way id (live Overpass ingest follow-on). |

## Next

1. Land R1.1 → redeploy retrieval-api → re-probe atom-chain.
2. Then R2 road-type-aware setbacks.
