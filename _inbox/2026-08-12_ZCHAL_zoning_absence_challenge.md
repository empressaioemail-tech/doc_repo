---
title: ZCHAL — zoning absence challenge (Houston + Z1 resample)
date: 2026-08-12
lane: ZCHAL
status: complete
---

# ZCHAL: the zoning absence challenge

## Verdict in one line

The operator was right about Houston and Z1 was wrong, but not in the way anyone expected: Houston genuinely has no Euclidean zoning districts, and Z1 still owes an answer because it never looked, and because what Houston does publish answers the buildability question anyway.

## Task 1: Houston

Z1 filed Houston as SEARCHED-AND-ABSENT with the reason "no Euclidean zoning; deed-restriction / no-zoning regime. Do not invent a zoning layer."

The first thing to establish is that this was not a finding. Reading the probe source, `probe_city()` opens with a hardcoded branch on `city_key == "houston-tx"` that returns SEARCHED-AND-ABSENT before any network call is made, recording a single pseudo-probe of kind `doctrine`. Houston was never searched. The word SEARCHED in that status is false for this row. A belief was written into a field whose meaning is "we looked", and it then travelled downstream as if it were evidence.

On the substance, the doctrinal half is correct. Houston does not have mapped use-districts. But it regulates development heavily and publishes that regulation. The City of Houston GIS org (`cohgis_ago`) publishes 291 Feature and Map Services on `mycity2.houstontx.gov`, a host that never appeared in Z1's guess list. Among them, verified live by count and extent:

| Layer | Features | What it carries |
|---|---|---|
| Special Minimum Lot Size | 722 | 236 distinct minimum lot areas, 2,176 to 55,648 sq ft, each ordinance-cited, with an SFR restriction flag and expiration dates |
| Special Minimum Building Lines | 195 | 30 distinct mandatory front setbacks, 10 to 100 ft, ordinance-cited |
| Historic Districts (City of Houston) | 23 | Certificate of Appropriateness regime |
| Conservation Districts | 7 | Character standards on new construction |
| Major Activity Center | 8 | Chapter 42 intensity designation |
| Market Based Parking | 1 | Parking-minimum exemption area |

Every extent falls inside Houston city limits, roughly -95.65 to -95.25 and 29.63 to 29.89. I checked this specifically because the program has twice been bitten by a layer advertising more coverage than it has: the RRC wells layer that claimed statewide with a one-county extent, and `Parcels_Utah` claiming a state with a county extent. No such trap here.

So: can we answer "what can I build here" for a Houston parcel from public data? Yes. Minimum lot size and front setback are the two constraints that most directly bound a residential envelope, and both are published as parcel-precise polygons with ordinance citations. The correct status is not absence. It is a regime that has no district polygons and is nonetheless regulated and machine-readable.

Two roster fields are actively wrong and should be corrected. `code_text.publisher` reads `"none"` with verification `"verified"` — Houston publishes Chapter 42 of its Code of Ordinances, so this is a verified-wrong field. And the evidence string for the unzoned classification reads `_STATE.md doctrine; texas_roster_v1.json Houston unzoned verified`, which is doctrine citing the roster citing doctrine. That is a closed loop with no observation in it.

## Task 2: resampling the absences

I re-probed 21 of Z1's absences, deliberately weighted toward the cities most likely to have zoning, using paths Z1 did not use: ArcGIS org enumeration from a hit's org id, folder recursion, ArcGIS Hub domains, group search, and point-in-polygon verification at city centroids.

One confirmed false absence. **Deer Park.** Z1 queried `https://gis.deerparktx.gov/arcgis/rest/services` and logged `services: []`. That root live-returns three folders and ten services. Z1 read only the top-level services array and never recursed. Deer Park's zoning sits one level down at `WGS84/Zoning_WGS84` — 301 polygons, fields `Zoning` and `Code`, with eighteen unmistakably Euclidean codes (SF1, SF2, MF1, MF2, GC, HS, CS, M1, M2, M3, OP, MP, PUD, TF and institutional classes). A point probe inside the city returns SF1. This is Elgin all over again: the layer existed and nobody had looked in the right place.

Two more are misclassified without being recoverable. **Houston** belongs in a regulated-but-not-districted state. **Webster** advertises a zoning service whose host returns an Esri Application Error — that is a broken host, not an absence, and it should not read the same as a city that never published.

The rest held. Notably, the two rejects that looked most suspicious were both correct: League City's apparent hit is Dickinson's service (point-in-polygon returns zero at League City's centroid, and its extent stops south of the city), and both Pasadena hits are Pasadena, California. Z1's geo-rejection worked.

Strict false absence rate: **1 of 21, 4.8 percent.** Counting the misclassified-but-unrecoverable rows: **3 of 21, 14.3 percent.**

## Task 3: indicting the method

The data finding is largely sound. Houston MSA municipalities really do not publish much zoning GIS, and I want to say that plainly because a confirmed absence is a valuable finding. The method and the vocabulary are another matter.

The most important number is not the false absence rate. It is that **the municipal-host path returned zero services in 104 of 104 cities.** It never once succeeded. It is a synthetic `gis.<slug>tx.gov` guess, and those hostnames mostly do not resolve. Half of Z1's stated two-pronged search was a no-op, and it was counted as though it had run. Sixty-four of the 105 absences rest on exactly two probes: an AGOL search that returned nothing and a host that does not exist.

That is the same shape this program has now found repeatedly — the special-district writer whose verify could never fail, the warm preflight gate wired into one runner of four. A control that structurally cannot fire, counted as evidence that it passed.

The other defects: AGOL discovery is title-gated, so it can only find layers already named for their city; folder recursion is missing, which is what cost Deer Park; broken hosts are indistinguishable from absence; and 105 absences share one boilerplate reason string, with only 13 sampled into the close artifact. The per-city evidence survived only because the probe log happened to be left on disk.

What my own method cannot see, stated plainly: self-hosted servers behind unguessable hostnames — which is exactly how Deer Park was published, and I found it by hand, not by my script, so my automated pass shares Z1's blind spot; zoning published only as PDF or paper, which I made no attempt to enumerate, meaning the ordinance-exists-no-GIS category is certainly undercounted; auth-walled layers; and county-hosted layers I did not enumerate. The true false absence rate across all 105 is probably higher than the 4.8 percent I measured.

My first automated pass also failed exactly the way I was sent to catch. It reported layers found for seven of seven cities on the strength of service names containing "zon" — hurricane evacuation zones, forest seed zones, federal fire attack zones, rail blast zones. Only a noise filter plus point-in-polygon verification collapsed it to one. Name matching manufactures presence as readily as it manufactures absence.

## Task 4: the absence taxonomy

SEARCHED-AND-ABSENT is carrying at least seven distinct states, and each implies different product behaviour:

- **NO-ZONING-AUTHORITY** — unincorporated, no municipal zoning power. A positive fact, safe to serve.
- **REGULATED-NO-EUCLIDEAN-DISTRICTS** — Houston. Serve the constraint layers; never say "no zoning" bare, because that reads as unconstrained and misleads a buyer.
- **ORDINANCE-NO-PUBLIC-GIS** — zoning exists on paper. Honest absence plus citation; goes on the acquisition backlog.
- **GIS-EXISTS-AUTH-WALLED** — an access gap, never a data gap.
- **HOST-BROKEN** — Webster, Conroe. Transient; retry.
- **SEARCHED-AND-ABSENT** — reserved for a real path that ran, returned 200, and found nothing. Must name the paths tried.
- **NOT-FOUND-UNKNOWN-WHY** — where most of Z1's 105 actually belong.

## Task 5: staging corrections

No staging writes were performed by this lane; the atoms slot is held and I did not take it. These are recorded as owed actions.

Deer Park should be recovered and staged with `cityKey` scoping, which is mandatory because its SF1/GC codes collide by name with other cities' codes — precisely the collision the H1 seam's cityKey scoping exists to prevent. Houston must not be staged as zoning; it needs the regime reclassification, the `code_text.publisher` correction, the circular evidence string replaced, and its Chapter 42 layers registered on a non-zoning rail. Webster should be reclassified as a broken host. And the 84 no-signal absences should be downgraded pending a re-probe with folder recursion and org enumeration.

## On the H1 seam question

The concern that a seam proven on two Bastrop cities was then applied to 263 is not confirmed by this lane's evidence. The payload contract's cityKey scoping is sound, and the Deer Park recovery would slot into it cleanly. The Factory 1.5 weakness this lane found is upstream of the seam — it is in discovery, not in the contract.
