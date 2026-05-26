---
id: 2026-05-26_cc-agent-C_encumbrances_phase_1_upload
title: Dispatch — Cortex encumbrances Phase 1 (upload + UI + briefing)
date: 2026-05-26
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [80_adrs/adr_020_recorded_instruments_and_restriction_clauses, 80_adrs/adr_021_constraint_resolution_and_precedence, 49b_encumbrance_ingestion_pipeline, _decisions/2026-05-26_recorded_restrictions_phase_0_scope, _dispatches/2026-05-26_cc-agent-AC_recorded_restriction_atom_types, 43_cortex_qa_backlog, 00_current_state]
---

# Cortex encumbrances Phase 1 — cc-agent-C

You are **cc-agent-C**, single owner of `legacy-design-tools` for this run.

**Gate:** Operator dispatch only. Do not displace active Cortex prod QA fires without operator OK.

## Model (HR-12)

Default: Grok Build 0.1. Escalate to Claude on failure.

## Atoms to resolve

- `current-state:portfolio`
- Test engagement: **430 Evergreen Trl, Cedar Hill TX** (`cedar_hill_tx`)

## Read first

1. `P:\doc_repo\80_adrs\adr_020_recorded_instruments_and_restriction_clauses.md`
2. `P:\doc_repo\80_adrs\adr_021_constraint_resolution_and_precedence.md` (simplified briefing merge OK for Phase 1)
3. `P:\doc_repo\49b_encumbrance_ingestion_pipeline.md` § R4
4. `P:\doc_repo\_decisions\2026-05-26_recorded_restrictions_phase_0_scope.md`
5. `P:\legacy-design-tools\artifacts\design-tools\src\pages\CodeLibrary.tsx` — **do not** merge encumbrances into code grid
6. Parcel / Site tab + `parcel-briefing` routes in api-server

## Workspace

- Clone: `P:\legacy-design-tools`
- Branch: `feat/encumbrances-phase-1-upload`
- `git status` + `git log -3` at start per hygiene runbook

## Scope — in

### api-server

- Engagement-scoped storage for uploaded PDFs (GCS / existing private object pattern)
- `POST /api/engagements/:id/encumbrances/upload` (multipart)
- `GET /api/engagements/:id/encumbrances` — instruments + clauses
- `PATCH /api/engagements/:id/encumbrances/clauses/:clauseId/verify` — sets human verify timestamp
- Extract pipeline: PDF → clause candidates (document model + version in metadata)
- Provenance on every clause: storage key/CID, confidence, extractedAt, sourceAdapter `R4-upload`

### design-tools

- **Encumbrances** section on Site / Parcel (not Code Library)
- Upload, instrument list, clause list, PDF viewer link
- Empty state + CTA

### briefing

- **Private restrictions** section on `parcel-briefing` when clauses exist
- Reasoning summary + confidence + timestamp; label recorded vs advisory per ADR-020
- Do not present as municipal code

### tests

- api-server route tests; minimal UI vitest

## Scope — out

- County recorder API (R1), title plant (R2)
- Plan review `[[RESTRICTION:…]]` findings (Phase 3)
- hauska-mcp-server tools (Phase 2)
- Full IPFS atom publish (OK: Postgres + GCS until AC types ship; shape rows to match ADR-020 fields)

## Acceptance

- [ ] Upload sample PDF on Cedar Hill engagement → instruments + clauses in API
- [ ] Human verify updates clause state
- [ ] Briefing shows private restrictions with provenance
- [ ] `pnpm run typecheck` green (affected packages)
- [ ] PR held for operator merge
- [ ] `_inbox/2026-05-26_legacy-design-tools_cc-agent-C_encumbrances_phase_1_close.md`

## Reporting

Verbatim test commands (HR-8). New env vars listed. Note dependency on cc-agent-AC for formal atom types.
