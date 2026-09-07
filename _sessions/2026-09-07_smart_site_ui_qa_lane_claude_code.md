---
date: 2026-09-07
topic: Smart Site UI QA lane stood up, triaged and run through all six batches; deployment-gap and stale-bug-relay findings at close
agent: claude_code (integration seat, doc-repo-f9)
plan_row: P-122 (filed mid-session; the lane started as a Nick hand-carried lane with none)
memory_graded: none
related:
  - _inbox/2026-09-07_integration_smart-site-ui-review-triage.md
  - _decisions/2026-09-07_button_fill_translucent_to_solid.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md
  - 90_operations/OPS-20_thread_coordination_index.md
  - _catalog/seat_register.json
---

# Session: Smart Site UI QA lane, all six batches, closed with two hard lessons

## Summary

This session read a hand-carried setup prompt for a general UI QA lane, stood the
lane up (`hauska-map-ui-qa`, standalone clone, property seat), triaged a 9-4
operator UI review PDF into a durable punch list, and coordinated the lane
(`cente-7d`) through all six batches by cross-session message for the rest of the
session. In parallel, a separate non-UI backlog the triage produced (billing,
attribution, an acceptance checklist) was picked up by `cente-b9`. Midway through,
a fourth session, `doc-repo-6f`, stood up as cross-roadmap coordinator across
three concurrent doc_repo threads at the operator's request, which changed how
cross-thread items got routed for the second half of the session.

**All six batches were worked and closed or precisely held for a ruling, and
every fix that shipped was independently verified — merged, CI-green, and (for
several) regression-tested live in a real browser — not taken on the lane's
report.** Two things surfaced late that matter more than the batch count:

**Nothing this lane shipped is customer-visible.** `hauska-map` does not
auto-deploy on merge, and `vercel inspect` shows the newest `property-explorer`
Production deployment is from 2026-09-05, two days before any of this session's
six merges. Every "CLOSED" logged in the triage doc all session meant "merged to
main," not "live." This was caught only when `doc-repo-6f` ran the instrument
(cross-reference a PR's merge timestamp against the serving revision's creation
time) as part of a final-state audit the operator requested across all three
lanes — not caught by this seat's own verification, which stopped at `gh`-checked
CI-green and merge.

**The "Start Solo plan button doesn't work" item was stale by the time anyone
investigated it.** It was triaged as current from a review PDF written 2026-09-04.
`cente-7d` traced it to a plausible root cause, `doc-repo-6f` eliminated four
hypotheses by direct inspection, and only then did the operator re-test the
actual button and find it already worked — Stripe shows Solo active with real
subscribers since 2026-09-03. The defect had been real once and stopped being
true before this lane ever looked at it. Recorded in `90_operations/
OPS-20_thread_coordination_index.md` as the clearest instance of a
relay-degradation pattern: a claim survived a triage doc, a lane hand-off and an
escalation without anyone re-running it against the live app first.

## What shipped (merged, not deployed)

Six PRs against `hauska-map`, all 2026-09-07, all independently verified via `gh`
before being called closed: #364 (button fill, help bubble, prose em-dash sweep),
#366 (compass-icon filter, dock scroll-to-top, address-header fix), #367
(layer-hover tooltip swap closing Batch 2, plus pricing-toggle/check-glyph/2mo-free
opening Batch 3), #368 (four of five Settings boilerplate removals), #369
(sign-in card and Plans modal full copy rewrite, closing Batch 6), #371 (the
`code:description` em-dash join fix in two files cleared mid-session from a
cross-repo contention). One doc gap from this stretch was only caught during the
final-state pass: the layer-hover fix's own triage-doc bullet was never marked
closed after `cente-7d` confirmed it live, so it read "not yet implemented" for
roughly two hours after it had actually shipped.

## What's still open, all named with an owner in the triage doc

Waiting on the operator: the fifth Settings boilerplate message (an existing code
comment argues to keep it), the Stripe-cancellation ask (turned out to require a
real custom flow against Stripe's Subscriptions API, not a UI patch), the
right-hand Settings column's content, the Solo-tier two-choice unlock step (dead
code found, never wired up, needs build/link/other), and all three Batch 5
Sharing findings (a two-checkbox notes-default conflict with no shared source of
truth, a systemic non-optimistic UI pattern behind the X-ray/Flood toggle lag, and
an open scope question on whether quick-share can assume a property is already
saved before letting someone write notes on it).

Waiting on `doc-repo-6f`: the coordinated cross-repo em-dash fix on
`buildable-display-vocab.ts`, which turned out to be a genuine ownership problem
(the file is mirrored six ways across two repos behind a sha256 parity lockfile,
not something any single lane could safely touch alone) rather than the
sequencing question it first looked like.

Routed out and resolved without this lane's further involvement: the share-
attribution bug and the dual-active-billing-plan investigation (`cente-b9`), the
two entitlement-wire gaps now under P-123 (both re-scoped from "not persisted" to
"not on the wire" after a code comment was found to describe only its own repo's
state, not the system's), and the Solo-checkout defect (resolved as stale, above).

## What was learned

**A code comment is evidence about its own repo, not about the system.** Twice
this session a claim sourced from a client-side comment (`live-envelope-augment.ts`
having "zero callers," an account email being "not persisted anywhere a later
read can reach") turned out to describe only the reader's own vantage point. Both
times the correction came from checking the actual write path or the schema, not
from re-reading the comment more carefully.

**A shared checkout with no per-session worktree isolation loses uncommitted
work.** `_catalog/seat_register.json` was silently overwritten twice by
concurrent writes from other doc-repo sessions sharing this same `P:\doc_repo`
checkout — once losing this lane's own entry, once (during this seat's own
recovery write) losing a different lane's entry with no way for this seat to have
seen it coming. `doc-repo-6f` fixed both and generalized the instrument gap: a
file-level `git status` check confirms a shared JSON file changed, not that every
expected entry inside it survived. Entry-level verification is now the standard
for that file, not file presence.

**Merged and CI-green is not the same claim as live**, and a lane whose CI is
green on every PR can still be reporting a false "done" to the operator all
session if nothing checks the deploy. This session's own reporting made that
mistake for roughly three hours before the final-state audit caught it.

**Reproduce a time-sensitive claim before investigating it, not just before
fixing it.** The Solo-checkout chase spent real multi-session effort on a defect
that had already stopped existing. The fix for future triage: age-check anything
sourced from a point-in-time document before treating it as current, and
re-verify against the live app before escalating a root-cause investigation
across sessions, not only before writing code.

## Coordination notes

Cross-session messaging (not the compiled `dispatch.mjs` mechanism) was used for
every hand-off in this thread: this seat to `cente-7d` and `cente-b9` directly,
and this seat to `doc-repo-6f` once it stood up as coordinator partway through.
`cente-7d` self-corrected twice without being caught by anyone else first — once
retracting a regression-pass claim it had made before actually running it, and
once catching its own earlier "no bug found" call once better information (the
Batch 6 drafted copy) showed the original report was wrong. Both were treated as
the stronger outcome, not a discipline problem: a wrong claim caught by the
session that made it is worth more than one caught downstream.

## Suggested canonical doc updates

`90_operations/OPS-16_texas_market_plan_of_record.md` P-122's status line should
move from "in progress" toward "merged, not deployed, N items still open" once
this session's findings are read in; not edited directly this session since
`doc-repo-6f` owns that row's write path as coordination seat.

Whoever holds the next hauska-map deploy should treat it as carrying six PRs'
worth of accumulated UI change at once, not one, and the canary-then-shift
discipline should verify against that combined surface (this session's own
"regression pass" precedent, run twice against a local dev build, is a good
template for what to re-check post-deploy against the real production URL).
