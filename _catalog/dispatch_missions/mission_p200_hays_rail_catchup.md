## Mission — P-200: Hays answers the nine rails that already work in five other counties

You are a lane of OPS-24. You do not spawn sub-agents. The integration seat supervises you,
reviews CP1 and CP2, and runs the verification itself. You produce artifacts and a diff; you
do not merge to main without the owning seat.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### The finding you are acting on

Measured live 2026-09-14 against the factory store. Hays 48209 passes 31 of 65 rails, the
fewest of the six counties in the serving ledger (Travis 41, Bastrop 38, Williamson 37,
McLennan 37, Caldwell 36). Nine specific rails PASS in all five of the others and are
`excluded` in Hays:

```
setbackFrontFt  setbackSideFt  setbackRearFt  setbackCornerFt  setbackRules
maxHeightFt     maxLotCoveragePct             maxFootprintSqFt  parcelAreaSqFt
```

These are not capability gaps. The writers exist and are proven in five counties. The gold
parcel `48209:97658` returns `not-cut-over` on exactly these rails, and its own refusal text
says why: served only from `parcel_record` "once this (county, rail) pair is slated with a
passing gate verdict."

### START HERE, and do not skip it: the canary

**`48209:setbackFrontFt` IS ALREADY SLATED and still has zero value cells and an `excluded`
verdict.** The reader slate (`PARCEL_RECORD_SLATE` in legacy-design-tools, vendored to
hauska-engine `services/retrieval-api/src/parcel-record-slate.json`) holds 152 entries: Travis
30, Williamson 29, Bastrop 28, McLennan 27, Caldwell 25, Hays 13 — and `48209:setbackFrontFt`
is one of the Hays 13.

So slate membership does NOT produce cells. Diagnose that one rail before touching the other
eight. Read the writer's path for Hays and find why it produces nothing. State the mechanism
you believe explains it, then state a second mechanism that would produce the same observation
and why you rejected it.

If the answer turns out to be that the other eight only need slate entries, say so with the
evidence. If it turns out something else blocks all nine, that finding is the deliverable and
the slate work is secondary. **Do not assume the framing you were handed is right.** Three
lanes this month returned findings sharper than their hypotheses by reading the write path
instead of testing the framing.

### Known traps, each verified at source

- **LDT PR #671 DELIBERATELY REMOVED six Hays dollar and structural rail entries** from the
  slate (`marketValue`, `assessedValue`, `landValue`, `improvementValue`, `livingAreaSqft`,
  `yearBuilt`) for a live CAD-account collision. Their absence is NOT this gap. Do not re-add
  them and do not cite them as evidence about the nine.
- **Two rails are deliberately out of scope.** `agValuation` passes in only Williamson and
  Travis (partial rollout, needs its own scope call) and `maxImperviousCoverPct` is Travis-only
  by ratified design — engine PR #444 narrowed the gate's refusal specifically to protect it.
  Excluding `maxImperviousCoverPct` in Hays is CORRECT. Do not "fix" it.
- **Slate resync discipline is mandatory and documented in the vendored file's own header.**
  `slate`, `sourceCommit`, `vendoredAt` and `EXPECTED_SLATE_HASH` move together in ONE commit
  that records the LDT commit copied from. A hash change with no LDT-side resync note is a
  review flag. LDT's slate is authoritative; the engine copy is vendored.
- **Hays is in `LANDUSE_JOIN_DISABLED_FIPS_SEED = {48491, 48209}`** (LDT `joinNormalize.ts`).
  Williamson is in the same seed and passes all nine rails, so the join disable is probably
  NOT your blocker. If you conclude it is, you must explain Williamson.
- **The envelope family is refused BY RULING R-2**, not broken. `buildableAreaSqFt`,
  `buildableAreaPct`, `envelopeStatus`, `envelopeDisclosure` read zero on purpose. Out of
  scope, and not a gap.

### Done looks like

Each of the nine rails moves from `excluded` to either `pass`, or to an EARNED `refuse` that
names a count. An earned refusal is a perfectly good outcome and is preferred over a
manufactured pass; what is not acceptable is a rail that stays invisible.

And the customer-facing half, which is the real predicate: `get_smart_site` at depth node on
`48209:97658` returns real setback distances and dimension figures where it returns
`not-cut-over` today.

### Falsifiers, pre-register your answers before you run anything

- If a rail moves to `pass` while its cells are still zero, the gate is grading something other
  than the cells and that is a bigger finding than this row.
- If the writers run clean and produce no cells for Hays, the blocker is upstream of the writer
  and you must name it rather than route around it.
- If slating the eight makes them pass WITHOUT any writer run, then slate membership alone
  changes a verdict and the gate is measuring slate state, not data.

### Do not

Write to any repository you do not own. Touch `smartcity-os` or `smartcity-dashboards`.
Convert an `unaccounted` cell to `absent-verified` to clear a gate — that is a claim that
something looked, and writing it where nothing looked passes every check and is a lie. Deploy
anything without the operator's go.

### Close

`_inbox/<date>_p200-hays-rails_close.json`, `planRows` `["P-200"]`, with: the canary diagnosis
and its rejected second mechanism, the per-rail before and after verdicts read from
`parcel_gate_verdict`, cell counts by kind, the PRs with merge SHAs and CI conclusion strings,
and a `get_smart_site` read of `48209:97658`. `leave_behind` is required, and `none` is a valid
and cheap answer.
