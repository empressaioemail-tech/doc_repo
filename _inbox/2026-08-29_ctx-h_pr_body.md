## Summary
- Wire the old bake's owner-gated situs recovery into the conformant tier 1 bake for gate-blocked counties (Hays 48209, Williamson 48491).
- Do not lift LANDUSE_JOIN_DISABLED_FIPS_SEED. A prop_id join on those FIPS still returns null.
- Recovered land-use carries source cad-roll-address-join. A situs-keyed txgio row may write ring, centroid, and zoning after the owner gate accepts. parcelJoin.state is joined-situs.
- OPS-19 A-026 / CTX card H. Planner review. Subagent did not commit.

## Test plan
- [x] vitest nodeFacetBakeTier1Conformant.test.ts + joinNormalize.test.ts (56 passed, planner re-run)
- [ ] CI check-run conclusion SUCCESS before merge
