---
decision_id: 2026-06-22_calibration_raw_bucket_placement
date: 2026-06-22
owner: Nick
status: active
related_canonical: [_calibrated_spine_roadmap/04_task_roadmap, _calibrated_spine_roadmap/05_measurement_spec, _inbox/2026-06-21_acquisition_acquisition-agent_wave3-bulk-pulls, 80_adrs/adr_008_engine_factor_out, _architecture_homes/00_overview]
---

## Decision

The calibration-raw landing bucket `gs://hauska-calibration-raw` belongs in the Hauska substrate project `hauska-prod-497015` under a dedicated acquisition service account; it stays physically where it is today (`legacy-design-tools-prod`, granted to the SmartCity prod SA) until the legacy monorepo unpack, at which point it migrates by a single server-side recursive copy.

## Context

The acquisition agent's Wave 3 close created `gs://hauska-calibration-raw` in project `legacy-design-tools-prod` and granted `roles/storage.objectAdmin` to `serviceAccount:smartcity-agent@smartcity-os-prod.iam.gserviceaccount.com` as the runtime identity. That is the BFF/product project, not a spine project, and reuses the SmartCity prod identity. The calibrated-spine plan had assumed the bucket would live in a substrate project under an acquisition identity. No SmartCity data or tenant tooling was touched (the data axis of the non-negotiable held); the divergence is at the project-boundary and IAM-identity layer only. Re-pulling the 2.85M landed rows to relocate now would be waste, so the placement is corrected at unpack rather than immediately.

## Structural commitment check

- Spine rule / decoupling (ADR-008, architecture-homes): calibration-raw is spine substrate data and should live with the spine compute that ingests it (engine in `hauska-prod-497015`), not in the BFF/product project. Current placement violates the target topology; this decision restores it.
- No special-access / SmartCity untouched: held on the data axis (public-record process only, no MyGov/tenant tooling). The SmartCity SA grant is an IAM-identity coupling, not a data-access path, but is dropped under this decision in favor of a dedicated acquisition SA.
- Tenant sovereignty: not implicated; raw is public-record acquisition data, not tenant-private adjudications.

## Reasoning

The decoupling target puts spine substrate next to spine compute, and the engine that runs K2 ingest and the warming cascade lives in `hauska-prod-497015`; co-locating means the reader needs no cross-project grant in steady state. The migration is cut-and-paste by design, not by luck: the landing layout is project-agnostic and self-describing (uniform `k1-outcome-v1` manifests, SHA256-stamped objects, `interpreted_fields:false`), so nothing in the data is bound to its project. The single enforceable rule that keeps it cut-and-paste is that the acquisition writer and the engine reader reference the bucket by its global name `gs://hauska-calibration-raw` only, never project-qualified, and never hard-code `legacy-design-tools-prod` or the SmartCity SA into ingest/write config; GCS bucket names are global, so a project move is then invisible to the reader and the boundary becomes a config flip. Migration at unpack is one `gcloud storage cp -r` (server-side, no local egress, no transform) plus an IAM repoint. Deferring to unpack avoids re-pulling 2.85M rows for no functional gain while the data is correct and usable where it sits.

## Reversal criteria

Revisit if: a dedicated Hauska substrate project distinct from `hauska-prod-497015` is stood up for raw acquisition landing (then that project is the target, not the engine prod project); or if the engine ingest must read the bucket before unpack and a cross-project grant proves operationally fragile (then migrate early); or if any acquisition path is found to depend on the SmartCity SA's permissions specifically (then the no-special-access posture is at risk and must be re-audited before relocation).

## Dependencies

Depends on: the legacy monorepo unpack (the migration trigger). Depended on by: K2 retrodiction harness and the warming run (both read this bucket and must reference it by global name); the engine ingest config; any acquisition follow-up wave (Wave 4 writes to the same bucket by global name in the interim).

## Counterparties

Internal only. Affected: acquisition agent (writer identity and bucket-name discipline), cc-agent-E (engine ingest reader), cc-agent-C (K2 + warming readers), Nick (owns the eventual project-move and the dedicated acquisition SA creation).
