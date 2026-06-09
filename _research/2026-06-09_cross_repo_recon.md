---
id: 2026-06-09_cross_repo_recon
title: Cross-repo recon — verified live state (deploy + PR + runtime)
status: active
last_updated: 2026-06-09
applies_to: portfolio
related: [00_current_state, 00c_portfolio_master_map, 00d_portfolio_roadmap_reference, 2026-06-06_cross_repo_recon, 72a_capital_raise_positioning]
owner: nick
---

# Cross-repo recon — 2026-06-09

> **What this is.** A live verification pass against running systems, not the doc set. Triggered because the doc set lagged reality: the build-out and Miami keystone arc had fully merged and deployed while the docs still described it as pending. Method: GitHub API (PR state, branch HEADs), gcloud Cloud Run (serving revisions, traffic, env), and live health endpoints, run ~20:40 2026-06-09. Supersedes the point-in-time deploy/PR claims in `00_current_state` prior to this date. The corpus-shape ground truth from [`_research/2026-06-06_cross_repo_recon.md`](2026-06-06_cross_repo_recon.md) (34 jurisdictions / 21,126 atoms, 2 public-free / 32 platform-internal) still holds and is re-confirmed live below.

## 1. Headline

The entire build-out plus Miami keystone arc (legacy-design-tools PR #141 through #156) is **merged and deployed to production.** cortex-api revision `00140-dax` has served 100 percent of prod since 20:23 on 2026-06-09, nine minutes after #156 merged, with the finding mode set to `anthropic` and orchestration on. Production serves real web-grounded findings, not mock. Across all eight spine repos the only unmerged work is three observability and GTM PRs. There is no pending deploy. The "deploy the build-out wave" linchpin is closed.

## 2. What is serving prod (Cloud Run, verified)

| Service | Project | Serving revision | Traffic | Health / notes |
|---|---|---|---|---|
| cortex-api | legacy-design-tools-prod | `cortex-api-00140-dax` (created 2026-06-09T20:23:57Z) | 100% | `/api/healthz` ok. Env `AIR_FINDING_LLM_MODE=anthropic`, `BRIEFING_LLM_MODE=anthropic`, `AIR_FINDING_ORCHESTRATED=1`. Image `cortex-api:latest`. Deployed by gha-deployer. |
| api-server | legacy-design-tools-prod | `api-server-00003-wix` | 100% | `/api/healthz` ok. **NEW service, absent from the 2026-06-01 master map.** Separate backend, image `api-server:latest`, deployed by gha-deployer. Identity (brokerage/brief + snapshot backend vs thin BFF) not yet established. |
| hauska-mcp-server | hauska-prod-497015 | `hauska-mcp-server-00007-njc` (2026-06-09T12:52Z) | 100% | `/health` ok; all four dependencies ok (engine_retrieval_api 45ms, cortex_api 39ms, postgres 233ms, upstash 125ms). `total_requests:0` (idle). |
| hauska-retrieval-api | hauska-prod-497015 | `hauska-retrieval-api-00006-2lq` | 100% | `/healthz/` **warn**: corpus ok (`atomCount:21126`), but `db.ok:false status:not_configured` (SUBSTRATE_DATABASE_URL / DATABASE_URL unset). This is exactly what PR #68 wires. |
| smartcity-api | smartcity-os-prod | `smartcity-api-00106-riz` (tag empressa-neon) | 100% | On Empressa Neon, confirmed. `00104-taw` (bastrop-tenant-fix) still parked as rollback. |
| smartcity-scraper | smartcity-os-prod | `smartcity-scraper-00038-hb4` | 100% | Repopulating raw on Empressa. |

Gate is genuinely wired (not relaxed): the mcp `/health` dependency probe reaches the real engine and cortex hosts and returns ok on all four. The earlier DEGRADED reading (placeholder `HAUSKA_BACKEND_URL`) is resolved at the source.

## 3. Code state — main HEADs and the full open-PR surface

| Repo | main HEAD | Date | Open PRs (entire org-wide unmerged surface) |
|---|---|---|---|
| legacy-design-tools | `ffbb4aa` Merge #156 | 2026-06-09 | none — fully merged |
| hauska-engine | `88e5199` #67 engine-api scaffold | 2026-06-07 | **#68** retrieval `/healthz` corpus + substrate Neon observability (MERGEABLE) — confirmed still needed by the live `warn` |
| hauska-mcp-server | `a963870` #25 Layer-2 tool registration | 2026-06-07 | **#27** observability/gate-probe/uptime (MERGEABLE); **#26** GTM collateral refresh (MERGEABLE — body still says "46-tool surface", now stale, main is 57) |
| hauska-atom-contract | `721da74` v1.3.0 | 2026-05-28 | none |
| hauska-sdk | `218801c` #1 completion sprint | 2026-06-07 | none |
| smartcity-os | `24fd7e5` #23 PowerBI repoint | 2026-06-08 | none |
| hauska-brief-extension | `0198908` v0.6.5 | 2026-05-29 | none |
| legacy-revit-sensor | `541bf33` Revit repoint | 2026-05-21 | none |

MCP tool count on main: `src/tools.ts` registers **57 tools** (`server.tool(` count). The 06-09 deploy cluster (revisions 00005, 00006, 00007, all 2026-06-09) rebuilt the gate image after #25 (2026-06-07), so the 46→57 expansion is effectively live, not pending.

The merged Miami / build-out arc, for the record: #141 Cotality pack, #142 hydrology, #143 arrow-two Phase 1 ledger, #144 brokerage MCP service path, #145 subsurface, #146 plan-set decomposition, #147 precedence primitive, #148 GTM Tier-0 loop, #149 precedence taxonomy, #150 Miami whole-review vision, #151 web-search grounding, #152 v2 reasoning atoms, #153 web-first coverage gate, #154 Run-plan-review tab + workflow:204 anthropic fix, #155 deferAutoFindings 409 fix, #156 stale-run reaper. All merged.

## 4. Corrections this recon forces on the doc set

1. **#156 is merged and deployed**, not "held for operator merge" as the inbox drop stated. cortex-api 00140 (20:23) postdates the #156 merge (20:14).
2. **Production does not serve mock.** The live cortex-api env is `anthropic` + orchestrated, and #154's `cloud-run-deploy.yml:204` fix held through the subsequent 00140 deploy, so it is durable. Every "prod ships mock / launch blocker" line is obsolete: the `00_current_state` resume-steps block and `72a` gap #1.
3. **The 46→57 gate-tool redeploy is effectively done.** Main is 57 tools; the gate image was rebuilt 06-09.
4. **The keystone-deploy RESUME STEPS checklist in `00_current_state` is fully completed** and should be marked superseded.
5. **A second prod service, `api-server`, exists** in legacy-design-tools-prod and is not in the master map. The §3 topology of [`00c`](00c_portfolio_master_map.md) needs an update pass.
6. **retrieval-api substrate Neon observability is genuinely unwired** (live `not_configured`); PR #68 is real work, not cosmetic.
7. Corpus is live and matches the 06-06 figure: 21,126 atoms served by the retrieval API.

## 5. The actual remaining backlog (org-wide)

Mergeable now: hauska-engine #68 (wire the retrieval substrate Neon DB — clears the one live `warn`), hauska-mcp-server #27 (observability plus retire the noisy v1 stale-revision drift alert policy), hauska-mcp-server #26 (GTM collateral, correct "46" to "57" before merge). Beyond those PRs the next moves are finding quality (the proven FBC M601.6 finding conflated egress with mechanical), the arrow-two calibration capture build (still unsprinted), the Decision C GTM unpin (its gate, build-out deployed and tested, is now met), the Cortex 7k phased launch (Phase 1 ephemeral demo, Phase 2 auth), and the queued tenant-leg and engine-lift work. None of these is a deploy.

## Revision history

- **2026-06-09 (origin):** Live verification pass. Established that the build-out plus Miami keystone arc is fully merged and deployed (cortex-api 00140 @ anthropic), the gate is wired with 57 tools, retrieval corpus is live but its substrate DB is unwired (#68), a new `api-server` prod service exists, and the only open work org-wide is #68/#27/#26. Supersedes the pre-2026-06-09 deploy/PR claims in `00_current_state`.
