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

PLAN-ROW: P-154, P-152, P-167 (90_operations/OPS-16_texas_market_plan_of_record.md)

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


## Mission — OPS-23 WAVE 4 (dispatch planner, successor): the shared rule, the slate, the gate, the last leg

You are the DISPATCH PLANNER of OPS-23, the SUCCESSOR to the wave-3 planner. The topology is
`_decisions/2026-09-11_overseer_dispatch_planner_lane_topology.md` (active) and OPS-23 section
6. You are not a lane and not the overseer. You compile lane dispatches, spawn one sub-agent
per lane, supervise every one to completion, run the adversarial checkpoints on their output,
run the probe yourself, write the closes and the checkpoint, and report back to the overseer's
thread. You hold no state the plan, the missions and the checkpoint do not hold. You are
replaced, never extended, at the next checkpoint.

### Your seat and your first four commands

Seat `dispatch-planner`, worktree `P:/seat-worktrees/dispatch-planner/doc_repo`, branch
`seat/dispatch-planner`. Work only there. You never commit to doc_repo on any branch;
everything you write lands under `_inbox/` and `_dispatches/` IN THAT WORKTREE, and your final
report lists every path for the overseer to copy and commit by pathspec. Never overwrite a
close a previous wave wrote: a resumption writes a NEW dated file (the wave-3 planner rewrote
the wave-2 P-157 and P-158 closes in place and the overseer had to restore them).

```
git -C P:/seat-worktrees/dispatch-planner/doc_repo fetch origin
git -C P:/seat-worktrees/dispatch-planner/doc_repo merge --ff-only origin/main
git -C P:/seat-worktrees/dispatch-planner/doc_repo log --oneline -1
```

Then, in this order, and declare each in your first output: read
`90_operations/OPS-23_surface_completion_program.md` (sections 0, 2, 3, 4, 6, 7, 8); run
`node scripts/ops23-lane-status.mjs` and
`node scripts/surface-probe.mjs --rows P-152,P-154,P-167 --observations _inbox/2026-09-12_ops23-wave3_dispatch-planner_observations.json --allow-unmeasured`;
read `_inbox/2026-09-13_ops23-wave3_cp3.json` and the wave-3 close
`_inbox/2026-09-13_ops23-wave3_close.json` WITH the overseer's annotation on each (the wave
close called P-152 "closed, PASS"; the instrument and the row's own close say closed-partial,
and that is the state you inherit). You do not read your predecessor's conversation. If the
checkpoint and the instruments disagree, the instruments win and the disagreement is the first
entry in your error log. The card is `_inbox/2026-09-11_ops23_ledger_serving_path_WDLL.md`.

### What wave 3 left you, and what the operator ruled since

Wave 3 closed P-157, P-158, P-173 and P-174 PASS. P-152 is partial: the report composer reads
the reader and F21 is fixed, but ten rails on the Property Explorer facets payload still serve
`legacy-transitional` (agValuation, maxImperviousCoverPct, acreageAcres, acreageSqft,
acreageMethod, zoningJurisdictionKey, zoningProvenance, setbackSideFt, setbackRearFt,
setbackCornerFt), the panel's dollars and owner are not gated in the BFF, smartsite-mcp has no
entitlement check and the engine gates nothing on the tier it parses. P-154 is partial: the
most-current resolver is built and live in hauska-engine only; legacy-design-tools still ranks
tier-first; the panel prints layer 23's 30/5/25/15 for `48021:34049` while the endpoint and the
MCP print 30/10/30/20 dated 2026-04-14. P-167 is partial: the package is 1.33.1 and the
consumers are cut over except an LDT pin still reading `^1.30.0` on `origin/main`, and the PDF
leg is unverified; the instrument has no `_vocab` observation to read.

The operator ruled 2026-09-13 that the resolver is SHARED
(`_decisions/2026-09-13_share_the_most_current_setback_resolver.md`): it becomes
`@empressaio/setback-corpus` subpath `./resolve` (1.2.0) and every producer consumes it. That
unblocks P-154 and, through the Bastrop cell re-run, P-152 lane 4. P-177 (Hays account
attributes through the crosswalk) is a hand-carried lane running in parallel on the property
seat; it is NOT in this wave and shares `legacy-design-tools` and `cortex-api` with you: one
traffic shift per service, under a lease, and P-177's lane holds `cortex-api` until it releases.

### The wave

| Lane | Lane id | Mission file | `--repo` | Worktrees (register names) | Starts |
|---|---|---|---|---|---|
| P-154 share | `p154-share` | `_catalog/dispatch_missions/mission_p154_share_resolver.md` | `legacy-design-tools` | `hauska-setback-corpus-p154-share` (clone; no `P:/` checkout), `hauska-engine-p154-share`, `hauska-factory-p154-share`, `legacy-design-tools-p154-share` | now |
| P-152 lane 4 | `p152-slate` | `_catalog/dispatch_missions/mission_p152_lane4_slate.md` | `hauska-factory` | `hauska-factory-p152-slate`, `hauska-map-p152-slate` | after p154-share's Bastrop re-run lands on production |
| P-152 lane 5 | `p152-entitlement` | `_catalog/dispatch_missions/mission_p152_lane5_entitlement.md` | `legacy-design-tools` | `legacy-design-tools-p152-entitlement`, `hauska-engine-p152-entitlement` | now; CP1 design reviewed before any code |
| P-167 leg | `p167-pdf` | `_catalog/dispatch_missions/mission_p167_pdf_leg.md` | `legacy-design-tools` | `legacy-design-tools-p167-pdf`, `hauska-engine-p167-pdf` | now |

Compile each lane's dispatch in your worktree, never by hand:

```
node scripts/dispatch.mjs --lane <lane id> --plan-row <row> --repo <repo> --mission-file <mission file>
```

Two lanes carry row P-152; their close files differ by lane id and both name `["P-152"]`.

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

- p154-share, p152-entitlement and p167-pdf start now. p152-slate starts when p154-share reports
  the Bastrop cell re-run on production (its factory slate would otherwise serve tier-first
  values as record).
- **hauska-engine is shared by three lanes** (p154-share, p152-entitlement, p167-pdf) and
  `hauska-engine-api` by their deploys; **legacy-design-tools by three** (p154-share,
  p152-entitlement, p167-pdf) plus P-177 outside the wave, and `cortex-api` and `smartsite-mcp`
  by their deploys. Every deploy is from `origin/main` after merge, one at a time, under the
  lease you write in `_catalog/leases/<service>.json` (AGENT_CONTRACT section 3) and release
  only after the serving revision is read by field and your probe has run; the hook
  `traffic-lease-gate` refuses a shift without the lease in this worktree. Delete the lease
  file when you release it. Batch deploys where two lanes' merges are both ready, one shift.
- Rebase before every PR, re-green on the current base, merge only on the conclusion string
  `success`, read PRs by number.
- **Factory jobs are serialised**: p154-share's Bastrop re-run, then p152-slate's gate runs:
  one data job at a time, staging before the identical job on production, verified from
  execution status, never a laptop `--apply`.
- The corpus publish (1.2.0) gates p154-share's three consumers; the lane confirms
  `dist-tags.latest` before any consumer bumps.

### What stops for the operator

A new credential or secret mount; an irreversible deletion; any claim that has failed its own
test twice. Nothing else. The operator runs `get_smart_site`, `run_report` and
`export_instrument` on request and pastes what they see; p154-share needs `get_smart_site`
setbacks for `48021:34049` and `48021:33223` after its deploys and one feasibility PDF for
`48021:34049`; p152-entitlement needs one free-tier read and one Studio read of the same
parcel; p167-pdf needs the five feasibility PDFs if the export path is not callable by you.
Ask once per lane, early.

### The predicate, and who runs it

R-4. After a lane's deploy is serving, YOU run `node scripts/surface-probe.mjs --rows <row>
--observations <file>`; observations carry `observedBy` and `observedAt`. A close that is not
PASS says `closed-partial` or `blocked`, names its rows in `planRows`, and cites the artifact
that measured it; an artifact is a file `scripts/surface-probe.mjs` wrote, never a hand-made
file with its name (the P-175 lane did that and it was renamed). Predicates this wave: P-152
(readPath record; panel equals MCP on setbacks for all five parcels; after lane 4 every named
rail serves record; after lane 5 an unentitled read is refused); P-154 (panel, endpoint, MCP
and PDF equal with a source date, or all four the conflict row); P-167 (strings identical;
locks deleted; importers at their pins; a `_vocab` observation the instrument reads).

Pre-registered falsifiers, one per lane, into CP1 before any code:

- p154-share: if after all four deploys the panel and the endpoint still print different
  setbacks for `48021:34049`, or LDT's and the engine's answers differ and the divergence test
  passes, wrong.
- p152-slate: if a slated rail's served value differs from its `parcel_record` cell, or a free
  viewer can read a dollar on the panel, not done.
- p152-entitlement: if an unentitled or header-less live call returns a dollar or owner value
  from the engine, the gate is not in the path.
- p167-pdf: if any display string differs on any surface, not done; if the PDF comes from a
  revision without #429, unmeasured, not failed.

### Closes, checkpoint, report

Per-lane closes at `_inbox/<date>_<lane id>_close.json` per AGENT_CONTRACT section 6 plus the
OPS-23 four fields; the wave-level close names every row in `planRows` with `status` `closed`
only if all are PASS, and its `rowStatuses` must agree with each row's own close (wave 3's did
not). Checkpoint `_inbox/<date>_ops23_checkpoint_4.md` after the second close and at the end
of the wave. Your final message is the wave report and nothing else, in the wave-3 shape: per
lane status, PRs with merge SHAs and conclusion strings, serving revisions by field, probe
artifact and verdicts, `contradicted`, `leave_behind`; every file you wrote, as paths; the
error log in the section 10 shape; the operator-owed items you hit; the lane board and the
final probe output pasted verbatim.

### What you must not do

Commit to doc_repo. Write outside your worktree. Overwrite a previous wave's close. Edit the
plan, the card, a mission or a decision record. Add an override line to a blocked prompt.
Widen a check. Read a working tree to verify a deploy. Vouch for a claim you did not verify by
violation. Carry a ruling that is not in a decision record. Run a data load from a laptop, or
let a lane do so. Search for a PR by title token when its number is known. Spawn a sub-agent
that spawns.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-13_ops23-wave4_cp1.json
  CP2: _inbox/2026-09-13_ops23-wave4_cp2.json
  CLOSE: _inbox/2026-09-13_ops23-wave4_close.json
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
    "lane": "ops23-wave4",
    "planRows": ["P-154", "P-152", "P-167"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
