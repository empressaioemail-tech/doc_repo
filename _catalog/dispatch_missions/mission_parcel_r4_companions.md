# Mission — R4: wells and special districts onto the record

Spec: ledger section 11. Sources already staged on PRODUCTION neondb: `tx_rrc_well`
(1,396,049 rows statewide — scope the six counties) and `tx_special_district` (2,775
rows incl. 1,888 MUD; MUD is NOT a separate rail). Spatial join to parcel geometry
(txgio): ZONE-MAJOR pattern mandatory — MATERIALIZED bbox CTE detoasts polygons once
per batch; point-major LATERAL is ~218x slower and is a named dead-end. Write companion
rows (payload, source, vintage) + the cell to value with rowCount; parcels the sweep
covered with zero intersections get absent-verified WITH basis (the sweep is the look —
this is the one legitimate absent-verified emission, it has a real second derivation);
parcels outside the swept area stay unaccounted. Factory PR own branch, image rebuild,
Cloud Run only, run rows, idempotent, chunked. Verify per county: companion row counts
vs an independent SQL of the source intersect counts; paste verbatim.
