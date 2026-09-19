# OPS-21 D6 (P-141) — hauska-factory cell-state consumer inventory

Produced by the lane itself (not a sub-agent), by direct read of every matching file in the
worktree `P:/seat-worktrees/property/hauska-factory-d6-available-on-request`
(commit `63a606b1db76db6c0d71fb2b9772fbf9fe8de195` = origin/main, at branch cut). Unlike the LDT
and hauska-engine inventories, this repo is the one this lane is authorized to write in, so two
of the findings below are marked FIXED rather than merely reported.

## Search method (reproducible)

`grep -rl -e "absent-verified" -e "not-applicable" -e '"unaccounted"' -e "EARNED_CELL_KINDS" -e "isEarnedCell" -e "isPublishable" -e "isUnaccounted" -e "cell_state" -e "CellState"` across the whole repo (excluding node_modules/.git).

## TOTAL FILES MATCHING THE SEARCH: 77

(This count includes the 5 new files this lane added: `available-on-request-backfill.mjs`, its
test, the new migration, the new cloudbuild config, and the writer-allowlist edit — 72 before this
lane's own changes.) Roughly 30 are test/fixture files, 14 are the vendored engine-core package
(byte-identical to hauska-engine's own copy, covered in the sibling inventory — not re-litigated
here beyond noting they were checked), ~15 are single-rail writer jobs that construct 1-2 literal
kinds for their own rail only, ~9 are confirmed false-positive vocabulary collisions, and 5 are
cloudbuild deploy-config prose.

## Real findings

| file path | line(s) | classification | evidence / disposition |
|---|---|---|---|
| `src/lib/county-rail-coverage.mjs` | `COVERAGE_CELL_KINDS` + `summarizeCountyRailCoverage` | **positive-enumeration-fails-open — FIXED THIS LANE** | Hand-authored (not vendored). `COVERAGE_CELL_KINDS` was a hardcoded 5-item array; `inLedger` summed exactly those 5 named counts. A cell in the new state would have been silently **excluded from inLedger entirely** (not merely miscounted as an absence — dropped from the ledger total), inflating `notInLedger` by exactly the on-request count. Fixed: added `available-on-request` to the array and the sum; regression test added (`test/county-rail-coverage.test.mjs`, "counts available-on-request into inLedger rather than silently dropping it"), passing. |
| `migrations/0007_parcel_record.sql` (`parcel_record_cell_state_kind` CHECK) | 25-34 | **schema-enum — the hard blocker, FIXED THIS LANE via a new migration** | Vendored verbatim from hauska-engine's own `schema.sql` (see engine inventory — this is the same constraint). Positively enumerates the 5 known kinds; Postgres rejects any write of the new state until widened. Fixed via `migrations/0012_available_on_request_cell_state.sql`, which does NOT edit 0007's "verbatim; do not edit DDL below" body — it ALTERs the constraint in a new migration, the ordinary way to evolve a CHECK. Also adds a second CHECK enforcing the ruling's own guard: no `available-on-request` cell without non-empty `requestPath`/`instrument`/`measuredAt`. **Not yet executed against a live database this session** (no local Postgres available; `docker` was not running). The SQL is standard DDL, inspected but not live-verified. |
| `src/lib/parcel-record-engine/*.js` (cell-state, publish-gate, liveness, not-applicable-audit, instantiate, load, ingest-existing, index, record-shape, gate-rail-cli) | — | vendored, identical to the hauska-engine inventory's findings — **not edited** (repo convention: "do not hand-edit, regenerate from the pin") | `isUnaccounted`/`isPublishable`/`evaluatePublishGate`/`evaluateRailGate` are negative checks, proven — by 4 new regression tests in `test/gate-county-scoped-rail.test.mjs` — to already handle the 6th state correctly with zero code change. `EARNED_CELL_KINDS` correctly excludes it (matches not-applicable's own precedent). `countCellState`'s missing zero-seed (see engine inventory finding #2) is present here too, byte-identical, since this file is the vendored copy — not independently fixed here since fixing the vendored copy without fixing the true source would be reverted on the next re-vendor. |
| `src/jobs/verify-walk.mjs` (`classifyRequiredLeaf`, `POPULATED_STATE_TOKENS`, `ABSENCE_STATE_TOKENS`) | 285-389 | **positive-enumeration-fails-closed TODAY — will become a false blocker once LDT ships a matching serve wire. Deliberately NOT fixed this lane.** | This is literally the function implementing the fix for the 2026-09-09 `classifyRequiredLeaf` defect the dispatch's own mission text names by name (25 of 25 Caldwell zoning rails graded `value` while three were absences). Traced by hand: a served leaf declaring `verdict: "available-on-request"` hits `ABSENCE_STATE_TOKENS.includes(verdict)` → false, then `POPULATED_STATE_TOKENS.includes(verdict)` → false → correctly returns `{state:"unrecognised-declared-state", ok:false}`. Safe right now. But once LDT's serve wire (structuralFactToFacetsWire.ts / r1BriefCompose.ts / mcp-app.ts, per the LDT inventory) starts actually emitting this state for hoaDeedRestrictions/ossf/publicRecordRefs, every one of those cells will get flagged here as a false failure until this walker is taught the new token AND the evidence shape (requestPath/instrument/measuredAt) LDT's wire will actually carry — a shape this lane cannot see yet. Sequencing note for the companion lane: fix this file only after LDT's wire contract for the new state is decided, not before, to avoid inventing a second, independently-updatable guess at that contract (the exact drift class `rail-keys.js`'s own `ZONING_VERDICT_FIELDS_RULED_OUT` comment warns against, in this same repo). |
| `src/jobs/available-on-request-backfill.mjs` (NEW, this lane) | whole file | the cell writer itself | County-scoped, gated (`UPDATE ... WHERE cell_state->>'kind' = 'unaccounted'`, never clobbers an earned cell or re-stamps an already-relabelled one), refuses without `--request-path`/`--instrument`. Registered on the writer allowlist, wired into `cli.mjs`, has a Cloud Run deploy config (`cloudbuild.available-on-request-backfill.yaml`). 14 tests, all passing. **Not run with `--apply` against real data** — see the CP1/close reachability finding (the only requestPath candidate probed live this session, the Smart Site MCP `check_request` tool, reported "not available on Smart Site MCP yet"). |

## Ruled out as false-positive vocabulary collisions (confirmed by reading, not touched)

- `src/ledgers/{cells,manifest-read}.mjs` — F-05 CAD-manifest acquisition-layer vocabulary (`satisfied/absent-verified/lookup-failed/quarantined/unmeasured/not-yet`); "absent-verified" name collision only, unrelated state machine.
- `src/ledgers/{rail_absence,rail_absence_serve}.mjs`, `migrations/0006_rail_absence.sql` — P3/F-05/F-06 vocabulary scoped only to setbacks/edges/envelope/utility-easement rails, never hoaDeedRestrictions/ossf/publicRecordRefs.
- `src/ledgers/city.mjs` — a single "absent-verified" `display_state` literal for a different (city-level containment) concept.
- `scripts/gate8/*.mjs` (5 files) — P-113 PE-parity vocabulary (`unmeasured/absent/present`).
- `src/jobs/owner-rail-collision-check.mjs` — `"owner-withheld"` is an absence *reason* sub-kind for the owner rail specifically, not part of the 6-state kind enum.

## Safe by construction (single-rail writers, never touch D6's 3 rails)

`src/jobs/parcel-{record-fill,school-district,utility-service,owner,r4-companions,r5-zoning,
building-footprint-reconcile,max-impervious-cover,overlay-districts,ag-valuation,value-history,
flood-ingest,s6-collision-remediate}.mjs`, `src/config/zoning-layer-completeness.mjs`,
`scripts/ctx-w2/{zoning-containment-probe,zoning-unaccounted-census,city-residue-coverage,
city-zoning-coverage}.mjs`. Each only constructs or negative-checks 1-2 literal kinds relevant to
its own rail; none branch over the full union, none touch the three D6 rails.

## Test files (~30)

Test-or-fixture, exercising the above. Notably `test/parcel-record-schema-drift.test.mjs`
contains a MECHANICAL drift guard (`scripts/check-parcel-record-schema-drift.mjs`) that SHA-256
compares `migrations/0007_parcel_record.sql` against hauska-engine's `schema.sql` at the pinned
SHA — confirmed this lane's new migration 0012 does not trip it, since 0007's body is untouched.
The same file also has a `FACTORY_DATABASE_URL`-gated live-Postgres test asserting the CHECK
constraint rejects `{"kind":"bogus"}` — silently no-ops without a DB connection (none was
available this session), not modified, still correct after the fix since "bogus" remains rejected.
