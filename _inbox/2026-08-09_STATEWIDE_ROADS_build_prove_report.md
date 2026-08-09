---
id: 2026-08-09_STATEWIDE_ROADS_build_prove_report
title: Statewide roads L3 build-and-prove — PBF reader decision, Bastrop proof, peak memory, adversarial REFUTE
date: 2026-08-09
status: active
owner: statewide-roads-ingest-planner
related:
  - _inbox/2026-08-08_STATEWIDE_ROADS_program_report.md
  - _inbox/2026-08-09_STATEWIDE_ROADS_bastrop_compare.json
  - _inbox/2026-08-09_STATEWIDE_ROADS_fixture_provenance.json
  - _inbox/2026-08-09_STATEWIDE_ROADS_adversarial_review.md
---

# Statewide roads L3 — build-and-prove report (2026-08-09)

Operator-authorized planner lane. Build + one-county proof. **No statewide production ingest. No merge. No deploy.**

Engine PR (PBF worker): https://github.com/empressaioemail-tech/hauska-engine/pull/290 @ `6ba439a`  
Resolver (prior): https://github.com/empressaioemail-tech/hauska-engine/pull/288 @ `3b10048` (merged)

---

## 1. PBF reader decision

**Decision: pin a Python `pyosmium` worker** at `artifacts/roads-pbf-worker/` (same sidecar family as `hydrology-worker` / tile-pipeline). Reject adding a JS/native PBF parser to the Node dependency tree for this lane.

Why:

1. Overpass cannot do Texas statewide (COUNT OOM at ~521 MB; 2-slot rate limit). PBF is mandatory.
2. Grep on hauska-engine found no `osm.pbf` / `geofabrik` / `osmium` / `node-osmium` product dependency. Existing intake is HTTP Overpass only.
3. The prior design proof already used `pyosmium` (`locations=True`, `idx=flex_mem`) successfully outside the tree. Productizing that path is lower blast radius than introducing a second PBF stack.
4. FEMA same-day lesson: unbounded stdout racing DB-bound consumers OOMs regardless of heap. The worker writes **NDJSON to disk** with flush-every-N; Node is intended to stream lines and await write batches. That is backpressure by construction for the extract path (apply path still unexecuted — see adversarial).

Pinned dependency: `osmium>=4.0.0,<5.0.0` in `artifacts/roads-pbf-worker/requirements.txt`.

County-crossing ruling (not relitigated): preserve `{countyFips}:road:{osmWayId}`; N counties → N full-centerline emits; no clip.

---

## 2. What was built

| Artifact | Role |
|---|---|
| `artifacts/roads-pbf-worker/extract_highways.py` | Stream Geofabrik PBF → NDJSON + MD5 fail-closed + RSS sample |
| `artifacts/roads-pbf-worker/test_geometry.py` | Stdlib geometry unit tests (3/3 pass) |
| `packages/engine-core/scripts/ingest-statewide-roads-pbf.mjs` | Dry-run default; apply requires `PROPERTY_ATOM_PATH=1` + `ROAD_PBF_APPLY=1`; refuses pooler |
| `packages/engine-core/scripts/compare-pbf-ndjson-to-overpass-fixture.mjs` | Fixture compare (product path; see adversarial finding 0) |

---

## 3. Which fixture seeded live Bastrop OSM roads

SELECT-only against direct Neon `hauska_mcp` (not pooler). Artifact: `_inbox/2026-08-09_STATEWIDE_ROADS_fixture_provenance.json`.

| Live slice | Count |
|---|---:|
| All `48021` road-nodes | 19,907 |
| `road-intake-osm-overpass` | **4,893** |
| `road-intake-elgin-osm` | 2,356 |
| county roadway / surveyed overlays | 12,658 |

**City bbox fixture** (`bastrop-overpass-city-bbox.json`, ~18 MB): 4,893 ways; intersection with live Overpass slice **4,893**; only-in-fixture **0**.  
**Pilot bbox fixture** (~3 MB): 1,187 ways; strict subset of live.  

**Conclusion:** live OSM Overpass Bastrop roads were built from the **city-bbox** fixture / city-scope Overpass path, not the pilot fixture. Live store is county-scale **mixed** (OSM city + Elgin OSM + ArcGIS overlays), not city-only.

---

## 4. One-county proof vs known-good (verbatim)

Source PBF still on disk: `P:\tmp\statewide-roads\texas-latest.osm.pbf`, MD5 `4dd27afd6bc1c654f9b9635b709cf424` MATCH, 713,163,541 bytes.

Product worker extract (first successful run):

```json
{
  "waysSeen": 11649356,
  "highwayWays": 4028297,
  "keptIntersecting": 23954,
  "multiCountyWays": 0,
  "skippedNoLocation": 0,
  "elapsedSec": 409.27
}
```

Compare vs city fixture (counts from `_inbox/2026-08-09_STATEWIDE_ROADS_bastrop_compare.json`):

```json
{
  "pbfCountyHighwayWays": 23954,
  "pbfIntersectingCityBbox": 4896,
  "cityFixtureHighwayWays": 4893,
  "intersection": 4893,
  "onlyInCityFixture": 0,
  "onlyInPbfCityBbox": 3,
  "highwayTagMismatchesOnIntersection": 0
}
```

Recall **1.0**. Precision **0.99939**. Three PBF-only extras (newer OSM `highway=service`): `1545324609`, `1545324610`, `1545324611`. Not tuned after compare.

### Honest limits (planner + adversarial agreement)

- City bbox is interior to the county (zero county-ring vertices inside). Proof exercises **PBF fidelity**, not the boundary-running / multi-county ruling.
- Compare as filed keyed primarily on way id + `highway` tag. Adversarial independently verified full vertex geometry bit-identical on 4,893 ways (max delta 0); also found 12 non-`highway` tag / vertex-count divergences the published compare suppressed.
- Node `ingest-statewide-roads-pbf.mjs` was **not** executed end-to-end in this lane (no `ingest_report.json`). Compare evidence was produced via a pure-Node helper against the product worker NDJSON; product compare script still needs a green monorepo exec path.

---

## 5. Peak memory

| Measurement | Value | Notes |
|---|---|---|
| First extract `peakRssMb` in report | **0.0** | Instrumentation failure (WinAPI without argtypes). Adversarial correctly called this BROKEN as evidence. |
| Second extract (fixed `K32GetProcessMemoryInfo`) | **2842.17 MB** | Same worker, same PBF, same county; `elapsedSec` 355.03; kept 23954 again. |
| External PowerShell sampler | unusable | Script aborted on `utf8NoBOM` encoding before the loop; ignore. |

**Report peak RSS for the proof run: ~2.84 GB** (osmium `flex_mem` location index over full Texas). NDJSON kept-set itself is ~15 MB on disk; extract memory is dominated by the location index, not by accumulating kept ways.

---

## 6. Projected statewide cost (not a run)

Floor from measured one-pass decode of the full Texas PBF while filtering one county:

| Dimension | Projection | Basis |
|---|---|---|
| Wall clock (PBF decode floor) | **~6–7 minutes** | 355–409 s measured for full-file stream |
| Wall clock (geometry upper bound) | **unbounded without a 254-county / neighbor-fallback measurement** | Adversarial: misses cost ~12.5 ms/way vs ~0.08 ms member-hit; unknown how many Texas ways hit that path with 254 polygons |
| Peak RSS (extract) | **~2.8–3.5 GB** | 2842 MB measured; multi-county index adds polygons (small vs location index) |
| Intermediate NDJSON (deduped ways) | **~2.5 GB** | 15 MB / 23954 × ~4.03e6 highway ways |
| Road-nodes if bare `highway=*` kept | **~4.03M distinct `osmWayId`**; **per-county row count higher by crossing multiplicity** | Must always report both |
| Bastrop composition warning | ~66% `service`, ~11% pedestrian-class, 64 proposed/construction | Taxonomy still open — 4.9× inflation vs live Overpass city slice if left unfiltered |
| Storage in `atoms` | **tens of GB** order-of-magnitude if full emit with ROW edges | Rough only; no apply measured |

**Always report both** per-county `COUNT(*)` and de-duplicated `osmWayId` counts under the county-crossing ruling.

---

## 7. Adversarial reviewer verdict (verbatim closing paragraph)

Full review: `_inbox/2026-08-09_STATEWIDE_ROADS_adversarial_review.md`. Grades: A WEAK, B BROKEN, C BROKEN, D BROKEN. Overall: **REFUTED**.

> The one-county Bastrop proof does not license a statewide run. It establishes exactly one thing, that pyosmium reads Geofabrik Texas faithfully, and it establishes that well: all 4,893 fixture ways match on full vertex geometry with a maximum coordinate delta of zero. Everything else the proof is being asked to carry, it cannot carry. All 23,954 kept ways resolved on the `vertex-inside` branch, so the county resolver, the actual novel component, executed zero boundary cases and zero multi-county emissions, and could not have done otherwise with one county in the index. When I put a second county in the index and ran 2,000 roads along a shared diagonal boundary with three metres of ordinary survey jitter, 99.9 percent were assigned to exactly one county and the choice was a coin flip, 50.4 percent against 49.5 percent, because the collinear tolerance of 1e-18 sits about 1,776 times below the measured floating point noise floor of 1.78e-15 and the collinear branch is dead code for any boundary that is not axis aligned. That constant is already merged in #288. The backpressure claim rests on a reported peak RSS of 0.0, which is not a bound but an instrumentation failure published in the shape of one, and on a Node ingest script that has never run in either mode, which is provable because it writes an `ingest_report.json` that does not exist anywhere on disk. The compare artifact itself was produced by a throwaway script that is not in the diff, and its highway-tag-only filter reported zero tag mismatches while suppressing twelve real divergences including a non-ASCII encoding fault on the field front labeling matches against. And a statewide apply as written would silently upsert over 7,249 live Bastrop road-node rows, rewriting the source adapter and jurisdiction tenant of the very rows whose provenance was filed as evidence for this proof, on the county that gates CTX. Thirty-eight percent of real OSM way ids in Bastrop already fall inside the id space the synthetic county adapters reserve, roughly 1.53 million of them statewide, so the collision issue flagged on 2026-08-08 is not merely still open, it is six orders of magnitude larger than when it was written down. Hold the statewide run. The cheap unblockers are a two-county boundary proof with a real shared TIGER line and a pre-registered both-sides assertion, a collinear epsilon scaled to coordinate magnitude rather than to 1e-18, a working RSS measurement, one honest apply against a throwaway county to exercise the write path, and an explicit retire-or-supersede contract before anything touches Bastrop.

Planner note: after the review was written, the second extract published **peakRssMb: 2842.17**, which closes the "measurement is zero" sub-finding but does **not** clear claim C (Node apply path still unexecuted; `osmWayIds` Set still unbounded in ingest script).

---

## 8. What remains before a statewide run

1. **Two-county boundary-window proof** on a real Bastrop/Caldwell or Bastrop/Travis shared TIGER edge; both-sides assertion with realistic WGS84 diagonals (not unit squares).
2. **Collinear / near-boundary epsilon** scaled to coordinate magnitude (replace `1e-18`); metric buffer for ~few-metre TIGER/OSM disagreement so along-line roads resolve to both counties.
3. **Execute product Node ingest dry-run** via monorepo `tsx` and file `ingest_report.json` (close finding 0).
4. **Re-ingest / supersede contract** before any apply touches Bastrop (protect live Overpass + overlay atoms; do not silent-upsert adapter/tenant).
5. **Re-namespace synthetic way ids** out of real OSM space (700M/800M/900M).
6. **Intake taxonomy** (service / pedestrian / track / proposed / construction).
7. **`labelEdgesFromRoads` spatial prefilter** before county-scale warm against inflated rosters.
8. **Pin dated Geofabrik snapshot + MD5 on every atom citation**; record verified MD5 in extract report.
9. **Dual tallies** (per-county vs distinct `osmWayId`) in any statewide accounting.
10. **Load 254 county polygons** into the extract index; MultiPolygon/hole parity for coastal counties.
11. **No full statewide production ingest** until 1–6 clear; then dry-run predicts apply under slot discipline.

---

## Artifacts

| Path | Role |
|---|---|
| `_inbox/2026-08-09_STATEWIDE_ROADS_build_prove_report.md` | This report |
| `_inbox/2026-08-09_STATEWIDE_ROADS_bastrop_compare.json` | Verbatim compare counts |
| `_inbox/2026-08-09_STATEWIDE_ROADS_fixture_provenance.json` | Live fixture identity |
| `_inbox/2026-08-09_STATEWIDE_ROADS_adversarial_review.md` | REFUTED review |
| `P:\tmp\statewide-roads\proof-2026-08-09\highways.ndjson` | County extract (23,954 lines) |
| `P:\tmp\statewide-roads\proof-2026-08-09\extract_report_rss.json` | Remeasured peak RSS 2842.17 MB |
| hauska-engine PR #290 | Product PBF worker |
