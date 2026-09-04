---
decision_id: 2026-09-04_p32_wave1_customer_done
date: 2026-09-04
owner: Nick (go-ahead), planner (execution)
status: active
related_canonical:
  - _inbox/2026-08-24_feasibility_v1_plan_DRAFT.md
  - _decisions/2026-09-03_p32_feasibility_unfrozen.md
  - _decisions/2026-09-03_p32_feasibility_tier_ruling.md
  - _inbox/2026-09-04_p32_wave1_close.json
  - _catalog/dispatch_missions/mission_p32_feasibility_assembler_wave1.md
---

## Decision

P-32 wave 1 (the Feasibility Study engine-side assembler, spec items 3-9) is customer-done. Live-graded on real PDF bytes for two real parcels on the promoted production revision, not a merged PR.

## Context

Operator: "i want you to execute it here" — an explicit, deliberate instruction to re-scope this session from doc_repo planner to property seat and execute directly, rather than hand off to a separate session as P-90 and P-115 were. Executed end to end: implementation, tests, PR, CI, merge, canary deploy, live verification, promotion, post-promotion re-verification.

## What was done

Full detail in `_inbox/2026-09-04_p32_wave1_close.json`. Summary: a new `FeasibilityModel` composed engine-side from one `listPropertyAtomsByParcelNodeId()` call (reaching zoning, setback, envelope, flood, CAD roll, land use, owner, special districts, wells, pipelines, footprint — atom types the MCP chain still cannot reach, per the spec's own stated reason for this architecture); a new `emitPdfFeasibility` assembler that reuses `dossier.ts`'s pagination/drawing machinery (additively exported, zero behavior change, dossier's own suite re-verified green) rather than a literal clone; superseded-run arbitration (a parcel-scoped flood study supersedes the statewide screening fact rather than appending a second finding); a generated open-items table; a deterministic, grounded, cited narrative (no LLM call anywhere in the assembler — confirmed before building that no PDF assembler in this codebase calls an LLM inline); an injected who-serves resolver that never blocks the report; an honest HOA shell. New `pdf-feasibility` artifact format on the existing shared `parcel-terrain-model` atom. Minimal `engine-api` routes so the report is genuinely invokable within this repo.

PR #380 merged (`a58310c`), deployed by digest (never `:latest`) to `hauska-engine-api-p32wave1`, canary-verified, promoted to 100%, re-verified on the production base URL for a second parcel after promotion.

## Two things found and named, not hidden

**A live authentication gap, unrelated to this PR's own code.** `engine-api`'s gate-front header check is currently unsigned (a separate, genuinely HMAC-signed layer exists but reads its enforcement mode from an unset env var and defaults to off in this service today). This lane supplied plain, clearly-labeled headers for its own smoke test rather than exploit or hide the gap, and named it in the close rather than silently working around it or silently leaving it unmentioned. Not assessed for whether it's intentional; that's a separate call.

**A genuine, pre-existing cross-derivation disagreement**, surfaced (not caused) by this report: on the gold parcel, the Feasibility summary's buildable-area figure (15,673 sq ft, sourced from a "warm" buildable-envelope atom per `mapBuildableDisplay`'s existing preference) disagrees by 20 sq ft with the appended site-plan sheet's own drawn envelope label (15,653 SF, a fresh ring-geometry recomputation) — both pre-existing code paths, unchanged by this PR. No prior report ever printed both numbers on one page, so this is the first time the disagreement was visible. Same class of finding as `_inbox/2026-09-03_report_vocabulary_and_surface_findings.md`'s hauska-map instances, now confirmed to also exist inside hauska-engine itself.

## Reasoning

The dispatch's own acceptance items required grading on live bytes for real parcels, not a merged PR or a unit-test pass alone — the same discipline this thread applied throughout (P-89, P-90, P-115). Two parcels, one via the pre-promotion canary and one via the post-promotion production URL, both independently confirmed with real, atom-grounded content read directly from the decoded PDF rather than assumed from the JSON summary.

## Reversal criteria

Revisit if a later live probe finds any of the seven items regressed on a subsequent serving revision, or if the buildable-area disagreement above is later ruled a defect requiring a fix (currently named as a finding, not actioned).

## Dependencies

Wave 2 (the PE/`hauska-map` gating leg, plus an MCP tool exposing these routes) is not started. Nothing else in this operation depends on wave 1 closing.

## Counterparties

Internal: Nick (unfreeze, tier ruling, and the "execute it here" go-ahead), property seat (this lane, both the fix and deploy worktrees).
