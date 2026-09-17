---
id: 2026-09-17_HANDOFF_design_implementation
title: Handoff to a fresh planner, 2026-09-17 — building the SmartCity designs
date: 2026-09-17
last_updated: 2026-09-17
status: active handoff
kind: handoff
owner: nick
from: integration seat, session e579268a (design thread, 2026-09-17)
programs: [OPS-17, OPS-25]
related:
  - _design/SMARTCITY_PACKAGE.md (the entry point for SmartCity; read it second)
  - _design/INDEX.md (one line per design)
  - _design/smartcity-applicant-precheck/README.md (the design drawn this session)
  - 90_operations/OPS-17_govtech_stack_plan_of_record.md (rows G-137 to G-148; last amendment A-140)
  - 90_operations/OPS-25_cloud_infrastructure_and_cost_program.md (D-5, D-9, D-10: the migration under this work)
  - _decisions/2026-09-15_plan_review_reasoner_is_the_shown_design.md
  - _inbox/2026-09-15_localgov_filings_integration_scope.md
snapshot: doc_repo main c2e8c7f6 at handoff time (D-9/D-10/D-11 closes landed mid-session); smartcity-dashboards origin/main f776b4bf (unchanged since 2026-09-15); design gate UNFINISHED with 7 findings
---

# Handoff: building the SmartCity designs

You are picking up a design track that is finished enough to build and is gated on ratification, not
on drawing. The operator is ready to start implementation.

Read `_design/SMARTCITY_PACKAGE.md` after this file. It is the standing entry point and carries the
live product link, the design canvas link, the per-vendor integration reality and what the operator
owes.

## Declare your snapshot before you work

Repository, branch, commit, and the state of the tree. This clone is shared: other seats commit into
`P:/doc_repo` while you work (main moved from `ac710a1e` to `c2e8c7f6` during the session that wrote
this file). Commit by explicit pathspec, never `git add -A`, and check `git diff --cached --stat`
before every commit.

## The one thing that will surprise you

**The SmartCity product line moved to DigitalOcean today, and that is where the designs get built.**
OPS-25, read its "Status as of 2026-09-17T21:00Z" section before touching anything. Verified state,
not a plan:

- `smartcityos.io` and `www` are served from DigitalOcean App Platform (`walrus-app` =
  `smartcity-api`, commit `e783f351`, which is the verified `8bea7fa` plus a healthcheck fix). D-9
  CLOSED.
- `dolphin-app` = `smartcity-dashboards`, commit `178e968`, which is the verified `96efa35` plus a
  `.gitattributes` fix, 17 of 17 paths byte-identical to GCP. **No custom domain and no customer
  traffic on it yet.**
- **Deploy-on-push is disabled on both apps.** Merging to `smartcity-dashboards` main does not deploy
  anything, on DO or on GCP.
- Nothing has been decommissioned. The GCP Cloud Run originals and the D-5 droplets are all still
  running as the rollback path through the bake period.

**What this means for you.** Two consequences, and the second is the one that bites:

1. Merging a build row to `smartcity-dashboards` main is safe. It reaches no environment by itself.
2. **Shipping it is now a deliberate act on a pinned commit, not a merge.** The DO app runs a pinned
   build; main is at `f776b4bf` and the pin is `178e968`. Any row whose done-condition is "live on
   the customer surface" has to say which app serves that surface, which commit it moves to, and who
   moves it. Ask the operator before assuming a deploy path; the six open items at the top of OPS-25
   include the bake period and decommissioning, and none of them has an owner.

## Where design actually stands, measured

`node scripts/govtech/design-completion-gate.mjs` from the repo root. It refuses rather than reports
and exits 1 while design is unfinished. As of 2026-09-17:

    nav surfaces:        15
    designed:            10
    excluded by ruling:   2
    uncovered:            3
    design folders:      17, with an instrument: 9
    verdict: UNFINISHED — 7 findings

The three uncovered surfaces are Citizen (G-142), Records search (G-147) and People and access
(G-143). The four findings under R3 are designs past DRAFT with no adversarial read, which is G-148
and is HELD by the operator.

## What can be built today, and what cannot

| Design | Status | Can a build row be cut |
|---|---|---|
| Overview lens | RATIFIED, shipped G-120 | built |
| Development services lens | shipped G-123 | built |
| Map dock | APPROVED, shipped G-128 | built |
| Flood study | RATIFIED 2026-09-15 | **yes**, implementation row to allocate; G-125 and G-129 already landed parts of it |
| Plan review, the reasoner path | RATIFIED 2026-09-15, and ruled the design a city is shown | **yes**, never dispatched, implementation row to allocate |
| Applicant precheck | DRAFT 2026-09-17, new | no, needs ratification and a blending ruling |
| Finance lens, Localgov filings, Smart Files, the five department lenses, plan review departments | DRAFT or AMEND | no, needs ratification |

**So the honest answer to "we are ready to implement" is: two designs are ratified and unbuilt, the
reasoner path and the flood study. Everything else needs the operator's ratify, amend or kill pass
first.** That pass is the gate on the Bastrop approval package and it has been owed since 2026-09-15.

## No row, no work

OPS-17's last amendment is A-140 and its rows stop at G-148. **There is no build row for the reasoner
path, the flood study or the precheck.** Your first act after the operator ratifies is an OPS-17
amendment that cards the build rows, because a dispatch without a `PLAN-ROW: G-xx` is refused by the
compiler and the canon-gate hook.

## Owed by the operator, and each one blocks something

| Item | Blocks |
|---|---|
| **Ratify, amend or kill.** Eight drafts before this session, nine with the precheck | every build row that is not the reasoner or the flood study |
| **The blending ruling:** how Smart Site, Smart Files, SmartCity plan review and Development services fit together | the precheck build, and the question of which service runs the check |
| Operator-namespace ruling: is `OPR-01` the same person in Fleet and in Police | any build on either lens |
| WorkOS org, client id, API key, MFA, `bastrop_tx` key | G-132, G-134, the soft launch |
| The Bastrop GIS question: which zoning code is in force (G-140) | honest zoning anywhere, and the precheck's rule set |
| The fund number for the filings AMEND, from the city finance director | G-138 |
| The Azavar reply | G-137, the hotel occupancy tax integration |
| Who pays for precheck, and which checks ship first | the precheck's public page, which stays in preview until access is set |

## The Azavar reply is drafted and needs sending

Khalid AlAli answered all four of our questions on 2026-09-15. A reply was drafted in the session
that wrote this file and is not yet sent. It requests both API accounts under
**admin@smartcityos.io** (operator's choice), confirms the four additive field groups they proposed,
asks for Demo first with Production provisioning started in parallel, and adds five asks: filing
period as explicit start and end dates, `ModifiedDate` as a filter and not only a field, a null
versus zero rule for future forms, how a voided filing is visible, and whether a roster of registered
HOT businesses exists so non-filers can be found.

**Two consequences for the build, both real:**

1. Their Q3 answer breaks one of our own acceptance tests. `_inbox/2026-09-15_localgov_filings_integration_scope.md`
   says the store is done when a re-run changes no historical total. `AmountPaid` legitimately changes
   as payments settle or refund, so the test must separate taxpayer-reported figures, which must never
   change under re-fetch, from payment figures, which may. Otherwise the first refund reads as
   corruption.
2. Q1 and Q2 unblock two things the scope card froze: the word "hotel" on a label, and computing any
   rate or ratio over the monetary fields.

The scope card still reads as though all four questions are open. Fold the answers in before anyone
builds from it.

## The design drawn this session

`_design/smartcity-applicant-precheck/`, ten artboards, DRAFT, on the combined canvas as the first
row (`https://claude.ai/artifact/FBWcVY3f1gRa3HswLoeQaY`, version 11).

A pre-submittal self-check for applicants: find the lot, pick a project type, see the checklist
before uploading, upload a plan set, get findings, revise, and apply even with suggestions open. The
city sets the rules, opens a precheck by its code, and records a decision against the lot.

Four operator directions shaped it on 2026-09-17: SmartCity is the product and this is a SmartCity
public surface, not a Smart Site screen; branding is SmartCity plus the city's logo; the AI reads the
plan set and there is no dimension form; it never blocks.

Its README carries the open questions, the fixture story and one assumption to confirm before
ratification: the boards cite `14-02-003` for side and rear setbacks, height and coverage as well as
the front, which assumes the district requirements section carries those standards.

`node check.mjs` (13 rules, 20 self-tests) and `node violate.mjs` (21 plants on the real boards) both
pass in that folder.

## The reuse inventory, which is what makes implementation plannable

Read directly from clones at `plan-review` 9149595f, `smartcity-dashboards` f776b4bf,
`legacy-design-tools` dca5ec2e, `hauska-map` 88ac6c51, `smart-files` 61c84f61 and
`hauska-atom-contract` 5f8f531d (v1.36.0). It exists nowhere else: the subagents that were to write
it were refused by the fan-depth gate, so it was read by hand.

| Piece | State today |
|---|---|
| Sign-in | Google, Microsoft and an email magic link exist in `legacy-design-tools` (`peAuth.ts`, `peMagicLink.ts`) |
| Tiers | Per user: free or paid, then Solo, Studio, Team, a 30-day property unlock, a dev role (`peEntitlement.ts`). **Nothing is per city** |
| City pack | `city-pack.mjs:110` carries cityKey, FIPS, display name, access policy, environment, lenses, granted adapters, notes. **No branding, no rule set, no project types, no submission text** |
| Deterministic check | `plan-review` runs a four-row fixed checklist; only the front setback can pass or fail, against a number typed on a form (`adjudication.mjs`). The Bastrop row is labelled SF-1 for every parcel, which is a defect |
| AI check | `legacy-design-tools` `lib/finding-engine`: vision sheet read plus Grok, categories including setback, height, coverage. **Reports problems only**, and `lib/eval` has no known-answer set, so accuracy is unmeasured |
| Reviewer | `plan-review` has override with a reason and the five engagement stages; the adjudication id it returns is a local pending marker, not a stored atom |
| Decisions feeding back | `legacy-design-tools` records outcome observations (permit-approved, variance-granted, comment-resolved) and a per-atom adjudication ledger, partitioned by `jurisdictionTenant`, attached to findings rather than parcels |
| Parcel write-back | The atom contract has no permit or decision atom type in the property family |
| Verification link | Smart Site share links are signed, single-parcel and **expire**. That is not a verifier |

Net new for the precheck: project types and checklists, version comparison, the findings document,
the precheck code and public verify page, apply-anyway, packet lookup by code, and every city setting.

## How you work here

- This seat owns no product repo. Deliverables are compiled dispatches to the owning seat, never
  merges. `smartcity-dashboards`, `smart-files`, `plan-review` and `icc-portal` are govtech.
- Dispatches are compiled, never written by hand:
  `node scripts/dispatch.mjs --plan OPS-17 --lane <id> --plan-row <G-xx>`. The canon-gate hook
  refuses anything missing the current preamble and contract hashes or a valid row.
- **Subagent launches from `P:/doc_repo` are currently refused** by the fan-depth gate, because lane
  `p275-live-currency-five-counties` holds a claim in this worktree's `_catalog/lane_claims.json`.
  Either that lane releases it, or the claim goes stale after eight hours, or you do the work
  yourself. Do not route around the gate.
- Any Agent-tool prompt from this repo needs the full compiled dispatch header, even a read-only one.
- Commits in doc_repo are planner-owned and presented for review before they land.

## First five actions

1. Declare your snapshot and read `_design/SMARTCITY_PACKAGE.md`, then `_design/INDEX.md`.
2. Run the design gate and confirm the numbers above rather than trusting them.
3. Ask the operator for the ratify, amend or kill pass on the nine drafts, and for the blending
   ruling. Those two unlock everything that is not already ratified.
4. Card the build rows in an OPS-17 amendment for what is ratified: the reasoner path and the flood
   study first, since they need nothing from anybody.
5. For any row whose done-condition is a live customer surface, settle the deploy path first: which
   app serves it (`dolphin-app` for dashboards, `walrus-app` for `smartcityos.io`), which pinned
   commit moves, and who moves it. Deploy-on-push is off, so a merge ships nothing on its own.

## Uncommitted at handoff

The session that wrote this file left the following uncommitted, and the operator had not yet given
the go: `_design/smartcity-applicant-precheck/` (the new design folder), `_design/all-canvas/seed-canvas.mjs`
(the canvas seeding script, which had never been committed and was rebuilt), edits to
`_design/all-canvas/build.mjs`, `_design/all-canvas/README.md` and `_design/INDEX.md`, and four unused
inventory dispatches under `_dispatches/2026-09-17_g142-precheck-inv-*` with their mission files,
which were compiled and never ran and should be deleted. Other seats' uncommitted work is in the same
tree. Commit by explicit pathspec.
