---
id: 2026-06-01_bastrop_holistic_planning_handoff
title: Session handoff — Bastrop health, holistic portfolio, shared engines
date: 2026-06-01
applies_to: portfolio
kind: handoff
related: [31a_bastrop_maintenance_sprint, 30a_smartcity_stabilization_sprint, 46_smartcity_parcel_intelligence, 47_codex_plan_review, 40d_cortex_site_context_sprint, 27_engine_evolution_plan, 80_adrs/adr_008_engine_factor_out, 00_current_state]
---

# Session handoff — Bastrop health, holistic portfolio, shared engines

**Filed:** 2026-06-01  
**From:** doc_repo planner (Cursor)  
**To:** Next planning agent  
**Re:** Bastrop maintenance catch-up, platform enhancements, Sylvia rain scenario, plan-review pilot, shared engine architecture

---

## 1. Conversation summary

This session moved from tactical Bastrop ops hygiene into strategic portfolio planning. It started with a paste-ready **Bastrop platform-wide health check** dispatch for cc-agent-M. That recon completed on `smartcity-os` (`3bc4eb8`, grade **YELLOW**). The planner filed [`31a_bastrop_maintenance_sprint.md`](../31a_bastrop_maintenance_sprint.md), dispatch close, inbox close, and cross-links in `00_current_state`, `30a`, and `10_ground_truth`.

The operator ran the public half of the Monday health script. Key finding: **`wo_manager_export` is a real fire** (Cloud Scheduler `wo-manager-sync` fails with Chromium lock timeout after 600s; morning-brief flags it), but the operator **cannot access production Neon** (Replit-managed DB quirk; migration is the fix). MyGov vs SmartCity surface sync looks fine to the operator. **P0-1 SQL and deep wo_manager triage are pinned** for the maintenance week, not blocking enhancement planning.

The conversation then shifted to **holistic portfolio view**: what is on the plate across SmartCity, Cortex, Hauska substrate, and commercial tracks; how close Bastrop is to **Sylvia's "4 inches of rain"** scenario; and what it would take for a **simple Bastrop plan-review pilot** (upload plan, get AI review) to engage staff in Codex scope conversations.

The session ended with a request to discuss **shared plan-review engine** and **shared property engine** across apps. That thread was opened conceptually (ADR-008, `hauska-engine`, one codebase / multiple surfaces) but **not yet filed as a canonical architecture doc**. The handoff below carries that forward.

---

## 2. What we covered (by topic)

### 2.1 Bastrop platform health check (complete)

| Item | Detail |
|------|--------|
| Report | `smartcity-os` `_research/bastrop_platform_health_check_2026-06-01.md` |
| Branch / SHA | `recon/bastrop-platform-health-check` / `3bc4eb8` |
| Grade | **YELLOW** |
| Production | `smartcity-api-00104-taw` @ 100% |
| Green | MyGov, Samsara, FirstDue, OpenGov BNP, Compass, calendar, API health, vitest 103/103 |
| Red | Prophecy embed (vendor), Verkada/ESRI unbound |
| Yellow | Thread-health cron off on Cloud Run; public `GET /api/feedback`; 7 stale traffic tags |
| Prior audits folded | Prophecy `2478a4e`, Compass `1a9d0c9` |

**Sprint backlog** extracted to [`31a_bastrop_maintenance_sprint.md`](../31a_bastrop_maintenance_sprint.md) Phases 0–3.

### 2.2 Operator constraints (important)

- **No Neon console access** for production SmartCity DB. Do not block planning on P0-1 SQL.
- **M-Stabilize on operator hold** (DB direct work). WS-1 Neon migration parallel-safe only after operator releases.
- **31a Phase 0–2** is parallel-safe with enhancement work; Phase 3 (Neon) is not.

### 2.3 wo_manager_export (pinned, not dropped)

| Evidence | Source |
|----------|--------|
| Morning-brief | `syncFailureNames: ["wo_manager_export"]`, 82 overdue WOs |
| Scheduler | `wo-manager-sync` status code 13, last attempt 2026-05-31 |
| Logs | `Chromium lock timeout: report-export waited 600s` (3 retries) |
| Likely fix | Stagger Scheduler jobs (S), not credential failure |

### 2.4 Holistic portfolio (as of 2026-06-01)

**Active engineering tracks:**

| Track | Status | Anchor doc |
|-------|--------|------------|
| Property Brief data wave | PR #134 gate, extension v0.6.x | `75_hauska_brokerage_workflow_plan.md` |
| Cortex prod QA | PR #127 merged, Grok briefing | `43_cortex_qa_backlog.md` |
| Cortex site context 40d | 2D.1 DEM worker shipped; 2D.2–2D.4 open | `40d_cortex_site_context_sprint.md` |
| Sync 5 TX ingest | ~8000+ central TX atoms, PRs open | cc-agent-E |
| Hauska substrate | MCP deployed; corpus growing | `51_substrate_v1_sprint.md`, `16_commercialization_roadmap.md` |
| Bastrop 31a maintenance | Filed, Phase 1 not dispatched | `31a_bastrop_maintenance_sprint.md` |
| M-Stabilize | On hold | `30a_smartcity_stabilization_sprint.md` |
| Codex 1b Bastrop live | Weeks away (A.3), gated on M-Stabilize | `11a_bastrop_live_roadmap.md` |

### 2.5 Sylvia's "4 inches of rain" (M-PropIntel)

Canonical use case in [`30_smartcity_os.md`](../30_smartcity_os.md) and [`46_smartcity_parcel_intelligence.md`](../46_smartcity_parcel_intelligence.md).

| Surface | Approx. distance to Sylvia-ready |
|---------|----------------------------------|
| SmartCity today | ~20–25% (weather/FirstDue yes; no hydrology query; ESRI dark) |
| Cortex 40d | ~45% (topography ingest done; drainage + rainfall sim spec'd, not built) |
| M-PropIntel milestone | ~2–4 weeks after 40d Phase 2D.2+2D.3 + ESRI bind + port to SmartCity |

**Critical path:** Finish Cortex `40d` 2D.2 (hydrology) + 2D.3 (rainfall presets 1/2/4/8 in) → bind ESRI on SmartCity → M-PropIntel scope sprint (jurisdiction-scoped parcel briefing + cross-parcel aggregation).

### 2.6 Bastrop plan-review pilot (conversation only, not filed)

**Goal:** Simple app for Sylvia/Jaime: load a plan, ingest, get a review. Testing + scope conversations, not full Codex 1b production.

**What already exists (legacy-design-tools / cortex-api):**

- `codex-reviewer-qa` artifact: engagement picker, Run Review, findings, adjudication, comment letter (CDX-3/4/5/9 merged)
- `POST /submissions/{id}/findings/generate` + Bastrop UDC in corpus (181 sections)
- **Engine does NOT vision-parse plan PDFs today** — findings run on jurisdiction + briefing + corpus + optional BIM, not sheet takeoffs

**Paths discussed:**

| Path | Effort | Use |
|------|--------|-----|
| 0 — Demo on existing codex-reviewer-qa | S (operator) | First conversation this week |
| 1 — "Bastrop Plan Review Pilot" wizard on cortex-api | 3–5 days cc-agent-C | **Recommended** for engagement |
| 2 — Tab inside smartcityos.io | +1–2 weeks cc-agent-M | After Path 1 validated |
| 3 — Full 11a A.3 Bastrop live | L–XL | Not for pilot |

**Framing for Bastrop:** "AI-assisted code review against Bastrop UDC with cited findings" — not "AI marks up every sheet like Bluebeam."

### 2.7 Shared plan-review + property engines (opened, not doc'd)

**Settled in ADR-008 and portfolio docs:**

- **Hauska Engine** is the shared commercial substrate name (factor-out to `hauska-engine` repo, gated on M-Stabilize Phase 2C).
- **One engine codebase** today in `legacy-design-tools` `api-server`; consumed by Cortex, Codex reviewer QA, future SmartCity.
- **`@hauska/atom-contract`** + **Hauska MCP Server** + **retrieval API** (`hauska-engine`) are the catalog/retrieval layer beneath product engines.

**Two logical engines (not two repos yet):**

| Engine | Primary jobs | Key outputs | Consumers |
|--------|--------------|-------------|-----------|
| **Property / parcel engine** | Geocode, site context adapters, briefing composition, constraint overlays, hydrology (40d) | `parcel-briefing`, `briefing-source`, `constraint-overlay`, site-topography/drainage atoms | Cortex, Property Brief extension, future SmartCity Parcel Intel, Codex CDX-6 |
| **Plan-review engine** | Code retrieval, full-pass findings, adjudication, comment letters | `finding`, `submission`, deliverable-letter atoms | Codex 1b, plan-review artifact, future SmartCity Plan Review |

**Overlap:** Plan review **consumes** parcel/briefing context via `resolveEngineInputs` (briefing narrative + retrieved `code-section` atoms). Property engine **feeds** plan review; they should not be duplicated per app.

**Not yet done:** Canonical doc `32_shared_engine_architecture.md` (or similar), API boundary sketch, dispatch for shared-engine extraction sprint.

### 2.8 Prior work in session (Prophecy, Compass)

| Topic | Status |
|-------|--------|
| Prophecy embed | Vendor messaged; iframe blocked (WorkOS CSP); pop-out on hold |
| Compass feedback audit | `1a9d0c9`; partial loop, no admin UI |
| Prophecy flow diagram | `_research/2026-06-01_prophecy_embed_flow_diagram.md` |

---

## 3. Decisions reached

| # | Decision | Owner | Reversal |
|---|----------|-------|----------|
| D1 | File Bastrop maintenance as **31a** sibling to 30a; Phase 0–2 parallel-safe | Planner | N/A |
| D2 | **Pin** P0-1 Neon SQL and deep wo_manager forensics; proceed with enhancement planning | Nick | When Neon access or migration lands |
| D3 | **Do not** require full M-Stabilize or 33 integration for a plan-review **pilot** | Planner | If pilot must be inside smartcityos.io only |
| D4 | Plan-review pilot should be framed as **code + context review**, not PDF markup (honest v0) | Planner | When sheet vision ingest ships |

**Not decided (route to next planner):**

- Path 1 vs Path 2 for plan-review pilot hosting
- Priority: 31a Phase 1 vs 40d 2D.2+2D.3 vs plan-review pilot vs Property Brief deploy
- Whether to author shared-engine architecture doc now
- Sequencing Parcel Intelligence vs Codex 1b for Bastrop (46 open question #1)

---

## 4. Open questions

| # | Question | Routing |
|---|----------|---------|
| Q1 | Plan-review pilot: standalone on cortex-api or inside SmartCity first? | Nick |
| Q2 | This week priority stack: maintenance 31a P1, 40d drainage/rain, plan-review pilot, Brief #134? | Nick |
| Q3 | Author `32_*` shared engine architecture doc and target API split? | Planner |
| Q4 | Traffic tag cleanup: OK to remove all 7 zero-percent tags? | Nick |
| Q5 | Prophecy: pop-out fallback now or wait for vendor? | Nick + vendor |
| Q6 | Parcel Intel vs Codex 1b sequencing for Bastrop (46 options 1–3) | Nick |

---

## 5. Artifacts produced this session (doc_repo)

| File | Purpose |
|------|---------|
| [`31a_bastrop_maintenance_sprint.md`](../31a_bastrop_maintenance_sprint.md) | Maintenance sprint Phases 0–3 |
| [`_dispatches/2026-06-01_cc-agent-M_bastrop_platform_health_check.md`](../_dispatches/2026-06-01_cc-agent-M_bastrop_platform_health_check.md) | Health check dispatch close |
| [`_inbox/2026-06-01_smartcity-os_cc-agent-M_bastrop_platform_health_check_close.md`](../_inbox/2026-06-01_smartcity-os_cc-agent-M_bastrop_platform_health_check_close.md) | Inbox close |
| [`00_current_state.md`](../00_current_state.md) | Bastrop maintenance section (2026-06-01) |
| [`30a_smartcity_stabilization_sprint.md`](../30a_smartcity_stabilization_sprint.md) | June catch-up cross-ref |
| [`10_ground_truth.md`](../10_ground_truth.md) | Revision `00104-taw`, YELLOW grade |

**smartcity-os (not in doc_repo):** `_research/bastrop_platform_health_check_2026-06-01.md` (`3bc4eb8`)

**Not filed:** P0-1 operator-wave dispatch, 31a Phase 1 execute dispatch, plan-review pilot dispatch, shared-engine architecture doc.

---

## 6. Recommended next actions for planning agent

1. **Nick priority call** on Q1–Q2 (pilot hosting + weekly stack).
2. If plan-review pilot wins: draft **`32a_bastrop_plan_review_pilot.md`** + cc-agent-C dispatch (Path 1 wizard).
3. If Sylvia rain wins: draft **40d 2D.2+2D.3** execute dispatch for cc-agent-C.
4. If maintenance wins: draft **31a Phase 1** batch dispatch for cc-agent-M.
5. If shared engines wins: draft **`32_shared_hauska_engines.md`** (property vs plan-review boundaries, hauska-engine packages, MCP tools).
6. Optional: decision record on Bastrop plan-review pilot scope (v0 honesty on PDF).

---

## 7. Handoff prompt (paste to next planning agent)

```markdown
# Planning session — Bastrop enhancements + shared engines

You are the **doc_repo planner** for the Empressa / Hauska / Legacy Group portfolio.
Work in `P:\doc_repo`. Read first: `00_current_state.md`, then this handoff:
`_research/2026-06-01_bastrop_holistic_planning_handoff.md`.

## Context you inherit

**Bastrop SmartCity** is live (YELLOW). Health check done (`smartcity-os` `3bc4eb8`).
Maintenance sprint filed at `31a_bastrop_maintenance_sprint.md`. M-Stabilize (`30a`)
is on **operator DB hold**; 31a Phase 0–2 does not need Neon.

**Operator constraints:**
- Cannot access production Neon (Replit quirk; WS-1 migration fixes later).
- P0-1 SQL and `wo_manager_export` deep triage are **pinned** (Chromium lock on
  scraper; Scheduler stagger is likely S fix). MyGov surface sync looks OK.

**Prior recons folded (do not re-audit):**
- Prophecy embed: `2478a4e`, vendor pending, diagram in `_research/2026-06-01_prophecy_embed_flow_diagram.md`
- Compass feedback: `1a9d0c9`, admin UI gap

## What Nick wants from this session

Pick up three threads from the prior planner session:

### Thread A — Shared engines architecture

Design (doc only unless Nick greenlights execute):

1. **Property / parcel engine** — geocode, site context, briefing, constraints,
   hydrology (40d), encumbrances (ADR-020/021). Outputs: `parcel-briefing`, layers,
   `constraint-resolution`.

2. **Plan-review engine** — code retrieval, findings generation, adjudication,
   comment letters. Outputs: `finding`, `submission`, deliverable letters.

3. How they compose: plan review consumes property context; one Hauska Engine
   repo (`hauska-engine` per ADR-008) vs two service APIs vs current monolith in
   `legacy-design-tools` api-server.

4. Per-app consumption matrix:

   | App | Property engine | Plan-review engine |
   |-----|-----------------|-------------------|
   | Cortex (design-tools) | Primary | Incremental / mirror |
   | Codex (codex-reviewer-qa) | Context input | Primary |
   | SmartCity OS | Parcel Intel (future) | Plan Review pilot (future) |
   | Property Brief extension | Brief API | Out of scope v0 |
   | Hauska MCP | `cortex/briefing_emit`, place tools | `codex/*` tools |

Deliverable: draft `32_shared_hauska_engines.md` (or ADR scaffold) with package
boundaries, API sketch, and migration phases from today's monolith.

Read: `80_adrs/adr_008_engine_factor_out.md`, `27_engine_evolution_plan.md`,
`40_design_accelerator.md` §Hauska Engine, `47_codex_plan_review.md` §four-layer stack,
`46_smartcity_parcel_intelligence.md`, `51_substrate_v1_sprint.md` retrieval-api.

### Thread B — Bastrop plan-review pilot

Scope a **minimal pilot** for Sylvia/Jaime: upload address + optional PDF →
AI findings against Bastrop UDC → accept/reject → draft comment letter.

**Honesty constraint:** v0 engine does NOT vision-parse plan PDFs; findings are
corpus + briefing + jurisdiction. Frame pilot accordingly.

Recommend Path 1 (cortex-api wizard, 3–5 days) vs Path 2 (smartcityos.io tab).
Draft `32a_bastrop_plan_review_pilot.md` + cc-agent-C dispatch if Nick confirms.

Existing code: `artifacts/codex-reviewer-qa`, `POST .../findings/generate`,
Bastrop UDC in hauska-engine corpus.

### Thread C — Sylvia "4 inches of rain" / M-PropIntel

Map distance to M-PropIntel milestone. Critical path is Cortex `40d` 2D.2+2D.3
then port to SmartCity + ESRI bind. Recommend whether to prioritize 40d over
plan-review pilot this week.

Read: `40d_cortex_site_context_sprint.md`, `46_smartcity_parcel_intelligence.md`,
`11_roadmap.md` M-PropIntel.

## Your first outputs

1. **Priority recommendation** (one table): what to do this week given one
   cc-agent-C and one cc-agent-M slot — rank 31a P1, 40d 2D.2–3, plan-review pilot,
   Brief #134 deploy support.

2. **Shared engines doc draft** (`32_shared_hauska_engines.md`) OR explicit defer
   with rationale.

3. **Paste-ready dispatch** for Nick's top pick only (one dispatch, not three).

## Out of scope

- Executing code or opening PRs
- Neon migration / M-Stabilize WS-1
- Re-auditing Prophecy or Compass
- Committing unless Nick says "commit"

## Acceptance

- Every recommendation cites a canonical doc or prior session artifact
- Clear "pilot is / is not" boundaries for plan review and property engines
- One actionable weekly plan Nick can approve in one read
```

---

## Revision history

- **2026-06-01:** Initial handoff from Bastrop holistic planning session.
