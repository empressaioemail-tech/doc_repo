---
id: 76e_platform_observability_sprint
title: Platform observability sprint — self-healing maintenance loop build
status: active
last_updated: 2026-07-05
applies_to: portfolio
related: [76_empressa_wedge_90d_operating_plan, 76a_operator_autonomous_loops, 76b_gtm_engine_polish_sprint, 76c_operator_master_next_steps, 00c_portfolio_master_map, 30a_smartcity_stabilization_sprint, 31a_bastrop_maintenance_sprint, 90_runbooks/steward_daily_digest, 90_runbooks/cloud_run_canary_deploy, 90_runbooks/diagrams/self_healing_loop.mermaid, 79a_weekly_moat_scoreboard]
owner: nick
---

# Platform observability sprint — self-healing maintenance loop build

> **Purpose.** Build the maintenance half of the operator loop that is designed in [`76a_operator_autonomous_loops.md`](76a_operator_autonomous_loops.md) (Diagram 1, self-healing loop) and flagged in [`00c_portfolio_master_map.md`](00c_portfolio_master_map.md) section 5 and section 10 as "designed but not built." This is the maintenance-side sibling to [`76b_gtm_engine_polish_sprint.md`](76b_gtm_engine_polish_sprint.md) (the GTM-loop build sprint). Scope: synthetic monitoring, health endpoints, a central daily health-watch that automates the manual maintenance checklist in [`90_runbooks/steward_daily_digest.md`](90_runbooks/steward_daily_digest.md) and implements the W1.A.9 design from [`30a_smartcity_stabilization_sprint.md`](30a_smartcity_stabilization_sprint.md), plus a narrow Tier-0 auto-remediation boundary.
>
> **Why now.** The substrate build-out is merged and deploy is deferred (per [`00_current_state.md`](00_current_state.md)) until ICC plus Cotality clear. The 76a rationale is explicit: deploying the wedge without the maintenance loop repeats the Cloud Run revision / empty brokerage key failure mode. This sprint is sequenced to land the monitoring baseline before that deferred deploy goes live, so the deploy lands into an observed surface, not a blind one.
>
> **Hard rules (load-bearing, from the premortem below).** (1) City operational data retention or deletion (`mygov_raw_records` and the MyGov family) is alert-only and human-gated, never auto-remediated, per the partnership-first commitment. (2) Native Google Cloud Monitoring is the tooling. No paid observability vendor without an explicit operator decision, per the cost-per-jurisdiction commitment.

## Build status — Wave A landed (2026-06-07)

Wave A came back code-complete, held for operator merge. Reports: [`_inbox/2026-06-07_hauska-mcp-server_cc-agent-M_gate_probe_uptime.md`](_inbox/2026-06-07_hauska-mcp-server_cc-agent-M_gate_probe_uptime.md), [`_inbox/2026-06-07_legacy-design-tools_cc-agent-C_observability_hub.md`](_inbox/2026-06-07_legacy-design-tools_cc-agent-C_observability_hub.md).

- **cc-agent-M / hauska-mcp-server** — PR [#27](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/27) held. `/healthz`, `/gate-probe` (three cases, `X-Hauska-Key`), emit contract, uptime checks LIVE for both hauska-prod services, alert policies LIVE (5xx, p95, revision drift), 245 tests pass. Cloud Scheduler API enabled on `hauska-prod-497015`.
- **cc-agent-C / legacy-design-tools** — branch `cortex/observability-hub`, local, PR pending operator go to commit/push. Normalized `/api/healthz`, signal emit, daily aggregator, OpenAPI, operator script, steward-digest automation, 8 health tests pass. Cloud Scheduler API enabled on `legacy-design-tools-prod`.
- **cc-agent-E / hauska-engine** — landed as PR [#68](https://github.com/empressaioemail-tech/hauska-engine/pull/68) (`chore/retrieval-api-healthz`, OPEN + MERGEABLE as of 2026-06-08): retrieval-api `/healthz` corpus + substrate Neon observability. Held for merge. The mcp uptime check for retrieval-api stays red until #68 merges AND the gate is wired to the retrieval URL (see finding 2 below).
- **Wave B / smartcity** — correctly not started (gated on clean WS-1 2C plus the second cc-agent-M clone).

Both pre-fire Scheduler-API gates are now done (the agents enabled them). Still owed by the operator: merge the two PRs and deploy; bind `GATE_PROBE_CODEX_KEY` for the valid-key gate case; mint the Neon read-only token; supply the alert email to `scripts/setup-health-monitoring.ps1`; create the health-watch scheduler service account with `run.invoker`; delete the always-true test alert policy `8570526367601301438` after confirming email receipt.

**Three real live findings, surfaced by the build itself (the loop already earned its keep). Findings 2 and 3 verified 2026-06-08.**

1. **cortex-api revision drift, confirmed live.** Prod serves `cortex-api-00119-laq` (deployed 2026-05-29) at 100 percent while `cortex-api-00090-vf9` (2026-06-06) is the latest ready at 0 percent. This is the exact stale-revision failure mode the sprint targets. It is consistent with the intentional deferred-deploy posture in `00_current_state`, so the alert is true signal, not noise: it will clear the moment the build-out is deployed to traffic. Calibration note: if the drift alert should stay quiet during an intentional defer, give it a per-service expected-serving-revision acknowledgment; otherwise expect it to fire until deploy. Alert-only, no auto-remediation.
2. **mcp-server `/health` degraded = dependency-check misconfig, NOT a substrate outage (verified 2026-06-08).** The self-check returns `engine_retrieval_api: down (fetch failed)`, `cortex_api: down (aborted, 2001ms)`, `upstash: down`, `postgres: ok`. Root cause is in the live mcp-server container env: `HAUSKA_BACKEND_URL` is the literal placeholder `https://REPLACE-with-cc-agent-E-engine-url` and `UPSTASH_REDIS_REST_URL` is `https://REPLACE-with-upstash-rest-url`. The substrate is genuinely up: probing directly, `hauska-retrieval-api/health` returns 200 and `cortex-api/health` returns 200. cortex shows down only because the dep-check uses a 2s timeout (correct URL `LEGACY_BACKEND_URL`, cold-start exceeds 2s). Implication beyond the sprint: the live gate was never wired to the deployed engine, so engine/retrieval-backed MCP tools are dark in prod until the deploy wires `HAUSKA_BACKEND_URL` -> `https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app` and the real upstash URL/token. **Do not silence #27's resulting alerts by relaxing the dep-check; fix by wiring the URLs at deploy** (and widen or accept the cortex probe timeout). The alerts are surfacing a real config gap, not a false positive.
3. **The "stale-revision traffic drift" alert is firing on expected idle traffic (operator paged ~daily; verified 2026-06-08).** Policy `Hauska stale-revision traffic drift (mcp + retrieval)` fires when `run.googleapis.com/request_count` on the serving mcp revision drops below 0.0001/sec for 15 minutes. The serving revision `hauska-mcp-server-00004-t5c` (at 100 percent) served 4 requests in ~2.5 days, because in the deploy-deferred + unwired-gate state nothing calls it. So request_count sits at zero by design, the alert fires, a stray probe trickles in hours later and it "recovers" (observed: fired 2026-06-07 21:31 UTC, recovered 2026-06-08 06:48 UTC). The policy self-documents as "v1 proxy for stale-revision drift until MQL revision metadata is validated" — a crude stand-in that cannot distinguish dead from idle. **#27 must RETIRE this policy, not merely add `/healthz` + gate-probe checks** — if #27 only adds checks and leaves the request-count proxy enabled, the noise continues. Post-deploy, re-introduce a stale-revision check keyed to revision-metadata mismatch (what the policy doc is waiting on), not request_count==0. The synthetic uptime checks in #27 also generate steady traffic that would keep request_count off zero. Operator decision 2026-06-08: leave the policy as-is and fix via #27 (accepted noise until #27 lands). Sibling cleanup: the always-true test policy `Hauska platform observability test alert` (id `8570526367601301438`) is still enabled and should be deleted per the pre-fire steps.

## Verified deployed surface (2026-06-07)

Enumerated live against the GCP control plane this session (the doc set lagged the project IDs and one service). Verbatim findings retained so the build agents inherit ground truth, not the stale map.

Six live Cloud Run services across three projects:

| Service | Project | Latest ready revision | Role |
|---|---|---|---|
| `hauska-mcp-server` | `hauska-prod-497015` | `hauska-mcp-server-00004-t5c` | Gating boundary, 62 tools across four gates (public/codex/reporting/map) per PR #35 merged 2026-07-05 (was 46 at this 2026-06-07 recon), `X-Hauska-Key` product gate |
| `hauska-retrieval-api` | `hauska-prod-497015` | `hauska-retrieval-api-00004-m9t` | Read-only corpus retrieval, port 8080 |
| `cortex-api` | `legacy-design-tools-prod` | `cortex-api-00090-vf9` | Product reasoning monorepo (briefing + finding engines) |
| `api-server` | `legacy-design-tools-prod` | `api-server-00003-wix` | Brokerage / extension API surface |
| `smartcity-api` | `smartcity-os-prod` | `smartcity-api-00104-taw` | City platform, 15 integrations |
| `smartcity-scraper` | `smartcity-os-prod` | `smartcity-scraper-00037-zfm` | MyGov scraper, Cloud Scheduler driven |

Cloud Scheduler: ten jobs exist, all in `smartcity-os-prod` only.

```
ID: full-scrape               SCHEDULE: 0 5,13,21 * * *   STATE: ENABLED  LAST: 2026-06-07T13:00:02Z
ID: active-wo-report-hourly   SCHEDULE: 30 * * * *        STATE: ENABLED  LAST: 2026-06-07T19:30:22Z
ID: manager-load-past-due     SCHEDULE: 35 * * * *        STATE: ENABLED  LAST: 2026-06-07T19:35:12Z
ID: manager-load-table-sync   SCHEDULE: 50 * * * *        STATE: ENABLED  LAST: 2026-06-07T19:50:01Z
ID: wo-manager-sync           SCHEDULE: 0 6 * * *         STATE: ENABLED  LAST: 2026-06-07T06:00:02Z
ID: building-inspections      SCHEDULE: 30 7 * * *        STATE: ENABLED  LAST: 2026-06-07T07:30:01Z
ID: inspection-export         SCHEDULE: 0 7 * * *         STATE: ENABLED  LAST: 2026-06-07T07:00:21Z
ID: fire-inspections          SCHEDULE: 30 8 * * *        STATE: ENABLED  LAST: 2026-06-07T08:30:29Z
ID: reviews-sync              SCHEDULE: 30 6 * * *        STATE: ENABLED  LAST: 2026-06-07T06:30:03Z
ID: fee-reports               SCHEDULE: 30 9 * * *        STATE: ENABLED  LAST: 2026-06-07T09:30:02Z
```

Three load-bearing findings from the enumeration:

1. **Cloud Scheduler API is not enabled on `hauska-prod-497015` or `legacy-design-tools-prod`.** Only `smartcity-os-prod` has it. Any scheduled probe or health-watch on the Hauska spine or the cortex/api-server surface needs the API enabled first. This is an operator or `serviceusage.services.enable` gate, named below.
2. **Zero Cloud Monitoring uptime checks exist in any of the three projects.** The synthetic-monitoring layer is a clean greenfield, not an extension.
3. **Scheduler `STATE: ENABLED` is not success.** `wo-manager-sync` shows ENABLED with a recent attempt, yet [`31a_bastrop_maintenance_sprint.md`](31a_bastrop_maintenance_sprint.md) flags it as a sync failure (Chromium lock). Monitoring must read job execution result, not enabled state. This is the central design constraint for scraper monitoring.

Doc-drift surfaced for the primary session to fold into [`00c_portfolio_master_map.md`](00c_portfolio_master_map.md) (this lane does not edit 00c): `cortex-api` runs in `legacy-design-tools-prod`, not the `smartcity-os` project the master map section 1 names; and `api-server` is a live service the master map service table omits.

Health endpoints could not be probed from the planning host (egress is filtered to googleapis, so `curl` to the run.app hosts returned `000`). Liveness is asserted from the control plane (all six services report a READY latest revision). The per-service `/healthz` path and payload shape are a build-agent recon item, seeded by the W1.A.9 findings doc on the smartcity-os side, which already audited the smartcity health surface.

## Neon databases in scope

Monitored through application `/healthz` (connection liveness) plus, where size and growth matter, the Neon API (operator-minted read-only token, gated below). Direct `gcloud` cannot see Neon; it is AWS-hosted.

| Database | Backs | Watch signal |
|---|---|---|
| Engine corpus snapshot plus substrate Neon | `hauska-retrieval-api` | Connection up; corpus atom count non-zero |
| cortex-prod Neon (`neondb` plus `api_keys`) | `cortex-api`, `api-server` | Connection up; `api_keys` readable |
| smartcity Neon | `smartcity-api`, `smartcity-scraper` | Connection up; `mygov_raw_records` size and growth delta |

The `mygov_raw_records` growth pattern is the named wedge: per [`91_postmortems/2026-05-07_replit_dev_db_wedged.md`](91_postmortems/2026-05-07_replit_dev_db_wedged.md) the MyGov raw tables (around 20 GB) drove the prior Neon wedge. Growth is an alert signal only. Retention, TTL, archival, and any deletion stay human-gated (hard rule above).

## What to monitor

| Domain | Signals | How |
|---|---|---|
| Per-service health | `/healthz` 200 plus payload (db, deps, revision) | Cloud Monitoring uptime check per service, one notification channel |
| Latency and error rate | p95 latency, 5xx rate per service | Cloud Monitoring metric alert policies on Cloud Run built-in metrics |
| Revision and traffic drift | Latest ready revision is the one serving 100 percent traffic | Scheduled check; alert if traffic pinned to a stale revision (the recurring failure mode) |
| Neon | Connection liveness, `mygov_raw_records` size and growth delta | App `/healthz` db field plus Neon API size query |
| Scraper success | Per-job execution result for the ten Cloud Scheduler jobs, not enabled state | Read job execution status and the `sync_health` row; `wo-manager-sync` is the known-failing case |
| MCP-gate availability | Anonymous path resolves to public; valid product key resolves to product; malformed key returns 401 | Synthetic gate probe against `hauska-mcp-server` |
| Daily operator health-watch | One report rolling the above into the W1.A.9 design plus the steward maintenance checklist | Central aggregator, scheduled |

## Auto-remediation vs alert-only boundary

The policy tiers are inherited verbatim from [`76a_operator_autonomous_loops.md`](76a_operator_autonomous_loops.md). This sprint builds only the Tier-0 surface plus alerting; Tier 1 through 3 stay as they are (cc-agent PR with operator merge, steward proposal, architecture call).

**Tier-0 auto-remediation (pre-authorized in 76a, bounded here):**

- Cache-warm re-trigger on a warmup-class failure (the codes warmup 403 pattern already seen in prod).
- Scraper transient re-run, bounded retry count, on a single transient scheduler-job failure.
- Canary-healthz traffic rollback to the last healthy revision, per [`90_runbooks/cloud_run_canary_deploy.md`](90_runbooks/cloud_run_canary_deploy.md). This fires at deploy time on a failed canary probe; it is not an autonomous background actor in this sprint.

**Alert-only, human-gated (everything else):**

- Neon size or growth threshold breach. Surfaces a recommendation (TTL, archival, partitioning); a human decides. No automated data action on city operational data, ever.
- MCP-gate 401 anomaly or availability drop. Could be a real auth incident; routes to steward, not to an auto-fix.
- Sustained error-rate or latency regression. Becomes a triaged dispatch, not a hotpatch.
- Secret, schema, and any cross-tenant condition. Human-gated by definition.

The autonomous (non-deploy-time) Tier-0 triggers are pre-authorized in 76a. **Operator decision 2026-06-07: ship them in alert-then-suggest mode.** The remediation logic is built and wired to detect-and-propose, but does not act autonomously; it flips to acting after one clean week of observed behavior, on a one-line operator go. The deploy-time canary-healthz rollback is unaffected (it is not an autonomous background actor) and stays active.

## Build targets

Three named artifacts, consistent with the prompt's expected shape (Cloud Scheduler plus health endpoints plus an alerting channel):

1. **Health endpoints.** Each of the six services exposes or normalizes `GET /healthz` returning `{status, db, deps, revision}`. Most already have a health surface; this normalizes the payload so one aggregator can read all six.
2. **Synthetic monitoring plus alerting.** Native Cloud Monitoring uptime checks (one per service), metric alert policies (uptime, 5xx rate, p95 latency, stale-revision traffic drift), and one notification channel. Channel type is operator-gated; native Cloud Monitoring email channel is the zero-vendor default recommendation.
3. **Central health-watch aggregator.** A scheduled job (Cloud Scheduler to a small endpoint or Cloud Function) that polls all six `/healthz`, the Cloud Run revision and traffic state, the scraper job results, the Neon size signals, and the MCP-gate probe, then writes the daily health-watch report (the W1.A.9 deliverable) and fans alerts to the one channel on threshold breach. This automates the maintenance section of [`90_runbooks/steward_daily_digest.md`](90_runbooks/steward_daily_digest.md). It lives in `legacy-design-tools` (cortex-api / api-server), where the steward digest and the `gtm_events` observation plane already sit, so the maintenance observation log is a peer to the GTM one rather than a fork.

## Signal emit contract (pinned)

So the four dispatches run in parallel without live cross-agent coordination, the emit shape is pinned here rather than left to the agents to agree. Every monitored surface emits one structured Cloud Logging line per check; the cc-agent-C hub reads them by `check` and `service`. No new transport, no shared table; Cloud Logging is the bus.

```json
{
  "hauska_health": true,
  "check": "healthz | gate_probe | scraper_job | neon_size | revision_drift",
  "service": "hauska-retrieval-api | hauska-mcp-server | cortex-api | api-server | smartcity-api | smartcity-scraper",
  "status": "ok | warn | fail",
  "value": "<observed>",
  "threshold": "<expected or limit>",
  "source": "<probe or query that produced this>",
  "ts": "<RFC3339>"
}
```

Every line carries `source`, `value`, and `ts` to satisfy the quality-gate rule. The hub filters `jsonPayload.hauska_health=true` and groups by `check` plus `service`. Emitters log the line; they do not call the hub.

## Dispatches (fire-ready)

Four build dispatches, one per repo. The planning hold is lifted; fire per the order below. Genuine preconditions remain named inside each dispatch (pre-fire operator gates; the smartcity dispatch waits on a clean WS-1 2C cutover). Per-project ownership avoids a single agent needing cross-project IAM. The aggregator hub is cc-agent-C; the per-project agents emit to the pinned contract above.

| Dispatch | Agent | Repo / project | Build |
|---|---|---|---|
| [`2026-06-07_cc-agent-C_observability_hub_and_health_watch.md`](_dispatches/2026-06-07_cc-agent-C_observability_hub_and_health_watch.md) | cc-agent-C | `legacy-design-tools` / `legacy-design-tools-prod` | Central health-watch aggregator, cortex-api plus api-server `/healthz`, uptime checks plus alert policies plus channel, Neon size check, revision/traffic-drift check, enable Scheduler API |
| [`2026-06-07_cc-agent-M_mcp_gate_probe_and_hauska_uptime.md`](_dispatches/2026-06-07_cc-agent-M_mcp_gate_probe_and_hauska_uptime.md) | cc-agent-M | `hauska-mcp-server` / `hauska-prod-497015` | mcp-server `/healthz`, gate-availability synthetic probe, uptime checks plus alerts for both hauska-prod services, enable Scheduler API, emit to hub |
| [`2026-06-07_cc-agent-E_retrieval_api_healthz.md`](_dispatches/2026-06-07_cc-agent-E_retrieval_api_healthz.md) | cc-agent-E | `hauska-engine` / `hauska-prod-497015` | retrieval-api `/healthz` returns corpus-loaded plus substrate-Neon connection plus atom count, emit to hub |
| [`2026-06-07_cc-agent-M_smartcity_health_watch_and_scraper.md`](_dispatches/2026-06-07_cc-agent-M_smartcity_health_watch_and_scraper.md) | cc-agent-M (smartcity-os clone) | `empressaio_tech_smartcity_os` / `smartcity-os-prod` | Implement W1.A.9 daily health-watch email, scraper job-result monitoring across the ten jobs, create the thread-health Scheduler job (31a P1-5), `mygov_raw_records` growth alert, uptime checks for smartcity-api plus scraper, emit to hub |

Agent-label note: cc-agent-M owns both a `hauska-mcp-server` dispatch and a `empressaio_tech_smartcity_os` dispatch (the 31a convention also calls the smartcity owner cc-agent-M). These are different clones; per workspace hygiene they run sequentially, one clone per run, not concurrently. The operator may split smartcity to a distinct agent; flagged below.

## Fire order

This sprint takes the maintenance slot ahead of net-new spine-robustness Wave 2 and the 76b Tier-1 outbound items (focus-queue tradeoff, acknowledged in the premortem).

**Pre-fire (operator, about 15 minutes, unblocks everything scheduled or Neon-touching):**

- Enable Cloud Scheduler API on `hauska-prod-497015` and `legacy-design-tools-prod` (`gcloud services enable cloudscheduler.googleapis.com --project <id>`). Already on for `smartcity-os-prod`.
- Mint a Neon read-only API token; store in Secret Manager per project. If skipped, the agents degrade to app-`/healthz` Neon liveness and flag the size-query as blocked (they do not hard-stop).
- Channel: native Cloud Monitoring email is the working default (operator decision deferred to recommendation); confirm the recipient and the 7 AM US Central send, or name a different channel.

**Wave A (parallel, different repos and agents, fire together):**

- cc-agent-E on `hauska-engine` (retrieval-api `/healthz`).
- cc-agent-C on `legacy-design-tools` (cortex-api plus api-server `/healthz`, then the hub aggregator and the `legacy-design-tools-prod` uptime/alert layer).
- cc-agent-M on `hauska-mcp-server` (mcp `/healthz`, gate probe, hauska-prod uptime/alert layer).

**Wave B (after Wave A, the second cc-agent-M clone):**

- cc-agent-M on `empressaio_tech_smartcity_os` (W1.A.9 health-watch, scraper-result monitoring, thread-health job, mygov growth alert, smartcity uptime). Two genuine gates: it is cc-agent-M's second clone so it runs after the hauska-mcp-server run completes (one clone per run), and it waits on a clean WS-1 2C cutover (do not build on the data path mid-cutover). The hub (cc-agent-C) reads its emit when it lands; the hub does not block on it.

The agents emit per the pinned contract, so Wave A and Wave B do not need to coordinate live. Land the baseline before the deferred build-out deploy, so the deploy lands into an observed surface.

## Operator-gated inputs

Flagged rather than invented, per the constraint:

| Input | Decision | Recommendation |
|---|---|---|
| Notification / alerting channel | Email, Slack, PagerDuty, or native Cloud Monitoring email | **Working default: native Cloud Monitoring email** (zero new vendor, in-project), 7 AM US Central per W1.A.9. Confirm recipient or override |
| On-call / escalation policy | Who is alerted, hours, escalation ladder | Single operator recipient for v1; escalation deferred until external traffic |
| Paid monitoring tool | Datadog / Grafana Cloud / Better Stack vs native | Native (hard rule, cost-per-jurisdiction commitment). Do not adopt a paid vendor without an explicit decision |
| Neon read-only API token | Mint a read-only token for size and growth queries | Read-only scope only; store in Secret Manager per project |
| Enable Cloud Scheduler API | On `hauska-prod-497015` and `legacy-design-tools-prod` | Operator or an agent with `serviceusage.services.enable` |
| Cross-project monitoring IAM | Which agent configures uptime checks where | Resolved by per-project ownership above; confirm each agent has Monitoring Editor in its project |
| smartcity-os monitoring owner | cc-agent-M (per 31a) or a distinct agent | Keep cc-agent-M per 31a; sequence the two cc-agent-M clones, do not run concurrently |
| Autonomous Tier-0 go | Authorize the non-deploy-time auto-remediation triggers to act, vs alert-then-suggest | **DECIDED 2026-06-07: alert-then-suggest.** Built wired to detect-and-propose; flips to acting after one clean week on a one-line operator go |

## Premortem result

Cleared **GREEN** this session (premortem-check skill, 2026-06-07). All three load-bearing commitments clean, each on a condition now written as a hard rule above: sell-reasoning (green, the loop protects the substrate delivery contract); partnership-first (green, conditional on city-operational-data deletion staying human-gated and alert-only); cost-per-jurisdiction (green, conditional on native Cloud Monitoring over any paid vendor). One operational yellow on the focus-queue rule (this is a net-new workstream): absorbed with operator acknowledgment of the sequencing tradeoff, since this is the maintenance loop the 90-day plan already committed (76a M0/M1) and the precondition for the deferred deploy. What it kills: the manual steward daily-digest toil and ad-hoc firefighting. What it queues: spine-robustness Wave 2 and 76b Tier-1 outbound wait behind the maintenance slot.

## Kill / pause criteria

- Pause if a paid observability vendor is proposed without an operator cost decision (cost-per-jurisdiction hard rule).
- Pause any auto-remediation path that would act on city operational data retention or deletion (partnership-first hard rule).
- Pause the autonomous Tier-0 wiring if it acts before the operator go, or if it fires on a signal it should only alert on.
- Re-scope if uptime-check or alert-policy configuration needs IAM the per-project agent does not have (route to operator rather than broadening one agent's cross-project reach).

## References

- [`76a_operator_autonomous_loops.md`](76a_operator_autonomous_loops.md) — the self-healing loop this sprint builds (Diagram 1)
- [`90_runbooks/steward_daily_digest.md`](90_runbooks/steward_daily_digest.md) — the manual maintenance checklist this sprint automates
- [`30a_smartcity_stabilization_sprint.md`](30a_smartcity_stabilization_sprint.md) — W1.A.9 daily health-watch design (the seed)
- [`31a_bastrop_maintenance_sprint.md`](31a_bastrop_maintenance_sprint.md) — thread-health cron gap (P1-5), wo-manager-sync failure (P1-8)
- [`90_runbooks/cloud_run_canary_deploy.md`](90_runbooks/cloud_run_canary_deploy.md) — the rollback pattern for the Tier-0 canary guard
- [`00c_portfolio_master_map.md`](00c_portfolio_master_map.md) — section 5 and section 10, maintenance engine designed not built
- [`91_postmortems/2026-05-07_replit_dev_db_wedged.md`](91_postmortems/2026-05-07_replit_dev_db_wedged.md) — the Neon wedge this monitors against

## Revision history

| Date | Change |
|------|--------|
| 2026-06-08 | Verified findings 2 and 3 against live prod. Finding 2 resolved: mcp `/health` degraded is a dep-check misconfig (placeholder `HAUSKA_BACKEND_URL` + upstash URL), substrate genuinely up; fix is to wire URLs at deploy, not relax the check. Finding 3 added: the stale-revision traffic-drift alert pages on expected idle traffic (4 reqs/2.5d on the serving revision); #27 must retire that v1 request-count proxy, not just add checks. cc-agent-E retrieval `/healthz` now landed as PR #68 (open, mergeable). Operator decision: leave the noisy policy, fix via #27. |
| 2026-06-07 (fire-ready) | Operator greenlit the build. Tier-0 decided as alert-then-suggest; native Cloud Monitoring email set as the working channel default. Pinned the signal-emit contract (structured Cloud Logging line) so the four dispatches run in parallel without live coordination. Replaced sequencing with a concrete pre-fire plus Wave A / Wave B fire order; dispatches flipped from QUEUED to fire-ready. Slot moved 76d to 76e (collision with a parallel GTM data-package doc; yielded 76d, touched only own files). |
| 2026-06-07 | Initial sprint plan. Verified the six-service surface and scheduler / uptime-check state live; scoped monitoring domains, the Tier-0 vs alert-only boundary, three build targets, four dispatches, operator gates. Premortem cleared GREEN. |
