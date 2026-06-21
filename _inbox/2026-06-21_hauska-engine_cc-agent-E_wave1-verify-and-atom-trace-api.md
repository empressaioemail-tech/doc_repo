---
id: 2026-06-21_hauska-engine_cc-agent-E_wave1-verify-and-atom-trace-api
title: cc-agent-E — Wave 1 F0 verify-first + atom-trace API (Calibrated Spine)
date: 2026-06-21
agent: cc-agent-E
repo: hauska-engine
branch: feat/map-layers-wave-3-geometry @ 1dddc9f (same commit as origin/main at verify time)
dispatch: Calibrated Spine Wave 1 — F0 verify-first, expose atom read + cross-reference traversal for E7
tasks: [F0, E7-read-api]
blocks_unblocked: [E7 spine console atom drill-in (read surface), F2/F7/F8 Wave 2 design]
wave: 1
---

# Close — Wave 1 F0 verify-first + atom-trace API

## Summary

Re-verified live `hauska-engine` at **`origin/main` = `1dddc9f`** (2026-06-21 fetch). **No enrichment, invalidation, or hazard build this wave** — verify-first only plus a read-only atom-trace HTTP surface for the spine console (E7).

**Landings in this close (read-only API):**

- `GET /atoms/trace/:did` — context summary, provenance, citations, outbound/inbound graph edges
- `StoragePort.traverseInbound()` — inbound cross-reference traversal
- `HybridRetrieval.getAtomTrace()` — library entry used by retrieval-api
- Contract test + verification script: `tools/f0-verify-corpus.mjs`

**Parcel→atom resolution is not in hauska-engine.** Jurisdiction resolve + code retrieval for a parcel live in legacy-design-tools / warming (cc-agent-C). This repo exposes **atom-by-DID trace** once the console holds an atom id from dossier/warming/MCP.

---

## F0 — Raw ground truth (live main)

### Verify commands

```text
$ git fetch origin main
$ git log origin/main -1 --oneline
1dddc9f Merge pull request #73 from empressaioemail-tech/feat/map-layers-wave-3-geometry

$ node tools/f0-verify-corpus.mjs
(pasted below — full stdout)

$ pnpm --filter @hauska-engine/retrieval-api test
Test Files  2 passed (2)
Tests  19 passed (19)

$ pnpm --filter @hauska-engine/engine-core test -- -t "source-set drift"
Tests  1 passed | 166 skipped (167)
```

### Corpus snapshot metadata + jurisdiction / atom counts

```json
{
  "format": "hauska-corpus-snapshot/1",
  "generatedAt": "2026-05-26T17:26:12.400Z",
  "atomCount": 21126,
  "linkCount": 21116,
  "jurisdictionCount": 34
}
```

**34 jurisdictions**, all `qualityBar: "passing"`, all `driftStatus: "clean"`. **2 public-free** (`bastrop_tx`, `grand_county_ut`); remainder `platform-internal`.

### Atom families present (production snapshot)

```json
{
  "jurisdiction-corpus": 34,
  "code-edition": 36,
  "code-section": 17799,
  "code-cross-reference": 3257
}
```

**Absent from production snapshot despite schema support:**

| Family | In schema/registry | In committed snapshot |
|---|---|---|
| `code-definition` | yes | **0** |
| `code-amendment` | yes | **0** |

### Link-type distribution (cross-reference graph substrate)

```json
{
  "contains": 17835,
  "see-also": 171,
  "cites": 3009,
  "subject-to": 41,
  "as-defined-in": 31,
  "supersedes": 5,
  "amends": 24
}
```

Note: 24 `amends` **edges** exist; **zero** `code-amendment` atom instances.

---

## F2 — Consequence metadata (verify-first)

**Finding: no typed consequence metadata on corpus atoms today.**

Typed-field scan over all 21,126 snapshot atoms:

```json
{
  "atomsWithTypedConsequenceFields": 0,
  "sampleHits": [],
  "scannedKeys": [
    "riskCategory", "risk_category", "occupancyGroup", "occupancy",
    "importanceFactor", "importance", "seismicDesignCategory",
    "consequenceClass", "consequence"
  ]
}
```

**Prose-only mentions in section/amendment body text (not structured metadata):**

```json
{ "asceMentions": 58, "ibcMentions": 140, "riskCategoryProseMentions": 0 }
```

**ASCE 7 risk category exists only on site adapters**, not corpus atoms:

```typescript
// packages/adapters/src/federal/usgs-seismic.ts
url.searchParams.set("riskCategory", DEFAULT_RISK_CATEGORY); // default "II"
```

**Gap-analysis hypothesis:** F2 GAP — **confirmed**. Wave 2 F2 must add enrichment join; nothing to consume today for S5 / M1-B / V5 consequence layers.

---

## Edition history + code-amendment depth (K-track / F8 gate)

**Finding: edition history is shallow; amendment atoms are not populated in production corpus.**

```json
{
  "totalEditions": 36,
  "totalAmendments": 0,
  "temporalAmendments": 0,
  "jurisdictionalOverlays": 0,
  "editionsPerJurisdiction": {
    "bastrop_tx": 1,
    "grand_county_ut": 3,
    "...": "all other TX jurisdictions: 1 edition each"
  }
}
```

- **33 / 34 jurisdictions:** exactly **one** `code-edition` atom (current supplement only).
- **Grand County UT:** **3** editions (`irc-r301-2-1-irc-2021` lineage) — only multi-edition jurisdiction in snapshot.
- **`effectiveFrom` on editions** is ingest timestamp (2026-05-26), not historical ordinance effective dates — backtest will need K1 historical edition acquisition.
- **Infrastructure exists** (`packages/corpus/src/version-tracking/index.ts` section-scoped drift; `code-amendment` types in `instances.ts`) but **snapshot builder did not emit amendment atoms** for onboarded jurisdictions.

**Gap-analysis hypothesis:** F8 PARTIAL (“code-amendment atoms exist”) — **contradicted for production snapshot**. Code supports amendments; **committed corpus has zero**. F8 hazard model blocked on F7 + amendment/edition fuel.

---

## F7 — Invalidation granularity (verify-first)

Three distinct mechanisms today:

| Mechanism | Granularity today | Evidence |
|---|---|---|
| **Calibration overlay stale flag** | **Per overlay atom key**, invalidated when `codeRef + edition + sourceSetVersion` stamp triple drifts | `invalidateStaleCalibrationForAtom()` in `packages/engine-core/src/calibration/overlay.ts`; test passes |
| **Corpus drift detection** | **Section-scoped** content-hash diff | `captureDriftSnapshot()` / `diffSnapshots()` in `packages/corpus/src/version-tracking/index.ts` |
| **Edition content hash rollup** | **Whole-edition** hash at atomization | `code-edition.contentHash` composes section hashes |

**Calibration invalidation test (raw):**

```text
✓ src/calibration/__tests__/calibration-overlay.test.ts (8 tests | 7 skipped)
  ✓ source-set drift invalidation > bumps sourceSetVersion invalidates stale calibration (all three stamp fields)
```

**Not built:** section-plus-dependents invalidation wiring from drift/amendment events into calibration rows. **Gap-analysis “likely whole-edition” is partially right** for calibration (source-set / edition stamp), **wrong** for drift detection (already section-scoped at detection time, not at invalidation actuation).

---

## Contradictions vs `03_gap_analysis.md`

| Gap row | Hypothesis | Live main ground truth |
|---|---|---|
| F2 | ASCE/IBC not known on atoms | **Confirmed GAP** — zero typed fields |
| F7 | Granularity likely whole-edition | **Partially confirmed** for calibration actuation; drift **detection** is section-scoped but not wired to invalidate calibration |
| F8 | code-amendment atoms exist | **Contradicted** — 0 amendment atoms in production snapshot; only xref/amends links |
| Sync 5 / 20 jurisdictions | 20-jurisdiction corpus gate | **Exceeded** — 34 jurisdictions in snapshot (good news) |
| F3 | Phase 1 ledger exists | **Not re-verified here** (cc-agent-C lane); engine-side atom_events not in this repo |

---

## E7 — Atom read API surface (exposed this wave)

### Existing Sync-3 endpoints (confirmed)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/search?q=&jurisdiction=&entityType=&limit=` | Hybrid structural search |
| `GET` | `/atoms/:did?includeComposition=true` | Raw atom JSON + outbound composition edges |
| `GET` | `/jurisdictions` | Corpus catalog + quality stats |
| `GET` | `/jurisdictions/:id` | Single jurisdiction status |
| `GET` | `/health`, `/ready`, `/healthz` | Liveness / readiness |

Auth: `Authorization: Bearer ${RETRIEVAL_API_KEY}` (empty = dev open).

### New — atom trace (E7 operator drill-in)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/atoms/trace/:did?audience=user\|ai\|internal` | Full operator trace payload |

**Response shape:**

```typescript
{
  atom: CodeAtomInstance;           // full atom instance
  atomDid: string;
  contextSummary: ContextSummary;   // registry-backed; audience lens
  provenance: {
    atomDid, sourceAdapter, sourceUrl, fetchedAt, contentHash
  };
  citations: Array<{               // outbound code-cross-reference atoms
    link: AtomLink;
    crossReference: CodeAtomInstance | null;
    crossReferenceDid: string;
    targetAtom: CodeAtomInstance | null;  // resolved target section
    targetAtomDid: string | null;
  }>;
  outbound: Array<{ link, atom, atomDid }>;  // all outbound edges
  inbound: Array<{ link, atom, atomDid }>;   // all inbound edges (new)
}
```

**Implementation paths:**

- HTTP: `services/retrieval-api/src/server.ts`
- Logic: `packages/retrieval/src/atom-trace.ts`
- Inbound traversal: `StoragePort.traverseInbound()` in `packages/storage/src/port.ts` + `in-memory-storage.ts`
- Contract test: `services/retrieval-api/src/__tests__/contract.test.ts` (`GET /atoms/trace/:did`)

**Not HTTP-exposed yet (library-only):**

- `HybridRetrieval.resolveEffectiveRule()` — Layer 1+2 effective section composition (`packages/retrieval/src/effective-rule.ts`). Wave 2 candidate if console needs “effective rule” view.

**MCP mirror:** `hauska-mcp-server` `get_atom` should add/trace-call this endpoint on next cc-agent-M pass (outside this repo).

### Local dev

```powershell
$env:CORPUS_SNAPSHOT_PATH = "P:/hauska-engine/services/retrieval-api/corpus/snapshot.json"
pnpm --filter @hauska-engine/retrieval-api dev
# GET http://localhost:8080/atoms/trace/did%3Ahauska%3Acode-section%3A...
```

---

## What did NOT build (explicit deferrals)

- F2 consequence-metadata join / enrichment
- F7 section-plus-dependents invalidation actuation
- F8 amendment hazard rate model
- K1 historical edition or permit acquisition
- Postgres-backed storage (still in-memory snapshot hydration)

---

## Proposed Wave 2 task list (cc-agent-E lane)

### F2 — Consequence metadata join

1. Extend `code-section` (and model-code sections) with joinable consequence facets: ASCE 7 risk category, IBC occupancy group, importance — **derived-at-read or enrichment table, not stored severity scalar** per architecture addendum.
2. ICC / I-Code model layer ingest for national baseline sections.
3. Expose consequence facets on `/atoms/trace` typed block + search filter.

**Blockers:** zero typed fields today; enrichment source-of-truth (ICC Code Connect vs manual taxonomy); cc-agent-AC contract fields if cross-repo type needed.

### F7 — Granular invalidation

1. Map section `contentHash` drift + `affectedSectionIds` from amendments to **dependent section closure** (xref graph walk from `packages/storage` links).
2. Wire closure into `invalidateStaleCalibrationForAtom` (or successor) at **section-plus-dependents** grain instead of whole source-set bump only.
3. Emit invalidation events to F3 ledger (cc-agent-C).

**Blockers:** no `code-amendment` atoms in production corpus; calibration overlay keyed by overlay atom id not corpus section id today; dependency graph not materialized.

### F8 — Drift / hazard model

1. Ingest temporal + jurisdictional-overlay amendments into snapshot (re-run `build-corpus-snapshot` with amendment-capable adapters).
2. Compute per-class amendment hazard rates from amendment atom timestamps + section class tags (requires F2 class tags or proxy).
3. Expose hazard signal for V8 vintage-decay + S2 active-learning ranking.

**Blockers:** **F7**; **zero amendment atoms** in snapshot; shallow edition history (K1 acquisition for backtest editions); F2 consequence stratification for class-level hazard.

---

## Files touched (hauska-engine)

| File | Change |
|---|---|
| `packages/retrieval/src/atom-trace.ts` | **new** — trace assembly |
| `packages/retrieval/src/index.ts` | export + `getAtomTrace()` |
| `packages/storage/src/port.ts` | `traverseInbound()` |
| `packages/storage/src/in-memory-storage.ts` | inbound traversal impl |
| `services/retrieval-api/src/server.ts` | `GET /atoms/trace/:did` |
| `services/retrieval-api/src/__tests__/contract.test.ts` | trace contract test |
| `tools/f0-verify-corpus.mjs` | **new** — repeatable F0 corpus stats |

No commit pushed in this close (operator to review + commit when ready).
