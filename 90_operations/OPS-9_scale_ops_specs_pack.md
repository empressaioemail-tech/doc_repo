---
id: OPS-9_scale_ops_specs_pack
title: OPS-9 — Scale-ops specs pack (six fan-able workstreams toward all-of-Texas)
date: 2026-08-04
status: active (operator-ratified direction; each spec dispatches via the standard planner pattern)
owner: nick
related: [OPS-8_blocker_free_onboarding_model, onboarding_defect_class_backlog, _decisions/2026-08-04_ecode360_partnership_retired_scrape_posture, _decisions/2026-08-04_elgin_setback_table_ratified, _decisions/2026-08-03_consumer_mode_citation_posture, _dispatches/2026-08-04_elgin_pipeline_planner_handoff]
---

# OPS-9 — Scale-ops specs pack

Six workstreams, each independently dispatchable by a planner running the standard pattern (recon-then-review, executor subs with authorization + no-nesting clauses, conclusion-string merge gating, planner-run data-runs, verbatim verification). Every spec states goal, scope, data sources, constraints, acceptance, and out-of-scope. Recons find the file-level HOW; these specs fix the WHAT.

## S1 — Command Center factory console v2 (County Ledger rebuild + focused-fix ledger + Node&Graph fix)

GOAL: the CC becomes the factory's instrument panel, reading the factory's own artifacts instead of a hand-fed coverage table.
CURRENT DEFECTS (operator-observed 2026-08-04 screenshot): coverage percents broken (9801.0%), CERT column reads UNCERTED while real certs exist (block-13 7/7, county 20/20 — the ledger reads a field the factory never writes), "1/10 onboarded" predates the gate, counties are fips-only (no names), no city/jurisdiction sub-rows, no gaps column, thin fields. Node & Graph panel shows DEGRADED (undiagnosed; prime suspect is the CC-held retrieval key desync class after the 2026-08-03 retrieval-api redeploys — check first, it may be a one-line env sync).
SPEC:
- Row model = REGISTRY ROWS, not counties: each jurisdiction row (Bastrop city, Bastrop County unincorporated, Elgin, ...) nests under a county header with NAME + fips. The registry (hauska-engine jurisdiction-registry.ts) is the roster source of truth.
- Columns per jurisdiction row: gate verdict (8 OPS-8 checks, PASS/decline chips with named reasons, from the onboard-preflight JSON artifacts), cert (label e.g. "7/7", date, scopeAnnotations count, link/hover to the artifact), per-rail coverage with CORRECT percent math (served + honest-declined = accounted; bare-pending is the only red number), open defect classes (from the class backlog events), focused-fix parcel count (expandable to the parcel list — see focused-fix ledger below), source vintages + staleness flags.
- FOCUSED-FIX LEDGER (the missing OPS-8 CC half): a persisted store (table or served JSON artifact) aggregating parcel-level fix items from the event streams that already exist: preflight decline events (defectClass + rowId), cert honest-miss lists (e.g. the 28 legacy-P parcels incl. 6 on repealed P-5), the block-13 quarantine set (today hardcoded in the cert script — surface it as data), superseded-prop-id parcels, REASON-OVERSTATES members. Each entry: parcelNodeId, jurisdiction rowId, defectClass, source artifact, first-seen, status. CC renders it as the expandable gaps view; doc_repo backlog stays the class-level view; both read the same events.
- Node & Graph: diagnose the DEGRADED state first (verify CC's retrieval key/env against the live service before touching code), fix, and add the failure reason to the panel (a DEGRADED badge with no cause is half a signal).
DATA SOURCES: registry rows (engine), preflight/cert JSON artifacts (currently _inbox files — the recon must decide where CC reads them from: check-in a served artifacts store or an API on cortex/engine that serves the latest per rowId; prefer serving from the DB the factory already writes to over file sync).
CONSTRAINTS: CC deploys to Vercel project cmdcenter (blush, NOT jade); no percent math without a denominator definition written next to it; every number must trace to an artifact (post-mortem rule: the console IS the ground-truth surface, it must never display an unsourced number).
ACCEPTANCE: operator opens County Ledger and can answer, per jurisdiction: onboarded through the gate? certified when, with what annotations? what's declined and why? which parcels need focused fixes? — with county names and city rows, and no impossible percentages.
OUT OF SCOPE: PE customer surfaces; new factory mechanics.

## S2 — Trust-surface wave 2 (grounding-derived sources + governed_by display + X-ray details)

GOAL: implement the two ruled decisions that close the citation/display gaps.
SPEC:
- (a) Grounding-derived sources (ldt, per _decisions/2026-08-03_consumer_mode_citation_posture): the research/chat pipeline records which numbered atoms actually grounded the answer independent of [n] marker survival; `sources` populates from that record in EVERY presentation mode; confidence computes from grounding (retrieval strength + atom confidence), retiring the 0.75/0.5 marker proxy. Consumer prose stays markerless. Wire shape stays additive.
- (b) governed_by rendering (PE + ldt serve, per _decisions/2026-08-04_elgin_setback_table_ratified): when a setback cell carries governed_by, the display resolves and shows the GOVERNING district's values with citations (C-2 adjacent-to-residential renders C-1's F/S/R + both section cites; conditional values like I-district's 25/30 ft render with their condition labels). Minimum bar where resolution is complex: a live citation to the governing table row. Never a bare "not specified" when the governing rule is known.
- (c) X-ray rule details: the per-field provenance notes (story-split side yards, corner cases, formula rears) render in the parcel X-ray/detail surface; the scalar stays the modeled minimum.
CONSTRAINTS: quality-gate rule (attribution + confidence + timestamp on every output); PE hardcodes pro mode (unchanged); no wire-breaking changes; ldt api-server local baseline is CI-authoritative.
ACCEPTANCE: a consumer-mode brief answer carries a populated sources array; a C-2 parcel's card/X-ray shows the C-1-governed values with citations; the R-1 X-ray shows the two-story caveat. QA-37 residue items close.
OUT OF SCOPE: county-tenant subdivision routing (queued separately), CC surfaces.

## S3 — eCode360 acquisition track (scrape posture, per the 2026-08-04 decision)

GOAL: prove an eCode360 acquisition path and land Smithville's corpus; template it for the bucket (Pflugerville, Kyle, Buda, Liberty Hill, Bee Cave, McAllen, Dallas proper...).
SPEC: recon FIRST on two paths: (1) the ecode360-scraper adapter named in the engine registry (zero demonstrated ingests — find it, read it, test it against Smithville SM6484); (2) the citizen-facing portal path the operator confirmed accessible (identify the rendering/fetch surface and whether it yields structured section text). Also locate the claimed Pflugerville precedent capture from sources-list prep (search doc_repo + repos for prior Pflugerville pulls) and reuse whatever worked. Then: land Smithville sections as code atoms under the standard corpus pipeline (edition record, section numbering, eval gates 1.0 quality bar same as Municode ingests), provenance carrying source URL + fetch timestamp.
CONSTRAINTS: robust to blocking (rate limits, backoff, session behavior); NEVER degrade the quality bar to make a scrape land; provenance discipline unchanged; if both paths fail technically, report honestly — do not screenshot-OCR into atoms without a planner ruling.
ACCEPTANCE: Smithville jurisdiction-corpus + code-sections live in the retrieval snapshot passing eval; the adapter/path documented as the bucket template; Smithville's registry row becomes wireable (its onboarding then follows the Elgin pipeline shape).
OUT OF SCOPE: Smithville parcels/zoning rails (separate onboarding pass once the corpus exists).

## S4 — Factory industrialization (from per-city artisanal to onboard(fips) proper)

GOAL: remove the remaining hand-authored steps so a jurisdiction onboarding is registry-row + table-ratification + gate, nothing else bespoke.
SPEC (each item small and independent):
- rowId-keyed cohort loader (loadRegistryDistrictCohortByRow) killing the fips-keyed active-row ambiguity; then flip county/Elgin rows to active safely.
- Per-parcel jurisdiction key resolution for the district-code-section map (resolve from the parcel's zoning_jurisdiction, not COUNTY_FIPS_TO_DISTRICT_MAP_KEY) so multi-city counties mint refs correctly at bake time.
- Registry-driven warm: fold the per-city warm scripts (bastrop/caldwell/elgin pattern) into a single registry-parameterized runner — OPERATE-NOT-REBUILD: extract the shared body the existing scripts already share, parameterize descriptor/roster/bbox from the registry row; the per-city scripts become thin invocations, then retire.
- Bbox registry: city bboxes move from script constants to registry-row fields with provenance (derived from city-limits geometry, recorded).
- Cert-path preflight probe wiring (kill the "not runnable" tooling artifact scopeAnnotation).
- PDF flake #221 fix (isolate shared mutable state or serialize the pdf pool; never weaken honesty assertions).
- Atom-contract absence ADR (design session with operator first): first-class absence variants for setback-rule/buildable-envelope, peer to zoning-fact's absence.kind; then contract PR + pin bumps.
- Travis-side/multi-county row shape design (Elgin's 500-parcel Travis sliver as the test case).
ACCEPTANCE: a new zoned city onboards with: registry row + zoning-stamp config + ratified setback table — and NOTHING else hand-authored; the gate + warm + cert run registry-driven end to end.
OUT OF SCOPE: new jurisdictions themselves (that's the fan, S6's cadence).

## S5 — The Warden (post-onboarding QA sweeps; operator-requested, planner-endorsed)

GOAL: a background verification pass that comes behind every onboarded jurisdiction (and periodically re-checks the fleet) hunting bugs and bad data — WITHOUT becoming a scan-fix loop.
SPEC:
- Trigger model: event-triggered (after a jurisdiction's cert lands) + scheduled (rolling re-sweep of onboarded jurisdictions).
- Checks (each grounded in a failure we actually had): area-sweep consistency (EVERY parcel in sampled areas: district vs neighbors — the P-5-next-to-SF-1 class; envelope presence vs zoning state; decline reasons match regime), serve-path truth (the app-level benchmark: is the data true AND available in the app — probe the live atom-chain/facets for sampled parcels, not just the DB), edition drift (zoning-facts citing superseded editions), cross-store consistency (txgio_parcel stamp vs Tier-1 snapshot vs zoning-fact atom agree), cert freshness (re-grade a sample periodically; flag drift from the certified state), provenance integrity (refs resolve, DIDs exist in the corpus).
- CRITICAL CONSTRAINT (post-mortem rule): the Warden FILES, never fixes. Findings write to the focused-fix ledger / defect-class backlog as events with evidence; fixes go through the normal gated pipeline. No auto-remediation, ever.
- Output: a per-sweep report artifact + ledger events; CC surfaces Warden status per jurisdiction (last sweep, findings open).
- Implementation shape: a runnable sweep module (engine-side, reusing cert-grade machinery for grading — operate-not-rebuild) + a scheduler (cron/routine) + the ledger writes.
VERDICT ON "IS IT OVERKILL": No — it is the quality mechanism that makes the Texas fan safe. Sampling certified a broken Bastrop once; the Warden is the standing version of the area-sweep lesson. It is also the earning loop for commitment #2 (calibration signal from systematic verification).
ACCEPTANCE: after the next jurisdiction cert, the Warden sweeps it automatically and files (or explicitly finds zero) issues; the operator sees Warden state in the CC.

## S6 — The fan itself (cadence + throughput model)

Realistic throughput once S1–S5 land, grounded in measured costs (preflight sample est. ~$14/jurisdiction vs the $200 gate; the county cascade ran 62k parcels in ~17 min; the Elgin stamp in seconds):
- UNZONED COUNTIES (the county template: breadth bake + absence cascade + gate + cert; no table, no stamp, no ratification): batchable 10–20 per wave with one planner supervising; compute and DB write costs are trivial; the binding constraint is verification discipline (Warden + gate artifacts per county). Texas has 254 counties; the unzoned-regime baseline for all of them is a near-term, low-risk program.
- ZONED CITIES (need source wiring + stamp + ratified setback table + warm): the human gate is TABLE RATIFICATION (operator). With the evidence-package format (per-field DID + quote + not_specified honesty) a table review is minutes, not hours. Realistic: 3–5 cities per wave initially, ~10 per wave once S3 (eCode360 template) + S4 (registry-driven warm) land — throttled by operator ratification bandwidth and source heterogeneity, not compute. Municode/AGOL cities are the fast lane; eCode360 cities join after S3 proves the template.
- Sequencing rule: never run more concurrent onboardings than the planner can verify with real probes; the gate makes starting cheap, but the cert + Warden make finishing honest.

## Dispatch order (operator-ratified 2026-08-04)

S1 first (instrument panel), S2 second (trust surface), then S3+S4 in parallel (separate repos/planners), S5 alongside S4 (shares cert machinery), S6 begins as soon as S1+S5 give the operator eyes on quality. The Elgin pipeline (already handed off) runs independently and feeds S6's first wave.

## S7 — Launch rate limiter ops (T4 / 76j Workstream C)

GOAL: keep external metering honest (Postgres store, dual-window rpm+daily) and reproducible under load.

SPEC:
- **Store:** Postgres counters on pooled Neon DSN (MCP `rate_limit_store.detail=postgres` on serving revision). Upstash is not the launch destination.
- **Budgets:** defaults in `hauska-mcp-server` `tiers.ts` (`HAUSKA_FREE_IP_RPM=60`, daily 1,000; keyed tiers higher). cortex-api separate daily cap `CORTEX_USER_DAILY_API_LIMIT=50000` on serving revision.
- **Health signals:** MCP `/health` dependencies `rate_limit_store` + `postgres` latency_ms; alert if `state != ok` or latency_ms > 500 sustained.
- **Load proof:** run T4 burst-proof procedure (`T4_infra_track.md`) after any limiter store swap or pool change; archive JSON under `_inbox/2026-08-05_76j_C4_loadtest_results.json` naming pattern with date stamp.
- **429 vs 503:** 429 = meter working; 503 under load = pool/queue investigation (Neon `query_wait_timeout`).

ACCEPTANCE: operator can point to a dated capacity audit with measured p95 parcel loads and limiter overhead; no launch claim of "1k concurrent free" without a distributed test or explicit tier/key plan.

OUT OF SCOPE: retrieval-api / engine-api public rate limits (recorded gap in measured facts doc).

