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

## OPEN

P-86 item 1 starts on hauska-map worktree `P:/seat-worktrees/property/hauska-map-smartsite-ai` branch `seat/property-ai` @ `434ec56` (cut from `origin/main` 2026-08-26; tracks origin/main). Do not use `fix/pe-pricing-a2` or the records worktree. LDT MCP worktree is not created until the planner registers `legacy-design-tools-mcp` / `seat/property-mcp`. Dispatch compiled `_dispatches/2026-08-27_p86-ai-connector_dispatch.md` CANON-PREAMBLE vd3c673f8. Integration does not write `_state/property`.
