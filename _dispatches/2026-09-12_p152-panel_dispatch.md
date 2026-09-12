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

PLAN-ROW: P-152 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-map

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


## Mission — P-152 lane 2 of 2, P152-PANEL: the Property Explorer panel consumes the one reader

You are the deepest worker in OPS-23 wave 2. You do not spawn sub-agents. The dispatch
planner supervises you, reviews your design at CP1 and your first pilot at CP2, and runs the
surface probe itself after your deploy; your own probe run is evidence, not the close.

Exit-bounded verification: every command you run must terminate on its own; wrap anything
that could hang in `timeout`; never leave a watch, a tail or a dev server running.

### Where you work

`empressaioemail-tech/hauska-map`, worktree `P:/seat-worktrees/property/hauska-map-p152-panel`,
branch `feat/p152-panel-consumes-reader`, from `origin/main`. Declare the start commit before
you write anything. `P:/hauska-map` is someone else's checkout. P-172 (Find box) and P-167
(vocabulary import, after P-153) also change Property Explorer this wave: different files,
same app; rebase before your PR and re-green on the current base. The retrieval service is
yours to deploy only from `origin/main` after merge and only under a traffic lease the planner
holds for `hauska-retrieval-api`; lane 1 left it at `hauska-retrieval-api-00086-nur`.

### What lane 1 built, and what this lane makes true

Lane 1 (`_inbox/2026-09-11_p152-reader_close.json`) shipped `GET /property-nodes/:parcelNodeId/record`
on `hauska-engine/services/retrieval-api` (engine #417, #418, #419): per rail in the closed
65-rail registry, `cell`, `gate`, `serve` (`record` | `refused` | `legacy-transitional`),
`atom`, `atomBacked`, `rendering`, plus `companions` and a whole-parcel `refused`; cortex now
consumes it (LDT #658) and holds no factory credential. For `48021:34049`, 21 rails resolve
`record` and 44 `legacy-transitional`. R-6: every surface consumes the one reader. This lane
makes the panel the second consumer and starts retiring the paths it replaces; F6 (the panel
reads its own five-week-stale adapter) closes here.

### What is true today, verified 2026-09-12 at hauska-map `8b44f68` and LDT `6b579020` (`_inbox/2026-09-12_ops23_wave2_verify_panel_and_findbox.md`)

- `apps/property-explorer/api/_lib/pe-property-atoms.ts` (714 lines) has two upstreams:
  the retrieval atom chain at line 348 (`${baseUrl}/property-nodes/${id}/atom-chain`, base
  `HAUSKA_RETRIEVAL_API_URL` or `RETRIEVAL_API_URL`, default at 52-53) and cortex node-facets
  at 139-141 (`${baseUrl}/api/brokerage/v1/place/node/${id}/facets`, base `CORTEX_API_URL`).
  Flow at 604-636: atom chain, `adaptAtomChainToBakedFacets` (614), cortex facets merged by
  `mergeBakedBaseFacts` (629), `X-PE-Read-Path` set (636). The cortex call forwards the
  `pe_session` cookie as Bearer when present, else the service key (104-117, 551-553). The
  `/record` route is called nowhere in hauska-map.
- `apps/property-explorer/api/_lib/atom-chain-to-facets.ts` is 2,038 lines with 62 exports;
  the atom chain alone yields only `apn`, `zoning` and `envelope` (1996-2036); every other
  `baseFacts` field and every `*Fact` sibling is copied from cortex inside `mergeBakedBaseFacts`
  (1539) through one `*FactFromCortexRoot` copier per family (909-1419). `readPath` is
  `atom-chain` or `atom-chain-warm` (688, 1998); the BFF header adds `cortex`,
  `cortex-fallback`, `atom-pending` (73-77, 560, 648).
- The response type `PeBakedFacetsResponse` (682-770) is what the sheet resolver reads
  (`src/lib/fact-sheet-resolver.ts:2432 fetchBakedNodeFacets`, base `/api/spine/property-atoms`).
  Its top-level keys: `parcelNodeId, adapterKey, source, snapshotAt, facets, readPath,
  baseFactsMerged, floodHazardFact, landUseFact, specialDistrictFact, pipelineFact, wellFact,
  buildingFootprintFact, boundaryEdgeFact, ownerFact, cityLimitsFact, structuralFact,
  schoolDistrictFact, utilityServiceFact, overlayDistrictsFact, agValuationFact,
  maxImperviousCoverPctFact`; `facets.baseFacts` carries `apn, situsAddress, situsCity,
  situsState, landUse, acreage, cadRoll{marketValue, assessedValue, landValue, improvementValue}`
  plus `zoning, envelope, facetCoverage, livingAreaSqft, yearBuilt, yearBuiltSource,
  provenance, bakedAt`.
- The tax-assessed values are session-gated, not a separate path: cortex emits
  `{ state: "refused", code: "studio-gated" }` per cadRoll field to anyone without Studio, Team
  or Property Unlock (LDT `lib/cadRollValue.ts:452-460`, `routes/brokerageNodeFacets.ts:220-236,
  895-905`), and the BFF guard `isCadRollValueWire` (215-222) admits only `present | zero |
  absent`, so a refused wire collapses to `null` at 1583-1596 and the client renders "no CAD
  tax-assessed valuation on the county roll" (resolver 613-617) instead of the studio-gated
  upgrade cue it already handles (632-640). An anonymous probe reads `null`; a signed-in browser
  reads dollars. A typed refusal turned into an absence is the defect class ENFORCEMENT names.
- Cortex's facets route (`routes/brokerageNodeFacets.ts`, 1,009 lines) assembles its response
  at 885-935 from the baked snapshot plus verdict layers plus the cadRoll overlay plus the
  owner grant. Since lane 1 its slated rails come from the reader. The split today: zoning and
  envelope from the retrieval atom chain; apn, situs, landUse, acreage, cadRoll, yearBuilt,
  livingArea and every `*Fact` sibling from cortex.

### The change

1. **The BFF reads the reader.** `pe-property-atoms.ts` calls `GET /property-nodes/:id/record`
   on the retrieval service (same client and Bearer key as the atom-chain call) and composes
   `PeBakedFacetsResponse` from it for every rail whose `serve` is `record`: the cell value,
   `atomBacked`, `serve`, the cached `rendering` when present, and the reader's `readAt` as
   `bakedAt`. `readPath` becomes `record`. The wire shape the sheet resolver reads does not
   change; only its source moves. The response carries, per rail, `serve` and `atomBacked` so
   the panel can label the transition (P-167's vocabulary supplies the words once it lands;
   until then reuse the tokens the MCP already uses).
2. **Legacy-transitional stays legacy, labelled, for now.** For a rail whose `serve` is
   `legacy-transitional`, the BFF keeps today's cortex merge for that rail only, and marks it
   `serve: "legacy-transitional"` on the wire. For `refused`, the panel shows the refusal with
   its cell state; nothing falls through to a legacy copy. The count of rails in each `serve`
   state for the five probe parcels goes in the close: that is the retirement backlog for the
   next card, and each legacy rail's cortex copier in `atom-chain-to-facets.ts` is deleted in
   the card that repoints it, never before.
3. **Entitlement moves with the read, unchanged.** The reader has no session; the BFF does.
   The four cadRoll fields and the owner fact keep exactly today's gate: Studio, Team or
   Property Unlock sees them, anyone else gets a typed refusal. Reuse cortex's own decision by
   asking it (the entitlement route the panel already calls) rather than re-implementing the
   rule; the entitlement gate is not yours to widen or narrow. Then fix the collapse: a refused
   wire reaches the client as `{ state: "refused", code: "studio-gated" }` and the client's
   existing upgrade cue renders; `null` is never written for a refusal.
4. **Retire what you replace, by decline.** The atom-chain call at line 348 and
   `adaptAtomChainToBakedFacets` are the path this lane replaces for `record` rails; once the
   reader composes those rails, delete the atom-chain read for them and the copiers that no
   longer run. Any copier that survives because its rail is `legacy-transitional` is listed by
   name in `leave_behind` with the rail it serves. Prove retirement: a test that fails if the
   BFF calls `/atom-chain` for a rail the reader served, and `X-PE-Read-Path: record` on the
   live response.
5. **Non-vacuity and refusal.** Tests: the five probe parcels' facets after the change carry
   the same values, sources and vintages as before for every `record` rail (capture the
   pre-change payloads first, signed in AND anonymous, and diff); an anonymous read never
   carries a cadRoll dollar or an owner name; a Studio read carries exactly what it carried
   before; a reader outage (503 with `errorClass`) produces a declared refusal on the wire,
   never an empty facets object or a silent fall to the atom chain.

### Verification, and the falsifier you pre-register

Write down at CP1 before any code: *if for any probe-set parcel any `record` rail's value,
source or vintage on the Property Explorer facets differs from the pre-change capture, or an
anonymous read shows a studio-gated value, or `readPath` is anything but `record` after the
deploy, the port is wrong.* And: *if the BFF still calls `/atom-chain` for a rail the reader
served, the retirement is fake.*

Deploy Property Explorer through the Vercel CLI and confirm the live bundle and the
`X-PE-Read-Path: record` header on a live facets read. The planner runs
`node scripts/surface-probe.mjs --rows P-152 --observations <file>`: the P-152 predicate reads
`readPath` from the facets (must be `record`) and compares panel setbacks with the operator's
`get_smart_site` setbacks (`mcpSetbacks` per parcel, `observedBy`, `observedAt`) for the five
probe parcels; the disagreement count must be zero. The operator runs the connector once per
parcel on request, early.

### Close

`_inbox/<date>_p152-panel_close.json` per AGENT_CONTRACT §6 plus the OPS-23 four fields.
`leave_behind` must carry: the per-state rail counts for the five parcels; every copier kept
alive with its rail; the pre and post capture paths; and the two payload paths that still
reach cortex (the cortex facets merge for legacy rails, and `pe-share-view-compose.ts:77`,
which this lane does not touch) named for the next card.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-12_p152-panel_cp1.json
  CP2: _inbox/2026-09-12_p152-panel_cp2.json
  CLOSE: _inbox/2026-09-12_p152-panel_close.json

CLOSE SKELETON (the fields the enforcement gate reads; spell them exactly, or the gate refuses
the commit rather than guessing what you meant):
  {
    "lane": "p152-panel",
    "planRows": ["P-152"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
