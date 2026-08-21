# Scratch — statewide roads (L3) 2026-08-09 build-prove

## GROUND-TRUTH
- 2026-08-09: Geofabrik MD5 4dd27afd6bc1c654f9b9635b709cf424 MATCH @ P:\tmp\statewide-roads\texas-latest.osm.pbf (713163541).
- 2026-08-09: Product worker extract keptIntersecting=23954; city∩ compare recall 1.0 / +3 service ways. Peak RSS remesasured 2842.17 MB (extract_report_rss.json). First run peakRssMb=0.0 was WinAPI fail.
- 2026-08-09: Live Bastrop road-nodes 19907; road-intake-osm-overpass=4893 exactly = city fixture. Pilot=1187 subset. Overlays dominate.
- Engine PR #290 OPEN @ 6ba439a (pyosmium worker). #288 MERGED resolver.
- Adversarial REFUTED (boundary coin-flip, Node ingest never ran, silent upsert hazard, synthetic ids).

## LESSON
- Publish peakRssMb=0.0 when WinAPI fails is worse than omitting the field — reads as a bound.
- One-county city-interior compare proves PBF decoder, not way-to-county.
- Collinear abs(orient)<1e-18 is dead under real WGS84 diagonals (~1e-15 noise).

## DEAD-END
- Overpass statewide — do not retry.
- PowerShell -Encoding utf8NoBOM (not valid on this host) — use UTF8 or .NET API.

## OPEN
- Two-county TIGER shared-edge proof + metric near-boundary buffer.
- Re-ingest/supersede contract before any Bastrop apply.
- Re-namespace 700M/800M/900M; taxonomy; labelEdges prefilter.
- Run product ingest-statewide-roads-pbf.mjs dry-run once (monorepo tsx) and file ingest_report.json.
- Report: _inbox/2026-08-09_STATEWIDE_ROADS_build_prove_report.md
