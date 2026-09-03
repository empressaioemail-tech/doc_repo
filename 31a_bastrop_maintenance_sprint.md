---
id: 31a_bastrop_maintenance_sprint
title: Bastrop maintenance sprint — platform health catch-up
status: superseded
last_updated: 2026-09-02 (status flip only; body untouched — superseded by the no-touch ruling on smartcity-os)
applies_to: smartcity-os
related: [30a_smartcity_stabilization_sprint, 30_smartcity_os, 10_ground_truth, 11_roadmap, 54_tenant_leg_sprint, 80_adrs/adr_005_multitenancy, 90_runbooks/smartcity_cloud_run_env_audit_2026-05-11, 90_runbooks/cloud_run_canary_deploy]
---

# Bastrop maintenance sprint — platform health catch-up

> **SUPERSEDED 2026-09-02.** `smartcity-os` (live Bastrop) is now under an absolute no-touch ruling (`_catalog/repo_intents.md`) until a named Bastrop-cutover WDLL runs — an independent maintenance sprint on that repo is no longer a valid work path. See `90_operations/OPS-17_govtech_stack_plan_of_record.md` for current state. Retained per convention (status flip, not delete) — do not execute anything below this line.

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

Prophecy embed **RESOLVED 2026-06-08** (was vendor hold). ProphecyGov
(Ashkon) shipped the allowlist + `SameSite=None; Secure` cookie fix; live
header verification plus an operator browser test confirm the embedded chat
loads via pop-out login. Cold in-iframe login is structurally impossible
(WorkOS hosted auth sets `frame-ancestors 'self'` / `X-Frame-Options:
SAMEORIGIN` on `api.workos.com`, unchangeable by ProphecyGov) - pop-out is
the supported pattern. Verified state: [`_research/2026-06-01_prophecy_embed_flow_diagram.md`](_research/2026-06-01_prophecy_embed_flow_diagram.md).

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
| Prophecy | Green | RESOLVED 2026-06-08 - embed works via pop-out login (vendor fix landed + verified) |
| Verkada / ESRI | Red -> bind dispatched | Creds in operator hand 2026-06-10 (P0-2 cleared); bind + smoke dispatched (P2-1/P2-2) |
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
| P0-2 | Bastrop IT: Verkada + ESRI credential handoff for Cloud Run bind | Env audit still open | **CLEARED 2026-06-10** - operator has the Verkada + ESRI creds; unblocks P2-1/P2-2 (bind dispatched) |
| P0-3 | Prophecy vendor response on allowlist | Audit `2478a4e` | **DONE 2026-06-08** - Ashkon shipped `prophecygov.com` frame-ancestors allowlist + `SameSite=None` cookies; embed verified working via pop-out |
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
| P1-3 | Prophecy pop-out-first UI | Usable `/prophecy` via pop-out login | None | mechanism VERIFIED working 2026-06-08; only the polished "log in to Prophecy" button UX remains (deploy-pending, bundle with the PBI/`smartcity-api` deploy) |
| P1-4 | Extend CSP `frameSrc` for Prophecy OAuth domains | `app.ts:117-125` | None | **NOT NEEDED** - deployed `frame-src` already allows `prophecygov.com`; adding `api.workos.com` is pointless (WorkOS sets `frame-ancestors 'self'`, blocks the frame regardless). Closed as wontfix. |
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
| P2-1 | Bind Verkada secrets → smoke camera list | `/api/verkada/*` returns devices | P0-2 cleared | **READY - dispatched** [`2026-06-10_cc-agent-M_verkada_esri_credential_bind`](_dispatches/2026-06-10_cc-agent-M_verkada_esri_credential_bind.md) |
| P2-2 | Bind ESRI/ArcGIS secrets → property intel green | Geocode + enrichment OK | P0-2 cleared | **READY - dispatched** (same dispatch as P2-1) |
| P2-3 | Bind `OPENGOV_TRANSPARENCY_KEY` | Transparency tables populate | Vendor portal | pending |
| P2-4 | Compass operator admin tab (feedback + thread-health) | Weekly review without SQL | None | pending |
| P2-5 | Persist conversation-insight gaps | DB table + list view | None | pending |
| P2-6 | PBI repoint to Jaime's live Dynamics/Dataverse CIP dataset | CIP tiles serve 28 live projects from the new dataset; output contract unchanged | None | **DONE + DEPLOYED 2026-06-10** - PR [#23](https://github.com/empressaioemail-tech/smartcity-os/pull/23) merged (`24fd7e5`) + frontend `ReportEmbed` SDK-lifecycle fix (`f2bd0b4`); live on revision **`smartcity-api-00111-zes`** (clean canary rebuild, image digest `787a4e69`) serving 100%. Secrets repointed (v3/v4); `powerbi.ts` remapped to `msdyn_projecttask` summary phases joined to `msdyn_project`; 28 projects verified live (Agnes St 0.83, WWTP#4 0.46). Bastrop operator testing in browser 2026-06-10. Follow-up: duplicate project names disambiguated with GUID suffix (flag to Jaime if another label preferred). Reports: [`_inbox/2026-06-08_...repoint.md`](_inbox/2026-06-08_smartcity-os_cc-agent-M_bastrop_cip_powerbi_repoint.md), [`_inbox/2026-06-10_...deploy_close.md`](_inbox/2026-06-10_smartcity-os_cc-agent-M_bastrop_cip_deploy_close.md). |
| P2-7 | Scheduler jobs for weather/FirstDue/enrichment OR document cache-on-request SLO | Stale data bounded | Arch decision | pending |
| P2-8 | Bind VFD portal codes (6) | VFD auth works | Bastrop fire chiefs | pending |
| P2-9 | BeWith calendar feed address enrichment | Bastrop meeting events carry venue address; BeWith feed emits `LOCATION`/`location` end to end | None (public-tier) | **READY - dispatched** [`2026-06-10_cc-agent-M_bewith_calendar_address_enrichment`](_dispatches/2026-06-10_cc-agent-M_bewith_calendar_address_enrichment.md). Recon-first: Municode listing carries no address (verified live 2026-06-10), so derive via body->venue map from agenda headers; confirm BeWith feed path (public `/api/calendar/events/public` vs env-keyed `CALENDAR_API_KEY`) + the location field BeWith reads. |

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
- [x] Prophecy page usable via pop-out OR vendor iframe fix landed (RESOLVED 2026-06-08 - pop-out works, vendor fix landed + verified)
- [ ] Weekly operator script run once without agent assistance
- [ ] `10_ground_truth.md` production revision row updated

---

## Open questions for Nick

1. **`wo_manager_export`** — Is Cloud Scheduler `wo-manager-sync` hitting
   the scraper successfully?
2. **Thread-health on Cloud Run** — Intentional omission or oversight when
   crons moved to Scheduler?
3. **Traffic tag cleanup** — OK to remove all 7 zero-percent tags?
4. ~~**Verkada / ESRI** — Still waiting on Bastrop IT, or deprioritized?~~ RESOLVED 2026-06-10 - operator has the creds; bind + smoke dispatched (P2-1/P2-2).
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

- **2026-06-10 (CIP deployed; Verkada/ESRI unblocked; BeWith added):** P2-6 flipped DONE -> DONE + DEPLOYED - PR #23 merged plus the frontend `ReportEmbed` SDK-lifecycle fix, live on revision `smartcity-api-00111-zes` after a clean canary rebuild (an earlier direct-form attempt left `00095-r6p`; the agent close note records that stale revision - superseded by `00111-zes`). P0-2 CLEARED: operator now holds the Verkada + ESRI credentials, unblocking P2-1 + P2-2, dispatched as `2026-06-10_cc-agent-M_verkada_esri_credential_bind.md` (config-first secret bind + smoke). New item P2-9 added - BeWith calendar feed address enrichment (public-tier partner feed), dispatched as `2026-06-10_cc-agent-M_bewith_calendar_address_enrichment.md`; recon-first because the Municode listing carries no address (verified live). Open question #4 resolved. `last_updated` bumped.
- **2026-06-08 (Prophecy resolved):** Prophecy embed marked off - was Red/vendor-hold for weeks. ProphecyGov shipped the `prophecygov.com` frame-ancestors allowlist (`smartcityos.io` + www + wildcards) and `SameSite=None; Secure` session cookies; live header verification + operator browser test confirm the embedded chat loads via pop-out login. Cold in-iframe login ruled out permanently (WorkOS `api.workos.com` sets `frame-ancestors 'self'`/`X-Frame-Options: SAMEORIGIN`, unchangeable by the vendor). P0-3 done, P1-3 mechanism verified (only the pop-out button UX remains, deploy-pending), P1-4 closed wontfix (our `frame-src` already allows `prophecygov.com`; framing `api.workos.com` is futile). Done-criterion met. Traffic-light Prophecy Red -> Green.
- **2026-06-08:** P2-6 reframed from the abstract "PBI Option B Phase 1" to the concrete repoint of the CIP dashboard to Jaime's new live Dynamics/Dataverse dataset. Probed from the prod service principal 2026-06-08: the new `CIP_Projects_Database` (dataset `f86e76e6-26f6-43b2-86e6-0b3aaec72243`, report `8a4009f6-e5c9-4ccf-b1e2-66409158538a`) is reachable and returns 28 live projects; the old `POWERBI_CIP_DATASET_ID` is gone (404), which is why CIP tiles are empty. Fire-ready dispatch authored (`_dispatches/2026-06-08_cc-agent-M_bastrop_cip_powerbi_repoint_dataverse.md`): repoint secrets + rewrite `powerbi.ts` from `PowerBIDashboardTasks` to the `msdyn_project` Dataverse schema (real code change, output contract preserved). Self-contained; does not touch the WS-1 data path or the deferred deploy.
- **2026-06-07:** Phase 3 unblocked (DB hold released 2026-06-06). P3-2 ADR-005 audit repointed to the portfolio `adr_005_multitenancy.md` (Layer B); P3-4 atom-backed context tied to the tenant-leg gate work (SmartCity as city tenant); tenant-leg dependency note added; frontmatter `related` extended (54, adr_005_multitenancy).
- **2026-06-01:** Sprint filed from Bastrop platform health check recon
  (`3bc4eb8`). Phases 0–3 extracted from health report §10; traffic-light
  from §2.
