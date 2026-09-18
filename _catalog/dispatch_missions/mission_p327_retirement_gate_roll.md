## Mission — P-327: the retirement gate measures the population the bake will actually retire

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` only and open one PR. You do
not merge, deploy, run a publish, or write to any store; the integration seat does those. Any
doc_repo change is handed back as a diff in your close.

### Why this row exists

P-319 shipped on 2026-09-18 (factory #173, `a3b2c91b`, deployed on digest `afbd0bbc`) as a partial
fix by operator ruling (A-214). Read the P-319 lane's close first
(`_inbox/2026-09-17_p319-retirement-safety_close.json`): its own `contradicted` and `leave_behind`
name this row.

`src/lib/publish-retirement-gate.mjs` computes the retirement set difference against `txgio_parcel`
(via the coverage floor's `resolveParcelSource`). The bake retires against something else. LDT
`artifacts/api-server/src/lib/nodeFacetBakeTier1Conformant.ts`, `buildConformantTier1Payload`, the
retirement arm (around lines 1336 to 1360 at LDT `388ccc5c`): `apn = parcelNodeId.split(":")[1]`,
looked up in `cadPropertyRoll.byPropId`, which `joinIntegrityGate.ts` `fetchCountyCadPropertyRoll`
builds from `cad_property` at the county's DECLARED tax_year, all rows. A miss, with the roll
consulted, is a retirement.

So the gate refuses Williamson today because `txgio_parcel` holds no numeric ids, not because it
measured what the bake retires, and **P-320's blast-radius share inherits the same proxy.** The
counterexample is in the program's own numbers: `txgio_parcel` holds every Williamson R id, so the
gate as built measures 0 R-keyspace retirements, yet the 2026-09-10 bake (run `848afd72`) retired
all 282,569 R nodes because the declared 2026 roll holds no R ids. Whether that retirement was
right is a separate question; the gate's number disagreed with the writer's by 282,569.

### What to build

1. **Re-point the set difference and the share** at `cad_property` for the county at its declared
   tax_year, read the way the bake reads it (same table, same vintage, same key, ALL rows). Resolve
   the declared vintage from the same source the bake uses; the factory already drift-checks LDT's
   `lib/cad-ingest/src/vintage.ts` (`scripts/check-ldt-vintage-drift.mjs`), so reuse that and do not
   copy a vintage table. An undeclared or unreadable vintage refuses (the existing
   `CADROLL_VINTAGE_UNDECLARED` path is the precedent); it never reads as zero.
2. **Keep the id-overlap rule** (`no-id-overlap` vs `no-own-keyspace-index`) and apply it to the roll,
   one definition shared with P-333 (which will reuse it for join misses). A keyspace whose served
   ids the roll cannot hold key-for-key refuses with no authorisation, exactly as today.
3. **Decide what `destructive` means and say it.** Today it counts every absent row, including rows
   already retired. A row the bake would re-stamp retired is not a new loss. Count new retirements
   separately from re-retirements and put the share on the new ones, stating the rule.
4. **Name where `txgio_parcel` still belongs.** The coverage floor reads it on purpose (P-306). If the
   gate should keep a `txgio_parcel` census as a second derivation, keep it and label it; if not,
   remove it. Do not leave two readings that disagree with nobody deciding.

### Verify by violation

Pre-register your falsifiers and what would prove each wrong.

- **The 2026-09-10 shape:** `txgio_parcel` holds every R id, the declared roll holds none. The
  current gate measures 0; the fixed gate measures 282,569 and refuses on the share. Revert-and-run.
- **The 2026-09-17 shape:** numeric served nodes absent from the roll refuse, as today.
- **A healthy county passes:** served ids present in the roll pass with a small, stated share.
- **Read-only census of all six counties against the live store**, under P-281's heavy-scan lease
  keyed on the store host: for each county and keyspace, what the bake WOULD retire now, new versus
  re-retirement, and the gate's verdict. This is the evidence that the fixed gate will not falsely
  refuse Bastrop, Caldwell, Hays, McLennan or Travis on their next publish, and it settles by
  measurement whether Williamson's served numeric ids overlap the 2026 roll (the P-319 lane's R6
  reading says they do not; measure it, do not inherit it).

### The three-question gate

Answer in your close: what executes it, what triggers it, what fails, and what bypasses it. The bake
run outside `runBastropPublish` is a bypass; P-351 is the row that closes it on the LDT side. Say
whether your census changes what P-351 must do.

### Constraints

- No store writes, no publishes, no deploys, no merges. County 48491 is read-only for you.
- hauska-factory main is `a3b2c91b` or later (P-319 and P-325 merged). Branch from `origin/main` and
  declare the SHA. Another factory lane (P-335) is in flight on `parcel-record-fill.mjs`; do not touch
  that file.

### Close

Declare: start commit, PR number, the reader and its vintage source, the destructive rule, the
fixtures in both directions, the six-county census with its snapshot, the three-question gate, and
`leave_behind`.
