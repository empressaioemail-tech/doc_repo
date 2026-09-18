## Mission — P-352: say when a parcel's own record contradicts itself, and stop instantiating things that are not parcels

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` only and open one PR, branched
from current `origin/main` with the SHA declared (`0f4558a4` at compile). You do not merge, deploy,
apply or write any store; the integration seat does all four, including the retirement of the phantom
record under your tool. Any doc_repo change is handed back as a diff in your close.

The whole read is `_inbox/2026-09-18_p348_two_open_cells_read.md`. Read it first; this mission does not
restate its evidence.

### The three cells (factory store, read 2026-09-18 12:23Z to 12:38Z)

| Cell | Stored | The parcel's own record | Why |
|---|---|---|---|
| McLennan `48309:417476` `situsState` | `unaccounted` since instantiation | `situsAddress` `COUNTY LINE SOUTH , AXTELL, TN 76624`; ZIP 76624 (Texas range) | the ladder reads `TN` as decisive, returns `OUT_OF_STATE`, writes nothing |
| Hays `48209:88885` `situsState` | `value` `TX`, source `derived-county-fips` (the retired OPS-21 D1 constant) | `OFF CENTER POINT, GUAD CO`; ZIP absent-verified | the ladder reads `CO` as Colorado and cannot reassert; the upsert will not downgrade the constant |
| Williamson `48491:PRIVATE ROAD` (65 cells) | a `parcel_record` built from TxGIO road polygons whose `prop_id` is the literal label | no geometry of its own, zero acres, no served node | instantiation took every distinct `prop_id` as a parcel |

The ledger instrument reads the first as McLennan's one open `situsState` cell and the second as Hays
`false-earned: situsState-retired-d1-constant=1` (P-337's predicate). The third is the one Williamson
`buildingFootprint` refusal and inflates every Williamson denominator by one (282,570 records against
282,569 real nodes). It is the only non-conforming key among 981,405 six-county records.

### What the code does (read at `0f4558a4`)

`src/jobs/parcel-record-fill.mjs`: `resolveSitusStateEvidence` (~line 1264) returns on the first rung
that answers: address token, then ZIP, then geometry, then silent. A non-Texas token returns
`OUT_OF_STATE` before the ZIP or geometry rung is read. `deriveSitusStateOntoRecords` (~1529) treats a
retired-source cell (`isRetiredSitusStateCell`, ~1516) as unresolved and re-resolves it, but can never
clear one it cannot resolve. Parcel records are created by `UPSERT_RECORD_SQL` / `UPSERT_RECORDS_BATCH_SQL`
in the same file. `refused` is an earned cell kind (`src/lib/parcel-record-engine/cell-state.js`
`EARNED_CELL_KINDS`), so the gate grades a declared refusal as earned.

### What to build

1. **A conflict outcome in the ladder.** When the address token names another state and the parcel's
   own geometry sits inside a Texas county (rung 3's independent evidence, `loadGeometryTexasPropIds`),
   the ladder reads BOTH and returns a conflict: the cell is written `refused` with a basis citing the
   token and its field, the ZIP and whether it is in the Texas range, and the geometry and county. It
   never writes `TX` over the parcel's own contradicting record: the P-266 falsifier 2 ("a test fails
   if situsState is written for a parcel whose situs is empty or out of state") stands, and a
   genuinely out-of-state token with no Texas geometry still writes nothing.
2. **The retired constant.** The conflict outcome is the only outcome that may replace a retired D1
   `value`. Say what else could replace it and show it cannot.
3. **The phantom record.** A retirement tool for `48491:PRIVATE ROAD` and its 65 cells (and any
   companion rows) that runs dry by default, names the key it would remove, writes a durable record of
   what it removed, and refuses any key it was not given. Register it in `DESTRUCTIVE_WRITERS`
   (`src/lib/destructive-write-guard.mjs`) with its reason, the way `purge-bastrop-orphans` is
   registered. The seat runs it.
4. **The instantiation guard.** Instantiation refuses, and records by county and key, a `prop_id` that
   does not resolve to exactly one parcel geometry AND to the county's CAD roll, directly or through
   the county's declared crosswalk (for 48491, P-335's WCAD pair). Enumerate every call site that
   instantiates a record before you claim the guard covers them. Burnet is next through the farm; say
   whether its TxGIO slice carries label keys (read-only).

### Verify by violation

Pre-register your falsifiers. On the named parcels: the pre-change writer leaves `48309:417476`
`unaccounted` and `48209:88885` on the retired constant; the fixed writer writes a conflict `refused` on
both. A Texas token writes `TX` as today. An out-of-state token with no Texas geometry writes nothing. A
fixture carrying a `PRIVATE ROAD` row is refused at instantiation, and a real parcel beside it is not.
A dry run of the ladder over McLennan and Hays (read-only, heavy-scan lease, direct host) must move
exactly those two cells and no other situsState cell; say how many conflict cases exist county-wide in
all six counties (P-266 named two out-of-state refusals in total) and compare with an independent query.

### The three-question gate

Answer in your close: what executes the conflict outcome and the instantiation guard, what triggers
them, what fails when a contradicted situs is written as `TX` or a label key is instantiated, and what
bypasses them.

### Constraints

- No store writes, no deploys, no merges, no applies. `src/lib/parcel-record-engine` is pinned.
- The record-fill image rebuild (`cloudbuild.parcel-record-fill.yaml`) also rebuilds the hourly gate
  scheduler; the seat deploys P-333, P-335 and this together under the gate-scheduler procedure.
- Factory merge order (the seat serializes): P-333, then P-334/P-329/P-330, then yours and P-361, then
  P-300 and P-338's writer half, then P-336's. P-333 edits the same file's join path; stay in the
  ladder and instantiation and rebase onto P-333 before you open for review.
- Williamson 48491 republishes only under P-350; read it, never write it.

### Close

Declare: the start commit and PR, the conflict basis shape, the call sites the instantiation guard
covers, the six-county conflict count beside the independent query, the falsifiers with both directions
shown, the exact command for the seat's retirement of the phantom record (dry run first), the
three-question gate answers, and `leave_behind`.
