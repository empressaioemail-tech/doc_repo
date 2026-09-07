---
lane: integration
item: "Portfolio-wide orphaned-migration pattern — unmerged branches run directly against production, discovered twice tonight with matching fingerprints"
checkpoint: "DONE (investigation, cross-repo). No remediation performed — classification and evidence only. Second instance routed to hauska-engine lane (cente-67) for scoping alongside the first."
date: 2026-09-06
---

## What this is

Two, not one, live production data stores in `hauska-engine` were created and
populated by migration/ingest scripts that exist ONLY on unmerged git
branches — never landed on `main`, so `main`'s own tracked history cannot
reproduce its own database. Both instances share the same fingerprint,
strongly suggesting one operational habit (one contributor or one session
running ad hoc migrations directly against the shared production Neon
database from branch work, then moving on without ever opening or merging a
PR) rather than two independent lapses.

## Instance 1 — building-footprint (found first, already routed for remediation)

`tx_building_footprint` (10.67M rows, all of Texas, real ML-derived
geometry, live since 2026-08-11/12) has no creating migration on `main`.
The real DDL and ingest scripts exist only on `origin/feat/p2-4-tx-building-footprint-staging`,
128 commits behind main, never merged. That branch's migration file also
claims migration number `0073` — already taken on `main` by an unrelated,
already-merged flood-zone migration, a live numbering collision. Full
detail: `_decisions/2026-09-06_boundary_envelope_atom_program_scope.md`
addendum. Routed to Engine (cente-67) as a greenlit remediation task
(reconcile the branch, resolve the `0073` collision, then safely re-run the
atom-writer against the five CTX counties still missing footprint atoms —
the raw geometry is already 100% staged for all six).

## Instance 2 — RRC wells/pipelines staging (found tonight, new)

`tx_rrc_well` and `tx_rrc_pipeline` (per standing operator memory, roughly
1.4M wells live across 254 counties) also have no creating migration on
`main`. The actual DDL
(`packages/engine-core/scripts/migrations/0073_tx_rrc_staging.sql` — note:
ALSO claims `0073`, the same collision as instance 1) and ingest scripts
(`ingest-tx-rrc-staging.mjs`, `apply-tx-rrc-staging-migration.mjs`,
`join-rrc-well-counties.mjs`) exist only on
`origin/feat/p2-3-rrc-staging-tables`, also 128 commits behind main, never
merged. Confirmed via exhaustive diff (every file that has ever contained
`CREATE TABLE`/`ALTER TABLE` across all 234 branches, checked against
main's current tree) that no other branch and no later commit on main ever
created this table under any name. Main's own shipped code
(`packages/engine-core/src/well-fact/fetch-wells-staged.ts`) directly
queries `FROM tx_rrc_well` and ships a `stagedWellTableExists()` runtime
check against it — **main is actively dependent in production on a table
main's own git history cannot explain or reproduce.**

**Why this reads as one habit, not two lapses**: both orphaned branches
diverge from main at the identical 128-commit distance, and a commit on the
RRC branch itself (`03f3157`, "register P2-4 ingest/migration/benchmark
scripts") directly references the sibling P2-4 footprint work. Rejected
alternative — that `tx_rrc_well` was independently rebuilt and merged under
a different name later, making this branch a harmless stale duplicate —
ruled out because main's `fetch-wells-staged.ts` references the literal
name `tx_rrc_well` and no migration anywhere in main's full history defines
a wells-staging table under any name; there is no candidate "real" home
this could be a duplicate of.

## Scope of the sweep that found this (what was and wasn't checked)

A full-portfolio sweep covered all 26 repos in the `empressaioemail-tech`
org tonight. Beyond the two instances above: hauska-map, hauska-atom-contract,
and hauska-mcp-server are structurally clean (confirmed no database, or no
orphaned table-creation content, across every branch in full history).
hauska-factory had one candidate that resolved as a caught-and-corrected
draft (a stale branch got the store split wrong; main's own migration
comments and a passing CI test show the correct split shipped instead) —
a working example of the system catching itself, not a defect.
legacy-design-tools has one **open, unresolved** anomaly: branch
`origin/feat/icc-shells-formal-references` (665 commits behind main, from
2026-06-22) carries `ALTER TABLE finding_runs ADD COLUMN IF NOT EXISTS
code_references jsonb`. Nothing on main reads or writes `code_references`
today, but this could not be confirmed clean without direct database
access to check whether the column was ever actually added to the live
table — flagged as open, not closed. Fourteen other repos across the
org (smartcity-os/dashboards/kit, hauska-platform/sdk/brief-extension,
plan-review, AEC-cortex, icc-portal, icc-demo, radar, og-twin, mox_demo,
slb_prototype, legacy-revit-sensor, empressa-trading, smart-markets,
atx-bulls) were each genuinely checked (not skipped by name) and are
confirmed to hold no orphaned property/parcel data of any kind — see the
companion reports from tonight's sweep for per-repo detail.

## Open items

1. Reconcile `origin/feat/p2-3-rrc-staging-tables` the same way instance 1
   needs reconciling — resolve the `0073` collision (now claimed by THREE
   things: the merged flood-zone migration, the footprint branch, and this
   RRC branch), decide whether to merge the branch as-is or re-author the
   migration fresh against current main, and confirm the live table's
   actual schema matches what either path would produce before trusting
   `fetch-wells-staged.ts`'s runtime check as sufficient.
2. Determine whether `code_references` was ever actually added to
   `finding_runs` in the live legacy-design-tools database — a real DB
   check, not a git check, resolves this.
3. Standing question for whoever owns factory/engine deploy discipline:
   both confirmed instances plus the still-open one all point at the same
   underlying gap named at the top — direct migration execution against
   shared production outside of a merged, reviewable PR. This sweep found
   no evidence of a THIRD hauska-engine instance (exhaustive check, not
   sampling), but the sweep's completeness for repos outside tonight's six
   is necessarily shallower (breadth over depth, per the dispatch). A real
   fix here is process, not just cleanup: whatever let this happen twice
   needs a control, not just two repairs.

## Resolution (2026-09-06)

Both instances closed in one PR: `hauska-engine#391` (`aa057554`, verified
merged). Both migrations re-authored under fresh, non-colliding numbers
(0075 tx_building_footprint, 0076 tx_rrc_well/tx_rrc_pipeline), written
against the live schemas directly rather than copied from the stale
unmerged branches. Verified as a genuine no-op, not an assumed one: both new
`apply-*-migration.mjs` scripts were actually run against production —
every statement returned "already exists, skipping." `main` can now
reproduce its own database for both tables.

One more drift caught during reconciliation: `tx_rrc_pipeline` already had a
live `geom`+GiST column that its own original migration comment said
shouldn't exist ("PostGIS is NOT available on deployment Neon") — stale;
PostGIS 3.5.0 is confirmed enabled on this project. Reconciled under the
same PostGIS-conditional pattern already used by the building-footprint
migration, rather than left unexplained.

## Not done

Quarantine of anything beyond the two migrations themselves — no other
process audit was reopened as part of this close.
