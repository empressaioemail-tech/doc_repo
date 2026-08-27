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

Owner-fact grantor path is leave_behind (item 5 partial). Item 8 waits on P-85 item 4. P-87 hostname, AuthKit, and Connect not started. Probe grant remains live until revoked. Next agent: `_inbox/2026-08-27_p87_planning_agent_handoff.md`. Canvas: `smartsite-ai-connector-finish.canvas.tsx`.

## GROUND-TRUTH

2026-08-27T04:10Z: P-87 item 15/16 surface is live on smartsite.cloud (`dpl_DE5i8ajH8Ms3Bu41AJjTjUzcNUDX`, hauska-map `80585e8`, PR #229). Rail id `use-in-ai` after Share. Sheet: Coming soon / ChatGPT Unavailable, no Connect, no keys. Working hook is the Share mint (`/s/{grantId}`). Desktop: top-right cluster. Mobile: Research tab, then the face/monitor circle. Lander does not show the rail.
