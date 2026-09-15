CANON-PREAMBLE v9e22f2c4
- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY IS THE ONLY WRITER PATH (OPS-19) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker); own repo `hauska-factory`, own Neon store; every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`); OPTION A ruled (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): no new county is written on the old shape and old-shape writes ended permanently 2026-08-27. Every lane has its own registered worktree; never build in another lane's checkout. Row-level status lives in `_catalog/program_preambles/OPS-19.md` and `_state/property/STATE.md`, never here.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- MOST-CURRENT SOURCE WINS (operator 2026-09-11) — for setbacks and every dimensional rule, in every city and county, the source with the most recent effective date supplies the value; tier breaks ties only on equal or unreadable dates; dates are read at source (ordinance effective date, ArcGIS `editingInfo.lastEditDate`), never assumed from source kind; an unreadable date produces a conflict row with both values, never a silent pick. Supersedes tier-first ranking in LDT `authoritativeSetbackSource.ts` and layer-23-first in hauska-map. `_decisions/2026-09-11_setback_source_most_current_wins.md`.
- ENVELOPE DRAWN, FIGURE REFUSED (operator 2026-09-11) — Ruling B reversed for the polygon only: map and MCP draw block draw the modelled buildable envelope from the same `place/buildable-envelope` call with its disclosure wherever a district and setback table exist; buildable area and percent stay refused until an envelope atom backs them. Entitlement gate unchanged. `_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`.
- THE LEDGER IS THE SERVING PATH, ATOMS ARE CANONICAL (operator 2026-09-11) — node = identity, atom = one claim from one authority at one time, edge = an atom whose value is a node; a cell is accounting (state, atom reference, provenance, cached rendering keyed to atom version and vocabulary version), never a copied value; one reader in `hauska-engine/services/retrieval-api` walks gated cells and dereferences atoms and every surface and the Hauska MCP catalog consume it; unslated rails refuse, never fall to legacy; one writer mints atom + pointer + rendering in one transaction; one vocabulary module in the atom-contract package. Never add a read path, a vocabulary copy, or a value-holding cell. `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`, ADR-031 amendment 2026-09-11, OPS-23 §0.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

AGENT-CONTRACT v79be86e2 — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

FLEET-MEMORY v2a98086b — you are bound by 90_runbooks/fleet_memory_practice.md (M0).
The verbatim install block follows. Product-repo agents do not carry .cursor/rules; this is the install.

FLEET MEMORY (M0): As you work, capture build knowledge in a scratch block you return in your close, using four entry kinds — LESSON (a hard-won fact worth a test/note), DEAD-END (a tried-and-failed path + reason, so it is not retried), GROUND-TRUTH (a live-verified state WITH its timestamp), OPEN (a live thread the next context must pick up). Read any scratch context passed to you FIRST before re-deriving. Do NOT promote anything to durable memory yourself — return lessons in your close; the planner gates promotion. Nearing your limit, flush open threads + live ground-truths into your close so the next instance starts warm.

PLAN-ROW: P-195 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-factory

# PROGRAM CONTEXT — OPS-24 county to serving

You are working a lane of OPS-24. Everything below is program law for this lane. If it
conflicts with the general canon preamble, this section is narrower and wins on scope; if it
conflicts with the AGENT CONTRACT or ENFORCEMENT, those win.

## The one goal

A county goes from "not in the product" to "a customer types a real address in that county
and the card, the MCP and the PDF agree, and every value carries its source and vintage"
through ONE pipeline of thirteen stages, each with a predicate that can fail and an instrument
that measures it, at a cost the kill test can read. Not "acquire everything". Not a farm
before one county has run end to end through the pipeline that exists.

## Six laws

1. **The customer predicate is the definition of done.** `scripts/surface-probe.mjs` with a
   real address in the county is the finish line for every stage, not stage 12's private
   check. A stage that cannot be traced to a change in what the probe reads is not on this
   program. ARMED 2026-09-14 on the enforcement side: `probe-close-gate.mjs` gates every
   OPS-24 row and prints the predicate debt on each close until `surface-probe.mjs` carries
   the stage's row (P-197); a close with neither an artifact nor a declared
   `probe.notApplicable` (read-only reviews only) is refused.
2. **The gate is fixed before anything trusts it.** The publish gate today passes TOTAL
   absence and refuses PARTIAL absence (P-181, dead-controls ranking, entry 1). Nothing that
   reads a gate verdict, the per-place declaration, the completeness check, a farm's merge, is
   built or run against the gate until stage 9 lands and is proven by violation on an empty
   county.
3. **One county end to end before any farm.** Burnet runs stages 3 through 12 through the
   existing pipeline first. The farm (stages 1 and 13) is designed from what that run breaks.
   The fleet has learned twice that blockers surface serially; a wave finds them slower than
   one county does.
4. **Three operator stop points, and only three:** a new credential or secret mount, a write
   to a production serving store, a ruling. Everything else runs unattended and leaves a
   record naming what it touched.
5. **Every stage meters itself.** Compute dollars and operator minutes per county per stage
   go on the stage's run record, so commitment 3 (under 200 dollars and one hour per county)
   can fire as a kill, not a slogan.
6. **Nothing is measured once and published as state.** A number on this program's card
   names its SHA and its date. OPS-23's live card is authoritative where the two programs
   touch (serving, identity, the ledger).

## Identity and vintage, inherited as law

The OPS-21 identity paragraph applies: `place_key` is the parcel-map id; in a two-namespace
county the account joins only through the published crosswalk; never by bare number. The
P-178 vintage rule applies: a county's declared roll is a decision with a marker for accounts
that fall off, never an upsert that keeps notice values silently.

## What this program absorbs

OPS-21's unfinished writers (stage 6), OPS-23's serving seams (stages 10 and 11), P-124's bake
(stages 9 and 10), P-156 (stage 0), P-181 (stages 2 and 9), P-182 (stage 0), P-184 (stage 4).
Each absorbed row keeps its number and its close history; OPS-24 rows name what they absorb.


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

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-14_p195-gate_cp1.json
  CP2: _inbox/2026-09-14_p195-gate_cp2.json
  CLOSE: _inbox/2026-09-14_p195-gate_close.json
  These paths are relative to the doc_repo worktree the session RUNNING YOU is rooted in: for a
  lane spawned by the dispatch planner that is the planner's worktree; for the dispatch planner
  itself it is its own seat worktree (never P:/doc_repo, the integration seat's checkout). This
  dispatch was compiled in P:/doc_repo. Two lanes in each of waves 1 and 2 wrote
  into the property seat's worktree instead and their artifacts had to be found by hand.
  No notification arrives when a background command finishes: poll with a bounded loop and a
  timeout; a lane that ends its turn waiting for a wake-up stalls (two lanes did, wave 2).

CLOSE SKELETON (the fields the enforcement gate reads; spell them exactly, or the gate refuses
the commit rather than guessing what you meant):
  {
    "lane": "p195-gate",
    "planRows": ["P-195"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
