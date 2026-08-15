---
id: 2026-08-15_smart_files_isolation_and_qa_rooms
title: Session close — Smart Files isolation (G-58) and QA rooms (G-59)
date: 2026-08-15
agent: planner
repo: docs
session_type: execute
memory_graded: [standing-decisions-travel:HELPED, deploys-planner-owned:HELPED, code-done-neq-customer-done:HELPED]
rolled_up: false
rolled_up_into: []
last_updated: 2026-08-15
---

# Session capture: 2026-08-15 Smart Files isolation and QA rooms

## What was done

Operator approved isolation, then asked to prove create/upload/share/org at the Smart Files product first, leave Cortex unmounted, and deploy a Vercel QA UI for his walk.

G-58 isolation closed on the serving path. Own public repo `empressaioemail-tech/smart-files`. Own Neon `snowy-bread-83475727`. Own GCP `smart-files-505619`. Cloud Run `smart-files` in us-east1. MCP retargeted off cortex-api (hauska-mcp-server #67). Cortex `/api/smart-files` 404 unmounted (LDT #435). PE mounts as a consumer (hauska-map #163 + #165). Command Center panel removed (hauska-map #166). Cortex-prod `smart_file_*` tables were not dropped (G-58b).

G-59 QA rooms closed on the serving path. Write API on files Cloud Run `smart-files-00003-kmm`. First-class folders table. Upload stores bytes keyed by `sha256` CID, default `tenant-private`. Share mints a read-only token for one room. Org list is tenant-scoped. Vercel project `smart-files-app` live at https://smart-files-app.vercel.app. BFF holds URL plus service token only. Cortex stayed 404. PE isolation seed still lists. Ledger still 200.

Operator browser QA is the remaining walk, not a WDLL gap.

## What was learned (changes to ground truth)

Smart Files is an Empressa product with its own repo, store, and serving process. Isolation is housing, not a demotion. Cortex G-56 is a disposable prototype. Command Center is not the home.

Capabilities mount into one interface. Stores do not merge. We are not RWA creators. RWA operators mount onto provenance, this file room, and the map.

A folder is a first-class room (`smart_file_folders`), not inferred from documents. Actor is `(orgId, userId)`. Share is a capability on one node, not an org dump and not a second policy engine.

`sql/002_rooms.sql` DISTINCT backfill can steal a sibling document's scope. Seed folder `folder:tenant:g58-probe:room` was rewritten as site/parcel and PE listed zero seed folders until `sql/003_fix_seed_folder_scope.sql`. Do not re-run a naive DISTINCT backfill.

Vercel project links are load-bearing. `P:\hauska-map\.vercel` is property-explorer. CC deploys from a worktree linked to `cmdcenter`. Smart Files QA deploys from `P:\smart-files\web` into `smart-files-app` only. First Vercel deploy before env exists is 503 `mount_not_configured`. GFE intercepts exact `/healthz` on `*.run.app`; live files probe is `GET /`.

`00_current_state.md` had grown to a kitchen-sink log (last_updated 2026-08-10, hundreds of lines). Protocol says 80 to 120 body lines. This close resets it to the six-section snapshot and points at `_STATE.md` for live infra.

`MEMORY.md` is named by `_STATE.md` and AGENTS.md and is not in the repo. Standing decisions live in `_STATE.md` until the planner restores the index.

L26 scoreboard at close: phase `pipelines-redrain`, current `48035` started 2026-08-15T20:28:35Z, queue 193, deferred 52, wells/footprints/roads/cad empty. Flood+Harris already applied. Do not start a second atoms writer.

## What's still open

1. Operator browser QA at https://smart-files-app.vercel.app (Joe/Acme, Jane/Acme, Nick/Empressa, `#share=`).
2. Commit `P:\smart-files` write API + `web/` (uncommitted; serving image is already `00003-kmm`).
3. Write MCP tools (create folder, upload, share) on the existing Hauska MCP server. Not a second server.
4. G-58b DROP of cortex-prod `smart_file_*` after L26 is quiet. Not now.
5. G-11 real login / city-staff RBAC. QA personas are not that.
6. G-53 customer-done. G-56 remains the Cortex prototype grade and is not the product home.
7. Later remount of Cortex or Command Center as an embed. Not this session.
8. L26 remaining ingest through wells, footprints, roads, CAD 48439/48113/48135, then ledger materialize and gate-grade.
9. Doc_repo working tree is dirty far beyond this session. Do not batch-commit the whole tree.

## Suggested canonical doc updates

`_STATE.md` LIVE INFRA and OPEN already carry G-58/G-59 serving truth. `00_current_state.md` regenerated this close. OPS-17 G-59 marked CLOSED on serving path. Thesis ledger has the G-59 rooms entry. Promote the seed-folder backfill LESSON to a mechanical guard when the files repo gets tests for scope backfill. Do not self-promote to MEMORY.md.

## Decisions this session (do not relitigate)

1. Isolation card approved. Own repo, own Neon, own GCP/Cloud Run. Rewrite the shape. Do not subtree LDT.
2. Mount composition. Capabilities mount into one interface.
3. RWA: mount, not create.
4. Smart Files is an Empressa product.
5. Repo name `empressaioemail-tech/smart-files` (PUBLIC).
6. Prove create/upload/share/org at Smart Files first. Leave Cortex as G-58 left it. Vercel QA UI for operator walk.

## Live at close (verified this session)

- Files: `smart-files-00003-kmm` @100% `https://smart-files-padrd77ava-ue.a.run.app` GET / 200.
- QA UI: https://smart-files-app.vercel.app project `smart-files-app` `prj_Mkk6of1Bg3pfu5OIywkVOcvvZS3p` `dpl_GFNfepXPZyQhyDnCTrHzQ3zHgKxP`.
- BFF: create Jane QA room 201; list Acme has Joe + Jane rooms; list Empressa empty; upload `jane-note.txt` tenant-private; share token resolves Closing room + `note.txt` only.
- Cortex: `cortex-api-00517-gaj` folders 404 unmounted. Ledger 200 `computedAt=2026-08-14T17:41:22.500Z` `satisfiedCells=616`.
- PE: `dpl_CZCKscGZkiTBKDEs3rWBZ4LRCi1S` mount 200 `folder:tenant:g58-probe:room`.
- CC: `dpl_CSN8JfFa6jTU4qdiPn9dCrQ7JKN1` no Smart Files panel.
- MCP: `hauska-mcp-server-00047-tpc` tag `g58` list/read only.

## Atoms / thesis touched

File-set edges not identity. Tenant-private default. Capability-mount composition. Access policy stays at the MCP gate; files HTTP is service-token only.

## References

- `_inbox/2026-08-15_a_wdll_smart_files_isolation.md`
- `_inbox/2026-08-15_a_smart_files_isolation_close.json`
- `_inbox/2026-08-15_a_wdll_smart_files_qa_rooms.md`
- `_inbox/2026-08-15_a_smart_files_qa_rooms_close.json`
- `_decisions/2026-08-15_smart_files_is_a_product.md`
- `_decisions/2026-08-15_capability_mount_composition.md`
- `_decisions/2026-08-15_rwa_mount_not_create.md`
- `90_operations/OPS-17_govtech_stack_plan_of_record.md` rows G-58, G-58b, G-59
- `_scratch/ops17_smart_files_cc_done.md`
