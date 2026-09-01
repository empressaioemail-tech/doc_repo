# Mission — B3: the Bastrop geometry gap, investigated read-only

R1-CROSSWALK close (_inbox/2026-09-01_parcel-r1-crosswalk_close.json, read in full)
found that of Bastrop's 6,158 $0-improvement CAD orphans, ~1,037 look like REAL parcels
with acreage that simply have no txgio_parcel feature — a possible containment coverage
gap. If true, the program's "981,405 = complete containment" invariant undercounts
Bastrop by up to ~1,037 real parcels. READ-ONLY investigation:

1. Characterize the 1,037: acreage distribution, land-use codes, situs presence,
   legal descriptions, spatial hints (abstract/survey references).
2. Second derivation: check them against the CAD's own geometry exports or plat
   references if present, and against neighboring counties' txgio density for the same
   areas — is this a txgio source gap, a vintage gap, or CAD accounts that genuinely
   have no parcel (easements, severed interests)?
3. State the mechanism with evidence and a second candidate mechanism you rejected.
4. Deliverable: a sized, evidenced answer to "does Bastrop containment miss real
   parcels, and how many" — the input to either a txgio re-acquisition card or an
   honest out-of-fabric classification. No store writes, no record changes.

Close: _inbox/2026-09-01_parcel-b3-geomgap_close.json with whatContradictedTheCard.
