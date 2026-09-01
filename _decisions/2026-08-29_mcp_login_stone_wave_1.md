---
decision_id: 2026-08-29_mcp_login_stone_wave_1
date: 2026-08-29
owner: operator
status: active
related_canonical:
  - 90_operations/OPS-16_texas_market_plan_of_record.md
  - _decisions/2026-08-28_stone_palette_exact_port.md
  - _inbox/2026-08-29_p87_mcp_login_stone_WDLL.md
---

## Decision

The WorkOS External Sign-in page at `/api/auth/mcp-login` is a Wave 1 remainder. It ports to Stone on P-87 housing under P-95 palette law. It does not wait for P-94 shift or Stripe seat persist.

## Context

Wave 1 was named as lighting what is already built (P-94 allowlist, Stripe `seats_purchased`). The operator then pointed at the live MCP login card, which still uses v2 navy and `#3B82F6` for SMART SITE, and said implement the design system and execute. That page is the Connect door. Leaving it on v2 while the workbench and the widget are Stone is a split product.

Alternatives: fold it into P-95 restyle-the-app (rejected: P-95 already closed on PE chrome; this file was never in that card). Wait for P-94 (rejected: different repo path, different defect). Restyle AuthKit hosted pages (rejected: not this origin).

## Structural commitment check

Sell reasoning, not data: no new claim on this page.
Confidence is earned: no confidence number.
Cost per jurisdiction: no ingest.
Dual interface: this is the human half of the MCP OAuth door.

## Reasoning

`mcp-login-page.ts` is a standalone HTML string. It cannot pick up `pe-tokens.css` by accident. The values have to be copied onto the page. The eyebrow using `#3B82F6` is the visible defect: blue is the action colour, gold-light is the wordmark. Google and Microsoft marks stay published brand hexes, which P-93 already named as an island.

## Reversal criteria

Reverse if WorkOS replaces this External Sign-in URI with a hosted AuthKit page we do not render. Reverse the gold-light eyebrow if the operator rules the wordmark on this card should be `--ss-t5` plus a gold SITE only.

## Dependencies

P-87 shipped the route. P-95 shipped the token values on PE main. Isolated hauska-map tree from `origin/main`. Does not write the dirty `P:/hauska-map` checkout or any `P:/seat-worktrees/property/hauska-map-*` tree.

## Counterparties

Internal. Operator plus the implementer on `P:/tmp/hauska-map-mcp-login-stone`.
