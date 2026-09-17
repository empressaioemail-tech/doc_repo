---
id: 2026-09-17_HANDOFF_smartcity_combined
title: Combined handoff to a fresh planner, 2026-09-17 — SmartCity design build and the DigitalOcean migration
date: 2026-09-17
last_updated: 2026-09-17
status: active handoff
kind: handoff
owner: nick
from: integration seat (this session merges two parallel threads run by two separate agents on 2026-09-17)
programs: [OPS-17, OPS-25]
related:
  - _inbox/2026-09-17_HANDOFF_design_implementation.md (the design thread's own handoff — full detail, read second)
  - 90_operations/OPS-25_cloud_infrastructure_and_cost_program.md (the DO migration's own plan of record — full detail, read third)
  - _design/SMARTCITY_PACKAGE.md (the standing SmartCity entry point)
  - _design/INDEX.md
  - 90_operations/OPS-17_govtech_stack_plan_of_record.md
snapshot: doc_repo main 6fbc7d03 at handoff time. smartcity-os origin/main advanced to 92c73e39 (unvalidated against production). smartcity-dashboards origin/main f776b4bf (unchanged since 2026-09-15).
---

# Combined handoff: SmartCity design build + the DigitalOcean migration

Two agents ran two threads on `smartcity-*` today, in the same shared `P:/doc_repo` checkout, and each
wrote its own thorough handoff. This document is the merge: the one thing that connects them, corrected
for drift between when each handoff was written and now, and one reading order. It is deliberately short
— the two source documents above carry the full depth of their own thread and this does not repeat them.

## Declare your snapshot before anything else

This clone is shared. Three seats hold live lane claims in it right now (`p260-p263-setbacks-and-envelopes`,
`p279-tagged-revision-security`, `p273-p274-controls`, all opened in the last two hours) and three more are
stale but unreleased (`p249`, `p262`, `p285` — 20 to 28 hours old). Check `node scripts/lane-claim.mjs status`
fresh yourself; do not trust either source handoff's reading of it, both are already stale on this point.
Commit by explicit pathspec, never `git add -A` — check `git diff --cached --stat` before every commit.

## The one thing that connects both threads

**SmartCity's product line moved to DigitalOcean today (OPS-25, rows D-5/D-9/D-10/D-11), and the design
thread's job is to build new work into the exact repo that migration touched.**

- `smartcity-api` is live on DigitalOcean (`walrus-app`), serving `smartcityos.io` and `www` for real
  customer traffic. The GCP original is idle.
- `smartcity-dashboards` is built and validated on DigitalOcean (`dolphin-app`) but has **no custom domain
  and no customer traffic on it yet** — GCP still serves it.
- **Deploy-on-push is disabled on both DigitalOcean apps.** Each runs from a dedicated branch pinned to a
  specific commit (`178e968` for dashboards, `e783f351` for api), not from `main`. Merging a design build
  row into `smartcity-dashboards` main is safe and reaches no environment by itself — but making it live
  is now a deliberate act on a pinned commit, not a merge, and nobody owns that act yet.
- Nothing has been decommissioned. Every GCP original and every D-5 droplet is still running as the
  rollback path through a bake period that has not started.

**What this means concretely:** any design build row whose done-condition is "live on the customer
surface" must say which DigitalOcean app serves that surface, which commit it needs to move to, and who
moves it — before it's treated as shippable. This is not a hypothetical caution; it's the literal current
state of the repo the design work is about to build into.

## What's true right now that wasn't when either handoff was written

- The design handoff's fan-depth-gate blocker (lane `p275-live-currency-five-counties` holding a claim in
  this worktree) has cleared — that specific lane is no longer in the claims registry. Three different
  lanes hold live claims now instead (see above). Re-check before assuming subagent launches are blocked
  or unblocked for either reason.
- `smartcity-os` `origin/main` has moved to `92c73e39` since OPS-25's D-9 close was written, still
  unvalidated against the live original — this matters to BOTH threads now: the design thread if it ever
  needs to touch `smartcity-os` (it currently doesn't — its work is in `smartcity-dashboards`), and the
  migration thread because `walrus-app` serves production from the older, validated `8bea7fa`, not HEAD.
- OPS-25's six open items (bake period/decommission, the scraper's single-Chromium-lock concurrency risk,
  no TLS on the scraper droplet, the `smartcityos.io` apex certificate's real renewal path before
  2026-12-16, the unvalidated `smartcity-os` main drift just above, and an orphaned `P-154` finding that
  needs a property-side owner) still have no owner. None of them blocks design work; all of them are real.

## Reading order

1. This file.
2. `_inbox/2026-09-17_HANDOFF_design_implementation.md` — the design thread in full: what's ratified and
   buildable today (the plan review reasoner path, the flood study — both ratified, neither dispatched),
   what's still waiting on the operator's ratify/amend/kill pass (nine drafts, owed since 2026-09-15 and
   gating the Bastrop approval package), the applicant-precheck design drawn today, and the reuse
   inventory that makes implementation plannable.
3. `90_operations/OPS-25_cloud_infrastructure_and_cost_program.md` — the migration in full: its "Status"
   section, all eleven D-rows, and the governing rules the closes earned (traffic pinned by revision name
   defeats a plain redeploy; verify from a vantage point that can't lie; DNS stays outside the DO token by
   design).
4. `_design/SMARTCITY_PACKAGE.md`, then `_design/INDEX.md`.
5. `90_operations/OPS-17_govtech_stack_plan_of_record.md`, rows G-137 to G-148, last amendment A-140.

## First actions, combined order

1. Declare your snapshot; run `node scripts/lane-claim.mjs status` fresh.
2. Run `node scripts/govtech/design-completion-gate.mjs` and confirm the design thread's numbers rather
   than trusting the handoff's snapshot of them.
3. Ask the operator for the ratify/amend/kill pass and the blending ruling (Smart Site vs Smart Files vs
   SmartCity plan review vs Development services) — these unlock every design row that isn't already
   ratified.
4. Card OPS-17 build rows for what's already ratified now: the reasoner path and the flood study need
   nothing further from anybody.
5. Before treating any build row as done because it merged: name which DigitalOcean app serves that
   surface, which pinned commit it needs, and who executes the move. A merge to `smartcity-dashboards`
   main ships nothing on its own while deploy-on-push stays disabled.
6. Separately, and not blocking the design work: OPS-25's six open items still need owners. Route
   `P-154` to the property side; the rest are the DO migration program's own follow-through.

## What's committed and durable as of this handoff

`6fbc7d03` (design: the applicant-precheck folder, canvas seeding script, `_design/INDEX.md`,
`_design/all-canvas/*`, the design thread's own handoff) and `c2e8c7f6` (OPS-25's D-9/D-10/D-11
consolidation) are both on `origin/main`. Nothing referenced by either source handoff or this one is
sitting uncommitted in a worktree a fresh clone won't see.
