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
