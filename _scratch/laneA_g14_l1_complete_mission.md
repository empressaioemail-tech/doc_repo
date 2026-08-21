Do not spawn sub-agents. Fan is one level. You are the executor. The planner adversarially reviews and merges. You do not merge. You do not apply migrations.

# Mission — Lane A3 / G-10 + G-14: Smart Files Layer 1 through completion (identity, then stop)

You are the Lane A executor for the L1 completion wave. The planner (parent) owns apply, merge, and close.

**Read first, in order:** `_inbox/2026-08-15_a3_wdll_g14_l1_complete.md` (THIS wave's card), `_inbox/2026-08-15_a_wdll_g14_frozen.md` (amended item 1; do not re-author), `_decisions/2026-08-15_smart_files_module_identity.md`, `_inbox/2026-08-15_a_close.json`, `_inbox/2026-08-15_a2_close.json`. Inherit that state. Do not re-derive G-14 or G-34.

## Sequencing this wave corrects

The prior lane declared `smartfile:<jurisdictionFips>:<docSlug>` and merged G-14/G-34 without applying. That key is city-only. Operator ruling (A-015): Smart Files is a spine module. Identity must land BEFORE any production apply. You change the key. You do not apply.

## What to build (WDLL items 1-4, 6)

1. **entityId.** One builder, one parser, declared shape `smartfile:<scopeType>:<scopeId>:<docSlug>`.
   - `scopeType` closed: `jurisdiction` | `tenant` | `site`.
   - Parser: split on `:`. Require length >= 4, prefix `smartfile`, scopeType in the closed set, last segment is `docSlug` (`^[a-z0-9][a-z0-9._-]*$`), `scopeId = segments.slice(2, -1).join(':')` (may contain colons). Empty scopeId is null.
   - When `scopeType === jurisdiction`, scopeId must be numeric FIPS (`^[0-9]{5,10}$`).
   - OLD three-segment `smartfile:48021:udc` returns null (do not alias).
   - Reconstruction traps that must return null: `parcel:48021:R12345`, a CID-looking key, the old FIPS form, wrong prefix, unknown scopeType, 2 segments, empty slug.
   - Happy paths that must round-trip: `smartfile:jurisdiction:48021:udc`, `smartfile:tenant:mox:unit-turn-sop`, `smartfile:site:parcel:48021:R12345:geotech`.

2. **Schema.** Do NOT rewrite `0078_smart_files_foundation.sql` or `0079_smart_file_absence_determinations.sql`. Add `0080_*.sql` that:
   - ADD `scope_type` text, `scope_id` text on `smart_file_documents`
   - DROP NOT NULL on `jurisdiction_fips` (keep the column)
   - CHECK `scope_type IN ('jurisdiction','tenant','site')`
   - UNIQUE `(scope_type, scope_id, doc_slug)` in addition to unique `entity_id`
   - Guard with IF NOT EXISTS / idempotent where Postgres allows
   - Empty-table safe (0078 is unapplied on deployment; still write as if rows might exist: add nullable, backfill if needed, then SET NOT NULL on the new columns)
   Update drizzle `lib/db/src/schema/smartFiles.ts`. `jurisdictionFips` optional. Populate it only when scopeType is jurisdiction (value = scopeId). Store `entityId` exactly as the builder returns it. Never reconstruct.

3. **G-34 regression.** `readDocument` still cannot return null. `SmartFileAbsence` must carry `scopeType`, `scopeId`, `docSlug`. `jurisdictionFips` must NOT be `z.string().min(1)` on every absence (that is the type/schema split already found: malformed ids currently cannot satisfy the schema). For jurisdiction reads, set it to scopeId. For tenant/site, null is allowed. Malformed entityId => `lookup-failed` with parse-null parts, never a fake FIPS. Empty lookup => `not-sought`. STALE both directions still mutation-tested.

4. **Tests.** Extend contract tests and integration probes so store-once / revise-once / STALE run on all three scope types, including a site id that contains colons. Integration tests run in CI Postgres; locally they may skip without DATABASE_URL. Say so. Do not claim a skip as a pass.

5. **Constraints.** Isolated worktree off `origin/main` (currently `34c01e04` plus whatever is tip; fetch first). Never touch `P:\legacy-design-tools` if it is on `feat/s1-instrument-hardening` with a dirty tree. Never open `P:\smartcity-os`. Zero brokerage files in the diff (mechanical grep). No `--apply` against atoms. No heavy scan. No workflow_dispatch. No merge. Doc_repo commits are planner-owned: write CP1/CP2 into the named `_inbox/` paths; leave them uncommitted.

## CP1 before you write schema

File `_inbox/2026-08-15_a3_cp1.json` with: parser design (last-segment-is-slug), why 0080 not a 0078 rewrite, column nullability, the G-34 absence field change, and what you will NOT do. Wait is not required; the planner reviews asynchronously. If you find the ruling underspecified, STOP and write the finding in CP1 rather than inventing a fourth scopeType.

## CP2 after tests

File `_inbox/2026-08-15_a3_cp2.json` with counts and counting rules, reconstruction-trap list, brokerage-untouched proof, and remaining risks. Open a PR against `origin/main`. Do not merge.

## Out of scope

Applying 0078/0079/0080. G-20, G-44, G-53. Command Center UI. Atom-contract promotion. Lanes B/C/D. G-30. Texas flush. Cleaning the dirty LDT checkout.
