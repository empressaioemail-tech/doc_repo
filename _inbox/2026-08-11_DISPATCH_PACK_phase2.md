---
title: Dispatch pack — Phase 2 (acquisition, staging, and the three factory runbooks)
date: 2026-08-11
status: active-dispatch-pack
owner: doc_repo planner
purpose: Copy-paste dispatch blocks for Cursor native planning agents. Phase 2 is acquisition and build work that does NOT take the atoms bulk-writer slot. All blocks run in parallel.
---

# Dispatch pack — Phase 2

**Baseline at time of writing (planner-verified live 2026-08-11):**

```
engine origin/main   9fb41c7
ldt    origin/main   8038752d  (CI success, cortex-api deployed)
live ledger: totalRails 14 / totalCells 3556 / satisfiedCells 195 / texasCompletenessPct 6.5144%
  geometry  194 satisfied-present /  60 not-yet
  zoning      1 satisfied-present / 253 not-yet
  cad envelope flood landuse owner   not-yet 254 each
  easement footprint roads           no-writer 254 each
  mud rail-corridor rrc-pipelines rrc-wells   no-atom 254 each
  satisfiedPresentPartialCells 0
```

**Phase 1 landed:** P0.1, P0.2, P1.1, P1.2, P1.3, P1.5 merged and deployed. P1.4 (mud) is open on PR
#409 pending a rebase. P1.6 wrote the gate amendment.

**Slot rule for this entire pack: NO BLOCK MAY RUN `--apply` AGAINST THE ATOMS TABLE.** Every block here
builds, stages, registers, or documents. The applies are Phase 3.

**New standing clause in every brief (learned from P1.4):** if CI fails in a file your dispatch does not
own, do NOT fix it — rebase onto current origin/main and re-check. A concurrent lane's in-flight defect
is not yours to repair.

---

### DISPATCH P2.1 — get the sweep runner into version control (K5 class)

```
You are a PLANNING agent. Spawn worker agents to execute, adversarially review their work at two
checkpoints, apply the fixes yourself, and only then write the close artifact. Do not delegate the
adversarial review. Do not spawn agents that spawn further agents — you own the fan.

<!-- CANON-PREAMBLE v0f465c77 generated 2026-08-11 from _STATE.md -->

## STANDING DECISIONS (paste into every executor dispatch)

CANON-PREAMBLE v0f465c77

- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HELD until Bastrop QA-done + operator go.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

EXIT-BOUNDED VERIFICATION: git, gh (never --watch), grep, exit-bounded typecheck/tests. No watch, no
server, no long-running process. You may NOT run `--apply` against the atoms table.

CONCURRENT-LANE CLAUSE: if CI fails in a file this dispatch does not own, do NOT fix it. Rebase onto
current origin/main and re-check. Another lane's in-flight defect is not yours to repair.

CLOSE ARTIFACT (required): write exactly
  P:\doc_repo\_inbox\2026-08-11_P2-1_sweep_runner_versioned_close.json
{"runAt":"...","repoPath":"...","filesAdded":["..."],"prNumber":<int>,"ciConclusionString":"...",
 "merged":true|false,"resumeHoleFixed":true|false,"bomStripAdded":true|false,
 "behaviourDiffVsOriginal":"...","cp1":{...},"cp2":{...},"adversarialFindings":["..."]}

MISSION. `P:/tmp/parcel_node_sweep_20260809/run_sweep.mjs` (413 lines) is the driver that swept all of
Texas — 132 counties, 11.6M parcel-node atoms. Planner-verified 2026-08-11: it exists on disk and
`git ls-tree -r origin/main | grep run_sweep` in hauska-engine returns ZERO. **It is in no repository.**
`P:/tmp` is a recycle-prone directory. This is the same defect class as the K5 incident (a change live in
prod but uncommitted; any clean redeploy would have silently reverted it) and as the parcel-node verify
fix that sat on a branch with no PR.

DO THIS:
1. Read the file completely. Bring it into hauska-engine under a sensible home (propose
   `packages/engine-core/scripts/sweep/` or `tools/sweep/` — pick one and justify it). Keep the module
   shape; do NOT rewrite it into a "better" runner. OPERATE THE ARTIFACT, DO NOT REBUILD IT.
2. FIX THE RESUME HOLE, which is still in the code and was only ever patched procedurally. The skip set
   is `landed ∪ halted.countyFips`. A county that HALTED but never LANDED is silently skipped — 48457 was
   exactly that case and would have left a one-county hole in a 254-county fabric that no count-based
   gate could see. Make the skip set `landed` only, and treat `halted` as a resume POINTER, not an
   exclusion. Add a test.
3. ADD A BOM STRIP ON PROGRESS-FILE READ. `loadProgress()` has none; a PowerShell-written progress file
   carries a UTF-8 BOM that breaks `JSON.parse`. Strip `^\uFEFF` on read and write without BOM.
4. PARAMETERISE, do not hardcode: it currently hardcodes `ENGINE="P:/hauska-engine"` and inherits
   whatever branch is checked out there — the exact trap that once ran the sweep at 47 atoms/sec off a
   stale tree. Take the engine path and the CLI script name as arguments so the same runner drives other
   county writers (this is how multi-county runs are meant to be done: change its INPUT, never its code).
5. Confirm `--batch=5000` remains the default-capable path — verify cost is ~constant per batch
   regardless of id count (measured 9,128 ms for 500 ids vs 9,296 ms for 5,000).

DO NOT run a sweep. This is a version-control and hardening dispatch only.

CP1: pre-register the target path, the exact behavioural differences you intend (resume set, BOM, args),
and confirm you will change nothing else. CP2: diff your committed version against the P:/tmp original
and enumerate EVERY difference, justifying each. An undocumented difference is a failed checkpoint.

ADVERSARIAL: prove the resume fix actually closes the hole — construct a progress file where a county is
in `halted` but not in `landed`, and show the county re-enters the queue.

Merge on CI conclusion string "success" (gh run list --json conclusion; `gh pr checks` prints "pass",
which is NOT the conclusion string).
```

---

### DISPATCH P2.2 — Wave 4: the 57 reprojection counties (fabric 196 -> 253)

```
You are a PLANNING agent. Spawn worker agents to execute, adversarially review their work at two
checkpoints, apply the fixes yourself, and only then write the close artifact. Do not delegate the
adversarial review. Do not spawn agents that spawn further agents — you own the fan.

<!-- CANON-PREAMBLE v0f465c77 generated 2026-08-11 from _STATE.md -->

## STANDING DECISIONS (paste into every executor dispatch)

CANON-PREAMBLE v0f465c77

- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HELD until Bastrop QA-done + operator go.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

EXIT-BOUNDED VERIFICATION: one-shot curl/SQL, git, grep, bounded ingest runs that terminate per county.
No watch, no server. This dispatch DOES write to `txgio_parcel` (the PARCEL store) — that is expected and
is NOT the atoms bulk-writer slot. You may NOT write to the atoms table.

CONCURRENT-LANE CLAUSE: if CI fails in a file this dispatch does not own, do NOT fix it. Rebase onto
current origin/main and re-check.

CLOSE ARTIFACT (required): write exactly
  P:\doc_repo\_inbox\2026-08-11_P2-2_wave4_reprojection_close.json
{"runAt":"...","countiesTargeted":57,"countiesLanded":<int>,"countiesFailed":[{"fips":"...","reason":"..."}],
 "rowsAdded":<int>,"countiesInStoreBefore":196,"countiesInStoreAfter":<int>,
 "vintageMarkerPresent":true|false,"perCounty":[{"fips":"...","name":"...","rows":<int>,"westmost":<float>,"extentOk":true|false}],
 "donleyStatus":"...","cp1":{...},"cp2":{...},"adversarialFindings":["..."]}

MISSION. Texas parcel geometry covers 196 of 254 counties. Planner-verified 2026-08-11: this is an
EXECUTION gap, not a source gap. 57 of the 58 missing counties are published and downloadable TODAY
(live probes returned HTTP 206 with content for Armstrong 48011, King 48269, Loving 48301, Ward 48475).
Only Donley 48129 is genuinely dead at source (404).

Cause: those 57 ship on the **202505 vintage in Web Mercator (metres)** — `PROJCS["WGS_1984_Web_Mercator_
Auxiliary_Sphere"]` — and the ingest's WGS84 guard correctly fails them closed. THE FIX IS ALREADY
WRITTEN AND MERGED: `lib/cad-ingest/src/txgio/cli.ts` carries an opt-in `--reproject=3857` path
(closed-form inverse Mercator in `reproject.ts`), landed under an operator ruling 2026-08-08. Its own
code comment names the cohort: "57 of the 235 unloaded counties are on the 202505 vintage."

**It was never run.** Proof from the store: `SELECT count(*) FROM txgio_parcel WHERE source_vintage LIKE
'%reprojected%'` returns 0, and `_inbox/2026-08-08_L2_WAVE3_MASTER_REPORT.md:147` states "Wave 4 (202505
reprojection) remains HELD." No Wave 4 dispatch, log, or artifact exists.

Size: 626,400 parcels = 4.69% of Texas, 0.246 GB total download. Median county 7,334 parcels; largest is
Rusk at 38,106. No county exceeds 50,000. No metro is in the set.

DO THIS:
1. Get the authoritative 57-county list from `_inbox/2026-08-08_SWEEP_county_source_matrix.json` — the
   cohort is exactly its `ingest_safe_today: false` set. Planner verified this set is BIT-IDENTICAL to
   the 58 missing (57 + Donley). Do not re-derive it by guessing.
2. Run the EXISTING ingest with `--reproject=3857`. OPERATE THE PROVEN ARTIFACT — do not write a new
   ingest, a wrapper, or a "wave runner". If you believe a wrapper is needed, use the P2.1 sweep runner
   by changing its INPUT (engine path + CLI script name), never its code. Any deviation requires a line
   `DEVIATION: bypassing <path> because <reason>, operator-approved` in your artifact.
3. EVERY converted row MUST carry `+reprojected-from-epsg3857` in `source_vintage`. That marker is the
   only way to distinguish reprojected rows later. Verify it is present after the first county and STOP
   if it is not.
4. CONCURRENCY 1-2 ONLY — `40P01` deadlock on a shared index has been observed above that.
5. GEOGRAPHIC PROOF PER COUNTY, not just row counts. The multi-shapefile truncation defect was invisible
   to every count-based gate because dry, apply, and SQL all read the same truncated input. For each
   county compare the stored extent against the Census TIGERweb extent for that FIPS and record both.
   A row count that looks right with a truncated extent is the exact failure mode.
6. Donley 48129: confirm the 404 still stands, record it, and leave it as a documented honest absence.
   Do not attempt a workaround.

CP1: pre-register the expected per-county row counts from `parcel_count_est` and the expected
counties-in-store after (196 + landed). CP2: measure and reconcile every county whose actual differs
from estimate by more than 10%; a systematic shortfall across counties is a truncation signature, not
noise.

ADVERSARIAL: for three counties spread across the state, verify the westmost/eastmost stored coordinate
against Census and state the inset. Prove the reprojection is CORRECT, not merely that rows landed —
a wrong-but-plausible coordinate transform produces a full row count in the wrong place.
```

---

### DISPATCH P2.3 — RRC statewide staging tables (unblocks two rails, 508 cells)

```
You are a PLANNING agent. Spawn worker agents to execute, adversarially review their work at two
checkpoints, apply the fixes yourself, and only then write the close artifact. Do not delegate the
adversarial review. Do not spawn agents that spawn further agents — you own the fan.

<!-- CANON-PREAMBLE v0f465c77 generated 2026-08-11 from _STATE.md -->

## STANDING DECISIONS (paste into every executor dispatch)

CANON-PREAMBLE v0f465c77

- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HELD until Bastrop QA-done + operator go.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

EXIT-BOUNDED VERIFICATION: one-shot curl with --max-time, one-shot SQL, git, grep, bounded paging runs.
No watch, no server. This dispatch creates and fills two NEW tables in the deployment store — that is
expected. You may NOT write to the atoms table and you may NOT run any `--apply` on a fact writer.

CONCURRENT-LANE CLAUSE: if CI fails in a file this dispatch does not own, do NOT fix it. Rebase onto
current origin/main and re-check.

CLOSE ARTIFACT (required): write exactly
  P:\doc_repo\_inbox\2026-08-11_P2-3_rrc_staging_tables_close.json
{"runAt":"...","tablesCreated":["tx_rrc_well","tx_rrc_pipeline"],"wellRowsLoaded":<int>,
 "pipelineRowsLoaded":<int>,"pipelineDedupeKey":"...","wellCountyJoinDone":true|false,
 "fieldMapping":[{"oldField":"...","newField":"..."}],"symnumDefaultFixed":true|false,
 "fourCornerProbe":{"permian":<int>,"panhandle":<int>,"eastTx":<int>,"southTx":<int>},
 "prNumber":<int>,"ciConclusionString":"...","cp1":{...},"cp2":{...},"adversarialFindings":["..."]}

MISSION. Two manifest rails (`rrc-wells` point, `rrc-pipelines` line) read `no-atom` on all 254 cells.
The wired source was WRONG — a Harris County mirror. The correct statewide source is FOUND and
PLANNER-VERIFIED LIVE 2026-08-11.

THE DEFECT (do not re-point the writer at the old source):
  https://www.gis.hctx.net/arcgishcpid/rest/services/TXRRC/Wells/MapServer/0
  returnCountOnly = 12,796; extent in WGS84 = {-95.9402, 29.5063, -94.8999, 30.1740} — ONE COUNTY.
  Dallas bbox count = 0. That is 0.92% of Texas wells. The engine's own docstring says it:
  `packages/engine-core/src/well-fact/fetch-wells.ts:2` — "Harris County mirror layer".
  Applying that source statewide would emit ~1.4M machine-verified "no well on or near" absence atoms
  across the Permian, Panhandle, East Texas and Eagle Ford — confident, cited, and WRONG.

THE CORRECT SOURCE (first-party, free, unauthenticated; planner-probed):
  Root: https://gis.rrc.texas.gov/server/rest/services   (NOTE: gis.rrc.texas.gov/arcgis/... 404s)
  Folder rrc_public, service RRC_Public_Viewer_Srvs/MapServer
  Layer 1  Well Locations  = 1,396,049 points
  Layer 13 Pipelines       =   492,021 lines (RRC T-4 permits, NOT PHMSA NPMS — no security restriction)
  Layer 2  Orphan Wells    =    11,937 points, joins to layer 1 on API number
  Planner four-corner probe (wells): Permian 568 / Panhandle 10 / East TX 222 / South TX 215.

BUILD STAGING TABLES — do NOT live-fetch per county. The service enforces a 1,000-record page cap, so
statewide is 1,890 sequential pages (~0.63 GB wells + ~1.24 GB pipelines). Per-run re-streaming is
exactly the building-footprint anti-pattern that makes that rail unusable (it re-streams 394 MB and scans
10.7M features on EVERY county run). Follow the `tx_special_district` convention, which works:
  - `tx_rrc_well` and `tx_rrc_pipeline`, with a GiST index on geometry.
  - Pipelines partition by county for free — COUNTY_FIPS is already denormalised on the source.
  - Wells need a ONE-TIME point-in-county join at backfill; record the join method.

FOUR TRAPS THE SWAP MUST HANDLE — this is NOT a re-point:
1. FIELD NAMES DIFFER. `SURFACE_ID`->`UNIQID`, `WELLID`->`GIS_WELL_NUMBER`, `LONG83`->`GIS_LONG83`.
   `parseWellFeature` will SILENTLY NULL OUT against the new source unless remapped. Map every field and
   record the mapping in the artifact.
2. CORRECTNESS BUG AT SCALE: `mapSymnumToWellStatus` DEFAULTS unmatched SYMNUMs to "producing". The real
   source carries `GIS_SYMBOL_DESCRIPTION` with 54 status values — that default would label "Canceled /
   Abandoned Location", "Core Test" and "Water Supply Well" as PRODUCING across 1.4M wells. Fix it to
   fail closed (unknown -> explicit unknown, never a confident status).
3. `symnum.ts` docstring asserts "Public GIS carries SYMNUM only — not operator or regulatory status
   text." That is FALSE of the new source (`GIS_SYMBOL_DESCRIPTION` + `GIS_LOCATION_SOURCE` positional
   provenance). Correct the comment or the next agent re-derives the limitation.
4. PIPELINE DEDUPE: one physical pipeline is many county-split rows (three sampled segments shared
   T4PERMIT 10680 / P5_NUM 253368). Key on P5_NUM/T4PERMIT, NEVER on operator name — the source carries
   `"ENTERPRISE PRODUCTS OPERATINGLLC"`, missing a space.

ATOM-SHAPE NOTE (for the Phase 3 apply, not this dispatch): the R1 split rule governs — split where
SOURCE and GEOMETRY differ, subcategorise via atom body fields where only the ATTRIBUTE differs.
Producing-vs-plugged is an ATTRIBUTE and stays inside the cell. Carry the named buffer/radius in the atom
body so the adjacency claim is auditable (siblings use 152.4 m / 500 ft; note the source constant is an
integer 152 = 498.69 ft — flag the discrepancy, do not silently change it).

DO NOT RUN THE FACT WRITER. This dispatch ends with tables loaded and verified. The `--apply` is Phase 3.

CP1: pre-register expected row counts (1,396,049 wells / 492,021 pipelines), the field mapping, and the
dedupe key. CP2: measure loaded rows and reconcile against the live source counts; explain any shortfall
rather than accepting it — a paging bug shows up as a round-number shortfall.

ADVERSARIAL: after load, run the four-corner probe AGAINST YOUR OWN TABLE (Permian / Panhandle / East TX
/ South TX bboxes) and confirm all four return rows. A staging table that reproduces the single-county
defect is the failure you were sent to prevent. Also confirm no row carries status "producing" purely by
default — count rows whose SYMNUM had no explicit mapping.

UNKNOWNS TO RECORD, NOT GUESS: data vintage (the service exposes no lastEditDate and empty
copyrightText) and commercial-redistribution rights (public record with no ToS gate on the REST path, but
RRC's "intended solely for the internal use of the Railroad Commission" phrasing needs a legal read
before any resale of Layer 2). Mark both UNKNOWN in the artifact.
```

---

### DISPATCH P2.4 — building-footprint staging table + GiST (unblocks the rail AND M3 site plans)

```
You are a PLANNING agent. Spawn worker agents to execute, adversarially review their work at two
checkpoints, apply the fixes yourself, and only then write the close artifact. Do not delegate the
adversarial review. Do not spawn agents that spawn further agents — you own the fan.

<!-- CANON-PREAMBLE v0f465c77 generated 2026-08-11 from _STATE.md -->

## STANDING DECISIONS (paste into every executor dispatch)

CANON-PREAMBLE v0f465c77

- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HELD until Bastrop QA-done + operator go.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

EXIT-BOUNDED VERIFICATION: one-shot curl/HEAD, one-shot SQL, git, grep, a BOUNDED one-time stream that
terminates. No watch, no server. Creates and fills one NEW table — expected. You may NOT write to the
atoms table and you may NOT run the footprint fact writer with `--apply`.

CONCURRENT-LANE CLAUSE: if CI fails in a file this dispatch does not own, do NOT fix it. Rebase onto
current origin/main and re-check.

CLOSE ARTIFACT (required): write exactly
  P:\doc_repo\_inbox\2026-08-11_P2-4_footprint_staging_table_close.json
{"runAt":"...","tableCreated":"tx_building_footprint","rowsLoaded":<int>,"gistIndexCreated":true|false,
 "sourceBytes":<int>,"loadWallMs":<int>,"perCountyJoinBenchmark":[{"fips":"...","parcels":<int>,"joinMs":<int>}],
 "speedupVsRestream":"...","attributionCarried":true|false,"prNumber":<int>,"ciConclusionString":"...",
 "cp1":{...},"cp2":{...},"adversarialFindings":["..."]}

MISSION. The `footprint` rail reads `no-writer` on all 254 cells, and the operator's M3 request
("footprints of buildings we are collecting must show on site plans") is blocked on the same gap. The
writer EXISTS and is registered (`building-footprint` in PROPERTY_ENTITY_TYPES, engine origin/main) and
carries the verify-by-PK fix at `write-building-footprint-county.mjs:347`. The blocker is purely
ALGORITHMIC.

Measured: the Bastrop dry-run needed 1,762,884 ms (~29 MINUTES) to scan all 10,678,921 Texas features and
join only 200 parcels. Dallas could not complete a join at all — recorded as "full parcel join deferred
(O(footprints x parcels) prohibitive on 726k parcels)". Every county run re-streams the SAME 394 MB zip
from Azure with no persisted table and no spatial index, so cost scales with
statewide-features x county-parcels on EVERY run.

THE FIX PATTERN ALREADY EXISTS ONE RAIL OVER. `special-district` persists its polygons into
`tx_special_district` and queries per county — that rail's dry-runs complete in seconds. Do the same:

1. Stream the source ONCE: https://minedbuildings.z5.web.core.windows.net/legacy/usbuildings-v2/Texas.geojson.zip
   (planner-probed 2026-08-11: HTTP 200, Content-Length 394,135,084, Last-Modified 2024-11-07).
2. Persist into `tx_building_footprint` with a GiST index on geometry. Follow the `tx_special_district`
   convention for naming, provenance columns, and vintage.
3. Denormalise `county_fips` at load via point-in-county (or bbox-then-refine) so per-county queries never
   scan the whole table.
4. BENCHMARK THE WIN: after load, time a per-county footprint-to-parcel join for Bastrop AND for a metro
   county (Dallas 48113). Report both against the 1,762,884 ms baseline. If the join is not
   orders-of-magnitude faster, the table did not solve the problem and you must say so.

CARRY THE LICENCE. Microsoft/Bing ML Global Building Footprints is ODC-By 1.0 — attribution is MANDATORY
and the contract enforces it via a negative guard (`ML_FOOTPRINT_SOURCE_CITATION` in
`building-footprint/constants.ts`). The attribution must survive into anything exported. Record how.

HONESTY CONSTRAINT — these are ML-DERIVED, NOT SURVEYED. `sourceTier` is `ml-derived` and
`verificationStatus` is one of machine|human|unsurveyed. A site plan is a document people build from.
Nothing in this pipeline may present an ML footprint as surveyed geometry. Record the field that carries
this so the Phase 4 site-plan work can render the distinction.

DO NOT RUN THE FACT WRITER `--apply`. This dispatch ends with a loaded, indexed, benchmarked table.

CP1: pre-register expected row count (~10.7M Texas features), expected load time, and the per-county join
time you predict post-index. CP2: measure all three and reconcile. A join that is still minutes-per-county
means the index is not being used — run EXPLAIN and report the plan rather than accepting the number.

ADVERSARIAL: confirm the loaded geometry is in the expected CRS and lands where it should — pick 3
parcels in different counties with known buildings and verify a footprint actually intersects. A table
full of correctly-counted rows in the wrong projection passes every count-based check.
```

---

### DISPATCH P2.5 — register road-node and rule on the roads rail

```
You are a PLANNING agent. Spawn worker agents to execute, adversarially review their work at two
checkpoints, apply the fixes yourself, and only then write the close artifact. Do not delegate the
adversarial review. Do not spawn agents that spawn further agents — you own the fan.

<!-- CANON-PREAMBLE v0f465c77 generated 2026-08-11 from _STATE.md -->

## STANDING DECISIONS (paste into every executor dispatch)

CANON-PREAMBLE v0f465c77

- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HELD until Bastrop QA-done + operator go.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

EXIT-BOUNDED VERIFICATION: git, gh (never --watch), grep, exit-bounded typecheck/tests. No watch, no
server, no statewide ingest. You may NOT write to the atoms table.

CONCURRENT-LANE CLAUSE: if CI fails in a file this dispatch does not own, do NOT fix it. Rebase onto
current origin/main and re-check.

CLOSE ARTIFACT (required): write exactly
  P:\doc_repo\_inbox\2026-08-11_P2-5_road_node_registration_close.json
{"runAt":"...","roadNodeRegistered":true|false,"propertyEntityTypesCountBefore":14,"propertyEntityTypesCountAfter":<int>,
 "contractVersion":"...","pr293Assessment":{"refutationsStillOpen":["..."],"recommendation":"...","reasoning":"..."},
 "writerExists":true|false,"writerPath":"...","prNumber":<int>,"ciConclusionString":"...",
 "cp1":{...},"cp2":{...},"adversarialFindings":["..."]}

MISSION. The `roads` rail reads `no-writer` on all 254 cells. The operator has ruled roads IN SCOPE for
gate closure. Two things are true simultaneously and must not be conflated:

(a) `road-node` IS PUBLISHED in `@empressaio/atom-contract@1.19.0` with a full schema — planner-verified:
    `npm view @empressaio/atom-contract version` -> 1.19.0, and the published tarball contains
    `dist/property/road-node.{js,d.ts}`. But it is NOT registered in the engine: PROPERTY_ENTITY_TYPES on
    origin/main holds 14 types and `road-node` is absent (grep returns 0).

(b) hauska-engine PR #293 (F5 roads unblock) is OPEN with CI conclusion string "failure" and a body that
    opens "## DO NOT MERGE". An adversarial review REFUTED statewide ingest with named defects:
    a boundary coin-flip under a 1e-18 collinear epsilon; Node ingest unexecuted; a silent upsert that
    would CLOBBER existing Bastrop road data; and a synthetic-id landmine.

YOUR JOB IS (a), PLUS A WRITTEN RECOMMENDATION ON (b). DO NOT MERGE #293 AND DO NOT RUN A STATEWIDE
ROAD INGEST.

1. Register `road-node` in PROPERTY_ENTITY_TYPES following the exact pattern the other 14 types use.
   Bump the engine's contract dependency if required. Count guard moves 14 -> 15 deliberately.
2. Establish whether a road county WRITER exists at all, or whether registration only unblocks a writer
   that still has to be built. Report the path if it exists; say plainly if it does not. Do not imply a
   writer exists because a type is registered — that conflation is the exact defect the P1.3 capability
   probe was built to prevent.
3. ASSESS #293 AGAINST ITS OWN REFUTATIONS. For each of the four named defects, state whether it is still
   open on the current branch, with evidence. Then recommend one of: rebuild the ingest with the defects
   fixed / salvage specific commits / close and re-derive. Give a reason per defect, not a verdict for
   the whole PR.
4. THE SILENT-UPSERT DEFECT IS THE ONE THAT CAN CAUSE DAMAGE. Bastrop already has road data that the warm
   path depends on (a prior Elgin warm returned 49/50 `no-road-adjacency` declines purely because the
   city's OSM roads were absent). Any road ingest that upserts without a guard could clobber working
   data. Your recommendation must say explicitly how that is prevented.

CP1: pre-register the expected type count after registration and your prediction on each of the four
refutations. CP2: measure the count, and state for each refutation whether the evidence CONFIRMED or
REFUTED your prediction.

ADVERSARIAL: argue against your own recommendation on #293 in writing before settling. If you recommend
salvage, name what specifically would have to be true for a rebuild to be correct instead — and check
whether it is.

Merge only on CI conclusion string "success".
```

---

### DISPATCH P2.6 — L5 Central Texas: apply the 23 proven cities' prerequisites + city→county join

```
You are a PLANNING agent. Spawn worker agents to execute, adversarially review their work at two
checkpoints, apply the fixes yourself, and only then write the close artifact. Do not delegate the
adversarial review. Do not spawn agents that spawn further agents — you own the fan.

<!-- CANON-PREAMBLE v0f465c77 generated 2026-08-11 from _STATE.md -->

## STANDING DECISIONS (paste into every executor dispatch)

CANON-PREAMBLE v0f465c77

- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HELD until Bastrop QA-done + operator go.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

EXIT-BOUNDED VERIFICATION: one-shot SQL, one-shot curl, git, grep, DRY-RUNS ONLY on any warm/stamp path.
No watch, no server. You may NOT run `--apply` against the atoms table — the applies are Phase 3.

CONCURRENT-LANE CLAUSE: if CI fails in a file this dispatch does not own, do NOT fix it. Rebase onto
current origin/main and re-check.

CLOSE ARTIFACT (required): write exactly
  P:\doc_repo\_inbox\2026-08-11_P2-6_l5_central_texas_prep_close.json
{"runAt":"...","cityCountyJoinDone":true|false,"citiesLinked":<int>,"citiesUnlinked":<int>,
 "citiesPerCounty":[{"countyFips":"...","cityCount":<int>}],
 "twentyThreeCities":[{"city":"...","countyFips":"...","dryRunStatus":"...","blockedBy":"..."}],
 "zoningGisNullCount":<int>,"probedAndFound":[{"city":"...","layerUrl":"..."}],
 "readyToApplyCount":<int>,"cp1":{...},"cp2":{...},"adversarialFindings":["..."]}

MISSION. Operator ruling: L5 (jurisdiction depth — zoning, setbacks, code text) is IN SCOPE for gate
closure, sequenced Central Texas -> Dallas -> Houston -> fill. This dispatch prepares Central Texas so the
Phase 3 apply is a drain, not a discovery exercise.

CONTEXT VERIFIED BY THE PLANNER 2026-08-11:
- Real zoning depth today is ONE county (Bastrop 48021, 99.77%). The live ledger now reads zoning
  1 satisfied-present / 253 not-yet after the P1.1 depth-predicate fix. Any older doc saying "19
  satisfied" is describing a predicate defect that has since been corrected.
- 23 cities are ALREADY DRY-RUN PROVEN (exit code 0, zero errors, ~1.09M parcels) and blocked only by a
  blast-radius hold. 21 of those 23 sit inside Central Texas.
- Cost is settled and is NOT the constraint: $14.29 max per county; all 254 counties = $228.66. Do NOT
  re-measure cost.

TASK A — THE BLOCKING DEFECT. `_catalog/texas_roster_v1.json` has **all 1,223 city rows with
`parent_county_fips` NULL**, and `parent_county_name` holds the literal garbage values "A" and "I"
(string-indexing artifacts — the signature of taking str[0] where an object was intended). Planner
verified this directly. **We cannot answer "which cities are in county X"**, which makes any L5 sizing
impossible.
FIX BY DERIVATION, NOT ACQUISITION: migration 0070 already loaded `tx_city_boundary` (~1,225 TxGIO/CPA
polygons, PK geo_id) and `tx_county_boundary` (254 TIGERweb polygons, PK county_fips) into Neon, both
with bbox indexes — planner confirmed both schemas exist in
`P:/legacy-design-tools/lib/db/src/schema/`. Spatial-join city polygons against county polygons to
populate `parent_county_fips`. Handle cities spanning multiple counties explicitly (record all, mark a
primary) — do not silently pick one.

TASK B — ENUMERATE THE 23 PROVEN CITIES and map each to its county using Task A's output. Report which
Central Texas counties they cover and what each would move. State plainly which of the 8 Central Texas
counties would still have zero zoning depth after all 23 land.

TASK C — WHAT ACTUALLY BLOCKS CITY #24. Verified: **42 of 50 CAPCOG cities have `zoning_gis` NULL** in
`_catalog/tx_jurisdiction_source_registry.json`, and NULL is a hard stop (`zoning-stamp` fails "unknown
city"). BUT it is a PROBING gap, not a data gap — Elgin showed NULL in the registry yet was successfully
stamped via a layer found during recon. For at least 10 of the 42, PROBE for a zoning GIS layer (county
or city ArcGIS REST, open-data portal, municipal viewer) and record the URL where found. This is the
Factory 1.5 acquisition motion: finding sources is slot-free, infinitely parallel work.

DO NOT RUN ANY `--apply`. Dry-runs only. Your output is a work-list the Phase 3 drain consumes.

HARVEST COMPLETENESS APPLIES. Per the 2026-08-10 ruling: when you visit a source, take the WHOLE payload
with provenance, not just the field you came for. The expensive part is the VISIT — finding it,
authenticating, paginating, normalising identity — and it is paid again in full if you return later
against a source that may have changed vintage or gained an auth wall.

CP1: pre-register how many of the 1,223 cities you expect to link, and which counties the 23 cities cover.
CP2: measure and reconcile; explain every unlinked city individually rather than reporting a bulk
failure count.

ADVERSARIAL: spot-check 5 city→county assignments against an independent source (Census place-to-county
relationship, or the city's own site). A spatial join that silently assigns a city to a neighbouring
county produces a complete-looking table that is wrong — and it would misdirect the entire L5 sequence.
```

---

### DISPATCH P2.7 — the three factory runbooks + the 1→1.5→2 seam

```
You are a PLANNING agent. Spawn worker agents to execute, adversarially review their work at two
checkpoints, apply the fixes yourself, and only then write the close artifact. Do not delegate the
adversarial review. Do not spawn agents that spawn further agents — you own the fan.

<!-- CANON-PREAMBLE v0f465c77 generated 2026-08-11 from _STATE.md -->

## STANDING DECISIONS (paste into every executor dispatch)

CANON-PREAMBLE v0f465c77

- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HELD until Bastrop QA-done + operator go.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

EXIT-BOUNDED VERIFICATION: git, grep, read, one-shot curl. No watch, no server. This is primarily a DOC
dispatch plus ONE code change (item 4). You may NOT write to the atoms table.

CONCURRENT-LANE CLAUSE: if CI fails in a file this dispatch does not own, do NOT fix it. Rebase onto
current origin/main and re-check.

CLOSE ARTIFACT (required): write exactly
  P:\doc_repo\_inbox\2026-08-11_P2-7_factory_runbooks_close.json
{"runAt":"...","runbooksWritten":[{"path":"...","factory":"1|1.5|2","gradable":true|false}],
 "seamSpecPath":"...","gateBypassFixed":true|false,"gatedRunners":[{"runner":"...","callsGate":true|false}],
 "z10CommandCorrected":true|false,"newStateReadiness":{"canOnboardFromDocsAlone":true|false,"remainingGaps":["..."]},
 "prNumbers":[<int>],"ciConclusionString":"...","cp1":{...},"cp2":{...},"adversarialFindings":["..."]}

MISSION. Operator ruling: all three factories must be well documented with a runbook, so there is a
PROVEN PATH for new states. The labels are now fixed (note they are REVERSED from some older docs, which
called the county one "factory 1" because it was built first):

  Factory 1   = STATEWIDE FABRIC. Jurisdiction-free layers (parcel geometry, roads, flood, footprints,
                boundaries, terrain, RRC). One source blankets a state; cost ~constant per state.
  Factory 1.5 = ACQUISITION / STAGING. Find, fetch, parse, normalise, and PERSIST payloads with
                provenance so the single write path has a queue to drain. Network-bound, failure-prone,
                infinitely parallel, SLOT-FREE. Both other factories consume its output.
  Factory 2   = COUNTY / JURISDICTION DEPTH. Zoning, setbacks, code text. Per-jurisdiction; the moat.

The seam was previously a direct Factory1 -> Factory2 connector. It must become 1 -> 1.5 -> 2.

WHAT EXISTS (planner-verified; do not rediscover):
- Producer: `packages/engine-core/scripts/write-parcel-node-county.mjs` + `src/parcel-node/`. Its header
  says it closes "the seam between the STATEWIDE factory and the atom layer." PROVEN at scale: 196
  counties / 11,603,489 parcel-node atoms.
- Consumer: `packages/engine-core/src/parcel-node/warm-preflight-gate.ts` — "the seam check between the
  two factories", six named decline codes, fail-closed. **NEVER APPLIED** — its one post-anchor artifact
  reads DRY_RUN_PASS_APPLY_HOLD.
- Driver: `run_sweep.mjs` — being version-controlled by dispatch P2.1 (coordinate; do not duplicate).
- Factory 1.5 is UNNAMED CODE, NOT MISSING CODE: `legacy-design-tools/lib/cad-ingest` already fetches,
  parses, projection-guards and persists with vintage provenance.
- An operating procedure of record for Factory 1 was written today:
  `_inbox/2026-08-11_FACTORY_operating_procedure_of_record.md`. Read it and PROMOTE it, do not rewrite it.

DELIVER FOUR THINGS:
1. `90_runbooks/factory_1_statewide_fabric.md` — how to blanket a state with the uniform layers. Promote
   the operating procedure of record; ADD the parcel-node step, which is missing from every current
   runbook.
2. `90_runbooks/factory_1_5_acquisition_staging.md` — NEW. How to find sources in a state never touched
   before, stage payloads with provenance, and hand them to the write path. Must include a
   SOURCE-DISCOVERY procedure for a state with no TxGIO equivalent.
3. `90_runbooks/factory_2_jurisdiction_depth.md` — fix the EXISTING
   `90_runbooks/factory_onboarding_runbook.md`, which is status "active, planner-reviewed and promoted"
   and is WRONG in three ways: it has no parcel-node step; it still claims the unified runner is
   unshipped (it merged as #287 on 2026-08-09); and **its Step Z10 at line 139 hands out an UNGATED
   command**.
4. FIX THE GATE BYPASS — THE ONE CODE CHANGE IN THIS DISPATCH. Planner-verified on engine origin/main:
   `gateWarmCohort` is called in exactly ONE warm runner (`depth-warm-city-batch.mjs`). Every
   bastrop/elgin/caldwell runner greps to ZERO. So the seam check between the two factories is bypassed
   by anyone following the promoted runbook. Either call `gateWarmCohort` from every warm runner, or
   collapse the runners into the unified one and retire the rest. Then correct Step Z10 to name a gated
   command.

GRADING TEST FOR ALL THREE RUNBOOKS: could a competent operator onboard UTAH from these docs alone,
without asking a question? If not, you have documented what we did rather than how to do it again. State
the answer honestly in the artifact.

PORTABILITY FACTS TO INCORPORATE (planner-verified, do not re-derive): `packages/engine-core/src` is
TEXAS-CLEAN — zero hardcoded 48/TX/texas outside comments, so the write path ports as-is. The coupling is
in acquisition: 26 of 47 files in `lib/cad-ingest` carry Texas coupling. Hard blockers are
`assertTexasWgs84Bbox` (`txgio/parse.ts:185`) which THROWS on any non-Texas coordinate and is called
per-feature, and `WHERE STATE='48'` hardcoded in `boundary/service.ts`.

ALSO CORRECT (present-tense claims only; `_sessions/` files are HISTORICAL and must NOT be edited):
`OPS-14:86` claims "The W5 WDLL carries the template worksheet" — it does NOT; acceptance item 9 has an
empty grade box and no UT/NM/CO/AZ recon note exists anywhere.

CP1: pre-register the runbook outlines and your prediction on the Utah grading test. CP2: take your own
Factory 1 runbook and walk it step by step against what actually happened in the Texas sweep — every
place the runbook would have left an operator stuck is a gap you must fix before closing.

ADVERSARIAL: the "operate, do not rebuild" ruling exists because a prior fleet forked
`bastrop-district-cert-grade.mjs` beside the proven `block13-cert-grade.mjs` and debugged its own
machinery through three STOP cycles — the operator's words were "we were supposed to be getting the
factory started and tested with bastrop not building a new factory." Under the generalised grader,
Block-13 held 7/7 and "28 SF-1 fails" collapsed to 3 genuine — ~23 were WRAPPER ARTIFACTS. Your runbooks
must make rebuilding harder than operating: name the specific wrappers an agent might be tempted to
create and state what to run instead, and require a `DEVIATION: bypassing <path> because <reason>,
operator-approved` line for any departure.
```

---

## Notes for the operator

- **All seven blocks run in parallel.** None takes the atoms bulk-writer slot.
- **P2.1 and P2.7 overlap on `run_sweep.mjs`** — P2.1 owns the code move; P2.7 only documents it. If P2.1
  has not landed when P2.7 needs to reference the path, P2.7 should cite the intended path and note the
  dependency rather than moving the file itself.
- **P2.2 writes to `txgio_parcel`** and **P2.3 / P2.4 create new tables.** These are the PARCEL/staging
  store, not the atoms bulk-writer slot, so they do not contend with each other or with Phase 3.
- **P2.5 does NOT merge #293** and does not run a statewide road ingest — it registers `road-node` and
  returns a written recommendation for your ruling.
- **Phase 3 (the applies) is drafted after these land**, because P2.3/P2.4 change what the rrc and
  footprint applies can do, and P2.6 produces the L5 work-list.
