---
id: 2026-08-19_template_city_lens_build_sheet
title: Template city — lens-by-lens build sheet
status: approved
last_updated: 2026-08-19
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _inbox/2026-08-17_g18_shell_homes,
    _inbox/2026-08-17_bastrop_dashboard_layout_inventory,
    _inbox/2026-08-17_g18_smartcity_inventory,
    _inbox/2026-08-18_g88_surface_inventory,
    _decisions/2026-08-17_smartcity_visual_law,
    30c_smartcity_platform_ia,
  ]
---

# Template city: lens-by-lens build sheet

Operator-approved 2026-08-19. This is the sheet the build fans from. It replaces the reading that produced the current honest-empty roster shells, and it says why that reading was wrong.

## What went wrong, stated once so it does not repeat

`_inbox/2026-08-17_g18_shell_homes.md` inventoried 67 live Bastrop staff jobs and gave each a home on Dashboards. Roughly forty carry the disposition **Not built**, which was written to mean *this surface does not exist yet*. Across three agent handoffs that hardened into *this surface is meant to be empty*, and by 2026-08-19 it was travelling in dispatches as a hard constraint: "the sixteen honest-empty states STAY empty." It was faithfully preserved. The operator's actual intent — inventory Bastrop, then use it as the guide to build the others — was never carried in a field any handoff read.

The register was never wrong. Its disposition column was read as a destination rather than as a starting state.

## Ruling 1, approved: "not built" moves down one level

Today **Not built** describes the SURFACE. That is why Parks renders "Parks is named, and not built."

From here, the surface exists and honest absence is a statement about **sources**, not about screens. The lens renders its full designed shape; what is honest is which adapter kinds this city pack has granted, and every unpopulated region says so with its basis. `0 of 7 sources granted` stops being a page-level apology and becomes a per-region truth.

This is not a retreat from the visual law. It is the only way the law scales to a template: the product currently cannot distinguish "we did not build Parks" from "your city has no Parks data", and those are different sentences to a customer. After this change it can.

**What survives unchanged:** no invented freshness anywhere; no "last sync" / "last read" / "last updated" strings; every empty region keeps a `.basis` line; no real city asserted as content; `sc-kit.css` stays byte-identical across three repos; the 12px type floor; live Bastrop stays no-touch.

**What changes:** a lens may render populated regions from its pack's fixture data. "Not built" as a page-level state is retired for every lens on this sheet. The `Not built` badge survives only for surfaces genuinely not yet designed.

## Ruling 2, approved: match the live department roster, and expect it to grow

Cities have different org charts. Forcing Bastrop's departments into a smaller set risks adoption, and the lens roster is a **growing template library** rather than a fixed five. Build what Bastrop runs now; add lenses other cities need as they onboard, and expect departments Bastrop does not have (parks and recreation as a combined department, utilities, library, airport) to arrive as new template lenses rather than as reshapes of these.

**A taxonomy point the ruling has to settle, because "the live seven" is ambiguous.** Live Bastrop has two different sevens: the `/departments/*` page family (admin, code-enforcement, community, court, development, infrastructure, parks) and the seven-item primary nav (Overview, Finance, Development, Emergency, Operations, Compass, Prophecy). They are different things — the first is an org chart, the second is a set of operational consoles.

Recommendation carried into the sheet below: **build the union, ten department lenses**, because each maps to a distinct data family and because collapsing any two is exactly the forcing this ruling rejects. Cut from this list rather than growing into it; cutting is cheap now and re-splitting later is not.

## Ruling 3, approved: demo data everywhere, one badge

Every lens gets fixture data so the UX can be worked. The environment badge stays where it is — **one `Demo` chip in the top-left**, not a badge per region, per card or per number. Provenance chips and basis lines carry the per-region truth; the badge carries the environment.

## Shell function parity — build these before or alongside the lenses

The current shell is missing functions live Bastrop has. This is a **function** list, not a layout or look list; how they render is the design pass's call.

| Function | Live Bastrop | Dashboards today | Notes for the build |
|---|---|---|---|
| Theme toggle, light/dark | yes, persisted, defaults dark (`localStorage theme \|\| "dark"`, `theme-transition`) | **missing** — `data-theme="dark"` is hardcoded on the root | Must set `data-theme` on the ROOT, never a page-level provider. Light is a first-class theme ("light = paper"). |
| Account / user menu | yes — My Account, My Profile, Account Settings, Support | **missing** | Gated on a staff session; until then the menu can exist with honest disabled entries. |
| Sign in / sign out / session | `/api/auth/{login,logout,user,providers,register}` | **missing** | This is the tenancy leg. Anonymous stays the default path; do not orphan anonymous data. |
| Notifications | yes — bell, count, "No new notifications", "View all notifications" | **missing** | Empty state must be honest, not a fake count. |
| Tenant branding | `/api/tenant/branding` | seal + pack display name only | Feeds the seal, name and accent per pack. |
| Record search | working | **stub** — `Not built` badge, note points at Records search | Becomes real when the Records search lens lands. |
| Help / support entry | yes (`Support`, Help surfaces) | **missing** | |
| Feedback | `/api/feedback` | **missing** | |
| Compass source control | `/ask-smartcity` | present as top-bar sheet chrome | Answer engine stays out of scope. |
| Mobile menu | yes | present (`#menu-btn`) | |

## Lens-by-lens build sheet

Every row below is: what the lens IS, the live Bastrop routes and API families that prove what data it carries, what the fixture pack must generate, and which adapter kinds gate it. **The API families are evidence of what data exists, not an instruction to connect a feed.** No feed is connected by this work; the pack generates.

### City lenses

**1. Overview** — the whole city this morning.
Live: `/overview`, `/city-pulse`. APIs: `overview/pulse/{finance,operations,emergency}`, `dashboard/live-stats`, `calendar/events/public`.
Pack generates: cross-department metric strip, decision queue, public meetings, source register (the "Across departments" panel).
Gates: every adapter kind contributes; the register is the honest map of which are granted.
Note: the metric strip currently reads "Not read" rather than zero. With a pack that generates, it reads real fixture values; with `empty-city` it must still read Not read.

**2. Development services** — the MyGov monitor. This is the lens that must match what the production Bastrop dashboard shows today.
Live: `/development-services`, `/departments/development`. APIs: **MyGov ×16** — `permits`, `permits/stats`, `inspections`, `work-orders`, `work-orders/{daily-queue,geo-clusters,sla,stats}`, `code-violations`, `code-violations/stats`, `business-licenses`, `reviews/summary`, `sync-status`.
Pack generates: permit pipeline (exists today), inspections queue, work-order queue with SLA and daily queue, code violations, business licenses.
Gates: `mygov`.
**Tab correction:** DS currently carries a `Review` tab. Plan review is its own lens (below), so DS tabs become Pipeline, Place, Inspections, Work orders, Code enforcement, Licenses. Review leaves DS.

**3. Finance**
Live: `/executive-analysis`, `/executive-overview`, `/opengov`, `/opengov/code-reference`. APIs: OpenGov ×8 (`bnp/budgets`, `bnp/chart-of-accounts`, `bnp/code-reference`, `financial`, `data-exports`), `finance/permit-revenue/{summary,by-type,outstanding}`, `executive-analysis/{baselines,decision-records,scenario,scenarios}`, `executive-overview/{budget-analysis,budget-presets,department-analysis}`.
Pack generates: budget against actuals by department, permit-fee revenue with outstanding, scenario compare, decision records.
Gates: `opengov`, plus `mygov` for permit revenue.
Standing: the test asserting the string `$0` never appears must be re-scoped — with a pack that generates, real fixture figures render; `empty-city` must still never print `$0`.

**4. Citizen**
Live: `/citizen` plus 14 sub-routes (report-issue, permits, business-license, pay-utilities, pay-citation, public-records, parking-permit, events, library, parks, adopt-pet, volunteer, contact).
Pack generates: service requests with status, meetings, a thin public status view.
Gates: none required; this is the public-free surface. Payments stay unclaimed.

### Department lenses (the ten)

**5. Public works / Infrastructure** — `/departments/infrastructure`, `/projects`, `/reports`, `/reports/:id`, `/call-analytics`. APIs: PowerBI ×4 (`reports`, `cip-data`, `embed-token`, `status`), GoTo ×5 (`call-history`, `call-summary`, `extensions`). Pack generates: CIP/projects register, reporting index, call analytics summary. Gates: `powerbi`, `goto`.

**6. Parks** — `/departments/parks`, `/citizen/parks`. No dedicated vendor API live. Pack generates: facilities/grounds register, work requests, seasonal programming. Gates: none yet — this is a lens whose sources arrive per city. **Fix the current basis line, which names Municipal court on the Parks page** (it traces to a real register row pairing "Parks and Courts", but reads as a non sequitur).

**7. Police** — `/police`, `/emergency-response`. APIs: Spireon ×7 (`vehicles`, `alerts`, `driver-scores`, `accidents`, `maintenance`), Verkada ×8 (`cameras`, `alerts`, `lpr/plates`, `persons-of-interest`, `analytics/occupancy`), `dispatch/incidents`, `dispatch/after-action`, `emergency/{situation,resources,log}`. Pack generates: patrol/vehicle roster, camera inventory, incident log, regional operations map. Gates: `spireon`, `verkada`.

**8. Fire and EMS** — `/fire-ems`, `/vfd`. APIs: FirstDue ×6 (`apparatus`, `stations`, `occupancies`, `map-data`, `summary`), VFD ×5 (`preplans`, `water-supply`, `incident-water-sources`, `weather`), county ×7 (`flood`, `weather-alerts`, `wildfire-risk`, `map-layer/{fema-flood-zones,fire-districts,fire-stations}`). Pack generates: apparatus and station roster, preplans, water supply, flood/wildfire overlays. Gates: `firstdue`.

**9. Fleet** — `/fleet`, `/gps`. APIs: Samsara ×5 (`vehicles`, `drivers`, `fleet-summary`, `safety-events`, `dvirs/summary`). Pack generates: vehicle roster, driver roster, safety events, DVIR summary. Gates: `samsara`. Standing: fleet telemetry does not fill the Assets inventory; G-24 stays separate.

**10. Court** — `/departments/court`. Currently explained in a sentence on the Parks page, which is the defect the screenshots surfaced. Pack generates: docket, citations, dispositions. Gates: none yet.

**11. Code enforcement** — `/departments/code-enforcement`, `/permitflow/code-enforcement`. APIs: `mygov/code-violations`, `mygov/code-violations/stats`. Today a DS tab. Keep it as a DS tab AND give it a department home, or promote it — flagged as the one genuine either/or on this sheet. Gates: `mygov`.

**12. Community** — `/departments/community`. Pack generates: programs, facilities, engagement register. Gates: none yet.

**13. Administration** — `/departments/admin`, `/activity`, `/admin/data-audit`. Pack generates: activity log, data audit register. Gates: none. Overlaps People and access; keep the audit register here and the session/roles in People and access.

**14. Records search** — `/prophecy`. Currently `Not built` and named an island. Pack generates: a searchable document register. This one may honestly stay Not built if the search backend is out of scope; decide at build time and say which.

### Work lenses

**15. Plan review** — the new product. `/permitflow/*` ×10 routes, PermitFlow ×18 APIs (`permits`, `inspections`, `all-inspections`, `fire-inspections`, `code-cases`, `checklists`, `review-assignments`, `routing-rules`, `fee-schedules`, `contractors`, `staff`, `documents`, `stats`, `activity`, `addresses`).
**Separate lens from Development services, and the relationship is directional:** Plan review aspirationally replaces what DS monitors, and is a long way from doing so. DS shows what MyGov already runs; Plan review is the native reviewer console. Do not merge them, do not let DS's tabs imply Plan review's function.
Stays an iframe mount at `plan-review-app-ten.vercel.app` until a native console is scoped.

**16. Files** — iframe mount at `smart-files-app.vercel.app`. Out of scope as a design target; only the region frame is restylable.

### City group

**17. Assets** — G-24. Currently pinned at zero by ruling. Under ruling 3 the template gets fixture data here too; **confirm this is intended, because "Assets stays at zero" has been a hard constraint in every dispatch for weeks** and lifting it for `template-city` while leaving real packs at zero is the recommended shape.

**18. Connections** — the function register, 67 of 67 rows plus addenda, generated by `connectionsRegisterHtml()` in `src/shell-homes.mjs`. Must be re-baked, never hand-edited. Its disposition column becomes the live map of built-versus-granted once ruling 1 lands.

**19. People and access** — staff session, roles, invitations. Live: `/api/portal/team{,/add-member,/invite,/search-user}`, `/api/admin/city-users`. Gated on the auth build.

## The mock data pack

The mechanism already exists and is proven; this is an extension, not a new system.

`src/fixtures.mjs` is a seeded deterministic generator (`fnv1a` seed, `mulberry32` PRNG) with two content guards that must keep applying to every new domain: `assertNoRealWorldContent` and `assertDeclaredVocabulary`. `src/city-pack.mjs` declares `cityKey`, `displayName`, `accessPolicy`, `environment`, `seal`, `generatesFixtures`, `grantedAdapters`.

The build adds one generator per domain above, all keyed off the same pack seed so a city's data is stable across reloads and reproducible. Swapping a city is swapping the pack. The three identities hold: `template-city` (generates, public-free, Demo), `empty-city` (generates nothing — the regression check that honest-empty states stay reachable), `fixture-city` (tenant-private, 401 anonymous). Live Bastrop is not a pack and `src/city-pack.mjs` must keep throwing on it.

**Design constraint carried from the visual law:** on `empty-city` there are no exceptions, so every pill renders quiet and the tension mechanism switches off. That is the one input under which this design is guaranteed to look flat, and it stays the regression target for every lens built.

## Adapter catalog — CLOSED at G-91, and this section was stale within hours

**Superseded 2026-08-19.** When this sheet was written the catalog declared seven kinds and this section
said it was short by three. **G-91 added `spireon`, `goto` and `powerbi` the same day**, so as of
dashboards main `c7d7980` the catalog is **ten**, pinned in `src/adapters.test.mjs`. Lane W2DEPT read
this section, checked it at source rather than trusting it, and reported it stale — trusting it would have
declared three duplicate kinds.

Kept rather than deleted, because the failure is the point and it is the same one this whole sheet exists
to correct: a true statement that nothing was watching go false. The G-18 register's `Not built` did
exactly this over three handoffs. A build sheet is not a live instrument, so **every count in it is a
snapshot with a date, and the source of truth is the code**: the catalog is `ADAPTER_KINDS` in
`src/adapters.mjs`, the vocabulary is `stylesheetClasses()`, the domain list is `DOMAIN_REGISTRY`.

The eleventh live vendor family named earlier in this sheet is **`vfd`**, and it is NOT a missing
adapter: `/vfd` is Bastrop's own volunteer fire department route, a first-party city surface rather than
a third-party integration. FirstDue is the vendor behind Fire and EMS.
## Sequencing

The shell functions and the pack extension gate everything else, and the two are independent of each other, so they run in parallel first. Then lenses fan wide — each department lens is independent of every other once its generator exists. Overview and Finance come last of the data lenses because both compose across departments and want the others' shapes settled. Connections re-bakes at the end because its disposition column is a function of everything above it.

Merge stays serial per repo: all lenses share one `index.html` and one unpartitioned `shell.css`, so the physical constraint from the G-88 surface inventory still holds even though the logical work is wide.

## Out of scope

Connecting any real feed. Live Bastrop remains no-touch and no adapter is granted by this work. The Compass answer engine. Payments. Native Plan review console. Smart Files internals. Anything on `smartcity-os`.

## Open, for the operator at build time

Code enforcement: DS tab, department lens, or both.
Records search: build a register, or keep it honestly Not built.
Assets: confirm fixture data on `template-city` while real packs stay at zero.
Whether the ten department lenses should ship as ten, or whether any pair genuinely collapses for Bastrop specifically.
