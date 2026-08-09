---
title: Statewide roads PBF ingest - adversarial review of the one-county proof
status: active
last_updated: 2026-08-09
owner: adversarial reviewer (statewide roads ingest planner)
subject: hauska-engine PR #290 @ feat/statewide-roads-pbf-worker-v2 commit 6ba439a
verdict: REFUTED
---

# Adversarial review: statewide roads PBF ingest, one-county proof

Scope of attack: claims A (one-county proof reproduces known-good Overpass output), B (resolver correct at boundary edges), C (backpressure bounded), D (existing road-node consumers not overlooked). Method: read the diff and every artifact, then attempt to break each claim with executed counterexamples against the shipped code. All probes below were run against `artifacts/roads-pbf-worker/extract_highways.py` loaded from the worktree, the shipped proof NDJSON, and the committed Overpass fixture. Probe sources are at `P:\tmp\statewide-roads\adversarial\break_resolver{,2,3}.py`.

## Finding 0: the evidence was not produced by the code in the PR

This is prior to A through D and it contaminates all of them.

The PR ships two Node entry points: `packages/engine-core/scripts/ingest-statewide-roads-pbf.mjs` (399 lines) and `packages/engine-core/scripts/compare-pbf-ndjson-to-overpass-fixture.mjs` (222 lines). Neither ran.

The compare artifact filed as evidence, `_inbox/2026-08-09_STATEWIDE_ROADS_bastrop_compare.json`, was produced by `P:\tmp\statewide-roads\proof-2026-08-09\compare_pure.mjs`, a 3,291 byte throwaway that is not in the diff. Proof: the artifact's `comparison` field reads `"pbf_county_ndjson_x_city_bbox vs bastrop-overpass-city-bbox.json"`, which is `compare_pure.mjs` verbatim, while the PR script emits `"pbf_county_ndjson_x_city_bbox vs overpass fixture"`. The artifact also lacks the `sampleEmit` key, which the PR script writes unconditionally. The two scripts are not equivalent: the PR version routes a sample way through the real `parseOsmWayElement` and `emitRoadNode` path and asserts `expectedRoadNodeId`; the throwaway does not import the product path at all.

`ingest-statewide-roads-pbf.mjs` writes `ingest_report.json` on every run. A recursive search of `P:\tmp\statewide-roads` returns no such file anywhere. The script never executed, in dry-run or apply.

Consequence: the reviewable artifact of PR #290 is 621 lines of unexecuted Node plus a Python worker whose output was post-processed by a script that is not under review. The proof validates a pipeline that is not the pipeline being merged.

Minor, but symptomatic: commit `6ba439a`'s subject line carries a UTF-8 BOM (`\ufeffeat(road-intake): ...`).

## Claim A: one-county proof reproduces known-good Overpass output

Grade: **WEAK**.

What survives attack. The extract is faithful to OSM content, and by more than the compare showed. The compare only tested way id membership and the `highway` tag value. I ran the test it skipped: for all 4,893 fixture ways present in the county NDJSON, I compared full vertex arrays element by element. Result: 4,892 of 4,893 ways match on vertex count, and across every one of those the number of coordinates that differ is **zero**, maximum delta `0.000e+00` degrees. Geometry content is bit-identical, not merely id-aligned. The PBF reader is doing its job.

The bbox-semantics attack also fails. `wayIntersectsBbox` accepts a way when any vertex falls inside the rectangle, which is Overpass's own way-in-bbox rule. If it were narrower than Overpass we would see fixture-only ways; there are zero. The three PBF-only ways `1545324609/10/11` are consecutive ids, all `highway=service` with no other tags, which is one mapping session, meaning the PBF snapshot is marginally newer than the fixture. That is expected drift, not a defect.

What breaks.

1. **The compare cannot fail on the resolver, which is the novel component.** Bastrop city is a strict subset of Bastrop county, so a county extract containing the city slice is close to structural. The measured basis distribution in the shipped NDJSON confirms it: of 23,954 kept ways, **23,954 resolved as `vertex-inside`** and the `countyHits` length distribution is `{1: 23954}`. Recall can only fail here if the PBF decoder fails. The resolver contributed nothing that could have been wrong. Reported recall of 1.0 is a statement about pyosmium, not about way-to-county.

2. **The "known-good fixture identity" corroboration is circular.** The provenance artifact reports a live SELECT showing `road-intake-osm-overpass` at 4,893 rows exactly matching the city fixture, with `only_in_fixture: 0`. Those live rows were loaded from that fixture by `ingest-bastrop-roads-overpass.mjs`. The database agrees with the fixture because the database was populated from the fixture. This is the same artifact counted twice and adds no independent evidence.

3. **An available harder slice was skipped.** The same provenance artifact documents 2,356 live rows under `road-intake-elgin-osm` with real OSM way ids (15,094,881 to 1,525,112,278) stamped `countyFips=48021`. That is an independent Overpass pull over a different bbox in the same county, sitting right there, and it was not compared. The one slice guaranteed to be a subset was compared; the one that could have diverged was not.

4. **The compare's filter suppressed 12 real divergences and reported them as zero.** `highwayTagMismatchesOnIntersection: 0` is true only because the comparison keys on `tags.highway`. Comparing full tag sets and vertex counts finds 12 ways that differ: 11 with a changed `source:hgv` value and 1 (way `168082784`) with a different vertex count (fixture 98, PBF 99). The 11 are an encoding divergence on a non-ASCII value, where the Overpass fixture path and the PBF path produce different mojibake for the same OSM apostrophe and neither reproduces the true value. Road `name` tags in Texas carry non-ASCII characters routinely, and `labelEdgesFromRoads` token-matches SITUS addresses against `displayName`. The compare is structurally blind to an encoding fault on the exact field that front labeling depends on.

5. **Provenance of the input is not recorded.** The worker supports `--expected-md5` and fails closed, and `descriptor-from-registry.ts` documents a verified MD5 of `4dd27afd6bc1c654f9b9635b709cf424` at Content-Length 713,163,541, Last-Modified 2026-08-06. But `extract_report.json` records neither the MD5 it verified nor whether it was passed at all, and the pinned URL is `texas-latest.osm.pbf`, a mutable pointer. The run is not reproducible from its own report.

On "did filters get tuned after compare": I found no evidence of tuning, and I am not going to assert it without any. I also cannot rule it out. The branch carries one squashed commit for the entire worker, so the repo contains no record of the pre-compare filter state. That is an unfalsifiable position to be in and it is the planner's to fix, with a committed pre-registered expectation rather than a promise in a docstring.

## Claim B: resolver correct at boundary edges

Grade: **BROKEN**.

The proof exercised zero boundary cases, and the code has a measured defect in the branch that is supposed to handle them.

**The hard path has zero coverage.** `extract_report.json` records `countyCount: 1`, which makes `multiCountyWays: 0` a tautology rather than a result. The basis distribution I extracted from the NDJSON shows 23,954 of 23,954 hits resolved `vertex-inside`. The `midpoint-inside` branch, the `segment-crosses-boundary` branch, and the multi-hit emission path each executed **zero times** across the entire proof. The one-county proof cannot in principle produce a county-boundary window, because a county-boundary window requires two counties in the index.

**The collinear tolerance is roughly three orders of magnitude below the floating point noise floor.** `segments_intersect` treats segments as collinear only when `abs(orient) < 1e-18`. Measured against a realistic Texas diagonal county line from (-97.40, 30.00) to (-97.20, 30.20), the maximum `|orient|` over 199 points that lie exactly on that line is `1.776e-15`, and `2.560e-15` after quantizing to OSM's 7-decimal grid. That is about 1,776 times the threshold. The four collinear branches of `segments_intersect` are effectively dead code for any boundary that is not axis aligned. The identical `1e-18` constant sits in `way-to-county.ts` at line 210, which is merged as #288.

**A road running along a county line is assigned to one county by coin flip.** I built two counties sharing a diagonal boundary and swept 2,000 short ways running along that shared line, with plus or minus 3e-5 degrees (roughly 3 m) of jitter representing ordinary TIGER-versus-OSM survey disagreement:

| outcome | count | share |
|---|---|---|
| county A only | 1,008 | 50.4% |
| county B only | 990 | 49.5% |
| both counties | 2 | 0.1% |
| neither | 0 | 0.0% |

With jitter removed so vertices sit exactly on the line, the split becomes 52.4% both and 47.6% one. The outcome is therefore decided by coordinate noise, not by any stated rule. The axis-aligned case does work (probe 2 returns both counties, A via `segment-crosses-boundary`) because a vertical shared edge makes the orientation determinant exactly `0.0`, which is why `test_geometry.py` passes: all three of its cases use exact integer unit-square coordinates and so pass for a reason that does not generalize. A genuine crossing way is handled correctly (both counties, both `vertex-inside`), so the defect is specific to the along-the-line case, which is the case the planner named as the nasty one.

**This is a regression against the semantics the code claims to preserve.** The `way-to-county.ts` header states the design "matches existing Overpass bbox semantics" and "avoids clipping defects on county-line-running roads where even-odd ray cast treats boundary as outside." The measurement says the opposite: under the retired Overpass bbox path a county-line road appeared in both counties' rectangles, and under the new resolver it appears in one, chosen by noise. `DEFAULT_ROAD_PROXIMITY_THRESHOLD_M` is 25, so parcels within 25 m of a county line can have their actual fronting street stamped exclusively to the neighbouring county, at which point `labelEdgesFromRoads` declines with `no-roads-available` and the parcel silently loses its front. Statewide there are 254 counties and the boundary length is large.

The synthetic both-sides assertion the planner asked about does not exist in the test file. It should, and it should use realistic diagonal WGS84 coordinates, because the unit-square version passes with the defect present.

## Claim C: backpressure actually bounded

Grade: **BROKEN as evidence, unresolved as engineering.**

**There is no measurement.** `extract_report.json` reports `peakRssMb: 0.0`, and every one of the 11 progress lines in `extract.stderr.txt` reports `peak_rss_mb=0.0`. The `peak_rss_mb()` helper swallows every failure path and returns `None`, so the handler's running maximum never left its initialiser and the report published a hardcoded zero in the shape of a measurement. The two follow-up probes in the proof directory, `extract_rss.stdout.txt` and `extract_rss.stderr.txt`, are both 0 bytes, as is `highways_rss.ndjson`. The re-measurement attempt produced nothing and was not retried. A report that emits `0.0` where instrumentation failed is worse than one that emits nothing, because it reads as a bound.

**The claimed mechanism was never executed.** The claim is "Node awaits write batches; no unbounded stdout queue." Both halves live in `ingest-statewide-roads-pbf.mjs`, which never ran. `await storageHandle.storage.writeRoadAtomsBatch(batch)`, the direct-host pooler refusal at line 243, and the `ROAD_INGEST_BATCH` bound are all unexecuted. Worse, `maxBatchResident` is only assigned inside `flushBatch()` after the early return on an empty batch, and in dry-run `batch.push(atom)` is gated behind `if (doApply)`, so `batch` is always empty and `maxBatchResident` is **structurally 0 in the only mode that has ever run**. The field the report offers as backpressure evidence cannot be anything but zero without an apply.

**Two attacks fail and I will say so.** First, the dry-run does not accumulate atoms: `batch.push(atom)` is inside the `doApply` guard, so emitted atoms are dropped immediately and the claim holds. Second, osmium's `flex_mem` index is not an untested statewide risk, because the proof streamed the full `texas-latest.osm.pbf` and saw 11,649,356 ways and 4,028,297 highway ways. The dominant memory term, the location index over all Texas nodes, was genuinely exercised and the process completed in 409.27 s. It was simply never measured. Adding counties to the index does not change that term.

**What is genuinely unbounded.** `const osmWayIds = new Set()` in the ingest script accumulates every distinct way id for the life of the run and is never cleared. At the measured Texas scale that is roughly 4M numeric entries, on the order of a few hundred MB in V8, growing linearly with the run. It exists only to populate `distinctOsmWayId` in the report. That is precisely the FEMA-lesson shape the claim denies.

**Throughput does not extrapolate from this proof, and the planner should not let the 409 s number travel.** Measured against the real 1,243-vertex Bastrop ring: a way that resolves on its first vertex costs 0.083 ms, while a way whose bbox overlaps the county but which is not inside it costs **12.487 ms**, because it runs the full midpoint sweep and then the every-edge crossing sweep. The one-county run paid almost none of this: only about 24k of 4,028,297 highway ways survived the single-county bbox prefilter, so roughly 2 s of the 409 s was geometry and the rest was PBF decode. A 254-county run pays a 254-entry Python bbox prefilter for every way (measured 0.0368 ms per way, about 0.04 h statewide), at least one full ring sweep per way, and the 12.487 ms fallback for every way that neighbours a county it does not belong to. That last term is the one nobody has bounded, and it is the term that decides whether the statewide run takes 20 minutes or 14 hours. It is measurable today with a two-county index and was not measured.

## Claim D: existing road-node consumers overlooked

Grade: **BROKEN**. PR #290 closes none of the four open items from the 2026-08-08 report, and it makes two of them materially worse.

**Re-ingest contract, the most damaging finding in this review.** `emitRoadNode` sets `entityId = roadNodeId = {countyFips}:road:{osmWayId}` and `atomDid = buildAtomDid("road-node", entityId)`. `writeRoadAtomsBatch` delegates to `writePropertyAtomsBatch`, whose SQL is `ON CONFLICT (atom_did) DO UPDATE SET ... source_adapter = EXCLUDED.source_adapter, source_url = EXCLUDED.source_url, jurisdiction_tenant = EXCLUDED.jurisdiction_tenant, body = EXCLUDED.body`. The statewide descriptor emits `sourceAdapter: "road-intake-osm-geofabrik-pbf"` and `jurisdictionTenant: breadth_48021_bastrop_county`. Since the county extract contains all 4,893 city ways with byte-identical geometry, a statewide apply over Bastrop will **silently overwrite the 4,893 live `road-intake-osm-overpass` rows and the 2,356 live `road-intake-elgin-osm` rows**, rewriting their source adapter, source URL, and jurisdiction tenant in place. The `_inbox/2026-08-09_STATEWIDE_ROADS_fixture_provenance.json` artifact filed as evidence for claim A becomes false the moment the run it authorises executes. Bastrop is the QA-done county gating CTX and national. Nothing in the PR, the worker, or the ingest script retires, versions, or even warns about the superseded rows. ROW widths happen to survive, because `DEFAULT_ASSUMED_ROW_WIDTH_FT` is value-identical to the hand-authored Bastrop table, but that is luck, not design, and it does not hold for any county whose registry row omits an override.

**Synthetic way-id collision, now quantified.** The live synthetic bands are `road-intake-bastrop-county-roadway` at 800,000,001 to 800,011,351 and `road-intake-county-streets-surveyed-2016` at 900,000,001 to 900,001,307. Real OSM way ids densely occupy that space. In the Bastrop county extract alone, **9,099 of 23,954 real OSM highway ways (37.99%) carry ids inside 700,000,000 to 999,999,999**, with 43 landing in the 800M county-roadway band and 8 in the 900M surveyed band. At the measured Texas total of 4,028,297 highway ways that is roughly **1.53 million real OSM ways occupying the reserved synthetic space statewide**. Today the exact live windows are clear by luck (zero hits in 800,000,001 to 800,011,351). At the measured id density, the expected number of hard `{fips}:road:{id}` collisions once the same 800M and 900M bases are used across 254 counties is on the order of 50 to 90, each of which silently upserts a real road over a county-roadway road or the reverse. The 2026-08-08 report flagged this as open; PR #290 raises the exposure by six orders of magnitude and does not mention it.

**Taxonomy.** The worker keeps every way with a `highway` key and applies no filter. In Bastrop: 15,755 `service` (65.8%), 2,650 pedestrian-class footway/path/cycleway/steps (11.1%), 406 `track`, and 64 `proposed`/`construction`, which are roads that do not exist. Against the 4,893 live `road-intake-osm-overpass` rows this is a **4.90x row inflation for a single county**, and 48 of those rows assert a centerline and an assumed ROW for pavement that has not been built. `isPedestrianWay` is stamped correctly on the atom, so downstream front-eligibility is defended, but nothing defends against `proposed`, and nothing bounds the volume.

**labelEdgesFromRoads.** The literal O(n squared) framing is wrong and I will not repeat it: the loop is edges times roads, and `roads` arrives from `listRoadAtomsNearBbox`, which is capped at `LIMIT 2000`. The real hazard is that cap interacting with the inflation above. The query orders by `jsonb_array_length(centerline) DESC`, so when a county's road-node population roughly doubles, the 2,000-row window fills further with long arterials before reaching the short residential street a parcel actually fronts. The `EXISTS (SELECT 1 FROM jsonb_array_elements(...))` scan also runs against every road-node row in the county on a Neon instance with no PostGIS, and that cost scales directly with the inflation factor. Neither effect is bounded or tested in this PR.

## Verdict

**REFUTED.**

Claim A is weak rather than false: the extractor genuinely reproduces OSM geometry bit for bit, which I verified independently because the shipped compare did not, but the proof it rests on cannot fail on the component under review and its corroborating artifact is circular. Claim B is broken by measurement, not by argument. Claim C has no measurement at all and its stated mechanism has never executed. Claim D is broken outright, and one of its findings is an active hazard to live Bastrop data.

## For verbatim quotation

The one-county Bastrop proof does not license a statewide run. It establishes exactly one thing, that pyosmium reads Geofabrik Texas faithfully, and it establishes that well: all 4,893 fixture ways match on full vertex geometry with a maximum coordinate delta of zero. Everything else the proof is being asked to carry, it cannot carry. All 23,954 kept ways resolved on the `vertex-inside` branch, so the county resolver, the actual novel component, executed zero boundary cases and zero multi-county emissions, and could not have done otherwise with one county in the index. When I put a second county in the index and ran 2,000 roads along a shared diagonal boundary with three metres of ordinary survey jitter, 99.9 percent were assigned to exactly one county and the choice was a coin flip, 50.4 percent against 49.5 percent, because the collinear tolerance of 1e-18 sits about 1,776 times below the measured floating point noise floor of 1.78e-15 and the collinear branch is dead code for any boundary that is not axis aligned. That constant is already merged in #288. The backpressure claim rests on a reported peak RSS of 0.0, which is not a bound but an instrumentation failure published in the shape of one, and on a Node ingest script that has never run in either mode, which is provable because it writes an `ingest_report.json` that does not exist anywhere on disk. The compare artifact itself was produced by a throwaway script that is not in the diff, and its highway-tag-only filter reported zero tag mismatches while suppressing twelve real divergences including a non-ASCII encoding fault on the field front labeling matches against. And a statewide apply as written would silently upsert over 7,249 live Bastrop road-node rows, rewriting the source adapter and jurisdiction tenant of the very rows whose provenance was filed as evidence for this proof, on the county that gates CTX. Thirty-eight percent of real OSM way ids in Bastrop already fall inside the id space the synthetic county adapters reserve, roughly 1.53 million of them statewide, so the collision issue flagged on 2026-08-08 is not merely still open, it is six orders of magnitude larger than when it was written down. Hold the statewide run. The cheap unblockers are a two-county boundary proof with a real shared TIGER line and a pre-registered both-sides assertion, a collinear epsilon scaled to coordinate magnitude rather than to 1e-18, a working RSS measurement, one honest apply against a throwaway county to exercise the write path, and an explicit retire-or-supersede contract before anything touches Bastrop.
