# Mission — R5: zoning onto the record for staged cities

Spec: ledger section 11. Zoning rails are unaccounted on all 611,116 in-city records
while 23 of 72 six-county cities hold a REAL staged layer (zoning-ingest close
`_inbox/2026-09-01_zoning-ingest_close.json` is the city truth; the county ledger is NOT
evidence). Scope: ingest `zoningDistrict`/`zoningJurisdictionKey`/`zoningProvenance`
cells into parcel_record for in-city landing parcels within cities that have a staged
layer, spatial join zone-major, keyed by city polygon (Waco/Austin/Pflugerville bleed is
a named defect — never stamp across a city boundary). The five stamp-gap cities'
LDT-side serve stamping and the 49 no-layer cities are OUT of scope; report per-city
coverage counts and the residue honestly. Parcels inside a staged city whose point
misses every zone polygon: absent-verified with basis (the layer was looked at) ONLY if
the layer is city-complete by its own declaration; otherwise unaccounted — state which
per city. Factory PR own branch, Cloud Run only, idempotent, verify per city verbatim.
