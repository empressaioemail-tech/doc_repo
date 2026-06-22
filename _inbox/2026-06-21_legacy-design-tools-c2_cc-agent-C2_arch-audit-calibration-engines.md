---
id: 2026-06-21_legacy-design-tools-c2_cc-agent-C2_arch-audit-calibration-engines
title: cc-agent-C2 — architecture-homes phase 1 audit (calibration-engines)
date: 2026-06-21
agent: cc-agent-C2
repo: legacy-design-tools-c2
branch: cortex/precedence-taxonomy-intra-federal
dispatch: Architecture-homes phase 1 — audit only (no code changes)
tasks: [Track A calibration-engines audit vs cc-agent-AC conformance spec]
related: [architecture_homes_overview, architecture_homes_atoms, 2026-06-21_hauska-atom-contract_cc-agent-AC_arch-audit-conformance-spec, 2026-06-21_legacy-design-tools-c2_cc-agent-C2_wave2-scaffold]
---

# Audit — `@workspace/calibration-engines` vs conformance + derive-at-read

**Scope:** Read-only audit of `lib/calibration-engines/` on the **legacy-design-tools-c2** clone against cc-agent-AC's conformance target ([`2026-06-21_hauska-atom-contract_cc-agent-AC_arch-audit-conformance-spec.md`](2026-06-21_hauska-atom-contract_cc-agent-AC_arch-audit-conformance-spec.md)) and architecture-homes docs [`00_overview.md`](../_architecture_homes/00_overview.md), [`02_atoms_lifecycle_ownership.md`](../_architecture_homes/02_atoms_lifecycle_ownership.md). No code landed in this close.

**Verdict summary**

| Check | Result |
|---|---|
| Raw-events collector reads conformed ledger shape | **PASS with tolerance** — join + F3 field parser align with C's `RichLedgerPayload`; Phase-1 rows accepted |
| Emitted objects are read-contract derived at read | **NOT YET** — Wave 2 emits `RawCalibrationEvent` only; `ReadContract` / `WidthedConfidence` deferred to Wave 4 S1 (by design) |
| Engines never read overlay for `calibratedConfidence` | **PASS** — zero overlay imports or queries |
| C backfill gaps blocking clean reads | **5 gaps flagged** — see §4 |

---

## 1. Raw-events collector vs conformed ledger shape

### What the conformed ledger is (cc-agent-C F3 + AC spec)

C's Wave 2 write-side contract (`lib/engine-core/src/rawLedger.ts` on main clone) defines **`RichLedgerPayload`** stamped into `atom_events.payload`:

| Field | Role |
|---|---|
| `sourceEventType` | Canonical ledger source tag |
| `subjectKey` | Stable subject (finding atom id, place key, …) |
| `adjudicator` | `{ identity, roleAtJudgment }` |
| `modelAttribution` | `@hauska/atom-contract/read-contract` stamp |
| `rawCounts` | `{ successCount, trialCount }` at finest grain |
| `rawModelConfidence` | LLM/extract scalar — raw signal only |

AC conformance adds that **read surfaces** must carry the three-axis `readContract` (`calibratedConfidence`, `assertedConfidence`, `consequence`) with widthed axes — but that is an **output** contract on atom emission/export, not a persisted ledger field. Calibration engines derive it at read from raw ledger inputs.

### What C2 reads

`collectRawCalibrationEvents()` (`lib/calibration-engines/src/raw-events/collect.ts`) performs the same read-only join as c2's tier-1a ledger:

```
atom_events
  INNER JOIN findings   ON findings.atomId = atom_events.entityId
  INNER JOIN submissions ON submissions.id = findings.submissionId
  INNER JOIN engagements ON engagements.id = submissions.engagementId
WHERE entity_type = 'finding'
  AND event_type IN (
    finding.accepted, finding.rejected, finding.overridden,
    finding.outcome.recorded
  )
```

Partition key via `resolveJurisdictionTenant()` matches `atomAdjudicationEvidenceLedger.ts` / main `signals.ts`.

### Field-level alignment

| Conformed ledger field | C2 parser (`parseRichLedger.ts`) | C2 output (`RawCalibrationEvent`) |
|---|---|---|
| `sourceEventType` | ✓ parsed; defaults to `eventType` | ✓ `sourceEventType` |
| `subjectKey` | ✓ parsed | ✓ `subjectKey` (fallback: `findingAtomId`) |
| `adjudicator` | ✓ partial type | ✓ optional |
| `modelAttribution` | ✓ partial type | ✓ optional |
| `rawCounts` | ✓ parsed | ✓ optional |
| `outcomeKind`, `historicalCaseId` | ✓ K2/X2 outcome stamps | ✓ optional |
| `calibrationProvenance` / `provenance` / `fuelProvenance` | ✓ → `calibrationFuelProvenance` | ✓ enum incl. `unknown` |
| `rawModelConfidence` (payload) | **not parsed** | uses `findings.confidence` → `statedConfidence` instead |
| `findings.citations[].atomId` (code-section) | ✓ `extractCodeCitationAtomIds` | ✓ `citedAtomIds` |
| Actor on event row | ✓ `parseActor` | ✓ `actor` |

**Phase-1 tolerance:** rows without F3 stamps still join; `phase1OnlyCount` tracks them. Tests cover Phase-1, F3-rich, and K2-backtest fixtures (7/7 pass).

### Intentional scope limits (not bugs)

- **`finding.generated` not collected** — grader fuel is adjudication + outcome events, not generation deposits.
- **Reasoning-atom citations excluded** — filter requires `kind: "code-section"`; reasoning citations in fixtures ride alongside code-section ids.
- **No `@hauska/atom-contract` dependency yet** — package depends on `@workspace/db` + `@workspace/codes` only; read-contract types land with S1 (`grader/toWidthedConfidence.ts`).

**Task 1 — ledger input:** **PASS with tolerance.**

---

## 2. Emitted shape vs read-contract (derive-at-read output)

### Current emission

Wave 2 exports **`RawCalibrationEvent`** — a normalized raw-ledger projection, explicitly documented as pre-derivation input:

```typescript
// types.ts — "Downstream engines derive posteriors and widthed confidence at read time — never written back."
export interface RawCalibrationEvent { /* raw fields only */ }
```

There is **no** `ReadContract`, `WidthedConfidence`, or `ThreeAxisConfidence` in package exports. No call to `createReadContract()` / `validateAtomConformance()`.

### AC conformance target expectation

Per AC spec §1, every atom **emission at read/export time** must satisfy:

```typescript
readContract: {
  axes: {
    calibratedConfidence: WidthedConfidence,
    assertedConfidence: WidthedConfidence,
    consequence: ConsequenceAxis,
  },
  assembledAt, modelAttribution?,
}
```

That assembly is **planned** at:

| Module | Wave | Owner |
|---|---|---|
| `grader/toWidthedConfidence.ts` | 4 | C2 |
| `assembleReadContract()` import from C | 4 | C wires, C2 supplies calibrated axis |

Hook map and wave2 scaffold both state: **Wave 2 = raw-events collector only; S1–S3 blocked.**

**Task 1 — read-contract output:** **NOT YET MET** (expected deferral). The package correctly implements the **first half** of derive-at-read (raw ledger read path) but does **not** yet emit the AC read-contract object. This is a **Wave 4 conformance item**, not a Wave 2 regression.

**Risk:** Until S1 lands, any consumer treating `RawCalibrationEvent.statedConfidence` or `calibrationFuelProvenance` as a widthed axis violates AC conformance — those fields are input features, not read-contract axes.

---

## 3. Derive-at-read vs overlay-as-cache (Decision 5)

### Architecture standard

- [`01_homes_and_topology.md`](../_architecture_homes/01_homes_and_topology.md): retrieval + calibration engines = **derive-at-read over the raw ledger**.
- [`02_atoms_lifecycle_ownership.md`](../_architecture_homes/02_atoms_lifecycle_ownership.md): read-contract is the portable audit object; calibration pools from public ledger, never from cached beliefs as source of truth.
- Operator Decision 5 (calibrated-spine roadmap): `atom_calibration_overlay` is **optional cache**, not authoritative.

### C2 package audit

| Surface | Overlay touch? |
|---|---|
| `collect.ts` DB query | **No** — queries `atom_events`, `findings`, `engagements` only |
| `collectFromRows.ts` | **No** |
| `parseRichLedger.ts` | **No** |
| `package.json` dependencies | `@workspace/db`, `@workspace/codes`, `drizzle-orm` — **no** engine-core, **no** overlay module |
| Grep `calibratedConfidence` / `atom_calibration_overlay` in package | **Zero hits** (comment in `collect.ts` only) |

Contrast: main-clone `deriveFindingReadContract()` (`lib/engine-core/src/findingReadContract.ts`) **does** optionally read overlay cache as accelerator — that is C's F9 wire path, explicitly labeled cache-not-truth. **C2 calibration-engines does not replicate that pattern.**

**Task 2:** **PASS** — engines never read overlay for `calibratedConfidence`.

---

## 4. Conformance gaps C's backfill must close

These are **write-side / historical-row** gaps on cc-agent-C's deposit loop that block C2 from reading a fully conformed ledger without tolerance branches.

| # | Gap | Impact on C2 | C remediation |
|---|---|---|---|
| **G1** | **Historical Phase-1 payloads lack F3 stamps** — no `sourceEventType`, `subjectKey`, `adjudicator.roleAtJudgment`, `modelAttribution`, `rawCounts` on pre-Wave-2 adjudication events | `phase1OnlyCount > 0`; S1 grader lacks model-attribution join keys and finest-grain counts on legacy rows | Backfill or accept-on-read defaults until natural turnover; re-stamp high-value partitions if K2/M1 needs dense fuel |
| **G2** | **`finding.outcome.recorded` absent on c2 DB** — outcome capture lives on main clone only today | Collector query succeeds but returns **zero outcome events** on c2 until C lands X2 + K2 deposits | Land `findingOutcomeObservation.ts` write path + K2 retrodiction harness on merged tree |
| **G3** | **`rawModelConfidence` in payload vs `findings.confidence` column** — F3 writes scalar to payload on generation; C2 reads column as `statedConfidence`, ignores payload field | Divergence if column and payload ever disagree post-F9; column is transitional per F9 close | Backfill: ensure ledger `rawModelConfidence` matches historical generation events; document single source (payload preferred at read) |
| **G4** | **Adjudication events pre-F3 lack `adjudicator` in payload** — actor lives on event row only | C2 uses row `actor` but `adjudicator.roleAtJudgment` missing → inter-adjudicator agreement stratum incomplete | C's `emitFindingMutationEvent` + `buildRichLedgerPayload` on accept/reject/override; optional backfill from row actor + role inference |
| **G5** | **Arrow-two finding family AC conformance** — data-level finding atoms need signed-history + read-contract at export (AC §1, Track A matrix) | C2 raw collector is necessary but not sufficient for family conformance | C conformance-migrate finding atoms: signed event chain verify + F9 read-contract wire; C2 supplies calibrated axis at merge |

### Not blocking raw collector (informational)

- **`@hauska/atom-contract@1.5.0` pin** — C2 not yet on conformance validator; co-bump at S1 merge.
- **`finding.generated` rich stamps** — needed for model-as-grader identity chain, not for Wave 2 collector event types.
- **F5 `synthesis.conflict` events** — K5 weak-priors input; blocked on C, not raw-events scope.
- **Reasoning-atom citation grain** — collector intentionally code-section-only today; expand if grader needs reasoning-atom partition keys.

---

## 5. Verified this audit

```text
> cd lib/calibration-engines && pnpm run test
 ✓ src/__tests__/raw-events.collect.test.ts (7 tests)

Branch: cortex/precedence-taxonomy-intra-federal (c2 clone)
Package: @workspace/calibration-engines@0.0.0 (Wave 2 raw-events only)
```

Sources read:

- `P:\doc_repo\_architecture_homes\00_overview.md`
- `P:\doc_repo\_architecture_homes\02_atoms_lifecycle_ownership.md`
- `P:\doc_repo\_inbox\2026-06-21_hauska-atom-contract_cc-agent-AC_arch-audit-conformance-spec.md`
- `P:\legacy-design-tools-c2\lib\calibration-engines\src\**`
- `P:\legacy-design-tools-c2\artifacts\api-server\src\lib\atomAdjudicationEvidenceLedger.ts`
- `P:\legacy-design-tools\lib\engine-core\src\rawLedger.ts` (main clone — conformed write shape)
- `P:\legacy-design-tools\lib\engine-core\src\findingReadContract.ts` (main clone — overlay cache contrast)

---

## 6. Acceptance checklist

- [x] Raw-events collector join matches conformed ledger read pattern
- [x] F3 field parser tolerant of Phase-1 + rich + K2 shapes
- [ ] Package emits AC `ReadContract` at read time — **deferred Wave 4 S1**
- [x] No overlay reads for `calibratedConfidence`
- [x] C backfill gaps enumerated for clean post-merge reads
- [x] Audit-only — no code changes on c2 clone
