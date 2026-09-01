---
generated: 2026-08-09
lane: F5
status: open-blockers
verdict: NOT-READY for statewide roads ingest
---

# F5 — Roads unblock status (six items + review fixes)

Source: `_inbox/2026-08-09_STATEWIDE_ROADS_adversarial_review.md` (REFUTED). Live code read 2026-08-09.

| # | Item | Status | Evidence |
|---|------|--------|----------|
| 1 | Two-county boundary proof with pre-registered both-sides assertion (realistic diagonal WGS84, not unit squares) | **OPEN** | No such test in `way-to-county.test.ts` or `test_geometry.py`; adversarial measured 99.9% coin-flip on shared diagonal |
| 2 | Collinear epsilon scaled to coordinate magnitude (fix `way-to-county.ts:210` AND `extract_highways.py:150`) | **OPEN** | Both files still use `1e-18` constant (grep verified) |
| 3 | Working RSS measurement (0.0 was instrumentation failure) | **OPEN** | `peak_rss_mb()` still returns None on failure; no fixed measurement artifact |
| 4 | One honest APPLY against throwaway county (direct host, batch bound verified) | **OPEN** | No `ingest_report.json` from product script on disk per adversarial review |
| 5 | Retire-or-supersede contract protecting 7,249 live Bastrop rows (`road-intake-osm-overpass` 4893 + `road-intake-elgin-osm` 2356) | **OPEN** | `writeRoadAtomsBatch` still `ON CONFLICT DO UPDATE` with no version retire path |
| 6 | Synthetic-id collision resolution (partition 800M/900M bands before statewide apply) | **OPEN** | ~1.53M real OSM ids statewide in reserved bands; no partition scheme merged |

**Review fixes (also open):**

| Fix | Status | Evidence |
|-----|--------|----------|
| Taxonomy bound: `proposed`/`construction` ways must not mint pavement-asserting road atoms | **OPEN** | Worker keeps every `highway` key; 64 proposed/construction in Bastrop extract |
| Record source MD5 + exact URL in extract report | **OPEN** | `--expected-md5` supported but report does not record verified hash or pinned URL |

**Planner gate:** statewide roads ingest remains **HELD** until all six close green + adversarial re-review of supersede contract against live Bastrop rows.

**Next dispatch (engine seat):** (1) collinear epsilon patch both TS+Python with two-county diagonal test; (2) RSS instrumentation fix + re-measure; (3) supersede contract design + Bastrop row inventory review; (4) synthetic-id partition ADR snippet; (5) throwaway-county apply brief.
