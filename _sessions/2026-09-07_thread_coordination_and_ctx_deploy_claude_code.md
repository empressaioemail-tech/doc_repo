---
id: 2026-09-07_thread_coordination_and_ctx_deploy_claude_code
title: Session close — four-thread coordination, three new plan rows, and the Central Texas deploy
date: 2026-09-07
status: closed
applies_to: portfolio
seat: integration / coordination (doc-repo-6f)
related:
  - 90_operations/OPS-20_thread_coordination_index
  - 90_operations/OPS-16_texas_market_plan_of_record
  - _decisions/2026-09-06_boundary_envelope_atom_program_scope
  - _inbox/2026-09-07_reports_courthouse_program_WDLL
  - _inbox/2026-09-07_integration_smart-site-ui-review-triage
---

# Session close, 2026-09-07

## Why this session existed

The operator was running three concurrent doc_repo threads. The oldest, the data
pipeline thread, compacted mid-coordination and lost the context of what it had been
arbitrating. Three complementary roadmaps and a handful of lane sessions were left
without a shared index. This seat was stood up to reconcile them.

## What was actually wrong

Not the agents. Every lane was working correctly and most were working well. The
defect was accounting.

There were four work streams, not three. The fourth, the non-UI residue of the
2026-09-04 operator review, was sourced by the UI thread and driven by the data
pipeline thread, which is why nobody could see it whole.

Three of the four had no plan row, so `scripts/dispatch.mjs` structurally could not
compile a dispatch for them and nothing cross-checked them against each other. Fixed
by opening P-121 (atom program), P-122 (UI QA lane) and P-123 (paid-conversion
backlog). P-120 already existed.

One lane, `cente-c1`, was carrying work from two programs that both use bare item
numbers for different things, and its queue contained a live conflation of two
different "item 2"s sent one minute apart by two different threads.

## The finding that mattered most

Almost nothing merged in the preceding four days was serving. Sixty-five PRs across
six repos; roughly forty of them merged and reaching no customer. `hauska-engine-api`
was serving code from 2026-09-04, `hauska-mcp-server` from 09-03, `cortex-api` and
`smartsite-mcp` from 09-05, and the newest production deploy of Property Explorer was
two days old with zero deploys that day.

Lanes were marking work done at merge. Merge was not landing, and landing was not
serving. Two items in the atom program's own record read "DONE, verified live" where
"verified live" meant a Postgres integration test and a merged PR.

All four Central Texas customer surfaces were deployed and independently verified by
field-name reads during this session. `hauska-mcp-server` was deliberately not
deployed: it is Hauska substrate serving the agent-operator buyer, not the Central
Texas path.

## The recurring failure mode

Nine instances of one thing: a claim degrading between where it was established and
where it was used. An ENEEDAUTH diagnosis arriving as "a token only Nick can
provision." A merged PR relayed as "open, CI running." An unverified roadmap item used
as done. A blocker resolved on 09-04 still cited on 09-07. A defect observed on 09-04
escalated as currently true without a re-test, costing six eliminations of hypotheses
about a bug that no longer existed. An assignment stated and never sent. Two messages
believed sent that never arrived, one of which blocked a lane for hours in a way that
read as negligence from outside.

The coordination seat committed one of them itself, propagating "crash looping" into
the durable record on a peer's wording, and withdrew it when a second lane checked the
retired revision's own conditions.

The standing rule recorded against it is to read the authoritative record at the point
of use. The instrument for deploy state was refined mid-session: comparing a merge
timestamp against a serving revision's creation time is a decisive negative and not a
positive, and only `git merge-base --is-ancestor` proves a fix is in what serves.

## Two lane decisions worth preserving

`cente-c1` refused to trigger a production deploy with migrations on a relayed peer
claim of operator approval, and escalated to the human instead. It sat frozen for four
and a quarter hours on that dialog while its queue filled. It was right. It refused a
second time on a dispatch relayed through this seat. It was right again.

`cente-c5` diagnosed that freeze with process state, transcript timestamps, queue
depth and CPU sampling, distinguishing a stuck human-input gate from a crash, and
closed read-only having written nothing.

## What shipped

Four surfaces deployed and verified. Twenty-one UI fixes across six batches. The
report fabrication fix, where a well atom recording "checked, found nothing" rendered
as "Well 1: on file." The six PE and MCP parity divergences. Seven setback cities.
The Williamson and McLennan CAD reconciliation. The setback corpus published at 1.0.1
and hauska-engine repointed onto it with zero divergence across fifteen jurisdictions.
P-120 item 6's endpoint contract answered, unblocking eleven items. Item 15 closed as
a no-op after a proper ancestry trace, which unblocks item 17a for the operator.

## Open at close

Full board in `90_operations/OPS-20_thread_coordination_index.md`. The operator holds
atom program items 1, 8 and 9, seven UI rulings, and item 17a's fourteen Bastrop
courthouse jobs. `cente-c1` holds P-120 items 2, 3, 4, 17b-gate and 24, the
narrative-section endpoint, and P-121 item 6's LDT leg. This seat holds the
`buildable-display-vocab.ts` cross-repo change.

Unowned: the Belton geometry-clip bug; the `setbackFrontFt` gate, which has never
evaluated for any county; P-106's constraint-index builder, honestly scoped out at
close and never carded; the coverage sweep counting absences as coverage; the setback
verification-tier collapse; the portfolio half of the absence-vs-presence audit; the
Bastrop `GEOMETRY-DIVERGE`; and six stale public Vercel surfaces.

## The measurement worth acting on

Of the forty most recent close docs, nine declare a `leave_behind` and four carry a
plan row. ENFORCEMENT requires the declaration on every close. So the record cannot
answer "what previously planned work was never executed," and P-106 is what that looks
like from the outside: correct code, honest close doc, real refusal, zero customers
served, and nothing anywhere saying a job was owed. The fix is hook-shaped, not prose.
