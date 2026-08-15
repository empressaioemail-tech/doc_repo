---
id: 2026-08-15_a_wdll_smart_files_isolation
title: WDLL — Smart Files isolation (own repo, own DB, Cortex exit)
status: approved
last_updated: 2026-08-15
applies_to: portfolio
owner: nick
related: [_decisions/2026-08-15_smart_files_independent_module, _decisions/2026-08-15_capability_mount_composition, _inbox/2026-08-15_a_wdll_cc_done_l15, 90_operations/OPS-17_govtech_stack_plan_of_record, _smartsite_masters/05_smart_site_product_walkthrough, _smartsite_masters/07_smart_site_faq_bizdev, _smartcity_masters/34_smartcity_smart_files_and_foundation, 80_adrs/adr_017_atom_access_control, 28_mcp_first_product_design]
---

# WDLL: Smart Files isolation

Date: 2026-08-15  Status: approved
Operator approval: 2026-08-15 (operator: card approved; mount-composition vision captured in `_decisions/2026-08-15_capability_mount_composition.md`)
Plan row: G-58 (OPS-17, A-018 / A-019). Repo name locked: `empressaioemail-tech/smart-files` (https://github.com/empressaioemail-tech/smart-files).
This card does not reopen G-14. G-56 remains the Cortex prototype grade and is not the product home. This card does not close G-53. This card does not touch L26 / OPS-16.

## Done looks like

Smart Files is a module Joe Smith could run without ever seeing a Texas flood atom. It has its own repo, its own database project, and its own serving process. Bytes are content-addressed (CID on the version row). New file atoms default to tenant-private. SmartSite is one consumer: the map still reads the public property spine; the application layer mounts Smart Files for that user's data room on that place. Today's live save, draw, and share stay what they are (a get-by) until a later card replaces them. Command Center may mount the module later as an embed test. It is not the home.

cortex-api has no Smart Files routes. legacy-design-tools main has no Smart Files application code. The public SmartSite / atoms database has no files DSN. The files service has no atoms DSN. Empty tables left on cortex-prod from 0078-0081 are allowed until L26 is quiet; they are not served. Zombie *code* is not allowed.

## Migration strategy (easiest path: rewrite the shape, then cut Cortex out)

Do not subtree-move LDT into a new repo. That copies the wrong home. Rewrite the settled shape in the new repo:

- identity `smartfile:<scopeType>:<scopeId>:<docSlug>` (last-segment-is-slug)
- three tables: documents, versions, placements (placements reference the document)
- folder membership is `placed-on` edges
- accessPolicy default `tenant-private`
- CID on the version row; bytes not on cortex-api
- typed absence as a first-class payload

Port tests that prove those rules. Leave behind: cortex-prod connection, `#434` service-token-as-operator (that was a Cortex CC hack), 0081 folder sidecar as doctrine, seed blobs on the cortex image, FEMA JSON stub as a spine read.

Cortex exit is two cuts, in this order:

1. **Code cut (this card).** Unmount `/api/smart-files` from cortex-api. Delete serve/store/seed/contract/tests from LDT application trees. Delete or retarget the CC panel's cortex client. MCP tools stop calling cortex-api. Applied drizzle files 0078-0081 stay in the LDT migrate history (do not delete applied SQL). `schema/index` stops exporting Smart Files tables so new LDT code cannot import them.
2. **Table cut (blocked on L26 quiet).** One named migrate drops `smart_file_*` on cortex-prod. Not this card's serving-path grade. Not during Texas ingest.

L26 never sees a files migrate, a files deploy, or a files DSN.

## Prototype inventory (what must leave Cortex / stop being the home)

LDT / cortex-api (application code to delete after the new service exists):

- `artifacts/api-server/src/routes/smartFiles.ts` and the mount in `routes/index.ts`
- `artifacts/api-server/src/lib/smartFileServe.ts`
- `artifacts/api-server/src/lib/smartFileStore.ts`
- `artifacts/api-server/src/lib/smartFileAccess.ts` (if present)
- `artifacts/api-server/src/atoms/smart-file.contract.ts`
- `artifacts/api-server/scripts/seedSmartFilesDataRoom.mjs`
- `artifacts/api-server/src/__tests__/smart-file-*.ts`
- `lib/db/src/schema/smartFiles.ts` export from `schema/index.ts` (file may remain unused until table cut)

Keep as history only: `lib/db/drizzle/0078_*.sql` through `0081_*.sql`.

MCP (retarget, do not delete the tool names):

- `src/smart-files-client.ts` (base URL becomes the files service)
- `src/smart-files-tools.ts` (same four tools)

Command Center (delete cortex client; panel stays only if it mounts the new embed):

- `apps/command-center/src/admin/api/smartFilesClient.ts`
- `apps/command-center/src/admin/control/panels/SmartFiles.tsx` (replace or remove)
- registry row `smart-files`

## Acceptance items

1. **This card is approved and G-58 is in OPS-17.** No scaffold, no Neon, no LDT strip before that.
   | check: this file `status: approved` with operator date. OPS-17 has row G-58 citing this WDLL. A-017 already records the home ruling.
   | grade: [x] met 2026-08-15 | evidence: operator approved in session; this file `status: approved`; OPS-17 G-58 + A-018; mount vision `_decisions/2026-08-15_capability_mount_composition.md` (does not change items 2-11)
   | depends on: nothing (blocks 2)

2. **Own repo exists and cannot see the spine.** GitHub repo `empressaioemail-tech/smart-files` (name relocked A-002; operator created the remote). No `DATABASE_URL` for cortex-prod or hauska_mcp atoms. README states: SmartSite is a consumer; this is not cortex-api.
   | check: `gh repo view` URL. Grep of the repo and its deploy env: zero cortex-prod and zero atoms DSN names.
   | grade: [x] met 2026-08-15 | evidence: `gh repo view` https://github.com/empressaioemail-tech/smart-files visibility PUBLIC createdAt 2026-08-15T19:42:07Z. README at `3cafcd20` states SmartSite is a consumer and this is not cortex-api. Tree is README only; zero cortex-prod / atoms DSN names. Deploy env does not exist yet (item 4).
   | depends on: 1

3. **Own database project.** Separate Neon (or equivalent) project. Files role cannot connect to the atoms database. Atoms / L26 role cannot connect to the files database.
   | check: two failed-connection probes, timestamped: files creds against atoms URL refused; L26/atoms creds against files URL refused. No shared migrate workflow.
   | grade: [x] met 2026-08-15 | evidence: Neon project `smart-files` id `snowy-bread-83475727` endpoint `ep-winter-shape-aw8ken54` (pooler `c-12.us-east-1`). Public tables 0. FILES_SELF OK 2026-08-15T20:00:50Z db=neondb. FILES_CREDS_AGAINST_CORTEX REFUSED 2026-08-15T20:00:50Z password authentication failed (cortex host `ep-lucky-truth-apodo8hr` / `fancy-fire-06136146`). ATOMS_CREDS_AGAINST_FILES REFUSED 2026-08-15T20:01:10Z password authentication failed. No shared migrate. DSN is local-only at `%USERPROFILE%\.empressa\smart-files.database_url`, not in git.
   | depends on: 2

4. **Own serving process.** A service that is not cortex-api serves `/healthz` 200. Image is built from the new repo. GCP project locked: `smart-files-505619` (name `smart-files`, number `529170139834`, created 2026-08-15T19:47:56Z). Not `legacy-design-tools-prod`, not `hauska-prod-497015`, not `smartcity-os-prod`. No project id `smart-site` is visible to `empressaioemail@gmail.com`.
   | check: `gcloud run services describe` name is `smart-files`. Live process 200 `{ok:true,service:smart-files}`. cortex-api `/api/healthz` still 200 (no piggyback). No files DSN in Cloud Run env.
   | grade: [x] met 2026-08-15 | evidence: billing linked after quota grant. Service `smart-files` revision `smart-files-00001-rh6` @100% in `smart-files-505619` us-east1. URL `https://smart-files-padrd77ava-ue.a.run.app`. Image `us-east1-docker.pkg.dev/smart-files-505619/cloud-run-source-deploy/smart-files@sha256:74e2a5c6…`. `GET /` 200 `{"ok":true,"service":"smart-files"}`. Cloud Run env is null (no DSN). cortex-api `/api/healthz` 200. Ledger 200 `computedAt=2026-08-14T17:41:22.500Z` `satisfiedCells=616`. GFE on `*.run.app` intercepts exact path `/healthz` (Google HTML 404); the process still implements `/healthz` (local 200). Live probe is `GET /` per A-006.
   | depends on: 3

5. **Store rewritten on the files database.** Identity, three tables, placements-as-edges, tenant-private default, CID on version. Seed (if any) is on the files DB only.
   | check: SQL against the files project, not cortex-prod. `information_schema` on cortex-prod still has the old tables (until item 10) and they are not written by this seed. New document without an explicit policy is `tenant-private`.
   | grade: [x] met 2026-08-15 | evidence: applied `sql/001_foundation.sql` to `snowy-bread-83475727`. Tables documents/versions/placements/absence. Seed omitted access_policy; both rows `tenant-private`. Site entityId kept colons (`smartfile:site:parcel:48021:R12345:g58-geotech`). CID on version. cortex-prod still has 0078-0081 tables including folder sidecar; count of the two seed entityIds on cortex-prod = 0. Identity tests 4/4. Cloud Run still blocked (item 4); store does not wait on billing.
   | depends on: 3 (amended A-005: unblocked from 4)

6. **MCP tools call the files service.** Same four tool names. No call to `cortex-api` `/api/smart-files`.
   | check: live `tools/call` list/read against serving MCP. Client base URL is the files service. Anon refused. Operator or tenant key reads tenant-private seed. cortex-api `/api/smart-files/folders` is not 200 (item 7).
   | grade: [x] met 2026-08-15 | evidence: files HTTP on `smart-files-00002-wn5` @100% (`GET /` 200; anon folders 401; bearer list/read/placements 200 for `folder:tenant:g58-probe:room` + `smartfile:tenant:g58-probe:isolation-note` held, CID `bafyG58isolationnote0001`, servedAt 2026-08-15T20:29:46Z). MCP client `SMART_FILES_BACKEND_URL` + `SMART_FILES_API_KEY`; refuses cortex-api (unit 3/3). MCP #67 squash `724e312` CI pass. Serving MCP `hauska-mcp-server-00047-tpc` @100% tag `g58`. Live `POST /mcp` tools/call 2026-08-15T20:35Z: anon list isError refused; reporting+platform_internal key list SEED_FOLDER / read SEED_ENTITY HELD; probe keys revoked. Client env on 00047 is files URL not cortex-api. Cortex `/api/smart-files` still mounted (item 7). Ledger still 200 `computedAt=2026-08-14T17:41:22.500Z` `satisfiedCells=616`.
   | WDLL dual-interface: 28_mcp_first. SmartSite UI mount is item 8.

7. **Cortex application code is gone.** Serving cortex-api has no Smart Files routes. LDT main has no Smart Files serve/store/seed/contract/app tests. `schema/index` does not export Smart Files. Dirty LDT checkout is not the strip vehicle; strip is a clean worktree PR.
   | check: live `GET https://cortex-api-tds7av26va-uc.a.run.app/api/smart-files/folders` is 404 (or equivalent unmounted), not 401/403/200. `gh` on LDT main: the application paths in the inventory are absent. County ledger still 200 with `computedAt` (L26 surface unharmed).
   | grade: [x] met 2026-08-15 | evidence: clean worktree `g58/cortex-smart-files-strip` (dirty `feat/s1-instrument-hardening` unused). LDT #435 squash `7e8d819a` CI Test+Typecheck pass. Canary `cortex-api-00517-gaj` smoked at 0% (healthz 200, folders 404, ledger 200) then shift run 31908084661. Serving `00517-gaj` @100% tag `canary`. Live `GET /api/smart-files/folders` 404 `{"error":"unmounted","message":"Smart Files is not served by cortex-api."}` (not 401/403/200; tombstone required because unmatched `/api/*` is SPA HTML 200). origin/main inventory paths ABSENT. schema/index does not export. drizzle 0078-0081 + `schema/smartFiles.ts` remain. Ledger 200 `computedAt=2026-08-14T17:41:22.500Z` `satisfiedCells=616`. Files service `GET /` 200. No migrate. No DROP.
   | note: applied drizzle 0078-0081 stay on disk as history. That is not zombie application code.

8. **SmartSite is a consumer, not a host.** Property-explorer (or the live SmartSite app) can mount the module without a files DSN in its env. The public spine read is unchanged. Today's save/draw/share is still the get-by until a later card.
   | check: PE/SmartSite env listing has no files-database URL. A mount probe (even a stub panel or package import) resolves against the files service. Inspect-card / atom-chain still reads the spine.
   | grade: [x] met 2026-08-15 | evidence: hauska-map #163 squash `e0fb35f` + #165 squash `531ce1f` (ESM `.js` import; first prod `dpl_7dQtGBBSU9cKbxG8iZKybZcxvRqJ` was 500 `ERR_MODULE_NOT_FOUND`). Serving PE `dpl_CZCKscGZkiTBKDEs3rWBZ4LRCi1S` aliased `property-explorer-xi.vercel.app` + `smartsite.cloud`. Live `GET /api/pe-smart-files-mount` 200 `consumer=smartsite` `host=files-service` `backend=https://smart-files-padrd77ava-ue.a.run.app` `folder:tenant:g58-probe:room` (not cortex-api; no Neon host in body). `vercel env ls production` on project `property-explorer`: `SMART_FILES_BACKEND_URL` + `SMART_FILES_API_KEY` only; zero `*DATABASE*` / Neon / snowy-bread names. Facets `48021:28286` 200 `X-Pe-Read-Path: atom-chain-warm` `source=atom-chain`. Retrieval atom-chain same parcel 200, 11 atoms. `POST /api/pe-share` still the get-by BFF (OPTIONS 405 `method_not_allowed`). Save button unchanged in InspectCard. Not G-53. Not item 9.
   | home: SmartSite application layer. Not Command Center. Not `P:\smartcity-os`.

9. **Command Center is not the home.** Either the `smart-files` panel is removed, or it mounts the new embed and does not call cortex-api.
   | check: live `#panel=smart-files` is gone, or its network tab has zero `/api/spine/cortex/api/smart-files` calls.
   | grade: [x] met 2026-08-15 | evidence: hauska-map #166 squash `5bf06ec` CI Command Center `test` conclusion SUCCESS (run 31908955635). Serving CC `dpl_CSN8JfFa6jTU4qdiPn9dCrQ7JKN1` aliased `cmdcenter-blush.vercel.app` bundle `index-IA3I57kN.js` (same hash as pre-G-56 because this PR deleted only that panel). Live JS hits: `smart-files` 0, `Smart Files` 0, `smartFilesClient` 0, `/api/smart-files` 0, `#panel=smart-files` 0. Hash `#panel=smart-files` falls back to `plan-review`. Cortex folders still 404 unmounted. PE mount still 200. Ledger 200 `computedAt=2026-08-14T17:41:22.500Z` `satisfiedCells=616`. Dirty hauska-map unused; deploy from worktree linked to Vercel project `cmdcenter` (not `property-explorer`).


10. **cortex-prod table drop is queued, not done on this card.** A named follow-on (G-58b or an amendment) drops `smart_file_*` after L26 is quiet. This card's close lists that row as OPEN.
    | check: this close does not apply a DROP on cortex-prod. `_STATE.md` names the follow-on. L26 lease is not held by this lane.
    | grade: [x] met 2026-08-15 | evidence: no DROP applied. OPS-17 row G-58b exists (A-022). `_STATE.md` names G-58b OPEN. L26 still holds the atoms slot. drizzle 0078-0081 remain on LDT disk.


11. **Honest close.** Close names: files repo URL, files DB project, files service revision, MCP retarget SHA, LDT strip SHA, cortex-api live 404 on `/api/smart-files`, ledger still 200, SmartSite mount evidence, remaining OPEN (table drop, G-11 on files DB, replace PE get-by, G-53). Does not claim customer-done. Does not claim today's share link is Smart Files.
    | check: `_inbox/2026-08-15_a_smart_files_isolation_close.json` plus this card graded.
    | grade: [x] met 2026-08-15 | evidence: `_inbox/2026-08-15_a_smart_files_isolation_close.json`. This card graded 1-11. Not G-53. Not save/share.


## Out of scope

L26 / OPS-16 / any atoms `--apply`. Dropping 0078-0081 during this card. Replacing live SmartSite save/draw/share with file atoms (later card). G-11 full city-staff RBAC. G-53 Vertosoft. G-44 Bastrop corpus. Circle / VDA. Second MCP server. Cleaning the dirty LDT checkout. Baking seed blobs into cortex-api. IPFS public-network claims (CID is enough; cluster/host is a later card per doc 34).

## OPS-17 row (applied A-018)

| ID | L | Work item | Serves | Pass/fail instrument | Blocked on | Status |
|----|---|-----------|--------|---------------------|------------|--------|
| G-58 | 1.5 | Smart Files isolation: own repo, own DB, own service; rewrite the settled shape; MCP retarget; Cortex application code removed; SmartSite mounts as a consumer | A, SmartSite | This WDLL, graded by live 404 on cortex-api `/api/smart-files` plus files-service healthz plus DSN-refusal probes | A-017, this WDLL approved | CLOSED 2026-08-15 (G-58b table drop remains OPEN) |

G-56 stays the prototype grade. G-53 stays customer-done. G-19 stays CC docs.

## Amendments

A-001 2026-08-15. Operator approved the card. Repo name locked `hauska-smart-files`. Mount-composition decision filed (`_decisions/2026-08-15_capability_mount_composition.md`). Tokenization, closing-document vault, and digital-twin authoring are future mounts and are not this card's acceptance items. Reason: operator captured the long-term shape in the same ruling that approved isolation; absorbing those mounts into G-58 would silently expand the card.

A-002 2026-08-15. Repo name relocked to `empressaioemail-tech/smart-files` (operator created https://github.com/empressaioemail-tech/smart-files). RWA positioning filed (`_decisions/2026-08-15_rwa_mount_not_create.md`): we are not RWA creators; RWA operators mount onto provenance + Smart Files + map. Neon and GCP are new projects, not a database on cortex-prod and not a service on legacy-design-tools-prod or hauska-prod. Reason: operator created the remote under the product name; RWA sell is mount-not-create and must not expand G-58.

A-003 2026-08-15. Smart Files is an Empressa product (`_decisions/2026-08-15_smart_files_is_a_product.md`). Isolation items 2-11 do not change. Reason: operator corrected the planner's "module not product brand" framing.

A-004 2026-08-15. GCP project locked to `smart-files-505619` (display name `smart-files`). Operator said "gcp = smart-site"; no project id `smart-site` is visible on the active account. Neon remains `smart-files` / `snowy-bread-83475727`. Reason: record the live project id so the next agent does not deploy into SmartSite/PE or invent `smart-files-prod`.

A-005 2026-08-15. Item 5 (store on files Neon) is unblocked from item 4. Billing quota blocks Cloud Run only. Reason: the store checks are SQL against `snowy-bread-83475727`; waiting on Google quota would idle the product for no isolation reason.

A-006 2026-08-15. Cloud Run default URL intercepts `GET /healthz` (Google HTML 404). Item 4 live probe is `GET /` 200 `{ok:true,service:smart-files}`. The process still serves `/healthz` in code. Reason: `/foo` and `/api/healthz` hit the Node app; only exact `/healthz` is GFE. Do not piggyback cortex-api to fake `/healthz`.

## Finish card (graded at close)

Start vs finish: items 1-11 all met. Item 10 is met as a queue, not a DROP. G-58b remains OPEN. Close `_inbox/2026-08-15_a_smart_files_isolation_close.json`.

Live names at close: files repo `empressaioemail-tech/smart-files`; files Neon `snowy-bread-83475727`; files Cloud Run `smart-files-00002-wn5` in `smart-files-505619`; MCP `hauska-mcp-server-00047-tpc` #67 `724e312`; LDT strip #435 `7e8d819a` cortex `00517-gaj` folders 404; PE `dpl_CZCKscGZkiTBKDEs3rWBZ4LRCi1S` mount 200; CC `dpl_CSN8JfFa6jTU4qdiPn9dCrQ7JKN1` bundle `index-IA3I57kN.js` zero smart-files strings; ledger 200 `computedAt=2026-08-14T17:41:22.500Z` `satisfiedCells=616`.

Does not claim customer-done. Does not claim today's share link is Smart Files.
