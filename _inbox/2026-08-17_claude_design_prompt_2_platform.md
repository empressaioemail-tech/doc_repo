---
id: 2026-08-17_claude_design_prompt_2_platform
title: Claude Design prompt 2 — SmartCity product-line UX (all four)
status: draft
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    2026-08-17_claude_design_prompt_1_design_system,
    2026-08-17_claude_design_session1_visual_law,
    2026-08-17_bastrop_dashboard_layout_inventory,
    _decisions/2026-08-17_smartcity_visual_law,
    _decisions/2026-08-17_smartcity_product_line_design_system,
    _smartcity_masters/31_smartcity_dashboards,
    _smartcity_masters/32_smartcity_asset_management,
    _smartcity_masters/33a_smartcity_plan_review,
    _smartcity_masters/34_smartcity_smart_files_and_foundation,
    48_cortex_reporting_plan_review_spec,
  ]
---

# Prompt 2 — paste this after the design system exists

You already created the SmartCity product-line design system. **Use only those tokens and components.** Frozen law: quiet surfaces, loud exceptions, honest absence; register not card deck; sidebar; inverted applicability (Pass quiet, Unchecked hatch); Inter + Plex Mono, 12px floor; environment badge; not-built nav; provenance chip; code citation with no body slot. Do not reopen those. Do not invent a second look.

This session designs **all four products**, not Dashboards plus stubs. Operator 2026-08-17: design them all. The kit will be stored, at minimum, in every product repo (same tokens file, same anti-pattern numbers). Still no production code. Still no restyle of live `smartcityos.io`.

## The four products (all in scope)

One shell. Category switcher in the sidebar. A staff person moving between them must not feel a product change. They are sold as line items; they must not look like line items.

1. **Dashboards** — repo `empressaioemail-tech/smartcity-dashboards`. Audience lenses onto one city record.
2. **Smart Files** — repo `empressaioemail-tech/smart-files`, UI today at `https://smart-files-app.vercel.app` (persona select, org rooms, upload, share-read-only). Replace that vibe UI. Search from one place; a document lives once; revise once and it is current everywhere; prior version still there. Tenant-private by default.
3. **Plan Review** — repo `empressaioemail-tech/plan-review`, UI today at `https://plan-review-app-ten.vercel.app` (white page, persona gate, Queue/Library/Code/Applicant/Gate). Replace that. Native SmartCity UI in this app. Dashboards development-services **composes the functions**, never iframes this host.
4. **Asset Management** — no product repo yet. Design the product anyway. Housing comes later. G-24 is still zero city-owned asset types: the empty state **is** the first AM screen, not a "coming soon" badge. Do not invent hydrants to fill a map. Do not lead with 3D.

**Kit distribution (session output, not an implementation PR):** one `tokens` + component inventory package that will be copied into `smartcity-dashboards`, `smart-files`, `plan-review`, and the future AM repo. Same file. Divergence is a defect. Hauska, SmartSite/PE, ICC-demo, and Command Center do not get this kit.

## What we are building

A product line, not a clone of Bastrop's current dashboard.

When a feed connects, it becomes a record with provenance. Screens show records. Lenses are keyed by audience and permission. Live Bastrop staff stay on `smartcityos.io` until named island replacements. Demo is `template-city`. Gold parcel `48021:34137` (908 PINE) is a demo fixture, not Bastrop onboarded.

## Three identities (never collapse)

1. **Demo / template-city** on the new products. Environment badge must say demo.
2. **Live Bastrop** — `smartcityos.io` / `tenant_id=2`. Do not design a city-wide cutover.
3. **Next city** — new pack + grants. Same UI.

## Visual law you already set (do not reverse)

Environment badge is the only amber in chrome. "Not built" nav is dim + outlined badge. Provenance chip on every outside value. Footer is `N of M sources read`, never a fake "7 integrations." Confidence always carries baseline / provenance-backed / earned. No chart language yet. Comment-letter is a layout this session (finding row already exists).

## A. Dashboards

Capture every **job** from the old staff dash, not every widget. Old chrome is not sacred.

**Shell jobs.** Sign in. Category + lens. Search / Compass slot. Notifications. Feedback. Theme. Profile. Honest source footer.

**City manager.** Whole city, exceptions that deep-link, calendar, pulse. Not a parcel compose form. Not a greeting hero. Gold SmartSite may be the default map subject.

**Finance.** Budget against actuals from records. Honest empty with basis if template-city has no finance records. No OpenGov wallpaper. No $0.

**Development services.** Place (SmartSite region), permitting pipeline, inspections, work orders, licenses, **Review region composed from Plan Review** (not iframe). Old Leaflet dossier dies as the product map.

**Citizen.** Nearby status, service requests, meetings. Payments unclaimed. No Payment Complete.

**Later lenses (one frame each, "not built" or thin):** public works, police, fire, fleet. Roster visible. Do not pixel-push every old Emergency/Fleet tab.

**Compass.** Do not design it in this session. Complete handoff is `_inbox/2026-08-17_claude_design_prompt_3_compass.md`: shared-element sheet (present / dismiss / maximize) plus SmartSite atom render. Old Compass is not a reference.

**PermitFlow.** Kill as a product. Jobs: intake/review/disciplines/applicant -> Plan Review. Inspections/CE/WO -> Development lens.

## B–C. Smart Files and Plan Review

Do not design these in this session beyond the IA sketch. Complete handoff is `_inbox/2026-08-17_claude_design_prompt_4_files_and_plan_review.md`: file browser, drive-link ingest, access rail, review console, each at product altitude and city compose. If you are the Files/Review agent, paste prompt 4.

## D. Asset Management (full product chrome this session; empty data is honest)

This is a **build**, not a module. Design the working surfaces so the first city engagement has a UI to land records into.

1. **Inventory** — list + map region of assets the city owns. Empty is the designed first screen: "no city-owned asset records for template-city" with a basis. Do not paint Samsara trucks as AM.
2. **Asset record** — what it is, where it is (place), condition, history, provenance chip, access (public vs public-works-only vs locked). Edit history visible.
3. **Attach to place** — road, parcel, flood context as related records, not a GIS layer dump.
4. **As-built / documents** — Smart Files composition.
5. **Live state slot** — a reading accrues to the asset (history), it does not overwrite a gauge. May be empty.
6. **View** — 2D in place. 3D is real and last; do not lead with it; no 3D delivery date on the mock.

Fleet vehicles as a dashboard lens and as an asset class is the same record, two lenses. Do not design two systems.

## What this session must produce

1. **IA map** for the four products: category switcher, lens list (four leads + roster with not-built), Files, Plan Review, AM. Demo vs staff vs public citizen. Unauth demo must not leak private ops.
2. **Same shell, four ways** — Dashboards, Files, Plan Review, AM. Environment badge on all four.
3. **High-fidelity layouts (desktop + one phone breakpoint):**
   - Dashboards: city manager, development services, finance honest-empty, citizen
   - Plan Review: queue, console (matrix + map + adjudication), comment-letter
   - Smart Files: search, room, file+versions, share-read-only
   - Asset Management: empty inventory (the product empty), asset record (one populated example clearly marked **demo fixture**, not a live Bastrop asset), attach-to-place
4. **Flows:**
   - Staff: city manager -> development -> open review -> override a determination -> the finding is on the place
   - Staff: Plan Review attaches a file from Smart Files; that file's "where referenced" shows the review
   - Staff: AM empty -> (later) a record would attach to a place and an as-built in Files
   - Demo visitor: four Dashboards lenses without a parcel form; badge says demo
   - Shared Files link: read-only, no staff nav
5. **Old-to-new traceability** for the Bastrop staff jobs. Plus as-found Files and Plan Review QA UIs -> new surfaces. Killed items named (PermitFlow, CitizenConnect SKU, Digital Twin, iframe).
6. **Kit package** for the four repos: tokens, type rule, A1–A10, component names. One package. Note AM repo does not exist yet; the package still names the path it will copy to.
7. **Out of scope:** live Bastrop cutover, MyGov private ops on the demo, Samsara-as-AM, Compass full product beyond the slot, payments, extra department lenses beyond one not-built frame, cloning `smartcity-os`, restyling Hauska or SmartSite/PE, filling G-24, atoms `--apply`.

## Quality bar

City manager: city, lens, what is on fire, in five seconds. Examiner: which rows are Unchecked, without hunting. Clerk in Files: one search, current version, prior still there. Public-works lead in AM: either a real record or an honest empty, never a vendor wallpaper. Resident: no staff work orders, no fake pay.

When you are done, engineering can open four WDLLs (Dashboards UI, Plan Review UI, Smart Files UI, AM chrome) against these mocks without another "what does this look like" conversation.
