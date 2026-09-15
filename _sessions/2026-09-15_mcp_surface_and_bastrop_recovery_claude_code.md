---
id: 2026-09-15_mcp_surface_and_bastrop_recovery
title: Session — the MCP surface, Bastrop's false retirement, and seven payloads that disagreed with themselves
date: 2026-09-15
status: session record
kind: session
owner: nick
seat: integration (doc_repo)
programs: [OPS-24, OPS-23]
plan_rows: [P-200 .. P-224]
related:
  - _inbox/2026-09-15_HANDOFF_planner_snapshot.md
  - _inbox/2026-09-15_smartsite_mcp_surface_card.md
---

# Session 2026-09-15 — integration seat

Spans 2026-09-14 evening through 2026-09-15. Roughly 57 commits to `origin/main`.

## What this session was

It began as the Smart Site lane handoff and became three things: recovering Bastrop from a
mass false retirement, walking the MCP surface end to end, and discovering that the most
common defect in this product is a served answer that disagrees with itself.

## The measured findings, in order of consequence

**Bastrop was 92.5 percent falsely retired.** 57,704 of 62,394 parcel-node atoms marked
retired; a random sample of twenty found nineteen live at the county's own cadastral service.
P-212 reactivated **56,691**, leaving 1,013. The cause was not the normalization divergence
hypothesised: a 2026-08-11 run fed an undersized plan, and retirement was a **one-way door**
because `priorRows.filter(r => r.status === 'active')` excluded retired rows from every future
comparison. **It survived twelve days because it produced no customer symptom** — the serve
path never consults parcel-node status, and that blindness was the only thing keeping the
county visible.

**The gate excludes exactly what is missing.** In Hays, all 32 rails the gate marks `excluded`
have zero value cells and all 33 non-excluded rails have values, with no exception either way.
A rail with no writer leaves the denominator, cannot fail, and the county passes.

**OPS-24 has no stage that creates a rail.** Read the thirteen stages: nothing builds a writer
for a rail that has none. The program executed perfectly moves a county to 31–41 rails of 65
and no further. That ceiling is now written into the WDLL.

**Both headline numbers on the MCP surface are wrong.** The feasibility and siteplan engines
draw every setback line from Ordinance 2019-51, repealed 2026-04-14, while the facet serves
the current 2026-06 values. And the buildable-area figure printed on both covers is barred by
the policy the wire enforces AND computed off those repealed setbacks.

**Seven instances of a payload disagreeing with itself**, each on a different rail or reader.
Not seven bugs — nothing checks that a served answer agrees with itself before it reaches a
customer.

## What was built

`plan-row-allocation-gate` — a duplicate row id is refused at commit, proven by violation in
both directions, with the scope limit written into the refusal text itself.

The `probe-close-gate` **drift check was vacuous** and is repaired. It read `rows[0]` only, so
a second program range was structurally invisible to the control built to prevent exactly that
drift. It has since fired on two real changes, both mine.

`ENFORCEMENT.md` gained **"A mass state change refuses before it lands"**, with the Bastrop
instance and the four ways its controls failed — including one this doc had not named: the
second source existed and **the control order made it unreachable**.

## What the lanes did better than their dispatches

P-212 falsified the hypothesis it was handed and found a worse cause. P-216 found my dispatch
named the wrong repo, then confirmed my over-segmented-ring hypothesis and fixed the class
rather than the instance. P-218 caught a counting bug in its own measurement before reporting
and found a figure I had cited was stale. P-205 held its own deploy unasked because shipping
would have made every genuine miss in six counties decline. P-203 refused to write anything
because its mission contradicted itself, which was correct and exposed a mission defect.

**Hand a lane a hypothesis and expect it back improved.** Four for four this session.

## What I got wrong

I said a string was "verified panel-side" when I had only verified it was absent from the MCP
payload — a different claim. I said something was not a regression from a five-day-old bake,
when a deploy ships everything merged since the last one; the operator's "it worked earlier
today" found it, not any instrument of mine. I accepted an operator report that no second
P-200 session existed and nearly had a lane release a live claim. I passed along a deploy
status I had not verified. I piped an enumeration through `tail` and nearly reported zero. I
substituted a faster instrument for a correct one and reported the recovery as complete when
it had missed a cited artifact.

Every one is the same shape: **a claim whose supporting evidence was narrower than the claim.**

## The correction worth inheriting

P-223 was carded SEV-1 on a reported tier-gate bypass. The measurement the row itself demanded
refuted it: the account is Studio, so the refusal had nothing to refuse, and both its records
jobs carry zero artifacts. The inference "the gate never ran because the query was reached" is
invalid on a passing account. What survives is a raw driver error reaching an authenticated
caller. **The gate remains untested in the failing direction and the row says so** — a
downgrade is not a pass.
