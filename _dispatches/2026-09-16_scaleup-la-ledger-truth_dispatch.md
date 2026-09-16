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

PLAN-ROW: P-201, P-204 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: doc_repo

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane scaleup-la-ledger-truth --seat <your-seat-id> --plan-row P-201 --dispatch _dispatches/2026-09-16_scaleup-la-ledger-truth_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane scaleup-la-ledger-truth --seat <your-seat-id>

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


## Mission — L-A LEDGER TRUTH: read the ledger and see every parcel, every one of its 65 facts, what serves, and what has an atom

**Read-only lane in the Texas scale-up research wave.** You spawn nothing. You write no product
code and change no store. Your worktree is your dispatch planner's doc_repo worktree; write
only under its `_inbox/` and `scripts/`.

### Why this exists

The operator's requirement, verbatim in substance: *the serving ledger should be the single
source of truth, so we should be able to read that ledger and see every parcel and every fact
about the parcel (the 65 cells), and see what is serving, what is not, and what has an atom.*

The 2026-09-11 ruling says the same: the ledger is the serving path, atoms are canonical, and a
cell is accounting that points at its atom. **Nobody has measured how far the running system is
from that.** Measured on 2026-09-16:

- the map adapter reports `atomBacked: false` on every rail sampled;
- 490,185 envelope atoms contradict the ledger's current setbacks;
- a third copy (the tier-1 bake, `place_layer_snapshots`) is what several surfaces read.

### Build: `scripts/ledger-truth.mjs`

A read-only, self-testing instrument, in the style of `scripts/six-county-completeness.mjs`. Read
that file first and reuse its store-access pattern.

**Mode 1, per parcel:** `--parcel 48209:97658`. Print all 65 rails, one line each:

- the cell `kind` and value;
- the cell's source and vintage;
- **the serve path** (record, legacy-transitional, not-cut-over, atom-chain, or other);
- **the atom behind it**: which family, whether it exists, its `source_adapter` and dates;
- **whether cell and atom agree.**

This is the "see every fact" view.

**Mode 2, per county and city, rolled up:** for each of the six counties, per city (and
unincorporated), per rail, counts of:

- cell kinds;
- serve path;
- atom present or absent, per family, **counted** where an index allows and **sampled and
  declared** where it does not;
- cell-atom disagreement, at minimum for the whole envelope family and zoning.

**The envelope family is in scope in full:**

- **Rails:** `setbackFrontFt`, `setbackSideFt`, `setbackRearFt`, `setbackCornerFt`,
  `setbackRules`, `maxHeightFt`, `maxLotCoveragePct`, `maxFootprintSqFt`,
  `maxImperviousCoverPct`, `parcelAreaSqFt`, `buildableAreaSqFt`, `buildableAreaPct`,
  `envelopeStatus`, `envelopeDisclosure`, `edgeSignal`, `citationUrl`, `buildingFootprint`,
  `parcelGeometry`, `roads`.
- **Atom families:** `zoning-fact`, `setback-rule`, `buildable-envelope`,
  `property-boundary-edge`, `building-footprint`, `road-node`, `parcel-node`.

**Serve path is a claim about code, so derive it from code and name the source.** Read:

- the reader slate: hauska-engine `services/retrieval-api/src/parcel-record-slate.json` and
  LDT's `PARCEL_RECORD_SLATE`;
- the gate-verdict and allowlist logic in LDT (`parcelRecordAllowlist.ts` and the
  `*ServeCutover.ts` wrappers);
- how hauska-map computes `recordRailStates`.

**If these sources disagree about a rail, that disagreement is a finding.** Report it and do not
pick one.

**Atom pointers.** Enumerate every key that appears in `cell_state` across all 65 rails. Report
whether any key references an atom (a DID, a version or a content hash), and on which rails.

### Falsifiers

Pre-register your answers before you run anything.

1. For `setbackFrontFt`, your county totals by kind must equal those in
   `_inbox/2026-09-16_setback_parcel_grain_results.txt` and in
   `scripts/six-county-completeness.mjs`'s live run. A difference is a finding about one of the
   three.
2. Per-parcel mode on `48209:97658` must show:
   - `setbackSideFt` as legacy-transitional;
   - an envelope atom with outcome `no-buildable-area` from `cortex-tier1-snapshot-breadth-bake`,
     disagreeing with the ledger's setbacks.

   On `48453:427599` it must show a buildable envelope atom.
3. **Not vacuous:** a self-test fixture in which a cell and its atom disagree must be reported as
   disagreeing, and a fixture with no atom must not be reported as agreeing.
4. Any count you cannot make exact is labelled a sample, with its size and selection rule.

### Then: the design gap

Write `_inbox/<date>_scaleup-la_single_source_design_gap.md`. Cover:

- what a cell must carry for one read to answer everything above (atom reference, atom version,
  serve status, rendering version, and whatever else your measurement shows is missing);
- what exists today;
- which existing rows build it (P-162, P-163, P-164, P-166, P-201, P-204) and what no row covers;
- how the tier-1 bake copy is retired or fed, since a third copy defeats a single source.

### Close

**Report.** `_inbox/<date>_scaleup-la_ledger_truth_report.md`, containing:

- the county, city and rail roll-up;
- the serve-path source disagreements;
- the atom-pointer finding;
- the envelope-family disagreement counts;
- the instrument's self-test output.

**Close JSON.** `_inbox/<date>_scaleup-la-ledger-truth_close.json`, carrying:

- `planRows` `["P-201", "P-204"]`;
- `probe` `{"notApplicable": "read-only research lane"}`;
- `falsifier` with your pre-registered answers scored;
- `leave_behind`.

Report to your planner when your atoms-store reads are finished, so L-B can start its own.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-16_scaleup-la-ledger-truth_cp1.json
  CP2: _inbox/2026-09-16_scaleup-la-ledger-truth_cp2.json
  CLOSE: _inbox/2026-09-16_scaleup-la-ledger-truth_close.json
  These paths are relative to the doc_repo worktree the session RUNNING YOU is rooted in: for a
  lane spawned by the dispatch planner that is the planner's worktree; for the dispatch planner
  itself it is its own seat worktree (never P:/doc_repo, the integration seat's checkout). This
  dispatch was compiled in P:/seat-worktrees/dispatch-planner/doc_repo. Two lanes in each of waves 1 and 2 wrote
  into the property seat's worktree instead and their artifacts had to be found by hand.
  No notification arrives when a background command finishes: poll with a bounded loop and a
  timeout; a lane that ends its turn waiting for a wake-up stalls (two lanes did, wave 2).

CLOSE SKELETON (the fields the enforcement gate reads; spell them exactly, or the gate refuses
the commit rather than guessing what you meant):
  {
    "lane": "scaleup-la-ledger-truth",
    "planRows": ["P-201", "P-204"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
