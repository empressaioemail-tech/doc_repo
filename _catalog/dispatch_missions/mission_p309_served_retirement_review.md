## Mission — P-309: review the retirements customers actually meet

You launch no sub-agents (FAN-DEPTH 0). This is a READ-ONLY measurement lane. You write no store,
reactivate nothing, and deploy nothing. If a fix is needed, you name it for a later row.

### Where you work

Your own doc_repo worktree for artifacts, and a fresh `hauska-engine` clone from `origin/main`
under `P:/tmp/` (engine main `7b3dda0b` at compile, which carries P-275's live-currency registry)
if you use its readers. Register any clone under the property seat and remove the entry at close.
Every read heavier than a keyed lookup takes a heavy-scan lease keyed on the store's HOST
(production neondb is `ep-lucky-truth-apodo8hr.c-7.us-east-1.aws.neon.tech`; never a nickname and
never the `-pooler` host, P-307). The production store is shared with the integration seat's
applies, so read in bounded pages and release the lease between counties.

### The question

P-275 reviewed the parcel-node ATOMS and found nothing to reactivate. The retirements a customer
meets live somewhere else: `place_layer_snapshots` rows (`adapter_key 'node-facets:tier1'`) whose
`payload_json->'recordRetirement'` is set. Those rows are served as a declared decline
(`record_retired`, P-206). Measured populations to start from, all to be re-read:

- Hays 48209: 58,015, P-180's account-keyed retirements (by design: the Hays node id is the parcel
  map id, and an account-keyed node with no map row is retired). The walk accepts 16 of them.
- Williamson 48491: 282,569 R-prefixed nodes, roll-membership retirement dated 2026-09-10. P-306
  found every one of those ids is also in the county's parcel index (`txgio_parcel`), and the county
  is served from 319,480 numeric nodes. So this is a re-key, but whether each retired R node has a
  live numeric successor is unmeasured.
- Caldwell 48055: 267, CTX-RETIRE's roll-absence retirements (`_inbox/2026-09-09_ctx-retire_close.json`).
- Travis 48453, Bastrop 48021, McLennan 48309: unknown; measure them.

### What to establish, per county

1. Count of served retirements by basis string and writer (quote each basis once).
2. For each class, split into: **retired with a successor** (name how you know: situs address,
   geometry overlap by ring, or a crosswalk; a label match is not enough), **confirmed absent** at
   the county's own source (through the P-275 registry's tri-state reader), and **unmeasured**
   (with the reason). A class the county's source contradicts is named with its size.
3. Five samples per class, with place key, basis, and the evidence for its split.
4. For Williamson, the count of retired R nodes with no live numeric successor, which is the
   population a customer could look up and find declined with nothing in its place.

### Falsifiers — pre-register your predictions before measuring

1. Hays's 58,015 are all P-180 account-keyed (a basis other than P-180's appears: prediction fails).
2. Every Williamson R retirement has a live numeric successor at the same situs address.
3. Caldwell's 267 are all absent from the county's current roll.
4. An unreachable source reports UNMEASURED, never absent (prove it with the TLS flag, as P-275 did).

### Do not

- Write, retire, reactivate, or publish anything.
- Run an unleased scan, or hold a lease across counties.
- Launch sub-agents.

### Close

Snapshot per store with read timestamps; the per-county table with counting rules; samples; the
contradicted classes with sizes; the falsifiers with outcomes; the fixes you would card, each with
its repo. `status`: `closed` when the table is complete. `probe`: cite your per-county artifact.
`subAgents`. `leave_behind`.
