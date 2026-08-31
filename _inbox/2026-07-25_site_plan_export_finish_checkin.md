---
id: 2026-07-25_site_plan_export_finish_checkin
title: Finish check-in — site-plan export (Wave 4 / WDLL 9) — DEPLOYED, HOLDING
status: holding
date: 2026-07-25
last_updated: 2026-07-25
applies_to: hauska-engine, hauska-mcp-server, hauska-map
related: [2026-07-25_site_plan_export_WDLL, 2026-07-25_site_plan_export_STATUS, 75o_site_plan_export_spec]
owner: nick
---

# Finish check-in — site-plan export — DEPLOYED, HOLDING

Operator directive 2026-07-25: push deploys, verify routes/revisions, then **STAND DOWN**. Do **not** run the live `48029:105129` sample or SDK meter trace yet. Retrieval is in a known OOM/500 outage owned by F1 / Command Center completion — site-plan agent must not touch, restart, redeploy, or work around `hauska-retrieval-api`.

## Merged code (CI green)

| Wave | Repo | PR | Merge SHA |
|---|---|---|---|
| 1–2 | hauska-engine | #116 + #117 | `c59a81c` (site-plan on main) |
| 3 MCP | hauska-mcp-server | #48 | `67b4b64` |
| 3 PE | hauska-map | #56 | `3774c4d` |

## Deploys pushed (2026-07-25) — verbatim

### Property Explorer (Vercel)

- Deploy: `dpl_6jGk4k5f6gs9ZyJzJLrdRPq7XLo6` from map `3774c4d`
- Aliased: `https://property-explorer-xi.vercel.app`

**Before (pre-deploy):** `POST /api/pe-site-plan-export` → **404**

**After:**

```
HTTP 401
```

(empty body; route exists — auth required for anon. 404 cleared.)

### hauska-mcp-server (Cloud Run, `hauska-prod-497015`)

- Image: `us-central1-docker.pkg.dev/hauska-prod-497015/hauska-mcp/hauska-mcp-server:67b4b64`
- Build: `1fbeef79-e5d2-48ea-ba42-6b56516408ff` SUCCESS
- Serving: **`hauska-mcp-server-00028-wt4` @ 100% LATEST** (was `00027-d95`)
- Deploy method: image-only (`gcloud run deploy --image … --no-traffic` then `update-traffic --to-latest`) so live env was preserved (including `HAUSKA_BACKEND_URL` → retrieval). No cloudbuild `--set-env-vars` REPLACE.

Health paste (degraded deps are pre-existing / out-of-lane — not site-plan):

```json
{"status":"degraded","service":"hauska-mcp-server","version":"0.1.0","env":"production","dependencies":{"engine_retrieval_api":{"state":"ok","latency_ms":21,"detail":"HTTP 404"},"cortex_api":{"state":"ok"},"postgres":{"state":"ok"},"upstash":{"state":"down","detail":"TypeError: fetch failed"}}}
```

### hauska-engine-api (Cloud Run, `hauska-prod-497015`)

- Image: `us-central1-docker.pkg.dev/hauska-prod-497015/cloud-run-source-deploy/hauska-engine-api:site-plan-c59a81c`
- Build: `f08be045-4c86-47f5-9ac1-b0dd3ac35586` SUCCESS (`services/engine-api/Dockerfile` only — root Dockerfile is retrieval, unused)
- Serving: **`hauska-engine-api-00038-78q` @ 100% LATEST** (was `00079-lib`)
- Deploy method: image-only (env preserved)

Health + route:

```json
{"status":"ok","service":"engine-api","adapters":true,"engineCore":true,"envelope":true,"documentIngest":true,"documentIngestStore":"durable","startedAt":"2026-07-25T10:36:15.254Z"}
```

```
GET /v1/property-nodes/48029:105129/site-plan-export → HTTP 401
```

(route live; auth required — not 404)

### hauska-retrieval-api — UNTOUCHED (read-only confirm)

Site-plan agent did not deploy, restart, or reconfigure retrieval. Read-only describe after our deploys:

```
latestReadyRevisionName: hauska-retrieval-api-00016-ttp
```

(F1 may advance this independently; not our lane.)

## HOLD — final verification NOT run

Deferred until retrieval restored and PE is QA-able again (operator re-engage):

1. Live `48029:105129` refresh → DXF + IFC + PDF samples under `_inbox/2026-07-25_site_plan_samples/live/`
2. SDK meter trace: one `authorizePaidCall` / `sdk_metering_authorize` per export request
3. Operator Revit (DXF Link CAD + IFC solid) + PDF review
4. Grade WDLL item 9 MET + thesis_parity_ledger close note

Synthetic fixtures remain under `_inbox/2026-07-25_site_plan_samples/` for structure-only inspection.

## Stance

**Deployed, staged, holding.** Site-plan agent stood down. No further action until re-engaged post-retrieval recovery.
