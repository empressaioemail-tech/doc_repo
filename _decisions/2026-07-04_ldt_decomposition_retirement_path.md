---
decision_id: 2026-07-04_ldt_decomposition_retirement_path
date: 2026-07-04
owner: Nick
status: amended
amended_by: 2026-08-08_ldt_is_the_factory_repo
related_canonical: [56_engine_extraction_sprint.md, 54_tenant_leg_sprint.md, 80_adrs/adr_024_shared_surface_package_architecture.md, 41_revit_connector.md, _catalog/repo_intents.md]
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

---

# AMENDMENT 2026-08-08 — clock 3 is WITHDRAWN; ldt is the factory repo

Superseding ruling: `_decisions/2026-08-08_ldt_is_the_factory_repo.md`. Evidence: `_inbox/2026-08-08_SURVEY_ldt_decomposition_state.md` (all claims cited to file:line, live gcloud/npm/curl state).

The decision above is amended, not deleted. Its framing was correct for what was known on 2026-07-04 and its two surviving clocks still stand. What failed is the third clock and, more importantly, the assumption underneath all three: that ldt would shrink as the spine grew. It grew alongside.

## What held

**Clock 1's freeze held at the commit level, and it is the one clean result in the survey.** Zero commits to `artifacts/design-tools` since 2026-07-04. The reasoning that declaring it legacy "costs nothing beyond a function inventory" was sound and the agents honored it.

**The spine extraction that this decision was sequenced behind was real and it worked.** `hauska-engine-api`, `hauska-mcp-server`, and `hauska-retrieval-api` run in their own GCP project with their own repos. The atom contract left cleanly and publishes independently at `@empressaio/atom-contract@1.12.0`.

**The risk-profile analysis was right.** The three pieces did behave differently. The error was not in separating them; it was in assuming all three ended in retirement.

## What did not hold

**Clock 3's retirement mechanism never started. Zero of three named absorptions are complete.** The spine did not take the adapters (`lib/adapters` took 145 file touches in 60 days and nothing moved). Tenancy did not land (no tenants table across 73 migrations; what exists is placeholder columns defaulting to `"default"`). The Radar BFF did not extract, and cannot, because it is gated on the tenancy that did not land; all sixteen brokerage route files remain in `artifacts/api-server/src/routes/`, and several were created during the window.

**Clock 3 did the opposite of shrinking.** `artifacts/api-server` took 902 file touches in 60 days across 94 route files. On 2026-08-08 alone, three commits and five migrations (0068 through 0072) added ten tables: `county_manifest`, `county_rail`, `tx_city_boundary`, `tx_county_boundary`, `rail_state_history`, `rail_verification`, `manifest_run`, `manifest_slot_reservation`, `manifest_slot_queue`, `manifest_jurisdiction_cost`. The county-manifest factory was built here, in a repo whose declared direction was retirement.

**Clock 2 was violated.** 23 post-decision commits, nine of them feature work, latest 2026-07-18; `cortex-tiles` went 0.1.1 to 0.1.12. The extraction to a dedicated repo has not started. The `@hauska` to `@empressaio` rename did land, but INSIDE ldt rather than in an extracted repo, which is the opposite of what this decision specifies.

**Clock 1's freeze did not achieve what the freeze was for.** The code is frozen and the surface is still live. `Dockerfile:66-70` builds four SPAs into the image and the cortex-api root serves `<title>Cortex — Design Accelerator</title>` at HTTP 200 (verified 2026-08-08). This decision wrote the freeze against commits; the surface lives in the Dockerfile. Removing the served surface is the actual remaining task, and it was never the same task as freezing the code.

**The three-clock model no longer covers the repo it governs.** Six units have no clock assignment: `cad-ingest` (a NEW acquisition package created in ldt DURING the retirement window, seven CLIs, 133 touches, now the most active ingest package), `plan-review`, `qa`, `mockup-sandbox`, and two Python sidecars. The image serves four SPAs; this decision assumed two.

## What changes

**Clock 3 is WITHDRAWN as a retirement path and re-scoped.** cortex-api plus the lib packages are the FACTORY AND ACQUISITION HOME. They receive new work by design. "Retire only when empty" is withdrawn. New factory and acquisition work lands in ldt by default and needs no apology or exception.

**Clocks 1 and 2 stand and are now the ONLY retiring parts of this repo.** Clock 1's real task is removing the served SPA surface, not further code freezing. Clock 2 requires an explicit ruling: extract the console or withdraw the extraction. A clock violated for a month is not a plan.

**The unclassified units get classified rather than ignored**, per the rewritten `_catalog/repo_intents.md` row.

## What is unchanged

The reversal criteria above still apply to clocks 1 and 2. The function-by-function captured-elsewhere checklist remains the safety mechanism for anything that does retire, and the legacy-revit-sensor repoint still rides on it. The dependency on Phase 3 for the console extraction stands until clock 2 is ruled on.

## Governance note

For roughly a month `_catalog/repo_intents.md` described a repo that no longer existed, and the master planner dispatched ten tables into it on 2026-08-08 without reading the intent doc. The lesson is recorded permanently in the `_catalog/repo_intents.md` preamble: a canon nobody is forced to read, and whose violation nothing detects, decays into fiction at the speed of the work. This record is amended rather than rewritten precisely so the divergence stays auditable.
