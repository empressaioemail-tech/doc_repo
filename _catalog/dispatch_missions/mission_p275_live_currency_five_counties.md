## Mission — P-275: a live-currency check for the other five counties' retired parcel nodes

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-engine` and open a PR. You reactivate
nothing and write no store: a reactivation is a mass state change, and the integration seat runs
it after the operator authorises the count you measure.

### Where you work

`hauska-engine`, fresh clone from `origin/main` under `P:/tmp/` into a NEW directory, branch
`feat/p275-live-currency-five-counties`. Declare the start commit (engine main `3e6bbe95` at
compile, which carries P-297's reader). Register the clone under the property seat and remove the
entry at close. Another engine lane (P-302) works in
`packages/engine-core/src/site-plan/` and `packages/engine-core/src/report*`; stay out of those.

### What exists (P-212, closed 2026-09-15, `_inbox/2026-09-15_p212-bastrop-false-retirement_close.json`)

- Bastrop's parcel-node reconcile had retired 57,704 of 62,394 nodes. A full live check against
  the county's public cadastral FeatureServer found 56,691 live, and they were reactivated. The
  **1,013 still retired** were spot-checked as absent from the live endpoint, but nobody
  established why.
- `review-retired-parcel-nodes.mjs` has a `LIVE_CURRENCY_SOURCES` registry holding Bastrop only
  (`parcelCurrencyFromBcadMap`). For any other county it reports candidates and reactivates none.
- P-212's canon note recorded retired parcel-node counts of Hays 0, Caldwell 0, McLennan 0,
  Williamson 0, Travis 40 and Ector 3,791 at that time. Treat these as claims to re-measure, not
  facts.
- **New since then (A-201, 2026-09-17):** P-180's tier-1 bake retires ACCOUNT-KEYED nodes in the
  two-namespace counties (Hays 48209, Williamson 48491) by design. Example: `48209:135570` is
  retired because prop_id 135570 is not in `txgio_parcel`, since the Hays node id is the
  parcel-map id (`_decisions/2026-09-13_hays_node_identity_is_the_parcel_map_id.md`). Those
  retirements live in the serving snapshot (`place_layer_snapshots.recordRetirement`), not
  necessarily in the parcel-node atoms. Report the two populations separately and never count a
  designed account-keyed retirement as a false one.
- The atoms store is database `hauska_mcp`; reading the wrong database returns a false absence.

### What to build

1. **Measure first (read-only, under a heavy-scan lease on each store you scan):** per county
   (Caldwell 48055, Hays 48209, McLennan 48309, Travis 48453, Williamson 48491, and Bastrop's
   residual), the active and retired parcel-node counts, the retired share, and when and by which
   run the retirements were written. Declare the store, database and time for every figure.
2. **Register a live-currency source for each county** in `LIVE_CURRENCY_SOURCES`: the county's own
   public cadastral service (appraisal district or county GIS), never `txgio_parcel`, which is the
   source a false retirement is judged against. Each source is a second, independently derived
   reading. Query the id namespace the node actually uses (the map id in Hays and Williamson, per
   the 2026-09-13 ruling), and say how you know. Where a county has no usable public service,
   register nothing and say so.
3. **Run the review in report-only mode** for every county and produce, per county: retired,
   confirmed live (reactivation candidates), confirmed absent, unmeasured (with reason), and the
   retired share before and after a hypothetical reactivation.
4. **Bastrop's 1,013:** sample at least 50 and classify each (replat, renumber, real loss,
   unmeasured) from the county's own records, and state the rule that would let a check tell them
   apart.
5. **A blast-radius refusal on reactivation**, if the CLI has none: a declared share above which it
   refuses without an explicit authorisation flag (ENFORCEMENT, "A mass state change refuses before
   it lands"), with a test that proves it refuses.

### Falsifiers, pre-register your answers first

1. Pointed at Bastrop, the new sources' review reproduces P-212's live count within 1 percent.
2. A county whose live source is unreachable reports UNMEASURED, never zero candidates.
3. The reactivation refusal fires on a synthetic run above the declared share (test).

### Do not

- Reactivate, retire or write anything in any store; deploy; merge.
- Treat a designed P-180 account-keyed retirement as a false retirement.
- Hammer a county service: page politely, cache, and state your request count.
- Touch `packages/engine-core/src/site-plan/` or the report model files, or launch sub-agents.

### Close

Snapshot; files touched; the PR with every CI check's literal conclusion string; the per-county
table with its store and time; the Bastrop residual classification; the falsifiers with
evidence; the exact reactivation command per county for the integration seat, with its count.
`status`: `closed-partial` until reactivations, if any, are authorised and applied. `probe`:
`{"notApplicable": "measurement and build lane; graded by the per-county live-currency table and
any authorised reactivation"}`. `subAgents`. `leave_behind`.
