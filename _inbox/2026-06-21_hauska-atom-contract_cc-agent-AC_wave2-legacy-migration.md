---
id: 2026-06-21_hauska-atom-contract_cc-agent-AC_wave2-legacy-migration
title: cc-agent-AC — Wave 2 legacy scalar-confidence migration
date: 2026-06-21
agent: cc-agent-AC
repo: hauska-atom-contract
tasks: [Wave-2 legacy subpath migration, F4 contract authority standby]
dispatch: Calibrated Spine Wave 2 — migrate encumbrances + workspace scalars
---

# Close — Wave 2 legacy scalar-confidence migration (cc-agent-AC)

## Summary

Migrated the two legacy scalar-confidence subpaths flagged in Wave 1 F0 to **`WidthedConfidence`** from `@hauska/atom-contract/read-contract`. Bare `confidence: number` now fails Zod validation on `./encumbrances` and `./workspace`. No-scalar-accessor guarantee preserved: estimate remains a branded nominal constructible only via `createWidthedConfidence()` / the new subpath helpers.

**Published npm version at Wave 2 start:** `@hauska/atom-contract@1.4.0`  
**Local package version after this close:** `@hauska/atom-contract@1.5.0` (breaking subpath change — publish required before consumer co-bump)

---

## Migrated subpaths

| Subpath | Location | Before | After |
|---|---|---|---|
| `./encumbrances` | `QUALITY_GATE_FIELDS.confidence` in `common.ts` | `z.number().min(0).max(1)` | `WIDTHED_CONFIDENCE_SCHEMA` |
| `./encumbrances` | `RestrictionClauseAtomInstance.confidence` | `number` | `WidthedConfidence` |
| `./encumbrances` | `AdministrativeRuleAtomInstance.confidence` | `number` | `WidthedConfidence` |
| `./encumbrances` | `ResolvedRuleEntry.confidence` (`constraint-resolution`) | `number` | `WidthedConfidence` |
| `./workspace` | `BriefRun.confidence` | `number` | `WidthedConfidence` |

Main barrel (`@hauska/atom-contract`) unchanged — no confidence types on the root export.

---

## Consumer-facing type changes

### Breaking (subpath consumers only)

**Encumbrances** — `confidence` is now a full widthed object:

```typescript
// Before (invalid after 1.5.0)
confidence: 0.92

// After
import { createEncumbranceQualityConfidence } from "@hauska/atom-contract/encumbrances";

confidence: createEncumbranceQualityConfidence(0.92)
// => { estimate, n: 0, intervalWidth: 1, provenance: "asserted" }
```

**Workspace brief-run** — same pattern:

```typescript
import { createBriefRunAssertedConfidence } from "@hauska/atom-contract/workspace";

confidence: createBriefRunAssertedConfidence(0.91)
```

When `n`, `intervalWidth`, and provenance are known at deposit time, use `createWidthedConfidence()` from `@hauska/atom-contract/read-contract` directly.

### New helpers (minimal; no speculative read-contract expansion)

| Helper | Export path | Purpose |
|---|---|---|
| `createEncumbranceQualityConfidence(estimate)` | `./encumbrances` | Asserted quality-gate deposits pre-calibration |
| `createBriefRunAssertedConfidence(estimate)` | `./workspace` | Asserted brief-run confidence pre-calibration |

### Validation behavior

- `RESTRICTION_CLAUSE_SCHEMA`, `ADMINISTRATIVE_RULE_SCHEMA`, `CONSTRAINT_RESOLUTION_SCHEMA`, `BRIEF_RUN_SCHEMA` reject bare numeric `confidence`.
- `validateBriefRun()` re-brands parsed confidence via `createWidthedConfidence()` so returned `BriefRun` satisfies the branded estimate type.

---

## No-scalar-accessor guarantee (unchanged + extended)

1. No exported scalar confidence type on migrated subpaths.
2. Zod rejects bare numbers at runtime (new tests in encumbrances + workspace).
3. Branded `WidthedPointEstimate` still required on TypeScript interfaces.
4. `ReadContract` still has no top-level `.confidence` field.

**Limitation (unchanged):** JSON from untyped legacy endpoints can still carry scalars until cortex-api co-bump; schema validation at the contract boundary is the enforcement point.

---

## Files changed

| File | Change |
|---|---|
| `src/encumbrances/common.ts` | `QUALITY_GATE_FIELDS` → widthed; `createEncumbranceQualityConfidence` |
| `src/encumbrances/restriction-clause.ts` | Interface + schema via `QUALITY_GATE_FIELDS` |
| `src/encumbrances/administrative-rule.ts` | Interface + schema via `QUALITY_GATE_FIELDS` |
| `src/encumbrances/constraint-resolution.ts` | `rules[].confidence` widthed |
| `src/encumbrances/fixtures.ts` | Fixtures use `createEncumbranceQualityConfidence` |
| `src/encumbrances/__tests__/encumbrances.test.ts` | +1 scalar-rejection test |
| `src/workspace/brief-run.ts` | Widthed confidence + `createBriefRunAssertedConfidence` + validate re-brand |
| `src/workspace/fixtures.ts` | Fixture uses helper |
| `src/workspace/__tests__/workspace.test.ts` | +1 scalar-rejection test |
| `package.json` | `1.5.0` |
| `CHANGELOG.md` | 1.5.0 entry |

---

## Validation

```
npm run prepublishOnly
  lint       ✅
  typecheck  ✅
  test       ✅ (92 tests, +2 scalar-rejection)
  build      ✅
```

---

## Contract authority standby (Wave 2 co-bump)

Standing by as contract authority for cc-agent-C (engine-core + cortex-api) and cc-agent-M (MCP) as they adopt `ReadContract`. Will add helpers only on real consumer gaps — no speculative expansion.

**Consumers that must co-bump for encumbrance/workspace confidence:**

| Consumer | Path | Owner |
|---|---|---|
| cortex-api encumbrance routes | PB-301 encumbrance payloads | cc-agent-C |
| cortex-api brokerage workspace | `BriefRun` ingestion | cc-agent-C |
| hauska-engine encumbrance registry | atom validation | cc-agent-E |

**Consumers adopting full `ReadContract` (separate from this subpath migration):**

| Consumer | Owner |
|---|---|
| engine-core `EngineEnvelope` | cc-agent-E / cc-agent-C |
| cortex-api OpenAPI / honesty envelope | cc-agent-C |
| MCP 46 tool schemas | cc-agent-M |
| extension / map / Cortex UI | extension, map, cc-agent-R |

Pin `@hauska/atom-contract@^1.5.0` for widthed encumbrance/workspace fields; pin `@hauska/atom-contract@^1.4.0` minimum for read-contract only until 1.5.0 is published.

---

## Publish status

| Version | npm registry | This close |
|---|---|---|
| 1.4.0 | **Live** (2026-06-21 staged publish) | read-contract subpath |
| 1.5.0 | **Not yet published** | encumbrance + workspace migration |

Operator: stage-publish 1.5.0 via [`docs/npm-publish-automation.md`](../hauska-atom-contract/docs/npm-publish-automation.md) after merge.

---

## Blocked on / unblocked

**Unblocked:** cortex-api and engine can begin co-bump against local `1.5.0` or after npm publish; encumbrance/workspace contract shape is final for Wave 2.

**Blocked on:** npm publish of `1.5.0` before production pin; cc-agent-C encumbrance/brief-run deposit paths still emit scalars until their co-bump lands.
