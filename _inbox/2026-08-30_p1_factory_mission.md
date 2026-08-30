# P1 controls — hauska-factory

## How to work this card (read first)

**Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.**
If a step looks like it needs a second agent, it needs a smaller step instead.

**You are authorized.** This card is compiled from the plan of record and carries
the operator's go for the work described. Do not stall waiting for permission you
already have. If you believe a step is wrong or unsafe, say so in the handback and
do the rest — do not silently narrow the scope, and do not refuse the whole card
over one item.

**Verification must terminate.** Every command you run exits on its own: builds,
typechecks, `vitest run`, or background-start plus `curl` plus kill. Never `watch`,
`serve`, `tail -f`, or anything that waits for a signal.

**Read product code by ref, not from the working tree.** Local checkouts here sit
on feature branches hundreds of commits behind and may not contain the files named
below. Use `git -C <repo> show origin/main:<path>` and
`git -C <repo> grep -n <pattern> origin/main -- <pathspec>`.

**Hand back, do not land.** No commit, no push, no deploy, no migration applied to
any store, no job started. Produce the diff and write the close artifact named at
the end of this dispatch. The planner commits and runs.


Make the checks able to fail. Nothing downstream of P1 is verifiable until these
four land, because each is currently a control that exists and cannot fire.

Repo: `hauska-factory`. Read by ref (`git -C <repo> show origin/main:<path>`); the
local clone is stale. No deploy, no job start, no migration run against any store.
Produce a diff and a handback; the planner commits and runs.

## 1. BP-CONTENT-01 must reject an all-null payload

`src/jobs/verify-walk.mjs`. `gradeTier1Content` filters the 28 required paths
through `hasKeyPath`, whose docstring states the value "may be null". `landUse`
is in that list. **The suite's own test asserts that an all-null payload passes.**
That assertion converted the defect into a specification, and it is why all six
Central Texas counties passed the content walk while serving
`baseFacts.landUse: null` on a parcel whose CAD row and atom both carry `A1`.

Replace presence with the four-state contract: every required leaf is `value`,
`absent-verified`, `not-applicable`, or `refused`. An `absent-verified` is earned
only when it carries a scope, an **evaluation-time** `asOf` (not the request
clock), and a `basis` that differs between parcels — two live Laird reads 113 s
apart differed only in `asOf` while `bakedAt` held, and the `basis` string was
character-identical across two different parcels.

Delete the all-null-passes assertion. Add a fixture that fails on
`baseFacts.landUse: null` while a land-use atom exists, and a gold that passes.

## 2. Every job refuses a missing county

`factory-conformant` defaults `county` to `48021` instead of refusing. Combined
with the standing Cloud Run trap — args are `--name=value`, and a reader that
parses only the spaced form silently runs on defaults — a flood run aimed at any
of the other five silently re-runs Bastrop and reports success.

Refuse on absent county. Parse `--name=value`. Emit the resolved run scope on the
close line so it can be read back from the execution log rather than inferred from
the invocation.

## 3. The collect gate must be readable by a job

The collect-complete gate names a file in `_inbox/`. **No job image contains
`_inbox/`** — the Dockerfile copies only `src` and `migrations`. `import_ledger`
exists and does a genuine two-count, but has **zero SELECTs**: nothing reads it.
`refuseHeldCell` has four call sites — its own definition, a proof job, and two
tests.

Give the gate a home a job can read, and give `import_ledger` at least one SELECT
in a gating position, so a Band-1 writer refuses to start when its rail has no
collect-complete record. Note the routing pin's field is **`held`**, carrying
plan-row values (`["P-25","P-09","P-17 COVER","Factory 1 --apply"]`), not `holds`
keyed `rail:<rail>` — extending it to rails is a schema change, not a lookup.

## 4. Split migration 0005

0005 is the only migration creating `landing_setback_registry`,
`landing_setback_record`, `landing_easement_gis` and `landing_cad_txgio_alias`,
and it is forbidden in nine places and replaced in none. P4 needs those tables.

**0005a — landing tables, Factory store.** Drop **all eight** `'absence'` seeds.
Austin, Kyle, Georgetown and Round Rock are registered in `SETBACK_TABLES` with
cited feet (Georgetown `human-verified` 0.95, audited 2026-07-23) and Austin alone
already holds 150,702 `setback-rule` atoms; seeding them absence overwrites sourced
data. Add `probed_at timestamptz` with
`CHECK (kind <> 'absence' OR probed_at IS NOT NULL)` so an unprobed absence is
unwritable rather than merely forbidden. Add `source_url_verified_at timestamptz`
— the Round Rock and Cedar Park URLs are synthesised from T3 elisions, and
`elgin-warmed-cohort` / `lockhart-ordinance` are sentinels passing a
`nonempty(source_url)` check.

**0005b — alias table, bake store.** `landing_cad_txgio_alias` only. It currently
ships inside 0005 against `FACTORY_DATABASE_URL`, while
`cad-txgio-alias-persist.mjs:252` inserts through `resolveTargetStores(...).DATABASE_URL`,
which `TARGET_VARS` restricts to `STAGING_`/`PRODUCTION_NEONDB_URL`.
`FACTORY_DATABASE_URL` is unreachable from that function, so the first insert
errors with "relation does not exist".

## Acceptance — each item proven in BOTH directions

Every control here is run against a known violation and observed failing, and
against a known-good and observed passing. A control observed only passing has not
been observed working. Two near-misses this session were caught only by the
positive arm: a C-collation bound that silently narrowed, and a wrong fixture that
made a correct instrument look broken.

Specifically: the walk rejects an all-null payload and accepts a populated one;
`factory-conformant` refuses with no county and runs on a named one, with the
scope read back from the execution log; a Band-1 writer refuses without a
collect-complete record and starts with one; 0005a refuses an `'absence'` row with
null `probed_at`; `alias-persist --apply` fails loudly against a store without
0005b and succeeds against one with it.

## Do not

Apply either migration to any store — hand back the diff, the planner runs it.
Re-run `landing-import` (immutability triggers make a second run unrecoverable).
Start a Band-1 writer. Bake or publish. Widen a check to admit a bad value where
the type can express the constraint instead. Report a control working because it
passed once.
