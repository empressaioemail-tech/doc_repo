---
id: 2026-07-01_bastrop_plan_review_thread
title: Bastrop plan review — working thread and context for the planning agent
date: 2026-07-01
type: dispatch-thread
status: active
applies_to: smartcity-os, codex, hauska
owner: nick
related: [11a_bastrop_live_roadmap, 06_cities_value_narrative, 47_codex_plan_review, 30_smartcity_os, 75n_icc_code_connect_catalog]
---

# Bastrop plan review — working thread

This document is the context package and working plan for the planning agent taking over the Bastrop plan review thread. It is the single place to track what is known, what is decided, what the immediate build tasks are, and what the bigger strategic frame is.

## What exists today at Bastrop

SmartCity OS is live in Bastrop production. Sylvia Carrillo (planning director / city contact) and Jaime (tech contact) are the operator-zeros. The platform already runs:
- MyGov integration: cron-scraping permit records into mygov_permits and related tables; this is the current plan intake mechanism for the city
- Power BI repoint to Dynamics DB: completed as PR #23 in smartcity-os, dispatched 2026-06-08 via cc-agent-M, all CI green; awaits operator merge + smartcity-api deploy
- Compass V4: AI surface over operational atoms; Sylvia can query operational data in natural language today
- Calendar integration: BeWith calendar enrichment dispatch filed 2026-06-10; one small update to the calendar setup is owed (see operator note below)

What Bastrop does NOT have yet:
- The Codex plan review surface (Codex 1b) inside SmartCity OS
- Any connection between the city's plan review workflow and the Hauska spine atoms
- ICC building code content (IBC 2018 + IPMC 2018) in the engine corpus; the adapter is built and credentials just landed (see 75n_icc_code_connect_catalog.md)

## Current plan review workflow at Bastrop

- **Intake**: Plans arrive as PDFs via MyGov (the city's permit portal). MyGov is already being scraped by SmartCity OS.
- **Review**: Reviewers mark up plans in Bluebeam (or equivalent). This is the tool to augment, not replace. Findings today go into comment letters that live in email and PDFs; they do not feed operational data.
- **Decision**: Permit approved, approved with conditions, or denied. Only the outcome reaches SmartCity OS; the reasoning is lost in PDFs.

The gap: the substance of review (which findings, against which code section, with what reasoning) never enters the city's data. When a property comes back fifteen years later, or when the city wants to know its most common drainage finding, that information is gone.

## What the Hauska spine adds

The code corpus already contains Bastrop's UDC: 193 atoms, public-free, ingested via RawPdfAdapter. ICC IBC 2018 and IPMC 2018 are now unlocked (credentials live as of 2026-07-01; hauska-engine-api revision 00017-cuy deployed). Once the ingest runs, Bastrop reviewers will have:
- The full UDC at section granularity, cited and calibratable
- IBC 2018 at section granularity (plan review standard)
- IPMC 2018 at section granularity (property maintenance)

The Codex 1b surface sits in SmartCity OS and gives city reviewers an applicability matrix (which code sections apply to this submittal), automated compliance checks per section, and a reviewer adjudication layer. Findings become atoms. Atoms are queryable.

## The strategic frame: getting Bastrop off the island

Today SmartCity OS at Bastrop is somewhat isolated: it runs Bastrop's operational data but its plan review reasoning does not flow into the Hauska graph. The plan review build closes this gap. When Codex 1b is live and findings are atoms, Bastrop is part of the spine. That means:
- Bastrop's review precedents become calibration signal for the engine
- Cross-jurisdictional queries ("how have similar cities handled this interpretation?") become possible once the second city is on the spine
- The confidence system earns against Bastrop's actual adjudications — that is the calibration commitment becoming real
- Bastrop is no longer a demo partner; it is the first node in a jurisdictional network

This is the path from SmartCity OS tenant to spine participant.

## Immediate build tasks (ordered)

### Task 0 — Operator: calendar update (small, owner Nick)
One small update to the BeWith calendar configuration at Bastrop is owed per the 2026-06-10 dispatch. This is not a build task for the planning agent; it is an operator action. Nick completes this out-of-band.

### Task 1 — Operator: merge the Power BI PR
PR #23 in smartcity-os (Bastrop CIP Power BI repoint to Dynamics DB) is mergeable and all CI is green. Operator merges it, then runs the smartcity-api deploy canary. Jaime has the stakeholder note ready.

### Task 2 — cc-agent-E: ICC ingest (IBC2018P6 + IPMC2018P2)
BLOCKED on the ICC contract verification. Once the real API contract is confirmed (token endpoint, field names, titleId values), dispatch cc-agent-E to run the ingest of IBC2018P6 and IPMC2018P2 via the existing ICC Code Connect adapter in hauska-engine. The adapter is at `packages/corpus/src/adapters/icc-code-connect/`. The ingest produces atoms with:
- accessPolicy: platform-internal (no public exposure until SaaS agreement)
- derived_ok: false (no pooling into calibration)
- Provenance tracing to book_id + section_id at the atom level for wind-down compliance

### Task 3 — cc-agent-C: Codex 1b plan review surface in cortex-reporting (legacy-design-tools)

**COURSE CORRECTION — filed 2026-07-01 per ADR-023.** The plan review surface does NOT build inside SmartCity OS in this pass. It builds in `legacy-design-tools/artifacts/plan-review`, which is the cortex-reporting white-label proving ground per ADR-023.

The plan review artifact already has the core pages (ReviewConsole, ComplianceEngine, FindingsLibrary, CodeLibrary, EngagementsList, etc.). The cc-agent-C dispatch targets connection and completion, not reconstruction:
- Wire ComplianceEngine and AIBriefingPanel to Hauska MCP server tools (code corpus retrieval + atom fetch)
- Connect CodeLibrary to IBC 2018 and IPMC 2018 atoms with canonical citation display (no verbatim text)
- Add adjudication atom write-back from DecideModal / ComplianceEngine overrides to hauska-engine
- Compose the E6 floating map renderer (from hauska-map) into engagement intake and applicability matrix views
- Prove all seven function surfaces independently per `48_cortex_reporting_plan_review_spec.md`

SmartCity OS integration is a second pass. After the white-label surface proves all seven functions, SmartCity OS calls cortex-reporting via API. No plan review logic builds inside SmartCity OS in this wave.

See `_dispatches/2026-07-01_bastrop_course_correction.md` for the paste-ready course correction addendum to give the Bastrop planning agent.

### Task 4 — cc-agent-M: connect SmartCity OS review findings to the Hauska atom graph
Reviewed and adjudicated findings from the Codex 1b surface write back as atoms into the engine (finding atoms, adjudication atoms). This closes the loop: MyGov intake → plan review → findings as atoms → Compass AI can query → cross-jurisdictional calibration can run.

## What is out of scope for this thread

- Bluebeam direct integration (Codex 1a invited mode) — this is post-Bastrop-live per 11a_bastrop_live_roadmap.md
- Applicant-facing portal — second wave
- Cross-jurisdictional precedent queries — requires a second city on the spine
- Inspector and contractor surfaces — 18+ months per 06_cities_value_narrative.md

## Key people

- Sylvia Carrillo: Bastrop city contact (planning director / city manager level). Owner of the relationship. Conversation style: operational and practical; she needs to know what Jaime will see and do, not product feature names.
- Jaime: Bastrop tech contact. Runs the operational dashboards, handled the Dynamics DB migration. Will be the one who actually deploys and operates the plan review surface day-to-day.
- Nick: operator. Owns all strategic decisions and the relationship with Sylvia.

## Docs to read before building anything

1. `11a_bastrop_live_roadmap.md` — the full two-track plan (Track A: Codex 1b live; Track B: code ingestion pipeline)
2. `06_cities_value_narrative.md` — the Sylvia/city-manager framing for the plan review conversation
3. `47_codex_plan_review.md` — the Codex product home
4. `30_smartcity_os.md` — what SmartCity OS is and what it currently does at Bastrop
5. `75n_icc_code_connect_catalog.md` — ICC credential constraints (accessPolicy, derived_ok, wind-down requirements)
6. `00_current_state.md` — current portfolio state including calibration gate and M1 status

## Open questions (for Nick)

1. Calendar update: what exactly needs to change in the BeWith calendar config? (Operator action; planning agent does not touch this.)
2. After the Power BI PR merges, does Jaime need a walkthrough, or does he have enough from the stakeholder note?
3. For the Codex 1b surface: does Nick want the reviewer UI to be a standalone tab in SmartCity OS, or integrated into the existing permit workflow screens?
4. ICC PoC demo: when is the right moment to arrange the demo with ICC? (Demo must happen before any customer-facing exposure of IBC/IPMC content.)
