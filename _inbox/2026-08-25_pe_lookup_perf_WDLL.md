---
id: 2026-08-25_pe_lookup_perf_WDLL
title: PE lookup latency + red loading error + search bar desync
date: 2026-08-25
status: approved
plan_row: P-60
operator_go: verbal 2026-08-25 intermittent 15-30s Find; min-instances go; regression since P-60 wave + cortex P-75/P-76
related:
  - _inbox/2026-08-24_red_card_search_bar_WDLL.md
  - _inbox/2026-08-24_lane3_p75_p76_close.json
  - _scratch/setback-serve-wave.md
---

# WDLL: PE lookup perf and honest transient handling

Operator go 2026-08-25. Intermittent 15-30s Find; red "loading problem" card; search bar can show a prior query (e.g. 17001 Simsbrook) while subject is 1003 Spring St / 34873. `hauska-retrieval-api` already runs minScale=1; apply minScale=1 on **cortex-api** (serving `00579-teh` today has no minScale). Isolated hauska-map tree from `origin/main` only.

## Acceptance items

1. **cortex-api warm instance.** Serving revision carries `autoscaling.knative.dev/minScale=1` at the same image digest as pre-change `cortex-api-00579-teh` (403d8010). Traffic 100% on the new revision. Verified by revision annotation read, not deploy command stdout alone. | grade: live gcloud revision describe

2. **Find p95 under cold-start budget on gold.** After deploy, three consecutive live probes on `48021:34137` and one on `48021:34873` (1003 Spring) complete facets-backed card render in under 12s wall each (operator reported 15-30s today). | grade: timed curl or browser probe with timestamp

3. **Search bar clears stale typeahead on subject commit.** When subject store commits parcel B, the Find input and dropdown reflect B's situs (or node id); an open typeahead for parcel A closes. Map click and successful Find both commit. | grade: unit test + one live walk

4. **Transient facets failure does not permanent-red a good node.** If `fetchBakedNodeFacets` returns transient after retries, UI offers retry without claiming "not verified" for a node that succeeded on immediate reselect. No regression on honest absence rows (well-fact atom-miss stays amber/red as today). | grade: test violates permanent error on 500 then 200

5. **No Travis/CAMA scope.** 280238 CAD miss and atom-miss rows are out of scope. | grade: pathspec

## Do not

- Re-merge P-75/P-76 or change cortex SHA beyond minScale overlay.
- Wire city-limits / who-serves PE chips on this card (separate leave_behind).
- Touch A2 pricing tree `fix/pe-pricing-a2`.

## leave_behind

- PE city-limits + who-serves chips (P-75/P-76 close item)
- P-78 LDT PR merge
- LDT PR push in parallel wave lane
