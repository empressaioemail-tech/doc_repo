---
id: 2026-09-01_chunk-degradation_findings
title: "Williamson chunk stretch: the mechanism, named"
date: 2026-09-01
last_updated: 2026-09-01
status: filed
plan_row: F-01
snapshot: doc_repo main 971cb8f; code read at hauska-factory 5f9acc3 (worktree hauska-factory-p2-juris-persist, read-only); telemetry from run_events on withered-surf-26870298 (control store) queried 03:53-04:05Z; hzkqk untouched; cortex-prod untouched
---

# Williamson chunk stretch: the mechanism, named

Report filed 04:25Z, ahead of the 04:40 target. Read-and-diagnose card. No store
was written, the running job was not touched, and cortex-prod was not read.

## The measurement

`run_events` for run `fb490620` (control store, non-contending). Eight chunks landed
as of 04:05Z, chunk 9 in flight since 03:47:12Z.

| chunk | wall | in_city | uninc | range lo -> hi | ms per in-city parcel |
|---|---|---|---|---|---|
| 1 | 84.6s | 3,694 | 4,306 | PRIVATE ROAD -> R014834 | 23 |
| 2 | 145.2s | 4,859 | 3,141 | R014834 -> R031819 | 30 |
| 3 | 977.2s | 5,333 | 2,667 | R031819 -> R042255 | 183 |
| 4 | 807.7s | 4,915 | 3,085 | R042255 -> R055402 | 164 |
| 5 | 1,713.6s | 5,600 | 2,400 | R055402 -> R066432 | 306 |
| 6 | 1,695.6s | 6,932 | 1,068 | R066432 -> R081440 | 245 |
| 7 | 1,165.2s | 4,647 | 3,353 | R081440 -> R097939 | 251 |
| 8 | 308.2s | 4,574 | 3,426 | R097939 -> R313330 | 67 |

64,000 rows landed (40,554 in-city, 23,446 unincorporated). Three facts in this
table carry the whole diagnosis.

**One: the trend is not monotonic.** Chunk 8 fell to 5m08s. The run walked out of
whatever chunks 3 through 7 were in. "Degradation" was the wrong word by 03:47Z.

**Two: per-range cost reproduces across processes.** The two crashed runs
(`713aad7f` 22:30Z, `f5ae0df0` 00:14Z) ran the same first two ranges: chunk 1 at
84.4s / 86.7s / 84.6s, chunk 2 at 144.7s / 148.0s / 145.2s. Within 3% across three
separate processes, connections, and hours. McLennan ran twice end to end
(`82c26c82`, `a62e3fce`) chunk-for-chunk identical within 3%. Cost is a property of
the prop_id range, not of anything a process accumulates. Both crashed runs also
died INTO chunk 3 (16m17s reproducible), which the 57P01 diagnosis file counts as
chunk 2; run_events resolves that off-by-one, and the wave-a-fan "3141/4859 vs
4306/3694 first-page" contradiction the same way: 4306/3694 is chunk 1, 3141/4859
is chunk 2.

**Three: in-city count alone does not price a chunk.** Chunk 2 (4,859 in-city) cost
145s; chunk 4 (4,915) cost 808s. Chunk 7 (4,647) cost 1,165s; chunk 8 (4,574) cost
308s. Same count, 3.8x to 5.6x apart. The dispatch's pre-registered falsifier for
the leading hypothesis FIRED in its naive form. What survives is the refinement
below. For contrast, McLennan fits wall = 22.8ms x in_city almost exactly across
all 15 chunks (r 0.876, per-in-city spread 14-28ms), and Hays' two slowest chunks
were its most RURAL (2,410 in-city at 92.9s, ranges 22491-41591, the Austin bbox
band).

## The mechanism

**Per-chunk cost is the sum over the chunk's parcels of exact-geometry work against
every bbox-candidate city polygon, and that work is linear in the candidate
polygons' vertex count.** Two code facts make it expensive
(`src/jobs/p2-juris-store.mjs` at 5f9acc3):

1. The in-city determination runs `ST_Area(ST_Intersection(parcel, city))` for
   every ring-parcel x city pair passing bbox + `ST_Intersects` (store.mjs:156-176).
   `ST_Intersection` has NO prepared-geometry path in PostGIS: every hit pays a
   full GEOS overlay against the entire city polygon, cost roughly linear in its
   vertices. `ST_Intersects` has a prepared path but the cache holds one geometry;
   parcel-major iteration across multiple candidate cities thrashes it.
2. Candidate multiplicity: in the Williamson corridor the city bboxes overlap.
   Measured this session from the control store's own `landing_tx_city_boundary`
   (TxGIO/CPA payloads, so no cortex-prod read): Austin 32,811 vertices with a bbox
   whose north edge (30.517) reaches into the Round Rock / Cedar Park / Hutto band;
   Georgetown 11,290; Cedar Park 8,801; Round Rock 7,059; Leander 3,031; Taylor
   2,300; Hutto 1,546. Round Rock's bbox overlaps Austin, Cedar Park, Georgetown,
   and Hutto. A corridor parcel bbox-hits 3 to 5 polygons totaling 45-60k vertices.
   A McLennan urban parcel hits Waco (9,784) plus a small suburb; hence its clean
   constant 22.8ms. A Hays in-city parcel hits San Marcos (4,746) or smaller; hence
   ~10-15ms.

prop_id text order is a geographic transect: WCAD account ranges cluster by
subdivision and annexation vintage. McLennan's own checkpoints showed it (first 48k
rows 59.3% in-city at ~72s per chunk; last 66k rows 80.5% at ~165s). The chunk
walk entered the Round Rock / Georgetown corridor around R031819 and left it around
R097939. The stretch is the county's annexation geometry read in prop_id order, not
a failure mode of the run. The per-in-city levels (23, 30, 67, 164-183, 245-306 ms)
scale with plausible candidate vertex mass per band at roughly 2-3 microseconds per
vertex of overlay, consistent across all four measured counties.

## The second mechanism, and why it is rejected

**Per-range custom-plan flip.** Every chunk is an unnamed statement (custom plan per
execution; no named prepared statements anywhere in src/), `cities_ok` is declared
`NOT MATERIALIZED`, and the explain gate that exists for exactly this query family
covers only the interactive `05_explain.sql`, not the job's `CHUNK_PERSIST_SQL`.
A range whose text-histogram estimate goes wrong could buy a nested loop that
re-executes the inlined statewide city decode per probe. This is range-deterministic,
so it is ALSO consistent with the cross-run reproducibility, and it cannot be
dismissed on that evidence.

Rejected as primary on three grounds. First, mode count: the per-in-city cost takes
at least five distinct levels; a plan flip is binary, a continuum is work. Second,
the controls: Hays (15 chunks) and McLennan (15 chunks, run twice) drew ~45 fresh
custom plans over the same SQL with range parameters and produced zero flips; both
counties fit flat or single-slope models. Third, within Williamson's slow band cost
still tracks the split direction (chunk 6 at 6,932 in-city is the band's most
expensive per row). The definitive discriminator is cheap and deferred:
PENDING-STORE-READ, run `EXPLAIN (ANALYZE off)` of CHUNK_PERSIST_SQL with chunk-2
literals vs chunk-5 literals on cortex-prod after the run ends. If the plans differ
in join shape, the flip contributed; the fix below removes the surface either way.

## Mechanisms killed outright

The accumulating-state family is dead both empirically and in code. Chunking is
keyset over precomputed half-open ranges (no OFFSET, no anti-join, no LIMIT; the
loop never reads the landing table; the only landing read is the one-time held-county
replay gate at start, which does not include 48491). One pg.Client per store for the
whole run. No named statements, so the 5-execution generic-plan flip cannot fire.
Landing growth: Hays ran flat while landing grew 87k to 204k rows beneath it, and
Williamson chunk 1 cost the same 84s in three runs at three landing sizes. Node
memory: bounded small arrays, none feeding any query. The 57P01 connection defect is
fixed and unrelated; both 57P01 runs already showed this cost profile before dying.

## What it predicts for Travis, before anyone runs it

Travis (380,918 parcels, ~48 chunks) is the corridor mechanism with the county-sized
polygon: Austin's 32,811-vertex ring is a bbox candidate for the large majority of
parcels, plus enclaves (West Lake Hills, Rollingwood, Sunset Valley) and straddlers
(Pflugerville, Round Rock, Cedar Park, Leander) inside or against Austin's bbox.
Prediction: no cheap head (chunk 1 already slow, unlike Williamson), most chunks
corridor-class or worse at 20-60 minutes, total 16-40 hours of overlay against a
21,600s task timeout with max-retries 0 and resume keyed by run.id. **Under the
current design Travis is not slow, it is structurally non-terminating: every
execution dies at the timeout and the next one starts from zero.** Falsifiable
cheaply: if Travis chunk 1 lands under ~3 minutes, this mechanism is wrong.

## The fix shape, ordered

**1. Resume across executions (required under every mechanism; smallest diff).**
Today, code-present: `--run-id` (p2-juris.mjs:86,124-126) reuses a run row and
skips its completed chunks from run_events. Ranges recompute identically because
the id set is static; a key mismatch merely re-runs idempotent chunks (ON CONFLICT
DO UPDATE). End-to-end unverified; worst case is restart cost, not corruption.
Durable form: a chunk-manifest event at run start (ranges, pageSize, denominator,
method version), completed-chunk keys `(county, lo, hi, method_version)` across
runs, refuse on denominator mismatch. This converts timeout-death into restart and
is the prerequisite for cost-budget chunking, so the two belong in one change.

**2. Kill the per-hit overlay (the Travis-sized lever).**
Fast path: test `ST_Covers(city, parcel)` first; it HAS a prepared path. A covered
parcel's intersection area IS its own area, so `overlap_deg2 := ST_Area(parcel)`,
bit-identical semantics, floor and ranking unchanged. Only true straddlers fall
through to `ST_Intersection`. Expected 10-30x on the dominant term. Alongside it,
hoist the city set: decode + `ST_MakeValid` the COUNTY-SCOPED cities once per run
into a session TEMP table with a real geometry column, GiST, and ANALYZE (one
Neon client, so TEMP is safe per the engine #335/#336 lesson; the no-TEMP
annotation binds the interactive RO file, not the job). This deletes the per-chunk
statewide re-decode floor and removes the plan-flip surface entirely, closing R2
by construction.

**3. Cost-budget chunking, riding on the manifest.**
Two-pass. Pass 1, scalar bbox only: a parcel with zero city-bbox candidates is
PROVEN unincorporated (bbox miss makes intersection impossible) and is written
without ever detoasting its geometry. Pass 2 runs exact geometry over candidates
only, with chunk boundaries cut by cumulative candidate vertex mass, the cost proxy
being sum of `ST_NPoints` over the parcel's bbox-candidate cities. npoints is
computed once per run from the TEMP city table; the proxy is monotone with the true
driver and costs a scalar join. Requires parcel bbox scalars; if absent they come
from the one decode pass the exact pass needs anyway.

**4. `ST_Subdivide(city, 256)` for the straddler remainder**, only if post-fix-2
telemetry still shows straddler-dominated chunks. Exact (a partition's intersection
areas sum to the whole, error eight orders below the 1e-8 floor); distinct from
simplification, which stays forbidden.

**5. Defer the city-major inversion.** Its unique wins (floor removal, city-keyed
resume) are captured by 1+2 at far lower blast radius; it forces a landing
semantics change (k writes per parcel, conditional upsert, absence-means-pending
until a final sweep). Escape hatch if R2 somehow survives its EXPLAIN.

## For the 04:50 decision (input, not a ruling)

Terminating hzkqk cleanly forfeits only the in-flight chunk 9 (single-statement
chunks forfeit in-flight work by design, and the 05:00 restart would forfeit it
anyway). With a relaunch passing `--run-id fb490620-d4e9-4110-804d-21ee7375b960`,
the 64,000 landed rows and 8 completed chunks carry forward. Remaining: ~27 chunks,
R313330 upward; if the remaining transect is McLennan-class the remainder is
roughly 1.5-3h, if corridor-class 5-9h, so plan for one further resume. The
dispatch line "fb490620's 56,000 rows will not be licensed" was written before the
--run-id flag was found in the shipped code; it is stale in its premise as a
permanent loss, correct that a BARE relaunch loses them.

## PENDING-STORE-READ (exact reads, after hzkqk ends)

1. `EXPLAIN` CHUNK_PERSIST_SQL at chunk-2 vs chunk-5 literals (R2 discriminator).
2. Landing GROUP BY city for 48491 rows by chunk range: attributes slow chunks to
   named polygons. Predicted: chunks 3-7 dominated by Round Rock, Georgetown,
   Cedar Park, Austin; chunk 8 by Taylor/Hutto/Granger-class small rings.
3. `cities_ok` npoints for 48491 on cortex-prod as the second derivation against
   this session's control-store TxGIO measurements.
4. Per-parcel bbox-candidate multiplicity histogram, to size fix 3's budget.

## Unmeasured

Which specific cities each chunk's parcels hit (pending read 2). The Williamson
touch-set enumeration by name (registry shard lists 15; Austin straddles in; the
17-touch set was never enumerated in doc_repo). Whether the --run-id resume path
works end to end (code-present, never exercised).

## Termination, 2026-09-01

Execution `factory-p2-juris-hzkqk` (run `fb490620-d4e9-4110-804d-21ee7375b960`,
Williamson 48491) was cancelled on operator go at `2026-09-01T04:14:11Z`, roughly 46
minutes ahead of the 05:00 UTC maintenance restart.

Verbatim:

```
$ gcloud run jobs executions cancel factory-p2-juris-hzkqk \
    --project=hauska-prod-497015 --region=us-east4 --quiet
Cancelled execution [factory-p2-juris-hzkqk].

runningCount:   None
succeededCount: None
failedCount:    None
cancelledCount: 1
completionTime: 2026-09-01T04:14:11.171940Z
```

`cancelledCount: 1` with no `failedCount` is the distinguishing fact: this is a clean
stop and is separable in the record from the 57P01 deaths and from a maintenance kill.
Nine chunks and roughly 72,000 rows are complete and carried on the run id.

The termination forfeited only the in-flight chunk, which the 05:00 restart would have
forfeited anyway.

**Open and lane-owned:** the Factory run row is still `started` and has no termination
record. Carried on `mission_covers_fastpath`. A deliberate stop that leaves no name is
indistinguishable from the failure class it was performed to avoid.
