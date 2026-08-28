---
title: Smart Site chrome v2 ships as a restyle; one dock stays
date: 2026-08-27
type: decision
status: active
owner: Nick
last_updated: 2026-08-27
repos: [hauska-map]
supersedes: none
---

# Smart Site chrome v2 ships as a restyle; one dock stays

## Decision

The Smart Site chrome v2 design drop ships to Property Explorer as a **restyle**.
Its SPEC section 2 request for **multi-dock stacking with fold-to-header in a
left column is DECLINED**. One tool open at a time, and the right-hand dock,
remain the design law.

## Context

The drop (`smart-site-chrome-v2`: README, SPEC, a v2 token file, five reference
sheets) was commissioned by the operator and handed over on 2026-08-27 with the
instruction to implement all of it and deploy.

Its SPEC section 2 asks for a behaviour change it names "the single largest fix
for the crowding": opening a tool expands it and folds every other open tool to
its 36px header, with the docks sharing one left column.

The repo already held the opposite as an explicit ruling. `Workbench.tsx` states
"ONE tool open at a time... Never two workbench docks, never a split screen",
`openToolIds` is accepted and deliberately ignored so a caller cannot revive
multi-open by passing an array, and `workbench.test.tsx` carries guard tests
written for this exact purpose — one named "passing openToolIds brief+chat still
renders ONE right dock (would fail if multi-open right rail returned)", another
asserting the dock style contains `right:` and not `left:`.

Shipping the drop as drawn would have meant retiring that ruling and deleting
those guards. The drop's own README flagged the area as unsettled ("Pinning or
two-open-at-once was not specified"), so it was not a case where the newer
document clearly superseded the older one.

The question was put to the operator with the evidence for each reading and the
third option of stacking on the right. The operator chose restyle-only.

## Consequences

- Every other part of the drop ships: the v2 token set, the primitives, the rail
  states, the 36px dock header, the one 340 dock width, the panel motion, the
  find bar, the inspect card's two-column fact grid, the seven tool bodies, the
  map chrome, and the money and identity surfaces.
- `nextOpenToolId` remains the only rule. The guard tests stay armed.
- Five further parts of the drop were refused on their own merits, each recorded
  with its reason in `apps/property-explorer/docs/smart-site-brand/v2/IMPLEMENTED.md`:
  basemap attribution placement, parcel geometry colours, the Google button fill,
  a price on the locked panel, and a find field in the cold open.
- Shipped as hauska-map **#260** (`65be567`), live on smartsite.cloud as
  `dpl_7yNr4E7rbPKxAYFoVEt5y9kvgF2Y`.

## Reversal criteria

Reverse if the operator, having used the shipped v2 chrome, finds that replacing
the dock content on every bubble tap loses work or context in a way the fold-to-
header model would have preserved — that is the concrete failure the stacking
model exists to prevent, and observing it is the evidence that would flip this.

Reversing means retiring the one-dock ruling in `Workbench.tsx` and removing the
two guard tests deliberately, in a card that names them, not by quietly letting
them rot.

## Not settled by this

Whether the dock column belongs on the left or the right if stacking is ever
adopted. The drop draws it on the left; the app's rail, MapToolset and mobile
layout are all built around the right. That would need its own pass.
