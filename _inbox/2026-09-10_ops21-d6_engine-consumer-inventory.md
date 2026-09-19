# OPS-21 D6 (P-141) — hauska-engine cell-state consumer inventory

Produced by a read-only Explore agent against `origin/main` of `hauska-engine`, 2026-09-10.
Zero writes made to this repo (the working tree at P:/seat-worktrees/property/hauska-engine was
stale at `a38cbb2`; all content read via `git show origin/main:<path>` after `git fetch origin`,
origin/main = `15021ef3`).

## Pin-vs-origin/main check

hauska-factory's `ENGINE_PIN.json` pins `dfdf6fd0930b72d929f9a44834f9c33fb2d3eb75` (2026-09-05).
That commit is an ancestor of origin/main; the only commit since (`d50c557`) touches
`load.ts` with an unrelated null-safety guard on a `count(*)` row. **hauska-factory's vendored
copy is functionally identical, for every cell-state-kind purpose, to origin/main today.**
Everything below applies equally to both.

## Search method (reproducible)

`git grep -l -e "absent-verified" -e "not-applicable" -e "unaccounted" -e '"refused"' -e "cell_state" -e "CellState" -e "EARNED_CELL_KINDS" -e "isEarnedCell" -e "isPublishable" -e "isUnaccounted" -e "hoaDeedRestrictions" -e '"ossf"' -e "publicRecordRefs" origin/main -- .`

## TOTAL FILES MATCHING THE SEARCH: 58

**14 are real parcel-record cell-state consumers** (the canonical package + driver scripts + schema).
**44 are confirmed false positives** (other vocabularies or prose), every one opened and read
before being excluded — none skipped on snippet alone.

## Real-consumer table

| file path | line(s) | classification | evidence |
|---|---|---|---|
| `packages/engine-core/src/parcel-record/cell-state.ts` | 61-66, 79-84, 86 | **type-definition — THE canonical source** | `ScalarCellState`/`CompanionCellState` discriminated unions; `AnyCellState = ScalarCellState \| CompanionCellState` widens automatically once the two above do |
| `packages/engine-core/src/parcel-record/cell-state.ts` | 88-89, 95-100 | positive-enumeration (correctly-scoped) | `EARNED_CELL_KINDS = ["value","absent-verified","refused"]`; the new state means "fetchable, nobody asked yet" → correctly NOT earned, no change needed |
| `packages/engine-core/src/parcel-record/cell-state.ts` | 91-93 | negative-check-fails-closed | `isUnaccounted`: `state.kind === "unaccounted"` |
| `packages/engine-core/src/parcel-record/cell-state.ts` | 103-104 | negative-check-fails-closed | `isPublishable`: `state.kind !== "unaccounted"` — a 6th kind is, correctly, publishable by default |
| `packages/engine-core/src/parcel-record/cell-state.ts` | 107-121 | **positive-enumeration-fails-open** | `countCellState`'s seed object `{value:0,"absent-verified":0,"not-applicable":0,refused:0,unaccounted:0}` never pre-seeds the 6th key to 0 — a caller assuming all keys present reads `undefined` instead of `0` |
| `packages/engine-core/src/parcel-record/schema.sql` | 22-31 | **schema-enum — THE hard blocker** | `CHECK (cell_state->>'kind' IN ('value','absent-verified','not-applicable','refused','unaccounted'))` — rejects every INSERT/UPDATE of the new state until widened; every other finding here is moot until this migrates |
| `packages/engine-core/src/parcel-record/schema.sql` | 35-36 | negative-check-fails-closed | partial index `WHERE cell_state->>'kind' = 'unaccounted'` |
| `packages/engine-core/src/parcel-record/liveness.ts` | 22-28, 36 | positive-enumeration (correctly-scoped) | `RAIL_LIVENESS_SQL`'s `IN ('value','absent-verified','refused')` — doc-comment-enforced and unit-tested to stay in lockstep with `EARNED_CELL_KINDS` |
| `packages/engine-core/src/parcel-record/publish-gate.ts` | 72, 132, 177, 193 | negative-check-fails-closed | delegates entirely to `isUnaccounted`/`isEarnedCell`, inherits their safety |
| `packages/engine-core/src/parcel-record/not-applicable-audit.ts` | 49 | negative-check-fails-closed | `if (cell.kind !== "not-applicable") continue;` |
| `packages/engine-core/src/parcel-record/ingest-existing.ts` | 151, 156, 240, 289 | negative-check-fails-closed (with a product-semantics caveat) | `if (c[key].kind !== "unaccounted") return/continue;` — safe from crash/misroute, but means a cell once `available-on-request` is **never later upgraded** to a real value by ordinary CAD/atom ingest, since the guard only fires on a currently-`unaccounted` cell. If the intended lifecycle is `unaccounted → available-on-request → value`, ingest needs a second branch. Flagged, not fixed — out of D6's stated scope (D6 does not acquire the three rails) |
| `packages/engine-core/src/parcel-record/ingest-existing.ts` | 363-365 | negative/dynamic — safe | `diffCellStateCounts`: fully dynamic `Record<string, number>`, no hardcoded kind list |
| `packages/engine-core/src/parcel-record/instantiate.ts` | 20-34, 106-123 | negative/dynamic — safe | `summarizeCountyRecords`'s `byState[kind]` is fully dynamic |
| `packages/engine-core/src/parcel-record/load.ts` | — | not a branch | matched only via type name / doc prose / SQL column name |
| `packages/engine-core/src/parcel-record/record-shape.ts` | 13-17 | type-definition (derived) | `ScalarRecordCells` mapped type, flows through automatically once `ScalarCellState` widens |
| `packages/engine-core/src/parcel-record/__tests__/{rail-gate,parcel-record}.test.ts` | various | test-or-fixture | e.g. `rail-gate.test.ts:13`'s `cell()` helper has a 5-way literal type that would want a 6th member |
| `packages/engine-core/scripts/prove-parcel-record-county.mjs` | 152-153 | negative-check-fails-closed | `nonUnaccounted`: `k === "unaccounted" ? acc : acc + v` |
| `packages/engine-core/scripts/gate-rail-cli.mjs` | — | not a branch | delegates to `evaluateRailGate`/`loadCountyRailCells`; its own `kind: "parcel-b-gate-sched-rail-verdict"` is an unrelated output-envelope discriminant |
| `packages/engine-core/scripts/verify-cell-ledger-cp2-real-county.mjs` | 55-58 | not a branch | constructs one literal `absent-verified` repair cell; delegates gating to `evaluatePublishGate` |
| `packages/engine-core/scripts/compute-parcel-record-bastrop-analytical.mjs` | — | false positive | grep hit on the prose label "not-applicable" for a rail-count column, no `.kind` comparison |

Also read and confirmed not a cell-state-kind branch, despite living inside the canonical package
and matching search terms: `access-pair.ts`, `config.ts`, `rail-keys.ts` (rail *names*, not cell
*kinds* — `hoaDeedRestrictions`/`ossf`/`publicRecordRefs` here are metadata rows), `companion-shapes.ts`
(a separate, narrower 2-value `RepresentableScalar<T>` union for embedded scalar fields like sales
price/flood BFE — not the target rails), `index.ts` (pure re-export barrel).

## FAIL-OPEN RISKS, ranked by production impact

1. **`schema.sql:22-31`** — the CHECK constraint. Highest-impact: not "fails open" in the silent-mishandling sense, it **actively rejects** every write of the new state. Blocks the ruling outright at the data layer.
2. **`cell-state.ts:107-121`** (`countCellState`) — missing zero-seed for the 6th key. Low severity, real, silent shape gap for any strict-shape consumer.
3. **`ingest-existing.ts:151,156,240,289`** — not a bug (safe/conservative), but a product-semantics gap: once a cell is on-request, bulk ingest will never later promote it to a real value under the current guard.

No file in hauska-engine has a positive-enumeration-fails-open switch/if-chain that would
misroute a 6th-state cell into a wrong branch at runtime and corrupt behavior (the classic
classifyRequiredLeaf defect shape) — that shape lives in legacy-design-tools instead (see the
sibling inventory), not here.

## ALREADY SAFE

`isUnaccounted`, `isPublishable`, the schema's partial index, `not-applicable-audit.ts`,
`ingest-existing.ts`'s crash-safety (with the caveat above), `diffCellStateCounts`,
`summarizeCountyRecords`, `publish-gate.ts` (delegates), `prove-parcel-record-county.mjs`.
`EARNED_CELL_KINDS`/`isEarnedCell`/`RAIL_LIVENESS_SQL` are positive enumerations that are
**intentionally** scoped to exclude non-earned states — the new state correctly falls outside
"earned"/"live" by the same logic that already excludes not-applicable; no change needed.

## Does the union type itself need the 6th literal?

**Yes — this is the single point of maximum leverage.** `ScalarCellState` (lines 61-66) and
`CompanionCellState` (lines 79-84) in `cell-state.ts` are the two unions that need a new member
(e.g. `ScalarAvailableOnRequestCell = {kind:"available-on-request"; requestPath: string; ...}`,
added to both, per the existing pattern for `ScalarAbsentVerifiedCell` etc. at lines 43-58).
`AnyCellState` widens automatically.

**However: no TypeScript exhaustiveness guard (`switch` with `default: assertNever(x)`) exists
anywhere in this repo that would turn on and start failing the build once the union widens.**
Every runtime branch here is either a negative/dynamic check (doesn't care how many kinds exist)
or a positive enumeration that's either already correctly scoped or has the minor
`countCellState` gap above. So widening the type is necessary and structurally required by the
ruling, but will **not** by itself surface every place that needs attention — the `schema.sql`
CHECK constraint (invisible to the TypeScript compiler entirely) and `countCellState`'s seed both
need explicit manual edits regardless of the type change.
