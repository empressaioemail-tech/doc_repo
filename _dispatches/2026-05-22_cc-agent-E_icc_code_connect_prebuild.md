---
id: 2026-05-22_cc-agent-E_icc_code_connect_prebuild
title: Dispatch — cc-agent-E ICC Code Connect adapter pre-credential build-out
date: 2026-05-22
agent: cc-agent-E
repo: hauska-engine
kind: dispatch
related: [80_adrs/adr_019_layered_code_substrate, 49_code_ingestion_pipeline, 27_engine_evolution_plan, 73_partnerships, 00_current_state, 20_agent_operating_rules]
---

# cc-agent-E dispatch — ICC Code Connect adapter, pre-credential build-out

You are cc-agent-E. This dispatch builds the ICC Code Connect integration for the Layer 1 model-code base, as far as it can be built before the operator has live API credentials. The operator has an ICC meeting next week to obtain Code Connect API access; the goal here is that the moment credentials land, Layer 1 ingest is "populate the secret, run the ingest, run the eval," not "start building."

## Why this exists

Per [ADR-019](../80_adrs/adr_019_layered_code_substrate.md), Layer 1 of the code substrate is the ICC model-code base (the I-Codes). The ADR's 2026-05-21 material update established that ICC serves no model-code structure freely: Layer 1 ingest is gated on ICC Code Connect API access. The layered architecture itself is already built and merged (your PRs #17/#18/#19: the jurisdictional-overlay `code-amendment`, the effective-rule composition engine, the `code-section` deep-link footing). What is missing and credential-gated is the ICC adapter and the corpus ingest itself. This dispatch builds everything that does not need live credentials, against fixtures.

## What is known about the API

From the ICC Code Connect product page: it is an OAuth 2.0, JSON API. It returns code content as sections, tables, figures, and whole chapters; it supports search across titles and access to current and historical versions. The detailed technical reference is the dev portal at `api.iccsafe.org`, which is a JavaScript app and may need the credentialed login to read fully. Pull what you can from the Code Connect docs and product pages.

The operator is bringing back from the meeting the OpenAPI/Swagger spec, example response payloads for a section and a chapter fetch, and the OAuth2 token-endpoint details. Build to the documented contract. Where the public docs are incomplete, build to a clearly stated assumed contract and produce an explicit "needs confirmation from the OpenAPI spec or live API" list in your `_inbox/` summary. Do not fabricate a contract and bury the assumption; state every assumption.

## Scope

Diagnose-first: read the existing ingestion-pipeline adapter contract (the Path C Municode walker, the RawPdfAdapter) and the layered-substrate code from PRs #17/#18/#19 before building, so the ICC adapter conforms to the established adapter and atom patterns.

1. **The ICC Code Connect adapter.** A new adapter in the ingestion pipeline, conforming to the existing adapter contract. The OAuth2 client-credentials flow with token refresh, and the endpoint methods for section, chapter, search, and version retrieval, with typed JSON response models. Build and unit-test it entirely against fixture JSON hand-built from the documented response model. Mock mode is the default and keeps tests hermetic, mirroring the RawPdfAdapter and the established mock-mode pattern. OAuth2 credentials are slotted as env vars or secrets, left empty until access lands.
2. **The model-code structural extractor.** Turn the Code Connect section and chapter tree into Layer 1 atoms: `code-edition`, `code-section`, `code-cross-reference`, `code-definition`. Per ADR-019 the Layer 1 `code-section` atoms host structure, hierarchy, cross-references, and the reasoning layer, and deep-link the verbatim normative text rather than hosting it (the deep-link footing field PR #19 added). Build and test against fixtures.
3. **The Layer 1 eval rubric.** Author the curated query set for I-Code model-code ingest eval, mirroring the per-jurisdiction eval pattern (the 1.0/1.0/1.0 across curated queries the Sync 4/4.5/5 ingests use). It cannot run until the corpus exists; author it now so it is ready.
4. **The corpus-edition plan.** Resolve ADR-019's open decision on which I-Code editions to ingest first and in what order: the recent IRC, IBC, and IECC editions that Texas jurisdictions most commonly adopt. Record the plan in your session summary.

## Out of scope

- The live Layer 1 corpus ingest, and running the eval: both gated on credentials, a separate post-credentials dispatch.
- The NEC (NFPA 70). It is the 8th Layer 1 document but an NFPA publication, not an I-Code; Code Connect does not cover it. An NFPA adapter is a separate arrangement and a separate dispatch. Note it, do not build it here.
- The remaining Sync 5 Tier 1 cities (Georgetown, Pflugerville, Cedar Park): see the activation note.

## Activation

This is cc-agent-E's next dispatch, preempting the remaining Sync 5 Tier 1 cities. The operator's ICC credentials meeting is next week; staging the adapter inside that window is the priority so the credentials are immediately productive. Georgetown, Pflugerville, and Cedar Park resume after. Re-orient onto `main` and pull first.

## Run posture

Operator-supervised. Open PRs for review, split by surface if it grows large (adapter, extractor, and eval rubric are natural splits). Do not self-deploy. CI is authoritative for tests.

## Reporting

At every session break-point, write your session summary and any decision-relevant finding to `P:\doc_repo\_inbox\` as `<date>_hauska-engine_cc-agent-E_<topic>.md` per HR-11 in [`20_agent_operating_rules.md`](../20_agent_operating_rules.md). Include the explicit "needs confirmation from the live API / OpenAPI spec" list. Do not commit to the doc repo. Keep the durable record in your own repo.
