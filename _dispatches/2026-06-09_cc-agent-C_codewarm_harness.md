---
id: 2026-06-09_cc-agent-C_codewarm_harness
title: Dispatch — cold-warm batch harness (web-first reasoning atoms, corpus-aware, calibration-preserving)
date: 2026-06-09
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: HELD - do not fire until the operator and the plan-review session clear 57_national_code_warming_sprint and the field contract
related: [57_national_code_warming_sprint, _decisions/2026-06-09_codewarm_arrow_two_combined, _decisions/2026-06-08_reasoning_not_text_grounding_and_web_first_gtm, 04a_arrow_two_calibration_capture, 80_adrs/adr_019_layered_code_substrate, 20_agent_operating_rules, _catalog/codes]
---

# Cold-warm batch harness

> HELD for operator + plan-review clearance. Builds the batch job that warms the national reference manifests into cortex-local reasoning atoms. This is Phase 0 of [`57_national_code_warming_sprint.md`](../57_national_code_warming_sprint.md) and blocks the warming runs. Builds on the merged v1 `fetchCodeSection` (`lib/codes`) and v2 reasoning-atom persistence (migration 0035). Verify identifiers against live source before building.

You are **cc-agent-C**, single owner of the `legacy-design-tools` clone.

## The principle (do not violate)

Hauska stores reasoning, not code text. The harness persists citation/structure reasoning atoms (reference, edition, multi-deeplink, asserted confidence, verification state, snippet at most 600 chars). It NEVER stores full verbatim section text and NEVER fabricates a building-specific finding (cold-warm has no drawing). Verbatim text is served at read-time by deeplink, or licensed display later.

## Model (HR-12)

Grok Build 0.1 default; escalate to Claude only on failure after retry, log it.

## Read first

1. [`57_national_code_warming_sprint.md`](../57_national_code_warming_sprint.md) - the two-stores-one-overlay design, field contract, precedence
2. [`_decisions/2026-06-09_codewarm_arrow_two_combined.md`](../_decisions/2026-06-09_codewarm_arrow_two_combined.md) - the eight clean-base commitments
3. [`04a_arrow_two_calibration_capture.md`](../04a_arrow_two_calibration_capture.md) - why the calibration columns must be preserved on UPSERT
4. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) - HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

Clone `P:\legacy-design-tools`, branch prefix `codewarm/`. One agent per clone. Refuse alien HEAD or uncommitted state; report verbatim `git status` and `git log -3`.

## Scope

1. **Migration 0036, the field split.** Formalize `assertedConfidence` (cold-warm-owned) distinct from the nullable `calibratedConfidence` seam (arrow-two-owned) on `reasoning_atoms`. If 0035 carries a single `confidence` column, migrate it to `assertedConfidence` and add the calibration columns as nullable. Reserve 0037 for arrow-two Phase 3; do not consume it here. Sequence migrations; never run 0036 and an arrow-two migration concurrently on this clone.

2. **Batch warming entry point.** A CLI/job that reads a manifest (the `_catalog/codes/manifest_*.yaml` shape: code, edition, section, title, discipline, traffic, optional verify flag, optional grounding flag) and drives, per reference, the existing v1 `fetchCodeSection({codeRef, edition, jurisdictionKey})` then the v2 reasoning-atom UPSERT persist. Output per reference is a citation/structure atom: reference, edition, snippet (<=600 chars), one-or-more source deeplinks, asserted confidence, verification state. No finding. No verbatim body.

3. **Calibration-preserving UPSERT (load-bearing).** `ON CONFLICT` updates only the asserted fields, `verificationState`, `retrievedAt`, and merges the sources array. It MUST preserve `calibratedConfidence` and any calibration metadata. Test: warm a ref, write a sentinel `calibratedConfidence`, re-warm, assert the sentinel survived.

4. **Corpus-aware (precedence corpus > reasoning > web).** Before warming a reference, query corpus coverage (the same jurisdiction-scoped retrieval the finding path uses). Where the corpus already covers the reference, do not re-ground text: record the reference in the reasoning layer with its multi-deeplink and leave the calibration overlay to attribute via lineage. Warm full only the gaps. Log the split (corpus-covered vs warmed).

5. **Edition/section verification + grounding flags.** Inherit the v1 allowlist and edition/section check. On mismatch or low-confidence extraction, persist with `verificationState: unverified-web-source` and downgraded asserted confidence, never a confident citation. Honor manifest grounding flags: `verify-existing-corpus` references are diffed against corpus and skipped if present; `NFPA-license-required` references persist as deeplink-only reference atoms (nfpa.org), never grounded text.

6. **Cost + dry-run.** Per-batch `cost-record` and a configurable budget cap that halts the batch when exceeded. A dry-run mode that resolves and verifies without persisting, for the verification recon in the runs dispatch.

7. **Boundary enforcement (acceptance-gated).** Snippet length capped in code; a test asserts no full-section verbatim text is persisted anywhere (schema grep + runtime test). No-finding-on-cold-warm asserted.

8. **Spine-migration seam (build discipline, load-bearing).** This substrate is engine-core cargo, not BFF code. Build the warming logic, the reasoning-atom schema, and the (later) calibration overlay behind a clean package boundary (a `lib/` package with no UI/session/auth dependencies), so it lifts to `hauska-engine/packages/engine-core` with the finding engine as part of the engine extraction (`56_engine_extraction_sprint.md` step 4) without a rewrite. Do not weave it into route handlers or product glue that stays in the thinned BFF. Reference: the reasoning corpus is queried by all products through the gate, not a Cortex-local feature; calibration is a spine-wide invariant (`55` Section 7).

Out of scope: the warming runs themselves (separate dispatch); arrow-two Phase 3 calibration computation (separate dispatch, migration 0037); any change to the public `code_atoms` catalog or the hauska-engine corpus; licensed-display integration (seam only).

## Acceptance criteria

- Migration 0036 splits asserted/calibrated; 0037 reserved and untouched.
- Batch entry point warms a small fixture manifest end to end, producing citation/structure atoms with multi-deeplink + asserted confidence + verification state + capped snippet, no finding, no verbatim body.
- Calibration-preservation test passes (sentinel survives re-warm).
- Corpus-aware split logged; corpus-covered references are not re-grounded.
- Wrong-edition / unverifiable references flagged `unverified-web-source`, never confident.
- `verify-existing-corpus` and `NFPA-license-required` grounding flags honored.
- Per-batch cost recorded; budget cap halts; dry-run persists nothing.
- No-verbatim boundary test passes; `pnpm run typecheck` green; `lib/finding-engine` + `lib/codes` tests green.
- PR held for operator merge. Branch + SHA reported.

## Reporting

At break-point write to `P:\doc_repo\_inbox\` as `2026-06-09_legacy-design-tools_cc-agent-C_codewarm_harness.md`: migration numbers used, files/schema touched, model used, PR URL + branch SHA, the fixture warm log (corpus-covered vs warmed split), the calibration-preservation test output, the no-verbatim test output, and blockers verbatim.
