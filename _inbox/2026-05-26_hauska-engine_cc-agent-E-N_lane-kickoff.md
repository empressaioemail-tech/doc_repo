---
id: 2026-05-26_hauska-engine_cc-agent-E-N_lane-kickoff
title: Inbox — cc-agent-E-N Sync 5 lane North kickoff
date: 2026-05-26
agent: cc-agent-E-N
repo: hauska-engine
clone: P:\hauska-engine-e-north
kind: inbox
status: active
---

# Sync 5 lane North — kickoff report (cc-agent-E-N)

**Clone:** `P:\hauska-engine-e-north` (bootstrapped 2026-05-26; lane base branch `stream-1d/sync5-lane-north` on `main`).

**Throttle:** Municode JSON client set to **0.5 req/sec** in this clone (`packages/corpus/src/adapters/municode/json-client.ts`). `NODE_OPTIONS=--use-system-ca` on all `pnpm`/`tsx`.

## Shipped (PR held for operator merge)

| City | Atoms | Eval | PR | Branch |
|------|------:|------|----|--------|
| **Watauga, TX** | 235 | 1.0 / 1.0 / 1.0 | [#51](https://github.com/empressaioemail-tech/hauska-engine/pull/51) | `stream-1d/sync5-north-watauga-tx` |
| **Plano, TX** | 476 | 1.0 / 1.0 / 1.0 | [#56](https://github.com/empressaioemail-tech/hauska-engine/pull/56) | `stream-1d/sync5-north-plano-tx` |

Path C scope: Municode clientId **4818**, `Subpart B - LAND DEVELOPMENT` wrapper (`^subpart b ` chapter filter). `accessPolicy: platform-internal`.

**Note:** Git cannot nest `stream-1d/sync5-lane-north/<city>` when `stream-1d/sync5-lane-north` exists as a branch; city branches use flat name `stream-1d/sync5-north-<city>-tx`.

## Skipped (already on main)

Crowley, Saginaw, Keller — per metro batch PRs #43–#46.

## Municode discovery (DFW probe, 2026-05-26)

| City | `/Clients/name` | clientId | Lane action |
|------|-----------------|----------|-------------|
| Plano | ✅ | 3886 | **Next ingest** — Ch. 6, 16, Appendix A (zoning) |
| McKinney | ✅ | 3241 | P1 queue |
| Denton | ✅ | 1916 | P1 queue |
| Richardson | ✅ | 4063 | P1 queue |
| Lewisville | ✅ | 3016 | P1 queue |
| Allen | ✅ | 990 | P2 queue |
| Grapevine | ✅ | 2427 | P2 queue |
| Irving | ❌ NO-RESULT | — | → `73_partnerships.md` |
| Garland | ❌ NO-RESULT | — | → `73_partnerships.md` |
| Frisco | ❌ NO-RESULT | — | → `73_partnerships.md` |
| Carrollton | ❌ NO-RESULT | — | → `73_partnerships.md` |

## Partnership recon only (no scrape)

Fort Worth, Arlington, Mansfield, Burleson, NRH — already in `73_partnerships.md` Publisher-TBD bucket (2026-05-23 metro batch).

**Dallas city proper** — appended to `73_partnerships.md` as eCode360 / Sprint 51 partnership-track (2026-05-26).

**Irving, Garland, Frisco, Carrollton** — appended to Publisher-TBD bucket (2026-05-26).

## In progress

- **McKinney, TX** — next P1 Municode ingest (clientId 3241).

## Out of scope (this lane)

- `tocRootNodeIds` adapter (E-C)
- Cedar Hill — already ingested (`cedar_hill_tx` on main; QA-60 engagement city)

## Running totals (lane North, session)

| Metric | Value |
|--------|------:|
| Cities with open PR | 2 |
| New atoms (Watauga + Plano) | 711 |
| platform-internal | 711 |
| Partnership rows added | 5 (Dallas + 4 NO-RESULT suburbs) |

## Next

1. Operator merge PRs #51 (Watauga), #56 (Plano).
2. McKinney, Denton, Richardson, Lewisville (P1 Municode queue).
4. Panhandle / East TX after DFW Municode queue thins.
