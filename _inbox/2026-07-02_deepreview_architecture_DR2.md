---
id: deepreview_architecture_DR2
title: "Deep review DR-2 — does the Hauska architecture hold at scale (100+ tenants)?"
status: review
last_updated: 2026-07-02
applies_to: portfolio
owner: nick
related: [80_adrs/adr_005_multitenancy, 80_adrs/adr_008_engine_factor_out, 54_tenant_leg_sprint, 55_spine_data_intelligence_stack, 56_engine_extraction_sprint, _architecture_homes/00_overview, 04a_arrow_two_calibration_capture]
---

# Deep review DR-2 — architecture at scale

Read-only audit against live source (three spine repos cloned shallow from `empressaioemail-tech` 2026-07-02: hauska-engine, legacy-design-tools, hauska-mcp-server) plus the canonical doc set. Question: does the system hold at 100+ tenants under real load. Findings ranked blocker / important / growth, each with a file cite and a fix. Leads with tenancy.

Bottom line up front. The spine is in materially better shape than the doc set says. Two of the four things the docs call open are actually done in code: the engine reasoning IS lifted out of cortex-api (the C3 BFF cut, unconditional), and the Cotality map-mesh cache gap IS closed (cc-agent-D's three-tier cache). The real load-bearing gap is unchanged and singular: tenancy is a resolved key column and a half-wired enforcement path, not an enforced multi-tenant partition. Everything in the multi-investor / digital-twin vision that needs "my private data, isolated" is blocked on the same primitive, and that primitive is only built on one of the two surfaces that matter.

---

## 1. TENANCY / AUTH — the load-bearing gap (BLOCKER)

### What is actually built (verified)

The tenant primitive exists at the gate and is real, not vapor.

- `hauska-mcp-server/src/auth.ts` — `AuthContext` carries `jurisdiction_tenant?: string | null` and `platform_internal?: boolean` (ADR-005 Layer A, merged #29).
- `hauska-mcp-server/src/db.ts` — `api_keys` has `jurisdiction_tenant` and `platform_internal` columns; `createKey`/`updateKey` bind them (migration 004).
- `hauska-mcp-server/src/access-policy.ts` — `canReadAccessTarget()` implements the full five-value union correctly (public-free / public-paid / platform-internal / tenant-private / tenant-shared), including the shared-with list and the platform-internal bypass. This is clean, well-factored code with the right defaults (`effectiveAccessPolicy` falls an unset policy back to `tenant-private` when a tenant is present, `public-free` otherwise — the conservative default ADR-005 specified).
- `hauska-mcp-server/src/tools.ts` — enforcement (`filterByAccessPolicy`, `canReadAccessTarget`, `logAccessDenied`) is wired into the **corpus/retrieval** tools: `search_atoms`, `get_atom`, `query_jurisdiction`, `search_permit_atoms`, `list_jurisdictions` (8 enforcement call sites, lines ~215–582).

### What breaks without the rest (the gap)

The gap is that the partition is enforced on the wrong half of the tool surface and is not yet a per-user/per-tenant *collection* model.

1. **The reasoning/product tools do not enforce at the gate.** Of the 62 tools, roughly 40 are `legacyClient.*` calls (findings, briefing, place dossier, property workspaces, workspace share edges, response tasks, deliverable letters, snapshots, BIM — `tools.ts` lines 629–2757). None of them call `filterByAccessPolicy`. They forward `X-Hauska-Jurisdiction-Tenant` / `X-Hauska-Platform-Internal` headers to cortex-api (`hauska-mcp-server/src/legacy-client.ts`, `gateFrontScopeHeaders()`) and trust cortex-api to enforce downstream. So the sovereignty claim ("a tenant reads only its own atoms through the gate") holds for the corpus read path but is delegated, not gate-enforced, for the entire reasoning and workspace surface — which is exactly the surface a digital-twin tenant lives in.

2. **cortex-api self-asserts the tenant context instead of receiving it from an enforcing gate.** `legacy-design-tools/artifacts/api-server/src/lib/engineSpineClient.ts` says it plainly: cortex-api "constructs the gate-front context from the inbound request's jurisdiction tenant resolution — the same partition the MCP gate would forward." cortex-api calls engine-api **directly** over `ENGINE_API_URL` with a service bearer, not through the MCP gate. The gate-front *contract* (headers) is honored; the gate-front *chokepoint* is bypassed. There is no single control plane where a tenant boundary is enforced for reasoning; there are two code paths (gate for corpus, cortex-api self-declaration for reasoning) that each assert the same partition. At one tenant (anonymous default) this is invisible. At 100 tenants it is two enforcement surfaces that can drift.

3. **No per-user / per-tenant private atom-collection primitive exists yet.** The multi-investor twin needs "this investor's parcels, adjudications, and deal atoms are a private collection nobody else can read." Today: `accessPolicy` reads are enforceable, but the *write* path that mints a `tenant-private` atom scoped to the creating actor, and the *collection* semantics (my workspace, my deal book) are not built. `54_tenant_leg_sprint.md` step 2 (gate-front seam generalization) and the SmartCity-on-spine task are still QUEUED; ADR-005's "migration of existing atoms to populate accessPolicy correctly" is marked **Still open**. Per CLAUDE.md and `55` §7, the corpus today is 32 platform-internal + 2 public-free jurisdictions; there is no live tenant-private tenant in production. Cortex runs an anonymous default tenant, so isolation is untested against real cross-tenant load.

4. **SmartCity is still an island (ADR-005 Layer B not on the spine).** `adr_005_multitenancy.md` Layer B and `54` Task 2 confirm SmartCity carries its own table-level `tenant_id` (default 1, Bastrop 2), zero `@hauska/*` deps. The storage partition and the gate partition are the same concept enforced twice in two systems that do not share the boundary. Onboarding a real second tenant is the first time the two are forced to agree.

### Why this is the critical path for the multi-investor / digital-twin vision

The twin vision is N private tenants each depositing private intelligence (their parcels, their adjudications, their deal flow) onto a shared ground-truth spine, with the private layer never pooling and the shared layer compounding across all of them. That is precisely the `tenant-private` vs `public-*`/`tenant-shared` partition. Everything else in the vision — private deal books, per-user calibration, the "learns your city / learns your buy-box" deposit loop, the Mox private operating flywheel — is a consumer of that one primitive. Right now the primitive is: (a) enforced for corpus reads only, (b) delegated-not-enforced for the reasoning surface the twin actually uses, (c) missing the tenant-private write/collection semantics, and (d) proven against zero live tenants because prod is anonymous-default. The gate resolves *who* the tenant is; it does not yet *isolate what they can do* across the whole surface. Until step 2 generalizes the seam so reasoning is gate-enforced (not cortex-self-asserted), the tenant-private write path ships, and a real second tenant runs against it under load with a zero-cross-leak smoke test, the twin cannot be sold on its sovereignty claim. This is the #1 finding and the gate on the entire multi-tenant roadmap.

**Fix.** Sequence, no estimates: (1) move accessPolicy enforcement to cover the `legacyClient.*` reasoning tools at the gate, or make the gate the mandatory chokepoint for cortex→engine so there is one enforcement surface, not two; (2) build the tenant-private write/collection primitive (mint-scoped-to-actor + owned-collection reads) — this is the `54` step-2/SmartCity-on-spine work; (3) onboard exactly one real second tenant (SmartCity/Bastrop is the cheapest) and run the two-tenant zero-cross-leak load smoke test ADR-005 Layer B already specifies; (4) resolve the "populate accessPolicy on existing 21k atoms" open decision before any tenant reads against the corpus, or every atom defaults reveal-or-hide by the fallback rule rather than by intent.

---

## 2. SPINE ↔ BFF DECOUPLING (ADR-008 / 56) — largely DONE, seam is self-asserted (IMPORTANT)

**The docs understate this.** `56_engine_extraction_sprint.md` still shows steps 3–6 (lift adapters, lift engine-core, cut consumers, thin the BFF) as QUEUED. In live code they are substantially shipped:

- `hauska-engine/packages/engine-core/` is real: ~7,000 LOC of briefing, finding, calibration, envelope logic (not scaffold).
- `hauska-engine/services/engine-api/src/routes/` has real reasoning routes — briefing (180 LOC), findings (258), hydrology (225), site-context (195), topography, map-layers, chat, encumbrances — each importing from `@hauska-engine/engine-core`.
- cortex-api's cut is unconditional: `legacy-design-tools/.../lib/engineSpineFlags.ts` states "All four reasoning engines are unconditionally served via gate-front engine-api. Local lib/*-engine fallbacks were removed." `engineSpineRouting.ts` routes findings/briefing/hydrology/topography to `/v1/*` on engine-api. This is the "C3 BFF cut."

**The seam leak (the real finding).** cortex-api reaches engine-api **directly** over `ENGINE_API_URL` with a service bearer, not through `hauska-mcp-server`. The gate-front *headers* are forwarded, but the gate is not in the path. Evidence: `engineSpineClient.ts` ("cortex-api calls hauska-engine engine-api using the gate-front seam contract … the same partition the MCP gate would forward on a service call"). So ADR-008's "no app reaches an engine ungated" is honored in spirit (one contract) but not in topology (two enforcement surfaces: the MCP gate for external agents, and cortex-api's self-constructed context for the product BFF). At scale this means: (a) two places to keep the tenant/accessPolicy logic correct, and they can drift; (b) metering/provenance/rate-limiting that the gate provides is not on the cortex→engine path; (c) a bug in cortex-api's `resolveRequestJurisdictionTenant` is a silent cross-tenant hole with no gate backstop. This is why finding #1 and #2 are the same root: the gate is not yet the single control plane for reasoning.

**Residual duplication.** cortex-api still carries a large brokerage reasoning surface that is NOT behind the engine cut: `brokerageBriefLlm.ts`, `brokerageInvestorVerdict.ts`, `brokerageMapReasoningOverlays.ts`, `brokerageBriefLocalCode.ts`, `propertyBriefLaySummary.ts` (`api-server/src/lib/`). The investor-radar brief path runs its own LLM reasoning in the BFF, separate from the extracted engine. So "cortex-api is a thin BFF" (step 6) is true for plan-review/findings/briefing and false for the entire brokerage/radar surface. Two reasoning homes, one extracted, one not.

**Fix.** Make the gate the mandatory chokepoint for cortex→engine (route the service call through hauska-mcp-server, or fold the enforcement library into a single shared package both the gate and cortex import so there is one implementation). Then fold the brokerage brief/verdict reasoning into engine-core so there is one reasoning home. Update `56` — its QUEUED status is stale and misleads planning.

---

## 3. CALIBRATION LOOP (commitment #2) — machinery closes, fuel tank is near-empty (IMPORTANT)

The earned-confidence ledger **exists and is structurally closed**, contradicting the fear that it is all-asserted-forever, but it is unfueled, which is why confidence reads as asserted today.

The full loop is in code:
- Phase 1 adjudication ledger: `legacy-design-tools/.../lib/atomAdjudicationEvidenceLedger.ts` joins `finding.accepted/rejected/overridden` events to `findings.citations[].atomId`, per-atom, partitioned by `jurisdictionTenant`.
- Phase 2 outcome capture: `lib/findingOutcomeObservation.ts` — append-only `atom_events` for `permit-approved | variance-granted | comment-resolved`, same partition.
- Compute: `hauska-engine/packages/engine-core/src/calibration/compute.ts` blends asserted confidence with observed success rate, prior-weighted, adaptive grain (per-atom when dense, per-class when sparse), never crossing a partition.
- Overlay + read path: `calibration/overlay.ts` `effectiveConfidence()` returns `{value, grade: asserted|calibrated|stale}`; `engine-core/src/envelope/readPathConfidence.ts` resolves `kind: calibrated|asserted|deterministic` on the envelope. Wired into every engine-api reasoning route.
- Sovereignty guard is present in the loop: `calibration/signals.ts` — "Tenant adjudications never pool into public; only anonymous/public-tier does." Commitment #2 and tenant sovereignty are enforced in the same code.

**Why it still reads asserted.** The loop consumes two inputs it does not yet produce at volume: (a) reviewer adjudications (finding accept/reject/override) require live reviewers using Codex/Cortex, and (b) `RecordFindingOutcome` requires an external caller to POST real-world outcomes (permit approved, variance granted). At launch both are sparse-to-zero, so `calibratedConfidence` is null for nearly every atom and `effectiveConfidence` returns the asserted baseline — exactly what the 2026-06-25 ground-truth recon says. This is commitment-#2-compliant (the loop is live; confidence falls back to an asserted baseline carrying provenance, never a bare number), but it is not yet a moat because nothing has been calibrated.

**Growth risk at scale.** `compute.ts` and `overlay.ts` recompute per-partition calibration over ledger rows. With 100 tenants × thousands of atoms × growing adjudication history, per-request overlay resolution over the raw ledger is an unbounded read. The overlay is described as a cache (migration 0037), but verify it is materialized and incrementally invalidated (`calibration/sectionInvalidation.ts` exists — good sign) rather than recomputed on the read path.

**Fix.** The machinery does not need building; it needs fuel and a materialization guarantee. (1) Ship the M1 gate the calibrated-spine roadmap is already on (Austin/SA retrodiction) so at least the backtest loop produces non-null calibrated values against historical permits — that is the one fuel source that does not wait on live reviewer volume. (2) Confirm the overlay is a materialized, incrementally-invalidated cache, not a read-path recompute, before tenant count grows. (3) Do not describe confidence as "earned/calibrated" in any external collateral until a non-trivial fraction of atoms carry `kind: calibrated`.

---

## 4. COST / CACHING — the known map gap is CLOSED; check the brief LLM path (IMPORTANT → GROWTH)

**The #1 prior cost gap is fixed.** The Cotality map-mesh had zero cache (prior recon). Now `legacy-design-tools/.../lib/brokerageGisCache.ts` (cc-agent-D) adds a three-tier persistent cache and `brokerageGisLayers.ts` uses all three:
- spatial-tile mesh, keyed by snapped grid tile, TTL 30d (`getSpatialTile`/`putSpatialTile`, lines 480/537) — the actual mesh burn, now cached;
- property attributes by (CLIP, product), TTL 14d (`getPropertyAttr` for hoa/comparables/site-location);
- geocode (address→CLIP), TTL 90d.
Failure isolation is correct (no get/put throws; DB error degrades to live fetch). This closes the "up to 4 Spatial Tile + 25 geocode + 25 site-location calls per pan, uncached" burn. Good.

**Remaining cost risks at scale:**

- **(GROWTH) The engine assemble/brief path and map path are separate caches.** `brokerageGisCache.ts` notes the brief underwriting path caches through `adapter_response_cache` while the map mesh uses the new dedicated caches. Two cache systems for overlapping Cotality data (a CLIP fetched for a brief is not shared with the map tile cache and vice-versa) means duplicate Cotality spend per parcel across surfaces. At 100 tenants panning + briefing the same metros, this is redundant paid-API spend.
- **(IMPORTANT) Cotality is the dominant, uncapped COGS variable.** `55` §9: fixed spine floor ~$700–1,200/mo, but Cotality is "$500–5,650+" and "can multiply COGS alone." There is no per-tenant Cotality budget or rate cap in the code path reviewed — a single tenant with a hot map can burn the shared quota (the demo tier already hit 429 at 100 req/day per `00_current_state`). At scale you need per-tenant metering/budget on the paid-data path, which is exactly the metering the gate provides — and which the cortex→engine direct path (finding #2) bypasses.
- **(GROWTH) No cache warming / stampede protection observed.** 30d/14d/90d TTLs are good, but on cold cache or coordinated expiry, N tenants hitting the same metro produce a thundering herd against Cotality with no single-flight lock in the reviewed path.

**Fix.** Unify the brief and map Cotality caches on a single (CLIP, product) key so a parcel is paid for once across surfaces; put a per-tenant Cotality budget/rate cap on the paid-data path (and route it through the gate meter); add single-flight on cache miss for hot tiles.

---

## 5. FAILURE MODES / OPS (mixed: IMPORTANT + GROWTH)

**Deploy model is disciplined (good).** `legacy-design-tools/.github/workflows/cloud-run-deploy.yml`: build-and-push is decoupled from deploy; canary sequence is deploy-canary (0%, `--no-traffic`) → run-migrations → smoke `/api/healthz` → shift-traffic, each a separate dispatch; traffic shifts and migrations never coupled to push. This is the right shape and the 2026-07-02 sprint close notes the adversarial gate caught a pg-to-ESM boot crash at the 0% canary before it reached prod — the canary earned its keep.

**Scale/SPOF concerns:**

- **(IMPORTANT) `max-instances=10` on cortex-api.** `cloud-run-deploy.yml` line 205. A hard ceiling of 10 instances is a real cap at 100+ tenants; a burst of concurrent brief/map runs will queue or 429 at the ingress with no autoscale headroom. Raise deliberately with a load test, or the product BFF is the bottleneck long before the spine is.
- **(IMPORTANT) `min-instances=0` on the product BFF.** Line 204. Cold starts on cortex-api mean first-request latency spikes for a tenant hitting a scaled-to-zero service. `55` says the gate and retrieval run min-1 warm; the BFF that every UI request hits is min-0. For a paid twin product this is a UX floor problem.
- **(IMPORTANT) `:latest` secret pinning across ~20 secrets.** Line 211 pins DATABASE_URL, all COTALITY_*, STRIPE_*, ENGINE_API_GATE_TOKEN, etc. to `:latest`. Per the recorded gotcha, `:latest` is resolved at deploy time and `--update-secrets` can silently no-op; a rotated secret does not take effect until a redeploy, and the PowerShell-pipe truncation hazard (noted in `00_current_state` — wrote 2-char garbage twice) means a bad rotation can ship phantom-empty secrets. At 100 tenants a silent Cotality/DB credential failure is a full outage. Pin to explicit versions for the load-bearing secrets, or add a post-deploy secret-value smoke check.
- **(IMPORTANT) Single Neon per DB, three Neons, no read-replica story.** `55`: Neon ×3 (substrate + cortex-prod + smartcity). cortex-prod is a single Postgres serving every product read/write including the calibration ledger and the append-only atom_events. At 100 tenants the atom_events / calibration ledger is an append-heavy, read-heavy table with per-request overlay reads (finding #3). No partitioning-by-tenant or read-replica was observed. This is the storage SPOF.
- **(GROWTH) Two enforcement surfaces = two failure surfaces (see #1/#2).** The gate and cortex-api both assert the tenant partition. A load-shed or bug on either is a sovereignty failure. One control plane reduces this to one.
- **(GROWTH) Observability.** The gate has structured logging (`access_policy_denied`, gtm-observability, metrics, log-sink) — good. Not verified: distributed tracing across gate → cortex-api → engine-api → Cotality, or per-tenant cost/latency dashboards. At 100 tenants you need per-tenant attribution to find the one tenant burning Cotality or hot-looping the map.

**Fix.** Load-test cortex-api and raise `max-instances`; set `min-instances≥1` on the BFF for the paid product; pin load-bearing secrets to explicit versions + add a secret-value post-deploy probe; put the calibration ledger / atom_events on a partitioned or replicated path before tenant growth; add per-tenant cost + latency observability.

---

## The missing primitives

Ranked, what foundational piece is absent (not just incomplete):

1. **One enforcing control plane for reasoning.** The gate enforces accessPolicy for corpus reads; the reasoning surface (40 legacyClient tools + the cortex→engine direct call) enforces the *contract* by self-assertion in cortex-api, not through the gate. The missing primitive is a single chokepoint (or a single shared enforcement library both import) where the tenant partition is enforced once for every read, corpus and reasoning alike. Until this exists, "sovereignty enforced at the gate" is true for half the surface.

2. **The tenant-private write / owned-collection primitive.** Reads are enforceable; the mint-scoped-to-actor write path and the "my private collection" read semantics that the digital-twin/multi-investor product is *made of* are not built (`54` step 2 + SmartCity-on-spine still QUEUED). This is the primitive the twin vision cannot ship without.

3. **A live second tenant + zero-cross-leak proof under load.** Prod is anonymous-default. The partition has never run against two real tenants concurrently. ADR-005 Layer B specifies the two-tenant load smoke test; it has not been run against the unified gate+storage boundary because SmartCity is still an island. Until it is, the isolation guarantee is code-correct but production-unproven — a one-way door being planned as if already walked through.

4. **Calibration fuel (not machinery).** The loop is closed and sovereignty-safe; it has no outcomes flowing in. The missing piece is the backtest fuel (M1 retrodiction) that produces calibrated values without waiting on live reviewer volume — already on the roadmap, but it is the thing that turns commitment #2 from "loop exists" into "moat."

Everything else (engine extraction, map cache, deploy discipline) is in good shape and ahead of the doc set. The architecture holds structurally. It does not yet hold *as a multi-tenant system* because it has never been one — one tenant, one enforcement path proven, the private-collection primitive unbuilt, and the calibration tank empty. The critical path is #1→#2→#3, in that order, and it is the same critical path the tenant leg (`54`) named and left QUEUED.
