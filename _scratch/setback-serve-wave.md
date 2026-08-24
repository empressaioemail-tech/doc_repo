# Setback serve wave — 2026-08-23

## GROUND-TRUTH (2026-08-24T00:35Z)

Option C unification **CLOSED**. Map wedge = cortex `labelEdges+derive` only. Facets carry scalars, no depth-warm geojson.

Deploys:
- Cortex `8c6d304f` → revision `cortex-api-00560-rih` @ 100%
- PE `b74cca1` ([#197](https://github.com/empressaioemail-tech/hauska-map/pull/197)) → smartsite.cloud `dpl_4JRGkvaTVdhBeNmEQYdfekbSHqrg`

## LIVE PROBES (instrument: `_scratch/_probe_setback_unify.mjs`)

| Parcel | Facet geo | Derive | Setbacks (derive) | Status | Grade |
|--------|-----------|--------|-------------------|--------|-------|
| `48021:34137` | false | labelEdges+derive | 30/10/30 BDC | ok, ringPts=5 | PASS |
| `48021:34073` | false | labelEdges+derive | 30/10/30 BDC | no-buildable-area | PASS (honest-empty) |
| `48453:280239` | false | labelEdges+derive | 25/7.5/20 Pflugerville | no-buildable-area | PASS (honest-empty) |

Simsbrook probe address: `17005 Simsbrook, Pflugerville TX` (full "Drive" suffix geocode_miss on cortex).

## SHIPPED

| Item | PR | Repo |
|------|-----|------|
| Unified derive + authoritative setbacks | #467 | legacy-design-tools |
| Live derive for map; strip facet geo; nav address | #196 | hauska-map |

Close: `_inbox/2026-08-23_setback_geometry_unification_close.json`

## SHIPPED 2026-08-24 (P-60 perf/viz + commercial polish)

- PE **#198** merged `69d801e` — single derive per inspect, consumed-lot dashed outline, pricing ladder UI, share free, unlock hardening
- WDLL: `_inbox/2026-08-24_p60_setback_perf_viz_WDLL.md`, `_inbox/2026-08-24_smartsite_commercial_polish_WDLL.md`
- Live verify pending post-deploy: 48021:34137, 48453:280239, share mint, unlock Stripe path

## OPEN (leave_behind)

- **P0 viz follow-up:** per-edge setback lines (optional; dashed outline shipped)
- Cortex POST: accept `parcel_node_id` (PE re-enable send after schema)
- Geocoder miss on full Simsbrook street address
- Engine BDC hash lock mirror vs LDT `18b9bca9…` (optional)
- doc_repo: commit close JSON deploy-id amend (`main` ahead 1)

Handoff: `_inbox/2026-08-24_setback_wedge_handoff.md`

## LESSON (2026-08-24)

PE #196 started sending `parcel_node_id` on buildable-envelope POST; cortex schema does not accept it → **400 invalid_body** → live derive never patches geojson → card can show stale buildable % from warm scalars but **map draws no amber wedge**. Fix: `fix/setback-wedge-derive-post-body` omits `parcel_node_id` until LDT accepts it; ExplorerMap defaults buildable-envelope overlay visible before layer seed lands.

## PRIOR WAVE (superseded by Option C)

- #194 map=export geo parity (depth-warm geo on facets — retired)
- #466 Bastrop BDC router
- #195 Travis table-backed PE port
