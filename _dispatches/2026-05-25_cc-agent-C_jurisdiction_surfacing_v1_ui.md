---
id: 2026-05-25_cc-agent-C_jurisdiction_surfacing_v1_ui
title: Dispatch — Cortex jurisdiction surfacing v1 (UI pass)
date: 2026-05-25
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
operator_greenlight: 2026-05-25
related: [41a_cortex_jurisdiction_surfacing, 43_cortex_qa_backlog, _dispatches/2026-05-25_cc-agent-C_qa_fix_sprint_batch1]
---

# Jurisdiction surfacing v1 — UI pass — cc-agent-C

Interactive UI polish session. **v1 only** — client-side filtering and information architecture. No new API routes, no DB migrations, no deploy.

Canonical spec: [`41a_cortex_jurisdiction_surfacing.md`](../41a_cortex_jurisdiction_surfacing.md). Closes **QA-59** (v1 slice).

## Model (HR-12)

Grok Build 0.1 default. One PR preferred: `fix/qa-59-jurisdiction-surfacing-v1`.

## Workspace

- `P:\legacy-design-tools` on `main` (pull latest)
- Local dev: `pnpm --filter @workspace/design-tools dev` (+ api-server if needed)
- Operator QA on canary/prod in parallel; you do not deploy

## Problem

Code Library today loads **every** cortex-local jurisdiction card and shows the full substrate catalog up front. New users should see **relevant jurisdictions first** (current engagement + firm's projects), with full catalog behind **Explore**.

## In scope

### 1. Code Library (`CodeLibrary.tsx` + `SubstrateCatalogPanel.tsx`)

Restructure jurisdiction presentation into three sections (use clear headings + `data-testid`s):

| Section | Content | Default visibility |
|---------|---------|-------------------|
| **Active on this project** | If route/context has `engagementId`, show jurisdictions matching that engagement's `jurisdictionState` (from engagement detail fetch or props). If no match in catalog, show honest copy: "No code corpus matched — add or correct address on Site tab." | Expanded when engagement in context |
| **Your firm** | Union of `jurisdictionState` from all engagements (list engagements API or existing store). Filter cortex-local jurisdiction cards + substrate summary to those states. Default selected card = first in this section. | Expanded |
| **Explore catalog** | Full jurisdiction grid + existing SubstrateCatalogPanel behavior. Text search filter (client-side, displayName/key). | **Collapsed** in `<details>` or accordion by default |

**Filtering rules (client-side only):**

1. Derive `Set<string>` of state codes from engagements (`jurisdictionState`, 2-letter).
2. Match jurisdiction cards where `displayName` or `key` contains state token OR keep a simple `key` suffix heuristic (`-tx`, `-ut`, `grand-county-ut`, etc.) — document heuristic in PR if imperfect.
3. Substrate panel: add one summary line, e.g. "Showing N jurisdictions in your states · M nationwide" using filtered count vs `data.jurisdictions.length` — do not duplicate full jurisdiction list in panel.

**Preserve:** atom browse, warmup, book pills, embedded mode (`cockpit-dashboard-code-embedded`), MCP `fixture` vs `live` badge.

### 2. Dashboard empty state (if trivial in same PR)

When user has **zero engagements**, Code Library embedded view or dashboard should not imply a full national catalog is "theirs". Prefer:

- Short copy: create a project to see code for your jurisdictions
- Link/CTA to create engagement or intake modal

Touch only if `Dashboard.tsx` / inbox empty state is adjacent; do not scope-creep dashboard redesign.

### 3. Tests

- Update/add Vitest for Code Library: Explore collapsed by default; filtered section shows subset when engagements mock includes UT+TX; `data-testid` hooks for sections.
- `pnpm run typecheck` green.

## Out of scope (filed for later — do not build)

- Workspace `practiceStates[]` persistence (v1.5)
- `substrateJurisdictionKey` / `coverageStatus` on engagement (v2)
- `GET /api/substrate/jurisdictions?states=` server filter (v3)
- Request coverage CTA / QA-20 engine hook
- MCP secret / operator env

## Acceptance

- [ ] New user with 0 engagements: no wall of jurisdiction cards without expanding Explore
- [ ] User with Musgrave (UT) + Dallas (TX) engagements: **Your firm** shows UT+TX jurisdictions first; Explore has full list
- [ ] Engagement deep-link to Code Library highlights **Active on this project** when state known
- [ ] Substrate `live`/`fixture` badge unchanged
- [ ] typecheck + targeted vitest pass

## Reporting

Courier to `P:\doc_repo\_inbox\2026-05-25_legacy-design-tools_cc-agent-C_qa59_jurisdiction_v1_close.md` with PR URL, screenshots optional, test commands.

## Operator note

Nick is on interactive QA polish; merge when CI green. No deploy required for this slice.
