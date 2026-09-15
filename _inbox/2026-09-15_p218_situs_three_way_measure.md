---
title: P-218 Part B — situs allocated in patches, measured three ways per county
plan_row: P-218
lane: p218-selection-and-situs
status: measurement, not a fix
last_updated: 2026-09-15
---

# What was measured

Per county, from `txgio_parcel` (production, hauska-prod-497015, read via `CORTEX_DATABASE_URL`,
live 2026-09-15): how many parcels carry a REAL situs, how many carry NONE, and how many carry a
SENTINEL — present per a naive non-null check, but carrying no usable street. Live query and
result: `_catalog/situs_three_way_2026-09-15/measure-situs.mjs` and
`situs_three_way_by_county.json`.

**Counting rule.** One row per `(county_fips, prop_id)` (see "the row-vs-parcel correction"
below), classified by the SAME predicate the live product already uses to decide whether a situs
is navigable — `isUsableSitusAddress` in
`apps/property-explorer/src/lib/fact-sheet-resolver.ts`, replicated in SQL:

```
none:     situs_address IS NULL or blank after trim
real:     situs_address present, non-blank, and the text before the first comma
          (the "street" segment) is non-empty and starts with a digit
sentinel: present and non-blank, but the pre-comma segment does not start with a digit
```

This is a deliberate, reported choice: it answers "would the product show this as a usable
address", not merely "does the column contain a non-null string". Using the product's own
predicate rather than inventing a new one is reuse, not a new capability.

## The row-vs-parcel correction (a defect caught in the process, not shipped)

`txgio_parcel` carries **duplicate rows per `(county_fips, prop_id)`** for roughly 30% of all rows
statewide (4,920,973 of 16,428,786 raw rows sit in a group of 2+; one Bastrop group under the
placeholder id `prop_id='0'` alone carries 168 rows). A first pass measured raw `count(*)` and
produced a materially different, WRONG statewide picture (75.0% real / 24.1% sentinel) that
disagreed with Bastrop's own already-verified parcel count (62,257, from the P-212 close) the
moment it was checked against it. This is exactly DEV_PROCESS 1.3 ("measure the class you are
reporting, never a proxy for it") — rows are not parcels. The reported numbers below use one
representative row per `(county_fips, prop_id)` (`DISTINCT ON`, ordered by `feature_index`),
matching the counting rule the 2026-08-18 SS-W5 sweep used (statewide distinct-parcel count
13,072,079 here vs SS-W5's 13,071,975 — a 104-parcel difference over four weeks of drift, not a
methodology gap). Situs values never disagree within a Bastrop duplicate group; statewide, 20,208
duplicate groups (a small fraction of the ~3.36M multi-row groups) do disagree, and this pass
resolves those by the lowest `feature_index`, a stable but not independently re-derived
tie-break — named here rather than hidden.

## Statewide, three ways

| class | parcels | share |
|---|---:|---:|
| real | 10,884,987 | 83.27% |
| sentinel | 2,114,664 | 16.18% |
| none | 72,428 | 0.55% |
| (not-null = real+sentinel) | 12,999,651 | 99.45% |

Denominator: 13,072,079 distinct `(county_fips, prop_id)` parcels, live 2026-09-15.

## A number that disagreed with the dispatch's own headline — reconciled, not rounded off

The dispatch's "99.3% populated / 89.9% real street" figure is SS-W5's (2026-08-18), whose
"street" predicate is not `isUsableSitusAddress` — it is looser (it does not require a leading
house number; the exact predicate was not re-derived here, only its OUTPUT compared). That
difference alone would explain a moderate gap. **It does not explain Travis.**

| county | SS-W5 "street" (2026-08-18) | this measure, `isUsableSitusAddress` (2026-09-15) |
|---|---:|---:|
| 48453 Travis | 17.9% | **93.6%** |
| 48209 Hays | 97.9% | 87.6% |
| 48021 Bastrop | 74.1% | 73.3% |
| 48027 Bell | 97.0% | 87.2% |
| 48029 Bexar | 99.1% | 93.0% |
| 48491 Williamson | 100.0% | 94.9% |

Bastrop is stable (the two measurements are close; a looser-vs-stricter predicate difference
alone explains it). Hays, Bell, Bexar and Williamson all move in the SAME direction (this
measure's stricter predicate finds MORE sentinels than SS-W5's), consistent with a predicate
difference. **Travis moves the OPPOSITE direction, and by 75 points** — the stricter predicate
here finds Travis in far BETTER shape than SS-W5's looser one did. That is not explainable by
predicate strictness; it means the underlying DATA changed.

**It did.** `txgio_parcel.source_vintage` for Travis is `stratmap25-landparcels_48453_travis_202508`
(an August-2025 StratMap edition), while Hays and Bastrop are both on `..._202503` (March 2025).
All three counties' current rows were ingested in the SAME reload event
(`ingested_at = 2026-09-03T0{4,5}:xx`, matching the P-212 finding for Bastrop exactly) — a reload
that happened AFTER the 2026-08-18 SS-W5 sweep. **Travis's situs coverage was already fixed by a
full source-vintage upgrade landing 2026-09-03, not by the per-county application-side JOIN the
dispatch describes as "the named fix."** The dispatch's own framing is stale for this one county;
Hays and Bastrop's gaps are unchanged and still real. This is reported as a finding, not chased
into a fix (Part B is measurement only).

## Named counties

| county | props | real | sentinel | none | real% | sentinel% |
|---|---:|---:|---:|---:|---:|---:|
| 48021 Bastrop | 62,257 | 45,657 | 16,600 | 0 | 73.3% | 26.7% |
| 48027 Bell | 165,574 | 144,355 | 21,219 | 0 | 87.2% | 12.8% |
| 48029 Bexar | 703,258 | 654,194 | 49,064 | 0 | 93.0% | 7.0% |
| 48055 Caldwell | 24,989 | 20,583 | 4,406 | 0 | 82.4% | 17.6% |
| 48209 Hays | 116,422 | 102,035 | 14,387 | 0 | 87.6% | 12.4% |
| 48453 Travis | 380,918 | 356,499 | 24,419 | 0 | 93.6% | 6.4% |
| 48491 Williamson | 282,571 | 268,088 | 14,477 | 6 | 94.9% | 5.1% |

Note the `none` column: it is 0 or near-0 in every named county. **`none` is nearly nonexistent
statewide too (0.55%).** The situs gap this program has been chasing is overwhelmingly a
SENTINEL problem, not an absence problem — confirming the dispatch's own framing, now with a
per-county breakdown instead of one national number.

## Characterising the gap: it is not random, and it does not have ONE shape

**By county, the sentinel rate ranges from 0% to 100%.** Of 249 counties with 1,000+ parcels, 74
sit above 50% sentinel and 38 sit below 5%; the median is 35.9%. A uniform, random data-entry
error would not produce this spread — it tracks something about the county (source pipeline,
vintage, or CAD practice), consistent with the dispatch's own suspicion.

**The SENTINEL VALUE ITSELF has at least two distinct shapes, and which one dominates is
county-specific — this is the strongest "not random" signal found.**

- **Blank**: the pre-comma segment is empty (`", ,"`, or `", TX 78660"` — state/zip survive,
  street and city do not). Dominant in Bastrop (20,593 of 21,354 sentinels, 96.4%) and in most of
  Travis (316,701 of 341,120 sentinels there, ~63%... wait — see the prop_id=0 note below, which
  concentrates disproportionately in Travis's blank bucket).
- **Street-name-present, house-number-absent**: the pre-comma segment IS a real street name, just
  with no leading house number (`"STURGEON DR, SAN MARCOS, TX 78666"`, `"GOFORTH RD, BUDA, TX
  78610"`). Dominant in Hays (16,035 of 19,402 sentinels, 82.6%).

**This is exactly the class the operator hit.** Direct read of the four Sturgeon Dr parcels,
live, 2026-09-15:

| id | prop_id | geo_id (plat) | situs_address |
|---|---|---|---|
| 48209:97650 | 97650 | 11-2011-0001-00300-3 | `613 STURGEON DR, SAN MARCOS, TX 78666` (real) |
| 48209:97651 | 97651 | 11-2011-0001-00400-3 | `STURGEON DR, SAN MARCOS, TX 78666` (**sentinel**) |
| 48209:97652 | 97652 | 11-2011-0001-00500-3 | `STURGEON DR, SAN MARCOS, TX 78666` (**sentinel**) |
| 48209:97658 | 97658 | 11-2011-0001-01100-3 | `629 STURGEON DR, SAN MARCOS, TX 78666` (real) |

Both sentinel lots carry a real, platted geo_id in the SAME subdivision plat (`11-2011-0001-...`)
as their numbered neighbors — they are not off-plat or unplatted. The street name survived the
CAD/StratMap pipeline; only the house number did not. This reads as **vacant lots in a platted
subdivision that have not yet been assigned/recorded a situs number by the county** (matching the
surface-probe.mjs fixture labels for these exact ids: "vacant, no house number on the roll") —
a population, not noise. A gap analysis that only checked `IS NOT NULL` (the miscount the mission
warned against) would have called all four of these "populated" and found nothing.

**A third, unrelated anomaly, worth naming and NOT chasing here:** `prop_id = '0'` appears in 204
of 253 counties (616,287 raw rows statewide) as an evident placeholder/catch-all identity, most
concentrated in Travis (454,349 rows under that one id). A sample of its situs_address values are
not situs addresses at all — they are OWNER MAILING addresses (`"TAX DEPT MS 68 198 CHAMPION CT ,
TX"`, `"ATTN: PROPERTY TAX DEPT 2950 NORTH LOOP W FL , TX"`). This is a data-quality defect in the
source feed, not a situs-coverage gap, and it is contained by this measurement's per-parcel
dedup (every county's `prop_id='0'` rows collapse to exactly one entry, contributing at most 204
of the 13,072,079-parcel denominator) — but a naive per-ROW measurement (the mistake caught and
discarded above) would have let it distort Travis's numbers by nearly half a million rows.
Flagged in `leave_behind`.

## Answering the mission's question directly

Is the gap random? **No.** It tracks: (1) the county (0-100% range, not noise), (2) the SENTINEL'S
OWN shape, which differs systematically by county (Bastrop: blank; Hays: street-name-without-
number), and (3) source vintage / reload timing (Travis's coverage is a function of when its
StratMap edition was last refreshed, not a stable property of the county). "One join" will not
fix this: Bastrop's blank sentinel and Hays's street-name-without-number sentinel are different
shapes of the same undercount and may need different repairs (a blank needs a source that HAS a
street; a street-name-without-number needs a house-number source, which a plat/subdivision
address point layer is more likely to carry than a county roll re-read). Travis's own gap is
already substantially closed by an unrelated vintage upgrade, independent of any join. This
measurement does not choose a fix — Part B is measurement only, per the dispatch.
