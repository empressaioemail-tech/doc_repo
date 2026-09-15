---
id: 2026-09-13_dead_controls_ranked_fixes
title: L0 — the controls that cannot fail, ranked, with the fix each needs
date: 2026-09-13
status: draft — findings verified at source, fixes PROPOSED not ruled
kind: working-card
owner: nick
related:
  - _inbox/2026-09-13_national_program_framework_WDLL.md
  - _inbox/2026-09-13_assumption_register_ldt.md
  - _inbox/2026-09-13_assumption_register_engine.md
  - _inbox/2026-09-13_assumption_register_factory.md
---

# L0 — the controls that cannot fail

> **NOT CANON. NO PLAN ROW.** Every FINDING below was read at source by the integration seat
> on 2026-09-13 at a declared SHA and is quoted verbatim. Every FIX is a proposal and none has
> been ruled. Nothing dispatches from this page.
>
> **Snapshots:** legacy-design-tools `31d181c2`, hauska-engine `112bccb8`,
> hauska-factory `97b93877`, all read via `git show origin/main:<path>` without checkout.

## Why this is layer zero

Seven controls run, report success, and are structurally incapable of failing. Until they can
fail, no number the system reports about a county is falsifiable — including every figure
quoted across this week's analysis. ENFORCEMENT already names the class: a control that cannot
fire is worse than absent, because absent is visible.

Ranked by what arming it catches, times how cheap the fix is.

---

## 1. `evaluateRailGate` passes a county that is completely empty

**Where — AND THIS IS TWO FILES, corrected 2026-09-14:**

```
hauska-factory  src/lib/parcel-record-engine/publish-gate.js        (what publish-gate-sched calls)
hauska-engine   packages/engine-core/src/parcel-record/publish-gate.ts:171-188
```

Both carry the identical predicate. The factory `.js` has **no generated-file banner** and
reads as authored, with its own imports, its own `gate-rail-cli` and its own `index` beside it.
So either it is a compiled artifact whose provenance is undeclared, or it is a second
implementation free to drift. **Fixing one leaves the other**, and the factory copy is the one
the hourly scheduler actually calls. Settle which before editing, and if they are independent
add the divergence test DEV_PROCESS requires for paired controls. The same question applies to
`evaluatePopulation` and to the writers in entry 3.

```js
export function evaluateRailGate(cells, railKey, options = {}) {
    const live = cells.some((c) => isEarnedCell(c.state));
    if (!live) {
        return { ok: true, unaccountedCount: 0, excludedDeclaredAhead: [railKey] };
    }
```

**Why it cannot fail.** The intent, stated in the module header, is that *declared-ahead* rails
with no earned cell **program-wide** are excluded rather than counted as failures. But the
predicate is `cells.some(isEarnedCell)` over the cells **handed to this call**, which cannot
distinguish "declared ahead and nobody has sourced it anywhere" from "this county was never
filled." An empty county produces 65 clean `excluded` verdicts and a passing gate.

**The control is inverted.** Partial absence refuses; total absence passes. The more broken the
county, the cleaner its verdict.

**Proposed fix.** Give the function the program-wide declared-ahead set as an explicit input
(it is already derived elsewhere as `deriveDeclaredAheadRailKeys`) and split the two cases: a
rail in that set is `excluded`; a rail NOT in that set with zero earned cells in this county is
a **refusal**, not a pass. Verify by violation: an empty county must fail, a genuinely
declared-ahead rail must still be excluded.

---

## 2. `evaluatePopulation` returns `ok: true` for a county with nothing in it

**Where:** hauska-factory `src/lib/publish-readiness-gate.mjs:216-300`

**A correction to how this was first reported to the operator.** The function is better than
"falls through all three refusals." It carries an explicit, well-commented guard:

```js
// "Never built" is a different finding from "partially built". Do not collapse them.
if (roll.size > 0 && bake.size === 0) {
    refuse(BAKE_POPULATION_MISSING, ...);
}
```

That fires correctly when the roll exists and the bake is empty.

**Why it still cannot fail on the case that matters.** Every ratio refusal is gated on
`code === "OK"`:

```js
if (overRoll.code === "OK" && overRoll.ratio < minRatio) refuse(BAKE_POPULATION_SHORT, ...)
if (overReal.code === "OK" && overReal.ratio < minRatio) refuse(BAKE_POPULATION_SHORT, ...)
if (overFill.code === "OK" && overFill.ratio < minRatio) refuse(RECORD_FILL_SHORT, ...)
```

`overlapRatio` returns `EMPTY_DENOMINATOR` when the denominator set is empty
(`measure-instantiation.mjs:56`). That code is neither `"OK"` nor `KEYSPACE_MISMATCH`, so it
skips every refusal and reaches `return { ok: true, ... }`. And `BAKE_POPULATION_MISSING`
requires `roll.size > 0`, so it does not fire either.

**Net:** a county with **no roll and no landing** passes the publish-readiness gate. That is
precisely the state of the 217 Texas counties recorded as `TX-LANDING-ABSENT`, and of any
brand-new county before acquisition.

**Proposed fix.** `EMPTY_DENOMINATOR` is an **unmeasured** verdict, never a pass. Return a
third state the caller must handle, or refuse. Absent, zero and unmeasured are three different
states and this collapses two of them into "ok."

---

## 3. SIX engine rails cannot write at all

**Corrected 2026-09-14 from three to six** by the farm-model lane, verified at hauska-engine
`origin/main` `14c7e850`. I found three by reading the rails I happened to care about; the
lane read all seven writer scripts and found the same defect in three more.

**Where:** hauska-engine `packages/engine-core/scripts/`

```
write-owner-fact-county.mjs             no lease    writePropertyAtomsBatch(slice) @416
write-land-use-fact-county.mjs          no lease    writePropertyAtomsBatch(slice) @374
write-flood-hazard-fact-county.mjs      no lease    writePropertyAtomsBatch(slice) @164, @734
write-rail-corridor-fact-county.mjs     no lease    (found 2026-09-14)
write-rrc-pipeline-fact-county.mjs      no lease    (found 2026-09-14)
write-special-district-fact-county.mjs  no lease    (found 2026-09-14)
write-parcel-node-county.mjs            lease x15   (the one that works)
```

**Narrower than first stated, and this matters for the fix.** Flood cells exist and serve
today — the Hays lots read Zone AO from the record — so these writers ran at some point. The
defect is **re-runs under the current lease**, not that the rails have never been populated.

And `packages/storage/src/pg-storage.ts:305-307`:

```ts
if (!isHeldLease(lease)) {
  throw new LeaseRequiredError();
}
```

The lease is optional in the signature and mandatory in the body. All three call with one
argument. They parse, plan, contract-validate every atom, print a dry run that predicts the
apply, and throw on the first batch.

**Not a control, but it belongs at L0** because owner, land use and flood hazard are three
rails a customer actually asks for, and their lease-taking siblings were updated while these
three were not.

**Proposed fix.** Take and pass the lease, as `write-parcel-node-county.mjs` does. Then a test
per writer asserting a value is reachable for at least one real input — which is OPS-21 S3's
non-vacuity guard, the mechanism that exists to stop exactly this recurring.

---

## 4. `assertEdgesNotStarved` compares a computation against itself

**Where:** hauska-engine `packages/atoms/src/write-boundary.ts:151-162`, called from
`pg-storage.ts:313-314`

```ts
export function assertEdgesNotStarved(atoms, linksWritten: number): void {
  const expected = expectedAppliesToCount(atoms);
  if (expected > 0 && linksWritten !== expected) { throw new WriteBoundaryError(STARVED_EDGE, ...); }
}
```

Call site:

```ts
const links = appliesToLinksFromPropertyAtoms(instances);
assertEdgesNotStarved(instances, links.length);
```

**Why it cannot fail.** `expected` and `linksWritten` are both derived from `instances` by the
same family of function applying the same skip conditions, so they are equal by construction.
The parameter is named `linksWritten` but receives a count computed **before the transaction**,
never what `writeAtomLinks` actually persisted.

**Proposed fix.** Move the call inside the transaction, after `writeAtomLinks`, and pass the
**persisted row count** returned by that write. Then the two sides have genuinely different
derivations and the check becomes meaning-shaped rather than presence-shaped.

---

## 5. ~~`computeTier1Envelope` has no branch that returns a value~~ — WITHDRAWN 2026-09-14

**This entry was wrong and is retained struck through rather than deleted, because deleting it
would hide the error.**

**The code fact stands:** `artifacts/api-server/src/lib/nodeFacetBakeTier1.ts:103-116`, both
return branches carry `status: "declined"` at `31d181c2`, and `envelopeStatus` holds a value
on 0 of 611,116 incorporated parcels (measured directly).

**But that is a RULING, not a defect.** Corrected from the OPS-23 side 2026-09-14: OPS-21
refuses buildable area, buildable percent and envelope status **until an envelope atom
exists** (R-2). The polygon draws under P-153; the figure is withheld deliberately. A
function correctly implementing a refusal is not a control that cannot fail.

**Do not fix this.** Listing it here would have sent someone to change a decision, and the
change would have looked like progress. That is the more dangerous kind of error in this
document, because a defect that is really a ruling gets "fixed" and nobody notices until a
number appears that should not exist.

**The count in this card is therefore SEVEN, not eight.** The class is still real and still
found in the other entries.

---

## 6. `facetCoverage.baseFacts` uses the lookup key as proof the lookup succeeded

**Where:** legacy-design-tools `artifacts/api-server/src/lib/nodeFacetTier1Assemble.ts:414`

```ts
baseFacts: baseFacts.apn != null || baseFacts.situsAddress != null,
```

with `apn: str(input.apn)` at `:347`, and the conformant bake's own docblock describing
`apn` as coming "from the node id."

**Why it cannot fail.** You cannot look up a parcel without its id, so `apn` is present for
every parcel that exists. The coverage flag is therefore true whether or not a single CAD fact
joined. **Thrall is a live instance:** `48491:R007189` returns `lookup-failed` on living area
with no `cad_property` row at declared vintage, on a parcel whose `apn` is present by
construction.

**Proposed fix.** Base the flag on fields that only exist if the join succeeded — a value,
owner, land use or vintage — and explicitly exclude the join key from the predicate. Verify by
violation against a parcel with a known-failed join, Thrall being the fixture.

---

## 7. `resolveZoningJurisdiction` validates against a registry it then ignores

**Where:** legacy-design-tools `lib/cad-ingest/src/txgio/zoning-layers.ts`

```js
if (stamped && ZONING_LAYERS[stamped]) return stamped;
if (stamped) return stamped; // unknown-but-stamped key still wins over guess
```

**Why it cannot fail.** Two consecutive branches return the same expression. Whenever `stamped`
is truthy, one of them fires and both return `stamped`, so the `ZONING_LAYERS[stamped]` test in
the first branch constrains nothing.

**Proposed fix.** This is a design question, not a typo, and the comment shows the author knew:
either the registry check should gate (unknown key refuses or is marked) or it should be
deleted as dead code. Leaving a validation that does not validate is the worst of the three
options because it reads as a control. If the "unknown-but-stamped wins" rule is intended, the
returned value should at least carry a flag saying it was not registry-backed.

---

## 8. A CI step named for a check it does not perform

**Where:** hauska-factory `test/pin-divergence.test.mjs`, run as its own step named
"pin SHA must not move while pin is the control"

```js
const current = createHash("sha256").update(readFileSync(pinPath)).digest("hex");
// This test fails if the pin bytes move while the file is still the control.
assert.equal(typeof current, "string");
assert.equal(current.length, 64);
```

**Why it cannot fail.** A sha256 hex digest is always a 64-character string. The comment states
what the test does; the code asserts a tautology. The other branch compares a sha256 against a
git SHA, so `notEqual` is trivially true by length.

**Proposed fix.** Store the expected digest and compare against it, or delete the step. A green
step named for a check it does not perform is worse than no step, because it is counted as
coverage.

---

## Also at L0, different shape: three failure modes write an EARNED kind

Three factory paths write `absent-verified` — a claim that something looked and found nothing
— when no corpus table exists for a city, when a district-code matcher misses, and when parcel
geometry is absent. That turns the rail live, lets the gate pass, and serves "no requirement"
for a parcel that has one. `parcelAreaSqFt` is the clearest: land cannot have an absent area.

ENFORCEMENT names this move directly: never convert `unaccounted` to `absent-verified` to clear
a gate, because writing it where nothing looked is a lie that passes every check.

**Proposed fix.** Each of the three becomes `unaccounted` or `refused` with the reason named.
`absent-verified` is reserved for a probe that actually ran against the source of record.

---

## The one rule that would have caught all seven

Every one of these was found by **reading the write path**, and none would have been found by
measuring output, because each returns clean output by construction.

ENFORCEMENT already carries the procedure: **verify a check by violating it.** Before any of
these seven is reported as fixed, run it against a known violation and confirm it fails. For
five of the seven the fixture already exists: an empty county for 1 and 2, Thrall for 6, a
known-failed join for 4, a moved pin for 8.

## What is not proposed here

No ruling on any fix. No sequencing against OPS-21 or OPS-23, both of which are mid-flight and
touch the same files. No estimate of effort, per the operator's standing instruction. Whether
these become one row or seven is a scoping decision nobody has made.
