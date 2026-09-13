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

PLAN-ROW: P-177 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools


## Mission — P-177 HAYS ACCOUNT ATTRIBUTES THROUGH THE CROSSWALK: end the chimera class, not one address

You are a hand-carried lane on the property seat. You are the deepest worker: you do not spawn
sub-agents. The integration seat (overseer) reviews CP1 and CP2 in this thread and runs the
surface probe after your deploy. Continue in the registered worktree
`P:/seat-worktrees/property/legacy-design-tools-p175-hays-online` (rebase it on `origin/main`
first and declare the commit); P-177 is P-175's continuation on the same files.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### What P-175 established, and what it got wrong (overseer review 2026-09-13, `_inbox/2026-09-13_p175_overseer_review.md`)

Real and verified: the identifier backfill (134,216 of 134,606 Hays 2026 rows carry
`quick_ref_id` and `property_number`, production read); the H1 disposition table
(hauska-factory #142, P-145 closed: different-key 37,927, never-an-account 25, unknown 107,
left-the-roll 0, none undispositioned); the tier-1 publish ran (48209 snapshots re-baked
2026-09-13T00:50Z); the situs resolver (LDT #668 + #669, `cortex-api-00782-geq` at 100 percent)
binds a located-unbound address point to the parcel that contains it.

Wrong, read at source by the overseer after the close:

- **The rebind did not reach the served polygon.** Node `48209:97658` after the publish
  (bakedAt 2026-09-13T00:50:56Z) still carries the Sturgeon lot's nine-vertex ring, 0.1889 ac,
  neighbours 97657/97659, San Marcos CISD, the Upper San Marcos watershed district and flood
  Zone AO, under CAD account 97658's label, anchor and dollars (13669 Mesa Verde Dr). The
  mission's first falsifier fired; the lane checked the label, which had always been Mesa Verde.
- **The class is every colliding node, not 617.** All five Sturgeon TxGIO ids collide with a
  real account: 97651 = 476 Catalina Ln (681,990), 97652 = 13749 Mesa Verde Dr (691,530),
  97653 = 13735 Mesa Verde Dr, 97657 = 13681 Mesa Verde Dr, 97658 = 13669 Mesa Verde Dr. The
  nodes the resolver now routes the customer to (97651, 97652, 97653, 97657) serve the Sturgeon
  polygons with those accounts' dollars and Austin anchors; 97651/97653/97657 show the label
  `STURGEON DR, SAN MARCOS` (TxGIO's situs) over market values near 600,000 to 690,000 for
  vacant lots the roll values at 50,130 to 50,390. H1's count of this class is 37,927 nodes.
- **The account-keyed node is hollow.** `48209:84639` was re-baked 2026-09-13T00:44:52Z with
  the right label, anchor and dollars and NO ring and NO cells (flood `refused
  parcel-record-cell-miss`); `parcel_record` and its cells are keyed by TxGIO prop_id. The
  resolver's crosswalk half of #668 sends "629 STURGEON" to this hollow node.

Net for the customer today: zero of five cards are right. The flood determination itself is
right on all five polygons (Zone AO, SFHA, no BFE, NFHL_48_20260101, point-on-surface) because
the cells are geometry-derived and the geometry is the lot's.

### The fix (option A, ruled by the overseer 2026-09-13; option B is a program-level identity change and stays with P-124/OPS-21)

The TxGIO-keyed node IS the Hays node: it has the polygon and the cells. What is wrong is the
join that fetches account attributes for it. For a gate-blocked county, every account-derived
attribute of a TxGIO-keyed node comes from the account the crosswalk names, never from
`cad_property` by bare number:

1. `artifacts/api-server/src/nodeFacetBakeTier1ConformantCli.ts` (and whatever `nodeFacetTier1ParcelJoin.ts`
   feeds it): for a county in the gate-blocked set, resolve the node's TxGIO prop_id to
   `txgio_parcel.geo_id`, then to the `cad_property` row whose `property_number` equals it
   (tax_year = the declared vintage), corroborated by `quick_ref_id` stem = the prop_id; take
   label (situs), anchor, cadRoll dollars, structural, land use, owner and value history from
   THAT row. When the crosswalk has no account (the 58,015 no-key population), the attributes
   are an honest absence with the reason `no-crosswalk-account`, never the colliding account's.
   When the crosswalk is ambiguous, refuse and name it. Provenance on the snapshot records
   `accountJoin: crosswalk` with the account id, so a reader can see which account fed the row.
2. The label for a vacant lot whose account situs carries no house number: keep the roll's
   situs as the label (honest), but the search hit that landed by containment carries the
   address-point string, and the card shows both (`629 STURGEON DR` from the roll;
   `615 STURGEON DR (address point)` from CAPCOG where the roll has none). Do not synthesize a
   number into the roll's situs.
3. The situs resolver: revert the crosswalk half of #668. A parcel-situs hit for a gate-blocked
   county resolves to the TxGIO-keyed node that carries the polygon (`629 STURGEON` → `48209:97658`
   once its attributes are right), not to the account-keyed hollow node. Keep containment
   (#668/#669) as it is. Tests that fail on the current behaviour.
4. Retire the account-keyed snapshots the P-175 publish wrote for gate-blocked counties
   (`48209:84639` and its siblings): they have no cells and answer to nothing once step 3
   lands. A retired path returns a decline; count them and name the count in the close.
5. Re-publish Hays tier-1, staging then production, on the pinned LDT that contains your
   merge (bump `_LDT_SHA` in hauska-factory `cloudbuild.publish.yaml` by PR; CI checks that
   pin). Read the run row, not the console. Then re-read `48209:97658`, `97651`, `97652`,
   `97653`, `97657` at depth node and paste ring, acreage, neighbours, label, market for each.

### Falsifiers, pre-registered

- If after step 5 node `48209:97658` shows a label other than `629 STURGEON DR` or a market
  other than 50,390, the crosswalk join did not reach the bake.
- If after step 5 node `48209:97652` shows any Mesa Verde attribute, the class is not fixed.
- If a node with no crosswalk account shows any account's dollars, the fallback re-introduced
  the collision.
- If CTX-HAYS-KEY's contradiction instrument (served address versus the account's own roll
  address, `_inbox/2026-09-10_ctx-hays-key_close.json`) reads more than 0 on production after
  the publish, the class is not fixed. Re-run it and paste the number; 37,479 was the baseline.
- If `node scripts/surface-probe.mjs --rows P-175` reads anything but PASS on all five, name
  which leg and why.

### Out of scope

Minting Hays nodes on the CAD PropertyID and re-keying the cells (option B; a P-124/OPS-21
identity ruling owed by the operator). Adopting the 8-26-2026 drop as the declared roll.
p78Merge's overwrite in other counties. `find_parcel near` distance-0 stacking (P-175 LB4;
measure it if you are in the file, otherwise carry it forward with an owner).

### Close

`_inbox/2026-09-13_p177-hays-attributes_close.json`, `planRows` `["P-177"]`, with the PR numbers
and merge SHAs with conclusion strings, the pin bump PR, both publish run ids, the five depth-node
reads, the contradiction count, the retired-snapshot count, the serving revisions read by field,
and the probe artifact. Write it in the doc_repo worktree the session running you is rooted in
and do not commit to doc_repo; the overseer commits. `leave_behind` is required.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-13_p177-hays-attributes_cp1.json
  CP2: _inbox/2026-09-13_p177-hays-attributes_cp2.json
  CLOSE: _inbox/2026-09-13_p177-hays-attributes_close.json
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
    "lane": "p177-hays-attributes",
    "planRows": ["P-177"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
