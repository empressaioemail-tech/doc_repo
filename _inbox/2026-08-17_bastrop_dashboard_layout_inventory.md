---
id: 2026-08-17_bastrop_dashboard_layout_inventory
title: Bastrop staff dashboard — function and layout inventory (source)
status: active
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    2026-08-17_g18_smartcity_inventory,
    2026-08-17_g66_dashboards_ui_WDLL,
    _decisions/2026-08-17_dashboards_ui_then_one_feed,
    _smartcity_masters/31_smartcity_dashboards,
    _smartcity_masters/33a_smartcity_plan_review,
    48_cortex_reporting_plan_review_spec,
  ]
---

# Bastrop staff dashboard: functions and layouts

Purpose: give Claude Design (and later G-66) a complete map of what the **staff dashboard** at `https://smartcityos.io` actually is. Marketing site, grant pages, decks, admin SaaS, and `/portal` customer-success are **out of this inventory**.

Source this session: `P:\smartcity-os\client\src\App.tsx` routes, `SmartCityLayout.tsx` chrome, page files named below, G-18 inventory `_inbox/2026-08-17_g18_smartcity_inventory.md`, live pin `smartcity-api-00118-qox` @100% tag `lane4`. Staff pages are AuthGuard. Layouts below are from origin source, not live authenticated screenshots. Do not treat this as a staff session grade.

Live city stays **no-touch**. This file is documentation only.

## What this is not

Not `https://smartcityos.io/` marketing (Home, Solutions, Grants, Pricing, About, blog, tools, decks). Not `/admin/*` Empressa admin. Not `/portal/*` customer portal. Not `/demo/*`. Not `/vfd` as a separate public gate (it is also an Emergency tab). Not the new Dashboards product at `smartcity-dashboards-00007-8sc` except as a contrast at the end.

## Shell (every staff page that uses SmartCityLayout)

File: `client/src/components/smartcity/SmartCityLayout.tsx`.

**Chrome, top to bottom.**

1. Sticky 48px header, dark navy even in light mode (`headerBg #0f2438` / `#0a1c2e`). City logo, wordmark "SmartCity OS / Executive Dashboard".
2. Horizontal primary nav (desktop): Overview, Finance, Development, Emergency, Operations, Compass, Prophecy. Active state is a teal underline mask, not a filled pill that reads as a product.
3. Center header search: "Ask Compass anything..." with an AI chip. Opens CompassQuickAsk overlay. This is a chatbot over vendor snapshots, not the doc 34 sidebar.
4. Header utilities: theme toggle (dark default), notifications (Samsara / MyGov / integration health), feedback (screenshot + category), settings (theme + fake auto-refresh toggle), profile (portal profile / settings / sign out).
5. Mobile: hamburger drawer with the same seven nav items.
6. Main scroll region. No persistent left sidebar on the live staff shell. `Sidebar.tsx` still exists with Overview / Citizen Portal / Prophecy and is **not** the serving staff IA.
7. Status bar (desktop only): green "Connected", hardcoded "7 integrations", city name.
8. Ambient mesh background + LightbulbInsight FAB. Glass cards, IBM Plex Sans / Plex Mono, teal `#78aec2` dark / `#4a8a9e` light.

**Visual diagnosis (why it feels vibe-coded).** Inline style objects on every control. Glow, blur, LED pulses, topographic hero PNG, 9px to 11px labels, too many accent colors. Two type systems (layout IBM Plex, Compass comments name Inter). PermitFlow is a second product chrome (slate-900 + blue-400) nested inside the same app. shadcn/ui plus a private GlassCard/Led/ShapedIcon kit plus Recharts plus Leaflet. Density is dashboard-demo, not an operations console.

**Theme tokens** (`client/src/lib/theme.ts`): navy page `#0d1a28`, card `#152435`, teal, green/amber/red/purple/blue semantic. Dark is default (`smartcity-theme` localStorage, v2 migrated to dark).

## Primary IA (seven destinations)

| Nav | Route | Page file | Job |
|---|---|---|---|
| Overview | `/overview` | `Overview.tsx` | City-manager home |
| Finance | `/executive-analysis` | `ExecutiveAnalysis.tsx` | Money |
| Development | `/development-services` | `DevelopmentServicesDashboard.tsx` | Permits, WO, map, licenses |
| Emergency | `/emergency-response` | `EmergencyResponse.tsx` | EOC / public safety |
| Operations | `/fleet` | `FleetManagement.tsx` | Fleet + CIP + phones |
| Compass | `/ask-smartcity` | `AskSmartCity.tsx` | Staff chatbot |
| Prophecy | `/prophecy` | `Prophecy.tsx` | AI document search |

`/dashboard` and `/executive-overview` redirect to `/overview`. `/opengov` redirects to `/executive-analysis?tab=opengov`. `/fire-ems` redirects to `/emergency-response?tab=fire-ems`. `/police` is a full page that also embeds as the Emergency Police tab.

## Layout 1 — Overview (`/overview`)

Single column, max-width 1600.

1. **Hero.** Generated topographic PNG, greeting ("Good Morning, {firstName}"), city label, "All Systems Operational" LED. Four clickable metric tiles: Active Alerts, New Permit Requests, WO Due Today, Open Work Orders. Tiles deep-link into Development or Emergency with query filters.
2. **Workspaces.** Four launch cards: Finance, Development, Emergency, Operations. Same destinations as primary nav. Compass and Prophecy are header-only.
3. **Two-up.** Left: City Calendar (municode scrape, G-18). Right: Live City Pulse, 2x2 of Finance / Development / Emergency / Operations pulse cards, plus data-source dots (Samsara, OpenGov, MyGov, NWS). Pulse cards open DepartmentOverviewModal.

Functions captured: morning orientation, exception counts, jump to workspace, calendar, vendor-health wallpaper.

## Layout 2 — Finance (`/executive-analysis`)

Tab bar inside the shell (not the header).

Tabs: OpenGov Finance (default), Budget Analyzer, Department Analyzer, Scenario Modeler, Permit Revenue.

OpenGov is an embedded `OpenGovWorkspace` (charts of accounts / budget copies). Budget / department / scenario are local analysis tools over those copies. Permit Revenue is MyGov fee rollup.

Functions captured: budget vs actuals, department spend, what-if, permit fee revenue. Not spine records. G-21 still OPEN on count honesty.

## Layout 3 — Development (`/development-services`)

Largest staff surface. File is ~5700 lines.

**Hero metrics (6):** WO Active, WO Overdue, WO Due Today, Active Projects (permits), Expiring, Active Reviews. Each metric sets a tab + filter.

**Main tabs:**

- Property Intel: Leaflet map (OSM + Esri), layer manager, equity panel, parcel dossier (`PropertyDossier`). Second parcel stack. CSP cannot frame SmartSite. G-45 mount target is `smartsite.cloud/?parcelNodeId=`.
- Permits: lists, inspections, code enforcement, reviews, inspector load table, SLA table, manager load. MyGov copies. Filters from Compass chips.
- Work Orders: MyGov WO tables with due/overdue/open filters.
- Business Licenses: license roll.

Functions captured: find a place, see permitting pipeline, inspections, CE cases, work orders, licenses, print/PDF export. Plan review for staff is **not** this page; it lives in PermitFlow.

## Layout 4 — Emergency (`/emergency-response`)

Subtitle "Emergency Operations Center".

**Workspace tabs:** Regional Operations, Police, Fire / EMS, Flood / Weather, VFD, County Dispatch.

Regional Operations subviews: Map, Resources, Incident Log, Cameras (Verkada). Leaflet + Esri tiles + FEMA flood polygons + Samsara vehicles + Spireon units + FirstDue occupancies.

Police tab embeds `PoliceDashboard` (Spireon). Fire/EMS and VFD are FirstDue-shaped. Flood/Weather is NWS + flood layers.

Functions captured: live map of response assets, occupancy / target hazards, cameras, weather, police AVL. Honesty of Spireon / Verkada / FirstDue last-sync is UNGRADED without a staff session (G-18).

## Layout 5 — Operations (`/fleet`)

Tabs: Overview, Reporting (Power BI), Map, Vehicles, Drivers, Departments, Safety, Communications (GoTo Connect).

Overview is Samsara utilization wallpaper plus CIP project tiles (Gantt imported from ProjectManagement). Map is Leaflet vehicle tracking. Communications is phone analytics.

Functions captured: where are the trucks, utilization, DVIR/safety, department split, CIP, phone stats. Fleet rows are Samsara copies, not Asset Management nodes. G-24 stays zero.

## Layout 6 — Compass (`/ask-smartcity`)

Full-page chat. Thread list, streaming markdown, metric/flag/budget/action cards, PDF export, mic, attachments, FocusPanel. Header "Ask Compass" is the same product in overlay form.

Functions captured: ask a question about the city snapshot; get a narrative plus widgets; pin / share. Not a sidebar over readable records (doc 34). Public `GET /api/ai/morning-brief` leaks live work orders without a session (G-18 finding 1). Do not put that on unauth Dashboards.

## Layout 7 — Prophecy (`/prophecy`)

AI document search and city records. Framed by CSP `prophecygov.com`. Separate from Compass. Keep as a named island until a records-search lens exists.

## PermitFlow (second chrome, still live)

Own header: slate-900, "PermitFlow", not SmartCityLayout nav.

Staff nav: Overview, Intake, Review, Inspect, Fire, GIS, Code Enf., Admin.

External: Citizen Portal, Contractor Portal.

Routes:

| Route | Function |
|---|---|
| `/permitflow` | Queue stats, charts, seed button |
| `/permitflow/intake` | New application |
| `/permitflow/review` | Reviewer queue, department filter, approve / deny / revisions, document status. Live GET 200. |
| `/permitflow/inspector` | Inspection scheduling |
| `/permitflow/fire` | Fire review |
| `/permitflow/gis` | GIS review |
| `/permitflow/code-enforcement` | CE inside PermitFlow (duplicates Development CE) |
| `/permitflow/admin` | Admin |
| `/permitflow/citizen` | Applicant-facing |
| `/permitflow/contractor` | Contractor-facing |

Writes `pf_documents` and `pf_*` in the city DB. Not Lane C. Canonical review host is `https://plan-review-app-ten.vercel.app` (persona gate: Reviewer / Observer / Applicant for `icc-demo`). Dashboards currently **iframes** that host on `/?lens=development-services`. That iframe is not a SmartCity Plan Review UI.

**Plan Review function surfaces that must be designed (doc 48 / 33a), not PermitFlow clones:**

- F1 Engagement queue
- F2 Intake and triage (parcel + project type; Cotality is extinguished; resolve via public-record / SmartSite `parcelNodeId`)
- F3 Applicability matrix (Pass / Fail / Uncertain / Unchecked per section)
- F4 Reviewer adjudication (accept / override + reason)
- F5 Findings library
- F6 Code library (citation, not verbatim ICC body)
- F7 Reasoning drill-through
- Place map: SmartSite embed, not a new Leaflet

Serving plan-review-app nav today: Queue, Library, Code, Applicant, Gate. White page, no design system.

## Other staff pages (reachable, not in the seven-item nav)

| Route | Layout / function |
|---|---|
| `/reports`, `/reports/:id` | Reports center / OpenGov report viewer |
| `/activity` | Ops activity log |
| `/projects` | CIP project management (also mounted inside Fleet) |
| `/call-analytics` | GoTo Connect (also Fleet Communications) |
| `/police` | Standalone police (also Emergency tab) |
| `/design-lab` | Internal design playground |
| `/admin/data-audit` | Data audit |
| `/departments/*` | Admin, Development, Infrastructure, Community, Parks, Court, Code Enforcement department pages |
| `/opengov/code-reference` | Chart of accounts viewer |
| `/citizen` and 12 service routes | CitizenConnect service grid (pay utilities, pay citation, permits, report issue, business license, events, library, adopt pet, parking, parks, public records, contact). Payments are `setTimeout` theater. Kill as a SKU. Keep as a future citizen lens after honesty. |

## Citizen portal layout (`/citizen`)

Hero cityscape, service tile grid (12 tiles), calendar, citizen map, volunteer/neighborhood modules. AuthGuard wraps `/citizen*` in App.tsx so this is not a public resident app on the live city. New product: citizen is a Dashboards lens with `accessPolicy=public-free`, payments unclaimed.

## Cross-cutting functions to preserve (capability, not chrome)

From G-18 keep list, expressed as jobs to be done:

1. See the whole city this morning (exceptions, not a vendor mosaic).
2. Open the permitting / inspections / work-order pipeline.
3. Open a place (parcel) and see what is true of it.
4. See money (budget, spend, permit revenue) as records, not OpenGov wallpaper.
5. See response assets and incidents.
6. See fleet / field assets.
7. Ask a question and get an answer grounded in records (Compass later).
8. Search city documents (Prophecy island until designed).
9. Review a submittal against adopted code (Plan Review category).
10. Public calendar of meetings (municode is the live source).
11. Resident: nearby status and service requests (no payment theater).
12. Staff session, notifications, feedback, theme, sign out.

Do not preserve: Digital Twin / 3D, CitizenConnect as a product name, Pipedrive as a city feed, aggregation-only vendor screens as the offer, iframe of icc-demo as the staff reviewer, live morning-brief work-order names on unauthenticated Dashboards, cloning `P:\smartcity-os`.

## Three identities (do not collapse in any mock)

- **Demo / template-city** on Dashboards. Gold parcel `48021:34137` (908 PINE) is a demo fixture, not Bastrop onboarded.
- **Live Bastrop** `smartcityos.io` / `00118-qox` / `tenant_id=2`. Staff still work here. No-touch.
- **Next city** is a new pack plus adapter grants on the same Dashboards product.

## New product contrast (what is live on Dashboards today)

Serving `smartcity-dashboards-00007-8sc`. Unauth GET `/` is a proof: Parcel Node Id, City key, Compose, SmartSite iframe of gold parcel, atoms panel, files room, four lead-lens **cards**. GET `/?lens=development-services` iframes `plan-review-app-ten.vercel.app`. This is not doc 31. G-66 WDLL (draft) is the UI card and is **paused** until this design pass settles chrome.

## Design-system mandate (operator 2026-08-17)

Current staff UI is vibe-coded. Target is a clean, professional municipal operating system. **One Empressa product-line design system** governs Dashboards, Smart Files, Plan Review, and future Asset Management (`_decisions/2026-08-17_smartcity_product_line_design_system.md`). Not a Dashboards theme. Not Hauska. Not SmartSite/PE, ICC-demo, or Command Center. Plan Review UI is a SmartCity product surface (prefer building it in the plan-review app on the same system, then composing functions into Dashboards). Smart Files QA UI comes onto the same system. AM gets kit components now; housing stays later. Do not iframe a foreign site. Do not clone PermitFlow visuals.
