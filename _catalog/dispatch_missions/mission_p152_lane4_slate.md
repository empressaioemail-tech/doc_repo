## Mission — P-152 lane 4: the ten rails still riding the atom chain are slated, and the panel's dollars and owner are gated

You are the deepest worker in OPS-23 wave 4. You do not spawn sub-agents. The dispatch
planner supervises you, reviews CP1 and CP2, and runs the surface probe itself after your
deploys. You start after P-154's Bastrop cell re-run has landed on production (the planner
tells you); the slate would otherwise serve tier-first values as record.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### Where you work

`hauska-factory-p152-slate` (branch `feat/p152-slate-zoning-envelope-rails`) and
`hauska-map-p152-slate` (branch `feat/p152-panel-dollars-owner-gated`), both from `origin/main`,
start commits declared. `P:/hauska-factory` and `P:/hauska-map` are other seats' checkouts.

### What is true today (live facets for `48021:34049`, 2026-09-13; P-152 lane 3 close)

`recordRailStates` on the Property Explorer facets payload (`X-Pe-Read-Path: record`):

- serve `record` (11): cityLimits, flood, specialDistricts, wells, schoolDistrict,
  utilityService, overlayDistricts, livingAreaSqft, yearBuilt, zoningDistrict, setbackFrontFt.
- serve `legacy-transitional` (10): agValuation, maxImperviousCoverPct, acreageAcres,
  acreageSqft, acreageMethod, zoningJurisdictionKey, zoningProvenance, setbackSideFt,
  setbackRearFt, setbackCornerFt.

Lane 3 wrote: "2 of 7 zoning/setback rails serve record; 5 serve legacy-transitional; this is
the retirement backlog for whoever next touches the zoning-envelope rail group's slate, a
factory-side change." The slate is the factory's per-(county, rail) gate verdict (OPS-21 D5
grades 65 rails; a pair serves record only once it is slated with a passing verdict). Item 2 of
lane 3's mission, the panel's dollar rails and owner gated in the BFF, was deliberately not
built ("entitlement-gate risk, not safe to ship unreviewed in one pass").

### What you build

1. **Factory slate.** For each of the ten rails above and each of the six CTX counties, run the
   gate, read the verdict from the run record (never the console), and slate the pairs that
   pass; for the pairs that do not, paste the verdict and the reason and leave them
   legacy-transitional with the reason named in your close. Staging first, then production.
   Do not widen a gate to admit a pair.
2. **Panel item 2.** The dollar rails (market, assessed, land, improvement) and owner on the
   Property Explorer panel are gated in the BFF the same way the report's are (`requireStudioSession`
   already rejects unentitled callers for exports; the panel's dollar and owner reads take the
   same gate). A test fails on an ungated read. Free viewers see the refusal token, not a blank.
3. **Retire.** Every rail you slate has its legacy read path retired by decline in the panel
   composer (the pre/post facets diff shows the rail moving from `legacy-transitional` to
   `record` and nothing else moving); a divergence test between the record value and the last
   legacy value fails on disagreement for the five probe parcels until retirement.
4. Deploy hauska-map through the Vercel CLI, verify the new deployment is aliased, and paste a
   fresh `recordRailStates` for all five probe parcels.

### Falsifiers

- If after step 1 any slated pair serves a value that differs from the cell in `parcel_record`
  for a probe parcel, the slate reads the wrong store.
- If a free viewer can read a dollar or owner value on the panel after step 2, the gate is not
  in the path.
- If the pre/post diff moves any rail other than the ten named, the change is wider than the
  claim.

### Out of scope

The engine-side entitlement gate and smartsite-mcp's missing entitlement check (P-152 lane 5,
`mission_p152_lane5_entitlement.md`). New values for the rails (the cells are what they are).

### Close

`_inbox/<date>_p152-slate_close.json`, `planRows` `["P-152"]`, with the slate table (county,
rail, verdict, run id), both PRs with merge SHAs and conclusion strings, the deployment id and
alias, the five-parcel `recordRailStates` before and after, and the planner's probe artifact.
`leave_behind` is required.
