# OPS-17 Smart Files Layer 1.5 CC-done (2026-08-15)

## OPEN

- SESSION CAPTURE 2026-08-15 filed `_sessions/2026-08-15_smart_files_isolation_and_qa_rooms_claude_code.md`. `00_current_state.md` reset to protocol snapshot. Operator browser QA remaining at https://smart-files-app.vercel.app. Write MCP tools OPEN on existing Hauska MCP server. Cortex stays unmounted. Do not remount CC. Doc_repo and `P:\smart-files` uncommitted until operator go.
- HOME (2026-08-15, OPERATOR CONFIRMED): Smart Files is an independent module. Own repo, own DB. SmartSite is one consumer. Today's PE save/draw/share is a get-by, not atoms, not Smart Files. Knit is application-layer only. Decision `_decisions/2026-08-15_smart_files_independent_module.md`. A-017.
- MOUNT (2026-08-15, OPERATOR CONFIRMED): capabilities mount into one interface. Digital twin + Smart Files + SmartSite context + closing documents + tokenization if that later proves real. Same pattern for title company, city, builder, agent, buyer, seller. Bastrop example is operator-attributed pattern. Decision `_decisions/2026-08-15_capability_mount_composition.md`. Does not expand G-58 items.
- ISOLATION CARD CLOSED 2026-08-15 on serving path. Items 1-11 MET. G-58b OPEN (no DROP). Close `_inbox/2026-08-15_a_smart_files_isolation_close.json`. CC panel removed (`dpl_CSN8JfFa6jTU4qdiPn9dCrQ7JKN1`, bundle `index-IA3I57kN.js`, zero smart-files strings). FREEZE cortex-prod writes. Do not DROP 0078-0081 until L26 quiet.
- RWA (2026-08-15, OPERATOR CONFIRMED): we are not RWA creators. RWA operators mount onto provenance + Smart Files + map. Decision `_decisions/2026-08-15_rwa_mount_not_create.md`. Not a G-58 item.
- PRODUCT (2026-08-15, OPERATOR CONFIRMED): Smart Files is an Empressa product. Isolation is housing, not a demotion. Decision `_decisions/2026-08-15_smart_files_is_a_product.md`. Planner "module not product brand" yellow withdrawn.
- SDK sequencing (2026-08-15, OPERATOR CONFIRMED): vision filed. Data room = who/what. SDK = how do I pay. ICC is first real SDK customer. CC-done takes accessPolicy + product key only. A-013 during CC-done. G-11 after CC-done. Payment/VDA/Circle at G-50.

- P-A4-LIVE-1 CLOSED 2026-08-15T18:03Z. `#panel=smart-files` shows Bastrop County Planning + seed files. Do not close G-56 until remaining WDLL items grade.
- P-A4-LIVE-2 CLOSED 2026-08-15T19:08Z. Root cause: cmdcenter `MCP_PRODUCT_KEY` was `52bec628` (PE+CC terrain-export, product=public, platform_internal=false, last_used during the empty-folder probes). The July CC key `c1fcfe13` is still active and platform_internal but last_used 2026-07-14 (rotated off Vercel). Minted `f628f420` reporting+embedder+platform_internal; Vercel env updated; CC redeploy `dpl_HvAoDF7bmyZhLZj7FchvTaeBfFkg`. Did not flip `52bec628` (PE still uses it). Did not change `canReadAccessTarget`.
- PDF bytes: typed `blob_not_pinned` for `bafyG56seedpdf0001`. Bake `seed-blobs/` into the cortex-api image or set `SMART_FILES_SEED_BLOB_DIR`.
- Panel tree is jurisdiction-48021 only; site folder `folder:site:parcel:48021:R12345:geotech` is live on the API but not clickable in the tree. Dual-edge is visible on the UDC sidebar (placements 2).
- list endpoint `placementCount` is 1 even when read returns 2 placements (per-folder DISTINCT, not document-total).
- STALE backdate (WDLL 6) not yet fired. Threshold 2592000s; seed computedAt is still fresh.
- WDLL APPROVED. A-016 / G-56 in OPS-17. Dispatch `_dispatches/2026-08-15_a4_dispatch.md`.
- G-19 remains docs, not this track.
- Customer-done = G-53 after Lane B SmartCity / Bastrop. Not this card.


## LESSON

- MCP `ci-gate-map-vs-server-tool` greps only `src/tools.ts`. A `registerXTools(server)` helper in another file will FAIL stale even when tools are real and in REPORTING_TOOLS.
- AtomListRow `title` is the HTML tooltip, not visible text. Record-pane proofs must assert claimType/preview or add a visible title span.
- ADR-018: MCP consumes the SDK only for paid-tier VDA/revenue routing. Free/operator MCP must not take a transitive commerce dependency.
- 29_mcp_surface_tier_model: Command Center / ECI is non-commercial. No metering, no revenue routing, no take rate. That is why "finish the SDK" is the wrong attach point for 1.5.
- SERVICE_API_KEY on the cortex CC proxy is the operator subject for the store (#434). MCP `X-Hauska-Key` is a different subject: ADR-017 `platformInternal` on the product key. Fixing one does not fix the other. Do not change `canReadAccessTarget` to treat any reporting key as platform-internal.
- Command Center map is the operator harness. SmartSite map is the product. Do not use CC as the analog for Smart Files. Live PE save/share is a get-by, not file atoms.
- PE Vercel functions are Node ESM. Import `_lib` with an explicit `.js` extension. Missing it is CI-green (vitest) and prod-500 (`ERR_MODULE_NOT_FOUND`). First G-58 item 8 deploy `dpl_7dQtGBBSU9cKbxG8iZKybZcxvRqJ` failed this way; #165 fixed it.
- Deploy PE from hauska-map ROOT when `.vercel/project.json` is `property-explorer` (Root Directory is already `apps/property-explorer`). `--cwd apps/property-explorer` doubles the path. Never deploy CC from the PE-linked checkout. Dirty `P:\hauska-map` is not the vehicle.
- Smart Files QA UI deploys from `P:\smart-files\web` into Vercel project `smart-files-app` only. Confirm `.vercel/project.json` projectName before `vercel deploy --prod`. First deploy without env is 503 `mount_not_configured`; redeploy after env add.
- `sql/002_rooms.sql` DISTINCT backfill can steal a sibling document's scope. Seed folder `folder:tenant:g58-probe:room` was rewritten as site/parcel. Fix is `sql/003_fix_seed_folder_scope.sql`. Do not re-run a naive DISTINCT backfill.

- "Customer-done" is not "CC module." CC is the operator proving ground. Customer-done is a live probe on a customer surface (SmartCity Bastrop). Doc 34 "built and running in the command center" is the CC-done claim, still not collateral.
- Doc 34 internal mechanic already is the data room: files = atoms with attachments, folders = nodes, one record many relationships. CC-done renders that. Do not invent a parallel file-share product.

## DEAD-END

- Treating CC MCP_PRODUCT_KEY as platform_internal because a 2026-07-04 note named key_id c1fcfe13 that way. Live 2026-08-15: reporting key authenticates (not anon) but `canReadAccessTarget` returns false for platform-internal, so tools empty-filter. Revenue Meter DEGRADED is the same key class.
- Treating G-19 (CC authoritative docs) as the data-room build.
- Shipping a CC panel with no MCP tools (violates 28_mcp_first).
- Taking "all Hauska SDK capabilities" as CC-done scope (payment/VDA/G-11 would unbounded the card).
- Calling four-lane Layer 1 done. Only Lane A foundation is done. G-10 remainder, G-11, G-12, G-13, G-15..G-18 still OPEN.

## GROUND-TRUTH

- 2026-08-15T21:26Z: G-59 serving close. Files `smart-files-00003-kmm` @100%. QA UI https://smart-files-app.vercel.app project smart-files-app prj_Mkk6of1Bg3pfu5OIywkVOcvvZS3p dpl_GFNfepXPZyQhyDnCTrHzQ3zHgKxP. BFF POST jane room 201 folder:tenant:acme:jane-qa-room; list acme has Closing room (joe) + Jane QA room (jane); list empressa []; upload jane-note.txt 201 sha256:2d58b12a… tenant-private; share token NFKLgL2BNh58nu5nKpgmaghD resolves Closing room + note.txt only. Cortex folders 404 unmounted. PE mount 200 folder:tenant:g58-probe:room. Ledger 200 computedAt=2026-08-14T17:41:22.500Z satisfiedCells=616. First Vercel deploy dpl_DXQUBqJPL1vaRX4fvGGHwgYcrVoz was before env (503 mount_not_configured); redeploy after env add is the live one.
- 2026-08-15T21:18Z: Item 9 MET + G-58 serving close. CC `dpl_CSN8JfFa6jTU4qdiPn9dCrQ7JKN1` aliased cmdcenter-blush bundle `index-IA3I57kN.js`. Live JS hits smart-files / Smart Files / smartFilesClient / /api/smart-files / #panel=smart-files all 0. map #166 `5bf06ec` CI run 31908955635 test SUCCESS. Deploy from worktree `P:\hauska-map-worktrees\g58-cc-unmount` linked to Vercel project `cmdcenter` (not the PE-linked dirty checkout). Cortex folders 404 unmounted. PE mount still 200 isolation folder. Ledger 200 computedAt=2026-08-14T17:41:22.500Z satisfiedCells=616. healthz 200. Item 10 queued as G-58b. Item 11 close filed.
- 2026-08-15T21:10Z: Item 8 MET. PE `dpl_CZCKscGZkiTBKDEs3rWBZ4LRCi1S` aliased `property-explorer-xi.vercel.app` + `smartsite.cloud`. Live `GET /api/pe-smart-files-mount` 200 `host=files-service` `backend=https://smart-files-padrd77ava-ue.a.run.app` `folder:tenant:g58-probe:room`. Env names: `SMART_FILES_BACKEND_URL` + `SMART_FILES_API_KEY`; zero files DSN. Facets `48021:28286` 200 `X-Pe-Read-Path: atom-chain-warm`. Atom-chain 11 atoms. map #163 `e0fb35f` CI run 31908347276 success; #165 `531ce1f` CI run 31908594123 success. First prod deploy `dpl_7dQtGBBSU9cKbxG8iZKybZcxvRqJ` 500 ERR_MODULE_NOT_FOUND (no `.js`). Save/share still the get-by. Not G-53. Not item 9.
- 2026-08-15T20:58Z: Item 7 MET. Serving cortex-api `00517-gaj` @100% tag `canary` image `7e8d819a`. Live `GET /api/smart-files/folders` 404 `{"error":"unmounted"}`. Ledger 200 computedAt=2026-08-14T17:41:22.500Z satisfiedCells=616. LDT #435 squash `7e8d819a`. Dirty checkout unused. No migrate. No DROP. Files `GET /` 200.
- 2026-08-15T20:35Z: Item 6 MET. Serving MCP `hauska-mcp-server-00047-tpc` @100% tag `g58` (hauska-prod-497015). `POST /mcp` tools/call list_smart_file_folders anon isError refused; reporting+platform_internal key returns `folder:tenant:g58-probe:room`; read_smart_file `smartfile:tenant:g58-probe:isolation-note` held. Probe keys minted and revoked. MCP #67 squash `724e312` CI pass. Client env `SMART_FILES_BACKEND_URL=https://smart-files-padrd77ava-ue.a.run.app`. Files revision `smart-files-00002-wn5` @100%; anon folders 401; bearer 200. Cortex `/api/smart-files` still mounted (item 7). Ledger 200 computedAt=2026-08-14T17:41:22.500Z satisfiedCells=616.
- 2026-08-15T20:29Z: Files HTTP live on `smart-files-00002-wn5`. Secrets `smart-files-database-url` + `smart-files-service-token` (Secret Manager, not env plaintext). Repo SHA `0a21c28`.
- 2026-08-15T20:21Z: Cloud Run `smart-files` in `smart-files-505619` us-east1 revision `smart-files-00001-rh6` URL `https://smart-files-padrd77ava-ue.a.run.app`. `GET /` 200. Env null (no DSN). GFE intercepts `/healthz`. cortex `/api/healthz` 200. Ledger 200 computedAt=2026-08-14T17:41:22.500Z satisfiedCells=616. Item 4 met (A-006). SUPERSEDED on revision by 00002-wn5.
- 2026-08-15 (session): files Neon store applied. Seed `smartfile:tenant:g58-probe:isolation-note` and site geotech, both tenant-private by column default. cortex-prod still has 6 smart_file_* tables including folder sidecar; seed entityIds count 0 there. Item 5 met. G-58b OPEN.
- 2026-08-15T19:47:56Z: GCP project `smart-files-505619` name `smart-files` number `529170139834` ACTIVE. Cloud Run API not enabled. Item 4 not met.
- 2026-08-15T20:00:50Z: FILES_SELF OK on `snowy-bread-83475727` / `ep-winter-shape-aw8ken54-pooler.c-12.us-east-1`. Public tables 0. FILES_CREDS_AGAINST_CORTEX REFUSED (password authentication failed). 2026-08-15T20:01:10Z: ATOMS_CREDS_AGAINST_FILES REFUSED (password authentication failed). Item 3 met. DSN not in git.
- 2026-08-15T19:42:07Z: `gh repo view empressaioemail-tech/smart-files` visibility PUBLIC. README contract landed `3cafcd20`. Item 2 met. Tree is README only.
- 2026-08-15 (session): operator approved isolation WDLL. G-58 + A-018/A-019. Mount-composition + RWA mount-not-create filed. Item 1 graded met.
- 2026-08-15T19:08Z: CC MCP dual-interface live. `list_smart_file_folders` via `/api/spine/mcp` returns Bastrop County Planning; `read_smart_file` udc-seed held; placements 2; tenant-private held for operator; anon isError refused; bad key 401; metering summary HTTP 200. New key `f628f420` last_used=2026-08-15T19:08:29.859Z. Deploy `dpl_HvAoDF7bmyZhLZj7FchvTaeBfFkg` aliased cmdcenter-blush. Bundle still `index-BjA2iBi8.js`.
- 2026-08-15T18:03Z: cortex-api `00515-ras` @100% tag canary image `6c7fa3eba3b16b974542e4ae01ecff49e039ddf7` (shift run 31899889638). Canary smoke at 0%: healthz 200, ledger 200 computedAt=2026-08-14T17:41:22.500Z satisfiedCells=616, folders+token 200 `Bastrop County Planning`; prod 00513 still 403 with same token (pre-shift control). After shift: CC proxy folders/files/records 200. Live panel screenshot-grade: folder + two files + FEMA SFHA record pane + UDC sidebar placements(2) + typed blob_not_pinned. MCP `/health` 200 on `00067-qav`. Anon MCP list/read isError refused. Bad X-Hauska-Key initialize 401. CC MCP proxy list returns empty folders.
- 2026-08-15T16:54Z: CC `dpl_ESuxjNgG2e3a9W3XN5zBz7wTBFHs` aliased cmdcenter-blush.vercel.app bundle `index-BjA2iBi8.js`. `#panel=smart-files` LIVE in nav. Body 403 "Caller is not permitted to read this resource." Proxy `/api/spine/cortex/api/healthz` 200; `/api/smart-files/folders?...` 403. SUPERSEDED by 18:03Z panel-live (P-A4-LIVE-1).
- 2026-08-15T16:54Z: MCP serving `hauska-mcp-server-00067-qav` @100% tag `g56-b645630`. `/health` 200.
- 2026-08-15T16:49Z: cortex-api `00513-xug` @100% image `99120aba`. 0081 applied 16:42:40Z. Seed applied: folders=2 docs=3 placements=4 records=1 absence=1.
- 2026-08-15T16:22Z: canary `cortex-api-00511-tad` smoked at 0% before shift. `/api/healthz` 200; ledger 200.
- 2026-08-15T16:20Z: MCP #66 `ci-gate-map-vs-server-tool` FAILURE stale four smart-file tool names (grep tools.ts only). Map #162 test FAILURE FEMA SFHA not visible. LDT #433 Test FAILURE.
- 2026-08-15T15:48Z: serving cortex-api `cortex-api-00509-nij` @100%, image digest sha256:a9a58e3915d87dcd275d6d665ac13fffdbc6b8ac75ff6cb0ae3baa32589c0e52 tagged `4dfb118c523745e9eca598a19349ab2e56e3a61b`.
- 2026-08-15T15:29Z: Artifact Registry has `015b15d6246ea6af12b6b25daa69eae8a75fc61b` + `latest` (create 2026-08-15T09:29:50Z).

