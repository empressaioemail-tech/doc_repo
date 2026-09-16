---
id: 2026-09-16_scaleup_final_teardown_review
title: FINAL TEARDOWN — the Texas scale-up scope, rev 3. Ten theses, attacked.
date: 2026-09-16
status: review — read-only, adversarial, no sub-agents, no product code, no store writes
kind: review
lane: scaleup-teardown
seat: dispatch-planner
planRows: [P-198, P-201, P-249]
subject: _inbox/2026-09-16_texas_scaleup_program_scope.md (rev 3)
audience: the overseer, who amends the scope from this review
---

# FINAL TEARDOWN — Texas scale-up scope rev 3

I did not write this scope and I have no stake in it. I tried to break it. Where I could not
break it I say so and say what the strongest attack was. Nothing below is softened, and no
status line, close, or quoted sentence from the scope is treated as evidence.

## Evidence base, and one limit the dispatch did not anticipate

| Repo | Ref read | SHA |
|---|---|---|
| doc_repo | `origin/main` (seat branch ff'd to it) | `288aa9ebd964c4815c9894a12412aa83f28b3d0e` |
| hauska-factory | `origin/main` | `91712795ea2a1eb7c27f7328cf7f52fcb7810b59` |
| hauska-map | `origin/main` | `88ac6c517b12701502d88decfdd7cd938aaaa621` |
| legacy-design-tools | `origin/main` | `0bf2377f44d66849fdcbdf1e7cfa26b784a0a567` |
| hauska-engine | `origin/main` | `422c7d3a97d334f8af6e6d00493b9090e257c6ff` |

Read at source: scope rev 3, `OPS-24_county_to_serving_program.md` rev 3, the four-rulings
decision file, OPS-16 amendments A-176→A-182 and rows P-186→P-250, the research-wave synthesis
and the five lane reports, the farm architecture report, both halves of the blocker register
(361 + 125 = 486, reconciled exactly), the class table, the delta, the smooth path, the unfixed
list, the card spec, and the three named instruments.

**THE LIMIT, stated first because it bounds every number below.** The dispatch hands this lane
read-only store access through `FACTORY_DATABASE_URL_RO` and `ATOMS_DATABASE_URL`. **Neither
variable is set in this session's environment** (`NEON_API_KEY` is, and I did not use it — it is
not a read-only credential and the mission is read-only). `psql` is on PATH; there is nothing to
point it at. So:

- Every quantity that lives only behind a query — 131,357; 219,472; 490,185; 125,212; 94,260;
  the 785 reason strings; the per-city unlock counts — is **UNMEASURED BY THIS LANE**. I name
  the query each depends on and the file that ran it. I do not re-assert them as my measurement.
- The one quantity I *did* measure mechanically is T2, and I measured it by executing the
  production module, which needs no store.

This is not a complaint about tooling. It is the finding that the teardown dispatch's own
verification clause ("a query with a timestamp") is **unsatisfiable as dispatched** — and the
2026-09-14 teardown ran into the same wall from the other side (A-150: "no Neon/Postgres tool was
available"). A dispatch that forbids accepting prose as evidence and then withholds the stores
gets prose. Recommend the next teardown dispatch either mount the read-only DSNs or state
explicitly that the instrument clause is unavailable and rank the review's confidence
accordingly.

---

## T1. Phase 0's exit cannot pass while a customer still sees something wrong.

**Claim (scope §5, and §16's closing line).** §5: "Phase 0 is done when all four hold at once" —
(1) `six-county-completeness.mjs` exits 0, every rail `pass` or excluded under a named ruling,
zero false earned cells; (2) the per-city surface probe passes on map, MCP and PDF; (3) coverage
per the serving path; (4) the operator walks it. §16's final line: "**This run is the Phase 0
baseline. Phase 0 exits when this command exits 0.**"

**Verdict: DOES NOT SURVIVE.**

**Evidence 1 — the scope contradicts itself about its own exit.** §5 requires four things; §16
requires one. §16's sentence is the one an operator will act on, because it is the last line of
the section that shows the live run, and it is the only one with a command in it. `file:
_inbox/2026-09-16_texas_scaleup_program_scope.md` lines 594–610 (§5) vs line 894 (§16), at
`288aa9eb`.

**Evidence 2 — the instrument's own negative control enshrines the blindness.** `file:
scripts/six-county-completeness.mjs` at `288aa9eb`, self-test 6:

```js
const r2 = classify(full("48209", { buildableAreaSqFt: "excluded" }), [], one);
check("6 NEGATIVE CONTROL: an R-2 rail excluded does not open anything", r2.verdict === "COMPLETE");
```

and the policy row it tests, line 46: `buildableAreaSqFt: { cls: "ruled-withheld", accept:
["excluded"], ruling: "R-2" }`. The instrument reads **the factory store only** (its own header,
lines 6–14: `parcel_gate_verdict` and `parcel_record_cell`). The defect that D1 names is a figure
served by the **map and PE payloads and their disclosure strings** (A-179's own qualification of
L-E's D1: "real at payload and disclosure-string level while the card itself withholds"). A
customer-visible buildable-area figure in a payload and an R-2 rail correctly `excluded` in the
factory store are *the same observation from two different mechanisms*, and the instrument can
only see the second. It exits 0 while the first is live. This is not a bug in the instrument; it
is the instrument's declared scope, and §5 part 1 inherits it.

**A second, larger instance of the same shape.** `salesHistory` is policy row
`{ cls: "ruled-unavailable", accept: ["excluded"] }` (line 54). L-E's D12 / scope X7: the rail is
**absent from the MCP schema** rather than declared Unavailable, against P-209's own predicate.
The instrument reads `accept: ["excluded"]` and is satisfied; the customer gets no declared
refusal at all, which is the exact thing P-209 was carded to prevent. Exit 0, customer sees
nothing where the plan says "declared, counted and visible" (§5, "What complete deliberately does
not require").

**Evidence 3 — the second leg's instrument does not exist, and the third leg's is blocked.**
§5 part 2 requires `scripts/surface-probe.mjs` "needs these legs (P-197)". A-150, on the record:
"`surface-probe.mjs` has zero OPS-24 predicates and the close gate's regex stopped at P-167".
P-197's own row: predicate includes the cost meter, "**the cost meter (not built)**"
(`90_operations/OPS-16_texas_market_plan_of_record.md`, row P-197). §5 part 3 requires coverage
per the serving path; A-178 records P-210 (the enumeration) "still blocked on the same missing
hauska-engine endpoint P-205 names". So **two of the four parts of the exit depend on instruments
that are unbuilt or blocked**, and the scope's §16 collapses the exit to the one part that runs.

**Attack on the policy table.**

- `roads` and `edgeSignal`: `{ cls: "deferred", accept: ["excluded"], ruling: "A-177 road-node
  pass deferred" }` (lines 58 and 74). The deferral is an operator ruling and I accept the
  ruling; what does not survive is **converting a deferral into an accepted exclusion without a
  measurement that the deferral is safe**. A-177's escape clause is narrow and conditional:
  "only road issues that block envelope or footprint rendering stay in Phase 0". The evidence
  that no road issue blocks rendering is L-B's two probe parcels plus A-179's note that Travis
  and Williamson hold **zero** road-node atoms. Two parcels in two counties is not a measurement
  of the class, and DEV_PROCESS 1.3 ("measure the class you are reporting") is explicit. Under
  the policy as written, all six counties pass with `roads` never measured; under A-177's escape
  clause, a single blocked render revokes the acceptance. **A control whose acceptance condition
  can be revoked by an unmeasured event is not a control.**
- `no-source` for the P-203 eight: `{ cls: "no-source", accept: ["excluded"], ruling: "P-203
  roadmap" }`. The instrument's own header says accepted "ONLY while carried on the capability
  roadmap" — **and nothing checks that.** The coupling is a comment. If P-203 is reprioritised or
  the roadmap is superseded, every county still passes. This is blocker class C9 (a control that
  cannot fail) instantiated in the Phase 0 exit instrument itself — the 82-instance class, and
  the register's own largest.
- `publicRecordRefs`: `accept: ["excluded"], ruling: "P-242 coming soon"` (line 71). P-242's row
  is *about removing coming-soon from the purchase surface*. The policy cites the row that
  condemns the state as the ruling that accepts it.
- `citationUrl`, `acreageSqft`, `landUseVintage`, `situsState`, `parcelGeometry`, `pipelines`,
  `railCorridor`, `etjStatus`, `landUseDescription` carry **no `accept` list**, so they can never
  be accepted and must pass. Correct and honest — but it means the only rails where exit 0 is
  reachable are those nine, and two of them (`citationUrl`'s writer exists yet is excluded in all
  six; the three derived-trivial rails are Hays-only) are open items with diagnoses still owed
  (L3, L2). Exit 0 is therefore **not reachable today by construction**, which §16's live run
  confirms (INCOMPLETE, exit 1).

**The fourth hole: one predicate measures a class.** `FALSE_EARNED` (lines 96–119) holds exactly
three predicates, two of them on the **same rail** (`setbackFrontFt`): `setback-no-ruled-table`
and `setback-router-miss`. Scope §5 part 1 claims "**zero cells** carry a false earned state."
The instrument measures three predicates, two rails. The 219,472 false absences are written by
`buildNoRuledTableCells` and `buildResolvedCells` in
`hauska-factory src/jobs/parcel-setback-cells.mjs` (§2b's own attribution) — paths that write
**every setback rail**, so `setbackSideFt`, `setbackRearFt`, `setbackCornerFt` and
`setbackRules` carry the identical false state and are counted by none of the three predicates.
The third predicate, `ag-valuation-no-source`, is documented as reading 0 by construction
("a GUARD: live read 2026-09-16 found these cells honestly unaccounted, so this reads 0 until the
never-run not-applicable sweep … is run"). So the exit's "zero false earned states" reduces to
**two predicates on one rail, plus one guard that reads zero by design.** §16 confirms it: "The
ag-valuation guard read 0, and that is correct."

**Second mechanism that produces the same observation.** Every defect above is observable on the
serving surface (map payload, MCP schema, PDF) and invisible in the factory store. The
independent route to the same conclusion is the *reverse* read: take L-E's graded fixture set
(39 buckets, 24 graded on the map) and ask which buckets the completeness instrument can score at
all. It scores none of them — different store, different grain, different subject.

**What the exit must add, in one sentence each.**
1. **A failing condition for the serving surface.** Exit 0 on the factory store plus a *named*
   count of customer-visible defects from the graded fixture set (D1–D16, X1–X11) that must be
   zero or ruled. Measuring a rail's ledger state and calling it the customer's answer is the
   CODE-DONE≠CUSTOMER-DONE error, and §5 is built on it.
2. **A `FALSE_EARNED` predicate per rail-family that has a false-absence writer**, not two
   predicates on one rail.
3. **Reachability, stated.** Either say exit 0 is not reachable until L2/L3 close, or move those
   rails into a named class. §5 part 1 currently reads as if it is reachable.
4. **One exit sentence, not two.** Delete §16's "Phase 0 exits when this command exits 0", or
   make §5 the only definition.
5. **A coupling check for every `accept` list that cites a ruling.** `no-source` must fail if the
   capability roadmap no longer carries the rail; `no-source` is a promise with a date.

---

## T2. P-201 closes the zero-earned gate hole.

**Claim (scope Rev 3 item 1).** "A county whose cells exist but are all `unaccounted` still
passes `evaluatePublishGate`, and that is exactly what a freshly instantiated Burnet looks like.
**P-201 is the first gate row and must land before any new county's verdict is trusted.**" The
program preamble is stronger: "**Therefore P-201 lands, proven by violation on an instantiated,
unfilled county, before any new county's verdict is trusted.**"

**Verdict: DOES NOT SURVIVE** — and it does not survive in a more interesting way than the scope
expects.

P-201 **has landed**: factory `origin/main` `9171279`, "excluded is three states wearing one
word", adding `src/lib/gate-exclusion-classifier.mjs` and wiring it into
`src/jobs/publish-gate-sched.mjs` via `toGateVerdictKind`. I read it, and then I ran it.

**The violation test, executed, not argued.** I extracted the gate modules from factory
`origin/main` and ran an instantiated, unfilled county: three parcels, every one of the 65 rails
present as a cell with `kind: "unaccounted"` — the full-shaped record that a freshly instantiated
county produces.

```
rail count = 65
evaluatePublishGate(instantiated, ALL rails unaccounted) => {
  "ok": true, "unaccountedCount": 0, "excludedDeclaredAhead_railCount": 65 }
evaluateRailGate(... "zoningDistrict" ...) => ok: true, unaccountedCount: 0
   verdictKind (rail live elsewhere, not declared ahead) = "excluded-not-applicable"
   verdictKind (rail declared ahead program-wide)          = "excluded-declared"
evaluateRailGate(NEVER instantiated, 0 cells) => ok: false, code: "RAIL_NEVER_FILLED"
```

**P-201 does not refuse that county, and its three-state split is what certifies it.** Every one
of the 65 rails resolves to an `excluded-*` value. `excluded-not-applicable` is the bucket
`gate-exclusion-classifier.mjs` documents as *legitimately* not applicable, and
`evaluateRailGate` returns `ok: true` with `unaccountedCount: 0` in the same call. So the
instantiated, unfilled county is not merely tolerated — it is **labelled**, rail by rail, as
excluded-for-good-reason, by the row that was carded to make that label impossible.

**The narrower thing P-201 does do, stated fairly.** `countyGradeSummary` /
`isCountyFullyGraded` count the `(c)`-class rails (no acquisition path anywhere) and make a
county whose `(c)` count is non-zero read as **not fully graded**. For a freshly instantiated
county the `(c)` count is non-zero (the P-203 eight plus `citationUrl` and the rest), so
`isCountyFullyGraded` returns false. That is P-201's own row predicate
(`OPS-16` row P-201: "a county whose (c)-class count is non-zero CANNOT read as fully graded.
Proven by violation: a (c)-class rail must make the gate say so") and the code satisfies it. But
it is satisfied **incidentally**: the county reads not-fully-graded because of rails that have no
writer *anywhere in Texas*, not because of the 65 rails that are empty *in this county*. Delete
P-203 from the world and the instantiated county reads fully graded again. A refusal that is a
side effect of an unrelated gap is not a refusal; it is the same class C9 shape as T1's
`no-source` policy row.

**Answer to the row's explicit question — does the split falsely refuse a county-scoped rail
such as `maxImperviousCoverPct`?** No. That direction is correct and I could not break it.
`maxImperviousCoverPct` is county-scoped to Travis (engine #444) and the classifier's
`excluded-not-applicable` bucket is exactly right for it outside Travis;
`six-county-completeness.mjs` self-test 7 proves the complementary case (excluded **inside** its
own county is open). P-201's three-state split is a real improvement for the *reporting* question
it was carded against. It is not a gate refusal and was never going to be.

**THE STRUCTURAL FINDING — the plan names the wrong function.** `evaluatePublishGate` and its
wrapper `assertPublishableCounty` have **no production caller**. At factory `9171279`:

- `src/lib/parcel-record-engine/index.js:11` exports them;
- the only other reference in `src/` is a self-test in `src/jobs/parcel-record-fill.mjs`;
- the actual publish job, `src/jobs/bastrop-publish.mjs`, imports
  `requirePreBakeReadiness` from `src/lib/publish-readiness-gate.mjs`, which composes
  `requireCountyPopulation` (→ `evaluatePopulation`) and `evaluatePreBakeReadiness`.

So there are **three** things called "the gate", and the plan's law names the one that is not on
the path:

| Gate | Function | On the publish path? | Behaviour on an instantiated, unfilled county |
|---|---|---|---|
| (1) rail verdicts | `evaluateRailGate` → `parcel_gate_verdict` | yes, hourly (`publish-gate-sched.mjs`) | `ok: true`, rails `excluded-*` — **no refusal** |
| (2) whole county | `evaluatePublishGate` / `assertPublishableCounty` | **no caller in `src/`** | `ok: true`, 65/65 excluded — **no refusal** |
| (3) pre-bake readiness | `requirePreBakeReadiness` | **yes, this is the publish refusal** | **refuses** — but for a *population* reason |

And (3) refuses for the reason that matters least to this thesis: `evaluatePopulation` refuses
when `roll size > 0 && bake size === 0` (`BAKE_POPULATION_MISSING`), when the roll is empty
(`BAKE_POPULATION_UNMEASURED`), when the bake/real ratio is under the floor
(`BAKE_POPULATION_SHORT`), and when `landing` is empty (`RECORD_FILL_UNMEASURED`). Its **rail**
half, `evaluatePreBakeReadiness`, carries this comment in its own source: "`pass` and `excluded`
both clear — unaccounted is legitimate at rest and fatal only at publish", and its only rail test
is `if (row.verdict === "refuse")`. **Every P-201 value clears, including the value P-201
introduces**, because the check is an equality against the one literal it knows.

That is the finding worth keeping: an instantiated, unfilled county cannot publish **today**, but
not because of the mechanism the plan credits; and the mechanism that actually stops it would
happily publish a county whose every rail is `excluded-not-applicable`, provided a bake
population exists. The zero-earned hole is real at layers (1) and (2) and *unreachable from* (3)'s
rail half. **P-201's three-state split makes the count readable and leaves the refusal hole
exactly where the preamble says it is.**

**Second mechanism.** Independent of running the code: read who calls what.
`git grep -n "assertPublishableCounty\|evaluatePopulation(" origin/main -- src` returns the
export line and the definition — no call site. A gate with no caller cannot refuse anything, and
this is determinable by grep alone.

**What P-201 must add before the preamble's sentence becomes true.** A `refuse` verdict for a
rail that is live program-wide and has **zero earned cells in this county** — i.e. distinguish
"excluded-not-applicable (no path exists anywhere)" from "excluded-but-this-county-earned-
nothing", and make the second a refusal at layer (1) and (3). Today both render
`excluded-not-applicable`. And the preamble's "proven by violation on an instantiated, unfilled
county" needs a fixture that asserts a **refusal**, not a `fullyGraded` boolean.

---

## T3. P-249 is the shortest path to an "ok" envelope, and it is safe.

**Claim (OPS-16 row P-249; scope Rev 3 item 2; scope §4.2 item 1).** "P-249 … **the shortest path
to an 'ok' envelope**"; "It unlocks **131,357** parcels"; "It wires the structural
`depthWarmPromoted` signal into LDT's reconciliation rather than leaning on reason-text
heuristics"; "the map's `envelope-unverified` decline changes to match"; "**Proof:** … `48209:
97658` draws …; the staging before-and-after uses the L-B instrument (`scripts/envelope-draw-gap.
mjs`), and the unlock count is reconciled to the 131,357 baseline." Risk named: "P-216 took the
map down with a one-branch change here."

**Verdict: HOLDS WITH NAMED CONDITIONS.** The mechanism claim survives; the sizing claim, the
wiring instruction, the map clause and the named risk all fail. This is the thesis I expected to
break outright and could not; it breaks in four places around a sound centre.

### What survives, and the strongest attack I made on it

The centre is sound and I verified it three ways. `reconcileWithAtomEnvelope` in
`legacy-design-tools artifacts/api-server/src/lib/buildableEnvelope/reconcileAtomEnvelope.ts`
(`0bf2377f`) clobbers a good live envelope with an atom's empty outcome unless the reason is a
machine-verify diagnostic — line 148 computes `isDiagnostic`, and the keep-the-derived branch
runs only when the derived geometry is non-empty. The distinction P-249 rests on (a shape-only
zero that must not win versus a verified zero that must) is **already in the code as an
explicit predicate**, not a heuristic to be invented. My strongest attack was to look for a
fourth state that the predicate would misclassify, and the honest answer is that the state class
exists and is *named*: `validation-failed`. A ring that fails the engine's own geometry gates
(Bastrop's curved-frontage offset bug is P-235's; the sibling Kyle parcel `48209:145880` was seen
failing a boolean clip) produces neither a draw nor a verified zero. P-249 as written does not
say which branch `validation-failed` takes, and its proof set names a `validation-failed` ring
that "must decline honestly" (§4.2) — so the failure mode is at least anticipated. **Condition:
`validation-failed` must be proven to reach a named decline, not a silent empty.**

### Does not survive 1 — the 131,357 is not a count of what P-249 unlocks

The figure's query, named exactly (`scripts/envelope-draw-gap.mjs`, `288aa9eb`, header lines
6–22): factory `parcel_record_cell` with **`rail_key = 'setbackFrontFt'` and
`cell_state->>'kind' = 'value'`**, joined by `place_key` to atoms `entity_type =
'buildable-envelope'` keyed on `body->>'parcelNodeId'`, bucketed `GAP` when the atom is
`no-buildable-area` for a non-diagnostic, non-depth-warm-verified reason. **The "setbacks on
record" leg is one rail.** The row's own predicate needs "a district **and** a table":

> "an unverified or reason-mismatched zero atom (no district, unzoned, not onboarded, or a zero
> not from verified depth-warm) no longer empties a live envelope **that has a district and a
> table**" (OPS-16, P-249)

The instrument reads `setbackFrontFt` and `situsCity` and **nothing about district or table
availability**. So the population the figure counts and the population the predicate unlocks are
different populations, and the instrument that produced the figure has no leg that measures the
predicate. The plan then asks for the impossible comparison: "the unlock count is **reconciled to
the 131,357 baseline**". A correct P-249 will unlock *fewer* than 131,357 — the figure is an
upper bound — so either the close reports a "shortfall" against a number it should not be
measured against, or it is pushed to unlock parcels its own predicate excludes. **Condition: the
baseline must be restated as an upper bound, and the close must report a *second* number — the
parcels that have a district and a table — which is currently measured nowhere.**

Corroboration that the gap is material: the five largest named groups — Georgetown 23,484, Round
Rock 17,761, Leander 17,045, Kyle 9,847, San Marcos 9,335 — sum to **77,472 (59%)**, and every
one is a city that already has a staged zoning layer and a table. The remaining 53,885 is where
the row's own predicate is least likely to hold: §2c's own text says "Waco and Austin have large
setback populations but small gaps in that bucket, because **no envelope atom exists** for most
of their parcels. **P-249 does not reach them; a re-derive (R5) does.**" So the reachable share
is concentrated in five cities and the tail is dominated by parcels P-249 cannot move.

**Second mechanism.** Same conclusion from the other side of the join: §2b's per-city table is
keyed on `zoningJurisdictionKey` / `zoningDistrict` / `setbackFrontFt` — it *has* the district
columns the GAP instrument lacks. A per-district census (S0,
`scripts/setback-parcel-census.mjs`, unbuilt) run against the same fixture would produce the
predicate-qualified count, and would disagree with 131,357. That disagreement is the measurement
P-249's proof needs and does not have.

### Does not survive 2 — the `depthWarmPromoted` wiring instruction names a field no surface reads

This is the cleanest defect in the thesis, and it is a naming defect with a mechanical proof.

| Where | Field | Type | Value / test | Line |
|---|---|---|---|---|
| hauska-map, wire read | `depthWarmPromotion` | string | `=== "depth-warm-promoted-v1"` | `atom-chain-to-facets.ts:116`, `:190` (in `isDepthWarmPromoted`) |
| L-B instrument, SQL | `body->>'depthWarmPromotion'` | string | `= 'depth-warm-promoted-v1'` | `envelope-draw-gap.mjs:190` |
| L-B instrument, in-memory | `depthWarmPromoted` | boolean | `=== true` | `envelope-draw-gap.mjs:122`, `:226` |
| LDT, reason text | — | string | `isMachineVerifyDiagnostic(reason)` | `reconcileAtomEnvelope.ts:51`, `:148` |

The scope's build instruction — and OPS-16's row, and the dispatch — all say "carry the
structural **`depthWarmPromoted`** signal (hauska-map already uses it)". Hauska-map does **not**
use `depthWarmPromoted`. It uses `depthWarmPromotion` as a **string marker**
(`depth-warm-promoted-v1`), with a `sourceCitation` substring fallback. `depthWarmPromoted`
(boolean, "d") exists **only inside the doc_repo script's in-memory classifier**. Implementing
the sentence literally yields a field the map's `isDepthWarmPromoted` never reads, so LDT's
reconciliation and the map's decline compute different answers about the same atom — the
"served answer disagreeing with itself" pattern the 2026-09-15 handoff counted seven instances of
and P-217 exists to refuse. There are **four** independent predicates over the same fact, in
three repos and two languages, with **no divergence test between any pair** (the blocker
register's C2, 19 instances at `288aa9eb`, and C7, 46 instances). **Condition: the row must name
the field as `depthWarmPromotion: "depth-warm-promoted-v1"` (with the `sourceCitation` fallback
and its precedence stated), and carry a divergence test across the map predicate, the
reconciliation predicate and `isMachineVerifyDiagnostic`** — the register's own G9-1, which does
not exist.

### Does not survive 3 — "the map's `envelope-unverified` decline changes to match" is
undetermined, and the one artifact that decides it is not in the plan

`hauska-map apps/property-explorer/api/_lib/atom-chain-to-facets.ts` around line 2080: the
decline branch is the third of three, `else if (!envelope && outcomeKind === "no-buildable-area")`,
and it sets `status: "declined"`, `declineReason: "envelope-unverified"`, `envelopeCovered =
false`, and **no `geojson`** — the polygon is not drawn, not merely the figure. The first branch
carries `envelopeCovered = true`.

So whether the map must change depends entirely on **what `envelope` is bound to** — the
live-derived geometry or the atom's. If it is the live-derived geometry, P-249's LDT change alone
turns the map green and the hauska-map clause is dead weight. If it is the atom's, the map clause
is the *real* fix and it must add geometry, which is exactly the fix the 2026-09-15 handoff
demanded ("The `declined` branch must keep the envelope **DRAWN** and withhold only the **area
figure** … **Do not redeploy P-216 until that lands**"). The plan asserts the clause is needed and
never names the binding that decides it. **Condition: the row must name the `envelope` binding as
the first thing the lane reads, and the staging proof must cover both branches.**

### Does not survive 4 — the named risk is a claim that was refuted, and the plan still teaches it

Scope §4.2 risk line: "**P-216 took the map down with a one-branch change here**". §13 item 1:
"The P-216 outage was a one-branch change with map-wide effect."

The same repo's own correction file, `_inbox/2026-09-15_HANDOFF_planner_snapshot.md` at
`288aa9eb`, lines 42–51, refutes both, in a block headed "SUPERSEDED 2026-09-15 AFTERNOON — READ
THIS BEFORE THE BLOCK BELOW (A-157)":

> **"P-216 suppressed the envelope MAP-WIDE" is NOT SUPPORTED.**
> **4. The map-wide envelope outage was a stale TAB, not a server regression.** … Confirmed
> resolved by the operator on reload. **A rollback restores the server; it does not reload an open
> tab.**

And the failure is *in the register*: the addendum carries a candidate class named "**stale
client state after a server rollback masquerading as a server regression**". The register has the
correct diagnosis; the scope teaches the incorrect one, twice, as the reason P-249 needs staging
proof. The consequence is not cosmetic: the plan's stated risk is "a one-branch change takes the
map down", which argues for a *narrow* staging check on one branch. The actual failure mode
anyone can demonstrate here is "**a merge is not a deploy, and a rollback is not a reload**" —
which argues for an entirely different check (below).

**Second mechanism.** The same conclusion is reachable from A-157's item 3: "Measured on the
unaliased P-216 build: Bastrop SF-1/GC/MU unchanged, only the four San Marcos parcels moved to
`declined`." Four parcels, one city — and P-216's own pre-registered falsifier ("If you suppress
the envelope and the panel then shows nothing where a customer expects a finding, you have traded
a wrong answer for a silent one") is the sentence that *did* remain true of those four, since the
decline branch draws nothing. The correction and the code disagree; the code is the tiebreaker
and the code supports the falsifier, not the correction.

### What the 123,706 unexplained zeros become when the live derive fails its own geometry gates

Scope §2c's own answer, and it is the correct one, but the plan does not carry it into the proof:
they become **named declines, not draws**. §2c: "The 123,706 unexplained zeros were never put
through that check. When they are, the same failures will appear at scale. **Road-node quality is
therefore the gate on drawing envelopes across the six.**" P-249 removes the *atom's* veto; it
does not supply a front edge. So for that population the change converts **a wrong answer
(a definitive empty envelope) into a named refusal (`validation-failed`, or whichever branch
P-249 assigns)** — which is a genuine and valuable improvement and contributes **approximately
zero to the unlock count**. The scope elsewhere says exactly this, for Waco and Austin. It does
not say it for the 123,706, and P-249's headline ("the shortest path to an ok envelope, it
unlocks 131,357") implies otherwise.

**Denominator warning, stated because the plan juxtaposes two of them.** The 490,185 / 208,868 /
153,775 / 123,706 figures are **atom counts** (§2c: "What the 490,185 'no buildable area' atoms
really are"). The 131,357 is a **parcel count** (L-B). The plan places them in one paragraph
without a join. How many *parcels* have a reason-less zero as their blocking atom is measured
nowhere — not in the scope, not in the register, not in the L-B instrument. §13 item 4 already
names this failure mode ("The census-unit error could repeat. Any sizing figure must say whether
it counts parcels, features or accounts") and then commits it one section earlier.

### "Figure only when verified" against every surface that prints a figure

The ruling (A-180 item 3, scope Rev 3 item 3): "a buildable-area figure appears only when a
VERIFIED envelope atom backs it; an unverified July breadth-bake atom does not count." Surfaces
that print or carry a figure, and their state at `9171279` / `88ac6c51` / `0bf2377f` /
`422c7d3a`:

| Surface | Where | Backing test | State |
|---|---|---|---|
| PE map payload | `atom-chain-to-facets.ts`, `envelope-unverified` branch | gated on `depthWarm` (branch 2) — **present** | OK for the branch; D1's disclosure-string leak is in branch 1's `buildToLineDisclosure` and in `approximate/provisional` figures |
| MCP `place/buildable-envelope` | LDT `reconcileAtomEnvelope.ts` | `isDiagnostic` + `derived.empty` — **not** a verification test | **fails the ruling as written**: it keeps a live (unverified) geometry, and the Pflugerville response quotes "Buildable area from the property atom chain … **5027 sq ft**" (§2c) |
| PDF / site plan | `hauska-engine packages/engine-core/src/site-plan/pdf/render.ts` (`s.printedBuildable.kind === "atom"`) and `site-model.ts` (`buildableAreaSqFt` from `offsetRing` or `null`) | figure is printed when the **atom** supplies it | **not verified-gated**: an unverified atom's area prints |
| Panel card | withholds (A-179) | — | OK |

So the ruling holds on the card, holds *by accident* on the two branches of the map it happens to
touch, and **does not hold on the MCP payload or the PDF**, where the figure's provenance is "an
atom exists" rather than "an atom is verified". P-249 folds D1 in, and P-249's own build list says
"the area figure appears only when a verified atom backs it" — but the check is `kind === "atom"`
in the renderer, and no surface reads a verification predicate. **This is a ruling filed and never
implemented, down to a type that cannot express it** — the register's class C5, 17 instances, of
which the smooth path's only proposed control (`ruling-implementation-check.mjs`, P2-2) is
unbuilt.

**Second mechanism.** The PDF leg is independently decidable without the stores: `render.ts`
takes a boolean from the atom's presence, so a fixture atom with `outcome.kind = "buildable",
areaSqFt = 19052` and **no** promotion marker must, under the ruling, print no figure. It would
print one. That is a unit test that fails today.

### The staging proof that would have caught the P-216 outage

This question cannot be answered as posed, because **the outage was misattributed twice** (T3.4):
first to P-216's branch, then to a stale tab. A proof designed against the first attribution
measures the wrong thing. Given what the evidence actually shows, the proof has to be built to
distinguish **four** mechanisms that produce "the map shows nothing":

1. **The code (server).** A served answer from the deployed revision.
2. **The deploy (which server).** `Age:` is a **false instrument** — A-157: "The CDN cache object
   is keyed to the deployment and shared with the alias, so the rollback target returns the same
   `Age` and `Etag`. Use asset existence instead: request each build's unique `/assets/index-*.js`
   against the alias. The live build returns `application/javascript`; every other build falls
   through to the SPA handler as `text/html` with HTTP 200."
3. **The client (stale tab).** A rollback does not reload a tab.
4. **The store (data).** Cells written, gate green, surface stale (P-230, fired twice).

The proof I would specify, in the order it must be specified:

- **A build-identity read before and after, by asset existence, from a cold session.** Never
  `Age:`; never the alias's HTML. Record the `/assets/index-*.js` URL that returned
  `application/javascript` on each side. Without this, "before" and "after" are unanchored and the
  proof cannot tell (1) from (2).
- **A fresh browser context per measurement, with no reuse of an open tab.** Without this the
  proof cannot tell (1) from (3) — and this is the missing leg that produced the entire 2026-09-15
  incident.
- **A three-branch fixture per city, one per branch of the decision the change touches**:
  (a) an unverified reason-mismatched zero on a parcel with a district and a table — must **draw**;
  (b) a verified/depth-warm zero — must **stay empty with a named reason**;
  (c) a `validation-failed` ring — must **decline with that named reason, and must not draw**.
  Record, per branch, `status`, `declineReason`, `envelopeCovered`, and whether a `geojson` was
  present. The scope's proof set names (a) `48209:97658`, (b) a staging-minted verified zero, (c)
  a `validation-failed` ring — which is the right shape. What it lacks is the *assertions per
  branch*: "must draw" and "must decline" are not checkable without the four fields.
- **A negative control that the instrument can see the failure it exists to catch.** §4.2 requires
  the L-B instrument for before/after. That instrument reads **two stores and not the serving
  surface** (its header, lines 8–22). It cannot observe a blank map, a withheld figure, or a stale
  tab — it would have been **green on every side of the P-216 incident**, because the cells were
  never the problem. **The proof as specified measures the store and the incident was on the
  surface.** This is the exact error the handoff names in its own words: "**verify THE MAP — not
  the API.** The API and the panel are different read paths; the API looked healthy the whole time
  the map was blank."
- **A served-payload assertion for the figure**, on the same fixtures: the `buildableAreaSqFt` /
  area string must be **absent** on branches (a) and (c) and **present only** on a
  verified-atom branch. This is the leg that catches D1 and the PDF, and neither the L-B
  instrument nor `six-county-completeness.mjs` has it.
- **A rollback rehearsal.** Deploy, roll back, and re-measure the alias from a cold session,
  asserting the *build identity* moved both times. Two thirds of this incident was deploy
  mechanics; a proof that cannot rehearse a rollback cannot catch the next one.

**Condition on T3's overall verdict:** P-249 is the shortest path **for the roughly five cities
that hold 59% of the gap and already have layers and tables**; it is not a path — short or
otherwise — to Waco, Austin, or the 123,706 reason-less zeros, which need R5; and R5 is blocked by
a deferral the plan itself ordered (see T7).

---

## T4. The setback reconciliation (S0 to S8) can reach "everywhere that should have setbacks has them".

**Claim (scope §4.1).** S0–S8, with S3's worklist "two halves": "**The 54 no-table cities** in
section 2b, 94,260 parcels. Each is classified first as zoned with a layer, zoned without one, or
unzoned" and "**The district misses** in the wired cities, 125,212 parcels". Done-when for S3:
"S0 shows false absence zero, and every remaining `unaccounted` district carries either an open
acquisition task or a signed declared-unacquirable decision."

**Verdict: HOLDS WITH NAMED CONDITIONS** — the goal is reachable; the plan's account of *what it
costs* does not survive, and S1's flip is not safe on every surface.

### The classification sample, from public sources (7 of 54)

I classified seven cities spanning five counties, largest first, from public sources.

| City | County | Parcels | Class | Public basis |
|---|---|---|---|---|
| Lago Vista | Travis | 12,745 | **zoned, layer plausible** — the ordinance says the official map *is* the city GIS | Code of Ordinances §3.30 "Official Zoning Map": "shall be maintained in the city geographical information system (GIS)"; official map published as a PDF from the city GIS (`cms7files.revize.com/lagovistatx/GIS/LagoVista_ZoningMap.pdf`) with districts C-1A…R-4, PDD, TR-1 |
| Hewitt | McLennan | 5,868 | **zoned, layer present** | Municode Appendix A Zoning §1.204 "the city shall maintain an official zoning map"; GIS zoning map available via ArcGIS |
| Woodway | McLennan | 4,523 | **zoned, no queryable layer found** — map published as PDF | search synthesis names a Woodway zoning map PDF (April 2023); *second-hand from the search synthesis, not directly read — confidence lower* |
| Bellmead | McLennan | 4,352 | **zoned, layer present** | city GIS page: `bellmead.maps.arcgis.com` viewer with "property … zoning, land use" layers |
| Jarrell | Williamson | 2,817 | **zoned, layer present** | Zoning Map **Adopted 03.05.2024**; Ordinance 2024-0206-01, UDC Chapter 4.00 (districts and lot standards) |
| Wimberley | Hays | 2,273 | **zoned, table in ordinance** | Municode Ch. 9 Art. 9.03 Zoning; "Zoning District Regulations" PDF stating setbacks, max height, max impervious cover |
| Hallsburg | McLennan | 335 | **probably unzoned / category 3** | search synthesis only, **low confidence** — flagged as needing an ordinance check, not an assertion |

**Six of seven are zoned; five have a layer present or explicitly maintained in GIS; one publishes
only a static PDF.** Extrapolated — not asserted, n=7 — the dominant case in the 54 is **not** the
scope's cheapest category ("Genuinely unzoned: declare it through the per-city declaration (S7),
so its cells become an earned `not-applicable`"). It is the most expensive one: acquire the layer
**and** extract a per-district dimensional table verbatim, with an effective date, under the
2026-09-11 most-current-wins law.

**The scheme is missing a fourth category.** "Zoned, without a layer" (category 2) silently covers
two materially different work items: (2a) an undocumented-but-existing ArcGIS REST endpoint that
must be *found*, and (2b) a city that publishes its zoning map **only as a raster/vector PDF**
(Woodway), where "acquire the layer" means either locating an endpoint nobody documents or
**digitising the map** — a different kind of work, a different error profile, and a different cost,
produced from an image rather than from an authority. Encode (2b) explicitly; §13 item 4's own
warning about confused units is the same warning one level up.

**Where the second half's population sits matters more than its size.** Per §2b's per-reason table,
the two halves are Travis 60,115 district misses against 17 no-table parcels; McLennan 10,166
against **33,139**. The counties are near-mirror images: Travis's work is almost entirely district
tables in cities whose layer we already hold, McLennan's almost entirely no-table cities — the
expensive half. So the plan's "two halves" are not two comparable workstreams, and the *ordering*
matters: S3 says "largest parcel count first", which starts with Travis's cheap half and defers
McLennan's expensive half to the end — behind the exit gate that Burnet waits on.

**What the full classification takes, in work (not time).** Per city, four separable steps, and
only the last is the "acquisition" S3 names:

1. **Locate the governing instrument** — Municode, eCode360, CitySpan, American Legal, or the
   city's own document centre, plus its **effective date** (the 2026-09-11 ruling reads dates at
   source; Wimberley and Lago Vista both publish uncodified ordinances alongside codified ones, so
   the effective-date read is per-row, not per-city).
2. **Determine what the official map is** — a GIS layer, a PDF, or a GIS-maintained map published
   as a PDF (Lago Vista's §3.30 is exactly this case and it is why "does a layer exist" is not the
   same question as "is the map digital").
3. **Find or fail the endpoint** — an ArcGIS REST search per city, with the negative result
   recorded as a negation with a basis, never as "unknown".
4. **Extract each district's dimensional table verbatim** — front/side/rear/corner, height,
   coverage, footprint, with the citation and effective date, per district, with the PUD/PC/PDD
   class routed to a refusal rather than a Euclidean fallback (S2, X10/D14).

Step 4 is per-**district**, not per-city: §2b's district-miss half is 125,212 parcels across
about ten named cities and (per P-233's census) 172 uncodified district codes. So the true work
unit is **(city × district)** and the plan's two numbers (54 cities, 125,212 parcels) are both
lower bounds on the work, because neither counts districts.

### Is S1's flip from `absent-verified` to `unaccounted` safe on each surface?

**Claim.** §4.1 S1: no table → `unaccounted` with an acquisition need named; router miss →
`unaccounted` naming the district; zoning refused → propagates `refused`. §13 item 1: "Surfaces
must also be checked for how they render `unaccounted` before the flip, and it goes to staging
first."

**Verdict: NOT SAFE AS SPECIFIED — the surfaces already render `unaccounted` in at least three
different ways, one of which converts the flip into a value.**

| Surface | File:line | What is rendered | Safe? |
|---|---|---|---|
| PE map/panel | `hauska-map apps/property-explorer/api/_lib/pe-record-cell-interpret.ts:168-174`; code `unaccounted`; mapping `pe-record-to-facets.ts:188` → `parcel-record-unaccounted` | an explicit refusal, distinct from a fabricated absence; test at `pe-record-cell-interpret.test.ts:86` asserts it | **safe** |
| LDT agValuation | `artifacts/api-server/src/lib/agValuationFactFromParcelRecord.ts:104` → `parcel-record-unaccounted`; test `agValuationFactFromParcelRecord.test.ts:160` is explicitly "THE LOAD-BEARING CASE: unaccounted … refuses, never a fabricated absence or present" | refusal | **safe** |
| LDT cityLimits | `cityLimitsFactFromParcelRecord.test.ts:89` — "unaccounted maps to unmeasured, never a fabricated incorporated/unincorporated determination" | unmeasured | **safe** |
| LDT flood | `pe-r1-brief-flood.test.ts:414` — "unaccounted **falls through to the atoms path** — nothing has looked yet in parcel_record is not a reason to drop the existing determination" | the atom's determination, not a refusal | **conditionally safe** — the flip changes which mechanism answers; the served value is unchanged, so the flip is *invisible* here, which is the opposite of what S1 is for |
| **LDT dollar rails** | `cadRollFactFromParcelRecord.ts:57-60` — "`refused` cells (unaccounted, engine-refused, store-not-configured, etc.) fall back to `null` — **the caller keeps the legacy value in that case**"; test `cadRollFactFromParcelRecord.test.ts:111` — "a refused cell (unaccounted) returns null — **caller keeps the legacy value**" | **the legacy tier-1 value** | **UNSAFE** |
| **LDT value basis** | `cadRollFactFromParcelRecord.ts:118` — "Anything other than a present, coercible non-negative dollar (**absent, refused, not-applicable, unaccounted, malformed**) defaults to **stratmap-redistributed**" | a *basis label* asserted for a value nothing verified | **UNSAFE** |

**The two unsafe rows are the finding.** On the four dollar rails and on `valueBasis`, `unaccounted`
is not a refusal at all — it is a **pass-through to the legacy value**, and on the basis rail it is
a **fabricated label**. So S1, applied to a value rail, converts an honest absence
(`absent-verified`, wrong but at least a claim our side made) into something strictly worse for the
customer: the legacy value, served under a basis label the store never asserted. That is the
absent/zero/unmeasured violation again, created by the fix, at the one place the fix's own
done-when says "That is the honest state."

S1's stated scope is the setback rails, where the fall-through does not apply. **Condition: S1 must
ship with an explicit rail allowlist** — the rails where `unaccounted` renders as a refusal on
every surface — and the dollar and basis rails must be excluded until their serve path stops
keeping the legacy value. §13 item 1's instruction ("Surfaces must also be checked … before the
flip") is the right instruction; what is missing is that **the check has already been run and the
answer is on file in two unit-test names**, and the plan records neither.

**Second mechanism.** Independent of reading the fall-through: the same two rails are the ones
P-180 restored in LDT only (A-179: "the six missing in the engine are the dollar and structural
rails P-180 restored in LDT only (L-A)"), and §4.3's H1(a) says the two slates are unresynced —
19 entries against 13. A rail served from two divergent slates will render `unaccounted`
differently depending on which slate answers.

### And the sequencing fact nobody states

S1's own done-when: "**The gate then REFUSES setbacks with a count, in every county.**"
`six-county-completeness.mjs`'s `classify` marks a `refuse` verdict **open** (self-test 9: "a
refusal is open even on a must-pass rail with a count"), and `setbackFrontFt` is `must-pass`. So
**S1 makes §5's exit unreachable in all six counties by design** — correctly, but the scope never
says that the exit is therefore gated on the *entire* S3 acquisition (both halves, all 54 cities,
every district table) and that Burnet waits behind it (§12: "Then Phase 0 build rows are
allocated"; §7: Burnet runs after Phase 0). §13 item 6 acknowledges only that farm *machinery*
builds in parallel — the Burnet *run* waits. **The critical path to Burnet is 54 cities' ordinances
and 172 uncodified district codes, not P-201 and not P-249.** That belongs in §12 in those words.

---

## T5. Burnet on the shared stores is safe and measurable.

**Claim (program law 3; A-180 item 1; scope Rev 3 item 4).** "Burnet runs on the shared stores with
full stage telemetry (A-180)." "Bell and Milam's storage is decided from Burnet's measured stage
records." Law 5: "Every stage meters itself. Compute dollars and operator minutes per county per
stage go on the stage's run record, so commitment 3 (under 200 dollars and one hour per county) can
fire as a kill, not a slogan."

**Verdict: SPLIT — "safe" HOLDS WITH NAMED CONDITIONS; "measurable" DOES NOT SURVIVE.**

### Safe: HOLDS WITH NAMED CONDITIONS

Supporting facts I could verify: the frozen `PUBLISH_TARGETS` / `WRITER_TARGETS` pair does **not**
block a second county on shared stores (A-179: `publish_runs` and `leases` partition by county);
`publish_runs` has `county_fips` and a `(county_fips, target, created_at DESC)` index
(`hauska-factory migrations/0003_publish_staging.sql`); the write-slot law is per
`(store, entity_type, county_fips)` (`AGENT_CONTRACT.md` §3); the self-grant rule is adopted and
bounded by "it must DISCLOSE the self-grant in its close" and "the planner keeps the grant whenever
the service is CONTENDED".

The conditions, which the plan does not state:

1. **ONE heavy-scan scope per database, and Burnet's heavy phases are the contended ones.**
   `AGENT_CONTRACT.md` §4: "At most ONE heavy PostGIS/full-table scan at a time across all lanes on
   a shared database. Announce before starting (target, expected duration) in your progress
   artifact; confirm after. A second heavy scan waits." Burnet's stages 3–8 include full-county
   PostGIS plan phases. The 2026-08-28 read-timeout incident is the precedent for what happens when
   this is not honoured, and the register's C17 (unleased/uncoordinated shared-resource contention,
   **11 instances** at `288aa9eb`) is the class. Scope §13 item 3 names this correctly for R5
   ("Heavy atoms writes against a store of about 192 GB have taken down lanes before") and does
   **not** name it for the Burnet run itself, which is the first county through a pipeline nobody
   has run end to end.
2. **The heavy-scan announcement has no owner and no instrument.** §4 requires an announcement
   "in your progress artifact" and a "confirm after"; there is no registry, no lease, and no check.
   The register's own control for this (smooth path X-2, extending `_catalog/leases/` to "Cloud Run
   job-runner executions and shared-store write windows") **does not exist**, and its stated bypass
   is "a job invoked from outside a doc_repo-rooted session" — which is every scheduled job.
3. **The traffic-lease layer does not cover this.** It is per Cloud Run *service*, and its own
   history (`AGENT_CONTRACT.md` §3) records the firing condition: "a lane run outside such a session
   is the named bypass".

### Measurable: DOES NOT SURVIVE

**There is no cost telemetry anywhere in the factory.** I grepped the entire `src` at
`9171279` for `cost_usd`, `costUsd`, `dollars`, `estimated_cost`, `cpu_ms`, `gb_seconds`,
`compute_cost`. Every hit is a **property** dollar value (`marketValue`, `landValue`,
`cad_property` dollars, `CADROLL_RENULLED`) — not one is a compute cost. And the schema:

```sql
CREATE TABLE publish_runs (
  id uuid PRIMARY KEY, county_fips text NOT NULL,
  target text NOT NULL CHECK (target IN ('staging','production')),
  staging_sibling_id uuid, status text NOT NULL, walk_id uuid,
  body jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz
);
```

`created_at`/`completed_at` give a wall-clock duration for **one** stage (publish). There is no cost
column, no operator-minutes column, no per-stage table. Corroborated from the other direction:
A-179 records that "`parcel-envelope-cells` and `parcel-setback-cells` write **no row or cost
telemetry**", and the register's addendum carries a candidate class named "**a completed write
leaves no durable execution record once its lease is released**".

So the answer to "list the telemetry that must exist before Burnet starts, for 'Bell and Milam beat
Burnet' to be a query" is: **all of it.** Specifically, and this is the minimum set:

1. **A durable per-(county, stage, run) record** with: stage id, started/ended, outcome, and the
   instrument's verdict — for all thirteen stages, written by the runner, surviving lease release.
2. **Compute cost per record**: the Cloud Run job's billed CPU/memory seconds and the billed
   request cost, as a number, at the grain of the run. Without it law 5's kill test cannot fire and
   commitment 3 stays a slogan. (The `runs`/`publish_runs` tables cannot carry it today — this is a
   migration, not a convention.)
3. **Operator minutes per record**: a declared, recorded input (the wall-clock of an interruption,
   an approval, or a ruling), since no machine can measure it. Law 4's three stop points are the
   natural unit.
4. **Per-county per-stage grain, not per-county.** "Bell and Milam beat Burnet" is a claim about
   *stages*; a county total cannot distinguish "Burnet's rail-fill is slow" from "Burnet's acquire
   is slow", which is the only comparison that tells the farm what to fix.
5. **The three depth writers' telemetry** (Rev 3 item 4's own precondition for the *isolated-store*
   decision — which means the same instrumentation is needed to *make* the shared-store decision
   legitimate).

Until then, the honest statement of the storage decision is: Burnet runs on the shared stores
because the operator ruled it and because the shared stores tolerate concurrency (**verified**);
and the follow-on decision — whether Bell and Milam need isolated stores — **cannot be made from
Burnet's records, because the records do not exist.** That is a named condition, not a defect in
the ruling.

**Second mechanism.** The same conclusion from the plan's own text: Rev 3 item 4 says the isolated-
store preconditions are "a generalised target pair, branch lifecycle, **and row and cost telemetry
on the envelope and setback writers**". A plan cannot both defer the cost-telemetry work as a
precondition for the *alternative* and rely on measured stage records to choose between the two.

### C17, the contention class, against the storage decision

C17 "Unleased/uncoordinated shared-resource contention" is **11 instances** (7 + 4) at `288aa9eb`.
Its control is smooth path X-2, which **does not exist**, and its named bypass is the whole
scheduled-job population. The register's own instance for it is explicit: "a scheduled job wrote
the exact gate-verdict table a walk was grading, **inside the walk's own measurement window**". That
is a Burnet-shaped failure: Burnet's stage 6/9 writes into `parcel_record_cell` while the hourly
`publish-gate-sched` re-evaluates the same county's rails, and while any acceptance walk reads
them. **Condition: X-2 (leases covering job executions and heavy-scan windows) or an equivalent
must land before Burnet's first heavy phase — not because it is nice to have, but because the
register already has the instance and the class is open.**

---

## T6. The blocker register can serve as the pre-bake audit's checklist.

**Claim (scope Rev 3 item 7).** "**The blocker history is a register, not a memory.** 361 instances
in 18 classes. **It becomes the pre-bake audit's checklist**". A-182 takes it to 486.

**Verdict: DOES NOT SURVIVE.**

First, the register itself is sound and I could not break its arithmetic. The two halves reconcile
**exactly**: register `instance_count` 361 = 330 in C-classes + 31 in candidate classes =
`instances.length` 361; addendum `new_instance_count` 125 = `sum(per_class_count_new)` 125 =
`instances.length` 125; union total **486** across 19 C-labels and 55 candidate keys. That is a
better-than-usual audit trail and it is worth saying so.

Then the four things that stop it being a checklist:

**1. Two classes have no check anywhere — not a weak check, no check.** The register ships its own
proposed mapping (`_inbox/2026-09-16_scaleup-lc_smooth_path.md`, one check per class at the
earliest stage). It covers C1, C2, C3, C4, C5, C6, C8, C9, C10, C11, C12, C13, C15, C16, C17, C18
and stage 11 — **sixteen of eighteen.** Never mentioned, in any stage:

- **C7 — "A value served with a label asserted by a constant, consumed by a check that cannot fail
  on it" — 46 instances** (40 + 6). Third-largest class. Its only appearance in the whole document
  is as a size comparison in a different class's paragraph ("the largest class by unfixed count
  after C9/C7"). No stage, no check, no trigger.
- **C14 — "Stranded or unreviewed artifacts" — 16 instances** (15 + 1). Not mentioned at all.

Under the mission's own bar ("A class caught only by 'the planner reads it' counts as not caught"),
**C7 and C14 (62 instances, 12.8% of the register) are not caught.**

**2. Of the sixteen "covered" classes, exactly one has a check that exists, and it cannot run on
Burnet.** Every other named check is prose describing something to build: "a new script,
`scripts/registry-divergence.mjs`" (R0-1); "a new script, `scripts/ruling-implementation-check.
mjs`" (P2-2); "a CI check on the audit-instrument repo path (**wherever** … live)" (P2-1); "a
shared validator function called from every … writer (**today … each do this differently or not at
all**)" (A3-1); "a generalization of the completeness check (P-194)" (A3-2); "a shared spatial-join
helper (**today, at least … independently reimplement**)" (I4-1); "a required `queriedSource` field
… checked by a linter/CI rule" (RF6-1); "OPS-21's own proposed S3 non-vacuity guard, **already
named, not yet built**" (RF6-2); "a divergence-test harness" (G9-1); "a serve-layer assertion in the
retrieval-api's one ruled reader" (P10-1); "`probe-close-gate.mjs`'s pattern, generalized" (P10-2);
"the same collision-check logic …, parameterized over id prefix" (X-1); "a generalization of the
existing traffic-lease-gate hook" (X-2). The single check that executes today is **C8-1 / C13**,
`six-county-completeness.mjs` — whose own row says it must be "generalized to take any county (**not
hardcoded to six**)" and whose header hardcodes `SIX` (lines 30–37) at `288aa9eb`. So the one
working check is the one that cannot be pointed at Burnet.

**Coverage, with its denominator, per DEV_PROCESS:** 19 class labels; **2 with no check named at
all (62 instances); 16 with a check named but unbuilt; 1 executable today, and it is county-locked
and covers C13 only.** Classes with **zero executable checks today: 18 of 19.**

**3. The class vocabulary is open-ended, so there is no checklist to complete.** The register
declares 18 classes; the addendum adds **55 candidate keys** carrying 58 instances, including one
**compound label** (`"C1/C8"`) and one instance counted twice with a note ("NEW (same root incident
as the primitives-with-zero-call-sites finding above, distinct symptom)"). A checklist needs a
closed set. As it stands, the register grows by candidate class faster than any stage can own one —
and **none of the 55 candidates has a farm stage or a check.** The smooth path was written against
the 361-instance half and does not mention the addendum at all.

**4. The one check that does exist is the class it is supposed to catch.** C8-1's own bypass clause
is "a rail added to the bake's manifest but never added to the census's required-leaf list — the
same class-4 shape one level up; closed by deriving the census's required list FROM the bake's own
manifest constant at the pinned SHA". `six-county-completeness.mjs` does not do this: `RAIL_POLICY`
is a **hand-typed 65-key literal** (lines 44–89). The instrument *is* the C4/C18 instance its own
check exists to prevent — and the register's P2-3, which was supposed to be the fix for the same
family, is the **empty-county gate fix that T2 shows does not exist**.

**Second mechanism.** The gap is visible without the smooth path: take the register's per-class
counts and ask, per class, "which file fails when this class recurs?" For C7 there is no file. For
C14 there is no file. For the 55 candidates there is no file. That question needs no instrument and
produces the same answer — which is the point of asking it as a second mechanism.

**What T6 requires to become true, specifically.** (a) An owner class to be **closed** before the
pre-bake audit runs — freeze the 18, or fold the 55 candidates into them, and say which. (b) A check
for C7 and C14, or an explicit "not caught by any stage; caught by audit only" line, because a class
silently absent from a checklist is worse than one flagged as manual. (c) Each check stated with the
four things ENFORCEMENT's own gate asks — what executes it, what triggers it, what fails, what
bypasses it — and **at least one of them existing**. (d) The census's required-leaf list derived
from the manifest constant at a pinned SHA, per C8-1's own bypass clause.

---

## T7. The Phase 0 order has no hidden dependency or contention.

**Claim (scope §4, §12).** §12: "**Then Phase 0 build rows** are allocated and dispatched **by repo
availability**. P-201 (factory) and P-249 (LDT and hauska-map) lead." §4's per-family tables carry
their own `Depends` columns.

**Verdict: DOES NOT SURVIVE.** There are two hard contradictions inside §4.2, one dependency chain
that cannot start, and a duplicated done-condition across three rows on one surface.

**Contradiction 1 — R5 depends on R1, and R1 is deferred by the same table's ordered list.**
§4.2's table at `288aa9eb`, row R5: `Depends` = "**R1 to R4, S6**". The ordered list immediately
above it, item 5: "**R1, R2 and R8 are DEFERRED** to the road-node pass after Phase 2, unless a
road issue still blocks rendering after P-249." And A-177 defers the whole road-node pass — TIGER
cross-check, street-name dictionary, classification rules, `roads` and `edgeSignal` — to "**after
Phase 2 of the Texas scale-up**". R5 is item **3** of the same ordered list, i.e. **Phase 0**. So
§4.2 puts a Phase 0 row behind a row it defers to after Phase 2. **The re-derive that reaches Waco,
Austin and the 123,706 zeros cannot start in Phase 0 as written.**

**Contradiction 2 — R8 is simultaneously a Phase 0 row with a Phase 0 acceptance test and a
deferred row.** R8: done-when "**All three pass in all six counties**", instrument
`six-county-completeness`, repo hauska-factory, `Depends` = R3. R3's `Depends` = R1. And R8 is in
the deferred list. Meanwhile §2a and T1's policy table both accept `roads`/`edgeSignal` as
`deferred`/excluded, so the exit can pass while R8's own done-condition says all three pass. One row
cannot have two acceptance standards.

**The chain that cannot start.** S1 `Depends` = **P-201**; S3 `Depends` = S0; S6 `Depends` = "S3 in
part"; R5 `Depends` = "R1 to R4, **S6**"; R7 `Depends` = **S6**; S2 `Depends` = S1; S7 depends on
nothing but its done-when needs "every wired city in the six". So the setback chain is
**S0 → (S1 ⊃ P-201) → S3 → S6 → {R5, R7}**, and the envelope chain is **R0 → R1 → {R2, R3} → R8**
with **R5 also behind S6**. Two chains converge on S6, which is one file pair in **two repos**
("hauska-engine, corpus package"). Under "dispatched by repo availability", both chains will want
hauska-engine at the same time, and one of them (R5) is blocked by its own deferral anyway.

**Contention: three rows, one surface, three identical done-conditions.**

| Row | Done when | Repo |
|---|---|---|
| D3 | "Remove Bastrop-specific decline wording ('layer-23') from non-Bastrop parcels." | hauska-map |
| X4 | "Parcel-specific decline wording everywhere (**no Bastrop 'layer-23' text on a Kyle lot**)" | hauska-map, LDT |
| R9 | "… keep an honest, specific decline elsewhere, in words that name the actual reason. **No Bastrop 'layer-23' wording outside Bastrop.**" | hauska-map, LDT |

Three rows, one string surface, two repos, the same sentence three times, and **no ordering and no
lease between them**. This is precisely the shape the traffic-lease rule exists to prevent (two
lanes, one resource, minutes apart), and there is no equivalent mechanism for a repo file surface —
only for Cloud Run traffic. **The plan needs one of these three to own the surface and the other two
to be closed as duplicates, or an explicit order.**

**And the deferral making R5 unreachable is not the only thing the deferral blocks.** A-177's escape
clause ("only road issues that block envelope or footprint rendering stay in Phase 0") makes the
deferral *conditional* on an unmeasured event, and §4.2's own evidence for the condition is L-B's
two parcels. See T1's policy-table attack — same finding, different door.

**The dependency-ordered sequence the plan actually implies** (no dates, no durations; edges only):

```
P-201 (gate: three states distinguishable)
  └─ S1 (false absences -> unaccounted/refused)   [makes the exit unreachable by design]
       └─ S3 (acquire tables; needs S0's census first)
            └─ S6 (one registry, engine <-> corpus)
                 ├─ R7 (registry rows for every wired city)
                 └─ R5 (verification re-derive)   [BLOCKED: depends on R1, deferred]
S0 (parcel-grain census)  ──> S3, and nothing else
S2 ──> S1
S7 (per-city declarations)  (independent, but S3's category-3 answer depends on it)
R0 ──> R1 ──> R2
           └─> R3 ──> R8  [R8 deferred; R3 is R5's other parent]
P-249 (LDT + map)  (independent of the setback chain; shares hauska-map with D3/X4/X9)
P-248 ──> P-238 in hauska-engine
H2 ──> H1(b)   (H1's second gap: "the envelope four once H2 lands")
  └─ H3, H4, H5, H7 (independent)
L1..L7 (factory, independent of the setback chain except L6 = P-201)
D1 (P-230) ──> R9 ──> "surfaces draw what R5 produced"   [R9 behind R5 behind the deferral]
C1 (P-213) ──> R4 ──> R5
Phase 0 exit (§5 part 1)  <── every open rail above, including all of S3's worklist
  └─ Burnet (P-198)
```

**The single most important edge in that graph:** `Phase 0 exit → Burnet`, with the exit hinging on
S1's refusals, which hinge on S3 clearing both halves of 219,472 parcels. **Burnet is behind the
setback acquisition campaign.** §12 says "the farm machinery builds in parallel, and only the
Burnet run waits" (§13 item 6) — so the plan knows the run waits, but §12's "Then Phase 0 build rows
are allocated and dispatched by repo availability" reads as a scheduling rule, and "by repo
availability" is the wrong key: the binding constraint is the S3 worklist and the S6 convergence,
not repo occupancy.

**Second mechanism.** Independent of the tables: read each row's `Depends` column and topologically
sort. Two cycles-by-deferral (R5↔R1, R8↔R1) and one three-way convergence (S6) fall out without any
knowledge of what the rows do. I ran that read by hand against §4.1–§4.6; the graph above is the
result.

---

## T8. Phase 0 fixes every customer-experience defect found.

**Claim (scope §4.5, §4.5b; Rev 3 item 6).** §4.5b: "**Customer experience items the research
already found**", X1–X11, each with a repo; §4.5's own D1–D4 table; and "Fifteen buckets and the
PDF leg remain ungraded; they are graded before Phase 0 exits."

**Verdict: DOES NOT SURVIVE.**

**First, the id space collides, and the thesis inherits the collision.** The scope uses **`D` for
two different lists**: §4.5's own serving-truth table (`D1` = P-230, `D2` = P-217, `D3` = layer-23
wording, `D4` = P-246) and L-E's defect list (`D1` = the buildable-area figure, `D2` = Waco's panel
declines, … `D16`). §4.5b then cites L-E's numbers parenthetically — "X5 | **Waco's panel declines
an envelope its own live endpoint can draw** (**D2**, the 2026-08-28 Ruling B defect …)" — where
that `D2` is **not** §4.5's `D2`, which is P-217. So "map D1 to D16" is ambiguous by construction:
`D1` is both P-230 and the folded-into-P-249 figure leak, and `D2` is both P-217 and the Waco
decline. This is blocker class **C15** (duplicate ids, 3 instances) instantiated in the scope's own
cross-references, and it is the class the mission's T8 has to work around rather than attack. The
scope should give L-E's list a distinct prefix (e.g. `XD-1..XD-16`) before anyone maps it.

**The mapping, using L-E's numbering (the mission's D1–D16), as far as the scope states it.**

| L-E defect | Scope row / item | Owning plan row |
|---|---|---|
| D1 buildable-area figure in map/PE payloads + disclosure strings | §4.2 item 1 ("This also closes L-E's D1"), Rev 3 item 3 | **P-249** (folded) |
| D2 Waco's panel declines what its own endpoint draws | §4.5b **X5** | **none** |
| D3 site plan asserts a miss that did not happen; identity lost | §4.2? no — `OPS-16` **P-222** | **P-222** |
| D4 Bastrop layer-23 wording on non-Bastrop parcels | §4.5 **D3**, §4.5b **X4**, §4.2 **R9** | **three rows, no order** |
| D5 no-table cities decline while the payload holds the district | §4.5b **X8** | **none** |
| D6 Williamson: no MCP baked snapshot (5/5) | §4.5b **X6** | **none** (A-179: "new", uncarded) |
| D7 Williamson: no composed map address (3/3) | §4.5b **X6** | **none** (A-179: "new", uncarded) |
| D8 card does not name the governing city | §4.5b **X2** | **none** |
| D9 malformed situs (", ,") breaks envelope drawing | §4.5b **X9** | **none** |
| D10 within-payload land-use contradiction | §4.5 **D2** | **P-217** |
| D11 setback citation without an effective date (Pflugerville) | §4.5b **X11** | **none** |
| D12 `salesHistory` absent from the MCP schema (against P-209) | §4.5b **X7** | **none** (P-209 is the *ruling*; the schema fix is unowned) |
| D13 dollar value reaches an ungranted caller | §4.5 **D4** | **P-246** |
| D14 "PUD"-coded districts resolve Euclidean setbacks | §4.5b **X10** | **none** ("ruling first, then LDT") — partially covered by **S2**'s PUD message, which is the *message*, not the resolution |
| D15 | positive control — not a defect | — |
| D16 | `leave_behind` | — |

**Defects no row owns: D2, D5, D6, D7, D8, D9, D11, D12, and D14's resolution — nine of fifteen.**
D4 additionally has three claimants and no owner (T7).

**The X-items: seven of eleven have no row.** X1 = **P-248**; X3 = **P-250**; **X2, X4, X5, X6,
X8, X9, X10, X11 are items with a repo and no plan row.** §4.5b is not a row table — these cannot be
carded, dispatched, closed, or gated by `probe-close-gate.mjs`, which is the mechanism the program
relies on for traceability. An item with a repo and no number is a note.

**And the acceptance standard is incomplete by the scope's own count.** "**Fifteen buckets and the
PDF leg remain ungraded; they are graded before Phase 0 exits**" (§4.5b). §5's four-part exit
**does not contain bucket grading or the PDF leg as a leg.** Part 2 requires "at least four fixtures
per wired city … on the map, the MCP and the PDF" — that is a per-city probe, not the 39-bucket
fixture list, and 15 buckets remain ungraded at the time of writing. So the exit's stated standard
and the acceptance standard the scope names for these items are different standards, and the looser
one is the one §5 encodes.

**Second mechanism.** Reachable without L-E: count the rows. `OPS-16` has no rows between P-249 and
P-250 other than what §12 lists, and §4.5b's eleven items name `hauska-map`, `LDT`, `hauska-engine`
— **repos, never row ids.** A grep for `P-2` inside §4.5b returns two hits (X1's P-248, X3's
P-250). The conclusion is in the text.

### T9. Security and operational debts do not block Burnet.

**Claim (A-182).** "Operator decision owed, and **the final teardown tests whether it blocks
Burnet**." Scope §4.6 C5/C6/C7/C8 and §4.6's "Controls the six need before they can be a control
group".

| # | Debt | Must it clear before Burnet? | Evidence |
|---|---|---|---|
| 1 | **ADD-084** — `PRODUCTION_NEONDB_URL` exposed 2026-09-04, **still unrotated, secret at version 1 (2026-08-28)**; nine secrets across two projects bind the production read-write endpoint on one role | **YES — it is the one item on this list that is a hard blocker, and it is the operator's call, not a lane's** | A-182. The mechanism is what makes it blocking: the exposure is of a **read-write** credential for the store Burnet's stage 10 publishes to, and rotation is a coordinated nine-secret + redeploy-every-consumer change. **Burnet's first production publish is a write to a production serving store — operator stop point #2 (law 4).** Rotating after Burnet starts means rotating *during* the program's first real write. Also note the addendum counts this class once ("production credential surfaced in an agent's own debug/tool output during an unrelated task") — the *incident* is registered; the *rotation* is not a row anywhere. **Recommend a row.** |
| 2 | **Staging secret rotation gap** (A-181; scope C5) | **NO for Burnet; YES before the next `staging-reset`** | The secret was repointed to the live staging branch on 2026-09-16 (A-181 item 2, version 6 = `STAGING_HAUSKA_MCP_URL` byte for byte, read back by equality). **But C5's outstanding work — "add it to `secret-rotation.mjs`" — is under-specified and I can show why.** `hauska-factory src/lib/secret-rotation.mjs` at `9171279`: `ROTATION_TARGETS` is `Object.freeze({neondb, hauska_mcp})` **frozen with exactly two keys**, and `rotateStagingSecrets` iterates those keys reading `branchRecords[key]` and `projectIds[key]` and writing via `rotateSecret`, whose project comes from `env.GOOGLE_CLOUD_PROJECT \|\| "hauska-prod-497015"`. Adding LDT's `STAGING_ATOMS_DATABASE_URL` therefore needs **three** coordinated changes, not one: a third frozen target, a third `branchRecords` entry (which is produced by `staging-reset`, a different file), and a third `projectIds` entry. So the row's instruction as written would be implemented as "add a key" and silently do nothing. **Name all three, or it strands again.** |
| 3 | **The six quarantined branches** | **NO** | Two records: `_inbox/2026-09-16_neon_branch_quarantine_record.json` (5 items, all `applied: true`, renamed `quarantine-20260916-*`) and `_2.json` (1 item, `br-billowing-queen-ap6npmua` → `quarantine-20260916-f06-staging-hauska_mcp-planner-20260828T142734Z`, endpoint `state: idle, disabled: false → true, suspend: 0 → 300`). Both records carry a `reverse` recipe. Production and staging untouched. **But the scope is stale by one:** Rev 3 item 5 says "**Five** orphaned cortex-prod staging branches are quarantined" and names only record 1; A-181 item 3 added the sixth. Six, not five, and three artifacts not two. |
| 4 | **Workstation TLS setting** (A-181 item 4) | **NO — but it must not be used as a precedent for a read** | `auth/disable_ssl_validation = True` **alongside** `custom_ca_certs_file`. With a CA bundle present, disabling validation is unnecessary, which means the machine's Secret Manager reads print "Unverified HTTPS request" and are, by the machine's own configuration, unverifiable. This lane read nothing over that path, so it did not matter; **any Burnet run that reads a secret from this workstation inherits it.** Operator decides unset-or-keep; not a Burnet blocker, but it should be re-checked before any credential is read for the Burnet run. |
| 5 | **The FAN-DEPTH gate's named bypasses** (A-181 item 1) | **NO — and this is the item I want on the record, because it applies to *this lane*** | The named bypasses, quoted: "a false `spawned: 0` declaration; **Cursor and any harness that does not load `.claude/hooks`** (the commit layer still catches their closes when committed in Claude Code); dispatches compiled before today, which carry no marker and are reported as not gated; **commits made outside Claude Code**". I verified the registration mechanism: `.claude/settings.json` registers `fan-depth-gate.mjs commit` under a **`PreToolUse`/`Bash` matcher**, and there is **no `.git/hooks/pre-commit` and no `core.hooksPath`** in this worktree. So in a Cursor session, or from any shell not mediated by Claude Code's Bash tool, the gate does not fire. The dispatch handed to this lane says "**The commit gate refuses a close that declares any (A-181)**" — in Cursor, by the gate's own documented bypass list, **it does not.** I will declare `subAgents: {spawned: 0, maxDepth: 0}` honestly, and I am telling you that the control would not have caught me if I had lied. **The fix worth carding: a real `pre-commit` hook, not a tool-use matcher.** |
| 6 | **The six duplicate amendment ids** — A-016, A-060, A-061, A-136, A-145, A-146 | **NO** | A-176 records them; scope §4.6 C7 carries them. **But the register and the amendment disagree on the size of the class, and this is a free finding:** `per_class_count` C15 = **3**, and the smooth path's X-1 says "**three** duplicate amendment-id pairs (A-136, A-145, A-146) currently live"; A-176 and scope C7 both say **six** ids. Three pairs and six ids can be the same fact — but the register's own class instance count says 3 while two other authoritative sentences say 6, and nothing reconciles them. Under DEV_PROCESS ("two numbers that should agree and don't = a free finding"), the C15 population is **UNMEASURED**, and the check that would settle it (X-1) does not exist. |
| 7 | **The two closes held off main** (A-176) | **NO for Burnet; YES before they are counted as closed** | `_inbox/2026-09-14_p156-bastrop_close.json` (probe artifact carries no P-156 predicate) and `_inbox/2026-09-14_p186-remint-wrapper_close.json` (claims P-154 with no probe artifact; the F31 id collision), preserved at `d8b61021`. They are **not on main and not counted** — which is correct behaviour by the gate and A-176 says so plainly. They must be **re-graded before they land**, and until then any statement that "P-156 closed" or "P-154 closed" elsewhere in the corpus is unsupported. Not a Burnet blocker. |

**Second mechanism, for the blocking verdict on item 1.** Independently of A-182: the canon's own
stop-point law (program law 4) names "a write to a **production serving store**" as one of exactly
three places the operator stops the program. Burnet's stage 10 is the first production publish by a
county that has never published. An unrotated read-write credential for that store, exposed for
twelve days, is a defect in the state the operator is being asked to authorise — so it blocks by the
program's own rule, not by a security judgement.

**T9 overall: HOLDS — with one item that must clear (ADD-084) and one control that does not exist
in the harness that received this dispatch (the FAN-DEPTH commit gate).**

---

## T10. What is missing entirely.

Exhausted, in the order the missions run. Each item names what it blocks and why no row, item or
decision owns it.

**Required to complete the six counties (Phase 0):**

1. **A serving-surface acceptance instrument that is not the store.** Law 1 makes
   `scripts/surface-probe.mjs` the definition of done and A-150 records it has **zero OPS-24
   predicates**; P-197 owns it and its cost meter is "not built". §5 part 2 depends on it. **No row
   owns building the probe's OPS-24 legs as a done-condition of Phase 0** — P-197 is carded but the
   exit cites it as though it will exist. (T1)
2. **A cost and stage telemetry schema.** No column, no table, no writer (T5). Law 5 depends on it;
   commitment 3's kill test depends on it; the Bell-and-Milam storage decision depends on it. **No
   row owns it.** §12 lists "the stage-record format and the telemetry on the two depth writers" as
   able to start now — that is a *format* for two writers, not a store, not a migration, and not the
   thirteen stages law 5 names.
3. **A lease mechanism covering job executions and heavy-scan windows.** Smooth-path X-2; the
   register's C17 with 11 instances and a scheduled-job-inside-a-walk instance already measured. **No
   row, no item, no decision owns it** — R5's §13 item 3 mentions "heavy-scan serialisation" as a
   caution, not as a build.
4. **The 219,472-case census instrument.** S0 is the row (`scripts/setback-parcel-census.mjs`), and
   S1 `Depends` on P-201, S3 on S0, S6 on S3, R5 and R7 on S6 (T7). The instruments that produced
   §2b's numbers are this session's queries, **not checked in** — S0's whole purpose is to replace
   them, and its done-when includes self-testing "a city with no table must show a non-zero false
   absence". **No instrument in the corpus can be re-run to reproduce 219,472.** (T4)
5. **The predicate-qualified envelope count.** P-249 needs "district **and** table" (T3); the GAP
   instrument reads one rail. **No row owns measuring the intersection**, so P-249's headline cannot
   be reconciled to anything.
6. **A divergence test across the four `depthWarm*` predicates** and, more broadly, across every
   paired implementation the register names (C2, 19 instances; the two `evaluateRailGate` copies; the
   two edge labellers; the two registries). Smooth-path G9-1 is the only proposal and it is unbuilt.
   **No row owns the divergence harness.** (T3, T6)
7. **A home for the nine unowned L-E defects (D2, D5, D6, D7, D8, D9, D11, D12, D14) and the seven
   rowless X-items.** §4.5b is a repo list. (T8)
8. **The PDF leg and 15 ungraded buckets as an exit condition.** §4.5b says they are graded "before
   Phase 0 exits"; §5 does not contain them. (T8)

**Required to build the farm:**

9. **A generalised `PUBLISH_TARGETS`/`WRITER_TARGETS` pair.** A-179 verified both are frozen to
   staging/production, so **a second farm cannot run under its own name** — this is the structural
   blocker the farm architecture report calls out. Rev 3 item 4 lists it as one of three
   "preconditions … built alongside", which means it is **concurrently owed, not sequenced**. **No
   row owns it.** It is the one item that makes Bell and Milam in parallel impossible under isolated
   stores no matter what Burnet's telemetry says.
10. **The pre-bake audit's checklist as a closed set.** T6: 2 classes with no check, 16 with unbuilt
    checks, 55 open candidate keys. Rev 3 item 7 asserts the register "becomes the pre-bake audit's
    checklist" — the register is 486 instances and the audit is supposed to run one item per class.
    **No row owns collapsing 55 candidates into 18 classes, or writing the checks.**
11. **Branch lifecycle and cleanup** (Rev 3 item 4's third precondition). A-180 quarantined six
    branches by hand with a recorded reverse; nothing prevents the next six. **No row owns the
    lifecycle.**
12. **The pattern that makes a producer fix reach the customer.** §2c states it and it is the
    session's dominant finding: "Because the live derive defers to the atom, **fixing a labeller does
    not change what serves until the atom is re-derived.** That is pattern 1 of the reports card: a
    producer fix does not fix a product whose consumer defers first." P-230 owns one instance; the
    *pattern* has no owner, and R5 (the re-derive) is blocked by the deferral in T7.

**Required to run Burnet:**

13. **Address-point coverage for 48053.** A-150a's named precondition, five weeks stale:
    `txgio_address` held 6 of 254 counties as of 2026-08-08 and Burnet was not among them; the Find
    box resolves through it, so **no `surface-probe.mjs` lookup can pass in Burnet** regardless of
    the pipeline's quality. A-150 says P-189 owns the loader ("Burnet has 59,785 parcels … and 0
    address points"). **What no row owns is the *re-count* immediately before the run** — A-150a
    says "(a) re-count `txgio_address` for 48053 before treating the customer predicate as
    reachable". That is a precondition with no instrument and no owner, and it sits on the
    definition of done.
14. **The Burnet row/geometry reconciliation.** Smooth path A3-2's own fixture: Burnet "59,785
    parcels on production against 50,138 geometry-ingest features, a mismatch the program's own scope
    document says '**nobody reconciled**' as of 2026-09-16". **No row owns explaining it**, and
    under A3-2 Burnet could not proceed past stage 3. It is not in §4, §7, or §12.
15. **A metered, exit-bounded run harness for the thirteen stages.** §7 describes the run; law 5
    requires per-stage metering; §13 item 3 requires heavy-scan serialisation. Nothing in the corpus
    runs a county end-to-end with per-stage records. **No row owns the runner** — only the manifest
    (P-187), the merge gate (P-198's instrument) and the audit.
16. **A rule for what happens when Burnet's stage verdicts contradict a Phase 0 row's close.** Every
    close graded on gate verdicts has been grading something the customer may not see (A-153/P-230:
    "**The gate and the customer surface are not the same mechanism. Every close graded on gate
    verdicts has been grading something the customer may not see.**"). P-230 owns the fix for one
    instance; **no row owns the rule** that a Phase 0 close must be re-graded on the surface before
    Burnet is allowed to depend on it.
17. **The read-only DSNs for a teardown lane**, per the limit at the top of this review. Not a
    product gap; a program-instrument gap, and it is why this review's arithmetic is cited rather
    than derived.

**Required for Bell and Milam in parallel:**

18. **The `publish_runs`/`leases` county-partition claim, tested under concurrency.** A-179 asserts
    shared stores "already tolerate two counties publishing in the same hour because `publish_runs`
    and `leases` partition by county". The partition is a schema fact; **that two counties publishing
    in the same hour is safe is untested**, and the one measured scheduled-job-inside-a-walk instance
    (C17) is exactly that shape. **No row owns the test**, and the decision it informs ("whether they
    need isolated stores") is scheduled to be made from records that do not exist (T5).

---

## What does not survive — consolidated

| # | Claim | Where | Verdict |
|---|---|---|---|
| 1 | §16: "Phase 0 exits when this command exits 0" | scope line 894 | contradicted by §5; **delete one** |
| 2 | "zero cells carry a false earned state" | §5 part 1; instrument 96–119 | 2 predicates, 2 rails, 1 vacuous guard |
| 3 | Two of §5's four exit parts depend on missing/blocked instruments | §5 parts 2, 3; A-150, A-178 | amend |
| 4 | `roads`/`edgeSignal`/P-203 accepted exclusions are safe and durable | policy rows 58, 74, 62–70 | acceptance depends on an unmeasured event; roadmap coupling is a comment |
| 5 | "P-201 … proven by violation on an instantiated, unfilled county" | preamble law 2; Rev 3 item 1 | **executed: it passes** (65/65 `excluded-*`, `ok:true`, `unaccountedCount:0`) |
| 6 | The plan names the gate that must refuse | law 2 names `evaluatePublishGate` | **no production caller**; three gates exist |
| 7 | "it unlocks 131,357" | Rev 3 item 2 | the figure counts `setbackFrontFt`, the predicate needs district+table |
| 8 | Carry the `depthWarmPromoted` signal | OPS-16 P-249 | **no surface reads that field**; it is `depthWarmPromotion`, a string marker |
| 9 | "the map's `envelope-unverified` decline changes to match" | §4.2 item 1 | undetermined; the deciding binding is not named |
| 10 | "P-216 took the map down with a one-branch change" | §4.2 risk; §13 item 1 | **refuted by A-157** in the same corpus; the register knows the real cause |
| 11 | The 123,706 zeros contribute to the unlock | Rev 3 item 2 | they become named declines; road-node quality is the gate (§2c's own words) |
| 12 | "figure only when verified" holds everywhere | Rev 3 item 3 | holds on the card; **fails on the MCP payload and the PDF** |
| 13 | L-B's instrument is P-249's before/after proof | §4.2 item 1 | reads two stores, not the surface; **green on every side of the P-216 incident** |
| 14 | S0–S8 reach "everywhere that should have setbacks" | §4.1 | reachable, but the classification's dominant case is the expensive one; the 3-way scheme is missing a 4th |
| 15 | S1's flip is safe on each surface | §4.1, §13 item 1 | **two surfaces keep the legacy value / fabricate a basis** |
| 16 | Burnet on the shared stores is "measurable" | Rev 3 item 4; law 5 | **no cost column, no stage table, no writer** |
| 17 | The register becomes the pre-bake audit's checklist | Rev 3 item 7 | 2 classes with no check; 55 open candidate keys; the 1 working check is county-locked |
| 18 | "S0–S8" ordering outside §4.1 | §4.2 R5/R1, R8/R1 | **R5 depends on a row §4.2 defers to after Phase 2** |
| 19 | "dispatched by repo availability" | §12 | two chains converge on S6; three rows share one surface (D3/X4/R9) |
| 20 | Phase 0 fixes every defect found | §4.5/§4.5b | **9 of 15 L-E defects and 7 of 11 X-items have no row**; 15 buckets + PDF leg not in the exit |
| 21 | The `D` id space | §4.5 vs §4.5b | collides; T8 is ambiguous by construction |
| 22 | "Five … branches are quarantined" | Rev 3 item 5 | six, in two records |
| 23 | "add it to `secret-rotation.mjs`" | §4.6 C5 | needs three coordinated changes; the frozen 2-key object makes one a no-op |
| 24 | C15 duplicate amendment ids | register C15 = 3; A-176/C7 = 6 | two numbers that should agree; X-1 unbuilt |
| 25 | The FAN-DEPTH commit gate enforces this dispatch | dispatch text | **Cursor / non-Claude-Code commits are a documented bypass**; no `.git/hooks` |
| 26 | `roads`/`edgeSignal` accepted while R8 requires them to pass | §2a vs §4.2 R8 | two acceptance standards for one row |

## What holds, and how hard I pushed

- **P-249's mechanism** (T3). The predicate that distinguishes a shape-only zero from a verified one
  is already in `reconcileAtomEnvelope.ts` as an explicit branch; my strongest attack was hunting for
  a fourth state it misclassifies and finding `validation-failed`, which the plan anticipates.
  **HOLDS WITH CONDITIONS.**
- **The three-state split's positive direction** (T2). `excluded-not-applicable` correctly serves a
  county-scoped rail like `maxImperviousCoverPct` outside Travis; the complementary case is proven by
  the instrument's self-test 7. **HOLDS.**
- **Burnet on the shared stores** (T5). County partitioning is real in the schema; the frozen target
  pair blocks *isolated* farms, not shared ones. **HOLDS WITH CONDITIONS.**
- **The register's arithmetic** (T6). 361 = 330 + 31 = instances; 125 = 125 = instances; union 486.
  Exact. **HOLDS.**
- **The setback defect's existence and size** (T4). Two independent reads agree county-by-county
  (§2b), the mechanism is named in code (`buildNoRuledTableCells`, `buildResolvedCells`), and the
  fix's direction is right. **HOLDS.**
- **Phase 0's exit *concept*** (T1). "Every rail pass or excluded under a named ruling, zero false
  earned states" is the correct shape of a completeness test; what fails is what it reads, not that
  it reads. **HOLDS IN SHAPE.**
- **A-177's road-node deferral as an operator ruling** (T1/T7). The ruling stands; what does not
  survive is building a Phase 0 exit and a Phase 0 row (R8) on top of its unconditional half while
  its escape clause remains unmeasured.
- **A-180's area-figure ruling** (T3). Correct as a rule; unimplemented on two of four surfaces.
- **The operator's sequence** (Phase 0 → Burnet → Bell/Milam). I attacked the arithmetic and the
  dependencies, not the sequence. **HOLDS**, with T7's caveat that its critical path is not the one
  §12 implies.

---

## Ranked: must change before any build row

**Tier 1 — the plan is wrong about a mechanism, so a row built from it will be built wrong.**

1. **Fix law 2's gate.** Name `requirePreBakeReadiness` (population + `evaluatePreBakeReadiness`)
   as the publish refusal, `evaluateRailGate`/`parcel_gate_verdict` as the reporting surface, and
   `evaluatePublishGate` as **vendored with no production caller**. Restate P-201's done-when as a
   **refusal** for a rail live program-wide with zero earned cells in this county, and re-run the
   violation test against it. (T2, items 5–6)
2. **Fix P-249's wiring instruction.** `depthWarmPromotion` (string, `"depth-warm-promoted-v1"`,
   plus the `sourceCitation` fallback), not `depthWarmPromoted`; one predicate, or four with a
   divergence test. (T3, item 8)
3. **Fix P-249's sizing.** "131,357" is an upper bound defined on `setbackFrontFt`; add the
   district-and-table-qualified count as a second number and reconcile to **that**. (T3, item 7)
4. **Restate L-B's role in P-249's proof.** The instrument reads stores and cannot see the surface
   that failed. The proof needs a build-identity read by asset existence, a fresh context, and
   per-branch assertions on `status`/`declineReason`/`envelopeCovered`/`geojson`. (T3, item 13)
5. **Delete or correct §13 item 1 and §4.2's P-216 risk line.** The refuted attribution teaches a
   false lesson to every lane that reads the scope for its risk brief. (T3, item 10)

**Tier 2 — the plan's own acceptance standards cannot be met as written.**

6. **Resolve R5/R1 and R8/R1.** Either R5 moves out of Phase 0 or R1 comes in; either R8 is deferred
   or the policy table stops accepting `roads`. One acceptance standard per row. (T7, items 18, 26)
7. **Restate the exit.** One definition (§5), amended to include the serving surface, a
   `FALSE_EARNED` predicate per false-absence rail-family, the bucket/PDF leg, and an explicit
   reachability statement for the nine no-`accept` rails. (T1, items 1–4)
8. **Allowlist S1's rails.** Exclude the four dollar rails and `valueBasis` until their serve path
   stops keeping the legacy value; say so in §4.1. (T4, item 15)
9. **State the real critical path.** Burnet is behind 54 cities' ordinances and 172 uncodified
   district codes, not behind P-201 and P-249. Put that sentence in §12. (T4, T7, item 19)
10. **Close the register's class set and give C7 and C14 an owner or an explicit "audit-only"
    line**; freeze the 55 candidates into the 18 or decline to. (T6, item 17)

**Tier 3 — missing instruments; each blocks a named predicate.**

11. **Cost + stage telemetry: a migration, not a format.** (T5, item 16)
12. **Serving-surface acceptance legs for `surface-probe.mjs`, as a Phase 0 done-condition.** (T1)
13. **A lease for job executions and heavy-scan windows (X-2), before Burnet's first heavy phase.**
    (T5, item 17)
14. **The census instrument (S0) checked in**, so 219,472 is reproducible. (T4/T10, item 4)
15. **`six-county-completeness.mjs` generalised to any county**, with the required-leaf list derived
    from the manifest constant. (T6, item 25 — the check that exists must work on Burnet.)

**Tier 4 — ownership and hygiene.**

16. **Card the nine unowned L-E defects and the seven rowless X-items, or rule them out of Phase 0.**
    (T8, item 20)
17. **Give L-E's defect list a distinct id prefix.** (T8, item 21)
18. **ADD-084:** operator decision before Burnet's first production publish; card the rotation, not
    just the incident. (T9, item 1)
19. **Correct C5 to the three-part change** and Rev 3 item 5 to "six branches, two records". (T9,
    items 2, 3)
20. **A real `pre-commit` hook for the FAN-DEPTH gate.** The tool-use matcher does not fire outside
    Claude Code, which is a documented bypass and the harness this dispatch was handed to. (T9,
    item 5)

---

## Pre-registered falsifiers, scored

1. **"At least one thesis does not survive. If all ten hold, show the strongest attack you made on
   each."** — **FIRED.** T2 and T6 do not survive. T1, T7, T8 and T10 do not survive. T3, T4, T5 and
   T9 hold with named conditions. No thesis held unconditionally. Strongest attacks on the survivors
   are recorded above, including the one that turned out to strengthen a claim rather than break it
   (`validation-failed` in T3: the mechanism anticipates its own hardest case).
2. **"T6 names at least one class with no executable check, or shows the check for every one."** —
   **FIRED, twice.** **C7 (46 instances)** and **C14 (16 instances)** have no check named in any
   stage; **18 of 19 class labels have zero executable checks today**, and the one that exists is
   county-locked.
3. **"Every verdict cites a file with a SHA, or a query with a timestamp."** — **SATISFIED FOR
   FILES; NOT SATISFIABLE FOR QUERIES, and that is itself a finding.** Every verdict cites a file
   and a SHA (five SHAs pinned at the head of this review). No verdict cites a query of my own,
   because no store DSN is mounted in this session; where a figure depends on a query I name the
   query and the file that ran it and mark it UNMEASURED BY THIS LANE. The one quantity I measured
   myself (T2) was measured by executing the module, and its transcript is quoted verbatim.

## Leave-behind

- `_inbox/2026-09-16_scaleup_final_teardown_review.md` (this file).
- The extraction recipe for T2's empirical test: archive factory `origin/main` `src` to a tar,
  extract, run a probe that imports `evaluatePublishGate`/`evaluateRailGate`/`toGateVerdictKind`/
  `classifyExclusion` against a full-shaped all-`unaccounted` fixture. Nothing about it needs a
  store; it should be checked in as a fixture test rather than re-derived.
- The four `depthWarm*` predicate table (T3) — the single most reusable artifact here, and the
  shortest path to a divergence test.
- The T4 surface table (six surfaces, two unsafe) — S1 cannot ship without it.
- The §4.2 dependency graph (T7) — hand-derived; belongs in the scope as a figure.
- No store was written, no product code changed, no sub-agent launched, no file touched outside
  this worktree's `_inbox/`.
