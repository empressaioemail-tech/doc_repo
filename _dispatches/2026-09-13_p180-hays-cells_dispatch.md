CANON-PREAMBLE v9e22f2c4
- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY IS THE ONLY WRITER PATH (OPS-19) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker); own repo `hauska-factory`, own Neon store; every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`); OPTION A ruled (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): no new county is written on the old shape and old-shape writes ended permanently 2026-08-27. Every lane has its own registered worktree; never build in another lane's checkout. Row-level status lives in `_catalog/program_preambles/OPS-19.md` and `_state/property/STATE.md`, never here.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- MOST-CURRENT SOURCE WINS (operator 2026-09-11) — for setbacks and every dimensional rule, in every city and county, the source with the most recent effective date supplies the value; tier breaks ties only on equal or unreadable dates; dates are read at source (ordinance effective date, ArcGIS `editingInfo.lastEditDate`), never assumed from source kind; an unreadable date produces a conflict row with both values, never a silent pick. Supersedes tier-first ranking in LDT `authoritativeSetbackSource.ts` and layer-23-first in hauska-map. `_decisions/2026-09-11_setback_source_most_current_wins.md`.
- ENVELOPE DRAWN, FIGURE REFUSED (operator 2026-09-11) — Ruling B reversed for the polygon only: map and MCP draw block draw the modelled buildable envelope from the same `place/buildable-envelope` call with its disclosure wherever a district and setback table exist; buildable area and percent stay refused until an envelope atom backs them. Entitlement gate unchanged. `_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`.
- THE LEDGER IS THE SERVING PATH, ATOMS ARE CANONICAL (operator 2026-09-11) — node = identity, atom = one claim from one authority at one time, edge = an atom whose value is a node; a cell is accounting (state, atom reference, provenance, cached rendering keyed to atom version and vocabulary version), never a copied value; one reader in `hauska-engine/services/retrieval-api` walks gated cells and dereferences atoms and every surface and the Hauska MCP catalog consume it; unslated rails refuse, never fall to legacy; one writer mints atom + pointer + rendering in one transaction; one vocabulary module in the atom-contract package. Never add a read path, a vocabulary copy, or a value-holding cell. `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`, ADR-031 amendment 2026-09-11, OPS-23 §0.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

AGENT-CONTRACT v79be86e2 — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
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

PLAN-ROW: P-180 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-engine


## Mission — P-180 HAYS CELLS THROUGH THE CROSSWALK: the Property Explorer's record path stops serving the chimera

You are the deepest worker in OPS-23 wave 5. You do not spawn sub-agents. The dispatch
planner supervises you, reviews CP1 and CP2, and runs `scripts/surface-probe.mjs --rows P-175`
itself after your publish.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### The law you execute

OPS-21 identity law, two-namespace paragraph (2026-09-13): never join a cell, a label or a
dollar to `cad_property` by the bare number in a gate-blocked county; the account is reached
through `txgio_parcel.geo_id` = `cad_property.property_number`, corroborated by the
`quick_ref_id` stem. P-177 applied it to the tier-1 bake (LDT #670,
`accountCrosswalkForNode` in `joinNormalize.ts`); this row applies it to the engine store.

### Where you work

`hauska-engine-p180-hays-cells` (branch `fix/p180-hays-cells-crosswalk`) and, if the writer
job lives there, `hauska-factory-p180-hays-cells` (branch `fix/p180-hays-cells-crosswalk`);
plus `legacy-design-tools-p180-hays-cells` (branch `fix/p180-structural-fact-crosswalk`). All
from `origin/main`; declare start commits.

### What is true today (P-177 close, `_inbox/2026-09-13_p177-hays-attributes_close.json`, leave_behind)

- The Property Explorer facets route (`/api/spine/property-atoms/<id>/facets`,
  `X-Pe-Read-Path: record`) reads the retrieval-api reader over `parcel_record` in the engine
  store. For 48209 those rows were filled by a writer that joined account attributes by bare
  prop_id, so the five Sturgeon nodes serve another account's situs and values there while the
  MCP snapshot (P-177) is right. `node scripts/surface-probe.mjs --rows P-175` reads FAIL 0/5
  on that route (`_inbox/2026-09-13_183517_surface_probe.json`).
- LDT #671 holds Hays back from six PARCEL-B-SLATE2 record-overlay rails so the chimera is not
  served as record; that hold is lifted only when the cells are right.
- The obvious re-run path, `write-cad-parcel-roll-county.mjs --apply`, is frozen
  (`OLD_SHAPE_FILL_FROZEN`) for every county but one; the CURRENT writer for `cad-parcel-roll`
  cells is a Cloud Run job (P-169 moved loaders to jobs; `factory-atoms-cad` and
  `hauska-engine-atoms-writer` exist in hauska-prod-497015/us-east4). Locate it by reading the
  job list and the code, never by assuming.
- `structuralFactRead.ts` / `cadPropertyLookup.ts` (LDT api-server, the Inspect surface's
  living area and year built) join `cad_property` by bare prop_id with no gate-blocked-county
  awareness: a third instance of the class.
- The retirement marker P-177 wrote for the hollow account-keyed nodes (`48209:84639` and
  siblings) is not durable: the bake's work-list will re-mint them on the next Hays republish.
- Williamson (48491) has the same two-namespace structure, lexically disjoint, with no
  contradictions today but 282,569 phantom nodes; whatever you build must be county-parameterised
  by the gate-blocked set, never a Hays literal.

### What you build, in order

1. **Locate and read the writer.** Name the job, its image, and the code path that fills
   `parcel_record` account attributes for a county. Paste the join. CP1 is this reading plus
   your design: the crosswalk join for `SEED_BLOCKED_FIPS` counties, an honest absence when the
   crosswalk has no account, refusal on ambiguity, provenance naming the account joined.
2. **Fix the writer** with tests that fail on the bare join for a gate-blocked county and pass
   for the other four counties unchanged (byte-identical output on a control county).
3. **Re-run for 48209 and 48491**, staging first then production, through the job, verified
   from execution status; paste the cell diff counts (rows changed, from what to what) for the
   five Sturgeon nodes and for a sample of ten others.
4. **Lift the hold** (#671) once the cells are right; PR, merge, deploy cortex-api under the
   planner's lease.
5. **structuralFactRead.** The crosswalk lookup for gate-blocked counties (import
   `accountCrosswalkForNode` or its pattern); a test that fails on the bare join.
6. **Durable retirement** of the hollow account-keyed nodes: the bake's work-list excludes
   account-keyed ids in gate-blocked counties, and a serve-time read of `48209:84639` returns a
   decline, with a test.

### Falsifiers

- If after step 3 the facets payload for `48209:97658` prints a situs other than
  `629 STURGEON DR` or a market other than 50,390, the writer still joins by bare number.
- If any of the four non-blocked counties' cells change on the control run, the change is wider
  than the claim.
- If `48209:84639` still serves a card after step 6, the retirement is not durable.
- If `node scripts/surface-probe.mjs --rows P-175` reads anything but PASS on all five, name
  the leg.

### Out of scope

The declared roll (P-178). Minting nodes on the account (rejected). Other counties' P-78 overwrite.

### Close

`_inbox/<date>_p180-hays-cells_close.json`, `planRows` `["P-180"]`, with the job name, PRs and
merge SHAs with conclusion strings, both run ids, the cell diffs, the revisions by field, and
the planner's probe artifact. `leave_behind` is required.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-13_p180-hays-cells_cp1.json
  CP2: _inbox/2026-09-13_p180-hays-cells_cp2.json
  CLOSE: _inbox/2026-09-13_p180-hays-cells_close.json
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
    "lane": "p180-hays-cells",
    "planRows": ["P-180"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
