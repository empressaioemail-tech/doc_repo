## Mission — P-262: one edge labeller and a ring scrub

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-engine`, and in
`legacy-design-tools` only if the shared primitive must be consumed there, and open PRs. You do
not deploy, and you do not re-derive or write any atom.

### Where you work

Fresh clones from `origin/main` under `P:/tmp/`, branch `fix/p262-edge-labeller` in each repo
you change. Declare start commits. hauska-engine main is at or after `d88cf65` (P-248, P-261
deployed). LDT PRs #701 (P-249, `buildableEnvelope/`) and #702 (P-293) are open; coordinate if
you must touch `buildableEnvelope/`, and say so in CP1.

### The defect

San Marcos `48209:97658` (609 Sturgeon Dr, SF-6, setbacks 25/5/20/15 on record) is a nine-edge
county ring. Its front is inferred from the nearest street centerline instead of the
situs-named street, GIS artifact vertices are labelled `side`, and a long narrow lot collapses to
a false zero. Pflugerville `48453:427599` takes its front from the situs-named street and draws.
The engine's depth-warm labeller does not group ring chords into logical edges; LDT's live
labeller does. So the two paths disagree about the same parcel, and a fix in one leaves the other
wrong (scope rev 4 section 4.2, R3).

A-177 defers the road-name dictionary and the road-class rules (R1, R2). This row uses a
situs-named front only where the name already matches the street data as it is. It does not
build a dictionary.

### What to build

1. **A ring scrub:** collapse near-collinear and near-duplicate vertices (GIS artifacts) before
   labelling, with tolerances stated and tested.
2. **Logical-edge grouping:** chords that belong to one lot line are one edge.
3. **Front selection:** the situs-named street first when the name matches as-is; otherwise the
   current rule; curved frontage handled as one front.
4. **One implementation or a divergence test.** Either both paths import one shared primitive,
   or a divergence test runs the same fixtures through both and fails on disagreement. If you
   choose the test, use P-282's harness pattern if it exists by then, otherwise a plain fixture
   test, and say which.
5. **A `validation-failed` ring still reaches a named decline**, never a silent empty (P-249
   relies on this).

### Fixtures

`48209:97658` must get one front and a non-zero envelope that passes the ground-truth checks P1
to P3 (`envelope-ground-truth.ts`). `48453:427599` must be unchanged. Add a curved-frontage lot
and a ring with artifact vertices. Read the parcels' real rings from the store or the county
service; never from a cached layer (it has holes).

### Falsifiers, pre-register your answers first

1. `48209:97658` passes P1 to P3 with one front.
2. `48453:427599`'s labels and envelope are byte-identical before and after.
3. Editing one path alone fails the divergence test (or the shared primitive leaves no second
   path to edit).

### Close

Snapshot per repo; files touched; PRs with every CI check's literal conclusion; the falsifiers;
the tolerances you chose and why. `status`: `closed-partial` until merged and exercised by P-264's
re-derive. `probe`: `{"notApplicable": "build lane; graded when P-264 re-derives with this
labeller"}`. `subAgents`. `leave_behind`.
