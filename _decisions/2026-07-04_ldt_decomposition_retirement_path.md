---
decision_id: 2026-07-04_ldt_decomposition_retirement_path
date: 2026-07-04
owner: Nick
status: active
related_canonical: [56_engine_extraction_sprint.md, 54_tenant_leg_sprint.md, 80_adrs/adr_024_shared_surface_package_architecture.md, 41_revit_connector.md]
---

## Decision

legacy-design-tools retires via a three-piece decomposition on three different clocks: the root design-tools SPA (the old engagement workspace) is declared legacy immediately with zero new work; the Cortex console (today the codex-reviewer-qa app plus the component packages) extracts to its own repo during Phase 3 (working name cortex-console, final name delegated to the planner under the branding canon); cortex-api and the lib packages keep running in place and shrink by absorption (spine takes the adapters, tenancy lands, then the Radar BFF extracts), with the repo retiring only when every function is captured elsewhere.

## Context

Nick identified legacy-design-tools as the biggest entanglement in the portfolio: originally a monorepo whose surfaces conceptually split into the Cortex console and the architecture surface, while its backend became the everything-service (cortex-api serving Cortex workspace, plan review, Property Brief, Radar BFF, GTM and billing). The alternative of retiring the repo wholesale was rejected because cortex-api is live production with 50 migrations; the alternative of keeping the monorepo indefinitely was rejected because the strategic UI lives under a QA-harness name inside a repo scheduled for death.

## Structural commitment check

Commitment 4 (MCP-first / dual interface): supports, the decomposition thins the BFF toward gate-fronted consumption. Hauska spine rule: supports, absorption moves acquisition code to the spine. No premortem yellow; formal premortem-check runs with the Phase 0 execution plan.

## Reasoning

The 2026-07-04 audit established the three pieces have different risk profiles. The root SPA imports zero shared packages and duplicates what cortex-tiles now owns, so declaring it legacy costs nothing beyond a function inventory that gates its eventual removal. The console is the strategic surface all Phase 2 work targets and deserves its own identity and repo before Chris and future contributors build on it. cortex-api cannot move fast because it is prod; its retirement is by attrition, sequenced behind the 56 extraction completion and the tenancy leg, which the Radar BFF extraction is already gated on. A function-by-function captured-elsewhere checklist is the safety mechanism: nothing retires before its capture is verified. The legacy-revit-sensor repoint (it feeds the original cortex app and must survive the architect-app rebuild) rides on that checklist.

## Reversal criteria

Revisit if the function inventory finds a root-SPA capability with no capture path in the console or the spine; if extracting the console breaks the single-image deploy topology (one Cloud Run image currently serves the SPAs and api-server) in a way that costs more than the extraction returns; or if tenancy slips so far that the BFF attrition path leaves the repo half-decomposed across two more program phases.

## Dependencies

Depends on: Phase 3 of the convergence program (console extraction, package rename per 2026-07-04_branding_canon_hauska_substrate_only), the 56 extraction completion, the tenancy leg (54) for the Radar BFF piece. Depended on by: AEC-cortex rebuild (Chris consumes the extracted library), the SmartCity rebuild (later, same library), legacy-revit-sensor repoint.

## Counterparties

Internal. Affects Chris (builds on the extracted console and library) and every cc-agent working ldt dispatches (new-work freeze on the root SPA).
