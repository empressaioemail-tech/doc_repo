---
id: 2026-09-15_design_pass_claude_code
title: Session — the design pass, plan review reframed, and a false thesis caught
date: 2026-09-15
last_updated: 2026-09-15
status: session record
owner: nick
seat: doc_repo integration
programs: [OPS-17]
plan_rows: [none taken — design records only, no plan rows claimed]
related:
  - _inbox/2026-09-15_design_pass_HANDOFF.md
  - _inbox/2026-09-15_localgov_filings_integration_scope.md
  - _design/INDEX.md
  - _decisions/2026-09-14_staff_identity_and_department_rbac.md
  - _decisions/2026-09-14_flood_determination_authority.md
---

# Session — the design pass

Opened on hotel occupancy tax. Became a design pass across five surfaces, a market read on
plan review, and three adversarial reviews that each found real defects in the planner's own
work.

## The framing that governs everything here

**Operator, 2026-09-15: Bastrop approves the design before we build.** That is why the design
pass exists. The canvases are not internal artefacts; they are the input to a customer
decision. The inventory of what is NOT yet designed is therefore the critical artefact, and it
is in the handoff.

## Hotel occupancy tax — found, and we are the blocker

The scope was never lost. It lived in `nick@smartcityos.io`, which this seat cannot read, so
a full sweep of both doc_repo clones, git history, Gmail and Drive came back empty and said so.

The operator's 2026-07-27 email IS the scope: gross revenue, exemptions, penalties, interest,
tax due, and the tax actually remitted. Azavar built it. `bastrop-custom-api` spec generated
2026-08-06, delivered 2026-08-14. The city's IT director told the vendor we were implementing.
**Thirty-two days later there were zero lines of code and zero credentials.**

Credentials verified absent in `smartcity-os-prod` (49 secrets), `smartcity-dashboards` (32)
and every local env file, with known-present controls returning rows in the same query so the
absence is real rather than a failed instrument.

Scope filed at `_inbox/2026-09-15_localgov_filings_integration_scope.md`. Four findings shape
it: the endpoint carries **no tax-type field** so nothing may be labelled hotel occupancy tax;
there is **no taxpayer identifier**, so it cannot answer who has not filed; **absence arrives
as zero**, so no rate or average may be computed; and `AmountPaid` excludes processing fees,
so a structural delta against the booked figure is expected and is not an error.

Architecture settled by reading the code rather than guessing: `smartcity-dashboards` already
reads real vendor data by calling `smartcity-os` platform routes with
`PLATFORM_INTERNAL_API_KEY`, which is how all five non-MyGov live feeds work. So the Cognito
client is written **once**, in v1, exposed as platform route **thirteen**, and v2 consumes it
as it already consumes five others. Email to Azavar drafted and **sent** by the operator:
credentials plus four questions.

## Designs produced

Five new folders under `_design/`, all draft, none ratified.

| Folder | What |
|---|---|
| `smartcity-finance-filings` | Localgov filings at five states. The headline is an agreement, not an amount. |
| `smartcity-flood-study` | Flood and drainage screening at five states. The tab becomes a screening list. |
| `plan-review-reasoner` | Plan review as a reasoning companion. Five states. |
| `plan-review-departments` | Parallel department review. Five states. **Blocked on a ruling amendment.** |
| `all-canvas` | Derived view: every design on one canvas, one row per surface. |

`bastrop-review` was built as a customer review document and **dropped by the operator** — the
compilation did not hold together. Its build script survives and the gitignore entry with it;
the round-two approach is in the handoff.

## Plan review — the strategic move of the session

**Operator ruling: plan review is a COMPANION product, not a plan review system.** No markup,
no batch stamping, no measurement tools, no document workflow.

The market read that produced it: the category (Avolve/ProjectDox, DigEplan, GeoCivix,
Bluebeam) is document workflow, and the reviewer brings the code knowledge.
**CodeComply.Ai launched March 2026, sits inside CivicPlus at 850+ local governments, and is
endorsed on TXShare** — the Texas cooperative purchasing programme. We are not early to AI
plan review and we cannot out-distribute that channel. What their published material does not
carry is any accuracy figure, confidence metric or liability posture. That is the flank.

The design that follows from it: applicability from the adopted edition, findings cited to
real code, and honest absence on two axes that are never added together — our corpus could not
supply the rule, versus the section is fine and no adjudicator exists.

## The rulings this session needs and does not have

**The plan-review role gate must be amended or the departments design cannot be built.**
`_decisions/2026-09-14_staff_identity_and_department_rbac.md` gates plan review to Development
services and city-manager; parallel review needs Fire and EMS, Public works and Parks to reach
it. Proposed amendment uses that ruling's own logic: a department reaches plan review only
through its own scope, which is what the ruling says makes Overview a roll-up rather than a
leak. Roster stays the nine lenses.

Four designs await ratify, amend or kill. A design record is not a decision.

## Three adversarial reviews, three sets of real defects

Every canvas was reviewed against source before hand-off. Every review found material errors
in the planner's own work, and **not one was caught by re-reading the conclusion.**

**Finance, ten findings.** A column that did not sum, a reconciliation headline stating the
gap in the wrong direction, an artboard overflowing its frame by 230px, and one parcel
reported as both ponding and not ponding on two screens.

**Flood study.** Invented a storm duration and 2-year/10-year/100-year preset labels the
engine has no concept of; invented two outputs with no layer behind them; dropped the FEMA
reference layer from a legend on a design whose entire thesis is that both answers show side
by side; drew ponding at roughly double the share the panel beside it stated.

**Plan review — the worst of the three.** The planner asserted a central thesis that was
**false**, and told the operator the code had handed it over. A live intake field, a persisted
column and a plumbed adjudicator all existed; `adjudication.mjs` says so in the same comment
block the planner was quoting from. The planner took a sentence about the atom chain,
generalised it to the whole service, liked the result and stopped checking. Also fabricated:
a book title that does not exist in source, section numbers with the wrong separator, a
section (`14-02-005`) that does not exist at all and was cited six times including in an
issued letter, and a paraphrase of IBC on the same canvas as a panel promising never to
paraphrase a code we are not licensed to quote.

**The rule this produces: no design is ratified without an adversarial read against source.**
It is cheap and it caught fabricated citations that would otherwise have reached a city in a
correction letter.

## Loose ends leaving this session

`_design/plan-review/gen.mjs` renders engine identifiers where a reader expects a code
citation, and shows an internal QA note beside the Start a review button. Currently translated
at composition time by `_design/bastrop-review/build.mjs`; **owed at source.**

Azavar reply outstanding: four questions and the four credential items.

`00_current_state.md` deliberately not regenerated. Another session closed 50 minutes before
this one and the repo tip moved four times during this session; the snapshot is not this
seat's to rewrite today.

`_design/report-chrome/` is another session's folder, untracked and absent from `INDEX.md`.
Flagged, not touched.

leave_behind:
  - item: plan-review/gen.mjs vocabulary defect (engine identifiers, internal QA note)
    owner: nick
    plan_row: allocate at dispatch
  - item: four design records awaiting ratify/amend/kill
    owner: nick
    plan_row: n/a — decision records owed
