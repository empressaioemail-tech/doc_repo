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

PLAN-ROW: P-201 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-factory

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane p201-excluded-states --seat <your-seat-id> --plan-row P-201 --dispatch _dispatches/2026-09-16_p201-excluded-states_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane p201-excluded-states --seat <your-seat-id>

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


## Mission — P-201: `excluded` is three states wearing one word

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

### Where you work

`hauska-factory`. No worktree exists yet for this lane. Clone fresh from `origin/main`, cut
your own branch, and declare the commit you started from before you write anything.

### The defect, as ruled (A-153, carding P-201)

The publish gate's `excluded` verdict collapses three genuinely different rail states into one
string, and the collapse is load-bearing: a rail with no writer is removed from the gate's
denominator, so it cannot fail, and a county with large swaths of unacquired data still
"passes." Measured live 2026-09-14 on Hays: all 32 `excluded` rails have zero value cells and
all 33 non-excluded rails have values, no exception either direction — the word `excluded` is
doing exactly the collapsing the row describes.

**The single collapse point, read this session against `origin/main` (`bfb7303`):**
`toGateVerdictKind()`, `src/jobs/publish-gate-sched.mjs:274-284`:

```js
export function toGateVerdictKind(engineVerdict) {
  if (engineVerdict.excludedDeclaredAhead && engineVerdict.excludedDeclaredAhead.length > 0) {
    return "excluded";
  }
  return engineVerdict.ok ? "pass" : "refuse";
}
```

`excludedDeclaredAhead` comes from hauska-engine's `evaluateRailGate` as a bare presence flag
(length > 0 or not) — it does not itself say *why* a rail was declared ahead. Everything this
row asks for has to be built from that single boolean plus whatever else you determine is
needed; nothing downstream currently distinguishes the three cases.

### The three states, as the row defines them (quote these definitions verbatim in your work; do not redefine them)

- **(a) Legitimately not applicable.** A rail that genuinely does not apply to this county.
  Protected today by engine #444's narrowing for single-county rails. This is the ONLY
  legitimate use of a silent exclusion.
- **(b) Mid-cutover.** Data for the rail exists and serves through another path; only the
  ledger cell is empty. Named rails, measured 2026-09-14 on gold parcel `48209:97658`:
  `parcelGeometry`, `roads`, `pipelines`, `railCorridor`, `etjStatus`,
  `landUseDescription`. (This is also P-204's subject — P-204 decides CUT OVER / STAYS
  ELSEWHERE / RETIRE per rail; that is NOT this row's job. This row only has to make (b)
  distinguishable from (a) and (c), not resolve it.)
- **(c) No acquisition path has ever existed.** Named rails: `easements`,
  `hoaDeedRestrictions`, `mineralRights`, `ossf`, `permits`, `salesHistory`, `terrain`,
  `treeProtection`.

These 14 named rails are ground truth for classification, given to you, not something to
re-derive. The other ~51 of the 65 rails are not classified anywhere yet — that is the actual
work.

### Predicate (quoted from the row, do not weaken it)

"The verdict enum gains distinct values, every one of the 65 rails per county carries exactly
one, and a county whose (c)-class count is non-zero CANNOT read as fully graded. Proven by
violation: a (c)-class rail must make the gate say so."

**NOT in scope: fixing any (b) or (c) rail.** This row only makes the three distinguishable. Do
not build a new acquisition path, do not cut over a mid-cutover rail. If you find yourself
writing a new writer, stop — that is a different row.

### A precedent that exists, and a warning about it

`src/ledgers/manifest-read.mjs` / `src/ledgers/indicators.mjs` already implement a similar
three-way split (`displayStateFromVerdict`: `no-atom` when `atomFamilyState !== "present"`,
`no-writer` when `!hasWriter`, else a value-state) — but it is scoped to exactly ONE rail
(`CAD_RAIL = "cad"`), not the 65-rail publish gate. `hasWriter`/`atomFamilyState` here ARE
derived from the store (`deriveHasWriter`, `deriveAtomFamilyState`, `indicators.mjs:5-11`) as
of this read — a prior fleet note recorded these as hand-declared and stale; that note is
itself now stale, so verify current behavior yourself rather than trusting either claim.
**A separate fleet note flags the County Manifest's own gating indicators as dead** (unwired
from anything that actually reads them) — confirm this mechanism is live and reachable before
building on it, or treat it as naming precedent only, not as reusable machinery. Either way, do
not silently assume it works; say what you found.

### Falsifiers, pre-register your answers before you run anything

1. **Every one of the 65 rails classifies.** Enumerate all 65 rail keys against your new
   classification and show none fall through to an unclassified default. An unclassified rail
   defaulting to (a) or (b) silently re-creates this exact defect one level down.
2. **A (c)-class rail changes the gate's answer.** Construct or find a county with at least one
   (c)-class rail and prove the gate no longer reports it as fully graded — a check that cannot
   fail on this case is not the check this row asks for.
3. **A genuinely (a)-class rail is unaffected.** Find a rail that is legitimately not
   applicable to some county (protected by engine #444) and confirm it still reads as excluded/
   not-applicable, not demoted to (b) or (c) by your new logic. This row must not regress the
   protection #444 already built.
4. **Hays, re-run.** Re-measure Hays's 32 currently-`excluded` rails under your new enum and
   report the (a)/(b)/(c) breakdown. This is the number the operator will actually look at.

### Known traps

- Do not derive (b) vs (c) from a single signal you have not checked for staleness. If you use
  `hasWriter`/`atomFamilyState` or an equivalent, confirm it is actually current (varies across
  real cells — `indicators.mjs` has an `assertIndicatorsVary` guard for exactly this failure
  mode; read what it checks and why before trusting the fields it doesn't catch).
- `excludedDeclaredAhead` is computed engine-side (hauska-engine's `evaluateRailGate`). Read
  whether it already carries enough information to distinguish (a) from (b)/(c), or whether you
  need a new signal from the engine's declared-ahead reasoning — do not assume without reading
  the engine-side function.
- This row's own scope line explicitly excludes fixing (b) or (c) rails. Resist the pull to fix
  `parcelGeometry`/`roads` while you're in here — that is P-204's row, gated behind this one.

### Do not

- Do not fix any named (b) or (c) rail's actual data or acquisition path.
- Do not deploy. Open the PR green and hand it back; this repo's own publish/deploy path is a
  separate operator decision given what a gate change does to live publish runs.
- Do not spawn sub-agents.

### Close

State your snapshot (repo, branch, commit). Name every file touched and the new verdict enum's
values. Paste the Hays re-measurement (falsifier 4) with real numbers. Paste the (c)-class
violation proof (falsifier 2). Declare `leave_behind` explicitly — this includes naming which
of the ~51 unnamed rails you classified into which bucket and on what basis, since that
classification is itself a claim a later row may need to verify.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-16_p201-excluded-states_cp1.json
  CP2: _inbox/2026-09-16_p201-excluded-states_cp2.json
  CLOSE: _inbox/2026-09-16_p201-excluded-states_close.json
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
    "lane": "p201-excluded-states",
    "planRows": ["P-201"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
