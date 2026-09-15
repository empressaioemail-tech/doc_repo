# SmartCity Overview lens

**Artifact:** https://claude.ai/code/artifact/3cf94cc7-4aa5-4846-9a60-bc51a1275180
**Decision:** `_decisions/2026-09-14_overview_lens_design_direction.md`
**Plan rows:** OPS-17 G-120 (implementation, dispatched 2026-09-14), G-121 (map, PINNED)
**Status:** ratified by operator 2026-09-14, dispatched to the govtech seat.

Three artboards: populated Bastrop, a sparse newly-onboarded city, an empty pack.

## The moves

- Tiles are filtered entry points naming the lens and filter they open, not metrics.
- "Across departments" covers six lenses, not v1's four workspaces.
- **Connections promotes to the top on a pack that reads nothing and demotes when it reads.**
- Right rail keeps the map and address lookup (operator explicit).
- The `Sources` atom-type panel is replaced by "On the map" — located records, clickable.

## Pinned, deliberately not designed here

The Overview map component itself (G-121). It renders broken on the live `bastrop_tx` page,
collapsing to a narrow sliver with clipped control text. Sequenced after Development services.

## Regenerate

    node gen.mjs        # rewrites Main/Sparse/Empty .dc.html + canvas.json
