---
id: 2026-09-15b_deploy_rollback_and_p219
title: Session — P-219 lands, three merges ship, one takes the map down, rollback
date: 2026-09-15
status: session record
kind: session
owner: nick
seat: integration (doc_repo)
programs: [OPS-24]
plan_rows: [P-214, P-216, P-218, P-219, P-223, P-224]
related:
  - _inbox/2026-09-15_HANDOFF_planner_snapshot.md
  - _sessions/2026-09-15_mcp_surface_and_bastrop_recovery_claude_code.md
---

# Session 2026-09-15b — merges, a production outage, and the rollback

Continues `2026-09-15_mcp_surface_and_bastrop_recovery`. This half is short and it is mostly
about one mistake.

## What was delivered

`P-224` compiled and ready. `P-223` measured and **downgraded from SEV-1** — the tier-gate
bypass it reported was refuted by the measurement the row itself demanded, and what survives is
a raw driver error reaching an authenticated caller. The row records that the gate **remains
untested in the failing direction**, because a downgrade is not a pass.

`P-219` closed partial and closed well. Merged `f77cf56`, CI `success`. Regenerated read-only:
FRONT 30 · SIDE 10 · SIDE (CORNER) 20 · REAR 30, cited Ord. 2026-06, corrected envelope 16,767
sq ft inside its own pre-registered band. It closed **partial because the deploy is owed**, and
recorded its probe artifact as FAIL rather than claim a PASS it had not earned. It also
disproved three of its own beliefs mid-flight, reverted an amendment when three controls
rejected it, and reported that its first CI run failed six tests its local output filter had
hidden.

Three PRs merged on the operator's go.

## The mistake, stated plainly

**I deployed P-216 and it took the buildable envelope off the entire map.**

Its `declined` branch sets `envelopeCovered = false`. `depthWarm` is false for most parcels, so
the gate built to suppress *false zeros* suppressed *every envelope*.

**P-216's own pre-registered falsifier named this outcome in advance:** "If you suppress the
envelope and the panel then shows nothing where a customer expects a finding, you have traded a
wrong answer for a silent one."

I wrote that falsifier into the dispatch. The lane tripped it. I merged on green CI and a
well-argued close **and never checked the falsifier**, then deployed. Rolled back by promoting
the previous production deployment; the map is working again.

P-218 came out as collateral in the same build. That is a real cost of the rollback.

## Three compounding errors on the way

**I reported three merges as deployed. Two were not.** `hauska-map` does not auto-deploy — a
fact recorded in our own notes, which I had written and then contradicted.

**I then blamed a live symptom on code that was not running.** Twice. The served page was 12.7
hours old and one `curl -sI` reading `Age:` would have shown it.

**I parcel-hunted a map-wide problem** after being told it was map-wide.

All four are the same shape as the six logged in the first half: **a claim whose evidence was
narrower than the claim.**

## What this changes

The handoff now opens with production state, the rollback, and deploy mechanics, because a
planner who assumes merged means live will repeat this within an hour.

The durable rule out of it: **a merge is not a deploy, the only proof of a deploy is the live
alias, and the thing to verify is the surface the customer uses — not the API behind it.** The
API looked healthy the entire time the map was blank.

And the one that would actually have prevented it: **check the pre-registered falsifier before
merging, not just CI and the close.** Every dispatch this week carried falsifiers. This is the
first time one fired and shipped anyway, and it shipped because nobody re-read it at merge time.
