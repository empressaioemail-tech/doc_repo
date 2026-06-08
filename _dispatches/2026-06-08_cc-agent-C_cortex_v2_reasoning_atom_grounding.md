---
id: 2026-06-08_cc-agent-C_cortex_v2_reasoning_atom_grounding
title: Dispatch - Cortex v2 reasoning-atom grounding (lazy-cache, multi-link, retrieve-first)
date: 2026-06-08
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: READY - merge PR #151 first, then build v2 on top
related: [_decisions/2026-06-08_reasoning_not_text_grounding_and_web_first_gtm, _decisions/2026-06-08_websearch_code_grounding_supersedes_interim_atoms, _dispatches/2026-06-08_cc-agent-C_cortex_websearch_code_retrieval, 80_adrs/adr_019_layered_code_substrate, 80_adrs/adr_021_constraint_resolution_and_precedence, 04a_arrow_two_calibration_capture]
---

# Cortex v2 reasoning-atom grounding

> Builds on PR #151 (`cortex/websearch-code-retrieval @ 12a264d`, the v1 web-search fallback). **Merge #151 first** (it is mergeable), then branch v2 from updated main. v1 is transient cite-only; v2 makes the lookups persist as reasoning atoms, multi-linked and retrieve-first, so the corpus accretes from usage and compounds via arrow-two. Frame: [`_decisions/2026-06-08_reasoning_not_text_grounding_and_web_first_gtm.md`](../_decisions/2026-06-08_reasoning_not_text_grounding_and_web_first_gtm.md).

You are **cc-agent-C**, single owner of the `legacy-design-tools` clone.

## The principle (do not violate)

Hauska stores reasoning, not code text. v2 persists a reasoning/citation atom per code reference - structure, our finding, confidence, verification state, and one-or-more source deeplinks - plus at most the short snippet a finding actually quoted. It NEVER stores full verbatim section text as a queryable catalog. Verbatim text is served at read-time by deeplink (now) or licensed display (ICC Code Connect / NFPA, later). This is the line the operator has drawn with ICC and Cotality: no mass files of their codes.

## Model (HR-12)

Grok Build 0.1 default; the existing Opus-4.8 per-sheet vision unchanged.

## Scope

1. **Reasoning-atom persistence (the core change).** Promote the v1 transient `websearch:` `CodeSectionInput` into a persisted reasoning atom. Schema (new table or an extension - your call, keep it out of the public `code_atoms` catalog surface; tenant/product-scoped, accessPolicy distinct from public-free):
   - `codeRef` (e.g. `FBC-M601.6`), `edition` (`FBC 2023`), `jurisdictionKey`
   - `sources`: array of `{ url, sourceName, edition, retrievedAt, verified }` - **multiple links per code reference**
   - `reasoning` / finding text + citation, `confidence`, `verificationState` (`verified` | `unverified-web-source`)
   - `snippet`: optional, length-capped short quote a finding used (cap it, e.g. <= 600 chars); NO full-section field
   - calibration seam: a nullable `calibratedConfidence` / outcome-ref field left for arrow-two ([`04a`](04a_arrow_two_calibration_capture.md)) to populate later - wire the field, do not build calibration here
   - id namespace stays visibly web-sourced (`websearch:`/`reasoning:`), distinct from corpus atom ids

2. **Multi-link accumulation (atoms get smarter).** When a code reference is looked up again from a different source, UPSERT: merge the new `{url, sourceName, edition, retrievedAt, verified}` into the atom's `sources` array rather than duplicating the atom. Same reference accumulates Municode + ICC viewer + UpCodes links over time; redundant links harden retrieval + citation resilience.

3. **Retrieve-first (round 2+).** In `resolveEngineInputs`, after the existing corpus retrieval, query the persisted reasoning atoms for the engagement's jurisdiction/refs BEFORE calling the web fetcher. Web-fetch only the gaps. Round 1 in a new jurisdiction populates; round 2 retrieves local then web-fills. Log the split (`reasoning atoms retrieved` vs `web-filled`).

4. **Read-inline UX via deeplink.** The finding citation surfaces the atom's source deeplink(s) so the architect opens the authoritative text in one click. Leave a clean seam for licensed display (a `displayMode: deeplink | licensed` field) so the ICC Code Connect / NFPA upgrade later swaps deeplink for in-app licensed text without a schema change. Do not build the license integration in this dispatch.

5. **Boundary enforcement (acceptance-gated).** Snippet length capped in code; a test asserts no full-section verbatim text is persisted anywhere (grep the schema + a runtime test that a fetched section's full body never lands in a stored column). The v1 `webCodeNoPersist.test.ts` posture inverts to "persist the reasoning atom, NOT the text" - update it accordingly.

Out of scope: arrow-two calibration logic (seam only); ICC Code Connect / NFPA licensed-display integration (seam only); any change to the public `code_atoms` catalog or the hauska-engine corpus; the cockpit/rendering work.

## Acceptance criteria

- A whole-review on engagement `404 Remodel_B` (`15d1d314-c2fa-42d1-81f9-24eb06d94e3d`) in a non-pre-ingested jurisdiction grounds findings from web lookups, persists reasoning atoms, and a SECOND run retrieves them locally (log shows retrieve-first hit, fewer web fetches).
- A code reference looked up from two sources shows a single atom with two entries in `sources` (multi-link upsert), not two atoms.
- No full verbatim section text persisted anywhere (test + schema grep prove it); snippet cap enforced.
- `verificationState` and per-source `verified` carried through; unverified web sources never presented as high-confidence grounded.
- Finding citations render the source deeplink(s); the `displayMode` seam exists for later licensed display.
- `pnpm run typecheck` green; `lib/finding-engine` + `lib/codes` tests green; new persistence + multi-link + retrieve-first + no-verbatim tests added.
- PR held for operator merge; branch + SHA reported.

## Reporting

At break-point, write to `P:\doc_repo\_inbox\` as `2026-06-08_legacy-design-tools_cc-agent-C_cortex_v2_reasoning_atom_grounding.md`: the #151 merge SHA, files/schema touched, model used, PR URL + branch SHA, the live two-run retrieve-first log on 404 Remodel_B (round 1 populate, round 2 retrieve-first), the multi-link upsert proof, the no-verbatim-text test output, and blockers verbatim.
