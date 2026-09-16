CANON-PREAMBLE v3a99388a
- COTALITY REST IS DEAD, THE VENDOR IS RE-ENGAGED FOR THE FARM (operator 2026-09-16, _decisions/2026-09-16_texas_scaleup_sequence_and_four_rulings.md): when code hits Cotality REST (502/OAuth/fallthrough), re-route to county-gis/public-record and NEVER rotate the credential. The MCP eval channel is live for internal evaluation only. No vendor-sourced value reaches a customer until the commercial agreement is read, and the factory never bulk-calls the vendor. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY IS THE ONLY WRITER PATH (OPS-19) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker); own repo `hauska-factory`, own Neon store; every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`); OPTION A ruled (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): no new county is written on the old shape and old-shape writes ended permanently 2026-08-27. Every lane has its own registered worktree; never build in another lane's checkout. Row-level status lives in `_catalog/program_preambles/OPS-19.md` and `_state/property/STATE.md`, never here.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- MOST-CURRENT SOURCE WINS (operator 2026-09-11) — for setbacks and every dimensional rule, in every city and county, the source with the most recent effective date supplies the value; tier breaks ties only on equal or unreadable dates; dates are read at source (ordinance effective date, ArcGIS `editingInfo.lastEditDate`), never assumed from source kind; an unreadable date produces a conflict row with both values, never a silent pick. Supersedes tier-first ranking in LDT `authoritativeSetbackSource.ts` and layer-23-first in hauska-map. `_decisions/2026-09-11_setback_source_most_current_wins.md`.
- ENVELOPE DRAWN, FIGURE REFUSED (operator 2026-09-11) — Ruling B reversed for the polygon only: map and MCP draw block draw the modelled buildable envelope from the same `place/buildable-envelope` call with its disclosure wherever a district and setback table exist; buildable area and percent stay refused until an envelope atom backs them. Entitlement gate unchanged. `_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`.
- THE LEDGER IS THE SERVING PATH, ATOMS ARE CANONICAL (operator 2026-09-11) — node = identity, atom = one claim from one authority at one time, edge = an atom whose value is a node; a cell is accounting (state, atom reference, provenance, cached rendering keyed to atom version and vocabulary version), never a copied value; one reader in `hauska-engine/services/retrieval-api` walks gated cells and dereferences atoms and every surface and the Hauska MCP catalog consume it; unslated rails refuse, never fall to legacy; one writer mints atom + pointer + rendering in one transaction; one vocabulary module in the atom-contract package. Never add a read path, a vocabulary copy, or a value-holding cell. `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`, ADR-031 amendment 2026-09-11, OPS-23 §0.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

AGENT-CONTRACT v378cd643 — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
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

PLAN-ROW: P-188 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: doc_repo

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane scaleup-lc-blocker-history --seat <your-seat-id> --plan-row P-188 --dispatch _dispatches/2026-09-16_scaleup-lc-blocker-history_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane scaleup-lc-blocker-history --seat <your-seat-id>

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


## Mission — L-C BLOCKER HISTORY: every problem we hit bringing six counties online, so Burnet, Bell and Milam hit none of them twice

**Read-only lane in the Texas scale-up research wave.** You spawn nothing. You write no product
code and change no store.

### Why this exists

The operator, 2026-09-16: *"for the farm, I want a deep reconciliation of all the problems we've
had building all this machinery up to this point, and a very clean understanding of what those
blockers were. I think there were seven main categories. I don't want to beat my head against the
wall to get Burnet or any other county on."*

**The seven**, as the record has them:

- **The six CTX defect classes**, from `_sessions/2026-09-10_MIDSESSION_ctx_completion_and_the_six_classes.md`:
  1. punctuation-only input skipped before any write;
  2. a ceiling measured by one instrument and enforced by another;
  3. parcels that could reach no state at all;
  4. a missed sibling;
  5. a ruling filed and never implemented, down to a type that could not express it;
  6. a sub-metre digitisation mismatch between independent sources.
- **The seventh**, from `_inbox/2026-09-10_ctx_third_party_review.md` section 4: a value served
  with a label asserted by a constant and consumed by a check that cannot fail on it.

**Start from those seven and do not stop at them.** Classes named elsewhere in the record since
then are candidates, and a candidate joins the register only with instances. Examples:

- false earned states;
- stale copies overriding current data;
- identity collisions across two namespaces;
- controls that cannot fail;
- merged-but-not-deployed;
- serial discovery;
- deploy and traffic traps;
- stranded artifacts;
- duplicate row ids.

### Sources, all of them

- Every `_sessions/` file from 2026-07-20 onward.
- Every `_inbox/` close, checkpoint, WDLL, review, retro and post-mortem in the same period.
- OPS-16 amendments from A-080 onward, and the finding tables (F-rows) in OPS-19, OPS-21, OPS-23
  and OPS-24.
- `_inbox/2026-09-13_dead_controls_ranked_fixes.md`.
- The three assumption registers from 2026-09-13.
- `ENFORCEMENT.md` instances.
- The planner's memory index, `C:/Users/cente/.claude/projects/p--doc-repo/memory/MEMORY.md`,
  and the files it links. It is read-only to you, and each entry's date matters.
- **The 24 unlanded wave 6 commits** on `seat/dispatch-planner` (landed on main before this
  wave).

**Where a record says something was fixed, confirm the fix at source:** the PR, the commit, and
whether it deployed.

### Deliverables

**1. The blocker register.** `_inbox/<date>_scaleup-lc_blocker_register.json` and a readable
`.md`. One entry per **instance**, carrying:

- date;
- county and city;
- the pipeline stage (map it onto the thirteen OPS-24 stages plus depth and vendor);
- symptom;
- root cause, with file and SHA;
- class;
- how it was found (reading code, a probe, the operator, a customer);
- fix status with evidence (unfixed, fixed and undeployed, deployed, verified on the customer
  surface);
- **the recurrence control**: a hook, type, test, job or gate, or none;
- the cost, where the record states one (hours lost, a re-bake, an outage).

**Count instances. A class with one instance is still listed.**

**2. The class table.** Per class:

- instance count;
- the counties hit;
- how many instances are still unfixed;
- how many have a recurrence control that can fail;
- the stage where it was found, against the stage where it could have been caught.

**3. The smooth path.** For each farm stage, the checks the history says it must run so each
class is caught at the earliest stage, **before it costs anything**. Each check names:

- what executes it;
- what triggers it;
- what fails;
- what bypasses it.

These are ENFORCEMENT's gate questions. This becomes the pre-bake audit's register and the
farm runbook's checklist.

**4. The unfixed list.** Every unfixed instance that would hit Burnet, Bell or Milam, with the
county-specific reason. For Burnet, cover at least:

- 59,785 parcels on production against 50,138 ingest features;
- 0 address points;
- Marble Falls with no setback table;
- the roster's `NOT-FOUND-UNKNOWN-WHY` status.

For Bell, cover at least: Temple is zoned with no layer found, and the boundary divergence.

For Milam, cover at least: the CAD endpoint is unproven.

### Falsifiers

Pre-register your answers before you run anything.

1. The six CTX classes and the seventh must each carry at least the instances their source
   documents name. Fewer means your read missed them.
2. At least one class the record treats as "fixed" must turn out, at source, to be undeployed,
   unverified or uncontrolled. **If none does, say how you checked** and why that is plausible.
3. **Not vacuous:** the smooth-path check for class 5 (a ruling filed and never implemented) must
   be one a machine executes, not "the planner remembers".

### Close

**Report.** `_inbox/<date>_scaleup-lc_blocker_history_report.md`, holding the four deliverables.

**Close JSON.** `_inbox/<date>_scaleup-lc-blocker-history_close.json`, carrying:

- `planRows` `["P-188"]`;
- `probe` `{"notApplicable": "read-only research lane"}`;
- `falsifier` scored;
- `leave_behind`.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-16_scaleup-lc-blocker-history_cp1.json
  CP2: _inbox/2026-09-16_scaleup-lc-blocker-history_cp2.json
  CLOSE: _inbox/2026-09-16_scaleup-lc-blocker-history_close.json
  These paths are relative to the doc_repo worktree the session RUNNING YOU is rooted in: for a
  lane spawned by the dispatch planner that is the planner's worktree; for the dispatch planner
  itself it is its own seat worktree (never P:/doc_repo, the integration seat's checkout). This
  dispatch was compiled in P:/seat-worktrees/dispatch-planner/doc_repo. Two lanes in each of waves 1 and 2 wrote
  into the property seat's worktree instead and their artifacts had to be found by hand.
  No notification arrives when a background command finishes: poll with a bounded loop and a
  timeout; a lane that ends its turn waiting for a wake-up stalls (two lanes did, wave 2).

CLOSE SKELETON (the fields the enforcement gate reads; spell them exactly, or the gate refuses
the commit rather than guessing what you meant):
  {
    "lane": "scaleup-lc-blocker-history",
    "planRows": ["P-188"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
