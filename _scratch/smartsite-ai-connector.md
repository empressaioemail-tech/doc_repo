# Scratch: Smart Site agent distribution

Workstream for OPS-16 P-86 / P-87 / P-88. Read this before re-deriving the 2026-08-26 exploration.

## LESSON

Share URL is `/share#<token>`. HTTP never sends the fragment. Content negotiation on that URL cannot see the capability. `pe-share-view.ts` already returns JSON at `/api/pe-share-view?token=&what=brief|dossier|siteplan|terrain`. The human URL and the machine URL are different objects.

## LESSON

Locked GTM (2026-08-10): share is free; a share carries everything the sharer stored. Share-token header and `serveBrief` serve anonymous baked facets and strip owner data. Site plan/terrain are download-only if already exported. P-60 close claimed mint is sign-in only; `pe-share.ts` still gates on export entitlement. Close and write path disagree. Trust the write path until reconciled.

## LESSON

Hauska MCP: `X-Hauska-Key` only. `Authorization: Bearer` silent-public (2026-08-16 recon). Doc 19 Access forbids that. Claude remote connectors: OAuth for per-user accounts; header auth is allowlisted (`authorization`, `x-api-key`, `x-auth-token`) and is for shared org credentials. `X-Hauska-Key` is not on the list.

## LESSON

Doc 51 one-server rule reserved a split for listing visibility / per-domain branding. Decision `_decisions/2026-08-26_smartsite_product_mcp_and_ai_connector.md` takes that exception: product MCP, not a Hauska filter. Fresh product, shared backends. Do not fork retrieval or exports.

## GROUND-TRUTH

2026-08-26T22:30Z: doc_repo `main` 9656287. hauska-map `P:/hauska-map` share plane as read this session. MCP tool count last live recon 2026-08-16: 82 (not 71). Stripe live-mode still deferred (2026-08-24). No Smart Site MCP repo or hostname exists.

## GROUND-TRUTH

2026-08-26T23:55Z: planner reply. Card approved. OPS-16 id is A-035 (A-034 is P-85 path-to-live). Amendments a–c on the WDLL. Grant row is a prerequisite of P-86 item 1; resolvable URL carries the grant id, not the HMAC. MCP housing is LDT `artifacts/smartsite-mcp`. AS must be named before P-87; hosted recommended; P-86 does not wait. P-85 item 4 gates records tools and item 8.

## GROUND-TRUTH

2026-08-27T00:15Z: planner named the AS (A-037). Hosted WorkOS AuthKit. Stytch Connected Apps is the twice-failed-Connect fallback, by amendment of A-037. Join: `peUserIdentities` `(provider, subject)` or verified email on the same provider; never a second account; never a tier not on `peUserEntitlements`. Docs read this session: `https://workos.com/docs/authkit/mcp` — AS metadata has S256, refresh_token, registration_endpoint, offline_access; CIMD preferred, DCR for back-compat. Item 10 is the falsifier. P-86 does not wait.

## GROUND-TRUTH

2026-08-27T00:40Z: Claude Design frames for Use in your AI live at `P:/tmp/Smart Site rebrand project (8)/handoff/ai-connect/` (`Smart Site Use In Your AI.dc.html`, standalone bundle). Rail circle, sheet states, Connect click, approve page we own, no keys. P-87 item 15 consumes these; do not re-derive placement.

## LESSON

A-039: engine-api gate headers are spoofable from the internet. Smart Site MCP never calls engine-api directly; it goes through workbench paths. When the token is enforced the PE BFF is one of the four callers that needs it.

## GROUND-TRUTH

2026-08-27T01:24Z: production `_schema_migrations` on cortex-prod `fancy-fire-06136146` / `neondb` (default branch). Lane SELECT, not the log. `0085_pe_share_grants.sql` applied_at `2026-08-27T01:07:49.908Z`. Sibling `0084_p85_records_request.sql` applied_at `2026-08-27T00:46:05.396Z`. `information_schema` lists `pe_share_grants` with id/grantor_user_id/grantor_tenant_id/parcel_node_id/created_at/expires_at/revoked_at; no HMAC column. Corroboration only: run 33029068772 success. Item 6 applied. #227 stays draft until item 1 is probe-able on a preview.

## GROUND-TRUTH

2026-08-27T01:33Z: scout + planner re-read of `seat/property-ai` `6a2fece`. Item 2 not implemented: `GET /s/:grantId` returns grant metadata only (`pe-share-grant.ts:65-70`). Compose lives in private `serveBrief` / `serveDossier` / `serveDownload` in `pe-share-view.ts` and today requires HMAC `token`. Grant row `grantorTenantId` + `grantorUserId` can hit `internal/share-dossier` with no v2 token (same qs as `serveDossier` lines 154-158). Item 4 mint write path cannot emit 402 (`pe-share.ts` 401/400/503/200 only); `shareClient.ts` 402 map is residual; `pe-share-token.ts:7-9` header is stale (claims export entitlement). Item 5 fails: brief is `source: 'baked-snapshot'` owner-stripped; X-ray has no share path (`brief-xray-export.ts` is signed-in download); ShareTool copy says "full analysis" (`ShareTool.tsx:26-27`). Preview compose will need `CORTEX_SERVICE_API_KEY` and, for downloads, `MCP_PRODUCT_KEY`. `pe-share-grant.ts` is not in the vercel 60s functions block.

## LESSON

Trust the mint handler over `pe-share-token.ts` header comments. The header still describes the retired export-entitlement gate.

## GROUND-TRUTH

2026-08-27T01:50Z: writer return reviewed on `seat/property-ai` `6a2fece` dirty tree. Planner ran 42 tests (6 files) pass. GET `/s/{grantId}` composes HTML/markdown/JSON. Item 5 owner labelled withheld (no owner-fact store). Planner stripped ShareTool "full analysis" copy and added `pe-share-grant.ts` maxDuration 60. Agreement checker is one derivation (hidden comment). #227 still draft. Item 1 still needs a preview probe.

## GROUND-TRUTH

2026-08-27T02:17Z: item 1 customer-done on `https://smartsite.cloud/s/c86a0001-0086-4086-a001-000000000001`. PE `dpl_DLL3qfcjsXsor4zEmHUtehT1QPLe`. Cortex `00589-jen` @100% `0dd3e159`. HTML/markdown/JSON 200. HMAC path 403. `/share` still SPA. `/llms.txt` 200. First 403 was cortex on #480, not a bad grant id.

## OPEN

Owner-fact grantor path is leave_behind (item 5 partial). Item 8 waits on P-85 item 4. Item 10 Connect probe blocked until `mcp.smartsite.cloud` DNS + GCP domain verify. Operator DNS steps below. Merge hauska-map #229 + LDT #484 to main.

## GROUND-TRUTH

2026-08-27T12:22Z: Cloud Run `smartsite-mcp` LIVE revision `smartsite-mcp-00005-sgg` @ `https://smartsite-mcp-1062716564162.us-central1.run.app`. Health ok. POST /mcp no bearer → 401. PR #484 open.

## GROUND-TRUTH

2026-08-27T13:35Z: hauska-map `79a2dc7` committed+pushed (`feat(p87): mcp-login`). Vercel prod `dpl_3a3T4F4bj2Dc6bBs1giX4VxnB2Pb` aliased `smartsite.cloud`. Probes: GET `/api/auth/mcp-login` no param → 400; `?external_auth_id=test` → 200 HTML. Other-thread deploy had reverted mcp-login (404); this deploy restores it. **Do not move apex to GCP.**

## LESSON

DNS split is correct: registrar/DNS = GoDaddy (`ns75/ns76.domaincontrol.com`); apex A `76.76.21.21` = Vercel PE; MCP = Cloud Run on subdomain `mcp` only. GCP verified domains today: `smartcityos.io` only — must verify `smartsite.cloud` before `gcloud beta run domain-mappings create --domain mcp.smartsite.cloud`.

## GROUND-TRUTH

2026-08-27T13:47Z: AuthKit domain corrected: `https://happy-asteroid-26.authkit.app` (was wrong `happy-asteroid-216`). Cloud Run env updated. Live probes: oauth-protected-resource + oauth-authorization-server both return valid JSON; CIMD supported. Claude Connect retry unblocked. Minor: WWW-Authenticate header still points metadata at `/mcp/.well-known/...` until next image deploy (oauth fix on seat/property-mcp `4b561575`).

## GROUND-TRUTH

2026-08-27T14:30Z: P-87 item 10 **customer-done** on Claude Connect (Empressa Max). Prompt `48021:34137` → find_parcel hit + `get_smart_site` R1 brief (Aug 4 bake). Flood section returns structured SS-W16 refusal (not silent stale NFHL). Operator flagged three gaps: (1) confirm refusal holds across R1 family not just this parcel — spot check only so far; (2) setbacks/envelope bare `data: null` vs flood's `refusal` object — MCP clients will hallucinate; (3) R1 brief reads baked snapshot only (`buildR1Brief` in `propertyExplorer.ts`), does not call `loadFloodHazardFactAtom` though node-facets route does; flood hole until wired. Separate: situs-search parcel-node-id fast path returns id+source only, no situs round-trip.

## LESSON

R1 brief flood retirement is correct at the read path; the missing piece is wiring the superseding atom on the same route that serves MCP `get_smart_site`, not reconnecting OAuth. Setbacks need the same refusal vocabulary as flood before MCP scale.

## GROUND-TRUTH

2026-08-27T14:37Z: Operator Claude probe — run_report returns same runId/bakedAt Aug 4 as get_smart_site (sync brief, no job id). export_instrument brief: team tier entitled but fake `status: started`, no job id, full entitlementProbe leaked to assistant. check_request correctly not_ready. Brief 48021:34137: zoning+land use only; setbacks null; flood refused (atom not in R1). Not client-report-ready.

## LESSON

run_report/export_instrument marked `live` but fail WDLL item 14. export_instrument is entitlement GET + fake started — blocks directory/Connect flip. Strip entitlement to `{ entitled, tier }` for external MCP.

## GROUND-TRUTH

2026-08-27T15:35Z: Subagent lanes committed and merged. PR #491 R1 brief flood atom + envelope refusals (`b9e9bb22` on main). PR #492 MCP run_report/export honesty (`47d0a9e0` on main). Prior #490 situs node-id already on main (`f028a74c`). Typecheck fix on #491: `envelopeBriefRefusal` on test mocks + `afterEach` import. **Deploy pending:** cortex-api (491) + smartsite-mcp (492) via workflow_dispatch; operator re-probe after traffic shift.

## GROUND-TRUTH

2026-08-27T16:20Z: cortex-api + smartsite-mcp deployed prod. Canary → shift-traffic both success; cortex-api healthz smoke passed. Image tag `latest` (main through dc9e67b). **Next:** operator Claude re-probe on 48021:34137.

## GROUND-TRUTH

2026-08-27T17:05Z: PR #495 merged + smartsite-mcp deployed. P0 fixes: run_report flattened (`brief.sections` not `brief.brief.sections`); honesty field `reportReadMode`; list_my_properties strips snapshot/chat. Operator mini re-probe: run_report + list_my_properties only.

2026-08-27T18:49Z: LDT PR #498 merged @ `0b47f814`. smartsite-mcp deployed: canary `0b47f814` → shift-traffic PASS; live revision `smartsite-mcp-00013-pog`, `/health` + `/health/dependencies` live. cortex-api: image push failed once (AR auth flake), rerun OK; deploy-canary + shift-traffic PASS, `/api/healthz` smoke OK @ `0b47f814`. hauska-map PR #244 merged (Connect sheet); PE Vercel auto-deploy expected.

2026-08-27T22:00Z: Item 20 **closed**. Stranger Free Connect: find_parcel 48021:34137; get_smart_site + run_report tier-gated honestly. Probe B1 Bearer → 401 Unauthorized. Claude settings/connectors URL is dead — use Customize→Connectors; #250 open. Item 21 **parked** (operator: QA waves first). Gold situs 908 Pine (not 801).

2026-08-27T23:25Z: **Option B** in flight. hauska-map **#250 merged** (Customize→Connectors deep link). LDT PR open: envelope refusal SS-W16 parallel + MCP section disposition (`seat/p87-setbacks-refusal` @ `9449c7b0`). Item 13 probe card: `_inbox/2026-08-27_p87_item13_studio_paired_probe.md`.

2026-08-27T23:15Z: LDT **#503 merged** @ `b53a0571`. Deployed prod: cortex-api shift-traffic PASS (`/api/healthz` ok); smartsite-mcp revision **`smartsite-mcp-00016-mim`** @ `/health` ok. PE #250 on hauska-map (Vercel auto-deploy expected).

2026-08-28T00:35Z: Item 13 **met** (operator Studio probe). Gold 48021:34137 bake 2026-08-04: SF-1, A1, flood Zone X shaded-X with NFHL atom, setbacks **refused** `declined-in-bake` / `atom_path_pending` / supersededBy buildable-envelope — no silent null. Leave-behind: citationsDegraded on land-use+flood; atom_path_pending may clear on rebake. Artifact: `_inbox/2026-08-27_p87_item13_studio_probe_result.md`.

2026-08-28T01:00Z: Item 21 **blocked** (operator pre-submit review). Do not file. Blockers: `_inbox/2026-08-28_p88_item21_directory_blockers.md`. Ruling: fix find_parcel city/ZIP weighting first (B1); not example-prompt swap only. Mechanism: `searchPlaceByPrefix` strips city/ZIP via `normalizeSitusSearchPrefix` first-comma-only.

2026-08-28T01:30Z: **B1 shipped** LDT **#506 merged** @ `d06583aa`. `parsePlaceSearchLocality` + `searchSitusByStreetKeys` + locality-filtered `searchPlaceByPrefix` (fail-closed, no unfiltered ILIKE fallback). Unit tests: `txgioPlaceSearchLocality.test.ts`. **Deploy blocked:** main `build-and-push` failed on merge (plan-review vite rollup vs `@empressaio/atom-contract@1.30.0` from #505 — unrelated to B1). cortex-api canary/shift-traffic pending green image build. **Operator verify after deploy:** `find_parcel` on `"908 Pine St, Bastrop TX 78602"` → `48021:34137` / Bastrop, not Georgetown.

2026-08-28T02:00Z: **Build fix** LDT **#508 merged** — plan-review `crypto-browser-stub.ts` exports `randomBytes` for atom-contract browser bundle. cortex-api build-and-push re-triggered on main. **P-89** hauska-mcp-server **PR #77** open @ `ec84995` (worktree `hauska-mcp-p89`): fail-closed X-ray refresh + hollow download refuse + `live_view_url` forward. 26 violation tests pass. leave_behind P-90 engine PDF. Canvas updated with P-89 dispatch + item 21 blockers.

2026-08-28T01:17Z: **B1 cortex-api deployed** main @ `08cd9104`. build-and-push green (#508 + #509); deploy-canary + shift-traffic PASS; `/api/healthz` smoke OK. Operator verify pending: `find_parcel` on `"908 Pine St, Bastrop TX 78602"` → `48021:34137` Bastrop.

2026-08-28T01:17Z: **P-89 hauska-mcp-server deployed** @ `1ae9f28` (PR #77 merged). Image `sha256:58f5fb3a0c3d1e72dc4edf668f7f3f743ed1a67948010c397a9bb2999811724a`. Revision `hauska-mcp-server-00084-mof`, tag `p89-1ae9f28`, 100% traffic. Canary `/health` + prod `/health` ok (engine, cortex, postgres deps ok). **Deploy trap:** Cloud Run traffic tags must begin with a letter — raw short SHA `1ae9f28` fails deploy step; use `p89-<sha>` for `_CANARY=1` submits.

2026-08-28T02:58Z: **B1 operator verify FAIL** — `find_parcel` on `"908 Pine St, Bastrop TX 78602"` (and two other phrasings) → `{"hits":[]}`. **Not** missing county / dead resolver: gold `48021:34137` is indexed; prior probes hit via `908 Pine, Bastrop TX` (no `St`). **Root cause:** live CAD situs is `908 PINE , BASTROP, TX 78602` (no street-type suffix). B1 `#506` exact street-key path requires `908 PINE ST`; fail-closed returns `[]` instead of Georgetown. **Fix in flight:** branch `fix/find-parcel-cad-situs-prefix` — locality-filtered prefix fallback (`908 PINE ST` → also try `908 PINE`) + parse city on `908 Pine St Bastrop`. **Workaround now:** `find_parcel` with `48021:34137` (parcel-node-id fast path). `list_my_properties` confirms OAuth + cortex path independently.

2026-08-28T03:37Z: **B1.1 merged + cortex-api deployed** LDT **#514** @ `170ad1af`. build-and-push PASS; deploy-canary + shift-traffic PASS; `/api/healthz` smoke OK. **Operator re-verify:** `find_parcel` on `"908 Pine St, Bastrop TX 78602"` → expect `48021:34137` Bastrop (not Georgetown, not empty).

## GROUND-TRUTH

2026-08-28T14:10Z: cortex-api **`00632-vaw` @100%** `minScale=1` (revision annotation, not template). Same image as prior serving `00629-riz` (`e86cade7` digest `sha256:df22a36…`). First canary `00631-xej` was B1-only image `ab0cac20` and was not shifted (would have rolled back #520). Workflow bake is LDT #521, not on main yet.

## GROUND-TRUTH

2026-08-28T13:38Z: B1–B3 + Georgetown **customer-done** on Connect. Serving `00623-mag`. B1 third attempt and B2 both return gold `48021:34137` parcel-situs plus same-county address-point. B3 node-id unchanged. Georgetown `48491:R042064` only. Two B1 aborts (`This operation was aborted`) before the pass. `00623-mag` `minScale` annotation is null; deploy workflow bakes `--min-instances=0`. Item 21 not filed.

## GROUND-TRUTH

2026-08-28T06:48Z: B1 allowlist fix serving. LDT #518 `ab0cac20`. cortex-api **`00623-mag` @100%** (traffic[].percent field). Image digest `sha256:2de20145dd9ce18b9a6997fca8273000545943b547934e0161e6094d6a065875` matched Artifact Registry tag `ab0cac201c3e9a1b9cb9d30bb42b1c696028d4fa` before shift. MCP unchanged (proxies cortex). Customer-done is the Connect B1–B3 + Georgetown pass.

## GROUND-TRUTH

2026-08-28T06:05Z: Connect QA rerun after draw deploy: `find_parcel("908 Pine St, Bastrop TX 78602")` → `{"hits":[]}`; `find_parcel("48021:34137")` → gold situs `908 PINE , BASTROP, TX 78602`. Serving cortex-api **`00621-poq` @100%** digest `sha256:85c38c9e22e1118cf9d33c3fea340b45e0d8c1c42f7d24926dc917be490405a7`. Neon gold row exists; normalized street `908 PINE`; `ILIKE '908 PINE ST%'` false, `ILIKE '908 PINE%'` true. `allStoreCounties()` does not include 48021.

## GROUND-TRUTH

2026-08-28T05:34Z: **P-87 items 22–27 CLOSED.** Operator Claude Connect paste of gold `draw` matches locked ring/url/honesty. Artifact `_inbox/2026-08-28_p87_item27_draw_probe.json`. WDLL `_inbox/2026-08-28_p87_draw_stub_WDLL.md` graded met. leave_behind: bake zoning has no `codeRefs`/`refBasis`; flood label is live NFHL subtype text.

## LESSON

Frontage is per-edge. Gold `48021:34137` is a corner lot + alley: roads on edges 0, 2, 3; neighbor `48021:34169` on edge 1. Front = situs address, not "the only road."

## LESSON

`atom-miss` ≠ typed absence. Well gold has no row → `unknown`. Pipeline present + `nearPipeline:false` → `absent-verified` naming `bufferMeters`. Boundary prefix empty → no ring + overlay `Parcel boundary unmeasured`.

## GROUND-TRUTH

2026-08-28T15:50Z: P-91 item 11 / item 21 copy pass on doc_repo `main` `843b343`. Live `https://mcp.smartsite.cloud/llms.txt` fetched this session. Eight tools. `export_instrument` live with degraded Hauska path. Only `request_records` and `check_request` marked not ready. Auth string on llms.txt: `OAuth 2.1 + PKCE against the Smart Site account (WorkOS AuthKit)`. Draft uses the S3 ruling string: `OAuth 2.1 + PKCE via WorkOS AuthKit; Google/Microsoft match the workbench.` Draft and blockers updated. B2/B4/S1-S3 copy-ready, not filed. S4 keeps `support@empressa.io` (no monitored smartsite.cloud alias in tracked canon). Directory not filed.

## OPEN

P-87 draw stub closed. Item 21 copy for B2, B4, S1 to S3 is ready and not filed. Do not file an eight-tool listing we immediately grow. S4 unconfirmed. P-91/P-92 amended 2026-08-28: I5/I6, screen/save decouple, A11-A15, O7. Decision `_decisions/2026-08-28_smartsite_mcp_app_screen_save_decouple.md`. OPS-16 A-046. Do not start the iframe. Do not ship a ninth tool until connector item 12 flips. Persistence tools may start after that flip; they do not wait for item 16.

## OPEN — item 21 gate

1. **B1** find_parcel — **CUSTOMER-DONE 2026-08-28T13:38Z**. First-call abort: serving **`00632-vaw` @100%** `minScale=1` (revision annotation), same digest as `00629-riz` (`e86cade7` / `sha256:df22a36…`). LDT **#521** bakes `--min-instances=1` in the workflow; not on main yet (unrelated Test fail on motivated-seller `/0.74/`). Next main-workflow canary with the old yml would undo this. Do not file item 21.
2. B3 legal pages — **CUSTOMER-DONE 2026-08-28T15:36Z**. hauska-map #275 `e3e40c2`. Live curl of /privacy /privacy/ /terms /terms/ returns static HTML (not SPA shell).
3. B2+B4+S1 to S3 copy — **COPY-READY 2026-08-28**, not filed. Draft `_inbox/2026-08-28_p88_item21_claude_directory_submission.md`.
4. S4 mailbox still unconfirmed (`support@empressa.io`). Minor hygiene still open.
5. Re-run operator prompt battery, then file item 21.

## GROUND-TRUTH

2026-08-28T15:47Z: P-91 O5 not a ship gate. Five non-gold Bastrop parcels have rings. Planner Neon re-read `hauska_mcp.atoms` `property-boundary-edge`: 35073 4/4 warm, 33223 4/4 warm, 27943 5/5 warm, 32243 4/4 warm, 34169 5/5 fixture. HTTP `get_smart_site` for the four warm ids still unmeasured.

2026-08-28T16:25Z: P-91 items 1–5 **live**. LDT **#523** `5a20f61d`. cortex-api **`00635-qux` @100%** `minScale=1` digest `sha256:2437d704…`. smartsite-mcp **`00020-ced` @100%** digest `sha256:9d8c7abe…`. First main-yml canary `00634-vuq` was min-0 and was not shifted; second canary from `fix/cortex-min-instances-1` (#521 still open, Test FAILURE) stamped min 1 on the same digest. Prod gold `draw` ring+label locked vs item 27. Batch stub: `25420` label=node / `situs: unknown`; `48021:no-such-node` in `notFound`. hop1 400. Evidence `_inbox/2026-08-28_p91_wire_live_probe.md`. Connect tools/list and saved-list leftover unprobed. Do not start the iframe. O1 unset. Item 21 unfiled. Next main-workflow canary still bakes `--min-instances=0`.

2026-08-28T16:40Z: Wave A spawned. Connector item 12 flipped (five tools authorized, tools/list still 8). CP1 `_inbox/2026-08-28_p91_wave_a_CP1.md`. Worktrees `legacy-design-tools-p91-cite` and `p91-leak` from `5a20f61d`. Iframe and persistence implementation wait for CP2.

## LESSON

O1 ruling B. X-ray 42% is live `deriveBuildableEnvelope` (`labelEdges` + inset feet), not a bake or envelope atom. MCP R1/draw always refuses `atom_path_pending`. Serving the inset on Studio only is the disagreement. Do not take ruling A until the atom path is live and O2 is settled.

## GROUND-TRUTH

2026-08-28T16:50Z: O1 accepted as ruling B. Decision `_decisions/2026-08-28_p91_o1_envelope_xray_must_refuse.md`. Producer read `_inbox/2026-08-28_p91_o1_producer_read.md`. Code re-read: `computeTier1Envelope` always declined; `assembleParcelDraw` envelope overlay always refused; `derive.ts` `buildableAreaPct` at 220-221; `fetchLiveEnvelopeDerive` when setback scalars present. Paired probe on `48021:33223` unfiled. X-ray refuse not shipped. Wave C still blocked. Wave B still waits on the other Wave A returns.

## LESSON

MCP save must not reuse PUT `/saved-properties/:parcelNodeId`. That handler sets `snapshot` from `body.snapshot ?? {}` on conflict and wipes the dossier. CRM is a typed column (`New|Watching|Chasing|Passed`), not `snapshot.status` (`researching|offer|passed`).

## GROUND-TRUTH

2026-08-28T16:55Z: Screen/save spec planner-reviewed. `_inbox/2026-08-28_p91_screen_save_schema.md`. Two-table split accepted. `list_screens(screenId?)` is the reopen path. Wave B not started (waits CP2). No LDT write this review.

## GROUND-TRUTH

2026-08-28T16:46Z: Item 10 violate test failed on `5a20f61d` (forwarded cortex 400 named `workspaceDid` / `personaBucket` / `mls_id`). After sanitize, 68/68 smartsite-mcp pass. Code in `legacy-design-tools-p91-leak` `fix/p91-ask-leak`. leave_behind: `parcelNodeId` is still not a research/chat selector.

## GROUND-TRUTH

2026-08-28T16:48Z: Item 9 violate failed on `5a20f61d` (gold flood/landUse presentCitationDishonest true). After `citationsDegraded`, tests pass. LDT #525 `8cc4c827`. Gold ring/label locked.

2026-08-28T16:42Z: O7 `o4_not_closed`. Rainmaker Cv and Cove curl 28 at 40s / 0 bytes on `00635-qux` minScale=1. Pine St/Street both `48021:34137` in ~2s. Fold `COVE`→`CV` already in `normalizeSitusSearchPrefix`. Evidence `_inbox/2026-08-28_p91_o7_abbrev_probe.md`.

## GROUND-TRUTH

2026-08-28T16:55Z: Wave B CP1 spawned. Worktrees `legacy-design-tools-p91-miss`, `legacy-design-tools-p91-persist` from `5a20f61d`; `hauska-map-p91-o1` from `aefe5ad`. Iframe not started. #524 Typecheck FAILURE still open.

2026-08-28T16:58Z: #524 Typecheck was TS7006 on `args` after `.passthrough()`. Annotation `args: Record<string, unknown>` pushed as `1cd3f107`. Local typecheck + violate test green. CI Test still planner-owned.

2026-08-28T17:05Z: O1 X-ray refuse accepted. hauska-map #283 `d776a49` on `fix/p91-o1-xray-refuse`. Sheet no longer calls `fetchLiveEnvelopeDerive`. Local parcel-fact-sheet 28/28; PE targeted 204 passed. Not merged, not live.

2026-08-28T17:08Z: O7 miss-path accepted. LDT #526 `f324bcfe`. 20s budget + SET LOCAL. Unit tests green including Pine gold and keep-hit-on-later-hang. Rainmaker still unmeasured live. Not merged, not deployed.

2026-08-28T17:10Z: O1 paired probe accepted. `_inbox/2026-08-28_p91_o1_paired_probe.md`. Serving `00635-qux` / `00020-ced`. MCP `48021:33223` refuse measured. Composed X-ray unmeasured. Falsifier `unmeasured_xray`. Ruling B stands. Do not invent 42%.

2026-08-28T17:14Z: Wave B persist accepted. LDT #527 `42878e0e`. tools/list 13 in code. Migration 0088 not applied. A12/A5/A14 unit green. Conflicts with #524/#525 on smartsite-mcp. Not merged, not deployed.

## OPEN

#524 squash-merged `4a7e789` 2026-08-28T17:35:56Z. Main push started cortex + MCP canaries with `--min-instances=0`. Do not shift. Serving stays `00635-qux` / `00020-ced`. Next: rebase #525 onto main, then merge. #526 merge anytime. #527 still CI-red. #283 Test SUCCESS, not shifted.

#525 rebased onto `4a7e789` as `c19f1c0c`. Test conclusion SUCCESS 2026-08-28T17:53:02Z. Squash-merged `b89849c`. Do not shift the new min-0 canary. Next: #526 anytime, then #527 CI fix.

## GROUND-TRUTH

2026-08-28T19:01Z: #526 Test run `33199771284` on `f73eb67c` cancelled by planner. Not a hang. api-server started 18:40:02Z and was still completing files at 18:56:35Z (`brokerageUserEntitlement` 11/11). `users.test.ts` 241s, `pe-pricing-ladder` 215s, `brokerageNodeFacets` 183s. `txgioSitusSearchBudget.test.ts` never appeared. Local budget file 5/5, process exit 2765 ms. Main Test on `f325413` was 10m51s. This runner was slow, not stuck. Do not treat the 20s budget as the CI defect.

## GROUND-TRUTH

2026-08-28T19:21Z: #526 re-run Test conclusion is the string `success` on run `33199771284` HEAD `f73eb67c`. Test job 19:01:38Z–19:13:12Z (~11m34s; Run tests 10m20s). Matches same-branch 9m and current-main 10m51s. First attempt was a slow runner, not a hang. `txgioSitusSearchBudget.test.ts` was never the CI defect.

## GROUND-TRUTH

2026-08-28T19:21:40Z: #526 squash-merged `5e5d1d95`. Main push started cortex-api `33203520034` (build/push only). Deploy 0% canary SKIPPED. Shift 100% SKIPPED. Serving stays `00635-qux` / `00020-ced`. Do not shift the leftover min-0 canary. Rainmaker re-probe waits until this revision is serving.

## GROUND-TRUTH

2026-08-28T19:24Z: Serving is `cortex-api-00389-phv` at 100 percent, not `00635-qux`. Read `status.traffic[].revisionName` and `percent` by field name. Image digest `sha256:b29beb70c2ec59c5053b8389a172f97eff967527891fd5fb4e8ffcf16e75c5ca`. Env `CORTEX_USER_DAILY_API_LIMIT=50000` on that revision. Creator `empressaioemail@gmail.com`. Canary tag still `00639-gez`. Traffic is pinned. A deploy does not move it.

## LESSON

2026-08-28T19:24Z: `--set-env-vars` is authoritative-replace. Baking 10000 deletes a manual 50000 and locks the operator out. Read the serving revision before asserting serving. Do not cite latestReady as traffic.

## GROUND-TRUTH

2026-08-28T20:00:58Z: LDT #530 squash-merged `b28de09c`. Test conclusion `success`. `ci-cortex-daily-limit-50000` SUCCESS. Bake is 50000 on main. Do not deploy-canary or shift from this merge.

## GROUND-TRUTH

2026-08-28T20:51Z: Serving is `cortex-api-00643-rib` at 100 percent. Read `status.traffic[]`. `latestReady` is `00644-soz` (staging, 0 percent). Env `CORTEX_USER_DAILY_API_LIMIT=50000` on the serving revision. Digest `sha256:59a4696f…`. minScale absent. Shift `33209942592` conclusion success.

## GROUND-TRUTH

2026-08-28T20:52Z: Rainmaker re-probe on serving `00643-rib`. Cv 200 in 2902 ms, Cove 200 in 2696 ms, both first hit `48021:8720522`. Pine St/Street still `48021:34137`. `abbreviation_works` fired. `o4_not_closed` did not. Evidence `_inbox/2026-08-28_p91_o7_rainmaker_reprobe.md`.

## GROUND-TRUTH

2026-08-28T22:16:06.124Z: `_schema_migrations` on fancy-fire-06136146 / neondb names `0088_pe_screens_and_saved_crm.sql`. `pe_screens` and `pe_screen_rows` exist. Workflow 33216058017 migrations-only; deploy and shift jobs skipped. Not Factory. Not `hauska_mcp.atoms`.

## GROUND-TRUTH

2026-08-28T22:17Z: O1 serving bundle is `index-BmBbb7Ot.js` (was `index-BSF0m7t6.js`). Strings present: `atom_path_pending`, `not-derived`, `live derive`. Anonymous `https://smartsite.cloud/p/48021:33223` Property tab still 44-char chrome. Facets 200 `atom-chain-warm`: envelope status ok, `buildableAreaSqFt` 1397, `buildableAreaPct` absent, geojson absent. Do not invent 42%. Composed kind unmeasured.

## GROUND-TRUTH

2026-08-28T22:18Z: origin/main hauska-mcp-server `1ae9f28` still has `assert.ok(true)` for P-89 item 5. Isolated `P:/seat-worktrees/substrate/hauska-mcp-p89-scan` `feat/p89-flood-catalog-scan` replaces it with a two-derivation catalog scan. Planted `refresh_flood_export` in tools.ts failed the scan, then reverted. 27/27 after revert. Did not write #74 or ICC-meter trees. Did not deploy.

## GROUND-TRUTH

2026-08-28T22:32Z: Serving `cortex-api-00649-wuq` @100% tag `p527`. Digest `sha256:9d7651868e37d4b6a28378bfa03cb97e621134ee3de6fa3f50045318e320faf0` = image tag `fd750203ce4d51f388aff4afd7d34bc404ef0880`. Revision annotation `minScale=1`. Env `CORTEX_USER_DAILY_API_LIMIT=50000`. Staging `00646-luj` still 0%. Do not shift it. `00647-goh` is the min-0 canary leftover, not serving.

## GROUND-TRUTH

2026-08-28T22:32Z: Serving `smartsite-mcp-00023-kud` @100% tag `p527`. Digest `sha256:3c0116e8553b9e98ae93698f3262acec525352fb25b5103fc33d510854418e3d`. `minScale=1`. Live `/health` on mcp.smartsite.cloud names `00023-kud`. `GET /llms.txt` says Tools (13). Unauth `POST /mcp` tools/list is 401 `missing_bearer`.

## GROUND-TRUTH

2026-08-28T22:31Z: HTTP A12 pass on serving `00649-wuq`. Screen `399f84c3-c4e5-4e1c-9359-b599a660f668`. create_screen wrote 0 saves (15→15). Unresolved `zzzz-not-a-situs-99999` stored verbatim. `908 Pine, Bastrop TX` also stored unresolved (A5 leftover). add_to_screen gold `48021:34137` resolved. save Watching then DELETE left ordinals and queries identical. Neon `pe_screen_rows` agrees. Saves restored 16→15. Gold was not previously saved.

## GROUND-TRUTH

2026-08-28T22:58Z: Address `situs-search` is empty at the 20s budget on both serving `00649-wuq` (digest `9d765186`, `#527` image) and staging `00646-luj` (old digest, 0% traffic). Queries: `908 Pine, Bastrop TX`, CAD `908 PINE , BASTROP, TX 78602`, `908 Pine St, Bastrop TX`, `111 Rainmaker Cv, Bastrop TX`, `927 MAIN ST, BASTROP, TX`. All HTTP 200, hits n=0, ~20.1–20.3s. Node-id `48021:34137` is 1 hit in 136–162ms on both hosts. `create_screen` unresolved on `908 Pine, Bastrop TX` is the same miss, not a screen-only path split. Rejected: `#527` broke address search. Staging is the pre-#527 image and misses the same way. Rejected: abbreviation-only. Rainmaker Cv also empty. Earlier O7 pass on `00643-rib` at 20:52Z (Cv/Cove 200 under 3s to `48021:8720522`) is stale. Do not run A5 forty until address search returns a hit or a declared miss under budget.

## GROUND-TRUTH

2026-08-28T23:22Z: O1 customer-done on signed-in More facts for `48021:33223` / `927 MAIN ST , BASTROP, TX 78602`. BUILDABLE `Not stamped here`. No lot-percentage. No 42%. Setbacks still print `F 20 ft · S 5 ft · R 20 ft` (scalars, not a pct). Footer `source baked-snapshot · report R1 · baked 2026-08-28T21:29:25Z`. Zone chip `F1 — F1` and Zoning row `GC` both present. Owner `BASTROP CHAMBER OF COMMERCE`. Agrees with MCP R1 refuse. Machine strings `atom_path_pending` / `not-derived` are not on this card. Wave C iframe unblocked.

## GROUND-TRUTH

2026-08-28T23:50Z: Serving `smartsite-mcp-00025-qud` @100% tag `p536`. Digest `sha256:d1766fe257744077d6baa927f8c421dd75c8bc7d851ee5610425d605ac96253c` = merge `ecdd4bb85c2614aff720d19975f742b69ae0f4aa` (#536 squash). Revision `minScale=1`. Live `https://mcp.smartsite.cloud/health` names `00025-qud`. `GET /llms.txt` Tools (13). Cortex not shifted. Staging cortex `00646-luj` not touched. Item 16 Connect still ungraded.

## GROUND-TRUTH

2026-08-28T23:50Z operator Connect on serving `00025-qud`: board rendered for screen `cd48f7a2-3994-4353-a1d4-8eeb0218f0c9`. Rows were id/ordinal/parcelNodeId/query/resolution/source only; no envelope cell. All three queries unresolved with `parcelNodeId` null, including `48021:34137` and `48021:33223`. Envelope on gold `get_smart_site`: refused `atom_path_pending`, label "Buildable envelope not computed", no lot-percentage. Find listing history: Claude four-liner said the button was missing and tried `ask_the_map` (rejected "Provide runId, address, or areaContext"). Screenshot shows the button on the parcel panel. I5 is `ui/message`, not `ask_the_map`.

## GROUND-TRUTH

2026-08-29T01:24Z: LDT #538 squash-merged `c601f2bbc70c8a23d7b66c9555cbd12d5afda21f`. Serving MCP `smartsite-mcp-00027-gap` @100% tag `p538`, digest `sha256:f90b5d3db589a6edd5fec0d9582927eb16e2fce61bf7141fc79ab4796e5e9cba`, minScale=1. Live `/health` names `00027-gap`. Serving cortex `cortex-api-00654-lom` @100% tag `p538`, digest `sha256:e1f169a99a717f91799179f13b480662cc6ba129e85c879d02a38330dd441294`, minScale=1, `CORTEX_USER_DAILY_API_LIMIT=50000`. Staging `00646-luj` still tagged `staging` at 0%. Leftover MCP tags at 0%: canary `00022-roz`, p527 `00023-kud`, p536 `00025-qud`. Item 16 Connect re-grade still owed.

## GROUND-TRUTH

2026-08-29T01:31Z: Connect re-probe on serving `00027-gap` / `00654-lom`. Board rendered, Claude-dark chrome. `48021:34137` and `48021:33223` resolved; only `zzzz-not-a-situs-99999` unresolved. Gold `get_smart_site` header `908 PINE , BASTROP, TX 78602`; envelope refused `atom_path_pending` on draw overlays; no lot-percentage. Screen rows are still query/resolution/parcelNodeId/source (plus id/ordinal). Board rail columns including envelope are unread dashes, not refused cells. Listing did not run: research/`ask_the_map` rejected three selectors (parcel node id, R1 runId, situs) with "Provide runId, address, or areaContext". Nothing written to board or panel. Item 16 listing half failed. Item 26 live turn failed.

## GROUND-TRUTH

2026-08-29T02:28Z: Wave E serving. LDT #539 squash `d070e2ad`. cortex-api `00656-vek` @100% tag `p539`, digest `sha256:8c5fcd25…`, minScale=1, `CORTEX_USER_DAILY_API_LIMIT=50000`. Staging `00646-luj` still 0%. Live situs-search: Pine 200 1.42s first `48021:34137`; Rainmaker Cv 200 2.83s first `48021:8720522`; zzzz 200 0.36s `missClass=no-hit`. Evidence `_inbox/2026-08-29_p91_wave_e_live_probe.md`.

## GROUND-TRUTH

2026-08-29T02:46Z: Wave D serving. LDT #540 squash `bd4c2d8c`. MCP `00029-fom` @100% tag `p540`, digest `sha256:8f8d435a…`, minScale=1. Live `https://mcp.smartsite.cloud/health` names `00029-fom`. `GET /llms.txt` Tools (13). Cortex still `00656-vek`. Staging untouched. Item 16 Connect three-way score still owed.

## GROUND-TRUTH

2026-08-29T03:25Z: Connect loop QA on `00029-fom` / `00656-vek`. Paste PASS n=1. Save PASS, board `updatedAt`=`createdAt`. Listing: no turn, nothing written. Not scored `host_drop`. Three mechanisms remain open. Evidence `_inbox/2026-08-29_p91_connect_loop_qa.md`.

## GROUND-TRUTH

2026-08-29T04:20Z: Listing bind serving. LDT #542 squash `f4cc90bc`. MCP `00033-hin` @100% tag `p542`, digest `sha256:754e11247c202612b596a7ead8fc69070a94f805a4a8231a02c2abe0bf4bde7c`, minScale=1. Live `/health` names `00033-hin`. `GET /llms.txt` Tools (13). Cortex still `00656-vek` / p539. Staging `00646-luj` still 0%. Connect re-score owed: `script-ran` visible? label flip?

## OPEN

1. Fresh Connect after `00033-hin`: create screen, Open Pine, click listing. Report `script-ran` and the label. Flip + empty chat = host_drop. Missing `script-ran` = script stripped. Label sits with `script-ran` = click not reaching the iframe. Do not widen `ask_the_map`.
2. After that score: Wave H next, not A5 forty. Do not start either until the score.
3. Item 21 copy after O1. Connect OAuth `tools/list` still unprobed.
4. P-89 leftover PR #78. Do not deploy Hauska MCP. Do not take P-90.

P-89 Hauska MCP hollow refuse is code-done on `1ae9f28` (#77). Customer-done is a live probe on the serving Hauska MCP revision. Different server from `mcp.smartsite.cloud`. P-90 leftover.

After any later cortex-api shift, re-read `status.traffic[]` and confirm `CORTEX_USER_DAILY_API_LIMIT=50000`.

## LESSON

2026-08-30: The honesty differentiator is a design argument (operator, 2026-08-28 QA battery), not a verified property. The claim is that the payload makes silence legible so the model refuses where the record refuses. It is not "it will not degrade." Mechanism: five dispositions on sections; atom-miss maps to unknown; refusals carry `agentGuidance`; geometry is a server projection in feet. Prefer a mechanical guard (X2 serialize refuse on implicit-present neighbor) over restating the slogan.

## OPEN

2026-08-30: X2 (P-92). `draw.edges[]` has no disposition. Neighbor and adjacency ship as flat fact. Operator observation this walk: five of six labels on verified shared boundaries were wrong (not independently re-measured; needs X1 artifact). Do not market the honesty differentiator until X2 is customer-done. Decision `_decisions/2026-08-30_honesty_contract_is_silence_legible.md`.

## GROUND-TRUTH

2026-08-30T19:24-05: Operator restated the claim and named the edge-metadata gap. Filed decision, WDLL X2, OPS-16 A-052. Snapshot doc_repo `main` `beb8c8b` at session start; this write is uncommitted. Flood caveat unchanged: every flood section in the 2026-08-30 walks is `present` + `citationsDegraded: true` + empty citations (F2).
