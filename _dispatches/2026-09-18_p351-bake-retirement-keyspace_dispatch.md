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

PLAN-ROW: P-351 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools, hauska-factory
FAN-DEPTH: 0
This lane launches NO sub-agents. Do the work yourself. The commit gate refuses a close that declares any (A-181).

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p351-bake-retirement-keyspace --seat <your-seat-id> --plan-row P-351 --dispatch _dispatches/2026-09-18_p351-bake-retirement-keyspace_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p351-bake-retirement-keyspace --seat <your-seat-id>

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


## Mission — P-351: the bake retires a parcel only when its own account is gone

You launch no sub-agents (FAN-DEPTH 0). You build in `legacy-design-tools` (the bake) and
`hauska-factory` (the bake pin), each from current `origin/main` with the SHA declared (LDT `25d1782f`,
factory `0f4558a4` at compile). You do not merge, deploy, bake, publish or write any store; the
integration seat does all of them. Any doc_repo change is handed back as a diff in your close.

No bake publish runs until this row lands (the handoff's standing hold): P-349's Hays bake and P-350's
Williamson republish both wait on it.

### Two retirement writers live inside the bake (P-327's finding)

P-327 (`_inbox/2026-09-18_p327-retirement-gate-roll_close.json`, `contradicted` and `leave_behind`)
grouped retired tier-1 rows by the authority string their writer stamped, and found two writers:

| Writer | Where (LDT at `25d1782f`) | Compares | Wrote |
|---|---|---|---|
| (a) the conformant arm | `artifacts/api-server/src/lib/nodeFacetBakeTier1Conformant.ts` `buildConformantTier1Payload` (~line 1347): `apn != null && cadPropConsulted && byPropId.get(apn) == null`, where `apn` is the node id's bare prop_id and `byPropId` is `cad_property` at the declared tax_year | the node's bare id against the roll's `prop_id` | 1,386 of Hays' 58,015 retired rows; 282,570 of Williamson's 602,050 |
| (b) the P-180 wave-6 account-keyed pass | `artifacts/api-server/src/nodeFacetBakeTier1ConformantCli.ts` (~line 412) `partitionAccountKeyedWork(work, txgioPropIds)`, then `buildAccountKeyedRetirementPayload` (`src/lib/accountKeyedWork.ts`) | work ids against the resolved PARCEL table (`txgio_parcel` for a gate-blocked county) | the other 56,629 (Hays) and 319,480 (Williamson) |

The factory's pre-bake gate (P-319, P-327, `requireRetirementGate` in `runBastropPublish`) can refuse
before the bake starts. It cannot reach (b), which runs inside the bake after promotion, and it is
bypassed by any bake run outside `runBastropPublish`.

### What the seat measured since (production, 2026-09-18)

- Hays' 56,629 `txgio_parcel`-authority retired rows are NOT served parcel keys: they are the hollow
  account-keyed nodes P-180 meant to retire. Writer (b) did its job in Hays.
- Hays' 1,385 `cad_property`-authority retired rows ARE served parcel keys. Those are writer (a)'s,
  and they are the population this row must settle one by one.
- Hays node ids are parcel-map ids, not accounts (`_decisions/2026-09-13_hays_node_identity_is_the_parcel_map_id.md`):
  the same bare number can name two different properties on the map and on the roll. The account is
  reached only through `geo_id = property_number` corroborated by the `quick_ref_id` stem. The bake's
  own comment near the `landUseRoll` fetch says "48209 and 48491 are clear on this join" (CAD-to-CAD
  on prop_id). That contradicts the ruling. Resolve it at source and say which is true.

### Williamson: the answer already exists

P-335's close (`_inbox/2026-09-18_p335-williamson-crosswalk_close.json`, `p351Answer`) worked it out
from the code and the counts: the served node's R id, then the county's published WCAD pair, then the
numeric account, then `byPropId.get(account)`. The pair goes IN FRONT of the lookup. The reverse
direction is useless. The retirement predicate itself is right and must not be weakened: a node whose
ACCOUNT is absent from the declared roll still retires. Read the pair from the same two staged
extracts the factory reads (`tx_wcad_owner`, `tx_wcad_ag_valuation`); do not build a second copy with
its own staleness.

### What to build

1. **Writer (a):** the arm resolves each node to its account within the node's own keyspace, or
   through the county's published crosswalk (Hays: the geo_id bind with its corroborator; Williamson:
   the WCAD pair), before it looks at the roll. A node whose key cannot be resolved is NOT retired: the
   payload says the retirement could not be determined and why. An unaccounted keyspace refuses the
   bake for that county rather than retiring into it. The payload states what it compared: the key,
   the path, the roll and its tax year.
2. **The dollar facts ride the same lookup.** `cadFacts` comes from the same `byPropId.get(apn)`. Say
   whether a Hays map-id node that collides with an unrelated account gets that account's dollars
   today, with a count and three named examples, and route both through the one resolution you build.
   A value on the wrong parcel is worse than an absence.
3. **Writer (b):** decide whether the account-keyed pass belongs to the bake's contract or to the
   gate's, and say why. If it stays in the bake, it gets its own instrument: before the pass, measure
   the excluded set against the served keyspaces and refuse when the excluded set is a whole served
   keyspace (P-327's suggested shape; blast radius today: exactly 48209 and 48491).
4. **The 1,385.** For each Hays served key writer (a) retired, resolve its account through the
   crosswalk and read the declared roll. Report how many are genuine retirements (the account is off
   the roll), how many are false (the account is on it), and how many have no resolvable account.
   Write them to a committed artifact. The next bake applies the answer; you do not.
5. **The pin.** A factory PR moving `_LDT_SHA` in `cloudbuild.publish.yaml` from `bae48d40` to the
   LDT commit carrying this change, with its adjacent comment. List every LDT commit between
   `bae48d40` and the new pin that touches the bake path (P-304, P-297 and P-258 lane-c are among them)
   so the seat knows what the next bake carries. Open it as a draft against your LDT PR's head; it is
   re-pointed to the merge commit after the LDT PR merges. `ldt-pin-staleness` must pass at the new pin.

### Verify by violation

Pre-register your falsifiers. Fixtures for Hays (a collision: map id equals an unrelated account
number), Williamson (an R node reached through the pair, one the pair does not reach), and a
single-keyspace county. Each shown on the pre-change code: the Hays collision retires wrongly or reads
the wrong dollars; the Williamson node retires wrongly. And on the fixed code: a genuine account
retirement still retires (the predicate is not weakened), an unresolvable key is declared, not
retired, and Bastrop's payloads are byte-identical. Then a read-only dry run of the bake's retirement
decisions for 48209 and 48491 (no write, heavy-scan lease, direct host) with counts per writer beside
an independent query.

### The three-question gate

Answer in your close: what executes each retirement writer, what triggers it, what fails when a writer
retires across keyspaces, and what bypasses it (a bake CLI invoked directly, the frozen laptop scripts,
a raw write).

### Constraints

- No store writes, no bakes, no publishes, no deploys, no merges.
- hauska-factory merge order this wave: P-333, then P-334/P-329/P-330, then P-352 and P-361, then
  P-300 and P-338's writer half, then P-336's. Your pin PR is separate from that queue, but rebase it
  onto whatever has merged and say whether P-329's comment-adjacency rule is on main when you open it.
- P-354 (Georgetown dates) and the LDT halves of P-339 to P-341 may be in flight in LDT; stay inside
  the bake's retirement, key resolution and account-keyed pass, and name any shared file.

### Close

Declare: the start commits and both PRs, the answer on "clear on this join", the dollar-collision
count with examples, the decision on writer (b) with its instrument, the 1,385 split and its artifact,
the LDT commits the new pin carries, the falsifiers with both directions shown, the three-question gate
answers, and `leave_behind`.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-18_p351-bake-retirement-keyspace_cp1.json
  CP2: _inbox/2026-09-18_p351-bake-retirement-keyspace_cp2.json
  CLOSE: _inbox/2026-09-18_p351-bake-retirement-keyspace_close.json
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
    "lane": "p351-bake-retirement-keyspace",
    "planRows": ["P-351"],
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
