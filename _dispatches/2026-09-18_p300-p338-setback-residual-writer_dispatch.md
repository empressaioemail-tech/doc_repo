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

PLAN-ROW: P-300, P-338 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-setback-corpus, hauska-factory
FAN-DEPTH: 0
This lane launches NO sub-agents. Do the work yourself. The commit gate refuses a close that declares any (A-181).

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p300-p338-setback-residual-writer --seat <your-seat-id> --plan-row P-300 --dispatch _dispatches/2026-09-18_p300-p338-setback-residual-writer_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p300-p338-setback-residual-writer --seat <your-seat-id>

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


## Mission — P-300 and P-338, writer half: every remaining setback cell says what is true about its city

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-setback-corpus` (default rows) and
`hauska-factory` (the setback writer and router), one PR per repo, each from current `origin/main` with
the SHA declared (factory `07a1215b` at recompile, 2026-09-18 22:40Z; first compiled at `0f4558a4`). You hand back the doc_repo ledger-policy diff in your
close; the seat commits it. You do not merge, publish the corpus, deploy, apply or write any store; the
integration seat does all of them. The surfaces (map, MCP, PDF) are a separate lane
(`_dispatches/2026-09-18_p338-refusal-surfaces_dispatch.md`) that reads the cells you write.

### The rulings

- **Ruling 6** (`_decisions/2026-09-18_phase0_closeout_rulings.md`): a district-miss parcel carries a
  declared refusal that names its district and its city and says to verify with the city. That is an
  accepted Phase 0 terminal state. Acquiring the missing rows is Phase 1 (P-346).
- **OT-10** (`_decisions/2026-09-17_setback_corpus_flag_state_and_default_line_rulings.md`): a table
  may carry one jurisdiction-default row, marked as such and never a district, applied only to that
  jurisdiction's parcels that have no district, always with the disclosure that a recorded plat or
  another ordinance may set a different line. Gholson (McLennan, 840 parcels, Sec. 3.01.002: 25 front,
  15 rear, 10 side, 25 corner street side) is the first case.
- **Ruling 5 as amended by A-224** (same file, "Ruling 5 amended"): the default serves only where the
  city's own ordinance sets one. Each of the 40 no-layer cities is classified at source into exactly
  one of three:
  - **(a) zoned, layer never acquired:** a declared refusal naming the city ("zoning district not
    acquired; verify with the city"). Accepted for Phase 0 like ruling 6; acquisition is P-364.
  - **(b) unzoned, the ordinance sets a city-wide line:** the default row with its plat disclosure.
  - **(c) unzoned, no city-wide line:** a checked absence naming what was read.
  Manor (Chapter 14, zoning map and PUD districts) and Lago Vista (Chapter 14, Table A by district) are
  zoned, measured 2026-09-18. They are 20,826 of the 48,829 parcels, and neither gets a default.

### The population (measured, `_inbox/2026-09-18_p255_census_regrade_RECORD.md`)

After P-256's apply, 58,339 parcels in the six counties carry `unaccounted` on all five setback rails.
P-326's classifier (`_inbox/2026-09-17_p326-setback-residual-composition_measurement.json`) splits
them into:

- **9,510 need a district row their city's table lacks.** That is 8,484 district misses in ruled
  cities, plus 1,026 Woodcreek parcels whose district is on file in a city with no table. By county:
  Hays 3,669, Williamson 2,292, Travis 1,743, Bastrop 1,295, Caldwell 402, McLennan 109. These take
  ruling 6's refusal.
- **48,829 are in 40 cities with no district on file.** 48,825 of those are because the city's zoning
  layer was never acquired. The byCity table in that measurement names all 40 with their counts
  (Lago Vista 12,745, Manor 8,081, Lacy-Lakeview 2,628, Wimberley 2,273, Bee Cave 2,261, ...,
  Gholson 840, ...). These take A-224's classification.

### What the writer does today (`src/jobs/parcel-setback-cells.mjs` at `0f4558a4`)

- `classifyRouterMiss` (~line 485) writes `unaccounted` with the reason `the setback table router found
  no district row for "<code>" in <table>`.
- `buildNoRuledTableCells` (~533) writes `unaccounted` naming the acquisition need.
- The P-256 gate releases only `unaccounted` cells and this job's own false absences (P-363 will widen
  it in parallel; see Constraints).

### What to build

1. **The city classification, at source, as data.** A committed table of the 40 cities. Each row
   gives the class (a, b or c), the ordinance section read and its URL, the date it was read, and for
   (b) the line's values with their section. The writer reads this table; it does not keep a second
   list. A city you cannot classify at source stays `unaccounted`, named, and is reported. It is never
   guessed into a class.
2. **Corpus (b) rows.** A jurisdiction-default row per class (b) city, marked as a default in the
   schema (not a district name the router could match), with per-value provenance and the plat
   disclosure. Bump the corpus version per its conventions. Say whether gate rule G7 or any other gate
   needs to learn the new row kind.
3. **The router.** A default row applies only to a parcel of that jurisdiction with **no district on
   file**. A parcel with a district code never falls through to the default, including a code that
   misses the table: that is ruling 6's case. Show the two cases apart.
4. **The cells.**
   - District miss (the 9,510): `refused`, with a reason naming the parcel's district code and its
     city and saying to verify with the city.
   - Class (a): `refused`, naming the city and saying the zoning district was not acquired and to
     verify with the city.
   - Class (b): the default values, with the disclosure in the cell's reason and basis.
   - Class (c): `absent-verified`, with a basis naming the ordinance read and that it sets no
     city-wide line.
   - The P-256 guard `assertNoFalseAbsence` must still hold: a class (c) absence carries what was
     checked, or it does not ship.
5. **The ledger policy (a doc_repo diff, handed back).** `scripts/six-county-completeness.mjs`
   accepts exactly two refusal classes on the setback rails. Ruling 6's district miss is coupled to
   P-346. A-224's zoning-not-acquired is coupled to P-364. Each is matched by its exact reason
   signature, not by "refused". The self-test gains cases showing each accepted and a differently
   worded refusal rejected.

### Verify by violation

Pre-register your falsifiers. Fixtures: a district-miss parcel writes the ruling 6 refusal naming its
code and city; a Manor-shaped parcel (class a) writes the class (a) refusal and never a default value;
a Gholson parcel (class b) writes 25/10/15/25 with the disclosure; a parcel with a district in a class
(b) city does NOT take the default; a class (c) parcel writes a checked absence with its basis; an
unclassified city stays `unaccounted`. Show each on the pre-change code where it should fail.

Then a read-only dry run per county under the heavy-scan lease on the direct host. Report counts per
outcome beside the seat's predictions: district-miss refusals 9,510; classes (a) + (b) + (c) + still
unaccounted = 48,829, with (b) exactly the class (b) cities' parcel counts (Gholson 840 if it is the
only one). A difference is a finding: explain it before you close.

### The three-question gate

Answer in your close: what executes the classification and the default, what triggers them, what fails
when a zoned city's parcel receives a default value or a district-miss parcel receives an unnamed
refusal, and what bypasses it (a hand UPDATE, a city added to the corpus without a classification row,
a zoning layer acquired later for a class (a) city).

### Constraints

- No store writes, no corpus publish, no deploys, no merges.
- Factory merge order this wave (the seat serializes): P-333 and P-334/P-329/P-330 are MERGED (main
  `07a1215b`); then P-352 (#181) and P-361 (#182), then P-363 (#187), then yours, then P-336's writer
  half. **Two open PRs touch the same writer as you:** P-363 (#187) changes the write gate (it
  releases older-corpus values), and P-354's factory half (#179) serves a future-dated rule row by
  ruling and writes adopted/effective dates into cells. Read both at their PR heads before you build,
  rebase onto whichever merges first, keep each release and each cell shape distinct, and say in your
  close how your refusals and defaults coexist with both.
- Williamson 48491 republishes only under P-350; dry-run it, never write it.

### Close

Declare: the start commits and PRs, the 40-city classification table with its sources, the corpus
version, the per-county dry-run counts beside the predictions, the ledger-policy diff, the falsifiers
with both directions shown, the three-question gate answers, and `leave_behind`.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-18_p300-p338-setback-residual-writer_cp1.json
  CP2: _inbox/2026-09-18_p300-p338-setback-residual-writer_cp2.json
  CLOSE: _inbox/2026-09-18_p300-p338-setback-residual-writer_close.json
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
    "lane": "p300-p338-setback-residual-writer",
    "planRows": ["P-300", "P-338"],
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
