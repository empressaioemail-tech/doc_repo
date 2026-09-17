## Mission — P-306: which reading explains Williamson's coverage-floor refusal

You launch no sub-agents (FAN-DEPTH 0). This is a READ-ONLY investigation lane in
`hauska-factory`. You write no store, run no publish, pass no override token, and deploy nothing.
You open a PR only if reading (a) below holds, and you never merge it.

### Where you work

`hauska-factory`, fresh clone from `origin/main` under `P:/tmp/` into a NEW directory, branch
`fix/p306-williamson-coverage-keyspace` (create the branch only if you open a PR). Declare the
start commit (factory main `c5622d0b` at compile). Register the clone under the property seat and
remove the entry at close. Stores are read with the read-only paths the fleet already uses
(`FACTORY_DATABASE_URL_RO`, `PRODUCTION_NEONDB_URL` with `default_transaction_read_only=on` and a
statement timeout). Any read heavier than a keyed lookup takes a heavy-scan lease first, keyed on
the store's HOST (resolve it from the secret; print the host only). A lease keyed on a nickname
such as `factory-store` contends with nothing (P-307), so do not take one that way.

### The finding (A-207, measured 2026-09-17)

- Staging publish `factory-bastrop-publish-99pbp` (`--target=staging --county=48491
  --gold=48491:76149`, publish image `f476f438`, factory `b65f61b` plus P-276) refused
  `COUNTY_COVERAGE_COLLAPSE` at 15:03:50Z. Nothing was written. Run `59808bfc`.
- The floor (`src/lib/publish-coverage-floor.mjs`, P-236, `MIN_COVERAGE_RETENTION` 0.95) compared
  167,064 zoned source parcels with 290,329 served zoned tier-1 rows: 57.54 percent.
- The served tier-1 rows for 48491 hold two id sets: numeric, 319,480 rows (147,145 zoned), and
  R-prefixed, 282,569 rows (143,184 zoned). The R-prefixed nodes carry a roll-membership
  retirement from 2026-09-10 (for example `48491:R352566`). The gold parcel `48491:76149` is numeric.
- Publish readiness (`src/lib/publish-readiness-gate.mjs`) reads `layerVsRoll
  KEYSPACE_MISMATCH`: 0 of 281,435 numeric nodes are found in the zoning layer, which is R-keyed.
  That file's own header calls the Williamson mismatch legitimate variation.
- The floor's header says a healthy county measures 1.0000 because "the two sides are the same
  predicate on the same column". That sentence is the premise under test.
- These numbers come from the refusal and from session 06a91261's reading. Re-read every one of
  them from the run record and the rows before you rely on it.

### The question

Two readings produce the same refusal:

- **(a) The floor compares one keyspace with two.** The served count includes the retired
  R-prefixed rows, which this bake will not rewrite, so the denominator is inflated by a
  population the source side never sees.
- **(b) The bake would strip zoning.** The bake reads zoning keyed on R-prefixed accounts, finds
  nothing for the live numeric nodes, and would write them zoning-absent. The 147,145 numeric
  nodes zoned today would lose their district.

They are not exclusive. Answer each one with counts.

### What to establish

1. The exact SQL or code path behind `sourceZoned`, `sourceParcels`, `servedZoned` and
   `servedTier1Rows`: which table, which key, whether retired rows are filtered.
2. The run record for `59808bfc`: the `coverage-floor` and readiness `run_event` payloads,
   quoted.
3. The zoning read the bake itself performs for Williamson (the publish job's `bakesFn` and the
   LDT conformant bake it runs): which table, which key, and how a numeric node reaches a
   district. Read the code, then confirm with rows.
4. How the 147,145 numeric nodes got their zoning in the last Williamson production bake, and
   whether that run passed or predated P-236 (armed 2026-09-15, A-169).
5. For five live, non-retired numeric Williamson parcels that are zoned today (name them), what
   the bake would write for zoning, established from the code path and the source rows. Do not
   run a bake to find out.
6. The retention the floor would compute on a single keyspace (retired rows excluded from the
   served side), and whether it clears 0.95.

### Falsifiers — pre-register your predictions before measuring

1. If (a) holds, the served zoned count with retired rows excluded is within five percent of the
   source count or above it.
2. If (b) holds, at least one of the five named numeric parcels has no zoning row the bake can
   reach by its own key.
3. If you open a PR: the new test fails on today's numbers without the fix, and a control fixture
   with a genuine collapse on one keyspace still refuses `COUNTY_COVERAGE_COLLAPSE`.

State which outcome would prove each prediction wrong.

### Do not

- Pass `COUNTY_COVERAGE_FLOOR_OVERRIDE`, run any publish, staging reset, bake, walk, or writer.
- Write to any store, or touch LDT or hauska-engine code.
- Weaken the floor to make Williamson pass. A fix that counts both sides on one keyspace is in
  scope; a lower threshold or an exemption for 48491 is not.
- Launch sub-agents, merge, or deploy.

### Close

Snapshot per repo and per store (with read timestamps); the answer to (a) and (b) with counts and
the code path behind each; the five parcels and what the bake would write for each; the quoted
run events; the falsifiers with their outcomes. If a PR is open: its number, head, and every CI
check's literal conclusion string. `status`: `closed` when no PR is needed and the answer is
complete; `closed-partial` when a PR awaits the integration seat's merge, image rebuild and
Williamson staging publish. `probe`: `{"notApplicable": "read-only investigation; graded by the
Williamson staging publish after any merge"}`. `subAgents`. `leave_behind`.
