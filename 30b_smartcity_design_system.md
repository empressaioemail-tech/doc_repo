---
id: 30b_smartcity_design_system
title: SmartCity design system — token and component law (INTERNAL)
status: active
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    2026-08-17_claude_design_prompt_1_design_system,
    2026-08-17_claude_design_prompt_2_platform,
    2026-08-17_bastrop_dashboard_layout_inventory,
    _smartcity_masters/31_smartcity_dashboards,
    _smartcity_masters/32_smartcity_asset_management,
    _smartcity_masters/33a_smartcity_plan_review,
    _smartcity_masters/34_smartcity_smart_files_and_foundation,
    48_cortex_reporting_plan_review_spec,
  ]
---

# SmartCity design system: token and component law

> **Purpose.** The visual law for every SmartCity surface. Four first-class products on one system: **Dashboards**, **Smart Files**, **Plan Review**, and **Asset Management**. One token set, one shell, four products. None of the four is a later mount or a phase two; each is designed against this law and none may introduce a token or component outside it.

This is an INTERNAL spec. It carries design law, not approved claims about city state. It is deliberately not a category master under `_smartcity_masters/`, which are approved-claims registers.

Rendered reference build (foundations, kitchen sink, canonical staff shell): https://claude.ai/code/artifact/33da8c37-a435-4c59-b9a1-856deda16a33

Authored 2026-08-17 in the design-system session that ran against `_inbox/2026-08-17_claude_design_prompt_1_design_system.md`. The platform session (prompt 2) executes against this file and may not invent a token or a component outside it.

## Positioning

Internal one-liner: quiet surfaces, loud exceptions, honest absence.

Longer form: SmartCity looks like the city's book of record with an operator's console around it. The metaphor is a register, not a card deck. Three consequences drive everything below. Color is budgeted, so a satisfied thing is gray and an unresolved thing is the loudest object on screen. Structure comes from hairline rules and mono identifiers rather than floating cards. Absence is a designed state, so a city that has not connected its ledger sees a sentence explaining why, never a zero.

## Five laws

1. **One second to orient.** Every screen answers where am I, what needs me, and what is missing, in that order, before any scrolling.
2. **One of everything.** One type ramp, one 4px spacing scale, one radius family, one shadow ladder, one accent. A second sans, a second accent, or a nested product header is a defect.
3. **Quiet on satisfied, loud on unresolved.** Pass is gray. Uncertain and Unchecked carry the strongest treatment on the page.
4. **Records, not feeds.** A connected system becomes rows with provenance. Every value that came from somewhere carries source and last-read.
5. **Absence is stated, never simulated.** No zero budget, no payment-complete theater, no placeholder count.

# 1. Token block

Prefix `--sc-`. Anything not on this list does not exist in the system. A screen needing a value not here raises a system gap; it does not write a local override. No component declares a color outside a token.

## 1.1 Color: surface, line, text, accent

| Token | Role | Light | Dark |
|---|---|---|---|
| `--sc-canvas` | Page ground behind all panels | `#EEF1F4` | `#0C1116` |
| `--sc-surface` | Panels, tables, nav, header | `#FFFFFF` | `#12191F` |
| `--sc-surface-2` | Table head, toolbars, hover | `#F6F8FA` | `#18212A` |
| `--sc-surface-3` | Pressed, inset, sunken wells | `#E9EEF2` | `#1E2833` |
| `--sc-line-faint` | Row dividers inside a panel | `#E4E9EE` | `#1D262F` |
| `--sc-line` | Panel and control borders | `#D2DAE1` | `#29343F` |
| `--sc-line-strong` | Hover borders, dashed placeholders | `#AEBAC5` | `#3B4854` |
| `--sc-ink` | Primary text, values, subjects | `#101820` | `#E6EDF3` |
| `--sc-ink-2` | Secondary text, table cells | `#46586A` | `#A2B2C0` |
| `--sc-ink-3` | Labels, metadata, satisfied rows | `#6C7E8E` | `#7B8B99` |
| `--sc-accent` | Verdigris. Interactive and selected only | `#0B6A7B` | `#4EAFC2` |
| `--sc-accent-hi` | Accent hover | `#095563` | `#6CC6D7` |
| `--sc-accent-wash` | Selected row, active chip | `#DFEFF2` | `rgba(78,175,194,.13)` |
| `--sc-on-accent` | Text on accent fill | `#FFFFFF` | `#04222A` |
| `--sc-focus` | Focus ring | `#0B6A7B` | `#7FCFDF` |
| `--sc-map-ground` | Map canvas ground | `#E7EBEE` | `#141C23` |
| `--sc-doc-ground` | Document canvas ground | `#DDE3E8` | `#182027` |

Neutrals carry a slate bias toward the accent hue, roughly 207 degrees, so the grays read as chosen rather than inherited. Verdigris is the teal souvenir of the old app pulled off LED cyan `#78aec2` toward weathered copper. It is the only non-semantic color in the system and it means exactly one thing: you can act on this, or this is where you are.

## 1.2 Color: semantic set

Six meanings, no more. Each carries a matching `-wash` for chip and row-rail backgrounds.

| Token | Means | Carried by | Light | Dark |
|---|---|---|---|---|
| `--sc-ok` | Satisfied, approved, current | Pill, rail. Never a fill. | `#2F7A52` | `#55BE86` |
| `--sc-info` | In progress, routed, scheduled | Pill, row rail | `#2B5FC7` | `#6DA3F5` |
| `--sc-warn` | Uncertain, stale, due, demo fixture | Pill, rail, matrix, environment badge | `#9A5B08` | `#DDA14C` |
| `--sc-crit` | Fails code, overdue, denied | Pill, rail, matrix, destructive control | `#AF2A22` | `#EF7B72` |
| `--sc-restricted` | Permission boundary, not yours | Audience indicator, restricted state | `#5347B5` | `#A092EE` |
| `--sc-quiet` | Draft, unchecked, not applicable | Pill, hatch fill | `#6C7E8E` | `#7B8B99` |

Wash values, light: `#E3F0E8`, `#E5ECFB`, `#FBEEDA`, `#FBE6E4`, `#EBE9F8`, `#E9EEF2`. Dark: the same six hues at 13 to 14 percent alpha.

## 1.2a Reserved: the atom accent

| Token | Means | Light | Dark |
|---|---|---|---|
| `--sc-atom` | Openable recorded evidence, and nothing else | `#177F78` | `#4CC9C0` |
| `--sc-atom-wash` | Atom chip ground | `#DFF2F0` | `rgba(76,201,192,.14)` |

`#4CC9C0` is the value SmartSite reserves for atoms. That reservation ports here unchanged as the dark-theme value, which is where it is used, and the reservation is on the **meaning**, not merely the hex: `--sc-atom` marks a thing you can open and read the record of. It is not chrome, not emphasis, not a link color, and not a second accent.

**Light-theme value is law.** The light value is `#177F78` and the dark value is `#4CC9C0`. The reservation is on the **meaning**, openable recorded evidence, not on the literal dark hex in both themes. `#4CC9C0` on white measures roughly 2.0:1 and fails contrast for anything that has to be read; `#177F78` is the contrast-legal sibling at roughly 5.2:1 and is the same hue family. This is settled, not an open question.

**Collision rule is law.** `--sc-atom` dark `#4CC9C0` sits near `--sc-accent` dark `#4EAFC2`. They separate by **form**, not hue: the accent never appears as a chip, and the evidence chip always carries a compact label and a 10px mono record identifier. If that separation proves too fine in build, **move `--sc-accent` dark, never `--sc-atom`.** Do not invent a third teal.

Rules. Numbers, emphasis, web links, and unverified sources never wear the atom accent. A web or unverified source is visually distinct and labeled unverified; it is never an atom chip. Amber remains the environment badge only. Teal as glow, teal as hero, and teal as everything remain forbidden.

**Color law.** Status color lives only in status carriers: the pill, the 3px row rail, the matrix row, an icon. Never a card background, never a border on a whole panel, never the text of a subject line. Two colored things per region maximum. Status is never color alone; a pill is glyph plus word plus color, and a row rail always pairs with a pill in the same row. No gradients on surfaces, no glow, no backdrop-filter glass, no colored shadows. The map is the one place saturation may concentrate, and on a map screen no other element gets a colored fill.

## 1.3 Type

Two faces, two jobs.

| Token | Face | Job |
|---|---|---|
| `--sc-font-ui` | Inter (system-ui fallback stack) | All interface language: nav, labels, buttons, prose, subject lines |
| `--sc-font-data` | IBM Plex Mono | Identifiers only, and identifiers always: case numbers, parcel IDs, code sections, timestamps, money, counts, mono section labels |

The rule that keeps it honest: if a person would read it aloud as a number or a code it is mono; if they would read it aloud as a sentence it is Inter. No third face. No display face. This is the resolution of the old app's IBM Plex Sans against Inter split: delete the second sans, give the survivor a real job.

Ramp, eight steps.

| Step | Size / line | Weight | Tracking | Use |
|---|---|---|---|---|
| display | 26 / 32 | 650 | -0.022em | Lens titles. Rare. |
| title | 19 / 26 | 620 | -0.015em | Page header |
| head | 15 / 22 | 620 | -0.008em | Panel and section |
| body | 14 / 20 | 400 | 0 | Default interface text |
| body-em | 14 / 20 | 600 | 0 | Subject lines |
| label | 12 / 16 | 500 | 0.06em, uppercase, mono | Field and section labels |
| caption | 12 / 16 | 400 | 0 | Metadata |
| data | 13 / 18 | 400 | mono, tabular-nums | Identifiers, dates, money |

**Type law.** 12px is the floor and nothing renders below it, with one named exception: the **evidence chip label** may set at 10px, because the chip has to read as a citation mark rather than a button and SmartSite sets it near 9.5px. The exception is the chip label only. The body of BRIEF and FULL, and every other string in the system, stays at the 12px floor. Nothing else inherits this. Uppercase only for mono labels, always with 0.06em to 0.16em tracking, never on a sentence. Every column of digits gets `font-variant-numeric: tabular-nums`. Reading prose caps at 68 characters. Table cells do not wrap by default; they truncate and reveal in the row drawer.

## 1.4 Spacing

4px base.

| Token | px | Used for |
|---|---|---|
| `--sc-1` | 4 | Icon to glyph, pill internals |
| `--sc-2` | 8 | Control gaps, chip rows |
| `--sc-3` | 12 | Cell padding, panel head, region gap |
| `--sc-4` | 16 | Panel body, compact gutter |
| `--sc-5` | 20 | Stacked panel groups |
| `--sc-6` | 24 | Comfortable gutter, metric gap |
| `--sc-7` | 32 | Section separation |
| `--sc-8` | 40 | Page margin, empty-state padding |
| `--sc-9` | 48 | Major break |
| `--sc-10` | 64 | Major break |

## 1.5 Radius

| Token | Value | Used for |
|---|---|---|
| `--sc-r-control` | 4px | Buttons, inputs, chips, nav items |
| `--sc-r` | 6px | Panels, regions, tables, toasts |
| `--sc-r-lg` | 8px | Drawer and dialog only |
| `--sc-r-full` | 999px | Status pill, avatar, count badge |

## 1.6 Elevation

| Token | Value | Used for |
|---|---|---|
| `--sc-e1` | `0 1px 2px` at 7 percent light, 40 percent dark | Sticky header, toolbar lift |
| `--sc-e2` | `0 6px 16px -4px` at 14 percent light, `0 8px 20px -6px` at 55 percent dark | Popover, dropdown, toast |
| `--sc-e3` | `0 20px 48px -12px` at 26 percent light, `0 24px 56px -16px` at 70 percent dark | Dialog, drawer |

**The elevation ruling.** In light, elevation is a shadow. In dark, elevation is a surface step: a panel lifts by moving `surface` to `surface-2` to `surface-3`, and shadow only deepens the ground beneath a true overlay. A resting panel has no shadow in either theme and is defined by its 1px border. This is what kills the floating-glass look at the root.

## 1.7 Motion

| Token | Value | Used for |
|---|---|---|
| `--sc-dur-1` | 100ms | Hover, press, chip toggle, focus ring |
| `--sc-dur-2` | 140ms | Popover, dropdown, tooltip, toast in |
| `--sc-dur-3` | 180ms | Drawer and dialog only. Nothing is slower. |
| `--sc-ease` | `cubic-bezier(.2,.6,.35,1)` | All of the above |

**Motion law.** Data never animates: no counting-up numbers, no row-enter stagger, no chart draw-in, no LED pulse, no shimmer. Loading is a static skeleton with real row geometry; spinners are 16px and inline only; anything over two seconds gets a determinate bar naming what it is doing. `prefers-reduced-motion` zeroes every duration.

### Named exception: the Compass shared-element transition

Compass present, dismiss, and maximize are a **shared-element transition** and are the single named exception to the 180ms cap. They read roughly 350 to 500ms because the duration is a function of a spring, not a fixed ease.

| Token | Value | Used for |
|---|---|---|
| `--sc-spring` | stiffness 320, damping 32, mass 0.9 | Compass present, dismiss, maximize. Nothing else. |

Settle time for those constants is about 400ms, which is why the transition reads in the stated band. **Nothing else inherits this.** Drawers, dialogs, row enters, popovers and toasts stay on `--sc-dur-1` through `--sc-dur-3`, and data still never animates. `prefers-reduced-motion` gives an instant present and dismiss with no spring and no scale.

The exception exists because the sheet is not an element appearing on top of the page; it is the source control changing size. Motion is what carries that claim, and 180ms is too short to read as continuous geometry. Full specification lives in `30c_smartcity_platform_ia.md`.

## 1.8 Layout and density

| Token | Value |
|---|---|
| `--sc-topbar` | 52px |
| `--sc-nav` | 248px expanded |
| `--sc-nav-rail` | 56px collapsed |
| `--sc-rail` | 380px context rail |
| `--sc-row` | 44px comfortable |
| `--sc-row-compact` | 32px compact |

Work surfaces cap at 1600px. Reading surfaces (a finding, a determination, a citizen page) cap at 720px. Gutter is 24px comfortable, 16px compact. Density is a user setting stored per surface, defaulting to compact on any queue; it changes row height and gutter only, never type ramp, color, or radius. On touch, compact is disabled and every target is at least 44px. Below 900px the sidebar becomes a bottom-anchored sheet, the context rail moves below the primary region, and density locks to comfortable.

## 1.9 Theme structure

Bare `:root` carries the complete light palette. `@media (prefers-color-scheme: dark)` guarded by `:root:not([data-theme="light"])` redefines the tokens. `:root[data-theme="dark"]` redefines them again so an explicit choice wins in both directions. `.sc-light` and `.sc-dark` force a subtree, which is how a light citizen surface renders inside a dark staff session. Dark is the staff default. Light is production quality, not a courtesy.

# 2. Anti-patterns A1 to A10

Each is present in the current Bastrop staff dashboard per `_inbox/2026-08-17_bastrop_dashboard_layout_inventory.md`. Numbered so a pull request that reintroduces one can be rejected by number.

1. **A1. Hero PNG and greeting.** Refuse: page header carrying city, lens, and four clickable exception numbers, with the queue starting immediately below.
2. **A2. LED pulse and glow.** Refuse: static status pill with glyph and word; panels defined by a 1px border; shadow only under a true overlay; nothing on a resting screen moves.
3. **A3. Nested product header.** Refuse: one shell, one nav, one accent. Plan Review is a nav item and a set of regions inside it, never a second chrome.
4. **A4. Iframe as a page.** Refuse: native regions inside our page header. A surface that cannot render in our frame with our header is not ready to ship.
5. **A5. 9px type.** Refuse: 12px floor, enforced. If content will not fit at 12px, cut content; do not shrink type.
6. **A6. Four accents on one tile.** Refuse: two colored things per region maximum, color only in status carriers.
7. **A7. Vendor-feed wallpaper.** Refuse: connected systems become rows with provenance and a real last-read time; the footer states how many sources actually read.
8. **A8. Zero theater.** Refuse: honest-empty with a basis block and a real-world alternative. Never render a zero balance, a zero record count, or a payment-complete screen as a stand-in for not connected.
9. **A9. Metrics above the work.** Refuse: metric strip inside the page header, plain numbers, no cards, maximum four, each filtering the queue directly below it.
10. **A10. Two sans faces.** Refuse: one sans for language, one mono for identifiers, per the read-it-aloud rule.

# 3. Component inventory

Five components are load-bearing. They carry a ruling the rest of the system depends on, and changing one reopens a settled decision rather than adjusting a style.

## 3.1 Load-bearing

**Applicability matrix, inverted, grouped by corpus.** Rows are grouped under a corpus header that states the full canonical title once ("2018 International Building Code", "Template Unified Development Code"); rows then carry section identifiers only. This is how the matrix stays dense without ever printing an abbreviation alone, and it is the reason the corpus grouping is structural rather than cosmetic.

Four values: Pass, Fail, Uncertain, Unchecked. Pass is the quietest row on the page: gray text, no rail, no fill. Fail gets the critical rail and wash. Uncertain gets the warn rail and wash. Unchecked gets a diagonal hatch, the plat-drawing convention for nobody has been here yet. The inversion is the ruling: a plans examiner is paid to find unresolved rows, not to admire passing ones, and unreviewed is more dangerous than failed so it must never read as clean. Green-for-good would spend the loudest treatment on the rows needing no one.

**Provenance chip.** Anatomy: source name, separator, last-read time. States: current, and stale (warn border, warn text, warn wash). Every value originating outside the product carries one in its panel header. Staleness is a chip state, not a toast. No vendor logo, product name, or vendor color anywhere in the interface; the source is named in text, in our type, in our chip. Companion is the basis line: confidence always carries its state (baseline, provenance-backed, or earned) plus source count, timestamp, and a link into reasoning. A bare confidence number with no basis is prohibited by the component's shape.

**Environment badge.** Sits immediately after the city name in the top bar. Three states: demo (warn, dashed), live (neutral, solid), staging (neutral, dashed). It is the only place amber appears in the chrome. The ruling it enforces: demo or template-city, live Bastrop, and next city must never render alike, because three identities that look identical is how a demo fixture gets quoted in a council meeting as a real number.

**Not-built nav state.** A department on the roster but not yet wired renders dim, non-interactive, with a small outlined badge reading "Not built". It keeps the IA honest about coverage instead of hiding the roster behind an overflow menu or implying a lens exists when it does not.

**Code citation, no body slot.** It has no slot for body copy. Licensed model-code text cannot leak into a screenshot, an export, or a PDF because the component that would carry it does not exist.

Two render forms, and the form is chosen by the source, not by available space.

*Licensed model code.* The chip renders the **full canonical title** and the section, composed inside one chip across two parts: corpus line ("2018 International Building Code") above identifier line ("Section 802.3"). An abbreviation alone is prohibited by the ICC Code Connect terms in `_smartcity_masters/33a_smartcity_plan_review.md`, so the compact form `IBC 802.3` does not exist in this system, at any density, including inside the applicability matrix. Section identifier and heading may display alongside our analysis; the full section body may not. The **2018 International Building Code** is the only licensed corpus this system renders. The proof of concept does not extend to customer-facing applications until ICC executes the SaaS agreement, so every rendered artifact carrying a licensed citation is marked INTERNAL and is not published outside the building.

*Local ordinance.* A city's own adopted code is not subject to the constraint and is the safe demo material. The chip renders the local short form, for example "Template UDC Section 5.3.2", and may link to full quoted text.

Design consequence for every mock and screenshot: lead with local UDC. Use the 2018 International Building Code only where a model code is genuinely required, always in full canonical title. Never render a licensed section body.

## 3.2 Shell and navigation

App shell: top bar 52px, left sidebar 248px collapsing to a 56px rail, page header 68 to 96px, primary region plus 380px context rail. Sidebar over top nav is settled; the roster has to hold six or more department lenses plus Plan Review plus later mounts, and a top nav absorbs that with an overflow menu.

Top bar carries exactly four things: which city, which environment, search, who you are. It is not navigation. No product name in the chrome other than the city.

Lens switcher: sits at the top of the sidebar, labelled "Viewing as". Lens is a view; permission is what you can actually see. The page header carries the audience pill, and previewing a lens you do not own adds a read-only pill and disables every write control.

Nav item states: rest, hover, active (accent wash plus 2px left rail), count badge, alarm count, not-built.

Nav footer: connection reality as text, for example "4 of 6 sources read" with a timestamp. Never a green dot beside a hardcoded integration count.

Page header: breadcrumb, title, audience pill, actions, metric strip. The metric strip is the only place metrics may appear on a work surface: plain numbers, no cards, no borders, no fills, no sparklines by default, maximum four, each filtering the queue below.

## 3.3 Data

Table and queue. Fixed column order across every queue in the product: 3px severity rail, mono identifier, subject in ink, status pill, people in secondary, dates in mono, money right-aligned and tabular. Sticky header row. Filter chips show applied state with a removal affordance. Row count states filtered of total. Row click opens the drawer and never navigates away. No zebra striping, no vertical grid lines, no per-cell background color, no chart above the queue.

Filter bar: chips with on and off states, applied count, reset.

Density toggle: comfortable and compact, in the table toolbar, persisted per user per surface.

Finding row, the unit of a comment letter. Anatomy: severity rail, finding ID in mono, one-sentence statement in plain language, citation chip, sheet reference, status pill, basis line, adjudication controls. Collapsed by default; the reasoning drawer opens from the basis line. Accept and Override sit at equal visual weight, and Override opens a required reason field. Reviewer judgment governs; the reason is the record.

Status pill: glyph plus word plus color, across the six semantic meanings.

## 3.4 States

Four distinct absence states with four distinct openings.

Empty: nothing yet but the pipe works. Statement plus a primary action.

Honest-empty: absence with a basis. Carries a mandatory basis block naming what it would read from, how much is connected, and who to ask. This block is the component's reason to exist.

Restricted: the record exists and is not yours. Names your current access and who grants more.

Error: what broke, what still works, when it last succeeded, and a request identifier. No illustrations, no mascots, no apologies.

## 3.5 Overlays and feedback

Drawer: right, 480px, `--sc-e3`, for inspecting a record without losing the queue.

Dialog: centered, 480 to 640px, only for a decision that must be made now and cannot be undone. If it can be undone, use a toast with an undo action. No stacked modals.

Toast: past tense, names the outcome, and states what did not happen yet where relevant. No toast for a routine save the UI already shows.

Tabs: switch content within a surface, never change which record you are on.

## 3.6 Regions

Map region: bar, canvas, footer, inside our border and our page header. Selection detail renders in the region footer or the context rail, never a floating popup covering the map. Basemap desaturated in both themes; data layers carry the only saturation on the screen. One map stack in the product.

Document region: bar with sheet navigation and zoom, canvas, footer stating sheet position and findings on that sheet. Never an iframe carrying its own chrome.

Compass, the assistant. A **source control in the top bar** that presents as a **shared-element sheet**, not a rail state, not a full page, not a floating bubble, and not a route. Mandatory always-visible scope line naming city and lens. Every factual answer carries record links and citation chips built from the same components as the rest of the product; if it cannot cite, it says so in prose with no chips at all. No avatar, no mascot, no AI badge, no typing theater beyond a 16px inline indicator. One instance for the signed-in user across all four products; switching city or lens re-scopes rather than spawning a second sheet. Chrome and states are specified in `30c_smartcity_platform_ia.md`.

Atom chip: a compact, reserved-accent chip marking **openable recorded evidence**. Tapping fetches and opens a record in place. Carries a mono DID and, once open, source, never-bare confidence, as-of, and access policy.

**Provenance chip and atom chip are cousins and must not be merged.** A provenance chip states *where a value came from and when it was read*; it is not openable and makes no claim beyond attribution. An atom chip asserts *there is a record here and you can open it*. Collapsing them into one component produces a chip that either lies about being openable or hides that a record exists. They stay two components with two jobs.

## 3.7 Controls

Buttons: primary, default, ghost, danger, in three sizes. One primary per region naming the outcome, never "Submit". Destructive is outlined danger, never a filled red button in a queue. No icon-only button without a tooltip and an `aria-label`.

Inputs: label, control, hint, error state with `aria-invalid`. Identifier fields set in mono.

## 3.8 Audience

Staff and citizen share tokens and components. Only four things differ: theme default (dark against light), base type (14/20 against 16/24), density (compact available against comfortable only), and chrome (sidebar plus rail against top bar and a single 720px column). Targets are 44px everywhere on citizen.

Status vocabulary map, internal to public, is a design artifact and not a backend detail. It is what stops staff work leaking onto a public page.

| Internal (staff) | Public (citizen) | Why |
|---|---|---|
| Routing, DS review 2 of 4 | In review | Internal routing is not the resident's business and changes hourly. |
| Assigned to J. Ruiz | In review | Never publish a staff member's workload to the public. |
| Fails code, 2018 International Building Code Section 1004.5 | Revisions requested | The finding reaches the applicant in the comment letter, not as a public label. |
| Awaiting applicant | Waiting on you | The one status a resident must act on. Say it directly. |
| Ready to issue, fees outstanding | Approved, fees due | True, actionable, no internal step name. |
| Approved with conditions | Approved with conditions | Identical. Conditions are the resident's obligation. |

No staff names, no work orders, no internal case routing, no live operational feed on any unauthenticated view. Citizen is a lens, not a separate product with its own name, tile grid, or hero cityscape.


## 3.9 Class inventory

Every class the rendered system introduces, split by whether engineering copies it. **Product classes** are the kit. **Documentation classes** style the spec pages only and are not copied into product repos.

Product classes:

```
sc  sc-light  sc-dark
shell  shell-top  shell-body  shell-nav  shell-main  shell-regions  colstack
seal  brandcity  env  avatar  lensswitch  navgroup  navitem  nav-foot
pagehead  crumb  metrics  metric  tabs  panel  panel-head  panel-body
dt  filterbar  chip  srcreg  state  toast  ph
btn  btn-primary  btn-ghost  btn-danger  btn-sm  btn-icon  inp  field  hint  searchwrap  kbd  seg
pill  p-ok  p-info  p-warn  p-crit  p-restricted  p-quiet
prov  cite  cite.model  atomchip  basisline  meter
mx  mxgroup  mxrow  mx-pass  mx-fail  mx-unc  mx-unchecked  finding
region  region-bar  region-canvas  region-foot  gridlines  parcel  sheet
cp-source  cp-sheet  cp-inner  cp-head  cp-grab  cp-scope  cp-thread  cp-turn  cp-u  cp-a  cp-note
cp-card  cp-card-h  cp-card-b  cp-card-f  cp-claim  cp-kv  cp-honest  cp-pop  cp-composer  cp-scrim  cp-recede
p4bar  cz  cz-top  cz-nav  cz-body  cz-card  phone  compact
```

Documentation-only classes, do not copy:

```
doc  index  topbar  plate  plate-cap  plate-body  tbl  rule-list  callout  eyebrow  dd  grid2  grid3  iamap  iacol  tnode  flowsteps  fstep  sw  mk  scroll  stack  row  footnote
```

Two classes are newer than the rest and need their job stated:

| Class | Job |
|---|---|
| `.atomchip` | The evidence chip. Compact, reserved-accent, carries a 10px mono record identifier. Marks openable recorded evidence and fetches on tap. Variants: `.dead` for an unservable record, `.web` for an unverified source that must never wear the reserved accent. |
| `.p4bar` | Determinate progress, used by Bring files. Composed entirely from existing tokens: `--sc-surface-3` track, `--sc-accent` fill, `--sc-r-full` radius. No new color, radius, or duration. |

# 4. Kit package

The system ships to product repos as **one file**: the `--sc-` token block from section 1, byte-identical, plus the component classes it drives. One file, no build step, no package to version, no second source of truth. A repo that needs a value not in it raises a system gap here rather than writing a local override.

**Copy this into product repos.** The four consumers, all on the same file:

| Repo | Product |
|---|---|
| `empressaioemail-tech/smartcity-dashboards` | Dashboards |
| `empressaioemail-tech/smart-files` | Smart Files |
| `empressaioemail-tech/plan-review` | Plan Review |
| Future Asset Management repo, not yet created | Asset Management |

Rules for the copy. The token block is byte-identical across all four; a repo that edits a token value has forked the system and is a defect. Component classes may be extended in a repo only by composing existing ones, never by declaring a new color, radius, duration, or type step. The theme structure in section 1.9 travels with the block unchanged, including `.sc-light` and `.sc-dark` for forcing a subtree.

This session does not perform the copy and does not open those repos. Distribution is a separate, named piece of work.


## 4.1 Kit extract, the copy payload

This is what engineering pastes. It is byte-identical to the token blocks in `30b_smartcity_design_system.html`, extracted from that file rather than retyped. Paste this, then the product class list from section 3.9.

```css
:root, .sc-light {
  --sc-canvas:#EEF1F4; --sc-surface:#FFFFFF; --sc-surface-2:#F6F8FA; --sc-surface-3:#E9EEF2;
  --sc-line-faint:#E4E9EE; --sc-line:#D2DAE1; --sc-line-strong:#AEBAC5;
  --sc-ink:#101820; --sc-ink-2:#46586A; --sc-ink-3:#6C7E8E;
  --sc-accent:#0B6A7B; --sc-accent-hi:#095563; --sc-accent-wash:#DFEFF2; --sc-on-accent:#FFFFFF;
  --sc-focus:#0B6A7B;
  --sc-ok:#2F7A52;         --sc-ok-wash:#E3F0E8;
  --sc-info:#2B5FC7;       --sc-info-wash:#E5ECFB;
  --sc-warn:#9A5B08;       --sc-warn-wash:#FBEEDA;
  --sc-crit:#AF2A22;       --sc-crit-wash:#FBE6E4;
  --sc-restricted:#5347B5; --sc-restricted-wash:#EBE9F8;
  --sc-quiet:#6C7E8E;      --sc-quiet-wash:#E9EEF2;
  --sc-atom:#177F78;        --sc-atom-wash:#DFF2F0;
  --sc-e1:0 1px 2px rgba(16,24,32,.07);
  --sc-e2:0 6px 16px -4px rgba(16,24,32,.14);
  --sc-e3:0 20px 48px -12px rgba(16,24,32,.26);
  --sc-map-ground:#E7EBEE; --sc-doc-ground:#DDE3E8;
  color-scheme:light;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --sc-canvas:#0C1116; --sc-surface:#12191F; --sc-surface-2:#18212A; --sc-surface-3:#1E2833;
    --sc-line-faint:#1D262F; --sc-line:#29343F; --sc-line-strong:#3B4854;
    --sc-ink:#E6EDF3; --sc-ink-2:#A2B2C0; --sc-ink-3:#7B8B99;
    --sc-accent:#4EAFC2; --sc-accent-hi:#6CC6D7; --sc-accent-wash:rgba(78,175,194,.13); --sc-on-accent:#04222A;
    --sc-focus:#7FCFDF;
    --sc-ok:#55BE86;         --sc-ok-wash:rgba(85,190,134,.13);
    --sc-info:#6DA3F5;       --sc-info-wash:rgba(109,163,245,.14);
    --sc-warn:#DDA14C;       --sc-warn-wash:rgba(221,161,76,.14);
    --sc-crit:#EF7B72;       --sc-crit-wash:rgba(239,123,114,.14);
    --sc-restricted:#A092EE; --sc-restricted-wash:rgba(160,146,238,.14);
    --sc-quiet:#7B8B99;      --sc-quiet-wash:rgba(123,139,153,.14);
    --sc-atom:#4CC9C0;        --sc-atom-wash:rgba(76,201,192,.14);
    --sc-e1:0 1px 2px rgba(0,0,0,.40);
    --sc-e2:0 8px 20px -6px rgba(0,0,0,.55);
    --sc-e3:0 24px 56px -16px rgba(0,0,0,.70);
    --sc-map-ground:#141C23; --sc-doc-ground:#182027;
    color-scheme:dark;
  }
}
:root[data-theme="dark"], .sc-dark {
  --sc-canvas:#0C1116; --sc-surface:#12191F; --sc-surface-2:#18212A; --sc-surface-3:#1E2833;
  --sc-line-faint:#1D262F; --sc-line:#29343F; --sc-line-strong:#3B4854;
  --sc-ink:#E6EDF3; --sc-ink-2:#A2B2C0; --sc-ink-3:#7B8B99;
  --sc-accent:#4EAFC2; --sc-accent-hi:#6CC6D7; --sc-accent-wash:rgba(78,175,194,.13); --sc-on-accent:#04222A;
  --sc-focus:#7FCFDF;
  --sc-ok:#55BE86;         --sc-ok-wash:rgba(85,190,134,.13);
  --sc-info:#6DA3F5;       --sc-info-wash:rgba(109,163,245,.14);
  --sc-warn:#DDA14C;       --sc-warn-wash:rgba(221,161,76,.14);
  --sc-crit:#EF7B72;       --sc-crit-wash:rgba(239,123,114,.14);
  --sc-restricted:#A092EE; --sc-restricted-wash:rgba(160,146,238,.14);
  --sc-quiet:#7B8B99;      --sc-quiet-wash:rgba(123,139,153,.14);
  --sc-atom:#4CC9C0;        --sc-atom-wash:rgba(76,201,192,.14);
  --sc-e1:0 1px 2px rgba(0,0,0,.40);
  --sc-e2:0 8px 20px -6px rgba(0,0,0,.55);
  --sc-e3:0 24px 56px -16px rgba(0,0,0,.70);
  --sc-map-ground:#141C23; --sc-doc-ground:#182027;
  color-scheme:dark;
}

:root{
  --sc-font-ui: "Inter", "Inter Variable", ui-sans-serif, system-ui, "Segoe UI Variable Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --sc-font-data: "IBM Plex Mono", ui-monospace, "SF Mono", "Cascadia Mono", "Segoe UI Mono", Consolas, monospace;
  --sc-1:4px; --sc-2:8px; --sc-3:12px; --sc-4:16px; --sc-5:20px;
  --sc-6:24px; --sc-7:32px; --sc-8:40px; --sc-9:48px; --sc-10:64px;
  --sc-r-control:4px; --sc-r:6px; --sc-r-lg:8px; --sc-r-full:999px;
  --sc-dur-1:100ms; --sc-dur-2:140ms; --sc-dur-3:180ms;
  --sc-ease:cubic-bezier(.2,.6,.35,1);
  --sc-topbar:52px; --sc-nav:248px; --sc-nav-rail:56px; --sc-rail:380px;
  --sc-row:44px; --sc-row-compact:32px;
}
```

Do not copy this into `smartcity-dashboards`, `smart-files`, or `plan-review` from here. Distribution is its own named piece of work and this session does not perform it.

**Housing.** Canonical housing will be `_smartcity_masters/36_smartcity_design_system` and `_smartcity_masters/37_smartcity_platform_ia`, INTERNAL ONLY, not claims registers. The files are not moved by this session; the planner moves them after it stops.

# 5. Settled and out of scope

Do not reopen: register over cards, sidebar over top nav, quiet Pass, the 12px floor, the Inter plus IBM Plex Mono rule, the environment badge, charts.

In scope for the platform session (prompt 2): comment-letter layout, alongside the IA map, shell application, surface layouts, flow specs, old-to-new traceability, and the out-of-scope list.

Still not in scope: chart language. Nothing has needed one, and inventing it before a real finance record exists is guessing. When it arrives it inherits the semantic set and the tabular-figures rule.

**Review test for any screen.** A city manager can name the city, the lens, and the exception in one second. A plans examiner can find every uncertain and unchecked section without reading. A resident sees no staff name and no button that resolves to nothing. Every number on the page can say where it came from and when it was read.

## Revision history

- 2026-08-17, authored. Design-system session against prompt 1. Tokens, ten anti-patterns, and the component inventory ratified; five load-bearing components named. Platform session cleared to start against this file.
