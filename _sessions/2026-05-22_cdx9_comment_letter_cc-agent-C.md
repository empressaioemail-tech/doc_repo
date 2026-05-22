---
date: 2026-05-22
agent: cc-agent-C
repo: legacy-design-tools
session_type: execute
rolled_up: true
rolled_up_into: [00_current_state, 48_codex_program_plan, 11_roadmap]
---

> Filed by the doc_repo planner from the cc-agent-C `_inbox/` courier
> drop per HR-11. PR #72 verified **OPEN** via `gh pr view 72`
> (`state: OPEN`, `mergeable: MERGEABLE`, `mergeStateStatus: CLEAN`,
> commit `deb288a`). CI run `26293934017` (`PR Checks`) `conclusion:
> success`, `headSha` matches. **Awaiting operator merge.**
>
> **Planner ruling on the flagged divergence — option 1, confirmed.**
> Finding-intrinsic adjudication satisfies structural commitment 1: each
> comment-letter section names the exact adjudicated finding atom (for an
> edited finding, the revision atom plus the original), and that finding
> carries its adjudication inline (`status` / `reviewerStatusBy` /
> `reviewerStatusChangedAt`). The `adjudicationStateIds` slot on the L3
> `LetterSectionProvenance` is a DA-side provenance field with no
> Codex-side referent; the Codex surface legitimately leaves it empty. No
> Codex adjudication-state atom is to be minted — that would duplicate
> state already pinned on the finding and is an unwarranted engine
> scope-add. This is consistent with the CDX-4 ruling (Codex adjudication
> is finding-intrinsic, no dedicated atom). What cc-agent-C built is
> correct; no further work. CDX-9 is delivered.

# CDX-9 — Codex comment-letter auto-draft

**Status: built, PR #72 OPEN, CI green, awaiting review. Operator-
supervised per the dispatch — PR opened, not merged.**

CDX-9 (`48_codex_program_plan.md` Phase 2) adds a comment-letter
auto-draft to the `codex-reviewer-qa` surface, reusing the existing
Cortex L3/L6 deliverable-letter pipeline. No deliverable-letter backend
was built — the dispatch's "reuse, do not rebuild" constraint held.

## What shipped

- A "Draft comment letter" action on `ReviewPage`. It composes the
  current submission's accepted + edited findings into a Cortex L3
  `deliverable-letter` (cover / intro / per-comment-response... /
  signature), creates it through the existing L3 endpoints, then merges
  per-section finding provenance, and routes the reviewer to the letter
  view. Rejected and un-adjudicated findings are excluded.
- `CommentLetterPage` at `/letter/:letterId` — the drafted letter
  rendered section by section, each section editable inline, a
  completeness indicator, and the L6 render-to-DOCX/PDF + download +
  PDF-preview affordance. Mirrors the L3 `DeliverableLettersTab`
  conventions in the codex-reviewer-qa inline-style idiom.
- Every per-comment-response section body carries the engine's full
  finding text, the governing code citations, and the confidence score
  (structural commitment 1 — sell reasoning, not data). Section
  provenance names the exact adjudicated finding atom(s).

## Diagnose-first result

Read the L3 (`routes/deliverableLetters.ts`) and L6
(`routes/deliverableLetterRenders.ts`) endpoints, the `deliverable-letter`
/ `deliverable-letter-render` atom shapes, and the generated
`@workspace/api-client-react` client against source before building.
The pipeline carries everything CDX-9 needs; CDX-9 is purely a new
consumer. One divergence surfaced, below.

## Divergence — needs a planner ruling

The L3 `LetterSectionProvenance` has four id arrays: `responseTaskIds`
(L1), `sheetContentExtractionIds` (L2), `findingIds` (finding atoms),
and `adjudicationStateIds` ("adjudication-state atom entityIds"). The
CDX-9 dispatch's hard requirement says each section must name "the exact
Codex finding and adjudication atom it was generated from."

There is no Codex-side adjudication-state atom. CDX-4 records an
adjudication as finding-intrinsic state: accept / reject stamp `status`,
`reviewerStatusBy`, and `reviewerStatusChangedAt` directly on the
finding row; an override stamps the original `overridden` and mints a
new finding **revision** atom carrying the reviewer-edited text. There
is no `adjudication` table and no `adjudication-state` atom type
anywhere in `legacy-design-tools` or the mirrored L-surface atoms.

CDX-9's resolution, built and shipped: a per-comment-response section's
`findingIds` provenance names the exact adjudicated finding atom — for
an edited finding, both the revision atom and the original AI atom it
revised. That finding atom carries its adjudication inline (`status` +
`reviewerStatusBy` + `reviewerStatusChangedAt`). `adjudicationStateIds`
is left empty: it has no Codex-side referent. The provenance commitment
is met — every section names the exact finding it was generated from,
and that finding is self-describing as to its adjudication.

**Planner call needed:** confirm one of —
1. Finding-intrinsic adjudication satisfies the commitment, and
   `adjudicationStateIds` is a DA-side-only slot the Codex surface
   legitimately leaves empty (no further work); or
2. The Codex reviewer surface should mint a distinct adjudication-state
   atom. That is engine + atom-shape scope (cc-agent-E) plus a new
   legacy persistence path — well beyond CDX-9, and the dispatch said to
   flag a real gap rather than build a tool/atom unprompted.

Recommendation: option 1. The finding atom already is the unit of
adjudication on the Codex surface; a parallel adjudication-state atom
would duplicate state already pinned on the finding.

Secondary diagnosis note (no action needed): `GET /submissions/{id}/findings`
returns every row, including both halves of an override (the superseded
original and the revision, both stamped `overridden`). CDX-9's
eligibility filter handles this — it includes the revision
(`overridden` with a `revisionOf`) and excludes the superseded original
(`overridden` with no `revisionOf`).

## Out of scope (deliberate)

- The draft to sent transition (L3 `send` endpoint) is not duplicated
  on this surface — it is L3 design-tools functionality; CDX-9's
  deliverable is the DOCX/PDF download.
- No new MCP tool. A `deliverable-letter` is the same atom regardless of
  which product drafts it, so the existing `cortex/deliverable_letter_*`
  tools already cover the Codex-drafted letter (dual-interface satisfied
  through the shared pipeline, per the dispatch).

## Verification

```
$ gh pr view 72 --json number,title,state
{"number":72,"state":"OPEN","title":"feat(codex-reviewer-qa): CDX-9 comment-letter auto-draft"}
```

Full workspace `pnpm run typecheck` passes locally (exit 0, all 31
projects). Vitest was not run locally — the Windows workstation cannot
run the vitest/esbuild toolchain; CI Linux is authoritative. CI on
PR #72 (run 26293934017) is green:

```
$ gh pr checks 72
Test       pass   6m22s   .../job/77401269893
Typecheck  pass   1m37s   .../job/77401269911
```

New tests: `commentLetter.test.ts` (eligibility filter, provenance id
mapping, section composition, reasoning/citation/confidence in the
body), `CommentLetterPage.test.tsx` (load states, completeness gating,
provenance display, L6 render trigger, download link, read-only when
sent), and three added `ReviewPage.test.tsx` cases (draft-button gating
+ a draft producing the L3 create + provenance-merge calls).

## Files

New: `artifacts/codex-reviewer-qa/src/lib/commentLetter.ts`,
`commentLetter.test.ts`, `commentLetterApi.ts`,
`pages/CommentLetterPage.tsx`, `pages/CommentLetterPage.test.tsx`.
Modified: `pages/ReviewPage.tsx`, `pages/ReviewPage.test.tsx`,
`App.tsx`. Committed as `deb288a`; the four stray pre-existing modified
test files in the clone were kept out via explicit per-path `git add`.

## Re-entry state

Branch `codex-reviewer-qa/cdx-9-comment-letter` pushed; PR #72 open
against `main`. Next: CI green + review, then merge is operator-led.
