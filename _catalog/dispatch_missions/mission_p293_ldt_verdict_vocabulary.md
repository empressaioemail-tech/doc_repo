## Mission — P-293: LDT's verdict reader learns the factory's verdict vocabulary

You launch no sub-agents (FAN-DEPTH 0). You build in `legacy-design-tools` and open a PR. You do
not deploy.

### Where you work

`legacy-design-tools`, fresh clone from `origin/main` under `P:/tmp/`, branch
`fix/p293-verdict-vocabulary`. Declare the start commit. P-249 may be open in this repo on
`artifacts/api-server/src/lib/buildableEnvelope/`; P-206 may be open on the serve guards. You
touch neither.

### The drift

- `artifacts/api-server/src/lib/parcelGateVerdictRead.ts`: `ParcelGateVerdictKind` is
  `"pass" | "refuse" | "excluded"`, and `isVerdictKind` returns false for anything else, so the
  read returns `null` ("no usable verdict").
- `artifacts/api-server/src/lib/parcelRecordAllowlist.ts`: `resolveAllowlistState` maps a slated
  pair with no verdict to `legacy`, `pass` to `record`, and anything else to `refused`.
- hauska-factory P-201 (merged at `9171279`, migration `0011a`) added `excluded-not-applicable`,
  `excluded-mid-cutover` and `excluded-no-acquisition-path`. P-252 (PR #157) adds nothing new
  but relies on them.

Once the factory scheduler runs that code, every slated pair whose verdict is an `excluded-*`
string moves from `refused` to `legacy` in LDT without anyone deciding it. The value served is
the same today, but the contract has drifted and nothing noticed. Live verdicts still read plain
`excluded` (2026-09-16T18:28Z), so this lands first.

### What to build

1. The verdict type carries the factory's full vocabulary; every `excluded-*` string resolves to
   `refused`, exactly as `excluded` does today.
2. An unrecognised verdict string is logged loudly (with the county, rail and string) and
   resolves to `legacy`, and a test proves both the log and the resolution. Silent `null` is the
   defect.
3. The accepted vocabulary is a pinned list with the factory SHA and migration file it was read
   from (read `migrations/0009_parcel_gate_verdict.sql` and `0011a_*` at hauska-factory
   `origin/main`), and a test fails when the pin's list and the code's list differ. Follow the
   repo's existing vendored-contract pattern if one exists; name it in CP1.
4. Check every other LDT or smartsite-mcp reader of `parcel_gate_verdict` (search the repo) and
   list each with what it does with an unknown string.

### Falsifiers, pre-register your answers first

1. A slated pair with `excluded-not-applicable` resolves to `refused`.
2. A slated pair with an invented string resolves to `legacy` and logs it.
3. Editing the pinned list without the code, or the code without the list, fails a test.

### Do not

- Change what a `pass` or `refuse` verdict serves, or change the slate.
- Deploy, or launch sub-agents.

### Close

Snapshot; files touched; the PR with every CI check's literal conclusion; the three falsifiers
with evidence; the list of verdict readers found. `status`: `closed-partial` until merged and
deployed ahead of P-252's scheduler run. `probe`: `{"notApplicable": "build lane, PR not
deployed; graded when the factory writes an excluded-* verdict and LDT resolves it to refused"}`.
`subAgents`. `leave_behind`.
