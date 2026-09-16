## Mission — P-293 remainder: retrieval-api reads the factory's verdict vocabulary

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-engine` and open a PR. You do not
deploy; the integration seat deploys this with LDT before P-252's gate scheduler runs.

### Where you work

`hauska-engine`, fresh clone from `origin/main` under `P:/tmp/` into a NEW directory name,
branch `fix/p293r-retrieval-verdict-vocabulary`. Declare the start commit (expected `d88cf65` or
later). Register the clone in `_catalog/seat_register.json` under the property seat the way the
P-293 lane did, and remove the entry at close. You touch only `services/retrieval-api/`.

### The drift

P-293's lane (LDT PR #702, merged `9ce30b8`) found the same narrowing one hop earlier, and the
integration seat read it at engine `d88cf65`:

- `services/retrieval-api/src/parcel-record-db.ts:42`: `ParcelGateVerdictKind` is
  `"pass" | "refuse" | "excluded"`.
- `services/retrieval-api/src/parcel-record-db.ts:160`: `loadGateVerdict` returns `null` for any
  other string, silently, the same `null` a missing row and a read failure produce.
- Consumers: `parcel-record-reader.ts:105` (`pass` serves `record`, anything else `refused`, and a
  `null` gate takes the no-verdict path); `server.ts:530`, the
  `/parcel-record-gate-verdict/:countyFips/:railKey` route that LDT's `parcelGateVerdictRead.ts`
  calls. So LDT's own fix does nothing while this service drops the string first.
- hauska-factory P-201 (`9171279`, migration `0011a`) added `excluded-not-applicable`,
  `excluded-mid-cutover` and `excluded-no-acquisition-path`. P-252 (factory PR #157) makes the
  scheduler write them. Live verdicts still read the bare `excluded` today, so this lands before
  that scheduler runs.

### What to build

1. `ParcelGateVerdictKind` carries the factory's full six-string vocabulary. `loadGateVerdict`
   returns every accepted string unchanged, so the route hands LDT the real string and the reader
   serves every recognised non-`pass` verdict as `refused`, exactly as `excluded` serves today.
2. An unrecognised string is logged loudly, once per (county, rail, string) per process, with the
   county, rail, raw string and the pin, and then returns `null` (fail closed, unchanged). A test
   proves the log and the `null`. Silent `null` is the defect.
3. The accepted list is a pinned constant naming the factory SHA and both migration files
   (`migrations/0009_parcel_gate_verdict.sql`, `migrations/0011a_*`), read by you at
   hauska-factory `origin/main`. A test compares the pin with an independent hand transcription so
   that editing either alone fails. LDT's `artifacts/api-server/src/lib/parcelGateVerdictVocabulary.ts`
   at `9ce30b8` is the pattern; match its shape so the two copies read alike, and say in CP1 whether
   this repo already has a vendored-contract pattern you should use instead.
4. The in-memory fixture store (`parcel-record-db.ts` around line 209) accepts a `string` verdict
   so a test can drive the unrecognised branch.
5. List every other reader of `parcel_gate_verdict` in hauska-engine (search the whole repo, not
   only retrieval-api) with what each does with an unknown string. Report; do not change them.

### Falsifiers, pre-register your answers first

1. A row carrying `excluded-mid-cutover` comes back from `loadGateVerdict` as that string, and the
   `/record` reader serves the rail as `refused`.
2. A row carrying an invented string comes back `null` and logs once.
3. Editing the pin without the transcription, or the reverse, fails a test.
4. `pass` still serves `record` and `refuse` and `excluded` still serve `refused` (no serve change
   for any string that exists in the store today).

### Do not

- Change what `pass`, `refuse` or `excluded` serves, the slate, or the `catch` that turns a read
  failure into `null`.
- Touch any file outside `services/retrieval-api/`.
- Deploy, or launch sub-agents.

### Close

Snapshot; files touched; the PR with every CI check's literal conclusion string; the four
falsifiers with evidence; the list of verdict readers found; the number of vocabulary copies that
now exist across repos (factory, LDT, engine) named as a recorded debt. `status`: `closed-partial`
until merged and deployed ahead of P-252's scheduler run. `probe`: `{"notApplicable": "build lane,
PR not deployed; graded when the factory writes an excluded-* verdict and the retrieval route
returns it"}`. `subAgents`. `leave_behind`.
