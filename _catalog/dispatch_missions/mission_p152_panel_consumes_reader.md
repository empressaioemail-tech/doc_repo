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
