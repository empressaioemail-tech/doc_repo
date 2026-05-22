---
decision_id: 2026-05-22_sync5_texas_ingest_undeferred
date: 2026-05-22
owner: Nick
status: active
related_canonical: [51_substrate_v1_sprint, 49_code_ingestion_pipeline, 73_partnerships, 80_adrs/adr_019_layered_code_substrate, 00_current_state, _decisions/2026-05-19_sync_4_5_and_cortex_sprint]
---

## Decision

Un-defer Sync 5. cc-agent-E runs the Texas code-ingest ladder continuously rather than holding the remaining cities for public-launch-sequenced demand. Tier 2 central-Texas (the Austin metro and the central-Texas corridor, the City of Austin as anchor) is dispatched now; statewide Texas coverage is the standing goal, climbed region by region. Access-blocked platforms (eCode360, EncodePlus) route to the General Code partnership track, not scraped; the established Path A/B/C/PDF method and the B.4 eval bar hold.

## Context

The 2026-05-19 combined-sprint decision ([`2026-05-19_sync_4_5_and_cortex_sprint.md`](2026-05-19_sync_4_5_and_cortex_sprint.md)) closed substrate v1 at four Bastrop-network jurisdictions (Sync 4.5) and put "Sync 5 — the remaining 16+ TX cities" out of scope, deferred to public-launch-sequenced demand, on the reasoning that twenty jurisdictions was the public-launch unblocker and the operator's test surface (Grand County, Bastrop) did not need them.

That deferral was already partially overtaken: the ADR-019 / Sync 5 dispatch defined a Tier 1/2/3 ingest ladder and cc-agent-E executed Tier 1 — Round Rock, Taylor, Leander, Georgetown ingested; Pflugerville, Cedar Park routed to partnership — the same "remaining TX cities" the 2026-05-19 record had listed as deferred. The operator's call on 2026-05-22: do not let cc-agent-E sit idle between rungs, and do not wait for public-launch demand. All of Texas needs to be ingested, central Texas first, and the written plan expands to match.

## Structural commitment check

Pre-mortem run via `premortem-check` 2026-05-22, cleared GREEN on all seven commitments. Load-bearing commitments clean: the ingest produces eval-verified atoms with source attribution (Commitment 1); access-blocked platforms route to the General Code partnership track rather than being scraped, and the move triggers — as `73_partnerships.md` already anticipates — escalation of the Municode aggregator-partnership conversation as the catalog scales (Commitment 2); the cost envelope is demonstrated (Tier 1 eval 1.0/1.0/1.0, hard-kill checkpoint cleared at four-plus onboarding events) and hard-to-ingest cities route to partnership rather than consuming unbounded effort (Commitment 3). On-spine — the catalog is the Hauska thesis — and focus-queue clean: cc-agent-E is idle post-Tier-1, nothing is displaced.

## Reasoning

cc-agent-E is open and warm with Tier 1 complete; idle agent capacity on the single most on-spine activity in the portfolio is waste. The ingest method is proven and cheap, the eval rubric is the automated quality gate, and the ladder is already defined in the ADR-019 / Sync 5 dispatch — continuing it is execution, not new architecture. The public-launch-demand gate was a capacity-protection measure during the substrate-v1 plus Cortex/Codex plus cutover crunch; that crunch is past, so the gate no longer earns its cost.

"All of Texas" has two halves. The accessible-source cities (Municode Path C, city-hosted PDF) are cc-agent-E's continuous engineering run. The access-blocked bucket (eCode360, EncodePlus) cannot be unlocked by running cc-agent-E harder — it needs the General Code partnership to land, which is a Nick and bizops lever running in parallel. Statewide coverage is the product of both.

## Reversal criteria

Pause and re-cut if any city exceeds the cost-per-jurisdiction envelope ($200 compute plus 1 hour human review) in a way that is not cleanly routed to partnership — surface for engineering review, do not silently absorb. The ICC Layer 1 corpus ingest, once Code Connect credentials land, preempts jurisdictional ingest — Layer 1 is the shared model-code base under every jurisdiction and is the higher-leverage work.

## Dependencies

cc-agent-E's Tier 2 central-Texas dispatch is the immediate execution. The General Code (eCode360) partnership conversation in [`73_partnerships.md`](73_partnerships.md) is the parallel unlock for the access-blocked bucket — a Nick and bizops action. The ICC Layer 1 corpus ingest stays credential-gated and, when it fires, preempts. `CLAUDE.md`'s settled-section line "Sync 5 (16+ remaining TX cities) deferred to public-launch demand" is now superseded by this decision and should be updated.

## Counterparties

Internal. Amends the Sync 5 out-of-scope element of the 2026-05-19 combined-sprint decision (see its Amendment 9). Affects cc-agent-E's dispatch queue and the General Code partnership priority.
