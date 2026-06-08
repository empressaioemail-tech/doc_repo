---
id: 31a_bastrop_maintenance_sprint
title: Bastrop maintenance sprint — platform health catch-up
status: active
last_updated: 2026-06-08
applies_to: smartcity-os
related: [30a_smartcity_stabilization_sprint, 30_smartcity_os, 10_ground_truth, 11_roadmap, 54_tenant_leg_sprint, 80_adrs/adr_005_multitenancy, 90_runbooks/smartcity_cloud_run_env_audit_2026-05-11, 90_runbooks/cloud_run_canary_deploy]
---

# Bastrop maintenance sprint — platform health catch-up

> **Working sprint plan.** June 2026 maintenance window before platform
> enhancements (Codex 1b, M-PropIntel, Prophecy embed resolution).
> Sibling to [`30a_smartcity_stabilization_sprint.md`](30a_smartcity_stabilization_sprint.md);
> this sprint covers **operational hygiene and integration restore** while
> M-Stabilize WS-1 (Empressa Neon) remains on operator DB hold.

**Health baseline:** Platform grade **YELLOW** per read-only recon
2026-06-01. Full report: smartcity-os
`_research/bastrop_platform_health_check_2026-06-01.md` · branch
`recon/bastrop-platform-health-check` · commit `3bc4eb8`.

**Tenant scope:** Bastrop production, `tenant_id = 2`.

## Why this sprint

Core Bastrop dashboards work (MyGov, Samsara, FirstDue, OpenGov, Compass,
calendar). Before feature sprints, close the gaps that degrade staff trust
or leave blind spots: unbound integrations (Verkada, ESRI, transparency),
cron architecture holes (thread-health off in prod), security leaks
(public feedback GET), and sync failures (`wo_manager_export`).

Prophecy embed stays **vendor hold** — pop-out fallback is in Phase 1 but
full iframe fix waits on Prophecy response.

## Relationship to M-Stabilize (30a)

| Track | This sprint (31a) | M-Stabilize (30a) |
|-------|-------------------|-------------------|
| Neon migration | Out of scope — audit status only | WS-1 (operator hold) |
| Security sweep | Phase 1 partial (feedback auth, `.replit` scrub) | WS-3 remainder |
| Multitenancy | Spot-check tenant_id=2 only | WS-4 ADR-005 |
| W1 items | Verified shipped; env rebind mostly done | WS-2 closed |

Resume 30a WS-1 when operator releases DB hold. Run 31a Phase 0–2 in
parallel without touching DATABASE_URL migration.

## Traffic-light summary (2026-06-01)

| Area | Status | Notes |
|------|--------|-------|
| Deploy / runtime | Yellow | `00104-taw` @ 100%; 7 stale traffic tags |
| MyGov | Green | 502 permits; 82 overdue WOs in morning-brief |
| Samsara / Spireon | Green / Yellow | Env bound; Spireon session-gated |
| FirstDue / Emergency | Green | Bound |
| OpenGov / PBI | Yellow | BNP + PBI bound; transparency key missing |
| Calendar | Green | Municode public feed live |
| Compass | Yellow | Works; feedback loop partial; thread-health cron off |
| Prophecy | Red | Vendor hold |
| Verkada / ESRI | Red | Env not bound since May 11 audit |
| Security | Yellow | Public `GET /api/feedback`; `.replit` plaintext |
| Crons | Yellow | In-process crons disabled on Cloud Run |
| Tests | Green | vitest 103/103 |

## Phase board

| Phase | Scope | Owner | Status |
|-------|-------|-------|--------|
| **0** | Operator gates (SQL sample, creds, Prophecy reply, DB hold) | Nick | pending |
| **1** | Quick wins (S, 1–3 days each) | cc-agent-M | pending |
| **2** | Integration restore (M, 1–2 weeks) | cc-agent-M + Bastrop IT | pending |
| **3** | Platform foundation (L) | cc-agent-M | **blocked** on operator DB hold |

---

## Phase 0 — Operator gates (Nick, no code)

| ID | Item | Evidence | Status |
|----|------|----------|--------|
| P0-1 | Run production SQL sample (sync_health, feedback counts, raw table sizes) | Health check §11 | pending |
| P0-2 | Bastrop IT: Verkada + ESRI credential handoff for Cloud Run bind | Env audit still open | pending |
| P0-3 | Prophecy vendor response on `auth.prophecygov.com` allowlist | Audit `2478a4e` | pending |
| P0-4 | Release M-Stabilize DB hold when ready for WS-1 | `30a` operator hold | pending |
| P0-5 | PBI Option B — request Bastrop workspace visual inventory | `w1_a_7_pbi_option_b_scoping.md` | pending |

**Monday operator script:** Health check report §11 (curl + gcloud + 3 SQL
queries, ~15 min).

---

## Phase 1 — Quick wins (S)

Dispatch when Phase 0 SQL (P0-1) clears or in parallel for items with
no SQL dependency.

| ID | Title | Acceptance | Deps | Status |
|----|-------|------------|------|--------|
| P1-1 | Remove stale Cloud Run traffic tags | Only `bastrop-tenant-fix` + latest remain | None | pending |
| P1-2 | Auth-gate `GET /api/feedback` | 401 without session | None | pending |
| P1-3 | Prophecy pop-out-first fallback UI | Usable `/prophecy` when iframe blocked | None | pending |
| P1-4 | Extend CSP `frameSrc` for Prophecy OAuth domains | `app.ts:117-125` updated | Vendor for full fix | pending |
| P1-5 | Cloud Scheduler job → thread-health check | `[thread-monitor]` logs in prod | None | pending |
| P1-6 | Log CompassQuickAsk to `compass_chat_logs` | `/api/ai/chat` writes logs | None | pending |
| P1-7 | Compass thumbs-down correction textarea | `correction` field POSTed | None | pending |
| P1-8 | Investigate `wo_manager_export` sync failure | `sync_health` row green | P0-1 | pending |
| P1-9 | Scrub `.replit` plaintext secrets | Fire 2 complete for Verkada/ESRI | Nick rotate | pending |

**Recommended dispatch batch:** P1-1 + P1-2 + P1-5 + P1-6 + P1-7 as one
cc-agent-M PR; P1-3 + P1-4 as Prophecy UX PR (hold P1-3 if vendor responds
first).

**Cross-audit items (no re-audit):**

- Compass feedback gaps: audit `1a9d0c9` — P1-6, P1-7, P2-4
- Prophecy embed: audit `2478a4e` — P1-3, P1-4

---

## Phase 2 — Integration restore (M)

| ID | Title | Acceptance | Deps | Status |
|----|-------|------------|------|--------|
| P2-1 | Bind Verkada secrets → smoke camera list | `/api/verkada/*` returns devices | P0-2 | pending |
| P2-2 | Bind ESRI/ArcGIS secrets → property intel green | Geocode + enrichment OK | P0-2 | pending |
| P2-3 | Bind `OPENGOV_TRANSPARENCY_KEY` | Transparency tables populate | Vendor portal | pending |
| P2-4 | Compass operator admin tab (feedback + thread-health) | Weekly review without SQL | None | pending |
| P2-5 | Persist conversation-insight gaps | DB table + list view | None | pending |
| P2-6 | PBI repoint to Jaime's live Dynamics/Dataverse CIP dataset | CIP tiles serve 28 live projects from the new dataset; output contract unchanged | None (dispatch ready) | **fire-ready** — [`_dispatches/2026-06-08_cc-agent-M_bastrop_cip_powerbi_repoint_dataverse.md`](_dispatches/2026-06-08_cc-agent-M_bastrop_cip_powerbi_repoint_dataverse.md) |
| P2-7 | Scheduler jobs for weather/FirstDue/enrichment OR document cache-on-request SLO | Stale data bounded | Arch decision | pending |
| P2-8 | Bind VFD portal codes (6) | VFD auth works | Bastrop fire chiefs | pending |

---

## Phase 3 — Platform foundation (L)

DB hold released 2026-06-06; this phase is no longer blocked. P3-2 and P3-4
now connect to the tenant leg ([`54_tenant_leg_sprint.md`](54_tenant_leg_sprint.md)).

| ID | Title | Blocks enhancement? |
|----|-------|---------------------|
| P3-1 | WS-1 Empressa Neon migration | Yes — multicity |
| P3-2 | WS-4 multitenancy + ADR-005 audit | Yes — Jarrell |
| P3-3 | Drizzle migrate adoption | Yes — schema velocity |
| P3-4 | Compass V4 / atom-backed context | No — additive |

**Tenant-leg dependencies (2026-06-07).** P3-2 ADR-005 audit verifies the
Layer B (storage) invariants of the portfolio multitenancy ADR
[`80_adrs/adr_005_multitenancy.md`](80_adrs/adr_005_multitenancy.md), not a
SmartCity-only spec. P3-4 atom-backed context is SmartCity reading substrate
atoms through the MCP gate as the Bastrop city tenant; it depends on the
tenant-leg gate work (gate tenant resolution, step 1 of 54) so SmartCity reads
as the city tenant rather than off its island data path. SmartCity-on-spine
onboarding is dispatched (QUEUED) at
[`_dispatches/2026-06-07_cc-agent-M_smartcity_tenant_onboarding.md`](_dispatches/2026-06-07_cc-agent-M_smartcity_tenant_onboarding.md).

---

## Done criteria

- [ ] Phase 0 SQL sample run; `wo_manager_export` root cause known (P1-8)
- [ ] Phase 1 items P1-1, P1-2, P1-5 shipped and deployed
- [ ] Compass feedback visible to operators (P2-4 or Phase 1 minimum)
- [ ] Prophecy page usable via pop-out OR vendor iframe fix landed
- [ ] Weekly operator script run once without agent assistance
- [ ] `10_ground_truth.md` production revision row updated

---

## Open questions for Nick

1. **`wo_manager_export`** — Is Cloud Scheduler `wo-manager-sync` hitting
   the scraper successfully?
2. **Thread-health on Cloud Run** — Intentional omission or oversight when
   crons moved to Scheduler?
3. **Traffic tag cleanup** — OK to remove all 7 zero-percent tags?
4. **Verkada / ESRI** — Still waiting on Bastrop IT, or deprioritized?
5. **Sprint scope** — Phase 1 only before Codex 1b / M-PropIntel, or include
   PBI Option B Phase 1?
6. **M-Stabilize hold** — Timeline to release for WS-1 Neon work?

---

## References

- Health check report: smartcity-os `_research/bastrop_platform_health_check_2026-06-01.md` (`3bc4eb8`)
- Prophecy audit: `2478a4e` · Compass audit: `1a9d0c9`
- Dispatch close: [`_dispatches/2026-06-01_cc-agent-M_bastrop_platform_health_check.md`](_dispatches/2026-06-01_cc-agent-M_bastrop_platform_health_check.md)
- Env audit: [`90_runbooks/smartcity_cloud_run_env_audit_2026-05-11.md`](90_runbooks/smartcity_cloud_run_env_audit_2026-05-11.md)
- M-Stabilize: [`30a_smartcity_stabilization_sprint.md`](30a_smartcity_stabilization_sprint.md)

## Revision history

- **2026-06-08:** P2-6 reframed from the abstract "PBI Option B Phase 1" to the concrete repoint of the CIP dashboard to Jaime's new live Dynamics/Dataverse dataset. Probed from the prod service principal 2026-06-08: the new `CIP_Projects_Database` (dataset `f86e76e6-26f6-43b2-86e6-0b3aaec72243`, report `8a4009f6-e5c9-4ccf-b1e2-66409158538a`) is reachable and returns 28 live projects; the old `POWERBI_CIP_DATASET_ID` is gone (404), which is why CIP tiles are empty. Fire-ready dispatch authored (`_dispatches/2026-06-08_cc-agent-M_bastrop_cip_powerbi_repoint_dataverse.md`): repoint secrets + rewrite `powerbi.ts` from `PowerBIDashboardTasks` to the `msdyn_project` Dataverse schema (real code change, output contract preserved). Self-contained; does not touch the WS-1 data path or the deferred deploy.
- **2026-06-07:** Phase 3 unblocked (DB hold released 2026-06-06). P3-2 ADR-005 audit repointed to the portfolio `adr_005_multitenancy.md` (Layer B); P3-4 atom-backed context tied to the tenant-leg gate work (SmartCity as city tenant); tenant-leg dependency note added; frontmatter `related` extended (54, adr_005_multitenancy).
- **2026-06-01:** Sprint filed from Bastrop platform health check recon
  (`3bc4eb8`). Phases 0–3 extracted from health report §10; traffic-light
  from §2.
