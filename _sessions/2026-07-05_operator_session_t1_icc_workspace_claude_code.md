---
id: sessions/2026-07-05_operator_session_t1_icc_workspace
title: Operator session — T1 flip, ICC live end to end, workspace parity, O&G activation
status: active
date: 2026-07-05
related: [_inbox/2026-07-04_convergence-program_STATUS.md, _sessions/2026-07-05_convergence_autonomous_run_claude_code.md, _inbox/2026-07-05_draft_adr_025_og_atom_ontology.md, _inbox/2026-07-05_draft_og_activation_decision.md]
---

# Operator session: T1 flip, ICC end to end, workspace parity, O&G activation

Continuation of the 2026-07-05 autonomous run, now operator-interactive. Execution model unchanged: Cursor wrote the code (five more dispatches), the planner ran migrations-equivalents, deploys, secrets, live verification, reviews, and merges. The live ledger addendum is in the convergence tracker (session-3 block); this record carries the narrative and the operator decisions.

## Operator decisions this session

Key swaps deferred until after QA (Cotality flagged as the exception since the demo key expires 2026-07-06 and is additive, not a swap). T1 flip approved and executed to log mode. NPM_TOKEN granted (CI publishing proven live). The command center ratified as the single working surface (operator console plus Cortex Workspace in one app). The Reeves O&G vertical activated ("needs to ship soon"), with four ADR rulings: separate mineral-lease and rrc-lease types; ownership-interest as one discriminated type; obligation domain-neutral in the core contract; DOI atoms tenant-private; Empressa Land still a working name. The ICC pitch reframed: not the standalone search page but the workspace walkthrough (plan reviewer, architect, property views plus the code-treatment and metering story); the page remains the MCP-first agent-market leg.

## Shipped and live-verified

T1 log mode on all three services with a real gate_context_verified log line captured in cortex; two enforce-blockers found and filed honestly (producer subject-resolution bug stamping product public on a keyed call; a red test that reached ldt main because #227 merged before CI — fixed in #229, and merges now always wait for checks).

ICC end to end: the ingest unit (engine PR #85) minted icc-model-code into the corpus — prior 34 jurisdictions byte-identical plus 8,731 ICC atoms (IBC 2018 complete; IPMC content fetch returns empty, adapter follow-up filed). The full corpus rebuild was abandoned after Municode served sustained 500s across two runs; the shipped snapshot is a documented splice (provenance.splice). retrieval-api serves 29,857 atoms at 100 percent; the public demo at icc-demo.vercel.app returns real IBC sections; the extension formal-citation PR merged.

Command center: Phase A (branding, proxy-auth UX, panels auto-load), Phase B (workspace mounted from the ADR-024 packages), and full 47-tile parity (audit found 17 of 47 mounted and the Plan Review preset gutted; the three never-packaged report tiles shipped in @hauska/cortex-tiles@0.1.1 via ldt PR #228 and the CI publish; the registry now derives from TILE_CAPABILITIES so drift is structurally impossible; Print View restored). All deployed.

O&G: activation decision and ADR-025 ontology drafts filed to _inbox with the operator rulings stamped; the pooled-units question is with Herbert (his read on Reeves pooling share decides whether ADR-025 revs before the mint); the Chris request list was delivered in-session (mockup source, per-surface data contract, layer specs, BFF-vs-MCP integration call, data posture).

## Open at close

Herbert's pooling answer; the ADR-025 and activation-decision promotions after operator review; the producer product-resolution fix before any T1 enforce; the SDK main build failure (blocks metering publish); IPMC adapter follow-up; ICC curated queries for an evaluated (not just not-evaluated) tenant; the workspace walkthrough dry-run against the ICC pitch; Cotality keys (expiry today per the earlier flag); Upstash replacement (non-urgent, resilient fallback active).
