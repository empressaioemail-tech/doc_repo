## Mission — P-333: a join miss is an absence only where the keys could have matched

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` only and open one PR, branched
from current `origin/main` with the SHA declared (`0f4558a4` at compile, carrying #175 P-325, #177
P-327 and #178 P-335). You do not merge, deploy, apply or write any store; the integration seat does
all four. Any doc_repo change is handed back as a diff in your close.

### The rulings

- `_decisions/2026-09-05_cad_join_miss_becomes_absent_verified.md`: a prop_id with no `cad_property`
  row for its county in ANY tax year the ingest query observes (`CAD_ROWS_SQL`, `DISTINCT ON (prop_id)`
  across every tax year) is a confirmed absence and writes `absent-verified`.
- `_decisions/2026-09-18_join_miss_unaccounted_until_scoped_guard.md` (A-214) suspended that ruling
  because it is only true where the served ids and the roll's ids are one numbering system. Its
  reversal criterion is this row, word for word: a join miss writes `absent-verified` only in a
  population the guard has measured as key-compatible with the roll (an id-overlap measurement with a
  declared threshold, per county and keyspace), and `unaccounted` everywhere else, verified by
  violation in both directions. When this ships, A-214 is superseded.

### What the code does today (read at `0f4558a4`)

`src/jobs/parcel-record-fill.mjs`: the vendored engine's `applyCadJoinMiss` stamps `absent-verified`
on 13 CAD scalars on a miss; `neutralizeCadJoinMissAbsences` (line ~1452, called inside
`instantiateAndIngest` at ~1722, after `completeJoinMissCompanionsOntoRecords` and before the D1
derivations) returns every cell carrying `isCadJoinMissBasis` to `unaccounted` in every county, and the
run reports `joinMissUnresolved` by county and rail. A matched row's genuine null keeps writing
`absent-verified` with its taxYear; that direction must not change.

The rule you reuse already exists: `src/lib/id-keyspace-overlap.mjs` (P-327) holds the four bases
(`no-served-rows`, `no-own-keyspace-index`, `no-id-overlap`, `own-keyspace-index`) and its header names
P-333 as its second consumer. Import it; do not write a second copy (DEV_PROCESS 2.4, the CTRL-1
shape). The keyspace labels come from `src/lib/publish-coverage-floor.mjs` (`keyspaceSql`), as the
retirement gate imports them.

**What the shared classifier does not give you:** `own-keyspace-index` means at least ONE served id is
held. That is enough for the retirement gate to know a set difference is measurable; it is not enough
to call a miss an absence. This row asks for a declared threshold on the overlap SHARE. Declare it once,
as a named constant with its basis, and propose its value from the measured shares (P-327's census,
`_inbox/2026-09-18_p327-retirement-gate-roll_census.json`, read staging: Bastrop 48021 numeric 77,799
of 77,799 held; Caldwell 48055 48,382 of 48,649). The seat takes the value to the operator before merge;
do not bury it in a default.

### Hays and Williamson join through crosswalks, and a bare-id overlap lies about Hays

`loadLandingAndCad` joins the two gate-blocked counties (`SEED_BLOCKED_FIPS` = 48209, 48491 in
`src/lib/cad-txgio-alias-counts.mjs`) only through published identifiers: Hays through
`loadAccountCrosswalk` (`geo_id = property_number`, corroborated by the `quick_ref_id` stem), Williamson
since P-335 (#178) through the county's WCAD pair (binds 282,219 of 282,569; 350 unreached,
`_inbox/2026-09-18_p335-williamson-crosswalk_close.json`). In both, a node with no bind gets NO row, so
its miss is an IDENTIFIER miss (P-335's F-F), never a roll that was found empty. Those misses stay
`unaccounted`, whatever any overlap reads.

**The trap, measured.** Hays' served node ids are parcel-map ids and its roll's `prop_id` are appraisal
account ids: two numbering systems that collide on bare digits (`_decisions/2026-09-13_hays_node_identity_is_the_parcel_map_id.md`:
`48209:97658` is one lot on the map and a different property on the roll). P-327's census reads Hays
numeric as 172,377 of 173,050 served ids "present" by bare equality. That figure is a collision count,
not key compatibility. So:

- the overlap is measured on the key the join actually uses, never on the served label;
- this row restores absences only in counties whose join is the bare `CAD_ROWS_SQL` match, and only
  after the measurement passes; in a crosswalk county it restores none;
- if you find a population inside a crosswalk county that you believe is a measured absence, report it
  with its evidence and do not restore it; that is a separate ruling.

### What to build

1. Per county and keyspace, the job measures the overlap before it writes (one query per county per
   run, recorded on the run record with its snapshot and the threshold), using the shared classifier.
2. A join miss in a population measured key-compatible (basis `own-keyspace-index` AND share at or
   above the threshold) writes `absent-verified` whose basis names the overlap figure, the keyspace,
   the threshold and the tax years observed. Anywhere else, including a population never measured or
   a measurement that failed, it stays `unaccounted` and the run counts it by reason.
3. The P-268 companion completion and the D1 derivations stay correctly ordered for both outcomes;
   state what `acreageSqft` does for a restored absence.
4. The upsert guard refuses only `unaccounted` over a stored non-`unaccounted` cell, so a restored
   absence lands only where the stored cell is `unaccounted`; say what the dry run shows it would move.

### Verify by violation

Pre-register your falsifiers before running. At minimum: the Williamson shape (served ids that share
no key with the roll) writes ZERO absences; a key-compatible fixture with a genuinely retired prop_id
writes exactly one; a keyspace just under the threshold writes none; an unmeasured population writes
none; a failed overlap query refuses rather than defaulting; a Williamson node the pair does not reach
writes none; a Hays-shaped fixture (served ids and roll ids that collide on bare digits but name
different parcels, joined through the crosswalk) writes none even though its bare overlap is high. Show each test failing on the pre-change code where it should. Then a read-only dry run
per county (48021, 48055, 48209, 48309, 48453, 48491) under the heavy-scan lease on the DIRECT host
(P-335: the pooler cancels county-wide joins with 57014), naming for each: the overlap per keyspace,
the misses that would restore, the misses that stay `unaccounted` and why, beside an independent count
of served ids with no `cad_property` row in any tax year taken by a separate query, not by the writer.

### The three-question gate

Answer in your close: what executes the guard, what triggers it, what fails when a key-incompatible
population reaches `absent-verified`, and what bypasses it (a raw write, another writer on the same
rails, the engine's own join-miss signal changing).

### Constraints

- No store writes, no deploys, no merges, no applies. `src/lib/parcel-record-engine` is pinned
  (`ENGINE_PIN.json`); the fix is job-side, like P-325's.
- The record-fill image also rebuilds the hourly gate scheduler (`cloudbuild.parcel-record-fill.yaml`);
  the seat deploys it under the gate-scheduler procedure, combined with P-352's change.
- Factory merge order in this wave (the seat serializes): yours first, then P-334/P-329/P-330, then
  P-352 and P-361, then P-300 and P-338's writer half, then P-336's. P-352 edits the same file (the
  situsState ladder and instantiation); keep your change inside the join path and name any shared
  function.

### Close

Declare: the start commit and PR, the threshold proposed and its measured basis, the per-county dry-run
table beside the independent counts, the falsifiers with both directions shown, the three-question gate
answers, what supersedes A-214 when this merges, and `leave_behind`.
