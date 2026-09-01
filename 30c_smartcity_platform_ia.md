---
id: 30c_smartcity_platform_ia
title: SmartCity platform — IA, layouts, and old-to-new traceability (INTERNAL)
status: active
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    30b_smartcity_design_system,
    2026-08-17_claude_design_prompt_2_platform,
    2026-08-17_bastrop_dashboard_layout_inventory,
    _smartcity_masters/31_smartcity_dashboards,
    _smartcity_masters/32_smartcity_asset_management,
    _smartcity_masters/33a_smartcity_plan_review,
    _smartcity_masters/34_smartcity_smart_files_and_foundation,
    48_cortex_reporting_plan_review_spec,
  ]
---

# SmartCity platform: IA, layouts, and traceability

> **Purpose.** The information architecture, the canonical layouts for all four products, the flows, and the traceability of every old staff-dashboard job into the new product line. Executes against `30b_smartcity_design_system.md` and introduces no token or component outside it.

Four first-class products on one system: **Dashboards**, **Smart Files**, **Plan Review**, and **Asset Management**. None is a later mount.

INTERNAL spec. Design law and disposition decisions, not approved claims about city state. Not a category master.

**INTERNAL, do not publish outside the building.** The rendered layouts carry citations to a licensed corpus under a proof-of-concept licence that does not extend to customer-facing applications.

Rendered layouts: https://claude.ai/code/artifact/8c7f449a-b510-49d8-a26f-ab1e15088c54
Local copy: `30c_smartcity_platform_ia.html`

All content is **template-city, a demo fixture**. Live Bastrop is not cut over by this design. A next city is a pack on this same product, never a fork.

## 1. Information architecture

Three access modes, one product.

**Demo visitor, unauthenticated.** Lenses: Overview, Development services, Finance, Citizen, all tagged Preview. Work: Plan review and Files search, tagged Preview, plus the shared read-only view. Never shown: private rooms or their contents, Assets in any form, staff names, assignments, work orders, case routing, Connections, People and access.

**Staff, authenticated and role scoped.** Lenses: Overview, Development services, Finance, Citizen (preview), then Public works, Police, Fire and EMS, Fleet as Not built. Work: Plan review, Files, Records search. City: Assets, Connections, People and access.

**Resident, public, no sign-in.** Top bar only: Near you, My requests, Meetings, Report an issue. Never shown: Assets in any form, any staff name, work orders or internal routing, a pay button with no processor behind it.

### Rulings

Plan Review is reachable two ways and is one product: its own staff path under Work, and a Review tab inside Development services that mounts the same console. Not an iframe, not a second app, not a persona gate.

The demo needs no parcel form. A visitor lands in a lens and sees the city. A parcel identifier is a consequence of clicking the map or a row, never a prerequisite typed into a box.

The four lead lenses are Overview, Development services, Finance, Citizen. The rest of the **department roster** is real and visible in the nav as Not built, so the IA never implies coverage it does not have.

**Files and Assets are real staff paths, not Not-built.** Files sits under Work beside Plan review; Assets sits under City. Both ship chrome-complete. An empty Assets inventory is a designed screen, not a missing feature. A demo visitor may preview Files search and the shared read-only view, and never a private room or its contents. A resident never sees Assets in any form.

## 2. The layouts

Each is rendered in the artifact. What follows is the structural decision, not the pixels.

**City manager (Overview).** Metric strip of four: Needs a decision, Overdue reviews, Permits in flight, Meetings this week. Primary region stacks three panels: What needs you today (a cross-department decision queue, every row deep-linking to the lens that owns it), Public meetings (clerk calendar named as the source), and Across departments (a source register replacing the old pulse grid, showing what each lens reads and whether it read). Context rail: the city map plus a sources panel. No greeting, no hero image, no workspace launch cards duplicating the nav.

**Development services.** Metric strip of four: Overdue, In review, Awaiting applicant, Ready to issue. Tabs: Pipeline, Place, Review, Inspections, Code enforcement, Licenses. Primary region is the pipeline queue, compact by default. Context rail is the place map plus a selected-parcel panel with an Open review console action. The old six hero metrics fold to four; Expiring and Active projects become stage filters, which is where the work happens.

**Finance, honest-empty.** No metric strip. Four zeros in the header would be four false claims, so the page header carries a state pill instead. Primary region is the honest-empty statement plus a **source register** naming the four sources this lens reads with the state of each. Permit fee revenue reads **Partial**, because fees exist on permit cases but the ledger has not confirmed collection. That distinction is the product in one row.

**Citizen.** Light, comfortable, 16px base, 44px targets, single 720px column, top bar only. Near you address lookup, a case status card in public vocabulary, an honest-empty payment card giving the counter address and hours, and public meetings. No twelve-tile service grid, no hero cityscape, no separate product name.

**Plan Review queue (F1).** Metric strip: Submitted, In review, Past deadline, Approved with conditions. Tabs: Queue, Findings library, Code library. Primary region is the engagement queue with stage filters. Context rail is the selected engagement summary (unresolved split by fails, uncertain, unchecked) plus the place map.

**Plan Review console (F3, F4, F6, F7).** Metric strip counts outcomes, not throughput: Fails, Uncertain, Unchecked, Passed, with Passed deliberately last so the total reconciles without competing for attention. Tabs: Applicability, Findings, Documents, History. Primary region is the applicability matrix **grouped by corpus**, defaulting to an Unresolved only filter, with a reasoning panel below it. Context rail switches between Place and Sheet and carries the adjudication panel, where Override requires a written reason before it commits and the panel states that the reason is recorded with a name and a time.

**Smart Files, search and rooms.** The city private filing system and the composition seam under the other three. Page header carries the acting tenant as an identity pill. Primary region is search across what the acting tenant can see, then a room register (files, people, owner department) and the open room file list with version and reference count. Context rail carries Who can see it, where **tenant private** is the stated default and widening is an explicit act with a name and a time against it. Acting-as is identity from the session and never a developer select in the product chrome; the QA persona switch is a demo-only fixture panel off to the side, labelled as absent in a city deployment.

**Smart Files, file record.** Preview region, version history, and where referenced. Current version is current everywhere it is referenced; prior versions stay resolvable, because a review that cited v2 must keep resolving to v2. Where referenced lists the review, the asset, and the lens that point at the file. Access is inherited from the room: referencing a file into Plan Review or an asset does not change who can see it.

**Smart Files, shared read-only.** Same tokens, no second skin, no staff nav. City identity, a read-only pill, the preview region, and the provenance of who shared it. Nothing implies an application behind it.

**Smart Files, honest empty.** No rooms owned and none shared to this tenant, with the basis count and the contact, plus create-first-room and request-access actions.

**Asset Management, inventory.** The landing screen is honest-empty and the chrome is complete: nav, tabs, header, actions, map region. No city-owned asset records for template-city, with the basis and the contact. A second panel names what an asset record holds once recorded. The map shows the city outline and **no asset layer**; vendor fleet telemetry is not painted here to make the screen look populated, because a truck on a vendor feed is not a city asset record. No 3D, no coming-soon card, no sample data presented as the city own.

**Asset Management, asset record.** One example, reached only from an explicit fixture label and carrying the amber Demo fixture badge plus a line stating it is not a Bastrop asset. Holds what it is (asset id, type, install date, condition with inspection date), where it is (place map plus related road, parcel and flood-overlay records), history as an event table, as-built drawings referenced from Files with the room access intact, a provenance chip naming who recorded it and when, and access as a restricted pill. The **live-state slot is visible and empty**: a reading accrues to the asset and joins its history, and with no source attached the slot states that with a basis rather than hiding.

**Phone.** Under 900px the sidebar becomes a sheet behind the menu control, the context rail moves below the primary region, density locks to comfortable, and the metric strip wraps to two columns. The top bar keeps city, environment, and search, because a field check answers which city and which record first.

## 3. Flows

**Staff, from the city to an override.** Land on Overview. Click a row in What needs you today; it opens a drawer over Overview, so the queue is never lost. Open in Development services; the lens switches and the map moves to the parcel with no identifier typed. Open the review console; the Review tab mounts Plan Review natively, same shell, no second chrome. Read the unresolved rows; the matrix defaults to Unresolved only and the 44 passing sections stay gray. Open reasoning on the failing section; the basis panel shows derivation, source count, confidence with its state, and read time. Override with a reason; the control stays disabled until the reason field has content, then a toast reads Determination recorded and the case history gains the reason with name and timestamp.

**Demo visitor, four lenses without a parcel form.** Land unauthenticated with the environment badge reading Demo city in amber. Move between the four lead lenses from the sidebar; each loads populated or honestly empty and none asks for a parcel identifier. Click a parcel on the map and the identifier appears in the region footer as a consequence, never as an input. The visitor never sees staff names, assignments, work orders, case routing, Connections, or People and access.

**Empty city, Finance and Citizen.** Finance opens with a state pill rather than a metric strip. The honest-empty names the four sources, states that none is connected, and says explicitly that this is not a zero balance, with a basis block giving the count and the contact. The source register gives each source its own state, with permit fee revenue marked Partial. Citizen states that online payment is unavailable and gives the counter address and hours, with no pay button that resolves to nothing.

**Plan Review attaches a file from Smart Files.** In the review console, attaching evidence to a finding opens a picker scoped to Files the acting tenant can see, never an upload dialog writing into the review app. Choosing a file gives the finding a sheet reference resolving to the file current version, with access inherited from the room rather than re-granted by the review. Opening that file in Files shows the review in its Where referenced panel alongside the asset and the lens already pointing at it. When a new version lands it becomes current everywhere it is referenced, and the review that cited the prior version still resolves to that version. No second document table and no `pf_documents` inside the review app.

**Asset Management from empty to the fixture record.** Assets opens from the City group onto the empty inventory, which is the landing screen and a real path, never a Not-built item. The honest-empty states no city-owned asset records for template-city with a basis and a contact, and the map shows the city outline with no asset layer. The fixture record is reached only from an explicit fixture label, carries the amber Demo fixture badge and a line stating it is not a Bastrop asset, and there is no path that presents it as live. The record then shows what it is, where it is with related records, condition, history, as-builts from Files, and a visible empty live-state slot with its basis.

**Applicant, the thin status view.** My requests shows one card per case in public vocabulary only: Waiting on you, never an internal routing step and never a reviewer name. The comment letter carries findings in plain language with citations; local ordinance may quote in full, licensed sections carry the full canonical title and no body text. Uploading revisions moves the status to In review. The applicant never sees the applicability matrix or the examiner's adjudication.

## 4. Old to new traceability

Four dispositions: **Moves** to a designed surface, **Later lens** on the roster and visible as Not built, **Island** kept as a named separate thing, **Killed** with a reason.

| Old surface or job | Disposition | New home | Note |
|---|---|---|---|
| See the whole city this morning | Moves | Overview, What needs you today | Becomes a decision queue. Hero, greeting and workspace cards dropped. |
| Overview four metric tiles | Moves | Overview metric strip | Four header numbers, each filtering the queue below. |
| Overview workspace launch cards | Killed | | Duplicates the sidebar. Navigation belongs in one place. |
| City calendar | Moves | Overview Public meetings; Citizen Meetings | Clerk calendar is the source and is named on the panel. |
| Live City Pulse 2x2 and data-source dots | Moves | Overview, Across departments | Becomes a source register: what each lens reads and whether it read. |
| Permitting pipeline, inspections | Moves | Development services, Pipeline and Inspections tabs | Queue is first-class, compact by default. |
| Work orders | Moves | Development services, Pipeline stage filter | Stays staff-only. Never on an unauthenticated view. |
| Business licenses | Moves | Development services, Licenses tab | Same job, restyled to the queue anatomy. |
| Code enforcement cases | Moves | Development services, Code enforcement tab | One home. The nested duplicate is dropped. |
| Property Intel, parcel dossier | Moves | Development services, Place tab and context rail | One map stack. Parcel resolves from public record, never a typed form. |
| Second Leaflet parcel stack | Killed | | Two map stacks with two looks. One region, one basemap policy. |
| Budget against actuals, department spend, scenario | Moves | Finance, once a source connects | Honest-empty with a basis until then. No painted third-party screen. |
| Permit fee revenue | Moves | Finance source register, marked Partial | Fees exist on cases; not revenue until the ledger confirms. |
| Review a submittal against adopted code | Moves | Plan review, F1 through F7 | Native SmartCity surface. Not an iframe, not a persona gate. |
| PermitFlow intake | Moves | Plan review, intake and triage | Project type plus place. No document upload required to start. |
| PermitFlow reviewer queue | Moves | Plan review, Queue | Stages: Submitted, In review, Approved, Approved with conditions, Denied. |
| PermitFlow inspect, fire, GIS tabs | Moves | Plan review, review disciplines | Disciplines are a filter on one queue, not four nested apps. |
| PermitFlow applicant and contractor portals | Moves | Citizen, My requests | Thin status view in public vocabulary. |
| PermitFlow chrome and product name | Killed | | Second header, second accent, second product name inside one app. |
| Compass full-page chat and header overlay | Moves | Compass: top-bar source control plus shared-element sheet | Scoped, cited, follows the user. Not a rail state, not a route, not a third product in the nav. |
| Public morning-brief endpoint | Killed | | Leaked live work orders without a session. Never on an unauthenticated view. |
| Prophecy document search | Island | Records search, named nav item | Named island until a records-search lens is designed. |
| Emergency: map, police, fire and EMS, flood, VFD, cameras | Later lens | Police, Fire and EMS lenses, shown Not built | Captured in IA. Not mocked this session. |
| Operations: fleet map, vehicles, drivers, safety, CIP, phones | Later lens | Fleet and Public works lenses, shown Not built | Captured in IA. Not mocked this session. |
| Reports centre, activity log, projects, call analytics | Later lens | Department lenses on the roster | No orphan routes. Each lands in a lens or is killed. |
| Staff session, notifications, feedback, theme, sign out | Moves | Top bar utilities and user menu | Theme is a user setting; dark is the staff default. |
| Connection status | Moves | Nav footer and Connections page | States sources actually read with a time. Never a hardcoded integration count. |
| CitizenConnect twelve service tiles | Killed | Citizen lens | Product name and tile grid dropped. Services return as records, not tiles. |
| Citizen payment screens | Killed | Citizen, honest-empty | Payments were setTimeout theater. Unclaimed until a processor exists. |
| Digital Twin and 3D | Killed | | Not a product surface. The word does not appear in any UI copy. |
| smart-files-app as-found QA UI | Moves | Files: search, room, file, shared read-only | QA surface becomes the product on this system. Acting-as leaves the chrome. |
| plan-review-app as-found QA UI | Moves | Plan review, F1 through F7 | Queue, Library, Code, Applicant, Gate replaced by the designed console. Persona gate dropped. |
| Asset Management, empty inventory | Moves | Assets, chrome-complete honest-empty | Chrome ships now. Empty is a designed state, not a later lens. Ingest is out of scope. |
| Vendor aggregation screens as the offer | Killed | | A connected system becomes a record with provenance. Wallpaper is not the product. |

## 5. Out of scope

Not mocked this session, deliberately: live Bastrop cutover; private operational data on the demo; vendor telemetry wallpaper; the Compass retrieval and answer engine, since section 14 specifies the chrome and the atom language but not what generates the answers; **asset ingest**, since the Asset Management chrome and record shape are designed but importing or connecting an inventory is not, so G-24 stays out of scope and the counter stays at zero; payments; department lenses beyond the Not built nav state; charts; and any restyle or clone of the existing SmartCity repo.

Charts remain out. Nothing in these six layouts needed one, and the finance figures that would justify a chart language do not exist yet.


## 6. Compass

Compass is the assistant that follows the user across all four products. It is not a page, not a nav item, and not a rail state. It is one source control in the top bar that **changes size** into a sheet, and the same object again into a maximized surface.

**Ticket sentence.** The panel expands from the tapped element rect using a shared element transition, spring eased, with corner radius interpolating from tile to container, content fading in on a short delay, and the underlying surface scaling up slightly and dimming.

Two jobs, kept apart. **Chrome** is how Compass arrives: a shared-element transition. **Atom language** is how evidence opens inside it: a reserved chip that fetches on tap and grows in place. A chip on a dashboard row opens a popover and does not launch Compass.

### 6.1 Chrome, the five properties

The umbrella term is a shared element transition, also called a hero or matched geometry transition; Apple calls it a zoom transition and `matchedGeometryEffect`. The small thing and the big thing are the same object changing size, not two views swapping places. Five things happen at once and skipping any one is why copies feel off.

1. **Origin anchoring.** The panel grows from the exact rect of the tapped control, never the viewport centre. The transform origin is the source rect.
2. **Corner radius interpolation.** Corners animate from source radius to sheet radius over the same duration, on a continuous corner curve rather than a circular arc.
3. **Spring physics, not an easing curve.** Fast start, barely perceptible settle, no perceptible stop.
4. **Content crossfade with a delay.** Destination content fades in after the container starts growing, clipped to the expanding frame. The container leads, the content follows.
5. **Background recession.** The launching surface scales up a few percent and dims. Closing reverses all five.

The animation is **interruptible and velocity preserving**: the sheet can be grabbed mid-open and dragged back, reversing from current position and speed rather than finishing and restarting.

### 6.2 Source, states, maximize, dismiss

**Source control** is a top-bar utility, one per shell, carrying the scope in a whisper: city and current lens. It is the source rect. No unread dot, no AI badge.

**Presented** is a right-hand sheet of 360 to 420px that *is* the control, grown, full-bleed on a narrow viewport. It does not cover the whole work surface and it is not a new layer appearing beside the control.

**Maximized** is the same object again, a second shared-element step to a near-full surface that leaves the sidebar and environment badge visible. A control on the sheet does this.

**Dismiss** reverses the five properties. From maximized it goes **straight back to the source**, one rule, kept. Drag to dismiss is required: interruptible, velocity preserving, rubber-banding if dragged the wrong way.

**One Compass** per signed-in user across all four products. Switching lens or product does not spawn a second sheet. The thread is scoped to city plus lens; switching either re-scopes rather than keeping the previous city atoms on screen. No `/compass` route, no full-page chat, no nested header inside the sheet.

### 6.3 Atom language

The atom render comes from SmartSite, retokened to this kit. Two surfaces: the **fact-row chip**, which opens one small popover under its row, one at a time, fetch on tap; and the **answer accordion**, where numbered citations become the same reserved chips and grow in place.

The accordion opens BRIEF immediately from the local citation (claim, source, method, never-bare confidence, freshness, as-of, access), **more** opens FULL (calibration honesty line, citation, open cited source, then the lineage walk), lineage chips under Computed from and Would affect **swap the card in place**, and **back** walks the graph. One card open per answer. Never a modal, never a second page.

Honesty rules restated on the components so they cannot be simplified away: never-bare confidence, so value and basis together or the number is omitted; asserted stays asserted and is never dressed as calibrated; forbidden, unknown and unservable all degrade identically to local BRIEF plus full record unavailable, and the word forbidden never leaks; no citable records in scope means no chips at all and plain prose; absent lineage links render nothing and relationships are never fabricated; a half-written citation is held during streaming and raw markup never flashes. Web and unverified sources are visually distinct, labeled unverified, and never wear the atom chip. Licensed code citations keep the full canonical title and no body slot; local ordinance may quote and the chip marks which.

Answers are a **register of turns**, not chat bubbles: user line and assistant line in Inter, chips inline, accordion clipped to the sheet, composer pinned at the bottom, scope line above the thread. Starter prompts are allowed when they are jobs, not personality.

### 6.4 Motion specification

Technique is **FLIP**, First Last Invert Play: measure the source rect, measure the destination rect, apply an inverting transform so the destination begins looking exactly like the source, then release it. Transform-based, not animated width and height, so it stays on the compositor. Radius is compensated by the inverse of the scale at the start so it interpolates true rather than distorting.

| Property | Value | Note |
|---|---|---|
| Spring | stiffness 320, damping 32, mass 0.9 | Starting point. Tune damping until the settle is just barely perceptible. |
| Derived | zeta 0.94, omega-zero 18.9 rad/s | Underdamped. Settles near 400ms, inside the 350 to 500ms read. |
| Origin | source rect | Measured from the Compass control, never the viewport centre. |
| Radius | 4px to 8px, continuous | Control radius to sheet radius, squircle, compensated for scale. |
| Content fade | delay 35 percent of settle | Container leads, content follows, clipped to the expanding frame. |
| Background | scale 1.03 and dim | Recedes on the z-axis. Reverses on dismiss. |
| Reduced motion | 0ms, no spring, no scale | Instant present and dismiss. |
| Recommended path | Framer Motion `layoutId` | Closest to matchedGeometryEffect: spring, interruptibility and layout matching for free. |

**Recommended web path: Framer Motion `layoutId`** on both the source control and the sheet. It is the only one of the three candidate paths that gives interruptibility and velocity preservation without hand-writing them, and those two properties are the difference between this transition and a canned one. View Transitions API is native but offers weak spring control. A hand-rolled FLIP on the Web Animations API is the no-dependency fallback and is what the rendered demo uses, with the spring sampled into a `linear()` easing; that demo approximates interruptibility, and a production build should take it from the library rather than reimplementing it.

**Scope of the exception.** This is the only named exception to the 180ms cap in `30b_smartcity_design_system.md`. Drawers, dialogs, row enters, popovers and toasts stay on the ordinary duration tokens, and data still never animates. Do not reopen the cap for anything else.


## 7. Smart Files and Plan Review at two altitudes

Each of these two net-new products is designed at two altitudes with the same components. **Product altitude** is the app a person opens as Smart Files or as Plan Review: own URL, own first screen, kit shell, environment badge, product switcher present so it reads as one line. **City altitude** is the same product composed into Dashboards: Files under Work, Review as the Development services Review tab. No iframe, no second header, no foreign-site look. A staff person who used the product yesterday and opens it from the city today must not relearn it. Sold as line items; must not look like line items.

The live QA surfaces are as-found, not the product. The two-column rooms page with a persona select is a proof of create, upload and share, not a file browser. The white Queue / Library / Code / Applicant / Gate page is a function harness, not the examiner console. Both are replaced.

### 7.1 Smart Files, the browser

A file browser for a city records, closer to Finder than to a SaaS card grid. One place to search. A document lives once. Revise once and it is current everywhere, and what it was before is still there. Tenant-private by default; widening access is an explicit act with a name and a time.

**Places rail**, inside the product and not a second app nav: Search, Recents, My files, Shared with me, Shared by me, a folder list under My files, and **Bring files** as a first-class entry rather than a settings page.

**Main.** Breadcrumb, and **list is the default**: name, kind, current version, who can see it, last revised, referenced-by count. Grid is an option for sheets and drawings. Multi-select. Files open in place in a preview region; folders open by drilling the list.

**Access rail**, right, always on when a folder or file is selected. Tenant private is the stated default. Each widening is a row carrying person or group, permission (view, comment, edit), who granted it and when. Revoke is a first-class control at the same weight as the grant. A share link is one more row, never a URL that exists off the record.

Customer language only: search all your smart files from one interface; revise once and it is updated everywhere, and what it was before is still there; your data is yours. The UI never says storage layer, substrate, atom, node, graph, or content-addressed. Provenance may say "from a Google Drive folder, brought in on {date}".

### 7.2 Bring files

The net-new job. A clerk pastes a Google Drive, Dropbox, OneDrive or shared-folder link and those files **become** Smart Files: one record each, with versions, access policy, and provenance pointing at the source link. After convert, Smart Files is the system of record and staff work here. The drive is a **source**, not a live mount, and opening the original is a provenance action rather than the default click.

Happy path is three moves: paste a link, name or create the destination folder, confirm.

Every state is designed and none is skipped: link received; checking the link; folder seen with a count, or this link is one file; bringing in, determinate, naming the folder they land in; converted; **partial**, listing the failures by name with a reason and a next step; and **failed**, with a basis and a next step, for permission denied, unsupported host, or an expired link.

Sources are a register with states, not a logo wall. Pasting a share link is the first path and works without an account connection when the link is reachable. **Connected Google Drive and Dropbox are a second path and start Not connected on the demo; no OAuth is faked.** Upload from this computer stays available and quieter than Bring.

What it is not: not a live two-way sync, not Drive mounted as the file system, not a rendering of a vendor UI, not an OAuth settings page as the product, and not a claim that every host works. Unsupported host is an honest empty that names the host.

### 7.3 Share and access

**Share dialog** on a folder or file: people with permission, link (view only by default, edit a named extra), optional expiry, and a one-line preview of exactly what the recipient will see. Copy link is a control, not the whole feature.

**People and access** is a page for the folder: everyone, every link, every grant time, every revoke, including revoked rows that can be restored. This is the page a city attorney opens.

**Shared read-only view** is unchanged from section 2: kit tokens, city identity, read-only pill, who shared it, no staff nav, no implication of an application behind it. **Request access** answers a link the user cannot read, with a named next step, never a 404. The applicant and any outside user use the same shared view and the same grant model; there is no separate portal skin. Acting-as is the session; the QA persona select stays a demo fixture panel labelled as absent in a city deployment.

### 7.4 Smart Files at city altitude

Work to Files mounts the **same browser**, scoped to the city tenant, with the environment badge saying Demo or Live. A review Documents tab is a **scoped list of that engagement folder plus Attach from Files**, not a second browser. Files on a place is a referenced list; Open in Files jumps to the product browser on that folder. The picker shows only what the acting tenant can see, and **attaching does not re-grant access**. Creating a file from Review or from a lens still lands in Smart Files; there is no upload that writes into the review app, and no `pf_documents`.

### 7.5 Plan Review, product altitude

The app lands on the **queue**; the **console** is the product. Both are the surfaces already specified in section 2 and are unchanged: stages Submitted, In review, Approved, Approved with conditions, Denied; the console metric strip counting Fails, Uncertain, Unchecked and Passed last; the inverted matrix grouped by corpus with Unresolved only as the default filter; Pass quiet, Uncertain amber, Unchecked hatched and louder than Fail; Override disabled until a reason is written, recorded with name and time. Product altitude changes only the top bar: product wordmark and product switcher in place of the city lens sidebar. One console, two chromes.

**Intake** is project type plus place, resolved from public record or SmartSite, with **no upload required to start**. Creating the engagement creates its Smart Files folder; sheets arrive later through Attach from Files or Bring files.

**Documents** is that folder. **Findings library** holds prior findings on the same section and canned templates. **Code library** keeps the full canonical title and no body slot for licensed content; local ordinance may quote and the chip marks it local. **Reasoning** shows source, derivation, confidence with its state, timestamp and source count, never a bare number.

**Comment letter** is a layout, not a Word clone: the finding row is the unit, carrying severity rail, id in mono, one sentence, citation chip, sheet reference and status, with a plain-language instruction per item.

**Applicant** is thin and public: public vocabulary only, no reviewer name, no matrix, comment letter in plain language, revisions uploaded through Smart Files into the engagement folder by share link. `icc-demo` is not a city; the demo city is template-city.

### 7.6 Plan Review at city altitude

Development services to Review mounts the same queue and console. An Overview overdue-review row deep-links into that console with no second chrome. Citizen My requests is the applicant view. Place on a parcel lists reviews on this place as related records, and opening one is the console. No iframe of the QA app, no nested PermitFlow chrome, and parcel resolve is public record or SmartSite.

### 7.7 The cross-product flow

The clerk brings a Drive folder and 37 of 40 land, three listed by name with reasons. Access stays tenant-private because nobody has been named. The examiner attaches one sheet to a finding through the picker, and attaching does not re-grant. Opening that file in Files shows Where referenced pointing at the review. A revision makes v4 current everywhere while the finding that cited v3 still resolves to v3. Only when someone shares does access widen, as a row with a name and a time. The applicant opens a share link and gets the shared read-only view and the thin status page, never the staff console and never a SmartCity session.

At no point does a second document store appear. The drive is a source, Smart Files is the system of record, and the review references files rather than owning them.

## 8. Handoff

**Implementer notes.** The Compass demo approximates interruptibility; build it on Framer `layoutId` or equivalent so grab-to-dismiss is real. Technique is FLIP with spring `{ stiffness: 320, damping: 32, mass: 0.9 }`, radius interpolation from control to sheet, content fade at roughly 35 percent of settle, background scale 1.03 and dim, and an instant present under reduced motion. The Compass retrieval and answer engine remain out of scope.

**G-64 residual.** Today the Dashboards development-services surface iframes `plan-review-app`. That is as-found. The designed end state is native compose per section 7. The iframe is allowed to remain until the Plan Review UI card replaces it. Do not redraw PermitFlow to bridge the gap.

**Housing.** Canonical housing will be `_smartcity_masters/36_smartcity_design_system` and `_smartcity_masters/37_smartcity_platform_ia`, INTERNAL ONLY, not claims registers. This session does not move the files; the planner moves them after it stops.

G-66 amends against these layouts. The Files UI, the Plan Review UI, and the Asset Management chrome are later named WDLLs, each compiled as its own dispatch against this file and the design system. Live `smartcityos.io` is untouched by this work. No atoms `--apply` is implied or authorised by anything here. No layout requires a token or component outside `30b_smartcity_design_system.md`.

## Revision history

- 2026-08-17, authored. Platform session against prompt 2. IA for three access modes, six layouts plus phone, four flows, thirty-one row traceability table, and the out-of-scope list. Executes against 30b; introduced no new tokens or components.
- 2026-08-17, housekeeping pass. Light evidence-accent `#177F78` and the accent-moves-not-atom collision rule written as law. One token count of 60 across both files. Class inventory split into product and documentation-only. Kit extract added as the copy payload, generated from the HTML token block rather than retyped. Housing, implementer notes and the G-64 residual recorded. Removed the word "Atom" and every `did:atom:` string from UI copy in the mocks; evidence chips now carry a numbered or named citation label and a plain record identifier.
- 2026-08-17, Files and Plan Review pass. Section 7 added: both net-new products at product and city altitude, the Bring files ingest job with every state, the access rail, share dialog and People and access page, comment letter, thin applicant, and the cross-product flow. Zero new tokens; one layout-only class for the determinate progress bar.
- 2026-08-17, Compass pass. Section 7 added: shared-element chrome (source control, presented, maximized, dismiss), SmartSite atom language (fact-row chip, answer accordion, BRIEF to FULL to lineage walk, honest degrade), and the motion spec. Reserved token --sc-atom and the named spring exception added to 30b; the assistant is no longer frozen as one rail state. Token set 60, byte-identical to 30b.
- 2026-08-17, product line completed. Smart Files (search and rooms, file record, shared read-only, honest empty) and Asset Management (inventory honest-empty, fixture asset record) added as first-class products. IA extended: Files and Assets are real staff paths, demo may preview Files search and shared read-only only, resident never sees Assets. Two flows added. Three traceability rows added and Asset Management empty reclassified from Later lens to Moves. Token set verified byte-identical to 30b; the count is 60 once the reserved evidence-accent pair is in.
