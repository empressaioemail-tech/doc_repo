## Mission — P-271: Williamson answers nothing on the MCP, and composes no address

You launch no sub-agents (FAN-DEPTH 0). READ THE CAUSE FIRST, then fix or rule. You may open a PR in
at most the one repo the cause lives in. You do not merge, do not deploy, and write no store.

### Where you work

Read-only to start. When you know the cause, take a fresh clone from `origin/main` under `P:/tmp/`
into a NEW directory (engine main `3809275f`, LDT main `7219b707`, map main `3ee35d5e` at compile),
branch `fix/p271-williamson-identity`. Register it under the property seat and remove the entry at
close. Heavy reads take a heavy-scan lease keyed on the store's HOST (never a nickname; P-307).

### The finding (row P-271)

Five of five Williamson parcels in three cities return `baked_snapshot_not_found` at both
`get_smart_site` depths (XD-6), and three of three compose no address on the map (XD-7). The root
cause was never read. The row's own guess was P-184's two-namespace reconciliation.

### What P-306 established on 2026-09-17, which you start from rather than re-derive

- Williamson's served tier-1 rows hold TWO id keyspaces: numeric, 319,480 rows (147,145 zoned, all
  live), and R-prefixed, 282,569 rows, every one carrying `recordRetirement.status: "retired"`.
- The county's parcel table `txgio_parcel` is R-keyed throughout and holds ZERO numeric ids.
- The bake reaches a numeric node's district through the situs-address recovery join onto the
  R-keyed row (`parcelJoin.state: "joined-situs"`), so one source row can stamp two nodes.
- P-309 then measured the retired side: 2,264 retired R nodes have no live node at the same
  normalized situs, and 164 of those also read absent at the county's own WCAD layer. Its namespace
  control FAILED for Williamson (0.0000): the registered reader answers nothing for R ids.

### What to establish, in order

1. For the five parcels the XD-6 finding used (name them from the scope doc or pick five and say
   so), WHICH id a caller passes, which id the bake wrote, and where the lookup diverges. Quote the
   served row's `place_key` and the id the MCP was asked for.
2. Whether `baked_snapshot_not_found` is an identity miss (the row exists under the other keyspace),
   a genuine absence, or a lookup that never tries the crosswalk. Name the code path.
3. The same for the address compose: which field the map reads, and why Williamson yields nothing
   where other counties yield an address.
4. Whether the two symptoms share one cause. Say so explicitly either way.
5. The population: how many Williamson lookups a customer could make today that would miss this way.

### Falsifiers — pre-register your predictions before measuring

1. A Williamson parcel that misses at the MCP has a served tier-1 row under the other keyspace (if
   no such row exists for any of the five, the identity explanation is wrong).
2. A Bastrop parcel with the same shape of lookup succeeds (the control: the defect is Williamson's
   keyspace, not the MCP).
3. If you change code: reverting it reproduces the miss in a test.

### Do not

- Retire, reactivate, republish, or write any store.
- Change the bake's identity rules on your own authority: a re-key is an operator ruling, and this
  lane names what one would cost rather than performing it.
- Touch the card text or the draw gate (another lane holds P-270/P-272), or `txgio_parcel`.
- Launch sub-agents.

### Close

Snapshot per store and repo with read timestamps; the five parcels with both ids and the divergence
point; the cause, with a second mechanism you considered and why you rejected it; the population;
any PR with its literal CI conclusion strings. `status`: `closed` if the answer is a ruling this
lane cannot implement; `closed-partial` if a PR awaits merge. `probe`: cite what a customer would
see, before and after. `subAgents`. `leave_behind`.
