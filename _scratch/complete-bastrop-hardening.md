# scratch: complete-bastrop-hardening

Tier 2 — COMPLETE-BASTROP adversarial audit + mold-approval gate. Planner-gated promotion.

## GROUND-TRUTH

- GROUND-TRUTH (2026-07-27T17:12Z QA4 live): retrieval `hauska-retrieval-api-00041-hed` tag `qa4-overpass` @ 100%. `/health/spine/run` osm-overpass=`firing` ways=4893 attempts=2 alert=false (retry recovered). Migration 007 applied. PR #158. Artifact `_inbox/2026-07-27_QA4_live_spine_run.json` + close `_inbox/2026-07-27_QA4_executor_close.md`.

- GROUND-TRUTH (2026-07-27 QA5): `origin/main` `annotation-placement.ts` imports `gis-property-line-tags` (shared). PR #151 MERGED without bearing fork. Local `pr-151-c1` has inlined fork — never remote. Guard test on PR #156.

- GROUND-TRUTH (2026-07-27T16:20Z D1 CLOSED): **Bastrop APPROVABLE** hardening gate. Re-grade `_inbox/2026-07-27_COMPLETE_BASTROP_D1_regrade.md`. All S0/S1 CLEARED live. Premortem GREEN. No silent 254 fan-out — customer QA / mold stamp ceremony still owed.

- GROUND-TRUTH (2026-07-27 A1): engine #154 + LDT #360 MERGED. Gold `48021:33512` sourceUrl=`…/Zoning_Place_Type/FeatureServer/0` adapter=`txgio-zoning-stamp:bastrop-city-tx`. District cohort 5769 AGOL / 0 bake. Tier-1 zoning_has_prov=5769=zoning_present. txgio zj=zd=6213. M0 `zoning-provenance-m0.test.ts` on main.

- GROUND-TRUTH (2026-07-27 B1 LIVE): mig `006_spine_health_probe` applied hauska_mcp. Retrieval 100% → `hauska-retrieval-api-00025-k5b` tag `complete-bastrop` (was stuck on `00037-nil`/`b1map` until traffic update). Live `/health/spine/run` alertCount=1; `bastrop-tx:zoning`=dead-expected; `osm-overpass` dead+alert (504 vs baseline 1000). Artifact `_inbox/2026-07-27_COMPLETE_BASTROP_B1_live_spine_run.json`.

- GROUND-TRUTH (2026-07-27 C2): engine #155 MERGED. `bastrop-tx:zoning` status/provider dead-expected; SmartCity = code lineage only; replacement named AGOL.

- GROUND-TRUTH (2026-07-27 C1): engine #151 + LDT #359. Dual setback SHA256 `76f01124…` identical. `@empressaio/atom-contract@^1.11.0` only.

- GROUND-TRUTH (2026-07-27 COMPLETE-BASTROP audit): Zoning ORIGIN = City of Bastrop AGOL Zoning_Place_Type / PlaceTypeClass. NOT county GIS. NOT SmartCity data. NOT B3 PDF for district facts.

## LESSON

- LESSON (2026-07-27 QA4): osm-overpass DEAD+alert while county-roadway covers is a false red — probe must distinguish degraded-covered (fallback active, no alert) from degraded-no-source (only source down, alert). Silent zero-roads is impossible when resolveHonestRoadCoverage is on the path.
- LESSON (2026-07-27 QA5): Local branch name `pr-151-c1` ≠ what merged as #151. Always `git show origin/main:…` + `gh pr view` before restoring a "fork" that may never have landed.
- LESSON: Gates ≠ liveness. A dead adapter can emit no-coverage while a parallel stamp path fills the ledger — without health probes the gap is only found by archaeology.
- LESSON: "sourceCitation names a bake" is not commitment #1. The bake is a transform; the GIS layer is the origin.
- LESSON: Cloud Run can report deploy Done while 100% traffic stays pinned to an older tagged revision (`b1map`/`00037-nil`). Always verify `update-traffic` + `/health.startedAt` + new route 200.
- LESSON: Adding `dead-expected` to AdapterRunOutcome requires map-layers `MapLayerAdapterOutcome` / slot status widen or engine-api typecheck fails.

## OPEN

- OPEN: Customer QA / mold stamp ceremony — hardening gate cleared; stamp is operator ritual, not silent.
- OPEN: Consider rotating RETRIEVAL_API_KEY (appeared in a gcloud revision YAML dump during B1 cutover).
- OPEN (2026-07-27 QA4 checkin): honest overpass fallback — PR [#158](https://github.com/empressaioemail-tech/hauska-engine/pull/158) SHA `1d19e63`; retrieval `00041-hed` tag `qa4-overpass` @ 100%; migration 007 applied; live osm-overpass firing after retry (attempts=2). Close `_inbox/2026-07-27_QA4_executor_close.md`. Planner grades MET — do not self-grade. B1 probe files extended (flagged).
- OPEN (2026-07-27 QA5 checkin): bearing parity — main already shared-import (fork never landed from #151). Guard PR [#156](https://github.com/empressaioemail-tech/hauska-engine/pull/156) SHA `fb65613` — planner verifies before MET. Close `_inbox/2026-07-27_QA5_executor_close.md`. Local stale `pr-151-c1` still has inlined fork; do not revive.
- OPEN: H5 residual `bastrop_tx` vs `bastrop-city-tx` underscore key if still on some envelopes — non-blocking.

## DEAD-END

- DEAD-END (2026-07-27 QA5): Assuming #151 merged the bearing fork — it did not; only local `pr-151-c1` had the inlined copy.
- DEAD-END (2026-07-27 QA4): gcloud `--update-secrets=A:latest,B:latest` gets split by PowerShell on comma — quote the whole arg or omit and inherit existing secrets.
- DEAD-END: Treating bastrop-tx:zoning (county GIS) as the missing source of the 5769 facts — correctly dead; facts from AGOL Place Type stamp.
- DEAD-END: Treating SmartCity OS as the zoning data source — code lineage only.
