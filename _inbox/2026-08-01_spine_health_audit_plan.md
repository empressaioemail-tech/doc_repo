---
id: 2026-08-01_spine_health_audit_plan
title: Spine health audit — READ-ONLY plan (surfaced by the retrieval-api silent-4-day outage)
date: 2026-08-01
status: plan (read-only audit; agent team; adversarial review on findings; output feeds roadmap)
owner: nick
related: [2026-08-01_retrieval_api_search_down_incident, 2026-08-01_retrieval_api_search_fix_dispatch]
purpose: retrieval-api /search was silently dead ~4 days because /health only checked liveness. This audit finds every OTHER place the spine can fail silently or is already drifting. READ-ONLY — no fixes, no deploys, no traffic shifts. Output = a ranked, adversarially-verified findings ledger that folds into the roadmap. Do NOT touch the running retrieval-api fix (separate agent live).
---

# Spine health audit — read-only

## WHY (the trigger)
A core spine service (retrieval-api /search) served zero successful requests for ~4 days with no alert, because its /health check only proved the process was alive, not that search worked. The concern is not that one service; it is: WHERE ELSE can the spine fail silently, and what is ALREADY drifting that we can't see? This audit answers that, read-only, so we fold the fix into the roadmap deliberately.

## HARD CONSTRAINTS
- READ-ONLY. No code changes, no deploys, no traffic shifts, no env/secret writes, no DB writes. Observation + probes only (GET health/introspection; authed read probes are fine; never mutate).
- Do NOT touch retrieval-api's in-flight fix (a separate agent is fixing /search live). Read its current state, don't change it.
- Every finding gets an ADVERSARIAL REVIEW before it lands (see "Adversarial gate").
- Verify against LIVE (gcloud / curl / gh / npm), not against docs — docs lag reality (this whole incident proved that).
- Paste RAW output in every finding. No summarized tool state.

## SCOPE — the spine surface (live-confirmed 2026-08-01)
Cloud Run services (with the serving-vs-latest gap already observed — the audit confirms/explains each):
- hauska-engine-api (hauska-engine repo; Cloud Build services/engine-api/Dockerfile; hauska-prod-497015) — serving 00142, latest 00159 (17 behind).
- hauska-mcp-server (hauska-mcp-server repo; hauska-prod) — serving 00013, latest 00034 (21 behind); /health currently reports "degraded".
- hauska-retrieval-api (hauska-engine repo; services/retrieval-api; hauska-prod) — serving 00008, latest 00051; /search DOWN (fix in flight).
- cortex-api (legacy-design-tools repo; cloud-run-deploy.yml; smartcity-os-prod) — /api/health is bare {"status":"ok"} (liveness-only).
- smartcity-api + smartcity-scraper (smartcity repo; smartcity-os-prod).
Plus the data plane each depends on: Neon DBs (deployment + substrate), npm-published contracts (@empressaio/atom-contract), the tile/render pipelines, and cross-service auth (product keys, gate tokens, service API keys).

## THE FIVE AUDIT DIMENSIONS (fan one lane per dimension; parallel)

### D1 — Health-check DEPTH (the direct lesson)
For EVERY spine service: does /health prove the service's REAL WORK works, or just that the process is alive? Classify each health endpoint: LIVENESS-ONLY (bad — retrieval-api pattern) vs FUNCTIONAL (proves the critical path — engine-api's adapters/engineCore/envelope is the good model). For each liveness-only one, name the critical path it FAILS to cover (e.g. cortex-api {"status":"ok"} doesn't prove LLM/retrieval/DB reachability; retrieval-api /health didn't prove /search). Deliverable: a table — service | health depth | what it does NOT cover | could-it-hide-a-4-day-outage (Y/N).

### D2 — SILENT-FAILURE surface (where else can it die quietly?)
For each service, find the paths that can fail WITHOUT surfacing: fail-open fallbacks that mask a dead dependency (does cortex-api's Neon fallback hide a dead substrate? does the brief's websearch-fallback hide a dead engine?), swallowed errors, ret/timeouts that return empty instead of erroring, degraded modes that still return 200. The retrieval-api failure was invisible because callers degrade-to-empty. Find every "returns nothing / returns stale instead of erroring" path. Deliverable: ranked list of silent-failure modes, each with the exact fallback/catch and what it masks.

### D3 — DEPLOY / TRAFFIC drift (the serving-vs-latest gaps)
Explain the observed gaps: engine-api 17 behind, mcp-server 21 behind, retrieval-api broken-latest. For each: is the serving revision INTENTIONAL (canary held on purpose) or ORPHANED (a newer ready revision that should be serving but traffic never shifted — the traffic-trap)? Which merged-and-deployed fixes are NOT actually live because traffic never shifted? Cross-check recent merged PRs vs serving revision per service. Deliverable: per-service serving-vs-latest verdict (intentional | stuck-canary | traffic-trap) + a list of "merged but not live" changes.

### D4 — DEPENDENCY / DATA-PLANE liveness
Map what each service depends on and whether those are healthy: Neon DBs (does the live serving revision's DATABASE_URL point at a DB that HAS the expected data + indexes? migration-merged != applied-to-live — the retrieval-api substrate question generalizes), npm contracts (is each service on a current @empressaio/atom-contract, or pinned-stale?), cross-service calls (engine-api → retrieval-api → Neon; cortex-api → engine-api + retrieval-api). Find broken or stale edges. Deliverable: a dependency map with each edge marked healthy | stale | broken, with the live probe that proves it.

### D5 — OBSERVABILITY / ALERTING gap (why nobody knew)
The meta-finding: there is apparently no alert when a spine service stops doing its real work. Audit what monitoring EXISTS (Cloud Run uptime checks? log-based alerts? any alerting policy at all?) vs what's needed. Would ANY current signal have caught the 4-day retrieval-api outage? Deliverable: current-alerting inventory + the minimum alert set that would have caught this (per-service functional uptime check), scoped so it's roadmap-foldable.

## ADVERSARIAL GATE (required on every finding)
No finding lands on the reviewer's word alone. For each candidate finding, a SEPARATE adversary agent tries to REFUTE it: "this health check is actually fine because X", "this is intentional canary discipline not a trap", "this fallback is correct not a silent failure", "this dependency is actually current". A finding survives only if the adversary cannot refute it with live evidence. Mark each surviving finding CONFIRMED (adversary tried, failed) vs PLAUSIBLE (couldn't fully verify live — e.g. needs a secret/DB the audit can't read). Default to refuted when uncertain. This is the discipline that would have killed the three false citation-fixes earlier.

## SUGGESTED TEAM SHAPE (your agents; parallel, isolated)
- 5 finder lanes (D1..D5), each read-only, each produces raw-evidence findings.
- 1 adversary pass per finding (or a small adversary pool) that tries to refute before anything lands.
- 1 synthesis pass: dedupe, rank by (blast-radius x silence x likelihood), produce the ledger.
Keep contracts tight; fewer agents with real ground truth beats a big fan with drift (the scan-fix-loop lesson).

## OUTPUT (what feeds the roadmap)
A single ranked FINDINGS LEDGER: each row = finding | dimension | CONFIRMED/PLAUSIBLE | blast-radius | how-silent | raw evidence | suggested fix-class (health-probe / kill-fallback / shift-traffic / bump-contract / add-alert) | rough effort tier. Ranked most-severe first. Plus the D5 meta-recommendation (the minimum functional-alerting set). This is READ-ONLY analysis — no fix is applied; the ledger is what we fold into the roadmap and dispatch deliberately.

## COORDINATION MODEL (single handoff — audit-planner owns the fleet)
This is ONE dispatch to an AUDIT-PLANNER agent that owns the whole thing end to end. It does NOT hand back after fanning workers. It:
1. Fans the 5 finder lanes (D1..D5) itself and BLOCKS until they return (a coordinator that fans workers and then returns ABANDONS them — do not do that; own the fan synchronously).
2. Runs the adversarial gate on every candidate finding (a refuter per finding; survives only if it can't be refuted with live evidence).
3. Synthesizes the ranked ledger itself.
4. Returns ONE result to the operator: the ledger + the D5 meta-recommendation. Operator manages ONLY this planner, not the sub-agents.
The audit-planner does verification itself (never delegates the adversarial gate's verdict to the finder that produced the finding). It is read-only throughout — the planner enforces "no writes/deploys/traffic" on every sub-agent.

## STANDING DECISIONS (travel in the dispatch)
Read-only (no writes/deploys/traffic). Verify against live, not docs. Adversarial gate on every finding; verification never delegated to the finder. Cloud Run traffic-trap awareness (serving != latestReady). Migration-merged != applied-to-live-DB. No-special-data-access. No timeframe estimates (effort tiers, not dates). Paste raw output. Don't touch the in-flight retrieval-api fix.
