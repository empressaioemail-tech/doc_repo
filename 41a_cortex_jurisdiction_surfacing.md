---
id: 41a_cortex_jurisdiction_surfacing
title: Cortex jurisdiction surfacing — relevance model and phased delivery
status: active
last_updated: 2026-05-26
applies_to: design-accelerator
related: [40_design_accelerator, 43_cortex_qa_backlog, 28_mcp_first_product_design, 44_mcp_cortex_architecture_map]
---

# Cortex jurisdiction surfacing

> **Problem:** The Hauska substrate will grow to hundreds of jurisdictions; Cortex must not load or display the full catalog for every user on every visit. Relevance is **project-first**, then **firm practice**, then optional **catalog browse**.

**Active work:** **v1 UI pass** — dispatch at [`_dispatches/2026-05-25_cc-agent-C_jurisdiction_surfacing_v1_ui.md`](_dispatches/2026-05-25_cc-agent-C_jurisdiction_surfacing_v1_ui.md). Backlog: **QA-59**.

**Deferred (next sessions):** v1.5 workspace practice regions, v2 engagement `coverageStatus` + request coverage, v3 server-filtered substrate API + cache.

---

## Design principle — three layers

| Layer | User mental model | Load behavior |
|-------|-------------------|---------------|
| **My work** | Engagements with address/geocode | Jurisdiction keys + atoms on demand only |
| **My practice** | Where the firm usually builds | Filtered slice of catalog index (no atoms until open) |
| **The catalog** | What exists on Hauska | Searchable directory (name, coverage badge, atom count) |

Atoms stay lazy per existing Code Library copy: fetched when an engagement geocodes to a configured jurisdiction. v1 changes **defaults and layout**, not ingest or MCP wiring.

---

## First-time user flow (target end state)

1. Dashboard empty state: create project or intake link; optional skippable practice regions (v1.5).
2. First engagement with address → geocode → resolve substrate key + coverage label (v2).
3. Code Library opens on **Your work**, not global grid.
4. Unknown jurisdictions: honest empty state, no fabricated code (QA-23); request coverage routes to QA-20 engine work (v2).

---

## v1 — UI pass (in flight)

**Scope:** Client-side filtering and IA only. No new migrations, no new API routes, no deploy requirement for acceptance (local dev OK).

| Surface | Change |
|---------|--------|
| Dashboard | Empty state when no engagements: CTA create project / paste link; do not deep-link new users into full Code Library grid |
| Code Library | Three sections: **Active project** (if `engagementId` in route/context), **Your firm** (jurisdictions from all engagements + state filter), **Explore catalog** (accordion, full list + search) |
| Substrate panel | Keep `SubstrateCatalogPanel`; add summary line (e.g. count in filtered states vs total) without listing every row twice |
| Default selection | First card in **Your firm** section, not first global jurisdiction |

**Filter inputs (priority):** current engagement geocode state → all engagement states → optional text search in Explore.

**Out of v1:** `practiceStates` persistence, `substrateJurisdictionKey` on engagement, server-side `?states=`, coverage CTA, QA-20 pipeline hook.

**Acceptance:** New-user path shows ≤ few jurisdiction cards before expand; Explore reveals full list; no regression when MCP `fixture` vs `live`.

---

## v1.5 — Workspace practice regions

**Dispatch:** [`_dispatches/2026-05-26_cc-agent-C_jurisdiction_surfacing_v1_5.md`](_dispatches/2026-05-26_cc-agent-C_jurisdiction_surfacing_v1_5.md)  
**Prerequisite:** QA-59 v1 merged.  
**Owner:** cc-agent-C. **Migration:** `0020_workspace_practice_states.sql`.

---

## v2 — Coverage model on engagement

**Dispatch:** [`_dispatches/2026-05-26_cc-agent-C_jurisdiction_surfacing_v2.md`](_dispatches/2026-05-26_cc-agent-C_jurisdiction_surfacing_v2.md)  
**Prerequisite:** v1.5 recommended. **Owner:** cc-agent-C (api-server + FE). **Engine:** cc-agent-E reads `coverage_requests` (QA-20), separate session.  
**Migration:** `0021_engagement_coverage.sql` (+ optional `coverage_requests` table).

---

## v3 — API and scale

**Dispatch:** [`_dispatches/2026-05-26_cc-agent-C_jurisdiction_surfacing_v3.md`](_dispatches/2026-05-26_cc-agent-C_jurisdiction_surfacing_v3.md)  
**Prerequisite:** v2 + MCP env on prod. **Owner:** cc-agent-C (api-server). **Migration:** none.

---

## Technical notes (current codebase)

| Piece | Location |
|-------|----------|
| Substrate catalog API | `GET /api/substrate/jurisdictions` — `artifacts/api-server/src/routes/substrate.ts` |
| Cortex-local jurisdictions | `GET /api/codes/jurisdictions` — Code Library `useListCodeJurisdictions` |
| Code Library page | `artifacts/design-tools/src/pages/CodeLibrary.tsx` |
| Substrate panel | `artifacts/design-tools/src/components/SubstrateCatalogPanel.tsx` |
| Engagement geocode | `artifacts/api-server/src/routes/engagements.ts` PATCH address → `jurisdictionCity/State/Fips` |
| MCP mode | `HAUSKA_SUBSTRATE_MODE=mcp` + `HAUSKA_MCP_KEY` (operator); UI must work in `mock` and `mcp` |

---

## Cross-references

- QA-17 / QA-38 — substrate catalog wiring
- QA-20 — background collection for uningested jurisdictions
- QA-23 — no ungrounded citations
- [`28_mcp_first_product_design.md`](28_mcp_first_product_design.md) — MCP retrofit
- [`09_post_saas_substrate_thesis.md`](09_post_saas_substrate_thesis.md) — partial catalog is normal
