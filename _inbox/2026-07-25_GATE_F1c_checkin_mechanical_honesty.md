---
id: 2026-07-25_GATE_F1c_checkin_mechanical_honesty
title: F1c finish check-in — mechanical honesty (WDLL 7-9)
status: closed
date: 2026-07-25
applies_to: hauska-map/apps/command-center, hauska-engine/services/retrieval-api
implements: [27a_jurisdiction_factory_engine_spec, 27b_f1_command_center_completion_program]
wdll_items: [7, 8, 9]
owner: nick
related: [2026-07-25_GATE_C_checkin_f1b_wire_ledger_substrate, 2026-07-25_setback_correctness_and_corner_lots_pickup]
---

# F1c CLOSED — mechanical honesty (WDLL 7-9)

No Gate (internal CC + CI). Finish check-in against live-verified state. Setback logic untouched (post-F1 pickup).

## WDLL 7 — mechanical LIVE/STUB badge — MET

**Before:** `PanelRegistry` hand-set `live: true` / `makeStub`. NavRail rendered the constant.

**After:** hauska-map [#64](https://github.com/empressaioemail-tech/hauska-map/pull/64) `b816915`

- Panels declare `stub` | `local` | `probe` intent.
- `usePanelHealth` polls probes; `derivePanelBadge` → `live` | `degraded` | `stub` | `checking`.
- Calibration stays honest **stub** (no fixture-LIVE).
- Contract test: stub+live fails; probe fail → **degraded**.

**Badge-flip evidence (unit, fail-loud):**

```
derivePanelBadge({ probeId: 'retrieval-atom-chain', probe: { ok: false, status: 502 } }) → 'degraded'
derivePanelBadge({ probeId: 'retrieval-healthz', probe: { ok: true, status: 200 } }) → 'live'
assertPanelLivenessContract([{ stub: true, live: true }]) → error
```

## WDLL 8 — end-to-end live smoke — MET

`apps/command-center/src/admin/api/liveSmoke.test.ts` + `.github/workflows/command-center-ci.yml`

**RED (always on CI):** unreachable host / HTTP 502 / missing body → throws `SMOKE RED:…`

**GREEN (dispatch + key):** known parcels `48209:156346`, `48021:34169`, `48029:410119` via live atom-chain; `assertParcelAvailable`.

Source guard: NodeGraph must prefer `stats/central-tx-node-graph`; NavRail must use `usePanelHealth`.

## WDLL 9 — coverage = live tally — MET

**Retrieval:** hauska-engine [#119](https://github.com/empressaioemail-tech/hauska-engine/pull/119) `cf60a0a` → `GET /stats/central-tx-node-graph` (Gate A SELECT). Serving revision **`hauska-retrieval-api-00017-gns` @ 100%** (traffic trap re-hit: deploy created 00017 while traffic stayed on 00016 until `update-traffic`).

**CC:** NodeGraph prefers live tally; static `central_tx_node_graph_tally.json` is STALE fallback only.

**Live probe (verbatim):**

```
GET /stats/central-tx-node-graph  Authorization: Bearer <RETRIEVAL_API_KEY>
HTTP 200
generatedAt=2026-07-25T16:45:43.444Z
source=live SELECT against substrate Neon atoms/atom_links (serving DB)
atoms_total=3626854
travis zoning_present_pct=61.23  travis_nodes=380920
county_count=10  centralTx.rollup.zoning_present_pct=48.96
```

Matches Gate A Travis **61.23%** — coverage is the live ledger, not a committed artifact.

## F1 complete

| WDLL | Grade |
|---|---|
| 1–2 | MET (Gates A–B) |
| 3–6 | MET (Gate C) |
| 7–9 | MET (this check-in) |

**Out of F1:** setback S0'/R0' + corner lots → `_inbox/2026-07-25_setback_correctness_and_corner_lots_pickup.md`.

**Next:** supply-engines program (separate), when operator queues it.
