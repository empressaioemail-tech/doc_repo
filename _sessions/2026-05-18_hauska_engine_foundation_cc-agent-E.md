---
id: 2026-05-18_hauska_engine_foundation_cc-agent-E
title: Session — hauska-engine foundation (Streams 1A through 1D scaffolded; Sync 2 and Sync 3 contracts locked)
date: 2026-05-18
agent: cc-agent-E
repo: hauska-engine
session_type: engineering
rolled_up: false
rolled_up_into: []
---

## What was done

Bootstrapped `empressaioemail-tech/hauska-engine` from empty repo. Per [`_dispatches/2026-05-18_cc-agent-E_hauska_engine.md`](../_dispatches/2026-05-18_cc-agent-E_hauska_engine.md), this session owns all of Track 1 in the substrate v1 sprint. Foundation laid across all four streams; the two within-track lock-targets (Sync 2 adapter contract, Sync 3 retrieval API contract) are stable.

Monorepo at `p:\hauska-engine`: pnpm 10 workspace, TypeScript 5.7 with strict mode, Vitest 2.1. Nine workspace packages under `packages/` plus services + tools. Layout matches the sprint-plan §Repo-layout to the file:

- `packages/atom-contract-pin` — pre-Sync-1 path-pin shim. Mirrors the `@workspace/empressa-atom` public surface (AtomRegistration, AtomMode, AtomComposition, ContextSummary, Scope, AtomRegistry, createAtomRegistry). On Sync 1 its [`src/index.ts`](../../../hauska-engine/packages/atom-contract-pin/src/index.ts) flips from local source to `export * from "@hauska/atom-contract"` and `package.json` adds the npm dep. Chose the matching-shape approach over a `file:` reference because `legacy-design-tools/lib/empressa-atom` carries `@workspace/db` and `catalog:` pnpm-workspace coupling that does not install cleanly outside legacy-design-tools.
- `packages/atoms` — engine-side atom-instance registry. Bump 1 type definitions (code-section, code-definition, code-amendment, code-cross-reference, code-edition, jurisdiction-corpus) registered via `bootstrapEngineAtomRegistry()` against the contract surface. Per-type instance shapes carry provenance + content-hash. DID helpers (build/parse `did:hauska:<entityType>:<localId>`) plus the ADR-010 link taxonomy. Adjudication-context atoms are NOT registered here (produced by smartcity-os Codex 1b; this engine reads them through the same contract).
- `packages/corpus` — pipeline. `adapters/` (Stream 1A), `extraction/` and `atomization/` (Stream 1B), `eval/` and `curated-queries/` and `version-tracking/` and `cost-tracking/` (Stream 1D). Cheerio for HTML parsing; undici for HTTP; Zod for schema validation. Subpath exports declared for each stage.
- `packages/storage` — Postgres index + IPFS pin per ADR-010. Drizzle schema for `atoms`, `atom_links`, `atom_embeddings`, `ingest_jobs`, `curated_queries`, `jurisdiction_status`, `cost_records`. `StoragePort` abstraction; in-memory implementation backs tests + the retrieval-api dev mode. `IpfsPort` abstraction so Pinata vs. Filebase vs. Hauska cluster is a swap-not-rewrite. `HotCache` per ADR-010 §1 ("Hot cache layer — start in-process, promote to Redis under load").
- `packages/identity` — DID resolver + IPNS read/write surface stubs per ADR-011. In-memory resolver implements the port; IPNS substrate deferred per ADR-011 §Open-for-refinement.
- `packages/retrieval` — `HybridRetrieval` query orchestrator combining `StoragePort.search` + `StoragePort.traverse`. Composition-aware atom lookup. Locks the response shapes the retrieval-api service returns.
- `services/retrieval-api` — Hono HTTP service. The Sync 3 deliverable. Five endpoints locked: `GET /search`, `GET /atoms/:did`, `GET /jurisdictions`, `GET /jurisdictions/:id`, `GET /jurisdictions/:id/permits` (the renamed `search_permit_atoms` target per Phase 0). Plus `/health` and `/ready`. Bearer-token middleware; latency contract documented in module header (P99 ≤500ms index / ≤2s with IPFS).
- `services/pipeline-runner` — state-machine orchestrator. `queued → fetching → extracted → atomized → indexed → eval-running → loaded / failed` per 51 §Stream 1A. `runJob(jobId)` is a single Cloud Run jobs invocation. `JobPort` abstracts the queue (in-memory for dev; Postgres for prod via the existing `ingest_jobs` schema). Retries enforced at the job-port layer.
- `tools/ingest-cli` — operator CLI. `discover`, `review-start`, `review-end`, `cost-record`, `cost-report`, `evaluate-hard-kill`. The hard-kill command exits non-zero when the 3-county checkpoint trips so a Cloud Run jobs pipeline that runs it as a guard automatically halts.

CI workflow at [`.github/workflows/ci.yml`](../../../hauska-engine/.github/workflows/ci.yml) runs `pnpm typecheck` plus `pnpm test` on push/PR.

**Sync 2 — Adapter contract stable.** Adapter interface at [`packages/corpus/src/adapters/types.ts`](../../../hauska-engine/packages/corpus/src/adapters/types.ts): `CodeSourceAdapter` with `discover() / fetch() / metadata() / normalize()`, `NormalizedBlock` typed union (heading / paragraph / definition / cross-reference / table / figure / note / amendment-record), conformance suite at [`packages/corpus/src/adapters/__fixtures__/conformance.ts`](../../../hauska-engine/packages/corpus/src/adapters/__fixtures__/conformance.ts). Three adapter implementations: Municode HTML (P1; respectful-crawl HTTP client; cheerio DOM walker; cross-reference sniffer; definition glossary extraction; amendment-record extraction), eCode360 HTML (P1; HTML fallback path before JSON), Raw PDF stub (P2-P3, conformance-clean no-op until Claude vision OCR lands). Municode conformance test passes against an inline fixture; end-to-end test (adapter → extraction → atomization → atom-link emission) passes. Sync 2 ready for downstream within-stream coupling.

**Sync 3 — Retrieval API contract stable.** Service at [`services/retrieval-api/src/server.ts`](../../../hauska-engine/services/retrieval-api/src/server.ts); 10-test contract suite at [`services/retrieval-api/src/__tests__/contract.test.ts`](../../../hauska-engine/services/retrieval-api/src/__tests__/contract.test.ts) covers every endpoint including unauthorized + 404 + missing-projectType paths. cc-agent-M in [`hauska-mcp-server`](https://github.com/empressaioemail-tech/hauska-mcp-server) Stream 2A can swap from mocked client to real wiring on Sync 3 signal.

**Stream 1D — commitment #3 operationalized.** Per-jurisdiction cost tracking at [`packages/corpus/src/cost-tracking/`](../../../hauska-engine/packages/corpus/src/cost-tracking/) captures LLM tokens / OCR / embedding / infrastructure cents + human-review-minutes against the $200 + 1hr target. `evaluateHardKill(port)` runs the 3-county hard-kill checkpoint per CLAUDE.md commitment #3; exits non-zero from the CLI when tripped. Four-test unit suite covers under-3-counties, within-target, compute-over-target, and human-review-over-target cases.

**Stream 1D — eval harness, curated queries, version-tracking.** Eval harness with retrieval / coverage / cross-ref test runners + quality-bar enforcer. Default thresholds match 49 §B.4 (90% top-3 / 100% section-num / 95% cross-ref); recalibration hook on the thresholds parameter. Curated-query authoring with LLM-generation hook plus human-review-state-machine port (in-memory implementation; Postgres via the `curated_queries` schema). Drift detection captures section content-hash snapshots and diffs across re-ingest. Tests for eval (passing + missing-retrieval cases) and drift (no-change + changed/added section cases).

All work green: 31 tests pass across `corpus` (21) and `retrieval-api` (10); typecheck clean across all 9 workspace projects.

## What was learned

Three things worth carrying forward:

The path-pin to `@workspace/empressa-atom` could not use a `file:` reference. The workspace-private package depends on `@workspace/db` (pnpm `workspace:*`) and `drizzle-orm` via pnpm catalog mode; both fail to resolve outside `legacy-design-tools`. The dispatch explicitly permitted "path-pin or matching shape"; the matching-shape route via the [`atom-contract-pin` shim](../../../hauska-engine/packages/atom-contract-pin/src/index.ts) is cleaner — it keeps engine consumers blind to the swap on Sync 1 and avoids dragging legacy workspace coupling into this repo.

TypeScript `composite: true` does not play well with source-direct `exports`. The substrate v1 sprint package shape ships source files via the `exports` map (`./src/<module>.ts`) so consumers under Bundler resolution skip the build step entirely. `composite: true` requires real emit and project references; combining the two causes `TS6305 "output file ... has not been built"`. Dropped `composite` + project references from [`tsconfig.base.json`](../../../hauska-engine/tsconfig.base.json) and every per-package tsconfig; each package now runs an independent `tsc --noEmit`. Note for the Postgres-storage / production-bundle sprint: deploy-time bundling will land via a tsx or esbuild pass, not via `tsc -b`.

The Windows dev box trips `UNABLE_TO_VERIFY_LEAF_SIGNATURE` against `registry.npmjs.org` unless `NODE_OPTIONS=--use-system-ca` is set. Captured in [`REPO_NOTES.md`](../../../hauska-engine/REPO_NOTES.md) under "Local install on Windows". CI on Linux is unaffected.

Two test-revealed atomization fixes worth noting (caught by the end-to-end test; both now passing):

- Cross-reference targets that include subsection markers (e.g. `5.04(b)`) need to resolve to the parent section atom (`5.04`). Atomization now normalizes section labels via `normalizeSectionLabel()` when both building and looking up section IDs, so xref edges land cleanly.
- Amendment-record blocks emitted by the adapter often have empty `affectedSectionLabels`. The atomizer falls back to sniffing `§ X.YZ` and `Section X.YZ` patterns out of `amendmentText`; trailing punctuation is stripped before lookup. Future per-jurisdiction quirks land as fixture overrides rather than adapter divergence.

## What's still open

Within-stream work that follows from this foundation, in roughly the order each unblocks:

- **First-city Municode test (51 §Stream 1A exit).** Capture a real Municode TOC HTML fixture from one non-Bastrop TX city and replace the inline test fixture. Refine the discovery URL pattern + per-jurisdiction selectors against the live source.
- **Bastrop UDC B.6 validation pass (Sync 4 target).** Run the full pipeline against the Bastrop UDC source; diff atom output against [`11a_bastrop_live_roadmap.md`](../11a_bastrop_live_roadmap.md) Sprint A.1's one-off load; iterate to parity or improvement. Same for Grand County IRC.
- **Postgres-backed StoragePort.** Drizzle schema is already in [`packages/storage/src/schema.ts`](../../../hauska-engine/packages/storage/src/schema.ts); the implementation against the port lands with a migrations sprint. Currently the retrieval-api serves the in-memory storage in dev mode.
- **IPFS pinning provider.** [`IpfsPort`](../../../hauska-engine/packages/storage/src/ipfs-port.ts) abstraction in place; the v1 default (Pinata is the leading candidate per ADR-010 §Open-decisions) needs to land + cost telemetry hooked into cost-tracking.
- **OCR for raw-PDF.** Claude vision primary + Tesseract fallback per Phase 0. [`RawPdfAdapter`](../../../hauska-engine/packages/corpus/src/adapters/raw-pdf/index.ts) carries the `ocr` hook; integration lands when first raw-PDF jurisdiction is named.
- **Vector embeddings pipeline.** voyage-3-large recommended per dispatch; `atom_embeddings` table declared; embed-on-write hook pending. Hybrid retrieval will gain vector candidates once this lands.
- **LLM generation hook for curated queries.** [`LlmQueryGenerator`](../../../hauska-engine/packages/corpus/src/curated-queries/index.ts) signature is provider-agnostic; the Claude binding wires up at the CLI layer next session.
- **Coverage dashboard UI.** Data already aggregated through `StoragePort.listJurisdictionStatus` + the cost-tracking port; UI surface (likely embedded in hauska-mcp-server ops endpoint or a small Astro page) is the next step.
- **Sync 5 — 20-jurisdiction batch ingest.** Gated on Sync 6 (Texas IP attorney memo, Nick action) for Tier 1+2+3 per the dispatch.

Sync points consumed:

- **Sync 1 — `@hauska/atom-contract@1.0.0` publication (cc-agent-AC owns).** On signal, atom-contract-pin's [`src/index.ts`](../../../hauska-engine/packages/atom-contract-pin/src/index.ts) flips its exports to `@hauska/atom-contract`; planner-owned Bump 1 PR pins the npm version in this repo's `packages/atoms/package.json`.
- **Sync 6 — Texas IP attorney opinion memo (Nick action, external).** Gates Tier 1+2+3 batch ingest. Bastrop + Grand County stay unblocked.

## Suggested canonical doc updates

This session targets the `hauska-engine` repo; no canonical doc edits are strictly required. Two light updates that keep the doc set in sync would be helpful but optional:

- **[`00_current_state.md`](../00_current_state.md) §5 (Recent session summaries):** prepend a line pointing at this session summary.
- **[`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md):** the four Stream 1A-D task checklists could flip the bootstrap + adapter-interface + structural-types + atom-registry + retrieval-API + eval-harness items from `[ ]` to `[x]` to reflect this session's foundation. Leaving them as-is is also defensible — the foundation is in place but the per-stream "first-city test" / "Bastrop validation" / "20-jurisdiction" exits all remain pending.

Neither update changes the sprint's open work; both are housekeeping.

## Commit batch

Two commits land this session close:

- `hauska-engine`: foundation commit. ~50 source files; pnpm-lock.yaml; CI workflow.
- `doc_repo`: this session summary.

No other doc_repo edits in this commit.
