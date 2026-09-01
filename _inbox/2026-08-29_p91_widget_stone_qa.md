---
id: 2026-08-29_p91_widget_stone_qa
title: Wave H Stone interview answers for the MCP widget
date: 2026-08-29
status: answered
plan_row: P-91
item: 12
interview_started: 2026-08-29T02:01-05
answered: 2026-08-29T02:06-05
paint: serving
paint_tree: P:/tmp/legacy-design-tools-p91-stone
paint_uri: ui://smartsite/app-p547.html
paint_at: 2026-08-29T02:15-05
serving: smartsite-mcp-00043-mex
serving_tag: p547
---

# Wave H Stone QA

Questions only. Paint waits on Nick. Do not edit `mcp-app.ts` until he says paint.

Live probe 2026-08-29T02:01-05 on `https://smartsite.cloud/p/48021:34137`. Computed `:root` matches `pe-tokens.css`: `--ss-void` `#2A2A2B`, `--ss-ink` `#323234`, `--ss-raised` `#3F4043`, `--ss-blue` `#86ADDF`, `--ss-gold` `#E8963B`, `--ss-gold-lt` `#F5B95C`, `--ss-atom` `#6FC1B8`, `--ss-t1` `#FBFBFC`.

## Answers

| # | Question | Nick's answer | Bind | Leftover |
| --- | --- | --- | --- | --- |
| 1 | Live versus pe-tokens.css | Yes. Widget matches live Stone. | Target is `pe-tokens.css`. Not v2 dark. | Map tiles did not paint in the probe. Chrome tokens still resolved. |
| 2 | Iframe fill | Stay darker. Recede into Claude's permission card. | Page fill stays off `--ss-ink`. Do not set `--bg` to `#323234`. | No Stone token is "darker guest well". Kit has no name for `#1c1c1c`. Paint must say the leftover, not invent a token. |
| 3 | Find listing history | Stone blue action | `--ss-blue` | White host primary is out. |
| 4 | Resolved node id | `--ss-atom` openable record | `--ss-atom` | Lime `--val` dies. |
| 5 | Overlay keys | Gold leak. Do not keep it. | `--ss-t6` is the legal leftover for metadata if a key colour is still required. `--ss-gold` stays mark + unread dot. | Confirmed at paint: keys are `--ss-t6`. Not inherit body. |
| 6a | present | `--ss-t3` default body | `--ss-t3` plus a present glyph | Not `--ss-ok`. Present is quiet. |
| 6b | absent-verified | `--ss-t6` faint metadata | `--ss-t6` plus an absence glyph | Stays. Unknown moved to `--ss-t5`. |
| 6c | unknown | `--ss-t6` then moved | `--ss-t5` | Ruling 2026-08-29T02:07-05: move unknown to `--ss-t5`. Absent-verified stays `--ss-t6`. Collision closed. |
| 6d | refused | `--ss-warn` waiting | `--ss-warn` plus a refuse glyph | Heavier than flood by glyph, not by a sixth hue. |
| 6e | unread | `--ss-gold` unread dot, glyph only, not a fill | `--ss-gold` as the dot. Not a cell fill. | Legal. Distinct from 6c if unknown is not also a gold dot. |
| 7 | Unresolved situs copy | `--ss-slate`. Absence, not a failure. | `--ss-slate` plus the original query | Today's `--alert` dies. |
| 8 | Envelope refuse | `--ss-slate` + reason word | `--ss-slate` plus the reason word | Not `--ss-err`. Cell refuse (6d) is warn. Envelope refuse is slate. Do not collapse those two. |
| 9 | Type steps | 12.5 meta and 14.5 body | `--ss-fs-meta` and `--ss-fs-body` | 10px / 13px widget sizes die. Display 32 and 26 stay out. |
| 10 | Radius 12 | Yes. 12 stays. | `--ss-r-tip` | Do not add 18. |
| 11 | Fonts | Keep system UI | `--ss-ui` | Do not self-host Oxygen in the iframe. `--ss-brand` unused here. |
| 12 | Stay Claude-shaped | Nothing. Full Stone. | No reserved Claude chrome (request-well label, permission-card density, white primary). | TENSION with Q2. Fill recedes (no Stone token). Everything else is Stone. File both. Do not silently pick one. |

## Collisions

1. 6b/6c `--ss-t6` clash: CLOSED. Unknown moves to `--ss-t5`. Absent-verified stays `--ss-t6`.
2. Q2 recede versus Q12 full Stone. Fill has no `--ss-*` name. Report it as a leftover well, not as `--ss-void` or `--ss-ink`. Does not block paint.
3. 6d warn versus Q8 slate. Cell refuse and envelope refuse are different jobs. Keep both. Does not block paint.

## Still owed, not this interview

Section 3.8 failure copy. Open is still typed. A dead button and a working click that finds nothing still look identical.

## Paint gate

Nick said paint, then deploy. Isolated tree `P:/tmp/legacy-design-tools-p91-stone` on `feat/p91-wave-h-stone`. URI `ui://smartsite/app-p547.html`. Serving `smartsite-mcp-00043-mex` @100% tag `p547`. Leftover well filed `_inbox/2026-08-29_p91_wave_h_paint_leftover.md`. Deploy `_inbox/2026-08-29_p91_wave_h_p547_deploy.md`. Reconnect required. Not a customer-done paint grade.
