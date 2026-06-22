---
id: 2026-06-22_icc_poc_demo_scope
title: ICC Code Connect PoC demo — scope and decisions (record + pointer)
date: 2026-06-22
status: active
applies_to: portfolio
owner: nick
related: [73_partnerships, 49_code_ingestion_pipeline, 47_codex_plan_review, architecture_homes_topology]
---

# ICC PoC demo — scope record and pointer

The demo that closes the ICC Code Connect PoC and moves us to the 12-month SaaS license. Scope and architecture live in the dedicated repo: `P:\icc-demo` (github.com/empressaioemail-tech/icc-demo), in `docs/00_scope.md` and `docs/01_architecture_scaffold.md`. This is the portfolio record and the decisions.

Two titles only: 2018 IBC + 2018 IPMC via the Code Connect API. The deliverable is a live demonstration of content handling and surfacing (not a technical review, not a report). 180-day term; commercial use only after the SaaS agreement.

## Decisions (locked 2026-06-22)

- Demo surfaces = license scope: the Brief extension plus a generalized AI plan-review function reused across municipal (IPMC) and B2B/architect (IBC) surfaces. Deliberately broad, coherent scope: ICC focuses the license on the Brief and the plan-review function across both contexts.
- Pay-per-query: mechanism plus staged pitch — real usage tracking and the pay-per-query flow shown as a mechanism (no live charge, PoC forbids commercial use); the monetization-rail pitch staged as the closing conversation, routed through catalog-thesis-check before pitching.
- Deployment: isolated demo instance (sandboxed, designated Administrator, tear-down = wind-down, no prod dependency).
- Build on the LIVE spine and MCP (no mock data); minimal visual design (UX and content path); the plan-review formalized for reuse beyond the demo.

## The three ICC acceptance criteria

Correct citation (formal reference, traces to ICC source; highest scrutiny); layer-in-between (intelligence always between user and raw code, never wholesale); usage tracking (credible per-query/section/surface, the pay-per-query foundation).

## Reusable plan-review (architectural note)

The "generalized AI plan-review across municipal and B2B" is a product-architecture statement: one plan-review function, many surfaces. The demo is the formalization milestone for it. It should later reconcile into the architecture homes as the plan-review function (the one Codex/plan-review surfaces and AEC-cortex consume through the gate). Build it surface-independent.

## Hard constraints

Internal/eval only; ICC owns derivative works (keep our reasoning/calibration separate from ICC-content-derived atoms); designate an Administrator + security; wind-down (nothing in prod depends on PoC access); as-is.

## First gate

The ICC access-mechanism answer (same API for PoC and live? section-level vs whole-title? scrape vs API/DB?) is the first critical-path item; operator has asked Ed and is awaiting reply. Citation design is the second.

## Build status (2026-06-22)

Planning produced in the icc-demo repo: `docs/02_execution_plan.md` (workstreams, demo script mapped to the three criteria, citation design, usage and pay-per-query design, open questions, term-anchored timeline), `docs/03_build_plan.md` (the Gate-1-independent build path grounded in a live source read), and `docs/_correspondence/2026-06-22_icc_technical_questions.md` (eight technical questions sent to Ed Cilurso, with an answers log). All committed and pushed to origin/main of icc-demo.

The eight questions to ICC went out 2026-06-22 (access mechanism, citation identifier format, verbatim-display boundary, rate limits, content versioning, caching/storage, derivative-works definition, wind-down mechanics). Question 1 (access mechanism) is the only hard build blocker; awaiting Ed.

Gate-1-independent build dispatched 2026-06-22 to the repo owners: cc-agent-E (hauska-engine: 2018 IBC/IPMC fixtures for an end-to-end dry run, formalize the `icc-model-code` isolated tenant + Administrator + live-ingestion runbook), cc-agent-M (hauska-mcp-server: wire `atom_ids_returned` across read tools, ICC-scoped content-usage view, pay-per-query mechanism), cc-agent-C (legacy-design-tools: the formal reference section in the finding-engine plus the plan-review module formalization). The Brief surfacing and the two plan-review surface shells (municipal IPMC, B2B IBC) are held until cc-agent-C's formal-reference contract is firm, since all three consume it.

Key reframe from the source read: the only action genuinely blocked on Gate 1 is live ingestion (populate ICC OAuth credentials, reconcile the adapter's nine assumed contract fields against ICC's real spec, ingest real 2018 IBC/IPMC). The adapter, the isolation tenant, the provenance and citation lineage, the modular finding-engine, and the gate metering schema all already exist, so a full end-to-end dry run on fixtures and the two genuine net-new builds (the formal reference section, and wiring the usage attribution) proceed now.

## Ground-truth corrections (2026-06-22 source read)

Observations from reading `hauska-engine`, `hauska-mcp-server`, and `legacy-design-tools` on 2026-06-22, for the next session-close reconciliation (these supersede point-in-time figures in the 2026-06-06 recon, which stays as a dated artifact):

- The Hauska MCP gate exposes 62 tools across four products (public, codex, reporting, map), not the 46-across-three recorded in the 2026-06-06 recon.
- The legacy-design-tools finding-engine runs Grok-first (`AIR_FINDING_LLM_MODE=grok` default; anthropic legacy; mock for CI), consistent with the Property Brief Grok-first note.
- The IccCodeConnect adapter (`hauska-engine/packages/corpus/src/adapters/icc-code-connect/`) is fully built and credential-gated, running OAuth2 client-credentials against `api.iccsafe.org`; its API contract carries nine `@assumption` tags pending ICC's OpenAPI spec.
- The model-code extractor never hosts copyrighted verbatim text (it sets `verbatimTextDeepLink` plus a reasoning layer in `bodyText`), so the layer-in-between guarantee is enforced at ingestion.
- The asserted-confidence baseline for `icc-code-connect` content is 0.78 (interval width 0.35), set in `packages/corpus/src/conformance/mint.ts`.
