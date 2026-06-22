---
id: 2026-06-21_hauska-engine_cc-agent-E_arch-audit-corpus-remint
title: cc-agent-E — architecture-homes phase 1 corpus audit + re-mint
date: 2026-06-21
repo: hauska-engine
agent: cc-agent-E
tasks: [Track A corpus families, conformance audit, snapshot re-mint, atom-contract 1.5.0 co-bump]
dispatch: Architecture-homes phase 1 audit/cleanup — corpus track only
related: [architecture_homes_overview, architecture_homes_atoms, architecture_homes_audit_sequence, 2026-06-21_hauska-atom-contract_cc-agent-AC_arch-audit-conformance-spec]
---

# Close — corpus family conformance audit + snapshot re-mint (cc-agent-E)

## Summary

Audited all five populated **immutable code-corpus families** against cc-agent-AC's landed conformance spec (`@hauska/atom-contract@1.5.0`, `ATOM_CONFORMANCE_TARGET_VERSION = "1.5.0"`). Pre-remint snapshot was **0% conformant** (21,126 atoms, no `readContract`, no `signedHistory`, `accessPolicy` on jurisdiction-corpus only).

Implemented **born-correct conformance minting** at atomization (`stampAtomizationResult` → `stampCorpusAtomConformance`) and re-minted the committed retrieval-api snapshot through that mint path. Post-remint: **100% conformant** across all populated families (`validateAtomConformance` + `verifyEventChain` green on every atom). Co-bumped engine pins to `@hauska/atom-contract@^1.5.0`.

---

## 1. Conformance spec gate

AC spec **landed** before remediation: [`2026-06-21_hauska-atom-contract_cc-agent-AC_arch-audit-conformance-spec.md`](2026-06-21_hauska-atom-contract_cc-agent-AC_arch-audit-conformance-spec.md). Validator: `validateAtomConformance()` from `@hauska/atom-contract/conformance`. Corpus families are **data-tier** → signed history required.

---

## 2. Per-family conformance matrix

Spec axes audited per family: `readContract` (three widthed axes), `accessPolicy`, `signedHistory` + `verifyChain`, `consequenceInputs` (F2 on `code-section` only).

### Pre-remint (snapshot `generatedAt: 2026-05-26T17:26:12.400Z`)

| Family | Tier | Count | readContract | accessPolicy | signedHistory | verifyChain | consequenceInputs | Conformant | Remediation |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| `code-section` | data | 17,799 | 0 | 0 | 0 | 0 | 0 | **0** | re-mint |
| `code-cross-reference` | data | 3,257 | 0 | 0 | 0 | 0 | n/a | **0** | re-mint |
| `code-edition` | data | 36 | 0 | 0 | 0 | 0 | n/a | **0** | re-mint |
| `code-amendment` | data | 0 | — | — | — | — | n/a | n/a | re-mint (none in snapshot) |
| `code-definition` | data | 0 | — | — | — | — | n/a | n/a | re-mint (none in snapshot) |
| `jurisdiction-corpus` | data | 34 | 0 | 33 | 0 | 0 | n/a | **0** | re-mint |

**Pre-remint verdict:** FAIL — 0 / 21,126 atoms pass `validateAtomConformance()`.

Typical errors: `invalid-read-contract`, `missing-signed-history`. One `jurisdiction-corpus` row (`bastrop_tx` UDC walk) lacked `accessPolicy` on the atom instance (status row carried policy; atom did not).

### Post-remint (snapshot `generatedAt: 2026-06-22T02:32:18.781Z`)

| Family | Tier | Count | readContract | accessPolicy | signedHistory | verifyChain | consequenceInputs | Conformant |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| `code-section` | data | 17,799 | 17,799 | 17,799 | 17,799 | 17,799 | 17,799 (conservative `II`) | **17,799** |
| `code-cross-reference` | data | 3,257 | 3,257 | 3,257 | 3,257 | 3,257 | n/a | **3,257** |
| `code-edition` | data | 36 | 36 | 36 | 36 | 36 | n/a | **36** |
| `code-amendment` | data | 0 | — | — | — | — | n/a | n/a |
| `code-definition` | data | 0 | — | — | — | — | n/a | n/a |
| `jurisdiction-corpus` | data | 34 | 34 | 34 | 34 | 34 | n/a | **34** |

**Post-remint verdict:** PASS — 21,126 / 21,126 atoms conformant (`allConformant: true`).

---

## 3. Re-mint implementation (born-correct, not in-place DB migration)

### Atomization mint (primary path)

New module `packages/corpus/src/conformance/mint.ts`:

| Field | Mint behavior |
|---|---|
| `readContract.axes.calibratedConfidence` | `seed` baseline (`n=0`, wide interval) until calibration earns |
| `readContract.axes.assertedConfidence` | Adapter source-quality map (`raw-pdf` 0.82, `municode-html` 0.72, …), provenance `asserted` |
| `readContract.axes.consequence` | Conservative ASCE 7 **Category II** / stratum `routine`; thickens when parsed from prose or ICC ingest |
| `accessPolicy` | Propagated from `AtomizeOptions.accessPolicy` (default `public-free`; partnership-pending → `platform-internal`) onto **every** corpus atom |
| `signedHistory` | Genesis `*.ingested` event chained via `buildValidSignedEventChain` + `verifyEventChain` |
| `consequenceInputs` (`code-section`) | Parsed from prose when present; else conservative `{ asce7RiskCategories: ["II"] }` |

`atomize()` now returns `stampAtomizationResult(...)` — all future ingests are born-correct.

### Snapshot re-mint

| Step | Command | Result |
|---|---|---|
| Live rebuild attempt | `pnpm --filter @hauska-engine/migrate-legacy-codes dev build-corpus-snapshot` | **Blocked** — all 49 ingest units failed (`fetch failed` / live-source drift; no network to Municode/PDF sources in this session) |
| Conformance re-mint | `pnpm --filter @hauska-engine/corpus run remint:snapshot` | **Success** — 21,126 atoms re-stamped through `stampCorpusAtomConformance` (same mint functions as atomization); content hashes preserved |

Artifact: `services/retrieval-api/corpus/snapshot.json` (`hauska-corpus-snapshot/1`).

**Operator follow-up:** When network is available, run `build-corpus-snapshot` for a full live re-ingest; atomization mint ensures born-correct output without a second remint pass.

---

## 4. Verification

| Check | Result |
|---|---|
| `pnpm --filter @hauska-engine/corpus test` | **105 / 105** green (includes 3 new conformance mint tests) |
| `pnpm --filter @hauska-engine/corpus run audit:snapshot` | **allConformant: true** on reminted snapshot |
| Hermetic atomization | All 6 Bump-1 families emitted + `validateAtomConformance` per atom |
| `tools/f0-verify-corpus.mjs` | Snapshot metadata + family counts intact post-remint |
| `@hauska/atom-contract` pin | Co-bumped `atom-contract-pin`, `atoms`, `corpus` → `^1.5.0` |

---

## 5. Files changed

| File | Change |
|---|---|
| `packages/corpus/src/conformance/mint.ts` | Born-correct mint: readContract, accessPolicy, signedHistory, consequence defaults |
| `packages/corpus/src/conformance/index.ts` | Barrel |
| `packages/corpus/src/conformance/__tests__/conformance.test.ts` | Per-family `validateAtomConformance` harness |
| `packages/corpus/src/atomization/index.ts` | Calls `stampAtomizationResult` on return |
| `packages/corpus/scripts/audit-snapshot-conformance.mjs` | Snapshot audit matrix |
| `packages/corpus/scripts/remint-snapshot-conformance.ts` | Snapshot re-mint through mint path |
| `packages/atoms/src/instances.ts` | `CorpusConformanceFields` on `BaseAtomInstance` |
| `packages/atom-contract-pin/package.json` | `^1.5.0` + subpath re-exports |
| `packages/atoms/package.json` | `^1.5.0` |
| `packages/corpus/package.json` | `^1.5.0`, conformance export, audit/remint scripts |
| `services/retrieval-api/corpus/snapshot.json` | Re-minted artifact (21,126 atoms, 2026-06-22) |

---

## 6. Blockers / honest limits

| Item | Status |
|---|---|
| Live `build-corpus-snapshot` | **Blocked this session** — Municode/PDF fetches failed (network). Remint used existing atom content + mint envelope. |
| ICC I-Code ingest | Consequence on conservative asserted default (`II` / `routine`); thickens when ICC ingest lands (per doc 04). |
| `code-amendment` / `code-definition` in snapshot | Zero instances in current artifact; mint path covers them at atomization. |
| Tenant-leg (sprint 54) | N/A — corpus atoms are public/platform-internal substrate, not tenant-private. |

---

## 7. Acceptance criteria

- [x] Per-family conformance matrix against AC spec 1.5.0
- [x] Born-correct mint at atomization (re-mint path, not in-place DB backfill)
- [x] Snapshot re-minted with readContract + accessPolicy + signedHistory + conservative consequence
- [x] Verification: tests + audit script + f0 metadata check
- [x] `@hauska/atom-contract@^1.5.0` co-bump in engine packages
