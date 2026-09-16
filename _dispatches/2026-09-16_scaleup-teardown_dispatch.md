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

PLAN-ROW: P-198, P-201, P-249 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: doc_repo
FAN-DEPTH: 0
This lane launches NO sub-agents. Do the work yourself. The commit gate refuses a close that declares any (A-181).

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
that measures it, at a cost the kill test can read. Not "acquire everything". The sequence is
ruled (operator 2026-09-16, `_decisions/2026-09-16_texas_scaleup_sequence_and_four_rulings.md`,
scope `_inbox/2026-09-16_texas_scaleup_program_scope.md`):

1. **Phase 0:** the six onboarded counties complete and verified.
2. **Phase 1:** Burnet with its cities as the first county through the farm, with the farm built
   and refined during that run.
3. **Phase 2:** Bell and Milam through the farm in parallel.
4. **Then** the rest of Texas.

## Six laws

1. **The customer predicate is the definition of done.** `scripts/surface-probe.mjs` with a
   real address in the county is the finish line for every stage, not stage 12's private
   check. A stage that cannot be traced to a change in what the probe reads is not on this
   program. ARMED 2026-09-14 on the enforcement side: `probe-close-gate.mjs` gates every
   OPS-24 row and prints the predicate debt on each close until `surface-probe.mjs` carries
   the stage's row (P-197); a close with neither an artifact nor a declared
   `probe.notApplicable` (read-only reviews only) is refused.
2. **The gate is fixed before anything trusts it.**
   - **Fixed:** P-195 closed the ZERO-ROW case. A county with no cells refuses
     (`RAIL_NEVER_FILLED`, `BAKE_POPULATION_UNMEASURED`).
   - **Still open (A-179):** the ZERO-EARNED case. `evaluatePublishGate` reads a county whose
     cells exist but are all `unaccounted` as every rail "declared ahead" and passes it, and
     that is exactly what a freshly instantiated county looks like.
   - **Therefore P-201 lands, proven by violation on an instantiated, unfilled county, before
     any new county's verdict is trusted.**
3. **One county at a time until the farm is proven** (rewritten 2026-09-16 to the operator's
   sequence).
   - Burnet is the first county through the farm. The farm's machinery (manifest, pre-bake
     audit, completeness check, stage meter, merge gate) is built and refined during that run,
     and every defect Burnet finds is fixed upstream, never in the county.
   - Burnet runs on the shared stores with full stage telemetry (A-180).
   - Bell and Milam then run in parallel. Whether they need isolated stores is decided from
     Burnet's measured stage records, not in advance.
   - The fleet has learned twice that blockers surface serially; one county finds them faster
     than a wave does.
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

## Out of scope until after Phase 2 (A-177)

The road-node pass: a TIGER cross-check, a street-name dictionary, classification rules, and the
`roads` and `edgeSignal` ledger rails. Study road data only where it blocks envelope or footprint
rendering, and say exactly where.

## What this program absorbs

OPS-21's unfinished writers (stage 6), OPS-23's serving seams (stages 10 and 11), P-124's bake
(stages 9 and 10), P-156 (stage 0), P-181 (stages 2 and 9), P-182 (stage 0), P-184 (stage 4).
Each absorbed row keeps its number and its close history; OPS-24 rows name what they absorb.


## Mission — FINAL TEARDOWN of the Texas scale-up scope, rev 3: break it before a single build row is allocated

You are a fresh planner. You did not write this scope and you have no stake in it. **You launch no
sub-agents (FAN-DEPTH 0); do all the work yourself.** You write no product code and change no
store. Your product is a review that tries to make the plan fail, says exactly where it holds,
and names what the plan does not cover at all.

Exit-bounded verification: every command terminates on its own; wrap anything that can hang in
`timeout`; never leave a watch, a tail or a poll running.

### Your seat and first commands

Seat `dispatch-planner`, worktree `P:/seat-worktrees/dispatch-planner/doc_repo`, branch
`seat/dispatch-planner`.

```
git -C P:/seat-worktrees/dispatch-planner/doc_repo fetch origin
git -C P:/seat-worktrees/dispatch-planner/doc_repo merge --ff-only origin/main
git -C P:/seat-worktrees/dispatch-planner/doc_repo log --oneline -1
```

**If the fast-forward fails, STOP and report. Do not reset, rebase or discard anything.** Declare
the commit you are on.

**Product repos:** read at `origin/main` only, with `git -C P:/<repo> show` and `git grep`.

**Stores:** read-only only.

- **Factory store:** `FACTORY_DATABASE_URL_RO`, with `default_transaction_read_only=on`.
- **Atoms store:** `ATOMS_DATABASE_URL` only with
  `PGOPTIONS='-c default_transaction_read_only=on -c statement_timeout=240000'`, EXPLAIN first,
  and index-bounded predicates only. The indexes are listed in the research-wave dispatch.
- **Never print a DSN.**

### What you read first, all of it

- `_inbox/2026-09-16_texas_scaleup_program_scope.md`: the plan under attack, rev 3.
- `90_operations/OPS-24_county_to_serving_program.md` rev 3 and
  `_catalog/program_preambles/OPS-24.md`.
- `_decisions/2026-09-16_texas_scaleup_sequence_and_four_rulings.md`, with its addenda.
- OPS-16 amendments A-176 to A-182 and rows P-186 to P-250.
- `_inbox/2026-09-16_scaleup_research_wave_report.md` and the five lane reports it links.
- `_inbox/2026-09-16_farm_architecture_draft.md` and
  `_inbox/2026-09-16_scaleup-ld_farm_architecture_report.md`.
- **The blocker register, both halves:**
  - `_inbox/2026-09-16_scaleup-lc_blocker_register.json` (361 instances);
  - `_inbox/2026-09-16_scaleup-lc2_blocker_register_addendum.json` (125 new);
  - the class table, the delta, the smooth path and the unfixed list.
- `_inbox/2026-09-16_scaleup-le_card_spec.md` and the fixture list.
- `scripts/six-county-completeness.mjs`, `scripts/ledger-truth.mjs` and
  `scripts/envelope-draw-gap.mjs`.

### The theses you attack, in this order

For every thesis, give:

- the claim as the scope states it;
- the file and SHA, or the query and timestamp, you tested it against;
- **a second mechanism** that would produce the same observation;
- a verdict: **HOLDS**, **HOLDS WITH A NAMED CONDITION**, or **DOES NOT SURVIVE**.

**T1. Phase 0's exit cannot pass while a customer still sees something wrong.**
- Attack the four-part exit (scope section 5).
- Find a customer-visible defect from the card spec, the L-E defect list or items X1 to X11 that
  `six-county-completeness.mjs` exiting 0 would not catch.
- Attack its policy table: `deferred` for roads and edgeSignal, `no-source` for the P-203 eight.
- Say what the exit must add.

**T2. P-201 closes the zero-earned gate hole.**
- Read `evaluatePublishGate` and `evaluateRailGate` at factory `origin/main`.
- Write the exact violation test: an instantiated, unfilled county must refuse.
- Say whether P-201's three-state split refuses that county without falsely refusing a
  county-scoped rail such as `maxImperviousCoverPct`.

**T3. P-249 is the shortest path to an "ok" envelope, and it is safe.**
- Re-derive the 131,357 figure, or name the query it depends on.
- Test the `depthWarmPromoted` wiring against LDT's wire type and hauska-map's use of it.
- Say what the 123,706 unexplained zeros become when the live derive fails its own geometry
  gates.
- Test the "figure only when verified" ruling against every surface that prints a figure,
  including PDFs.
- Specify the staging proof that would have caught the P-216 outage.

**T4. The setback reconciliation (S0 to S8) can reach "everywhere that should have setbacks has
them".**
- 219,472 parcels: 125,212 district misses and 94,260 in 54 no-table cities.
- Classify a sample of the 54 cities as zoned-with-layer, zoned-without-layer or unzoned from
  public sources, and say what the full classification will take in work, not time.
- Test whether S1's flip from `absent-verified` to `unaccounted` is safe on each surface, with the
  file and line of what each renders.

**T5. Burnet on the shared stores is safe and measurable.**
- Test against L-D's capacity facts, the 2026-08-28 read-timeout incident, and the heavy-scan
  rule.
- List the telemetry that must exist before Burnet starts, for "Bell and Milam beat Burnet" to be
  a query.
- Test the storage decision against the blocker register's contention class (C17).

**T6. The blocker register can serve as the pre-bake audit's checklist.**
- For every class, C1 to C18 and every NEW candidate in the addendum, name the farm stage and
  the executable check that catches it.
- **List every class with no executable check.** A class caught only by "the planner reads it"
  counts as not caught.

**T7. The Phase 0 order has no hidden dependency or contention.**
- Map every Phase 0 item to its repo and its dependencies.
- legacy-design-tools carries many rows; find the contention and circularities.
- State the dependency-ordered sequence the plan actually implies, with no dates or durations.

**T8. Phase 0 fixes every customer-experience defect found.**
- Map D1 to D16 and X1 to X11 to owning rows.
- **List every defect no row owns.**

**T9. Security and operational debts do not block Burnet.** Test each and say whether it must be
cleared before Burnet runs:
- ADD-084, the `PRODUCTION_NEONDB_URL` value exposed 2026-09-04 and still unrotated (the secret
  is at version 1);
- the staging secret rotation gap (A-181);
- the six quarantined branches;
- the workstation TLS setting (A-181);
- the FAN-DEPTH gate's named bypasses;
- the six duplicate amendment ids;
- the two closes held off main (A-176).

**T10. What is missing entirely.** Name anything completing the six counties, building the farm,
or running Burnet, Bell and Milam requires that no row, item or decision in the scope owns.
**Exhaust this; do not stop at the first gap.**

### What you must not do

- Build anything, card a row, or edit the scope. The overseer amends it from your review.
- Soften a verdict.
- Accept a status line, a close, or the scope's own wording as evidence.
- Launch any sub-agent.
- Write to any store or repo other than your own seat branch's `_inbox/`.

### Close

**Artifacts.**

- `_inbox/<date>_scaleup_final_teardown_review.md`: the ten theses with verdicts and evidence;
  a consolidated list of what does not survive; the missing-items list; and a ranked "must
  change before any build row" list.
- `_inbox/<date>_scaleup-teardown_close.json`, carrying:
  - `planRows` `["P-198", "P-201", "P-249"]`;
  - `status`;
  - `probe` `{"notApplicable": "read-only review lane"}`;
  - `subAgents` `{"spawned": 0, "maxDepth": 0}`;
  - `falsifier`;
  - `contradicted`;
  - `leave_behind`.

**Falsifiers to pre-register.**

1. At least one thesis does not survive. If all ten hold, show the strongest attack you made on
   each.
2. T6 names at least one class with no executable check, or shows the check for every one.
3. Every verdict cites a file with a SHA, or a query with a timestamp.

**Committing.** Commit to your seat branch with explicit pathspecs, each git verb in its own call,
and push. **Your reply lists every path and the pushed commit SHA.**

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
    "planRows": ["P-198", "P-201", "P-249"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "...",
    "subAgents": { "spawned": <int>, "maxDepth": <int> }
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
  subAgents is required and honest: spawned counts every sub-agent this lane launched, maxDepth
  is the deepest level reached (0 when none), and neither may exceed FAN-DEPTH 0.
