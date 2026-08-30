---
id: 2026-08-29_p91_leftovers_p551_deploy
title: F6 dead-Open timer serving on p551
date: 2026-08-29
status: serving-not-graded
plan_row: P-91
serving: smartsite-mcp-00051-yim
tag: p551
digest: sha256:948f18d003e2c701acd06b7b49384b11497a78c7dbadbe7183be7d5feec641ac
uri: ui://smartsite/app-p551.html
---

# Deploy

Isolated tree `P:/tmp/legacy-design-tools-p91-stone`. Cloud Build `83765f20-c74f-47e3-8bd2-0be7515b01b3` SUCCESS. Digest from Artifact Registry `image_summary.digest`.

Canary `smartsite-mcp-00051-yim` @0% tag `p551`. Tag `/health` `revision` was `smartsite-mcp-00051-yim`. Then `--to-tags=p551=100`. Traffic row: `revisionName=smartsite-mcp-00051-yim`, `percent=100`, `tag=p551`.

No `--set-env-vars`. Cortex untouched: `cortex-api-00656-vek` @100% tag `p539`. Tests 94/94.

# What shipped

F6 dead Open: if Open is clicked and no tool result arrives in 12 seconds, the panel reads `Open did not reach me`. A later parcel result clears it. A later non-parcel result becomes `Not on file in Bastrop`. Those two sentences stay distinct.

# Not serving from this tree

Node-id existence (`lookupParcelNodeForScreen`) and `duplicate_resolved_node` are in isolated `api-server`. Deploying cortex from this snapshot would rewind serving. Wave 1 still owns cortex.

# Grade

Reconnect. URI `ui://smartsite/app-p551.html`. Prompt `_inbox/2026-08-29_p91_leftovers_prompt.md`.
