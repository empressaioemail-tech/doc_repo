---
id: 2026-07-15_verification_wave_and_land_records_posture
title: Decision record — verification-wave rulings and land-records first-party posture
date: 2026-07-15
status: active
deciders: [Nick, planner]
related: [00_current_state, adr_027_first_party_land_records_acquisition, adr_026_sensor_stream_atoms, _land_records/strategy]
---

# Decision record: verification-wave rulings and land-records posture

Operator-interactive planning session, 2026-07-15. Records the directional commitments made this wave, each with reversal criteria.

## Decisions

**D1. Calibration stays on the critical path.** M1 / deposit-to-atom lineage attribution remains a live gating build, not backgrounded in favor of launch. It lands where the dependency chain allows and gates the public CLAIM (public surfaces say provenanced and verifiable, never calibrated or earned confidence) not the public launch. Reversal: if a customer or enterprise deal requires earned confidence as a launch precondition, calibration is promoted from parallel-track to blocking; if the operator explicitly re-sequences, background it with a named trigger.

**D2. SmartCity rebuild is an independent, walled project.** Live city on it; no autonomous work spun against smartcity-os; it does not share agents with the wedge tracks; its rebuild is its own phase requiring dedicated operator focus. Reversal: operator explicitly folds it into the main program.

**D3. The OG app is data-blocked, not code-blocked.** RRC deep adapters are W-1-only live today (PDQ/H-10 throw as honest stubs; the working paginated client is on unmerged PR #90 with a permitNumber-dedup bug that collapses fetches). OG app refinement waits on the data tracts landing. Reversal: none needed; this is a sequencing fact, revisited when RRC production/injection adapters are built.

**D4. TexasFile is out as a substrate input; first-party acquisition adopted (adr_027).** TexasFile ToS forbids derived/redistributed use, automated retrieval, and title-plant building, and a licensed atom's provenance terminates at a vendor rather than the county, violating commitment #1. TexasFile survives only as a manual internal-grading reference (Herbert-exemplar class). Reversal: the adr_027 reversal criteria (118.011(e) does not bind, quotes exceed 10x surviving AG complaint, vendor-hold defeats PIA across a majority by volume, or a clean state-level aggregation emerges).

**D5. Land-records acquisition sequencing.** Free layer autonomous now (per-CAD bulk primary for parcels, StratMap address points open REST, StratMap parcel files fill gaps). Comptroller aggregate-EARS tested via one special request (verified: no self-serve path). County outreach automation corridor-first (Central TX), operator as named legal party under standing cost caps. NEVER auto-escalate OAG overcharge complaints against clerks inside the SmartCity/Vertosoft network (R4, the highest-weighted relationship risk). Reversal: operator directs statewide fan-out, or the corridor proves the runbook and fan-out is authorized.

**D6. The Winkler DOTO chain is a calibration exemplar only.** Rube Evans 10, Sec 10 Blk A-56, filed as a second independent OG title grading exemplar distinct from the C7 Sec 25 Blk B-5 baseline. Confidential grading material, never onboarded to a product corpus, never redistributed. Reversal: none; this is a handling classification.

## Operating-model note

The planner dispatches and manages agents directly; the operator does not hand-carry prompts and is not the courier. Verification is never delegated: the planner adversarially reviews every subagent deliverable and live-verifies. This wave's central lesson: the doc set and the local clones both lagged live reality (clones 17-67 commits stale), so all state claims must trace to live gh/npm/gcloud or freshly-synced source, never to doc headlines or a local clone's HEAD (which can itself be a stale origin ref).

## Verification artifacts

Clone-staleness measured via `git fetch` + `git rev-list --left-right --count HEAD...origin/main` across six clones. MCP four-gate confirmed live via `gcloud run services describe` showing a revision tagged `fourgate`. Contract version confirmed via `npm view @empressaio/atom-contract version` (1.7.0). Engine substrate live-probed (migration head 0055, real store row counts). Comptroller EARS self-serve absence and StratMap parcel gating verified live via WebFetch against the actual ArcGIS and Comptroller endpoints.
