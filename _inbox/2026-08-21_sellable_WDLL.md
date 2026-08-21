---
id: 2026-08-21_sellable_WDLL
title: Sellable — CC heartbeat plus existing atoms on parcels
status: approved
date: 2026-08-21
plan_row: OPS-18a
operator_approval: 2026-08-21 verbal redefinition of sellable
related:
  - _decisions/2026-08-21_sellable_is_cc_heartbeat_and_atoms_on_parcels.md
  - 90_operations/OPS-18a_path_to_smartsite_market.md
  - _inbox/2026-08-21_a3-flood_close.json
---

# WDLL: sellable

Done looks like: Command Center County Manifest shows a live ledger beat, and a gold SmartSite parcel inspect reads the property-spine atoms we already store for that parcel. No new atoms. Checkout polish is out of this card.

## Acceptance

1. Command Center panel `https://cmdcenter-blush.vercel.app` `#panel=county-manifest` displays `computedAt` / `servedAt` that match live `GET /api/county-ledger` summary on serving `cortex-api`. Probe: same stamps, not a frozen client bundle. Fail if the panel is STALE while GET is fresh, or fresh-looking while GET is old.
2. A heartbeat executor exists. Trigger is a schedule (not "planner remembers to POST"). Failure is the panel showing STALE / missed beat when the executor does not run. Bypass named (manual POST is a bypass). Probe: skip one beat on purpose in staging or prove the production job fired by a new `computedAt` without a planner session.
3. Flood inspect on SmartSite reads `flood-hazard-fact` for the opened parcel and does not SELECT `place_layer_snapshots` for flood values. Probe: gold `48021:34137` (or named substitute) returns a flood determination from atoms, or an honest refusal that names the atom miss, never a silent null from the retired table. File: `brokerageNodeFacets.ts` (A3 graph). Recurrence: `ci-tier2-flood-not-served` stays red if snapshots return as flood.
4. Every property-spine family that has atoms names its SmartSite consumer (inspect facet, map layer, or HOLD-not-this-surface). Unnamed family is a fail. Families: parcel-node, flood-hazard-fact, special-district-fact, rail-corridor-fact, rrc-pipeline-fact, well-fact, cad-parcel-roll, zoning-fact, land-use-fact, owner-fact, building-footprint, buildable-envelope, setback-rule, road-node, property-boundary-edge. code-section / code-cross-reference may HOLD as Codex.
5. Parcel bind: a fact atom that exists for a gold parcel is retrievable by that parcel's `parcelNodeId` on inspect. Dual-grammar misses (R-07 Q8) are in scope. Probe: for each in-scope family, one live parcel in a county known to have those atoms. Fail if the atom is in the store and inspect is empty for that family.
6. No new ingest. No Harris PBF. No statewide roads apply. No minted absence. Scoring coverage for rails that already have atoms, and identity alias/re-key so existing rows bind, are allowed. Geometry `48135` score after a named denom is allowed (ledger heartbeat, not new data).

## Amendments

- 2026-08-21: opened with operator redefinition of sellable.
- 2026-08-21 evening: land-use leftover closed live. Cortex PR 450 serving `cortex-api-00531-fus`. PE PR 176 deploy `dpl_JHohCzrJs4JRnbTjy7HFg9eqNBuc`. Gold Land use row cites `land-use-fact`.
- 2026-08-21 evening: remaining HOLD serve, Wave A `--apply`, Wave C, and R-06 move to `_inbox/2026-08-21_ops18_all_board_WDLL.md`. Item 6 "no new ingest" is superseded there for COVER only. This card stays the step-6 slice.

## Finish card

4. met as inventory. 15/15 named. Planner review `_inbox/2026-08-21_s2-family-scout_planner_review.json`. Six families now serve the atom on integer inspect (zoning, setback, envelope, road-node, flood-hazard-fact, land-use-fact). Eight HOLDs include dormant map slots that still fail sellable criterion 2.

6. met. Named denom DISTINCT feature_index=75891. Write --county=48135 only. Neon and live GET both 104.95 not-yet (overcount: 79650 prefix parcel-nodes include 3791 retired). last_verified_at 2026-08-21T18:26:28.553Z. GET computedAt 2026-08-21T18:29:14.283Z after one `recompute?probe=skip`. Reviews `_inbox/2026-08-21_s4-geom-48135_planner_review.json`, `_inbox/2026-08-21_s4_ledger_recompute.json`.

1. met. GET, CC proxy, and (at S3 probe) CC DOM share computedAt. Live pair after first heartbeat: 2026-08-21T18:40:01.440Z, age ~18s, not STALE.

2. met. Executor `county-ledger-heartbeat` `*/10 * * * *` Etc/UTC POSTs `recompute?probe=skip` with Bearer SERVICE_API_KEY, body `{}`, no OIDC. First fire lastAttemptTime 2026-08-21T18:40:01.023473Z. Manual POST remains the named bypass. Spec `_inbox/2026-08-21_s3-heartbeat_job_spec.json`. Create `_inbox/2026-08-21_s3-heartbeat_job_create.json`. Fire `_inbox/2026-08-21_s3-heartbeat_first_fire.json`.

3. met on live SmartSite JSON and painted card. hauska-map PR [174](https://github.com/empressaioemail-tech/hauska-map/pull/174) squash `cf6ddc056e2990710ed377fca2f748be419b03e3` then PR [175](https://github.com/empressaioemail-tech/hauska-map/pull/175) `0a5ae0e`. JSON at 2026-08-21T21:18:56Z: `x-pe-read-path atom-chain-warm`, `floodHazardFact.floodZone=X` `source=flood-hazard-fact`. Painted integer `?parcelNodeId=48021:34137` at 21:19:44Z `inspect-flood` Zone X. Painted padded `.00000000` at 21:20:09Z same row. Close `_inbox/2026-08-21_s9-paint-qa_close.json`. Planner review `_inbox/2026-08-21_s9-paint-qa_planner_review.json`. SS-W16 stays.

5. dual-grammar MET on live SmartSite including land-use. hauska-map PR [175](https://github.com/empressaioemail-tech/hauska-map/pull/175) squash `0a5ae0e` then PR [176](https://github.com/empressaioemail-tech/hauska-map/pull/176) squash `3ea9852` deployed `dpl_JHohCzrJs4JRnbTjy7HFg9eqNBuc` READY. Cortex PR [450](https://github.com/empressaioemail-tech/legacy-design-tools/pull/450) squash `24d280c` serving `cortex-api-00531-fus` @100%. Gold and Lockhart integer and padded at 2026-08-21T22:56:03Z: `landUseFact.state=present` `source=land-use-fact` (gold bound `48021:34137:2025`, Lockhart `48055:18925:2026`). Bake `facets.baseFacts.landUse.source=cad-roll` stays retiredStore. Painted gold `inspect-landuse` `data-state=present` text `A1 — A1`. Execute `_inbox/2026-08-21_landuse_pair_execute.json`.
