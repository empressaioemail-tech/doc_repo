## Mission — P-301: the walk recognises the serve's declined-retirement body

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` and open a PR. You do not
deploy, rebuild an image, run a walk against production, or run any publish; the integration
seat does those after merge.

### Where you work

`hauska-factory`, fresh clone from `origin/main` under `P:/tmp/` into a NEW directory, branch
`fix/p301-walk-record-retired`. Declare the start commit (factory main `47c7dfc` at compile).
Register it under the property seat and remove the entry at close. Open PRs to stay clear of:
#163 (P-294) edits `cloudbuild.publish.yaml`, and the stale #37 (`seat/property-ctx-walk-alias-schema`)
edits `src/jobs/verify-walk.mjs`; do not build on #37 and say in the close whether your change
conflicts with it.

### The finding (A-201, measured 2026-09-17)

- Hays production publish `factory-bastrop-publish-g874s` wrote the county (publish run
  `eb1d2676-df0c-4432-afb8-629d5808d6a1`), then exited `WALK_FAILED`. Walk
  `d4c2a12c-354d-4a57-adaf-1251839b4d0d` (target `https://smartsite.cloud`): 96 parcels, 80 pass,
  16 fail, `retiredCount` 0, `sFamilies.failed` empty, and
  `declinedRetirement: {"rule":"declined-earned-retirement","accepted":0,"storeErrors":0}`.
  Every failing `walk_results` row reads `{"grade":"BP-MEANING-01","reason":"HTTP 404",...}`.
- The 16 include the gold `48209:135570`. The live route the walk reads,
  `https://smartsite.cloud/api/spine/cortex/api/brokerage/v1/place/node/48209%3A135570/facets`,
  answers 404 with
  `{"error":"record_retired","errorClass":"no_coverage","message":"This parcel node's record is retired: ...","retirement":{"asOf":"2026-09-17T09:56:34.372Z","basis":"48209:135570: prop_id 135570 carries no row in the Hays County published parcel index (txgio_parcel) ... Retired by the tier-1 bake's account-keyed exclusion (P-180) ...","status":"retired","verdict":"absent-verified",...}}`.
  The production store (`place_layer_snapshots`, `adapter_key node-facets:tier1`,
  `place_key node:48209:135570`) holds that row at run `eb1d2676` with `recordRetirement.status`
  `retired`.
- `src/jobs/verify-walk.mjs`: `DECLINE_REFUSAL_ERROR = "not_baked"`, and
  `isTypedNoCoverageRefusal` requires `error === "not_baked"` and `errorClass === "no_coverage"`.
  That body was measured live on 2026-09-14 (factory `d249ba1`, #151). Half (ii), the store read
  through `resolveDeclinedEarnedRetirement`, runs only when half (i) matches.
- LDT P-206 (#699, `ba6a5a69`, `artifacts/api-server/src/routes/brokerageNodeFacets.ts` around
  line 927) changed that 404 from `not_baked` to a declared `record_retired` with the retirement
  object. So half (i) never matches, half (ii) never runs, and every declined retirement in 48209
  and 48491 grades `BP-MEANING-01` fail. Each fix was correct alone.
- 09-14 precedent (A-175, `_inbox/2026-09-14_step4_restamp_outcome.json`): the same 16-row split
  on Hays production run `bc47625c`, then with the `not_baked` body.

### What to build

1. **Half (i) admits the declared body.** `record_retired` / `no_coverage` on a 404 is the typed
   refusal. Keep `not_baked` only if you can show a serving revision that still emits it (read
   the staging and production LDT revisions' source at their commits, or say you could not);
   otherwise remove it rather than keeping a dead alternative. The body's own `retirement`
   object is NOT sufficient evidence alone: half (ii) still requires the target store to hold
   the earned retirement independently. Keep the grade reason naming both sources.
2. **Tests, both directions.** `record_retired` plus a store retirement grades RECORD_RETIRED;
   `record_retired` without one fails `BP-MEANING-01` with the store reason; a 404 with any other
   body (a gateway 404, `not_found`, an untyped body) fails and never reads the store; a 500
   never reads the store. Show one test failing before your change and passing after.
3. **A drift control.** The two bodies diverged because nothing compares them. Propose and, if
   reachable, build the smallest control that fails when the serve's declined-retirement body and
   the walk's accepted body differ again (for example a test that reads the string from the LDT
   source at the image's pinned `_LDT_SHA`, or a shared constant the bake bundle already
   carries). If none is reachable from this repo, say exactly why and what would be needed.
4. **Report, do not fix: the sweep namespace.** In 48209 and 48491 the node id is the parcel-map
   (TxGIO) prop_id (ruling `_decisions/2026-09-13_hays_node_identity_is_the_parcel_map_id.md`),
   but the walk takes its gold and its street-area neighbours from `landing_cad_property`, the
   account namespace. Read-only, measure on walk `d4c2a12c`'s 52 swept ids: how many are map ids
   (present in `txgio_parcel` for 48209), and for three passing ids whether the served
   `situsAddress` matches the swept account's situs. State whether the 80 passes are the parcels
   the walk believes it is walking.

### Falsifiers, pre-register your answers first

1. With your change, a fixture carrying the exact 2026-09-17 production body plus a store
   retirement grades RECORD_RETIRED (paste the test).
2. Removing half (ii) from the fixture turns that grade into a failure (test).
3. Reverting half (i) to `not_baked` only fails a test.

### Do not

- Rebuild or deploy any image, run `factory-verify-walk`, or run any publish.
- Write to any store. Read-only queries only, with `default_transaction_read_only=on`; take a
  heavy-scan lease (`scripts/heavy-scan-lease.mjs` in doc_repo) before any read beyond single
  primary-key lookups.
- Touch `publish-gate-sched.mjs`, `cloudbuild.publish.yaml` or `parcel-setback-cells.mjs`, or
  launch sub-agents.

### Close

Snapshot; files touched; the PR with every CI check's literal conclusion string; the three
falsifiers with evidence; the drift control or the reason it is not reachable; the sweep
namespace measurement. `status`: `closed-partial` until the integration seat's production
re-walks of Hays `eb1d2676` and Williamson read green. `probe`:
`{"notApplicable": "build lane; graded by the integration seat's production re-walk"}`.
`subAgents`. `leave_behind`.
