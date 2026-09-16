## Mission — P-256: stop writing "checked, none required" where nothing was checked

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` and open a PR. You do not
deploy and you do not run the writer against any store.

### Where you work

`hauska-factory`, fresh clone from `origin/main` under `P:/tmp/`, branch
`fix/p256-setback-honest-states`. Declare the start commit. Open factory PRs may touch the gate
files (#157 P-252, #159 P-292) or migrations (#158 P-284); you touch only
`src/jobs/parcel-setback-cells.mjs` and its tests. **This PR merges only after P-252 is live**;
build it now.

### The defect (measured by P-255, 2026-09-16)

219,472 parcels in the six counties carry `absent-verified` on all five setback rails
(`setbackFrontFt`, `setbackSideFt`, `setbackRearFt`, `setbackCornerFt`, `setbackRules`) where
nothing established it:

- `buildNoRuledTableCells` (around line 273) writes it when the city has no table: 94,260
  parcels, basis finding "no ruled setback table exists for <city>";
- `buildResolvedCells` (around line 325) writes it when the district has no row: 125,212 parcels,
  basis method `setback-table-router.resolveSetbackForParcel`, finding
  `SETBACK_ROUTER_NOT_A_DISTRICT`.

ENFORCEMENT: never convert `unaccounted` to `absent-verified` to clear a gate.

### What to build

1. **No city table:** write `unaccounted`, naming the acquisition need (the city key).
2. **A router miss:** write `unaccounted`, naming the district code.
3. **A planned-development district** (PUD, PDD, PD, PC and variants; the census uses
   `^(PUD|PDD|PD|PC|P-?U-?D)([\s-].*)?$`): write `refused` with the PUD reason from A-164,
   "setbacks for this parcel are set by its planned-development ordinance, not a district
   schedule". 61,725 of the district misses are these. Read A-164 in OPS-16 for the ruling.
4. **Zoning refused for the parcel:** propagate `refused`.
5. **A non-district raw code** (right-of-way, water, blank): `not-applicable` with its reason.
   The census found none, so keep the path, test it, and do not guess codes.
6. **The five setback rails only.** LDT's dollar rails keep a legacy value on `unaccounted`
   (P-269), so no other rail changes here.
7. A value cell is unchanged.

### Tests, both directions

- A no-table city parcel reads `unaccounted` with the city named.
- A router miss reads `unaccounted` with the code named.
- `PC R2` and `PUD-SF` read the PUD refusal; `SF-2` does not.
- A zoning-refused parcel reads `refused`.
- No path in the file can still emit `absent-verified` for a missing table or row (a test that
  fails if one does).

### Before any apply: the dry run

With the read-only credential only (`FACTORY_DATABASE_URL_RO`), if it is in your environment,
count per county what each rail would become. Otherwise mark it UNMEASURED; the integration seat
runs it. Every county's setback verdict turns `refuse` with a count after the apply, and the
Phase 0 exit reads that as open. That is the honest state; say it in the PR.

### Falsifiers, pre-register your answers first

1. Nothing in the diff writes `absent-verified` for a missing table or district.
2. A planned-development code never gets `unaccounted` (it gets the PUD refusal).
3. Value cells and other rails are byte-identical before and after on fixtures.

### Close

Snapshot; files touched; the PR with every CI check's literal conclusion; the falsifiers; the dry
run or UNMEASURED. `status`: `closed-partial` until merged after P-252 and applied on staging.
`probe`: `{"notApplicable": "build lane; graded by the census and the Phase 0 ledger leg after
the staging apply"}`. `subAgents`. `leave_behind`.
