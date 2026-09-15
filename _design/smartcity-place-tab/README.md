# SmartCity Place tab (Development services)

**Artifact:** https://claude.ai/code/artifact/5aa58f1c-a339-4d4b-a3c7-f98c58a5c7cd
**Status:** IN REVIEW 2026-09-14
**Source of truth for the contract:** `smartcity-dashboards` `src/property-map.mjs` @ origin/main (G-117)

Parity design for v1's "GIS & Property Intelligence" tab. Map left, parcel dossier right,
records on that parcel underneath the dossier in the same rail.

## The read path already exists

G-117 shipped it. `composePropertyIntelSummary` reads smartcity-os's platform route
`/api/platform/property-intel/summary` server-to-server: address in, geocoded parcel + zoning +
flood risk + real permits/inspections/code-cases out. The 52 toggleable layers come from the
sibling `/layers` route and are derived from smartcity-os's own `layerCatalog.ts` across its
seven non-overlay categories, not hand-listed twice.

So this is PARITY AND REFINEMENT, not construction.

## Three things the design makes visible

**Every value carries its source.** Zoning is the city's own `PlaceTypeDesc` string, flood is
FEMA's own zone code, permit status is MyGov's own value. The module refuses to remap them onto
an invented taxonomy, so the design states where each came from and when.

**Buildable area is REFUSED, not missing.** Operator ruling R-2: the envelope draws, the figure
is withheld until an envelope atom backs it. The row stays visible and says so. Deleting it
would read as a gap and invite someone to "fix" a decision.

**The other-city refusal is drawn.** `composePropertyIntelSummary` returns `unavailable` for any
cityKey but `bastrop_tx`, because the upstream parcel/zoning/flood queries are bound to Bastrop's
ArcGIS services. Drawn as its own artboard so the constraint is visible: **this tab does not
port to city two as written.** Second-city support is a build, not a grant.

## PII

Record rows carry id, subject and status. Never the free-text description, which is where
citizen names and phone numbers live. Same rule as the Work orders table.

## Depends on v1 being alive

Every value on this tab is a live read of `smartcity-api`. See OPS-17 G-122 — the v1 regression
reported by the city on 2026-09-14 shares this upstream.

## Regenerate

    node gen.mjs
