# CTX-STAMPFALL — 67 parcels can never reach any state, and the real fix is deferred on purpose

Repo: `hauska-factory`. Branch from `origin/main` **after** `f0fe15bb` (CTX-PARCELGATE,
PR #122, merged). You will edit the file it just changed; confirm that commit is in your
base before writing anything.

This is the last thing standing between Bastrop and Travis and a bake.

## The hole, established by reading the write paths

`parcel-r5-zoning` is the SOLE owner of the `zoningDistrict` rail. `parcel-record-fill`
says so in its own comment and deliberately refuses to upsert it, because doing so already
wiped `zoningDistrict` across Williamson and partially McLennan, Travis and Hays over
eight recurrences in one day. No other job in this repo touches `zoning_district`.

`parcel-r5-zoning` writes a `value` cell only inside its match path — only for a parcel
that matched a staged polygon.

So a parcel that matches no staged polygon but carries a real `txgio_parcel.zoning_district`:

- cannot reach `value`, because it matched nothing, and
- cannot reach `refused`, because CTX-PARCELGATE's condition 2 correctly excludes it, and
- therefore stays `unaccounted` permanently.

`publish-gate.js` requires `unaccountedCount === 0`. That population is **17 in Bastrop
and 50 in Travis**, both re-verified live on 2026-09-09.

Two prior closes referred to a "pending Factory re-bake" that would resolve them. **It does
not exist.** That was an inference, repeated, and the integration seat carried it forward
twice before reading the write paths. Do not go looking for it.

## Why those parcels have a district at all, which is the root

Their `txgio_parcel.zoning_district` was written by `stampCountyZoning()` in
`legacy-design-tools`, from **LDT's own zoning-layers registry** — a completely separate
registry from `hauska-engine`'s `zoning-staging` one. CTX-STAMP established that
separation on 2026-09-09 and correctly stopped rather than ship against the wrong table.

So two registries disagree about coverage. LDT's stamp covers these parcels; the engine's
staged layer does not. **That disagreement is the real defect**, and reconciling the two
registries is the correct fix.

The operator has ruled that reconciliation DEFERRED, and this lane implements the lighter
path with an explicit flag to come back. Do not attempt the reconciliation here.

## The fix

When a parcel matches no staged polygon **and** carries a real
`txgio_parcel.zoning_district`, write a `value` cell for it.

Constraints, and the first is the one that matters most:

1. **Its `source` must name the stamp, not the staging layer.** `ZONING_SOURCE` is the
   constant `"tx_zoning_district_staging"` and that value did not come from there. Using it
   would be a false provenance claim, which is the single thing this program's whole gate
   structure exists to prevent. Introduce a distinct source string that says what it is.

2. **Establish the stamp's currency before writing a value from it.** CTX-ELGIN re-verified
   all 17 still carry a real value today, but that is evidence of presence, not of
   currency. A stale stamp written as a current `value` is worse than an `unaccounted`
   cell. If you cannot establish a vintage for the stamp, say so plainly and state what
   you wrote instead — that is a legitimate outcome and it is better than a confident
   wrong one.

3. **Reuse CTX-PARCELGATE's `RESIDUE_HAS_REAL_ZONING_SQL`.** It already identifies exactly
   this population, per-parcel, with `EXISTS` aggregation rather than a flat join. One
   definition, two consumers: it decides both that a parcel is excluded from `refused` and
   that it is eligible for a stamp-sourced `value`. Two independent queries that must agree
   would drift.

4. **Do not change the residue arithmetic.** These parcels still match no polygon, so raw
   residue stays 36 Bastrop / 506 Travis and the guard keeps comparing raw. Do not touch
   `assertResidueWithinDeclaration` and do not change any ceiling.

## The revisit flag, which is a required deliverable

The operator asked for this explicitly. Follow the precedent set twice today: the flag
goes **in the code and is pinned by a dedicated test**, not only in a document.

It must name:

- what is deferred: reconciling `hauska-engine`'s `zoning-staging` registry with
  `legacy-design-tools`' `zoning-layers` registry, so a parcel's zoning coverage does not
  depend on which registry is asked;
- why it was deferred: to unblock the Central Texas bake;
- what this fallback costs: a `value` whose provenance is a second registry the staged
  layer disagrees with, which is honest but is not the same as coverage;
- what would trigger the revisit.

A comment nobody is required to read is not a flag. A test that fails if it is removed is.

## Verify by violating

In one run, with real parcel ids:

- a parcel matching no polygon and carrying a real stamp gets a `value` cell whose source
  names the stamp;
- a parcel matching no polygon and carrying no stamp still gets `refused`, unchanged;
- a parcel matching a staged polygon still gets `value` with `ZONING_SOURCE`, unchanged.

Confirm the guard still refuses when raw residue exceeds the ceiling. This lane must not
make any gate stop firing.

## The direct question, answer it as a yes or a no

After this change, plus CTX-SP staging Elgin's S-P code, plus Bastrop's ceiling re-derived
to 26: **does `parcel-r5-zoning` run to completion for Bastrop and does
`unaccountedCount` reach zero?** And separately for Travis, which needs only this change
since its ceiling is already written at 506.

Answer both plainly. If a fourth thing is missing, that is the finding and it outranks a
clean close, exactly as CTX-PARCELGATE's third-precondition answer did.

## What you must NOT do

Do not reconcile the two registries. That is the deferred work and the flag exists so it
is not lost.

Do not write to `hauska-engine` or `legacy-design-tools`. CTX-SP is live in hauska-engine
on the Elgin registry right now; if you believe your fix needs a change there, STOP and
report rather than reaching across.

Do not change any ceiling, do not touch `assertResidueWithinDeclaration`, do not pass
`--apply`, do not deploy, do not submit a Cloud Build, do not run any bake, publish or
walk. The integration seat rebuilds and runs the counties.

Do not write `not-applicable` on any parcel.

## Traps carried forward

`txgio_parcel` holds multiple geometry rows per `prop_id` (48021: 74,729 rows against
62,257 distinct). Per-parcel `EXISTS` aggregation, never a flat join.

A long-running query at near-zero CPU is STUCK, not working. Restrict by `city_key`,
pre-filter on the numeric bbox columns, set `connect_timeout` and `statement_timeout`, and
announce heavy scans before starting them.

`cli.mjs` has a code-only catch handler that swallows error detail; call
`runParcelR5Zoning` directly to see the real error.

## Close contract

Standard lane close JSON, plus:

- The source string you introduced and why it names what it names.
- The stamp's currency: what you established, how, or that you could not.
- Both direct answers, Bastrop and Travis, as a yes or a no.
- All three violation runs with real parcel ids.
- Where the revisit flag lives and which test pins it.
- `leave_behind`.

Report the merge commit. The integration seat rebuilds and runs the counties from it.
