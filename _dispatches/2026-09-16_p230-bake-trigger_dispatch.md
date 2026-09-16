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

PLAN-ROW: P-230 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools
FAN-DEPTH: 0
This lane launches NO sub-agents. Do the work yourself. The commit gate refuses a close that declares any (A-181).

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p230-bake-trigger --seat <your-seat-id> --plan-row P-230 --dispatch _dispatches/2026-09-16_p230-bake-trigger_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p230-bake-trigger --seat <your-seat-id>

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


## Mission — P-230: does the bake refresh on a cell write, or does nothing enqueue it

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

### Where you work

`legacy-design-tools`. No worktree exists yet for this lane. Clone fresh from `origin/main`,
cut your own branch, and declare the commit you started from before you write anything. A
concurrent lane (P-241, ETJ acquisition build) may still be in flight in this same repo,
scoped to `lib/cad-ingest/src/boundary/` and `lib/db/src/schema/` — do not touch either; this
row has no reason to.

### The defect, quoted from the row (A-153-era carding, do not weaken the framing)

"Cells are written, the gate sees them, and the customer surface serves a bake from before the
write. This has now fired on two independent rows and is the reason a close cannot be graded
on a gate verdict." Two real instances: **P-200** — after the Hays setback apply, `get_smart_site`
on the gold parcel returned `not-cut-over` with the identical `runId` and `bakedAt` as before
the apply. **P-211** — after a 107,544-cell envelope apply whose delta matched its dry-run
exactly, `get_smart_site` depth=node on `48209:100226` (a parcel independently confirmed
touched by direct SQL, `maxHeightFt = 25`) still read `maxHeightFtFact` and its siblings as
refused/not-cut-over with a `bakedAt` that **predates the apply**.

### Two hypotheses, do not assume the cheap one

"(a) the bake is scheduled and simply has not run for these parcels, in which case the gap is
latency and the fix is triggering or scheduling it; or (b) nothing re-bakes a parcel when its
cells change, in which case the gap is structural and a cell write must enqueue its parcel. Do
not assume (a) because it is cheaper." This is your actual job: discriminate, with a real read
of the bake's trigger code, not an inference from symptoms.

### What I traced this session, grounding you, not replacing your own read

Reviewing an unrelated PR (P-210, coverage-check endpoint) this session, I read the actual
`get_smart_site` call chain end to end: `get_smart_site` (smartsite-mcp) calls `POST /api/
property-explorer/v1/research/brief`, whose `assembleNodeBriefBody`
(`artifacts/api-server/src/routes/propertyExplorer.ts`) is gated by
`readBakedNodeFacetSnapshot` (`artifacts/api-server/src/routes/brokerageNodeFacets.ts`), whose
own query is `SELECT ... FROM place_layer_snapshots WHERE adapter_key IN (tier1, tier2) AND
place_key = 'node:{fips}:{propId}'`. **This confirms the row's framing: the serve reads a
BAKED, materialized table, not a live ledger cell — the open question is only whether and how
that table gets refreshed when the underlying cells change.** Separately, A-173 (2026-09-14)
names the writer of this exact table: `legacy-design-tools/artifacts/api-server/src/
nodeFacetBakeTier1ConformantCli.ts`, which reaches any environment only through
`hauska-factory`'s pinned `_LDT_SHA` — meaning the bake may run as a Factory-triggered job
rather than something this repo schedules on its own. Start there; do not assume the trigger
lives entirely in this repo without checking.

### Do not conflate this with the settled A-184 ruling

**A-184 (2026-09-16) already ruled on a related but DIFFERENT question**: whether counties
outside the six-county ledger (19 of them, per P-291, holding 5.14M Tier-1 bake rows with NO
ledger data at all) should keep serving bake-only answers. The operator ruled yes, with a
declared "not yet verified" disclosure. **That is not this row.** P-230 is about a county
WITH ledger writes — a real cell write landed, verified at the data layer — and the bake still
doesn't reflect it. Do not re-litigate A-184's scope question; this row is narrower and still
genuinely open: is there a working trigger that just hasn't fired yet for these two parcels, or
is the trigger itself missing.

### Predicate (quoted from the row, do not weaken it)

"The mechanism is named by reading the bake's trigger, a written cell demonstrably reaches
`get_smart_site` for a named parcel with a `bakedAt` LATER than the write, and any close that
claims a rail is served cites that read rather than a gate verdict."

### Falsifiers, pre-register your answers before you run anything

1. **Read the bake's trigger mechanism directly** — a cron, a Cloud Run job schedule, a queue
   consumer, a manual CLI invocation, or nothing at all. Name the exact file and mechanism.
2. **Reproduce hypothesis (a) or (b) live, don't infer it.** Pick one already-written, still-
   stale parcel (P-200's Hays gold parcel or P-211's `48209:100226`) and either (a) trigger
   whatever the real scheduling mechanism is and confirm the bake catches up, proving it's a
   latency gap and naming the real cadence, or (b) confirm nothing in the write path enqueues
   the parcel for a re-bake at all, proving it's structural.
3. **A fresh write, end to end.** Write (or find a way to safely trigger) a real cell change on
   a test parcel and time how long until `get_smart_site` reflects it with a `bakedAt` later
   than the write — or confirm it never does without manual intervention.
4. **Does this affect the six onboarded ledger counties specifically**, or only the broader
   19-county bake-only population A-184 already covers? This determines whether the fix is
   urgent for every close this program has graded so far, or narrower.

### Known traps

- Do not assume the fix is "just run the bake more often." If the mechanism is (b) — nothing
  enqueues a changed parcel — a faster schedule just narrows the window without closing the
  structural gap, and a full re-bake of the whole table on every schedule tick may be its own
  cost problem. Name which fix class actually applies before proposing a schedule change.
- `nodeFacetBakeTier1ConformantCli.ts` is reached "only through hauska-factory's pinned
  `_LDT_SHA`" per A-173 — if the trigger genuinely lives in hauska-factory (a job scheduling
  this CLI), say so and scope the fix there; do not force it into legacy-design-tools if the
  read doesn't support it.
- This row explicitly says "every close in this program graded on a gate verdict has been
  grading something the customer may not see." That includes P-201, P-206, P-242c, and
  everything else merged and deployed this session — if your read finds those are ALSO
  affected, say so plainly; that is exactly the kind of finding this row exists to surface.

### Do not

- Do not build the fix yet if the discriminator alone is a full session's work — naming the
  mechanism with real evidence is itself the close-worthy result this row asks for. If you have
  budget left after discriminating, propose the fix; do not feel obligated to ship it in the
  same pass.
- Do not touch `lib/cad-ingest/src/boundary/` or `lib/db/src/schema/` (P-241's scope).
- Do not deploy. Open the PR green (or file the finding, if no code changes) and hand it back.
- Do not spawn sub-agents.

### Close

State your snapshot (repo, branch, commit). Name the exact trigger mechanism (or its absence)
with a file citation. Paste the real timing/reproduction evidence from falsifier 2 and 3. State
plainly which hypothesis (a) or (b) is correct, or whether it's a mix. Declare `leave_behind`
explicitly, including whether this affects the six ledger counties' own closes retroactively.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-16_p230-bake-trigger_cp1.json
  CP2: _inbox/2026-09-16_p230-bake-trigger_cp2.json
  CLOSE: _inbox/2026-09-16_p230-bake-trigger_close.json
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
    "lane": "p230-bake-trigger",
    "planRows": ["P-230"],
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
