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

PLAN-ROW: P-213 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-engine

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p213-blast-radius-refusal --seat <your-seat-id> --plan-row P-213 --dispatch _dispatches/2026-09-16_p213-blast-radius-refusal_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p213-blast-radius-refusal --seat <your-seat-id>

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


## Mission — P-213: the blast-radius refusal, generic, before Burnet

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

### Why this is urgent right now

P-212 (the SEV-1 mass false retirement of 57,704 Bastrop parcel-nodes) is
fixed and verified live. The code path that PRODUCED it is not.
`reconcileCountyParcelNodes` and `write-parcel-node-county.mjs` in
`hauska-engine`, read at current `origin/main` HEAD 2026-09-16, still compute
`orphans` as an unconditional set-difference and write ALL of them to
`retired` with no share/threshold check, no operator-authorization gate, and
no refusal path — confirmed by reading the write path itself, not by
measuring output. OPS-24 is about to run new counties (Burnet, then Bell and
Milam) through the same re-acquisition/reconcile pipeline. Nothing stops the
identical incident from recurring, and there is no guarantee another lane
stumbles onto it by accident next time the way this one did.

### Where you work

Fresh clone of `empressaioemail-tech/hauska-engine` from `origin/main`, on a
new branch `feat/p213-blast-radius-refusal`. Declare the commit you started
from before you write anything.

**Repo-sequencing note:** `P-238` (dossier footer/deep link) was also
dispatched to this repo today. One repo, one writer — check
`node scripts/lane-claim.mjs status` in the doc_repo worktree you are rooted
in before starting; if P-238 is live, coordinate or wait rather than racing
it, and tell the planner if you had to.

### The rule, verbatim from OPS-16 P-213 (do not narrow it)

**GENERIC BY DESIGN: this is not a retirement control and must not be scoped
to one writer.** It protects every batch state-change path this repo has.
The predicate, and every clause must be able to fail:

1. A batch writer computes the share of the target population it would
   transition to a destructive state BEFORE committing.
2. Above a DECLARED threshold it exits non-zero, writes nothing, and reports
   the share and the population it measured.
3. Proceeding above the threshold requires explicit authorization carried
   into the invocation — never a config default, never a warning nobody
   reads.
4. Proven by violation in BOTH directions: a run above the threshold refuses,
   and a run below it still writes normally.

The threshold is a declared number per writer, recorded with its basis, not a
judgement call made at call time.

### The template already exists in this portfolio — reuse its shape

`hauska-factory/src/lib/publish-coverage-floor.mjs` (shipped 2026-09-15 as
P-236, current `hauska-factory` HEAD `bfb7303`) is a real, working instance
of exactly this control — pre-write, fail-closed, declared threshold, named
override, recorded either way — built for a different population (zoned-node
coverage collapse in the LDT tier1 bake/publish path). Read it. Do not
reinvent the shape; port the pattern. It guards the wrong population today;
yours guards the right one.

### What to build

A generic, reusable blast-radius guard in `hauska-engine` (a shared module,
not copy-pasted per call site), then wire it into
`reconcileCountyParcelNodes` / `write-parcel-node-county.mjs` FIRST, since
that is the writer with the proven live incident and the imminent exposure
(Burnet). Build it so a second batch writer can adopt the same guard without
re-deriving the logic — that is what "generic by design" requires, even
though this dispatch's proof case is the one writer.

Name the bypasses in your close: a raw connection, a direct `UPDATE` outside
the guarded writer, and any other path that reaches the same table without
passing through it. The answer is rarely none — find it and say what it is,
even if you don't fix it.

### Explicitly NOT in scope (do not scope-creep into these)

- Fixing the P-212 comparator itself — that was P-212's own work and is done.
- Making the serve path honour retirement (P-206) — separately blocked,
  separately owned.
- The ten-minute `factory-conformant reap` schedule, which carries a
  destructive verb on a short clock and is UNAUDITED. It is flagged in the
  canon as worth a look, carded to nobody, and NOT assumed to be defective.
  Do not touch it; do not assume it needs the same guard without measuring it
  first — that is a separate row if it turns out to need one.

### Verification (exit-bounded — every command must terminate on its own; no watch, tail, or serve)

Prove clause 4 for real: construct a fixture population where the reconcile
would retire above the declared threshold and confirm the writer exits
non-zero, writes nothing (read the table back and confirm zero rows changed),
and reports the share and population size. Construct a second fixture below
the threshold and confirm it writes normally. Both are real tests, not
descriptions of intended behavior. Run this repo's test suite and typecheck;
confirm both exit 0, paste real output.

### Do not

- Do not narrow this to a "retirement-only" check. Re-read the GENERIC BY
  DESIGN clause above if you find yourself doing that.
- Do not pick the threshold without recording its basis (why this number,
  not a rounder one) in the code or its adjacent doc.
- Do not touch the reap schedule, the P-212 comparator, or P-206.
- Do not deploy or merge. Open the PR green and hand it back.

### Close

Name the threshold you chose and its basis. Show both fixture results
(above-threshold refusal, below-threshold pass) with real output. List every
bypass you found. State whether you coordinated with or waited on P-238 per
the repo-sequencing note. State your snapshot (repo, branch, commit).

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-16_p213-blast-radius-refusal_cp1.json
  CP2: _inbox/2026-09-16_p213-blast-radius-refusal_cp2.json
  CLOSE: _inbox/2026-09-16_p213-blast-radius-refusal_close.json
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
    "lane": "p213-blast-radius-refusal",
    "planRows": ["P-213"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
