---
id: CATCHUP_program_2026-08-05
title: Catch-up program — master plan (post health-check, pre-scale)
status: active
owner: nick
related: [HEALTH_CHECK_2026-08-05_verdict, QUEUE_parked_work_index, T1_data_accuracy_track, T2_polish_product_track, T3_rails_track, T4_infra_track, T5_factory_throughput_track]
---

# Catch-up program (the WDLL master)

Operator-ratified structure, 2026-08-05: get the data right and everything parked DONE before any new scaling. doc_repo planner (this session's continuation) is MASTER PLANNER: rules, verifies every track's acceptance against live state, owns the ledger of record. Each track executes via a hand-carried planner agent running its whole track in one pass. Operator rulings baked in: NO city dependencies at any level (uniform public-record acquisition only); polish/rails run in PARALLEL with data work; Upstash is OUT for rate limiting.

## Tracks

| Track | Doc | Executes | Parallel? |
|---|---|---|---|
| T1 Data accuracy | `T1_data_accuracy_track.md` | envelope re-warm (lead exhibit), propagation bake, roster-wide stamp sweep, ENVELOPE-BEHIND-STAMP, flag-lot orientation, 7 gap parcels (public-record), dup-geometry + vintage drift, Caldwell loader, ADU answer-quality (corpus edition + retrieval ranking) | OWNS the atoms-DB heavy-scan slot; internally serial on heavy scans |
| T2 Polish + product | `T2_polish_product_track.md` | CAD/DXF triage+fix, pedestrian-path style, favicon/title/landing/copy, PDF Smart Site branding, paywall E2E support, domain attach when purchased | fully parallel (UI/export surfaces, no heavy DB) |
| T3 Rails | `T3_rails_track.md` | building footprints + public-utility easements: source recon, contract shape, ingest spec, Bastrop pilot | parallel (read-only recon + spec; pilot ingest coordinates with T1 for DB slot) |
| T4 Infra | `T4_infra_track.md` | rate limiter WITHOUT Upstash (identifier bug first), then load test (76j C4) | parallel (mcp-server + infra, no atoms DB) |
| T5 Factory throughput | `T5_factory_throughput_track.md` | keyspace sharding flag, engine #254 adoption, certs (Comal/Williamson/Hays/Bell), Bexar via sharding | parallel for code; its data-runs QUEUE BEHIND T1 in the heavy-scan slot |

**T5 heavy-scan slot (operator relay 2026-08-06):** block13 **clean on main** — data-run freeze lifted. Slot order unchanged: **T1 (WS1 + Elgin) → T3 pilot → Bexar**. Comal cert re-run **DONE** (light). Bexar/Hays/Bell heavy scans queued for slot release.
| T6 Texas roster recon | `T6_texas_roster_recon_track.md` | complete 254-county + all-incorporated-cities roster: verified sources (four-point probes, adversarially re-probed), zoning regimes, code-text publishers, join quality, rails availability, risk classes, cost-estimated ingest wave plan, gap ledger, vendor pattern library | fully parallel (READ-ONLY; public sources; no prod writes, no heavy-scan slot) |

## Model mandate (operator directive 2026-08-05)

Every track planner AND every executor it dispatches runs on CURSOR-hosted models only (per the HR-12 fleet default: Grok Build 0.1 agentic / grok-code-fast-1 for speed) — NOT OpenAI or Anthropic models — to consume the operator's Cursor usage credits. Bake this line into every executor dispatch. The doc_repo master planner session is the standing exception.

## Coordination rules (bind every track)

1. HEAVY-SCAN SLOT: one heavy scan/bake on the atoms Neon at a time. T1 holds the slot; T5/T3 data-runs reserve it through the master planner. Light reads/certs/sweeps are exempt.
2. Claims: T1 owns engine warm/measure code + atoms data-runs. T2 owns map/PE UI + ldt export templates. T3 owns new-rail recon/spec (no prod writes without master sign-off). T4 owns mcp-server + limiter infra. T5 owns engine registry/sharding + cert lane. Conflicts: rebase-keep-both; escalate file disputes to master planner.
3. Every merge gates on the CI conclusion STRING. Every data-run: dry-run first, apply must match exactly, regression gate (block13 or track-named equivalent), ledger POST. Artifacts UTF-8 to _inbox.
4. NO city/relationship dependencies. Public-record acquisition only. Honest absence where the record does not resolve.
5. Track close = master planner verifies acceptance against live state (never the track's own report alone), then flips the track's rows in `QUEUE_parked_work_index.md`.
6. PERMANENCE RULE: nothing closes as a one-off. Every fix/standard a track establishes must land in the permanent operating docs before track close — warm-time gates and area-sweep certs into `OPS-5_cert_standard.md` + the factory runbook; new rails into the county recipe; Warden checks into the Warden section; process rules into the runbook. Program close includes a master-planner consolidation pass confirming the runbook/OPS docs fully describe the upgraded factory, so future counties get the improved machine by default and no re-comb is ever needed.

## Parked-work index

`90_operations/QUEUE_parked_work_index.md` is the single queue of record. Every track's items are rows there; the tracks below reference rows rather than restating. Items in the index NOT covered by T1-T5 (still parked, post-program): contribution economy arc, affiliate platform + financial model, OPS-10 v1 build, Travis crosswalk, Rockwall source, eCode360 city bucket, Warden scheduling automation, registry status flip, ADR/hygiene items, holistic process review session, rewarm-strategy agenda (T1's re-warm is its proving run; the strategy session follows with measured numbers).

## Restart gate

Scaling (DFW Phase 3, new Central TX counties, corpus growth) resumes only when T1 and T5 acceptance are verified and the operator has reviewed the program close. T2/T3/T4 close on their own clocks.
