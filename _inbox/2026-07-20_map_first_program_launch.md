---
id: 2026-07-20_map_first_program_launch
title: Map-first program launched — four tracks (spine persist, data warm-up, web shell, auth)
status: active
date: 2026-07-20
applies_to: hauska-map (map-renderer substrate + new property-explorer app), legacy-design-tools (warm-up), hauska-brief-extension (consumer)
related: [2026-07-20_map_first_shell_and_web_app_first_onboarding, 2026-07-18_property_brief_gtm_critical_path, 2026-07-20_map_calibration_backlog_scope]
owner: nick
---

# Map-first program — launched 2026-07-20

The deferred map-first / web-app-first program is now ACTIVE. The Property Brief is being rebuilt map-first: a browsable Central-TX map is the front door; the brief becomes the opt-in deep answer to a question the map provoked, not the entry. Grounded in three read-only scouts (renderer lifecycle, node-facet computation, reusable components + deploy surfaces), all run 2026-07-20.

## The product (operator-decided)

Cold open: a LIVE Central-TX map with a minimal sign-up card floating over it (the real app dimmed/halftoned behind, NOT a screenshot; the map boots anonymous first, auth resolves over it). One short headline, three bullets, Google-auth, minimal friction.

Browse: scroll the map, click a parcel, get an INSTANT inspect-in-place card (base facts, zoning, setbacks drawn, buildable envelope, bullet data) from FULLY PRE-BAKED data. Hard rule: NO AI reasoning while browsing. Everything on the browse surface is a pure read.

Ask/report: the brief + chat is the opt-in deep end, reached AFTER the map provokes a question. This is where AI reasoning runs and where the user's OWN data flows from their isolated storage.

## The four tracks (planner orchestrates, adversarially reviews, verifies; never delegates verification)

Track A - Spine map-persist (@hauska/map-renderer). Shape 1 (unify): the never-unmount / re-point-don't-rebuild contract moves INTO the substrate so both the extension and the new web app mount the substrate's persistent map rather than each running its own. Kills the destroy-and-rebuild-on-every-property churn (spine-map.js:2301). A spine planning coordinator fans its own workers. Must preserve every crash guard (feature-state dasharray/gradient = per-frame blank-map crash; load-EVENT gate not isStyleLoaded; generation guards; pmtiles double-register; store-reconcile-by-id teardown).

Track B - Data warm-up (HARD LAUNCH GATE). Extend warmingHarness.ts to fully bake every Central-TX node into place_layer_snapshots, in cost tiers: cheap-deterministic (facts, land-use, zoning, setbacks, envelope math) -> live-dep-with-caching (OSM roads for high-confidence envelope, FEMA per-node, federal per-tile) -> expensive (3DEP topo CONTOURS ONLY, defer mesh/IFC). Bullet verdicts: pre-freeze Grok output once per node (keeps quality, zero live AI on browse). Owner names EXCLUDED from the public browse payload (privacy gate; owner is auth-gated on the ask path only). Monotonic verify-before-promote so no re-bake downgrades a good node (the Austin re-warm cautionary tale). PHASE 0: finish county promotion first (5/10 counties have land-use; Travis/Austin mid-promote) before the facet bake fans.

Track C - Web-app shell. New app apps/property-explorer in the hauska-map pnpm workspace (Empressa brand, zero Hauska user-facing strings), its own Vercel project. ~70% rehome: mounts the substrate FloatingMap + LiveMapTile, ports the framework-free guts (parcel-node-store, buildable-envelope client), same-origin spine proxy (query-param rewrite, trim-env, root-deploy per the documented Vercel gotchas). Browse half is fully covered by existing anonymous components; the browse experience needs no auth.

Track D - Auth/tenant leg (gates the ASK side, NOT browse). Web OAuth front door (replaces the extension's chrome.identity flow), user-aware entitlement/history (currently install-keyed), enforced tenant-isolated storage (currently anonymous-default-tenant, unenforced). Sprint-54 leg. Parallel; the browsable map ships without it. Scoped after the shell skeleton stands.

## Sequencing

A + C + B-phase0 launched 2026-07-20. D scoped after the shell skeleton exists (grounded against a real consumer). B's facet bake fans per-county as each county is confirmed launch-ready by phase 0. The browsable map (A + C + B's cheap tiers) can reach a demo well before the full bake + auth complete; "every node complete" is the launch gate, not the demo gate.

## Reuse inventory (portable, npm-published)

@hauska/map-renderer (vanilla core + React FloatingMap), @empressaio/cortex-tiles (MapTile/LiveMapTile/site-analysis + React-free liveGis), @empressaio/cortex-client (BFF client), and the extension's framework-free guts (parcel-node-store.js, buildable-envelope.js, research-api.js). Extension chrome.* files (session-auth, install-id, storage, spine-proxy, background/content/panel) are NOT ported - they are the shell being rebuilt for web. Deploy model copied from apps/command-center (cmdcenter) + the extension web/ (property-brief).
