---
date: 2026-05-22
agent: cc-agent-C
repo: legacy-design-tools
session_type: execute
rolled_up: true
rolled_up_into: [00_current_state, 11_roadmap]
---

> Filed by the doc_repo planner from the cc-agent-C `_inbox/` courier
> drop per HR-11. PR #71 verified **OPEN** via `gh pr view 71`
> (`state: OPEN`, `mergeable: MERGEABLE`, `mergeStateStatus: CLEAN`,
> commit `4342c42`). CI run `26288699943` (`PR Checks`) `conclusion:
> success`, `headSha` matches. **Awaiting operator merge — the final
> PR of the Codex Phase 2 reviewer-surfaces dispatch.** cc-agent-C
> applied the 2026-05-21 CDX-5 planner ruling correctly this pass
> (the re-poke prompt pointed it at the ruling). Rolled into
> `00_current_state.md` and `11_roadmap.md`.

# cc-agent-C — CDX-5 jurisdiction switcher

## Outcome

**PR #71** — `feat(codex-reviewer-qa): CDX-5 jurisdiction switcher` — open,
CI-green, awaiting operator merge. This is **PR 3 of 3** and completes the
`2026-05-21_cc-agent-C_codex_phase2_reviewer_surfaces` dispatch.

- Branch: `codex-reviewer-qa/cdx-5-jurisdiction-switcher` (off `main` @ `6d6f4c1`)
- Commit: `4342c42` — 7 files, +624 / −8
- CI run `26288699943`: **Typecheck pass**, **Test pass** —
  `codex-reviewer-qa` 6 test files / **54 tests passed** (was 29 after CDX-4)
- `MERGEABLE` / `CLEAN`

## Dispatch status — all three streams delivered

| Stream | Scope | PR | State |
|--------|-------|----|-------|
| CDX-3 | One-click AI review pass | #69 | merged |
| CDX-4 | Per-finding accept/edit/reject loop | #70 | merged |
| CDX-5 | Jurisdiction switcher | #71 | open, CI-green |

With #71 merged, the dispatch is complete. CDX-9, CDX-EngineHook-prep,
CDX-QA-1 and CDX-MCP were out of scope (gated / other-owner).

## What CDX-5 does

The planner ruling (2026-05-21, in the dispatch) re-scoped CDX-5 from
"runtime jurisdiction selection" to an **engagement/submission switcher**:
the finding-generation route resolves jurisdiction implicitly from the
engagement, there is no per-run override parameter, so jurisdiction is
made *visible* rather than added as a runtime control. I built it exactly
to that ruling — no engine-side or api-server override parameter.

- **`jurisdiction.ts`** — pure helpers: `resolveJurisdictionContext`
  (engagement label + submission snapshot + divergence flag),
  `matchJurisdiction` (best-effort label match against indexed corpora),
  `describeCorpus`, `normalizeJurisdiction`.
- **`JurisdictionBar`** — a context bar between the selectors and the
  findings: shows the engagement's jurisdiction, the indexed code corpus
  it matches, a "no corpus matches this label" note, and a warning when a
  submission was filed under a now-stale jurisdiction.
- **`ReviewPage`** — wires `useListCodeJurisdictions`, renders the bar,
  and labels each engagement `<option>` with its jurisdiction so the
  switcher itself is jurisdiction-aware. Findings already update on switch
  (query keyed on submission id); CDX-5 makes the jurisdiction that drives
  them visible.

## Verified against the cortex-api L-surface

Diagnose-first, per the dispatch mandate. Findings:

1. **`EngagementSummary.jurisdiction`** and
   **`EngagementSubmissionSummary.jurisdiction`** are both
   `string | null` *free-text* labels (not a structured id/enum). The
   `useListEngagements` / `useListEngagementSubmissions` L-routes expose
   only this free-text field — not the structured
   `jurisdictionCity` / `jurisdictionState` / `jurisdictionFips` columns
   that exist on the DB rows.

2. **The submission `jurisdiction` is a denormalized snapshot** captured
   at filing time (api-server copies the engagement's jurisdiction onto
   the submission row on create). A later jurisdiction change on the
   engagement does not rewrite it. The finding-generation route, by
   contrast, resolves the corpus from the **live engagement** row via
   `keyFromEngagement`. So an engagement whose jurisdiction changed after
   a submission was filed produces a real divergence: the next pass
   judges against the *current* engagement jurisdiction, not the filed
   one. CDX-5's snapshot-divergence warning surfaces exactly this — it
   has genuine QA teeth, not cosmetic.

3. **No client-reproducible corpus-key resolution.** `keyFromEngagement`
   (from `@workspace/codes`) resolves the real corpus key server-side
   from structured location fields + an address scan. The L-surface does
   not expose those fields, so `matchJurisdiction` is a *best-effort
   label match* against `GET /api/codes/jurisdictions` and degrades to
   "no corpus matches this label" rather than guessing. This is an
   accepted limitation, documented in code and in the PR body — not a
   bug, but worth a planner note if a precise corpus indicator is wanted
   later (it would need the L-surface to expose the resolved key).

## Decision-relevant note for the planner

The cross-jurisdiction "what-if" (running one submission against an
arbitrary jurisdiction) remains unbuilt and was explicitly logged in the
dispatch as a *possible Phase 3 capability*. If that is wanted, it needs
an engine/api-server change (a jurisdiction-override parameter on the
generate route) — out of scope here by design. No action needed unless
Phase 3 picks it up.

## Stray working-tree files (unchanged from prior reports)

This clone still carries four unrelated modified-uncommitted files that
pre-date the session — three `artifacts/design-tools` test files and one
`lib/db` integration test. They are **not mine**. Every commit this
session used an explicit per-path `git add artifacts/codex-reviewer-qa/src`,
so they have stayed out of all three PRs (#69/#70/#71). Flagged again
here per the "surface to the planner" rule; still awaiting a call on
whether they should be reverted or owned by another agent.

## Run posture

Operator-supervised. PR opened, nothing self-deployed. Awaiting operator
merge of #71 to close the dispatch.
