## Mission — P-180 HAYS CELLS THROUGH THE CROSSWALK: the Property Explorer's record path stops serving the chimera

You are the deepest worker in OPS-23 wave 5. You do not spawn sub-agents. The dispatch
planner supervises you, reviews CP1 and CP2, and runs `scripts/surface-probe.mjs --rows P-175`
itself after your publish.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### The law you execute

OPS-21 identity law, two-namespace paragraph (2026-09-13): never join a cell, a label or a
dollar to `cad_property` by the bare number in a gate-blocked county; the account is reached
through `txgio_parcel.geo_id` = `cad_property.property_number`, corroborated by the
`quick_ref_id` stem. P-177 applied it to the tier-1 bake (LDT #670,
`accountCrosswalkForNode` in `joinNormalize.ts`); this row applies it to the engine store.

### Where you work

`hauska-engine-p180-hays-cells` (branch `fix/p180-hays-cells-crosswalk`) and, if the writer
job lives there, `hauska-factory-p180-hays-cells` (branch `fix/p180-hays-cells-crosswalk`);
plus `legacy-design-tools-p180-hays-cells` (branch `fix/p180-structural-fact-crosswalk`). All
from `origin/main`; declare start commits.

### What is true today (P-177 close, `_inbox/2026-09-13_p177-hays-attributes_close.json`, leave_behind)

- The Property Explorer facets route (`/api/spine/property-atoms/<id>/facets`,
  `X-Pe-Read-Path: record`) reads the retrieval-api reader over `parcel_record` in the engine
  store. For 48209 those rows were filled by a writer that joined account attributes by bare
  prop_id, so the five Sturgeon nodes serve another account's situs and values there while the
  MCP snapshot (P-177) is right. `node scripts/surface-probe.mjs --rows P-175` reads FAIL 0/5
  on that route (`_inbox/2026-09-13_183517_surface_probe.json`).
- LDT #671 holds Hays back from six PARCEL-B-SLATE2 record-overlay rails so the chimera is not
  served as record; that hold is lifted only when the cells are right.
- The obvious re-run path, `write-cad-parcel-roll-county.mjs --apply`, is frozen
  (`OLD_SHAPE_FILL_FROZEN`) for every county but one; the CURRENT writer for `cad-parcel-roll`
  cells is a Cloud Run job (P-169 moved loaders to jobs; `factory-atoms-cad` and
  `hauska-engine-atoms-writer` exist in hauska-prod-497015/us-east4). Locate it by reading the
  job list and the code, never by assuming.
- `structuralFactRead.ts` / `cadPropertyLookup.ts` (LDT api-server, the Inspect surface's
  living area and year built) join `cad_property` by bare prop_id with no gate-blocked-county
  awareness: a third instance of the class.
- The retirement marker P-177 wrote for the hollow account-keyed nodes (`48209:84639` and
  siblings) is not durable: the bake's work-list will re-mint them on the next Hays republish.
- Williamson (48491) has the same two-namespace structure, lexically disjoint, with no
  contradictions today but 282,569 phantom nodes; whatever you build must be county-parameterised
  by the gate-blocked set, never a Hays literal.

### What you build, in order

1. **Locate and read the writer.** Name the job, its image, and the code path that fills
   `parcel_record` account attributes for a county. Paste the join. CP1 is this reading plus
   your design: the crosswalk join for `SEED_BLOCKED_FIPS` counties, an honest absence when the
   crosswalk has no account, refusal on ambiguity, provenance naming the account joined.
2. **Fix the writer** with tests that fail on the bare join for a gate-blocked county and pass
   for the other four counties unchanged (byte-identical output on a control county).
3. **Re-run for 48209 and 48491**, staging first then production, through the job, verified
   from execution status; paste the cell diff counts (rows changed, from what to what) for the
   five Sturgeon nodes and for a sample of ten others.
4. **Lift the hold** (#671) once the cells are right; PR, merge, deploy cortex-api under the
   planner's lease.
5. **structuralFactRead.** The crosswalk lookup for gate-blocked counties (import
   `accountCrosswalkForNode` or its pattern); a test that fails on the bare join.
6. **Durable retirement** of the hollow account-keyed nodes: the bake's work-list excludes
   account-keyed ids in gate-blocked counties, and a serve-time read of `48209:84639` returns a
   decline, with a test.

### Falsifiers

- If after step 3 the facets payload for `48209:97658` prints a situs other than
  `629 STURGEON DR` or a market other than 50,390, the writer still joins by bare number.
- If any of the four non-blocked counties' cells change on the control run, the change is wider
  than the claim.
- If `48209:84639` still serves a card after step 6, the retirement is not durable.
- If `node scripts/surface-probe.mjs --rows P-175` reads anything but PASS on all five, name
  the leg.

### Out of scope

The declared roll (P-178). Minting nodes on the account (rejected). Other counties' P-78 overwrite.

### Close

`_inbox/<date>_p180-hays-cells_close.json`, `planRows` `["P-180"]`, with the job name, PRs and
merge SHAs with conclusion strings, both run ids, the cell diffs, the revisions by field, and
the planner's probe artifact. `leave_behind` is required.
