---
id: 75c_property_brief_data_backlog
title: Property Brief — Central TX data completeness backlog (scored)
status: active
last_updated: 2026-05-29
applies_to: portfolio
related: [75_hauska_brokerage_workflow_plan, 75b_brief_coverage_v0, 77_place_graph_strategy, 49b_encumbrance_ingestion_pipeline, 73_partnerships, 2026-05-28_central-tx-property-brief-scope]
owner: planner
---

# Property Brief — Central TX data completeness backlog (scored)

> **Purpose.** Prioritized backlog to make the Property Brief offer **flush with cited intelligence** for the Central Texas pilot (eXp / Valerie corridor). Scored by **broker-visible impact** vs **effort**, aligned to the six place-graph planes in [`77_place_graph_strategy.md`](77_place_graph_strategy.md).
>
> **Execution wave:** 2026-05-29. Nick handles **partner channels tomorrow** (General Code / eCode360, ICC, county clerk). Planner + cc-agents execute **non-partner** items today where possible.

## Scoring

| Field | Scale |
|-------|--------|
| **Impact** | 1–5 — how much a broker sees in brief quality (Valerie demo) |
| **Effort** | 1–5 — 1 = hours, 5 = multi-month partnership |
| **Priority** | `Impact × 2 − Effort` (higher = sooner) |
| **Lane** | `today-agent` · `today-operator` · `partner` · `queued` |

**Planes:** A public law · B private (HOA/CC&R) · C parcel economics · D physical/env · E operational · F market (deferred) · V vertical (minerals)

---

## P0 — Execute this week (no new partnerships)

| ID | Item | Plane | Impact | Effort | Pri | Lane | Owner | Status |
|----|------|-------|--------|--------|-----|------|-------|--------|
| PB-001 | **Neon warmup — pilot demo cities** (`round_rock_tx`, `georgetown_tx`, `new_braunfels_tx`, `austin_tx`, `hutto_tx`, `leander_tx`) | A | 5 | 2 | 8 | today-operator | Nick + cc-agent-E | JSONL ready; automate via [`90_runbooks/property_brief_neon_warmup.ps1`](90_runbooks/property_brief_neon_warmup.ps1) after E ships `load-neon-warmup-pilot` + `embed-neon-warmup-pilot` |
| PB-002 | **Merge + deploy PR #134** (place snapshots, atoms, coverage API) | all | 5 | 2 | 8 | today-operator | Nick | PR #134 **fix in flight** (2026-05-29); merge when CI green → `0030` + deploy runbook |
| PB-003 | **Federal layers on `/brief`** — USGS, USDA, USFWS, EPA (reuse engagement adapters) | D | 4 | 2 | 6 | today-agent | cc-agent-C | Dispatch filed 2026-05-29 |
| PB-004 | **Prod `REGRID_API_KEY` + FEMA smoke** on `/brief` | C/D | 4 | 1 | 7 | today-operator | Nick | Per [`property_brief_cortex_deploy.md`](90_runbooks/property_brief_cortex_deploy.md) |
| PB-005 | **`BRIEF_CODE_RETRIEVAL=mcp`** wire + smoke (substrate search) | A | 4 | 2 | 6 | today-agent | cc-agent-C | Env gate exists; MCP client pending |
| PB-006 | **Richer Regrid in snapshots** — full Premium payload in `formatSiteContextForLlm` | C | 3 | 2 | 4 | today-agent | cc-agent-C | Wave 1.3 in central-tx scope |
| PB-007 | **CAD legal description on workspace** — Travis/Williamson/Hays parcel join | C/G0 | 4 | 3 | 5 | queued | cc-agent-C | Needs CAD API or Regrid field map |
| PB-008 | **TCEQ Edwards Aquifer** adapter on brief path | D | 4 | 3 | 5 | today-agent | cc-agent-C | TX-specific; public API research in dispatch |
| PB-009 | **Extension waves 7a–7c** — parcel panel + inline atom chips | UX | 4 | 2 | 6 | today-agent | extension-agent | **v0.5.2** shipped (inbox close); prod validate after PB-002 deploy |

---

## P1 — Partner-dependent (Nick outreach 2026-05-30+)

| ID | Item | Plane | Impact | Effort | Pri | Lane | Counterparty | Ask summary |
|----|------|-------|--------|--------|-----|------|--------------|-------------|
| PB-101 | **General Code / eCode360 integrator deal** | A | 5 | 4 | 6 | partner | General Code | TOC + content API, atomize + MCP rights, change notifications; unlocks Kyle, Buda, Pflugerville, Cedar Park, Smithville, McAllen, Dallas city track |
| PB-102 | **ICC Layer 1 ingest** | A | 5 | 3 | 7 | partner | ICC | Code Connect API creds + agent metering rev-share pitch ([`73_partnerships.md`](73_partnerships.md)) |
| PB-103 | **County clerk — recorded restrictions index** | B/V | 5 | 4 | 6 | partner | Bastrop / Travis / Williamson clerk | Legal-description instrument search API or bulk; minerals + deed restrictions |
| PB-104 | **Bastrop operational precedent on place node** | E | 4 | 3 | 5 | partner | Bastrop (Sylvia) | Permits + staff findings via MOU; Plane E only on `property-workspace` |
| PB-105 | **HOA / mgmt co — one pilot subdivision** | B | 4 | 4 | 4 | partner | HOA mgmt (TBD) | CC&R corpus for one master-planned community (Williamson or Hays) |
| PB-106 | **American Legal Publishing** | A | 3 | 4 | 2 | partner | AmLegal | Harker Heights + Dallas-class cities |
| PB-107 | **Fort Worth city publisher recon** | A | 4 | 4 | 4 | partner | FW + Sylvia | Strategic DFW anchor ([`73_partnerships.md`](73_partnerships.md)) |

Talking points: [`90_runbooks/partner_outreach_brief_wave.md`](90_runbooks/partner_outreach_brief_wave.md).

---

## P2 — Engine ingest / corpus factory (cc-agent-E)

| ID | Item | Plane | Impact | Effort | Pri | Lane | Owner | Notes |
|----|------|-------|--------|--------|-----|------|-------|-------|
| PB-201 | **San Marcos, Temple** Municode ingest | A | 3 | 2 | 4 | today-agent | cc-agent-E | Path C confirmed; not in 34-key snapshot |
| PB-202 | **Lakeway Path PDF** proof + ingest | A | 3 | 3 | 3 | today-agent | cc-agent-E | City-hosted PDF candidate |
| PB-203 | **`tocRootNodeIds` adapter fix** — Luling, Woodcreek, Belton, Creedmoor | A | 2 | 2 | 2 | today-agent | cc-agent-E | Partial corpus today |
| PB-204 | **Plano / Frisco / McKinney** publisher recon + ingest | A | 4 | 4 | 4 | partner+agent | cc-agent-E | Not in engine snapshot |
| PB-205 | **ICC NFPA fire code plane** (distinct atoms) | A | 3 | 3 | 3 | partner | cc-agent-E | After PB-102 |
| PB-206 | **County UDC** — Williamson/Hays unincorporated | A | 3 | 3 | 3 | queued | cc-agent-E | Bastrop County pattern (17 atoms) |

---

## P3 — Private law + minerals (product + partnership)

| ID | Item | Plane | Impact | Effort | Pri | Lane | Owner | Notes |
|----|------|-------|--------|--------|-----|------|-------|-------|
| PB-301 | **Encumbrance R4 in brief UX** — upload CC&R / title PDF on extension | B | 5 | 2 | 8 | today-agent | cc-agent-C | Code on branch; not in PR #134 slice |
| PB-302 | **One subdivision `restriction-corpus`** | B | 5 | 3 | 7 | partner | cc-agent-E + planner | Pick pilot HOA community ([`49b`](49b_encumbrance_ingestion_pipeline.md) open Q1) |
| PB-303 | **Mineral index pilot county** | V | 4 | 4 | 4 | partner | Nick | PG-3: Montgomery vs appraisal-driven |
| PB-304 | **Texas RRC wells/pipelines** public layer | V/D | 3 | 2 | 4 | today-agent | cc-agent-C | Public data; brief adapter |
| PB-305 | **Constraint-resolution in brief** (ADR-021) | B | 4 | 4 | 4 | queued | cc-agent-C | After R4 atoms on place |

---

## P4 — Deferred (honest v2+)

| ID | Item | Plane | Notes |
|----|------|-------|-------|
| PB-401 | MLS comps / DOM | F | Matrix-licensed; not moat |
| PB-402 | Shovels permit history at scale | E | Licensed feed or per-city MOU |
| PB-403 | `place_dossier` MCP (G3) | all | After G0–G2 |
| PB-404 | Enterprise Regrid | C | Sales-gated |
| PB-405 | Airspace / FAA | V | After legal-description graph |

---

## Today execution map (2026-05-29)

| Who | Action |
|-----|--------|
| **Planner** | This backlog; partner runbook; dispatches D/E; decision record |
| **cc-agent-C** | PB-003 federal layers; PB-008 TCEQ spike; PB-301 encumbrance brief path (if bandwidth) |
| **cc-agent-E** | PB-001 load script/docs if `DATABASE_URL`; PB-201 Lakeway/San Marcos recon |
| **Nick** | PB-002 merge PR #134 + deploy; PB-004 Regrid secret; PB-001 Neon load; **tomorrow** PB-101–107 outreach |
| **extension-agent** | PB-009 |

**Warmup artifacts (ready):** `P:\hauska-engine\tools\migrate-legacy-codes\tmp\neon-warmup-pilot\*.jsonl` — see [`_dispatches/2026-05-29_cc-agent-E_neon_warmup_pilot_batch.md`](_dispatches/2026-05-29_cc-agent-E_neon_warmup_pilot_batch.md).

---

## Coverage honesty

Manifest remains [`75b_brief_coverage_v0.md`](75b_brief_coverage_v0.md) + `GET /api/brokerage/v1/coverage`. Bump `75b` when a key flips `engine_only` → `neon`.

---

## Revision history

- **2026-05-29:** Initial scored backlog from place-graph gap analysis; P0 execution wave + partner lane for Nick 2026-05-30.
