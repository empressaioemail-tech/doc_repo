# MISSION — G-128: the map dock, three states, one component

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

## SEQUENCING — read this before you branch

**G-120 and G-123 are in flight and touch the same layout files as this row.** G-120 rebuilds the
Overview lens including its right rail. G-123 rebuilds the Development services lens including its
tab strip. This row changes both.

**Start only after both have merged**, and rebase on current `origin/main` before your first
commit. Three concurrent branches editing one lens shell produces a merge nobody can review, and
this operation has already lost work to exactly that this week.

If either is unmerged when you pick this up, say so and stop rather than working around it.

## Snapshot first

Repo: `smartcity-dashboards` (`empressaioemail-tech/smartcity-dashboards`). The local checkout
at `/p/smartcity-dashboards` was **43 commits behind** `origin/main` on 2026-09-14. Fetch and
work from current `origin/main`. Declare repository, branch and commit SHA in your first output
line. Work on your own branch in your own worktree.

Design: `https://claude.ai/code/artifact/9a33103c-9765-4a50-ad7f-461fa6f17f43`
Source and reasoning: `_design/smartcity-map-dock/` — read the README first.

## What this row does

The city map becomes a **persistent right rail** on Development services, matching Overview. The
lens tabs sit between the left sidebar and the rail. The map is context you work beside, not a
destination.

**Consequence: Place stops being a tab.** It is the rail. Remove it from the Development services
tab strip. The parity design that treated Place as a tab (`_design/smartcity-place-tab/`) is
superseded and kept only as the record of the option not taken.

## The three dock states, and what redistributes

The dock control is already a three-setting affordance on the existing map container. What is new
is that **the components redistribute per state** rather than the map simply growing.

**1 · DOCK** (right rail, ~360px). Map on top at a fixed height. Property detail and records
stacked beneath it in the rail, in that order. This is the Overview pattern.

**2 · EXPAND.** Map takes the top and grows. The two components sit below it **side by side at
roughly two-thirds / one-third**: records take the width because they are a list, property detail
takes the narrow column because it is a stack of short facts.

**3 · FULL.** Map dominant. A **full-width permit row beneath it**, rendered with the same table
treatment as every other operational list in this product so it reads as records rather than as a
panel. The right column carries the one-click property detail. The layers sidebar appears.

## THE LAYERS RULE — the point of this row

**The layers panel exists in FULL ONLY.**

Fifty-two layers in a fixed panel cannot work at rail width. Today the panel is present at every
size: it crushes the map when expanded and collapses to an unreadable sliver when docked, with
clipped control text. That is the defect this row exists to fix.

Dock and Expand get a **Layers button** carrying the active count, opening a sheet. Only Full has
the room to group 52 layers by their seven categories.

Do not solve this by making the panel narrower or scrollable at small sizes. The panel is the
wrong component below a certain width; the button is the right one.

## Constraints you must not break

**The Bastrop-only refusal stays.** `composePropertyIntelSummary` returns `unavailable` for any
`cityKey` but `bastrop_tx`, because the upstream parcel, zoning and flood queries are bound to
Bastrop's ArcGIS services. Every dock state must render that refusal honestly rather than showing
an empty map that looks broken. **Do not make it serve another city's data under this city's name
to fill the space.**

**`buildable area` renders REFUSED with its basis in all three states.** Operator ruling R-2: the
envelope draws, the figure is withheld until an envelope atom backs it. Do not drop the row to
save vertical space in Dock — a missing row reads as a gap and invites someone to fix a decision.

**Record rows carry id, subject and status. Never the free-text description**, which is where
citizen names and personal phone numbers live. Same rule as G-123's tables. If you find a path
that renders a description into any of these panes, report it.

**Leaflet stays, and it is sanctioned.** `web/property-map.html`/`.js` is the one narrow,
decision-backed exception to this product's no-Leaflet rule. Do not replace the renderer; this
row is layout and state, not a map-engine change.

**The 52 layer keys come from `getAllLayerKeys()` in `src/property-map-catalog.mjs`**, derived
from smartcity-os's own `layerCatalog.ts`. One list, not two that can drift. Do not hand-list
them a second time for the sidebar.

**The frozen kit.** `shell.css` may declare no colour and no token; `web/sc-kit.css` is
byte-identical across three repos and must not be touched; the type ramp is pinned with a 12px
floor; no new CSS class without a rule. If a state appears to need a colour that does not exist,
STOP and report.

## A defect to confirm or clear on the way

The rail map currently renders broken on the live `bastrop_tx` Overview — it collapses to a
narrow vertical sliver with clipped control text. **Establish whether that is a layout bug this
row fixes, or a component failure underneath it**, and say which. Those have very different
costs and the design assumes the first.

## Method

Verify each state at its own width, and each state on a pack **with** a boundary and **without**
one. State what you checked.

ENUMERATE BEFORE ASSERTING ABSENCE. Say what you searched.

State the mechanism explaining an observation, then a second mechanism that would produce the same
observation and why you rejected it.

Every verification command exit-bounded (`timeout 120 ...`).

## Out of scope

The Flood and Drainage study overlay (a separate row, not yet scoped — the colour-taxonomy
collision with the 52 city layers is unresolved and is an operator discussion). The map engine.
Any feed or grant work. Anything in `smartcity-os` beyond reading the layer catalog.

## Close

Deploys are planner-owned: you deploy and you fix your own failed deploys. Canary with
`--no-traffic`, smoke, shift, verify the shift by reading the traffic JSON **by field name**,
never a positional `value()` formatter.

Write your close to the path named in the CHECKPOINTS AND CLOSE block above — that is the
machine-checkable one, and this mission deliberately does not name a second.

State: the deployed revision and digest, which of the three states you verified at which widths,
the with-boundary and without-boundary results, and your answer on the sliver defect.
