## Mission — P-177 HAYS ACCOUNT ATTRIBUTES THROUGH THE CROSSWALK: end the chimera class, not one address

You are a hand-carried lane on the property seat. You are the deepest worker: you do not spawn
sub-agents. The integration seat (overseer) reviews CP1 and CP2 in this thread and runs the
surface probe after your deploy. Continue in the registered worktree
`P:/seat-worktrees/property/legacy-design-tools-p175-hays-online` (rebase it on `origin/main`
first and declare the commit); P-177 is P-175's continuation on the same files.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### What P-175 established, and what it got wrong (overseer review 2026-09-13, `_inbox/2026-09-13_p175_overseer_review.md`)

Real and verified: the identifier backfill (134,216 of 134,606 Hays 2026 rows carry
`quick_ref_id` and `property_number`, production read); the H1 disposition table
(hauska-factory #142, P-145 closed: different-key 37,927, never-an-account 25, unknown 107,
left-the-roll 0, none undispositioned); the tier-1 publish ran (48209 snapshots re-baked
2026-09-13T00:50Z); the situs resolver (LDT #668 + #669, `cortex-api-00782-geq` at 100 percent)
binds a located-unbound address point to the parcel that contains it.

Wrong, read at source by the overseer after the close:

- **The rebind did not reach the served polygon.** Node `48209:97658` after the publish
  (bakedAt 2026-09-13T00:50:56Z) still carries the Sturgeon lot's nine-vertex ring, 0.1889 ac,
  neighbours 97657/97659, San Marcos CISD, the Upper San Marcos watershed district and flood
  Zone AO, under CAD account 97658's label, anchor and dollars (13669 Mesa Verde Dr). The
  mission's first falsifier fired; the lane checked the label, which had always been Mesa Verde.
- **The class is every colliding node, not 617.** All five Sturgeon TxGIO ids collide with a
  real account: 97651 = 476 Catalina Ln (681,990), 97652 = 13749 Mesa Verde Dr (691,530),
  97653 = 13735 Mesa Verde Dr, 97657 = 13681 Mesa Verde Dr, 97658 = 13669 Mesa Verde Dr. The
  nodes the resolver now routes the customer to (97651, 97652, 97653, 97657) serve the Sturgeon
  polygons with those accounts' dollars and Austin anchors; 97651/97653/97657 show the label
  `STURGEON DR, SAN MARCOS` (TxGIO's situs) over market values near 600,000 to 690,000 for
  vacant lots the roll values at 50,130 to 50,390. H1's count of this class is 37,927 nodes.
- **The account-keyed node is hollow.** `48209:84639` was re-baked 2026-09-13T00:44:52Z with
  the right label, anchor and dollars and NO ring and NO cells (flood `refused
  parcel-record-cell-miss`); `parcel_record` and its cells are keyed by TxGIO prop_id. The
  resolver's crosswalk half of #668 sends "629 STURGEON" to this hollow node.

Net for the customer today: zero of five cards are right. The flood determination itself is
right on all five polygons (Zone AO, SFHA, no BFE, NFHL_48_20260101, point-on-surface) because
the cells are geometry-derived and the geometry is the lot's.

### The fix (option A, ruled by the overseer 2026-09-13; option B is a program-level identity change and stays with P-124/OPS-21)

The TxGIO-keyed node IS the Hays node: it has the polygon and the cells. What is wrong is the
join that fetches account attributes for it. For a gate-blocked county, every account-derived
attribute of a TxGIO-keyed node comes from the account the crosswalk names, never from
`cad_property` by bare number:

1. `artifacts/api-server/src/nodeFacetBakeTier1ConformantCli.ts` (and whatever `nodeFacetTier1ParcelJoin.ts`
   feeds it): for a county in the gate-blocked set, resolve the node's TxGIO prop_id to
   `txgio_parcel.geo_id`, then to the `cad_property` row whose `property_number` equals it
   (tax_year = the declared vintage), corroborated by `quick_ref_id` stem = the prop_id; take
   label (situs), anchor, cadRoll dollars, structural, land use, owner and value history from
   THAT row. When the crosswalk has no account (the 58,015 no-key population), the attributes
   are an honest absence with the reason `no-crosswalk-account`, never the colliding account's.
   When the crosswalk is ambiguous, refuse and name it. Provenance on the snapshot records
   `accountJoin: crosswalk` with the account id, so a reader can see which account fed the row.
2. The label for a vacant lot whose account situs carries no house number: keep the roll's
   situs as the label (honest), but the search hit that landed by containment carries the
   address-point string, and the card shows both (`629 STURGEON DR` from the roll;
   `615 STURGEON DR (address point)` from CAPCOG where the roll has none). Do not synthesize a
   number into the roll's situs.
3. The situs resolver: revert the crosswalk half of #668. A parcel-situs hit for a gate-blocked
   county resolves to the TxGIO-keyed node that carries the polygon (`629 STURGEON` → `48209:97658`
   once its attributes are right), not to the account-keyed hollow node. Keep containment
   (#668/#669) as it is. Tests that fail on the current behaviour.
4. Retire the account-keyed snapshots the P-175 publish wrote for gate-blocked counties
   (`48209:84639` and its siblings): they have no cells and answer to nothing once step 3
   lands. A retired path returns a decline; count them and name the count in the close.
5. Re-publish Hays tier-1, staging then production, on the pinned LDT that contains your
   merge (bump `_LDT_SHA` in hauska-factory `cloudbuild.publish.yaml` by PR; CI checks that
   pin). Read the run row, not the console. Then re-read `48209:97658`, `97651`, `97652`,
   `97653`, `97657` at depth node and paste ring, acreage, neighbours, label, market for each.

### Falsifiers, pre-registered

- If after step 5 node `48209:97658` shows a label other than `629 STURGEON DR` or a market
  other than 50,390, the crosswalk join did not reach the bake.
- If after step 5 node `48209:97652` shows any Mesa Verde attribute, the class is not fixed.
- If a node with no crosswalk account shows any account's dollars, the fallback re-introduced
  the collision.
- If CTX-HAYS-KEY's contradiction instrument (served address versus the account's own roll
  address, `_inbox/2026-09-10_ctx-hays-key_close.json`) reads more than 0 on production after
  the publish, the class is not fixed. Re-run it and paste the number; 37,479 was the baseline.
- If `node scripts/surface-probe.mjs --rows P-175` reads anything but PASS on all five, name
  which leg and why.

### Out of scope

Minting Hays nodes on the CAD PropertyID and re-keying the cells (option B; a P-124/OPS-21
identity ruling owed by the operator). Adopting the 8-26-2026 drop as the declared roll.
p78Merge's overwrite in other counties. `find_parcel near` distance-0 stacking (P-175 LB4;
measure it if you are in the file, otherwise carry it forward with an owner).

### Close

`_inbox/2026-09-13_p177-hays-attributes_close.json`, `planRows` `["P-177"]`, with the PR numbers
and merge SHAs with conclusion strings, the pin bump PR, both publish run ids, the five depth-node
reads, the contradiction count, the retired-snapshot count, the serving revisions read by field,
and the probe artifact. Write it in the doc_repo worktree the session running you is rooted in
and do not commit to doc_repo; the overseer commits. `leave_behind` is required.
