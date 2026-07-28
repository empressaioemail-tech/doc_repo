---
id: 2026-07-28_pe_cc_qa_cluster_claude_code
title: PE + CC QA cluster — brief port, export unblock, CC nav, hydrology, labels (planner-manages-subs)
date: 2026-07-28
type: session-summary
participants: [nick (spec), claude-code planner (fable), 4 recon subagents, 7 executor subagents]
related: [_STATE.md, _inbox/2026-07-28_pe_cc_qa_and_reports_spec.md, _inbox/2026-07-27_bastrop_qa_defect_register.md]
---

# Session: PE + CC QA cluster (2026-07-28)

Planner-manages-subs execution of the 2026-07-28 spec. Four recon agents mapped the surfaces; planner root-caused the two live blockers with direct live probes; seven executor agents built in isolated worktrees; planner merged on green CI, deployed every service, and live-verified on the deployed surfaces. All spec items A–G shipped same-session; B2 (aerial page) was in-flight at close.

## Root causes established (planner live probes, not agent self-grade)

**Site-plan export block (B1).** Not auth. PE prod was at main tip with all env set; both MCP and engine share the GATE_CONTEXT_SIGNING_KEY secret; engine gate mode defaults to log. The real chain: MCP engine-client DEFAULT_TIMEOUT_MS=30s vs a live warm refresh of 23.2s (measured); cold exceeds 30s, fetch aborts as "Engine API unreachable … requires engine-api", and PE's classifyEngineFailure pattern-matched `requires engine-api` into the gate class, printing the misleading gate-token message. Verbatim probe: first (cold) MCP `refresh_parcel_site_plan_export` on 48021:28286 returned the unreachable error; immediate warm retry: HTTP 200 in 23157ms with the full site-plan atom payload.

**Hydrology 504 (F).** Operator hypothesis confirmed. Topo swap made the default DEM 1m; the hydrology-flow slot reused the shared raster plan; accumulationThreshold stayed 50 cells regardless of resolution; pysheds worker budget 120s vs PE Vercel fn cap 60s. Live baseline (PE prod, z14 Bastrop bbox): HTTP 200 in 40645ms, channelCount 1379.

## Shipped (7 PRs, all merged on green CI)

| PR | Repo | Content |
|---|---|---|
| #91 | hauska-map | Inspect card trusts present land-use/acreage values over coverage flags; provenance captions (G) |
| #92 | hauska-map | engine_timeout/unreachable classes never classify as gate; honest 503 retryable message (B1 PE leg) |
| #93 | hauska-map | FLAGSHIP: rendered Property Intel brief, Alder design language (sections, citation appendix, freshness verdicts, print CSS), close button, print-to-PDF export, no fabrication (A) |
| #94 | hauska-map | CC map→node "Open in Node & Graph" action, county→node→atom browse with search/pagination/back-nav, 404 feature-detect fallback, timeout constant unification, CITY-ZONED label reframe (C, D, E) |
| #164 | hauska-engine | Hydrology 10m resolution floor + resolution-scaled D8 threshold + honest metadata (F) |
| #165 | hauska-engine | GET /nodes county roster endpoint (pinned contract) + migration 008 jsonb expression indexes (D; also kills the gold-parcel inspect timeout) |
| #52 | hauska-mcp-server | Site-plan/terrain export timeouts 50s/45s + EngineApiTimeoutError with honest retry text (B1 MCP leg) |

In flight at close: engine PR for the aerial-context PDF page (B2 — Esri World Imagery embed + vector overlay + attribution + honest fetch-failure path).

## Deployed (planner-owned)

- MCP `hauska-mcp-server-00033-khs` @100% (Cloud Build, tag 2ceaf27; env substitutions verified against live before submit).
- engine-api `hauska-engine-api-00109-nur` @100% (image hydro-6e25b49; canary --no-traffic → smoke → shift; 4Gi/300s preserved; envelope-canary tag repointed).
- retrieval-api `hauska-retrieval-api-00043-lay` @100% (deploy --source, canary tag nodelist → smoke → shift). Migration 008 applied to substrate Neon FIRST and all four indexes verified by direct query.
- PE + CC redeployed via Vercel CLI. Finding: Vercel does NOT auto-deploy this repo on merge — CLI deploy from repo root with `vercel link --yes --project <name>` then `vercel deploy --prod` (runbook _inbox/2026-07-21).

## Live verification (deployed surfaces, gold + other parcels)

- Hydrology, same bbox as baseline through PE prod BFF: 40645ms/1379 channels → **6310ms/169 channels**, status ok. PE shell renders "Flow lines — 177 D8 channels" on load. Residual: a fully cold engine start can still exceed 60s once; UI degrades honestly and recovers on next interaction.
- MCP export: `download_parcel_site_plan_export` 48021:28286 → HTTP 200 in 5764ms, 591KB real `%PDF-1.7` payload.
- /nodes: direct (Bastrop roster 939ms; q=28286 → exactly the gold parcel; road roster with display names; **gold-parcel detail 195ms** — the CC inspect that used to blow a 20s timeout) and through the CC prod proxy (2333ms).
- Headless-Chrome screenshots (CDP) of CC prod: county node list renders real roster rows with atom families; search returns 1–1 of 1 for the gold parcel; node inspect renders 4 boundary edges without timeout; county roster pill reads **"9.27% CITY-ZONED"** (E live).
- PE prod bundle verified to carry the brief renderer, print export, and inspect-card caption code; live facets payload for 48021:28286 carries landUse A1 cad-roll + acreage 0.1886 shoelace-wgs84.

## Owed / residuals

- Operator visual confirm (needs a signed-in paid session, which the planner cannot mint): brief render + PDF export on a zoned AND an unzoned parcel; site-plan export click; inspect-card values.
- B2 aerial-page PR: merge + engine redeploy when the executor reports.
- W2 finding worth keeping: property atom bodies carry no address/APN (search is node-id/propId + road names); the cortex facets DO carry situsAddress — a future enrichment could thread it into the roster.
- W4 flag: the sibling /dem route still defaults 1m; a caller doing /dem → /drainage at default can feed pysheds a 1m raster (out of scope today).
- /nodes `total` caps at 10,000 with `total_capped: true` (honest floor, documented).
- Engine env still carries dead COTALITY_* secret refs (code paths decommissioned; env cleanup is a separate hygiene pickup — do NOT rotate, just remove when touched next).
