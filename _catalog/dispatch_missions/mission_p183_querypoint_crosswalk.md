## Mission — P-183 GEOCODED CELLS THROUGH THE CROSSWALK: the record store's query point stops pointing 35 km away

You are the deepest worker in OPS-23 wave 6. You do not spawn sub-agents. The dispatch
planner supervises you, reviews CP1 and CP2, and runs `scripts/surface-probe.mjs --rows P-175`
after your re-run and deploy.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### The finding

After P-180, `node scripts/surface-probe.mjs --rows P-175` reads FAIL on all five Sturgeon
addresses for one reason (`_inbox/2026-09-14_120659_surface_probe.json`): the record path's
`cityLimitsFact.queryPoint` for each node is 34.8 km from the CAPCOG address point. The label
is right for 629; the polygon at the point is the lot; the point is the colliding account's.
The record store's geocoded cells for Hays nodes were computed from the CAD situs joined by
bare number, the same class P-180 fixed for the account attributes.

### Where you work

`hauska-factory-p183-querypoint` (branch `fix/p183-geocoded-cells-crosswalk`) and, if the
reader composes the point rather than the writer, `hauska-engine-p183-querypoint` (branch
`fix/p183-querypoint-from-geometry`). From `origin/main`; declare start commits.

### What you build

1. **Read.** Which writer fills `cityLimits.queryPoint` (and every other cell derived from the
   CAD situs or a geocode) in `parcel_record`, and from what. CP1 is that reading with the
   join pasted, plus the list of every geocoded cell.
2. **Rule.** For gate-blocked counties, the point comes from the parcel geometry itself
   (point-on-surface of the TxGIO polygon, which the cells already use for flood) or from the
   crosswalked account's situs, never from `cad_property` by bare number. Prefer the geometry:
   it exists for every node and is the same source the flood cell uses.
3. **Re-run** the writer for 48209 (and 48491 only if its rows are proven affected; P-184
   otherwise), staging then production, verified from execution status; paste the cell diff
   for the five Sturgeon nodes and ten others. Deploy any reader change under a lease.
4. The P-160 label leg is already ruled and landed in the probe (A-147); the predicate is
   `--rows P-175` PASS on all five.

### Falsifiers

- If after the re-run any of the five nodes' record point is more than 150 m from its CAPCOG
  point, the cell still reads the colliding account.
- If a non-blocked county's cells change on a control run, the change is wider than the claim.

### Out of scope

The bake and its walk (the P-178 publish lane). Williamson.

### Close

`_inbox/<date>_p183-querypoint_close.json`, `planRows` `["P-183"]`, with the cell list, PRs and
merge SHAs with conclusion strings, run ids, diffs, revisions by field, and the planner's probe
artifact. `leave_behind` is required.
