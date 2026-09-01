---
id: 2026-07-25_R3_verify_checkin
title: Check-in — R3 warm-then-verify closed (WDLL 6 + 8 MET)
status: check-in
date: 2026-07-25
planner: depth-engine planning agent
governs: 27c R3
cites:
  - 27c WDLL 6
  - 27c WDLL 8
related:
  - _dispatches/2026-07-25_R3_warm_then_verify
  - _dispatches/2026-07-25_R3_1_honest_warm_edges
  - _scratch/depth-engine-27c
---

# R3 verify close

## Merges

| Repo | PR | Merge SHA |
|------|-----|-----------|
| hauska-engine | [#126](https://github.com/empressaioemail-tech/hauska-engine/pull/126) | `c2fa0d42` |
| hauska-map | [#69](https://github.com/empressaioemail-tech/hauska-map/pull/69) | `b433ef8a` |

R3.1 honest edges landed on #126 before merge (`342226f` into squash). Uniform-all-fronts fabrication removed.

## WDLL grading

| Item | Grade | Evidence |
|------|-------|----------|
| 6 warm-then-verify | **MET** | Pilot promote `48021:33512` verifyPass=true; bad-inject reject `per-edge offset distance implausible` (vitest + CLI); substrate envelope atom `depthWarmPromotion=depth-warm-promoted-v1`, area 23507, promotedAt 2026-07-25T22:52:11.361Z |
| 8 warm read | **MET** | PE prod `property-explorer-xi.vercel.app` facets → `readPath=atom-chain-warm`, headers `X-PE-Read-Path=atom-chain-warm` + `X-PE-Cold-Derive=skipped`, `depthWarmPromoted=true`; setbacks preserve `not_specified` side/rear |

## Live promote (verbatim)

```json
{
  "event": "depth-warm-bastrop-pilot.done",
  "dryRun": false,
  "results": [{
    "parcelNodeId": "48021:33512",
    "verifyPass": true,
    "promoted": {
      "setbackRuleAtomDid": "did:hauska:setback-rule:48021:33512",
      "buildableEnvelopeAtomDid": "did:hauska:buildable-envelope:48021:33512",
      "promotedAt": "2026-07-25T22:52:11.361Z"
    },
    "buildableAreaSqFt": 23507.393019507977
  }]
}
```

## Live warm-read (verbatim headers + path)

```
STATUS 200
X-PE-Read-Path=atom-chain-warm
X-PE-Cold-Derive=skipped
readPath=atom-chain-warm
depthWarmPromoted=True
```

Envelope disclosure cites depth-warm ledger; front_ft=15; not_specified side/rear true.

## Hold history

Merge held once for R3.1 after planner found uniform-all-fronts fabricated setbacks on P-5 not_specified axes. Honest front-only (`insetFeet=[0,0,0,0,0,15]`) verifies; that path is what promoted.

## Next

R4 — Bastrop depth-cost measurement (operator-routed go/no-go for eager Central-TX depth).
