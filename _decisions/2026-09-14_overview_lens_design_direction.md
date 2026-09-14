---
decision_id: 2026-09-14_overview_lens_design_direction
date: 2026-09-14
owner: nick
status: active
related_canonical:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _inbox/2026-08-17_g18_shell_homes,
    _inbox/2026-08-17_bastrop_dashboard_layout_inventory,
    _inbox/2026-08-19_template_city_lens_build_sheet,
    _inbox/2026-08-18_g88_surface_inventory,
    _inbox/2026-09-14_COORD_bastrop_cutover_to_dashboards,
    _decisions/2026-08-17_dashboards_ui_then_one_feed,
  ]
artifact: https://claude.ai/code/artifact/3cf94cc7-4aa5-4846-9a60-bc51a1275180
---

# Decision

The v2 Overview lens is organised around one question, "what needs my attention across the
whole city today," in four regions: a filtered-entry-point tile row, a six-lane "Across
departments" roll-up, Public meetings, and Connections. Connections **promotes to the top of the
stack on a pack that reads no sources and demotes to the bottom when it reads**. The right rail
keeps the map and the address lookup; the atom-type `Sources` panel is replaced by "On the map."

v1's Overview is NOT the target. The design is drawn at three data states, and the empty state
is a first-class deliverable rather than an afterthought.

Approved by the operator in session 2026-09-14, in two passes: direction first, then two
amendments (keep the map, replace `Sources`) folded in and re-approved. Dispatched as G-120.
The Overview map component itself is PINNED as G-121 and deliberately not started.

## Context

v2 had accumulated technical correctness and compliance without a design pass. The question was
whether to reproduce v1's Overview or design a new one.

v1 cannot be the target, for three reasons that are each independently sufficient.

A third of v1's Overview is already killed by ruling: the four workspace launch cards died
because navigation lives in one place (`g18_shell_homes`, 30c).

v1's layout assumes **one city with ten years of data**. v2 must work for **city N on day one**,
which is the entire onboarding-machine thesis. A layout cloned from a full city reads as a
failure state on city two. The product already knows this: an `empty-city` pack exists and the
standing rule is to develop against `template-city` and regression-check every surface against
the empty pack, because on a city with zero records the tension mechanism is switched off and
the design is guaranteed to look flat.

The palette and type ramp are frozen and mechanically enforced (below), so a visual clone of v1
is not available even if it were wanted.

## What kind of design pass this is

Four mechanical gates bound it, per `_inbox/2026-08-18_g88_surface_inventory.md`:

| Gate | Rule |
|---|---|
| Colour | `shell.css` may declare no colour and no token. No `:root`, no hex outside comments, no `rgb()`/`rgba()`. Every colour is `var(--sc-*)`. |
| Kit | `web/sc-kit.css` is byte-identical across `smartcity-dashboards`, `smart-files` and `plan-review`. A repo that edits a token value has forked the system. |
| Type | The ramp is pinned by selector. 12px is an absolute floor. Uppercase only on mono. |
| Classes | No new CSS class without a rule; a test diffs every `class="..."` and runtime `classList` call against the two stylesheets. |

Read plainly: **layout, hierarchy, spacing and density inside a fixed palette and a fixed type
ramp.** Recolouring or re-typing is a different and larger decision, and a design that appears
to need a new colour is a product-line ruling across three repos, not a Dashboards change.

## The direction

| Element | Decision |
|---|---|
| Tiles | **Filtered entry points, not metrics.** Each names the lens and filter it opens and navigates there with that filter applied. Acceptance is the click, not the number. |
| Unread tiles | Keep the existing `.metric .v.word` "Not read" treatment. Never a zero. The code comment is already correct: a zero here would be a claim the city has not made. |
| Across departments | **Six lanes**, not four: Development services, Finance, Police, Fire and EMS, Fleet, Public works. v1's Live City Pulse covered four workspaces; v2 split Emergency into Police and Fire and EMS, and Operations into Fleet and Public works. |
| Connections | **Promotes on empty, demotes on populated.** The one structural move. On a zero-record pack it is the content, and it explains the quiet rather than leaving four blank tiles. |
| Right rail | Map and address lookup STAY on screen (operator explicit). |
| `Sources` panel | **Replaced by "On the map"** — located records, clickable. The panel currently prints `buildable-envelope`, `rrc-pipeline-fact`, `setback-rule` and similar to a city manager: engine vocabulary leaking through a product surface, which is a category error rather than merely a dead slot. |
| Honest-empty | Every empty state keeps its `.basis` line. Removing one to tidy a layout is substantive, not cosmetic. |
| Populated state | Draws Bastrop as it actually is, with lanes that do not read shown as not reading. An aspirational full board was considered and rejected: it is the same shape of claim as v1's 157% collection rate. |

## Amendments this frame makes to `_inbox/2026-08-17_g18_shell_homes.md`

That file remains the map. Five corrections come out of the Overview walk.

1. **The "Overview metric tiles" row is misclassified.** It reads as a metric strip. Their real
   function is navigation carrying filter state, proven by the v1 screenshots where two pages
   differ only by the filter that arrived with the click. Built as four numbers with no click
   target, the function disappears silently and nobody files a bug, because the tiles look right.
2. **"Across departments" covers six lenses, not four.** A four-lane build under-covers the v2
   structure by two departments, invisibly.
3. **Meeting agenda documents have no home.** Every meeting row carries an Agenda link. That is
   Files. The map stops at the calendar panel.
4. **Calendar Subscribe and Full Calendar are unallocated.** Both small, both immediately noticed
   if missing, because they are how staff actually use a calendar.
5. **"All Systems Operational" is unallocated.** It is a health claim. Either derive it from
   Connections or drop it. It has no home today.

Also recorded, from reading the live page rather than the map: the nav carries a five-state
badge vocabulary — **LIVE RECORDS / EMPTY / PREVIEW / NOT READ / NOT BUILT** — that postdates
`g18_shell_homes` and is a stronger disposition language than the one that file uses. The
August dispositions (Mounted / Empty / Not built / Island / Killed) and these five should be
reconciled rather than left as two vocabularies.

## Reversal criteria

Reverse the Connections promote/demote move if, on a real sparse city, staff read the promoted
panel as clutter rather than as guidance — the test is whether anyone connects a source from it.

Reverse the "On the map" replacement if located records turn out to be unavailable on packs
that need them, in which case the slot returns to empty rather than to atom types.

Reverse the six-lane roll-up only if the lens structure changes again; it is derived from the
lens roster, not chosen.

The locked-kit constraint is not reversible here. Changing it is a product-line decision across
three repos.

## Structural commitment check

**Sell reasoning, not data.** Every panel carries its `.basis` line naming its source or its
absence. The design refuses to render a count without one.

**Confidence is earned.** No metric shows a zero for an unread source. An unread tile says so.

**Cost per jurisdiction.** The empty state is a first-class deliverable and the regression check
is against the empty pack, which is what makes city N cheap rather than a bespoke design pass.

**Dual interface.** Not engaged by this decision; the Overview is a UI surface over mounts that
are already MCP-reachable.

**Tenant sovereignty.** Not engaged. No data path changes here.
