---
id: 2026-09-14_bastrop_cutover_qa_claude_code
title: Session — Bastrop cutover QA, the design pass, and the governance recovery
date: 2026-09-14
last_updated: 2026-09-15
status: session record
owner: nick
seat: doc_repo integration
programs: [OPS-17, OPS-18]
plan_rows: [G-116, G-117, G-120 .. G-134, R-10]
related:
  - _inbox/2026-09-15_bastrop_cutover_WDLL.md
  - _decisions/2026-09-14_staff_identity_and_department_rbac.md
  - _decisions/2026-09-14_flood_determination_authority.md
  - _decisions/2026-09-14_overview_lens_design_direction.md
  - _design/INDEX.md
---

# Session — Bastrop cutover QA

Opened as "complete the Bastrop to smartcity-dashboards cutover, heavy QA-UI session." Became
three things: a design pass, a governance recovery nobody planned, and fifteen plan rows.

## THE RULING THAT REFRAMES EVERYTHING — read this first

**Operator, 2026-09-15:** *"the most important thing is that we get bastrop on the v2, not that we
have backend work to do to make it clean."*

**Two phases.** Phase 1 SOFT LAUNCH: Bastrop staff in v2 daily, **v1 still running behind it as
the data backend**, dependencies intact and declared. Phase 2 SEVERANCE: v1 dark, later.

The card is `_inbox/2026-09-15_bastrop_cutover_WDLL.md` — **draft, operator approval owed.**
Approving it is what lifts `smartcity-os`'s no-touch; until then everything there runs under
narrow incident exceptions.

**The finding that card exists to make unmissable:** v2 reads **twelve platform routes** off v1
server-to-server for every real record it serves, backed by **eight MyGov services** inside 33
services and 26 routes. So "v1 dark" is a dependency severance, not a UI migration — and **every
lens shipped in phase 1 makes phase 2 more expensive.** That cost is accepted deliberately.

## Phase 1 blocks on exactly one thing

**Real per-person identity.** Every department currently signs in as ONE shared persona labelled
"Development services staff" — no audit trail, no offboarding, no way to answer who looked at a
citizen's record. **G-134 is the critical path.** Everything else on the phase-1 path is small or
already shipped.

## Shipped and serving

`smartcity-dashboards-00072-cow` @100%.

| Row | What |
|---|---|
| G-120 | Overview lens. Two defects caught pre-ship: promote/demote keyed on the wrong signal; a11y rejected an overlapping anchor. |
| G-123 | Dev services, 20/20 live checks. **Found a live citizen PII leak** in Inspections' Comments column, removed and regression-tested, plus two latent paths. |
| G-126 | Tenant isolation. Enumeration found **THREE** unguarded list routes, not the one named. |
| G-128 | Map dock, three states. Place retired to a persistent rail. Sliver was a layout bug — measured a real 40px map at 380px. |
| G-125 | Rainfall control. **Sylvia's four-inch question is answerable.** |
| G-130 | Flood authority ruled. |
| G-132 | Staff auth, closed-partial. Verifier provider-agnostic, 812/812. |

## Live lanes at capture

`g122-v1-regression`, `g133-bastrop-verify-access`, `g129-flood-mount` — all claimed 2026-09-15
~00:16 UTC. Plus `p200-hays-rails` and `p205-coverage-refusal` from other sessions.

**G-134 compiled and not yet fired.** `_dispatches/2026-09-15_g134-workos-wiring_dispatch.md`.

## Rulings made

**Staff identity** (`_decisions/2026-09-14_staff_identity_and_department_rbac.md`) — three
rulings, ruling 1 **amended twice in one day**. SSO first, reversed on *"we should not be asking
cities to configure anything"*; then magic-link-plus-invites, reversed on *"we (smart city admin)
need to control the users."* Final: **we provision every account, WorkOS, self-registration off,
MFA on.** Roster is the **nine lenses** (operator ruling against the planner's recommendation —
and it got stronger once ruling 1 stopped touching the city directory). Role is a **claim**;
enforcement in **one shared package** with a divergence test, per the `sc-kit.css` precedent.

Seven of nine lenses are departments; Overview is the roll-up and Citizen is public. Role set is
**seven departments + `city-manager` + `admin`.**

**Flood authority** (`_decisions/2026-09-14_flood_determination_authority.md`) — parcel-record
rail authoritative, atoms the sanctioned legacy fallback, **tier2 retired**. Authoritative for
serving, **provisional for citation** until a C10-shaped ground-truth sample runs against
parcel-record's own output — a gap the agent named on itself.

**Overview design direction** (`_decisions/2026-09-14_overview_lens_design_direction.md`).

## The governance recovery nobody planned

Three decision records cited by shipped code appeared not to exist. **They were never missing** —
they were stranded on `seat/govtech`, 26 commits ahead of main, **never pushed**, on one disk. The
earlier recon checked working trees and filenames, correctly reported absence, and **said
explicitly it had not searched git history.** The conclusion travelled; the caveat did not.

Pushed, then merged. Landed six operator decisions — including
`2026-09-04_systems_linking_is_the_thesis`, which downgrades the native map and names the real
priority — plus **A-109 through A-134**, resolving a collision that had not happened yet.

Then **G-116 and G-117 filled into the existing four-ID hole** rather than taking new numbers,
because fourteen PR bodies, ten Cloud Run tags, six source files and 26 amendments already cite
those exact numbers. **G-52's blocker corrected** — the feed exists; the unbuilt bridge is the real
blocker. **`repo_intents.md`** now records the narrow `smartcity-os` exception, having been wrong
in both directions.

## The lane-claim control

Built after the G-126 dispatch was compiled **once** and handed to **two sessions**. A compiler
check could not have caught that, so the claim is taken at **execution start** and travels in
every compiled dispatch header. `scripts/lane-claim.mjs`, eight self-tests, verified by violation
both directions. **Prevented two collisions on its first day.**

**Two holes lanes found, not yet fixed:** reusing the holder's seat id returns `yours` and walks
you through (impersonation); and seat ids are self-chosen and map to nothing verifiable, so you
cannot tell whether a holder is alive.

## My own errors, recorded because the pattern matters

**Reported Bastrop had no v2 dashboard.** Probed two guessed cityKeys, got `unknown city pack`,
called it absence. The API distinguishes `unknown city pack` from `unauthorized` and that
differential was available before the claim. `bastrop_tx` is the canonical key in 104 files.

**Every dispatch named two close paths** — the compiler emits one and I hand-wrote another in
every mission. Caught by a lane. Fixed; missions no longer name one.

**Ranked a five-month-old commit as an incident hypothesis.** `0e5c41e` is 2026-04-05, unrelated
to the seam.

**Carried a timeout figure across products.** The 85–154s number is Feasibility's, not flood's;
the G-129 lane found the real risk is a depth-independent cold-container ~92–103s against a 55s
BFF abort.

**Said three decision records did not exist.** They were on an unpushed branch.

**Built an incident dispatch around the wrong cause.** G-122's ranked hypotheses were all seam
commits, because the seam was the largest recent change and the operator's own theory pointed
there. The real cause was **external**: the City of Bastrop edited their own ArcGIS parcel layer
on 2026-09-10, dropping a field the app had requested since March, and ArcGIS rejects an entire
query when one requested field is absent. The seam finished deploying six days BEFORE that change.
Both ranked hypotheses tested clean on diff review. **The dispatch's insistence on testing rather
than assuming, and on naming a second mechanism, is what found it** — the process worked while the
planner's hypothesis did not.

Common shape: **a conclusion travelled and its caveat did not.**

## Designs — `_design/`, with `README.md` and `INDEX.md`

New durable folder, operator-ruled. Source lives with each design because a published canvas is
durable at its URL while its generator was dying in a session scratchpad. **A design you cannot
regenerate is a screenshot.**

- `smartcity-overview-lens` — ratified, shipped
- `smartcity-dev-services` — shipped
- `smartcity-map-dock` — approved, shipped
- `smartcity-place-tab` — **superseded**, kept as the record of the option not taken
- `plan-review` — in review, **not dispatched**

## Owed by the operator

1. **Approve the cutover WDLL** — it lifts the no-touch.
2. **Hotel occupancy tax: reporting, or collection and remittance?** One of the original six items
   and the only one with **no row anywhere.** Not a build from zero: Finance already carries Hotel
   Occupancy Fund $10.2M and Hotel Occupancy Tax $5.5M through OpenGov.
3. **First cohort by name** — the card assumes Development Services staff.
4. **RBAC timing** — recommendation on record: soft-launch the first cohort without it, require it
   **before the second department joins**.
5. **Phase 2 trigger** — recommended as a condition, not a date: when a second city onboards.

## Not started, from the original six

Plan review + MyGov (**designed, never dispatched**). The remaining nine lenses. Hotel occupancy
tax. RBAC (ruled, blocked on G-134).

## Standing constraints that bit this session

Citizen PII in free-text (names, phone numbers, complaint addresses) — **no description in any
scannable list, none on a public rail.** Dashboards embeds, does not compute. Buildable area
REFUSED per R-2. The frozen `sc-kit.css`, byte-identical across three repos. Honest-empty states
keep their `.basis` line. `smartcity-os` no-touch outside named exceptions — **and under soft
launch it is live production, so changes there carry customer risk.**
