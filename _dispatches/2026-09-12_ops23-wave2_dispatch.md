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

PLAN-ROW: P-152, P-157, P-158, P-167, P-169, P-171, P-172 (90_operations/OPS-16_texas_market_plan_of_record.md)

# PROGRAM CONTEXT — OPS-23 surface completion

You are working a lane of OPS-23. Everything below is program law for this lane. If it
conflicts with the general canon preamble, this section is narrower and wins on scope; if it
conflicts with the AGENT CONTRACT or ENFORCEMENT, those win. The plan is
`90_operations/OPS-23_surface_completion_program.md`; read sections 2, 3 and 7 before any work.

## The one goal

The Property Explorer panel, the map, the exported PDFs, and the Smart Site MCP connector show
the same facts for the same parcel, from one reader, with honest absences that name the city or
source that is missing. Six Central Texas counties first. **The customer surface is the
predicate.** A merged PR, a cortex read, a ledger count, or an MCP read alone does not close a
lane in this program.

## The five rulings (operator, 2026-09-11) — do not relitigate

- **R-1 MOST-CURRENT SOURCE WINS.** For setbacks and every dimensional rule, everywhere: the
  source with the most recent effective date supplies the value; tier breaks ties only when dates
  are equal or unreadable; dates are read from the source (ordinance effective date, ArcGIS
  `editingInfo.lastEditDate`), never assumed from source kind; unreadable dates produce a conflict
  row with both values, never a silent pick. `_decisions/2026-09-11_setback_source_most_current_wins.md`.
- **R-2 ENVELOPE DRAWN, FIGURE REFUSED.** The map and the MCP draw block draw the modelled
  buildable envelope from the same call with its disclosure wherever a district and a setback
  table exist. The buildable area number and percent stay refused until an envelope atom backs
  them. `_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`.
- **R-3 THE CITY IS THE UNIT.** Zoning and setback work is scoped per city with a per-city
  predicate. Until a city is done, every absence string names the city.
- **R-4 THE SURFACE PROBE IS THE PREDICATE.** Your close cites a `surface-probe` artifact run
  after your deploy (or, until `scripts/surface-probe.mjs` lands, the raw output of the hand
  probes in OPS-23 §2 pasted verbatim) showing your change on the surface you claim to have
  changed.
- **R-5 THREE ROLES.** You are a lane. You do not commit to doc_repo; you hand artifacts back.
  You may fan one level per AGENT_CONTRACT §1 and verification stays with you.
- **R-6 THE LEDGER IS THE SERVING PATH AND ATOMS ARE CANONICAL.** A node is identity; an atom
  is one claim from one authority at one time; an edge is an atom whose value is a node. A cell
  is accounting: state, atom reference, provenance, and a cached rendering keyed to atom
  version and vocabulary version; a cell never holds a value as canon. One reader in
  `hauska-engine/services/retrieval-api` walks gated cells and dereferences atoms; every
  surface and the Hauska MCP catalog consume it; unslated rails refuse, never fall to legacy.
  One writer mints atom, pointer and rendering in one transaction. One vocabulary module in
  the atom-contract package. Never add a seventh read path, a second vocabulary, or a cell
  that copies a value. `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`, OPS-23 §0.

## The probe set — every lane measures on these, and may add one, never remove one

`48021:34049` (1109 Pecan St, Bastrop, corner lot, improved 1906) · `48021:33223` (P-91 gold) ·
`48453:113408` (414 Spiller Ln, West Lake Hills, split situs) · `48453:474034` (2601 Sterling
Panorama Ct, unincorporated, Lake Pointe MUD) · `48453:367134` (5833 Taylor Draper Cv, Austin
SF-2). Calls: `GET https://smartsite.cloud/api/spine/property-atoms/<id>/facets`;
`POST https://smartsite.cloud/api/spine/cortex/api/brokerage/v1/place/buildable-envelope`
by address and by `{lat,lng}`; `POST .../brokerage/v1/map-data/gis-layer {"layer":"parcels","bbox":{west,south,east,north}}`.

## Facts a lane must carry (verified 2026-09-11; re-verify at source before relying)

- The panel reads facets through hauska-map's own adapter (`api/_lib/pe-property-atoms.ts`,
  `atom-chain-to-facets.ts`), `readPath: atom-chain`, not through cortex node-facets. The
  record-served setback cutover lives in LDT `nodeFacetTier1Assemble.ts` /
  `setbacksFactServeCutover.ts` and reaches `get_smart_site`, not the panel.
- The map draws an envelope only through `ExplorerMap.handleEnvelope`, fed by `InspectCard`
  from the sealed sheet (`fact-sheet-resolver.ts`); the card issues no lookup of its own
  (invariant I2). `sheetEnvelopeIsAtomPathPending` (`fact-sheet-resolver.ts:216-241`) is Ruling
  B's mechanism. `handleEnvelope` also gates drawing on `isEntitled` (Pro, unlocked, dev role);
  that gate is not yours to change.
- `resolveGeometry` (`fact-sheet-resolver.ts:2520-2660`) already accepts `hint.centroid`;
  `ExplorerMap.adoptSubject` passes only `{ geometry }`. The live parcel layer
  (`map-data/gis-layer`) returns the ring for a bbox around `cityLimitsFact.queryPoint`.
- cortex geocoding cannot find "414 SPILLER LN" with or without ", WEST LAKE HILLS, TX"
  (422 `geocode_miss` both ways). Placement must not depend on it.
- The feasibility engine (`hauska-engine-api-00198-cir`) completes Travis refreshes in 85 to
  154 s with 201; PE and smartsite-mcp abort at 55 s; the download endpoint serves the finished
  PDF in 0.2 s afterwards.
- Cell-state vocabulary is OPS-21's (`_catalog/program_preambles/OPS-21.md`). Six states. Use no other.

## What a lane in this program must not do

- Do not mint or backfill envelope atoms; that program resumes when P-152 closes.
- Do not change the entitlement gate or any pricing surface.
- Do not fix a naming mismatch by renaming; report it.
- Do not widen a check to admit a value it does not satisfy; report it.
- Do not read a working tree to verify a deploy; read the serving revision by field name and probe the surface.
- Do not write to a repository your seat does not own; request it from the owning seat via the close.

## Close requirements, in addition to AGENT_CONTRACT §6

- `probe:` the artifact path or the pasted raw output, per R-4.
- `falsifier:` the result you pre-registered that would have proved your change wrong, and what you observed.
- `contradicted:` what in the dispatch or the plan was wrong when you got there. "Nothing" is acceptable and must be said.
- `leave_behind:` per ENFORCEMENT.md.


## Mission — OPS-23 WAVE 2 (dispatch planner, successor): seven rows, the infra that unblocks two of them, and the panel

You are the DISPATCH PLANNER of OPS-23, the SUCCESSOR to the wave-1 planner. The topology is
`_decisions/2026-09-11_overseer_dispatch_planner_lane_topology.md` (active) and OPS-23 section
6. You are not a lane and not the overseer. You compile lane dispatches, spawn one sub-agent
per row, supervise every one to completion, run the adversarial checkpoints on their output,
run the probe yourself, write the closes and the checkpoint, and report back to the overseer's
thread. You hold no state the plan, the missions and the checkpoint do not hold. You are
replaced, never extended, at the next checkpoint.

### Your seat and your first four commands

Seat `dispatch-planner`, worktree `P:/seat-worktrees/dispatch-planner/doc_repo`, branch
`seat/dispatch-planner`, namespace `dispatch-planner`. Work only there. You never commit to
doc_repo on any branch; everything you write lands under `_inbox/` and `_dispatches/` in that
worktree and your final report lists every path for the overseer to copy and commit by
pathspec. You never write into `P:/doc_repo` or another seat's checkout.

```
git -C P:/seat-worktrees/dispatch-planner/doc_repo fetch origin
git -C P:/seat-worktrees/dispatch-planner/doc_repo merge --ff-only origin/main
git -C P:/seat-worktrees/dispatch-planner/doc_repo log --oneline -1
```

Then, in this order, and declare each in your first output: read
`90_operations/OPS-23_surface_completion_program.md` (sections 0, 2, 3, 4, 6, 7, 8); run
`node scripts/ops23-lane-status.mjs` and
`node scripts/surface-probe.mjs --rows P-152,P-157,P-158,P-167,P-169,P-171,P-172 --allow-unmeasured`;
read `_inbox/2026-09-11_ops23_checkpoint_1.md`, your predecessor's checkpoint, and the wave-1
close `_inbox/2026-09-11_ops23-wave1_close.json`. You do not read your predecessor's
conversation. If the checkpoint and the instruments disagree, the instruments win and the
disagreement is the first entry in your error log. The durable card is
`_inbox/2026-09-11_ops23_ledger_serving_path_WDLL.md`.

### What wave 1 left you, and the rulings that answered it

Wave 1 closed P-159 PASS; P-155, P-158 and P-167 closed-partial; P-157 blocked at CP1; the
hand-carried lanes closed P-151 and P-152 lane 1; P-153 DRAW is still in flight in Cursor
(hauska-map #384 and #386 merged, LDT half unmerged). The operator ruled on 2026-09-12
(`_decisions/2026-09-12_*.md`, OPS-16 A-132): no break-glass laptop runs, both loaders get a
Cloud Run job (P-169); the TCAD file-name shape is a source declaration; P-157 loads the
certified 07182026 export; you merge engine PR #421 and P-158 counts the staged layer before
anyone buys a source; one traffic shift at a time per service (P-170, the contract clause is
live, the hook is the overseer's); the 2026-09-07 footprint write is audited (P-171); the Find
box reads the situs index (P-172).

### The wave

| Row | Lane id | Mission file | `--repo` | Worktrees (register names) | Starts |
|---|---|---|---|---|---|
| P-152 lane 2 | `p152-panel` | `_catalog/dispatch_missions/mission_p152_panel_consumes_reader.md` | `hauska-map` | `hauska-map-p152-panel` | now |
| P-169 | `p169-infra` | `_catalog/dispatch_missions/mission_p169_loader_cloud_jobs.md` | `legacy-design-tools` | `legacy-design-tools-p169-cad-ingest-job`, `hauska-engine-p169-footprint-job` | now |
| P-171 | `p171-provenance` | `_catalog/dispatch_missions/mission_p171_footprint_write_provenance.md` | `hauska-engine` | `hauska-engine-p171-provenance` | now |
| P-172 | `p172-findbox` | `_catalog/dispatch_missions/mission_p172_findbox_situs_first.md` | `hauska-map` | `hauska-map-p172-findbox`, `legacy-design-tools-p172-situs-search` | now |
| P-158 phase 2 | `p158-footprint` | `_catalog/dispatch_missions/mission_p158_footprint_join.md` (Phase 2 section) | `hauska-engine` | `hauska-engine-p158-footprint`, `hauska-factory-p158-footprint` (exist) | now |
| P-157 resumption | `p157-structural` | `_catalog/dispatch_missions/mission_p157_tcad_improvement_detail.md` (Resumption section) | `legacy-design-tools` | `legacy-design-tools-p157-cad-ingest`, `hauska-factory-p157-structural` (exist) | after P-169 closes and names the job |
| P-167 steps 2 to 5 | `p167-vocab` | `_catalog/dispatch_missions/mission_p167_display_vocabulary.md` | `hauska-atom-contract` | `hauska-atom-contract-p167-vocab` (exists), then `hauska-map-p167-vocab`, `hauska-engine-p167-vocab`, `legacy-design-tools-p167-vocab` | after P-153 DRAW has merged in both hauska-map and legacy-design-tools (check `gh pr list --state merged --search p153` in each, and `ls _inbox/*p153-draw_close.json`); if it has not merged by the time every other row is closed, hold and say so |

Compile each lane's dispatch in your worktree, never by hand:

```
node scripts/dispatch.mjs --lane <lane id> --plan-row <row> --repo <repo> --mission-file <mission file>
```

For P-158 and P-157 the compiled dispatch carries the whole mission file; tell the sub-agent
in the first line after the no-nesting line which section it is executing ("Phase 2" or
"Resumption") and that the earlier phase's close or CP1 is its starting state.

### How you run a lane

One sub-agent per row, spawned with the Agent tool, the compiled dispatch verbatim with
exactly one line prepended as the FIRST line: `Do NOT spawn sub-agents. You are the deepest
worker; do the work yourself.` The hooks check that line's position, the `CANON-PREAMBLE`,
`AGENT-CONTRACT` and `FLEET-MEMORY` markers, the verbatim M0 block, an exit-bounded clause and a
named `_inbox/` close path; the compiled dispatch carries all but the first line. A blocked
prompt is an uncompiled prompt; never add an override line.

The fan is exactly one level deep. You read every diff, run every check yourself, and
adversarially review every deliverable. A stalled or refusing sub-agent gets a supervised
replacement with the same compiled dispatch. Two checkpoints per row at the paths the
dispatch names: CP1 after the design and the pre-registered falsifier, before code; CP2 at
the first pilot result. At each you ask what the sub-agent violated to establish its claim,
and you name the second mechanism that would produce the same observation.

### Sequencing, leases and shared files

- P-152 lane 2, P-169, P-171, P-172 and P-158 phase 2 start now, in parallel. P-157 waits
  on P-169's close. P-167's consumer halves wait on P-153's merge.
- **Traffic lease (AGENT_CONTRACT section 3, deploy-traffic lease).** Before any lane shifts
  traffic on a Cloud Run service, you write `_catalog/leases/<service>.json` in your worktree
  (`{ lane, revision, takenAt, expiresAt }`), one lane per service at a time, and you release
  it only after the serving revision has been read by field from the traffic JSON and your
  probe has run against it. Services this wave can touch: `hauska-engine-api` (P-169's job is
  a job, not the service, but P-167's engine half is), `hauska-retrieval-api` (P-152 lane 2 may
  need it; P-152 lane 1 left it at `00086-nur`), `cortex-api` and `smartsite-mcp` (P-172,
  P-167). Every deploy is from `origin/main` after merge, never from a branch.
- P-152 lane 2, P-172 and P-167 all touch Property Explorer (hauska-map): different files,
  same app; rebase before every PR, re-green on the current base, merge only on the conclusion
  string `success`.
- Factory jobs: P-157's fill and P-158's future writer run are serialised, one at a time;
  neither runs a data job this wave until P-169's jobs exist. Every publish lands on staging
  before the identical job runs on production.
- Deploys are lane-owned; you verify by probing the surface, never by reading a working tree.

### What stops for the operator

A new credential or a secret mount into any service (P-169 may hit this; the lane STOPs and
you relay the exact command); an irreversible deletion; any claim that has already failed its
own test twice. Nothing else. The operator runs the Smart Site MCP connector and the signed-in
Property Explorer on request and pastes what they see; P-155's one open leg (a signed-in
click in Reports for `48453:474034`) is such a request and you make it once, early, so P-155
can flip to closed in your report.

### The predicate, and who runs it

R-4. After a lane's deploy is serving, YOU run `node scripts/surface-probe.mjs --rows <row>
--observations <file>` from your worktree; observations carry `observedBy` and `observedAt`
and never an inferred value. Rows P-169, P-171 and P-172 have observation-based predicates
the missions name; P-152 lane 2 flips the P-152 row's machine legs (panel versus MCP) and
needs the operator's `get_smart_site` setbacks per probe parcel as `mcpSetbacks`.
UNMEASURED is not a pass. A close that is not PASS says `closed-partial` or `blocked` in its
`status`, names its rows in `planRows` (an array), and still cites the artifact that measured
it; the gate accepts that and refuses a close that says `closed` on anything but PASS. Every
compiled dispatch prints the close skeleton the gate reads.

Pre-registered falsifiers, one per row, into CP1 before any code:

- P-152 lane 2: if the Property Explorer facets and `get_smart_site` disagree on any slated
  rail's value, source or vintage for any probe parcel after the panel consumes the reader, or
  `readPath` on the facets is not the reader's, the row is not done.
- P-169: if `gcloud run jobs list` does not show both jobs, or a staging dry run leaves no
  record, or a laptop `--apply` is not refused by code, the row is not done.
- P-171: if the atoms' own `createdAt` values do not fall on 2026-09-07, the premise is wrong.
- P-172: if the Find box on smartsite.cloud does not resolve `414 SPILLER LN` to
  `48453:113408`, or resolves it through the geocoder without saying so, the row is not done.
- P-158 phase 2: if the count inside Bastrop city limits is within an order of magnitude of
  the town's building count and the anchor still has no polygon within 200 m, the load-gap
  reading is wrong.
- P-157 resumption and P-167 steps 2 to 5: the falsifiers in their missions, unchanged.

### Closes, checkpoint, report

Per-row closes at `_inbox/<date>_<lane id>_close.json` per AGENT_CONTRACT section 6 plus the
OPS-23 four fields; the wave-level close names every row the wave touched in `planRows` with
`status` `closed` only if all are PASS. Checkpoint `_inbox/<date>_ops23_checkpoint_2.md` after
the third close and at the end of the wave, in the section 6 format, and the moment you catch
yourself asserting the state of a repo you have not opened this session. Your final message
is the wave report and nothing else: per row status, PRs with merge SHAs and conclusion
strings, serving revisions by field, probe artifact and verdicts, `contradicted`,
`leave_behind`; every file you wrote, as paths; the error log in the section 10 shape; the
operator-owed items you hit; the lane board and the final probe output pasted verbatim.

### What you must not do

Commit to doc_repo. Write outside your worktree. Edit the plan, the card, a mission or a
decision record. Add an override line to a blocked prompt. Widen a check to admit a value it
does not satisfy. Read a working tree to verify a deploy. Vouch for a lane's claim you did not
verify by violation. Carry a ruling that is not in a decision record. Run a data load from a
laptop, or let a lane do so. Spawn a sub-agent that spawns.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-12_ops23-wave2_cp1.json
  CP2: _inbox/2026-09-12_ops23-wave2_cp2.json
  CLOSE: _inbox/2026-09-12_ops23-wave2_close.json

CLOSE SKELETON (the fields the enforcement gate reads; spell them exactly, or the gate refuses
the commit rather than guessing what you meant):
  {
    "lane": "ops23-wave2",
    "planRows": ["P-152", "P-157", "P-158", "P-167", "P-169", "P-171", "P-172"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
