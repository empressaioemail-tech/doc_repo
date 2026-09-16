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

PLAN-ROW: P-252 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-factory
FAN-DEPTH: 0
This lane launches NO sub-agents. Do the work yourself. The commit gate refuses a close that declares any (A-181).

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p252-zero-earned-refusal --seat <your-seat-id> --plan-row P-252 --dispatch _dispatches/2026-09-16_p252-zero-earned-refusal_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p252-zero-earned-refusal --seat <your-seat-id>

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
   `probe.notApplicable` (read-only reviews only) is refused. **A store-reading instrument is
   never the customer predicate** (A-183): the factory-store and atoms-store instruments were
   green through the whole 2026-09-15 map incident. The probe's OPS-24 legs are P-254.
2. **The gate is fixed before anything trusts it. Three things are called "the gate"; know
   which one you are touching (A-183).**
   - **The publish refusal** is `requirePreBakeReadiness` (factory
     `src/lib/publish-readiness-gate.mjs`, called by the publish job): a population check, then
     `evaluatePreBakeReadiness` over the publish-floor rails' verdicts.
   - **The rail verdicts** are `evaluateRailGate`, written hourly to `parcel_gate_verdict` by
     `publish-gate-sched.mjs` and labelled by P-201's `classifyExclusion`.
   - **`evaluatePublishGate` and `assertPublishableCounty` have no production caller.** Do not
     cite them as a control.
   - **Fixed:** P-195 closed the ZERO-ROW case (`RAIL_NEVER_FILLED`,
     `BAKE_POPULATION_UNMEASURED`).
   - **Still open, measured by violation 2026-09-16 after P-201 merged:** the ZERO-EARNED case.
     A county whose 65 rails all hold `unaccounted` cells gets `excluded-not-applicable` on
     every rail (basis `LIVE_ELSEWHERE`), and the pre-bake rail check clears it because it tests
     only `verdict === "refuse"`. **P-252 closes it, proven by a checked-in fixture that must
     REFUSE, before any new county's verdict is trusted.**
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
   can fire as a kill, not a slogan. **As of 2026-09-16 nothing records either** (no column,
   table or writer at factory `9171279`); P-284 builds it and Burnet does not start without it.
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
rendering, and say exactly where. **The measurement of "blocks rendering" is P-264's per-city
residual** (the verification re-derive runs in Phase 0 without the road-name dictionary);
a city whose residual is dominated by road failures comes back to the operator for a ruling.

## The Phase 0 exit (scope rev 4, section 5)

One definition, all legs at once: the ledger leg (`six-county-completeness.mjs`, repaired by
P-253), the customer leg (`surface-probe.mjs` over the 39-bucket fixture list, P-254), the
coverage leg (P-210), the road residual (P-264), and the operator's walk. **Burnet's run waits
on it, and the long pole is the setback acquisition campaign (P-258), not the gate rows.** The
farm machinery builds in parallel.

## Traps the final teardown found (A-183); read before touching these surfaces

- The depth-warm wire field is `depthWarmPromotion === "depth-warm-promoted-v1"` (with a
  `sourceCitation` fallback), not `depthWarmPromoted`. Four predicates read this fact in three
  repos; a change to one carries a divergence test against the others.
- `unaccounted` does not refuse on every surface. LDT's dollar rails keep the legacy value and
  `valueBasis` defaults a label (P-269). A write that flips cells to `unaccounted` names its rail
  allowlist.
- The 2026-09-15 blank map was a stale browser tab after a rollback, not a one-branch server
  regression (A-157). A staging proof records the serving build by asset existence, never by
  `Age:`, and measures from a fresh browser context.
- A buildable-area figure appears only when a VERIFIED envelope atom backs it (A-180). The MCP
  payload and the PDF do not enforce that today (P-249, P-261).
- The doc_repo commit gates do not fire in a seat worktree or on a merge until P-280 lands.
  Declare `subAgents` and the probe honestly anyway; the integration seat re-grades on landing.
- Bell already serves from the July bake (165,574 rows). It is a migration county (P-291).

## What this program absorbs

OPS-21's unfinished writers (stage 6), OPS-23's serving seams (stages 10 and 11), P-124's bake
(stages 9 and 10), P-156 (stage 0), P-181 (stages 2 and 9), P-182 (stage 0), P-184 (stage 4).
Each absorbed row keeps its number and its close history; OPS-24 rows name what they absorb.


## Mission — P-252: a county that earned nothing must not clear the gate

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` and open a PR. You do not
deploy and you do not run any job against a store that writes.

### Where you work

`hauska-factory`. Clone fresh from `origin/main` into a new directory under `P:/tmp/`, cut
`fix/p252-zero-earned-refusal`, and declare the commit you started from before you write
anything. Another lane (P-284, stage and cost telemetry) may be working in this repo at the same
time. It touches migrations and the job runner's record-writing, not the gate files below; do
not touch its files, and rebase rather than merge if both land.

### The defect, measured twice by violation on 2026-09-16

At `origin/main` `9171279` (P-201 merged as PR #156), an instantiated county whose 65 rails all
hold `unaccounted` cells:

- `evaluateRailGate` (`src/lib/parcel-record-engine/publish-gate.js`) takes the "no earned cell"
  branch, sees `cells.length > 0`, and returns `ok: true` with the rail declared ahead;
- `toGateVerdictKind` (`src/jobs/publish-gate-sched.mjs`) hands that to `classifyExclusion`
  (`src/lib/gate-exclusion-classifier.mjs`), which returns `excluded-not-applicable` with basis
  `LIVE_ELSEWHERE` for every rail that is live somewhere in Texas: all 65 in the probe;
- `evaluatePreBakeReadiness` (`src/lib/publish-readiness-gate.mjs`), the rail half of the real
  publish refusal `requirePreBakeReadiness` (called by `src/jobs/bastrop-publish.mjs`), refuses
  only on a missing row or `verdict === "refuse"`, so every `excluded-*` value clears.

`evaluatePublishGate` and `assertPublishableCounty` have no production caller (one self-test in
`parcel-record-fill.mjs`).

The integration seat's probe, which you should reproduce as a checked-in test rather than trust:
three parcels, every rail's cells `{kind: "unaccounted"}`, an empty program-wide declared-ahead
set. Result: 65 of 65 `excluded-not-applicable`, pre-bake rail check cleared. Its controls
refused correctly: a rail with one earned and one unaccounted cell reads `refuse` and the
pre-bake check throws `RAIL_REFUSED`. The only thing that stops such a county from publishing
today is the population check, and that stops passing once a bake population exists.

### What to build

1. **The rail gate refuses a zero-earned live rail.** In the "no earned cell" branch: if the rail
   is live program-wide and any of this county's cells is `unaccounted`, return `ok: false` with
   `unaccountedCount` equal to those cells. A county whose cells for the rail are all explicit
   `not-applicable` (written with a reason, the way `maxImperviousCoverPct`'s out-of-scope sweep
   writes them outside Travis) stays an exclusion, and that is the only road to
   `excluded-not-applicable` for a live rail. Rails declared ahead program-wide keep P-201's
   mid-cutover and no-acquisition-path classes.
   - `test/gate-county-scoped-rail.test.mjs` must stay green. Read it first; it is the
     empirical proof of the county-scoped property.
   - **There are two copies of `evaluateRailGate`**: the factory's vendored
     `publish-gate.js` and hauska-engine's engine-core original (the factory calls a CLI;
     confirm which copy the scheduler actually executes before you edit). Change the one
     that runs, and add a divergence test that fails when the two disagree on your fixtures.
     If the executed copy is the engine's, stop and report: that is a different repo and a
     different lane.
2. **`classifyExclusion` cannot say `excluded-not-applicable` for a county whose cells are
   `unaccounted`.** The `LIVE_ELSEWHERE` basis alone is not a reason a rail does not apply.
3. **The pre-bake rail check is an allowlist.** `evaluatePreBakeReadiness` clears `pass` and
   an exclusion whose basis is the county's own `not-applicable` cells; everything else refuses
   with its verdict named.
4. **The uncalled gate.** Either wire `evaluatePublishGate` onto the publish path with a reason,
   or retire it with a test that fails if an exported gate has no production caller. Say which,
   and why.
5. **The fixture.** Check in the all-`unaccounted` county as a test that must REFUSE at the rail
   gate and at the pre-bake check, next to a county whose `maxImperviousCoverPct` cells are all
   `not-applicable` (must stay an exclusion) and a mixed rail (must refuse).

### Before any deploy: the dry run (you produce it; the integration seat decides)

Using the read-only factory credential only (`FACTORY_DATABASE_URL_RO`,
`default_transaction_read_only=on`), compute under the new logic, without writing:

- every (county, rail) verdict in the six counties that would change, old and new;
- every publish-floor rail (`PUBLISH_FLOOR_RAIL_KEYS`) that would then refuse a publish, per
  county;
- the serving consequence: the serve-side reader in legacy-design-tools treats `refuse` like a
  missing verdict and falls back to the legacy value for that rail. List which (county, rail)
  pairs would change serving path, and read the reader to confirm the rule before you state it.

Expected, and not a failure: `agValuation` refuses in Bastrop, Caldwell, Hays and McLennan;
`acreageSqft`, `landUseVintage` and `situsState` refuse outside Hays. If a publish-floor rail
would refuse in any of the six, say so in bold at the top of your close.

If the read-only credential is not in your environment, say so, mark the dry run UNMEASURED,
and do not substitute any other credential.

### Falsifiers, pre-register your answers first

1. The all-`unaccounted` fixture refuses at both layers. If it clears either, the row is not done.
2. The all-`not-applicable` `maxImperviousCoverPct` fixture stays an exclusion. If it refuses,
   you have broken the county-scoped property.
3. A rail with zero cells in a county still returns `RAIL_NEVER_FILLED` (P-195 unchanged).
4. The dry run's verdict changes are exactly the rails that are live elsewhere and unaccounted
   in that county. A change outside that set means the logic is wider than the claim.
5. The divergence test between the two `evaluateRailGate` copies fails when you edit one.

### Do not

- Deploy, run `publish-gate-sched` against a store, or write to any store.
- Fix any rail's data (agValuation, the derived rails): those are P-266 and P-267.
- Change `requireCountyPopulation`.
- Launch sub-agents.

### Close

Snapshot (repo, branch, start and end commits); every file touched; the PR number with every CI
check's literal conclusion string; the five falsifiers with evidence; the dry run tables, or
UNMEASURED with the reason; which `evaluateRailGate` copy runs and how you know. `status` is
`closed-partial` (a green PR is code-done, not customer-done; the integration seat merges,
deploys to staging and grades). `probe`: `{"notApplicable": "build lane, PR not deployed; the
integration seat grades on staging"}`. `subAgents`. `leave_behind`.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-16_p252-zero-earned-refusal_cp1.json
  CP2: _inbox/2026-09-16_p252-zero-earned-refusal_cp2.json
  CLOSE: _inbox/2026-09-16_p252-zero-earned-refusal_close.json
  These paths are relative to the doc_repo worktree the session RUNNING YOU is rooted in: for a
  lane spawned by the dispatch planner that is the planner's worktree; for the dispatch planner
  itself it is its own seat worktree (never P:/doc_repo, the integration seat's checkout). This
  dispatch was compiled in p:/doc_repo. Two lanes in each of waves 1 and 2 wrote
  into the property seat's worktree instead and their artifacts had to be found by hand.
  No notification arrives when a background command finishes: poll with a bounded loop and a
  timeout; a lane that ends its turn waiting for a wake-up stalls (two lanes did, wave 2).

CLOSE SKELETON (the fields the enforcement gate reads; spell them exactly, or the gate refuses
the commit rather than guessing what you meant):
  {
    "lane": "p252-zero-earned-refusal",
    "planRows": ["P-252"],
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
