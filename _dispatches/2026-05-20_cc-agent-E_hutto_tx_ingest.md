---
id: 2026-05-20_cc-agent-E_hutto_tx_ingest
title: Dispatch — cc-agent-E Hutto TX code ingestion (prioritized one-off)
date: 2026-05-20
agent: cc-agent-E
repo: hauska-engine
kind: dispatch
related: [_decisions/2026-05-20_hutto_tx_prioritized_ingest, 43_cortex_qa_backlog, 49_code_ingestion_pipeline, 73_partnerships, CLAUDE.md]
---

# Hutto TX code ingestion — cc-agent-E dispatch

You are cc-agent-E on the `hauska-engine` repo. This is a prioritized one-off jurisdiction ingestion: load the City of Hutto, TX municipal code into the substrate corpus, ahead of the deferred Sync 5 bucket. See the decision record [`_decisions/2026-05-20_hutto_tx_prioritized_ingest.md`](../_decisions/2026-05-20_hutto_tx_prioritized_ingest.md) for the why and the reversal criteria.

## Why this exists

QA-10 of the Cortex QA backlog: the operator wants Hutto, TX onboarded ahead of demand on the strength of an expected growth surge (Austin metro, Williamson County, Samsung Taylor fab corridor). The pre-mortem cleared green. This dispatch is a standalone ingest, not a re-activation of the full Sync 5 sweep, which stays deferred.

## Critical gate

The decision record is **provisional** pending one verification: Hutto's code-publishing platform. HUTTO.1 below performs it and gates everything after. If Hutto is on eCode360 or another programmatically-blocked publisher, **stop** and report back; do not attempt to ingest. That is the Smithville pattern from Sync 4.5, and it re-routes to a bizops partnership-API track rather than a one-off ingest.

## Read first

1. [`CLAUDE.md`](../CLAUDE.md) — operating instructions, including the cost-per-jurisdiction rule and the partnership-preferred rule.
2. [`_decisions/2026-05-20_hutto_tx_prioritized_ingest.md`](../_decisions/2026-05-20_hutto_tx_prioritized_ingest.md) — the decision, its conditions, and reversal criteria.
3. [`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md) — the B.1 through B.6 pipeline this ingest runs through.
4. Your own Sync 4.5 session summaries for the Elgin ingest — Elgin is the closest precedent (a Municode TX city ingested via the MunicodeHtmlAdapter at eval 1.0 / 1.0 / 1.0, tagged platform-internal under Path A).

## Scope

### HUTTO.1 — Verify the source platform (gate)

Work. Determine where the City of Hutto, TX publishes its adopted municipal code: Municode, eCode360, a raw PDF download, or jurisdiction-direct. Identify the adopted codes in scope (zoning / development code, building codes, and whatever else Hutto publishes).

Decision gate.

- Municode (or another programmatically-ingestable source): proceed to HUTTO.2.
- eCode360 or another access-blocked publisher: stop. Do not ingest. Report the finding so the planner re-routes Hutto to a bizops General Code partnership-API track and flips the decision record from provisional to superseded.

Test. The platform is named with evidence (the source URL and access check).

### HUTTO.2 — Ingest

Work. Run Hutto through the pipeline with the adapter matching HUTTO.1. For Municode this is the existing MunicodeHtmlAdapter (the Elgin path). Run discover, fetch, normalize, structural extraction (B.2), and atomization (B.3) for Hutto's adopted codes. Produce `code-section`, `code-definition`, `code-cross-reference`, `code-edition`, and the `jurisdiction-corpus` atom per the code atom types.

Test. Spot-check a sample of sections for accurate text, hierarchy placement, and cross-reference resolution.

### HUTTO.3 — Path A access tagging

Work. Tag every Hutto atom with `accessPolicy: platform-internal` (partnership-pending), consistent with the Elgin and Bastrop County precedent. Hutto's partnership is not closed; the tag flips to `public-free` on partnership close. Do not publish Hutto atoms as public.

Test. All Hutto atoms carry `platform-internal`; none are `public-free`.

### HUTTO.4 — Eval harness

Work. Run the B.4 eval harness against Hutto: curated reviewer-realistic queries, section-number coverage, cross-reference resolution. Hutto is "declared loaded" only when it passes the quality bar (the proposed bar is 90 percent top-3 retrieval, 100 percent section-number retrievability, 95 percent cross-reference resolution).

Test. Eval scores reported; quality bar passed, or the shortfall documented.

### HUTTO.5 — Cost checkpoint

Work. Record the compute cost and human-review time for the Hutto ingest. Compare against the 200-dollar-compute and one-hour-review envelope.

Test. Cost reported. If it exceeds the envelope, flag for engineering review per the cost-per-jurisdiction rule before declaring Hutto loaded.

## Hand-off

Session summary reports: the verified platform, the atom count, the eval scores, the cost-checkpoint result, and the `jurisdiction-corpus` atom DID. The planner updates [`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md) coverage and notes Hutto in [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) and [`73_partnerships.md`](../73_partnerships.md) at session close, and flips the decision record from provisional to active. If HUTTO.1 blocks the ingest, that is the whole session: report the platform finding and stop.
