# CTX-PARCELGATE — the guard counts per city, the population is per parcel

Repo: `hauska-factory`. Branch from `origin/main` **after** `b55d76e9` (CTX-ZONESCOPE,
PR #121), which is already merged. You will be editing the same file it changed, so
confirm your base contains it before writing anything.

This is the last code blocker between Bastrop and Travis and a bake.

## What is already settled

CTX-ZONESCOPE closed 2026-09-09. Read `_inbox/2026-09-09_ctx-zonescope_close.json` in
full, especially `proposedCeiling_NOT_written` and `deltaParcelControlValidation`. Its
Fix 1 is merged. Do not redo it.

Established, with live evidence and a second independent predicate plus a positive
control:

    Bastrop 48021   raw residue 36   of which  9 genuinely uncovered
    Travis  48453   raw residue 506  of which 456 genuinely uncovered

The remainder decomposes into named classes, not noise:

- **Staleness.** Parcels already carrying a real `zoning_district` in `txgio_parcel`
  through some other mechanism. A pending re-bake resolves these to `value`. CTX-ELGIN's
  17-parcel Bastrop staleness list was re-verified live and all 17 still carry a real
  value. CTX-ZONESCOPE additionally found a Travis staleness class of 50.
- **S-P.** Ten Bastrop parcels geometrically covered by a real, live Elgin `S-P` polygon
  that this program's registry never mapped. Re-verified live today. Seven of the ten
  already carry a real `zoning_district` by another mechanism; three do not.
- **Genuinely uncovered.** 9 Bastrop, 456 Travis.

## The defect

`assertResidueWithinDeclaration` compares the FULL RAW per-county residue against the
declared ceiling. `buildLayerGapCells` is gated by `isDeclaredLayerGap(cityName)`, a
per-CITY boolean. So once `apply=true` runs, every residual parcel of a declared-gap city
becomes a `refused` cell candidate — staleness, S-P and genuinely uncovered alike —
subject only to the gated UPDATE's "currently unaccounted" clause.

Writing `refused` over a parcel that a re-bake would correctly resolve to `value` is a
wrong statement about that parcel, and it is the class this program's whole gate structure
exists to prevent.

## The operator's ruling, 2026-09-09

**Take the lighter fix and flag it for revisit after the bake.**

Keep `assertResidueWithinDeclaration`. Do not remove or weaken the guard. Do not
re-architect the ceiling. Make the WRITE per-parcel eligible, so a `refused` cell is
written only for a parcel individually established as uncovered.

The fuller question — whether a per-county residue ceiling is the right instrument at all
— is deliberately deferred. It is not solved by this lane and must not be quietly solved
by it either.

## The per-parcel gate

A parcel earns a `refused` layer-gap cell only if, at write time:

1. It matched no polygon in the union of its city's staged base layers, and
2. It does not already carry a real `zoning_district` in `txgio_parcel`.

Condition 2 is what stops a `refused` being written over the staleness class. Both
conditions are in-store and cheap.

**The three unresolved S-P parcels are the honest hard case and you must not paper over
them.** Seven of the ten are caught by condition 2. The other three are geometrically
inside a real district we failed to map, so they are neither uncovered nor resolvable
here — the registry that would map `S-P` lives in `hauska-engine`, out of this repo.

Do NOT invent an exception list for them. The `DECLARED_LAYER_GAP` ruling shipped
deliberately without an exception mechanism, on the grounds that an exception is reusable
on parcels nobody measured, and that reasoning still holds.

Measure what actually happens to those three under your gate and report it plainly. If
they end up `unaccounted`, say so and say what that does to the publish gate, which is
zero-tolerance (`publish-gate.js`: `ok: unaccountedCount === 0`). If that means Bastrop
still cannot publish without an engine-side registry fix, **that is the finding and it is
more valuable than a clean close.** Name it; do not engineer around it.

## The revisit flag

Per the operator, and following the impervious-cover precedent from earlier today: the
flag goes in the code and is pinned by a test, not only in a document.

It must name what is deferred (the per-county ceiling instrument itself), why it was
deferred (to unblock the bake), and what would trigger the revisit. A comment nobody is
required to read is not a flag.

## Verify by violating

Show the gate refusing to write a `refused` cell for a staleness-class parcel, and writing
one for a genuinely-uncovered parcel, in the same run. Both outcomes from real parcels
named by id, not fixtures alone.

Confirm the guard still refuses when the raw residue exceeds the ceiling. This lane must
not make the gate stop firing; it makes the write more precise while the guard keeps its
current behaviour.

## Hard prohibitions

Do not change any ceiling number. Not 9, not 36, not 456, not 506.

Do not write `not-applicable` on any parcel. `not-applicable` claims the land is unzoned;
a parcel probed and found uncovered earns `refused`. Watch for an unaccounted count
falling without an acquisition landing — that is relabelling, and the tripwire is in
`_decisions/2026-09-08_zoning_unaccounted_two_populations.md`.

Do not pass `--apply` to the rail. Dry runs only.

Do not deploy, submit a Cloud Build, or run any bake, publish or walk. The integration
seat rebuilds and runs the counties.

Do not write to hauska-engine, legacy-design-tools or hauska-map. The `S-P` registry fix
belongs in hauska-engine and is not yours.

`CTX-SITUS-SKIP` is live in legacy-design-tools on a related root cause (punctuation-only
situs). You should not encounter it; if you believe your fix requires an LDT change, STOP
and report rather than reaching across.

## Traps carried forward from four lanes

`txgio_parcel` holds multiple geometry rows per `prop_id` (48021: 74,729 rows against
62,257 distinct). Per-parcel `EXISTS` aggregation, never a flat join.

A long-running query at near-zero CPU is STUCK, not working. Restrict by `city_key`,
pre-filter on the numeric bbox columns, set `connect_timeout` and `statement_timeout`, and
announce heavy scans before starting them.

`cli.mjs` has a code-only catch handler that swallows error detail; call
`runParcelR5Zoning` directly to see the real error.

## Close contract

Standard lane close JSON, plus:

- The per-parcel gate as implemented, and how each of the three classes fares under it,
  by count.
- The disposition of the three unresolved S-P parcels, and what it does to the publish
  gate.
- Whether Bastrop can publish after this change, stated as a yes or a no with the reason.
- Both violation runs, by real parcel id.
- Where the revisit flag lives and which test pins it.
- `leave_behind`.

Report the merge commit. The integration seat rebuilds and runs the counties from it.
