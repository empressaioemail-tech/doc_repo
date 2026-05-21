---
decision_id: 2026-05-20_hutto_tx_prioritized_ingest
date: 2026-05-20
owner: Nick
status: active
related_canonical: [43_cortex_qa_backlog, 49_code_ingestion_pipeline, 51_substrate_v1_sprint, 73_partnerships, _dispatches/2026-05-20_cc-agent-E_hutto_tx_ingest, _sessions/2026-05-20_hutto_tx_udc_ingest_cc-agent-E]
---

## Decision

Prioritize a one-off Hutto, TX municipal-code ingestion now, ahead of the deferred Sync 5 bucket.

## Context

QA-10 of the Cortex QA backlog asked to add Hutto, TX as a code-ingestion target, citing an expected large growth surge. Sync 5, the sixteen-plus remaining TX cities, is deferred to public-launch demand per the settled decisions in CLAUDE.md. The planner recommended queuing Hutto with Sync 5 and starting Sylvia outreach in parallel; the operator chose instead to prioritize a standalone Hutto ingest now. cc-agent-E is at steady-state, so the ingest re-activates idle capacity rather than displacing active sprint work.

Verified 2026-05-20 (cc-agent-E HUTTO.1, hauska-engine PR #15). Hutto publishes on two sources: the general Code of Ordinances is on eCode360 (access-blocked, HTTP 403, the Smithville pattern), and the Unified Development Code (Chapter 16, the zoning and development code, the highest-value code for plan review) is a free born-digital PDF on the city website. The operator authorized a reshape: ingest the UDC now via the raw-PDF path, route the eCode360 general code to the bizops General Code partnership-API track. The UDC ingested as 1716 code-section atoms, passed the eval bar at 1.0 / 1.0 / 1.0, and is declared loaded, well inside the cost envelope (born-digital, no LLM or OCR spend). This decision is now active with scope narrowed to the UDC; the eCode360 general code is a partnership-track item, not a one-off ingest.

## Structural commitment check

Pre-mortem run 2026-05-20. Sell reasoning: green. Partnership-first (load-bearing): green, conditioned on Path A routing through Sylvia. Cost per jurisdiction (load-bearing): green, conditioned on Hutto being Municode-accessible. Dual interface: green, not applicable. Hauska spine: green. Focus queue: yellow (operational), since the move overrides the Sync 5 deferral for one city; the operator acknowledged the tradeoff, and cc-agent-E idle capacity absorbs it. Quality gate: green. All load-bearing commitments clear; the single operational yellow is operator-acknowledged.

## Reasoning

Hutto sits in the Austin metro (Williamson County), in the regional growth corridor anchored by the Samsung Taylor semiconductor fab. The operator assesses the growth surge as a strong enough signal to ingest ahead of demand rather than wait for it. The cost is bounded: a standard Municode TX city ingests through the existing MunicodeHtmlAdapter, the same path Elgin used at eval 1.0 / 1.0 / 1.0 inside the 200-dollar-compute and one-hour-review envelope, so the ingest itself is low-risk and cheap. cc-agent-E being at steady-state means the focus cost is idle-capacity spend, not displacement of the combined Cortex/Codex sprint or the Cortex QA cycle. The one real risk is the source platform: if Hutto publishes on eCode360 rather than Municode, programmatic access is blocked (the Smithville pattern from Sync 4.5) and the ingest cannot proceed as a one-off. The cc-agent-E dispatch therefore verifies the platform before ingesting, and this record stays provisional until that clears.

## Reversal criteria

- If platform verification finds Hutto on eCode360 or another programmatically-blocked publisher, the one-off ingest is not feasible. This decision is superseded by a bizops partnership-API track for Hutto (General Code), and Hutto re-queues with Sync 5.
- If the Hutto ingest exceeds the 200-dollar-compute or one-hour-review envelope, flag for engineering review per the cost-per-jurisdiction rule before declaring Hutto loaded.
- If a higher-priority active sprint needs cc-agent-E before the Hutto ingest starts, the ingest yields. It is idle-capacity work, not displacement work.

## Dependencies

- Depends on: cc-agent-E availability (currently steady-state); the MunicodeHtmlAdapter (shipped, used for Elgin); platform verification of Hutto's code source.
- Depended on by: the Hutto ingest dispatch [`_dispatches/2026-05-20_cc-agent-E_hutto_tx_ingest.md`](_dispatches/2026-05-20_cc-agent-E_hutto_tx_ingest.md).
- Overrides, for the single city of Hutto, the Sync 5 deferral recorded in CLAUDE.md. The rest of Sync 5 stays deferred.
- The Sylvia partnership outreach to Hutto runs in parallel as operator-paced bizops and is not gated by this decision.

## Counterparties

City of Hutto, TX: the jurisdiction, a prospective partnership licensor. Ingest follows Path A (atoms tagged partnership-pending / platform-internal, flip to public on partnership close). Sylvia Carrillo: runs the partnership outreach. Internal: Nick (owner, decision), cc-agent-E (executes the ingest).
