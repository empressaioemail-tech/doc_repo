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

PLAN-ROW: P-198, P-201, P-204 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: doc_repo

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane scaleup-teardown --seat <your-seat-id> --plan-row P-198 --dispatch _dispatches/2026-09-16_scaleup-teardown_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane scaleup-teardown --seat <your-seat-id>

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


## Mission — TEXAS SCALE-UP TEARDOWN: a fresh planner tries to break the scope before any row is allocated

You are a fresh dispatch planner with no memory of the session that wrote this scope. **You spawn
no sub-agents. You write no code and change no store.** Your product is a review that tries to
make `_inbox/2026-09-16_texas_scaleup_program_scope.md` fail, and says where it holds.

Exit-bounded verification: every command must terminate on its own; wrap anything that could
hang in `timeout`; never leave a watch, a tail, a poll or a dev server running.

### Your seat and root

Seat `dispatch-planner`, worktree `P:/seat-worktrees/dispatch-planner/doc_repo`, branch
`seat/dispatch-planner`.

**Before anything else: that branch holds 24 commits and about 93 artifacts that never reached
main** (OPS-23 wave 6). **Do not fast-forward over them and do not discard them.** Read them,
because several may change what the scope assumes, and report what they contain. Then read
`origin/main` for the scope itself.

Product repos are read at `origin/main` only, through `git -C P:/<repo> show origin/main:<path>`
and `git grep`. Never a working tree, never another seat's checkout, never a write.

The factory store may be read read-only through `FACTORY_DATABASE_URL_RO`, with
`default_transaction_read_only=on` and a statement timeout. **Never print the DSN.**

**Do not query the atoms store (`hauska_mcp`). Its only credential is an owner account.**

### Precedent

`_inbox/2026-09-14_ops24_teardown_review.md`: four theses tested and one of them was the
overseer's own gate. Match that shape. Every claim you test gets a file or a query, a SHA or a
timestamp, a second mechanism, and a verdict.

### What you test, in this order

1. **The measurements in sections 2 and 16.**
   - Re-run `node scripts/six-county-completeness.mjs --self-test`, then the live run.
   - Independently re-derive at least three numbers by a different query than the scope used: the
     219,472 total, one county's no-table figure, and the 318,000 `unaccounted` ag cells.
   - Try to show the instrument is vacuous, over-broad, or blind somewhere its self-test does not
     reach. It declares 65 rails by hand; find a way that goes stale.
2. **The diagnosis of the Hays symptom** (section 2c): the envelope declines because depth-warm
   runs only for Bastrop, Elgin and Lockhart, and because the engine labeller mislabels ring
   artifacts.
   - Read `hauska-map` `apps/property-explorer/api/_lib/atom-chain-to-facets.ts`, the engine's
     `registry/jurisdiction-registry.ts`, `depth-warm/edgeLabeling.ts`,
     `geometry/envelope-ground-truth.ts` and `boundary-primitive/lot-line-scrub.ts`.
   - Give a second mechanism that would produce the same symptom and say whether it survives.
3. **The "two registries" and "two labellers" claims** (class B). Are they really two, or one
   consuming the other? Name the import graph.
4. **S1, the flip from false absences to `unaccounted`.**
   - For each surface (map adapter, MCP, PDF), find what it renders today for an
     `absent-verified` setback cell and what it would render for `unaccounted`, with file and
     line.
   - **Say whether S1 as written would take something customer-visible dark**, which is the
     P-216 outage class. Propose the staging proof that would catch it.
5. **The sequence** (section 1 and section 12).
   - Try to show that some Phase 0 item actually needs Burnet to be done well.
   - Try to show that some farm machinery item cannot be built before Phase 0 exits.
   - Try to show that Bell and Milam in parallel needs something Phase 1 does not produce.
6. **The farm definition** (section 6). Test the storage recommendation (county-scoped writes into
   shared stores) against:
   - the atoms lease code;
   - `atom_did` identity on merge (P-193);
   - row versions on `parcel_record_cell`;
   - what happens when two counties publish at once.
   Say what breaks first.
7. **The speed measures** (section 10). Can each be captured by a hook or a job record, or only by
   a person remembering? ENFORCEMENT's three-question gate applies.
8. **Cotality** (section 11 and 4.7). Is anything in the farm design lawful only if the commercial
   agreement says something it may not? Is the bulk-call refusal specified tightly enough to
   build?
9. **What is missing.** Read the sessions and cards from 2026-09-13 to 2026-09-16 (the list is in
   the scope's `related` block and in `_inbox/2026-09-16_pickup_list_planned_not_done.md`). Name
   anything planned in those days that neither the scope nor the in-flight lanes (P-243, P-244a,
   P-244b, P-246) cover.
10. **Burnet, Bell and Milam as chosen.** Read `_catalog/tx_source_truth.json` and
    `_catalog/texas_roster_v1.json`.
    - Reconcile Burnet's 50,138 ingest features against 59,785 parcels.
    - Reconcile Bell's August atom-pipeline work against "geometry ingest not run".
    - Say whether Temple (zoned, no layer found) makes Bell a poor parallel partner.

### What you must not do

- Build anything, card a row, or edit the scope. The overseer amends it from your review.
- Soften a verdict.
- Read a working tree.
- Accept a status line as evidence.
- Spawn a sub-agent.
- Query the atoms store.
- Discard or fast-forward over the unmerged wave 6 commits on your branch.

### Close

**Artifacts.** Write two files, both in the 2026-09-14 shape:

- `_inbox/<date>_scaleup_teardown_review.md`: theses, verdicts, evidence, what survives, and the
  wave 6 branch contents.
- `_inbox/<date>_scaleup-teardown_close.json`, carrying:
  - `planRows` `["P-198", "P-201", "P-204"]`;
  - `status` `closed`;
  - the list of claims that did not survive;
  - `leave_behind`.

**Committing.**

- Commit both to your seat branch with explicit pathspecs, each git verb in its own call, and
  push the branch.
- **Name the commit SHA in your reply** so the overseer can land the two files on main. Artifacts
  stranded in a worktree have been lost six times this month.
- If you cannot push, say so and name the paths.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-16_scaleup-teardown_cp1.json
  CP2: _inbox/2026-09-16_scaleup-teardown_cp2.json
  CLOSE: _inbox/2026-09-16_scaleup-teardown_close.json
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
    "lane": "scaleup-teardown",
    "planRows": ["P-198", "P-201", "P-204"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
