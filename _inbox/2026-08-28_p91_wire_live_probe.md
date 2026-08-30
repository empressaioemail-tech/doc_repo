---
id: 2026-08-28_p91_wire_live_probe
title: P-91 items 1–5 live HTTP probe after #523 ship
date: 2026-08-28
status: evidence
plan_row: P-91
---

# P-91 wire live probe

Snapshot: 2026-08-28T16:25Z. LDT merge `5a20f61d9ebc4c084785c379d59c4130a838b3e9` (PR #523).

## Serving

cortex-api `00635-qux` @100% (tag `canary`). Revision annotation `autoscaling.knative.dev/minScale=1`. Digest `sha256:2437d70444edb18607cdae5e3a38058d47031ed3142b70d0d79135a4105d1d71` (image tag `5a20f61d…`). Same digest as unused min-0 canary `00634-vuq`, which was not shifted.

smartsite-mcp `00020-ced` @100%. Digest `sha256:9d8c7abe0d28c47f3ce71eb79cf131d2b96f406c5b9e07237f6896ef0463491f`. Live `/health` names this revision. `https://mcp.smartsite.cloud/llms.txt` still lists exactly eight tools; `get_smart_site` copy names string-or-array and stub/node.

## How the cortex canary stayed warm

Main `cloud-run-deploy.yml` still bakes `--min-instances=0`. First canary `00634-vuq` had no `minScale` annotation. Planner dispatched a second canary from `fix/cortex-min-instances-1` (PR #521, still open) with the same image tag so `00635-qux` carries `minScale=1`. Then `shift-traffic` on main, which only moves the `canary` tag.

#521 Test is still FAILURE on an unrelated motivated-seller assertion. The next canary from main’s old yml will bake min 0 again.

## HTTP probes (cortex production URL, service bearer + operator PE user)

Instrument: POST `/api/property-explorer/v1/research/brief`. Compared to `_inbox/2026-08-28_p87_item27_draw_probe.json`.

Single-id gold `48021:34137`: 200. `draw.label` `908 PINE , BASTROP, TX 78602`. `draw.ring` identical. Envelope `refused` / `atom_path_pending`. Edge roles rear / side / front / side_corner.

Batch stub `34137` + `25420` + `48021:no-such-node`: 200. Keys `parcels`, `notFound`. `25420` label is the node id, `situs: unknown`. `notFound` is `48021:no-such-node`.

`depth: hop1` on gold: 400 `{ error: not_implemented, depth: hop1 }`.

## Not this probe

Connect `tools/list` annotations (item 1 check). Connect `list_my_properties` for leftover `", ,"` rows (item 2 live list). Connect batch `get_smart_site`. Item 21 file. MCP App iframe. P-92.
