# _scratch — the fleet's Tier-2 working memory

Per-workstream scratchpad files. Cheap, lossy, disposable working memory the fleet captures build knowledge into so it does not die at context roll. This is Tier 2 of the fleet-memory practice (M0). Full practice: `../90_runbooks/fleet_memory_practice.md`. Rule: `../.cursor/rules/fleet-memory.mdc`.

One file per active workstream: `<workstream-slug>.md`. Four entry kinds — LESSON, DEAD-END, GROUND-TRUTH (always timestamped), OPEN.

These files are NOT durable memory. Being wrong here is fine. Verified lessons promote to Tier 1 (a test, or a MEMORY.md / doc entry) only through planner review — never self-promoted. When a workstream closes, its promotable lessons are lifted to durable form and the scratch file can be retired (status flip, not delete, per repo convention) or archived.

Active files:
- `depth-engine-27c.md` — the road-node depth engine build (R0-R4 under the 27 master).
