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
| Rate-limit store replacement (Upstash dead, in-memory fallback) + Neon pooling pass | `76j` Workstream C; WDLL `_inbox/2026-08-05_76j_workstream_C_rate_limit_and_pooling_WDLL.md`; `_inbox/2026-08-05_neon_pooling_audit.md`; `_inbox/2026-08-05_launch_capacity_measured_facts.md` | **PARTIAL 2026-08-05.** **C2 DONE** — all 6 serving DSNs pooled (`00059-lir`, `00161-gin`, `00481-xik`, MCP `00050-fej` incidental). **C1 PARTIAL** — fail-loud degraded mode shipped (PR #57, `00050-fej`); **BLOCKED:** operator must provision Upstash Redis DB + update `UPSTASH_REDIS_REST_URL` secret (no redeploy needed). C4 load test blocked until C1 items 1+2 close. Adjacent OPEN: in-process limiter did not 429 at 70>60 rpm (`_inbox/2026-08-05_rate_limit_burst_test.log`). |
| Smart Site domain purchase + Vercel custom domain | `76j` Workstream B | OPERATOR-PARKED 2026-08-05 (deliberate hold; revisit at launch-polish slot) |
| Upstash go/no-go: restored DB exists (secrets IN HAND, held); decide at health-check sweep whether Upstash stays the store — NOTE the outage root cause was free-tier 14-day-inactivity auto-delete, so staying on Upstash means paid tier or a keepalive; alternative stores re-scored in the C1 report | rate-limiter session report; `76j` C1 | DECIDE AT HEALTH-CHECK VERDICT; then operator pastes secrets + burst proof. Also fix the limiter identifier bug (zero 429s in-memory) before trusting any proof |
| CAD/DXF export text regression (jumbled text on 109 Higgins export; was clean in prior test) | operator report 2026-08-05; triage q: what deployed between the two tests | PARKED with site-plan/PDF-logo work per operator; goes on the health-check bug list first for triage-only (no fix dispatch until verdict) |
| Paywall operator E2E close (4 actions: STRIPE_PE_UNLOCK_PRICE_ID secret, dev-role grant probe, promo-code E2E, claim smoke) | paywall session WDLL finish card | OPERATOR when ready; re-grades WDLL items 1-3, 8 |
| PE map polish: pedestrian-path marker too faint — should be a shade of blue, brighter, DOTS not dashes (operator visual QA 2026-08-05, Higgins St screenshots) | hauska-map style layer | polish batch with rebrand/favicon set |
| DISCUSSION (post-verdict): rewarm strategy — "it takes forever." Threads to bring: keyspace sharding flag (already queued pre-Bexar), --batch tuning, INCREMENTAL rewarm (changed-parcels-only vs whole-cohort, OPS-4 protocol), and whether the city-cohort envelope re-warm (health-check lead exhibit) becomes the incremental rewarm's first proving run | operator 2026-08-05 | AGENDA ITEM at health-check verdict review |
| DISCUSSION (post-verdict): HOLISTIC PROCESS REVIEW — not bug-fixing but "are we using the best setup, can we make it better, what are we missing." Candidate threads: pipeline architecture (bake/scan model vs set-based SQL or streaming), instrumentation coverage (what else has no Warden-class check), testing strategy (area-sweep certs vs samples, product-surface smoke suite), fleet/session model (planner+executor coordination cost, claims overhead), data-store topology (three-store split, propagation legs), tooling (dry-run speed, deploy ergonomics), and what an outside architecture review would flag | operator 2026-08-05 | AGENDA ITEM after the verdict review; deserves its own session |
| Favicon to crosshairs + deferred rebrand set (title, landing, copy) | `76j` B; 2026-08-03 rebrand deploy notes | after domain, launch polish |
| Smart Site branding on PDF export templates | `76j` B; `REBRAND_UI_citations_and_pdf.md` | launch polish |
| Anonymous-to-account claim flow (auth flip orphan trap) | `76j` C3 — **shipped with A 2026-08-05** (claim-session, claim-local-state, session-exchange install claim) | DONE with Workstream A |
| Load test + measured capacity doc (launch go/no-go input) | `76j` C4 | after orders 1-2 land |
| Affiliate platform selection + setup (Rewardful/PromoteKit class; affiliate portal = their product) | `76j` D | after paywall live |
| Affiliate distribution financial model (bizops, 70-band doc) | `76j` D; ties `14_pricing_framework` | parallel anytime |
| OPS-10 flag-a-parcel v1 build | `OPS-10_parcel_flag_spec.md` (spec ready) | next product-side build slot; feeds `76i` |
| Contribution economy / claim-your-smartsite / rewards token arc | `76i_smartsite_contribution_economy_roadmap.md` | after OPS-10 v1 + partner token diligence |
| Launch-outside-Texas | `76j` gating rule | HELD until factory data flush per state |

## Factory / data lanes (Central TX + DFW)

| Item | Detail home | Trigger / order |
|---|---|---|
| Building footprints rail (BCAD publishes clean footprints; needed for coherent site plans) — RE-PRIORITIZED from later-work to CATCH-UP by operator 2026-08-05: "run these now as part of our catch up work... I don't want to have to comb over all of Texas again much less the whole country." Onboard the rail while the jurisdiction set is small, make it part of the standard county recipe going forward | operator directive 2026-08-05; BCAD source | DISCUSS AT HEALTH-CHECK VERDICT; then spec + recipe slot before any new scaling |
| Public utility easements rail — same re-prioritization and rationale as footprints (site-plan coherence; per-jurisdiction acquisition) | operator directive 2026-08-05 | DISCUSS AT HEALTH-CHECK VERDICT; likely paired with footprints spec |
| Bastrop 41-parcel stamp re-roll (Warden catch; districts exist in per-parcel layer) | backlog MIXED-VINTAGE-NEIGHBOR row; recon `P:/tmp/bastrop48-district-recon.json` | UNBLOCKED 2026-08-05 (Warden v1.1 shipped); stamp-CLI recon in flight; block13 7/7 gate before/after |
| Bastrop 7 zoning-coverage-gap parcels (two clusters, possible annexation/ETJ pockets) | same backlog row | city follow-up (Sylvia channel), after the 41 land |
| ENVELOPE-BEHIND-STAMP re-warm (stamped-but-unwarmed city parcels; 5-parcel evidence, cohort unenumerated) | backlog HONEST SAMPLING FALLOUT table | enumerate via batched script, re-warm through city path, parity re-gate + block13 gate |
| COUNTY-COHORT-LOADER-ZERO (Caldwell cohort loader returns 0) | backlog same table | fix loader query vs Caldwell layer; certs unaffected (roster-from-file) |
| ELGIN-CERT-RESIDUAL (cert 2/10 residuals: orientation tokens, rear emit, edge roles) | backlog row; Elgin session | Elgin session lane; also the fix family for EDGE-ROLE-MISJUDGED (Mesquite flag lots) |
| Travis County (48453) onboarding | registry HOLD comment | geo_id/address crosswalk build (prop_id bad-rate 0.51) |
| Rockwall (48397) cadastral source | DFW tracker `_scratch/dfw_onboarding.md` | HOLD, no full-county REST source found |
| Smithville corpus follow-ups: Bastrop UDC Municode drift-skip; ICC unit 0-section drift; Grand County legacy-env absence in snapshot builds | snapshot build outcomes 2026-08-04 | corpus maintenance slot |
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
