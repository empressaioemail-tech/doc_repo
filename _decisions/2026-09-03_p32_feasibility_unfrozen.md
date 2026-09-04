---
decision_id: 2026-09-03_p32_feasibility_unfrozen
date: 2026-09-03
owner: Nick
status: active
related_canonical:
  - _decisions/2026-08-27_report_sku_feasibility_comparison_brief.md
  - _decisions/2026-09-03_p90_engine_pdf_honesty_customer_done.md
  - _inbox/2026-08-24_feasibility_v1_plan_DRAFT.md
  - _decisions/2026-08-24_feasibility_v1_rulings_and_data_capture_program.md
  - _inbox/2026-09-03_report_vocabulary_and_surface_findings.md
---

## Decision

P-32 (the Feasibility Study report engine) is unfrozen. The 2026-08-27 SKU decision's "P-32 stays SCOPED, do not start" no longer holds. Build starts from the already-approved spec at `_inbox/2026-08-24_feasibility_v1_plan_DRAFT.md`.

## Context

P-32 was frozen for a specific, named reason, not a generic hold: the composed Feasibility package appends the site-plan and flood sheet sets under one renumbering, so it would have inherited every honesty defect those sheets carried — parcel-id titles, black UNAVAILABLE chips, no live-view URL, a live-derived envelope percentage where one couldn't be trusted, an engine download path that streamed hollow content. P-90 fixed exactly those defects and is now customer-done, live-graded on real bytes (`_decisions/2026-09-03_p90_engine_pdf_honesty_customer_done.md`). The premise the freeze was conditioned on no longer holds. Operator confirmed explicitly this session ("yes") rather than the freeze lapsing by inference.

## The two questions this thread carried open, addressed rather than silently dropped

**Val's 57-sheet Whitetail Ridge package as the yardstick:** treated as still the target. The operator referenced it again in this same conversation without amending it. If that's wrong, it's a fast correction, not a rebuild — the spec's section table is keyed to Val's sheet numbers but the underlying rails aren't.

**P-85 (courthouse easements) as the acquisition path for section 11 (recorded restrictions):** still genuinely open, and does not block starting. The approved spec already ships section 11 as an honest "not searched" shell with a Smart Files mount slot for exactly this reason — it was speced to degrade honestly without this answer. Acceptance item 9 in the spec builds that shell as designed; reconciling it with P-85 is a follow-up amendment when that call gets made, not a precondition.

## What changed since the spec was written (2026-08-24) that a build session needs to know

**Section 10 (utilities who-serves) is less speculative than the spec assumed.** At spec-writing time this was `need-ingest`. As of this session, a live `/api/who-serves` query path exists (shipped 2026-08-25) returning CCN service territory plus a mandatory honest "SERVICE-LETTER-REQUIRED" residual, and a real write path into the `utilityService` parcel-record rail is mid-build (substrate, separate lane, not gating this one). Section 10 can ship its query-time path now; the stored-rail version lands under it later without a spec change.

**`render.ts`'s header/footer code moved under P-90.** The assembler this spec calls "clone `dossier.ts`" must be cloned from the current `origin/main`, which now includes drawing-only sheet mode, the removed `CAPTURED` chip stub, and `liveViewUrl` threading — not the state the spec was written against on 2026-08-24.

## Reasoning

The spec itself (`_inbox/2026-08-24_feasibility_v1_plan_DRAFT.md`) is the WDLL — 16 sections, 12 acceptance items, dependencies named, already operator-approved with amendments A1-A5 recorded 2026-08-24. This decision doesn't re-approve the spec; it lifts the separate hold that kept it from being built despite being approved. No new WDLL is needed to start; the dispatch compiles directly against the existing spec.

## Reversal criteria

Revisit if a live probe on the shipped Feasibility PDF finds it inherited a P-90-class defect after all (would mean P-90's fix doesn't reach the composed document the way assumed), or if the operator retracts this go before a first version ships.

## Dependencies

Item 2 in the spec's acceptance list (tier ruling — composed PDF as Studio, $15-unlock residual, share as-stored) is proposed but not yet operator-ratified as a decision file. Does not block the engine-side assembler (items 3-9); does block the PE leg (item 10), which enforces the tier gate server-side.

## Counterparties

Internal: Nick (unfreeze + spec approval, both), property seat (build, both `hauska-engine` and `hauska-map`), substrate seat (section 10's rail landing, separate lane, not gating).
