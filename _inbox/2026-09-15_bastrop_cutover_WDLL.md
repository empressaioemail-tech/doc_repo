---
id: 2026-09-15_bastrop_cutover_WDLL
title: WDLL — the Bastrop cutover. Phase 1 soft launch, phase 2 severance.
date: 2026-09-15
status: draft — operator approval owed
kind: WDLL
owner: nick
programs: [OPS-17]
plan_rows: [G-52, G-116, G-117, G-120 .. G-133]
related:
  - _catalog/repo_intents.md
  - _inbox/2026-09-14_COORD_bastrop_cutover_to_dashboards.md
  - _inbox/2026-08-17_g18_shell_homes.md
  - _inbox/2026-08-17_dashboards_missing_pieces.md
  - _decisions/2026-09-14_staff_identity_and_department_rbac.md
  - _decisions/2026-09-14_flood_determination_authority.md
---

# WDLL — the Bastrop cutover

> **This is the instrument `_catalog/repo_intents.md` names.** That file holds `smartcity-os`
> under ABSOLUTE NO-TOUCH *"until the Dashboards template is the staff path and a named cutover
> WDLL runs."* This is that WDLL.

## The operator's ruling, 2026-09-15

**Two phases, and phase 1 is the one that matters.**

> *"the most important thing is that we get bastrop on the v2, not that we have backend work to do
> to make it clean."*

**PHASE 1 — SOFT LAUNCH.** Bastrop staff working in v2 daily. **v1 keeps running behind it,
unchanged, as the data backend.** The twelve platform dependencies stay. They are the
architecture during transition, not a defect to fix first.

**PHASE 2 — SEVERANCE.** v1 dark. Later, on its own schedule, invisible to the customer.

## Why this ordering is right, said once so it is not relitigated

The severance is **entirely invisible to Bastrop**. Whether v2 reads MyGov through v1's platform
API or through a ported adapter, a permit clerk sees the same permit. Spending weeks on that
before the city can use the product optimises for our architecture over their adoption.

**And we are knowingly increasing the severance bill to do it.** Every lens shipped in phase 1
consumes v1 more deeply, so phase 2 gets more expensive with each one. That is a real cost, it is
accepted deliberately, and it is written here so nobody later reports it as a discovery.

The trade: a customer using the product beats a clean backend nobody can see.

## PHASE 1 — what actually blocks a soft launch

Much less than the full cutover. Four things, and two of them are already most of the way there.

### 1. Real per-person identity — the only hard blocker

Today **every department signs in as one shared persona** labelled "Development services staff."
That is not a login, it is a shared account. Under it there is no audit trail, no offboarding, and
no way to answer "who looked at that citizen's record."

For a system holding citizen names, phone numbers and complaint addresses, handed to a
government customer, that is the one thing that cannot ship soft.

G-132 built the verifier provider-agnostic and passing (812/812). **WorkOS is ruled. It needs
wiring and accounts provisioned.** That is the critical path for the whole soft launch.

### 2. The lenses those staff actually use — mostly built

Not all fifteen. **The first cohort is Development Services staff**, and their daily surfaces are
the ones already shipped:

| Surface | State |
|---|---|
| Overview | G-120 closed, serving |
| Development services — Pipeline, Inspections, Work orders, Code enforcement, Licences | G-123 closed, 20/20 live checks |
| The map rail and property detail | G-128 closed, serving |
| Plan review | live, real `bastrop_tx` persona, cross-tenant refusal verified |

**That cohort is close to servable now.** Finance, Police, Fire and EMS, Fleet, Public works and
Parks are later cohorts, not phase-1 blockers.

### 3. Proof it works for Bastrop, not just for `template-city`

**Three lanes have failed to verify authenticated `bastrop_tx` behaviour**, and G-128's close
records that the map iframe never mounted in a full-shell probe for want of a product key. We
cannot soft-launch on a surface nobody has seen working with the customer's own data.

**G-133 is the recon.** It is small, it is open, and it is on the critical path now in a way it
was not before.

### 4. v1 healthy — and this matters MORE under soft launch, not less

v1 stays up as the backend. **A broken v1 is a broken v2.** G-122 is the open customer incident
reported 2026-09-14 and still unfixed.

Under the severance plan, v1's health was a transitional concern. Under soft launch it is
permanent infrastructure until phase 2.

### Explicitly NOT phase-1 blockers

**Severance.** The whole point.

**The remaining nine lenses.** Later cohorts.

**RBAC (G-127).** See the ruling owed below — this is the one genuine judgement call in phase 1.

**Hotel occupancy tax.** Wanted, but not gating staff use of what exists.

## Done looks like — phase 1

| Item | Done is | Instrument | Not done is |
|---|---|---|---|
| **Identity** | a named Bastrop staff member signs in as themselves in all three products; disabling them ends access | violation test, both directions | a shared persona with a nicer name |
| **Bastrop data** | the Dev-services surfaces render the city's own real records, authenticated, in a browser | full-shell probe on `bastrop_tx`, not `template-city` | it works on the demo pack |
| **v1 health** | G-122 closed, and v1's own dashboard is not degraded | the symptom reproduced, then not | "nothing else has broken" |
| **Adoption** | named Dev-services staff use v2 for a full working week without reverting | confirmed by those people | staff *can* use it |

**Phase 1 is done when Bastrop staff are working in v2 daily.** That is the ruling, and it does
not require v1 to be dark.

## PHASE 2 — severance, recorded now so it is not rediscovered

Not scheduled. Recorded so the bill is visible.

**v2 reads twelve platform routes off v1:**

```
/api/platform/mygov/permits            /api/platform/property-intel/summary
/api/platform/mygov/work-orders        /api/platform/property-intel/layers
/api/platform/mygov/inspections        /api/platform/samsara/vehicles
/api/platform/mygov/code-violations    /api/platform/spireon/vehicles
/api/platform/mygov/business-licenses  /api/platform/firstdue/apparatus
/api/platform/powerbi/cip-projects     /api/platform/goto/call-summary
```

Behind them: **eight MyGov services** in v1 — `mygov-scraper.ts` (Playwright plus AJAX POST, built
because MyGov refused API access), backfill, budget, enrichment, inspection-geocoder, two
manager-load scrapers, report-export — inside 33 services and 26 routes.

Plus ~20 GB of `mygov_raw_records` and 9.3 GB of `mygov_raw_sync_pages`: the **replayable capture**
that makes the cleaning liftable rather than re-derivable. That is the asset, and it is why the
pipeline is portable at all.

**Phase 2 done is:** v1 returns a decline, a CI check fails if it reappears, and v2 serves every
real record without it. Retirement is proven by decline, never by documentation.

## Lines that do not move, in either phase

**Citizen PII.** Work-order free text carries citizen names and phone numbers verbatim; code
enforcement carries officer names and complaint addresses. G-123 found a live leak in Inspections
and closed it, plus two latent paths. **No free-text description in any scannable list, and none
of it on a public rail, ever.**

**Dashboards embeds, it does not compute.**

**Buildable area stays REFUSED** with its basis (R-2).

**`smartcity-os` stays no-touch** outside this card and its narrow recorded exceptions. Approving
this lifts it for cutover work and nothing else — and under soft launch v1 is *live production*,
so changes there carry customer risk, not just hygiene risk.

## The customer commitment that does not wait for any of this

**Sylvia's flood study.** *"I want to be able to tell what happens when four inches of rain falls
on a property."* The engine answers it (G-125, closed). G-129 mounts it. **It is independent of
the cutover and it is the nearest customer-visible win available.**

## Owed rulings

1. **RBAC in phase 1, or after?** The real question: is it acceptable for, say, Police staff to
   see Water/Wastewater work orders carrying citizen names and phone numbers? Within one city,
   staff-to-staff, at a small named cohort, that is defensible and cities routinely share systems.
   **Recommendation: soft-launch the Dev-services cohort without RBAC, and require it before the
   second department joins** — because the moment two departments are on it, "everyone sees
   everything" stops being a scoped pilot and becomes a policy.
2. **Hotel occupancy tax: reporting, or collection and remittance?** Different products. Still no
   row anywhere. Not a build from zero — Finance already carries Hotel Occupancy Fund at $10.2M
   and Hotel Occupancy Tax at $5.5M through OpenGov.
3. **Who is the first cohort, by name?** The card assumes Development Services staff because
   their surfaces are the ones built. Confirm or correct.
4. **Phase 2's trigger.** Not a date — a condition. Recommendation: when a second city is
   onboarding, because that is when carrying v1 stops being one city's transitional cost and
   starts being the machine's.

## What this card is honest about

Phase 1 is genuinely close. Identity is the one hard blocker, the first cohort's surfaces are
built, and the two open lanes on the path (G-122, G-133) are both small.

Phase 2 is not close and is getting further away by design. That is the accepted cost of putting
the customer first, and the bill is written down above so it is a decision rather than a surprise.
