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

PLAN-ROW: P-211 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-factory

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p211-six-county-circle-back --seat <your-seat-id> --plan-row P-211 --dispatch _dispatches/2026-09-15_p211-six-county-circle-back_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p211-six-county-circle-back --seat <your-seat-id>

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


## Mission — P-211: the six-county circle-back, so Hays stops being the odd county out

P-200 applied the Hays setback group and closed. This row is everything P-200 left behind,
gathered in one place so the leftovers are countable rather than remembered. The row cannot
close while any member is merely noted.

### The finding you are acting on

Hays is the worst of the six onboarded counties at 31 of 65 rails passing. P-200 moved the
setback group and deliberately did not touch the rest. Five members were measured and handed
forward; each needs a verdict of FIXED, RULED OUT OF SCOPE, or PROMOTED TO ITS OWN ROW.

1. **The ENVELOPE group for Hays** — `maxHeightFt`, `maxLotCoveragePct`, `maxFootprintSqFt`,
   `parcelAreaSqFt`. Six contaminated cities (Austin, San Marcos, Buda, Creedmoor, Niederwald,
   Uhland) were never reconciled the way the setback group's were. The code is deployed
   (generation 4, digest `ec2cd3bf...e1643a`) and was never run for these.
2. **`agValuation`** passes only in Williamson and Travis. Whether to extend it is an OPERATOR
   SCOPE CALL, not an engineering fix. Do not extend it on your own judgement; state the
   recommendation and stop.
3. **The `--city` filter carries no county boundary.** On `parcel-setback-cells.mjs` and
   `parcel-envelope-cells.mjs`, a city name shared across in-scope counties (those same six)
   combines BOTH counties' parcels in any `--city`-scoped run. Pre-existing, affects all six
   counties, found by the P-200 lane.
4. **Hays's reader slate** (`PARCEL_RECORD_SLATE`, hauska-engine `parcel-record-slate.json`)
   holds 13 entries against Travis's 30.
5. **The excluded-rail spread** across the six counties beyond P-200's nine — the full 65-rail
   grid.

`maxImperviousCoverPct` is **NOT a member**. It is Travis-only by ratified design (engine #444)
and excluding it elsewhere is CORRECT. Do not "fix" it.

### START HERE, and do not skip it: the gate is not the customer surface

P-200's own pre-registered falsifier 3 FIRED and it is the most important thing it found.
After the apply, `get_smart_site` on the gold parcel still returned `not-cut-over` with the
**identical runId and bakedAt as before the apply**. The cells were written, the gate passed,
and the customer surface served a cached bake (`mode: baked-facet-intel-v1`).

**Every close graded on gate verdicts has been grading something the customer may not see.**
Before you report ANY member as fixed, read it on the customer surface as well as the gate, and
if the two disagree, report the disagreement rather than the gate verdict. A rail that passes
the gate and does not reach the serve is not fixed.

### Known traps, each verified at source

- **Area-sweep, not parcel-sample.** Sampling certified a broken Bastrop once. Measure the
  population, not a handful of parcels.
- **The atoms store is on Neon database `hauska_mcp`.** A query against the wrong database
  returns a FALSE ABSENCE that looks exactly like a real one.
- **Hays's node id is the parcel-map id** (ruled 2026-09-13). Account attributes reach a parcel
  only through the crosswalk. Never join by a bare number, and verify any geometry claim by its
  ring rather than its label — the Hays chimera class is one parcel's polygon under another
  account's label, and a label match proves nothing.
- **`has_writer` / `atomFamilyState` are HAND-DECLARED, not derived.** If a writer merges during
  this lane, the declaration must be refreshed or the grid lies.
- **The geometry scorer counts ACCOUNTS where the source has FEATURES.** If a percentage looks
  wrong, fix the denominator, never the writer.
- **Factory store reads time out under writer load.** Verify a run from its execution status,
  not by querying the store while it writes.
- **The gate grades 17 of 65 rails.** "Unaccounted is fatal at publish" is unenforced for the
  other 48, so a passing gate is not a statement about the whole grid.
- **Never pipe an enumeration through `tail`.** It silently truncates and a zero result reads as
  "nothing is wrong".

### Done looks like

Every one of the five members carries a written verdict — fixed, ruled out of scope, or promoted
to a named new row — and none is left as a note. The envelope group for the six contaminated
cities is either reconciled and re-run or explicitly deferred with a row id. The `--city` county
boundary is either fixed or carded. The reader-slate gap is either closed or carded with the
count it would add. The per-county rail verdict query from A-153 is RE-RUN and its before/after
numbers are pasted verbatim, not summarised.

### Falsifiers, pre-register your answers before you run anything

Write down what result would prove each of these WRONG, before you run it. If no result would,
it is not a check.

1. If the envelope group's re-run changes a Hays rail from `excluded` to pass at the gate but
   `get_smart_site` on a Hays parcel returns the same `runId`/`bakedAt` as before, you have
   reproduced P-200's falsifier 3 and the member is NOT fixed — say so.
2. If a `--city`-scoped run for a shared city name returns a parcel count that matches the
   single-county expectation exactly, suspect your instrument before believing the filter works.
3. If the rail-verdict count improves by exactly the number of rails you touched, check that you
   are not counting the same rail twice through two names (the MUD rail duplicates
   special-district; that is a ruling and a declaration refresh, not a build).
4. If any member reads as already-fixed with no work, prove it by violating it rather than by
   observing it pass.

### Do not

- Do not extend `agValuation` scope. Recommend and stop.
- Do not write to a production serving store without the operator's go.
- Do not blanket-retire anything. P-219 flagged 3,788 of 16,751 layer-23 rows still authoring
  from the retired namespace, and blanket-retiring them would replace CORRECT values with an
  absence.
- Do not touch `maxImperviousCoverPct`.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.
- Do not deploy. Report what needs deploying; the integration seat ships it.

### Close

Close to `_inbox/` on doc_repo main and PUSH it. Declare `leave_behind` explicitly, even if the
answer is `none`. State the snapshot (repo, branch, commit) your work ran against, in the close.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-15_p211-six-county-circle-back_cp1.json
  CP2: _inbox/2026-09-15_p211-six-county-circle-back_cp2.json
  CLOSE: _inbox/2026-09-15_p211-six-county-circle-back_close.json
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
    "lane": "p211-six-county-circle-back",
    "planRows": ["P-211"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
