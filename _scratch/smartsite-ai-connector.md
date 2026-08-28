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

2026-08-28T05:00Z: **P-87 draw stub implemented, not deployed.** LDT `feat/p87-draw-stub` @ `7986a919` + dirty tree. `assembleParcelDraw` gold ring matches locked feet [[48.60,83.94],[-50.37,83.70],[-49.07,-84.28],[50.84,-83.36]]. Cortex `POST /property-explorer/v1/research/brief` attaches optional `draw`. MCP `normalizeR1BodyForExternal` passes valid draw, omits unlabeled hatch / seed float. WDLL items 22–26 unit-tested. Item 27 waits cortex-api + smartsite-mcp deploy + operator Claude paste. **Do not merge/deploy until operator says so.**

## LESSON

Frontage is per-edge. Gold `48021:34137` is a corner lot + alley: roads on edges 0, 2, 3; neighbor `48021:34169` on edge 1. Front = situs address, not "the only road."

## LESSON

`atom-miss` ≠ typed absence. Well gold has no row → `unknown`. Pipeline present + `nearPipeline:false` → `absent-verified` naming `bufferMeters`. Boundary prefix empty → no ring + overlay `Parcel boundary unmeasured`.

## OPEN

P-87 items 22–26 code-done on `feat/p87-draw-stub`. Item 27 customer-done blocked on deploy + operator `get_smart_site` paste of raw `draw` JSON.

## OPEN — item 21 gate

1. **B1** find_parcel city/ZIP — **B1.1 live @ `170ad1af`; operator Claude re-verify pending**
2. B3 legal /privacy /terms static content (hauska-map)
3. B2+B4 copy alignment (llms.txt authoritative; Central Texas zoning coverage)
4. S1–S4 should-fix + minor hygiene
5. Re-run prompt battery → file item 21
