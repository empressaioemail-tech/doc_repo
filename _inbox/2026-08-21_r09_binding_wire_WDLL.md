---
id: 2026-08-21_r09_binding_wire_WDLL
title: R-09 remainder — trust RAIL_ENGINE_BINDINGS on the serving surface
status: active
date: 2026-08-21
plan_row: R-09
owner: property
related:
  - 90_operations/OPS-18a_path_to_smartsite_market
  - _decisions/2026-08-21_dc4_dc5_unmeasured_stays_distinct
  - _decisions/2026-08-21_r09_holds_the_property_seat
---

# R-09 binding wire WDLL

Done looks like: live GET on serving cortex-api has zero `derivation-indeterminate` cells because capability is derived from the committed binding table and the committed engine type snapshot, not from whether `hauska-engine` is a sibling directory on Cloud Run.

This is not per-county atom existence. `hasWriter` stays a capability flag. Do not query `atoms` to set it. Do not mint absence. Do not fold `derivation-indeterminate` into DC-4 or DC-5.

## Acceptance

1. `deriveAtomFamilyPresent`: when `ENGINE_PROPERTY_TYPES_SNAPSHOT` is non-null, a missing engine root is not `indeterminate`. Family presence is the snapshot. Prove by calling with `engineRoot` a path that does not exist and `requireEngineRoot: true`; easement (`utility-easement` is in the snapshot) returns `true`.
2. `deriveHasWriter`: a rail whose binding declares `engineWriterScript` or `ldtScorerPath` returns `true` when the family is present, even if that script is not on this host. CI `railEngineBindingCoverage.test.ts` remains the file-existence proof. Prove with Cloud Run-shaped probe (`cloudRunManifestReadProbeOptions` or equivalent absent root): easement `hasWriter` is `true`, not `indeterminate` or `false`.
3. A rail with no declared writer and no `noWriterReason` still fails closed. A binding that only has `noWriterReason` still returns `hasWriter` false. Prove with a fixture binding, not by inventing a live rail.
4. `manifestReadProbeOptions` used by GET overlay no longer produces an indeterminate rail set for the fourteen committed bindings. Overlay `derivation-indeterminate` count on a Cloud Run-shaped unit fixture is 0.
5. Existing tests that encoded the opposite (SF-20/SF-21: missing engine tree ⇒ not true) are rewritten to the new contract: missing tree + declared binding ⇒ true; missing tree + no declared writer ⇒ not true. Do not delete the coverage test that checks scripts exist in a real engine checkout.
6. `mergeHasWriter` AND and `mergeAtomFamilyState` stricter-wins stay. After this code is serving, a non-dry recompute with `probe=skip` is required so stored `county_rail` matches derivation. GET without that recompute would keep stored `false`/`partial` from the previous compute. Recompute is a named acceptance item, not a silent follow-up.
7. Live GET after deploy+recompute: `displayState === "derivation-indeterminate"` count is 0. Named cells `48001:easement`, `48001:geometry` are measured (hasWriter boolean true or false, atomFamilyState present or missing, not partial-from-indeterminate). DC-4 and DC-5 still count only `no-atom` and `no-writer`.
8. Worktree `P:/seat-worktrees/property/legacy-design-tools` on `seat/property`. Do not touch `P:/legacy-design-tools`. No absence minting. No `--apply`. No DC-4/DC-5 string change.

## Out of scope

Per-county store probes. Shipping hauska-engine into the cortex-api image. Dashboards. R-08 data remediation. Raising any doc_repo `baselineExit`.
