---
id: adr_023
title: cortex-reporting repo designation and AEC-cortex boundary
status: accepted
date: 2026-07-01
last_updated: 2026-09-02 (DOC-5 amendment ratified — city plan review product logic reassigned to empressaioemail-tech/plan-review)
deciders: [nick]
extends: [adr_008, 2026-06-21_adr008_cortex_reframe_override]
supersedes: []
related: [48_cortex_reporting_plan_review_spec, 47_codex_plan_review, 30_smartcity_os, _inbox/2026-08-24_adr023_amendment_draft, _decisions/2026-08-16_plan_review_extract_and_remount, 90_operations/OPS-17_govtech_stack_plan_of_record]
---

# ADR-023: cortex-reporting repo designation and AEC-cortex boundary

## Context

The 2026-06-21 ADR-008 amendment reframed "Cortex" as the reporting function package rather than a product. It did not name a repo. Two existing repos require explicit boundary assignment:

`legacy-design-tools` holds the reporting and plan review function infrastructure: the api-server (60+ routes for findings, engagements, code review, deliverables, submissions), the plan review artifact (ReviewConsole, ComplianceEngine, FindingsLibrary, CodeLibrary, etc.), the Codex reviewer QA surface, and the hydrology worker. It is the de facto reporting engine.

`AEC-cortex` holds the architect product surfaces: the web application shell and the gate-client package. It is lightly scaffolded and distinct from the reporting engine.

The icc-demo repo scope document explicitly calls for "the plan-review constructed for reuse beyond this demo" and "formalize the existing plan-review shape into a durable module." The existing artifacts/plan-review in legacy-design-tools is that shape.

The command center (hauska-map) established a pattern for white-label internal operator surfaces: function first, no product design, proves each function independently before any product surface consumes it. The plan review engine needs the same proving ground.

## Decision

**Amended 2026-09-02 (DOC-5 ratification, `_inbox/2026-08-24_adr023_amendment_draft.md`).** The `cortex-reporting` function package now spans two serving homes. **City plan review product logic** (finding engine, applicability matrix, edition selection, staff review BFF, adjudication write-back for SmartCity) lives in `empressaioemail-tech/plan-review`, isolated per the 2026-08-16 G-60/A-026 housing decision and built out through OPS-17 Wave 1 (closed 2026-09-02). `legacy-design-tools` retains architect-facing reporting surfaces and remains the cortex-reporting repo for AEC-cortex clients until home A is explicitly remounted or retired. `hauska-engine` is substrate only — corpus, retrieval, atom write paths — not Empressa plan review reasoning (ADR-008, ruling R-D 2026-08-24). The paragraph below is the ORIGINAL 2026-07-01 decision, retained for record; it is superseded for the city-plan-review case by this amendment.

~~`legacy-design-tools` is formally designated as the `cortex-reporting` repo in the architecture taxonomy. It is the reporting function package: plan review engine, code corpus query layer, findings management, adjudication capture, delivery letter generation. It hosts the white-label internal plan review UI (`artifacts/plan-review`) as the proving ground for these functions. No product-facing branding or design applies to this surface.~~

`AEC-cortex` is the architect product repo. It hosts the architect-facing surfaces: renders, design-deliverable UX, BIM integration, design-tools surfaces. It does not host the plan review function.

The relationship is: product surfaces (SmartCity OS, AEC-cortex) call cortex-reporting functions. They do not host those functions. The SmartCity OS plan review surface is a consumer of the cortex-reporting plan review function, not a build target for the function itself.

The hauska-map E6 floating map renderer is the shared spatial primitive. cortex-reporting composes it into the plan review white-label surface. Product surfaces compose it separately.

## Consequences

The Codex 1b build for Bastrop targets `legacy-design-tools/artifacts/plan-review`, not a new SmartCity OS surface. The agent connects the existing ReviewConsole, ComplianceEngine, FindingsLibrary, and CodeLibrary to the Hauska MCP server tools and adds atom write-back for adjudicated findings. SmartCity OS integration is a second pass that calls the cortex-reporting functions once they are proven.

The icc-demo plan review module is the first concrete use case for the cortex-reporting proving ground. Its build posture (live spine, no mock data, no visual design, live MCP) matches the pattern.

The `legacy-design-tools` repo name may be updated to `cortex-reporting` in a future repo rename decision. For now the name is legacy and the function designation is the canonical taxonomy label.

**Added 2026-09-02.** The icc-demo and template-city Wave 1 build targets `plan-review`, not `legacy-design-tools/artifacts/plan-review`. Migration plan for the interim HTTP hop to `hauska-engine` retrieval-api (used by Wave 1 pending this ratification): `_inbox/2026-08-24_govtech_engine_migration_plan.md` (S2-1). S2-1 was blocked on this amendment; it is unblocked as of this ratification, execution not yet dispatched.

## Reversal criteria

If the plan review function proves too tightly coupled to the SmartCity OS data model to stand alone, and the decoupling cost exceeds the build cost of a standalone function package, reverse to co-locating the function in SmartCity OS and mark this ADR superseded.

**Added 2026-09-02.** If S2-1 migration cost exceeds maintaining the thin HTTP hop from `plan-review` to `hauska-engine` retrieval-api indefinitely, the operator may defer S2-1 execution while still accepting this serving-home amendment (`plan-review` owns the BFF; `hauska-engine` remains an external caller). That is a schedule reversal, not a layer reversal.

