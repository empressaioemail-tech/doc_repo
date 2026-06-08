---
id: 2026-06-08_session_close_tenant_leg_spine_migration
title: Session close - tenant leg + spine robustness + engine extraction + SmartCity migration (three parallel lanes)
date: 2026-06-08
kind: session
agent: claude_code (primary planner)
related: [00_current_state, 54_tenant_leg_sprint, 55_spine_data_intelligence_stack, 56_engine_extraction_sprint, 30a_smartcity_stabilization_sprint, 76d_gtm_readiness, 76e_monitoring_automation, 80_adrs/adr_005_multitenancy, 90_runbooks/replit_neon_migration, _decisions/2026-06-07_full_engine_extraction_and_data_packages]
---

# Session close - three parallel lanes

Long multi-day session (2026-06-07 into 2026-06-08). Started as tenant-leg planning, expanded into spine-robustness + a committed full engine extraction + data-package tiers, and ended with a full SmartCity production database migration off Replit-managed Neon. Two additional doc_repo planner lanes (monitoring, GTM) ran in parallel and committed their own work. This record is the holistic close + the map of what is next.

## Lane 1 (this session) - spine + migration

**Tenant leg planned + scaffolded.** ADR-005 portfolio multitenancy (Layer A gate enforcement + Layer B SmartCity storage), ADR-008 gate-front-seam scoping decision, `54_tenant_leg_sprint.md`, four QUEUED dispatches (gate tenant resolution, gate-front seam, arrow-2 Phase 2/3, SmartCity tenant onboarding). All HELD pending operator sequencing.

**Spine robustness analysed + built.** `55_spine_data_intelligence_stack.md` (verified site-context / hydrology / plan-review / corpus / subsurface stacks + COGS). Four dispatches fired and LANDED + MERGED: accessibility corpus (#66, ADA+FHA live, A117.1 creds-pending), subsurface adapters (#145, SSURGO+USGS), plan-set decomposition (#146), precedence/reconciliation engine (#147, the combine-A117.1-ADA-FHA capability works). Flag on #147: the rule label `federal-preempts` is conceptually off for two co-applicable federal standards (ADA vs FHA = most-stringent-governs); outcome correct, taxonomy needs a follow-up.

**Full engine extraction committed.** Decision `_decisions/2026-06-07_full_engine_extraction_and_data_packages.md` + `56_engine_extraction_sprint.md`: engines lift cortex-api -> `hauska-engine/engine-api`; cortex-api -> BFF; all apps through the gate. Engine-home scaffold landed (#67). Lift dispatches pre-staged (E adapters -> E engine-core -> C cortex-BFF), gated behind M-Stabilize 2C - now MET.

**Data-package tier model.** Tiers reframed from flat L1/L2 into composable data packages (subsurface, hydrology, parcel/property, code/plan-review, environmental) x access layer, persona-agnostic. Into `08` + Decision B reshape in `14`. Binding constraint: packages sell reasoning, not raw data.

**SmartCity production migration off Replit-managed Neon - COMPLETE.** The night's hardest work. Cloud Shell `pg_dump` stalled against a throttled, un-scalable source + a 5-min idle-in-transaction timeout. Resolved via Replit managed-workflow export (lean/raw split: 105 operational tables vs the two raw scrape tables = 96% of 9.5 GB), restored the lean archive to Empressa Neon, canary cutover of BOTH `smartcity-api` (rev `00106-riz`) AND `smartcity-scraper` (rev `00038-hb4`). Live-verified (Bastrop dashboard, raw repopulating). **M-Stabilize Phase 2C CLOSED -> engine lift unblocked.** Full playbook + gotchas: `90_runbooks/replit_neon_migration.md`; memory logged.

### Bastrop CIP Power BI - new finding (2026-06-08)

Jaime (Bastrop) stood up a new live CIP database. Probed with the SmartCity OS service principal from production: **we have access.** The new `CIP_Projects_Database` (in the CIP workspace, SmartCity OS Power BI service principal granted Workspace Admin) is reachable - embed token generates, live queries work, 28 live CIP projects returned (e.g. Agnes Street Extension, Wastewater Treatment Plant #4). It is a live Dynamics 365 / Dataverse connection (`org260e8b61.crm9.dynamics.com`), NOT the old imported Excel model.

But production is still wired to the OLD config:
- `POWERBI_WORKSPACE_ID` (CIP workspace) - still correct.
- `POWERBI_REPORT_ID` (old Bastrop CIP dashboard) - old report, still embeddable.
- `POWERBI_CIP_DATASET_ID` - **GONE (404)**; this is likely why CIP tiles are empty/stale.

To switch SmartCity OS to the live data (a cc-agent-M smartcity-os workstream, fits 31a Bastrop maintenance / the W1.A.7 PBI line):
- Repoint GCP secrets: `POWERBI_CIP_DATASET_ID` -> `f86e76e6-26f6-43b2-86e6-0b3aaec72243`; optionally `POWERBI_REPORT_ID` -> `8a4009f6-e5c9-4ccf-b1e2-66409158538a` (new live report).
- Update `server/services/powerbi.ts` to query the new Dataverse schema (`msdyn_project` etc.) instead of `PowerBIDashboardTasks` - this is a real code + data-mapping change, not just a config flip; test against the live Dynamics data.
- Stakeholder note to Jaime: yes, the service principal has access and we get 28 live CIP projects back; we need to repoint our config and update the data mapping to the new Dynamics schema.

## Lane 2 (parallel) - monitoring automation (76e)

Wave A landed, both HELD for merge:
- cc-agent-M / hauska-mcp-server -> **PR #27** (`/healthz` + `/gate-probe` + emit contract; uptime checks + alert policies LIVE for both hauska-prod services; 245 tests).
- cc-agent-C / legacy-design-tools -> branch `cortex/observability-hub`, LOCAL, no PR yet (held for operator go). Normalized `/api/healthz`, daily aggregator, operator setup script, 8 tests.
- cc-agent-E (retrieval-api healthz) NOT yet reported - the mcp uptime check for retrieval-api stays red until it lands.
- Wave B (smartcity monitoring) correctly waited on clean WS-1 2C - NOW unblocked.
- Cloud Scheduler API enabled on both projects.

**Two real findings the monitoring already caught:**
1. **cortex-api revision drift** (prod serves `00119-laq` May 29 at 100% while `00090-vf9` Jun 6 is latest-ready at 0%) - matches the intentional deferred deploy; true signal, clears on deploy. Needs a per-service expected-revision ack to stay quiet during the defer.
2. **mcp-server `/health` reports DEGRADED in prod:** `engine_retrieval_api: down (fetch failed)`, `cortex_api: down (aborted)`, `upstash: down`, `postgres: ok`. **NEEDS VERIFICATION before #27 deploys over it** - either the gate genuinely cannot reach the engine/cortex from prod (a live substrate issue worth knowing independent of the sprint) or the dep-check is misconfigured. This is the most important open finding.

## Lane 3 (parallel) - GTM readiness (76d)

Both QUEUED dispatches fired early, done, PRs HELD:
- cc-agent-M / hauska-mcp-server -> **PR #26** (collateral refresh; passed every honesty gate - no "calibrated" overclaim, every corpus number carries the public-vs-internal split, five data-package sections). Nothing published (operator-gated).
- cc-agent-C / legacy-design-tools -> **PR #148** (gtm-loop Tier-0 only; outbound provably disabled, test asserts 403 + sent:false with the flag off; E5 external-caller validation waits on prod deploy).
- Reconciled into capability matrix v1.1 + 76d (commit `11f3221`): **46 deployed vs 57 merged-in-code** (the +11 Tier-1 Layer-2 wraps are merged but deploy-pending - marketing uses 46); six place/workspace tools flipped stale->shipped.
- **GTM commits are LOCAL, not pushed** - the GTM planner asked whether to push.
- Before Decision C unpin: deploy build-out wave, Cotality OAuth + ICC creds, SDK metering, `npm run build:docs` on staging.

## The linchpin: the deferred deploy

The build-out wave (Tier-1 MCP, brief seam, arrow-2 P1, hydrology, SDK) is merged but NOT deployed (operator-deferred until ICC + Cotality clear). This single gate blocks: GTM Decision C unpin, the +11 Tier-1 tools going live (46->57), SDK metering, the cortex-api drift clearing, monitoring finding #1, and the GTM E5 external-caller validation. **Deploy + creds (Cotality OAuth via Gene, ICC onboarding) is the critical multi-lane unblock.**

## Revision history

- **2026-06-08 (origin):** Session-close capturing all three lanes + the next-steps map. Filed at close; handoff prompt issued to the next planner.
