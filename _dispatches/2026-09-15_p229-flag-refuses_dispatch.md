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

PLAN-ROW: P-229 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-factory

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p229-flag-refuses --seat <your-seat-id> --plan-row P-229 --dispatch _dispatches/2026-09-15_p229-flag-refuses_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p229-flag-refuses --seat <your-seat-id>

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


## Mission — P-229: a write-scoping flag that is accepted and silently discarded

### The finding you are acting on

On 2026-09-15 the operator authorised a production write "county-scoped to 48209 only" and
the P-211 lane ran `parcel-envelope-cells --apply --county=48209`. It wrote 107,544 cells and
the write was correct.

**The deployed job image does not contain the `--county` flag at all.** Digest
`ec2cd3bff4f3838768db5a896bd8cee0cf9d70a48f4db0e4b9bd1ec798e1643a`, generation 4. The flag
was accepted on the command line and silently discarded. Hays-only scoping was achieved
entirely by the pre-existing unaccounted-only write gate — the same mechanism P-200 relied on
— **not** by the control the operator believed was bounding the write.

The P-211 lane found this and reported it against its own interest. Read its close
(`_inbox/2026-09-15_p211-six-county-circle-back_close.json`, member 1
`caveat_undeployedFix`) before you start.

**Why this is a row and not a footnote.** The write landed correctly, so nothing complained.
A control that is accepted, does nothing, and produces no symptom is the exact defect class
ENFORCEMENT.md exists to catch: it passes review and answers "do we have county scoping"
affirmatively. And it is a live footgun — the next seat who runs this job with `--county` on
a county whose cells are NOT already unaccounted will believe the write is bounded, and it
will not be. The only thing that saved this run was an unrelated gate.

### What the fix is NOT

**Merging PR #153 is not the fix.** That PR adds a working `--county` flag to both writer
jobs (55/55 tests green) and it is real work. But a flag that works is not a flag that
refuses when it is not understood. If the image ever drifts behind the caller again — which
is exactly what happened here — a merged-and-working flag returns to being silently
discarded. **Do not close this row by merging #153.**

### Done looks like

An unknown, misspelled, or unconsumed flag on `parcel-envelope-cells` and
`parcel-setback-cells` causes the job to **exit non-zero and write nothing**, rather than run
with the flag ignored. Both jobs. Argument parsing that accepts anything it does not
understand is the defect; strict parsing is the fix.

`--county` itself must also validate: a county FIPS the job has no business writing, or a
malformed one, refuses before any write.

### Falsifiers, pre-register your answers before you run anything

1. Pass `--county=99999` (a FIPS that does not exist). If the job runs and writes anything,
   you have not fixed it.
2. Pass a bogus flag name, e.g. `--countyy=48209` or `--not-a-flag`. If the job runs at all,
   you have not fixed it — this is the exact shape of the original defect, since `--county`
   on the deployed image WAS a bogus flag name from the parser's point of view.
3. Pass a valid `--county` and confirm the job still does the correct, bounded thing. A
   refusal that refuses everything is not a fix either.
4. **Run 1 and 2 against the CURRENT deployed image first and record that they pass silently.**
   That is your before-state and it is the proof the defect is real, not inferred.

### Known traps

- **The deployed digest is the authority, not the branch.** The image a job runs is its
  digest, never the tag that was requested and never what `main` contains. Read the job's
  deployed digest and say what it is.
- **Do not weaken the unaccounted-only write gate** while you are in here. It is the thing
  that actually saved the P-211 apply, and it is load-bearing until this row ships.
- A control verified by violation generates events that look like the ones being counted.
  Note and exclude your own test invocations explicitly.

### Do not

- **Do not merge PR #153, and do not merge your own branch.** Merging to `main` in this repo
  AUTO-REDEPLOYS both Cloud Run job images, which is a production deploy. Open the PR, get it
  green, and hand it back. The integration seat owns the merge and the deploy.
- Do not deploy anything.
- Do not run any `--apply` against a production store.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

Name the deployed digest you measured the before-state against, and the digest that will
carry the fix once it ships (or state that it is not built yet). Close to `_inbox/` on
doc_repo main and PUSH it. Declare `leave_behind` explicitly, even if it is `none`. State
your snapshot (repo, branch, commit).

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-15_p229-flag-refuses_cp1.json
  CP2: _inbox/2026-09-15_p229-flag-refuses_cp2.json
  CLOSE: _inbox/2026-09-15_p229-flag-refuses_close.json
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
    "lane": "p229-flag-refuses",
    "planRows": ["P-229"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
