## Mission — P-152 lane 6: the five siblings get per-rail slate entries, the nine safe pairs are slated, and the panel stops overriding the record

You are the deepest worker in OPS-23 wave 5. You do not spawn sub-agents. The dispatch
planner supervises you, reviews CP1 and CP2, and runs the surface probe itself after your
deploys.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### The ruling you execute (A-140, overseer 2026-09-13, operator veto open)

The retrieval-api reader's per-rail semantics are the contract (R-9: one reader). The five
rails legacy-design-tools' `parcelRecordAllowlist.ts` documents as "representative-key
siblings" (zoningJurisdictionKey and zoningProvenance under zoningDistrict; setbackSideFt,
setbackRearFt and setbackCornerFt under setbackFrontFt) get literal per-rail slate entries in
BOTH slate files where the gate verdict passes; the representative-key grouping is retired from
the allowlist; the divergence test that keeps the two files in sync stays and is extended to
fail on a missing sibling.

### Where you work (register names; from `origin/main`; declare start commits)

`hauska-engine-p152-siblings` (branch `feat/p152-slate-siblings`), `legacy-design-tools-p152-siblings`
(branch `feat/p152-allowlist-per-rail`), `hauska-map-p152-siblings` (branch
`fix/p152-panel-record-axes`).

### What is true today (P-152 lane 4 close, `_inbox/2026-09-13_p152-slate_close.json`, handoffSlateDiff)

- The slate is two files kept in sync by a divergence test: hauska-engine
  `services/retrieval-api/src/parcel-record-slate.json` and legacy-design-tools
  `artifacts/api-server/src/lib/parcelRecordAllowlist.ts` (`PARCEL_RECORD_SLATE`).
- Nine pairs pass the gate now (`parcel_gate_verdict` verdict=pass, unaccounted 0) and are
  independent rails: `acreageAcres` in 48021, 48055, 48209, 48309, 48453, 48491;
  `acreageMethod` in 48021, 48453, 48491. Cross-checked against `parcel_record_cell` for
  48021:34049 (acreageAcres 0.6862 from cad_property). `acreageSqft` is excluded in all six
  counties (no writer exists); do not slate it.
- `agValuation` and `maxImperviousCoverPct` are already slated everywhere they pass.
- The five siblings have NO `resolveAllowlist` call site in LDT; the retrieval-api reader
  (`parcel-record-reader.ts`) reads them independently. Their gate verdicts per county are in
  the lane-4 `gateVerdictTable`; slate only where pass.
- The panel: hauska-map `atom-chain-to-facets.ts` `composeZoningSetbackOverride` serves the
  atom-chain value for side/rear/corner even when the record carries a value; hauska-map #398
  pinned its current behaviour with tests. For 48021:34049 the panel prints 30/5/25/15 while
  the endpoint, the MCP and the record carry 30/10/30/20 dated 2026-04-14.
- A second acreage-source disagreement exists (geometry-computed vs CAD-roll-computed, both
  legitimate); slating `acreageAcres` is not a regression, and the panel must label which.

### What you build, in order

1. **Engine slate.** Add the nine pairs and, for each of the five siblings, the (county, rail)
   pairs whose gate verdict is pass, to `parcel-record-slate.json`; the divergence test gains
   the sibling rule. PR, merge on the conclusion string, deploy retrieval-api under the
   planner's lease.
2. **LDT allowlist.** The same entries in `PARCEL_RECORD_SLATE`; the representative-key
   comment and mechanism removed; a test that a sibling without its own entry fails. PR, merge,
   deploy cortex-api under a lease.
3. **Panel.** `composeZoningSetbackOverride` prefers the record value when the rail serves
   record and keeps the atom-chain value only for `legacy-transitional`; the #398 tests are
   updated to the new behaviour, with one test that fails on the old override. Deploy through
   the Vercel CLI; verify the alias.
4. **Read.** Paste `recordRailStates` for all five probe parcels before and after, and the
   panel setbacks for 48021:34049 and 48021:33223.

### Falsifiers

- If after step 3 the panel prints anything but 30/10/30/20 for 48021:34049, the override
  still wins somewhere; name the file.
- If a slated pair serves a value that differs from its `parcel_record_cell`, the slate reads
  the wrong store.
- If the divergence test passes while the two slate files differ, it is vacuous.

### Out of scope

`acreageSqft` (no writer). Hays and Williamson cells (P-180). New gate verdicts.

### Close

`_inbox/<date>_p152-siblings_close.json`, `planRows` `["P-152"]`, with the three PRs and merge
SHAs with conclusion strings, the revisions and deployment by field, the before/after rail
states, and the planner's probe artifact. `leave_behind` is required.
