# p87-mcp-login-stone scratch

OPEN 2026-08-29T15:50Z: Operator put MCP login Stone on Wave 1 and said execute. Isolated tree `P:/tmp/hauska-map-mcp-login-stone` branch `feat/p87-mcp-login-stone` from hauska-map `origin/main`. WDLL `_inbox/2026-08-29_p87_mcp_login_stone_WDLL.md`. Do not write `P:/hauska-map` or any `hauska-map-*` seat tree.

GROUND-TRUTH 2026-08-29T15:45Z: Live page at `smartsite.cloud/api/auth/mcp-login?external_auth_id=...` still shows v2 navy card and blue `SMART SITE` eyebrow. Source `apps/property-explorer/api/_lib/mcp-login-page.ts` hardcodes `#0b0e14`, `#3B82F6`, `rgba(59, 130, 246, 0.28)`, `0 24px 80px`.

LESSON: This HTML string cannot inherit `pe-tokens.css`. Inline the used `--ss-*` values from the same-commit token file.

DEAD-END: Restyling AuthKit `authkit.app` or `GoogleSignInButton.tsx` on this card.

GROUND-TRUTH 2026-08-29T16:01Z: Isolated tree uncommitted. Renderer has void/ink/gold-lt, no #3B82F6. auth.ts untouched. Preview only. Live smartsite.cloud still v2 until item 8.

GROUND-TRUTH 2026-08-29T16:42Z: hauska-map #308 squash 1115722. CI conclusions success. Vercel dpl_5crHeG1WfsG2v8PAnLqmPjARW15T aliased smartsite.cloud Age 0. GET no param 400 missing_external_auth_id. GET ?external_auth_id=item8-live 200 with --ss-void #2A2A2B --ss-gold-lt #F5B95C, no #3B82F6. Close `_inbox/2026-08-29_p87_mcp_login_stone_close.json`.

OPEN: operator visual on the live Connect door.
