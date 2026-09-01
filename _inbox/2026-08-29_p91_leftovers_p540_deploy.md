---
id: 2026-08-29_p91_leftovers_p540_deploy
title: Cortex leftovers serving on p540
date: 2026-08-29
status: serving-not-graded
plan_row: P-91
serving: cortex-api-00660-bux
tag: p540
digest: sha256:0c12685330e82e41fe46265138cab68c6fb9611e3f375d6173d5855eb49077d0
tree: P:/tmp/legacy-design-tools-p91-cortex-leftover
base: b5fc2e87
---

# Snapshot before this shift

Wave 1 had already moved production. At 17:26Z serving was `cortex-api-00658-peq` @100% tag `canary`, revision digest `sha256:e6cd1fb21218eac51e3edce0714f634204c6b5558cc982742c5d9e3532e5ae5e` (origin/main `b5fc2e87`). `00656-vek` / p539 was 0%. This cut advanced that current main, it did not rewind it.

# Deploy

Isolated tree `P:/tmp/legacy-design-tools-p91-cortex-leftover` on `feat/p91-cortex-leftovers`. Cloud Build `32b24002-9ed7-41cf-b4ac-898aef7ff27b` SUCCESS. Digest from Artifact Registry `image_summary.digest`, not the build log.

Canary `cortex-api-00660-bux` @0% tag `p540`. Tag `/api/healthz` was `{"status":"ok"}`. Revision `imageDigest` is the same sha256. Then `--to-tags=p540=100`. Traffic row by field name: `revisionName=cortex-api-00660-bux`, `percent=100`, `tag=p540`. Prod `/api/healthz` `{"status":"ok"}`.

No `--set-env-vars`. No migrations. MCP iframe still `smartsite-mcp-00051-yim` / p551.

# What shipped

`duplicate_resolved_node` before insert, plus 23505 catch. `lookupParcelNodeForScreen` so a typed node id is unresolved unless a parcel row matches. `add_to_screen` still does not existence-check. That is how F6 step 2 still plants `48021:900099`.

# Grade

Connect prompt `_inbox/2026-08-29_p91_leftovers_cortex_prompt.md`. Do not grade on an old chat that still thinks cortex is p539.
