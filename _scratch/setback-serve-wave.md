# Setback serve wave — 2026-08-23

## GROUND-TRUTH (2026-08-24T00:35Z)

Option C unification **CLOSED**. Map wedge = cortex `labelEdges+derive` only. Facets carry scalars, no depth-warm geojson.

Deploys:
- Cortex `8c6d304f` → revision `cortex-api-00560-rih` @ 100%
- PE `f3e390ab` → smartsite.cloud `dpl_ExbMz87sec8TjB79xin3gpuu1Fks`

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

## OPEN (leave_behind)

- Cortex POST body: accept `parcel_node_id` for derive when CAD situs is `, TX`
- Geocoder miss on `17005 Simsbrook Drive, Pflugerville, TX 78660`
- Engine BDC hash lock mirror vs LDT `18b9bca9…` (optional)

## PRIOR WAVE (superseded by Option C)

- #194 map=export geo parity (depth-warm geo on facets — retired)
- #466 Bastrop BDC router
- #195 Travis table-backed PE port
