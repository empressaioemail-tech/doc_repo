## Mission — P-156 (Bastrop pilot): the per-city zoning completeness declaration that unblocks the CTX bake

You are the deepest worker in OPS-23 wave 6. You do not spawn sub-agents. The dispatch
planner supervises you and reviews CP1 (the declaration's shape) before any write.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### Why this row is the CTX blocker

`_decisions/2026-09-08_zoning_unaccounted_two_populations.md`: after `parcel-r5-zoning`
re-ran, 5,876 in-city parcels across the six counties are still `unaccounted` for
`zoningDistrict` (Bastrop 181, Travis 2,758, Williamson 1,271, the rest smaller). The rail
gate is zero-tolerance, so every county refuses to publish. Clearing them honestly needs a
PER-CITY COMPLETENESS DECLARATION that exists nowhere: without it a parcel matching no polygon
is indistinguishable from a hole in our own staged layer. Writing `not-applicable` to clear it
is forbidden (a relabelling tripwire exists). This lane builds the declaration shape on
Bastrop's 181 and proves it; Travis and Williamson follow with the same shape in the next wave.

### Where you work

`hauska-factory-p156-bastrop` (branch `feat/p156-city-completeness-declaration`),
`hauska-engine-p156-bastrop` (branch `feat/p156-city-declaration-consumer`) if the reader
must read the declaration, from `origin/main`; declare start commits.

### What you build

1. **The declaration.** One record per city: the staged zoning layer (URL, field, the city's
   own last-edit date read at source), the city limits polygon used, the parcel count in city
   limits, the count matched to a district polygon, the count matched to none, and a state:
   `DECLARED_COMPLETE` (the city publishes one layer and it covers its limits; the unmatched
   parcels are named with a reason each, e.g. right-of-way, water, county island) or
   `EXPLICITLY_HELD` (with the numbers and the reason the layer cannot be called complete). It
   is data with provenance, versioned, read by the gate; never a code constant.
2. **Bastrop.** Run `zoning-discovery` for Bastrop, compare the staged layer against the city's
   two services read live this week (`Zoned_Parcels/FeatureServer/83`, edited 2026-07-23, and
   `Parcels_One_Click/FeatureServer/23`, edited 2026-08-24; they disagree on setback values for
   the same parcel and on which ordinance they cite, so the declaration records both and names
   which the zoning stamp reads), measure cellPct and arealPct, disposition every one of the
   181 unaccounted parcels individually (the reason is data, not a label), and write the
   declaration.
3. **The gate reads it.** A parcel that is unaccounted in a `DECLARED_COMPLETE` city with a
   named reason moves to the honest state the reason implies (`not-applicable` only where the
   parcel is not land the code zones, else `refused` with the reason); in an
   `EXPLICITLY_HELD` city nothing moves. A test that a declaration with zero unmatched cannot be
   written by a run that matched zero (not vacuous), and a test that the tripwire still fires
   on unaccounted falling without a declaration.
4. **Prove it on Bastrop.** Re-run `parcel-r5-zoning` for 48021; the gate reads Bastrop's
   unaccounted count and its verdict; paste both. Do not run the bake; that is the next wave
   once Travis and Williamson carry declarations.

### Falsifiers

- If Bastrop's unaccounted falls to 0 without every one of the 181 carrying a named reason,
  the declaration relabelled.
- If the gate passes a city whose declaration is `EXPLICITLY_HELD`, the gate is wrong.
- If the declaration can be written by hand without the measured counts, it is a constant.

### Out of scope

Travis and Williamson (next wave, same shape). Setback values (P-154). The bake.

### Close

`_inbox/<date>_p156-bastrop_close.json`, `planRows` `["P-156", "P-124"]`, with the declaration
file path, the 181 dispositions, the gate read before and after, PRs and merge SHAs with
conclusion strings. `leave_behind` is required.
