---
id: 2026-06-21_legacy-design-tools_cc-agent-C_wave2
title: cc-agent-C — Wave 2 Calibrated Spine build (F3/F4/F5/F9/D6/W1/K1)
date: 2026-06-21
agent: cc-agent-C
repo: legacy-design-tools
branch: map/track123-free-federal-layers (working tree; **not committed / no PR opened this close**)
dispatch: Calibrated Spine Wave 2 — build on main clone, disjoint from C2 lib/calibration-engines
atom_contract: "@hauska/atom-contract@1.4.0 (vendor/hauska-atom-contract-1.4.0.tgz)"
tasks: [F3, F4, F5, F9, Decision-6, W1, W4, W5, K1-landing-schema]
not_built: [K2-retrodiction — blocked on edition/amendment ingest + K1 acquisition data]
---

# Close — Wave 2 Calibrated Spine build

## Summary

Wave 2 lands the **raw-ledger stamps**, **read-contract wire migration (partial F4)**, **raw-conflict log emission**, **plan-review F9 read-contract**, **Decision 6 uncapped atoms route**, **W1 warming scaffold + W4 snapshot-only Cotality guard + W5 synthetic tag**, and **K1 public-record landing schema**. Overlay `0037` is treated as cache in `deriveFindingReadContract` (Decision 5). **No git commit or PR** was created in this close — all work is in the working tree on `map/track123-free-federal-layers` atop federal-layer commits.

---

## PRs / commits

| Item | Status |
|---|---|
| Commits | **None** (user did not request commit) |
| PR | **Not opened** |
| Base branch | `map/track123-free-federal-layers` @ `ee2c4299` (federal layers) |
| Dependency bump | `@hauska/atom-contract@1.4.0` tarball in `vendor/`; `artifacts/api-server` + `lib/engine-core` package.json |

---

## Deliverables by task

### F3 — Rich raw ledger

**New:** `lib/engine-core/src/rawLedger.ts` — `RichLedgerPayload`, `buildRichLedgerPayload`, `adjudicatorFromActor`, `LedgerSourceEventType`, `RawCountStamp`.

**Wired in** `artifacts/api-server/src/routes/findings.ts`:

- `finding.generated` — stamps `sourceEventType`, `subjectKey`, `adjudicator` (plan-review-engine), `modelAttribution`, `rawModelConfidence`, `rawCounts: { successCount: 1, trialCount: 1 }`. LLM scalar **not** the wire confidence.
- `finding.accepted|rejected|overridden|human-generated` — `emitFindingMutationEvent` wraps payloads with adjudicator identity + `roleAtJudgment`.

**Never persisted:** derived calibration numbers (posterior, agreement, calibrated point).

### F4 — cortex-api read-contract propagation

**New core:**

- `lib/engine-core/src/readContractDerive.ts` — `legacyHonestyToReadContract`, `readContractForWire`, `readContractToEngineHonesty`, `isLowConfidenceReadContract`
- `lib/engine-core/src/findingReadContract.ts` — F9 derive-at-read loop
- `lib/engine-core/src/encumbranceReadContract.ts` — extract-model scalar → read-contract
- `artifacts/api-server/src/lib/readContractWire.ts`

**Wire surfaces migrated (this wave):**

| Surface | Change |
|---|---|
| Findings list/detail wire | `readContract` replaces bare `confidence` scalar (F9) |
| Brokerage site-context layers | `readContract` per layer alongside transitional `engineHonesty` |
| Map composite layers | `queryCompositeLayer()` returns envelope + `readContract` |
| Encumbrance wire | `readContractFromExtractConfidence` on clause/private-restrictions briefing (branch delta) |
| OpenAPI / orval | `ReadContract`, `WidthedConfidence`, `ThreeAxisConfidence` schemas regenerated on branch |

**Still transitional:** `engineHonesty` siblings on findings runs and briefing jobs; full parcelBriefings wire cutover deferred to FE + spec follow-up.

### F5 — Raw-conflict log

**New:** `lib/engine-core/src/rawConflictLog.ts`, `artifacts/api-server/src/lib/rawConflictLogEmit.ts`.

**Wired:** after finding generation, `logPrecedenceConflictsFromCodeSections()` runs against accessibility precedence reconciliations (`precedenceReconciliationsFromCodeSections` exported from `@workspace/finding-engine`). Events append to `atom_events` as `entity_type: synthesis-conflict`, `event_type: synthesis.conflict`. Conflict **type derived at read** via `deriveConflictTypeAtRead()` — no stored enum.

### F9 — Plan-review displayed confidence

- Wire: `FindingWire.readContract` + `lowConfidence` from `deriveFindingReadContract()` / `isLowConfidenceReadContract()`.
- Removed bare `confidence` from findings HTTP wire.
- DB column `findings.confidence` retained as **raw LLM signal**; ledger carries `rawModelConfidence`.
- **FE (branch):** `lib/portal-ui/src/components/ReadContractChrome.tsx` + `FindingDetailPanel` / `EncumbrancesPanel` consume read-contract (co-landed on branch).

### Decision 6 — `GET /api/brokerage/v1/place/:placeKey/atoms`

**New:** `artifacts/api-server/src/lib/placeParcelAtoms.ts`, route in `brokeragePlace.ts`.

- Uncapped retrieval: all `BROKERAGE_CODE_QUERIES` (50 each) + reasoning_atoms (limit 500).
- Overlay-joined calibration cache fields per atom.
- Auth: same `brokerageAuth` stack as other place routes.

### W1 / W4 / W5 — Warming harness

**New:** `artifacts/api-server/src/lib/warmingHarness.ts`

| Export | Purpose |
|---|---|
| `runWarmingCascade({ address, synthetic: true })` | Geocode → snapshot coverage gate → snapshot-only site context → free federal live |
| `verifySnapshotCoverage(placeKey)` | Cotality key presence in `place_layer_snapshots` |
| `WARMING_COTALITY_ADAPTER_KEYS` | 17 Cotality adapter keys required for full coverage |
| `WARMING_FREE_LIVE_ADAPTER_KEYS` | FEMA / USGS / EPA only |

**Routes:**

- `POST /api/brokerage/v1/place/warming/run` — cascade scaffold; response includes `k1LandingSchema`
- `GET /api/brokerage/v1/place/:placeKey/snapshot-coverage` — coverage probe

**W4 guard:** `fetchBrokerageSiteContext({ snapshotsOnly: true })` skips live Cotality upstream; missing parcel snapshot → `no-coverage` with W4 message. Cascade QA flags `live-cotality-leak:*` if any metered Cotality layer returns live.

**W5:** `synthetic: true` required on warming input; tagged in result for query-frequency exclusion (M1 hook point).

**Scaffold gap (explicit):** `reasoningDepositCount` stays **0** — no reasoning_atoms UPSERT in cascade yet.

### K1 — Landing schema (acquisition agent)

Stamped constant `K1_OUTCOME_LANDING_SCHEMA` in `warmingHarness.ts`:

```typescript
{
  schemaVersion: "k1-outcome-v1",
  requiredFields: [
    "outcomeId", "sourceEventType", "subjectKey", "jurisdictionTenant",
    "parcelKey", "outcomeRecordedAt", "outcomeKind", "outcomeStatus",
    "sourceProvenance", "sourceVintage", "editionInEffect",
    "citedAtomIds", "rawCounts",
  ],
  fieldDefinitions: { /* outcomeId, k1.public-record.outcome, … */ },
  appendTarget: "atom_events",
  entityType: "k1-outcome",
  notes: "K2 retrodiction waits on edition/amendment ingest — do not persist derived calibration numbers.",
}
```

**K2:** NOT built this wave.

---

## Snapshot coverage finding (gates warming)

**Implementation:** `verifySnapshotCoverage(placeKey)` queries `place_layer_snapshots.adapter_key` for the place.

| Gate | Rule |
|---|---|
| **Hard block (`canWarm: false`)** | Missing `cotality:parcels` snapshot |
| **Soft partial** | Any other key in `WARMING_COTALITY_ADAPTER_KEYS` missing → `coverageRate < 1`, QA flag `snapshot-partial:…` |
| **Full pass** | All 17 Cotality keys present |

**Local probe (2026-06-21):** Workstation has **no Postgres** listening (`ECONNREFUSED :5432`). Could not run live coverage against a populated `place_layer_snapshots` table. **Expected prod/dev behavior:** warming remains **blocked** until acquisition/snapshot pipeline lands at least `cotality:parcels` per `placeKey`. This is the intended W4 gate — do not warm without parcel spine snapshot.

---

## Raw test output

### `@workspace/finding-engine` — PASS

```
Test Files  12 passed (12)
     Tests  86 passed (86)
  Duration  1.06s
```

Includes `precedenceProductionWire.test.ts` after `precedenceReconciliationsFromCodeSections` refactor.

### `@workspace/engine-core` — partial (no local DB)

**Non-DB suites — PASS (16 tests):**

```
✓ envelope.test.ts (4)
✓ compute.test.ts (3)
✓ partition.test.ts (6)
✓ consequenceGatedRouting.test.ts (3)
```

**DB-backed `calibration-overlay.test.ts` — FAIL (6)** — `ECONNREFUSED 127.0.0.1:5432` (environment; not regression from this wave).

### `artifacts/api-server` — partial (no local DB / DATABASE_URL)

- `pnpm exec tsc -p tsconfig.json --noEmit` — **PASS** (after `tsc --build` on `lib/engine-core` + `lib/finding-engine`)
- `brokerageGisCompositeLayers.test.ts` — **FAIL at import** — `DATABASE_URL must be set` (engine-core → db chain)
- `findings-route.test.ts` — not run (same DATABASE_URL requirement)

---

## What this unblocks

| Consumer | Unblocked |
|---|---|
| **C2 (`lib/calibration-engines`)** | Raw ledger stamp shape + conflict log event type + read-contract derive helpers; overlay explicitly cache-only in `deriveFindingReadContract`; no derived numbers in ledger payloads |
| **Map / brokerage** | Decision 6 atoms route for console E7 atom-trace; layer + composite map responses carry `readContract`; W4 snapshot-only site context for warming QA |
| **Acquisition agent (K1)** | Landing schema stamped (`K1_OUTCOME_LANDING_SCHEMA`); append target `atom_events` / `entity_type: k1-outcome`; rawCounts + provenance/vintage fields defined |
| **Cortex FE (plan-review)** | Findings wire `readContract`; `ReadContractChrome` on branch; scalar confidence removed from API |
| **Wave 3+** | F5 conflict rows in ledger for synthesis audit; warming cascade entrypoint for snapshot QA once Cotality snapshots exist |

---

## Key files (create / touch)

**Created**

- `lib/engine-core/src/{rawLedger,rawConflictLog,readContractDerive,findingReadContract,encumbranceReadContract}.ts`
- `artifacts/api-server/src/lib/{readContractWire,rawConflictLogEmit,placeParcelAtoms,warmingHarness}.ts`
- `vendor/hauska-atom-contract-1.4.0.tgz`

**Touched (spine-critical)**

- `artifacts/api-server/src/routes/findings.ts` — F3 stamps, F9 wire, F5 hook
- `artifacts/api-server/src/routes/brokeragePlace.ts` — atoms + warming + snapshot-coverage routes
- `artifacts/api-server/src/lib/brokerageSiteContext.ts` — W4 `snapshotsOnly`, layer `readContract`
- `lib/finding-engine/src/precedence/productionWire.ts` — conflict reconciliation export
- `lib/api-spec/openapi.yaml` + generated zod/client (readContract types)

---

## Known gaps / follow-ups

1. **Commit + PR** — working tree only; needs review separate from federal-layer map commits or split.
2. **W1 reasoning deposit** — cascade scaffold does not UPSERT reasoning_atoms yet.
3. **F4 briefing wire** — `parcelBriefings.ts` engineHonesty still on run rows; read-contract on briefing response body needs FE confirmation.
4. **Findings integration tests** — update assertions from `finding.confidence` → `finding.readContract.axes.calibratedConfidence`.
5. **Local CI parity** — run full test job with Postgres + `DATABASE_URL` before merge.
6. **K2 retrodiction** — explicitly deferred.

---

## Acceptance checklist

- [x] F3 rich ledger stamps on generation + adjudication events
- [x] F4 read-contract on findings, site-context layers, map composite envelopes
- [x] F5 raw-conflict log emission on precedence reconciliation
- [x] F9 findings wire uses read-contract; LLM scalar ledger-only
- [x] Decision 6 uncapped atoms route
- [x] W1 warming cascade scaffold + W4 snapshot gate + W5 synthetic tag
- [x] K1 landing schema stamped
- [ ] K2 retrodiction (out of scope)
- [x] api-server `tsc --noEmit` passes
- [ ] Full vitest with Postgres (blocked locally)
