# Mission — CALDWELL-GEOM: a county with no geometry, investigated read-only

R3 discovered txgio_parcel holds ZERO populated geom for 48055 county-wide, blocking
flood and every future geometry-dependent rail there. READ-ONLY investigation.

The paradox to resolve first: landing_parcel_jurisdiction holds 24,988 Caldwell rows
with in-city/unincorporated dispositions (method=ring) — containment RAN for this
county. Either the geometry existed and was later lost/purged, or containment consumed
a different geometry source than txgio_parcel. State the mechanism WITH EVIDENCE and
the second mechanism you rejected: check the containment job's actual source tables,
txgio load run history for 48055, row-level geom nullness vs row absence, and whether
the statewide TxGIO fabric distribution actually carries Caldwell (it should — name
whether this is a source gap or a load gap).

Deliverable: the mechanism, the blast radius (which rails are blocked; flood already
counted 24,988 noGeom), and the backfill design (source, job, verification) as a card
spec — do not execute the backfill. Close:
_inbox/2026-09-02_parcel-caldwell-geom_close.json with whatContradictedTheCard.
