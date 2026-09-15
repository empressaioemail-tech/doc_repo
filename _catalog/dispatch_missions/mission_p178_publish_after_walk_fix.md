## Mission — P-180 walk fix, then P-178 step 6: excluded nodes carry the current run id, the Hays publish walks, and the seven cards are read

You are the deepest worker in OPS-23 wave 6. You do not spawn sub-agents. The dispatch
planner supervises you, reviews CP1 and CP2, runs `scripts/surface-probe.mjs --rows P-175`
after your publish, and reads the seven cards with its own connector.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### The ruling you execute (A-146, option B)

P-180 (LDT #683) excludes hollow account-keyed nodes from the tier-1 bake's work list in
gate-blocked counties, so they are never rewritten and keep a stale `publishRunId`. The
factory's verify-walk (`verify-walk.mjs:508-511`) requires the CURRENT run id on every parcel
it sweeps, including an earned retirement. Both invariants stay: the bake keeps excluding
hollow nodes from the fact build AND retires them with the current run id in a cheap pass, so
the stamp the walk wants exists. Do not weaken the walk.

### Where you work

`legacy-design-tools-p178-publish` (branch `fix/p180-retire-excluded-with-current-run`) and
`hauska-factory-p178-publish` (branch `chore/p178-pin-and-publish`), from `origin/main`;
declare start commits.

### What is true today (`_inbox/2026-09-14_p178-hays-roll_close.json`; re-verify)

- Production `cad_property` 48209/2026: 134,591 certified rows (`hays_20260826_certified.zip`)
  with identifiers, 390 marked `absent-from-declared-drop` by the loader (LDT #680), vintage
  label mapped (#681). Nothing here changes.
- Staging 48209 tier-1 is MIXED: 116,421 rows at the current bake, 56,629 at the previous.
  Run `factory-bastrop-publish-fwv5s` failed `WALK_FAILED` on 84629 to 84639 (BP-PUBLISH-RUN-01,
  "facets not stamped with publish run") while the gold and its neighbours passed.
- 84629 is not in `txgio_parcel`, already carries an earned retirement (`absent-verified`,
  `lastSeenTaxYear 2025`) from the first run under the old pin, and is excluded under the new
  pin, so its stamp can never refresh. The street sweep catches hollow nodes because they share
  streets with the anchors. This recurs on every Hays republish until fixed.
- The dispatch's gold anchor 135570 is itself a hollow node; use 97658 (the P-178 lane's CP6
  correction).
- Factory pin: `cloudbuild.publish.yaml _LDT_SHA` = `82857ebb` (#146). CI checks the pin.

### What you build, in order

1. **LDT.** In the tier-1 bake, after the fact build, a retirement pass over every node the
   work-list exclusion skipped in a gate-blocked county: write (or refresh) its retirement
   record with the CURRENT `publishRunId` and no facts. A test that fails when an excluded node
   is left with a stale stamp; a test that the fact build still skips it. Merge on the
   conclusion string.
2. **Factory.** Bump `_LDT_SHA` to your merge; CI-required comment; merge. Do not touch the
   walk's rule.
3. **Staging publish** (`factory-bastrop-publish`, county 48209, gold 97658), read the run
   row and the walk verdict; paste the stamp counts: current-run rows must equal 173,050.
4. **Production publish** on the operator's go quoted into the planner's thread (it is a
   serving-store write). Same reads.
5. **Cards.** The planner reads `get_smart_site` at depth node for `48209:97658`, three moved
   accounts (166234, 167545, 28279 by their nodes) and three marked accounts, and pastes
   value, vintage label and disposition. The planner runs `--rows P-175`.

### Falsifiers

- If the staging walk fails BP-PUBLISH-RUN-01 on any node after step 3, the retirement pass
  missed a population; name it.
- If any excluded node serves facts after step 3, the pass wrote more than a retirement.
- If current-run rows on staging differ from 173,050, the work list changed shape; explain it.

### Out of scope

The walk's rule. Williamson (P-184). The record store (P-183).

### Close

`_inbox/<date>_p178-publish_close.json`, `planRows` `["P-180", "P-178"]`, with the PRs and
merge SHAs with conclusion strings, both run ids and walk verdicts, the stamp counts, the
seven reads, and the planner's probe artifact. `leave_behind` is required.
