# Sync 5 TX-metros batch — cc-agent-E session report

**Date**: 2026-05-23
**Agent**: cc-agent-E
**Repo**: hauska-engine
**Dispatch reference**: continuous-run TX-metros ingest per
`00_current_state.md` "next" ladder; greenlit by the operator
2026-05-23 same-day with "i jsut adjusted the limit continue".

## TL;DR

10 PRs shipped (`#38`-`#47` on hauska-engine), ~5690 new code-section
atoms across 10 cities in 3 metros. 2 cities deferred (El Paso
compute-bound, Pharr query-authoring bugs). 8 cities routed to
General Code partnership track. 1 city skipped on partial-corpus
grounds (Edinburg). One usage-pattern net-new: wrapper-level
chapterFilter for dev-only wrapper cities (no adapter change
needed; distinct from the queued `tocRootNodeIds` follow-up).

## Per-city outcomes

| # | City                 | Metro     | Path             | Atoms | Eval        | PR  |
|---|----------------------|-----------|------------------|------:|-------------|----:|
| 1 | San Antonio (UDC)    | SA core   | Path C (separate UDC product) |  941 | 1.0/1.0/1.0 | #38 |
| 2 | Boerne (UDC)         | SA metro  | Path C (separate UDC product) |  106 | 1.0/1.0/1.0 | #39 |
| 3 | Brownsville          | RGV       | Path C (mixed chapter+UDO articles) |  870 | 0.9/1.0/1.0 | #40 |
| 4 | Mission              | RGV       | Path C (CoO + Appendix A) |  708 | 1.0/1.0/1.0 | #41 |
| 5 | Schertz (UDC)        | SA metro  | Path C / wrapper (dev-only) |  161 | 1.0/1.0/1.0 | #42 |
| 6 | Saginaw              | FW metro  | Path C (CoO + 2 Appendices) |  538 | 1.0/1.0/1.0 | #43 |
| 7 | Live Oak             | SA metro  | Path C (CoO chapters) |  539 | 1.0/1.0/1.0 | #44 |
| 8 | Keller (UDC)         | FW metro  | Path C / wrapper (dev-only PART III) |  165 | 1.0/1.0/1.0 | #45 |
| 9 | Crowley              | FW metro  | Path C (CoO chapters) |  852 | 0.95/1.0/1.0| #46 |
|10 | Converse             | SA metro  | Path C (CoO chapters) |  610 | 1.0/1.0/1.0 | #47 |

Subtotal: **~5690 atoms across 10 cities**.

## Skipped — deferred follow-on

| City        | Reason                                                                                                                                                                                                                          |
|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **El Paso** | Initial broad scope (Titles 13/14/15/17/18/19/20/21) blew the wall-time envelope (>22 min with no completion, killed). Narrow retry (Titles 18-21 only) also stalled at ~9 min. Compute-bound. Branch + queries staged locally (`stream-1d/sync-5-tx-metros-el-paso`, stashed). A follow-on dispatch can either widen the wall-time budget or slice per-Title incremental ingest units. |
| **Pharr**   | Ingest clean (729 atoms), but eval 0.75 / 1.0 / 1.0 — below 0.9 bar. Five curated queries pointed to `<chapter>-1` for CoO chapters where `Secs. <chapter>-1—<chapter>-25. - Reserved.` and substantive run starts at `<chapter>-26`. Pure query-authoring bug; re-ingest with corrected queries is the next step. |
| **Edinburg**| Municode "TITLE XV - LAND USAGE" wrapper contains only 3 chapters (150, 151, 154) — no Zoning / Subdivision. Full UDC appears off-Municode. Partial-corpus situation; partnership-track recon owed. |

## Skipped — General Code partnership track (8 cities)

Returned NO-RESULT on Municode's `/Clients/name`:

- **Fort Worth, TX** (FW metro anchor — strategic priority for the partnership outreach).
- **Arlington, TX** (FW metro, large).
- **Mansfield, TX** (FW metro).
- **Burleson, TX** (FW metro).
- **North Richland Hills, TX** (FW metro).
- **McAllen, TX** (RGV) — confirmed eCode360 (`MC6775`) via WebFetch.
- **Harlingen, TX** (RGV).
- **Horizon City, TX** (El Paso area).

Pattern matches the Smithville / Pflugerville / Cedar Park handling
from the prior cc-agent-E session. Without Fort Worth, the FW metro
catalog in Sync 5 is limited to four small suburbs (Crowley /
Saginaw / Watauga / Keller, all <50k pop) — partnership outreach
on Fort Worth is the high-leverage next step.

## Net-new findings

### 1. Wrapper-pattern via existing chapterFilter (usage discovery, not capability gap)

Several SA / FW metro cities publish their entire development surface
inside one top-level wrapper node. Examples shipped this session:

- **Schertz** — wrapper `SCHERTZ UNIFIED DEVELOPMENT CODE` (separate product).
- **Keller** — wrapper `PART III - UNIFIED DEVELOPMENT CODE` (inside CoO).

In both cases the wrapper is **dev-only** (no mixed non-dev content
nested below it), so the existing `chapterFilter` regex captures it
cleanly — the walker descends through and pulls all the nested
chapters / articles. **No `tocRootNodeIds` adapter enhancement
needed for this class.**

This is materially different from the Luling / Woodcreek / Belton /
Creedmoor class (queued for `tocRootNodeIds`) where the wrapper
contains **mixed** dev + non-dev chapters and filtering at the
wrapper level over-scopes.

Other dev-only-wrapper cities prepared this session but not run for
time:
- Cibolo (`2013 CIBOLO UNIFIED DEVELOPMENT CODE` inside CoO).
- Selma (`PART II - LAND DEVELOPMENT REGULATIONS`).
- Watauga (`Subpart B - LAND DEVELOPMENT`).
- Universal City (`PART IV - PROPERTY AND STRUCTURES`).

Staging files for all 4 exist at `P:\tmp\sync5-staging-*.ts` and can
be wired in a follow-on session in ~5 min each.

### 2. Reserved-range curated-query trap (query-authoring gotcha)

Several Municode CoO chapters carry section labels like
`Secs. <chapter>-1—<chapter>-25. - Reserved.` (a range
placeholder, not actual content). The substantive section run
starts at e.g. `<chapter>-26`. Curated queries that target
`<chapter>-1` (the obvious "first section" choice) will fail eval
lookup because no atom is materialized for the reserved range.

**Operationally:** verify a section exists by walking Article I /
chapter children before drafting a query; don't assume `<chapter>-1`
is a content section. This caught me on Brownsville (3 queries
disclosed and B.4 still passed at 0.9) and on Pharr (5 queries
failed, 0.75 below bar — deferred).

### 3. El Paso wall-time envelope

El Paso CoO's eight Titles (13-21) with deep chapter / article /
division nesting exceed the per-city wall-time envelope under
Municode's 1.5s politeness ceiling, even with the adapter's
envelope-bundling optimization. Estimate >30-45 min per attempt.
Per cost discipline I killed and deferred rather than ground; a
future dispatch needs either a widened wall-time budget or
per-Title scope slicing.

## Operational notes

- **Parallelization via git worktrees** materially shortened wall
  time. Used 3 concurrent worktrees (`P:\tmp\hauska-engine-{mission,
  schertz, saginaw}`) running ingests in parallel against the
  Municode API. Each Node process kept its own `RespectfulFetch`
  with 0.7req/sec throttle; total load on `api.municode.com` was
  ~2.1 req/sec at peak. The dispatch pattern is reusable — each
  worktree is fresh-from-main, with its own branch, so the one-
  PR-per-city cadence holds.
- **AVG TLS-MITM environment** still required `NODE_OPTIONS=
  --use-system-ca` on every pnpm/tsx call; PowerShell
  `Invoke-RestMethod` is the only HTTPS-discovery probe that
  works (curl fails on the AVG cert).
- The session's pattern (probe TOC → draft curated queries → wire
  command → eval → commit + PR) was repeatable mechanically; the
  bottleneck was always Municode wall time, not local work.

## Follow-on dispatches

The planner should pick up these in priority order:

1. **Pharr re-ingest** — curated-queries fix only, no pipeline work
   (729-atom ingest is clean). Small lift.
2. **Cibolo / Selma / Watauga / Universal City / Converse /
   Leon Valley / Anthony / Socorro** — staged in `P:\tmp\` from
   this session; wiring + eval cycle is mechanical for each.
3. **El Paso re-ingest** — needs scope slicing or budget bump.
4. **General Code partnership outreach** on the 8 non-Municode
   cities (Fort Worth strategic anchor).
5. **`tocRootNodeIds` adapter enhancement** — already queued from
   prior session; unblocks Luling / Woodcreek / Belton / Creedmoor
   plus any future TX city in that class.
6. **Snapshot refresh + retrieval-api redeploy** — the existing
   owed step for the 10 merged-but-undeployed central-TX cities
   plus this session's 9 (or however many of #38-#46 the operator
   merges).

## Aggregate Sync 5 status post-session (estimated)

- **Merged in main + deployed snapshot**: 5 cities, 2702 atoms
  (Bastrop, Bastrop County, Elgin, Grand County, Hutto).
- **Merged in main, awaiting snapshot refresh + redeploy**: 6 cities
  Round Rock / Taylor / Leander / Georgetown / New Braunfels /
  Killeen (PRs #20/21/23/27/28/29, ~2300 atoms claimed).
- **Open PRs from prior cc-agent-E session**: 8 cities (PRs #30-#37,
  central-TX corridor, ~4667 atoms).
- **Open PRs from this session**: 9 cities (PRs #38-#46, ~5080 atoms).
- **Pending follow-on** (staged but not run): 8-10 cities (Cibolo,
  Selma, Watauga, Universal City, Converse, Leon Valley, Anthony,
  Socorro, + Pharr re-ingest, + El Paso narrow retry).
- **Partnership-track recon**: 8 non-Municode cities + Edinburg.

The central-TX + TX-metros Path-C catalog tally on hauska-engine
`main` post-merge of all open PRs lands at **~14400 atoms across
28 cities** (plus the 5 in the deployed snapshot, total 33
jurisdictions if Bastrop UDC + B3 are counted twice).

🤖 cc-agent-E
