## Mission — P-266 and P-268: the open ledger rails in the six counties, fixed or ruled with a basis

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` and open ONE PR. You do not
run any writer with `--apply`, deploy, or write any store; the integration seat runs the writers
after merge, one county at a time, staging first where the writer supports it.

### Where you work

`hauska-factory`, fresh clone from `origin/main` under `P:/tmp/` into a NEW directory, branch
`fix/p266-p268-open-rails`. Declare the start commit (factory main `3f3e8be` at compile). Register
the clone under the property seat and remove the entry at close. Open lanes in this repo:
P-301 (`src/jobs/verify-walk.mjs`) and P-276 (`src/lib/secret-rotation.mjs`,
`src/jobs/staging-reset.mjs`); stay out of those files. Factory PR #160 (P-256) is open on
`src/jobs/parcel-setback-cells.mjs`; stay out of it too.

### What the gate reads today (measured 2026-09-17 07:29Z, `_inbox/2026-09-17_six_county_completeness_post_apply.json`)

Verdict and unaccounted count per (county, rail); Hays passes the first three rails.

| Rail | Class | Bastrop 48021 | Caldwell 48055 | Hays 48209 | McLennan 48309 | Travis 48453 | Williamson 48491 |
|---|---|---|---|---|---|---|---|
| acreageSqft | derived-trivial | refuse 62,256 | refuse 24,988 | pass | refuse 114,254 | refuse 380,917 | refuse 282,570 |
| landUseVintage | derived-trivial | refuse 62,256 | refuse 24,988 | pass | refuse 114,254 | refuse 380,917 | refuse 282,570 |
| situsState | derived-trivial | refuse 62,256 | refuse 24,988 | pass | refuse 114,254 | refuse 380,917 | refuse 282,570 |
| citationUrl | make-unbuilt | excluded-no-acquisition-path in all six |||||
| acreageMethod | must-pass | pass | refuse 2,274 | refuse 433 | refuse 114,254 | pass | pass |
| exemptionCodes | must-pass | pass | refuse 8,958 | pass | pass | pass | refuse 187,186 |
| landUseSource | must-pass | refuse 21,398 | refuse 196 | refuse 636 | refuse 23,182 | pass | refuse 25,775 |
| buildingFootprint | must-pass | pass | pass | pass | pass | pass | refuse 1 |

The full-county counts on the first three rails equal each county's `parcel_record` population,
so no cell was ever written there. P-266's row says `citationUrl` has a writer in
`src/jobs/parcel-r5-zoning.mjs` and no values anywhere.

### What to build

1. **P-266 (the four trivial rails).** Find the writer that filled `acreageSqft`,
   `landUseVintage` and `situsState` for Hays, and why it never ran or never wrote for the
   other five. Make it write all six from their own sources: never a copied constant, and never a
   `value` where the source is silent. `situsState` is only "TX" when the parcel's own situs or
   geometry says so. Find why `citationUrl`'s writer writes nothing, and fix it so a cell carries
   the citation the zoning source actually has; where no citation exists the cell says so, it is
   not left unaccounted. State the exact writer commands the integration seat will run, per
   county.
2. **P-268 (the must-pass refusals).** For `acreageMethod`, `exemptionCodes`, `landUseSource` and
   Williamson's one `buildingFootprint`: read the refused cells' reasons from the factory store
   (read-only, under a heavy-scan lease), group them, and for each group either fix the writer
   (with a test) or write the basis for an earned refusal with its count, so the operator can
   rule it. McLennan's `acreageMethod` refuses its whole county: say why.
3. **Tests in both directions** for every writer you change: a parcel with the source value gets
   the value, and a parcel without it gets the honest state, never a fabricated one.
4. **A prediction for the integration seat's apply**, per county and rail: the expected
   unaccounted count after the writer runs, so the gate scheduler's next grade can be checked
   against it.

### Falsifiers, pre-register your answers first

1. After the change, a dry run of each fixed writer for Bastrop reports writes for every
   `parcel_record` parcel on the three trivial rails (or names the ones it cannot write, with
   the reason).
2. A test fails if `situsState` is written for a parcel whose situs is empty or out of state.
3. Each must-pass refusal group is either fixed or carries a count and a basis that sum to the
   measured refusal count.

### Do not

- Run any writer with `--apply`, write any store, deploy, or merge.
- Scan the factory store without a heavy-scan lease (`scripts/heavy-scan-lease.mjs` in doc_repo);
  the hourly gate scheduler refuses while your lease is live, so hold it only while reading.
- Touch the files named above as owned by other lanes, or launch sub-agents.

### Close

Snapshot; files touched; the PR with every CI check's literal conclusion string; the four
writers' commands per county; the refusal groups with counts and bases; the predictions; the
falsifiers with evidence. `status`: `closed-partial` until the integration seat's applies are
graded by the gate. `probe`: `{"notApplicable": "build lane; graded by the gate scheduler's
verdicts after the integration seat applies the writers"}`. `subAgents`. `leave_behind`.
