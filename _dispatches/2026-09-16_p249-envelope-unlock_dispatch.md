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

PLAN-ROW: P-249 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools
FAN-DEPTH: 0
This lane launches NO sub-agents. Do the work yourself. The commit gate refuses a close that declares any (A-181).

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p249-envelope-unlock --seat <your-seat-id> --plan-row P-249 --dispatch _dispatches/2026-09-16_p249-envelope-unlock_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p249-envelope-unlock --seat <your-seat-id>

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


## Mission — P-249: an unverified "no buildable area" atom stops hiding the modelled envelope

You launch no sub-agents (FAN-DEPTH 0). Two repos, one lane, in this order: read both, build
legacy-design-tools, then hauska-map. You open PRs and do not deploy; the integration seat
deploys to staging and runs the proof below with you or after you.

### Where you work

Fresh clones from `origin/main` under `P:/tmp/` for `legacy-design-tools` and `hauska-map`.
Branches `fix/p249-envelope-unlock` in each. Declare both start commits first. Other lanes may be
open in legacy-design-tools (P-206, P-241, P-258, P-259); none of them touches
`artifacts/api-server/src/lib/buildableEnvelope/`. In hauska-map, you are the first of several
rows that touch the envelope decline branch (P-257, P-270 to P-272 follow you), so keep your
change to that branch and its tests.

### The mechanism (verified; the final teardown could not break it)

- LDT `artifacts/api-server/src/lib/buildableEnvelope/reconcileAtomEnvelope.ts`
  (`reconcileWithAtomEnvelope`, around line 148): when an envelope atom exists, its outcome
  wins. A `no-buildable-area` outcome empties a good live envelope unless
  `isMachineVerifyDiagnostic(reason)` holds. 490,185 such atoms sit in the six counties, mostly
  July breadth-bake records meaning "unzoned" (208,868), "not onboarded" (153,775) or a
  reason-less zero (123,706).
- hauska-map `apps/property-explorer/api/_lib/atom-chain-to-facets.ts`: the `envelope` object is
  built from the atom chain only. The branch at about line 2074 (`!envelope && outcomeKind ===
  "no-buildable-area"`, not depth-warm) sets `status: "declined"`, `declineReason:
  "envelope-unverified"`, no geometry, `envelopeCovered = false`.
- hauska-map `apps/property-explorer/src/browse/InspectCard.tsx` (header, lines 6 to 13) prefers
  the baked node facets and uses the live buildable-envelope client only when a node has no
  baked snapshot.

**Read first, and put the answer at the top of CP1:** for a parcel that HAS a baked snapshot and
whose facets say `status: "ok"` (Pflugerville `48453:427599`), where does the drawn polygon come
from: the atom's `geojson`, or a live `place/buildable-envelope` call? The integration seat's
reading of the header is that for a baked parcel the facets decide, which would make the
hauska-map branch the real fix and the LDT change necessary but not sufficient. Confirm or refute
it from the code, with file and line, before you build.

### What to build

1. **The verification signal, named correctly.** The atom field is `depthWarmPromotion`; the
   value `"depth-warm-promoted-v1"` means verified. hauska-map reads it in `isDepthWarmPromoted`
   (`atom-chain-to-facets.ts`, around line 185) with a `sourceCitation` fallback. There is no
   `depthWarmPromoted` field on the atom (the map writes a flag by that name into its own output,
   which nothing reads). LDT reads neither today. Carry the atom field on LDT's wire type and
   apply the same predicate, with the fallback and its precedence stated.
2. **LDT reconciliation.** A `no-buildable-area` atom that is not verified-promoted no longer
   empties a live envelope that has a district and a setback table. A verified zero still wins.
   `validation-failed` (a live ring that fails the engine's own geometry gates) reaches a named
   decline, never a silent empty.
3. **The figure, on the MCP payload.** A buildable-area figure appears only when a verified atom
   backs it (operator ruling A-180). Today the Pflugerville response quotes "Buildable area from
   the property atom chain ... 5027 sq ft" from an unverified atom. Withhold the figure there,
   keep the polygon and its disclosure. The PDF is P-261, not you.
4. **hauska-map.** The `envelope-unverified` branch serves the modelled envelope with its
   disclosure and no figure (the 2026-09-11 ruling: the polygon draws wherever a district and a
   table exist; only the area waits on a verified atom). Its geometry comes from wherever your CP1
   read says the drawn polygon comes from; never from the unverified atom's zero.
5. **The divergence test.** Four predicates read "is this envelope verified": the map's
   `isDepthWarmPromoted`, your new LDT predicate, LDT's `isMachineVerifyDiagnostic` (reason text),
   and the doc_repo instrument `scripts/envelope-draw-gap.mjs` (string and boolean forms). Add a
   shared fixture set and a test in each product repo that fails when its predicate disagrees
   with the fixture's declared answer. Name the doc_repo instrument's form in your close so the
   integration seat aligns it.

### The staging proof (specify it in your PR; the integration seat runs it)

The stores were green throughout the 2026-09-15 incident, which was a stale browser tab after a
rollback, not a server regression (A-157). So the proof reads the served surface:

- the serving build recorded before and after by asset existence (request the build's unique
  `/assets/index-*.js` against the alias; the live one returns `application/javascript`), never
  by `Age:`;
- each measurement from a fresh browser context;
- three branches per city, each recording `status`, `declineReason`, `envelopeCovered`, whether
  geometry is present and whether a figure is present:
  (a) an unverified zero with a district and a table, `48209:97658`: draws, no figure;
  (b) a verified zero minted on staging (none exists in production): stays empty with a named
      reason;
  (c) a `validation-failed` ring: declines with that reason and draws nothing;
- Waco's panel declining what its own live endpoint draws (XD-2): a named fixture, must draw;
- Pflugerville `48453:427599`: still draws, and now prints no figure unless its atom is verified;
- a rollback rehearsal with the build identity shown to move both ways.

**Sizing.** 131,357 is an upper bound on what this unlocks (it counts parcels with a
`setbackFrontFt` value). Report the unlock against the district-and-table population once P-255
measures it; until then report it against 131,357 labelled as an upper bound, never as a
shortfall.

### Falsifiers, pre-register your answers first

1. `48209:97658` draws on staging with no figure. If it does not, the row is not done.
2. The staging-minted verified zero stays empty. If it draws, the change is too wide.
3. No surface prints a figure from an unverified atom (map payload, MCP, disclosure strings).
4. Your CP1 answer on the polygon's source is backed by file and line, and your build matches it.
5. The divergence test fails when one predicate is edited alone.

### Do not

- Deploy, re-derive or retire any atom (P-263, P-264), or touch the PDF (P-261).
- Change decline wording beyond this branch (P-257 owns the wording surface).
- Launch sub-agents.

### Close

Snapshot per repo; files touched; both PRs with every CI check's literal conclusion; the CP1
answer; the five falsifiers; the staging proof as a runnable checklist. `status`:
`closed-partial` until the integration seat's staging proof passes. `probe`:
`{"notApplicable": "build lane, PRs not deployed; the integration seat runs the staging proof"}`.
`subAgents`. `leave_behind`.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-16_p249-envelope-unlock_cp1.json
  CP2: _inbox/2026-09-16_p249-envelope-unlock_cp2.json
  CLOSE: _inbox/2026-09-16_p249-envelope-unlock_close.json
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
    "lane": "p249-envelope-unlock",
    "planRows": ["P-249"],
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
