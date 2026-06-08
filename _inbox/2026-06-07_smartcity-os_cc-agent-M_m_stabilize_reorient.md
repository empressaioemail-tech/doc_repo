---
id: 2026-06-07_smartcity-os_cc-agent-M_m_stabilize_reorient
title: M-Stabilize restart — Step 1 re-orientation (cc-agent-M)
date: 2026-06-07
agent: cc-agent-M
repo: smartcity-os
kind: inbox-session
related: [30a_smartcity_stabilization_sprint, 00_current_state, 20_agent_operating_rules, 2026-05-21_cc-agent-M_m_stabilize_restart, 2026-06-06_smartcity-os_cc-agent-M_precondition_probe]
---

# M-Stabilize restart — Step 1 re-orientation

**Dispatch:** [`_dispatches/2026-05-21_cc-agent-M_m_stabilize_restart.md`](../_dispatches/2026-05-21_cc-agent-M_m_stabilize_restart.md)  
**Agent:** cc-agent-M  
**Repo clone:** `P:\empressaio_tech_smartcity_os` (GitHub `empressaioemail-tech/smartcity-os`)  
**Posture:** Operator-supervised; open PRs for review; no self-deploy to production.

---

## Executive summary

M-Stabilize restart re-orientation complete. Operator hold is released (2026-06-06). Production matches docs: `smartcity-api-00104-taw` @ 100%. Local clone is on `main` @ `62dbf28`, synced with `origin/main`. WS-1 / WS-3 / WS-4 scoping **still holds** with minor documented drift (line numbers, region wording, stale cross-cutting prereq). No sprint work has landed on `origin/main` since the operator hold (2026-05-21); only calendar tenant-id fix PR #20 merged 2026-05-19.

**Recommendation:** Proceed to Step 2 — WS-1 Phase 2A.0 prereqs (`post-merge.sh` findings doc, migration prefix collision resolution). WS-3 and WS-4 remain sequenced after WS-1 per dispatch.

---

## Verbatim verification artifacts (HR-1 / HR-8)

### `git log --oneline origin/main -20`

```
62dbf28 fix(calendar): BASTROP_TENANT_ID 1 -> 2 to match prod tenant identity rule (#20)
d42edcb fix(powerbi): drop workspace qualifier from DAX executeQueries URL for cross-workspace dataset access (#19)
b077804 fix(calendar): iCal DTSTART/DTEND NaN in eventsToICal (#18)
7db0e5a fix(calendar): point widget links to Bastrop microsite + persistent LKG for iCal feed (#17)
ad4fad1 fix(calendar): parseDate/parseLocalDate tolerate Municode T-component isoDate (#16)
fd26487 fix(calendar): predicate B — apply F-3 parse pattern to ai-assistant context snapshot (#15)
0d033bd chore: rename AI_INTEGRATIONS_* env reads to canonical SDK names (#14)
04b296e docs(research): W1.A.7 PBI Option B scoping (#13)
86a90ff fix(calendar): W1.A.6 batch — F-1 public endpoint, F-3 TZ, F-4 VTIMEZONE, F-5 Municode await, F-6 boot canary (#12)
5b9815e fix(spireon): W1.A.8 batch — F-2 mapDepartment, F-3 active flag, F-4 retry+LKG, F-8 disappearance log (#11)
9768c23 docs(research): W1.C.1 Prophecy design spec (Replit Agent authored, manual commit per SR-1)
985dee4 fix(prophecy): W1.C.1 align Prophecy page with platform design system (#10)
93e4da5 chore(secrets): remove Spireon credentials from .replit + redact troubleshooting doc (Fire 2 internal)
ad0cbf7 docs(research): W1.A.8 police units Spireon findings
8402e66 fix(security): W1.C.2 CSP frame-src allowlist + WS-3 remove x-internal-ai from CORS (#9)
281126a fix(opengov): W1.C.3 BNP endpoint hardening (retries, circuit breaker, structured logging) (#8)
01fa14e chore(secrets): remove CALENDAR_API_KEY from .replit (Fire 2 internal)
f3c06f1 docs(research): W1.A.6 calendar event visibility findings
6d020d4 docs(research): W1.A.7 Power BI accuracy findings
5d126d0 docs(research): W1.A.9 health-watch email forensics + design
```

### `gh pr list --repo empressaioemail-tech/smartcity-os --state all --limit 20`

```
20	fix(calendar): BASTROP_TENANT_ID 1 -> 2 to match prod tenant identity rule	fix/calendar-bastrop-tenant-id-2	MERGED	2026-05-19T15:36:31Z
19	fix(powerbi): drop workspace qualifier from DAX executeQueries URL for cross-workspace dataset access	fix/powerbi-dax-cross-workspace	MERGED	2026-05-18T18:44:54Z
18	fix(calendar): iCal DTSTART/DTEND NaN in eventsToICal	fix/ical-dtstart-dtend-nan	MERGED	2026-05-18T15:36:23Z
17	fix(calendar): point widget links to Bastrop microsite + persistent LKG for iCal feed	fix/municode-url-bastrop-microsite	MERGED	2026-05-15T17:39:22Z
16	fix(calendar): parseDate/parseLocalDate tolerate Municode T-component isoDate	fix/calendar-parsedate-t-component	MERGED	2026-05-11T22:26:45Z
15	fix(calendar): predicate B + 00:01-boundary regression tests	fix/calendar-predicate-b-and-regression-tests	MERGED	2026-05-11T22:01:12Z
14	chore: drop AI_INTEGRATIONS_ prefix from env reads	chore/drop-ai-integrations-prefix	MERGED	2026-05-11T21:24:32Z
13	docs(research): W1.A.7 PBI Option B scoping	docs/w1-a-7-pbi-option-b-scoping	MERGED	2026-05-11T18:13:05Z
12	fix(calendar): W1.A.6 batch — F-1 public endpoint, F-3 TZ, F-4 VTIMEZONE, F-5 Municode await, F-6 boot canary	fix/w1-a-6-calendar-batch	MERGED	2026-05-11T16:54:09Z
11	fix(spireon): W1.A.8 batch — F-2 mapDepartment, F-3 active flag, F-4 retry+LKG, F-8 disappearance log	fix/w1-a-8-spireon-batch	MERGED	2026-05-11T16:21:49Z
10	fix(prophecy): W1.C.1 design-system alignment	fix/w1-c-1-prophecy-look-and-feel	MERGED	2026-05-11T02:20:40Z
9	fix(security): CSP frame-src + remove x-internal-ai CORS	fix/w1-c-2-csp-and-cors	MERGED	2026-05-11T02:07:12Z
8	fix(opengov): W1.C.3 BNP hardening	fix/w1-c-3-opengov-bnp-hardening	MERGED	2026-05-11T01:45:44Z
7	chore(repl): neutralize .replit + scripts/post-merge.sh with loud-fail (Fire 4)	chore/fire-4-replit-deployment-neutralization	MERGED	2026-05-10T15:14:33Z
6	fix(auth): gate x-internal-ai bypass on loopback (Fire 1, W1.C.4a)	fix/fire-1-w1-c-4a-auth-bypass	MERGED	2026-05-10T01:20:24Z
5	chore(deps): sync package-lock.json with package.json	chore/lockfile-sync-bufferutil	MERGED	2026-05-03T23:18:41Z
4	feat(nav): add Prophecy to SmartCityLayout top navigation	feature/p0-followup-prophecy-nav	MERGED	2026-05-03T22:48:50Z
3	test(safety-net): initial coverage for auth, health, focus-metrics, report-resolver	feature/p0-2-test-safety-net	CLOSED	2026-05-03T17:28:09Z
2	feat(cloud-run): build and serve static client; extend timeout for long-lived sessions	feature/p0-3-cloud-run-static	CLOSED	2026-05-03T17:22:22Z
1	ci(dast): grant issues:write for ZAP findings	ci/dast-issues-write-permission	OPEN	2026-04-20T13:39:10Z
```

### Cloud Run production revision (`gcloud run services describe smartcity-api`)

```
status:
  latestReadyRevisionName: smartcity-api-00104-taw
  traffic:
  - revisionName: smartcity-api-00080-men
    tag: p0-3-canary
  - revisionName: smartcity-api-00082-pog
    tag: p0-followup-prophecy
  - revisionName: smartcity-api-00084-weg
    tag: w1-c-4a-auth-fix
  - revisionName: smartcity-api-00096-jig
    tag: pbi-ai-cal-20260511
  - revisionName: smartcity-api-00099-vip
    tag: lkg-20260515-1848
  - revisionName: smartcity-api-00101-nir
    tag: ical-nan-fix-20260518
  - revisionName: smartcity-api-00103-tur
    tag: pbi-dax-workspace-fix-20260518
  - latestRevision: true
    percent: 100
    revisionName: smartcity-api-00104-taw
    tag: bastrop-tenant-fix
```

**Verdict:** `00_current_state.md` and `30a` production claims **confirmed**. `smartcity-api-00104-taw` @ 100%, tag `bastrop-tenant-fix`, commit `62dbf28` (PR #20).

---

## Sprint state (`30a`)

| Workstream | Status | Notes |
|---|---|---|
| WS-2 (W1 sprint) | **verified** | All seven items shipped 2026-05-11 |
| WS-1 (migration spine) | **pending** | Operator hold released; Empressa Neon target provisioned; Phase 2A.0–3 untouched |
| WS-3 (security sweep) | **pending** | Partial: CORS item done via PR #9; remainder open |
| WS-4 (schema / multi-tenancy) | **pending** | ADR-005 not migrated; audits not started |
| Phase 0 cross-cutting | **mixed** | Clone refresh ✅; gcloud SSL, ADR-005, Replit rename still Nick/planner |

**Activity gap:** No `origin/main` commits after 2026-05-19 (PR #20). Ten-plus days of sprint backlog with no M-Stabilize execution — matches dispatch premise.

**Operator prereqs cleared (2026-06-06 probe):**
- Empressa Neon project `tiny-art-63602898`, region `us-east-2`, PG 18
- Secret `smartcity-EMPRESSA_DATABASE_URL` on `smartcity-os-prod` (verified present)
- Source `smartcity-DATABASE_URL` still Replit-managed Neon (cutover not started)

---

## Local clone state

```
Branch: main @ 62dbf28
Sync: main...origin/main (clean, no ahead/behind)
```

Cross-cutting prereq "clone refresh" from `30a` is **now satisfied** (was stale from 2026-05-10 state citing `chore/fire-4-replit-deployment-neutralization`).

**Local-only noise (non-blocking):**
- 7 untracked audit/report markdown files in repo root
- 3 unpushed recon branches: `recon/bastrop-platform-health-check` (`3bc4eb8`), `recon/compass-feedback-audit`, `recon/prophecy-integration-audit` — research docs not on `origin/main`

---

## WS-1 scoping validation — holds with expected artifacts

| 30a item | Repo reality | Drift? |
|---|---|---|
| Migration prefix collisions (`0003_*`, `0004_*`) | Present: `0003_curious_hammerhead.sql` + `0003_mygov_schema_sync.sql`; `0004_premium_gambit.sql` + `0004_enrichment_expanded_columns.sql` | No — unresolved as expected |
| `_journal.json` ordering | Tracks Drizzle tags `0000`–`0005` only; hand-authored `0003_mygov`, `0004_enrichment`, `0005_inspection_geocoding`, `0006_fleet_samsara_expansion` **not** in journal | No — Phase 2A.0 work |
| `scripts/post-merge.sh` neutralized | Early `exit 1` + preserved original below delimiter | No |
| `drizzle.config.ts` | Present; `db:push` only, no `migrate` script | No — Phase 3 |
| Empressa Neon target | `smartcity-EMPRESSA_DATABASE_URL` secret exists | No |
| Region | 30a goal line still says `us-central1`; status tracking corrected to `us-east-2` (Neon has no GCP region) | **Doc wording drift** — status tracking is authoritative |
| ~106 public tables | Not re-counted this session; premise from precondition probe stands | Defer to Phase 2A recon |

---

## WS-3 scoping validation — partial completion

| 30a item | Repo reality | Status |
|---|---|---|
| Remove `x-internal-ai` from CORS (`server/app.ts:85`) | `allowedHeaders` = `Content-Type`, `Authorization`, `x-tenant-id` only | **Done** (PR #9) |
| Remove stale `x-internal-ai: 1` emit (`ai-assistant.ts`) | Still present at line **4248** (doc cites 4212 — line drift) | **Open** |
| Auth middleware vitest (loopback predicate regression) | No dedicated test; only incidental use in `calendar-public.test.ts` | **Open** |
| Semgrep `nosemgrep` on `mygov.ts:269` | Metadata server fetch at lines 268–270; no annotation; CI FP persists | **Open** |
| Fire 2 internal: `Admin123!` literals | Still in `.replit` (`ADMIN_RESET_PASSWORD`, `USER_RESET_PASSWORD`, `BASTROP_BOOTSTRAP_PASSWORD`) | **Open** |
| Fire 2 internal: `USER_RESET_EMAIL` PII | Still in `.replit` | **Open** |
| Fire 2 internal: `POWERBI_REPORT_ID` | Still in `.replit` (public identifier per audit docs — move decision pending) | **Open** |

**Net:** WS-3 scope unchanged; one of six item clusters partially closed.

---

## WS-4 scoping validation — holds

| 30a item | Repo reality | Status |
|---|---|---|
| ADR-005 migration to `80_adrs/adr_005_smartcity_multitenancy.md` | File does not exist in doc_repo | **Open** |
| MyGov raw-records growth audit | No `_research/ws4_mygov_raw_records_growth.md` | **Open** |
| `mygov_work_orders` dedup | Coordinated with WS-1 Phase 2A | **Open** |
| Multi-tenancy invariant verification | Post-Phase-2C gate | **Blocked on WS-1** |
| `typecheck` baseline → zero | Not run this session | **Open** |
| Lockfile drift root cause | Not re-audited | **Open** |
| ADR-006 schema framework | Slot open; WS-1 Phase 3 | **Open** |

---

## Drift flags (action before or during Step 2)

1. **30a cross-cutting prereq stale:** "clone refresh" checkbox should flip — local is on `main` @ `62dbf28`.
2. **30a region wording:** WS-1 goal paragraph still references `us-central1`; operative target is `us-east-2` per 2026-06-06 status entry.
3. **Line-number drift:** `ai-assistant.ts` stale header at 4248 not 4212; Semgrep target is `mygov.ts:268-270`.
4. **Journaling slip confirmed:** `0006_fleet_samsara_expansion.sql` on disk, not in `_journal.json` — Phase 2A.0 reconciliation scope.
5. **Unpushed recon branches:** Bastrop/Compass/Prophecy health audits exist locally only; consider pushing or folding into 31a before they rot.

---

## Decisions / next session

**Cleared to proceed:** Step 2 — WS-1 migration spine, starting Phase 2A.0:
1. `post-merge.sh` read-only findings doc (1-page)
2. Migration prefix collision resolution + `_journal.json` reconcile (include `0005_inspection_geocoding`, `0006_fleet_samsara_expansion`)
3. gcloud SSL — Nick-only; Cloud Shell workaround remains valid

**Not yet:** Phase 2A schema sync (needs 2A.0 gate + operator window for 2B/2C later).

**Workspace:** cc-agent-M owns `P:\empressaio_tech_smartcity_os` for this dispatch.

---

## References consulted

- `30a_smartcity_stabilization_sprint.md` (full read)
- `00_current_state.md` (Bastrop / M-Stabilize section)
- `20_agent_operating_rules.md` (HR-1, HR-8, HR-11)
- `_inbox/2026-06-06_smartcity-os_cc-agent-M_precondition_probe.md`
