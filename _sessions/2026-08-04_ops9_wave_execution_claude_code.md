---
id: 2026-08-04_ops9_wave_execution
title: Session — OPS-9 wave: S1/S2/S3/S5 executed in parallel; Warden accepted; flake #221 killed at root
date: 2026-08-04
status: closed
owner: nick
agent: claude_code (planner + 8 sonnet executors, parallel with the independent Elgin-pipeline planner session)
related: [90_operations/OPS-9_scale_ops_specs_pack, 90_operations/onboarding_defect_class_backlog, _decisions/2026-08-04_ecode360_partnership_retired_scrape_posture, _dispatches/2026-08-04_elgin_pipeline_planner_handoff]
---

# OPS-9 wave execution

Operator directive: manage the OPS-9 workstreams in parallel with executor subs while the hand-delivered Elgin planner ran its own pipeline. S4 was deliberately HELD (file-set overlap with the Elgin session); everything else ran. Two planner sessions co-operated on one repo set all day via disjoint file guards and the shared ledger, without a single collision.

## Shipped and merged (this session's PRs, all conclusion-string-gated)

- S2 trust surface: ldt #380 (grounding-derived sources in every presentation mode + grounding-based confidence, retiring the marker-survival proxy per the consumer-mode ruling) and map #147 (governed-by rendering + setback X-ray details, graceful-absent). BOTH DEPLOYED: cortex-api 00469-hex @100 (tag-smoke-shift after the workflow's no-shift trap), PE index-rpPsMYVp (markers verified in the served bundle).
- S3 eCode360: engine #231 — the scraper adapter REBUILT from the surviving 2026-07-29 proof artifacts (the original code was never pushed and is lost; planner-verified against origin). Robots-gate-first, civil-UA-only, fail-loud on challenge pages, fixtures cut from real captured pages, a nav-sidebar double-counting bug found against the proof's own counts. Smithville live proving run queued (planner-run).
- S5 Warden: engine #229 (v1: four checks, files-never-fixes with a structural import-guard test) + #232 (txgio connection wiring fix, found by the planner's first live sweep) + #234 (calibration: serve-path comparator matched wrong wire field names so served envelopes could never be observed present; suppression-aware narrowing; per-parcel dedup; self-verifying IDs). FIRST ACCEPTED SWEEP on Bastrop city: 50 unique flagged parcels, all neighbor-consistency (27 on repealed legacy-P codes incl. the six P-5 watch parcels, ~23 patchy-absence inside the districted cohort), zero false flags on legitimate district boundaries, serve-path clean after calibration. Artifact: _inbox/2026-08-04_warden_sweep_bastrop_accepted.json.
- S1 console: map #148 (the 9801% percent-math fix), engine #230 (preflight/cert report-wrapper scripts POSTing to the pinned ingest contract + roster mirror + quarantine surfacing), ldt #381 in final gate at close (ingest route + three tables; its CI red was a REAL Postgres NULLs-distinct idempotency bug fixed via write-boundary sentinel, plus a test-residue fips fix).
- Hygiene: engine #233 — flake #221 KILLED AT ROOT. Not concurrency: the test decode helper truncated PDF stream slices by regex-scanning for endstream instead of reading /Length (content-dependent ~0.5%/stream), plus a second latent scan bug. 400-iteration probe: 2/400 broken before, 0/400 after. Issue closed.

## Live ops (planner-run)

- CC Node & Graph DEGRADED root-caused and FIXED: the CC-held retrieval key went stale in the 2026-08-03 redeploys (the rotation class again); synced via vercel env + redeploy, 401→200 verified. Graph tally endpoint noted slow (~40s cold live SELECT) — cache nit filed.
- The county_facet_coverage "1/10 onboarded" mystery resolved by probe: two ad-hoc hand-written rows, no writer path; the new ingest path becomes the sole writer and supersedes them.
- Warden env contract learned and documented into the CLI: DATABASE_URL = atoms Neon; TXGIO_DATABASE_URL = the ldt deployment Neon (txgio_parcel); retrieval pair for serve-path.

## Decisions logged this session

- eCode360 partnership RETIRED; scrape/citizen-portal posture (operator ruling; _decisions/2026-08-04_ecode360_partnership_retired_scrape_posture.md). Source-required correction on the record: Pflugerville was CHARACTERIZED-and-stopped in July (encodeplus robots-disallow), not captured; Smithville's eCode360 content paths are robots-ALLOWED (the 403 was Cloudflare, cleared by an honest UA). OPEN OPERATOR QUESTION: does the scrape ruling extend to robots-DISALLOWED paths (the encodeplus sub-bucket: Pflugerville UDC etc.), or does that sub-bucket wait for another surface?
- Ledger store ruling: ONE reading surface (cortex Neon; onboarding_ledger_event superset schema carries preflight, cert, quarantine, and Warden events; jurisdiction_registry_row_mirror for the roster; county_gate_cert_state for gate/cert). Warden writes via the same ingest endpoint; no engine-side findings table.

## Queue at close

#381 final gate → cortex canary deploy (applies migration 0065) → historical backfill ingest (certs, gate runs, quarantine, accepted Warden findings) → CC v2 UI dispatch (PR-4, the registry-row model with gate/cert/gaps columns) → cmdcenter deploy → Smithville live proving run (polite crawl + eval-gated ingest) → S4 reconciliation once the Elgin session closes (its state at our close: warm 1,886/3,762 promoted, cert 2/10 with three named ELGIN-CERT-RESIDUAL causes, Bastrop 7/7 holding). Elgin-session co-commit observed at 88f3009.
