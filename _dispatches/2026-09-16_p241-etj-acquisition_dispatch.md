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

PLAN-ROW: P-241 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools
FAN-DEPTH: 0
This lane launches NO sub-agents. Do the work yourself. The commit gate refuses a close that declares any (A-181).

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p241-etj-acquisition --seat <your-seat-id> --plan-row P-241 --dispatch _dispatches/2026-09-16_p241-etj-acquisition_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p241-etj-acquisition --seat <your-seat-id>

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


## Mission — P-241 build, acquisition half: give ETJ a real data source

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

### Where you work

`legacy-design-tools`, `lib/cad-ingest/src/boundary/` and `lib/db/src/schema/`. No worktree
exists yet for this lane. Clone fresh from `origin/main`, cut your own branch, and declare the
commit you started from before you write anything. A second lane (P-206) may be running
concurrently in this same repo, scoped to `artifacts/smartsite-mcp` and possibly
`hauska-engine` — do not touch either; this row has no reason to.

### Context: this is the acquisition half of a larger, already-enumerated build

P-241's read-only investigation lane closed 2026-09-15
(`_inbox/2026-09-15_p241-etj-enumeration_close.json` — read it in full; it is short and answers
most of what follows in more detail than this mission repeats). It found: ETJ is hardcoded
`"unresolved"` at eight sites across three repos; 20 of 23 wired cities publish a directly
queryable ETJ layer; and — the load-bearing finding for THIS mission — **the two consumer
hardcode sites in `hauska-engine` (`report-model.ts:966`, `feasibility.ts:210-212`) do nothing
useful once unwired, because no real ETJ data exists anywhere in this product yet.** Building
the acquisition path first is the only sequencing that produces a customer-visible result;
unwiring the consumer sites before this exists just swaps one hardcoded "unresolved" for
another. **This mission is acquisition only. Unwiring the consumer sites (hauska-engine,
hauska-map) is explicitly follow-on work, not this lane's job — see "Do not" below.**

### The traced repo attribution — read this, don't re-derive it

Two live mechanisms exist in this portfolio for a jurisdiction-shaped fact; the close doc
traced both and named the right one for ETJ:

- **Chain A (city limits, THIS repo, already wired for every non-slated county today):**
  TxGIO statewide layer → `@workspace/cad-ingest`'s boundary-ingest CLI → `tx_city_boundary`
  table (`lib/db/src/schema/txCityBoundary.ts`) → `resolveCityContainmentAtPoint()`
  (`lib/cad-ingest/src/boundary/containment.ts`) → `cityLimitsFactFromContainment()`
  (`lib/cad-ingest/src/boundary/cityLimitsFact.ts`) → `loadCityLimitsFact()` →
  `loadCityLimitsFactForServe()` (checks a per-county slate, routes to Chain B for slated
  counties, else falls through to live point-in-polygon here) → consumed by
  `artifacts/api-server/src/routes/brokerageNodeFacets.ts:864` and
  `routes/propertyExplorer.ts:312`.
- **Chain B (the ledger/atom architecture, `hauska-engine`+`hauska-factory`, live for special
  districts, NOT for jurisdiction/ETJ data, and only serves currently-slated counties):**
  named in the close doc for completeness; **do not build against this chain** — it does not
  cover most counties today, and `hauska-factory`'s own `parcel-record-rail-registry.ts:54`
  already declares an `etjStatus` slot that sits dead (zero entries in
  `parcel-record-slate.json`'s 152 rows) precisely because no writer has ever populated it.
  Populating that slate is a real alternative future path, not this mission's job.

**Chain A is where this mission builds**, per the close doc's own conclusion: "this is the
layer's real closest sibling, already fully wired, and is the DEFAULT path for essentially
every county today."

### What to build

Mirroring `txCityBoundary.ts`'s existing shape (read it first — do not design from scratch
what already has a working precedent one file away):

1. **Schema:** a new `tx_etj_boundary` table in `lib/db/src/schema/`, sibling to
   `txCityBoundary.ts`. Read that file's actual column shape and mirror it; do not invent a
   different one without a stated reason.
2. **Acquisition:** a bulk-ingest CLI mirroring the existing City_Boundaries pull, targeting a
   real, queryable ETJ source. **You have a menu of real, already-enumerated sources from the
   close doc's `enumeration` block** — do not re-discover them. Start with Austin (388 polygons,
   confirmed live and re-measured this session:
   `services.arcgis.com/0L95CJ0VTaxqcmED/arcgis/rest/services/BOUNDARIES_jurisdictions/
   FeatureServer/0`) since it is the largest city in the footprint and its data is the most
   scrutinized already. Extend to the other 19 cities with a confirmed layer using the close
   doc's per-city URL table — you do not need to re-enumerate, but DO spot-verify a handful live
   before trusting the close doc's URLs wholesale (they are 1 day old; a source going stale
   between then and now is a real, if small, risk).
3. **Containment:** extend `containment.ts` (it already has an `etjUnresolved()` function that
   is unconditional today — "this module was BUILT for ETJ and still cannot resolve it," per
   the close doc) or add a sibling module, your call, but state which and why.
4. **Fact DTO + read path:** mirror `cityLimitsFact.ts` → a new `etjFact.ts`-shaped module, and
   the corresponding `load...Fact()` read function.

### Predicate

A real ETJ query, run against a real onboarded-footprint address (Austin, at minimum), returns
a genuine present/absent-verified/unresolved disposition backed by live source data — not a
hardcoded string. The mechanism generalizes to the other 19-of-23 cities with a confirmed
layer without a per-city code branch (a config/registry entry per city, not an if-chain).

### Falsifiers, pre-register your answers before you run anything

1. **Austin, a real address inside the 2-mile ETJ ring.** Query your new path and get a real
   `present` ETJ disposition citing the source, not `unresolved`.
2. **Austin, a real address inside city limits (not ETJ).** Confirm your path correctly
   distinguishes this from the ETJ case — the combined-layer cities (Austin, New Braunfels,
   Kyle, Cibolo) all carry city-limits and ETJ in ONE layer distinguished by an attribute value;
   read that distinguishing field correctly or you will misclassify both.
3. **Round Rock or Cedar Park** (city-limits-only, no ETJ layer found on their own host per the
   close doc). Confirm your path returns an honest `unresolved`/absent-source disposition for
   these, not a false negative dressed as a confirmed absence — there is a real difference
   between "checked, no ETJ here" and "no source to check."
4. **A city outside the 23-city footprint entirely.** Confirm your path does not silently
   return a false answer for a county/city this acquisition was never pointed at.

### Known traps

- **The two SB numbers are both real and mean different things — do not conflate them.**
  SB 2038 (2023, confirmed against capitol.texas.gov) created ETJ release by petition/election/
  municipal inaction. SB 1844 (2025, confirmed) is a different, narrower disannexation
  mechanism (water/wastewater service failure near navigable water) — land disannexed under it
  lands IN the ETJ, not released from it, per Austin's own council records. Both are cited
  correctly in the close doc; if you touch any statutory-derivation logic (you should not need
  to — this mission is acquisition from live GIS sources, not statutory computation), do not
  merge these two.
- **Do not build a §42.021 statutory-buffer derivation.** That approach is retired as a
  candidate, not merely deferred — Austin's real ETJ is shaped by individual AG-development
  agreements and disannexation actions that a formula would contradict. Acquire the real
  published layer; do not compute one.
- The close doc's per-city URLs are informational, gathered by a sub-agent and only spot-
  verified for 2 of 22 non-Austin cities (New Braunfels, Bastrop) — treat the rest at one notch
  lower confidence, per the close doc's own disclosure.
- `P:/hauska-engine`'s local checkout was found stale during the close (predates the entire
  site-plan feature area). Irrelevant to this mission's scope (you're not touching
  hauska-engine), but if you find yourself reaching for that repo for any reason, fetch fresh.

### Do not

- Do not touch `hauska-engine` (`report-model.ts`, `feasibility.ts`) or `hauska-map`'s three
  duplicate hardcode sites. Unwiring the consumers is explicit follow-on work, not this
  mission — it does nothing useful before this acquisition exists, and doing it now would be
  two lanes racing on files this mission has no need to touch.
- Do not touch `artifacts/smartsite-mcp` or `artifacts/api-server`'s routes — a concurrent lane
  (P-206) may be working there.
- Do not build against Chain B (the ledger/atom architecture) or populate
  `parcel-record-rail-registry.ts`'s dead `etjStatus` slot — that is a different, larger,
  unscoped alternative path, not this mission.
- Do not deploy or run the ingest CLI against production. Open the PR green and hand it back;
  a real bulk-ingest run against production data is a separate, deliberate operator-triggered
  step per this repo's own ingest conventions.
- Do not spawn sub-agents.

### Close

State your snapshot (repo, branch, commit). Name the exact schema, files, and CLI you built.
Paste all four falsifier results with real query output. Name how many of the 20 cities with a
confirmed layer your registry actually covers at close (all 20 is not required to close this
row — say honestly how many, and why any gap). Declare `leave_behind` explicitly, including
the six duplicate hardcode sites (three in this repo, three in hauska-map) and the
hauska-engine consumer-unwiring work this mission deliberately did not touch.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-16_p241-etj-acquisition_cp1.json
  CP2: _inbox/2026-09-16_p241-etj-acquisition_cp2.json
  CLOSE: _inbox/2026-09-16_p241-etj-acquisition_close.json
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
    "lane": "p241-etj-acquisition",
    "planRows": ["P-241"],
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
