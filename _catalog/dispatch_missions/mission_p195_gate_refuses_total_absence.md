## Mission — P-195 THE GATE REFUSES TOTAL ABSENCE: the first OPS-24 build row, and nothing downstream is trusted until it lands

You are a hand-carried lane on the property seat. You are the deepest worker: you do not spawn
sub-agents. The integration seat (overseer) reviews CP1 and CP2 in this thread. You do not
re-derive the defect; it is isolated, with a proposed fix, at
`_inbox/2026-09-13_dead_controls_ranked_fixes.md` entries 1 and 2, confirmed by direct trace in
`_inbox/2026-09-14_ops24_teardown_review.md` section 1.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### The defect (two functions, three files)

1. `evaluateRailGate` returns `ok: true` for a county whose cells carry NO earned value: the
   predicate `cells.some(isEarnedCell)` over the cells handed to the call cannot tell "declared
   ahead program-wide" from "this county was never filled", so an empty county earns 65 clean
   `excluded` verdicts. It lives TWICE: hauska-factory
   `src/lib/parcel-record-engine/publish-gate.js` (what `publish-gate-sched` calls hourly; no
   generated-file banner, reads as authored) and hauska-engine
   `packages/engine-core/src/parcel-record/publish-gate.ts:171-188`. Fixing one leaves the other.
2. `evaluatePopulation` (hauska-factory `src/lib/publish-readiness-gate.mjs:216-300`) gates
   every ratio refusal on `code === "OK"`; `overlapRatio` returns `EMPTY_DENOMINATOR` on an empty
   set, which is neither `OK` nor `KEYSPACE_MISMATCH`, so it skips every refusal and returns
   `ok: true`; `BAKE_POPULATION_MISSING` needs `roll.size > 0` so it does not fire either. A
   county with no roll and no landing passes readiness. That is the state of 217 Texas counties.

The control is inverted: partial absence refuses, total absence passes. Everything that reads a
gate verdict (P-156's per-city declaration, P-194's completeness check, a farm's merge) is built
on it, which is why OPS-24 orders this row first.

### Where you work

`hauska-factory-p195-gate` (branch `fix/p195-gate-refuses-total-absence`) and
`hauska-engine-p195-gate` (branch `fix/p195-gate-refuses-total-absence`), from `origin/main`;
declare start commits.

### What you build, in order

1. **Settle the twin.** Read both `publish-gate` copies and their history: is the factory `.js`
   generated from the engine `.ts` (then the generator must be found and the banner added) or an
   independent copy (then a divergence test that fails when the two disagree on a fixture,
   DEV_PROCESS paired-controls rule). State which, with evidence, at CP1. Do not edit either
   until this is settled.
2. **`evaluateRailGate`.** Takes the program-wide declared-ahead set as an explicit input (it is
   already derived as `deriveDeclaredAheadRailKeys`); a rail in that set is `excluded`; a rail
   NOT in that set with zero earned cells in this county is a REFUSAL with a code that names it
   (`RAIL_NEVER_FILLED`), never a pass. Same change in both copies, or through the generator.
3. **`evaluatePopulation`.** `EMPTY_DENOMINATOR` becomes an UNMEASURED verdict the caller must
   handle, and readiness refuses on it (`BAKE_POPULATION_UNMEASURED`); a county with no roll
   and no landing refuses with that code. Absent, zero and unmeasured stay three states.
4. **Verify by violation, both directions, before any deploy.** Fixtures: (a) an empty county
   (no roll, no landing, no cells) must REFUSE at both functions; (b) a genuinely declared-ahead
   rail on a filled county must still be `excluded`, not refused; (c) a partially filled county
   refuses exactly as today (no widening). Then live: run `publish-gate-sched` on staging
   against one of the 217 `TX-LANDING-ABSENT` counties and paste its refusal; run it against
   Bastrop and paste that its verdict is unchanged from the last run.
5. **Deploy** the scheduler job from `origin/main` after merge; it is a job, not a traffic
   service, so no lease, but it is a production control: the operator's go, quoted, before the
   production job image moves. Paste the job's image digest before and after.

### Falsifiers

- If the empty-county fixture passes either function after the change, the fix is not in the
  path the scheduler calls (check the twin).
- If Bastrop's verdict changes, the fix widened or narrowed a real check; explain every delta.
- If the two gate copies still differ after step 1 and no divergence test fails, the pair is
  unguarded.

### Out of scope

Entries 3 to 8 of the dead-controls card (own rows). The writers' false `lease_released:true`
(P-192). Any declaration or completeness check (they wait for this).

### Close

`_inbox/<date>_p195-gate_close.json`, `planRows` `["P-195"]`, with the twin verdict, the PRs
and merge SHAs with conclusion strings, the fixture results both directions, the two live
scheduler reads, the job digests, and `probe.notApplicable` set to "gate control; verified by
violation on an empty county, fixtures and live reads pasted" (OPS-24 Law 1 debt is printed by
the close gate until this row's predicate exists in surface-probe.mjs; P-197 owns that).
`leave_behind` is required.
