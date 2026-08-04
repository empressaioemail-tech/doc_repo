---
id: 2026-08-04_scale_ops_continuation_smithville_proven
title: Session — Scale-ops continuation: Smithville proven + cleaned, S4 landed, runbook promoted, ledger hardened
date: 2026-08-04
status: closed
owner: nick
agent: claude_code (planner + 5 sonnet executors)
related: [_sessions/2026-08-04_ops9_wave_execution_claude_code, 90_runbooks/factory_onboarding_runbook, 90_operations/OPS-10_parcel_flag_spec, 76i_smartsite_contribution_economy_roadmap]
---

# Scale-ops continuation

The post-wave arc: operator ratified the strategic answers, captured the flag/contribution vision, and directed everything into flight.

## Shipped and merged (5 more PRs; running total for 2026-08-04 across both planner sessions: 21)

- engine #236 (S4): rowId-keyed cohort loader (loadRegistryDistrictCohortByRow); cert-path preflight probes wired (kills the spurious not-runnable scopeAnnotations); cert-summary row attribution fixed (--row-id / --preflight-row-id precedence — the space-separated form previously fell into a no-op parse, which is HOW the county's 20/20 clobbered the city's cert row in the ledger; planner hand-corrected with real values same hour). Registry status flip to active HONESTLY BLOCKED by caller audit: two fips-keyed sample helpers would silently misgrade with dual-active rows; documented unblock path.
- ldt #383: GET /api/onboarding-ledger/events (per-finding list behind focusedFixCount; sentinel-to-null normalization on the wire; executor built pgvector from source to verify on real pg14). CC consumer + cortex deploy queued together.
- engine #237 (S3): eCode360 default rate 1 → 0.5 rps (twice-reproduced 429 evidence) + TWO dedup layers: the shape-driven collectParentUrls fix (pure-container pages no longer self-enumerate) and content-hash section dedup in normalize() with counted, named drops (a second independent duplication — sibling pages rendering full division marker sets — found during diagnosis).
- Plus earlier-committed: OPS-10 flag spec, 76i contribution-economy roadmap + deflation thesis, EDGE-ROLE-MISJUDGED class (Mesquite pair, stakeholder-reported).

## Smithville: proven, cleaned, ingest-ready

Live proving run history: 1 rps blocked twice (Cloudflare 429); the July proof's own 0.5 rps rate cleared it completely — 836/836 TOC-section identity vs the proof, zero missing, zero new (no code amendments since July). Post-#237 clean crawl: 4,366 blocks (845 headings / 3,521 paragraphs), 259 duplicates dropped with every label named in the log, section coverage identical. Artifact: P:/tmp/smithville-normalized-2026-08-04.json (not committed — 1.9MB working artifact). Ingest recon dispatched (invocation, edition identity, eval fixtures, snapshot-vs-DB serving question, rollback) — the plan lands for planner execution. Two scratch-driver module-resolution stumbles noted: the adapter package deserves a real fetch-only CLI mode (queued nit).

## Runbook + hygiene

90_runbooks/factory_onboarding_runbook.md PROMOTED (executor-drafted from the run records; all ten of its honestly-flagged OPEN items closed with authoritative planner answers). Engine issue #238 filed: local-only Windows vitest collection failure on the wrapper test files (three executors hit it; CI unaffected). Scratch pg14 processes cleaned.

## Operator rulings this arc

Scale question answered on the record: counties fan-ready now; zoned-city fan GATED on Elgin CERT-RESTORE (the residual classes are engine-level and hit every city). eCode360 retry-at-proof-rate ruling exercised (worked). OPS-10 v1 and the contribution-economy discussion remain open threads with the operator.

## Open at close

Ingest recon → planner runs the Smithville ingest+eval. CC events-consumer dispatch + one cortex deploy (serves #382+#383 together — #383's route is merged but not yet deployed). Registry status-flip unblock (migrate two sample helpers to the rowId loader). Elgin session's CERT-RESTORE residuals (their lane). S6 fan opens for COUNTIES whenever the operator says go; zoned cities behind Elgin CERT-RESTORE.
