# Mission: is the v3 Smart Site panel still correct against `cortex-api-00672-ceq`?

## The situation, and why this is not a formality

The P-91 v3 MCP wave (cuts p560 through p563) was built, graded and deployed against cortex serving `cortex-api-00668-cos` and `00670-bay`, which share image digest `41f998d5`. Those cuts are now serving as `smartsite-mcp-00078-fat` (digest `sha256:ecc72a40`, tag p563), and the operator's seven-test live walk passed on 2026-08-31.

Cortex then moved underneath that wave. `cortex-api-00672-ceq` was created 2026-08-31T02:52:52Z on a NEW digest and is serving 100 percent. It is LDT PR #560, the F-11 road-class setback refuse, merged `8f11e81b` by another seat AFTER the P-91 wave closed. Nobody on the P-91 thread verified anything against it.

This is not a generic "re-run the tests" ask. F-11 touched three files that the Smart Site MCP demonstrably consumes:

    artifacts/api-server/src/lib/setbackProvenanceDisposition.ts
    artifacts/api-server/src/lib/boundaryEdgeFactRead.ts
    artifacts/api-server/src/__tests__/brokerageNodeFacets.test.ts

The node facets route is the route the MCP reads for the per-parcel anchor and for panel content. `boundaryEdgeFactRead` feeds `draw.edges[]`, which the panel paints as named edges with roles. And `setbackProvenanceDisposition` changes setbacks from a served VALUE to a REFUSED state carrying a new `basis` string matching `retired road-class derivation`.

## The specific defect to hunt, stated first because it is the whole point

p563 shipped a 19-entry vocabulary table that maps machine tokens to exact display strings, published as an MCP resource and attached to every tool result. It exists because a live session printed the raw token `atom_path_pending` into user-facing prose, which was a missing field rather than a model failure.

**If F-11 introduced a refusal code, decline reason, or provenance/basis string that the p563 vocabulary table does not map, that value leaks raw to the user, and it is the exact defect class the whole V programme was built to close.** The table currently maps these refusal-side tokens and no others: `upgrade_required`, `parcel_not_found`, `baked_snapshot_not_found`, `parcel_batch_cap`, `open_did_not_reach_me`, `depth_not_implemented`, `declined-in-bake`, `not-in-bake`, `atom_path_pending`, `citationsDegraded`, `gis-approximate`, `seed`, `side_corner`, plus the six disposition words.

A new road-class refusal shape is precisely the kind of thing that is absent from that list. Find out.

## What to determine

1. **What actually changed on the wire.** Diff `41f998d5` against the digest `00672-ceq` runs, scoped to what the node facets route emits. Read the write path, do not infer from output. Name every field whose shape, presence, or value vocabulary changed.

2. **Which of those fields the MCP reads.** In `artifacts/smartsite-mcp/`, the consumers are the cortex client, the tool-honesty normalization seam, and the served panel. A changed field the MCP never reads is a non-finding and should be reported as such rather than padded into the result.

3. **Every token the panel or the model could now receive that the p563 vocabulary does not map.** This is the primary deliverable. For each: the token, where it originates, what a user would see today, and whether it reaches user-facing text or stays internal.

4. **Setbacks and the buildable envelope specifically.** Ledger function 6 is "Can I build X", whose today-state was recorded as an honest refuse. If F-11 flipped some parcels from a served setback value to a refusal, the panel's function-6 behaviour changed without anyone deciding it should. Say whether it is still honest, and whether the refusal reads as a decline or as an absence.

5. **`draw.edges[]` and edge roles.** `boundaryEdgeFactRead` changed. The panel paints named edges and the vocabulary maps `side_corner`. Confirm the role vocabulary did not gain a value, and that the reciprocal-edge behaviour did not change.

## Method

Probe live against `cortex-api-00672-ceq` and read code. When a probe and the code disagree, that disagreement IS the finding; report both readings rather than picking one.

The anonymous route is `GET /api/brokerage/v1/place/node/:parcelNodeId/facets`. It is the only anonymous route in the place surface; every other route there is gated. Fixture parcels with known shapes: `48021:34137`, `48021:34169` and `48021:34161` are a contiguous block; `48021:82112` is the sparsest record, no ring and no year built; `48021:31254` and `48021:31272` are the Higgins block.

Compare against the two shipped instruments rather than against memory: the p563 vocabulary table in `artifacts/smartsite-mcp/src/vocabulary.ts`, and the 452-test suite in that package.

## Boundaries

`artifacts/api-server/` is READ-ONLY for this lane. The property seat owns it and holds live worktrees there. If the correct fix is in api-server, name it and hand it back; do not edit it.

Any MCP-side change (for example a vocabulary entry for a newly discovered token) is produced as a diff and handed back. The planner commits, merges and deploys. Do not commit and do not push.

## Fail closed

If you cannot establish whether a token reaches user-facing text, report it as UNDETERMINED and say what instrument would settle it. Do not report a token as safe because you did not see it leak; absence of an observed leak is not evidence of mapping.

Distinguish absent, zero and unmeasured throughout, and state your snapshot (repo, branch, commit, and the cortex revision each probe hit) in the output.

## Deliverable

A findings document naming, at minimum: every changed wire field, every unmapped token with its user-visible consequence, a verdict on function 6, a verdict on edge roles, and an explicit statement of what you did NOT measure.

Lead with the single decision-relevant sentence: whether the v3 panel is still correct against `00672-ceq`, or what specifically is now wrong.
