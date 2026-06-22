---
id: 2026-06-21_legacy-design-tools_cc-agent-C_arch-audit-family-backfill
title: cc-agent-C — Architecture-homes phase 1 atom family audit + backfill
date: 2026-06-21
agent: cc-agent-C
repo: legacy-design-tools (main clone)
branch: main
dispatch: Architecture-homes phase 1 — Track A audit/cleanup; mutable family conformance backfill; radar scaffold
tasks: [Track-A, Track-D-radar]
related: [architecture_homes_atoms, architecture_homes_audit_sequence, 2026-06-21_hauska-atom-contract_cc-agent-AC_arch-audit-conformance-spec]
---

# Close — Architecture-homes phase 1 atom family audit + backfill

## Summary

Audited mutable / tenant atom families on **legacy-design-tools main** against cc-agent-AC's `@hauska/atom-contract@1.5.0` conformance target. Landed **in-place backfill infrastructure** (no re-mint): shared `buildAssertedFallbackReadContract`, accessPolicy normalization, DB migration for reasoning_atoms legacy `tenant-scoped`, backfill script, submission-classification wire enrichment. **Calibrated axis stays at asserted fallback** until earned fuel (M1 / overlay derive-at-read). Scaffolded **`P:\radar`** Surface repo with cortex-api extraction scope. **No new product features.**

Conformance spec: [`2026-06-21_hauska-atom-contract_cc-agent-AC_arch-audit-conformance-spec.md`](2026-06-21_hauska-atom-contract_cc-agent-AC_arch-audit-conformance-spec.md)

---

## 1. Per-family conformance matrix

Legend: **PASS** = meets target at wire/read today · **PARTIAL** = backfill landed this wave · **GAP** = remaining work · **BLOCKED-54** = tenant leg (sprint 54) — do not claim owner-isolation

| Family | Tier | readContract | accessPolicy | signedHistory / provenance | Overall |
|---|---|---|---|---|---|
| **Encumbrances** (recorded-instrument, restriction-clause) | data | **PASS** — `readContractFromExtractConfidence` on wire (`encumbranceWire.ts`, `encumbranceService.ts`) | **PASS** — DB default `tenant-private`; ADR-017 on rows | **PARTIAL** — `atom_events` append-only; export verify-chain not on list route yet | **PARTIAL** |
| **Workspace** (property-workspace, brief-run, brokerage workspace) | app | **PARTIAL** — `buildAssertedFallbackReadContract` available; brief provenance envelope exists; atom `contextSummary` shape-only | **PASS** — contract types declare `tenant-private`; brokerage rows keyed `installId` | **PARTIAL** — history via `EventAnchoringService`; no export bundle | **PARTIAL** |
| **Reasoning atoms** (`reasoning_atoms`) | data | **PARTIAL** — asserted baseline on row; overlay/derive-at-read via engine-core; no widthed wire on all read paths | **PARTIAL** — was `platform-internal` \| legacy `tenant-scoped`; **migration 0044** → ADR-017 five-value | **GAP** — warming UPSERT events; F3 rich stamps incomplete | **PARTIAL** |
| **Finding** (arrow-two) | data | **PASS** — `deriveFindingReadContract` at read (F9 path); overlay cache optional (Decision 5) | **PARTIAL** — tenant partition via engagement; no per-row `access_policy` column | **PASS** — adjudication `atom_events` hash-chained | **PARTIAL** |
| **Submission-classification** | data | **PARTIAL→PASS** — inbox/reclassify wire now includes `readContract` + `accessPolicy` via `wireAtomFamilyConformance` | **PASS** — implied `tenant-private` (plan-review engagement scope) | **PASS** — `submission-classification.set` events | **PARTIAL** |
| **Site-topography** | data | **PARTIAL** — site-context layers use `legacyHonestyToReadContract`; atom registration documents tenant-private | **PASS** — documented tenant-private; engagement-scoped | **PASS** — ingest events on `atom_events` | **PARTIAL** |
| **Site-drainage** | data | **PARTIAL** — same as topography via `brokerageSiteContext` / engagement routes | **PASS** — documented tenant-private | **PASS** — computed/refreshed events | **PARTIAL** |
| **User-generated cluster** (parcel/project workspace + adjudications + extension encumbrances) | app + data refs | **PARTIAL** — conformance helpers landed; not all surfaces wired | **PASS** at declared policy; **BLOCKED-54** at enforcement | **PARTIAL** — events exist under anonymous tenant | **PARTIAL + BLOCKED-54** |

### Immutable corpus (out of scope — re-mint path)

Code-section, code-edition, jurisdiction-corpus: **re-mint via rebuilt snapshot** (cc-agent-E); not backfilled in place.

---

## 2. Backfill landed (in place)

### Package / pin bump

- `@hauska/atom-contract` → **1.5.0** vendor tgz (`vendor/hauska-atom-contract-1.5.0.tgz`)
- `@workspace/engine-core` + `@workspace/api-server` co-bumped

### New modules

| Path | Role |
|---|---|
| `lib/engine-core/src/atomConformance.ts` | `normalizeAccessPolicy`, `buildAssertedFallbackReadContract`, `validateFamilyConformance`, `FAMILY_ACCESS_POLICY` |
| `artifacts/api-server/src/lib/atomFamilyConformance.ts` | Wire-time `accessPolicy` + `readContract` envelope for mutable families |
| `scripts/src/backfillAtomConformance.ts` | Idempotent DB backfill + audit counts |
| `lib/db/drizzle/0044_reasoning_atoms_access_policy_conformance.sql` | `tenant-scoped` → `tenant-private`; ADR-017 check constraint |

### Wire enrichment

- **Submission-classification** — reviewer queue + reclassify responses include `readContract` + `accessPolicy` (`submissions.ts`)

### Derive-at-read discipline (Decision 5)

- **No derived numbers persisted** — `readContract` assembled at read/export only
- **Calibrated axis** — `buildAssertedFallbackReadContract` sets both axes to `provenance: asserted` until earned (findings use `deriveFindingReadContract` when signal exists)
- **Consequence** — `routineConsequenceAxis` (ASCE 7 cat II, stratum routine) until F2 / ICC ingest thickens

### Run backfill

```bash
pnpm --filter @workspace/scripts run backfill:atom-conformance
pnpm --filter @workspace/scripts run backfill:atom-conformance -- --dry-run
```

Apply migration 0044 via normal `pnpm --filter @workspace/db run push` (or deploy pipeline).

### Verified locally

```
pnpm --filter @workspace/engine-core run typecheck   ✓
pnpm exec vitest run lib/engine-core/src/__tests__/atomConformance.test.ts   ✓ (5 tests)
```

---

## 3. Tenant-leg blocked list (sprint 54)

Production runs **anonymous default tenant** today. These conformance / ownership items are **BLOCKED-54** — audit marks them honestly; do not claim user-owned isolation until authenticated tenant partitions land.

| Item | Why blocked |
|---|---|
| Per-user / per-tenant **owner isolation** on workspace, brief-run, findings, encumbrances | Rows keyed by `installId` / engagement; no authenticated reviewer partition |
| **VDA ownership** + operator key on tenant-private atoms | Tenant leg + identity source swap |
| **Export gate** — tenant exports own private atoms only | Gate `atom-export` enforcement needs tenant context (cc-agent-M) |
| **Sovereign calibration** — tenant adjudications never pool to public | Partition logic exists in engine-core; anonymous tenant collapses partitions |
| **Tenant-private storage target** vs cortex-api anonymous DB | Doc 02 target; present-tense is single shared tenant |
| **Radar billing identity** tied to real tenant | Extension `installId` + optional user claim; not full sprint 54 |
| **Cross-tenant accessPolicy enforcement** at gate | ADR-005 Layer A partial; live auth is extension wedge |

Items **not** blocked (completed or in progress without tenant leg):

- readContract shape on wire (asserted fallback)
- accessPolicy column defaults + ADR-017 normalization (reasoning_atoms)
- Signed event history append-only (Phase-1 ledger)
- Consequence asserted default (routine stratum)

---

## 4. Radar scaffold + extraction scope

### Scaffold (operator creates GitHub remote)

```
P:\radar\
  README.md
  package.json
  docs/EXTRACTION_SCOPE.md
```

### Extraction scope (no code move this wave)

**Moves to `radar` Surface** (from `artifacts/api-server`):

- `brokerageBrief.ts` hub + sub-routers: brief, workspace, billing, wallet, entitlement, profile, GTM, place, map-data, hydrology, encumbrances (extension), admin graph
- `lib/brokerage*.ts` (38 files today)
- Extension auth wedge (`auth.ts` slice, `extensionLoginPage.ts`)

**Stays in cortex-api** (reporting function package):

- Plan review, findings, adjudication, calibration spine
- Engagements / submissions / reviewer queue (Codex / architect)
- Warming, codewarm, reasoning UPSERT (until sprint 56 lift)
- Site ingest workers (engagement-scoped)

**Sequencing:** operator remote → extract BFF → repoint extension base URL → remove duplicated routes from cortex-api.

Full inventory: [`P:\radar\docs\EXTRACTION_SCOPE.md`](P:/radar/docs/EXTRACTION_SCOPE.md)

---

## 5. Remaining gaps (post backfill, pre phase-2)

| Gap | Owner | Notes |
|---|---|---|
| Wire `readContract` on all reasoning/site read paths | C | Use `wireAtomFamilyConformance` pattern |
| Encumbrance list → `DownloadableAtom` export | C + M | AC export shape; M gate tool |
| Workspace atom `contextSummary` → full conformance target | C | Still shape-only registration |
| F3 rich ledger stamps on all deposit paths | C | Calibrated derive beyond fallback |
| F2 consequence thickening | E | Replace routine default where metadata exists |
| Fixture refresh after migration 0044 | C | `pnpm --filter @workspace/db run test:fixture:schema` post-push |
| Corpus families re-mint | E | Snapshot rebuild, not in-place |

---

## 6. Files changed (main clone — uncommitted)

```
vendor/hauska-atom-contract-1.5.0.tgz
lib/engine-core/src/atomConformance.ts
lib/engine-core/src/__tests__/atomConformance.test.ts
lib/engine-core/src/index.ts
lib/engine-core/package.json
lib/db/drizzle/0044_reasoning_atoms_access_policy_conformance.sql
lib/db/src/schema/reasoningAtoms.ts
artifacts/api-server/src/lib/atomFamilyConformance.ts
artifacts/api-server/src/routes/submissions.ts
artifacts/api-server/package.json
scripts/src/backfillAtomConformance.ts
scripts/package.json
pnpm-lock.yaml
P:\radar/**  (new Surface scaffold — outside repo until operator adds remote)
```

---

## 7. Acceptance

- [x] Per-family conformance matrix against AC 1.5.0 spec
- [x] In-place backfill path (reasoning accessPolicy + wire helpers + submission-classification)
- [x] Tenant-leg BLOCKED-54 list explicit
- [x] `P:\radar` scaffold + extraction scope doc
- [x] No new product features
- [ ] Operator: commit + PR on main when ready
- [ ] Operator: create `radar` GitHub remote and push scaffold
