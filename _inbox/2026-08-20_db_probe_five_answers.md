---
date: 2026-08-20
seat: property substrate
artifact: DB probe results, five blockers settled
status: VERIFIED by live query
---

# DB probe: five answers

Snapshot: cortex-prod `fancy-fire-06136146`, host `ep-lucky-truth-apodo8hr`, user
`neondb_owner`, 2026-08-20 15:02 to 15:58 UTC. `txgio_parcel`, `county_facet_coverage`,
`place_layer_snapshots` on **neondb**. `atoms`, `document_ingest_atoms` on **hauska_mcp**.

## Q1. R-7 FALSIFIED. The centroid guard is fine.

All four bbox columns are `double precision`, and `pg_typeof((south_lat + north_lat) / 2.0)`
returns `double precision`. The kill path required `numeric`. It is not that type.

**This seat named R-7 "the single highest-value item to settle" and it was the wrong type
entirely.** The reasoning was sound and the premise was untested; the two corroborating
pieces of same-repo evidence (an explicit `::float8` cast elsewhere, a `Number(n)` coercion
on the same table's columns) turned out to be defensive habits rather than symptoms. A
plausible mechanism plus two circumstantial supports is still a hypothesis, and this is the
second time this week that shape has been mistaken for a finding.

Absence clustering is not starved. **No action.**

## Q2. The population is 254, not 253. Repeated for weeks, never checked.

`geometry` is **254 rows over 254 distinct county FIPS**, zero non-county entities. One row
per Texas county, complete. The rail key is spelled `geometry`.

**"253" is a different rail's old figure** and has been carried into the S-21 record by
inheritance. The retired-rows count should be restated as 254 wherever it appears.

**Confirms a known live defect.** Both `land-use` (19 counties) and `landuse` (254) exist as
facet keys, so the scorer-writes-`land-use`-while-the-rail-key-is-`landuse` orphaning is real
and currently strands 19 rows. Also visible: `envelope` 19 counties and `flood` 177 of 254,
both partial rails.

## Q3. There is NO parcel-node table. Item 3's database half cannot be built as specified.

`parcel-node` is an **entity_type inside `atoms`** (13,717,341 rows), not a table. **A foreign
key has nothing to reference.** The binding constraint must therefore be either a
self-referential check inside `atoms` or gated on first materialising a node table. Either
way the item is larger than filed and its shape changes.

Shape check `entity_id ~ '^[0-9]{5}:'` would reject **36,783 of 103,238,289** atoms rows;
0 null, 0 blank. `document_ingest_atoms` holds **one row**, a `smoke-tenant` survey-record
hash, so it is not a production binding population and the "strictly weaker second store"
finding is architecturally true and operationally empty today.

**The 46,486,592 unresolved figure is an artifact of a query this seat specified badly, and
should not be reported as 46 million orphans.** Exact-matching every `entity_id` against
`parcel-node` entity_ids assumes one atom per parcel per family. It is not: `special-district-fact`
alone has 20,844,039 rows against 13,717,341 parcels, because a parcel sits in several
districts, so those entity_ids necessarily carry a discriminator and cannot match a bare
parcel id. The top-10 evidence shows the same thing from the other side, vintage-suffixed
keys like `48021:10001:2025` at three rows each. Whole families are also legitimately not
parcel-keyed at all: `road-node` 1,746,716, `setback-rule` 778,676, `code-section` 28,567,
`property-boundary-edge` 26,846.

**Second mechanism considered and NOT rejected:** that a real orphan population hides inside
that 46M. It very likely does. The point is that this query cannot size it, because it
conflates key-shape mismatch with orphaning. **Sizing orphans needs a per-family key grammar,
which does not exist yet, and that is the actual prerequisite for the constraint.**

## Q4. Bastrop can exercise the multi-part path, but barely. Five rows.

Statewide: **69,058 multi-part** of 16,428,786, with `geom` NULL on **4,354,603**.
Bastrop 48021: **5 multi-part** of 74,729, zero null geom.

**A Bastrop-only stamp would almost miss the second geometric failure mode.** Five rows is
presence, not exercise. The stamp's adjudication county must be supplemented by a
high-multi-part county before the multi-part path can be called proven.

The 4,354,603 null-geom rows are the statewide **unmeasurable** population for the stamp, and
sizing it was the point of asking. It is 26.5% of `txgio_parcel`. Note `txgio_parcel` carries
16.4M rows against ~13.7M parcels, consistent with the known multiple-rows-per-feature shape
that the parcel-feature denominator exists to correct.

## Q5. The flood store disagreement is 7%, and AO-versus-AE is the wrong headline.

533,867 parcels in both stores across 10 counties: **496,536 agree, 37,331 disagree.**

**AO/AE is 129 parcels.** The bulk is zone-versus-X: AE/X 16,022, A/X 9,145, X/AE 6,732,
X/A 4,824 — **36,723 of 37,331 disagreements are one store saying a hazard zone and the other
saying X, outside.** That is a different and larger claim than a subtype disagreement, and it
is in-versus-out of a Special Flood Hazard Area.

**The carried memory naming AO-versus-AE as the thing to reconcile before fixing the merge is
correctly aimed at a real case and wrong about its size.** Reconciliation must be scoped to
zone-versus-X.

Also: the tier2 bake covers **10 counties**, not statewide. The `fema:nfhl-flood-zone`
snapshot rows are **176 coordinate cells**, keyed `coord:{lat}:{lng}`, and cannot be joined to
a parcel at all.

## What this changes

| item | before | after |
| --- | --- | --- |
| R-7 | named highest-value unsettled | **falsified, closed, no action** |
| S-21 population | 253, assumed counties | **254 counties, complete** |
| Item 3 DB half | add a constraint | **no table to reference; needs a key grammar first** |
| Item 2 stamp gate | Bastrop first | **Bastrop exercises multi-part with n=5; add a second county** |
| flood reconciliation | AO vs AE | **zone vs X, 36,723 cases** |
| `land-use` / `landuse` | known defect | **confirmed live, 19 rows stranded** |
