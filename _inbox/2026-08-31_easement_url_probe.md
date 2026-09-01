# Easement GIS layer probe — migration 0005a source_url verification

Probe date: 2026-08-30. Read-only HTTP GET, `curl --max-time 30`. No writes.
Snapshot: live public ArcGIS endpoints as of run time. No repo or store read/write.

## Verdict table

| layer_key | verdict | T3 count | live count |
|---|---|---|---|
| bastrop-city-easements-43 | **confirmed** | 148 | **155** (mismatch +7) |
| mclennan-cad-easement-lines-9 | **unreachable** | 44197 | n/a |
| mclennan-cad-easement-text-10 | **unreachable** | 16578 | n/a |
| round-rock-easements | **dead** (site down; URL also contradicted by city catalog) | — | n/a |
| cedar-park-easements | **dead** (404; real layer lives elsewhere) | — | n/a |

---

## 1. bastrop-city-easements-43 — CONFIRMED

`GET .../Easements_/FeatureServer/43?f=json` -> HTTP 200, real layer descriptor:

```
{"currentVersion":12,"id":43,"name":"Easements","type":"Feature Layer",
 "serviceItemId":"a51cfc400d76412e88943dbc33170160","displayField":"Name",
 "geometryType":"esriGeometryPolygon", ...}
```

Fields (easement-shaped): OBJECTID, StName, Ownership, Status, Dedication, Name, Deed,
Record, Date, RecordedID, RID2, RID3, ProjectNo, DocumentNo, ProjectName, ORDRES,
Shape__Area, Shape__Length. Polygon geometry.

Count: `{"count":155}` — **T3 recorded 148. Live is 155. Mismatch of +7, not rounded.**
Consistent with ordinary editing drift (layer `dataLastEditDate` 1786995485461). It is
still a mismatch, and the stored T3 count is stale.

Sample (OBJECTID 1): StName='Agnes Street', Status='DRAINAGE', Dedication='With Plat',
Ownership=' ', Deed=' ', Date=None, RecordedID=0, Shape__Area=52841.115234375.
Geometry: `{"rings": [[[3241649.60860063, 10015257.0267896], [3241604.0640723, 10015264.788`

Note: several fields carry `' '` / `0` / `None` sentinels rather than true absence.

---

## 2 and 3. mclennan-cad-easement-lines-9 / -text-10 — UNREACHABLE

Both layer URLs, and the service root, return the same body at HTTP 200:

```
{"error":{"code":400,"message":"Invalid URL","details":["Invalid URL"]}}
```

Org root `https://services8.arcgis.com/5e4b1SY8bogTc3pH/arcgis/rest/services?f=json`:

```
{"currentVersion":12,"services":[]}
```

**Instrument control (positive):** the same root form against the Bastrop org
`services7.arcgis.com/qOeXJdBtGknaCJC4` returns a full service list (AddressPerRequest,
Agreements, Basemap, BPL, CCNs_City, City_Limit_and_ETJ_Map_WFL1, Creeks, ...).
The listing method works, so the empty McLennan list is a real negative.

**Instrument control (violation test):** fabricated org ids (`ZZZZfakeORGid99`,
`aaaaaaaaaaaaaaaa`) return `{"error":{"code":400,"message":"Invalid URL"}}`, NOT an empty
services array. **Therefore `5e4b1SY8bogTc3pH` is a genuine, existing AGOL org id that
currently exposes zero public services.**

Two mechanisms, weighed:

- (A) URL synthesised and counts fabricated. Argues against: a 16-character random AGOL
  org id cannot be pattern-completed, and this one verifiably resolves. The T3 counts
  (44197, 16578) are specific and non-round.
- (B) Service was real and public at T3 recon time, since deleted or unshared.
  **Preferred.** It explains the real org id, the specific counts, and that AGOL item
  search for "McLennanCAD" and "McLennan easement" now both return total 0.

Follow-up, negative: `webmap.trueautomation.com/arcgis/rest/services/MclennanMapSearch/MapServer?f=json`
-> `{"error":{"code":404,"message":"Service not found"}}`.

**Conclusion: unreachable today. Not evidence of synthesis — evidence of a source that
has gone away, which the store still records as a live `gis-layer`.**

---

## 4. round-rock-easements — DEAD

`GET .../services/Easements/MapServer/0?f=json` -> HTTP 200:

```
{"error":{"code":500,"message":"9017$SITE_NOT_INITIALIZED","details":[]}}
```

Identical error at the site root `https://maps.roundrocktexas.gov/arcgis/rest/services?f=json`.
The whole ArcGIS Server instance is not serving, so probing that host alone cannot
distinguish a wrong service name from a down site.

Resolved with a second, independent source. AGOL item search (`q=Round Rock easement`)
returns items owned by `roundrockgis`:

```
Easements | Feature Service | roundrockgis
  https://maps.roundrocktexas.gov/arcgis/rest/services/Planning/Planning_Multi/MapServer/16
Encroachment Agreements | roundrockgis
  https://maps.roundrocktexas.gov/arcgis/rest/services/Planning/Planning_Multi/MapServer/19
Stormwater Easement | roundrockgis
  https://services.arcgis.com/KaARkuoKF9vrGr3P/arcgis/rest/services/Stormwater_Sewer_Easement/FeatureServer
```

**The city's own catalog places Easements in folder `Planning`, service `Planning_Multi`,
layer 16 — not at `/services/Easements/MapServer/0`. The migration URL is wrong
independently of the site being down.** That real path also returns SITE_NOT_INITIALIZED,
confirming the host is genuinely down too.

The AGOL-hosted alternative resolves but has no layer 0:
`{"error":{"code":400,"details":["The requested layer (layerId: 0) was not found."]}}`.
Its service root lists exactly `layer 1 = Stormwater Sewer Easement` — a narrower subject
than general easements.

**Call: pattern-completed guess.** Template `/arcgis/rest/services/<Subject>/MapServer/0`
with index 0, contradicted by the city's real catalog path.

---

## 5. cedar-park-easements — DEAD at the migration URL; real layer found elsewhere

`GET https://gis.cedarparktexas.gov/arcgis/rest/services/Easements/FeatureServer/0?f=json`
-> **HTTP 404**, IIS HTML error page (not an ArcGIS error body):

```
<title>404 - File or directory not found.</title>
<h2>404 - File or directory not found.</h2>
```

The path `/arcgis/rest/services` does not exist on that host at all; the root 404s too.

AGOL item search (`q=Cedar Park easement`) returns, owned by cedarpark accounts:

```
Easements | Feature Service | auzzie.krobatsch_cedarpark
  https://gis.cedarparktexas.gov/mapping/rest/services/VIEW/Easements/FeatureServer
Easements | Map Service | auzzie.krobatsch_cedarpark
  https://gis.cedarparktexas.gov/mapping/rest/services/VIEW/Easements/MapServer
Easements | Map Service | chris.martinez_CedarPark
  https://gisrest.cedarparktexas.gov/cpgis/rest/services/PublicWorksEngineering/Easements/MapServer
```

Probed the real one — **CONFIRMED live**:
`https://gis.cedarparktexas.gov/mapping/rest/services/VIEW/Easements/FeatureServer/0?f=json`

```
{"currentVersion":11.5,"cimVersion":"3.5.0","id":0,"name":"Easements",
 "type":"Feature Layer","geometryType":"esriGeometryPolygon", ...}
```

Fields: OBJECTID, LegalStartDate, PlanID, PlanName, FileDate, **EasementType**,
OtherEasementType, Notes, created_user, created_date, last_edited_user, last_edited_date,
Shape__Area, Shape__Length, GlobalID.

Count: `{"count":8400}`

Sample (OBJECTID 3): PlanID='FP-08-014', PlanName='Caballo Ranch Sec 3', FileDate='2008',
EasementType='Drainage', OtherEasementType='', last_edited_user='BHEID'.
Geometry: `{"rings": [[[3097996.716116965, 10173090.087107062], [3098098.575821385, 1017281`

**Call: the migration URL is a pattern-completed guess.** The real path segment is
`/mapping/rest/services/VIEW/`, not `/arcgis/rest/services/`. A real probe could not have
produced the stored URL. The synthesis suspicion is CORRECT for Cedar Park.

---

## Answer to the framing question

The synthesis suspicion is **confirmed for Round Rock and Cedar Park** and **not supported
for McLennan**.

Round Rock and Cedar Park share one template — `<host>/arcgis/rest/services/Easements/<ServerType>/0`
— differing only in host and MapServer vs FeatureServer, with layer index 0 in both.
Neither matches its city's actual catalog path. Cedar Park's real layer sits at a
structurally different path and holds 8,400 features; Round Rock's real layer is at
`Planning/Planning_Multi/MapServer/16`. Neither stored row carries a T3 count, consistent
with never having been queried.

McLennan is a different failure mode: real org id, specific counts, service now absent.
That is a live-source disappearance, not a fabrication — and it is the row most likely to
be mistaken for healthy, because it was once true.

Bastrop is the only row of the five that verifies today, and its stored count is stale by 7.

Evidence only. No write recommendation is made here.
