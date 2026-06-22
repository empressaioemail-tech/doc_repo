---
id: 2026-06-21_hauska-mcp-server_cc-agent-M_arch-track-c-gate-rework
title: cc-agent-M — Architecture-Homes phase 1 Track C gate rework (mirrored from chat)
date: 2026-06-21
agent: cc-agent-M
repo: hauska-mcp-server
dispatch: Architecture-homes phase 1 Track C — gate-class rework + coverage tools + onboarding/metering scope
status: implemented; lint clean; 297/297 tests pass
note: cc-agent-M has no doc-repo access; planner mirrored this close from chat per [[cc-agent-m-no-doc-repo-access]]
related: [architecture_homes_mcp_gate, architecture_homes_scrub_tracker, architecture_homes_model_registry]
---

# Close — Track C gate rework (cc-agent-M)

## Co-bump
`@hauska/atom-contract@^1.4.0 → ^1.5.0`. Uses `/conformance` (validateAtomConformance, ATOM_CONFORMANCE_TARGET_VERSION = 1.5.0) and `/export` (createDownloadableAtom, DownloadableAtom). `src/conformance-check.ts` runs validateAtomConformance on every read envelope via `finalizeReadEnvelope()` (non-fatal miss logged). get_atom + all read tools covered.

## Task 1 — four product gates
Product union: `public | codex | reporting | map` (replaces monolithic `cortex`). Migration `003_api_keys_product_gate_split.sql`: cortex keys → reporting; map keys minted separately. `normalizeStoredProduct("cortex") → reporting` at DB read. Auth ladder unchanged (no key = anonymous public; bad/unknown = 401). Codex span preserved: public catalog tools have no requireProduct gate, so codex keys call them without a separate public key. Single source `src/product-gates.ts`. Wire total 62 tools.

- public (anonymous, Layer 1): search_atoms, get_atom (+1.5.0 conformance), query_jurisdiction, search_permit_atoms, list_jurisdictions, atom_trace (NEW).
- codex: codex_finding_generation, codex_override_write, codex_briefing_fetch, codex_findings_fetch, codex_snapshot_ingest.
- reporting: generate_property_brief, get_property_brief_run, search_encumbrances, get_restrictions, get_property_detail, get_replacement_cost, resolve_place, get_place_layers, get_place_dossier, list/get_property_workspace(s), list_workspace_share_edges, all cortex_* L-surface + deliverable + detail-callout + product-spec tools, atom_export (NEW), read_atom_calibration (NEW).
- map: get_parcel_polygon, get_hazard_profile, simulate_site_drainage, get_site_drainage, get_site_topography, assemble_map_layers (registered).

Gate-front seam: reporting and map both forward to engine-api product `cortex` upstream (upstream unchanged until engine extraction).

## Task 2 — new tools
- atom_trace (public): proxies retrieval-api GET /atoms/trace/:did; standard ToolEnvelope + readContract.
- atom_export (reporting, identified caller): DownloadableAtom via createDownloadableAtom; accessPolicy enforced via assertAtomExportAllowed/canReadAccessTarget. BLOCKED-54: composition refs filtered by accessPolicy, but workspace consent edges not yet enforced on export (tenant leg).
- read_atom_calibration (reporting): GET /v1/calibration/atoms/:did/read-contract on engine-api (501/404 → catalog fallback).
- get_atom conformance: finalizeReadEnvelope → validateAtomConformance({tier:"app",readContract,accessPolicy}) target 1.5.0.

## Task 3 — resisted-envelope cleanup
- cortex_deliverable_letter_render_download: DONE — text payload full ToolEnvelope w/ readContract; binary stays MCP resource blob.
- Cotality quartet: NOTED — atoms:[] until CoreLogic OAuth materializes adapter atoms; meta note carried.
- assemble_map_layers: DONE — registered under map gate; inherits envelope + conformance.

## Task 4 — phase-3 design (design only)
Onboarding/key issuance: signup → console /admin/onboard → api_keys; one key per product (no bundled cortex); tier ∈ {free, developer_pro, team, embedder}; jurisdiction_tenant required for map + tenant-private reporting; rotate/revoke via admin PATCH; HAUSKA_DEV_MODE bypass for local.
Metering → payment: logToolInvocation → request_log → hourly meter roll-up (product × tier × tool) → @hauska-sdk usage.record → metered billing + tier enforcement. One unit per successful tools/call; rich map layers 2×; anonymous public catalog IP-bucketed, no charge; request_log is source of truth, SDK is billing authority, nightly drift job.

PLANNER CORRECTION: M's design names "Stripe metered billing." The settled v1 fiat rail is Circle (USDC-native), switched off the Stripe Connect placeholder 2026-05-21 (`_decisions/2026-05-21_fiat_rail_circle.md`). The phase-3 metering wire targets `@hauska-sdk` on the Circle rail, not Stripe. Correct before build.

## Acceptance
1.5.0 co-bump; four gates + 62-tool mapping; atom_trace/atom_export/read_atom_calibration wired; validateAtomConformance on read envelopes; render_download metadata + binary; Cotality atoms-empty noted; assemble_map_layers under map gate; onboarding/metering design; lint + 297 tests pass.
