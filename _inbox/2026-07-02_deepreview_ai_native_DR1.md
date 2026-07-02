---
id: 2026-07-02_deepreview_ai_native_DR1
title: "Deep review DR-1 — does the Hauska portfolio deliver on make data AI-native"
status: findings
last_updated: 2026-07-02
applies_to: portfolio
related: [09_post_saas_substrate_thesis, 08_tiered_access_model, 25_atom_architecture_reference, 28_mcp_first_product_design, 55_spine_data_intelligence_stack, adr_013_procedure_execution_atoms, adr_017_atom_access_control, adr_018_atom_contract_substrate_layer]
owner: planner
reviewer: DR-1 (read-only audit)
---

# Deep review DR-1 — data AI-native audit

Read-only adversarial audit against the "make data AI-native" claim. Evidence is from live `main` of three repos (`hauska-atom-contract`, `hauska-engine`, `hauska-mcp-server`, shallow-cloned 2026-07-02) plus the canonical doc set. Every load-bearing claim below cites a file. Where something is absent, the grep that established the absence is named.

Bottom line up front. The AI-native claim is substantially real on the read path and on the earning loop, and materially thin on three axes: semantic retrieval, agent write-back into the durable spine, and unstructured-file ingestion beyond code text. The most important gap and the most important recommendation are the same subject: unstructured file to atom. The portfolio has the shape (encumbrances carry `sourceDocumentCid`; workspace-attachment supports pdf/image/link/note) but not the running engine ingestion path for non-code files.

---

## 1. What is solid (with code evidence)

### 1.1 Structured cited atoms are real, not doc-fiction

The atom contract ships as a framework package with compile-time enforcement, not a spec. `hauska-atom-contract/src/registration.ts` + `registry.ts` enforce the four-layer contract (identity, context interface, composition, history); `defaultMode ∈ supportedModes` and completeness of `ContextSummary` fail typecheck (README lines 114-125, and the `runAtomContractTests` suite in `src/testing/index.ts`). Five render modes ship as a literal union.

Minted code atoms carry provenance at ingestion. `hauska-engine/packages/atoms/src/instances.ts:53-66` (`BaseAtomInstance`) requires `fetchedAt`, `sourceAdapter`, `sourceUrl`, `contentHash` (sha256). The atomizer wires those from adapter metadata (`packages/corpus/src/atomization/index.ts:265-285`). Timestamp + citation + source adapter are structural, not optional.

The MCP layer returns provenance on every tool result. `hauska-mcp-server/src/atom-shape.ts:46-60` (`AtomProvenanceEntry`) carries did, entityType, jurisdictionTenant, contentHash, `source.{adapter,url,fetchedAt}`. Free-tier responses force the `Powered by Hauska Engine — hauska.dev` attribution string (`buildEnvelope`, atom-shape.ts:134-143). This satisfies the quality-gate rule (source + timestamp on every output) at the wire level.

### 1.2 accessPolicy is real and enforced at the gate

Five-value union in the contract (`README` lines 174-179; `src/access-policy.types.test.ts`). Enforcement is live in the MCP server: `hauska-mcp-server/src/access-policy.ts:58-87` (`canReadAccessTarget`) branches on all five values; `effectiveAccessPolicy` (lines 40-45) defaults an unset+tenanted atom to `tenant-private` and an unset+untenanted atom to `public-free`. Auth resolves product+tenant from the `X-Hauska-Key` hash (`src/auth.ts:93-171`); malformed keys 401, unknown keys 401, inactive keys 403, and the no-header path resolves to `free_anonymous`/`public` seeing only `public-free` atoms (`src/tools.ts:189-193`). This matches the CLAUDE.md auth-header memory and ADR-017.

### 1.3 MCP is a genuine agent interface with broad coverage

59 tools across three product namespaces (verbatim enumeration in the appendix): 5 public (read-only substrate search), 5 Codex (plan review; 2 write), 49 Cortex (design accelerator; 22 write). Full read/write split: 35 read, 24 write. The product gate (`requireProduct`, tools.ts:233-246) blocks cross-product keys. This is a real, multi-product agent surface, not a single search endpoint. (Note: the doc set's "46 tools" figure in CLAUDE.md is stale; live main is 59, Cortex having grown substantially.)

### 1.4 The earned-confidence loop EXISTS and is LIVE (commitment #2 substantially met)

This is the strongest and most under-documented finding. `hauska-engine/packages/engine-core/src/calibration/` is a working calibration overlay, not a stub:

- `signals.ts` collects two signal families from ledgers: adjudication events (`finding.accepted|rejected|overridden`, `signals.ts:21-25`) and Phase-2 outcomes (`permit-approved|variance-granted|comment-resolved`, lines 27-31), keyed to the code-section atoms each finding cited.
- `compute.ts:14-23` blends the asserted prior with the observed success rate via Bayesian shrinkage: `(asserted*W + observedRate*n)/(W+n)`. With sparse signal it falls back to a per-class grain, then to the asserted baseline (`calibratedConfidence: null`).
- `overlay.ts:98-251` (`recomputeCalibrationOverlay`) persists the per-atom/per-class overlay, and `invalidateStaleCalibrationForAtom` (lines 413-444) marks calibration stale when the code edition/source-set stamp changes, dropping back to asserted.
- Tenant sovereignty (invariant I5) is enforced inside the loop: `buildSignal` (`signals.ts:208-266`) only pools a signal into the `public` partition when `tenant === "__anonymous__"` AND the atom is public-pool-eligible; tenant-private and tenant-shared signals stay in their own partition and never cross.

So the commitment-#2 posture in CLAUDE.md ("the earning loop exists and is live... confidence falls back to an asserted baseline carrying provenance") is accurate against code. The read path resolves calibrated-over-asserted with a `grade` field (`envelope/readPathConfidence.ts:40-55`, `overlay.ts:19-31` `effectiveConfidence`). Confidence is not a bare asserted number.

### 1.5 The contract has a three-axis widthed-confidence shape ready for the moat

`hauska-atom-contract/src/read-contract/` defines `ReadContract` with three axes (calibrated / asserted / consequence), each a `WidthedConfidence` that is inseparable from `n`, `intervalWidth`, and a `CalibrationProvenance` of `asserted|backtest|seed|live` (`common.ts:13-58`). Bare scalars are unrepresentable (branded nominal type, sole constructor `createWidthedConfidence`). A `ModelAttributionStamp` (`model-attribution.ts`) joins each judgment to model/prompt/context/sampling/retrieved-atom-set for the raw ledger. This is a well-designed calibration substrate.

### 1.6 There is a real end-to-end eval harness (per jurisdiction)

`hauska-engine/packages/corpus/src/eval/index.ts` runs a coverage gate against a curated query set: `top3RetrievalMin: 0.9`, `sectionNumRetrievabilityMin: 1.0`, `crossRefResolutionMin: 0.95` (`DEFAULT_QUALITY_BAR`, lines 30-40). Curated queries are human-reviewed rows (`curatedQueries` table). This is why the corpus can claim "34 jurisdictions all passing." It is a retrieval/coverage eval, not an agent-task eval (see gap 5).

---

## 2. Ranked gaps

### Gap 1 (highest) — No unstructured-to-atom ingestion beyond code text; no non-code file minting

The engine ingests exactly one unstructured class: code documents (PDF/HTML) into `code-*` atoms. `packages/corpus/src/adapters/` has Municode (HTML), eCode360, RawPdfAdapter (born-digital via pdfjs + scanned via Claude-vision/Tesseract OCR, `raw-pdf/index.ts`), ICC Code Connect, manual-curation. Output is always `NormalizedBlock[]` to `code-section|definition|cross-reference|amendment|edition|jurisdiction-corpus`. Grep for DWG, xlsx, csv, spreadsheet, dxf across the engine: no adapter. There is no path that takes an arbitrary property PDF (survey, title commitment, geotech report, ALTA, plat, spec sheet) or a spreadsheet/DWG and mints a domain atom. The RawPdfAdapter is code-shaped only (it emits code blocks). This is the single biggest hole under "make data AI-native": the substrate atomizes public code, not the private unstructured documents that actually sit in a dataroom.

The pieces to close it already exist but are unconnected: encumbrance atoms carry `sourceDocumentCid` (`encumbrances/recorded-instrument.ts:26`) and a `verificationStatus`; `workspace-attachment` supports `kind: link|image|pdf|note` with a `uri` (`workspace/workspace-attachment.ts`); product uploads (IFC, plan-review submission) already POST blobs to the legacy backend via `cortex_ifc_ingest` / `codex_snapshot_ingest`. What is missing is the engine ingestion path that turns an uploaded blob into a provenanced, confidence-carrying atom. Design in section 3.

### Gap 2 — Semantic/vector retrieval is schema-only; retrieval is keyword/structural

`hauska-engine/packages/storage/src/schema.ts:98-116` declares an `atomEmbeddings` table but the comment says "Real array placeholder; swap to `vector(d)` post pgvector migration." No embedding is ever computed: grep for embedding/embed/voyage/bge/e5/cosine across the engine returns only the schema declaration and a `--embed=<cents>` cost-capture flag in the ingest CLI (`tools/ingest-cli`). Retrieval is structural: `packages/retrieval/src/index.ts:76-84` forwards `q` to `storage.search` (SQL filter + score), and the MCP `search_atoms` passes the query string straight through (`hauska-client.ts:222-233`) returning a keyword `score`, not embedding similarity. Consequence: an agent must know the section number or hit the right keyword; it cannot retrieve by meaning ("what governs stormwater detention on a sloped lot"). For a substrate whose pitch is agent-native retrieval, meaning-based recall is table stakes and is absent. The interface is designed to accept it behind the same `search()` signature (retrieval/index.ts:9 comment), so this is a build, not a redesign.

### Gap 3 — Agent write-back into the durable spine is absent; ADR-013 procedure-execution atoms unimplemented

Grep for procedure-execution / procedureExecution / execution-atom / writeback across `hauska-engine`: zero. The engine mints atoms only from adapters; there is no code path for an agent to create a durable spine atom. The 24 MCP "write" tools are real side effects but they write to the legacy-design-tools backend as `legacy:<kind>:<rowId>` pseudo-DIDs (`atom-shape.ts:264-281`, `codexProvenance`), explicitly noting the canonical Hauska DID "materializes when the legacy atom-registry surfaces via the engine retrieval API" — i.e. the round-trip back into the spine is not wired. So: agents can drive product workflows, but agent actions do not yet become first-class provenanced execution atoms in the durable graph. This is the ADR-013 gap, and it is also the ECI-dogfooding gap (no execution atoms means no compounding execution memory). The calibration loop (1.4) consumes an adjudication ledger, so a ledger exists; promoting ledger rows to procedure-execution atoms is the missing lift.

### Gap 4 — The three-axis read-contract is defined but not propagated; MCP strips confidence

The good `ReadContract` shape (1.5) is not what flows to agents. The engine still emits the legacy scalar `EnvelopeConfidence { value, kind }` (`envelope/readPathConfidence.ts`, `envelope/schema.ts`), and the atom-contract README states propagation to MCP/cortex-api/Cortex/extension/map is a "Wave 2 co-bump after pinning ^1.4.0" (README line 298-299). Worse, at the MCP wire the confidence is stripped entirely: `AtomProvenanceEntry` has no confidence field (only `score`), and Codex tools are deliberately "rail-quiet," returning findings "without calibration grade fields" (`tools.ts:945-957`). So an agent consuming the public MCP today gets provenance + a keyword score but not the calibrated/asserted/width triple the substrate computes internally. The moat (calibrated reasoning) is computed and then withheld at the interface. Closing this is wiring, not research: emit `ReadContract` from the engine read path, carry it through the MCP envelope.

### Gap 5 — No agent-task eval; the eval measures retrieval coverage, not task completion

The eval harness (1.6) measures whether the right atom is retrievable, not whether an agent can complete a real jurisdictional task end-to-end over MCP (resolve place -> pull code + parcel + encumbrances -> produce a cited answer -> get graded). There is no golden-task set, no MCP-level transcript eval, no measure of "did the agent get the right answer with the right citations." For a company selling AI-native-ness, the absence of an agent-outcome eval means the core claim is unmeasured. Proposal in section 4.

### Gap 6 — Verifiability/portability (VDA + signing) is a no-op; cost is "trust requires the platform"

`wrapForStorage/unwrapFromStorage` are no-ops (`README` lines 218-225, `vda.ts`), and the history hash chain is deterministic SHA-256, not a real cryptographic anchor (`README` lines 199-212, `TODO(M2-C)`). The SDK payment/routing layer is unbuilt per `14_pricing_framework.md`. Cost of the absence: an atom's citation and confidence are only as trustworthy as the Hauska deployment that served them; an off-platform consumer (a PropTech embedder, a court, an opposing expert) cannot independently verify that a cited finding was produced at the claimed time with the claimed source without trusting Hauska's database. For a "portable living lineage" thesis this is the load-bearing unbuilt piece. It is correctly deferred for launch (the honest-claim discipline in ground-truth covers messaging), but it is the difference between "AI-native data on our platform" and "portable AI-native data," and the latter is the durable moat.

---

## 3. RECOMMENDED unstructured-to-atom design (the load-bearing deliverable)

Goal: the Hauska engine ingests an arbitrary unstructured file (PDF, image/scan, spreadsheet, DWG/IFC) and mints one or more provenanced, confidence-carrying atoms, powering the Cortex Dataroom tile today and a data marketplace later. The design reuses what already exists (encumbrance `sourceDocumentCid`, workspace-attachment, the calibration overlay, the adapter pattern) rather than inventing a parallel stack.

### 3.1 The embed-with vs point-to decision rule

Two storage relationships between the raw file (blob) and the atom. Pick per the nature of the source, not per file size alone.

Point-to (atom references the blob by CID/URI; blob stored once in object storage; atom holds `sourceDocumentCid` + extraction provenance). Default for every real-world document: recorded instruments, surveys, title commitments, geotech reports, plats, spec sheets, DWG/IFC, scanned anything. Rationale: the document is the durable legal/physical referent (the living-lineage principle, 25 §1) and must outlive any single extraction pass; multiple atoms extract from one document (a CC&R PDF yields many `restriction-clause` atoms all pointing at one `recorded-instrument` whose `sourceDocumentCid` is the blob); the blob is often large, binary, or license-encumbered (cannot be inlined into every atom copy or atompack). This is exactly the shape encumbrances already ship.

Embed-with (atom carries the extracted content inline in its body; no separate blob, or blob kept only as a provenance receipt). Default for small born-digital text fragments that ARE the atom: a code section's body text, a definition, a single restriction clause's enforceable snippet, a note attachment. Rationale: the fragment is small, text, and self-contained; the atom IS the unit of meaning, not a pointer to one; inlining makes the atom independently reasoning-ready (an atompack must carry the text so an off-platform LLM can use it without a blob fetch). This is what code-section atoms already do (bodyText inline, plus `contentHash`/`sourceUrl` as the receipt).

The rule in one line: embed-with when the atom's content is small text that is itself the meaning; point-to when the atom is a claim extracted FROM a document that remains the source of truth. Most dataroom content is point-to with embed-with children (the parent instrument points to the blob; the extracted clause atoms embed their snippet and reference the parent).

### 3.2 The engine ingestion path (file -> atom)

Add a `document-ingest` stream to `hauska-engine` parallel to the existing code atomization stream, with a document-adapter interface mirroring `CodeSourceAdapter`:

1. Upload + blob-pin. The blob lands in object storage (the engine storage port already abstracts a pin: `packages/storage/src/port.ts` writeAtom "pin to IPFS, index in Postgres, emit event"; extend the same port with a `pinBlob(bytes) -> { cid }` so documents get a content-addressed CID identical in shape to code atoms). One blob, one CID, deduped by content hash (`content-hash.ts` sha256 already exists).

2. Classify. A lightweight classifier routes the blob to a document adapter by type (recorded-instrument PDF, survey, geotech, spreadsheet-of-parcels, DWG/IFC). This is the analogue of the existing adapter `discover()`.

3. Extract to typed atoms. Each document adapter implements `extract(blob) -> AtomInstance[]`, emitting domain atoms (not code atoms): `recorded-instrument` + child `restriction-clause` (schemas already in the contract), or new `survey`/`geotech-finding`/`parcel-record` types registered in `packages/atoms/`. Extraction uses the same LLM-vision/OCR path the RawPdfAdapter already has for scans, plus structured parsers for spreadsheets/IFC (the `cortex_ifc_ingest` decoder already exists on the product side and should move behind this engine stream).

4. Attach provenance. Every minted atom gets `sourceDocumentCid` (the blob), `sourceAdapter`, `extractedAt`, `sourceUrl` (if any), `verificationStatus` (`unverified-web-source | extracted-unverified | human-verified`, the encumbrance `VerificationStatus` enum generalized). Provenance is structural, identical to code atoms.

5. Attach confidence via the existing overlay. This is the payoff of reusing the calibration package. A freshly extracted atom gets an asserted baseline keyed to its source type (`assertedBaselineFromSourceType` already exists) plus `provenance: "asserted"` on the calibrated axis with `n: 0`. As the atom is used in adjudications/briefs and outcomes land, the SAME `recomputeCalibrationOverlay` loop earns its calibrated confidence. No new calibration machinery. Extraction confidence (did the OCR/LLM read it right) rides the asserted axis; adjudicated-accuracy confidence rides the calibrated axis; both are the widthed `ReadContract` shape (3-axis) the contract already defines. Emit `ReadContract`, not the legacy scalar (this also closes Gap 4 for the new atoms first).

6. Access policy. Datarooom documents are private: default `tenant-private` (encumbrance schemas already refuse `public-free`). The gate (access-policy.ts) already enforces it. Tenant sovereignty holds automatically because the calibration loop already partitions tenant-private signals away from the public pool.

### 3.3 How it powers the Dataroom tile and a marketplace

Dataroom tile (now). The tile is a view over `property-workspace` composing `workspace-attachment` (the raw uploads) and the extracted atoms (`recorded-instrument`, `restriction-clause`, and new survey/geotech types) for one parcel. `compose_workspace` (MCP tool, already live) selects tiles from NL intent; the Dataroom is the tile that lists documents-with-their-extracted-atoms, each atom carrying its citation back to the `sourceDocumentCid` page and its confidence grade. This is the "drop a folder of property PDFs, get a cited, queryable place graph" product moment. It needs only the ingestion stream (3.2); the render, workspace, and gate already exist.

Marketplace (later). Because every extracted atom is content-addressed (CID), provenanced, access-policy-tagged, and confidence-graded, it is already a sellable unit. A marketplace SKU is a set of atoms filtered by accessPolicy (`public-paid`) and package (08 data-packages). The point-to design is what makes this safe: the marketplace sells the reasoning atoms (the extracted, calibrated claims — the margin) while the underlying licensed blob stays access-gated (never resold raw), which is exactly the binding constraint in 08 ("a package must never become a raw-data resale SKU"). The embed-with vs point-to split is therefore not just a storage choice; it is the commercial firewall between sellable reasoning and non-resellable source.

One-paragraph summary (as requested for the return): Ingest every real-world document as point-to (one content-addressed blob, atoms hold `sourceDocumentCid` + extraction provenance), and embed-with only small born-digital text fragments that are themselves the unit of meaning; add a `document-ingest` stream to the engine that pins the blob, classifies it, runs a per-type document adapter to extract typed domain atoms (reusing the RawPdfAdapter OCR/LLM path and the existing encumbrance/workspace schemas), stamps each atom with provenance + an asserted-baseline widthed confidence, and lets the already-live `recomputeCalibrationOverlay` earn the calibrated axis over time. The Dataroom tile is then a workspace view composing uploads with their extracted, cited, confidence-graded atoms, and the marketplace falls out for free because point-to keeps the licensed blob gated while the extracted reasoning atoms become the `public-paid` SKU — preserving the sell-reasoning-not-data firewall.

---

## 4. Proposed AI-native eval (measures the actual claim)

The existing eval measures retrieval coverage. Add an agent-task eval that measures whether an agent can complete a real jurisdictional task end-to-end over MCP, because that is the product claim.

Shape. A golden set of ~30-50 real tasks per launch jurisdiction, each a natural-language request an agent operator would actually make ("What are the setback and detention requirements for a 2-acre commercial lot at <address>, and are there recorded restrictions?"). Each golden task carries: the expected atom-set that must be cited, the expected answer key facts, and a max-tool-call budget.

Harness. Drive the real MCP server with a test agent (an LLM given only the MCP tools, no side channel). Score four things per task: (1) task success — did the answer contain the key facts, graded by an LLM judge against the answer key; (2) citation correctness — did the cited atom DIDs match the expected atom-set (precision/recall over citations); (3) grounding — every claim traces to a returned atom, zero uncited assertions; (4) efficiency — tool-call count vs budget, catching cases where keyword-only retrieval (Gap 2) forces excessive probing. Report per-jurisdiction pass rate at a bar (e.g. 0.85 task success, 0.9 citation recall) alongside the existing retrieval bar.

Why it matters here. This eval directly exposes Gaps 2, 3, 4: keyword-only retrieval shows up as low recall / high tool-count on meaning-shaped queries; the missing write-back shows up as tasks that need "record this adjudication" being impossible; the stripped confidence shows up as the judge being unable to weight a low-confidence answer. It turns three qualitative gaps into a tracked number and gives commitment #2 an outcome signal to calibrate against. It also becomes the natural gate for the unstructured-ingest work in section 3: add dataroom tasks ("given these three uploaded PDFs, what restricts this parcel") and the eval measures whether ingestion actually produced usable, cited atoms.

---

## Appendix — MCP tool inventory (59 tools, live main 2026-07-02)

Public (5, all read): search_atoms, get_atom, query_jurisdiction, search_permit_atoms, list_jurisdictions. Plus public+brokerage (read): list_property_workspaces, get_property_workspace, list_workspace_share_edges, resolve_place, get_place_layers, get_place_dossier.

Codex (5): codex_finding_generation (write), codex_findings_fetch (read), codex_override_write (write), codex_briefing_fetch (read), codex_snapshot_ingest (write).

Cortex (49): snapshot/BIM (cortex_snapshot_register w, cortex_ifc_ingest w, cortex_bim_model_query r); briefings/response-tasks (cortex_briefing_emit w, cortex_response_task_create/update_state/link w, cortex_response_task_list r, cortex_sheet_content_extraction_trigger w / _fetch r, cortex_attached_document_list/fetch r); deliverable letters (create/update_section/attach_provenance/send/render w, completeness_check/renders_list/list/fetch/render_download r); specs (cortex_detail_callout_spec_create/update_push_state/attach_aps_ref w, _list/_get r; cortex_product_spec_reference_create/refresh_status w, _list/_get r); Cortex L2 brokerage (generate_property_brief r+gen, get_property_brief_run r, simulate_site_drainage w, get_site_drainage/get_site_topography r, search_encumbrances/get_restrictions r, compose_workspace r); Cotality adapters (get_property_detail/get_replacement_cost/get_hazard_profile/get_parcel_polygon — inert pending CoreLogic OAuth).

Totals: 35 read, 24 write. Note CLAUDE.md's "46 tools" is stale.

## Evidence index (files read)

Contract: src/read-contract/{read-contract,common,model-attribution,index}.ts, src/encumbrances/recorded-instrument.ts, src/workspace/workspace-attachment.ts, README.md.
Engine: packages/engine-core/src/calibration/{compute,signals,overlay}.ts, packages/engine-core/src/envelope/readPathConfidence.ts, packages/corpus/src/adapters/raw-pdf/index.ts, packages/corpus/src/atomization/index.ts, packages/corpus/src/eval/index.ts, packages/storage/src/{schema,port,ipfs-port,content-hash}.ts, packages/atoms/src/instances.ts, packages/retrieval/src/index.ts.
MCP: src/{tools,atom-shape,access-policy,auth,hauska-client,gcs-writer}.ts.
Docs: 09, 08, 14, 25, 01a, 28, ADR-013, ADR-017, ADR-018, CLAUDE.md.
