---
id: 2026-05-19_bastrop_grand_county_data_recon_cc-agent-E
title: Session — Bastrop UDC + Grand County code data recon (legacy-design-tools); Path B migration plan
date: 2026-05-19
agent: cc-agent-E
repo: hauska-engine
session_type: planning
rolled_up: false
rolled_up_into: []
---

## What was done

Read-only recon of Bastrop UDC and Grand County code data in `legacy-design-tools` to decide whether the Sync 4 Bastrop B.6 validation pass can collapse from "build from scratch via the Stream 1A Municode adapter" to "migrate the legacy corpus through a transform step and run the eval harness against it."

Step 0 cleared. cc-agent-PR's [`2026-05-18_plan_review_engine_inventory_cc-agent-PR.md`](2026-05-18_plan_review_engine_inventory_cc-agent-PR.md) covers the engine's retrieval / atom-shape gaps but does not enumerate per-atom counts, parent-section threading, or the source-adapter shape at the level of detail the migration planner needs. Step 1 recon ran against the legacy code directly. Recommendation: **Path B — migrate.** Migration plan detail below.

No writes to `legacy-design-tools`. All work in this session is read-only Reads and Greps plus this commit to `doc_repo`.

## Step 1 — recon findings

### 1. Storage location (concrete paths)

| Artifact | Path |
|---|---|
| Atom rows | Neon Postgres `code_atoms` table, schema at [`lib/db/src/schema/codeAtoms.ts`](../../legacy-design-tools/lib/db/src/schema/codeAtoms.ts) |
| Source registry | Postgres `code_atom_sources` table, schema at [`lib/db/src/schema/codeAtomSources.ts`](../../legacy-design-tools/lib/db/src/schema/codeAtomSources.ts) |
| Fetch queue | Postgres `code_atom_fetch_queue` table at [`lib/db/src/schema/codeAtomFetchQueue.ts`](../../legacy-design-tools/lib/db/src/schema/codeAtomFetchQueue.ts) |
| Jurisdiction config | [`lib/codes/src/jurisdictions.ts`](../../legacy-design-tools/lib/codes/src/jurisdictions.ts) (TS-resident, not DB-backed) |
| Source adapters | [`lib/codes-sources/src/`](../../legacy-design-tools/lib/codes-sources/src/): `municode/`, `grandCountyHtml/`, `grandCountyPdf/`, `codePublishingHtml/` |
| Warmup orchestrator | [`lib/codes/src/orchestrator.ts`](../../legacy-design-tools/lib/codes/src/orchestrator.ts) — queue-driven, lease-based, exponential backoff |
| Retrieval consumer | [`lib/codes/src/retrieval.ts`](../../legacy-design-tools/lib/codes/src/retrieval.ts) — vector (pgvector cosine) + lexical fallback, filtered by `jurisdictionKey` |

Atom bodies live in Postgres (not IPFS). Embeddings are pgvector columns directly on `code_atoms.embedding`, `vector(1536)` keyed to OpenAI `text-embedding-3-small` per [`lib/codes/src/embeddings.ts:15`](../../legacy-design-tools/lib/codes/src/embeddings.ts#L15). No IPFS layer, no IPNS, no DID; the row's primary key is a Drizzle-generated UUID.

### 2. Atom shape

**Classification: (b) Structurally parsed but not formally registered as atoms.** Discriminators:

- Section / parent / book / edition hierarchy is captured (`sectionNumber`, `sectionTitle`, `parentSection`, `codeBook`, `edition`) — that's the structural parse.
- The four-layer ADR-001 contract is NOT honored. There is no `@workspace/empressa-atom` `register()` call for `code-section`, `code-definition`, `code-amendment`, `code-cross-reference`, `code-edition`, or `jurisdiction-corpus`. cc-agent-PR confirmed at §27 of their inventory: "Atom registry doesn't include `code-section`, `code-definition`, `code-amendment`, `code-cross-reference`, `code-edition`, `jurisdiction-corpus` (they're code atoms not domain atoms; semantically distinct)."

Per-row legacy fields vs. the hauska-engine [`CodeSectionAtomInstance`](../../hauska-engine/packages/atoms/src/instances.ts):

| legacy `code_atoms`     | hauska target                | gap                                                                                       |
|-------------------------|------------------------------|-------------------------------------------------------------------------------------------|
| `id` (uuid)             | `entityId` (deterministic)   | Remap: drop legacy uuid; derive `entityId = ${jurisdictionKey}/${editionSlug}/${normalizeSectionLabel(sectionNumber)}`. |
| `jurisdictionKey`       | `jurisdictionTenant`         | Direct rename. Values match the dispatch (`bastrop_tx`, `grand_county_ut`).               |
| `codeBook` + `edition`  | `codeEditionId` (composite)  | Group: emit one `code-edition` per `(jurisdictionKey, codeBook)` tuple.                   |
| `sectionNumber`         | `sectionNumber`              | Direct.                                                                                   |
| `sectionTitle`          | `title`                      | Direct.                                                                                   |
| `parentSection`         | (lost — see note)            | Hauska atomizer treats subsections as separate atoms; legacy folds subsection text into parent body. **Accepted loss for v1 migration**; eval-harness coverage test asks only that the section is retrievable by `sectionNumber`. |
| `body`                  | `bodyText`                   | Direct.                                                                                   |
| `bodyHtml`              | (preserved in metadata sidecar) | Optional; not on the hauska atom shape.                                               |
| `contentHash`           | `contentHash`                | **Recompute.** Legacy hashes `[jurisdiction, book, edition, sectionRef, body]`; hauska's `hashContent()` hashes `["code-section", entityId, sectionNumber, title, subsection, bodyText]`. Different inputs → different CIDs at IPFS pin time. Preserve the legacy hash in metadata for cross-trace. |
| `sourceUrl`             | `sourceUrl`                  | Direct.                                                                                   |
| `fetchedAt`             | `fetchedAt`                  | Direct.                                                                                   |
| `sourceId → source_name` | `sourceAdapter`             | Resolve via JOIN. Map `bastrop_municode` → `municode-html`, `grand_county_html` → `municode-html` (or a `legacy/grand-county-html` adapter ID for honest provenance), etc. |
| `embedding` (1536, OAI 3-small) | `atom_embeddings` (deferred) | Eval harness doesn't depend on embeddings; skip migration of vectors for Sync 4. Re-embed when pgvector lands in hauska-engine. |
| `metadata` (jsonb)      | (preserved in atom metadata sidecar) | Free-form; carry through for trace.                                              |

Composition atoms required for completeness, **none of which exist in legacy and must be synthesized at migration time**:

- `code-edition` atom per `(jurisdictionKey, codeBook)` — `sectionIds[]` is the list of section atom entityIds in that book; `effectiveFrom` derived from edition label parse (`"IRC 2021"` → `2021-01-01`) with fallback to earliest `fetchedAt`; `amendmentIds[]` empty.
- `jurisdiction-corpus` atom per `jurisdictionKey` — `adoptedEditionIds[]` is the list of `code-edition` entityIds for that jurisdiction; `currentEditionId` is the most-recently-fetched book; `coverageQualityBar = "not-evaluated"`.
- `code-cross-reference` atoms — synthesized by running the same `§\s*([\w.()-]+)` + `Section X.YZ` sniffer the hauska atomizer uses against each section's `bodyText`. One xref atom per detected reference; emit `cites` / `see-also` / `subject-to` atom-link edges to the resolved target section. Resolution rate will be lower than fresh-Municode-ingest because legacy bodies have less structural markup retained, but every resolved xref is a real edge and the coverage test fails open (95% target on what exists, not 95% of what could exist if extraction were ideal).
- `code-amendment` atoms — **skipped for migration.** Legacy doesn't track amendments as discrete records; the Bastrop Municode book carries "current supplement" as a single snapshot. Amendment ingestion lands at the first follow-up Municode supplement.
- `code-definition` atoms — **skipped for migration.** Grand County Article 10 ("Definitions") and Bastrop Code's definitions sections are folded into giant section bodies. Term-level extraction is a separate sprint; defer.

### 3. ID scheme

Legacy uses Drizzle-generated UUIDs (`code_atoms.id = uuid().defaultRandom()`). This does NOT match `did:hauska:<entityType>:<localId>` per [ADR-011](../80_adrs/adr_011_atom_identity_across_versions.md). **Remap required.**

Migration emits hauska-shape DIDs deterministically:
- `did:hauska:code-section:${jurisdictionKey}/${editionSlug}/${normalizeSectionLabel(sectionNumber)}`
- `did:hauska:code-edition:${jurisdictionKey}/${editionSlug}`
- `did:hauska:jurisdiction-corpus:${jurisdictionKey}`
- `did:hauska:code-cross-reference:${jurisdictionKey}/${editionSlug}/${fromSectionSlug}/xref-${serial}`

Two `code_atoms` rows that share the same `(jurisdictionKey, codeBook, edition, sectionNumber)` after `normalizeSectionLabel` (strips subsection parens) will collide on the same target DID. **Migration policy: keep the earliest-`fetchedAt` row's body; log collisions for operator review.** Expected collision rate is low because legacy `contentHash` is part of the unique index and bodies that survive content-hash dedup should also have distinct section labels.

The legacy UUID is preserved in the migrated atom's metadata under `legacyCodeAtomId` so cross-system trace queries (e.g., "which legacy row produced this hauska atom") work.

### 4. Cross-references

**Not represented as edges in legacy.** Confirmed via Grep over `lib/codes-sources/src/`: only hit on `cite|interprets|amends` is fixture text in `grandCountyPdf/__fixtures__/iwuic-extracted-text.txt`, i.e., raw extracted PDF body content — no structured field. cc-agent-PR's inventory §24/§27 reach the same conclusion: "The `code-cross-reference` atom type is unregistered; ADR-010 hybrid retrieval (graph traversal as edges) is unbuilt."

Migration synthesizes cross-reference atoms + atom-link edges by sniffing inline section symbols (`§\s*([\w.()-]+)`) and `Section X.YZ` patterns out of `bodyText`. This is the same sniffer the hauska atomizer applies during native ingestion ([`packages/corpus/src/atomization/index.ts`](../../hauska-engine/packages/corpus/src/atomization/index.ts) `sniffAffectedSectionLabels` plus the body-level cross-reference loop in the Municode adapter), so the post-migration corpus passes the same coverage shape as a native-ingest corpus.

Caveat: the eval harness's cross-reference test (95% target per 49 §B.4) samples xref atoms emitted by atomization and verifies each `toSectionId` resolves. Because legacy `bodyHtml` is stripped to plain text before storage, the citation-context recovery rate may be modestly lower than the fresh-Municode path. **The plan accepts whatever rate the migration produces; if cross-ref score falls below 95%, the migration completes but the jurisdiction marks `coverageQualityBar = "failing"` and Path C (re-ingest from source) becomes the fallback for that jurisdiction only.**

### 5. Provenance fields

| Field                | Legacy | Hauska target            |
|----------------------|--------|--------------------------|
| `sourceAdapter`      | Implicit via `code_atom_sources.source_name` JOIN | Direct map (see field-mapping table) |
| `sourceUrl`          | ✓ on every row | ✓ |
| `fetchedAt`          | ✓ defaulted to now() at insert | ✓ |
| `contentHash`        | ✓ unique-indexed (`sha256` of `[jurisdiction, book, edition, sectionRef, body]`) | ✓ Recomputed against hauska's input set; legacy hash preserved in metadata. |

All provenance fields are present in legacy. No source data is unrecoverable.

### 6. Coverage

Two data points anchor the coverage estimate:

- [`lib/codes-sources/GRAND_COUNTY_LANDUSE_RECON.md`](../../legacy-design-tools/lib/codes-sources/GRAND_COUNTY_LANDUSE_RECON.md) §1 (2026-04-28 timestamp): `bastrop_tx: 189 atoms` / `grand_county_ut: 75 atoms` (the latter is IRC R301.2(1) + IWUIC 2006, before Land Use Code ingestion).
- cc-agent-PR's inventory §23 (2026-05-18): "Threshold tuned on Grand County Land Use Code (215 atoms)."

If the cc-agent-PR observation is accurate, the Grand County Land Use Code adapter shipped between 2026-04-28 and 2026-05-18, adding ~140 atoms to bring Grand County's total to ~215 (or 215 is the Land Use Code subset alone, total ~290 with IRC+IWUIC). The recon doc itself recommended Phase 2 build the `codePublishingHtml` adapter — that subdirectory now exists at [`lib/codes-sources/src/codePublishingHtml/`](../../legacy-design-tools/lib/codes-sources/src/codePublishingHtml/), so Phase 2 of the Land Use Code recon shipped.

**Concrete coverage cannot be confirmed without a live count against Neon.** This recon is filesystem-only. The migration script's first action is a `SELECT COUNT(*) GROUP BY jurisdiction_key, code_book` to print authoritative per-book counts before any writes. Treat the numbers below as informed estimates, not facts:

| Jurisdiction        | Book                          | Estimated atom count | Expected order |
|---------------------|-------------------------------|----------------------|----------------|
| `bastrop_tx`        | `MUNI_CODE` (Code of Ordinances) | ~189 (recon 2026-04-28) | Hundreds of sections, capped by `maxTocNodes: 30` in jurisdiction config → likely partial corpus. |
| `grand_county_ut`   | `IRC_R301_2_1` (IRC R301.2(1) table) | ~30 (subset of 75 in recon) | Single table; tiny corpus. |
| `grand_county_ut`   | `IWUIC` (Wildland-Urban Interface) | ~45 (subset of 75) | Mid-size; ~10 chapters per IWUIC structure. |
| `grand_county_ut`   | `LAND_USE` (Land Use Code rev. 3/21) | ~120-215 (post-Phase-2 land use ingestion) | Most-load-bearing for zoning queries. |

Two coverage callouts that affect whether Path B can land Sync 4 cleanly:

1. **"Bastrop UDC" is not the same as "Bastrop Code of Ordinances."** The legacy book carries `codeBook: "MUNI_CODE"`, `label: "City of Bastrop — Code of Ordinances"` — the full ordinances corpus, not the Unified Development Code specifically. The UDC is one chapter within. `maxTocNodes: 30` in [`jurisdictions.ts:77`](../../legacy-design-tools/lib/codes/src/jurisdictions.ts#L77) caps Municode TOC traversal at 30 nodes; the 189 atoms may include UDC chapters or may not. **The migration script must print a per-section-number sample so we can verify UDC zoning sections (typically Chapter 14 or similar) are present before declaring Bastrop UDC migration complete.** If UDC sections are absent or partial, Path C re-ingest is required for that subset.

2. **"Grand County IRC" coverage is one table, not the full IRC.** `IRC_R301_2_1` is the climatic/geographic design criteria table from IRC R301. The IRC has hundreds of sections. If "Grand County IRC" in the dispatch means "the IRC chapters Grand County has adopted," only R301.2(1) is present. If it means "the IRC code reference for the Grand County jurisdiction," that's substantively the IWUIC + R301.2(1) pair (since the County's adoption of broader IRC chapters isn't atomized). Worth a clarifying ask with Nick before committing to a Sync 4 pass on Grand County. The migration handles whatever is present; the eval verdict for Grand County may simply read "passing-against-loaded-subset" rather than "passing-against-full-IRC."

## Step 2 — Path B migration plan

### Path decision

**Path B — Structurally-parsed-but-not-atomized data migration.** Confirmed by Step 1 §2. Path A (already atomized in compatible shape) is excluded because no Bump 1 atom types are registered in legacy. Path C (full re-ingest) is a fallback if the eval harness fails on the migrated corpus or if coverage gaps (callouts §6.1 and §6.2 above) prove blocking.

### Script structure

New one-shot at `hauska-engine/tools/migrate-legacy-codes/`:

```
tools/migrate-legacy-codes/
├── package.json                # depends on @hauska-engine/atoms, /corpus, /storage; postgres client
├── tsconfig.json
└── src/
    ├── index.ts                # commander CLI entry: dry-run, write, coverage-report subcommands
    ├── legacy-client.ts        # postgres connection to legacy Neon; reads code_atoms + code_atom_sources
    ├── source-adapter-map.ts   # maps code_atom_sources.source_name -> hauska sourceAdapter id
    ├── transform.ts            # CodeAtom row + sources -> CodeSectionAtomInstance
    ├── synthesize-editions.ts  # group sections -> CodeEditionAtomInstance + JurisdictionCorpusAtomInstance
    ├── synthesize-xrefs.ts     # body-text sniffer -> CodeCrossReferenceAtomInstance + AtomLink[]
    ├── coverage-report.ts      # SELECT COUNT(*) per (jurisdiction, codeBook); prints before write
    └── __tests__/              # transform fixtures, xref sniffer regressions
```

CLI subcommands:

- `migrate-legacy-codes coverage-report` — read-only; prints per-jurisdiction, per-codeBook, per-section counts. **Required before write.**
- `migrate-legacy-codes dry-run [--jurisdiction=<key>]` — transforms in memory; reports atom counts, xref resolution rate, collision count; writes nothing.
- `migrate-legacy-codes write --target=<in-memory|postgres> [--jurisdiction=<key>]` — performs the migration into the targeted `StoragePort`.
- `migrate-legacy-codes eval --jurisdiction=<key>` — convenience wrapper calling the existing `evaluate(options)` from `packages/corpus/src/eval/` against the migrated corpus.

The script depends on `@workspace/db` from `legacy-design-tools` for the legacy read (or a thin direct `postgres-js` client if we avoid dragging the workspace dep into hauska-engine — recommended). Read-only credentials suffice.

### Source-to-target field mapping

See §2 above for the full table. Highlights for the planner's eye:

- `entityId` is computed deterministically from `(jurisdictionKey, edition, sectionNumber)`; legacy UUID is dropped from identity but preserved as `metadata.legacyCodeAtomId`.
- `codeEditionId` synthesized per `(jurisdictionKey, codeBook)` group.
- `jurisdiction-corpus.adoptedEditionIds` collected post-section-write.
- `sourceAdapter` derived from `code_atom_sources.source_name`: `bastrop_municode` → `municode-html`, `grand_county_html` → `municode-html` (note: the legacy "grand_county_html" adapter is actually a one-off scraper for one IRC table page; using `municode-html` would be a provenance lie. Recommend introducing a distinct `legacy/grand-county-html-r301`, `legacy/grand-county-pdf-iwuic`, `legacy/code-publishing-html` adapter-id family that's clearly marked as legacy-migrated, so the eval harness and future drift-detection can route those through their proper adapter when re-ingestion is needed).

### DID remapping strategy

Already covered §3. Reiterated for crispness:

1. Build target DID from `(jurisdictionKey, editionSlug, normalizeSectionLabel(sectionNumber))`.
2. Compute target `contentHash` via hauska's `hashContent(...)` over `["code-section", entityId, sectionNumber, title, subsection, bodyText]`.
3. Stash `legacyCodeAtomId` (UUID) and `legacyContentHash` in atom `metadata`.
4. Synthesized edition / corpus / cross-reference atoms get their own DIDs computed at write time.

Collision policy: if two legacy rows map to the same target DID, keep the row with the earliest `fetchedAt`; log the collision in a `migration-collisions.json` artifact and surface count in the dry-run summary.

### Dry-run verification approach

Standard order for a clean run:

1. `migrate-legacy-codes coverage-report` — confirms counts match recon estimates within tolerance; flags surprises before any work.
2. `migrate-legacy-codes dry-run --jurisdiction=bastrop_tx` — emits the transformed atom set into an in-memory `StoragePort`. Reports:
   - section count per book vs. legacy count (any delta = collision / drop)
   - cross-reference atom count + resolution rate (`toSectionId` matches a section atom in the corpus)
   - synthesized edition / corpus atom counts
   - sample of 10 atoms printed verbatim for spot-check
3. `migrate-legacy-codes eval --jurisdiction=bastrop_tx` — runs the eval harness against the in-memory corpus with the curated-query set. Reports the 90/100/95 quality-bar score.
4. Repeat for `grand_county_ut`.
5. Only after both jurisdictions pass dry-run + eval do we run `migrate-legacy-codes write --target=postgres` against the production hauska-engine `StoragePort`.

The eval harness's curated query set for Bastrop UDC has to be authored before step 3 (reviewer-zero per Phase 0 — Sylvia / Jaime in canonical 51 framing, or Nick + planner per the dispatch). Without curated queries the top-3 retrieval score has no signal; the coverage + cross-ref scores still run.

### Rollback plan

The hauska-engine target is currently the in-memory `StoragePort`. Until the Postgres-backed `StoragePort` lands (deferred sprint), the migration runs into an ephemeral in-process store and "rollback" is `restart the process.` Concrete rollback shape post-Postgres-backing:

- All migrated atoms carry `metadata.migrationBatch = <ISO-8601 batch id>`; a `DELETE FROM atoms WHERE metadata->>'migrationBatch' = '<id>'` reverses the run.
- The companion `atom_links` rows are co-batched (same metadata key) for the same delete.
- `jurisdiction_status` rows touched by the migration revert to `qualityBar = "not-evaluated"` and `atomCount = 0` for the affected `jurisdictionTenant`.

Failure-mode-specific rollback:

- **Coverage gap surfaces (e.g., UDC sections absent from Bastrop).** No rollback needed; the migrated atoms are correct, the gap is real. Fall through to Path C re-ingest for the gap subset; the new atoms merge cleanly because content-addressing dedupes.
- **Cross-ref resolution below 95%.** Mark `coverageQualityBar = "failing"` for the jurisdiction; do not block migration. Triage cross-ref misses; either accept the rate or fall through to Path C.
- **Eval top-3 below 90% on curated queries.** Same as above — keep the migrated atoms; investigate whether the miss is a curated-query authoring problem (queries reference UDC content absent from the migrated corpus) or a retrieval-quality problem (queries match content but the lexical-only `InMemoryStorage.search` doesn't surface it).
- **Migration crashes mid-write.** Restart from `migrate-legacy-codes write --resume` (idempotent against the `(entityType, entityId)` unique index that the hauska `atoms` schema declares).

### Estimated session count to execute

Three sessions, each scoped to land green and committable:

1. **Session 1 — Migration script.** Build `tools/migrate-legacy-codes/`: schema reads, transform, edition + corpus + cross-ref synthesis, coverage-report subcommand. Tests against captured legacy-row fixtures (sampled out of the live DB and checked into `__fixtures__/`). Dry-run subcommand works end-to-end against the in-memory `StoragePort`. ~1 day.
2. **Session 2 — Curated query authoring + dry-run validation.** Author the Bastrop UDC + Grand County curated query sets via the [`packages/corpus/src/curated-queries/`](../../hauska-engine/packages/corpus/src/curated-queries/) module (LLM-generate from TOC + human-review). Run dry-run + eval against the migrated corpus. Iterate on cross-ref sniffer + xref resolution heuristics if the cross-ref score falls below 95%. ~1 day, can extend if cross-ref tuning is non-trivial.
3. **Session 3 — Production write + Sync 4 signal.** Wait for Postgres-backed `StoragePort` (separate sprint), then run `migrate-legacy-codes write --target=postgres`. Verify retrieval-api endpoints return migrated atoms. Signal Sync 4 (first jurisdiction passes eval) per the within-track sync-point table. ~0.5 day assuming Postgres landing is independent.

Total: ~2.5 sessions for the data side, plus dependency on the Postgres-backed `StoragePort` landing in a parallel session.

### Trade-offs documented for planner review

- **Skipping `code-definition` atoms in v1.** Term-level definitions don't atomize cleanly from giant glossary-section bodies. Acceptable for Sync 4 if no curated query targets a definition specifically. If curated queries DO include definitions, definition extraction is a hard prerequisite.
- **Skipping `code-amendment` atoms in v1.** Legacy doesn't carry amendment records. The first follow-up Municode supplement ingestion will populate them via Stream 1A. The eval harness's amendment test doesn't exist in the 49 §B.4 spec, so this skip doesn't affect the quality bar.
- **Provenance honesty on `sourceAdapter`.** Recommend `legacy/...` prefixing for migrated atoms' adapter ID so any future drift detection routes through the correct adapter when re-ingestion is triggered. The alternative (collapsing to `municode-html` for everything) loses the legacy / native-ingest distinction in a way that's hard to recover later.
- **Bastrop coverage gap risk.** If the 189 Bastrop atoms don't include UDC zoning sections, Path B Sync 4 fails on Bastrop and Path C re-ingest is required for the UDC subset specifically. Worth confirming before Session 1 lands. Suggest a one-off SQL probe against legacy Neon ahead of Session 1 to enumerate section numbers and confirm UDC presence.

## What was learned

- Legacy ingestion is more mature than expected. The `code_atoms` schema is rich (section/parent/book/edition/source/contentHash all present), and the orchestrator handles queue + lease + exponential-backoff + content-hash dedup correctly. **Migration is the right call** — re-ingesting from Municode + Code Publishing would re-do work that's already correct at the source-fetch layer.
- The big gap is not data, it's typed-link representation. Legacy has bodies; the hauska Bump 1 atom contract needs `code-cross-reference` atoms + atom-link edges. The sniffer the atomizer already runs is the load-bearing piece for the migration's xref synthesis step.
- The dispatch's "Bastrop UDC" framing should be reconciled against the legacy `MUNI_CODE` codeBook (full Code of Ordinances, not just UDC). One SQL probe will resolve it. Recommend doing this before Session 1.
- The dispatch's "Grand County IRC" framing should be reconciled against legacy's `IRC_R301_2_1` (one table) + `IWUIC` (separate wildland-urban code) + `LAND_USE` (the actual zoning rules). Likely the dispatch's "IRC" means R301.2(1) specifically; worth confirming.
- Sync 4 collapse from "build from scratch" to "migrate + eval" is real but is contingent on (a) Bastrop UDC coverage being adequate in legacy, (b) the curated query set being authored, (c) the cross-ref sniffer producing 95%+ resolution against legacy bodies. (a) is the largest risk and is checkable cheaply.

## What's still open

- Bastrop UDC coverage check against legacy Neon (one SQL probe; pre-Session-1 action).
- Clarification from Nick on what "Grand County IRC" refers to (likely R301.2(1) + IWUIC, but worth confirming).
- Postgres-backed `StoragePort` in hauska-engine (independent prerequisite for production Sync 4 write; not blocking dry-run + eval).
- Curated query authoring for Bastrop UDC + Grand County (reviewer-zero gate per Phase 0).
- Planner review of this plan before execution (Step 3 of the dispatch — explicit do-not-execute).

## Suggested canonical doc updates

None required this session — the plan is execution prep, and the canonical sprint docs ([`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Stream 1D, [`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md) §B.6) already frame Bastrop as the first validation pass without prescribing migrate-vs-rebuild. Once execution lands and Sync 4 signals, the relevant Stream 1D checklist items flip to resolved.

## Commit batch

One commit in `doc_repo` for this session summary. No `hauska-engine` changes this session — Step 3 explicitly halts before migration execution.
