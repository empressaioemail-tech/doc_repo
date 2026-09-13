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

PLAN-ROW: P-152, P-167, P-179, P-180 (90_operations/OPS-16_texas_market_plan_of_record.md)

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


## Mission — OPS-23 WAVE 5 (dispatch planner, successor): the siblings and the panel, the Hays cells, the engine door, the last three strings

You are the DISPATCH PLANNER of OPS-23, the SUCCESSOR to the wave-4 planner. The topology is
`_decisions/2026-09-11_overseer_dispatch_planner_lane_topology.md` (active) and OPS-23 section
6. You are not a lane and not the overseer. You compile lane dispatches, spawn one sub-agent
per lane, supervise every one to completion, run the adversarial checkpoints on their output,
run the probe yourself, write the closes and the checkpoint, and report back to the overseer's
thread. You hold no state the plan, the missions and the checkpoint do not hold. You are
replaced, never extended, at the next checkpoint.

### Your seat and your first four commands

Seat `dispatch-planner`, worktree `P:/seat-worktrees/dispatch-planner/doc_repo`, branch
`seat/dispatch-planner`. Work only there; if your shell was opened elsewhere, `cd` there first
and run every command against that worktree. You never commit to doc_repo on any branch;
everything you write lands under `_inbox/` and `_dispatches/` IN THAT WORKTREE, and your final
report lists every path for the overseer to copy and commit by pathspec. Never overwrite a
close a previous wave wrote; a resumption writes a NEW dated file. Never run a git command
against a path that is not your registered worktree: two lanes did this on 2026-09-13 (one in
the shared `P:/hauska-engine` checkout, one in a second doc_repo clone) and both destroyed
uncommitted work.

```
git -C P:/seat-worktrees/dispatch-planner/doc_repo fetch origin
git -C P:/seat-worktrees/dispatch-planner/doc_repo merge --ff-only origin/main
git -C P:/seat-worktrees/dispatch-planner/doc_repo log --oneline -1
```

Then, in this order, and declare each in your first output: read
`90_operations/OPS-23_surface_completion_program.md` (sections 0, 2, 3, 4, 6, 7, 8); run
`node scripts/ops23-lane-status.mjs` and
`node scripts/surface-probe.mjs --rows P-152,P-167,P-175 --observations _inbox/2026-09-13_p152-slate_mcp_observations.json --allow-unmeasured`;
read `_inbox/2026-09-13_ops23-wave4_cp2.json`, the wave-4 close
`_inbox/2026-09-13_ops23-wave4_close.json` with the overseer's annotation, and the P-177 close
`_inbox/2026-09-13_p177-hays-attributes_close.json` with its annotation. You do not read your
predecessor's conversation. If the checkpoint and the instruments disagree, the instruments
win and the disagreement is the first entry in your error log. The card is
`_inbox/2026-09-11_ops23_ledger_serving_path_WDLL.md`.

### What wave 4 left you, and what was ruled since

Wave 4 executed the shared-resolver ruling (corpus 1.2.0 `./resolve`, three consumers, MCP and
endpoint agree on 30/10/30/20 dated 2026-04-14 for `48021:34049`) and closed the entitlement
gate in the engine and the MCP. Three seams remain and each has a lane here: the panel's own
axis override in hauska-map and five allowlist siblings with no per-rail slate entry (RULED
A-140: per-rail entries in both slate files, the representative-key grouping retired; operator
veto open); the engine store's Hays cells filled by a bare-number join, which is why the
Property Explorer still fails P-175 while the MCP passes (P-177, P-180); and the engine API
being public with no gate token in either project (F22, P-179). P-167's strings differ for
three named reasons (a missing `no-zoning-stamp` token, two hardcoded PDF labels in
`site-model.ts`, no `zoningProvenance` wire field). P-178 (the Hays declared roll) is a
hand-carried lane running in parallel on the property seat; it shares `legacy-design-tools`,
`cortex-api` and the LDT migration runner with you; its migration run is operator-signed and
watched, never yours to start.

### The wave

| Lane | Lane id | Mission file | `--repo` | Worktrees (register names) | Starts |
|---|---|---|---|---|---|
| P-152 lane 6 | `p152-siblings` | `_catalog/dispatch_missions/mission_p152_lane6_siblings_and_panel.md` | `hauska-engine` | `hauska-engine-p152-siblings`, `legacy-design-tools-p152-siblings`, `hauska-map-p152-siblings` | now |
| P-180 | `p180-hays-cells` | `_catalog/dispatch_missions/mission_p180_hays_cells_crosswalk.md` | `hauska-engine` | `hauska-engine-p180-hays-cells`, `hauska-factory-p180-hays-cells`, `legacy-design-tools-p180-hays-cells` | now; CP1 is the writer reading |
| P-179 | `p179-gate` | `_catalog/dispatch_missions/mission_p179_engine_gate_token.md` | `hauska-engine` | `hauska-engine-p179-gate`, `legacy-design-tools-p179-gate` | now; prepares, then STOPS for the operator at every mint, mount and IAM step |
| P-167 strings | `p167-strings` | `_catalog/dispatch_missions/mission_p167_strings_last_three.md` | `hauska-atom-contract` | `hauska-atom-contract-p167-strings` (substrate seat), `hauska-engine-p167-strings`, `hauska-map-p167-strings` | now |

Compile each lane's dispatch in your worktree, never by hand:

```
node scripts/dispatch.mjs --lane <lane id> --plan-row <row> --repo <repo> --mission-file <mission file>
```

### How you run a lane

One sub-agent per lane, the compiled dispatch verbatim with exactly one line prepended as the
FIRST line: `Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.` The
hooks check that line's position, the markers, the verbatim M0 block, an exit-bounded clause
and a named `_inbox/` close path; a blocked prompt is an uncompiled prompt; never add an
override line. The fan is exactly one level deep; you read every diff, run every check
yourself, adversarially review every deliverable, and replace a stalled sub-agent under
supervision with the same compiled dispatch. Two checkpoints per lane at the paths the
dispatch names. No wake-up arrives when a background command finishes: every lane polls with
a bound.

### Sequencing, leases and shared files

- All four lanes start now. p179-gate's live steps (mint, mount, IAM) each wait for the
  operator's go quoted into the planner's thread; its PRs stay unmerged until then.
- **hauska-engine is shared by all four lanes**; `hauska-engine-api` and `retrieval-api` by
  their deploys. **legacy-design-tools by three** (p152-siblings, p180-hays-cells, p179-gate)
  plus P-178 outside the wave; `cortex-api` by their deploys. **hauska-map by two**
  (p152-siblings, p167-strings). Every deploy is from `origin/main` after merge, one at a time,
  under the lease you write in `_catalog/leases/<service>.json` (AGENT_CONTRACT section 3) and
  release only after the serving revision is read by field and your probe has run; the hook
  `traffic-lease-gate` refuses a shift without the lease in this worktree. Delete the lease
  file when you release it. Batch deploys where two lanes' merges are both ready, one shift.
  P-179's engine deploy is last of all and only on the operator's go.
- Rebase before every PR, re-green on the current base, merge only on the conclusion string
  `success`, read PRs by number.
- **Data jobs are serialised**: p180's writer re-run for 48209 and 48491 (staging, then
  production) is the only data job this wave; P-178's load is the operator's and not yours.
- The corpus and contract publishes (P-167's 1.34.0) gate that lane's consumer bumps.

### What stops for the operator

A new credential or secret mount; an IAM change; an irreversible deletion; any claim that has
failed its own test twice. p179-gate hits the first three by design. The operator runs
`get_smart_site`, `run_report` and `export_instrument` on request and pastes what they see;
p152-siblings needs the panel setbacks for `48021:34049` and `48021:33223` after its deploy;
p180 needs one look at the 629 Sturgeon card on smartsite.cloud after its publish; p167-strings
needs the five feasibility PDFs if the export path is not callable by you. Ask once per lane,
early.

### The predicate, and who runs it

R-4. After a lane's deploy is serving, YOU run `node scripts/surface-probe.mjs --rows <row>
--observations <file>`; observations carry `observedBy` and `observedAt`; an artifact is a file
`scripts/surface-probe.mjs` wrote, never a hand-made file with its name. A close that is not
PASS says `closed-partial` or `blocked`, names its rows in `planRows`, and cites the artifact
that measured it. Predicates this wave: P-152 (readPath record; panel equals MCP on setbacks
for all five parcels); P-175 for P-180 (all five Sturgeon addresses PASS through the Find box);
P-167 (strings identical; locks deleted; importers at their pins); P-179 has no probe row: its
predicate is the violation read pasted in its close (401 without the token on the public URL).

Pre-registered falsifiers, one per lane, into CP1 before any code:

- p152-siblings: if after all three deploys the panel prints anything but 30/10/30/20 for
  `48021:34049`, or a slated pair serves a value that differs from its cell, not done.
- p180-hays-cells: if the facets payload for `48209:97658` prints a situs other than
  `629 STURGEON DR` after the re-run, or any non-blocked county's cells change on the control
  run, wrong.
- p179-gate: if a token-less call still returns data after the engine mount, or a caller loses
  its reads during the rollout, wrong.
- p167-strings: if any string differs on any surface after the three deploys, name it.

### Closes, checkpoint, report

Per-lane closes at `_inbox/<date>_<lane id>_close.json` per AGENT_CONTRACT section 6 plus the
OPS-23 four fields; the wave-level close names every row in `planRows` with `status` `closed`
only if all are PASS, and its `rowStatuses` must agree with each row's own close. Checkpoint
`_inbox/<date>_ops23_checkpoint_5.md` after the second close and at the end of the wave. Your
final message is the wave report and nothing else, in the wave-4 shape: per lane status, PRs
with merge SHAs and conclusion strings, serving revisions by field, probe artifact and
verdicts, `contradicted`, `leave_behind`; every file you wrote, as paths; the error log in the
section 10 shape; the operator-owed items you hit; the lane board and the final probe output
pasted verbatim.

### What you must not do

Commit to doc_repo. Write outside your worktree. Overwrite a previous wave's close. Run a git
command against any path that is not your registered worktree. Edit the plan, the card, a
mission or a decision record. Add an override line to a blocked prompt. Widen a check. Read a
working tree to verify a deploy. Vouch for a claim you did not verify by violation. Carry a
ruling that is not in a decision record. Mint, mount or print a secret. Change IAM. Run a data
load from a laptop, or let a lane do so. Search for a PR by title token when its number is
known. Spawn a sub-agent that spawns.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-13_ops23-wave5_cp1.json
  CP2: _inbox/2026-09-13_ops23-wave5_cp2.json
  CLOSE: _inbox/2026-09-13_ops23-wave5_close.json
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
    "lane": "ops23-wave5",
    "planRows": ["P-152", "P-167", "P-179", "P-180"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
