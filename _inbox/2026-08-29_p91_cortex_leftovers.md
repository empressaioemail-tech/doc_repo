---
id: 2026-08-29_p91_cortex_leftovers
title: Cortex leftovers ready, not cut from the stone snapshot
date: 2026-08-29
status: scored-met
plan_row: P-91
---

# Do not deploy cortex from P:/tmp/legacy-design-tools-p91-stone

That tree is `feat/p91-wave-h-stone` off `006fd009`. A cortex image from it would rewind current serving `00660-bux` / p540. Do not deploy from it.

# What is written there

1. `duplicate_resolved_node` before insert, plus 23505 catch. Two queries that resolve to one node return JSON 400, not Express HTML 500.
2. `lookupParcelNodeForScreen`. A typed node id is unresolved unless a parcel row matches. `48021:90000x` no longer paints Open after this ships.

Files: `peScreenSave.ts`, `peScreenSaveResolveCore.ts`, `peScreenSaveResolve.ts`, `txgioAddressResolve.ts`, tests.

# Cut in progress 2026-08-29T17:21Z

Applied on `P:/tmp/legacy-design-tools-p91-cortex-leftover` branch `feat/p91-cortex-leftovers` HEAD `b5fc2e87` (origin/main plus leftover hunks). Not the stone snapshot.

Cloud Build `32b24002-9ed7-41cf-b4ac-898aef7ff27b` SUCCESS. Serving was `cortex-api-00660-bux` @100% tag `p540`. Digest `sha256:0c12685330e82e41fe46265138cab68c6fb9611e3f375d6173d5855eb49077d0`. Evidence `_inbox/2026-08-29_p91_leftovers_p540_deploy.md`. Grade `_inbox/2026-08-29_p91_leftovers_cortex_prompt.md`.

# add_to_screen existence serving 2026-08-29T19:35Z

Operator go. Live prod at cut start was `cortex-api-00662-hij` @100% tag `canary`. Leftover tree fast-forwarded to `889b1556`. Now serving `cortex-api-00664-hib` @100% tag `p541`. Digest `sha256:a93eb0924d951ba921ac355ba5258e7473c3b8bf6b04e22c97554e2244ee3bf3`. Evidence `_inbox/2026-08-29_p91_leftovers_p541_deploy.md`. Grade MET `_inbox/2026-08-29_p91_leftovers_add_exist_grade.md`. Do not use the A13 board that already holds `48021:900099` resolved.
