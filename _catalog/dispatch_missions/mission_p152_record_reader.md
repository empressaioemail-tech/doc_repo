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
