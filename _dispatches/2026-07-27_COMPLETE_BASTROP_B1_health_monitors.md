---
id: 2026-07-27_COMPLETE_BASTROP_B1_health_monitors
title: Dispatch B1 — Spine source+engine health probes (S-03) GO
date: 2026-07-27
status: GO
owner: executor (hauska-engine + hauska-map)
planner: adversarial-audit (CTX HELD — planner grades live)
wdll: 2026-07-27_COMPLETE_BASTROP_hardening_WDLL items 6,7
audit: _inbox/2026-07-27_COMPLETE_BASTROP_hardening_audit.md Section B
---

# Dispatch B1 — Health monitors MVP — GO

Operator approved WDLL 2026-07-27. Dead `bastrop-tx:zoning` went unnoticed — gates ≠ liveness. You build; planner live-verifies. Do NOT claim WDLL MET.

## Do (WDLL 6,7)

1. Persist probe results (substrate table `spine_health_probe` or equivalent).
2. Bastrop probe pack (minimum):
   - Sources: bastrop-tx:parcels, bastrop-tx:floodplain, zoning-agol:bastrop-city-tx (AGOL Place Type), bastrop-tx:zoning (**dead-expected**), osm-overpass, county-roadway, streets-surveyed-2016, txgio_parcel:48021 counts, place_layer_snapshots tier1:48021 (+ S-14 delta zd vs zoning_present)
   - Engines: boundary-primitive count, depth-warm promoted count, rule-setback resolve on gold, reasoning atom-chain keys on gold
3. Status: `firing | degraded | dead | dead-expected`
4. **Alert**: current zero/error AND baseline>0 → alert (never silent)
5. Expose summary JSON on retrieval (preferred) or BFF; **CC-A renders it** — port existing panel patterns; do **NOT** invent a third console shell
6. **M0**: vitest mocked zero-vs-baseline → alert status

## Repos

- `P:\hauska-engine` — probes, storage, retrieval route
- `P:\hauska-map` — CC-A thin consumer of health JSON

## Do NOT

- Replace `/health` process checks — extend
- Scope all 254 counties in MVP
- Self-grade WDLL

## Close artifact

`_inbox/2026-07-27_COMPLETE_BASTROP_B1_executor_close.md` with PRs, probe endpoint, vitest proof of alert path. Planner probes live.
