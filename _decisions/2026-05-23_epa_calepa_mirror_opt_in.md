---
decision_id: 2026-05-23_epa_calepa_mirror_opt_in
date: 2026-05-23
owner: Nick
status: active
related_canonical: [00_current_state, 43_cortex_qa_backlog, 46_smartcity_parcel_intelligence]
related_sessions: [_sessions/2026-05-23_qa22_epa_path1a_cc-agent-C.md]
---

## Decision

Opt into the CalEPA-hosted `EJSCREEN_2023_BG_StatePct_with_AS_CNMI_GU_VI_gdb` FeatureServer as the EPA EJScreen data source for Cortex site-context. Re-enable the `epa:ejscreen` adapter against the third-party mirror at `services2.arcgis.com/iq8zYa0SRsvIFFKz/arcgis/rest/services/EJSCREEN_2023_BG_StatePct_with_AS_CNMI_GU_VI_gdb/FeatureServer/0`. Three policy deltas explicitly accepted; mitigated in the implementation per "Implementation requirements" below.

## Context

`ejscreen.epa.gov` (the original EJScreen REST broker) was decommissioned by EPA in late 2024 with no published successor. The QA-22 SCOPE A Path 1a recon (cc-agent-C, 2026-05-23) confirmed full retirement across DNS / web pages / data.gov / EPA ArcGIS REST sweep (`geopub.epa.gov` 28 folders + `gispub.epa.gov` 25 folders + `edg.epa.gov/data/PUBLIC/OEI/` + EPA Esri Online org search). The CalEPA-hosted mirror is the only national-coverage source still emitting the full EJScreen block-group percentile schema (5/5 indicators preserved + Moab UT live-queryable, returning BG 490190002004 with all 5 fields populated).

Planner recommended NO (leave EPA pill red) on the basis that the federal-tier-source promise + state-percentile silent-drift risk outweighed having one more green pill. Operator overrode with YES — recovering EJ indicator coverage on Cortex briefings is worth the three deltas given that EPA's v2 timeline is unbounded.

## Three policy deltas accepted

1. **Not EPA-owned.** Mirror is hosted on a third-party ArcGIS Online tenant (`services2.arcgis.com`, owner `1045138_CAL`). Could be taken down or stop refreshing without notice. Federal-tier promise on Redd softens to "federal-source-data via state-agency mirror until EPA publishes v2."

2. **State-distribution percentiles, not US-distribution.** Layer is named `EJSCREEN_StatePctiles_with_AS_CNMI_GU_VI`. A `P_PM25=78` from this mirror means "78th percentile of PM2.5 within this state", whereas the old broker's `P_PM25=78` meant "78th percentile of PM2.5 nationwide". For Utah block groups with PM2.5 near the state's higher end, state percentile reads HIGHER than US percentile. Reader needs to know they're reading state-relative, not US-relative.

3. **Demographic-index methodology shift between 2022 → 2023.** `P_D2_VULEOPCT` (old broker, 2022 EJScreen) → `P_DEMOGIDX_2` (2023 mirror) is more than a rename: EJScreen 2023 dropped "vulnerable" from the demographic-index components (vulnerable + low-income + people-of-color → people-of-color + low-income). Historical comparisons across the 2022 → 2023 cutover are apples-to-oranges. Cortex didn't carry historical EJScreen state, so this is forward-only — but worth flagging in case any briefing prose references "EJScreen 2022 numbers" implicitly.

## Implementation requirements (cc-agent-C follow-on dispatch)

The adapter swap MUST surface these deltas to the reader. Silent URL swap is NOT acceptable.

1. **Source attribution UI copy** — briefing surface naming the EJScreen source must read "EJScreen 2023 (CalEPA mirror — EPA EJScreen API retired, awaiting v2)" or equivalent, NOT just "EJScreen". The federal-tier promise is softened with attribution, not erased.

2. **State-percentile UI disclosure** — wherever a percentile is rendered, the reader must see "state percentile" not just "percentile". Tooltip / label / column header — cc-agent-C's call on where it surfaces, but it must surface.

3. **Refresh-threshold tagging** — mirror was last updated 2024-01-29 (~16 months stale at decision time). Adapter's `freshness threshold` field should reflect this; pills should tag as stale per the existing stale-source pattern if the mirror stops refreshing.

4. **Reversal path documented** — when EPA publishes EJScreen v2, the adapter swaps back to the EPA endpoint via a fresh dispatch. The dead-end ledger in `epa-ejscreen.ts` docstring (already written) gains a re-enable date when that happens.

## Reversal criteria

Roll back to "leave EPA pill red until EPA publishes v2" if:

1. **CalEPA tenant takes the mirror down** — pills go red, planner re-files SCOPE A as a fresh recon.
2. **EPA publishes EJScreen v2** — swap back to EPA endpoint via fresh dispatch; the CalEPA mirror becomes a documented historical fallback in the dead-end ledger.
3. **Operator changes mind on state-percentile silent-drift risk** — disable adapter (pills go red), re-evaluate.
4. **A Cortex briefing surfaces an embarrassing reading** that traces to state-vs-US percentile confusion — pause adapter, audit briefing UI copy, re-enable with stronger disclosure.

## Hauska doctrine note

This decision is **adjacent to** but does NOT modify the partnership-first scoping ruling ([`_decisions/2026-05-23_partnership_first_scoping.md`](2026-05-23_partnership_first_scoping.md)). The CalEPA mirror is a state-agency-hosted public-records archive, not city operational data. Same out-of-scope rationale that put Regrid in-doctrine applies here. The "third-party hosting" delta is real but it's a federal-tier-promise softening, not a partnership-first violation.
