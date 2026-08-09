---
id: 2026-08-08_multipolygon_fail_closed_and_the_real_fix
title: MultiPolygon truncation — fail closed now, and the specification of the real fix
date: 2026-08-08
status: active
owner: nick
related: [_inbox/2026-08-08_DEFECT_multipolygon_truncation, _decisions/2026-08-07_envelope_saga_close_and_geometry_law, _decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first, 90_operations/OPS-7_coverage_and_honesty_doctrine, 90_operations/onboarding_defect_class_backlog]
---

# MultiPolygon truncation — the interim fix and the real one

Operator ruling 2026-08-08, conditional: fail closed now is accepted ONLY because the real fix is specified here. This record is that condition being met. It is written so that a future session can build the real fix without re-deriving anything.

## The defect

`packages/engine-core/src/parcel-terrain/parcel-geometry-resolver.ts` (~lines 66-88) reduces every parcel geometry to a single exterior ring:

- Polygon: takes `coordinates[0]` — the exterior ring — and discards all interior rings (holes).
- MultiPolygon: takes `coordinates[0][0]` — the exterior ring of the FIRST polygon — and discards every other part.

Silently. No log, no warning, no recorded signal. Existing tests cover only single-ring rectangles.

A second, independently written copy of the identical bug lives at `packages/engine-core/src/boundary-primitive/adjacency-grid.ts:110-126` (`exteriorRingFromGeoJson`, same `[0]` and `mp[0][0]` truncation). Lower-confidence siblings requiring audit: `lot-line-scrub.ts:576`, `warden/envelope-sanity.ts:100-105`, `cert-grade-core.ts:551` and `:558`, and FEMA flood-polygon parsing in `flood-drainage-study.ts` and `pdf/flood-drainage.ts`.

## Why it is severe despite being small

The truncation happens UPSTREAM of every Geometry Law gate. `depth-warm-bastrop-batch.mjs:613-637` pins the resolver's `geom.ring` as the truth frame that write-then-verify and the ground-truth predicate measure against. The truncated ring IS the reference. There is no independent re-derivation anywhere that could catch it, so a multi-part parcel serving a fraction of its area passes every instrument at 100 percent.

This is Geometry Law rule 3's master defect class (gate one representation, serve another) in a form the law's own gates cannot detect, because the divergence is introduced before the gate sees anything.

## Blast radius (measured 2026-08-08, live SQL against txgio_parcel)

| Scope | Count |
|---|---|
| Statewide rows | 5,535,897 |
| MultiPolygon | 18,548 |
| Polygon with interior rings | 18,637 |
| Total affected | ~37,185 (0.67 percent) |
| Bastrop 48021 MultiPolygon | 5 of 74,729 (0.007 percent) |

No proven parcel is affected. All 12 operator-twelve and all 7 block13 parcels verified single-ring Polygon by direct SQL. The 12/12 and 7/7 results are NOT measuring truncated geometry.

## Interim ruling — FAIL CLOSED

Detect `coordinates.length > 1` on Polygon, or any MultiPolygon, at resolve time. Return an explicit decline with a named reason instead of a ring that looks complete. Both copies of the bug get the same treatment; the sibling sites get audited.

Rationale: an honest decline is acceptable, a silent partial answer is not (OPS-7). The alternative — building multi-ring support now — cascades through `openRing`, `projectRing`, the offset core, per-edge inset and edge labeling, which is the exact code proven at 12/12 last week. Touching it to serve 0.67 percent risks the 99.33 percent and forces re-proving the entire geometry chain.

The real win is not correctness, it is VISIBILITY: silent becomes countable. A declined parcel appears in the manifest as not-yet with a named reason and shows in Command Center. Today the defect is structurally invisible.

## Where fail-closed bites us, stated plainly

1. **The parcels do not come back on their own.** Only a deliberate build restores them, and a clean decline generates no user complaints, so it has no natural forcing function. Fail-closed converts a silent defect into a quiet one.
2. **The distribution is probably against us.** Multi-part parcels are split parcels, parcels bisected by roads or waterways, and irregular assemblages — skewed toward larger, more valuable tracts, which is the large-land due-diligence persona. The 0.67 percent by COUNT is likely a higher share by ACREAGE and by deal value. This is unmeasured.
3. **Bastrop will not feel it.** At 0.007 percent, the county validating everything gives no local evidence of the defect, so it can be carried statewide unnoticed.

## Conditions attached to the interim fix

- **Measure acreage-weighted impact**, not only parcel count. That number determines the real urgency of multi-ring support.
- **The queue row carries a trigger**, not "someday" (see below). This ruling is not permission for permanent neglect.

## THE REAL FIX — specification

Build this deliberately; do not attempt it inside another lane.

### Data model

A parcel's geometry becomes an ordered collection of parts, each part an exterior ring plus zero or more interior rings:

```
ParcelGeometry = Part[]
Part = { exterior: Ring, holes: Ring[] }
```

Today's shape is the degenerate case `[{ exterior, holes: [] }]`. The migration is therefore additive in principle: existing single-ring parcels map to a one-part collection with no holes.

### Call sites that must change

- `parcel-geometry-resolver.ts` — return the full collection; stop truncating.
- `adjacency-grid.ts:110-126` — the duplicate; same change.
- `openRing`, `projectRing` (`depth-warm/geometry.ts`) — operate per part, in a shared parcel frame (the projection-frame lesson from the plain-geometry sweep defect applies: all parts must project in ONE frame, not per-part frames).
- The offset/inset core — inset each exterior ring inward and each hole ring outward; the buildable envelope is the exterior inset MINUS the dilated holes.
- Per-edge inset and edge labeling — edges belong to a part; edge identity becomes (part index, edge) or, preferably per Geometry Law rule 7, coordinate-keyed rather than index-keyed.
- `warm-then-verify` and the ground-truth predicate — containment must hold for every part; area comparisons must sum parts and subtract holes.
- Cert harnesses (`cert-grade-core.ts`, block13, area-sweep) — per-part grading.
- Export and site-plan rendering — draw all parts and holes.
- Warden `envelope-sanity` — the area-ratio check must account for holes or it will false-flag.

### Semantics that must be decided at build time

- **Setbacks on a hole.** Does an interior ring (for example an excluded parcel or a right-of-way inside the tract) generate its own setback? Legally this varies. Decide with a cited source, do not invent.
- **Which part fronts the street** when parts are non-contiguous. Frontage is currently a whole-parcel concept.
- **Buildable area reporting** for non-contiguous parts: one number, or per part? A single number can imply contiguous buildable area that does not exist — an honesty question, not a display question.
- **Whether all parts must be contiguous** to be treated as one parcel at all, or whether non-contiguous parts should be modelled as related nodes (this intersects the node/edge data model work).

### Acceptance for the real fix

Same bar as the envelope saga, non-negotiable: byte-parity with the currently-proven pipeline on the operator twelve (verbatim saga values), block13 7/7, and a large random sample, graded by the independent instrument using ROTATION-INVARIANT matching (index-locked comparison is the wrong parity test). PLUS a new multi-part conformance fixture set — the current suite contains no multi-part parcel, which is precisely why this defect survived.

### Trigger for building it

Any of: (a) the acreage-weighted measurement shows material value exposure; (b) a county enters the roster whose MultiPolygon rate is materially above the 0.67 percent statewide baseline; (c) a customer-facing miss on a declined parcel; (d) the multi-part decline count becomes a top-five entry in the manifest's not-yet reasons.

## Reversal criteria

Reverse the fail-closed interim ruling if the acreage-weighted measurement shows the affected parcels represent a materially larger share of value than 0.67 percent of count implies, in which case multi-ring support moves ahead of other queued work rather than waiting on a trigger.

---

# AMENDMENT 2026-08-08 — the reversal criterion FIRED

The acreage-weighted measurement required as a condition of this ruling was run the same day (`_inbox/2026-08-08_multipart_acreage_weighted_measurement.json`, SELECT-only against live txgio_parcel, 5,535,897 rows).

| Measure | Statewide | Bastrop 48021 |
|---|---|---|
| Multi-part by COUNT | 0.7436 percent (41,166 parcels) | 1.1388 percent |
| Multi-part by ACREAGE | **59.6949 percent** | 9.28 percent |
| Skew | ~80x | ~8x |

Caveat carried honestly: the store has no PostGIS, so area is a bbox-rectangle proxy. Bboxes overstate irregular multi-part shapes more than compact ones, so 59.69 percent is an UPPER BOUND on the true acreage share. Even halved, the conclusion is unchanged.

**The interim ruling's stated rationale is falsified by its own condition.** "Disproportionate at 0.67 percent" was reasoning from a count that does not describe the exposure. Multi-part parcels are roughly three fifths of Texas by area. Fail-closed is not defensible as a resting state, because it declines 60 percent of the state's acreage.

## What stands and what changes

STANDS: the fail-closed fix itself, merged as engine PR #278 (`origin/main` at `e6265b1`, CI conclusion string SUCCESS). It is correct as a TRANSITIONAL state. It declines nothing that was not already wrong; it converts silent truncation into a countable, named decline. Visibility now, correctness next.

CHANGES: multi-ring support is no longer deferred behind the trigger conditions (a) through (d). Operator ruling 2026-08-08 promotes it to FRONT OF QUEUE. It is a Rail 1 blocker: the county shape ruling makes parcel geometry the rail to complete statewide first, and 60 percent of statewide acreage cannot be served correctly without multi-part support.

The real-fix specification above is unchanged and is the build spec. The four semantics questions (setbacks on a hole, frontage across non-contiguous parts, buildable-area reporting, whether non-contiguous parts are one parcel) remain decisions to be made at build time with cited sources, not invented.

## Lesson for the doctrine

A blast-radius number measured in the wrong unit produced a wrong ruling that survived adversarial review and operator approval, and was caught only because the decision record required the second measurement as a condition. Fold into the invariant register: **blast radius must be measured in the unit that carries the value at risk, not merely the unit that is easy to count.** Parcel count is not exposure.

---

# AMENDMENT 2 — 2026-08-08, same day: AMENDMENT 1 WAS WRONG

Amendment 1 rested on a measurement that counted ROWS, not parcels. The corrected analysis (`_inbox/2026-08-08_FABRIC_statewide_parcel_analysis.md`, `_inbox/2026-08-08_FABRIC_parcel_counts.json`, all SQL recorded verbatim) de-duplicates and reverses its magnitude.

| Measure | Amendment 1 (row-counted) | Corrected (de-duplicated) |
|---|---|---|
| Multi-part by COUNT | 0.7436 percent | **0.3714 percent** |
| Multi-part by ACREAGE | 59.6949 percent | **12.5290 percent** |
| Total bbox acres | 146,904,868.70 | **20,418,115.89** (7.19x inflated) |
| Skew | ~80x | ~34x |

The error was not random. **Duplication correlates with the variable being measured**: `txgio_parcel` writes a feature once per 0.02-degree tile it touches, so a large multi-part parcel is replicated more times and its acreage counted more times. Three geometries alone contributed roughly 67.4M spurious acres, 46 percent of the prior total.

Amendment 1's claims that fail-closed "declines 60 percent of the state's acreage" and that multi-part parcels are "three fifths of Texas by area" are RETRACTED. Its hedge ("even halved, the conclusion is unchanged") did not anticipate a factor of 4.77.

## Corrected ruling (operator, 2026-08-08)

Multi-ring support comes OFF front-of-queue. Revised order:

1. **Holes first** (operator ruling, unchanged and now better supported). Bastrop de-duplicated carries 421 holed parcels against 4 multi-part — roughly 100 to 1. Holes are also the structurally simpler half, and the inholding evidence is decisive: 120 of 120 Bastrop holes tested contain another parcel, so a hole is a neighbour's lot and plainly generates a lot line.
2. **Statewide layer acquisition** ahead of genuine multi-part support. The store holds 19 of 254 counties; acquiring the missing 235 is worth more than perfecting geometry for parcels we do not have.
3. **Genuine multi-part** behind both, on the trigger conditions originally named.

The fail-closed fix (engine #278, merged, `origin/main` e6265b1) stands unchanged as the correct interim state.

## Additional corrections from the fabric analysis

- **True distinct parcel count across the 19 loaded counties: 4,617,181**, not 5,535,897 rows. Identity key `(county_fips, md5(geometry::text))`. Every "statewide" figure in every prior artifact means statewide-over-19.
- **Seam reconciliation is MECHANICAL AND SAFE.** No geometry is ever cut at a tile boundary; a feature touching N tiles is written N times byte-identical. 0 of 334,638 tile-spanning features carry more than one geometry hash. The operation is `SELECT DISTINCT ON (county_fips, feature_index) ... ORDER BY county_fips, feature_index, tile_key`.
- **Tarrant `A 36-1` is NOT a prop_id collision** — 133 leasehold accounts on ONE DFW Airport polygon, single geometry hash. The inverse ambiguity: identity collapsing, not splitting. Naive geometry-keyed dedup would silently discard 132 accounts.
- **Travis's 2.35x is a SENTINEL artifact, not duplication** — 454,349 rows carry `prop_id='0'`, collapsing to 590 distinct geometries (business-personal-property and utility accounts stamped on real-property polygons).
- Zero single-part MultiPolygons exist after dedup.
- `{county_fips}:{prop_id}` is unambiguous for 99.3712 percent; six ambiguity classes named and counted in the analysis, no winner picked.

## Lesson, restated harder

The doctrine lesson written in Amendment 1 was correct and was then violated by Amendment 1 itself, one level up. Measuring in the right UNIT is not sufficient if the ROWS being measured are not the entities being counted.

Binding rule, for the invariant register: **a measurement artifact that does not record the query that produced it is not evidence and must not be ruled on.** The row-counted acreage artifact recorded no SQL and no method; that absence alone should have blocked the ruling. Every measurement artifact from here carries its query verbatim.
