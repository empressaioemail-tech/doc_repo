---
id: 2026-08-29_p91_loop_d_review
title: Wave D adversarial review (listing click)
date: 2026-08-29
status: accepted-uncommitted
plan_row: P-91
wdll: 16 listing half, 26
lane_worktree: P:/seat-worktrees/property/legacy-design-tools-p91-listing
head: c601f2bbc70c8a23d7b66c9555cbd12d5afda21f
---

# Wave D review

Reviewed the diff, not the lane summary. Uncommitted on `feat/p91-listing-click`. No merge. No deploy.

## Verdict

Accept the code. Do not treat item 16 as closed. Live Connect still scores the three outcomes.

## What I read

`artifacts/smartsite-mcp/src/mcp-app.ts` and `tests/mcp-app.test.ts` against `_lane_return.md`. Diff +124 / -11 on those two files.

The iframe `listingHistoryMessage` interpolates `LISTING_TURN_OPENER` and `LISTING_TURN_INSTRUCTION` via `JSON.stringify`. That is one string, not a second handwritten copy.

Click still posts `ui/message` only. `tools/list` stay-13 test remains.

## CP1 falsifiers

1. Button exists but no `ui/message` is host drop, not a CSS miss. `classifyListingOutcome` returns `host_drop` when `turnText` is null even if `ask_the_map` ran. Held.

2. A prohibition without a positive destination will pick the next wrong tool. Turn text has public-web destination plus `Do not call ask_the_map` plus `Do not start Smart Site research`. A turn that only says "search the public web" scores `guard_failed`. Held.

3. Panel-unchanged after a failed click is not success. A guarded turn with no `ask_the_map` and no transcript answer throws `listing_outcome_unclassified`. It is not `working`. Held.

## Rejected alternate reading

That the 86 passing tests prove the host will post `ui/message`. Rejected: `answeredInTranscript` and `toolsCalled` are observer inputs. The suite scores a Connect transcript after the fact. It cannot see Claude's host. The lane said this. Agree.

## Layout note

`.acts` is `position:sticky` and also a flex footer under a scrolling `.well`. The visible-button mechanism is the flex pin, not sticky. Not a reject.

## leave_behind

- Live Connect click after this image is serving. Score host_drop / guard_failed / working on the real transcript.
- Wave E still separate.
- Wave F still an operator save click.
