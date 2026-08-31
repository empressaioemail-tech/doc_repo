---
id: 2026-08-24_lane2_parked_after_paint
title: Lane 2 parked until paint peel merges — how A2 and Reports rejoin
status: active
date: 2026-08-24
plan_row: P-60
---

# Lane 2 is the current PE cut

Hover `#210` (`57ca035`) and paint `#209` are on `origin/main`. Isolated rebase tree: `P:/tmp/hauska-map-pricing-a2` branch `fix/pe-pricing-a2-rebased`. The property checkout `fix/pe-pricing-a2` is stale (still on `#203`, dirty). Do not write there.

Reports Option D has frames only. Travis identity-join is a **draft** card (`_inbox/2026-08-24_lane3_travis_identity_join_WDLL.md`). It does not take this tree.

## Sequence (operator go 2026-08-24)

1. Commit and push `fix/pe-pricing-a2-rebased` from `57ca035`. Preview deploy. No `smartsite.cloud` alias until operator visual and A1 (`interval: year` on the annual CTA).
2. After alias: red-card / search-bar on a new isolated tree.
3. Near-bbox 504s after that.
4. Travis identity-join after A2 is off the PE writer, or as a Lane 3 ingest card that never opens this tree.
5. Reports Option D after the A2 visual. New isolated tree. Frames: `_temp/Smart Site rebrand project (5)/handoff/Smart Site Reports Dock - Option D.dc.html`.

## Do not

- Cherry-pick A2 into the peel PR
- Open `fix/pe-pricing-a2` or any Reports branch in the peel tree
- Deploy A2 until annual checkout sends `interval: year` (WDLL A1) and Nick has seen the table
- Start Reports on the peel tree
- Revive `feat/pe-workbench-verdict-reports`
