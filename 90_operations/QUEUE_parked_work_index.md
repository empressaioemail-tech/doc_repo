---
id: QUEUE_parked_work_index
title: Queued and parked work index (single lookup for everything deferred)
status: active
last_updated: 2026-08-05
applies_to: portfolio
related: [00_current_state, onboarding_defect_class_backlog, 76j_smartsite_launch_readiness_program, OPS-10_parcel_flag_spec, 76i_smartsite_contribution_economy_roadmap]
owner: nick
---

# Queued and parked work index

One place to find everything deliberately parked, with its trigger. Rule: when something is parked in a session, it gets a row here the same day; when it starts, its row flips to a pointer at the executing session/doc. The defect-class backlog remains the authority for data-defect detail; this index is the cross-program queue.

## Product and launch (Smart Site) — planned in 76j, 2026-08-05

| Item | Detail home | Trigger / order |
|---|---|---|
| Paywall finish + Stripe promo codes + server-side dev role | `76j` Workstream A — **LIVE 2026-08-05** (`_inbox/2026-08-05_pe_paywall_stripe_promo_dev_role_WDLL.md`; LDT #387, hauska-map #152) | DONE — operator promo E2E owed |
| Rate-limit store replacement (Upstash OUT → Postgres limiter) + Neon pooling pass | `76j` Workstream C; T4 track `90_operations/T4_infra_track.md`; WDLL `_inbox/2026-08-05_76j_workstream_C_rate_limit_and_pooling_WDLL.md`; `_inbox/2026-08-05_neon_pooling_audit.md`; `_inbox/2026-08-05_launch_capacity_measured_facts.md`; burst logs `_inbox/2026-08-05_t4_*_burst.log` | **DONE 2026-08-05 T4.** Postgres store PR #58 → MCP `00040-ctj` @100% (`rate_limit_store=postgres` ok). C2 pooling DONE. Single + multi-instance burst proofs on file. Upstash retired as destination (operator ruling). |
| Smart Site domain purchase + Vercel custom domain | `76j` Workstream B | OPERATOR-PARKED 2026-08-05 (deliberate hold; revisit at launch-polish slot) |
| Upstash go/no-go | rate-limiter session report; `76j` C1 | **CLOSED 2026-08-05 T4** — operator ruled Upstash OUT (free-tier auto-delete root cause). Postgres limiter is the launch store; Memorystore documented scale-up path in `T4_infra_track.md`. Restored Upstash DB is emergency-only bridge, not destination. |
| CAD/DXF export text regression (jumbled text on 109 Higgins export; was clean in prior test) | **REOPENED 2026-08-06** — operator CAD QA FAILED spikes; root cause: `close=True` on open Bastrop 1-ft contours. Fix engine #263 deployed `00169-hiq` tag `t2-contour-spike`; spike-detector CI. **Operator re-QA owed** (fresh 109 Higgins export) | OPEN — fix deployed, operator re-QA |
| Paywall operator E2E close (4 actions: STRIPE_PE_UNLOCK_PRICE_ID secret, dev-role grant probe, promo-code E2E, claim smoke) | `90_runbooks/pe_paywall_e2e_operator.md`; endpoints live (entitlement 200, claim-session 401-not-404) | OPERATOR when ready; re-grades WDLL items 1-3, 8 |
| PE map polish: pedestrian-path marker too faint — should be a shade of blue, brighter, DOTS not dashes (operator visual QA 2026-08-05, Higgins St screenshots) | **REOPENED 2026-08-06** — v2 `#8fd0ff`/opacity 0.9/larger dots deployed bundle `index-C1Sc6_H7.js` (#154). **Operator re-QA owed** (aerial + street-dim at Higgins) | OPEN — fix deployed, operator re-QA |
| DISCUSSION (post-verdict): rewarm strategy — "it takes forever." Threads to bring: keyspace sharding flag (already queued pre-Bexar), --batch tuning, INCREMENTAL rewarm (changed-parcels-only vs whole-cohort, OPS-4 protocol), and whether the city-cohort envelope re-warm (health-check lead exhibit) becomes the incremental rewarm's first proving run | operator 2026-08-05 | AGENDA ITEM at health-check verdict review |
| DISCUSSION (post-verdict): HOLISTIC PROCESS REVIEW — not bug-fixing but "are we using the best setup, can we make it better, what are we missing." Candidate threads: pipeline architecture (bake/scan model vs set-based SQL or streaming), instrumentation coverage (what else has no Warden-class check), testing strategy (area-sweep certs vs samples, product-surface smoke suite), fleet/session model (planner+executor coordination cost, claims overhead), data-store topology (three-store split, propagation legs), tooling (dry-run speed, deploy ergonomics), and what an outside architecture review would flag | operator 2026-08-05 | AGENDA ITEM after the verdict review; deserves its own session |
| Favicon to crosshairs + deferred rebrand set (title, landing, copy) | **DONE 2026-08-05 T2** — hauska-map #153; live crosshair favicon + manifest `Smart Site`; title `Smart Site — Explore your property` | DONE |
| Smart Site branding on PDF export templates | **DONE 2026-08-05 T2** — PE `brief-print-html.ts` (SMART SITE X-RAY); engine site-plan PDF `SITE_PLAN_BRAND_KICKER` via #257 | DONE |
| Product-surface smoke suite (repeatable live probes) | `90_runbooks/product_surface_smoke_suite.md`, `scripts/product-surface-smoke.mjs`; factory runbook §5 | DONE 2026-08-05 T2 — 16/16 live pass post-deploy |
| Anonymous-to-account claim flow (auth flip orphan trap) | `76j` C3 — **shipped with A 2026-08-05** (claim-session, claim-local-state, session-exchange install claim) | DONE with Workstream A |
| Load test + measured capacity doc (launch go/no-go input) | `76j` C4; `_inbox/2026-08-05_launch_capacity_audit.md`; harness `_scratch/76j-c4-loadtest.mjs` | **DONE 2026-08-05 T4** — conditional no-go for literal 1k concurrent free SLO; soft launch OK with tier caps. PE p95 <2s at sustained c30; fails at burst ≥50 concurrent. |
| Affiliate platform selection + setup (Rewardful/PromoteKit class; affiliate portal = their product) | `76j` D | after paywall live |
| Affiliate distribution financial model (bizops, 70-band doc) | `76j` D; ties `14_pricing_framework` | parallel anytime |
| OPS-10 flag-a-parcel v1 build | `OPS-10_parcel_flag_spec.md` (spec ready) | next product-side build slot; feeds `76i` |
| Contribution economy / claim-your-smartsite / rewards token arc | `76i_smartsite_contribution_economy_roadmap.md` | after OPS-10 v1 + partner token diligence |
| Launch-outside-Texas | `76j` gating rule | HELD until factory data flush per state |

## LightBox gap closure (spec parked at _inbox/2026-08-08_lightbox_gap_closure_spec.md; master rulings 2026-08-08)

| Item | Ruling | Trigger |
|---|---|---|
| W1 Owner data, paywalled (name/mailing/absentee/deed-date via authenticated BFF facet, accessPolicy public-paid; NEVER in PMTiles; owner-match join gate keeps integrity role; no skip-trace scope) | GO — slot as new track T7 with W2 (product surfaces over held data; no heavy scan, no atoms writes) | successor master authors T7 track doc from the parked spec + dispatches |
| W2 Server-side filter surface with TRUE total counts + per-predicate per-county coverage disclosure; zero-coverage county = NOT-EVALUABLE, never empty-list (honest-absence extended to set operations — the anti-LightBox moat) | GO — T7 priority item, sequenced FIRST | with W1 |
| Free-card owner presentation | RULED: locked row with explicit paid label (blur asserts existence; absence hides the product) | T7 build |
| W3 RRC layer (due-diligence-retention rationale; PR #90 stays parked; T3 rule stands — RRC pipelines NEVER mint utility-easement atoms) | HELD by 2026-08-01 scale-before-new-layers ruling — completeness arguments are what it resists; NO competitive-gap exception granted now | revisit at holistic process review or explicit operator override |
| W4 MUD layer | HELD same ruling. WARNING: 75m marks MUD+RRC "LIVE" — that is the dead Cotality/extension path, NOT Smart Site; treat as greenfield | same as W3 |

## Factory / data lanes (Central TX + DFW)

| Item | Detail home | Trigger / order |
|---|---|---|
| Building footprints rail — T3 track 2026-08-05: recon + ADR-029 + runbook §1C + Phase 2 plan DONE; BCAD has no public footprint REST (ML fallback default for all 11 counties); Bastrop pilot + live serve BLOCKED on ADR ruling + T1 heavy-scan slot + implementation | `_inbox/2026-08-05_T3_track_close_report.md`, `80_adrs/adr_029_*`, runbook §1C | OPEN: master rule ADR-029 → contract pin → Slot 1 apply → live PE/site-plan |
| Public utility easements rail — T3 paired with footprints: county honest-absence default; McLennan CAD easement linework exception; municipal overlays Bastrop/Round Rock/Cedar Park (Phase 2b); same blockers as footprints for live | same T3 close report + `_inbox/2026-08-05_T3_easement_source_recon.md` | OPEN: same gate chain as footprints row |
| Bastrop 41-parcel stamp re-roll (Warden catch; districts exist in per-parcel layer) | backlog MIXED-VINTAGE-NEIGHBOR row; recon `P:/tmp/bastrop48-district-recon.json` | UNBLOCKED 2026-08-05 (Warden v1.1 shipped); stamp-CLI recon in flight; block13 7/7 gate before/after |
| Bastrop 7 zoning-coverage-gap parcels (two clusters, possible annexation/ETJ pockets) | same backlog row | city follow-up (Sylvia channel), after the 41 land |
| ENVELOPE-BEHIND-STAMP re-warm (stamped-but-unwarmed city parcels; 5-parcel evidence, cohort unenumerated) | backlog HONEST SAMPLING FALLOUT table | enumerate via batched script, re-warm through city path, parity re-gate + block13 gate |
| COUNTY-COHORT-LOADER-ZERO (Caldwell cohort loader returns 0) | backlog same table | fix loader query vs Caldwell layer; certs unaffected (roster-from-file) |
| ELGIN-CERT-RESIDUAL (cert 2/10 residuals: orientation tokens, rear emit, edge roles) | backlog row; Elgin session | Elgin session lane; also the fix family for EDGE-ROLE-MISJUDGED (Mesquite flag lots) |
| Travis County (48453) onboarding | registry HOLD comment | geo_id/address crosswalk build (prop_id bad-rate 0.51) |
| Rockwall (48397) cadastral source | DFW tracker `_scratch/dfw_onboarding.md` | HOLD, no full-county REST source found |
| Smithville corpus follow-ups: Bastrop UDC Municode drift-skip; ICC unit 0-section drift; Grand County legacy-env absence in snapshot builds | snapshot build outcomes 2026-08-04 | corpus maintenance slot |
| ANSWER-QUALITY GAP (operator QA 2026-08-05, LOGGED not dispatched): PE chat on 109 Higgins declined "largest ADU" question while a plain Google search answers it from the City of Bastrop Development Code (Ch. 14: 1,000 sf or 60% of principal, 1,500 sf rural 1-ac+). Three suspect layers, all need triage: (a) COVERAGE — are the ADU sections in our Bastrop corpus at all (note the Municode Bastrop UDC unit is drift-skipped; B3 PDF may predate the ADU provisions — Google cites a Feb 2026 code page, EDITION CURRENCY question); (b) RETRIEVAL RANKING — the chat's citation chips for an "ADU" query were park rules/severability/records-officer, i.e. concept queries that don't string-match section titles rank badly; (c) honest-decline itself worked correctly — the failure is upstream of honesty. This is a wedge-product credibility item: "comprehensive RE platform loses to a Google search" | operator screenshot pair | HEALTH-CHECK DISCUSSION → likely top-5 accuracy item alongside the envelope re-warm |
| Warden scheduling automation (v1 is planner-run) | runbook section 4 | ops automation slot |
| Warden findings-to-CC surfacing polish (severity=info rows, cert-artifact wiring in scheduled runs) | Warden v1.1 close notes | rides scheduling automation |
| Registry status flip to active for multi-row fips (caller migration done for probes; flip still pending) | FLIP-BLOCKED comment in jurisdiction-registry.ts | after remaining fips-keyed callers audited |
| eCode360 scrape bucket beyond Smithville (Pflugerville capture, other eCode360 cities) | 2026-08-04 scrape-posture decision | engineering track, per-city slots |
| encodeplus /regs/ robots-disallowed question | scrape-posture decision | OPERATOR escalation only |

## Discovered 2026-08-08 (blueprint audit wave) — NOT in the blueprint program plan

Six audits ran 2026-08-08 (three probes + doc inventory + memory audit + ledger schema). The blueprint program plan at `_inbox/2026-08-08_BLUEPRINT_program_plan.md` carries the load-bearing findings. These are the REMAINDER: real work the audits surfaced that the plan does not schedule. Most is parallel-safe (no heavy-scan slot, no atoms writes).

### MultiPolygon / multi-part parcel support (the REAL fix — deferred deliberately, not neglected)

| Item | Detail home | Trigger |
|---|---|---|
| **Multi-part parcel geometry support** (`ParcelGeometry = Part[]`, each part exterior + holes). Interim fail-closed decline shipped instead; ~37,185 statewide parcels (0.67%) currently decline rather than serve a truncated ring. Full spec — call sites, semantics to decide, acceptance bar, new multi-part conformance fixtures — in the decision record | `_decisions/2026-08-08_multipolygon_fail_closed_and_the_real_fix.md`; diagnosis `_inbox/2026-08-08_DEFECT_multipolygon_truncation.md` | ANY of: (a) acreage-weighted measurement shows material value exposure; (b) a roster county's MultiPolygon rate materially exceeds the 0.67% baseline; (c) a customer-facing miss on a declined parcel; (d) multi-part becomes a top-5 not-yet reason in the manifest |
| **Acreage-weighted impact measurement** (0.67% by COUNT; multi-part parcels skew toward larger/irregular tracts, so the share by ACREAGE and deal value is likely higher and is UNMEASURED). This number sets the urgency of the row above | same decision record, "Conditions attached" | do it alongside the fail-closed fix — it is a SELECT, not a build |
| Sibling `[0]` truncation audit: `lot-line-scrub.ts:576`, `warden/envelope-sanity.ts:100-105`, `cert-grade-core.ts:551,558`, FEMA flood parsing in `flood-drainage-study.ts` + `pdf/flood-drainage.ts` (unquantified) | diagnosis report | rides the fail-closed fix lane |

### L2 acquisition — discovered by the Kenedy 48261 proof (2026-08-08)

Wave plan at `_inbox/2026-08-08_L2_wave_plan.md`; proof at `_inbox/2026-08-08_L2_first_county_proof.md`. Kenedy is LIVE in deployment Postgres (2,400 rows, 538 features, 7.3s end to end, dry predicted apply exactly, idempotent, geometry sane).

| Item | Detail | Trigger |
|---|---|---|
| **`TXGIO_COUNTIES` is also the LOADED-RECORD, not just the CLI gate.** After Kenedy loaded, the store holds 20 counties but the CLI still reports `loaded before: no`. A manual registry step per county does not survive 235 iterations. Loaded-status must derive from the STORE | Kenedy proof, defect 2 | **WAVE 0 — gates every wave.** In the running wave-plan dispatch |
| **Node TLS fails on Windows** against TxGIO without `NODE_TLS_REJECT_UNAUTHORIZED=0`; Python download works. Blocks unattended Windows waves | Kenedy proof, defect 1 | Wave 0. Fix, or run from Linux, or pre-download |
| **Table bloat on idempotent replace** — +19.7 MB relation size after three replaces at constant row count (dead tuples, autovacuum not keeping up). Needs a vacuum policy before repeated waves | Kenedy proof, defect 3 | before Wave 3 (117 counties) |
| **Rural seam factor is 4.46, not the metro 1.07** — statewide storage projections (35 to 37 GB) are derived from the 19 metro counties and are light by roughly 4x on ranch counties. Kenedy: 538 features to 2,400 rows | Kenedy proof | revise after Wave 1 measures more rural counties |
| **Donley 48129 is HTTP 404 at source** — the sole dead URL of 254 probed. Not a wave member; needs a source decision (alternate publisher, county direct, or honest absence recorded in the manifest) | statewide sweep | before claiming statewide L2 complete |
| **Bosque 48035 anomaly** — 104 MB for 19,975 parcels, 12x the median byte-per-parcel, unexplained. Never in an unattended batch; run alone and inspect | statewide sweep | when its wave comes up |
| **57 counties on the 202505 vintage** ship EPSG:3857 and need `--reproject=3857` passed deliberately. The flag is merged and unit-tested but has NEVER run a real county end to end. Prove on King 48269 first (already the reprojection fixture, converted bbox verified against Census) | ldt #397 | Wave 4 |
| **THE UNBUILT JOINT: nothing writes `parcel-node` atoms.** Contract 1.13.0 published and engine registration merged (#282), but the writer does not exist. L2 could acquire all 235 counties and the manifest would still read 0.0365 percent — loading geometry fills `txgio_parcel`; the manifest reads atoms. This is the seam between the statewide factory and the jurisdiction factory | `_inbox/2026-08-08_ATOM_families_ten_rail_spec.md`; memory `statewide-and-jurisdiction-factory-seam` | **next build after acquisition** — the highest-value item on this index |
| Nine of ten remaining rails need atom families (one, join quality, is manifest-only by operator ruling). RRC reuses existing O&G types plus graph edges; `atom_links` already ships and property adapters simply do not write rows | same spec | after `parcel-node` writer |
| Command Center panel owes two renders: `absenceBasis` (API serves it, panel ignores it) and `isPartial: true` distinctly from fully-satisfied (a consumer reading bare `displayState` misreads partial as done) | ldt #395 close notes | hauska-map lane |
| Multi-state recipe doc — classify each layer FEDERAL (free reuse) / STATE-PUBLISHED (find the equivalent agency) / ABSENT-AT-STATE-LEVEL (falls through to per-county). The reusable asset is that taxonomy, NOT the TxGIO adapter | memory `statewide-and-jurisdiction-factory-seam` | ONLY after the Texas path succeeds end to end. Documenting an unrun process is the mistake this program just spent a day correcting |

### Canon enforcement (build rules) — designed 2026-08-08, hook viability PROVEN

Design at `_inbox/2026-08-08_BUILD_RULES_canon_enforcement.md`. The reframing finding: **doc_repo has NO CI and NO git hooks** (verified: no `.github/`, no active `.git/hooks/`), so every mechanism previously specified as "a CI check" carried an unpaid prerequisite. What DOES work is the PreToolUse hook in `.claude/settings.json` — `branch-guard.ps1`, wired 2026-05-16, never disabled. Measured base rate: **hook-shaped controls 1-for-1; protocol-step-shaped controls 0-for-3** (grading rung 0/214 sessions, dispatch template frozen 73 days, FLEET-L3-GAP carrier unbuilt).

| Item | Detail | Trigger |
|---|---|---|
| **M1 pre-dispatch canon check + M3 standing-decision injection** (highest leverage, one hook). M1 blocks on two conditions: dispatching into a repo marked retiring, and an intent record older than 30 days — the second is what would have fired on 2026-08-08 (`repo_intents.md` was 35 days stale). M3 pins a `CANON-PREAMBLE v<sha8>` marker generated from `_STATE.md`'s standing-decisions block; missing or stale-hash blocks, and the block message carries the paste-ready text | `_inbox/2026-08-08_BUILD_RULES_canon_enforcement.md` | **VIABILITY PROVEN 2026-08-08** — see row below. Ready to build (~6h) |
| **PreToolUse fires on the Agent tool — CONFIRMED by live probe 2026-08-08.** Payload: `tool_name=Agent`, `tool_input=[description,prompt,model,run_in_background]`. **`tool_input.prompt` carries the full dispatch text**, so a hook can inspect and block a dispatch before the agent starts. Top-level payload also carries `session_id, transcript_path, cwd, prompt_id, permission_mode, effort, hook_event_name, tool_use_id`. The weaker `Write`-matcher fallback is NOT needed | live probe, throwaway hook removed after test | resolved — was the blocker on M1/M3 |
| M2 canon-vs-reality divergence detector (compare declared repo intent against actual commit activity; alarm when a zero-new-work clock takes feature commits) | same design doc | after M1/M3. Recommendation: script-written markdown FIRST, not the Command Center — the mechanism that watches for drift must not itself carry a five-service deploy dependency |
| M4 grading rung: **DELETE, do not repair.** 214 consecutive failures under the most favorable conditions; sub-step 3 is subsumed by M1/M2. Generalizable rule: *a protocol step whose execution cannot be verified by a grep will not be executed* | same design doc | with the session-close template pass |
| M5 doc precedence enforcement (six competing factory specs, four invariant sets); M6 stale-claim detector (docs asserting facts the store refutes — the CODE EXISTS vs DATA LOADED vs SERVED distinction made enforceable) | same design doc | after M2 |
| **Death list itself is wrong** — `codewarm` is LIVE (`scripts/warm-codewarm-jurisdiction.mjs` imports `runCodewarmBatch`, a real operator CLI) and the $5 wallet top-up route is LIVE (`POST /brokerage/v1/wallet/top-up` mounted via `brokerageBrief.ts`). The canon has asserted both dead since July. Same decay pattern as the ldt intent row, one level down | verified 2026-08-08 during debris clearing | correct the death list in `_catalog/repo_intents.md` |

### Salvage from closed stale PRs (dispositioned 2026-08-08)

Four PRs from older programs closed after review (`_inbox/2026-08-08_STALE_PR_disposition.md`). Closing was a sequencing call, not a rejection of the work. These rows preserve what is worth reviving.

| Item | From | Trigger |
|---|---|---|
| **OZ layer refresh from CDFI/HUD** — main still ships a **638-byte SYNTHETIC** `oz-1.0.geojson` (verified 2026-08-08). Salvage the OZ geojson refresh, the coverage-honest adapter, and `deriveOzDealCrossfilter` ONLY. Must land as a NEW PR off current main, NOT a rebase of the closed one (it was 146 commits behind and its commits C-E violate the Geometry Law) | closed ldt #276 | parallel cheap track — no heavy scan, no atoms writes; good filler alongside layer work |
| `rrc-w1/client.ts` Struts pagination (working paginated RRC client, never merged to main) | closed engine #90 | when W3 RRC unblocks; RRC pipelines still NEVER mint utility-easement atoms |
| FEMA tile-batch ingest pattern as a reference for L4 bulk federal-layer ingest | closed ldt #319 | when L4 (FEMA/SSURGO/3DEP bulk conversion) starts |
| Calibrated-spine wave-2 corpus re-mint concept (the PR itself is dead: pinned `@hauska/atom-contract@1.5.0` vs main's `@empressaio/atom-contract@^1.11.0`, and carried a Cotality client) | closed engine #75 | rebuild from scratch against current main if calibration work revives |

### Sprint 1 manifest follow-ups (2026-08-08)

| Item | Detail | Trigger |
|---|---|---|
| **19 scored counties render as `not-yet`** — scorer-written zoning rows preserved by the seed's `ON CONFLICT DO NOTHING` but `rail_state` left NULL. Bastrop 48021 at 99.77 percent coverage displays as not-done. Real measured work showing as absent | live DB post-seed 2026-08-08 | DISPATCHED as D8 task B |
| Headline completeness figure ruled: **weighted (4.7228 percent)** by `parcel_count_est` is the headline; raw cells-satisfied (235/3302 = 7.1169 percent) is a secondary stat. Both must be visible and distinguishable in the console | operator ruling 2026-08-08 | fold into the CC grid build |
| Boundary-layer vintage constants are HARDCODED (`txgio_city_boundaries_202508`, `tiger_state_county_acs2024`) — a re-run against a refreshed source records a stale vintage | ldt #392 `service.ts` | before the first boundary re-ingest |
| `rail_verification`, `rail_state_history`, run-state/slot registry, per-run cost metering — four tables nothing currently records, all needed by the console (trust signals, regression detection, what-is-running, cost actuals) | mockup v2 findings | ride the parallelism design lane |

### Repo and environment hygiene

| Item | Detail home | Trigger / note |
|---|---|---|
| **50 sibling worktree clones** (`P:\hauska-engine-e-*`, `P:\ldt-*`, `P:\hauska-map-*`) — verified count 2026-08-08, higher than the memory audit's ~40 estimate. Unknown how many carry stale `.cursor/rules`, stale branches, or divergent local state. Executors running in a worktree may miss the fleet-memory install entirely | memory audit `_inbox/2026-08-08_MEMORY_system_audit.md` | enumerate + recycle pass; BLOCKS any claim that rule distribution reaches all seats |
| hauska-engine sitting on branch `fix/warden-situs-address-column` (not main), ahead of origin with unpushed commits, 7+ untracked files at repo root incl. `_build_*.mjs`, `_tmp_*.mjs`, `plain-geometry-twelve-sweep.mjs` | probe reports 2026-08-08 | reconcile BEFORE any fix lane starts; the SHA we cite as `dba7a82` is a branch tip, not main |
| Deployment Neon `information_schema` not readable by audit (no creds); serving Cloud Run revision not confirmed against main HEAD | ledger schema audit | verify before building against assumed schema (standing Cloud Run traffic-trap rule) |

### Doc sprawl (measured 2026-08-08)

| Item | Measured | Trigger / note |
|---|---|---|
| **1,695 markdown files total.** `_inbox` 560 (284 older than 30 days), `_dispatches` 312, `_sessions` 214, `_decisions` 90, `90_operations` 39, `90_runbooks` 27, ADRs 25 | doc inventory `_inbox/2026-08-08_BLUEPRINT_doc_inventory.md` | `_inbox` needs an archival convention — it is both live working set and permanent record with no separation |
| **Six competing factory specs** with no precedence: `27_MASTER_WDLL`, `27a_jurisdiction_factory_engine_spec`, `27c_road_node_engine`, `27d_county_onboarding_recipe`, `28_THE_BASTROP_MOLD`, plus `27e`/`27f` program docs | doc inventory | rule precedence or retire — Phase 2 of blueprint covers the ruling, this row tracks the retirement edits |
| Superseded-but-unmarked `status: active` docs: 4 Cotality docs, 8 closed `PHASE_C_*` dispatches, 5 Replit-era runbooks, `27b` CC program, `44_mcp_cortex_architecture_map` (self-declares "full rewrite owed" while active) | doc inventory | status-flip pass (retire via status flip, never delete, per conventions) |
| Stale self-status paragraphs INSIDE authoritative docs: OPS-3 row 7 says cert is "ON BRANCH (gap #2)" while OPS-5 says it closed 2026-07-31; OPS-8 FOUNDATION GAP describes a single-row registry; OPS-1 STATUS says "the engine reads NONE of this today" | doc inventory | correct in place at Phase 2 consolidation |
| ADR-017 documents a FOUR-value accessPolicy enum; live contract has FIVE (`tenant-shared` added in 1.2.0) | doc inventory | ADR amendment slot |
| `75m_map_data_visual_benchmark.md` marks MUD/RRC "LIVE" (dead Cotality/extension path) with `status: active` and no marker; correction lives only in a QUEUE table cell | doc inventory + LightBox spec | correct at Phase 2; hazard is a false "we already have it" read |

### Memory system remainder

| Item | Detail home | Trigger / note |
|---|---|---|
| **6 orphan Cotality/Regrid memory files** de-indexed from MEMORY.md but intact and unannotated on disk (`cotality-demo-quota-production-gate`, `cotality-oauth-three-keys`, `cotality-swap-program-2026-07`, `cotality-two-data-paths-map-cache-gap`, `regrid-purged-cotality-sole-spine`, plus `cotality-hit-means-decommission`) — invisible to index scan, fully visible to semantic search, still containing live-sounding text | memory audit | half-retirement is how a dead vendor resurfaced in planning 2026-08-08; annotate or remove |
| Stale memories confirmed: `sdk-metering-seam-unwired` (fix SHIPPED — `@hauska-sdk/metering ^0.1.1` in package.json, Stripe POST gone; residual truth is only the un-built CI dep-test), `mcp-rate-limit-upstash-dead` (replaced by Postgres store PR #58), `bastrop-county-cities-scope` (says "Smithville next"; Smithville went live 2026-08-04) | memory audit | memory refresh pass |
| CLAUDE.md line 39 still says "Use the `premortem-check` skill before any commitment"; memory records operator retirement of premortem — unresolved 26 days | memory audit | CLAUDE.md correction |
| Memory files carry no `created` or `last_fired` field; only 18 of 86 carry any in-file date. A memory cannot be aged out or graded for dead weight if its own age is unrecorded | memory audit | schema addition, rides the grading-rung fix |
| Memory store is 100% prose, 0 mechanical guards. The promotion form `fleet_memory_practice.md` ranks STRONGEST has been used zero times — including by two memories that explicitly prescribe a CI test that was never built | memory audit | pairs with the invariant-register rule (every invariant names its check) |

### Engine and instrumentation defects found by the probes

| Item | Detail home | Trigger / note |
|---|---|---|
| **Batch JSON emits no refused-parcel ROSTER.** `sampleOutcomes` caps at 8, `failureSamples` at 30 (`depth-warm-bastrop-batch.mjs:826/845/865/868`). The 770 refused cohort cannot be joined at parcel level from current instrumentation — counter deltas only | `_inbox/2026-08-08_PROBE_770_refusal_join.md` | top instrumentation gap; blocks any refusal diagnosis |
| Bare `catch` at `depth-warm-bastrop-batch.mjs:823` collapses `EnvelopeGroundTruthPromoteDeclineError`, `EnvelopeWriteThenVerifyMismatchError`, and unexpected throws into one `declines.other` counter. Needs `instanceof` discrimination | same | rides the same engine touch |
| Layer-23 setback record fetched TWICE per parcel with identical arguments, uncached (`districtHasPerParcelSetbackRow` ~:553 then `buildBastropPerParcelSetbackDescriptor` ~:570) — 26.14% of loop wall combined | `_inbox/2026-08-08_PROBE_profile_hot_path.json` | free win; in blueprint Phase 3 but recorded here as a discrete defect |
| Edge labeling is an O(edges x 13,987 roads) linear scan with a 25 m threshold; a grid/spatial index collapses it | `_inbox/2026-08-08_PROBE_from_scratch_feasibility.json` | optimization, post-Phase-3-step-1 |
| `48021:0` appears as a roster key in the `superseded-prop-id` decline bucket — malformed parcel node id | 770 probe | roster hygiene |
| Index-locked edge comparison is the WRONG parity test (gave misleading 8/12 and 2/7 where truth is 12/12 and 5/7). Any harness comparing edge arrays by index must move to rotation-invariant matching — Geometry Law rule 7 applied to COMPARISON | feasibility probe | audit all cert/parity harnesses for index-locked comparison |
| `measure-inset.ts` documents the saga method as WRONG on non-convex lots and specifically false-flagging 48021:34121 — so saga-method sample figures UNDERSTATE agreement on irregular parcels | feasibility probe | instrument caveat; fold into the instrument inventory (Phase 2) |

### Zombie code — extends the existing ledger

| Item | Detail home | Trigger / note |
|---|---|---|
| The 2026-08-02 zombie ledger's GATE has now CLEARED (corrected Phase C landed; block13-cert-grade generalized; block13 7/7 held through the whole envelope saga). The deliberate cleanup pass it defers to is now RUNNABLE | `_inbox/2026-08-02_ZOMBIE_CODE_cleanup_ledger.md` | trigger condition met — schedule the one-deliberate-PR-per-repo pass |
| Vercel project `command-center` (jade) still exists parallel to the live `cmdcenter` (blush) — operator decision owed: delete or explicitly label as not-live | zombie ledger section C | operator call; pairs with the CC manifest rebuild |

## Engineering hygiene / small items

| Item | Detail home | Trigger |
|---|---|---|
| Artifact-writing convention: UTF-8 clean JSON (no UTF-16/pnpm-banner logs as .json) | cost-gate close note 2026-08-05 | fold into runbook next doc pass |
| Engine issue #238 (em-dash-in-comment local-only SyntaxError) | engine issues | any engine hygiene slot |
| Pre-existing open engine PRs #75 (calibrated-spine wave-2) and #90 (Reeves O&G mint) | older programs | separate disposition pass, not factory work |
| Atom-contract first-class absence variants ADR (setback-rule/buildable-envelope absence; R27 precedent used instead) | 2026-08-03 county-onboarding notes | ADR slot |
| smitheval clone stray build dir (tools/migrate-legacy-codes/services), operator declined deletion | session 2026-08-05 | leave; clean on next clone recycle |

## How to use

Session close: scan the session for anything parked, add rows. Session start on "what next": read this index top to bottom with `00_current_state.md`. A row leaves this index only by starting (flip to pointer) or by explicit operator kill (strike through with date).
