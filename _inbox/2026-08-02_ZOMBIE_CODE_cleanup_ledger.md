---
id: 2026-08-02_ZOMBIE_CODE_cleanup_ledger
title: ZOMBIE CODE cleanup ledger — dead/divergent/duplicate artifacts to retire (deliberately, not now)
date: 2026-08-02
status: cleanup ledger (tracked now while known; cleanup deferred to a deliberate pass — do NOT clean mid-Phase-C)
owner: nick
related: [2026-08-02_operate_the_factory_never_rebuild_it, PHASE_C_CORRECTED_operate_block13_path, cc-deploy-cmdcenter-blush-not-command-center-jade]
purpose: Track the zombie/divergent/duplicate code left by this session so it is cleaned DELIBERATELY (not forgotten, not reconstructed later). Un-tracked zombie code IS the ambiguity that bites a future agent — the exact failure class the operate-not-rebuild correction addresses. Each item: what, why-dead, retire-or-keep, and the GATE (do not remove until the gate clears).
---

# ZOMBIE CODE cleanup ledger

Left by the 2026-08-01/02 arc. Do NOT clean mid-Phase-C — retiring engine scripts while the corrected fleet is running the warm would collide. Clean in a DELIBERATE pass once Phase C's corrected path lands. Each item names the GATE that must clear first.

## A. DIVERGENT FLEET WRAPPERS (from the operate-not-rebuild failure — the main zombies)
| Artifact | Repo/path | Why it's a zombie | Action | GATE (don't remove until) |
|---|---|---|---|---|
| `bastrop-district-cert-grade.mjs` (14,345 B) | hauska-engine/packages/engine-core/scripts | The NEW cert harness the fleet built instead of extending the proven `block13-cert-grade.mjs`. Superseded by the generalized block13-cert-grade (roster param) per the corrected dispatch. | **RETIRED-STUB** (2026-08-03): stub exits 2 → removable in cleanup pass; nothing references it. | Generalized block13-cert-grade merged to main + Block-13 7/7 regression on main. |
| `bastrop-layer23-roster.mjs` | hauska-engine/packages/engine-core/scripts | ~~The divergent COHORT/roster wrapper~~ **UN-ZOMBIED Phase D (2026-08-03):** now the registry-keyed layer-23 cohort source via `registry-cohort-loader.mjs`. Delegates to `BASTROP_REGISTRY_ROW.railPerParcel`. | **KEEP** — remove from retire list. | Phase D rewire merged; cohort reads registry row. |
| `--layer23-city-cohort` / `BASTROP_CITY_BBOX` usage in depth-warm-bastrop-batch.mjs | hauska-engine/packages/engine-core/scripts | The bbox cohort (17,217 rows) that over-broadened the city warm vs the layer-23 CITY roster (~6,972). | REPLACE the flag path with dominant-district cohort; remove the bbox cohort branch. | Corrected cohort lands. |

## B. SUPERSEDED CERT SCRIPT (Phase A residue)
| Artifact | Repo/path | Why | Action | GATE |
|---|---|---|---|---|
| `block13-r31-regrade.mjs` (if still on main) | hauska-engine/packages/engine-core/scripts | The PRE-cert-restore partial R31 orientation re-grade harness. Superseded by the full 4-gate `block13-cert-grade.mjs` (merged Phase A #203). | RETIRE (confirm block13-cert-grade fully covers it). | Confirm no reference to r31-regrade remains. |

## C. PARALLEL VERCEL PROJECT (deploy zombie)
| Artifact | Where | Why | Action | GATE |
|---|---|---|---|---|
| Vercel project `command-center` → command-center-jade-sigma.vercel.app | Vercel (empressaioemail-techs-projects) | The PARALLEL/older CC project I deployed the County Ledger panel to BY MISTAKE. The LIVE console is `cmdcenter`/cmdcenter-blush. Two projects building the same app = confusion + the wrong-deploy trap ([[cc-deploy-cmdcenter-blush-not-command-center-jade]]). | DECIDE: delete the `command-center` project (if truly unused) OR document it as explicitly-not-the-live-one. Operator call. | Confirm nothing/nobody depends on jade; then delete or clearly label. |

## D. PROBE / DIAGNOSTIC SCRIPTS ("can drop or keep" — low priority)
| Artifact | Path | Note |
|---|---|---|
| `probe-s2f-labels.mjs`, DB/city diagnostic probes the fleet mentioned | hauska-engine scripts + local (some may be local-only, not on main) | One-off diagnostics. KEEP if reusable for onboarding diagnosis; DROP if single-use. Harmless but clutter. Low priority. |
| `substrate-db-probe.ts`, `spine-health/probes.ts` | retrieval-api | These are LIVE health infra (NOT zombies) — the spine-health probes. Do NOT remove. Listed only to disambiguate from the one-off diagnostics. |

## E. ORPHANED BRANCHES (audit trail, not dangerous)
| Branches | Where | Note |
|---|---|---|
| `feat/phase-a-foundation`, `-v2`, `-v3` (the dup-build engine agent's branches); `chore/block13-cert-grade-script` (merged as #203, branch may linger) | hauska-engine | From the premature-orphan dup-build ([[premature-background-notification-not-orphan]]). Closed PRs #207/#208. Delete the merged/superseded branches in the cleanup pass (audit trail only; not dangerous). |
| Any `chore/install-fleet-memory` branches not auto-deleted | all 5 product repos | Merged in Phase A1; delete if not auto-deleted. |

## WHAT TO KEEP (explicitly NOT zombies — do not remove)
- R33's `cert-equivalent-gates.ts` + the shared measurement — a REAL recipe improvement.
- `honest-decline-promote.ts` — real (the honest-decline promote path; #210). Keep.
- The county-ledger endpoint + CC County Ledger panel — Phase B, live.
- `block13-cert-grade.mjs` — THE proven cert harness (to be generalized, kept as the 7-parcel regression).
- The ledger-write-path / upsert-county-facet-ledger — real, works.
- fleet-memory `.cursor/rules` in all 5 repos — the capture-freeze organ.

## THE CLEANUP PASS (when)
Trigger: after the corrected Phase C run lands (block13-cert-grade generalized, dominant-district cohort, wrappers superseded). Then ONE deliberate cleanup PR per repo: retire A + B, decide C with the operator, prune D/E. Verify nothing references the retired artifacts (grep) before removal — a zombie that's still imported somewhere is not dead yet. Update this ledger to CLEANED as items go.
