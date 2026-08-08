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
