# R-06 slice scratch

## OPEN — R-06 three-control slice (2026-08-21)

Building check-only, tooling-register-schema, factory-termination. Seat integration, P:/doc_repo main e022436. Do not commit.

## GROUND-TRUTH — JSON shape (2026-08-21T14:40Z)

tooling_register.json controls[] keys: id, scope, name, location, statement, consumer, trigger, failure, bypass, violationVerified, derivationClass, status. No executor field. 46 rows, 0 missing the four keys. DUPLICATE-ID-GAP uses string None.

parts_inventory.json: 4 factories, all have real terminationCondition. Store NONE includes hauska_mcp.atoms. Detector must ignore stores.

## GROUND-TRUTH — three controls proven (2026-08-21T14:50Z)

Seat integration, P:/doc_repo main e022436. No commit.

canon-divergence --check-only: live exit 0, 0 divergent, 8 rows. sha256 f7e24c1d9b034c3b8bb1a206d16a7b851f4c0bf1c5ff8df485fd3beddd5c07d2 + mtimeMs 1787320563397.8064 identical. --self-test failExit 1 passExit 0. --out _catalog refused. Inbox sample checks: _catalog/repo_intents_checks.json. Wrapper exit 0. Stays REPORTING.

tooling-register-schema: live exit 0, 46 rows. Inject missing consumer exit 1. Restore exit 0. Real key is consumer not executor.

factory-termination: live exit 0, 4 factories, 0 NONE. Inject factory NONE exit 1, hauska_mcp.atoms store ignored. Restore exit 0.

No baselineExit raised. New rows at 0. canon-divergence retargeted to wrapper, still 0 REPORTING.

## LESSON — ci-baseline has no argv

ci-baseline.mjs spawnSync(node, [scriptPath]) with no extra args. Flags require a wrapper. Do not "fix" ci-baseline to pass args as part of this slice; wrappers are the named path.

## LESSON — PowerShell UTF-8 BOM is not JSON

Set-Content -Encoding utf8 wrote a BOM; JSON.parse failed with Unexpected token. Fixture injects must use node writeFileSync. The control was not the defect.
