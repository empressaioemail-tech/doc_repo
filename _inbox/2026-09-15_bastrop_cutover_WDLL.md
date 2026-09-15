---
id: 2026-09-15_bastrop_cutover_WDLL
title: WDLL — the Bastrop cutover. Staff in v2 daily, v1 dark.
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
  - _decisions/2026-09-04_no_leaflet_island_overridden_for_bastrop_map.md
---

# WDLL — the Bastrop cutover

> **This is the instrument `_catalog/repo_intents.md` names.** That file holds `smartcity-os`
> under ABSOLUTE NO-TOUCH *"until the Dashboards template is the staff path and a named cutover
> WDLL runs."* This is that WDLL. Until it is approved, everything done on `smartcity-os` runs
> under narrow incident exceptions, which is how the last two weeks actually went.

## Done looks like, in the operator's own words

**Bastrop staff working in v2 daily, and v1 dark.** Ruled 2026-09-15.

Not "v2 is primary with v1 still running." Dark.

## THE ONE THING THAT MAKES THIS HARD, AND IT IS NOT THE UI

**v2 reads twelve routes off v1 right now.** `smartcity-dashboards` calls
`smartcity-api` server-to-server for every real record it shows:

```
/api/platform/mygov/permits            /api/platform/property-intel/summary
/api/platform/mygov/work-orders        /api/platform/property-intel/layers
/api/platform/mygov/inspections        /api/platform/samsara/vehicles
/api/platform/mygov/code-violations    /api/platform/spireon/vehicles
/api/platform/mygov/business-licenses  /api/platform/firstdue/apparatus
/api/platform/powerbi/cip-projects     /api/platform/goto/call-summary
```

**So "v1 dark" is not a UI migration. It is a dependency severance.** The day v1 goes dark, v2
loses every real record it serves unless those twelve routes have been re-homed first.

Behind them sits the thing the operator has said he never wants to rebuild: **eight MyGov services
in v1** — `mygov-scraper.ts` (Playwright plus AJAX POST, built because MyGov refused API access),
plus backfill, budget, enrichment, inspection-geocoder, two manager-load scrapers, and
report-export. Thirty-three services and twenty-six routes live in that repo in total.

**Nothing in the program to date has moved any of it.** Every lane so far has built v2 surfaces
that consume v1 more deeply.

That is the finding this WDLL exists to make unmissable: **each shipped v2 lens increases the cost
of turning v1 off.**

## What is verified true right now

```
SHIPPED AND SERVING (v2)     smartcity-dashboards-00072-cow @100%
  G-120 Overview             closed, deployed, verified
  G-123 Dev services         closed, 20/20 live checks, PII leak found and closed
  G-126 tenant isolation     closed, 3 unguarded list routes found and fixed
  G-128 map dock             closed-partial, Place retired to a rail
  G-125 rainfall control     closed — Sylvia's four-inch question is answerable
  G-130 flood authority      ruled

NOT STARTED (v2 lenses)      Finance · Police · Fire and EMS · Fleet · Public works
                             Parks · Citizen · Files · Records search · Assets
                             Connections · People and access

THE DEPENDENCY               12 platform routes, 8 MyGov services, 33 services,
                             26 routes — all still in v1, none re-homed

IDENTITY                     G-132 closed-partial. WorkOS chosen, NOT wired.
                             One shared persona labelled "Development services
                             staff" is still how every department signs in.
                             G-127 RBAC blocked on the wiring.

CUSTOMER INCIDENT            G-122 open. Reported 2026-09-14 morning, still
                             unfixed at time of writing.

VERIFICATION                 G-133 open. Three lanes could not verify
                             authenticated bastrop_tx behaviour; the map iframe
                             has never mounted in a full-shell probe.

DATA IN v1                   16,723 work orders · 27,874 archived · 12,683
                             projects · 949 inspections · 1,502 code cases ·
                             72 licences · ~20 GB mygov_raw_records
```

## The order, and why it is this order

**1. Sever before you cut.** The twelve platform routes are re-homed, or v1 cannot go dark
whatever the UI looks like. This is the long pole and it has not started.

**2. Identity before logins.** WorkOS wired, then RBAC. Today "give staff logins" means handing
every department one shared account. No staff go-live can honestly precede this.

**3. Parity before dark.** Every v1 function has a home per `g18_shell_homes` and its disposition
is honoured — Mounted works, Empty is honestly empty, Killed is gone with its reason, Island still
works on the island. **Homeless is the only defect.** Six lenses are untouched.

**4. Staff actually choose v2.** The 2026-08-17 ruling stands: PermitFlow and the Leaflet island
stay live until staff choose the replacement. **Dark is a consequence of adoption, never a
scheduled event.**

**5. Then dark.** And only then.

## Done looks like — per phase, with its instrument

| Phase | Done is | Instrument | Not done is |
|---|---|---|---|
| **Sever** | all 12 platform routes served without v1; the MyGov pipeline runs somewhere v1's death does not touch | v1 stopped in staging and v2 still serves real records | "we could move it" |
| **Identity** | a named staff member is a PERSON in all three products; disabling them ends access everywhere | violation test, both directions | a shared persona with a nicer name |
| **RBAC** | a department role is refused another department's records, typed not blank | violation test, both directions | a role that renders but never refuses |
| **Parity** | every row in `g18_shell_homes` has its disposition verified live | the register walked, row by row | a lens that looks built |
| **Data** | every record staff rely on is reachable in v2, or its absence is declared | count reconciliation against v1 | a table that exists |
| **Adoption** | Bastrop staff use v2 for a full working week without reverting | named staff, named week, confirmed by them | staff *can* use it |
| **Dark** | v1 returns a decline; a check fails if it reappears | the decline, not a doc | v1 "switched off" |

## The customer commitments riding on this

**Sylvia's flood study.** *"I want to be able to tell what happens when four inches of rain falls
on a property."* The engine answers it (G-125, closed). G-129 mounts it. This is the nearest
customer-visible win available and it does not wait on the cutover.

**Hotel occupancy tax.** Requested by Bastrop. **It has no row, no card and no decision anywhere**
— flagged 2026-09-14 and never picked up. Note it is not a build from zero: the Finance workspace
already carries Hotel Occupancy Fund at $10.2M and Hotel Occupancy Tax at $5.5M through OpenGov.
**Owed: a ruling on whether it is reporting or collection-and-remittance.** Those are different
products.

## Lines that do not move

**Citizen PII.** Work-order free text carries citizen names and phone numbers verbatim; code
enforcement carries officer names and complaint addresses. G-123 found a live leak in Inspections
and closed it. **No free-text description in any scannable list, and none of it on a public rail,
ever.**

**Dashboards embeds, it does not compute.** The moment it computes its own version of a fact it
becomes another read path, in a portfolio that has a whole program because one parcel had six.

**Buildable area stays REFUSED** with its basis (R-2). The envelope draws; the figure does not.

**`smartcity-os` stays no-touch** outside this WDLL and the narrow recorded exceptions. Approval
of this card lifts it for cutover work and nothing else.

## Deferred on purpose

The map engine question — MapLibre everywhere or Leaflet stays an island. Porting the flood
renderer (G-129 mounts, it does not port). The remaining six lenses until severance and identity
land. Compass's answer engine. Prophecy document search.

## Owed rulings

1. **Hotel occupancy tax: reporting, or collection and remittance?** Different products.
2. **Where does the MyGov pipeline live after v1?** Ported to `@hauska-engine/adapters` as the
   Tyler MyGov family adapter (the 2026-06-10 recon's recommendation, which scoped it at 1–2 weeks
   once, then $5–30 and 45–60 minutes per additional MyGov city), or lifted as-is into a standalone
   service. The first is more valuable and slower.
3. **What happens to ~20 GB of `mygov_raw_records`?** It is the replayable capture that makes the
   cleaning liftable rather than re-derivable. Migrated, archived, or abandoned.
4. **Is there a date or event driving this?** Asked and not yet answered. It changes what gets cut
   versus built.

## What this card is honest about

**We are not close.** Four lenses of fifteen, identity unwired, twelve routes un-severed, and a
customer incident open. The design and ruling work of 2026-09-14 was real and it was mostly
*upstream* of the cutover rather than in it.

**And the direction of travel is currently wrong for this goal.** Every v2 lens shipped so far
consumes v1 more deeply. That is correct for making v2 good and it is the opposite of making v1
dark. Both are worth doing; they are not the same project, and this card exists so nobody
confuses one for the other again.
