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

AGENT-CONTRACT v1890f0bb — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
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

PLAN-ROW: P-152 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-engine

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


## Mission — P-152 READER (lane 1 of 2): the one reader, in the Hauska retrieval service

You may fan sub-agents exactly one level deep per AGENT_CONTRACT §1. Verification stays with
you. Sub-agents produce diffs and evidence; you read every diff and run every check yourself.

This is step 5 of OPS-23 §0 and it is the row that makes R-6 true on a wire. It has two lanes.
This one builds the reader and makes cortex consume it. The second (P152-PANEL, dispatched after
this one closes) makes the Property Explorer panel consume it and starts retiring the paths it
replaces. Do not do the second lane's work.

### Where you work

- `empressaioemail-tech/hauska-engine`, worktree `P:/seat-worktrees/property/hauska-engine-p152-reader`,
  branch `feat/p152-record-reader`, from `origin/main`. The service is `services/retrieval-api`.
- `empressaioemail-tech/legacy-design-tools`, worktree
  `P:/seat-worktrees/property/legacy-design-tools-p152-cortex-consumer`, branch
  `feat/p152-cortex-consumes-reader`, from `origin/main`.

Declare both start commits before you write anything. `P:/hauska-engine` and
`P:/legacy-design-tools` are other people's checkouts; never build there.

### What is true today, verified 2026-09-11 at origin/main (engine 79fa573, LDT 489f428c)

- The record-served path exists only inside cortex (`legacy-design-tools/artifacts/api-server/src/lib`):
  `parcelRecordCellRead.ts` (per-parcel cell reads, authenticates as Postgres role
  `parcel_record_ro`, credential `FACTORY_DATABASE_URL_RO`, `SET default_transaction_read_only`
  on connect), `parcelGateVerdictRead.ts`, `parcelRecordAllowlist.ts` (three states: `record`,
  `legacy`, `refused`; `legacy` is the fail-closed default for anything unslated),
  `verdictLayerServe.ts`, and eighteen pairs of `<rail>FactFromParcelRecord.ts` +
  `<rail>FactServeCutover.ts` (agValuation, cadRoll, cityLimits, floodHazard, maxFootprintSqFt,
  maxHeightFt, maxImperviousCoverPct, maxLotCoveragePct, overlayDistricts, parcelAreaSqFt,
  schoolDistrict, setbackRules, setbacks, specialDistrict, utilityService, valueHistory, well,
  zoning). `routes/brokerageNodeFacets.ts` serves `GET /api/brokerage/v1/place/node/:id/facets`
  (anonymous, owner stripped) and is what `smartsite-mcp` (`parcel-anchor.ts`) and
  `get_smart_site` read.
- The Hauska retrieval service (`hauska-engine/services/retrieval-api`, Hono, Cloud Run
  `hauska-retrieval-api` in `hauska-prod-497015` `us-central1`, deployed by hand per
  `services/retrieval-api/DEPLOY.md`) authenticates with `Authorization: Bearer
  RETRIEVAL_API_KEY`, reads `SUBSTRATE_DATABASE_URL` (the atoms store `hauska_mcp`),
  `CORTEX_DATABASE_URL`, `DEPLOYMENT_DATABASE_URL` and `OVERLAY_DATABASE_URL`, and does NOT hold
  the factory store. It already serves `GET /property-nodes/:parcelNodeId/atom-chain`,
  `/atoms/:did`, `/boundary-edges`, and the near-bbox routes. The Property Explorer facets
  handler (`hauska-map/apps/property-explorer/api/_lib/pe-property-atoms.ts`) already calls it
  (`HAUSKA_RETRIEVAL_API_URL`, `RETRIEVAL_API_KEY`).
- `parcel_record_cell` is `(place_key, rail_key, cell_state jsonb)` with a CHECK on
  `cell_state->>'kind'`. There is no atom pointer column and no rendering column yet; P-163
  adds them. Cells today carry copied values with source provenance and no atom behind them;
  P-164 mints the atoms. The reader you build must be honest about that on the wire.
- `place_key` is `{county_fips}:{prop_id}` raw; `parcelNodeId` is the same with the prop_id
  normalized (`normalizeForJoin` in `packages/atoms/src/fact-writer-ids.ts`). For the six CTX
  counties the two coincide except where a prop_id carries leading zeros. P-161 formalizes the
  crosswalk; until then you REFUSE a parcel whose raw and normalized forms differ and both exist,
  never guess.
- The atoms store's identity range join: `entity_id >= place_key || ':' AND entity_id <
  place_key || ';'` (OPS-22 §1); never `LIKE`.

### The change — hauska-engine (the reader)

1. **A read-only factory role for the retrieval service.** `FACTORY_DATABASE_URL_RO`
   (role `parcel_record_ro`) exists in Secret Manager for cortex. Fleet memory: factory secrets
   are mirrored in two GCP projects (`hauska-prod-497015` and `legacy-design-tools-prod`); list by
   name and confirm the RO secret exists in `hauska-prod-497015` before you touch anything.
   **STOP and report the secret name, project and the exact `gcloud run services update
   --update-secrets` you intend to run; the operator approves the mount in-thread.** Then add it to
   `DEPLOY.md`'s documented deploy command so the next hand deploy does not drop it (fleet memory:
   deploys revert manual env; `--update-secrets` can no-op; `:latest` resolves at deploy time).
   Verify by violation: an INSERT through that connection must fail with "permission denied".
2. **The route.** `GET /property-nodes/:parcelNodeId/record` on the retrieval service. Same id
   validation as `atom-chain`. Behind the Bearer check. Response, per rail in the closed 65-rail
   registry (read the rail list from the factory's `src/lib/parcel-record-engine/rail-keys.js`
   at a pinned SHA and carry that SHA in the response; never hand-author the list):

   ```
   {
     parcelNodeId, placeKey, countyFips, railRegistrySha, readAt,
     rails: {
       <railKey>: {
         cell:        { kind, ...the cell_state fields verbatim },            // the accounting
         gate:        { verdict: "pass"|"refuse"|"excluded"|null, evaluatedAt },
         serve:       "record" | "refused" | "legacy-transitional",           // see 4
         atom:        { did, entityType, body } | null,                        // dereferenced when cell.atomDid exists
         atomBacked:  boolean,                                                  // false today for every cell; P-164 flips it
         rendering:   { text, atomVersion, vocabVersion } | null               // null until P-163/P-167
       }
     },
     companions: { <railKey>: [ ...parcel_record_companion_row rows ] },
     refused: { reason } | null                                                 // whole-parcel refusal, e.g. crosswalk ambiguity
   }
   ```

   `serve` is decided per (county, rail) exactly as `parcelRecordAllowlist.ts` decides it today:
   `record` when the pair is in the code-owned slate AND the gate verdict is `pass`; `refused`
   when slated and the gate said no; and `legacy-transitional` for an unslated pair. Port the
   slate as DATA (a JSON the two repos share by copy with a divergence test, or better a small
   package), never as a second hand-typed list; the L1 audit already found the slate count
   wrong once because it was arithmetic in a doc.
3. **Dereference.** When a cell carries an atom reference (none do today; build the path and
   prove it with a fixture), fetch the atom by DID from the substrate store and return it under
   `atom`. When it does not, return the cell's own value under `cell` with `atomBacked: false`.
   Never copy a cell value into the `atom` slot. Never fabricate a DID.
4. **`legacy-transitional` is a declared state, not a fallback.** R-6's end state is that unslated
   rails refuse. Today the panel shows facts from legacy paths (owner, footprint, boundary edges,
   pipelines from atoms; setbacks from layer 23 in Bastrop) that are not yet slated, and a hard
   cutover would erase them from the customer's screen. So the reader DECLARES
   `legacy-transitional` for an unslated pair and returns nothing for it; the consumer may keep
   its legacy read for that rail during the transition, labelled, and each rail's legacy path is
   retired in its own card when P-163/P-164 land its atoms and pointer. The reader never fetches
   a legacy path itself. Record in the close the count of pairs in each `serve` state for the six
   counties; that count is the retirement backlog for P152-PANEL and later cards.
5. **Companions.** `setbackRules` and the other companion-row rails are not scalars (S5 found
   `setbackRules` null on all 351,872 present rows because its content is a companion row).
   Return companion rows verbatim under `companions`.
6. **Non-vacuity and refusal.** A test proving the route returns `record` with a real cell value
   for at least one real fixture parcel and rail; a test that an unreadable factory store returns
   a declared refusal (503 with `errorClass`), never an empty `rails` map; a test that a
   crosswalk-ambiguous parcel refuses; a test that `atom` is populated from a fixture cell that
   carries a DID. Fixtures are captured from production reads with their timestamps.

### The change — legacy-design-tools (cortex consumes the reader)

7. `routes/brokerageNodeFacets.ts` and the serve wrappers stop reading the factory store
   themselves for the rails in the slate and call the retrieval service's `/record` route
   (server-to-server, `RETRIEVAL_API_KEY`, the same client `fetchPropertyAtomChain.ts` uses).
   The response shape the MCP and PE consume (`cityLimitsFact`, `floodHazardFact`,
   `setbackRulesFact`, the `parcelAreaSqFtFact` family, the `cadRoll` dollars) is unchanged on
   the wire; only its source moves. Carry `atomBacked` and `serve` through onto each fact so the
   MCP and the panel can label the transition.
8. **Retire what you replace.** `parcelRecordCellRead.ts`, `parcelGateVerdictRead.ts`,
   `parcelRecordAllowlist.ts` and the eighteen `*FromParcelRecord.ts` / `*ServeCutover.ts` pairs
   are the path this lane replaces. Delete them in this branch once the route is consumed, and
   remove `FACTORY_DATABASE_URL_RO` from cortex's deploy workflow so cortex holds no factory
   credential (R-8). If a caller outside the node-facets route still imports one of them, stop
   and list the callers in `contradicted` rather than leaving a parallel path alive.
9. `smartsite-mcp` keeps calling cortex (one hop); nothing changes there in this lane.

### Verification, and the falsifier you pre-register

Write down before running: *if for any parcel in the OPS-23 §7 set the cortex node-facets
response differs from the pre-change response on any slated rail's value, source or vintage,
the port is wrong; if any cortex file still opens the factory store after step 8, the
retirement is fake.* Then:

- Capture the pre-change `GET /api/brokerage/v1/place/node/<id>/facets` body for all five probe
  parcels from production before you deploy; diff post-deploy; the diff must be exactly the
  added `atomBacked`/`serve` labels and nothing else.
- `grep -r FACTORY_DATABASE_URL_RO artifacts/api-server` returns nothing after step 8.
- The reader's own self-tests (6) pass; CI conclusion strings pasted, not summarized.

Deploy: the retrieval service by hand per `DEPLOY.md` with the secret mounted (step 1's
approved command), then read the serving revision by field name from the traffic JSON; cortex
through the canary workflow, same read. Run `node scripts/surface-probe.mjs --rows P-152
--observations <file>` from doc_repo with `mcpSetbacks` observed from `get_smart_site` for each
probe parcel (the operator runs the connector and pastes the setbacks section); the P-152
predicate compares panel and MCP and will read UNMEASURED for the panel half until P152-PANEL
lands; say so in the close rather than claiming PASS.

### Close

AGENT_CONTRACT §6 artifact at the path the dispatch names, plus `probe`, `falsifier`,
`contradicted`, `leave_behind`. `leave_behind` must carry: the per-state pair counts from step
4 as the retirement backlog; every legacy import you could not delete; and the note that the
cached rendering slot is null until P-163 and P-167.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-11_p152-reader_cp1.json
  CP2: _inbox/2026-09-11_p152-reader_cp2.json
  CLOSE: _inbox/2026-09-11_p152-reader_close.json
