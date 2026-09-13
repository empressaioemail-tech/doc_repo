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

PLAN-ROW: P-178 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools


## Mission — P-178 HAYS DECLARED ROLL: the 2026-08-26 export replaces the preliminary values, and the accounts it lacks are marked, not hidden

You are a hand-carried lane on the property seat. You are the deepest worker: you do not spawn
sub-agents. The integration seat (overseer) reviews CP1 and CP2 in this thread; the OPERATOR
gives the go for the production load in this thread. You start only after P-177 has merged and
published (the overseer tells you); the values must change under the crosswalk rule, not before it.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### The ruling you execute

`_decisions/2026-09-13_hays_declared_2026_roll_is_the_8_26_export.md`.

### Where you work

`P:/seat-worktrees/property/legacy-design-tools-p178-hays-roll`, branch
`feat/p178-hays-declared-roll`, from `origin/main` after P-177's merge; declare the start commit.
`P:/legacy-design-tools` is someone else's checkout.

### What is true today (re-verify at your start)

- Production `cad_property` at `48209` / `tax_year 2026`: 134,606 rows from
  `2026-PRELIMINARY-DATA-EXPORT-FILES.zip`, `quick_ref_id` and `property_number` filled on
  134,216 of them by the P-175 backfill (`cad-backfill-published-identifiers`, LDT #654).
- The 8-26-2026 export (`hays.zip`, sha256 `7a4bd56d…`, PROPERTY member
  `PropertyDataExport1404449.txt`; the IMPROVEMENT member has 11 columns and the same first four
  headers, do not load it as the roll) carries 134,591 distinct accounts. Against the
  preliminary roll: 134,216 in both, market value identical on 88,692 and different on 45,524
  (5,804,233,014 dollars absolute), situs different on 509, 390 roll rows not in the export,
  375 export accounts not on the roll (`_inbox/2026-09-10_ctx-hays-rebind_addendum_source_reconciliation.json`).
- `upsertCadProperties` writes a WHOLE row and never deletes; a re-ingest therefore cannot
  drop the 390 and would leave them at notice values under the same tax_year with no marker.
- The parser reads `QuickRefID` and `PropertyNumber` (LDT #653); confirm at your start commit
  that a re-ingest writes them and does not null them.
- The loader runs as the Cloud Run job `ldt-cad-ingest` (P-169; 16Gi/4cpu was needed for
  Travis). No laptop `--apply` (frozen 2026-08-26).
- The declared-vintage registry is `lib/cad-ingest/src/vintage.ts` (`tryResolveDeclaredCadVintage`);
  the factory's cadRoll gate reads the declared vintage (`publish-cadroll-postcondition.mjs`).
- The card's dollar rows print `vintage: 2026-09-02T12:59:55Z`, the load time, not the drop.

### What you build, in order

1. **The marker.** A declared row state for accounts present on a prior drop of the same
   tax_year and absent from the declared drop: a column or typed state
   (`roll_membership = 'absent-from-declared-drop'`, with `declared_source_file`) that the
   reader and the facets surface as an honest disposition, never as a certified value. A
   migration; a violation test that a marked row cannot be served as `present` cadRoll.
2. **The vintage label.** The dollar rows' `vintage` is the drop's name and export date
   (`2026-08-26 certified export`), and until the load lands the preliminary rows read
   `2026 preliminary (notice values)`; wire both through the facets and `get_smart_site`.
3. **Declare.** Update the LDT vintage registry for 48209 to the 8-26 drop. Tests.
4. **Staging load.** Through `ldt-cad-ingest` on staging with the 8-26 PROPERTY member:
   dry-run record, then apply. Read, do not assume: rows updated, inserted (expect 375),
   marked (expect 390), identifier columns unchanged by digest, market value changed on
   45,524 (within the arithmetic of staging's own roll). Paste the record's tail. CP2.
5. **Production load, on the operator's go in this thread.** Same sequence; same numbers or
   a finding. Keep both record files and name them in the close.
6. **Publish.** Re-bake and publish Hays tier-1 through the factory job (staging then
   production, under the planner's lease if a service shifts). Read `get_smart_site` for
   `48209:97658` (629 Sturgeon under P-177's rule) and for three of the 45,524 moved accounts
   and three of the 390 marked; paste values, vintage labels and dispositions.

### Falsifiers, pre-registered

- If after step 5 `quick_ref_id IS NOT NULL` on 48209/2026 reads fewer than 134,216, the
  re-ingest clobbered the identifiers; stop before publish.
- If market value moved on a count far from 45,524, the wrong member or the wrong drop was
  loaded (check the 40-column header and the sha256).
- If any of the 390 serves a `present` cadRoll after step 6, the marker is not in the read path.
- If the row count for 48209/2026 fell, something deleted; the loader must not.
- If any county other than 48209 changed a row, the load was not scoped.

### Out of scope

Prior-year vintages. Other counties' declared drops. Node identity (ruled:
`_decisions/2026-09-13_hays_node_identity_is_the_parcel_map_id.md`).

### Close

`_inbox/<date>_p178-hays-roll_close.json`, `planRows` `["P-178"]`, with the migration and PR
numbers with merge SHAs and conclusion strings, both load records, the counts against the
pre-registered expectation, the publish run ids, the seven `get_smart_site` reads, and the
serving revisions by field. Write it in the doc_repo worktree the session running you is rooted
in; do not commit to doc_repo. `leave_behind` is required.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-13_p178-hays-roll_cp1.json
  CP2: _inbox/2026-09-13_p178-hays-roll_cp2.json
  CLOSE: _inbox/2026-09-13_p178-hays-roll_close.json
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
    "lane": "p178-hays-roll",
    "planRows": ["P-178"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
