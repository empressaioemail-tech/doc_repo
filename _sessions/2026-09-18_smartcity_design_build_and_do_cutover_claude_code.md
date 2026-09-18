---
id: 2026-09-18_smartcity_design_build_and_do_cutover_claude_code
title: "Session: every SmartCity design approved and carded, the dashboards moved to DigitalOcean, and three designs fixed against source"
date: 2026-09-18
last_updated: 2026-09-18
kind: session
session_type: planning
status: closed (operator asked for a commit; nothing of this seat's work remained uncommitted, so this summary is that commit)
agent: claude_code
repo: doc_repo
owner: nick
seat: integration (SmartCity planning agent, design build and DigitalOcean migration)
programs: [OPS-17, OPS-25]
memory_graded: [cloud-run-traffic-trap:HELPED, no-repo-auto-deploys-on-merge:HELPED, doc-repo-concurrent-commit-hazard:HELPED, dirty-tree-close-gate-inspects-command-string:HELPED, a-recorded-correction-does-not-regenerate-its-artifact:HELPED, integration-seat-owns-no-product-repo:HELPED, dispatches-are-compiled-not-authored:HELPED]
rolled_up: false
related:
  - _inbox/2026-09-17_HANDOFF_smartcity_combined.md (the handoff this session picked up)
  - _design/SMARTCITY_PACKAGE.md (current; carries the live queue)
  - 90_operations/OPS-17_govtech_stack_plan_of_record.md (A-141 to A-145; rows G-149 to G-158)
  - 90_operations/OPS-25_cloud_infrastructure_and_cost_program.md (D-12; A-5; rules 13 and 14)
  - _decisions/2026-09-17_design_ratification_all_approved.md
  - _decisions/2026-09-17_operator_reference_namespaced_by_domain.md
snapshot: doc_repo main 565214c1 at close; smartcity-dashboards main 3d3ec62a; plan-review main 99c156ba serving plan-review-00029-gom; dolphin-app building main 3d3ec62a behind app.smartcityos.io; read 2026-09-18
---

# Session: every SmartCity design approved and carded, the dashboards moved to DigitalOcean, and three designs fixed against source

This session picked up the combined SmartCity handoff and ran both threads it merged: the design build
and the DigitalOcean migration that build now depends on. It opened with nothing ratified past two
designs and no build rows. It closed with every design approved or drawn, every approved design carded,
the dashboards served from DigitalOcean, and three first-wave dispatches in the operator's hands.

## What the operator ruled

| Ruling | Where it landed |
|---|---|
| Every SmartCity design is approved | `_decisions/2026-09-17_design_ratification_all_approved.md`, A-141 |
| The dashboards move to DigitalOcean before any build work | OPS-25 D-12, A-5 |
| The dashboards hostname is `app.smartcityos.io` | D-12 |
| `plan-review` stays on GCP, so G-150 runs in parallel | G-150 |
| The applicant-precheck blending ruling is deferred | A-141 |
| Operator references are namespaced by domain: `FL-OPR-nn`, `PV-OPR-nn` | `_decisions/2026-09-17_operator_reference_namespaced_by_domain.md` |
| The next deliverable is Finance, hotel occupancy tax, the financial tooling, full RBAC and the city management board | A-143 |
| RBAC goes to full department depth, design first | A-143 |
| The city management board is the v1 dashboard, all departments combined | G-157 |

## What moved

**The dashboards cutover is live and verified.** The D-12 lane reconciled the pin branch, repointed
`dolphin-app` at `main`, and stopped at the DNS step, which is the operator's. The operator made both
DNS changes. The cutover was verified by the lane's own response-body marker rather than by headers:
`/auth/sign-in` returns 500 `signin_not_configured` on `app.smartcityos.io` and on `dolphin-app`, and
404 on the GCP original. **No staff have moved yet.** It is a new hostname and nothing points anyone at
it, so the bake cannot start until Bastrop is told the URL.

**G-150, the reasoner path, is built and deployed** on `plan-review-00029-gom`, off the old pin. Its
instrument was re-run here rather than taken on report, and caught 27 of 27 violations. It filed no close
artifact, so a close-out dispatch was compiled.

**Every approved design has a build row.** Eight designs were carded across six rows (G-151 to G-156),
grouped by what blocks them. G-157 was carded for the city management board, and G-158 for the access
log. The dashboards rows run one at a time, because every lens renders in two monolithic files (A-144).

**Three designs were fixed against source, each with a check verified by violation.** The HOT scope
card's store test now separates reported figures from payment figures. G-138, the filings design, now
badges both untraced citations at every use and holds its rate check, and its violation harness caught
13 of 13. G-143, People and access, is drawn and caught 20 of 20; it is DRAFT awaiting ratification.

## What source said that the documents did not

These came from reading code, not from the handoffs, and several contradicted them.

The GCP dashboards original lives in its own project with traffic pinned by revision name. `plan-review`
and `smart-files` carry the same pin, so a plain redeploy on any of them is a silent no-op that reports
success. `dolphin-app` was building from a branch diverged from `main` in both directions, so a cutover
alone would have left every future merge invisible to the running app.

A DigitalOcean deployment reported `build=SUCCESS deploy=SUCCESS`, went ACTIVE on branch `main`, and ran
a commit from before the change. Only a byte comparison caught it. That is now OPS-25 rule 13: read back
`services[0].source_commit_hash` after every deploy.

Three row statuses in OPS-17 lagged their own close artifacts: G-125, G-128 and G-145. The amendments
were right and the status cells were stale proxies. Nothing enforces agreement between a close and its
row.

The design gate reads status from `_design/INDEX.md` and never opens a folder README. Flipping eleven
READMEs to RATIFIED moved it not at all, which read as "approval is free" until the gate's source was
read.

No lens is blocked on a vendor. The obvious carding put four vendor blockers on the lens rows. Every
one of those designs draws its own blocked state, so they ship without the vendor.

On G-143, a role limits nothing yet. Nothing records who opened a record. The city manager's list cannot
show the SmartCity administrators who reach every city. A never-provisioned person is told their account
was disabled. Details are in A-145.

## What went wrong in the doing, and was caught

**A commit swept in five files belonging to another seat.** Paths had been staged explicitly and
`--cached` checked. Another seat staged into the shared index in the gap between the check and the
commit. The commit was unpushed, so it was reset, the other seat's work confirmed intact, and
recommitted with `git commit -- <paths>`, which ignores the index. Every commit after that used the same
form.

**Shell strings stripped regex backslashes five times, and each time the result still ran.** One pattern
could match nothing, and so reported "no role checks" for any input. Another became an alternation with
an empty branch that matches every input. A `sed` violation test failed on its own quoting, wrote an
empty file and exited 0. An exit code read as `$?` after a pipe reported 0 while the check was refusing a
verdict. Every one was caught by a control or by a result that contradicted itself. None was caught by
re-reading a conclusion. Saved as memory `shell-strings-strip-regex-backslashes`.

**A heredoc ran backticks as command substitution** and silently ate paragraphs of an amendment. It was
caught on inspection and redone from a file with a content check.

**Visual review caught what no check could.** The Access board declared 7 accounts and showed 6. The
seventh, the city manager's own account, was clipped by the board height. An empty column title
rendered `[OBJECT OBJECT]`.

## Owed by the operator

| Item | Blocks |
|---|---|
| Tell Bastrop staff to use `app.smartcityos.io` | the D-12 bake, and every decommission behind it |
| Ratify G-143 | G-134, G-127, G-144, G-158 |
| Amend the 2026-09-14 ruling: it says both "read-only for the city manager" and "admin only" | nothing now; the code follows Ruling 1 |
| Name an owner and a turnaround for offboarding | the first staff departure after go-live |
| A capture of the v1 combined dashboard | G-157 |
| Send the Azavar reply, and file Khalid's answers verbatim | G-137, and lifting the scope card's Q1 and Q2 freezes |
| WorkOS org, client id, API key, MFA, `bastrop_tx` key | G-134 and the RBAC leg |
| Whether to republish the stale design links | filings and reasoner links still show the pre-fix designs |
| Whether Finance data ships before RBAC | G-156's move from the non-production app to production |

## In flight

G-156 (Finance lens), G-155 (Smart Files) and the G-150 close-out were compiled and handed to the
operator to carry. Their closes land in `_inbox/`.

## Leave-behind

```
leave_behind:
  - item: doc, 00_current_state.md not regenerated; shared with seats active at close, and the SmartCity state is current in SMARTCITY_PACKAGE, OPS-17 and OPS-25
    owner: next integration-seat session close
    plan_row: none
  - item: doc, _design/all-canvas not rebuilt; build.mjs does not yet declare smartcity-people-and-access
    owner: doc_repo planner
    plan_row: G-146
  - item: doc, stale derived exports; the filings and reasoner combined .html, the _design/exports PNGs, and the exports README line listing filings as NOT cleared under AMEND
    owner: doc_repo planner
    plan_row: G-138 / G-150
  - item: store, the D-12 lane claim is still held; the bake has not started because no staff have moved
    owner: d12 lane
    plan_row: D-12
  - item: gate, nothing compares an _inbox close's planRows to its row status (three stale rows found this session)
    owner: nick
    plan_row: none, not carded
  - item: gate, nothing compares a design README's status to its INDEX.md status
    owner: nick
    plan_row: none, not carded
  - item: doc, OPS-25's other open items (scraper concurrency and TLS, apex certificate renewal before 2026-12-16, smartcity-os main drift, P-154) still have no owner
    owner: nick
    plan_row: OPS-25
```

## Commits

`e2239c1a`, `c0f2dd32`, `005a17bb`, `040bd8a1`, `d3aa6752`, `df9ced8c`, `2d21a54a` (merge of the D-12
lane), `f3693c9a`, `46718be1`, `c37328a2`, `485c9d81`, `fb31a343`, `c3af32d4`, and this summary.
