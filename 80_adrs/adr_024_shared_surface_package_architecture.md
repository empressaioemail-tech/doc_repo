---
id: adr_024_shared_surface_package_architecture
title: "ADR-024 — Shared surface package architecture"
status: accepted
last_updated: 2026-07-01
applies_to: portfolio
related: [shared_surface_principle, adr_008_engine_factor_out, adr_018_atom_contract_substrate_layer, 28_mcp_first_product_design, 48_cortex_reporting_function_dashboard_spec, 51_substrate_v1_sprint]
owner: nick
---

# ADR-024 — Shared surface package architecture

## Status

Accepted 2026-07-01. This ADR formalizes the architecture specified in [`_architecture_homes/shared_surface_principle.md`](../_architecture_homes/shared_surface_principle.md), which remains the living detailed spec. Ratified during the autonomous Shared Surface Sprint after Track B verified the package scaffold in legacy-design-tools (PR #210): five `@hauska/*` packages install with a frozen lockfile, build cleanly, are consumed by codex-reviewer-qa, and carry no dependency cycles.

Note on numbering. The sprint handoff guide referred to this as "ADR-023," but that slot is occupied by ADR-023 (Cortex reporting repo designation). It is filed here as ADR-024, the next free slot.

## Context

This is the UI companion to the MCP-first product design rule (`28_mcp_first_product_design.md`). Shared UI components had begun to sprawl across product surfaces by copy-paste and by iframe embedding of running services. Both mechanisms drift: copy-paste loses a single source of truth, and iframe embedding couples every consumer to a deployed service plus DNS and pushes content-security-policy friction onto the host page.

The substrate already resolved the same problem for data: `@hauska/atom-contract` is a versioned package (ADR-018), and the Hauska SDK is a set of versioned packages. Shared UI now follows the same shape.

The sprint also surfaced a live contradiction in the map surface. `shared_surface_principle.md` specifies the map as an importable package (`@hauska/map-renderer`, no iframe, no running server), while the cortex reporting tile build dispatch had the MapTile render hauska-map as an iframe against a deployed command-center URL and stated "do not create a custom map component." The hauska-map repo as built is a vanilla JavaScript Vite app with no React component to extract, so following the package dispatch literally is a React port of the working vanilla map logic rather than an extraction. The operator resolved this on 2026-07-01 in favor of the package model.

## Decision

Any UI component that appears in more than one product surface ships as a versioned npm package under the `@hauska` scope. The unit of sharing is the package, not copy-paste, not an iframe, not a running URL. Auth is injected through a client factory and is never assumed inside a component. Packages define their boundary in TypeScript, and consumers own bundling.

Six package families, with an acyclic dependency graph rooted at `@hauska/atom-contract`: `design-tokens`, `tile-shell`, `map-renderer`, `document-viewer`, `cortex-client` (no React), and `cortex-tiles` (consumes the rest). Every tile advertises machine-readable capability through the extended TileDef fields (`requires`, `produces`, `modes`, `mcpTools`) so the `compose_workspace` MCP tool can select and arrange tiles from natural-language intent by reading the contract rather than guessing. Every tile ships its own React error boundary so one broken tile cannot crash the workspace. The `@hauska` scope appears only in `package.json` name fields and import statements, so a brand rename is a mechanical find-replace plus a republish.

The map surface follows the package model (`@hauska/map-renderer`, React), superseding the iframe and running-service path.

## Alternatives considered

Iframe and running-URL sharing was rejected because it couples every consumer to a deployed service plus DNS, blocks package composition and offline builds, and pushes content-security-policy friction onto the host.

Copy-paste per surface was rejected because it drifts and leaves no single source of truth.

A single monolithic UI package was rejected because it forces every consumer to take transitive dependencies on unrelated surfaces. The six-family split keeps dependencies minimal and acyclic.

## Consequences

The `map.hauska.io` CNAME is no longer required for the workspace map tile, because a package needs no running map server. The iframe MapTile path in the cortex tile build dispatch is superseded by the package. Downstream surfaces (the Brief extension, the Mox demo, SmartCity) import the same tile components and inject their own auth strategy. The `compose_workspace` MCP tool reads the live capability registry produced by the tile migration.

## Reversal criteria

Reverse for a specific surface if a running-service embed is genuinely unavoidable there (for example a third-party-hosted component that cannot be packaged); that surface may embed while the rest stay packages. A full reversal to iframe or URL sharing would require showing that package build and publish overhead exceeds the drift cost it prevents, which the clean Track B scaffold (frozen install, full build, no cycles) argues against.
