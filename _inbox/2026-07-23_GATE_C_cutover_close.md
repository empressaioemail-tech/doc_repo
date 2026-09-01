---
id: 2026-07-23_GATE_C_cutover_close
title: GATE C cutover close — PE dual-serve atom path live; cortex warm
status: active
date: 2026-07-23
applies_to: hauska-map (property-explorer), hauska-engine, hauska-mcp-server, legacy-design-tools (cortex warm)
related: [2026-07-23_GATE_C_checkin_property_atom_path, 2026-07-23_MASTER_WDLL_property_reasoning_substrate, 2026-07-23_GATE_D_checkin_sdk_money_boundary]
owner: nick
---

# GATE C cutover close

Operator go received 2026-07-23 after planner live verify of the Gate C check-in. Cutover executed under the stated conditions. **Bespoke cortex path not deleted.** Dual-serve holds until Phase-1 finish-line three-orchestrator retirement.

## Conditions → outcomes

| # | Condition | Outcome |
|---|---|---|
| 1 | Flip PE read to atom path behind dual-serve flag; cortex warm | **MET** — `PROPERTY_ATOM_PATH=1` on Vercel; BFF `GET /api/spine/property-atoms/:id/facets`; cortex facets still 200 |
| 2 | Post-flip prove PE atom path on Hays + Bexar | **MET** — parent-verified below |
| 3 | Do not delete bespoke path | **MET** — cortex `00428-fax` @ 100%; rollback = unset `PROPERTY_ATOM_PATH` |

## Live stack after cutover

| Surface | Value |
|---|---|
| PE | https://property-explorer-xi.vercel.app — hauska-map `1025d61` (PRs [#47](https://github.com/empressaioemail-tech/hauska-map/pull/47)/[#48](https://github.com/empressaioemail-tech/hauska-map/pull/48)) |
| Retrieval | `hauska-retrieval-api-00015-2x8` @ 100% (overlay read-through, PR [#101](https://github.com/empressaioemail-tech/hauska-engine/pull/101) `bc5c84c`) |
| Cortex | `cortex-api-00428-fax` @ 100% — warm |
| MCP (post Gate D) | `hauska-mcp-server-00025-bkp` @ 100% — see Gate D check-in |

## Parent-verified PE proofs (verbatim highlights)

**Hays `48209:156346`**
```
GET https://property-explorer-xi.vercel.app/api/spine/property-atoms/48209%3A156346/facets
HTTP 200
X-Pe-Read-Path: atom-chain
source=atom-chain adapter=property-atom-chain
zoning={"district":"RS"}
envelope setbacks front_ft=25 side_ft=5 rear_ft=10 buildableAreaSqFt=5100
```

**Bexar `48029:410119`**
```
GET https://property-explorer-xi.vercel.app/api/spine/property-atoms/48029%3A410119/facets
HTTP 200
X-Pe-Read-Path: atom-chain
zoning=null
envelope.status=declined declineReason=no-zoning-stamp
```
Zero I-2 / heavy-industrial invent.

**Cortex warm (rollback path):**
```
GET https://cortex-api-tds7av26va-uc.a.run.app/api/brokerage/v1/place/node/48209:156346/facets
HTTP 200
```

**Rollback:** Vercel unset `PROPERTY_ATOM_PATH` or set `0` → cortex-only (`X-PE-Read-Path: cortex`).

## I-E overlay hard bar (named; accepted PARTIAL at check-in, then cleared)

Planner accepted overlay as PARTIAL at Gate C go and named it a hard bar before Phase-1 finish. Cleared in the same session:

| Item | Evidence |
|---|---|
| Overlay home | cortex Neon `atom_calibration_overlay` (migration 0037); wired via `OVERLAY_DATABASE_URL` → `CORTEX_DATABASE_URL` (not on `hauska_mcp`) |
| Seed | parcel `48209:156346` → calibrated `0.71` / `backtest` / n=3 |
| Live Hays envelope axes | asserted `0.88`/`asserted`; calibrated `0.71`/`backtest` on `00015-2x8` |
| Multiply | still absent (`0.9×0.88≠0.71`) |

Master **3.10** / **3.6** grades: see Master WDLL update — 3.10 elevated toward MET for read-through path (permit-outcome adapter / full backtest population may remain PARTIAL); 3.6 still PARTIAL pending remaining envelope probes / three-orchestrator retirement.

## Standing holds into Phase-1 finish

- Dual-serve holds; **do not** retire route + Tier-1 + Tier-2 bakes until one anti-zombie close.
- Next stop after money boundary: Gate D check-in (`_inbox/2026-07-23_GATE_D_checkin_sdk_money_boundary.md`).
