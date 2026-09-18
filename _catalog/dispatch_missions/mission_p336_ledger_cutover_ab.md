## Mission — P-336: three rails that serve from atoms get their ledger cells (P-204 groups A and B)

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` (the cell writer) and
`hauska-engine` (the retrieval-api cell reader), one PR per repo, each from current `origin/main` with
the SHA declared. You do not merge, deploy, apply or write any store; the integration seat does all
four, and moves `RAIL_POLICY` in doc_repo in the same change (hand back the exact diff you want).

### The rulings (`_decisions/2026-09-18_phase0_closeout_rulings.md`, A-215)

- **Ruling 1, group A:** `parcelGeometry` and `pipelines` CUT OVER. The ledger cells are written from
  the atoms that serve today, the gate grades them, and the retrieval cell reader serves them.
- **Ruling 2, group B:** `etjStatus` CUT OVER. P-332 already made the panel serve the determination
  (hauska-map #419, live on Property Explorer `m6wqid8u7` since 2026-09-18 15:28Z, graded both ways);
  the ledger cell now carries the same four states.

### What serves today (P-204's close, `_inbox/2026-09-17_p204-mid-cutover-serve-paths_close.json`)

| Rail | Serves from | Proven |
|---|---|---|
| `parcelGeometry` | cortex-api `brokerageNodeFacets.ts` -> `loadBoundaryEdgeFactAtom` (LDT `lib/boundaryEdgeFactRead.ts`), `atoms` `entity_type='property-boundary-edge'` -> `boundaryEdgeFact`; writer `boundary-primitive-county-batch` | by ablation: atoms 9/12/5/7 -> served edges 9/12/5/7; atoms 0 -> `refused`, code `atom-miss`. **McLennan has 0 boundary atoms county-wide** |
| `pipelines` | cortex-api -> `loadPipelineFactAtom` (`pipelineFactRead.ts`), `atoms` `entity_type='rrc-pipeline-fact'` bound by bare `parcelNodeId` -> `pipelineFact`; writer `tx-rrc-pipeline-staged-v1` | by ablation: the atom's boolean, distance and operator track the served row |
| `etjStatus` | the P-296 determination (point-in-polygon against `tx_etj_boundary`, 355 rings) | P-332: `absent` / `present` / `unresolved` / `conflicting`, four states on the wire |

Today all three read `excluded-mid-cutover` in all six counties: 18 of the ledger's 55 open cells.

### What to build

1. **The cell writer** (hauska-factory): for each parcel in the six counties, write each rail's cell
   from the same source that serves it today. A served value is a `value`. A determination that looked
   and found nothing is `absent-verified` with its basis (for pipelines, "no pipeline within the
   buffer" is a checked absence). **An atom that is simply not there is NOT an absence**: McLennan's
   missing boundary atoms, and any parcel with none, write a declared `refused` naming `atom-miss` and
   the writer that should have produced it, never `absent-verified` (A-214: a join miss is not a
   verified absence). `etjStatus` writes its four states; `conflicting` names both sources.
2. **Blast radius and record.** The writer is a set-valued county writer: it runs under the program's
   destructive-write guard and heavy-scan lease, emits a durable record naming what it wrote, and
   dry-runs by default. Only `unaccounted` cells change; nothing already earned is overwritten.
3. **The reader** (hauska-engine retrieval-api): the cell reader serves the three rails from the
   ledger, and what the customer reads is unchanged for group A (the served edges, the pipeline
   boolean, distance and operator) and correct for `etjStatus`.
4. **The ledger policy** (doc_repo diff, the seat commits it): `parcelGeometry`, `pipelines` and
   `etjStatus` move from `mid-cutover` to `must-pass` in `scripts/six-county-completeness.mjs`, and the
   self-test's check 43 is updated to match.

### Verify by violation

Pre-register your falsifiers. Fixtures in both directions for each rail, including a McLennan-shaped
parcel with no boundary atom (must write `refused` `atom-miss`, and a test fails if it writes
`absent-verified`). A dry run per county names the cells each rail would write and their kinds;
compare its per-county counts against the atom counts read independently (not by the writer). The
customer-surface probe for after the seat applies: group A byte-identical on the probe's parcels,
`etjStatus` equal to the panel's.

### The three-question gate

Answer in your close: what executes the writer and the reader, what triggers them (a county run, a
schedule), what fails when a cell disagrees with its source, and what bypasses them.

### Constraints

- No store writes, no deploys, no merges, no applies.
- County 48491 (Williamson) was restored from a point-in-time branch on 2026-09-17 and republishes only
  under P-350; the writer may dry-run it read-only, never write it.
- Factory merge order in this wave (the seat serializes): P-333, then P-334/P-329/P-330, then P-300 and
  P-338's writer half, then yours. Rebase onto whatever has merged before you open for review.

### Close

Declare: the start commits and PRs, the source per rail, the per-county dry-run counts beside the
independent atom counts, the falsifiers with both directions shown, the `RAIL_POLICY` diff, the
three-question gate answers, and `leave_behind`.
