---
id: 2026-06-17_cc-agent-C_central_tx_deepen_resume_full_corridor
title: cc-agent-C — resume the Central TX deepen (full corridor) + commit the safe-deepen tooling
date: 2026-06-17
agent: cc-agent-C
repo: legacy-design-tools
branch: feat/codewarm-wedge-cities-neon
kind: dispatch
related: [61a_central_tx_coverage_program, 2026-06-17_cc-agent-C_central_tx_coverage_warm_and_onboard]
supersedes_status_of: _inbox/2026-06-17_legacy-design-tools_cc-agent-C_central_tx_deepen_close.md (that close is stale — see below)
---

# cc-agent-C — resume the Central TX deepen (full corridor)

> **STATUS 2026-06-17: PR #190 MERGED to main.** The safe-deepen guard + repair + tooling is in. The batch gate is satisfied. **Resume cleared** — run `./scripts/deepen-central-tx-batch.ps1 -AllowBatch -StartAt san_antonio_tx -BudgetCap 200`. Steps 1 (commit/PR) is done; do steps 2-4 below (resume SA, full corridor, harden the loop).

Operator decision (2026-06-17): **run the full Tier-A corridor deepen now.** The no-downgrade verified high-water-mark guard makes a later ICC/UMC-UPC re-deepen safe, so a wide pass at the current ceiling is accepted spend.

Governing program: [`61a`](../61a_central_tx_coverage_program.md). Cost rule unchanged: each jurisdiction under $200 compute + 1 hr review (commitment #3).

## Live state I verified (your prior close is stale)

Your `central_tx_deepen_close` reads as if San Antonio is in flight and the no-downgrade fix is "Queued." Neither matches the branch:

- The safe-deepen guard **is already in** `lib/codewarm/src/batchRunner.ts` (verified-skip high-water-mark at the two `existing?.verificationState === "verified"` branches; `verifyBeforePromote` passed to the upsert; `unverified-skipped` path). It is correct. It is **uncommitted**.
- Austin was re-run **with** the guard (`scripts/_deepen-austin_tx-no-downgrade-20260617-181608.log`, last write 18:20). That run, not the 17:26 unsafe one, is the real Austin result — report it.
- The San Antonio run **stalled at the before-snapshot ~18:03** and **no deepen process is alive** (checked 18:27). The corridor batch (`_deepen-central-tx-batch-*`) never got past 158-byte stubs. The run is dead, not in flight.

## Do, in order

1. **Commit first, then run.** Commit the deepen tooling (`scripts/centralTxAdoption.mjs`, `deepen-central-tx-jurisdiction.mjs`, `deepen-central-tx-batch.ps1`, `report-verified-rates.mjs`), the `batchRunner.ts` safe-deepen guard, the `targets.ts` ICC-before-UpCodes change, and the `extract.ts` UMC/UPC heading pattern on `feat/codewarm-wedge-cities-neon`. Open the PR. Do not leave the guard uncommitted while you spend budget against it.
2. **Resume San Antonio** — it stopped at the before-snapshot. Re-run the adoption-aware deepen (replaces the 13 wrong-edition residue atoms). Confirm it completes (after-snapshot written, exit 0).
3. **Run the full corridor batch** via `deepen-central-tx-batch.ps1` from `round_rock_tx`, `$200`/jurisdiction cap: Round Rock, Georgetown, Hutto, Leander, New Braunfels, Dripping Springs, Killeen, Schertz, Boerne (and the 2021-package tail). These start at 0% verified so nothing clobbers; the guard protects any that already hold verified atoms.
4. **Harden against the stall.** The SA/corridor death looks like the UpCodes/ICC fetch hang (cc-agent-E hit the same >3 min hang) or the `spawnSync`/`Tee-Object` stdout stall you fixed for the single-jurisdiction path but may not have carried into the batch path. Put a per-fetch timeout + per-jurisdiction continue-on-error in the batch orchestrator so one hung city does not kill the whole corridor run silently. Log each jurisdiction's before/after + cost as it finishes, not only at the end.

## Known ceiling — do not treat as failure

The corridor will top out near Austin's ~33% verified. The two big unverified buckets are **not** yours to close on this pass: ICC-gated IFC/IPMC (waits on the operator wiring `ICC_CODE_CONNECT_*` into `legacy-design-tools-prod` GCP) and UMC/UPC chapter pages (the dedicated chapter-page driver, still queued). Ship the honest rate; the re-deepen after those land is safe and cheap because of the high-water-mark guard.

## Report back

`P:/doc_repo/_inbox/2026-06-17_legacy-design-tools_cc-agent-C_central_tx_deepen_corridor_close.md` — the commit SHA + PR link; the real (no-downgrade) Austin after-rate; San Antonio before/after; the per-corridor-city before/after + cost table; total spend against the $200/city cap; and whether the batch ran clean or any city hung. Accurate this time — do not carry forward the stale "Queued" line.
