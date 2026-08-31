---
id: 2026-07-25_R1_1_live_verify_checkin
title: Check-in — R1.1 live verify; WDLL 3 MET
status: check-in
date: 2026-07-25
planner: depth-engine planning agent
pr: https://github.com/empressaioemail-tech/hauska-engine/pull/124
merge_sha: 92982a836524ae7bb3e5028b0fd3b6ee8fdde48b
serving: hauska-retrieval-api-00029-jaj
---

# R1.1 live verify — WDLL 3 MET

## Evidence

```
PR #124 CI green; merge 92982a8
getRoadAtomChain on main: storage rows only (no applyPropertyCalibrationAtRead)

Deploy: hauska-retrieval-api-00029-jaj (tag r11fix) → 100% traffic

CANARY/PROD GET /road-nodes/48021:road:123456789/atom-chain → 200
  roadNodeId=48021:road:123456789
  displayName=Spring Street
  classification=residential
  row.provenance.kind=approximate-assumed-per-class
  attachPoints=1
  centerline=LineString
  atoms=1

roadRollup.road_nodes=1 sampleNamed=Spring Street
```

## Grade

| Item | Grade | Evidence |
|---|---|---|
| 27c WDLL 3 | **MET** | Named Bastrop road node on one substrate; live tally + inspect both green; digital-twin attach points present; assumed-ROW provenance honest. Pilot fixture OSM way (live Overpass ingest = follow-on). |

## R1 status

**R1 CLOSEABLE.** Next: R2 road-type-aware setbacks.
