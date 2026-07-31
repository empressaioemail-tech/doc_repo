---
id: 2026-07-31_BASTROP_BLOCK13_CERT_RESTORED
title: BASTROP Block-13 CERT RESTORED — mechanical 7/7 + operator R6 both gates passed
date: 2026-07-31
status: cert-restored
owner: planner
supersedes: 2026-07-30_block13_cert_first_run_matrix (revoked 2026-07-30 cert)
related: [2026-07-29_setback_authoritative_source_and_road_decouple, 2026-07-30_block13_cert_first_run_matrix, 28_THE_BASTROP_MOLD_engine_build_spec, _STATE]
purpose: Restore the Block-13 cert after AMENDMENT 17 R32. Two independent gates — mechanical 7/7 (R32 engine-frame measurement + road-node front-orientation) and operator R6 live block-QA — both pass. Restores the cert revoked 2026-07-30.
---

# BASTROP Block-13 CERT RESTORED

Block-13 (7 downtown-Bastrop parcels on Pecan / Chestnut / Pine) is CERTIFIED. Both required gates from AMENDMENT 17 R32 pass.

Verdict: BLOCK-13 CERT RESTORED — both gates passed (mechanical 7/7 + operator R6). This SUPERSEDES the cert revoked 2026-07-30.

## The two gates

GATE 1 — MECHANICAL 7/7 (this session, read-only). Graded 2026-07-31 by the durable cert script `packages/engine-core/scripts/block13-cert-grade.mjs` against the LIVE serving substrate: parcel rings from live BCAD ArcGIS, promoted buildable-envelope + zoning-fact + setback-rule + road-node atoms from serving Neon (DATABASE_URL), situs from CORTEX/TXGIO Neon. Four fail-closed gates per parcel. No prod writes, no re-warm.

GATE 2 — OPERATOR R6 (given). Operator R6 live block-QA PASSED: all 7 parcels eyeballed on the deployed surface, orientation confirmed, 34177 (the irregular MU parcel) spot-verified correct.

## Per-parcel matrix (mechanical grade, real numbers)

Per-edge inset = R32 INDEX-MATCHED INWARD-NORMAL measurement (the engine's own promote frame, not perpendicular-to-nearest-edge). Front-street = the FRESH `labelEdgesFromRoads` front edge's backing road, resolved by osmWayId, token-matched to the answer key via the engine's own street normalizer (front basis situs-street-match on all 7).

| APN | Situs | District (served) | Setbacks served (F/S/corner/R) | Front street (resolved) | Per-edge inset match (R32 engine-frame) | PASS |
|---|---|---|---|---|---|---|
| 34145 | 909 Pecan | GC | 20 / 5 / – / 20 | Pecan (edge 2) | rear 20, side_corner 5, front 20, side 5 | PASS |
| 34121 | 907 Chestnut | GC | 20 / 5 / – / 20 | Chestnut (edge 0) | front 20, side 5, side 5, side 5, rear 20, side_corner 5 | PASS |
| 34153 | 909 Chestnut | GC | 20 / 5 / – / 20 | Chestnut (edge 1) | side_corner 5, front 20, side_corner 5, rear 20 | PASS |
| 34137 | 908 Pine | SF-1 | 25 / 5 / 15 / 25 | Pine (edge 3) | side_corner 15, rear 25, side 5, front 25 | PASS |
| 34169 | 906 Pine | SF-1 | 25 / 5 / 15 / 25 | Pine (edge 3) | side 5, rear 25, side 5, front 25 | PASS |
| 34177 | 901 Pecan | MU | 15 / 5 / – / 15 | Pecan (edge 2) | side 5, side 5, front 15, rear 15 | PASS |
| 34161 | 905 Pecan | MU | 15 / 5 / – / 15 | Pecan (edge 2) | rear 15, side 5, front 15, side 5 | PASS |

Every per-edge inset lands on its role's expected setback within 1.0 ft (all measured exact to the foot). Every served district + setback matches the answer key on the served zoning-fact + setback-rule atoms. Every front edge faces the correct street.

Score: 7 / 7 — CERT-RESTORE ELIGIBLE. Combined with operator R6 pass: RESTORED.

## What the four gates assert

1. District — served `zoning-fact.district` AND `setback-rule.districtCode` == answer key. Split-zone parcels (34121 GC, 34161 MU, 34169 SF-1) carry their R26 dominant district.
2. Setbacks — served `setback-rule` per-role numbers (front / rear / sideInteriorFt / sideCornerFt) == answer key, corroborated by the engine's own `verifySetbackEdgeDistance` gate (pass, zero reasons on all 7).
3. Per-edge inset — R32 index-matched inward-normal inset (shipped `measurePerEdgeInsetForRings`, merged 61895f0 / #199) matches each edge's role setback. This is the method that recovers the correct insets on the two irregular lots (34121 6-edge L-hexagon, 34177 MU notch) that the retired perpendicular-to-nearest-edge measurer false-flagged.
4. Front orientation — fresh `labelEdgesFromRoads` front edge resolves to the correct street frontage (situs-street-match basis on all 7), corroborated by the engine's `verifyFrontEdgeOrientation` gate (pass on all 7).

## Why this restores the revoked cert

The 2026-07-30 cert was revoked because a perpendicular-to-nearest-edge re-grade (re-grade #2 in the first-run matrix) reported 3/7 on the drawn envelopes, false-flagging the irregular lots. AMENDMENT 16/17 (R30/R31/R32) established via two blind measurers that the ENVELOPES ARE CORRECT and the nearest-edge measurement was the bug. R32 fixed the shipped measurement (`packages/engine-core/src/depth-warm/measure-inset.ts`, merged 61895f0). AMENDMENT 17 named the two remaining cert-restore conditions: (1) fix the R31 harness to R32 engine-frame measurement so it stops false-flagging, (2) operator R6 live block-QA. Both are now satisfied — the mechanical grade uses R32 and reads 7/7, and operator R6 passed. The engine work was already done; this closes the harness gap and restores the cert.

## Harness fix (this session)

The block-cert harness had two issues that would have made its automated grade show <7/7 even though the block is correct:

1. It measured perpendicular-to-nearest-edge. FIXED — the cert script now uses `measurePerEdgeInsetForRings` (R32 index-matched inward-normal, the shipped measurer), not an ad-hoc nearest-edge measurer.
2. Its front-street orientation gate returned null in read-only runs (`nearestStreetForEdge` had no situs/street data wired), leaving `orientOk` undefined. FIXED — the orientation gate now takes the fresh `labelEdgesFromRoads` front edge, resolves its backing road by osmWayId from the loaded road-node atoms, and token-matches the road name to the answer-key front street using the engine's own `normalizeStreetNameForMatch`. This is the same situs-street-match / road-node data the engine's `labelEdgesFromRoads` uses; no ad-hoc re-derivation.

The fix is a clean, durable, committed cert script at `packages/engine-core/scripts/block13-cert-grade.mjs` (the prior harness was untracked scratch). Read-only; exits non-zero if the block is not 7/7 so callers can gate on it. Run:

```
DATABASE_URL=... CORTEX_DATABASE_URL=... \
  pnpm --filter @hauska-engine/engine-core exec tsx scripts/block13-cert-grade.mjs
```

## Residuals (non-blocking, carried from the first-run matrix)

- Boundary-edge PRIMITIVE atoms still carry legacy descriptor-fixture / repealed-B3 sourceUrls + road-class-setback-table setback=0. The authoritative served setback-rule OVERRIDES them (decoupled + non-corrupting), but they are stale and worth a cleanup pass. Does not affect the grade.
- Second-source disclosure (R25 layer-83 Revisions conflict callout) is a card-display concern, already handled in PE #120.

## Method

The mechanical cert grade (served-atom district/setback audit + R32 engine-frame per-edge measurement + road-node front-orientation) is the durable automated QA instrument. Replicate the method to a next block after Block-13; CTX / national remain HELD until operator go.
