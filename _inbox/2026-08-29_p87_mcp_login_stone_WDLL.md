---
id: 2026-08-29_p87_mcp_login_stone_WDLL
title: WDLL — MCP login page Stone port (Wave 1)
date: 2026-08-29
status: approved
last_updated: 2026-08-29
operator_approval: 2026-08-29 (operator: this screen needs the design system; go on wave 1; spawn to execute)
plan_row: P-87
palette_law: P-95
related:
  - _decisions/2026-08-28_stone_palette_exact_port.md
  - _inbox/2026-08-26_smartsite_ai_connector_WDLL.md
  - _inbox/2026-08-29_p91_widget_stone_qa.md
owner: property seat (product). Planner owns this card and deploys.
---

# WDLL: MCP login Stone

Date: 2026-08-29  Status: approved  Operator approval: 2026-08-29

## Done looks like

`GET https://smartsite.cloud/api/auth/mcp-login?external_auth_id=<id>` returns the same WorkOS External Sign-in page, now painted with Stone. The page ground is `--ss-void`. The card is `--ss-ink` with a `--ss-line-14` edge. The SMART SITE eyebrow is brand gold-light, never action blue. Copy and routes do not change. Google and Microsoft marks stay their published brand hexes. A missing `external_auth_id` is still 400.

## Acceptance items

1. **Ground and card.** Page background is `--ss-void` `#2A2A2B`. Card fill is `--ss-ink` `#323234`. Card edge is `--ss-line-14` `#56575C`. | check: rendered HTML declares those tokens with those hex values; live GET after deploy computed style matches | grade: [met 2026-08-29T16:42Z] live 200 HTML

2. **Eyebrow is brand, not action.** `.eyebrow` uses `--ss-gold-lt` `#F5B95C`. It does not use `--ss-blue`, `#3B82F6`, or `#86ADDF`. | check: unit violate: HTML containing `#3B82F6` or eyebrow color `--ss-blue` fails | grade: [met] live HTML has gold-lt, no #3B82F6

3. **Type and geometry.** Font stack is `--ss-ui`. Eyebrow `--ss-fs-label` uppercase letter-spaced. Title `--ss-fs-title` weight 300 on `--ss-t1`. Lead `--ss-fs-body` on `--ss-t5`. Card radius `--ss-r-float` 14px. Buttons height `--ss-h-control` 36px, radius `--ss-r-touch` 10px. | check: those var() names appear; no 22px / 16px card / 10px button radius leftovers | grade: [met] token names on live string

4. **V2 navy is gone.** The page does not contain `#0b0e14`, `#0b0e13`, `#141928`, `rgba(59, 130, 246`, or the v2 `0 24px 80px` shadow. Elevation if used is a named `--ss-sh-*` token. | check: unit grep of the renderer string | grade: [met] live absent

5. **Provider buttons.** Google fill and label stay the published dark values (`#131314`, `#E3E3E3`) and the official G paths. Microsoft mark stays the four official squares. Button chrome (height, radius, hairline) is Stone. `href` is still `/api/auth/{google|microsoft}/start?external_auth_id=`. | check: existing start-path strings unchanged; brand hexes still present; `#3B82F6` absent | grade: [met] Google live; Microsoft omitted because only Google is configured

6. **Routes hold.** `renderMcpLoginPage` still escapes `externalAuthId`. No provider still prints the existing notice, now on `--ss-slate` / `--ss-line-06` / `--ss-raised`. `auth.ts` `handleMcpLogin` is not rewritten. | check: unit on escape and notice; `auth.ts` diff empty or whitespace only | grade: [met] 400 missing_external_auth_id; auth.ts untouched

7. **No second kit.** No SmartCity tokens, no cream paper, no lime, no Hauska string, no Oxygen file, no Google fonts link. Standalone HTML inlines the used `--ss-*` values copied verbatim from `pe-tokens.css` on the same tree. | check: no `fonts.googleapis`; no `--sc-`; no `#F3F5F1` | grade: [met]

8. **Live grade.** After Vercel alias to smartsite.cloud: GET with `external_auth_id` is 200 HTML; GET without is 400 `missing_external_auth_id`. Operator visual: void ground, ink card, gold-light eyebrow, no blue SMART SITE. | check: live probe plus operator look | grade: [met 2026-08-29] operator: "clean good work"

## Out of scope

P-94 allowlist. Stripe `seats_purchased`. P-90. AuthKit hosted pages on `authkit.app`. Rewriting `GoogleSignInButton.tsx`. Restyling Settings or the workbench sign-in sheet. Importing the SmartCity kit. Growing MCP tools.

## Amendments

- 2026-08-29: opened as Wave 1 remainder because the Connect door still ships v2 navy while Stone is live on the workbench and the MCP widget. Reason: operator screenshot of `/api/auth/mcp-login`.
