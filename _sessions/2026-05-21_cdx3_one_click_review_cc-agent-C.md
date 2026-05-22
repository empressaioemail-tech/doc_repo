---
date: 2026-05-21
agent: cc-agent-C
repo: legacy-design-tools
session_type: execute
rolled_up: true
rolled_up_into: [00_current_state]
---

> Filed by the doc_repo planner from the cc-agent-C `_inbox/` courier
> drop per HR-11. PR #69 verified **OPEN** via `gh pr view 69`
> (`state: OPEN`, `mergeable: MERGEABLE`, `mergeStateStatus: CLEAN`,
> head `f912572`). CI run `26266922690` (`PR Checks`) `conclusion:
> success`, `headSha` matches. **Awaiting operator merge.**
>
> Two L-surface divergences flagged in this drop drew planner rulings,
> recorded in [`_dispatches/2026-05-21_cc-agent-C_codex_phase2_reviewer_surfaces.md`](../_dispatches/2026-05-21_cc-agent-C_codex_phase2_reviewer_surfaces.md):
> (1) no separate structured "reasoning chain" field exists on the
> finding wire — the finding `text` IS the reasoning, rendered in full,
> so structural commitment 1 is met; (2) CDX-5 scoped to an
> engagement/submission switcher (jurisdiction follows the engagement),
> not an engine-side jurisdiction-override. Both also noted in
> `00_current_state.md`.

# Codex Phase 2 — CDX-3 one-click AI review pass

## Outcome

CDX-3 (one-click AI review pass) is built and open as **PR #69**
(`codex-reviewer-qa/cdx-3-one-click-review` → `main`, head `f912572`).
CI is green; PR is `MERGEABLE` / `mergeStateStatus: CLEAN` — **awaiting
operator review/merge**. Operator-supervised: nothing self-deployed.

This is **PR 1 of the dispatch-sanctioned CDX-3/4/5 split**. The Codex
Phase 2 dispatch permits "split by stream … open in sequence", and
CDX-4 builds directly on CDX-3's rendered findings, so CDX-3 lands
first. CDX-4 and CDX-5 are the sequenced follow-on PRs — see Handoff.

## What shipped

The `artifacts/codex-reviewer-qa` artifact gains its first data-bound
page on the `/codex-reviewer-qa` surface:

- **`ReviewPage`** — engagement + submission selectors; "Run review"
  calls `POST /submissions/{id}/findings/generate`, polls
  `GET .../findings/status` until the run leaves `pending`, then
  renders `GET .../findings`. A run-status banner surfaces the
  QA-relevant engine signal: invalid citations stripped, findings
  discarded, run errors.
- **`FindingCard`** — renders one finding selling its reasoning, not a
  bare verdict: full finding text, every source citation, confidence
  score, generation timestamp — all visible.
- **`findings.ts`** — pure label / format / sort helpers.
- Wired `@workspace/api-client-react` (the in-process L-surface client,
  not the MCP server) as the artifact dependency, per the dispatch.
- Tests (CI: 14/14): `findings` helpers, `FindingCard` (pins the
  reasoning-surface contract), `ReviewPage` integration test against a
  mocked client. Replaces the scaffold's `ReviewerQaHome` placeholder.

## Decision-relevant findings — two L-surface divergences

The dispatch directed: verify the L-surface against source, report any
divergence. Two found:

**1. No structured "reasoning chain" field on the finding wire.** The
dispatch's hard requirement ("sell reasoning, not data") names a
finding "reasoning chain" as a distinct thing to surface. Verified
against source (`lib/api-zod/.../finding.ts`, `routes/findings.ts`):
the finding wire has **no** separate reasoning-chain field. The
engine's reasoning IS the finding `text` — free-text with inline
citation tokens, already validator-stripped of unresolvable ids.
`FindingCard` renders `text` in full and unabbreviated as the
reasoning surface, alongside the structured `citations`, `confidence`,
and `aiGeneratedAt` — which meets the commitment's intent (substance
over a bare verdict). A *separately-structured* reasoning-chain field
would require an engine + api-server change; out of scope for a
reviewer-surface dispatch. Flagged for a planner call.

**2. No jurisdiction override on the L-surface (affects CDX-5).** The
finding-generation route resolves jurisdiction implicitly from the
engagement (`keyFromEngagement()` in `routes/findings.ts`); there is
**no per-run jurisdiction parameter**. CDX-5 as the dispatch describes
it — "runtime jurisdiction selection; findings update on switch" —
cannot be a true runtime switch against the L-surface as it stands:
each engagement carries its own jurisdiction. CDX-5 needs a scoping
call before build — either (a) scope CDX-5 to switching which
engagement/submission is in view (jurisdiction follows the
engagement), or (b) add a jurisdiction-override parameter to the
engine + generate route (a larger, engine-side change). Recommend the
planner decide before the CDX-5 dispatch fires.

## Verification

- `pnpm run typecheck` — green locally (all artifacts + libs).
- Build + vitest could not run on the Windows workstation (missing
  win32 native binaries + SSL proxy — the documented limitation).
- **CI (Linux) authoritative** — run `26266922690`: Typecheck pass,
  Test pass; `codex-reviewer-qa` 14/14 (3 files), zero failures
  workspace-wide.
- CI iteration note: the first run failed deterministically — the
  `ReviewPage.test.tsx` `vi.mock` was missing the
  `getListEngagementSubmissionsQueryKey` stub that the queryKey
  typecheck-fix had introduced into `ReviewPage`'s imports. A genuine
  miss (updated the page, not its test mock); fixed in `f912572`.

## Handoff — CDX-4 and CDX-5

- **CDX-4** (per-finding accept/edit/reject loop) — the L-surface is
  ready: `POST /findings/{id}/accept|reject|override`, all with
  generated client functions. Builds on CDX-3's `FindingCard` /
  `ReviewPage`, so it is gated on PR #69 merging. Sequenced PR 2.
- **CDX-5** (jurisdiction switcher) — blocked on the divergence-2
  scoping call above. Should not start until the planner rules on
  whether CDX-5 is an engagement/jurisdiction view-switch or needs an
  engine-side jurisdiction-override.
- Codex Phase 2 also carries CDX-9 (gated on DA-5) and CDX-QA-1
  (planner deliverable) — not in this dispatch's scope.

---

## Planner rulings on the two divergences (added on filing)

**Divergence 1 — reasoning chain.** Accepted cc-agent-C's
interpretation. Structural commitment 1 requires every output to carry
reasoning, source citation, confidence, and timestamp; it does not
require the reasoning to be a separately-structured field. The finding
`text`, rendered in full with inline citations plus the structured
`citations` / `confidence` / `aiGeneratedAt`, satisfies the commitment.
Whether the engine should additionally emit a separately-structured
reasoning-chain field is an engine-architecture question, not a
reviewer-surface question, and is not urgent. Logged, no engine
dispatch raised.

**Divergence 2 — CDX-5 scope.** Ruled option (a): CDX-5 is an
engagement/submission switcher; jurisdiction follows the engagement.
Rationale — the focus-queue rule: option (b) would pull an engine +
api-server jurisdiction-override change into what is a reviewer-surface
dispatch, adding engine scope and a cross-repo dependency. Option (a)
keeps CDX-5 inside `legacy-design-tools`, needs no engine work, and is
sufficient for M-CodexQA QA-readiness (a reviewer QAs Codex across
jurisdictions by switching among real engagements, each carrying its
own jurisdiction). The cross-jurisdiction "what-if" (run one submission
against an arbitrary jurisdiction) is a genuine capability but reads as
Phase 3 depth, not Phase 2 QA-readiness; logged as a Phase 3 candidate
if the operator later wants the explicit comparison. The Codex Phase 2
dispatch CDX-5 section is amended with this ruling. Operator may
override.
