You MAY spawn one sub-agent for registry vs engine split. Sub-agents MUST NOT commit. Lane planner merges, runs tests, applies bounded county set.

Plan row **P-59** (OPS-16 A-023, A-025). WDLL: `_inbox/2026-08-23_p59_scorer_specs_WDLL.md` items 1–7.

## Occupancy

- Code: `P:/seat-worktrees/property/legacy-design-tools` branch `seat/property` (or feature branch off main)
- Close artifacts: `P:/doc_repo/_inbox/` only (planner commits doc_repo)

## Mission

Replace the six `kind: "unspecified"` rails in `artifacts/api-server/src/lib/railScoring/registry.ts` with checked-in measurement specs. `mud` stays unspecified.

### Registry targets

| rail | kind | entityType / probe | notes |
| --- | --- | --- | --- |
| roads | atom-count-over-parcel-features | road-node | standard parcel-feature denominator |
| footprint | atom-count-over-parcel-features | building-footprint | numeratorMode `distinct-parcel-keys` (never >100%) |
| easement | atom-count-over-parcel-features | utility-easement | notes on county-coverage-absence shape |
| rrc-wells | atom-count-over-parcel-features | well-fact | absenceProbe reach `enumerated-counties: ["48201"]` table `rrc_wells` |
| rrc-pipelines | atom-count-over-parcel-features | rrc-pipeline-fact | standard |
| rail-corridor | atom-count-over-parcel-features | rail-corridor-fact | absenceProbe statewide on national source if table exists |

### Verdict semantics (WDLL item 3)

- Extend `RailCellMeasurement` with optional `applicabilityVerdict: "not-applicable"`.
- `scoreRailCell`: when set, write `railState: satisfied-absent`, `absenceBasis: layer-not-applicable`, do NOT classify as `true-source-gap` or below-threshold `not-yet` gap.
- Tests in `engine.test.ts` both directions (violation: 0% not-yet without verdict; pass: satisfied-absent with verdict).

### Footprint numerator (WDLL item 5)

Add `numeratorMode` to `AtomCountRule`: `atom-count` (default) | `distinct-parcel-keys`. Implement in `measure.ts` via SQL on entity_id prefix before family suffix.

### Apply scope (WDLL item 6–7)

Bounded apply only: Bastrop `48021` for `rrc-pipelines` and `rail-corridor`:

```bash
cd artifacts/api-server
npx tsx src/countyRailScoreCli.ts --rail=rrc-pipelines --county=48021 --apply
npx tsx src/countyRailScoreCli.ts --rail=rail-corridor --county=48021 --apply
```

Then verify CC manifest or SQL on `county_facet_coverage`.

### Required reads

- `registry.ts`, `measure.ts`, `engine.ts`, `registry.test.ts`, `engine.test.ts`
- `lib/db/src/schema/railEngineBinding.ts` for entity types
- P-63 interim table `_inbox/2026-08-23_p63_interim_applicability_table.json` (zoning only today)

## Out of scope

- `mud` rail spec reconstruction
- Statewide apply
- Map layers (P-60)
- Deploy (planner-owned after review)
- atom-contract / MCP writes

## Return

CP1: `_inbox/2026-08-23_p59-scorer-specs_cp1.json` — spec table + falsifiers per rail
CP2: `_inbox/2026-08-23_p59-scorer-specs_cp2.json` — tests green + dry-run output
CLOSE: `_inbox/2026-08-23_p59-scorer-specs_close.json` — WDLL grades 1–7 with evidence

leave_behind: P-60 map layers (if any rail still blocked)
