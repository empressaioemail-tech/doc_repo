---
decision_id: 2026-08-28_cortex_daily_limit_50000
date: 2026-08-28
owner: operator
status: active
related_canonical:
  - 90_operations/T4_cross_service_limiter_posture.md
  - 90_operations/OPS-9_scale_ops_specs_pack.md
  - _scratch/smartsite-ai-connector.md
---

## Decision

Bake `CORTEX_USER_DAILY_API_LIMIT=50000` in the cortex-api Cloud Run workflow. The next deploy must carry 50000. A manual `services update` is a stopgap only.

## Context

`--set-env-vars` is authoritative-replace. The workflow baked 10000, so every canary deleted a manual 50000 and put the operator over the daily cap, locked out of the product, twice on 2026-08-28. Traffic on cortex-api is pinned, not latest-following. A deploy does not move serving and neither does a `services update`. Serving at the time of this record is `cortex-api-00389-phv` at 100 percent, digest `sha256:b29beb70c2ec59c5053b8389a172f97eff967527891fd5fb4e8ffcf16e75c5ca`, env 50000, read from `status.traffic[]` and the named revision.

Alternatives: leave 10000 in the bake and keep bumping the serving revision by hand (rejected: the next deploy deletes it). Raise only the serving revision (rejected: same). Pull the limit out of `--set-env-vars` into a Cloud Run secret (deferred: larger change than the lockout).

## Structural commitment check

Sell reasoning, not data: the operator must be able to use the product.
Confidence is earned: serving is read from traffic, not latest.
Cost per jurisdiction: no ingest change.
Dual interface: no MCP change. MCP Free-tier 10000 stays the public-agent ceiling.

## Reasoning

The defect is the bake, not the serving revision. A control that writes 10000 on every deploy will always beat a human 50000. Raising the baked number is the only fix that survives the next canary. A CI grep fails if 10000 returns or 50000 is missing.

## Reversal criteria

Revisit if a measured abuse event on authenticated cortex-api traffic requires a lower cap, or if the limit moves to a secret or per-tier store that the workflow no longer replaces. Do not revert to 10000 because T4 once said 10000.

## Dependencies

LDT `.github/workflows/cloud-run-deploy.yml` deploy-canary job. `ci-cortex-daily-limit-50000` in `pr-checks.yml`. Next cortex-api canary or shift must re-read serving and confirm the limit came with it.

## Counterparties

Internal. Operator is the locked-out user.
