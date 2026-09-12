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

PLAN-ROW: P-169 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

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


## Mission — P-169 INFRA: the two loaders that had no cloud execution path get one

You are the deepest worker in OPS-23 wave 2. You do not spawn sub-agents. The dispatch
planner supervises you, reviews your design at CP1 and your first pilot at CP2, and runs the
surface probe itself; your own runs are evidence, not the close.

Exit-bounded verification: every command you run must terminate on its own; wrap anything
that could hang in `timeout`; never leave a watch, a tail or a dev server running. A Cloud Run
job execution is verified from its execution status (`gcloud run jobs executions describe`,
read by field), never by polling a store while it writes.

### Where you work

Two repos, both property seat, both registered in `_catalog/seat_register.json`. Create each
from `origin/main` and declare its start commit before you write anything:

- `empressaioemail-tech/legacy-design-tools`, worktree `P:/seat-worktrees/property/legacy-design-tools-p169-cad-ingest-job`, branch `feat/p169-cad-ingest-cloud-job`. The CAD loader (`lib/cad-ingest`).
- `empressaioemail-tech/hauska-engine`, worktree `P:/seat-worktrees/property/hauska-engine-p169-footprint-job`, branch `feat/p169-footprint-writer-cloud-job`. The footprint writer (`packages/engine-core/scripts/write-building-footprint-county.mjs` or wherever `write-building-footprint-county.mjs` lives; confirm the path at your start commit).

`P:/legacy-design-tools` and `P:/hauska-engine` are other people's checkouts. Never build there.
You read `hauska-factory` only to copy its job pattern; you do not write there.

### The ruling you are implementing

`_decisions/2026-09-12_loaders_get_cloud_jobs_no_break_glass.md`: no break-glass laptop run;
both loaders get a Cloud Run job mirroring the factory job pattern; each job leaves a run
record naming every input file with its hash; each carries a code-level laptop refusal; the
TCAD file-name shape is a per-county source declaration in the loader's own registry. OPS-16
P-169 (A-132).

### What is true today, verified 2026-09-11 by the P-157 and P-158 lanes (their artifacts are the record)

- `gcloud run jobs list --project hauska-prod-497015 --region us-east4`: 36 jobs, every one
  `factory-<jobname>` wrapping a hauska-factory `src/jobs/*.mjs` script; `us-central1` has no
  jobs (only services). No job wraps `lib/cad-ingest` and none wraps the footprint writer
  (`_inbox/2026-09-11_p157-structural_cp1.json` F-CP1-1; `_inbox/2026-09-11_p158-footprint_close.json`
  leave_behind PRIMARY BLOCKER).
- legacy-design-tools has no Dockerfile, `cloudbuild*.yaml` or CI deploy step under
  `lib/cad-ingest/`; its `package.json:17` defines only `"cad-ingest": "tsx src/cli.ts"`,
  invoked per its own usage header as `pnpm --filter @workspace/cad-ingest cad-ingest --
  --county=... --file=...`, reading a plain `DATABASE_URL` (`cli.ts:254-256`) with no
  staging-versus-production selector. `sources.ts` documents Hays (48209) as a manual download
  plus a local CLI run: the tool's designed mode is a laptop.
- The PACS loader (`lib/cad-ingest/src/pacs/parser.ts`) reads `*_APPRAISAL_INFO.TXT` and
  optionally `*_APPRAISAL_IMPROVEMENT_DETAIL.TXT`; `cli.ts:123-135 discoverFiles` finds them by
  name. The live Travis certified export (`2026 Certified Appraisal Export Supp 0_07182026.zip`,
  557,228,168 bytes, declared tax year 2026) names its entries `PROP.TXT` (4,895,747,376
  bytes), `IMP_DET.TXT` (2,065,539,840), `IMP_INFO.TXT`, `LAND_DET.TXT`, `IMP_ATR.TXT`; byte
  layout confirmed correct against `pacs/layout.ts` (propValYr 2026 read from a live `IMP_DET.TXT`
  record). The names do not match the discovery pattern. Program law: never fix a naming
  mismatch by renaming; this is a source shape and belongs in the registry.
- The footprint writer has no code-level `LAPTOP_WRITE_FROZEN` gate of its own (the factory
  reconcile job has one); the 2026-08-26 freeze names footprint (P-09) in its does-not-unblock
  list. A laptop `--apply` today would run.
- The factory's job pattern to mirror: `Dockerfile.atoms-writer` in hauska-factory, the
  `factory-<job>` naming, the staging-then-production target selector
  (`src/lib/publish-target-env.mjs` or the module the factory uses; read it at origin/main),
  and the run record every factory job writes to its `runs` table.

### The change

1. **A per-county source declaration for PACS exports (LDT).** `lib/cad-ingest/src/sources.ts`
   gains, per county, the export's entry names for the base roll and the improvement detail
   (TCAD 48453: `PROP.TXT`, `IMP_DET.TXT`), and `discoverFiles` reads the declaration before
   any pattern. A county with no declaration keeps today's pattern. A declared name that is
   absent from the archive is a refusal naming the entry, never a silent fallback. Test: TCAD's
   entry list resolves; a made-up county with no declaration behaves as before; a declared but
   missing entry refuses.
2. **A Cloud Run job for the CAD loader (LDT).** A Dockerfile for `lib/cad-ingest`, a
   staging-then-production target selector matching the factory's, and a job
   `factory-cad-ingest` (or the name the factory naming rule yields; say which) in
   `hauska-prod-497015` `us-east4` beside the others. Inputs arrive from a GCS object the job
   downloads (the operator or the lane uploads the public export there; no laptop path into
   the database). The job writes a run record: county, files consumed with sha256 and byte
   size, tax year read from the file, row counts, target (staging or production), started and
   finished. `cli.ts` gains a `LAPTOP_WRITE_FROZEN` refusal on any `--apply` that is not
   running inside the job (detect by the job's own environment marker, never by a flag the
   caller passes).
3. **A Cloud Run job for the footprint writer (engine).** Same pattern for
   `write-building-footprint-county.mjs`: job, target selector, run record naming the staged
   source and the counties written, and the code-level laptop refusal on `--apply`. It takes the
   atoms write-slot lease per AGENT_CONTRACT section 3 like every other atoms writer.
4. **Prove each job can run and can refuse.** On staging: one dry run of each job from Cloud
   Run that leaves its record (pasted by field); one laptop `--apply` attempt for each that is
   refused by code (paste the refusal). Do not load Travis or write footprints in this row;
   P-157 and P-158 run the real loads through the jobs you built.
5. **Secrets.** If either job needs a credential that does not already exist in the project,
   STOP and report the secret name and the exact mount command; the operator approves in-thread.

### Verification, and the falsifier you pre-register

Write down at CP1: *if `gcloud run jobs list` in `hauska-prod-497015` does not show both jobs
after the deploy, or a staging dry run of either leaves no run record, or a laptop `--apply`
of either is not refused by code, the row is not done.* Deploy per the standing decision;
read every job and execution by field name from the JSON, never positionally.

The planner runs `node scripts/surface-probe.mjs --rows P-169 --observations <file>`. The P-169
predicate is observed, not machine: `jobsListed` (both job names as `gcloud run jobs list`
printed them), `stagingDryRunRecords` (the two run record ids), `laptopApplyRefused` (true only
if both attempts pasted a code-level refusal), each with `observedBy` and `observedAt`.

### Close

`_inbox/<date>_p169-infra_close.json` per AGENT_CONTRACT §6 plus the OPS-23 four fields.
`leave_behind` must carry the two job names, their images by digest, the target selector's
env contract, and the GCS bucket path the loader reads from, so P-157 and P-158 can be
compiled against them.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-12_p169-infra_cp1.json
  CP2: _inbox/2026-09-12_p169-infra_cp2.json
  CLOSE: _inbox/2026-09-12_p169-infra_close.json

CLOSE SKELETON (the fields the enforcement gate reads; spell them exactly, or the gate refuses
the commit rather than guessing what you meant):
  {
    "lane": "p169-infra",
    "planRows": ["P-169"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
