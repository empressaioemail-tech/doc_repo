---
id: 2026-08-08_L2_WAVE3_PLACEHOLDER_DEFECT_FAMILY
title: W3-PLACEHOLDER-FAMILY — null-placeholder features with junk coordinates across multiple StratMap counties
date: 2026-08-08
status: open
owner: wave3-resume-planner
related: [_inbox/2026-08-08_L2_WAVE3_WOOD_48499_RULING, _inbox/2026-08-08_L2_WAVE3_RESUME_REPORT, _inbox/2026-08-08_L2_WAVE3_placeholder_defect_probe.json, _inbox/2026-08-08_L2_WAVE3_report_a2.md]
evidence: _inbox/2026-08-08_L2_WAVE3_placeholder_defect_probe.json
---

# W3-PLACEHOLDER-FAMILY — a source defect family, not three coincidences

The Wave 3 resume halted a second time, on Henderson 48213 and Liberty 48291, with the same fail-closed envelope guard that stopped Wood 48499. Measuring all three sources converts what looked like one bad county into a **characterized family of StratMap publication defects**. This document exists because that reframing is the single most important thing this wave learned, and the earlier Wood ruling was written before it was knowable.

## The pattern, measured

Read-only structural scans of the live StratMap archives, reading every shapefile record's bbox and joining the offending records to their DBF attributes.

| County | FIPS | Records | Out-of-envelope | Bad-record latitudes | Good-record bbox |
|---|---|---:|---:|---|---|
| Wood | 48499 | 44,576 | **1** | 13.92 | -95.6686, 32.5410, -95.1439, 33.0023 |
| Henderson | 48213 | 108,484 | **2** | 13.93, 13.92 | -96.4553, 32.0059, -95.4414, 32.3767 |
| Liberty | 48291 | 164,178 | **2** | 40.88, 40.88 | -95.1968, 29.8768, -94.4380, 30.4948 |

Every offending record's attributes:

| County | idx | Prop_ID | OWNER_NAME | GEO_ID | MKT_VALUE |
|---|---:|---|---|---|---|
| 48499 | 43504 | `"0"` | empty | empty | 0 |
| 48213 | 1316 | `"0"` | empty | empty | 0 |
| 48213 | 12770 | `""` | empty | empty | 0 |
| 48291 | 2020 | `""` | empty | empty | 0 |
| 48291 | 2027 | `""` | empty | empty | 0 |

**All five defective records across three counties are null placeholders.** No parcel identifier, no owner, no geo id, zero market value. In every case the remaining 44,575 / 108,482 / 164,176 records fall correctly inside their county's true extent, with a valid geographic `.prj`.

**Evidence artifact: `_inbox/2026-08-08_L2_WAVE3_placeholder_defect_probe.json`.** The adversarial reviewer correctly killed the first version of this table for having no artifact on disk: the dry logs cannot corroborate it even in principle, because the guard throws on the *first* offending feature, leaving 48213 index 12770 and 48291 index 2027 entirely unevidenced. The probe was therefore re-run and written to a durable artifact recording, for every offending record in all three counties, the record index, all four bbox edges, the full DBF attribute set, and a computed `is_null_placeholder` flag. It reports `all_offenders_are_null_placeholders: true` for each county independently. Verbatim probe output:

```
48499 Wood: 44576 records, 1 out-of-envelope, all_null_placeholders=true
   idx 43504 lat 13.9197 Prop_ID="0" GEO_ID="" OWNER="" MKT=0.00000000000e+00 placeholder=true
48213 Henderson: 108484 records, 2 out-of-envelope, all_null_placeholders=true
   idx 1316 lat 13.9261 Prop_ID="0" GEO_ID="" OWNER="" MKT=0.00000000000e+00 placeholder=true
   idx 12770 lat 13.9244 Prop_ID="" GEO_ID="" OWNER="" MKT=0.00000000000e+00 placeholder=true
48291 Liberty: 164178 records, 2 out-of-envelope, all_null_placeholders=true
   idx 2020 lat 40.8812 Prop_ID="" GEO_ID="" OWNER="" MKT=0.00000000000e+00 placeholder=true
   idx 2027 lat 40.8812 Prop_ID="" GEO_ID="" OWNER="" MKT=0.00000000000e+00 placeholder=true
```

A second, independent instrument corroborates the junk-coordinate clusters without reference to this probe at all: the SHP header bboxes recorded in the per-county worker artifacts are themselves polluted, at `ymin` 13.9244 for 48213 and `ymax` 40.8861 for 48291, exactly matching the offending records found here.

Two distinct junk coordinate clusters appear: latitude ~13.92 off the Pacific coast of Central America (Wood, Henderson) and latitude ~40.88 near Nebraska (Liberty). Both are far outside Texas, and neither is a plausible mis-projection of a Texas coordinate, which rules out a CRS error and points at empty or default geometry emitted by the publisher's export.

## What this changes

The Wood ruling reasoned from a sample of one and concluded "park it, the cost of waiting is small." At three counties out of 36 attempted — roughly 8 percent of the resume set, and 317,238 real parcels withheld between Henderson and Liberty alone — that reasoning no longer holds. This is not a rare one-off; it is a recurring property of the 202503 StratMap vintage that will keep halting waves until it is addressed.

The park ruling for Wood **stands as executed for this wave**, and Henderson and Liberty are recorded here as the same honest, named absence. What changes is the recommendation for what comes next.

## The guard is still correct and still untouched

Verified at report time:

```
$ git status --porcelain lib/cad-ingest
$ git diff -- lib/cad-ingest
(both empty)
```

The guard did exactly its job three times. It is the only thing that stood between a coordinate in the Pacific Ocean and the parcel store, and every one of those halts was a true positive. Nothing here argues for loosening `TEXAS_WGS84_BOUNDS` or making `assertTexasWgs84Bbox` permissive. The store is 10.8 million rows with zero rows outside Texas bounds precisely because this guard is strict.

The gap is narrower and more specific than "the guard is too strict":

> `parse.ts` documents its own premise as "a projection error is a WHOLE-COUNTY property, not a per-feature data defect; skipping would silently load zero or a handful of rows and report success."

That premise is now measurably false for this vintage. A per-feature defect class exists, it is small and bounded (1 to 2 records in 44k to 164k), and it is identifiable by attributes independent of geometry: the offending records are null placeholders.

## Recommendation (planner opinion, not executed)

Build a **reviewed, merged, tested per-feature declination path** in `lib/cad-ingest`, gated hard so it cannot become a silent skip:

1. A feature may be declined only if it is out-of-envelope **and** carries no identity (empty or `"0"` `Prop_ID` and empty `GEO_ID`). A record with a real `Prop_ID` that is out of envelope must still throw — that would be a genuine projection failure or a real parcel with broken geometry, and both must halt.
2. Declinations are **counted, named, and written into the county artifact** (record index, attributes, coordinates), never a bare skip counter.
3. A ceiling: if declined features exceed a small absolute count or any meaningful fraction of the county, throw as today. A county that is 30 percent out of envelope is a projection error and must keep failing closed.
4. Tests must cover both directions: a Wood-shaped input declines one placeholder and loads the rest; a whole-county Web-Mercator input still throws.

That change needs its own review and its own PR. It was deliberately **not** made during this wave — a wave-time patch to the one guard protecting the store is exactly the move that turns a fail-closed guarantee into a convenience. This session held no merge authority and correctly did not take it.

### A per-feature skip path already exists, and it is the cautionary example

The adversarial reviewer caught a real hole in the framing above. Saying "no per-feature exclusion path exists" is wrong: the ingest already skips features with no polygon geometry, and it fired on this wave. Across the 22 landed counties, **148 features were skipped in 9 counties**:

```
48203 Harrison: 2    48471 Walker: 2      48329 Midland: 1
48135 Ector:   56    48231 Hunt:   9      48183 Gregg:  60
48441 Taylor:   4    48171 Gillespie: 12  48181 Grayson: 2
TOTAL: 148 across 9 of 22 landed counties
```

Those 148 features are recorded only as a bare integer per county — `features skipped: N (no polygon geometry)`. No index, no `Prop_ID`, no attributes, nothing that would let anyone answer "which parcels, and were any of them real?" That is precisely the silent-skip failure mode this wave is trying not to repeat, already present in the code and already exercised 148 times.

This strengthens the recommendation rather than weakening it, and it changes its shape. The task is not "add an exclusion path" — a path exists. It is: **make every per-feature declination, including the 148 already happening, a counted and named absence carrying record identity into the county artifact.** A ninth county silently dropping 60 features is a bigger honesty gap than three counties loudly refusing to load, because nobody is looking at it. The 148 should be characterized before the declination path is designed, since they may well be the same null-placeholder family observed from the other side.

Until that lands, the alternative is a publisher fix: StratMap reissues these layers with the placeholder records removed, after which all three counties ingest through the unmodified guard with no code change at all.

## Findings

**W3-PLACEHOLDER-FAMILY (source defect, open).** StratMap 202503 land-parcel layers contain null-placeholder features (`Prop_ID` empty or `"0"`, no owner, no GEO_ID, zero value) carrying junk coordinates outside Texas. Confirmed in 48499 (1), 48213 (2), 48291 (2). Expect more counties in the unattempted remainder. Withheld, not silently dropped.

**W3-GUARD-COVERAGE (design finding, open, upgraded from the Wood ruling).** The envelope guard treats every out-of-envelope coordinate as a whole-county projection failure and offers no reviewed way to decline a bounded, attribute-identifiable set of defective features. At one county this was tolerable; at three it is the wave's rate limiter. Recommendation above.

**W3-COST (open).** Cost per county still not obtainable — no Neon or GCP per-county billing meter was queried, and none was invented.
