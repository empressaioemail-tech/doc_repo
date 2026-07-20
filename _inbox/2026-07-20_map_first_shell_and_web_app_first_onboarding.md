---
id: 2026-07-20_map_first_shell_and_web_app_first_onboarding
title: Map-first shell + web-app-first onboarding inversion — deferred program record
status: deferred
date: 2026-07-20
applies_to: hauska-brief-extension, standalone-web-app (PWA, new), @hauska/map-renderer, @empressaio/cortex-tiles
related: [standalone-deep-dive-portal-direction, 2026-07-18_property_brief_gtm_critical_path, 2026-07-16_brief_spine_consumer_direction]
owner: nick
---

# Map-first shell + web-app-first onboarding — deferred program

This is the durable record of the map-first / mobile-PWA program the operator asked to keep DEFERRED (ruled 2026-07-20: keep fully deferred; this run is calibration completion only). It captures the direction so it is not re-derived later. The full source-grounded implementation plan (the seven-section spine-map decoupling analysis, phasing, and risks) is the working plan; this record adds the operator's onboarding-inversion directive and the two-vehicle framing, and marks the whole thing not-started.

## The two vehicles (settled direction, not started)

One decoupled map substrate (`@hauska/map-renderer` + `@empressaio/cortex-tiles` + the `parcelNodes` store), two product shells over it:

1. Desktop research surface = the existing Chrome MV3 extension (`hauska-brief-extension`), phase-shifted to a map-first shell (map is the workspace; chat/reports/layers/saved pull up over a full-bleed map).
2. On-site mobile surface = a NEW standalone web app / PWA. Installable to a phone home screen, full-bleed map, GPS-forward, no extension constraints. This is the vehicle that actually serves the standing-on-a-parcel use-case, because a Chrome extension physically cannot run on a phone at the site.

Two shells over one substrate map is the dual-interface / one-substrate-many-surfaces principle, not a fork. The map is already decoupled enough that the shell is the only per-vehicle new work.

## The onboarding inversion (operator directive 2026-07-20)

Today the path to the product is EXTENSION-FIRST: install the browser extension, and from there you can open the app. The operator ruled this must INVERT:

Web app first. The primary entry is the standalone web app. Installing the browser extension becomes the SECOND, optional step (a desktop power-user enhancement that adds in-page listing-site capture), not the front door.

Operator note carried verbatim in intent: "Right now the path to the app is web browser extension first then you are able to open the app. it needs to switch - web app first and the option to install the browser extension second (there will be more UI changes as well when we get to this point)."

Implications for the deferred build:

- The standalone web app / PWA is no longer only the "on-site mobile" Phase 4 afterthought; it becomes the PRIMARY surface and the onboarding front door. The extension is repositioned as an optional desktop add-on layered on top of an account/session that already exists in the web app.
- Onboarding, auth, and account creation live in the web app, not the extension. The extension attaches to an existing web-app identity (this pairs with the standing tenancy / user-aware-not-install-keyed work: entitlement + history must resolve by user, not by install_id, so a user who signs up in the web app and later adds the extension is the same identity).
- The extension's job narrows to what only an in-browser content script can do: capture the listing you are looking at on a real-estate site and hand it to the web app. Research, map, reports, chat, saved all live in the web-app surface.
- "There will be more UI changes when we get to this point" (operator) — the entry/onboarding screens, the install-the-extension prompt placement, and the account model are all in scope for that later program, not specified here.

## Why deferred now

This run is calibration completion (envelope opacity/lot-lines, zoning-stamp roll to the setback cities, backlog scoping). The map-first shell + PWA + onboarding inversion is a large multi-surface program with its own auth/tenancy dependency (user-aware resolution, sprint 54 leg) and is correctly sequenced AFTER the map is accurate and the corpus long-pole is addressed. Pulling it into the calibration window would trade a near-done accurate map for a half-built new surface.

## Sequencing when it is picked up

The source-grounded plan phases the DESKTOP shell first (Phase 0 contract seam -> Phase 1 rehomed map-first shell -> Phase 2 map-persists rebind -> Phase 3 bidirectional map<->chat) and treated the PWA as Phase 4. The onboarding inversion RE-WEIGHTS this: the standalone web app is now the primary surface, so when the program starts, the web-app shell and its auth/onboarding are first-class, not a trailing phase. The desktop-extension phases still de-risk the map-first shell pattern against the real decoupled map component, but the web app is the front door the pattern ships into. Gate the build order on: (1) map accuracy calibration complete (this run advances it), (2) the auth/tenant leg for user-aware identity, (3) corpus long-pole per the GTM critical-path doc.

## Dependencies this program leans on (all pre-existing, tracked elsewhere)

- User-aware (not install-keyed) entitlement + history resolution [[radar-entitlement-install-id-not-user-aware]] and the standalone deep-dive portal direction [[standalone-deep-dive-portal-direction]] — the web-app-first onboarding makes user-aware identity load-bearing, not optional.
- Tenancy / multi-user isolation (declared, unenforced today) per the GTM critical-path doc gap #9.
- The decoupled map contract (`renderSpineMap` / `getMapController` / `parcelNodes` store) — already clean; the one genuine contract extension the inversion needs is shell-driven layer visibility (`setLayerVisibility`).

No build in this run. This is the record so the direction survives to the program that executes it.
