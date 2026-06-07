---
id: 2026-06-07_cc-agent-E_accessibility_corpus_ingest
title: Dispatch - accessibility standards corpus ingest (A117.1 / ADA / FHA)
date: 2026-06-07
agent: cc-agent-E
repo: hauska-engine
kind: dispatch
status: FIRE-READY (Wave 1, parallel-safe; ADA + FHA now, A117.1 when ICC creds land)
related: [00_current_state, 01a_atom_conventions, 20_agent_operating_rules, 55_spine_data_intelligence_stack, 80_adrs/adr_019_layered_code_substrate]
---

# Accessibility standards corpus ingest (A117.1 / ADA / FHA)

> **FIRE-READY.** Wave 1, parallel-safe (different repo than the cortex-api workstreams). The free half (ADA + FHA Design Manual via RawPdfAdapter) ships now; ICC A117.1 rides the ICC Code Connect adapter and is gated on the same OAuth credentials as the IRC ingest, so it lands when creds clear. Verify identifiers against live source before firing.

You are **cc-agent-E**, the single owner of `hauska-engine` for this run.

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Escalate to Claude only if Grok fails after retry; log the escalation. Cursor base URL `https://api.x.ai/v1`.

## Atoms to resolve

- `current-state:portfolio` - fleet status, blockers
- `sprint:55` - spine robustness roadmap (this is workstream 3, corpus breadth)
- `decision:2026-05-23_partnership_first_scoping` - these are national/federal standards (product-baseline), not city operational data; partnership-first does not gate them

## Read first (after atoms)

1. [`55_spine_data_intelligence_stack.md`](../55_spine_data_intelligence_stack.md) - Section 5 (corpus), Section 8 workstream 3
2. [`80_adrs/adr_019_layered_code_substrate.md`](../80_adrs/adr_019_layered_code_substrate.md) - the layered model these standards slot into
3. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) - HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `P:\hauska-engine`
- Branch prefix: `stream-1d/`
- One agent per clone per [`agent_workspace_hygiene`](../90_runbooks/agent_workspace_hygiene.md)
- Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`

## Scope

**In scope:**

- Recon first. Confirm the `RawPdfAdapter` born-digital + OCR paths (`packages/corpus/src/adapters/raw-pdf/index.ts`) and the model-code tenant convention. Report verbatim.
- Ingest the two free, public federal accessibility standards via RawPdfAdapter as Layer 1 model-code-tier corpora:
  - **ADA Standards for Accessible Design (2010)** - DOJ public document.
  - **Fair Housing Act Design Manual** - HUD public document.
- Produce code-section, code-definition, and code-cross-reference atoms with the same shape as the existing corpus; tag with an accessibility/standard edition label and the appropriate accessPolicy (`public-free`, these are public standards).
- Author curated eval queries (mirror the IRC_2021 curated-query pattern) and pass the eval bar before declaring done.
- **Wire (do not yet run) ICC A117.1** through the ICC Code Connect adapter alongside the staged IRC, so it ingests the moment OAuth creds land. Mark it credential-pending, same as IRC.

**Out of scope:**

- The full I-Code family (IBC/IECC/etc.) beyond wiring A117.1; that is a follow-on once creds and priorities are set.
- Any cortex-api / finding-engine change (the precedence engine that reasons over these standards is cc-agent-C2's workstream 2).
- NFPA (paywalled; partnership/licensing question, not this dispatch).

## Acceptance criteria

- ADA + FHA Design Manual ingested as code atoms, eval bar passed (report eval scores verbatim).
- Atoms carry source attribution, edition label, accessPolicy `public-free`, and cross-reference atoms where the standards cite sections.
- A117.1 wired through ICC Code Connect, credential-pending (does not block this dispatch).
- Snapshot regenerated or a follow-on snapshot-refresh step documented.
- Tests: existing corpus suite green plus the new accessibility eval queries.
- PR held for operator merge (do not merge).
- Verbatim verification artifacts in report (HR-8).

## Reporting

At break-point write to `P:\doc_repo\_inbox\` as `2026-06-07_hauska-engine_cc-agent-E_accessibility_corpus_ingest.md`. Include atom refs touched, eval scores verbatim, model used (if not default), PR URL + branch SHA, blockers verbatim.
