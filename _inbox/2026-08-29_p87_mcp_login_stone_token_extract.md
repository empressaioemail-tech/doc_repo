---
id: 2026-08-29_p87_mcp_login_stone_token_extract
title: P-87 MCP login Stone token extract (copy, do not re-derive)
date: 2026-08-29
status: active
last_updated: 2026-08-29
plan_row: P-87
wdll: _inbox/2026-08-29_p87_mcp_login_stone_WDLL.md
wdll_items: [1, 2, 3, 4, 7]
source: P:/tmp/hauska-map-mcp-login-stone/apps/property-explorer/src/styles/pe-tokens.css
source_commit: 636067041a1e144e063decb375bc6ee944330e2b
token_count: 26
owner: planner (extract). Implementer copies into mcp-login-page.ts. Do not commit from this seat.
---

# P-87 token extract

Inline these 26 `--ss-*` declarations into the standalone MCP login HTML. Do not re-derive a hex. Do not link `pe-tokens.css` (that path 404s on the serverless HTML string). Source is `pe-tokens.css` at `6360670` (`636067041a1e144e063decb375bc6ee944330e2b`). Each comment is the source line of the declaration.

WDLL items 1-4 and 7. Ground `--ss-void` `#2A2A2B`. Card `--ss-ink` `#323234` with edge `--ss-line-14` `#56575C`. Eyebrow `--ss-gold-lt` `#F5B95C`. Type `--ss-ui` / `--ss-fs-label` / `--ss-fs-title` / `--ss-fs-body`. Geometry `--ss-r-float` 14px, `--ss-h-control` 36px, `--ss-r-touch` 10px. Elevation if used is a named `--ss-sh-*` below, never `0 24px 80px`.

```css
:root {
  --ss-void: #2A2A2B; /* L28 */
  --ss-ink: #323234; /* L29 */
  --ss-raised: #3F4043; /* L30 */
  --ss-line-06: #414247; /* L51 */
  --ss-line-14: #56575C; /* L52 */
  --ss-line-28: #8A8A8F; /* L53 */
  --ss-t1: #FBFBFC; /* L63 */
  --ss-t2: #EEEFF1; /* L64 */
  --ss-t3: #D6D8DB; /* L65 */
  --ss-t5: #A9ABAF; /* L67 */
  --ss-t6: #999B9F; /* L68 */
  --ss-gold: #E8963B; /* L76 */
  --ss-gold-lt: #F5B95C; /* L77 */
  --ss-slate: #A9ABAF; /* L79 */
  --ss-ui: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; /* L102 */
  --ss-fs-label: 11.5px; /* L113 */
  --ss-fs-body: 14.5px; /* L115 */
  --ss-fs-title: 26px; /* L118 */
  --ss-h-control: 36px; /* L130 */
  --ss-r-touch: 10px; /* L141 */
  --ss-r-float: 14px; /* L143 */
  --ss-sh-dock: inset 0 1px 0 rgba(255,255,255,.05), 0 2px 6px rgba(0,0,0,.30), 0 14px 34px rgba(0,0,0,.42); /* L150 */
  --ss-sh-modal: inset 0 1px 0 rgba(255,255,255,.06), 0 28px 72px rgba(0,0,0,.52); /* L151 */
  --ss-sh-focus: 0 0 0 3px rgba(134,173,223,.67); /* L153 */
  --ss-ease: cubic-bezier(.2,.6,.35,1); /* L95 */
  --ss-d-state: 140ms; /* L97 */
}
```

Token count: 26.

`--ss-gold` comment (L76) is "brand mark + rail unread dot. Never a control." Legal on this page as the mark, never as a button fill. `--ss-gold-lt` (L77) is "the word SITE in the wordmark" and is the eyebrow. `--ss-sh-focus` (L153) is the only legal action-blue wash on the page (`rgba(134,173,223,.67)`, Stone `#86ADDF` at 67 percent). Do not also declare `--ss-blue`. Do not paint SMART SITE with it.

## Forbidden in mcp-login-page.ts after the port

These strings must not appear in the renderer after the port. `#86ADDF` as an eyebrow (or on the words SMART SITE) is the defect; the same hue inside `--ss-sh-focus` / `--ss-blue` used only as focus is the exception, and this extract ships focus as `--ss-sh-focus` only.

- `#3B82F6`
- `#0b0e14`
- `#0b0e13`
- `#141928`
- `#86ADDF` on the eyebrow / SMART SITE
- `rgba(59, 130, 246`
- `0 24px 80px`
- `fonts.googleapis`
- `Hauska`
- `--sc-`
- `#F3F5F1`

## Tokens whose pe-tokens.css comment makes them illegal on a sign-in card

Do not copy these. They are not in the `:root` block above.

- `--ss-sky` L86 `#2C6B9E`: "MAP GEOMETRY ONLY. Never inside a panel."
- `--ss-fs-display` L127 `32px`: legal only in the cold open, the pricing modal headline, and checkout. Never a panel, dock, row, chip, or this card.
- `--ss-atom` L78 `#6FC1B8`: "an openable record. Not chrome, not emphasis."
- `--ss-h-find` L133 `46px`: "find bar — the one control allowed above 40."
- `--ss-r-modal` L144 `18px`: "the modal, and nothing else."
- `--ss-scrim` L44: "Behind a modal, over the map."
- `--ss-brand` L110: Oxygen face. WDLL 7 forbids an Oxygen file and any `fonts.googleapis` link. Stack is `--ss-ui`.
- `--ss-blue` L71 `#86ADDF`: the only action colour. WDLL 2 forbids it on `.eyebrow`. Focus is `--ss-sh-focus` already in the block.

Also omitted because they were not on the copy list, not because a comment bans them on a card: `--ss-t4`, the `--ss-ink-9x` / `--ss-raised-9x` aliases, `--ss-mono`, `--ss-fs-meta` / `--ss-fs-value` / `--ss-fs-subject`, `--ss-d-tint` / `--ss-d-move` / `--ss-d-open`, `--ss-sh-rail` / `--ss-sh-tip` / `--ss-sh-open` / `--ss-sh-inset`.
