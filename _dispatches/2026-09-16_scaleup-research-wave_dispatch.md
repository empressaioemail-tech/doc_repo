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

PLAN-ROW: P-198, P-201 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: doc_repo

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane scaleup-research-wave --seat <your-seat-id> --plan-row P-198 --dispatch _dispatches/2026-09-16_scaleup-research-wave_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane scaleup-research-wave --seat <your-seat-id>

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


## Mission — TEXAS SCALE-UP RESEARCH WAVE (dispatch planner): five read-only lanes that find what the scope does not know

You are the DISPATCH PLANNER (topology: `_decisions/2026-09-11_overseer_dispatch_planner_lane_topology.md`).
You compile five lane dispatches, spawn one read-only sub-agent per lane, supervise each to
completion, attack its output (AGENT_CONTRACT CP1 and CP2), independently re-derive at least
three numbers from each lane, and write the wave report. **Nothing in this wave writes to any
product repo or any store.** The deliverable is information, and the next thing to happen is the
overseer revising two documents from it:

- `_inbox/2026-09-16_texas_scaleup_program_scope.md` (read it first, all of it);
- `_inbox/2026-09-16_farm_architecture_draft.md` (read it second).

Exit-bounded verification: every command terminates on its own; wrap anything that can hang in
`timeout`; never leave a watch, a tail or a poll running. No notification arrives when a
background command ends; poll with a bounded loop.

### Your seat and your first commands

Seat `dispatch-planner`, worktree `P:/seat-worktrees/dispatch-planner/doc_repo`, branch
`seat/dispatch-planner`.

```
git -C P:/seat-worktrees/dispatch-planner/doc_repo fetch origin
git -C P:/seat-worktrees/dispatch-planner/doc_repo merge --ff-only origin/main
git -C P:/seat-worktrees/dispatch-planner/doc_repo log --oneline -1
```

The overseer lands this branch's 24 wave 6 commits on main before sending you this.

- **If the fast-forward fails, STOP.** Report the divergence and do not reset, rebase or discard
  anything.
- **Two files will disappear from your worktree on the fast-forward.** They are
  `_inbox/2026-09-14_p156-bastrop_close.json` and
  `_inbox/2026-09-14_p186-remint-wrapper_close.json`. The probe close gate (R-4) held them off
  main when your branch landed (A-176). They are preserved at `d8b61021`. **Do not restore them
  onto main.** L-C reads them from that commit, and re-grading them is owed.
- Declare the commit you are on in your first output.

### Store access, for every lane

| Store | How | Rules |
|---|---|---|
| Factory store | `FACTORY_DATABASE_URL_RO` (Secret Manager, hauska-prod-497015) | set `default_transaction_read_only=on` and `statement_timeout` on every session |
| Atoms store (`hauska_mcp`, 203 GB, about 102M rows) | `ATOMS_DATABASE_URL` (hauska-prod-497015) | This credential can write, so every psql session must start with `PGOPTIONS='-c default_transaction_read_only=on -c statement_timeout=240000'`. Run EXPLAIN before any query. Only index-bounded predicates. |
| Landing (`neondb`) | an existing read path only | if none is available read-only, mark the read UNMEASURED |

The atoms store has these indexes:

- `(entity_type)`;
- `(entity_type, entity_id)`, unique;
- partial `body->>'parcelNodeId'` with `text_pattern_ops` for `zoning-fact`, `setback-rule`,
  `buildable-envelope` and `parcel-terrain-model`;
- partial indexes for `property-boundary-edge`, `building-footprint` and `parcel-node`;
- `road-node` by `roadNodeId` and by `countyFips`.

A family without a parcel-bounded index is sampled, and the sample is declared as a sample.

**Heavy-scan serialisation (contract section 4).** Only ONE lane queries the atoms store at a
time. You sequence it: L-A first, then L-B. Never print a DSN, and never write one to a file.

### The standing instruction for every lane

**Exhaust the question.** Agents on this program have repeatedly found the first blocker and
stopped. A lane that finds a blocker records it, with evidence, and keeps going through the rest
of its scope. A report that names one blocker and stops is sent back. Every count is a count,
never a sample presented as a total. Every claim names its file and SHA, or its query and
timestamp.

### The wave

| Lane | Id | Mission | Plan rows (compile flag) | Reads |
|---|---|---|---|---|
| L-A ledger truth | `scaleup-la-ledger-truth` | `_catalog/dispatch_missions/mission_scaleup_la_ledger_truth.md` | `P-201,P-204` | factory store, atoms store (first), code |
| L-B envelope unlock and footprints | `scaleup-lb-envelope-roads` | `_catalog/dispatch_missions/mission_scaleup_lb_envelope_roads.md` | `P-249,P-248` | atoms store (after L-A), factory store, live surfaces, code |
| L-C blocker history | `scaleup-lc-blocker-history` | `_catalog/dispatch_missions/mission_scaleup_lc_blocker_history.md` | `P-188` | doc_repo history, closes, code |
| L-D farm architecture | `scaleup-ld-farm-architecture` | `_catalog/dispatch_missions/mission_scaleup_ld_farm_architecture.md` | `P-187,P-198` | code, config, Cloud Run and Neon metadata, store catalogs |
| L-E customer experience | `scaleup-le-customer-experience` | `_catalog/dispatch_missions/mission_scaleup_le_customer_experience.md` | `P-197` | live surfaces, factory store for fixture selection |

**Compiling.** Compile each lane in your worktree, never by hand:

```
node scripts/dispatch.mjs --lane <id> --plan-row <rows> --repo doc_repo --mission-file <mission>
```

**Spawning.** Paste each compiled dispatch into its sub-agent **in full**, because the canon gate
refuses a prompt that only names a path. One level deep. Lanes spawn nothing.

**Starting.**

- L-C, L-D and L-E start at once.
- L-A starts at once. L-B starts its atoms-store work only after L-A reports its atoms-store
  reads finished; L-B's non-atoms work can start at once.

### What you verify yourself

For each lane:

- re-run its instrument, where it built one;
- re-derive three of its numbers by a different query or file;
- read its code citations at the SHA it names.

**Numbers the overseer already measured**, which the lanes must reproduce or contradict with
evidence:

- 219,472 false setback absences: 125,212 district misses and 94,260 in 54 no-table cities.
- 490,185 "no-buildable-area" envelope atoms, grouped into the classes in scope section 2c.
- 318,000 `unaccounted` ag-valuation cells in four counties.
- `scripts/six-county-completeness.mjs` reading INCOMPLETE.

### Close

**Artifacts.** In your worktree:

- each lane's report and close under `_inbox/2026-09-1x_scaleup-<lane>_*`;
- each instrument under `scripts/`;
- your own `_inbox/<date>_scaleup_research_wave_report.md`: what each lane found, what you
  re-derived, what contradicted the scope, and what is still unknown;
- `_inbox/<date>_scaleup-research-wave_close.json`, carrying:
  - `planRows` `["P-198", "P-201"]`;
  - `status`;
  - `probe` `{"notApplicable": "read-only research wave"}`;
  - `leave_behind`.

**Committing.** Commit to your seat branch with explicit pathspecs, each git verb in its own call,
and push. **Your reply to the overseer lists every path and the pushed commit SHA.**

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-16_scaleup-research-wave_cp1.json
  CP2: _inbox/2026-09-16_scaleup-research-wave_cp2.json
  CLOSE: _inbox/2026-09-16_scaleup-research-wave_close.json
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
    "lane": "scaleup-research-wave",
    "planRows": ["P-198", "P-201"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
