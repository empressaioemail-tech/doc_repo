---
id: 2026-07-27_COMPLETE_BASTROP_hardening_WDLL
title: WDLL — COMPLETE-BASTROP hardening (mold-approval gate)
date: 2026-07-27
status: approved
owner: nick
last_updated: 2026-07-27 (D1 closed — APPROVABLE)
related: [2026-07-27_COMPLETE_BASTROP_hardening_audit, 27f_bastrop_through_v2_program, 2026-07-27_bastrop_composition_inventory, 2026-07-27_complete_bastrop_hardening_wdll_approved, 2026-07-27_COMPLETE_BASTROP_D1_regrade]
---

# WDLL: COMPLETE-BASTROP hardening

Date: 2026-07-27  Status: **approved** | Operator approval: **2026-07-27**

## Done looks like

Bastrop can be declared the approved mold only when every S0/S1 skeleton is fixed, zoning-fact atoms cite the real GIS origin, Tier-1 snapshots carry zoning provenance, source/engine liveness alerts fire on silent zeros, and dual-repo / vendored debris that would scale to 254 counties is locked or removed. S3 items S-09/S-10/S-13/S-14 are knowingly accepted in writing (`_decisions/2026-07-27_complete_bastrop_hardening_wdll_approved.md`) — no S0/S1 accepted. Audit list re-grades green or knowingly-accepted — never silently dropped.

## Acceptance items

1. Zoning origin named and live-verified (AGOL Zoning_Place_Type / PlaceTypeClass) | check: audit A section + live AGOL count | grade: [x] MET (audit 2026-07-27)
2. Live zoning-fact for gold parcels cites GIS origin (sourceUrl + sourceCitation), not only the breadth bake intermediate | check: SELECT atom body for 48021:33512/34785/28286 | grade: [x] **MET** A1
3. Tier-1 snapshot zoning.provenance (+ top-level zoningSource) non-empty for every Bastrop row with a district | check: SELECT count zoning_has_prov = zoning_present | grade: [x] **MET** A1 (5769=5769)
4. txgio_parcel.zoning_jurisdiction = bastrop-city-tx on stamped Bastrop districts | check: SELECT zj = zd for 48021 | grade: [x] **MET** A1 (6213=6213, zd_without_zj=0)
5. Bake/snapshot M0 guard fails closed when district present and zoning provenance sourceUrl empty | check: unit test red on stripped fixture, green on cited | grade: [x] **MET** A1 (main)
6. Health probe pack for Bastrop sources+engines writes firing/degraded/dead continuously; silent zero-with-baseline ALERTS | check: force a mock zero → alert row; live probe paste | grade: [x] **MET** B1 (live run alertCount=1 osm-overpass)
7. CC-A (or retrieval JSON) surfaces the health board honestly — port existing shell, do NOT invent a third organism | check: live panel or GET health summary | grade: [x] **MET** B1 (map #79 + live GET /health/spine)
8. Dual bastrop-city-tx setback JSON hash-locked across engine and LDT (or single published package) | check: CI / matching SHA | grade: [x] **MET** C1 (SHA256 match)
9. parcel-terrain-model vendored alias removed; atoms package on published contract >=1.10.0 (npm is 1.11.0) | check: package.json + no vendor comment | grade: [x] **MET** C1 (^1.11.0)
10. Dead bastrop-tx:zoning labeled dead-expected; SmartCity/county comments corrected; registry does not imply live county zoning | check: code review + adapter status probe | grade: [x] **MET** C2 (#155)
11. Ranked skeleton list re-graded: all S0/S1 met; S3 only per written acceptances | check: finish card in session close | grade: [x] **MET** D1
12. Premortem on "approve Bastrop as mold" returns green (or yellow only on acknowledged operational items) | check: planner premortem after fixes | grade: [x] **MET** D1 (GREEN)

Dependencies: A1 (2–5) ∥ B1 (6–7) ∥ C1 (8–9) → C2 (10) → D1 (11–12) → customer QA / mold stamp.

Negative done-line (NOT done if ANY): mold approved while zoning cites only the bake URL; health board absent while an adapter is silently dead; dual setback tables diverge without a lock; S0/S1 closed by prose without a live SELECT; S0/S1 “accepted” without operator writing.

## Amendments

- 2026-07-27: Operator approved. S3 acceptances S-09/S-10/S-13/S-14 only. Item 10 scoped to C2 after C1. Fan A1/B1/C1.

## Finish card (graded at close)

| Item | Grade | One-line evidence |
|---|---|---|
| 1 origin named | MET | AGOL Zoning_Place_Type / PlaceTypeClass |
| 2 gold cites GIS | MET | 48021:33512 sourceUrl=…/Zoning_Place_Type/FeatureServer/0 |
| 3 Tier-1 provenance | MET | zoning_has_prov=zoning_present=5769 |
| 4 zoning_jurisdiction | MET | zj_city=zd=6213 |
| 5 M0 bake guard | MET | zoning-provenance-m0.test.ts on main |
| 6 health alerts | MET | live spine/run alertCount=1; dead-expected quiet |
| 7 health board | MET | GET /health/spine + CC panel #79 |
| 8 setback hash-lock | MET | SHA256 identical engine↔LDT |
| 9 contract pin | MET | @empressaio/atom-contract@^1.11.0 |
| 10 adapter honesty | MET | #155 dead-expected |
| 11 S0/S1 re-grade | MET | `_inbox/2026-07-27_COMPLETE_BASTROP_D1_regrade.md` |
| 12 premortem | MET | GREEN (op yellow #4 only) |

**Verdict: Bastrop APPROVABLE (hardening gate).** Customer QA / stamp next.
