---
date: 2026-05-22
agent: cc-agent-C
repo: legacy-design-tools
session_type: execute
rolled_up: true
rolled_up_into: [00_current_state]
---

> Filed by the doc_repo planner from the cc-agent-C `_inbox/` courier
> drop per HR-11. PR #70 — the drop was written with #70 "open,
> awaiting merge"; state has since advanced: `gh pr view 70` shows
> `state: MERGED` (mergedAt 2026-05-22T12:30:21Z, commit `65fdee6`).
> CI run `26287542029` (`PR Checks`) `conclusion: success`, `headSha`
> matches. Routine completion, not a pending merge.
>
> **Contradiction flagged.** The drop's finding 3 says "CDX-5 should
> not start until the planner rules." The planner already ruled on
> CDX-5 during the CDX-3 sweep (2026-05-21): CDX-5 is an
> engagement/submission switcher, and the ruling is recorded in the
> Codex Phase 2 dispatch
> ([`_dispatches/2026-05-21_cc-agent-C_codex_phase2_reviewer_surfaces.md`](../_dispatches/2026-05-21_cc-agent-C_codex_phase2_reviewer_surfaces.md),
> "Planner ruling 2026-05-21" block under CDX-5 — verified present).
> cc-agent-C's CDX-4 session carried the stale CDX-3 language without
> picking up the dispatch amendment. CDX-5 is NOT blocked; the re-poke
> prompt for CDX-5 must point cc-agent-C at the ruling.

# Codex Phase 2 — CDX-4 per-finding accept/edit/reject loop

## Outcome

CDX-4 (per-finding accept/edit/reject loop) is built and open as
**PR #70** (`codex-reviewer-qa/cdx-4-adjudication-loop` → `main`,
commit `65fdee6`). CI is green; PR is `MERGEABLE` / `mergeStateStatus:
CLEAN` — **awaiting operator review/merge**. Operator-supervised:
nothing self-deployed.

This is **PR 2 of the dispatch-sanctioned CDX-3/4/5 split**, built on
the CDX-3 `FindingCard` / `ReviewPage` (PR #69, merged).

## What shipped

Every finding on the `/codex-reviewer-qa` review surface gains an
adjudication action row — Accept, Edit, Reject:

- **`reviewApi.ts`** — `useAcceptFinding` / `useRejectFinding` /
  `useOverrideFinding`: react-query mutations over
  `POST /findings/{id}/accept | reject | override` (the generated
  `@workspace/api-client-react` client). Each invalidates the
  submission's findings list on success.
- **`OverrideEditor`** — the "edit" form: finding text / severity /
  category + a required reason; submit calls the override route, which
  cortex-api persists as a single revision row.
- **`FindingCard`** — accept/edit/reject action row + inline override
  editor; renders the server-stamped adjudication attribution +
  timestamp ("Accepted by X · <when>"). Read-only when no handlers are
  passed (keeps it usable as a pure renderer / in unit tests).
- **`ReviewPage`** — wires the three mutations per card, tracks
  per-finding busy state, surfaces the 409 `finding_already_overridden`
  message on the originating card.
- Tests: `reviewApi` mutations, `OverrideEditor` form, `FindingCard`
  actions + adjudication display + 409 surfacing, `findings`
  adjudication helpers, `ReviewPage` wiring.

## Decision-relevant findings

**1. "Adjudication carries reviewer attribution + timestamp" — met
server-side.** The dispatch's CDX-4 requirement. Verified against
source: cortex-api has no dedicated adjudication atom/table.
Accept/reject/override stamp the reviewer attribution + timestamp onto
the finding row (`reviewerStatusBy`, `reviewerStatusChangedAt`,
`acceptedBy`, `acceptedAt`) and emit a `finding.accepted | rejected |
overridden` history event. CDX-4's job is to trigger that path and
surface the result — which `FindingCard` now does. The
attribution-and-timestamp requirement is fulfilled by the server and
made visible by CDX-4.

**2. Four pre-existing stray modified files in the clone — surfaced
per the workspace-ownership clause.** `git status` in cc-agent-C's
`legacy-design-tools` clone carries four modified-uncommitted files
that pre-date this entire session (they were already `M` in the
session's opening git status):
`artifacts/design-tools/src/pages/__tests__/BriefingDivergencesPanel.test.tsx`,
`.../EngagementDetail.test.tsx`, `.../SiteContextTab.test.tsx`, and
`lib/db/src/__tests__/integration/schema.integration.test.ts`. They
are **not** cc-agent-C's work — uncommitted WIP from a prior session
or agent. Every commit across this multi-dispatch session used an
explicit per-path `git add`, so they have stayed out of all branches
(#63/#66/#68/#69/#70 are all clean of them). Flagging per the
dispatch's "if you see another agent's uncommitted changes, stop and
surface" clause — the planner should have someone reconcile or discard
them; they are inert but should not linger.

**3. CDX-5 still blocked.** Carried from the CDX-3 report: the
cortex-api L-surface has no per-run jurisdiction override —
jurisdiction is resolved implicitly from the engagement. CDX-5
("jurisdiction switcher; findings update on switch") cannot be built
as the dispatch describes it without a scoping call. CDX-5 should not
start until the planner rules: (a) scope CDX-5 to an
engagement/jurisdiction view-switch, or (b) add an engine-side
jurisdiction-override parameter (a larger, engine-side change).

> Planner note on finding 3: this scoping call was already made on
> 2026-05-21 (option a, engagement/submission switcher) and is in the
> dispatch. cc-agent-C's report predates picking up that amendment.
> CDX-5 is unblocked.

## Verification

- `pnpm run typecheck` — green locally (all artifacts + libs).
- Build + vitest could not run on the Windows workstation (missing
  win32 native binaries + SSL proxy — the documented limitation).
- **CI (Linux) authoritative** — run `26287542029`: Typecheck pass,
  Test pass; `codex-reviewer-qa` **29/29** (4 files, up from 14 at
  CDX-3), zero failures workspace-wide. Green on the first run.

## Handoff

- PR #70 `MERGEABLE` / `CLEAN` — awaiting operator merge.
- **CDX-5** is the last stream of the CDX-3/4/5 dispatch and is
  blocked on the divergence-3 scoping call above. Codex Phase 2 also
  carries CDX-9 (gated on DA-5) and CDX-QA-1 (planner deliverable) —
  outside this dispatch's scope.
