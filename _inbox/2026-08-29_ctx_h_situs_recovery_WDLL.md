---
id: 2026-08-29_ctx_h_situs_recovery_WDLL
title: WDLL — CTX card H: conformant bake recovers Hays and Williamson on owner-gated situs, never on prop_id
date: 2026-08-29
last_updated: 2026-08-29
status: approved
applies_to: legacy-design-tools (nodeFacetBakeTier1Conformant.ts, nodeFacetBakeTier1ConformantCli.ts, joinNormalize.ts read-only, joinIntegrityGate ownersAgree / resolveAddressLandUse reuse)
plan_row: F-05, F-06, F-08
depends_on: _decisions/2026-08-29_ctx_open_situs_join_not_prop_id.md, old bake nodeFacetBakeTier1Cli.ts address recovery, card F assemble
operator_go: 2026-08-29
snapshot: LDT origin/main after card F (ee27845e family); conformant CLI joins txgio_parcel by prop_id; gate-blocked counties drop the offered row; landUseAddressRecovered is hardcoded false
owner: planner-run subagent in P:/seat-worktrees/property/legacy-design-tools-ctx-join on fix/ctx-h-situs-recovery from origin/main. Produces the diff, tests, and CP1 measurements. Does not commit, push, deploy, or execute a bake.
---

# CTX card H: the recovery the old bake already has, on the conformant write path

Date: 2026-08-29  Status: approved

## Done looks like

The conformant tier 1 bake still refuses a `prop_id` join for 48209 and 48491. For those two FIPS it runs the same owner-gated situs recovery the old bake runs (`addressJoinKey` plus `resolveAddressLandUse` / `ownersAgree`). A recovered land-use carries `source: cad-roll-address-join`. A recovered `txgio_parcel` row (keyed by normalized situs, not `prop_id`) may supply ring, centroid, and zoning stamp. `provenance.parcelJoin.state` is `joined-situs` on recovery, `gate-blocked` when recovery fails, `joined` on a legal `prop_id` join, `no-row` when the legal join finds nothing. Owner never enters a payload.

## Acceptance items

1. **Measure the two golds and the seed.** Read-only, statement timeout set, no secret printed. From production atoms (`hauska_mcp`, direct host) the stored claim situs for 48209:135570 and 48491:76149. From the old bake code, confirm `LANDUSE_JOIN_DISABLED_FIPS_SEED` is still `{48209, 48491}` and that `addressJoinKey` is inverted (fires only for blocked FIPS). File the two situs strings and the seed contents in CP1. | check: CP1 | grade: [ ]

2. **Seed does not lift.** `LANDUSE_JOIN_DISABLED_FIPS_SEED` still contains 48209 and 48491. `landUseJoinKey("48209", any)` and `landUseJoinKey("48491", any)` still return null. Existing joinNormalize tests still pass. A new conformant fixture that offers a `txgio_parcel` row on `prop_id` for a blocked county is still unused. | check: the existing seed tests plus the conformant gate-blocked fixture | grade: [ ]

3. **Land-use recovery.** For a blocked county, when situs normalizes to a CAD row and `ownersAgree` is true, `baseFacts.landUse` is populated with `source: cad-roll-address-join` and `landUseAddressRecovered` is true. When owners disagree or an owner is blank, land-use is null. When situs is blank, land-use is null. Fixtures fail on origin/main and pass on the branch. Reuse `resolveAddressLandUse`; do not fork a second owner gate. | check: three fixtures (agree / disagree / blank) | grade: [ ]

4. **Situs-keyed geometry and stamp.** For a blocked county the CLI may fetch `txgio_parcel` by normalized situs (same key as `normalizeSitusAddress`) and pass that row into `buildConformantTier1Payload` only after the owner gate accepts. A recovered row may write ring, centroid (never the 0,0 sentinel over a real prior point), and zoning stamp. A `prop_id`-keyed row for a blocked county is still ignored. `parcelJoin.state` is `joined-situs` with a basis that names situs, not `prop_id`. | check: fixture with a situs-matched row and a prop_id-matched row on the same blocked parcel; only the situs row is used | grade: [ ]

5. **Non-blocked counties unchanged.** Bastrop / Travis / Caldwell / McLennan still join on `prop_id`. `addressJoinKey` returns null for them. Existing conformant joined / no-row fixtures still pass. | check: those fixtures | grade: [ ]

6. **Owner never on the wire.** `assertNoOwnerKey` still runs before every write. A fixture that would copy an owner field fails. | check: existing assert plus one recovery-path case | grade: [ ]

7. **Handback.** Diff summary; `pnpm typecheck` in api-server; vitest for the files touched; CP1; the exact `_LDT_SHA` pin the planner will write after merge; `leave_behind` (Travis no-row sentinels, P-80, remaining 0,0 rows that are not Hays/Williamson recovery). No commit, push, deploy, or bake. | check: handback | grade: [ ]

## Do not

- Lift the seed or join 48209 / 48491 on `prop_id`.
- Commit, push, open a PR, deploy, or execute `factory-bastrop-publish`. The planner does those.
- Write to any store. Reads are SELECT with a statement timeout. Never a pooler. Atoms store is `hauska_mcp`.
- Print a DATABASE_URL, secret, or token.
- Invent a Travis `geo_id` join.
- Change tier 2 or the flood disposition.
- Touch smartcity-os.
