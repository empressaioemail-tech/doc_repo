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

## OPEN

LDT grant PR https://github.com/empressaioemail-tech/legacy-design-tools/pull/481 (`e8f0200b`). Migration 0085 is not applied until run-migrations after merge; verify `_schema_migrations` on production. hauska-map `/s/{grantId}` is the first commit on recut `seat/property-ai`. Item 2 (Accept/format) and the HTML funnel follow on that branch. LDT MCP server dispatch waits until P-87 starts. Records tools and item 8 wait on P-85 item 4. Integration does not write `_state/property`. Next OPS-16 A-id is A-040 if one is needed; do not write one for this commit.
