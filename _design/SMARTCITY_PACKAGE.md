---
id: smartcity_package
title: "SmartCity OS — the package: links, state, and what is next"
status: active
last_updated: 2026-09-18
applies_to: smartcity
owner: nick
programs: [OPS-17]
purpose: The one file to open when picking SmartCity back up. Carries the three live links, the measured state of design and build, what is owed by whom, and what to do next. Everything here is traceable to an instrument or a named source; nothing is remembered.
related:
  - _design/INDEX.md
  - 90_operations/OPS-17_govtech_stack_plan_of_record.md
  - _smartcity_masters/31_smartcity_dashboards.md
  - _inbox/2026-09-15_roadmap_reconciliation.md
  - _inbox/2026-09-15_design_addendum.md
---

# SmartCity OS — the package

Unparked 2026-09-17. Open this first, then `_design/INDEX.md` for the designs themselves.

## Read this before anything else, 2026-09-17

**Every design is approved** (`_decisions/2026-09-17_design_ratification_all_approved.md`). Three of
them are approved and still not buildable, and the reasons are defects and deferrals rather than
review states: `smartcity-finance-filings` (G-138, closed 2026-09-18; it now waits only on G-137's credentials), `plan-review-departments` (G-144) and
`smartcity-applicant-precheck` (the blending ruling is deferred, so no service owns the check).

**The staff dashboards surface is still on GCP, and it moves to DigitalOcean before any build
work.** Operator ruling 2026-09-17, carded as OPS-25 **D-12**, which is now the critical path for
every build row below. Verified the same day by edge header rather than by a status field:
`smartcityos.io` returns `Server: cloudflare` (DigitalOcean), the dashboards `run.app` URL returns
`server: Google Frontend` (still GCP). The live product link further down this page is the GCP one.

**A merge ships nothing, and that is verified rather than assumed.** `smartcity-dashboards` has one
GitHub workflow with zero deploy references, and `gcloud builds triggers list` returns zero across
`smartcity-os-prod`, `hauska-prod-497015` and `legacy-design-tools-prod`. Two traps neither
2026-09-17 handoff carried: the GCP dashboards original lives in its OWN project
(`smartcity-dashboards`, us-east1, NOT `smartcity-os-prod`) with traffic PINNED BY REVISION NAME to
`smartcity-dashboards-00074-sil`, so a plain redeploy is a silent no-op that reports success; and
the DigitalOcean app builds from branch `d9-pin-96efa35`, diverged from main in both directions, so
until D-12 repoints it a merge to main does not even reach the build source. `plan-review` has the
identical traffic pin (`plan-review-00025-ley`). Both are inside D-12's scope.

**Every approved design now has a build row.** Carded 2026-09-17 (A-141, A-142), grouped by what
blocks them rather than one row per folder:

| Row | Designs | Blocked on |
|---|---|---|
| G-149 | Flood study | D-12 |
| G-150 | Reasoner path (`plan-review`) | **nothing, runs in parallel** |
| G-151 | Parks | D-12 only |
| G-152 | Public works, Fire and EMS | D-12 only |
| G-153 | Fleet, Police | D-12 only — **namespace ruling landed 2026-09-17** |
| G-154 | Development services delta | D-12 only |
| G-155 | Smart Files (`smart-files`) | **nothing, runs in parallel** |
| G-156 | Finance lens | D-12 only — **scope call answered 2026-09-17: Finance ships** |
| G-157 | City management board (v1 parity) | **a v1 capture, operator-owed** — and D-12 |

Not buildable and not carded: finance-filings (its design block, G-138, closed 2026-09-18; the build now waits only on G-137's Azavar credentials), plan-review-departments (G-144), applicant-precheck (blending ruling deferred).

**No lens is blocked on a vendor.** That was checked at source rather than assumed, and the obvious
answer was wrong: every lens design draws its own blocked state as design content, so Fire and EMS,
Public works, Police and Parks all ship without GoTo, FirstDue, Verkada or a Parks vendor. The
vendor work is separate and is G-139's row, not theirs.

## The queue, lined up 2026-09-18 (A-144)

**D-12's cutover is live and verified**: `app.smartcityos.io` serves the DigitalOcean app running
`main`, discriminated from GCP by a response-body marker (`/auth/sign-in` is 500
`signin_not_configured` on DO and 404 on GCP). **But no staff have moved.** It is a new hostname and
nothing points anyone at it; staff bookmark the `run.app` address. The bake cannot start until Bastrop
is told the new URL.

**Why the dashboards rows run one at a time.** Every lens renders in two monolithic files,
`web/app.js` (131 KB) and `web/index.html` (146 KB). Parallel dashboards lanes would be a six-way
merge conflict in two files. One govtech lane, one PR per row, planner-verified between rows.

| # | Where | Row | Blocked on |
|---|---|---|---|
| **0** | **Operator** | **Tell Bastrop staff to use `app.smartcityos.io`**, which is what actually starts the bake | nothing |
| 1 | dashboards lane | G-156 Finance lens | nothing |
| 2 | dashboards lane | G-149 Flood study | G-156 merged |
| 3 | dashboards lane | G-153 Fleet + Police | G-149 merged |
| 4 | dashboards lane | G-154 Development services delta | G-153 merged |
| 5 | dashboards lane | G-152 Public works + Fire and EMS | G-154 merged |
| 6 | dashboards lane | G-151 Parks | G-152 merged |
| P1 | `smart-files` | G-155 Smart Files | nothing, parallel |
| P2 | `plan-review` | G-150 close-out: file the close, GATE 2, a live console probe | nothing, parallel |
| M1 | planner | ~~G-138 filings design fix~~ **DONE 2026-09-18**: both citations badged at every use, the rate check held, count derived; `check.mjs` + `violate.mjs` 13/13 | — |
| M2 | planner | G-143 People and access design, the first leg of RBAC | nothing |
| M3 | planner | ~~HOT scope card test~~ **DONE 2026-09-17**: reported and payment figures split into two rules; Q1/Q2 freezes deliberately left in place | — |
| M4 | planner | Fleet and Police design regeneration | G-153 merged |
| W1 | waits on operator | G-157 city management board | a v1 capture |
| W2 | waits on operator | G-137 hotel occupancy tax | the Azavar reply, sent |
| W3 | waits on operator | G-134 WorkOS, then G-127 and G-144 | WorkOS credentials |

**Every ship is a deliberate act.** Deploy-on-push stays off on `dolphin-app`, so a merge reaches no
one. Every DigitalOcean ship reads back `services[0].source_commit_hash` (OPS-25 rule 13), and every
GCP ship on a pinned service uses canary-then-shift. `smart-files`, `plan-review` and the GCP
dashboards original are all pinned by revision name.

## The next deliverable, named 2026-09-17 (A-143)

**The Finance and city management package:** the Finance dashboard, the hotel occupancy tax, all the
current financial tooling, proper RBAC at full department depth, and the city management board.
Operator, in session. It spans G-137, G-138, G-143, G-144, G-134, G-156 and the new G-157.

Two rulings came with it. **Finance ships**, which answers the G-156 scope call. **RBAC goes to full
department depth and the design comes first**, so G-143 People and access is drawn before G-134,
G-127 and G-144 are built. G-143 is one of the three surfaces this gate reports as UNCOVERED, so
proper RBAC is design work before it is build work.

**The city management board is the v1 dashboard Bastrop works from today, all departments combined**
(operator's own words), and v1 is being RETIRED rather than run alongside. So G-157 is capability
preservation, not a feature: if v2 ships without parity, the cutover removes the city manager's daily
surface. The v2 counterpart already ships as the Overview lens. Nobody has measured the parity.

**Three operator-owed items gate this deliverable, and none can be worked around:**

1. **A capture of the v1 combined dashboard.** No lane can produce one: v1 sits behind a logged-in
   Google OAuth session cookie (G-133), a different credential from v2's Hauska product key. The
   Finance lens only exists because 25 pages of the v1 Finance tab were supplied on 2026-09-15.
2. **The four Azavar credentials** (G-137). Khalid AlAli answered all four of our questions on
   2026-09-15 and **those answers are filed nowhere in this repo**; the reply requesting the
   credentials was drafted 2026-09-17 and never sent.
3. **WorkOS org, client id, API key, MFA and the `bastrop_tx` key** (G-134), which gate the RBAC leg.

**Two defects in the HOT build spec**, found while scoping and not previously carded.
`_inbox/2026-09-15_localgov_filings_integration_scope.md` still reads as though all four Azavar
questions are open, so it still forbids computing any rate or ratio and still forbids the words
hotel occupancy tax on a label. And **its acceptance test is wrong in a way that reads as data
corruption**: it calls the store done when a re-run changes no historical total, but `AmountPaid`
legitimately moves as payments settle or refund, so the first refund fails the test. Split
taxpayer-reported figures, which must never move, from payment figures, which may, before building.

**G-138 is the one component blocked on nothing** and can start today.

**The operator-namespace ruling landed 2026-09-17**
(`_decisions/2026-09-17_operator_reference_namespaced_by_domain.md`): operator references are
namespaced by domain, Fleet mints `FL-OPR-nn` and Police `PV-OPR-nn`, and a bare `OPR-01` is no
longer valid anywhere. It is a privacy decision, not a schema one: `operatorRef` is a pseudonym for a
real person, both feeds answer live, and a shared pseudonym would link one employee's fleet activity
to their patrol activity. It was ruled now because `operatorRef` occurs zero times in
`vendor-live.mjs` today, so nothing is minting references yet and the scheme is still a constant
rather than a migration. The change lands inside G-153; the design regeneration that follows is
planner-owned and the extraction trap in `smartcity-fleet-lens/check.mjs:154` is named on that row.

## The three links

**The live product**, v2 staff dashboards on the real Bastrop pack. Verified 2026-09-16, HTTP 200,
serving the v2 shell with the nine-lens nav.

    https://smartcity-dashboards-52ecsl5mvq-ue.a.run.app/?cityKey=bastrop_tx

**The design gallery**, fourteen boards across the five department lenses designed in the G-145
pass, both themes, live HTML rather than screenshots. Private until shared.

    https://claude.ai/artifact/WUWQsrBSWLMouTRy7C4BTP

**The SmartCity Design Canvas**, the editable canvas. Shared with anyone holding the link.

    https://claude.ai/artifact/FBWcVY3f1gRa3HswLoeQaY

The gallery is derived from the folders in this directory, which are the source. If a design
changes, the folder changes first and the gallery is republished from it, never the reverse.

## Where the design stands, measured

Run `node scripts/govtech/design-completion-gate.mjs` from the repo root. It refuses rather than
reports: it exits 1 while design is unfinished and 0 only when every shipped nav surface is either
designed or excluded by a dated ruling. As of 2026-09-17T21:45Z it reads:

    nav surfaces:        15
    designed:            10
    excluded by ruling:   2
    uncovered:            3
    design folders:      17, with an instrument: 9
    R3 findings:          6
    R4 findings:          3
    verdict: UNFINISHED — 9 findings

R3 rose from 4 to 6 on 2026-09-17 because blanket approval moved two designs past DRAFT that carry
no `check.mjs`, `smartcity-finance-filings` and `plan-review-departments`. Nine of the eleven newly
approved designs already carried one, so approval cost two findings rather than eleven.

**The gate reads status from `_design/INDEX.md`, not from the folder READMEs.** Editing a README
does not move it. Both were updated on 2026-09-17; nothing keeps them honest with each other, and a
gate rule comparing the two is worth building and is not carded.

**All nine lenses are designed.** The three uncovered surfaces are Citizen (G-142), Records search
(G-147) and People and access (G-143). Assets and Connections are excluded by standing ruling and
are not work.

Do not substitute a board count for this. **Sixteen folders and sixty-two boards** read as far more
coverage than ten of fifteen surfaces, which is exactly why the gate counts surfaces and not boards.
That gap is the whole reason the gate exists: counted by boards this looks close to finished, and
counted by surfaces a third of the product is still undrawn.

## The five lenses drawn in this pass, and why each is different

Each was drawn from the product's own source, and the design argument in each case came out of that
source rather than from a template.

**Public works** carries two regions of different units, so they switch rather than stack. Its
matrix has eight of twenty cells that **cannot occur** by the product's own rule, rendered hatched
beside four measured zeros, which is a fourth state next to absent, zero and unmeasured.

**Fire and EMS** became small multiples per station, because its domain module says a rollup cannot
tell you which station is carrying the shortfall.

**Parks** is drawn as a surface that **does not exist**. It has no vendor and no registered domain,
and absence from `DOMAIN_REGISTRY` is the only surviving meaning of "not built". No tiles, no empty
table, none of the built-surface vocabulary.

**Police** is the only lens whose two regions disagree about their source, and it disagrees in
opposite directions on the two shipped packs: on the demo, Verkada is granted and Spireon withheld;
on Bastrop, Spireon is granted live and Verkada is not granted at all. The demo's emptiest region is
the city's most connected one.

**Fleet** is the first lens whose vendor actually answers, so its second board asks what the page
still says once it has filled. Two of the three things that change at the cutover are defects.

## Integration reality, and this is the part most likely to be misremembered

Live-verified 2026-09-03, recorded in `smartcity-dashboards` `src/vendor-live.mjs` header. Re-read
it before quoting; these are readings with a date, not current state.

| Vendor | Lens | State |
|---|---|---|
| Samsara | Fleet | returns real data |
| Spireon | Police | returns real data, and is deliberately withheld from the demo pack |
| Power BI | Public works | returns real data |
| FirstDue | Fire and EMS | 403, the credential lacks the apparatus and assets scope |
| GoTo | Public works | `goto_not_authorized`, nobody completed the OAuth consent |
| Verkada | Police | not wired at all, and no credential in any of three GCP projects (G-139) |
| none | Parks | no vendor exists for it |

The obstacle is a different kind of thing in each case: an entitlement, a consent, an onboarding, a
source that does not exist. **Only some of them are ours to fix**, and each board says which.

## Open defects with rows

**G-140, zoning.** The map serves Bastrop zoning from a city ArcGIS layer **last edited
2023-04-28** while the city publishes three newer ones, including a 2026 draft that replaces the
code edition ours is drawn from. Nothing errors, because the query succeeds and every requested
field is present. Instrument: `node scripts/govtech/bastrop-zoning-layer-vintage.mjs`, exits 1
today. Evidence: `_inbox/2026-09-15_bastrop_zoning_layer_findings.md`. **Blocked on one question of
fact to Bastrop GIS: which layer is authoritative, and has the 2025 draft been adopted.** We do not
pick; rendering a layer named `Draft_11_2025` to staff as their zoning is the same defect in the
other direction.

**G-139, cameras.** Not a bug to debug. The code is built and fails closed correctly; there is no
Verkada credential anywhere. Vendor onboarding.

**G-148, instruments. HELD by operator.** Five designs are past DRAFT with no adversarial read, and
two of them are already dispatched to build (G-120 Overview, G-128 map dock). Also folded in: a
fixture badge changed to falsely claim `Live records` passes in `smartcity-dev-services` and
`smartcity-fleet-lens`, while deleting the badge fails. Public works, Fire and EMS and Police catch
it. dev-services is the oldest check and the pattern the others copy.

## Findings against `smartcity-dashboards` with no row, owed to the owning seat

This repo cannot fix these. They need the seat that owns the product repo.

`assertRecordShape` is called by `composeDomain` and by **nothing** in `vendor-live.mjs`. Run by
hand against the live Samsara record it refuses with three faults, and that record carries **12
undeclared fields including `vin`, `make`, `model`, `odometerMiles`** — an inventory field set
arriving on exactly the cutover that drops the one sentence saying this is not an inventory.

Every exported live mapper invents three sentinel strings on an empty row, and Samsara and Spireon
share the literal `"Unnamed unit"`, so id collisions cross lenses.

`operatorRef` is `required:true` on the Spireon shape and occurs zero times in `vendor-live.mjs`, so
a required field is silently absent on every live record.

## Owed by the operator

| Item | Blocks |
|---|---|
| **Operator-namespace ruling.** Fleet and Police declare byte-identical `OPERATOR_REF_FORMAT` and `OPERATOR_BASIS` in two modules with no import between them, and nothing says whether `OPR-01` is the same person. Recommendation in A-139: namespace by domain | any build on either lens |
| ~~**Ratify, amend or kill — eight drafts.**~~ **DONE 2026-09-17.** Operator approved every design (`_decisions/2026-09-17_design_ratification_all_approved.md`). Three are approved and still not buildable: finance-filings (G-138), plan-review-departments (G-144), applicant-precheck (blending ruling deferred) | nothing now |
| **The blending ruling** (Smart Site / Smart Files / SmartCity plan review / Development services), DEFERRED by the operator 2026-09-17 | the applicant-precheck build, which cannot name a repo until it lands |
| Naming the vendor on a lens panel; the Public works region switcher | build, not review |
| The fund number for the Finance filings AMEND, from the city finance director | G-138 |
| The Bastrop GIS question above | G-140 |
| WorkOS org, client id, API key, MFA, `bastrop_tx` key | G-132, G-134, soft launch |
| The Azavar reply: four questions, four credentials | G-137, the hotel occupancy tax integration |
| The email to Sylvia, and the HOT pricing proposal | the commercial track |

## What to do next when this comes off the shelf

In order, and the first three need nothing from anybody:

1. **G-148**, unheld. All five designs already exist; this is instrumenting what is there, and two of them have builds running against them right now.
2. **G-142 Citizen**, the only `public-free` surface and the only one a resident ever sees. It already ships with real markup and a correctly declared disabled lookup, which the design must not regress.
3. **G-143 People and access**, the same surface as the WorkOS build, so design and build land together. Four things: provisioning, role assignment, offboarding, and the audit trail that answers who looked at that citizen's record.
4. **G-147**, the long tail: Records search, Compass, the applicant-facing plan review view.
5. **G-137 hotel occupancy tax**, the customer's own priority and separately billable, as soon as Azavar answers.

## How the work was done, so the next pass matches it

Designs are drawn by planner-owned subagents against the product at a named ref. **Subagents do not
touch git**; the planner reads every diff and commits. Every folder carries a `check.mjs` that
self-tests in both directions, aborts rather than reporting a verdict it cannot support, reports a
non-zero matched-input count, and is verified by violation against a real artboard. Every board is
rendered and looked at before anything is claimed about it.

The planner verifies rather than accepts: checks re-run, boards re-rendered, arithmetic done by
hand, and its own violations planted rather than the lane's re-run. That last part has earned its
keep — it found a hole three lanes missed, and it repeatedly proved the planner's aim wrong rather
than the check.
