## Mission — P-201: `excluded` is three states wearing one word

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

### Where you work

`hauska-factory`. No worktree exists yet for this lane. Clone fresh from `origin/main`, cut
your own branch, and declare the commit you started from before you write anything.

### The defect, as ruled (A-153, carding P-201)

The publish gate's `excluded` verdict collapses three genuinely different rail states into one
string, and the collapse is load-bearing: a rail with no writer is removed from the gate's
denominator, so it cannot fail, and a county with large swaths of unacquired data still
"passes." Measured live 2026-09-14 on Hays: all 32 `excluded` rails have zero value cells and
all 33 non-excluded rails have values, no exception either direction — the word `excluded` is
doing exactly the collapsing the row describes.

**The single collapse point, read this session against `origin/main` (`bfb7303`):**
`toGateVerdictKind()`, `src/jobs/publish-gate-sched.mjs:274-284`:

```js
export function toGateVerdictKind(engineVerdict) {
  if (engineVerdict.excludedDeclaredAhead && engineVerdict.excludedDeclaredAhead.length > 0) {
    return "excluded";
  }
  return engineVerdict.ok ? "pass" : "refuse";
}
```

`excludedDeclaredAhead` comes from hauska-engine's `evaluateRailGate` as a bare presence flag
(length > 0 or not) — it does not itself say *why* a rail was declared ahead. Everything this
row asks for has to be built from that single boolean plus whatever else you determine is
needed; nothing downstream currently distinguishes the three cases.

### The three states, as the row defines them (quote these definitions verbatim in your work; do not redefine them)

- **(a) Legitimately not applicable.** A rail that genuinely does not apply to this county.
  Protected today by engine #444's narrowing for single-county rails. This is the ONLY
  legitimate use of a silent exclusion.
- **(b) Mid-cutover.** Data for the rail exists and serves through another path; only the
  ledger cell is empty. Named rails, measured 2026-09-14 on gold parcel `48209:97658`:
  `parcelGeometry`, `roads`, `pipelines`, `railCorridor`, `etjStatus`,
  `landUseDescription`. (This is also P-204's subject — P-204 decides CUT OVER / STAYS
  ELSEWHERE / RETIRE per rail; that is NOT this row's job. This row only has to make (b)
  distinguishable from (a) and (c), not resolve it.)
- **(c) No acquisition path has ever existed.** Named rails: `easements`,
  `hoaDeedRestrictions`, `mineralRights`, `ossf`, `permits`, `salesHistory`, `terrain`,
  `treeProtection`.

These 14 named rails are ground truth for classification, given to you, not something to
re-derive. The other ~51 of the 65 rails are not classified anywhere yet — that is the actual
work.

### Predicate (quoted from the row, do not weaken it)

"The verdict enum gains distinct values, every one of the 65 rails per county carries exactly
one, and a county whose (c)-class count is non-zero CANNOT read as fully graded. Proven by
violation: a (c)-class rail must make the gate say so."

**NOT in scope: fixing any (b) or (c) rail.** This row only makes the three distinguishable. Do
not build a new acquisition path, do not cut over a mid-cutover rail. If you find yourself
writing a new writer, stop — that is a different row.

### A precedent that exists, and a warning about it

`src/ledgers/manifest-read.mjs` / `src/ledgers/indicators.mjs` already implement a similar
three-way split (`displayStateFromVerdict`: `no-atom` when `atomFamilyState !== "present"`,
`no-writer` when `!hasWriter`, else a value-state) — but it is scoped to exactly ONE rail
(`CAD_RAIL = "cad"`), not the 65-rail publish gate. `hasWriter`/`atomFamilyState` here ARE
derived from the store (`deriveHasWriter`, `deriveAtomFamilyState`, `indicators.mjs:5-11`) as
of this read — a prior fleet note recorded these as hand-declared and stale; that note is
itself now stale, so verify current behavior yourself rather than trusting either claim.
**A separate fleet note flags the County Manifest's own gating indicators as dead** (unwired
from anything that actually reads them) — confirm this mechanism is live and reachable before
building on it, or treat it as naming precedent only, not as reusable machinery. Either way, do
not silently assume it works; say what you found.

### Falsifiers, pre-register your answers before you run anything

1. **Every one of the 65 rails classifies.** Enumerate all 65 rail keys against your new
   classification and show none fall through to an unclassified default. An unclassified rail
   defaulting to (a) or (b) silently re-creates this exact defect one level down.
2. **A (c)-class rail changes the gate's answer.** Construct or find a county with at least one
   (c)-class rail and prove the gate no longer reports it as fully graded — a check that cannot
   fail on this case is not the check this row asks for.
3. **A genuinely (a)-class rail is unaffected.** Find a rail that is legitimately not
   applicable to some county (protected by engine #444) and confirm it still reads as excluded/
   not-applicable, not demoted to (b) or (c) by your new logic. This row must not regress the
   protection #444 already built.
4. **Hays, re-run.** Re-measure Hays's 32 currently-`excluded` rails under your new enum and
   report the (a)/(b)/(c) breakdown. This is the number the operator will actually look at.

### Known traps

- Do not derive (b) vs (c) from a single signal you have not checked for staleness. If you use
  `hasWriter`/`atomFamilyState` or an equivalent, confirm it is actually current (varies across
  real cells — `indicators.mjs` has an `assertIndicatorsVary` guard for exactly this failure
  mode; read what it checks and why before trusting the fields it doesn't catch).
- `excludedDeclaredAhead` is computed engine-side (hauska-engine's `evaluateRailGate`). Read
  whether it already carries enough information to distinguish (a) from (b)/(c), or whether you
  need a new signal from the engine's declared-ahead reasoning — do not assume without reading
  the engine-side function.
- This row's own scope line explicitly excludes fixing (b) or (c) rails. Resist the pull to fix
  `parcelGeometry`/`roads` while you're in here — that is P-204's row, gated behind this one.

### Do not

- Do not fix any named (b) or (c) rail's actual data or acquisition path.
- Do not deploy. Open the PR green and hand it back; this repo's own publish/deploy path is a
  separate operator decision given what a gate change does to live publish runs.
- Do not spawn sub-agents.

### Close

State your snapshot (repo, branch, commit). Name every file touched and the new verdict enum's
values. Paste the Hays re-measurement (falsifier 4) with real numbers. Paste the (c)-class
violation proof (falsifier 2). Declare `leave_behind` explicitly — this includes naming which
of the ~51 unnamed rails you classified into which bucket and on what basis, since that
classification is itself a claim a later row may need to verify.
