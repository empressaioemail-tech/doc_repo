---
id: 2026-07-23_pe_lookup_reachability_finding
title: PE finding — no property search; substrate not human-navigable
status: active
date: 2026-07-23
applies_to: hauska-map (property-explorer)
related: [2026-07-23_PHASE1_operator_visual_QA_checklist, 2026-07-23_PHASE1_FINISH_checkin_property_reasoning_substrate]
owner: nick
---

# PE finding — lookup is the reachability gate

Live: https://property-explorer-xi.vercel.app  
Code: hauska-map `apps/property-explorer` @ `3d02cea`.

## 1. Is there a property/address search input?

**Entirely absent** — not broken.

Live landing (cold-open scrim + map chrome) has: layers checkboxes, map tools (measure/draw/marker/geolocate/satellite), “Just browse the map.” **No text field, no search icon, no address/APN/parcel-ID input.** Accessibility snapshot of the live page shows zero search-related controls.

There is **no PE search component** to name. Closest unrelated control: MapLibre “Find my location” (GPS only). Command Center has `HeaderSearchBar` + geocode elsewhere in hauska-map; it is **not** mounted in property-explorer.

## 2. How is a user supposed to reach a specific inspect card today?

**Map click only** (pan/zoom → tap a parcel polygon → `inspectInPlace` → `InspectCard`).

| Path | Works? |
|---|---|
| Tap parcel on map | Yes — sole working path |
| Address search | Absent |
| Parcel-ID / APN field | Absent |
| `?parcelNodeId=` / `?parcel=` URL | **Broken for inspect** — `ExplorerMap.tsx` ~L171–182 only fires GTM `extensionHandoff`; never calls `inspectInPlace` / fit |
| `?address=` | Absent |
| Direct API facets URL | Works for operators (not product UX) |

Product copy itself admits this: “Tap a parcel for zoning, setbacks, and buildable envelope…”

So Nick’s QA only worked via known IDs + API links because **there is no product front door** to a named parcel.

## 3. Smallest fix (reachability gate — not full-county bake)

**One lookup bar + wire the broken deep-link**, reusing existing `inspectInPlace` (do not invent a second inspect path).

### Scope (minimal)

1. **UI:** single top-bar input on `ExplorerMap` (or thin `ParcelLookupBar.tsx`) — accepts either:
   - `county_fips:prop_id` (e.g. `48209:156346`), or
   - a street address string
2. **Resolve:**
   - If looks like `fips:id` → `fetchBakedNodeFacets` / property-atoms facets (already on PE spine) → build card → `inspectInPlace(card, id)` → fit map to parcel if geometry/center available
   - Else address → existing allowlisted `POST …/place/buildable-envelope` `{ address }` (already used by PE client) → `parcelNodeIdFromEnvelope` → same `inspectInPlace` + fit
3. **Deep-link:** finish WDLL-30 intent — on load, if `?parcelNodeId=` / `?parcel=` / `?address=`, run the same resolve helper (not GTM-only)
4. **Honest miss:** unknown id / geocode fail → one-line “not found / not verified” — never invent a neighbor parcel

### Out of scope for this cut

- Full-county atom bake
- Typeahead / CAD free-text search index
- Opening Command Center `HeaderSearchBar` wholesale
- Allowlisting `plan-review/geocode` (envelope path already covers address→parcel on browse proxy)

### Acceptance (operator glance)

- Paste `48209:156346` → inspect card opens with atom-chain zoning RS + setbacks (not API tab)
- Paste Bexar `48029:410119` → honest no-zoning-stamp on the card
- Open `/?parcelNodeId=48209:156346` → same inspect open (deep-link fixed)
- Optional: one known San Marcos address that uniquely resolves → card opens (document if CAD situs collision → require parcel id)

## Recommendation

Ship this **before** any breadth bake. More atoms behind an unopenable door does not advance the product. Greenlight = one hauska-map PE PR (~lookup bar + deep-link + tests).

## Shipped

| Item | Value |
|---|---|
| PR | https://github.com/empressaioemail-tech/hauska-map/pull/50 |
| Merge | `313ee2c` |
| Prod | https://property-explorer-xi.vercel.app (deploy `dpl_8kNNKZggJ6KnTspwbaQxztzN7qgY`) |
| UX | Top **Find** bar (`ParcelLookupBar`) + deep-link opens inspect |

## Live proof (2026-07-23, browser)

| Acceptance | Result |
|---|---|
| Find bar → `48209:156346` | Inspect opens: Zoning **RS**, Setbacks **F 25' · S 5' · R 10'**, Verified · gate-passed · 2026-07-23 |
| Deep-link `/?parcelNodeId=48209:156346` | Same inspect open (RS + 25/5/10) |
| Deep-link `/?parcelNodeId=48029:410119` | Inspect opens Parcel 410119; zoning/setbacks/buildable **not verified here** (honest absence, no fabricated district) |

Reachability gate cleared. Phase 2 still not opened. Full-county bake still deferred until operator clears visual QA hold.
