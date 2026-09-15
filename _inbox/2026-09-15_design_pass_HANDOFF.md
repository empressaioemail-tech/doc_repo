---
id: 2026-09-15_design_pass_HANDOFF
title: HANDOFF — the design pass, what is left to design, and the road to Bastrop's approval
date: 2026-09-15
status: SUPERSEDED 2026-09-15 by _inbox/2026-09-15_design_thread_HANDOFF.md. Kept for history; do not plan from it.
kind: handoff
owner: nick
programs: [OPS-17]
related:
  - _sessions/2026-09-15_design_pass_claude_code.md
  - _design/INDEX.md
  - _inbox/2026-09-15_bastrop_cutover_WDLL.md
  - _decisions/2026-09-14_staff_identity_and_department_rbac.md
---

# HANDOFF — the design pass

## Why this work exists, in one line

**Bastrop approves the design before we build.** Operator ruling, 2026-09-15. The canvases are
not internal artefacts and they are not a style exercise; they are the input to a customer
decision. Everything below is ordered by what gets to that approval fastest without showing
the city something we would not stand behind.

## Read these first

`_design/README.md` — the folder convention. The source is the artifact, never the reverse.
`_design/INDEX.md` — one line per design, current status on each.
`_sessions/2026-09-15_design_pass_claude_code.md` — what happened and what broke.

Every canvas is regenerable: `node gen.mjs` in its folder, then re-seed and republish. The
combined canvas is `_design/all-canvas/`, rebuilt with `node build.mjs`. That folder authors
nothing; edit a design in its own folder.

## The work, in order

### 1. Ratify, amend or kill the four drafts

Cheap, and everything downstream is blocked on it. A design record is not a decision; the
ratifying decision goes in `_decisions/` and gets linked from the folder README.

| Design | Decision owed |
|---|---|
| `smartcity-finance-filings` | ratify / amend / kill |
| `smartcity-flood-study` | ratify / amend / kill |
| `plan-review-reasoner` | ratify / amend / kill |
| `plan-review-departments` | **blocked** — see the amendment below |

**The amendment that is a precondition, not a preference.**
`_decisions/2026-09-14_staff_identity_and_department_rbac.md` gates plan review to Development
services and city-manager. Parallel department review requires Fire and EMS, Public works and
Parks to reach that surface, so as ruled it cannot be built. The proposed amendment uses that
ruling's own logic: **a department reaches plan review only through its own scope** — its
findings, its coverage, its sign-off, never the whole submittal. That is exactly what the
ruling says makes Overview a roll-up rather than a leak. The roster stays the nine lenses and
no department is invented.

### 2. Design what the first cohort actually touches

The cutover WDLL names **Development Services staff** as the first cohort. Bastrop cannot
approve a partial picture of the screens those people use daily, and three of them do not
exist. This is the shortest path to an approval package.

- **Inspections tab** — shipped in the nav, never designed
- **Code enforcement tab** — shipped in the nav, never designed
- **Licenses tab** — shipped in the nav, never designed

All three are Development services tabs sitting beside Pipeline and Work orders, which are
designed. Same shell, same table treatment, same honest-empty rules. The PII constraint from
G-123 applies: free-text descriptions carrying resident names and phone numbers stay out of
scannable lists.

### 3. Design People and access

The only undesigned surface with a live dependency, and the neat part is that **it is the
WorkOS surface** — the thing blocking the soft launch and the next design are the same thing.

Ruled already in `_decisions/2026-09-14_staff_identity_and_department_rbac.md`: we provision
every account, WorkOS, self-registration off, MFA on, role is a claim, roster is the nine
lenses, three tiers (seven department roles, `city-manager`, `admin`). The lens is in the nav
marked NOT BUILT and is **read-only for the city manager, administered by us**.

Design it as four things: provisioning, role assignment, offboarding, and the audit trail that
answers *who looked at that citizen's record* — which the cutover card says cannot be answered
today. For a government customer the audit view is a trust surface, not an admin screen.

### 4. Build the Bastrop review artefact, round two

The first attempt (`_design/bastrop-review/`) was **dropped by the operator**; the compilation
did not hold together. Its build script and gitignore entry survive. What was learned:

- Scale it to **what the first cohort will use**, not all 35 artboards. Fleet and Police lenses
  are not in the pilot and will only muddy an approval.
- Every figure is sample data and the document must say so, prominently, before any screen.
  The hotel occupancy figures in particular are entirely invented.
- `_design/plan-review/gen.mjs` leaks engine vocabulary onto screens a customer reads. The
  build script translates at composition time and a `BANNED` guard refuses to write the
  document if any internal term survives. **That defect is still owed at source.**
- Ask the city the questions that are expensive to change later: is this the information staff
  need, in roughly this order; is anything missing they would look for first; is anything
  visible that should not be to every member of staff; which department goes first.

### 5. Get the approval, then dispatch

Only after approval does design work become plan rows and compiled dispatches.

## Running in parallel, and not gated by any of the above

**WorkOS.** Only the operator can create the organisation, client id and API key, enable MFA
at org level, and mint the verification-scoped `bastrop_tx` key. Bastrop staff still sign in
as one shared persona. No amount of design moves this.

**The Azavar reply.** Four questions and four credential items outstanding. The integration
scope at `_inbox/2026-09-15_localgov_filings_integration_scope.md` is ready to execute the
moment credentials land.

## Every surface that has NOT been designed

Verified against the shipped nav in `smartcity-dashboards/web/index.html`, not from memory.

### Lenses — 2 of 9 designed

| Lens | State |
|---|---|
| Overview (city-manager) | **designed**, ratified, shipped |
| Development services | **designed**, shipped |
| Finance | **one tab only** (Localgov filings). The lens itself is undesigned |
| Citizen | not designed. The only `public-free` surface and the only one residents see |
| Public works | not designed |
| Parks | not designed |
| Police | not designed |
| Fire and EMS | not designed |
| Fleet | not designed |

### Development services tabs — 4 of 7 designed

Pipeline **designed**, Work orders **designed**, Plan review **designed** (own surface), Flood
study **designed**. **Inspections, Code enforcement and Licenses are not designed** and are
item 2 above.

### Work group

| Surface | State |
|---|---|
| Plan review | **designed** three times over: earlier pass, reasoner, departments |
| Files (Smart Files) | not designed |
| Records search | not designed. Shipped as a stub carrying a NOT BUILT badge |

### City group

| Surface | State |
|---|---|
| Assets | not designed. Three tabs shipped (Inventory, Map, Demo fixture record). Doc 32 says Asset Management is a build and G-24 stays zero until a named ingest — designing it before an ingest is designing wallpaper |
| Connections | not designed — **and the ratified Overview design depends on it.** Overview's headline move is that Connections promotes to the top on a pack that reads nothing. A shipped lens points at a surface nobody has drawn |
| People and access | not designed. Item 3 above |

### Cross-cutting

| Surface | State |
|---|---|
| Map dock | **designed**, approved, shipped |
| Compass | not designed. Doc 34 calls it a sidebar over readable records; the v1 chatbot is still what runs. Hold until more lenses exist — designing a surface that follows the user across nine lenses while two are designed is guesswork |
| Shell chrome (G-90) | not designed as a set: theme toggle, account menu, notifications, tenant branding, record search, help, feedback |
| Applicant-facing plan review | not designed. A persona exists; the view does not |

### Named on a canvas as pinned, deliberately

The sheet viewer, dimension capture, and every plan-review adjudicator except the front
setback. The regulatory zone's provenance panel and incident-time use on the flood study. The
entitlement gate (401 sign-in, 402 locked property) on the flood report. Restricted-use
expenditure accounting on hotel occupancy tax, which needs the statutory category list
verified at source before anything is drawn.

## The rule this session earned

**No design is ratified without an adversarial read against source.**

Three reviews this session, three sets of real defects in the planner's own work, and not one
was caught by re-reading the conclusion. The worst was a central thesis asserted as fact and
attributed to the code, which the code contradicted in the same comment block the planner had
quoted. Also caught: a book title that does not exist, a code section that does not exist
cited six times including in an issued letter, and a paraphrase of a code the product is not
licensed to quote printed beside a panel promising never to do that.

Cheap to run. It is the difference between a design pass and a fabrication pass, and it
matters more here than usual because **these screens go to a city for approval.**

## Conventions any new session must hold

Tokens are copied from the product, never invented; `_kit.css` is byte-identical across every
folder. Department is a second channel (a dot), determination is the badge, and one element
never carries both. Every region keeps its basis line. Absent, zero and unmeasured are three
different states and no surface collapses them. Fixture data is badged as fixture on the page.

`00_current_state.md` was deliberately not regenerated: another session closed 50 minutes
before this one and the repo tip moved four times during it. Commit by explicit pathspec.
