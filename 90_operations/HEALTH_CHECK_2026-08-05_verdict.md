---
id: HEALTH_CHECK_2026-08-05_verdict
title: Health-check verdict — ground truth after the fan push (2026-08-05)
status: active
owner: nick
related: [QUEUE_parked_work_index, onboarding_defect_class_backlog, 76j_smartsite_launch_readiness_program, 90_runbooks/factory_onboarding_runbook]
---

# Health-check verdict, 2026-08-05

Operator-ordered freeze, all lanes landed, ground truth verified live. This document is the restart basis: what is green, what is broken with owners, and the proposed re-entry order. Companion queues: `QUEUE_parked_work_index.md` (everything parked), `onboarding_defect_class_backlog.md` (data-defect detail).

## Executive verdict

The platform is structurally healthy and every service is serving its intended build. The factory certified three new counties this wave and its instruments caught four latent, program-level defects (stamp centroid precision, sampling vacuous-passes, cost-model error, paywall webhook gap) that predate the program. The cost of the wave: one real data-quality regression became visible on the product surface (the city envelope layer), two instrument gaps were exposed (cert-by-sample, no envelope-shape check), and process friction (DB contention, unmapped pipeline legs) slowed everything. Nothing found is unfixable; nothing found is silently spreading; every known defect has a named class, evidence, and a fix path. The operator's catch-up-before-scale ruling is the right call and the restart order below implements it.

## Serving truth (verified live, percent-filtered revisions)

| Service | Serving revision | Health | Note |
|---|---|---|---|
| hauska-retrieval-api | 00059-lir @100% | 200 | pooled DSN |
| hauska-engine-api | 00163-mew @100% | 200 | carries the #255 edge-role export fix |
| hauska-mcp-server | 00050-fej @100% | 200 | fail-loud degraded limiter; real store pending Upstash decision |
| cortex-api | 00483-peg @100% | 200 | paywall entitlement build |
| PE (Vercel) | bundle index-DnMQ6bEw | live | checkout/claim markers verified by paywall session |
| Map tiles | parcels.3431529a2e8d.pmtiles | live | DFW rendering; old artifact retained for rollback |

## Repo truth

Mains: engine `1c9cb8c`, legacy-design-tools `0e34831`, hauska-map `82f4f92`, mcp-server `92ada7c`, doc_repo current. Open PRs, all accounted for: engine #254 (DFW session's Kaufman/Ellis rows + propIdField threading — REQUIRED by my Williamson/Bexar certs; session parked, needs adoption or resumption), engine #75/#90, ldt #276/#319, map #118 (pre-existing, older programs, disposition pass queued).

## Factory truth

| Jurisdiction | State |
|---|---|
| Bastrop city | CERTIFIED block13 7/7 (held through reword, stamp, and export-fix changes — regression gate exercised 4x this wave) |
| Bastrop County (uninc.) | CERTIFIED 20/20; Smithville-segment decline wording fixed (5,327 exact) |
| Guadalupe / Caldwell / McLennan | CERTIFIED 20/20 each; Warden v1.1 sweeps clean (Caldwell) or noise-free (Guad/McL 0 flags) |
| Comal | Cascade APPLIED 76,525 exact, 0 errors. Cert queued (not run — freeze) |
| Williamson | Dry-run complete: 282,570 scanned / 157,937 would-cascade / 0 errors. Apply+cert queued; cert needs engine #254 (PropertyID field) |
| Bexar | HELD by operator ruling — no run until keyspace sharding exists (700k cohort; also needs #254 PropID) |
| Hays | Gate clean (county-owned cadastral layer found + live-verified, #251). Dry-run queued |
| Bell | Gate clean post cost-fix ($1.15). Cascade queued |
| Travis | HOLD (prop_id bad-rate 0.51; crosswalk build) |
| DFW 9 counties | Phase 1 substrate complete (~2.55M zoning-facts, tiles live). Phase 3 parked mid-Kaufman with its session; #254 open |
| Corpus | 43 tenants in prod pg; Smithville live on /search (836 @ 1.00 eval) |
| Ledger | preflight/cert/warden events verified flowing per rowId |

## LEAD EXHIBIT — city envelope inconsistency (operator block sweep, Jones/Higgins St)

Twelve same-block SF-1 parcels serve identical, correct setback RULES but wildly inconsistent envelope GEOMETRY (full-lot insets, slivers, corner-pinned boxes). Diagnosed live: all twelve envelopes were CREATED in one batch by `depth-warm-verify-promote` at 2026-08-03 03:03 (single version, no prior vintage — a first-write, not a clobber). The variance is that batch's own per-parcel quality: the depth-warm measurer misassigned edge roles on ordinary lots (the known R32/R33 orientation family) and its verify gate passed them. Two instrument gaps let it ship: (1) cert-by-sample — block13's 7 parcels stayed 7/7 while the adjacent block is visibly broken; area-sweep certs are the fix; (2) the Warden has no envelope-shape sanity check (envelope-within-parcel, area-ratio bounds, edge alignment) — v1.2 item. The #255 export fix corrects edge roles at serve/export time but the stored atoms remain wrong: the durable fix is a city-cohort re-warm with the R28/R30 gates applied at warm time, certified by area sweep. This re-warm is also the natural proving run for the incremental-rewarm strategy (operator agenda item).

## Ranked bug list — data accuracy first (operator priority)

1. City envelope re-warm (lead exhibit) — re-warm Bastrop city cohort with warm-time R28/R30, area-sweep cert, then Elgin same treatment. OWNER: factory lane, first restart item.
2. Stamp-to-atoms propagation bake for the 40 stamped parcels — the named remaining leg; Warden count should drop ~50 to ~9 after. OWNER: factory lane.
3. Roster-wide stamp under-coverage sizing — post-centroid-fix dry-runs across every ZONING_LAYERS city; each city's would-stamp count is its historical under-coverage. Potentially the largest accuracy item on the board. OWNER: factory lane.
4. ENVELOPE-BEHIND-STAMP enumeration + re-warm (stamped-but-unwarmed city parcels; folds into item 1's re-warm if cohorts overlap). 
5. Mesquite flag-lot side/rear misread — needs flag-lot orientation judgment (OPS-10 family), explicitly NOT fixed by #255.
6. Bastrop 7 zoning-coverage-gap parcels — OPERATOR RULING 2026-08-05: NO city dependencies at any level; resolve from public record only (newer published zoning layers/editions) or serve honest no-district-on-record. T1 workstream 5.
7. 48021:29431 dup-geometry (R15 parcel-currency handling) + 3 Caldwell CAD-vintage-drift parcels.
8. Caldwell county cohort-loader-zero (loader query vs its layer; certs unaffected).
9. Rate-limiter identifier bug (zero 429s even in-memory) — fix BEFORE trusting any Upstash burst proof.
10. CAD/DXF export jumbled text — PARKED by operator with polish set, but triage question is cheap: what deployed to the export path between the two tests.

Polish (parked, not ranked): pedestrian-path style (blue/brighter/dots), favicon/title/landing/copy, PDF Smart Site branding, domain purchase, paywall operator E2E.

## Process recalibration (operator-ratified direction)

1. Serialize the data plane: max ~2 heavy scans per database; contention roughly halved every job this wave. Batch-tune before adding concurrency; sharding flag before any 500k+ county.
2. Map every pipeline leg before a fix chain starts (store -> atoms -> serve); a chain closes only when the instrument that found the defect goes quiet.
3. Area-sweep certs for product-visible geometry, not parcel samples.
4. Product-surface smoke suite so operator testing stops being the first detector (screenshots found what instruments missed, twice).
5. Instruments got materially better this wave (Warden v1.1, honest sampling, calibrated cost gate) — keep investing there; every latent bug found this wave was found by an instrument or an operator, never by luck.

## EXECUTION PROGRAM (supersedes the restart-order list below; operator-directed deepening 2026-08-05)

The restart order was expanded into a five-track parallel program with per-track reference docs and hand-carried planner prompts: `CATCHUP_program_2026-08-05.md` (master; coordination rules, heavy-scan slot, claims) with tracks `T1_data_accuracy_track.md`, `T2_polish_product_track.md`, `T3_rails_track.md` (footprints + easements, re-prioritized to now), `T4_infra_track.md` (rate limiting WITHOUT Upstash per operator ruling; options analysis inside), `T5_factory_throughput_track.md` (sharding, #254, certs, Bexar). T2/T3/T4 run fully parallel with the data work; T1 owns the atoms-DB heavy-scan slot; T5 code is parallel and its data-runs queue behind T1. The parked-work queue of record is `QUEUE_parked_work_index.md` — every track item is a row there; post-program parked items are listed in the master doc.

## Restart order (original proposal, superseded by the track program above)

1. City envelope re-warm (lead exhibit) as the incremental-rewarm proving run + Warden v1.2 envelope-sanity check.
2. Propagation bake (40) + Bastrop warden re-verify (~9 expected findings).
3. Roster-wide stamp under-coverage dry-run sweep; review; per-city applies with regression gates.
4. Keyspace sharding flag; then Bexar dry-run as its first production run.
5. Building footprints + utility-easements rails spec (operator re-prioritization) — into the standard county recipe before more counties onboard.
6. Certs: Comal, Williamson (after #254 adoption), Hays cascade+cert, Bell cascade.
7. Parked/polish batch + holistic process review session (own agenda).
8. THEN scaling resumes (DFW Phase 3, remaining Central TX, corpus growth).

## Operator decisions pending

Upstash go/no-go (restored DB in hand; free tier auto-deletes at 14 days idle — paid tier or keepalive if staying) — after item 9's limiter bug fix. Domain purchase (parked). Paywall E2E (4 actions). Footprints/easements go (item 5). Engine #254: adopt into my lane or resume the DFW session.
