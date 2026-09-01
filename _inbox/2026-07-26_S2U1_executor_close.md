---
id: 2026-07-26_S2U1_executor_close
title: S2-U1 executor close — StreetsSurveyed2016 ingest
date: 2026-07-26
status: executor-close
owner: nick
dispatch: 2026-07-26_S2U1_streets_surveyed_2016_ingest
repo: hauska-engine
---

# S2-U1 executor close — StreetsSurveyed2016 ingest

Executor close for Stage 2 Unit 1. **Planner verifies; executor does not self-grade Stage 2 done.**

## PR + SHA

| Field | Value |
|-------|-------|
| PR | https://github.com/empressaioemail-tech/hauska-engine/pull/137 |
| Head SHA | `0563481` |
| Branch | `feat/s2u1-streets-surveyed-2016-ingest` |
| Base | `main` @ `12ab8a1` (PATCH-A) |

## Live road-node counts (substrate 48021)

| When | road_nodes total | county-surveyed-2016 | approximate-assumed-per-class (OSM) |
|------|------------------|----------------------|-------------------------------------|
| BEFORE (`2026-07-26_S2_BEFORE_baseline.json`) | **4894** | 0 | 4894 |
| AFTER live ingest (`2026-07-27T03:08Z`) | **6201** | **1307** | 4894 |

Delta: **+1307** county surveyed segments ingested (full county layer; 1307 ArcGIS features).

## Sample county atom bodies (U1.1)

**48021:road:900000002** — POTATO SMITH RD (gravel):

```json
{
  "roadNodeId": "48021:road:900000002",
  "classification": "gravel",
  "displayName": "POTATO SMITH RD",
  "row": {
    "provenance": {
      "kind": "county-surveyed-2016",
      "countySegmentObjectId": 2,
      "countyClass": "LS",
      "countySurface": "Unpaved/Gravel CR",
      "note": "Bastrop County surveyed streets 2016 — authoritative surface/class"
    },
    "assumedWidthFt": 30
  },
  "sourceAdapter": "road-intake-county-streets-surveyed-2016"
}
```

**48021:road:900000001** — OLD MCDADE RD (residential / Two Course/Paved CR): classification `residential`, provenance `county-surveyed-2016`, objectid=1.

## Labeling before/after (U1.4 — city specimens)

County layer is **county CR network** (1307 segments); city grid streets (Chestnut, Spring, gravel cohort parcels) remain **OSM fallback** where county has no segment — honest per recon.

| Parcel | BEFORE (OSM proxy baseline) | AFTER (county + OSM load) |
|--------|----------------------------|---------------------------|
| **48021:28286** | e2 front/residential | e2 front/residential, **provenance=osm-fallback** (unchanged — no county hit) |
| **48021:34785** | e3 front/unclassified | e3 front/unclassified, **provenance=osm-fallback** (unchanged) |
| **48021:33512** | e3 rear/alley(service), e4 front/residential | same roles, **provenance=osm-fallback** |
| **48021:104985** | e8 front/residential (OSM gravel cohort) | e8 front/residential, **provenance=osm-fallback** |

**U1.2 unit-test proof (county wins on disagreement):** `county-osm-priority.test.ts` — county gravel beats OSM service/alley on same edge; county residential beats OSM secondary+footway on 34785 ring fixture.

**U1.3 OSM fallback:** all four live city specimens retain `osm-fallback` on labeled edges (county segments do not cover city bbox grid).

## Vitest / CI (U1.5)

Local vitest (engine-core @ `0563481`):

```
Test Files  54 passed (54)
     Tests  312 passed (312)
  Duration  ~17s
```

Includes unchanged **FRONT-LABELING FIXTURE GATE** (4/4) + new S2-U1 guards (9 tests).

CI: PR #137 — planner to confirm green on merge gate.

## Ingest command (live evidence)

Win32 Node TLS dead-end on ArcGIS (same class as Overpass). Used PowerShell export → fixture → ingest:

```powershell
# export 1307 features to bastrop-streets-surveyed-2016-live.json (gitignored)
$env:PROPERTY_ATOM_PATH='1'
$env:DATABASE_URL=(Get-Content "$env:TEMP\r4_urls\substrate.txt" -Raw)
$env:ROAD_INTAKE_FIXTURE='P:\hauska-engine\packages\engine-core\src\road-intake\fixtures\bastrop-streets-surveyed-2016-live.json'
pnpm --filter @hauska-engine/engine-core run ingest-bastrop-roads-county-surveyed
```

Report: `segmentsParsed=1307`, `ingested=1307`, `elapsedMs=10899`.

## WDLL item map (executor cites — planner grades)

| # | Executor evidence |
|---|-------------------|
| U1.1 | +1307 live nodes; sample atoms above |
| U1.2 | `county-osm-priority.test.ts` + priority in `edgeLabeling.ts` |
| U1.3 | Live specimens show `osm-fallback` where county absent |
| U1.4 | Before/after table above |
| U1.5 | vitest 312/312 paste |

## M0 scratch block (return only — planner gates promotion)

```
LESSON (S2-U1): StreetsSurveyed2016 is county CR network (~1307 segments), NOT city street grid — city cohort specimens stay OSM fallback until a city streets layer is sourced; county wins where segment exists (unit-tested + preferRoadHit).
LESSON (S2-U1): Win32 Node fetch to maps.co.bastrop.tx.us fails TLS (UNABLE_TO_VERIFY_LEAF_SIGNATURE) — same dead-end as Overpass; PowerShell Invoke-RestMethod + ROAD_INTAKE_FIXTURE ingest path required on Windows executors.
LESSON (S2-U1): county road ids use synthetic osmWayId = 900_000_000 + objectid to preserve G6 `{fips}:road:{id}` shape without colliding OSM way ids.
DEAD-END: expecting live 34785/104985 labeling flip from county ingest alone — layer has zero Chestnut/Spring/Bastrop-muni segments; recon-verified.
GROUND-TRUTH (2026-07-27T03:08Z live substrate): road_nodes=6201 (4894 OSM + 1307 county-surveyed-2016); depth_warm=3538 unchanged by this unit.
GROUND-TRUTH (2026-07-27 vitest @0563481): 312/312 pass including FRONT-LABELING FIXTURE GATE + county-osm-priority guards.
OPEN: planner live re-verify PR #137 CI + specimen labels; city street authoritative layer is a separate sourcing follow-up (not S2-U1 scope).
OPEN: Central-TX HELD — do not fan.
```

## Out of scope (confirmed not started)

- Unit 2 boundary primitive
- Unit 3 offset consume rewire
- TxDOT, PostGIS, Central-TX
- Weakening geometry / front-labeling gates
