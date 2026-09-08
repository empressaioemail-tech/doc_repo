---
id: 2026-09-08_zoning_unaccounted_two_populations
title: The zoningDistrict gate refusal is two populations, and only one of them is a ruling
date: 2026-09-08
status: active
decided_by: Nick (operator), 2026-09-08
applies_to: hauska-factory
plan_rows: [P-124]
seat: integration (doc-repo-79)
snapshot:
  hauska_factory: df22ea88
  measured_at: 2026-09-08T01:30Z-02:00Z
related:
  - 90_operations/OPS-16_texas_market_plan_of_record
  - _inbox/2026-09-08_ctx-w2_readiness-gate-rebuild_findings.md
  - _decisions/2026-09-01_every_parcel_starts_with_a_full_record.md
---

# The zoningDistrict refusal, and what is actually being decided

## What happened

With the population half of the pre-bake readiness gate rebuilt and merged, the first
Bastrop staging bake refused `RAIL_REFUSED`. The refusing rail is `zoningDistrict`, and
it refuses in all six Central Texas counties. Fifteen of seventeen rails pass.

    48021 Bastrop        199 unaccounted
    48055 Caldwell       589
    48209 Hays         5,180
    48491 Williamson   7,095
    48309 McLennan    28,467
    48453 Travis      37,667   (plus maxImperviousCoverPct at 244,669)
    ------------------------------------
    total             79,197

Every one of those cells is on an `incorporated = true` parcel: inside city limits,
where zoning exists, carrying neither a value nor a declared absence. The gate is
correct to refuse. Nothing here is a defect in the gate.

## The decision the operator was asked for, and the decision that was actually needed

The operator was offered three options and chose the second: rule the polygon-misses
`not-applicable`, but only after something actually looks at them, and document it well
enough to come back to.

Measuring the population before acting on that ruling changed its scope by an order of
magnitude. The 79,197 cells are two populations with opposite honest resolutions, and
the ruling only ever applied to the smaller one.

    POLYGON MISS   city HAS a staged zoning layer, most of its parcels carry a value,
                   these specific parcels matched no polygon          5,876   (7.4%)
    UNWIRED CITY   city has NO staged zoning layer at all, so nothing
                   was ever consulted for any parcel in it           73,321  (92.6%)

Lago Vista alone accounts for 12,745. The operator's ruling covers 7.4 percent of the
gap. The other 92.6 percent must not be resolved that way: for a city whose zoning layer
was never acquired, "nothing looked" is literally true, and a `not-applicable` there is
the fabricated absence ENFORCEMENT prohibits.

## The finding that makes most of this not a ruling at all

`src/jobs/parcel-r5-zoning.mjs` already carries the honest resolution for the larger
population, and it has never run.

Its own module header records a 2026-09-05 fix (F-01 Wave 3 item 3): 49 cities have real
in-city parcels and no `tx_zoning_district_staging` row at all, `loadInScopeCities`
structurally never returns them because the join requires a staged match, and their
cells therefore "sat unaccounted forever with no code path to ever resolve them". Every
run now also sweeps those cities to a gated `{kind: "refused", reason: ...}` cell.

`refused` is an EARNED cell kind (`cell-state.js`: `EARNED_CELL_KINDS = ["value",
"absent-verified", "refused"]`) while `isUnaccounted` is strictly `kind ===
"unaccounted"`. So a swept cell leaves `unaccounted_count` entirely, honestly, without
anyone claiming a determination that was never made.

The job last ran **2026-09-02**. That is before the 2026-09-03 StratMap reload that
replaced every parcel row in all six counties, and before the 2026-09-05 fix itself. No
`refused` cell exists anywhere in the six counties, which confirms the sweep has never
executed. The unaccounted counts are stale by construction.

The writer also only ever UPDATEs a cell that is currently `unaccounted`; it never
INSERTs and never writes `absent-verified`. So a re-run cannot overwrite an existing
value and is purely additive.

## What was decided

1. **Run `parcel-r5-zoning` for the six counties before treating any of this as a
   ruling.** This is not remediation and not relabelling. It is running the
   determination path that already exists and has not run since the data underneath it
   changed. It resolves the unwired-city population to `refused` with a reason, and
   re-runs the real spatial join for wired cities against post-reload parcels.

2. **The operator's `not-applicable` ruling applies only to the polygon-miss residue
   that survives step 1**, and only with a per-city completeness declaration behind it
   (see below). The residue is expected to be a fraction of 5,876, because the last
   spatial join predates the reload.

3. **`maxImperviousCoverPct` on Travis is not covered by this decision.** It refuses at
   244,669 while the same rail is `excluded` in the other five counties. That asymmetry
   is unexplained and is carried as an open item, not resolved here.

## The artifact that is actually missing, and is the thing to come back to

`parcel-r5-zoning`'s header states the reason a polygon miss stays `unaccounted`, and it
is the right reason:

> no per-city completeness declaration exists anywhere in this stack (schema, LDT
> ZONING_LAYERS config, or ops backlog), so a zone-polygon miss always stays
> 'unaccounted', never a fabricated absence.

That is the gap. To honestly call a polygon miss `not-applicable`, someone must be able
to say **this city's staged zoning layer is complete**, so that a parcel matching no
polygon is genuinely unzoned rather than sitting in a hole in our layer. No such
declaration exists for any city, which is why the writer's author correctly refused to
write the state.

A per-city completeness declaration is a small, bounded artifact: city key, the layer
version it attests to, who or what established completeness, and the date. Until it
exists, a polygon miss has no honest resting state other than `unaccounted`, and the
operator's ruling cannot be implemented without inventing one.

This is the item to come back to. It is not blocked on anything except deciding what
evidence counts as establishing a city layer complete.

## Why the obvious shortcut is prohibited

Writing `not-applicable` across the 79,197 would clear the gate tonight and would be a
lie in 73,321 cases and unevidenced in the rest. The specific failure mode is already
ruled on: never convert `unaccounted` to a declared absence to clear a gate, and watch
for an unaccounted count falling without a matching acquisition landing, because that is
relabelling and it looks exactly like progress.

The counts in this record exist so that exact check is possible later. If
`unaccounted_count` for `zoningDistrict` drops without either a `parcel-r5-zoning` run
or a named completeness declaration, something relabelled.

## Reversal criteria

Reverse the decision to run `parcel-r5-zoning` first if the run writes any cell state
other than `value` or `refused`, or if it modifies a cell that was not `unaccounted`.
Either would mean the writer does not behave as its header describes and the whole basis
of this record is wrong.

Reverse the per-city-completeness requirement if a source of truth for layer
completeness is found to already exist somewhere in the stack. The writer's author
searched schema, the LDT `ZONING_LAYERS` config and the ops backlog and found none; a
fourth place would change the answer.

## Instrument note

The census behind the two-population split is
`scripts/ctx-w2/zoning-unaccounted-census.mjs` in hauska-factory. A companion bbox
containment probe was written and **its self-test failed and it was discarded**: 0 of 300
known-stamped parcels bbox-overlapped their own city's polygons, which is impossible if
the join were right. The cause is a key-format mismatch — `txgio_parcel.zoning_jurisdiction`
carries `bastrop-city-tx` while `tx_zoning_district_staging` carries `city_key =
bastrop-tx` and `city_name = Bastrop`. That probe was a reimplementation of a spatial
join the real job already does correctly, and rebuilding it was the wrong instinct. The
authoritative record is `parcel-r5-zoning` itself.

---

## OUTCOME — `parcel-r5-zoning --apply` executed 2026-09-08

Job rebuilt from verified `origin/main` (`df22ea88`) and redeployed; the running image
moved from `sha256:489b20d4` to `sha256:002125d3`, confirmed by digest on the job
definition rather than by tag. Dry run first, then apply.

    kind             before      after
    value           531,919    531,919     unchanged
    not-applicable  370,289    370,289     unchanged
    refused               0     73,321     NEW -- the no-staged-layer sweep
    unaccounted      79,197      5,876

Per county, unaccounted remaining: Bastrop 181, Caldwell 40, Hays 570, McLennan 1,056,
Travis 2,758, Williamson 1,271.

**The two derivations agree exactly.** The census in
`scripts/ctx-w2/zoning-unaccounted-census.mjs` predicted the split from city-level
wiring status (73,321 unwired / 5,876 polygon-miss) before the job ran. The job's own
spatial behaviour produced precisely those numbers. Those are independent derivations —
one classifies cities by whether any parcel in them carries a value, the other runs the
real per-city spatial join — and they were not tuned to each other.

No `value` or `not-applicable` cell moved, which is the behaviour the writer's header
claims and the condition this record's reversal criteria named. The reversal criteria are
therefore NOT met and this decision stands.

## The residue is a hard blocker, not a cleanup item

`src/lib/parcel-record-engine/publish-gate.js` line 41 computes the rail verdict as
`ok: unaccountedCount === 0`. The gate is ZERO TOLERANCE: one unaccounted cell on a live
rail refuses the county.

So the 5,876 remaining polygon misses still refuse all six counties, and the per-city
completeness declaration is the last thing standing between P-124 and a bake. It is not
an artifact to get to eventually; nothing bakes until it exists.

This was not obvious from the ruling as taken. The operator ruled option 2 believing it
covered a residual population; it is in fact on the critical path.

## What the declaration has to answer

For each city with a staged zoning layer, the claim that must be defensible is: **this
city's staged layer is complete for the area it covers**, so a parcel inside city limits
that matches no polygon is genuinely unzoned rather than sitting in a hole in our layer.

Minimum shape: city key, the staged layer version or `fetched_at` it attests to, what
established completeness (a published city GIS statement, a coverage comparison against
the city limit polygon, a human review), and the date. Anything less is an assertion.

The 5,876 are not uniformly distributed and the per-city counts should drive the order:
Travis 2,758 and Williamson 1,271 carry more than two thirds of the residue between them,
and Bastrop's 181 is small enough to be the pilot.

## Relabelling tripwire

If `zoningDistrict` unaccounted falls below 5,876 without either a named completeness
declaration or a further acquisition landing, something relabelled. The per-county
numbers above exist so that check is mechanical.
