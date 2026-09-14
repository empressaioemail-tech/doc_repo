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

PLAN-ROW: P-200 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-factory

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p200-hays-rails --seat <your-seat-id> --plan-row P-200 --dispatch _dispatches/2026-09-14_p200-hays-rails_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p200-hays-rails --seat <your-seat-id>

On 2026-09-14 this exact dispatch shape was handed to two sessions at once. One found
out mid-execution from a merged commit appearing in its own fetch.

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

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-14_p200-hays-rails_cp1.json
  CP2: _inbox/2026-09-14_p200-hays-rails_cp2.json
  CLOSE: _inbox/2026-09-14_p200-hays-rails_close.json
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
    "lane": "p200-hays-rails",
    "planRows": ["P-200"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
