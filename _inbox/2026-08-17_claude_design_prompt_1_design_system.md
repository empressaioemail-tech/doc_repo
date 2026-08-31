---
id: 2026-08-17_claude_design_prompt_1_design_system
title: Claude Design prompt 1 — SmartCity design system
status: draft
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    2026-08-17_bastrop_dashboard_layout_inventory,
    2026-08-17_claude_design_prompt_2_platform,
    _smartcity_masters/31_smartcity_dashboards,
    _smartcity_masters/32_smartcity_asset_management,
    _smartcity_masters/33a_smartcity_plan_review,
    _smartcity_masters/34_smartcity_smart_files_and_foundation,
    _decisions/2026-08-17_smartcity_product_line_design_system,
  ]
---

# Prompt 1 — paste this first

You are the design lead for SmartCity, a municipal operating system for small-to-medium US cities. This session is **design system only**. Do not design the full platform IA yet. Do not write production code. Do not restyle the old Bastrop app in place.

The current Bastrop staff dashboard (smartcityos.io, authenticated) looks like vibe-coded govtech: glass cards, LED pulses, topographic hero PNGs, 9px labels, inline styles, teal glow, a second nested product called PermitFlow with its own slate/blue chrome, plus shadcn, Leaflet, and Recharts fighting each other. We are replacing that visual language. The new system must feel like a serious operating system a city manager would recommend to another city manager in a hallway. Clean. Quiet. Professional. High signal. Not a SaaS landing page and not a Palantir cosplay.

## Who it serves

City managers, development-services staff, finance, public-safety / public-works supervisors, plans examiners, and (later) residents. Dense operational work: queues, tables, maps, documents, exceptions. Phone-usable for a field check, desktop-primary for a workday.

## Product line this system must cover

This is the **Empressa SmartCity product-line design system**. It is law for every human surface in the line, not a Dashboards theme. Same tokens, type, density, shell, and empty/error language on all four:

1. **Dashboards** (SmartCity) — audience lenses: city manager, development services, finance, citizen, later departments.
2. **Smart Files** — rooms, search, versions, share, tenant-private. The customer-facing face of the storage layer. Live QA today is a separate vibe-coded UI; it comes onto this system.
3. **Plan Review** — queue, intake, applicability, adjudication, findings, code library, reasoning. First-class product, not an iframe of a demo site.
4. **Asset Management** (future) — city-owned assets as records on places, as-builts attached. Unbuilt. The kit must already have an asset record, place attachment, and honest-empty so AM does not invent a third look when housing starts.

One shell. A staff person moving from a dashboard lens to a review to a files room should not feel a product change. Categories are sold separately; they must not look separately.

**In this kit, out of this kit.** In: the four above, including the map *region* and document *region* those products host. Out: Hauska (substrate, no product chrome), SmartSite / Property Explorer as its own app (Dashboards hosts an embed region; do not restyle PE), ICC-demo licensed-IP portal, Command Center, marketing website.

Brand: Empressa products. Do not invent a Hauska look. Do not put "atom", "twin", "substrate", or "node" in any UI copy.

## What "10x" means here

- Hierarchy you can read in one second: where am I, what needs me, what is empty.
- One type ramp, one spacing scale, one radius, one shadow language. No glow.
- Color is semantic (status, permission, risk), not decoration. Teal-navy souvenir of the old app is allowed as a brand accent, not as a fog over every card.
- Tables and queues are first-class, not afterthoughts under hero metrics.
- Empty states are honest ("no records for this city yet" with a basis), never fake $0 budgets or payment-complete theater.
- Map and document preview sit in a defined region, not a random iframe.
- Light and dark that are both production-quality. Dark is default for staff. Citizen lens may be light.
- Accessibility: contrast, 44px touch on mobile, focus rings, no color-only status.

## Hard constraints

- Municipal, not consumer. No gamification, no confetti, no "AI" badge spam. If intelligence is present it is a quiet control, not a mascot.
- Do not design vendor-feed wallpaper (Samsara / MyGov / OpenGov clones). Connecting a system means the thing becomes a record. Screens show records.
- Do not design CitizenConnect, Digital Twin, or PermitFlow as product names.
- Do not put live work-order names or private ops on unauthenticated views.
- Licensed building-code text: citations and section IDs are allowed; verbatim ICC body text is not.

## What I need from this session (deliverables)

1. **Positioning one-liner** for the visual system (internal, one sentence).
2. **Foundations:** color (light + dark), type (propose a pair; old app mixed IBM Plex and Inter), spacing (4/8 scale), radius, elevation, motion (almost none), grid, density modes (comfortable / compact for queues).
3. **Core components** as a catalog with anatomy, states, and do/don't: app shell (top nav vs sidebar — recommend one; must work as Dashboards, Plan Review, Files, and later AM without a nested product header), product/category switcher, lens switcher, page header, metric (use sparingly), table, filters, empty, error, honest-empty, tabs, drawer, dialog, toast, buttons, inputs, status pill, permission/audience indicator (`public` vs `staff` vs `tenant-private` as UI, not four skins). Map region. Document/preview region. Files: room list, file row, version, share. Plan Review: queue list, finding row, determination (Pass / Fail / Uncertain / Unchecked). Asset Management stub: asset record, attach-to-place. Composer/chat sidebar slot (designed, not built this wave).
4. **Staff vs citizen** — same system, different density and permission. Show how a public citizen view and a staff queue share tokens without looking like two products.
5. **Cross-product proof:** kitchen sink plus **one canonical staff shell** used three ways with no new tokens: (a) Dashboards frame, (b) Plan Review frame, (c) Smart Files room frame. A fourth slot labeled Asset Management, honest-empty, same shell.
6. **Anti-patterns** ripped from the old app: hero PNGs, LED pulse, nested product headers, iframe-as-page, 9px type, four accent colors on one tile, a files UI that looks like a different company.

Stop when the system is tight enough that later sessions can lay out Dashboards, Plan Review, Smart Files, and (when built) Asset Management without inventing new tokens.

If you need a reference altitude: think Linear + a well-run city clerk's office, not a crypto dashboard and not Material default.
