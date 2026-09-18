CANON-PREAMBLE v49001500
- COTALITY REST IS DEAD, THE VENDOR IS RE-ENGAGED FOR THE FARM, AND WE SHIP WITHOUT IT (operator 2026-09-16, `_decisions/2026-09-16_texas_scaleup_sequence_and_four_rulings.md`; operator 2026-09-17, OPS-16 A-212): when code hits Cotality REST (502/OAuth/fallthrough), re-route to county-gis/public-record and NEVER rotate the credential. The MCP eval channel is live for internal evaluation only. No vendor-sourced value reaches a customer until the commercial agreement is read, and the factory never bulk-calls the vendor. **The vendor is about two weeks out as of 2026-09-17 and NOTHING waits on it:** Cotality is struck from the Phase 0 exit criteria, and every rail that wanted it ships as a DECLARED absence — `unaccounted` at rest, labelled where a customer reads it, never fabricated, never a silent gap, and never relabelled `absent-verified` to clear a gate. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY IS THE ONLY WRITER PATH (OPS-19) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker); own repo `hauska-factory`, own Neon store; every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`); OPTION A ruled (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): no new county is written on the old shape and old-shape writes ended permanently 2026-08-27. Every lane has its own registered worktree; never build in another lane's checkout. Row-level status lives in `_catalog/program_preambles/OPS-19.md` and `_state/property/STATE.md`, never here.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- MOST-CURRENT SOURCE WINS (operator 2026-09-11) — for setbacks and every dimensional rule, in every city and county, the source with the most recent effective date supplies the value; tier breaks ties only on equal or unreadable dates; dates are read at source (ordinance effective date, ArcGIS `editingInfo.lastEditDate`), never assumed from source kind; an unreadable date produces a conflict row with both values, never a silent pick. Supersedes tier-first ranking in LDT `authoritativeSetbackSource.ts` and layer-23-first in hauska-map. `_decisions/2026-09-11_setback_source_most_current_wins.md`.
- ENVELOPE DRAWN, FIGURE REFUSED (operator 2026-09-11) — Ruling B reversed for the polygon only: map and MCP draw block draw the modelled buildable envelope from the same `place/buildable-envelope` call with its disclosure wherever a district and setback table exist; buildable area and percent stay refused until an envelope atom backs them. Entitlement gate unchanged. `_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`.
- THE LEDGER IS THE SERVING PATH, ATOMS ARE CANONICAL (operator 2026-09-11) — node = identity, atom = one claim from one authority at one time, edge = an atom whose value is a node; a cell is accounting (state, atom reference, provenance, cached rendering keyed to atom version and vocabulary version), never a copied value; one reader in `hauska-engine/services/retrieval-api` walks gated cells and dereferences atoms and every surface and the Hauska MCP catalog consume it; unslated rails refuse, never fall to legacy; one writer mints atom + pointer + rendering in one transaction; one vocabulary module in the atom-contract package. Never add a read path, a vocabulary copy, or a value-holding cell. `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`, ADR-031 amendment 2026-09-11, OPS-23 §0.
- DO TOOLING IS CONFIGURED FLEET-WIDE, BUT DOCTL AUTH IS PER-SESSION (operator 2026-09-17, corrected 2026-09-17 per OPS-25 D-11's close) — the `do-apps`/`do-droplets` MCP servers are configured in the global Cursor config on the fleet machine with an agent token scoped to Droplets and Apps only (no account, database, or networking access), and that MCP config travels with any lane using this machine's Cursor. `doctl`'s own CLI auth does NOT reliably carry over to every lane's session (found unauthenticated in D-11's environment) — a lane needing `doctl` specifically, not just the MCP tools, should confirm with `doctl account get` and run `doctl auth init` itself if needed, rather than assume it is live. Do not ask the operator to reconfigure the MCP servers or token; do check `doctl` auth per-session.
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

PLAN-ROW: P-333 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-factory
FAN-DEPTH: 0
This lane launches NO sub-agents. Do the work yourself. The commit gate refuses a close that declares any (A-181).

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p333-join-miss-scoped-guard --seat <your-seat-id> --plan-row P-333 --dispatch _dispatches/2026-09-18_p333-join-miss-scoped-guard_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p333-join-miss-scoped-guard --seat <your-seat-id>

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

## Seven laws

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
7. **The county verdict is a grade, not the serve switch** (operator ruling 2026-09-16, A-193,
   `_decisions/2026-09-16_county_verdict_is_not_the_serve_switch.md`, build row P-297).
   - `parcel_gate_verdict` answers "is this rail complete enough in this county to publish".
     The publish gate reads it; nothing else may use it to choose what a parcel shows.
   - On a slated rail each parcel is served from its OWN cell: an earned value as that value; an
     absence as the stated absence with its reason; `refused`, `unaccounted`, a missing cell or an
     unreadable store as a declared refusal with its reason. Never the legacy or baked value.
   - Until P-297 is live, the serve path still switches on the county verdict (LDT
     `resolveAllowlistState`, retrieval-api `parcel-record-reader.ts`). So **any write that puts
     an unaccounted cell on a slated rail turns that whole county's ledger values back to the
     bake**. A lane whose writer can do that states it in CP1 and does not apply before P-297.
   - An instrument never reads "slated and `pass`" as "served from the ledger"; it reads the cell.

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
- **A county's served keys and its published parcel index can be in DIFFERENT KEYSPACES, and the
  publish retirement step does not check.** On 2026-09-17 Williamson's production publish (run
  `7b2540c8`) retired all 602,050 served tier-1 rows for 48491, including 319,480 numeric rows
  that were live, because the index is R-keyed and the served nodes are numeric-keyed. P-306 had
  fixed the coverage FLOOR for exactly this split, so the floor passed at retention 1.1666 while
  the writer emptied the county. **No production publish of 48491 until P-319 ships**, and any
  county whose served and indexed keys differ carries the same hazard. A control that measures one
  thing does not protect the thing beside it.
- **No writer in this program refuses on blast radius yet (P-320).** Two counties have now been
  emptied by presence-shaped comparisons: Bastrop 48021 at 92.5 percent on 2026-09-15 and
  Williamson 48491 at 100 percent on 2026-09-17, through different writers. Until P-320 lands,
  treat every destructive status write as unguarded and measure its population before running it.
- **Cotality is out of the Phase 0 exit (A-212, operator 2026-09-17).** The vendor is about two
  weeks out. `agValuation` in Bastrop, Caldwell, Hays and McLennan (about 318,000 cells) stays
  honestly `unaccounted` and ships as a DECLARED absence that a customer can read (P-322). P-267's
  not-applicable sweep must never run: it would write the false state across all of them. P-267
  and P-283 are deferred to Phase 1.

## What this program absorbs

OPS-21's unfinished writers (stage 6), OPS-23's serving seams (stages 10 and 11), P-124's bake
(stages 9 and 10), P-156 (stage 0), P-181 (stages 2 and 9), P-182 (stage 0), P-184 (stage 4).
Each absorbed row keeps its number and its close history; OPS-24 rows name what they absorb.


## Mission — P-333: a join miss is an absence only where the keys could have matched

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` only and open one PR, branched
from current `origin/main` with the SHA declared (`0f4558a4` at compile, carrying #175 P-325, #177
P-327 and #178 P-335). You do not merge, deploy, apply or write any store; the integration seat does
all four. Any doc_repo change is handed back as a diff in your close.

### The rulings

- `_decisions/2026-09-05_cad_join_miss_becomes_absent_verified.md`: a prop_id with no `cad_property`
  row for its county in ANY tax year the ingest query observes (`CAD_ROWS_SQL`, `DISTINCT ON (prop_id)`
  across every tax year) is a confirmed absence and writes `absent-verified`.
- `_decisions/2026-09-18_join_miss_unaccounted_until_scoped_guard.md` (A-214) suspended that ruling
  because it is only true where the served ids and the roll's ids are one numbering system. Its
  reversal criterion is this row, word for word: a join miss writes `absent-verified` only in a
  population the guard has measured as key-compatible with the roll (an id-overlap measurement with a
  declared threshold, per county and keyspace), and `unaccounted` everywhere else, verified by
  violation in both directions. When this ships, A-214 is superseded.

### What the code does today (read at `0f4558a4`)

`src/jobs/parcel-record-fill.mjs`: the vendored engine's `applyCadJoinMiss` stamps `absent-verified`
on 13 CAD scalars on a miss; `neutralizeCadJoinMissAbsences` (line ~1452, called inside
`instantiateAndIngest` at ~1722, after `completeJoinMissCompanionsOntoRecords` and before the D1
derivations) returns every cell carrying `isCadJoinMissBasis` to `unaccounted` in every county, and the
run reports `joinMissUnresolved` by county and rail. A matched row's genuine null keeps writing
`absent-verified` with its taxYear; that direction must not change.

The rule you reuse already exists: `src/lib/id-keyspace-overlap.mjs` (P-327) holds the four bases
(`no-served-rows`, `no-own-keyspace-index`, `no-id-overlap`, `own-keyspace-index`) and its header names
P-333 as its second consumer. Import it; do not write a second copy (DEV_PROCESS 2.4, the CTRL-1
shape). The keyspace labels come from `src/lib/publish-coverage-floor.mjs` (`keyspaceSql`), as the
retirement gate imports them.

**What the shared classifier does not give you:** `own-keyspace-index` means at least ONE served id is
held. That is enough for the retirement gate to know a set difference is measurable; it is not enough
to call a miss an absence. This row asks for a declared threshold on the overlap SHARE. Declare it once,
as a named constant with its basis, and propose its value from the measured shares (P-327's census,
`_inbox/2026-09-18_p327-retirement-gate-roll_census.json`, read staging: Bastrop 48021 numeric 77,799
of 77,799 held; Caldwell 48055 48,382 of 48,649). The seat takes the value to the operator before merge;
do not bury it in a default.

### Hays and Williamson join through crosswalks, and a bare-id overlap lies about Hays

`loadLandingAndCad` joins the two gate-blocked counties (`SEED_BLOCKED_FIPS` = 48209, 48491 in
`src/lib/cad-txgio-alias-counts.mjs`) only through published identifiers: Hays through
`loadAccountCrosswalk` (`geo_id = property_number`, corroborated by the `quick_ref_id` stem), Williamson
since P-335 (#178) through the county's WCAD pair (binds 282,219 of 282,569; 350 unreached,
`_inbox/2026-09-18_p335-williamson-crosswalk_close.json`). In both, a node with no bind gets NO row, so
its miss is an IDENTIFIER miss (P-335's F-F), never a roll that was found empty. Those misses stay
`unaccounted`, whatever any overlap reads.

**The trap, measured.** Hays' served node ids are parcel-map ids and its roll's `prop_id` are appraisal
account ids: two numbering systems that collide on bare digits (`_decisions/2026-09-13_hays_node_identity_is_the_parcel_map_id.md`:
`48209:97658` is one lot on the map and a different property on the roll). P-327's census reads Hays
numeric as 172,377 of 173,050 served ids "present" by bare equality. That figure is a collision count,
not key compatibility. So:

- the overlap is measured on the key the join actually uses, never on the served label;
- this row restores absences only in counties whose join is the bare `CAD_ROWS_SQL` match, and only
  after the measurement passes; in a crosswalk county it restores none;
- if you find a population inside a crosswalk county that you believe is a measured absence, report it
  with its evidence and do not restore it; that is a separate ruling.

### What to build

1. Per county and keyspace, the job measures the overlap before it writes (one query per county per
   run, recorded on the run record with its snapshot and the threshold), using the shared classifier.
2. A join miss in a population measured key-compatible (basis `own-keyspace-index` AND share at or
   above the threshold) writes `absent-verified` whose basis names the overlap figure, the keyspace,
   the threshold and the tax years observed. Anywhere else, including a population never measured or
   a measurement that failed, it stays `unaccounted` and the run counts it by reason.
3. The P-268 companion completion and the D1 derivations stay correctly ordered for both outcomes;
   state what `acreageSqft` does for a restored absence.
4. The upsert guard refuses only `unaccounted` over a stored non-`unaccounted` cell, so a restored
   absence lands only where the stored cell is `unaccounted`; say what the dry run shows it would move.

### Verify by violation

Pre-register your falsifiers before running. At minimum: the Williamson shape (served ids that share
no key with the roll) writes ZERO absences; a key-compatible fixture with a genuinely retired prop_id
writes exactly one; a keyspace just under the threshold writes none; an unmeasured population writes
none; a failed overlap query refuses rather than defaulting; a Williamson node the pair does not reach
writes none; a Hays-shaped fixture (served ids and roll ids that collide on bare digits but name
different parcels, joined through the crosswalk) writes none even though its bare overlap is high. Show each test failing on the pre-change code where it should. Then a read-only dry run
per county (48021, 48055, 48209, 48309, 48453, 48491) under the heavy-scan lease on the DIRECT host
(P-335: the pooler cancels county-wide joins with 57014), naming for each: the overlap per keyspace,
the misses that would restore, the misses that stay `unaccounted` and why, beside an independent count
of served ids with no `cad_property` row in any tax year taken by a separate query, not by the writer.

### The three-question gate

Answer in your close: what executes the guard, what triggers it, what fails when a key-incompatible
population reaches `absent-verified`, and what bypasses it (a raw write, another writer on the same
rails, the engine's own join-miss signal changing).

### Constraints

- No store writes, no deploys, no merges, no applies. `src/lib/parcel-record-engine` is pinned
  (`ENGINE_PIN.json`); the fix is job-side, like P-325's.
- The record-fill image also rebuilds the hourly gate scheduler (`cloudbuild.parcel-record-fill.yaml`);
  the seat deploys it under the gate-scheduler procedure, combined with P-352's change.
- Factory merge order in this wave (the seat serializes): yours first, then P-334/P-329/P-330, then
  P-352 and P-361, then P-300 and P-338's writer half, then P-336's. P-352 edits the same file (the
  situsState ladder and instantiation); keep your change inside the join path and name any shared
  function.

### Close

Declare: the start commit and PR, the threshold proposed and its measured basis, the per-county dry-run
table beside the independent counts, the falsifiers with both directions shown, the three-question gate
answers, what supersedes A-214 when this merges, and `leave_behind`.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-18_p333-join-miss-scoped-guard_cp1.json
  CP2: _inbox/2026-09-18_p333-join-miss-scoped-guard_cp2.json
  CLOSE: _inbox/2026-09-18_p333-join-miss-scoped-guard_close.json
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
    "lane": "p333-join-miss-scoped-guard",
    "planRows": ["P-333"],
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
