---
decision_id: 2026-06-08_websearch_code_grounding_supersedes_interim_atoms
date: 2026-06-08
owner: Nick
status: active
supersedes_in_part: 2026-06-08_miami_beach_plan_review_hybrid_bootstrap
related_canonical: [40i_cortex_dallas_e2e_grok_plan_review_sprint, 08_tiered_access_model, 01a_atom_conventions, 00_current_state]
related_adr: [80_adrs/adr_019_layered_code_substrate]
related_dispatch: [_dispatches/2026-06-08_cc-agent-C_cortex_websearch_code_retrieval]
---

## Decision

Ground the Miami Beach plan review's Layer-1 model-code citations (and, as a reusable pattern, any code outside the atomized corpus) via an on-demand web-search code-retrieval fallback inside Cortex, not via the interim `ungrounded-pending-ICC` / `ungrounded-pending-NFPA` placeholder atoms specified in the bootstrap decision. Given a code reference, edition, and jurisdiction, the fallback fetches verbatim section text from an authoritative-source allowlist (floridabuilding.org, the ICC public-access viewer, NFPA free access, UpCodes), verifies edition and section, and hands the engine a grounded `CodeSectionInput` carrying source URL, retrieved-at, edition, and confidence. This supersedes only the Layer-1 grounding method of the bootstrap's P1 phase. The PDF text extraction, Miami Beach and Miami-Dade Municode warmup, PDF-page render, and Opus-4.8 per-discipline vision already built on branch `cortex/whole-review-vision-miami` are unchanged. The gated cc-agent-E ICC/NFPA engine cutover is unchanged and remains the durable, licensed home for this text; web retrieval is the interim grounding the cutover later replaces.

Two boundaries are load-bearing, not optional. First, web-fetched verbatim model-code text is transient, review-scoped, and attribution-bound; it is not persisted as redistributable `public-free` corpus atoms. The catalog gets licensed text from the ICC and NFPA tracks, never from this fetch. Second, the fetcher is constrained to the authoritative-source allowlist, verifies that returned text matches the requested edition (FBC 2023, Florida Mechanical 2023 8th ed, NEC 2017, not adjacent editions) and section, and on any mismatch or low-confidence extraction returns the result flagged `unverified-web-source` with downgraded confidence rather than a confident grounded citation.

## Context

The bootstrap decision grounded FBC/I-Code and NEC sections with placeholder atoms that name a section and a deep link but carry no code text, with real text gated behind the ICC meeting this week. The finding engine cannot check a drawing against a placeholder; it can only name the section. Operator direction 2026-06-08: fetch the actual code text on demand by web search from sources where it is freely available, and build it as a general fallback for codes outside the atomized corpus rather than a Miami-only patch. This grounds the review today and removes the hard dependency on the gated ICC cutover for grounded Layer-1 coverage.

## Structural commitment check

Pre-mortem run 2026-06-08 via the premortem-check skill. Sell-reasoning (1, load-bearing): yellow resolved to green by the transient, attribution-bound boundary above plus distinct `websearch:` citation ids, so the move grounds reasoning with live provenance rather than hosting data. Partnership-first (2, load-bearing): green; FBC and NEC are state-adopted model codes and public-records baseline, explicitly outside the partnership-first refusal scope per `_decisions/2026-05-23_partnership_first_scoping.md`, so no city is locked out of revenue share. Cost-per-jurisdiction (3, load-bearing): green; on-demand per-query fetch carries trivial marginal cost and removes the need to ingest a Florida Layer-1 corpus to reach a grounded review. Quality gate (7, operational): yellow resolved to green by the allowlist, edition and section verification, confidence downgrade, and the `unverified-web-source` flag, with a wrong-edition refusal test as acceptance. Overall green on both conditions.

## Reasoning

Grounded-with-provenance beats empty shells on the only axis that matters for a real review, which is whether the engine has code text to check the drawing against, and it de-risks the schedule by cutting the gated ICC meeting out of the critical path for a grounded Layer-1 read. Building it as a jurisdiction-agnostic fallback turns a Miami patch into a reusable substrate primitive that backstops every jurisdiction not yet ingested. The transient-fetch-with-attribution boundary keeps the move on the right side of the sell-reasoning contract and is the posture worth stating plainly in the ICC room.

## Reversal criteria

Reverse to the interim deep-link footing (section number plus link, no text, wait for the licensed tracks) if the authoritative web sources cannot be edition-verified reliably enough to keep the false-grounding rate acceptable, in which case electrical and model-code coverage stay reference-only until the ICC and NFPA tracks land. If persisting fetched text as queryable corpus ever becomes necessary, that is the licensed ICC/NFPA cutover by definition, not this fallback, and it routes to the cc-agent-E dispatch, not here.

## Dependencies

Builds on branch `cortex/whole-review-vision-miami` (SHA `76c0bcb`). Execution dispatch: `_dispatches/2026-06-08_cc-agent-C_cortex_websearch_code_retrieval.md`. Does not depend on the ICC meeting, the gate-to-engine wiring, or the cc-agent-E cutover, all of which proceed on their own tracks.

## Counterparties

Internal. cc-agent-C (legacy-design-tools). Serves an external Hauska investor's live permit project at 5225 Collins Ave; no counterparty commitment is made beyond delivering the review.
