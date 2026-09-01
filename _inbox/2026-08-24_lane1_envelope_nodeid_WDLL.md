---
id: 2026-08-24_lane1_envelope_nodeid_WDLL
title: Lane 1 — envelope jurisdiction from parcel node (Pflugerville wedge)
status: live
date: 2026-08-24
plan_row: P-60
operator_go: verbal 2026-08-24 (dispatch parallel; peel + Lane 1)
audit: _inbox/2026-08-24_write_path_serve_audit.md
---

# WDLL: Envelope resolve without a three-part CAD situs

## Done looks like

A map click on Dashwood 280210 and neighbor 280230, using the CAD situs PE actually sends (`STREET , TX` / `STREET , TX 78660`), paints the amber wedge. Card scalars stay `F 25 / S 7.5 / R 20`. Gold 34137 still derives. Cortex no longer 400s `parcel_node_id`.

## Acceptance items

1. **POST_BODY accepts `parcel_node_id`.** Zod `.strict()` includes optional `parcel_node_id`. Extra unknown keys still 400. | check: existing invalid_body test + new accept test | grade: [met] `envelopePostBody.ts` + unit parse. HTTP route suite not run (`TEST_DATABASE_URL` unset).

2. **Jurisdiction does not require three comma parts.** When situs is city-less, resolve `jurisdictionKey` from the parcel node (or a second derivation that is not a new situs regex). `cityStateFromSitus` keeps its three-part meaning. | check: unit fixture with `17006 DASHWOOD CREEK DR , TX 78660` + node 48453:280210 yields a non-null key and setbacks | grade: [met] city-null on that situs; `48453` + `SF-S` → `pflugerville-tx` 25/7.5/20. Uses the GIS-resolved node, so a PE send is not required for Dashwood if GIS already stamped the id (serve audit: it did).

3. **No-district stays honest** when there is no table (Wainee 35772 still declined). | check: Wainee fixture or live decline | grade: [met] blank district → null. No city invented.

4. **Do not widen `isTravisUnusableSitus`** as the fix. Coords-only recovery is unmeasured. | check: grep PE envelopeRequestBody unchanged for the 5-digit ZIP case on this card | grade: [met] LDT-only tree.

## Live 2026-08-24T16:18Z

LDT [#471](https://github.com/empressaioemail-tech/legacy-design-tools/pull/471) merge `244567a5`. Serving `cortex-api-00571-fay` @100%. Prod POST of the CAD situs PE sends: Dashwood 200 ringPts=10; neighbor 200 ringPts=5; gold 30/10/30. Operator visual owed on the painted wedge.

## Planner review 2026-08-24

Uncommitted on `P:/tmp/ldt-envelope-nodeid` `fix/envelope-parcel-node-id` @ `1fd6233d`. Not deployed.

Mechanism: unique `mapDistrict` hit among `wiredZoningCityKeys(FIPS)`. Zero or many → null. Travis today is Austin + Pflugerville; Austin has no SF-S. Adding a second Travis table that also maps SF-S will fail closed and Dashwood wedges go dark again. No many-hit unit test yet.

PE send of `parcel_node_id` stays leave_behind for GIS-unstamped clicks. Do not treat it as the Dashwood blocker.

This card is LDT only. PE send of `parcel_node_id` is the next hauska-map card after this schema is on a branch. Do not deploy cortex from this agent.

## Do not

- Statewide ingest or `--apply`
- Hover, pricing, Reports
- A third situs heuristic
- Commit (parent commits)
