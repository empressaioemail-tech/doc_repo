---
id: 2026-09-15_design_thread_HANDOFF
title: HANDOFF — the design thread, what is designed, and what a fresh planner must not repeat
date: 2026-09-15
status: handoff — read before proposing any design work
kind: handoff
owner: nick
programs: [OPS-17]
supersedes: _inbox/2026-09-15_design_pass_HANDOFF.md
related:
  - _design/INDEX.md
  - _decisions/2026-09-15_design_ratification_pass.md
  - _decisions/2026-09-15_plan_review_role_gate_deferred.md
  - _inbox/2026-09-15_connections_surface_findings.md
---

# HANDOFF — the design thread

**Bastrop approves the design before we build.** That ruling still governs. Everything below is
ordered by what gets to that approval without showing the city something we would not stand
behind.

This supersedes `_inbox/2026-09-15_design_pass_HANDOFF.md`. Read that one only for history.

## Read these first, in order

`_design/INDEX.md` — one line per design, current status on each.
`_design/README.md` — the folder convention. The source is the artifact, never the reverse.
`_inbox/2026-09-15_connections_surface_findings.md` — before proposing Connections.

Every canvas regenerates with `node gen.mjs` in its folder. **Every folder with a `check.mjs`
must have it run and pass before that design is shown to anyone**; see "The rule this thread
earned" below.

> **The design tables below are SUPERSEDED.** They were written mid-session and predate the
> Finance lens, Smart Files, the exports and the A-136 carding pass. Use
> `_inbox/2026-09-15_design_addendum.md`, which is counted from the folders and carries the plan
> rows, the per-surface source state, and the order to design in.

## What is designed, verified against the shipped nav

Verified against `smartcity-dashboards` `origin/main` `f776b4bf`, `web/index.html`: `LENS` is
nine, `WORK` is six, `DS_TABS` is seven. Not from memory.

### Lenses — 3 of 9

| Lens | Design | State |
|---|---|---|
| Overview (city-manager) | yes | RATIFIED, dispatched G-120 |
| Development services | yes, 6 artboards | **complete**, all seven tabs. IN REVIEW |
| Finance | yes, 5 artboards | **new 2026-09-15**. DRAFT. Its Localgov filings tab is a separate folder under AMEND |
| Citizen | no | the only `public-free` surface, the only one residents see |
| Public works | no | may be in Bastrop scope, see the role-gate deferral |
| Parks | no | |
| Police | no | not in the pilot |
| Fire and EMS | no | may be in Bastrop scope |
| Fleet | no | not in the pilot |

### Development services tabs — 7 of 7

Pipeline, Inspections, Work orders, Code enforcement, Licenses, Plan review, Flood study. All
designed. Inspections, Code enforcement and Licenses were added 2026-09-15.

### Work group — 2 of 3

| Surface | Design | State |
|---|---|---|
| Plan review | yes, ×3 folders | console IN REVIEW; reasoner RATIFIED; departments DRAFT, may be shown, cannot be built |
| Files (Smart Files) | yes, 5 artboards | **new 2026-09-15**. DRAFT. Drawn against its own repo, not the dashboards mount |
| Records search | no | ships as a stub with a NOT BUILT badge |

### City group — 0 of 3

| Surface | State |
|---|---|
| Assets | not designed. Doc 32 says G-24 stays zero until a named ingest, so drawing it now is drawing wallpaper |
| Connections | **NOT a design candidate.** Operator ruling: engineering thought first. See the findings card |
| People and access | not designed. In the nav marked NOT BUILT. It is the WorkOS surface |

### Cross-cutting

Map dock **designed, approved, dispatched G-128**. Compass, shell chrome (G-90) and the
applicant-facing plan review view are not designed.

## Rulings made this thread

**Design ratification pass**, `_decisions/2026-09-15_design_ratification_pass.md`. Flood study
RATIFIED. Plan review reasoner RATIFIED. Finance Localgov filings **AMEND**, and it may not be
ratified or enter a customer artefact until two citations are sourced or badged: an ordinance
rate of 7.00% attributed to Bastrop's own code, and a fund number attributed to the city ledger.
Neither traces to anything.

**Plan review role gate DEFERRED**, `_decisions/2026-09-15_plan_review_role_gate_deferred.md`.
Not killed. Trigger: before launch unconditionally, or Bastrop naming Fire and EMS, Public works
or Parks in scope, or a second city with a parallel-review requirement. **Recorded in that file:
the deferral currently has no mechanism.** Its only trigger is that somebody remembers, which by
the three-question gate is not a control. It needs an OPS-17 row that fails a launch gate while
open, and that row does not exist.

## The rule this thread earned, and it is not optional

**No design is shown or ratified without an adversarial read against source, run as a file.**

The evidence, all from one day. Every defect below was found by comparing a canvas against an
independently derived source. **Not one was findable by re-reading the canvas.**

| Where | Defect |
|---|---|
| Development services | a `Place` tab the product never had; the map became a dock rail |
| Development services | five named people on a published workload ranking, traceable to no source in either repo |
| Development services | licence rows in the wrong sort order — within a band the sort is by expiry offset, not id |
| Development services | three residents named beside their addresses, two of them the same people the folder README quotes as PII the design must not render |
| Finance filings | a 7.00% tax rate attributed to the city's own ordinance, traceable to nothing, scoring three of their filings as exceptions |
| Connections | the planner asserted a dependency to the operator that does not hold for Bastrop |
| Smart Files | a check that self-tested correctly and had **zero inputs** on every artboard |

Three folders now carry a `check.mjs`: `smartcity-dev-services`, `smartcity-finance-lens`
and `smart-files`. Each one self-tests in both directions, aborts rather than reporting a
worthless verdict, and has been **verified by violation against a real artboard**.

Three lessons a fresh planner should take as standing:

**Check the source state before recommending a surface, not after.** Connections was proposed as
the top priority on two premises. Both were wrong, and reading the source took ten minutes.

**A check with no inputs is worse than no check.** The Smart Files reason predicate passed its
self-tests and never matched anything on any artboard, because the canvas rendered display forms
and not the product's codes. It reported success and checked nothing.

**A convenient result is a reason to distrust the instrument.** The Finance count verifier
reported five mismatches; one of them was its own bug (`generatePipelineRecords` returns `[]`
without `generatesFixtures: true`, silently).

## Owed by the operator, unchanged

| Item | Blocks |
|---|---|
| WorkOS org, client id, API key, MFA, `bastrop_tx` key | soft launch, and the People and access design |
| The Azavar reply, four questions and four credentials | Localgov filings integration; scope card already written |
| Ratify / amend / kill on the three new drafts: Finance lens, Smart Files, and the Development services lens | the Bastrop review artefact |
| Which of the **three** plan review designs a city is shown | the approval package |
| Whether the Finance tab is in the Bastrop package at all | the first cohort is Development Services and Finance is not in their daily path |

## Two loose ends carried, not dropped

**The vocabulary defect in `_design/plan-review/gen.mjs`** is still translated at build time by
the review-artefact build script rather than fixed at source. Owed.

**`_catalog/lane_claims.json` blocked a push mid-thread and then resolved itself.** Two lanes
wrote it concurrently: the `P-226` claim sat uncommitted in this checkout while the `P-228`
claim landed on origin. The planner did not touch it, because a claim means a seat started a
lane and stashing one could drop it. The other seat then committed its claim, the merge went
through, and `aaa0864` is on `origin/main`. Nothing is stranded.

The pattern is worth keeping: a shared append-only file written by concurrent lanes will block
a planner push, and the right move is to wait rather than to adjudicate another seat live
state. ENFORCEMENT already says write to your own file under your namespace rather than to the
shared one, and this file is the counter-example still in use.

## The next design items, and the demo is why they matter

The demo includes everything we have, so every surface below is now blocking it. Order is by
audience width and by whether the source state has been checked.

**Citizen lens.** It is the only `public-free` surface and the only one residents ever see, which
makes it the widest-audience thing left and a strong item for a city-manager conversation. It
ships today with real markup — the nav badges it `Preview`, and the Connections register row 64
records "Citizen service requests — Citizen lens. The twelve-tile grid was dropped," so there is
a design history to read before drawing.

After that, **People and access**, which is the WorkOS surface: the thing blocking the soft
launch and the next design are the same thing. Design it as four things — provisioning, role
assignment, offboarding, and the audit trail that answers *who looked at that citizen's record*,
which the cutover card says cannot be answered today. For a government customer the audit view
is a trust surface, not an admin screen.

After those two, the remaining blockers for a complete demo are Records search, Compass, the
shell chrome set, the applicant-facing plan review view, and the five lenses with no design:
Public works, Parks, Police, Fire and EMS, Fleet. Check each one at source before proposing it.

Still do not take Assets: doc 32 says G-24 stays zero until a named ingest, so it would be
wallpaper in a demo as much as anywhere else. Still do not take Connections until the
engineering pass the operator called for has happened.

## The Bastrop demo, ruled 2026-09-15 and not yet built

The operator asked for a **clickable prototype**, not a slideshow and not a document: a
non-functional but navigable app the city can flip through, hosted on Vercel.

**Two rulings.**

**It includes everything we have, and design gets settled first.** The demo is not scoped down
to the first cohort. That inverts the priority in this handoff: the undesigned list above is now
the demo's blocking list, and it is the finish line the remaining design work did not have.

**The v1 comparison is excluded from the demo.** The Finance artboards keep their "what v1
prints here" boxes, because that is the internal argument and the acquisition case. The DEMO
BUILD filters them out. Those boxes call out defects in our own v1 that Bastrop uses today, and
that is a franker conversation with Sylvia than a room that may include council members.

**The filter needs to be a control, not a habit.** The review-artefact build already established
the shape: a BANNED guard that refuses to write the document if an internal term survives. The
demo build does the same and refuses to emit rather than shipping a box nobody noticed.

**Feasibility, already checked so nobody re-derives it.**

Each artboard carries exactly one template hole (`{{themeClass}}`) and a strippable
`<x-dc>`/`<helmet>`/`<script data-dc-script>` wrapper, so converting one to standalone HTML is
mechanical: resolve the hole to `sc-dark`, inline the kit, drop the wrapper.

Nav markup is **identical across folders built by different sessions** — every nav item is a
`<span style="flex:1; min-width:0; font:...">NAME</span>` — so a build script can locate nav
items and tab strips by shape, match their text against a route map, and wire real clicks.
`plan-review` is the one exception: it has no lens nav because it is a different product shell,
so it is entered from the Development services tab strip.

**Also excluded, and these are not preferences.** The sticky-note annotations never ship; they
are written for us. `smartcity-finance-filings` is excluded while its AMEND ruling stands. The
Place tab is excluded as superseded, and Smart Files' Gaps artboard is internal.

**A dead end must say so.** A demo that silently ignores a click reads as broken, so an
undesigned destination gets a quiet honest state rather than nothing.

## Conventions any new session must hold

Tokens are copied from the product, never invented; `_kit.css` is byte-identical across every
folder and there are now eleven. Absent, zero and unmeasured are three different states and no
surface collapses them. Fixture data is badged as fixture on the page. Nobody is named on a
published canvas. Every money figure is traceable to a record or the artboard declares itself
illustrative. Commit by explicit pathspec; another seat commits into this repo continuously and
its tip moved more than a dozen times during this thread.
