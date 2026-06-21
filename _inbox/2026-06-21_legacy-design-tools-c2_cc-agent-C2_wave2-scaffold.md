---
id: 2026-06-21_legacy-design-tools-c2_cc-agent-C2_wave2-scaffold
title: cc-agent-C2 — Wave 2 calibration-engines scaffold + raw-events collector
date: 2026-06-21
agent: cc-agent-C2
repo: legacy-design-tools-c2
branch: cortex/precedence-taxonomy-intra-federal
dispatch: Calibrated Spine Wave 2 — scaffold lib/calibration-engines (read-only); raw-events/collect.ts; NO grader/meta-cal/weighting
tasks: [2-C2-0, 2-C2-1]
blocks_unblocked: [Wave 3 K3/K5/S-track when deps met]
---

# Close — Wave 2 calibration-engines scaffold

## Summary

Scaffolded **`@workspace/calibration-engines`** on the **legacy-design-tools-c2** clone as a read-only package. Landed **`raw-events/collect.ts`** — a read-time join over `atom_events` × `findings` × `engagements` that emits normalized raw events (adjudication + outcome/backtest), tolerant of Phase-1 rows missing F3 rich stamps. Confirmed **derive-at-read** against operator Decision 5: **`atom_calibration_overlay` is cache only**; C2 engines compute `calibratedConfidence` at read from raw ledger, never from materialized overlay rows.

**Not built (blocked):** K3, K5, S1, S2, S3 — per dispatch.

---

## Package skeleton

```
lib/calibration-engines/
  package.json          @workspace/calibration-engines
  tsconfig.json         composite; references db + codes
  vitest.config.ts
  src/
    index.ts
    raw-events/
      types.ts          RawCalibrationEvent, join row shapes
      tenant.ts         resolveJurisdictionTenant (codes/jurisdictions subpath)
      parseRichLedger.ts Optional F3 field parser (tolerant)
      collectFromRows.ts Pure join projector (fixture + unit tests)
      collect.ts        DB-backed collector (read-only drizzle join)
      index.ts
    __fixtures__/
      phase1-adjudication-rows.json
      f3-rich-adjudication-rows.json
      k2-backtest-outcome-rows.json
    __tests__/
      raw-events.collect.test.ts
```

Root **`tsconfig.json`** references `./lib/calibration-engines` so **`pnpm run typecheck:libs`** (CI compile gate) includes the package. **`pnpm-workspace.yaml`** `lib/*` glob picks up the package automatically.

### Public exports (Wave 2)

| Export | Role |
|---|---|
| `collectRawCalibrationEvents()` | DB join — adjudication + `finding.outcome.recorded` (+ K2 backtest when deposited) |
| `projectRawCalibrationEventsFromRows()` | Pure projector for fixtures and future internal routes |
| `parseRichLedgerPayload()` | Optional F3 stamps: `sourceEventType`, `subjectKey`, `adjudicator`, `modelAttribution`, `rawCounts`, `outcomeKind`, `historicalCaseId`, fuel provenance |
| `resolveJurisdictionTenant()` | Same partition key as `atomAdjudicationEvidenceLedger` |

Future Wave 3/4 modules (`outcome-deconfound/`, `weak-priors/`, `grader/`, `meta-calibration/`, `model-weighting/`) are **not** scaffolded — blocked on K2/F5/M1 per hook map.

---

## raw-events collector design

### Join pattern

Mirrors c2's `atomAdjudicationEvidenceLedger.ts` and main-clone `engine-core/signals.ts`, but emits **one `RawCalibrationEvent` per ledger row** instead of aggregated tallies or overlay signals.

**Event types collected:**

- `finding.accepted` / `finding.rejected` / `finding.overridden` → `kind: "adjudication"`
- `finding.outcome.recorded` → `kind: "outcome"` (live X2 today on main; absent on c2 DB until C lands)

**K2 backtest tolerance:** same `finding.outcome.recorded` event type with `payload.calibrationProvenance` or `payload.provenance === "backtest"` plus optional `historicalCaseId`. Fixture `k2-backtest-outcome-rows.json` covers full F3 stamp and minimal Phase-2-shaped row.

**F3 field tolerance:** Phase-1 rows (no rich stamps) still join; `phase1OnlyCount` tracks them. Optional fields parsed when present — no throw on absence.

**`findings.confidence`:** carried as `statedConfidence` on each event — **input feature only**, never calibration anchor (per architecture addendum + hook map).

### Derive-at-read vs overlay-as-cache (Decision 5)

| Layer | Role | Owner |
|---|---|---|
| **`atom_events` rich ledger** | Source of truth — raw signal only, append-only | cc-agent-C (writes) |
| **`lib/calibration-engines`** | Read-time derivation — posteriors, reliability, widthed confidence | cc-agent-C2 (reads) |
| **`atom_calibration_overlay` (0037)** | **Optional cache / legacy bootstrap** — not authoritative | cc-agent-C recompute POST demoted |

C2 **never** reads overlay rows for `calibratedConfidence`. When S1 lands (Wave 4, post-M1), `grader/toWidthedConfidence.ts` will consume the raw-events stream; C's `assembleReadContract()` will import `@workspace/calibration-engines` at merge. Overlay cache may remain for warming/bootstrap parity but does not govern displayed accuracy axis.

This aligns with [`01_calibration_architecture_addendum.md`](../_calibrated_spine_roadmap/01_calibration_architecture_addendum.md) keystone: *log raw, derive late* — and [`04_task_roadmap.md`](../_calibrated_spine_roadmap/04_task_roadmap.md) Operator Decision 5 (2026-06-21).

---

## Collision boundary with cc-agent-C

| | cc-agent-C (main clone) | cc-agent-C2 (c2 clone) |
|---|---|---|
| **Clone** | `legacy-design-tools` | `legacy-design-tools-c2` |
| **Writes** | F3 stamps, K2 deposits, warming UPSERT, overlay recompute POST, outcome capture | **None** |
| **Reads** | Tier-1a derived projections (health/debug) | `lib/calibration-engines/**` raw join |
| **Must not touch (C2)** | — | `lib/engine-core/**`, `findings.ts` write paths, `findingOutcomeObservation.ts`, `findingsCalibrationOverlay.ts`, `lib/db/drizzle/*`, warming harness |

C2 imports `@workspace/db` **read-only** and mirrors the join in `atomAdjudicationEvidenceLedger.ts`. When C lands F3 payload fields on main, C2 rebases and reads them without changing write paths.

**S1 naming:** C2 S1 = grader model. finding-engine precedence S1 (R5) = disjoint code path on c2 — no collision.

---

## Verified

```text
> cd lib/calibration-engines && pnpm run typecheck
(no errors)

> cd lib/calibration-engines && pnpm run test
 ✓ src/__tests__/raw-events.collect.test.ts (7 tests)

> cd legacy-design-tools-c2 && pnpm run typecheck:libs
(tsc --build, exit 0)
```

Fixture coverage:

- Phase-1 adjudication accept/reject without F3 stamps
- F3-rich adjudication with model-attribution + rawCounts
- K2 backtest outcomes (`provenance: backtest`, variance vs clean kinds)
- Tenant + cited-atom filters
- Absent citations skipped

---

## Blocked on (unchanged)

| Task | Blocker |
|---|---|
| **K3** outcome de-confound | K2 retrodiction deposits (C) |
| **K5** weak priors | F5 raw-conflict log (C) |
| **S1–S3** model tier | M1 go + F3 rich stamps + K2/K4 fuel |
| **Production read-contract wire** | F4 propagation + F9 `assembleReadContract()` (AC + C) |

---

## Files changed (c2 clone)

- `lib/calibration-engines/**` (new package)
- `tsconfig.json` (project reference)

No changes to cc-agent-C paths on main clone. No internal API routes yet (`calibrationEngines.ts` deferred to Wave 3 when K3/K5 need debug surfaces).
