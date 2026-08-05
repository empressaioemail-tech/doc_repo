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
| Paywall finish + Stripe promo codes + server-side dev role | `76j` Workstream A | READY NOW (order 1; unblocks external testers) |
| Rate-limit store replacement (Upstash dead, in-memory fallback) + Neon pooling pass | `76j` Workstream C | READY NOW (order 2; launch-blocking) |
| Smart Site domain purchase + Vercel custom domain | `76j` Workstream B | OPERATOR (pick + register domain) |
| Favicon to crosshairs + deferred rebrand set (title, landing, copy) | `76j` B; 2026-08-03 rebrand deploy notes | after domain, launch polish |
| Smart Site branding on PDF export templates | `76j` B; `REBRAND_UI_citations_and_pdf.md` | launch polish |
| Anonymous-to-account claim flow (auth flip orphan trap) | `76j` C3 | rides with paywall work, never bundled with unrelated fixes |
| Load test + measured capacity doc (launch go/no-go input) | `76j` C4 | after orders 1-2 land |
| Affiliate platform selection + setup (Rewardful/PromoteKit class; affiliate portal = their product) | `76j` D | after paywall live |
| Affiliate distribution financial model (bizops, 70-band doc) | `76j` D; ties `14_pricing_framework` | parallel anytime |
| OPS-10 flag-a-parcel v1 build | `OPS-10_parcel_flag_spec.md` (spec ready) | next product-side build slot; feeds `76i` |
| Contribution economy / claim-your-smartsite / rewards token arc | `76i_smartsite_contribution_economy_roadmap.md` | after OPS-10 v1 + partner token diligence |
| Launch-outside-Texas | `76j` gating rule | HELD until factory data flush per state |

## Factory / data lanes (Central TX + DFW)

| Item | Detail home | Trigger / order |
|---|---|---|
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
