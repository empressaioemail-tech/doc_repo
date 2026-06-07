---
id: 2026-06-07_cc-agent-C2_plan_set_decomposition
title: Dispatch - plan-set decomposition + per-discipline agent orchestration
date: 2026-06-07
agent: cc-agent-C2
repo: legacy-design-tools
kind: dispatch
status: FIRE-READY (Wave 1, c2 clone; the PDF-peel conductor)
related: [00_current_state, 01a_atom_conventions, 20_agent_operating_rules, 55_spine_data_intelligence_stack, 47_codex_plan_review, 04a_arrow_two_calibration_capture]
---

# Plan-set decomposition + per-discipline agent orchestration

> **FIRE-READY.** Wave 1, on the `P:\legacy-design-tools-c2` clone. This builds the orchestration conductor that splits a plan set by sheet/discipline and runs a specialist agent per piece. The ingredients exist; the conductor does not. cc-agent-C is on the main clone doing subsurface adapters this wave (lib/adapters only) so file sets are disjoint. Verify identifiers against live source before firing.

You are **cc-agent-C2**, the single owner of the `P:\legacy-design-tools-c2` clone for this run.

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Escalate to Claude only if Grok fails after retry; log the escalation. Cursor base URL `https://api.x.ai/v1`.

## Atoms to resolve

- `current-state:portfolio` - fleet status, blockers
- `sprint:55` - spine robustness roadmap (this is workstream 1)
- `product:cortex` - plan review lives in cortex-api

## Read first (after atoms)

1. [`55_spine_data_intelligence_stack.md`](../55_spine_data_intelligence_stack.md) - Section 4 (plan-review stack: what exists vs the missing conductor), Section 8 workstream 1
2. [`47_codex_plan_review.md`](../47_codex_plan_review.md) - the plan-review surface this serves
3. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) - HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `P:\legacy-design-tools-c2` (dedicated c2 clone)
- Branch prefix: `2d/` or `cortex/`
- One agent per clone. **cc-agent-C is on the main clone in `lib/adapters`; you own the finding-engine + routes + new orchestration. Do not touch `lib/adapters`.**
- Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`

## Scope

**In scope:**

- Recon first. Map the existing ingredients verbatim: snapshot + per-sheet PNG (`routes/snapshots.ts`), per-sheet vision OCR (`sheetContentExtractor.ts`), IFC parse (`ifcIngest.ts`), attached-document text extraction (`routes/sheetContent.ts`), the `disciplines` taxonomy (`atoms/submission-classification.atom.ts`), and the single-pass finding-engine (`lib/finding-engine/src/engine.ts`).
- Build the decomposition + orchestration layer:
  1. **Sheet/piece classification** - classify each ingested sheet (and attached-PDF page) by discipline (architectural, structural, MEP, civil, accessibility, fire, zoning) using the existing OCR text + sheet title block. Persist the classification.
  2. **Per-discipline specialist dispatch** - for each discipline present, run a specialist finding pass scoped to that discipline's pieces and the standards/code-sections that govern it (e.g. accessibility pieces against A117.1/ADA/FHA atoms once WS3 lands; structural against IBC/ASCE 7 when present; fire against IFC/NFPA when present; zoning against the municipal corpus). Reuse the existing finding-engine per discipline rather than one pass over everything.
  3. **Re-aggregation** - merge per-discipline findings back into one submission view, deduplicated, each finding tagged with its discipline and citations.
- Keep the existing single-pass path working as a fallback (feature-flag the orchestrated path).
- Preserve the citation + confidence shape; do not regress arrow-two's `findings.citations[].atomId` lineage (the evidence ledger depends on it).

**Out of scope:**

- The precedence/conflict-resolution pass across disciplines (that is workstream 2, the follow-on cc-agent-C2 dispatch; this dispatch produces per-discipline findings, the next one reconciles conflicts between them).
- New data adapters (cc-agent-C).
- Corpus ingest of the standards themselves (cc-agent-E).
- Calibrating the confidence number (arrow-two, tenant leg).

## Acceptance criteria

- A multi-sheet submission is classified by discipline; each discipline runs its own specialist finding pass; findings re-aggregate into one view tagged by discipline.
- The orchestrated path is feature-flagged; the legacy single-pass path still works with the flag off.
- Citation + confidence + `atomId` lineage preserved (arrow-two ledger unaffected).
- Demonstrated on a real multi-sheet engagement (e.g. Musgrave or a Bastrop submittal).
- Tests: existing finding-engine suite green plus classification + orchestration tests.
- PR held for operator merge (do not merge).
- Verbatim verification artifacts in report (HR-8).

## Reporting

At break-point write to `P:\doc_repo\_inbox\` as `2026-06-07_legacy-design-tools_cc-agent-C2_plan_set_decomposition.md`. Include atom refs touched, model used (if not default), PR URL + branch SHA, blockers verbatim.
