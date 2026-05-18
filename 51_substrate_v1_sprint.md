---
id: 51_substrate_v1_sprint
title: Substrate v1 sprint — Code Ingestion Pipeline + Hauska MCP Server
status: active
last_updated: 2026-05-18
applies_to: portfolio
related: [11_roadmap, 11a_bastrop_live_roadmap, 27_engine_evolution_plan, 49_code_ingestion_pipeline, 50_hauska_mcp_server, adr_001_atom_architecture, adr_008_engine_factor_out, adr_010_atom_graph_traversal, adr_011_atom_identity_across_versions, adr_012_atom_export_format, adr_018_atom_contract_substrate_layer]
owner: nick
---

# Substrate v1 sprint

> **Purpose.** Single active-execution plan for two coupled v1 ships:
> the Code Ingestion Pipeline ([`49_code_ingestion_pipeline.md`](49_code_ingestion_pipeline.md))
> and the Hauska MCP Server ([`50_hauska_mcp_server.md`](50_hauska_mcp_server.md)).
> Both ship together; the MCP server is not launched publicly until the
> pipeline has produced a quality-gated jurisdiction corpus large enough
> to make the surface viable.
>
> **Status posture.** Sprint structured for velocity. Two repos, two
> tracks, four parallel streams per track, one cc-agent per stream
> (eight cc-agents total). Streams start in parallel; integrate at the
> sync points listed below. No timeframes — task completion drives the
> schedule.

## End state (combined v1 ship)

1. **`hauska-engine` repo** runs the Code Ingestion Pipeline in
   production: any Municode or eCode360 jurisdiction can be ingested
   into a quality-gated atomized corpus via a pipeline run.
2. **`hauska-mcp-server` repo** runs the public MCP endpoint at
   `mcp.hauska.dev` (or chosen domain), wired to the pipeline's
   retrieval API.
3. **Quality-gated jurisdiction corpus** of at least 20 jurisdictions
   (TX-first per [50_hauska_mcp_server.md](50_hauska_mcp_server.md)
   business model framing) passing the eval-harness quality bar.
4. **Listed in MCP directories**, callable from any MCP-capable agent,
   serving real traffic with logging captured for training-data and
   commercial-use monitoring.

## Repo layout

### `hauska-engine` (new — `empressaioemail-tech/hauska-engine`)

Bootstrapped fresh for net-new pipeline + substrate work. Does **not**
move existing engine code from `legacy-design-tools`; ADR-008's
post-Phase-2C factor-out timing for the existing engine is preserved.

```
hauska-engine/
├── packages/
│   ├── corpus/                  # Pipeline B.1–B.5
│   │   ├── src/
│   │   │   ├── adapters/        # Stream 1A
│   │   │   ├── extraction/      # Stream 1B
│   │   │   ├── atomization/     # Stream 1B
│   │   │   ├── eval/            # Stream 1D
│   │   │   └── version-tracking/# Stream 1D
│   ├── storage/                 # Stream 1C — IPFS + Postgres index
│   ├── identity/                # Stream 1C — DID + IPNS
│   ├── atoms/                   # Atom registry (Bump 1)
│   └── retrieval/               # Stream 1C — query API for MCP server
├── services/
│   ├── pipeline-runner/         # Stream 1A — orchestration runner
│   └── retrieval-api/           # Stream 1C — HTTP API consumed by MCP
└── tools/
    └── ingest-cli/              # Stream 1D — operator CLI for batch runs
```

### `hauska-mcp-server` (new — `empressaioemail-tech/hauska-mcp-server`)

Bootstrapped from the v1 scaffold at [`MCP Server/files (6)/`](MCP%20Server/files%20(6)/).

```
hauska-mcp-server/
├── src/
│   ├── index.ts                 # Stream 2D — entry + transport
│   ├── tools.ts                 # Stream 2A — tool surface
│   ├── hauska-client.ts         # Stream 2A — calls hauska-engine retrieval-api
│   ├── auth.ts                  # Stream 2B — keys + rate limit
│   ├── logger.ts                # Stream 2C — structured logging
│   └── billing.ts               # Stream 2B — Stripe (conditional)
├── docs/                        # Stream 2D — public docs site source
└── deploy/                      # Stream 2D — Dockerfile + cloudbuild
```

### Coordination touchpoints in existing repos

- **`legacy-design-tools`** — Bump 1 atom contract version bump
  affects `@hauska/atom-contract` consumers. Coordinated via cross-track
  task below.
- **`smartcity-os`** — Bump 1 consumer. Coordinated.
- **`legacy-revit-sensor`** — Bump 1 consumer. Coordinated.

## Cross-cutting work (impacts both tracks)

### Phase 0 — Decisions

Consolidated from [49](49_code_ingestion_pipeline.md) §Open decisions +
[50](50_hauska_mcp_server.md) §Open decisions. Recommended defaults in
parens.

- [x] **Revenue model** for MCP server (Scenario A / B / C — default
      Scenario B if no preference). Resolved 2026-05-16 as Scenario B
      per [`_decisions/2026-05-16_hauska_mcp_server_scenario_b.md`](_decisions/2026-05-16_hauska_mcp_server_scenario_b.md);
      Phase 8 (self-serve paid tier) moves in-scope.
- [x] **BD ownership** if Scenario C selected. N/A under Scenario B;
      revisit only if Scenario C ever activates.
- [x] **MCP hosting target** (Cloud Run). Resolved 2026-05-18; matches
      SmartCity OS operational posture.
- [x] **Tool surface trim** (drop `query_jurisdiction` parcel path;
      rename `get_permit_requirements` to `search_permit_atoms`).
      Resolved 2026-05-18; parcel atoms are Bump 2, out of v1 scope.
- [x] **Logging destination** (Postgres index per ADR-010 + GCS raw).
      Resolved 2026-05-18; keeps MCP traffic data joinable to
      atom-graph data.
- [x] **MCP backend coupling route** (Route A wraps `hauska-engine`
      retrieval-api now; no Route B needed since we're not waiting for
      legacy factor-out). Resolved 2026-05-18 as Route A.
- [x] **Key issuance** (manual at v1 via admin endpoint). Resolved
      2026-05-18; auto-issuance lands at Phase 8.
- [x] **Pipeline orchestration substrate** (Postgres job table +
      Cloud Run jobs). Resolved 2026-05-18; simplest viable option;
      revisit if scale forces a workflow framework.
- [x] **OCR provider** for raw-PDF jurisdictions (Claude vision primary,
      Tesseract fallback). Resolved 2026-05-18; raw PDF is P2-P3 per
      [49 §B.1](49_code_ingestion_pipeline.md), so this is a backstop.
- [x] **Quality bar threshold** (49's 90% top-3 / 100% section-num /
      95% cross-ref defaults; recalibrate after first 10 jurisdictions).
      Resolved 2026-05-18; recalibration check after batch-10 ingest.
- [x] **Curated query authoring** (LLM-generate from TOC, human-review
      first 20 jurisdictions, then trust eval harness). Resolved
      2026-05-18; Bastrop UDC stays Sylvia/Jaime reviewer-zero
      curation.
- [x] **Pre-publish review gate** (human review for first 20
      jurisdictions; eval-harness-only after). Resolved 2026-05-18;
      pairs with curated query authoring.
- [x] **TX-first prioritization list** (25-city list — confirm or edit;
      starter list in §Stream 1D below). Resolved 2026-05-18; all 25
      cities approved as listed at §Stream 1D below; M9 Tier-3 slot
      stays "Nick to name" deferred to batch-time.
- [x] **Cost budget for batch ingest** ($1–2K LLM + 60–100 person-hours
      for first 30 cities; source from where?). Resolved 2026-05-18;
      funded from Hauska Inc. equity per [`72_hauska_inc_operations.md`](72_hauska_inc_operations.md);
      3-county hard-kill checkpoint at Stream 1D enforces cost ceiling.
- [x] **MCP public launch domain** (`mcp.hauska.dev` or alternative).
      Resolved 2026-05-18 as `mcp.hauska.dev`; pending `hauska.dev`
      registration.
- [x] **`hauska.dev` domain status** (registered? if not, register).
      Decision logged 2026-05-18; not yet registered; Nick action item
      before Phase 5 deploy or Phase 7 launch per [`72_hauska_inc_operations.md`](72_hauska_inc_operations.md).

All sixteen Phase 0 items resolved 2026-05-18. Twelve adopted
inline-recommended defaults from 50 and 51; three were binary calls
landed in this session (cost source from Hauska Inc. equity;
`hauska.dev` registration deferred to Nick; 25-city list approved as
listed); revenue model was already resolved 2026-05-16. Combined
decision record at [`_decisions/2026-05-18_substrate_v1_phase_0_close.md`](_decisions/2026-05-18_substrate_v1_phase_0_close.md).
Stream-level dispatch across Tracks 1A-1D and 2A-2D now unblocked;
cc-agent assignments pending in [`00_current_state.md`](00_current_state.md)
agent-fleet section.

### Bump 1 atom contract coordination (sync point — load-bearing)

Single coordinated minor version bump of `@hauska/atom-contract` per
[27](27_engine_evolution_plan.md) Stream B Bump 1. Adds:

- `code-section`
- `code-definition`
- `code-amendment`
- `code-cross-reference`
- `code-edition`
- `jurisdiction-corpus`

Plus adjudication-context atoms (`adjudication-record`,
`per-reviewer-pattern`, `comparable-project-precedent`) from
[27](27_engine_evolution_plan.md) §Compounding-context atoms — these
ship in Bump 1 but are NOT exposed via MCP server (Layer 2 paid; stay
inside Codex 1b).

Consumers to coordinate (per [26_atom_upgrade_guide.md](26_atom_upgrade_guide.md)):

- [ ] `legacy-design-tools` `api-server` — version bump + atom
      validation
- [ ] `smartcity-os` `api-server` — consumer (no-op until 1b lands)
- [ ] `legacy-revit-sensor` — consumer (touches `detail-callout-spec`
      separately; bump compatibility only)
- [ ] `hauska-engine` `packages/atoms/` — new repo, lands at Bump 1
      version
- [ ] `hauska-mcp-server` — consumer; pin to Bump 1 version

Owner: planner coordinator role across all five repos. Single PR per
repo, atomically merged.

---

## Track 1 — Code Ingestion Pipeline (`hauska-engine` repo)

Four parallel streams. Each is one cc-agent's workstream. Streams start
simultaneously; sync points marked in dependencies.

### Stream 1A — Adapters + Pipeline runner

**Repo:** `hauska-engine` (bootstrap)
**Modules:** `packages/corpus/src/adapters/`, `services/pipeline-runner/`

- [ ] Bootstrap `hauska-engine` repo in `empressaioemail-tech` org with
      package layout above
- [ ] CI workflow (GitHub Actions) — lint, typecheck, unit tests
- [ ] Define adapter interface in `packages/corpus/src/adapters/types.ts`
      per [49 B.1](49_code_ingestion_pipeline.md): `discover()`,
      `fetch(reference)`, `metadata(reference)`, `normalize(raw)`
- [ ] Adapter contract test fixtures (so all adapter implementations
      pass the same conformance suite)
- [ ] **Municode HTML adapter** (`adapters/municode/`):
  - [ ] HTTP client with respectful crawl rate
  - [ ] HTML DOM walker → adapter intermediate format
  - [ ] Metadata extraction (publication date, edition string,
        jurisdiction)
  - [ ] Discovery: list available Municode jurisdictions in TX
  - [ ] First-city test: pick one non-Bastrop TX city, run end-to-end
- [ ] **eCode360 adapter** (`adapters/ecode360/`):
  - [ ] Identify whether public API or HTML-only access
  - [ ] Implement adapter contract
  - [ ] First-city test
- [ ] **Raw PDF adapter stub** (`adapters/raw-pdf/`):
  - [ ] Interface implementation
  - [ ] OCR integration per Phase 0 decision (Claude vision primary)
  - [ ] Defer full implementation past first batch — flagged as P3 in 49
- [ ] **Pipeline runner service** (`services/pipeline-runner/`):
  - [ ] Postgres job table schema (job_id, adapter, jurisdiction_ref,
        status, started_at, finished_at, error)
  - [ ] Cloud Run job triggered by Cron / manual invocation
  - [ ] Job state machine: queued → fetching → extracted → atomized →
        indexed → eval-running → loaded / failed
  - [ ] Retry policy + dead-letter handling
  - [ ] Operator CLI (`tools/ingest-cli/`) to enqueue jobs, list
        status, view failures

**Hand-offs to other streams:**
- Output of `normalize()` → consumed by Stream 1B
- Job table schema → consumed by Stream 1D (coverage dashboard)

### Stream 1B — Structural extraction + Atomization

**Repo:** `hauska-engine`
**Modules:** `packages/corpus/src/extraction/`, `packages/corpus/src/atomization/`, `packages/atoms/`

- [ ] Define structural tree types (`chapter`, `article`, `division`,
      `section`, `subsection`, `definition`, `cross-reference`,
      `amendment`, `note` per [49 B.2](49_code_ingestion_pipeline.md))
- [ ] Build Municode-HTML-shape structural extractor (Stream 1A
      output → typed tree)
- [ ] Cross-reference resolver: text "see § 5.04(b)" → typed link to
      sibling section node
- [ ] Definition extraction (defined terms inside sections + glossary
      sections)
- [ ] Amendment metadata extraction (date, authority, affected sections)
- [ ] Extraction quality fixture: ground-truth tree for sample of 50
      sections from first test city; extractor matches at ≥95% (49 B.2
      exit)
- [ ] **Atom type registration** (`packages/atoms/registry.ts`):
  - [ ] `code-section` per [27](27_engine_evolution_plan.md) Stream B
  - [ ] `code-definition`
  - [ ] `code-amendment`
  - [ ] `code-cross-reference`
  - [ ] `code-edition`
  - [ ] `jurisdiction-corpus`
  - [ ] Schema + Zod validation for each
  - [ ] Render mode stubs per ADR-001 (inline / compact / card /
        expanded / focus — focus polish-grade per ADR-012)
- [ ] **Atomization step** (structural tree → atoms):
  - [ ] Section node → `code-section` atom with full provenance
        (source adapter, fetched-at, content hash, CID per ADR-010,
        DID per ADR-011)
  - [ ] Definition node → `code-definition` atom
  - [ ] Cross-reference node → `code-cross-reference` link atom
  - [ ] Amendment node → `code-amendment` atom with chain link to
        affected section per ADR-011
  - [ ] Edition aggregation → `code-edition` atom referencing all
        sections at adoption
  - [ ] Jurisdiction-level rollup → `jurisdiction-corpus` atom
- [ ] Atomization output validation: spot-check 100 sections per
      jurisdiction match source text + hierarchy + cross-references
      (49 B.3 exit)

**Dependencies:**
- Adapter contract from Stream 1A
- Atom registry coordination with Bump 1 (cross-cutting)

**Hand-offs:**
- Atoms → Stream 1C for storage + indexing

### Stream 1C — Storage + Index + Identity + Retrieval API

**Repo:** `hauska-engine`
**Modules:** `packages/storage/`, `packages/identity/`, `packages/retrieval/`, `services/retrieval-api/`

- [ ] **Storage module** (`packages/storage/`):
  - [ ] Postgres index schema per [ADR-010](80_adrs/adr_010_atom_graph_traversal.md):
        `atoms (atom_did, cid, atom_type, jurisdiction_tenant,
        section_number, subsection_path, source_adapter,
        fetched_at, ...)`
  - [ ] Cross-reference edge table (`atom_links` with `from_cid`,
        `to_cid`, `link_type` per ADR-010 taxonomy)
  - [ ] IPFS pinning adapter (or chosen content-addressed store —
        revisit ADR-010 if Pinata / web3.storage / self-hosted)
  - [ ] Write path: atom → IPFS pin → Postgres index row → emit event
  - [ ] Read path: query → Postgres → IPFS fetch when content needed
  - [ ] Hot cache layer (Redis or in-process per ADR-010 deferred
        decision) — start in-process, promote to Redis under load
- [ ] **Identity module** (`packages/identity/`):
  - [ ] DID resolver per [ADR-011](80_adrs/adr_011_atom_identity_across_versions.md)
  - [ ] IPNS read surface (atom DID → latest CID lookup)
  - [ ] IPNS write surface (publish new CID for existing DID)
  - [ ] Key custody hooks (deferred per ADR-011; module exists to
        localize choice)
- [ ] **Vector embedding pipeline:**
  - [ ] Embedding model choice (text-embedding-3-large or
        voyage-3-large — recommend voyage for retrieval quality)
  - [ ] Embed atom bodies on write
  - [ ] Vector index in Postgres (pgvector) or separate (decision)
  - [ ] Hybrid retrieval combining structural (cross-reference graph)
        + vector (fuzzy similarity) per ADR-010 Alt 1
- [ ] **Retrieval API service** (`services/retrieval-api/`):
  - [ ] HTTP endpoints consumed by hauska-mcp-server Stream 2A:
    - [ ] `GET /search?q=&jurisdiction=&limit=` → atom references
    - [ ] `GET /atoms/:did?includeComposition=true` → full atom
    - [ ] `GET /jurisdictions/:id?queryType=...` → jurisdiction data
    - [ ] `GET /jurisdictions/:id/permits?projectType=` → permit-tagged
          atoms (the renamed `search_permit_atoms` target)
    - [ ] `GET /jurisdictions` → list of loaded jurisdictions w/
          quality status
  - [ ] Auth: internal API key between MCP server and retrieval API
  - [ ] Response shapes match atom contract per ADR-001
  - [ ] Latency contract: P99 ≤ 500ms for index queries; P99 ≤ 2s when
        IPFS fetch needed
  - [ ] Health endpoint + readiness probe
  - [ ] Cloud Run deployment

**Dependencies:**
- Atom types from Stream 1B
- Coordinates with Stream 1D on quality status field in
  `jurisdiction-corpus` response

**Hand-offs:**
- Retrieval API URL + auth → Stream 2A
- Index query interface → Stream 1D eval harness

### Stream 1D — Eval harness + Curated queries + Batch ingest + Coverage dashboard

**Repo:** `hauska-engine`
**Modules:** `packages/corpus/src/eval/`, `packages/corpus/src/version-tracking/`, `tools/ingest-cli/`

- [ ] **Eval harness skeleton** (`packages/corpus/src/eval/`):
  - [ ] Curated query schema: `(jurisdiction, query_text, expected_atom_did, query_type)`
  - [ ] Retrieval test runner: query → retrieval API → check top-3 contains
        expected atom; report pass/fail per query + aggregate
  - [ ] Coverage test runner: sample N atoms; check each retrievable
        by section number (49 B.4 100% target)
  - [ ] Cross-reference test runner: sample N `code-cross-reference`
        atoms; check each `to_cid` resolves to a real atom (49 B.4
        95% target)
  - [ ] Quality bar enforcement: `evaluate(jurisdiction) →
        {passed: bool, scores: {...}, failures: [...]}`
  - [ ] CLI integration: `ingest-cli eval bastrop-tx`
- [ ] **Curated query authoring:**
  - [ ] LLM-generate first-pass queries from each jurisdiction's TOC
        (Claude prompt + jurisdiction-corpus atom)
  - [ ] Human review tooling (CLI to walk query list, mark accept /
        edit / reject; persist to Postgres `curated_queries` table)
  - [ ] Bastrop UDC queries: human-reviewed by Nick or planner;
        gold-standard set
  - [ ] Grand County IRC queries: same
  - [ ] First TX batch queries: LLM + light human review
- [ ] **Version tracking (B.5)** (`packages/corpus/src/version-tracking/`):
  - [ ] Drift detection: re-fetch source per jurisdiction on schedule;
        diff structural extraction; flag changes
  - [ ] Amendment ingestion path: new ordinance → `code-amendment`
        atom + new CID on affected `code-section` per ADR-011 chain
  - [ ] Edition tracking: `code-edition` atom version on amendments
  - [ ] Operator review surface for flagged drift (manual triage
        before atom updates)
- [ ] **Coverage dashboard (B.6 ops surface):**
  - [ ] Loaded jurisdictions list (jurisdiction, edition, last refresh,
        quality status, atom count, drift status)
  - [ ] Per-jurisdiction quality detail (top-3 score, section-num
        score, cross-ref score)
  - [ ] Failed eval history (which queries failed, against which
        sections, suggested fixes)
  - [ ] Surface for hauska-mcp-server `list_jurisdictions` tool (only
        loaded + quality-passing jurisdictions appear)
- [ ] **Cost-per-jurisdiction tracking** (per catalog roadmap
      2026-05-15):
  - [ ] Per-jurisdiction compute cost capture (LLM tokens, OCR
        spend, embedding compute, infrastructure attributable)
  - [ ] Per-jurisdiction human-review-hours capture (operator CLI
        records review-start / review-finish per jurisdiction)
  - [ ] Dashboard line: cost-per-jurisdiction vs. **target of $200
        compute + 1 hr human review**
  - [ ] Flag-and-review pipeline: jurisdictions exceeding target
        surface for engineering review (not silently absorbed)
  - [ ] **Hard-kill checkpoint** at 3 counties: if the metric is not
        achievable after first three counties (proof set in early
        batch ingest), halt catalog expansion and surface to Nick for
        thesis review per catalog roadmap Move 3
- [ ] **B.6 Bastrop validation pass:**
  - [ ] Run full pipeline against Bastrop UDC
  - [ ] Diff atom output against A.1 one-off load
  - [ ] Investigate any quality deltas; iterate on adapters /
        extraction until parity or improvement
  - [ ] Same for Grand County IRC
- [ ] **First TX batch ingest** (Tier 1 + Tier 2 from 50 starter list):
  - **Tier 1 (Bastrop-network):**
  - [ ] Round Rock
  - [ ] Pflugerville
  - [ ] Cedar Park
  - [ ] Leander
  - [ ] Hutto
  - [ ] Elgin
  - [ ] Smithville
  - [ ] Manor
  - [ ] Taylor
  - [ ] Georgetown
  - **Tier 2 (major TX metros):**
  - [ ] Austin
  - [ ] San Antonio
  - [ ] Fort Worth
  - [ ] El Paso
  - [ ] Plano
  - [ ] Arlington
  - [ ] Irving
  - [ ] Garland
  - [ ] Lubbock
  - [ ] Laredo
  - **Tier 3 (open pipeline targets):**
  - [ ] Jarrell
  - [ ] M9 candidate (Nick to name)
  - [ ] Frisco
  - [ ] McKinney
  - [ ] Killeen
- [ ] **eCode360 batch** (post-Stream 1A eCode360 adapter): Houston,
      Dallas, others identified as eCode360-resident
- [ ] **Per-jurisdiction quality gate:** ingest job marks jurisdiction
      "loaded" only when eval harness passes quality bar

**Dependencies:**
- Eval harness needs retrieval API from Stream 1C
- Batch ingest needs adapters from Stream 1A
- Atoms from Stream 1B feed everything

**Hand-offs:**
- Quality-passing jurisdiction list → MCP server `list_jurisdictions`

---

## Track 2 — Hauska MCP Server (`hauska-mcp-server` repo)

Four parallel streams. Each is one cc-agent's workstream.

### Stream 2A — Backend coupling + Tool surface

**Repo:** `hauska-mcp-server`
**Modules:** `src/hauska-client.ts`, `src/tools.ts`, `src/index.ts`

- [ ] Bootstrap `hauska-mcp-server` repo from scaffold at
      [`MCP Server/files (6)/`](MCP%20Server/files%20(6)/)
- [ ] CI workflow (lint, typecheck, build, unit tests)
- [ ] **Wire `hauska-client.ts` to `hauska-engine` retrieval API**
      (Stream 1C handoff):
  - [ ] `searchAtoms()` → `GET /search`
  - [ ] `getAtom()` → `GET /atoms/:did`
  - [ ] `queryJurisdiction()` → `GET /jurisdictions/:id`
  - [ ] `getPermitRequirements()` → `GET /jurisdictions/:id/permits` (or renamed endpoint)
  - [ ] `listJurisdictions()` → `GET /jurisdictions`
- [ ] **Tool surface trim** per Phase 0 decision:
  - [ ] Drop `query_jurisdiction` `parcel_id` / `address` parameters
        (Bump 2 atoms; out of v1 scope)
  - [ ] Rename `get_permit_requirements` to `search_permit_atoms` —
        update Zod schema, description, handler call
  - [ ] Update tool descriptions for honest LLM consumption (no
        overreach into engine-reasoning territory)
- [ ] Atom-shape response formatting (atom DID, CID, source, content
      hash visible in every response)
- [ ] Attribution metadata in every free-tier response
      ("Powered by Hauska Engine — hauska.dev")
- [ ] Tool integration tests against live `hauska-engine` retrieval API
- [ ] Local end-to-end test: spin up local hauska-engine + local MCP
      server + MCP Inspector

**Dependencies:**
- Retrieval API URL + auth from Stream 1C
- Bump 1 atom contract version pin

**Hand-offs:**
- Working server → Stream 2D for deploy + cross-client testing

### Stream 2B — Auth + Rate limiting + Key issuance + Billing scaffold

**Repo:** `hauska-mcp-server`
**Modules:** `src/auth.ts`, `src/billing.ts`, admin endpoints

- [ ] **Rate limiter:**
  - [ ] Replace in-memory bucket with Redis (Upstash for serverless
        compatibility)
  - [ ] Per-IP bucket for free tier
  - [ ] Per-key bucket for paid tiers
  - [ ] Four tier bands enforced (Free / Developer Pro / Team /
        Embedder)
  - [ ] RPM config in env vars per tier
- [ ] **API key model:**
  - [ ] Postgres schema: `api_keys (key_id, key_hash, tier,
        owner_email, owner_name, created_at, last_used_at, status,
        notes)`
  - [ ] Key generation utility (cryptographic random, prefix-tagged
        per tier `hk_free_*`, `hk_pro_*`, `hk_team_*`, `hk_emb_*`)
  - [ ] Key hashing (SHA-256) — never log raw
- [ ] **Admin endpoints** (bootstrap-key protected):
  - [ ] `POST /admin/keys` — mint new key
  - [ ] `GET /admin/keys` — list keys
  - [ ] `PATCH /admin/keys/:id` — tier change, revoke, notes
  - [ ] `DELETE /admin/keys/:id` — revoke
- [ ] **Stripe scaffold** (conditional on Phase 0 scenario B/C; stub
      for A):
  - [ ] Stripe product + price catalog
  - [ ] Customer signup → Stripe checkout → webhook → key mint
  - [ ] Subscription state sync (active / past_due / canceled →
        key.status)
  - [ ] Upgrade / downgrade flow
- [ ] **Self-serve signup** (conditional B/C; stub for A):
  - [ ] Public signup endpoint
  - [ ] Email verification
  - [ ] Auto-key issuance on payment
- [ ] Per-tier rate-limit conformance tests

**Dependencies:**
- Postgres access (shared with hauska-engine or separate DB; Phase 0
  decision)

**Hand-offs:**
- Auth middleware composed into request pipeline by Stream 2A
- Stripe + signup endpoints integrated by Stream 2D for docs

### Stream 2C — Logging + Observability + Dashboards

**Repo:** `hauska-mcp-server`
**Modules:** `src/logger.ts`, dashboards in BigQuery / Looker / chosen tool

- [ ] **Structured logger** per Phase 0 decision:
  - [ ] Default: Postgres index (per ADR-010) + GCS raw payloads
  - [ ] Alternative: BigQuery + GCS if Postgres pressure is concern
  - [ ] Log shape: `{ts, request_id, method, params, ip, key_hash, tier,
        response_status, atom_ids_returned, latency_ms, tool, jurisdiction}`
  - [ ] Per-request: log on entry + log on response
  - [ ] Per-tool-call: log inside tool handler with tool-specific fields
- [ ] **Cloud Logging integration:**
  - [ ] Structured JSON to stdout/stderr
  - [ ] Log-based metric: error rate, P99 latency
  - [ ] Alerts: error rate > X%, P99 > Y ms
- [ ] **Dashboards** (BigQuery + Looker Studio or chosen tool):
  - [ ] Calls/day by tool, jurisdiction, tier
  - [ ] Top jurisdictions queried
  - [ ] Top tools called
  - [ ] Error rate
  - [ ] Latency histograms
  - [ ] New free-tier IPs (potential commercial-use candidates)
  - [ ] High-volume free-tier IPs (commercial-use detection — surface
        for BD outreach)
  - [ ] Per-key usage (paid tier)
- [ ] **Training-data export query:**
  - [ ] Anonymized request/response export
  - [ ] Per-tool call sequences
  - [ ] Ready for fine-tuning / eval ingest
- [ ] **Cost monitoring:**
  - [ ] Per-tier cost attribution (compute + storage)
  - [ ] Free-tier cost vs. paid-tier revenue dashboard
- [ ] Health check endpoint enhancements (latency stats,
      last-successful-call timestamp, dependency health)

**Dependencies:**
- Postgres / BigQuery destination decision (Phase 0)

**Hand-offs:**
- Dashboard URLs → Nick + planner ops review

### Stream 2D — Deploy + Docs + Cross-client testing + Launch prep

**Repo:** `hauska-mcp-server`
**Modules:** `deploy/`, `docs/`, launch artifacts

- [ ] **Containerization:**
  - [ ] `Dockerfile` — Node 20 base, multi-stage build
  - [ ] `.dockerignore`
  - [ ] Local build + run verification
- [ ] **Cloud Run deployment:**
  - [ ] `cloudbuild-mcp.yaml` mirroring SmartCity OS pattern
  - [ ] Cloud Run service spec (autoscale, min-instances=1, region
        us-central1 default)
  - [ ] Secret Manager bindings (BACKEND_URL, BACKEND_KEY, REDIS_URL,
        DATABASE_URL, STRIPE_KEYS, ADMIN_BOOTSTRAP_KEY)
  - [ ] Cutover env-var bind procedure per
        [`90_runbooks/cutover_env_var_bind_procedure.md`](90_runbooks/cutover_env_var_bind_procedure.md)
        — every env reference traced, no silent drops
  - [ ] Custom domain (`mcp.hauska.dev` per Phase 0; register
        `hauska.dev` if not registered)
  - [ ] TLS managed cert
  - [ ] Cloud Armor / WAF config
- [ ] **Docs site:**
  - [ ] Static site (Astro / Next.js / Docusaurus — pick lightest)
  - [ ] Subdomain `mcp.hauska.dev/docs` or `docs.hauska.dev`
  - [ ] Schema reference auto-generated from Zod schemas
  - [ ] Example queries page
  - [ ] Free vs paid tier definitions
  - [ ] ToS + commercial-use boundary page
  - [ ] Privacy policy (training-data capture disclosure)
  - [ ] Attribution requirements page
  - [ ] Quickstart: Claude Desktop config
  - [ ] Quickstart: Claude Code config
  - [ ] Quickstart: custom SDK agent
- [ ] **Cross-client testing:**
  - [ ] MCP Inspector pass against staging
  - [ ] Claude Desktop pass against staging
  - [ ] Claude Code pass against staging
  - [ ] Cursor pass against staging
  - [ ] Custom Anthropic SDK example agent — public repo / gist
  - [ ] Multi-step agent demo (search → get atom → cross-reference
        traversal)
- [ ] **Launch preparation:**
  - [ ] Anthropic MCP directory submission package
  - [ ] `awesome-mcp-servers` GitHub PR draft
  - [ ] Launch blog post draft (`hauska.dev/blog/mcp-v1`)
  - [ ] HackerNews launch post draft + Show HN tag
  - [ ] ProductHunt launch package
  - [ ] Social posts (LinkedIn, X) drafted
  - [ ] PropTech-press outreach list (publications, journalists)
  - [ ] BD pitch deck draft (conditional on Scenario C)
  - [ ] Per-jurisdiction pricing sheet (conditional Scenario B/C)
- [ ] **Public launch coordination:**
  - [ ] Final flip to public DNS
  - [ ] MCP directory submission live
  - [ ] awesome-mcp PR merged
  - [ ] Launch posts published
  - [ ] First external (non-Hauska) MCP call captured in logs

**Dependencies:**
- Working server from Streams 2A/2B/2C
- Quality-gated 20+ jurisdiction corpus from Track 1 (launch gate, not
  development gate — streams 2A/2B/2C/2D's pre-launch work proceeds
  regardless)

**Hand-offs:**
- Production endpoint serving real traffic = sprint exit

---

## Sync points across tracks

Critical points where streams synchronize:

| # | Sync point | Streams | Gate |
|---|---|---|---|
| 1 | Bump 1 atom contract published | 1B + (all consumers) | Both tracks can pin to a real atom contract version. Cross-cutting work above. |
| 2 | Adapter contract stable | 1A → 1B + 1D | Stream 1B can hard-wire to adapter output; Stream 1D can write eval against actual ingested cities. |
| 3 | Retrieval API contract stable | 1C → 2A | Stream 2A wires real client; until then 2A uses mocked client identical in shape. |
| 4 | First jurisdiction passes eval | 1D → 2D launch gate | Pre-launch: at least Bastrop UDC passes quality bar. |
| 5 | Quality-gated 20-jurisdiction corpus | 1D → 2D launch gate | Public launch unblocked. |
| 6 | Texas IP attorney opinion memo delivered | external (Nick, [`11`](11_roadmap.md) P1) → 1D batch ingest | Non-Bastrop ingestion (Tier 1+2+3 city batches) gated on attorney memo per catalog roadmap 2026-05-15 Move 1. Bastrop + Grand County remain unblocked (one-off load + B.6 validation). |

Streams 2A/2B/2C/2D all proceed against mocked / staged backends before
sync point 3 lands. Real wiring follows the moment 1C publishes the
retrieval API contract.

## Open decisions (consolidated — same list as Cross-cutting Phase 0)

See [Cross-cutting work — Phase 0](#phase-0--decisions) above.

## What's deliberately deferred (v2 / post-launch)

- **OAuth 2.1** auth (v1 = header API keys)
- **MCP Resources + Prompts** primitives (v1 = Tools only)
- **Parcel Intelligence atoms** (Bump 2; sequencing per
  [46](46_smartcity_parcel_intelligence.md) open question #1)
- **Adjudication-context atoms exposed via MCP** (stay Layer 2;
  Codex-only)
- **Audit-trail-anchor** atoms (gated on [27](27_engine_evolution_plan.md)
  Stream E SDK closure)
- **Cross-jurisdictional precedent queries** (paid feature; not free
  tier)
- **National expansion past TX-first batch** (post-launch; each
  jurisdiction is a pipeline run)
- **Customer-zero (Sylvia / Jaime) curated queries for Bastrop** (do
  this for Bastrop only at first; LLM-generated for rest)
- **Anonymous-aggregate adjudication patterns** as free-tier teaser
  ([08](08_tiered_access_model.md) Open for refinement)
- **PropTech embedder pitches** (Stream 2D launch-prep includes deck
  draft; outreach is Scenario C conditional)

## Risks (sprint-level)

1. **Bump 1 coordination friction.** Five repos to coordinate. If any
   consumer can't accept the bump in the sprint window, both tracks
   wait. Mitigation: planner-led coordinator role; PRs prepared in
   parallel across all repos and atomically merged.
2. **Extraction quality on Municode is worse than expected.** Some
   jurisdictions have inconsistent Municode structure. Mitigation:
   Stream 1B quality fixture catches early; Stream 1D eval harness
   refuses to mark a jurisdiction "loaded" if quality bar fails.
3. **Retrieval latency at 20+ jurisdictions blows past P99 target.**
   Mitigation: Stream 1C hot cache + pgvector tuning + read replica if
   needed; revisit ADR-010 storage substrate if structural problem.
4. **Track 1 batch ingest blocks on adapter edge cases.** Some
   Municode cities have non-standard structures. Mitigation: per-city
   adapter override path; flag manual-curation cases; don't block batch
   on single-city issues.
5. **Cost overruns on LLM-driven extraction.** Claude vision for OCR
   + LLM-generated curated queries is non-trivial cost. Mitigation:
   per-job cost cap; Phase 0 cost budget decision; promote to cheaper
   models post-quality-baseline.
6. **MCP transport churn.** Streamable HTTP spec evolves. Mitigation:
   SDK version pinned; reassess at v2.
7. **Public launch optics with 20 cities only.** Some commenters will
   say "only TX?" Mitigation: launch narrative is "first 20 of every
   TX city — national next"; eCode360 batch comes fast.

## Cross-references

- [`11_roadmap.md`](11_roadmap.md) — portfolio roadmap; sprint appears
  at P1
- [`11a_bastrop_live_roadmap.md`](11a_bastrop_live_roadmap.md) — Track A
  Sprint A.1 corpus load coordinates with this sprint's B.6 validation
  pass
- [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md) — Stream A
  module structure, Stream B Bump 1 atoms, Stream C engine quality work
  (parallel-eligible with this sprint)
- [`49_code_ingestion_pipeline.md`](49_code_ingestion_pipeline.md) —
  canonical pipeline design (B.1–B.6); this sprint executes against it
- [`50_hauska_mcp_server.md`](50_hauska_mcp_server.md) — MCP product
  framing, business model, tier shape; this sprint executes the v1
  ship within that framing
- [`08_tiered_access_model.md`](08_tiered_access_model.md) — tier model;
  Layer 1 surface this sprint operationalizes
- [`14_pricing_framework.md`](14_pricing_framework.md) — pricing posture
  for embedder deals
- [`80_adrs/adr_001_atom_architecture.md`](80_adrs/adr_001_atom_architecture.md)
  — atom contract
- [`80_adrs/adr_008_engine_factor_out.md`](80_adrs/adr_008_engine_factor_out.md)
  — `hauska-engine` brand placement; this sprint bootstraps the repo
  for net-new pipeline work without disturbing legacy factor-out timing
- [`80_adrs/adr_010_atom_graph_traversal.md`](80_adrs/adr_010_atom_graph_traversal.md)
  — IPFS storage + Postgres index substrate
- [`80_adrs/adr_011_atom_identity_across_versions.md`](80_adrs/adr_011_atom_identity_across_versions.md)
  — DID + IPNS identity
- [`80_adrs/adr_012_atom_export_format.md`](80_adrs/adr_012_atom_export_format.md)
  — `.atompack` offline format (complement to MCP live-query)
- Scaffold: [`MCP Server/files (6)/`](MCP%20Server/files%20(6)/)

## Revision history

- **2026-05-15 (origin).** Combined sprint plan superseding the
  standalone sprint sections in 49 and 50. Two repos
  (`hauska-engine` + `hauska-mcp-server`), two tracks, four parallel
  streams per track, eight cc-agents total. No timeframes; task-list
  driven. Phase 0 decisions consolidated. Sync points across tracks
  named. Velocity-first posture.
- **2026-05-15 (v2).** Catalog roadmap dialogue absorbed. Stream 1D
  Coverage dashboard section gained cost-per-jurisdiction tracking
  tasks ($200 + 1hr target; 3-county hard-kill checkpoint per
  catalog Move 3). New sync point #6 added: Texas IP attorney memo
  delivery gates non-Bastrop ingestion. Bastrop + Grand County stay
  unblocked (one-off + B.6 validation pass). See dialogue archive
  at [`_sessions/2026-05-15_catalog_roadmap_input.md`](_sessions/2026-05-15_catalog_roadmap_input.md)
  through `_response_reply.md`.
- **2026-05-18 (ADR-018 doc-set sweep).** Bump-1 atom-contract
  coordination references (Coordination touchpoints — legacy-design-tools
  line; Bump 1 minor-version-bump line) renamed from `@empressaio/atom`
  to `@hauska/atom-contract` per [ADR-018](80_adrs/adr_018_atom_contract_substrate_layer.md).
  Atom contract is Hauska commercial substrate, peer to the Hauska SDK.
  `related` field extended to ADR-018. No sprint-plan content changes.
- **2026-05-18 (Phase 0 close).** All sixteen Phase 0 items resolved
  per [`_decisions/2026-05-18_substrate_v1_phase_0_close.md`](_decisions/2026-05-18_substrate_v1_phase_0_close.md).
  Twelve items adopted inline-recommended defaults from 50 and 51;
  three new binary calls landed (cost budget from Hauska Inc. equity
  per [`72_hauska_inc_operations.md`](72_hauska_inc_operations.md);
  `hauska.dev` registration deferred to Nick as pre-launch action;
  25-city TX-first list approved as listed with Tier-3 M9 slot
  deferred to batch-time); revenue model was already resolved
  2026-05-16. Stream-level dispatch across Tracks 1A-1D and 2A-2D now
  unblocked. No engineering content changed; the close ratifies the
  v1 sprint scope and surfaces one open Nick action (`hauska.dev`
  registration).
