---
date: 2026-05-22
agent: cc-agent-E
repo: hauska-engine
session_type: execute
rolled_up: true
rolled_up_into: [00_current_state]
---

# ICC Code Connect prebuild — extractor + eval rubric (deliverables 2 + 3)

**Status: deliverables 2 and 3 built and opened as hauska-engine PR #25
and PR #26, both CI green. Operator-supervised — PRs opened, not merged.
The ICC Code Connect prebuild dispatch is now complete across both
sessions (D1 PR #24 merged, D4 corpus-edition plan resolved, D2 + D3
here). Next: resume Sync 5 Tier 1 — Georgetown.**

```
$ gh pr checks 25 / 26
PR #25  typecheck + test  pass  35s
PR #26  typecheck + test  pass  42s
```

Continuation of the ICC Code Connect pre-credential build-out
(`2026-05-22_cc-agent-E_icc_code_connect_prebuild`), after the adapter
(PR #24) merged.

## Deliverable 2 — model-code structural extractor (PR #25)

`packages/corpus/src/model-code/extractor.ts`.
`extractModelCodeAtoms(document: IccCodeDocument, options)` turns a
Code Connect edition into the four Layer 1 atom types: `code-edition`,
`code-section`, `code-cross-reference`, `code-definition`.

It is deliberately distinct from the generic `atomization.atomize()`,
because ADR-019's interim deep-link footing makes a Layer 1
`code-section` structurally different from a hosted Layer 2/3 section:

- `verbatimTextDeepLink` is set, to ICC's free Digital Codes viewer
  (preferring a Code Connect `viewerUrl`, else synthesized).
- `bodyText` carries the reasoning layer — a structural summary — not
  the verbatim normative text. The model-code text is ICC-copyrighted;
  the verbatim text Code Connect returns is consumed only as input to
  the reasoning step and to cross-reference / definition detection,
  then discarded.

The reasoning-layer generator is a provider-agnostic hook with a
deterministic non-LLM default that composes from structure alone
(heading, chapter, edition, table/figure counts, cross-references,
defined terms) and never reads the verbatim prose — so the default
cannot leak copyrighted text. The Claude wiring is a CLI-layer concern,
mirroring the `curated-queries` `LlmQueryGenerator` pattern.

Layer 1 ingests under the synthetic `icc-model-code` tenant (shared
base, not a city tenant); the edition carries no amendments —
jurisdictional modifications are Layer 2 overlay atoms. 9 tests against
the IRC 2021 adapter fixture, including the ADR-019 invariant that no
section's verbatim prose reaches `bodyText`.

## Deliverable 3 — Layer 1 eval rubric (PR #26, stacked on #25)

`packages/corpus/src/model-code/eval-rubric.ts`.

- `LAYER_1_QUALITY_BAR` — the rubric: a strict 1.0/1.0/1.0 (top-3
  retrieval, section-number retrievability, cross-reference
  resolution), the bar the Sync 4/4.5/5 jurisdiction ingests achieved.
  The model-code base is shared substrate under every adopting
  jurisdiction, so the bar is the ceiling, not the
  `DEFAULT_QUALITY_BAR` floor (0.9/1.0/0.95).
- A seed curated query set for the first-wave 2021 IRC edition —
  reviewer-realistic retrieval queries whose `expectedAtomDid`s are
  computed from the extractor's entityId scheme, so rubric and
  extractor cannot drift. Edition-keyed in `LAYER_1_CURATED_QUERIES`;
  the IBC/IECC sets follow the same pattern when those editions ingest.

Authored ahead of the corpus per the dispatch ("it cannot run until the
corpus exists; author it now so it is ready"). The seed pins the
pattern; the full ~50-100-query-per-edition set is extended via the
`curated-queries` reviewer-zero flow once the live corpus exists. 5
tests — rubric value, well-formedness, `expectedAtomDid` consistency
with the extractor, and a retrieval smoke test running the real
`evaluate()` harness against the fixture (top-3 retrieval and
section-number coverage both 1.0; cross-reference resolution is not
asserted at 1.0 against the four-section fixture slice — most
cross-references target sections outside it, which a complete edition
would carry).

## Stacking note

PR #26 is stacked on PR #25 (the eval rubric imports the extractor's
`modelCodeSectionEntityId`). Merge order is #25 then #26; GitHub
retargets #26 to `main` on #25's merge. Both per the dispatch's
one-PR-per-surface guidance.

## ICC prebuild dispatch — complete

All four deliverables are done:
- D1 ICC Code Connect adapter — PR #24, merged.
- D2 model-code structural extractor — PR #25, open.
- D3 Layer 1 eval rubric — PR #26, open.
- D4 corpus-edition plan — resolved in the prior session's `_inbox`
  report (`2026-05-22_hauska-engine_cc-agent-E_icc_code_connect_prebuild.md`):
  three-wave ingest, 2021 IRC/IBC/IECC first.

The explicit "needs confirmation from the OpenAPI spec" list is in that
prior report; it stands. When the operator returns from the ICC meeting
with credentials + the spec, Layer 1 ingest is: reconcile the assumed
contract against the spec, populate `ICC_CODE_CONNECT_CLIENT_ID` /
`_SECRET`, run the adapter → extractor → write atoms, extend the
curated query set, run `evaluate()` with `LAYER_1_QUALITY_BAR`.

## Re-entry state

hauska-engine: PR #25 + #26 open; CI green on #25. Per the dispatch's
activation note and the operator's instruction, the next work is the
remaining Sync 5 Tier 1 cities, **Georgetown next**, then Pflugerville
and Cedar Park. That resumes from `main` (after #25/#26 merge, to build
on the icc-code-connect work if a city adopts I-Codes, though Sync 5
Tier 1 is Layer 3 bespoke-code ingest and does not depend on it).

---

*Filed from `_inbox/` by the planner sweep, 2026-05-22. Findings rolled into `00_current_state.md` (cc-agent-E fleet status). Operator action surfaced: PRs #25 and #26 await merge (#25 then #26).*
