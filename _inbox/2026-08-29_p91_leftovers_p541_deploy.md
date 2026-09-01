---
id: 2026-08-29_p91_leftovers_p541_deploy
title: add_to_screen existence serving on p541
date: 2026-08-29
status: serving-not-graded
plan_row: P-91
serving: cortex-api-00664-hib
tag: p541
digest: sha256:a93eb0924d951ba921ac355ba5258e7473c3b8bf6b04e22c97554e2244ee3bf3
tree: P:/tmp/legacy-design-tools-p91-cortex-leftover
base: 889b1556
---

# Snapshot before this shift

At cut start serving was `cortex-api-00662-hij` @100% tag `canary`, revision digest `sha256:74bc10312707324de360b44d33c93e2600c5fc83df2b3d118451afbc0c1ed3ed` (Wave 1 after leftover p540). `00660-bux` / p540 was 0%. Leftover tree was still on `b5fc2e87`. Fast-forwarded to `889b1556` (PR #548) before the image so this cut advances that main. It does not rewind it.

# Deploy

Isolated tree `P:/tmp/legacy-design-tools-p91-cortex-leftover` on `feat/p91-cortex-leftovers`. Cloud Build `b140e5a0-d1fe-4d09-9b8b-20df6a7fa867` SUCCESS. Digest from Artifact Registry `image_summary.digest`, not the build log.

Canary `cortex-api-00664-hib` @0% tag `p541`. Revision `status.imageDigest` is the same sha256. Tag `/api/healthz` was `{"status":"ok"}`. Then `--to-tags=p541=100`. Traffic row by field name: `revisionName=cortex-api-00664-hib`, `percent=100`, `tag=p541`. Prod `/api/healthz` `{"status":"ok"}`.

No `--set-env-vars`. No migrations. MCP iframe stays `smartsite-mcp-00057-xuk` / p554.

# What shipped

`add_to_screen` calls `lookupParcelNodeForScreen`. A typed node id with no parcel row writes unresolved, `parcelNodeId` null, no Open. Walk add of a real neighbor still resolves. `create_screen` leftover-dup and leftover-absent hunks ride this image again (they were not on `00662-hij`).

# Grade

Connect prompt `_inbox/2026-08-29_p91_leftovers_add_exist_prompt.md`. Do not grade on A13 `4316b571-…`. That board already holds `48021:900099` as resolved. Re-add there is a no-op.
