---
decision_id: 2026-07-23_gate_x_go_phase2_pre_gate_y_requirements
date: 2026-07-23
owner: nick
status: active
related_canonical:
  - _inbox/2026-07-23_terrain_ifc_spine_lift_WDLL.md
  - _inbox/2026-07-23_GATE_X_checkin_terrain_export_spine.md
  - _inbox/2026-07-23_GATE_Y_checkin_terrain_export_sdk.md
---

## Decision

Gate X is GO. Phase 2 proceeds to MCP `public-paid` + SDK one-meter-per-export and stops at Gate Y. Adaptive DEM resolution and GCS-durable artifact storage are Phase-2 pre–Gate-Y requirements (not post-Y deferrals). LandXML TIN deferral stands. IFC without `IfcMapConversion` is accepted for Gate X/Y with a logged georef-rigor follow-up. `TXGIO_DATABASE_URL` cross-project coupling is noted, not fixed this wave.

## Context

Operator verified Gate X against sample files (not paste): DXF 3DFACE Z varies ~145.6–145.7 on TERRAIN; contours are LWPOLYLINE at elev 145.5 on TERRAIN_CONTOURS; all four shipped formats share 1012/1890. Spine resolves `48021:27303` by `county_fips:prop_id`. Contract 1.10.0 and engine #105/#106 confirmed.

## Structural commitment check

- Sell reasoning, not data: atom carries citation, asserted confidence, timestamp — green.
- Confidence earned not asserted: asserted-with-provenance baseline — green.
- Cost per jurisdiction: N/A (USGS 3DEP public-domain reference field) — green.
- Dual interface / MCP-first: Phase 2 catalog tool — green.
- I-F SDK money boundary: one authorizeCall per export request confirmed — green.
- Premortem: no yellow on load-bearing commitments for this gate.

## Reasoning

Paid user-facing flip (Gate Y) cannot ship a default that fails small parcels or a download that dies when Cloud Run scales. Those two become hard bars before Gate Y evidence. Metering unit remains the export request (derivation), not per-format bytes, matching the WDLL metering ruling. LandXML remains honest-defer without inventing a second TIN. Named EPSG:4326 without `IfcMapConversion` is enough for Gate X/Y; projected-meter placement in BIM tools is a rigor follow-up, not a gate.

## Reversal criteria

- If adaptive resolution cannot meet the 16px DEM floor for a non-trivial share of gold parcels without inventing geometry, reopen and require honest decline UX before Gate Y.
- If GCS artifact refs cannot be fetched cross-instance on the live download path, Gate Y must not pass.
- If product later wants per-format SKUs, amend the WDLL metering ruling explicitly.

## Dependencies

Depends on Gate X live spine (`hauska-engine-api` terrain-export). Unblocks Gate Y check-in. Cortex retirement and CC/PE surfaces stay blocked until after Gate Y go.
