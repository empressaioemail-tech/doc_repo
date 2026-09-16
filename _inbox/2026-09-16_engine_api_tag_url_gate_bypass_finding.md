---
id: 2026-09-16_engine_api_tag_url_gate_bypass_finding
title: "Finding: the engine-api gate is enforced on the service URL and still open on 37 revision tag URLs"
date: 2026-09-16
last_updated: 2026-09-16
status: open
severity: high
owner: integration seat (records, recommends); operator go needed for the production traffic change
snapshot: hauska-engine-api serving revision hauska-engine-api-00242-nor at 100 percent; hauska-engine origin/main 422c7d3; probes 2026-09-16T16:27Z to 16:29Z from the integration seat's shell; revision and service specs read as JSON the same minutes
related: _inbox/2026-08-27_engine_api_gate_bypass_finding.md (this reopens it on a path it did not name); OPS-16 A-039; the HAUSKA_ENGINE_API_KEY exposure reported by the reports lane on 2026-09-16
---

# Finding: the engine gate has a side door on every old tagged revision

## What the 2026-08-27 finding asked for, and what happened

The 2026-08-27 finding showed that `hauska-engine-api` accepted self-declared gate-front headers from the public internet because `ENGINE_API_GATE_TOKEN` was unset. Its fix order was: callers send the token, then the engine sets it, then four probes return 401.

That fix landed. Every numbered revision from `hauska-engine-api-00219-huf` (created 2026-09-13T23:12Z) onward carries `ENGINE_API_GATE_TOKEN`, sourced from the secret `HAUSKA_ENGINE_API_KEY`. The token check in `services/engine-api/src/server.ts` at 422c7d3 runs before the header parse and answers `{"error":"unauthorized"}`. With the token unset, the same request falls through to the header check and answers `gate_front_context_required`. The error string is therefore a clean discriminator for whether a revision enforces the token, and the probes below send no credential and no gate headers.

## What was observed

| Target | Request | Answer |
|---|---|---|
| Service URL (00242-nor, 100 percent) | no headers | 401 `unauthorized` |
| Service URL | `Authorization: Bearer <junk>` | 401 `unauthorized` |
| 37 revision tag URLs | no headers | 37 of 37: 401 `gate_front_context_required` |

The service carries 51 traffic tags. 37 of them point at revisions whose spec has no `ENGINE_API_GATE_TOKEN`: `ovf`, `fd3`, `bdc`, `bdc-downtown`, `fd5`, `fd5b`, `fd5c`, `main6399`, `xray200`, `pooling-fix`, `fix255`, `t2-dxf-text`, `t1-1256277`, `t2-contour-spike`, `ws1-fd91b54`, `ws1-serve-truth-12`, `e1e2`, `p90-fix`, `p120fix`, `p120r04`, `p120r04b`, `p120r05`, `r05fix`, `r05main`, `r05narr`, `r05v2`, `p155-feasibility-async`, `p159`, `p155-p159-main`, `ops23-wave3`, `ops23-wave3-fix`, `ops23-wave3-fix2`, `p154-share-1`, `p152canary`, `p167-strings`, `p120batch`, `p32-fix`. A tag URL routes to its own revision with that revision's configuration, so on each of these the only gate is the header shape check that the 2026-08-27 probes passed with `product=cortex, access-tier=platform-internal`. That header pass was not re-run here; the discriminator shows the token check is absent, and the header behaviour is the 2026-08-27 measurement.

**Mechanism:** the fix was applied to new revisions and the canary habit of tagging every deploy left 37 pre-fix revisions individually addressable. **Second mechanism considered:** the 37 answers could come from a front layer that strips the Authorization header before the revision sees it. Rejected: the service URL, which passes through the same front layer, answers `unauthorized` to a junk bearer, so the header reaches the container.

## What else was checked

No Cloud Run job or service in `hauska-prod-497015` (41 jobs, 4 services) or `legacy-design-tools-prod` (1 job, 3 services) references an engine tag URL, so removing the tags breaks no configured consumer. References in doc_repo are historical canary probes only. `hauska-retrieval-api` (3 tags) and `hauska-mcp-server` (6 tags) have no tagged revision missing an auth variable the serving revision carries.

## What closes it

Remove the 37 tags with `gcloud run services update-traffic hauska-engine-api --remove-tags=<list>` in `hauska-prod-497015`, `us-central1`. Serving traffic is unchanged (100 percent stays on 00242-nor) and the change is reversible while the revisions exist. Verify by violation: every former tag URL stops resolving, and the service URL still answers `unauthorized` to an empty request.

**Rotation does not close this.** The 37 revisions do not read the token at all. Rotating `HAUSKA_ENGINE_API_KEY` is a separate item: the value now gates the engine on the service URL and is mounted in five services across two projects (`hauska-engine-api` as `ENGINE_API_GATE_TOKEN` and `RETRIEVAL_API_KEY`; `hauska-retrieval-api`; `hauska-mcp-server`; `cortex-api`; `smartsite-mcp`). The hauska-prod secret has two enabled versions, the legacy-design-tools-prod mirror one.

**The control that keeps it closed is not built.** Nothing fails when a deploy leaves a tag on a revision that predates a security setting. The three-question answer for a future check: a post-deploy step (executes) on every engine deploy (trigger) that fails when any tagged revision lacks a variable the serving revision carries (fails). Bypass: a manual `gcloud run deploy --tag` outside the workflow.
