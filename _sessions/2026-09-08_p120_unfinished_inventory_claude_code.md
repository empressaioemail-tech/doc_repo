---
date: 2026-09-08
agent: planner
repo: docs
session_type: review
memory_graded: none
rolled_up: false
---

# P-120 unfinished inventory, and session close

Operator asked for an honest accounting: the thread opened as Reports AND
Courthouse, went deep on reports, and left courthouse alone. This names
everything not finalised, including the parts that were quietly dropped rather
than decided.

## The honest headline

The thread delivered a production outage fix and a working deploy. It did NOT
deliver a visibly different report, which was the actual goal. The operator's
last observation stands unresolved: the reports look the same in the UI.

## COURTHOUSE — the half that was abandoned

Named first because it was in the program title and got the least attention.

**Item 16, courthouse documents into Feasibility section 11. NEVER STARTED.**
This is the item that actually joins the two halves of the program: wiring
courthouse-retrieved or Smart-Files-mounted documents into the report through
the same cite-or-decline gate as the narrative. The `courthouseDocuments`
parameter exists on the shipped endpoint contract and on this session's client.
It is passed nowhere and nothing populates it. The seam was built and the
feature behind it never was.

**Item 17a, re-run 14 Bastrop digit-block jobs (3 parcels). NOT DONE.**
Operator's own hand by prior ruling. Unblocked since item 15 closed.

**Item 17b, re-run 6 letter-block jobs plus McLennan's 4. NOT DONE.**
Same. McLennan's four are expected to refuse honestly, which is a pass.

**Item 17b-gate, Hays. ANSWERED BUT NOT CLOSED.** Two operator-authorized live
probes both terminated at `needs-human/captcha-required`, deterministic across
both runs. Hays remains structurally UNMEASURED for the fabricated-zero class,
now blocked by reCAPTCHA rather than by the old scaffold. Reaching that step
needs a human-solved captcha or a different verification route: a scope
decision nobody has made.

Closed this session: item 15 (was already deployed, verified at source against
a wrong premise in my own dispatch) and item 17c (portal registry reconciled,
plus the live `clerk_portal_terms` rows corrected).

## REPORTS — shipped

- The narrow-parcel outage. Root-caused, fixed, deployed, verified live before
  and after. Present since PR #116; every parcel under ~16m had no site plan,
  no X-Ray and no Feasibility.
- Item 6's consumer side, plus the silent-fallback fix.
- The absence taxonomy as a required type across 17 call sites.
- The three PR #404 fact families reaching a report and rendering.
- Latency: 82.9s canary caught before traffic, fixed to 3-6s warm.

## REPORTS — not finalised

**The operator's two explicit content asks. NOT DONE.** Feasibility should run
the flood study and include the actual flood deliverable; X-Ray and Feasibility
should carry the aerial. `FEASIBILITY_MANIFEST` declares `summary`, `aerial`,
`flood-cover`, `catchment`, `ponding` and `flow-paths`. The renderer honours
none of them. This is pure renderer work against a contract that already
declares it, and it would also fix the dangling sheet reference for free.

**The reports still look identical.** Measured across five genuinely different
parcels: 7 pages, 15 sections, 5 open items, ~1% byte variance. Two causes,
neither addressed: the same five sections are absent on every parcel (a data
question nobody has answered), and boilerplate dominates (a five-sentence legal
block repeats on every sheet).

**The UI shows no change at all.** Reported by the operator and NOT diagnosed.
API calls against production return 15 sections and 7 pages; the UI shows the
old report. Something on the PE path is not reaching the deployed service, or
is serving a stored artifact. This is the single most important open item and
it was interrupted mid-investigation.

**R-04 remainder:** binding constraint, pad yield, what-would-change,
open-items work plan, utilities into open items.

**R-05 remainder:** the six confirmed copy defects, the six unrendered manifest
sections, answer-first sequencing, the how-to-read page.

**R-06, R-07, R-08: NOT STARTED.** Worktrees created and registered, zero
commits. R-06 carries the R9 hauska-map retirement, which must land with it.

**The two env vars.** `BROKERAGE_API_BASE_URL` and `SERVICE_API_KEY` on
engine-api. Corrected finding: the LDT endpoint is ALREADY deployed (`bddc541c`
is an ancestor of cortex-api's serving commit `bc7cf890`, carried incidentally
inside another lane's deploy). Only the env vars remain, and the secret lives
in a different GCP project.

## Open findings, none closed

- **ffi / ToUnicode instrument.** PDF content verification reads back through
  the document's own map, with a stale font assumption, across ten test files.
  Any claim about what a PDF SAYS is unreliable until an independent extraction
  path exists.
- **Fabricated-zero guard fails open** three ways, is asserted green in a test
  naming Hays, and has never run in production. Zero opportunities, not zero
  defects.
- **cortex-api serves `envelope: null`** where the database holds a declared
  decline, starving a PE renderer built to print the reason.
- **`seat_register.json` last-writer-wins.** Four two-seat collisions in one
  window. doc-repo-79 carrying a fix row.
- **"Merged" is not a terminal state.** Six instances across two programs.
  doc-repo-79 carrying it as an OPS-16 row.

## Errors I made, for the record

Propagated a stale claim into a dispatch from a correction sitting in a file I
had already read. Wrote a test that pinned a defect as a specification. Stated
a deploy delta as one commit when it was five. Priced three new dependencies as
a reliability risk and missed latency entirely. Compared three parcels that
were units in the same building and read it as evidence. Could not construct a
valid sabotage for the concurrency test and said so rather than claiming it
verified. Told the operator the LDT deploy was outstanding when it was already
live.

Three were caught by peers before they hardened.

## Leave-behind

    leave_behind:
      - item: chore/r04-coverage-probe (1 commit, unmerged diagnostic)
        owner: planner
        plan_row: P-120
      - item: R-06/R-07/R-08 worktrees, registered and empty
        owner: planner
        plan_row: P-120
      - item: courthouse items 16, 17a, 17b, 17b-gate disposition
        owner: operator
        plan_row: P-120
