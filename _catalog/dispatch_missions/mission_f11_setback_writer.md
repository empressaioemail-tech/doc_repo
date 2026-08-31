# Mission — the F-11 setback writer, and the allowlist that unblocks four writers

Two items, same repo, same seat, in this order. Both are on the CTX critical path
and **neither needs the alias table**, which is why they run now while the alias
rulings are being seeded: writing a writer needs the schema, not the data.

Repo `hauska-engine`. Registered worktree
`P:/seat-worktrees/property/hauska-engine-f11-setback`. Writers live in
`packages/engine-core/scripts/`.

**This card writes writers. It does not apply. Apply is P4 and is held on the
Gate 8 inhabited dayOne re-read.**

## Item 1 — the writer allowlist (do this first; it unlocks four writers)

`packages/engine-core/scripts/atoms-writer-job.mjs` hardcodes a single child:

```
process.env.CAD_PARCEL_ROLL_PATH = "1";
...
const childArgs = ["--filter", "@hauska-engine/engine-core", "exec", "tsx",
                   "scripts/write-cad-parcel-roll-county.mjs", "--", ...passthrough];
```

Cloud Run cannot override `command`, so this one file is why four of the five
writers have **no job form at all**. Generalise it to an allowlist keyed by writer
name. `CAD_PARCEL_ROLL_PATH` is set unconditionally today and must become a
property of the selected writer, not a constant.

**Fail closed on selection.** An unknown or absent writer name refuses with a
non-zero exit and a named reason. Never default to the CAD writer — a silent
default is how a job runs the wrong writer against a named county and reports
success.

**Refuse on missing county, and prove the parse.** Cloud Run passes
`--name=value`. A reader that only understands the spaced form silently runs on
its default: the Factory publish job ignored `--county` until 2026-08-28 for
exactly this reason. Parse `--name=value`, refuse when county is absent, and
**read the run scope back** from an off-default execution before trusting the job.

## Item 2 — the F-11 setback writer

It **does not exist in any form**. Model it on the existing writers in the same
directory (`write-cad-parcel-roll-county.mjs`,
`write-utility-easement-county.mjs`), but on the **conformant** design.

**Conformant, not old-shape.** Old-shape writes ended permanently; no `--apply`
through the old writer for any county. The conformant writer design is F-18
stage-and-merge: ordered chunked slices with a `run_event` per chunk, batched
links, lease v2 with the row locked in the chunk transaction. Do not tune or
re-apply the old writer.

Scope is **city-scoped**, because counties do not zone unincorporated land: the
chain is edges from setback-rule from zoning district from the city layer from the
incorporated city. A county-wide setback owe is a category error. Unincorporated
parcels resolve `not-applicable` structurally; in-city parcels with no table landed
are `unmeasured` until probed, then `absent-verified`. **Never `not-applicable` on
an in-city parcel.**

The writer must refuse rather than emit on: a missing county, an unresolved
jurisdiction binding, a rule set it cannot name a source for, or a district it
cannot resolve. A raw source key, a fallback string, or a caught exception's
default is not a resolution.

## Two quarantines to respect, not to fix here

**188,103 placeholder `setback-rule` atoms** exist under
`storage-port-proof/phase-1a`; Hays and Williamson are 100% placeholder. **McLennan
carries 65,814 buildable envelopes derived from 0 setback rules.** Both must be
quarantined before anything serves. This card must not write on top of either, and
must not silently adopt a placeholder as an input. Name any collision it finds.

## Item 3 if time allows — stop the easement writer live-fetching

`packages/engine-core/scripts/write-utility-easement-county.mjs` live-fetches
ArcGIS (around line 191), the shape the collect card's own Do-not list forbids. It
must read landed bytes. This is lower priority than items 1 and 2 and may be handed
back separately.

## Do not

- Do not apply. No `--apply` for any county from this card.
- Do not write through the old shape.
- Do not default a county, a writer name, or a jurisdiction binding.
- Do not run `landing-import` — a second run is unrecoverable today.
- Do not apply migration `0005` as drafted; it destroys four real setback tables.
- Do not write on top of the placeholder setbacks or the McLennan envelopes.
- Do not run two writers against the same `(store, entity_type, county_fips)`.
- Do not touch any repository other than the registered engine worktree.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot (repo, branch, commit) in the first output. State the falsifier for each
check before running it — including a **negative** run proving the allowlist and
the county parse refuse. `leave_behind` named, `none` is valid. Subagents do not
commit. Verification does not delegate below the lane planner.
