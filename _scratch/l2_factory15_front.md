# L2 Factory 1.5 front half — scratch

## GROUND-TRUTH (2026-08-12T23:46Z)
- eng #328 merged @ 9ea8fc5; CI check-run conclusion success (rerun after preflight-probes flake)
- deer-park-tx staged 301 rows / 18 codes from WGS84/Zoning_WGS84/MapServer/0
- bartonville-tx staged 109 / 11
- houston-tx NO-EUCLIDEAN-REGIME; 0 staging rows
- county-hosted enclave GATE_UNMET

## LESSON
- ArcGIS folder listings often return service names already folder-prefixed; joining folderPath+name doubles paths (WGS84/WGS84/...)
- Layer extents are frequently Web Mercator 102100 — must convert before city bbox overlap
- Strong Euclidean code evidence required; bare C1/A1 map-grid tokens false-positive
- Multi-scale cartographic MapServers can expose 200+ duplicate Feature Layers — structural layer-count cap needed
- Node TLS leaf failures on Windows: curl.exe system-CA fallback (sweep pattern)

## DEAD-END
- Early-exit on first Euclidean candidate selected EnerGov parcel basemap over Zoning_WGS84
- Blind Hub fan without service-granularity / seed-first policy hung Bartonville for 10+ minutes

## OPEN
- County-hosted enclave verification city still needed for full 5/5 source-type bar (P-21 re-probe can keep searching)
- Houston constraint payload treatment (lot size / building lines) still owed — not zoning staging
