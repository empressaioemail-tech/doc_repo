## Mission — G-154: make the live Development services lens match its ratified design

You launch no sub-agents (FAN-DEPTH 0). You own `smartcity-dashboards` for this row, and you are the only
lane in it while you run. You fix your own failed builds rather than escalating them.

Read the G-154 row in `90_operations/OPS-17_govtech_stack_plan_of_record.md`, then
`_design/smartcity-dev-services/README.md` in full. The program preamble compiled above LEADS with
"Bastrop is the proving pack", and it binds this lane: prove on `bastrop_tx`, against Bastrop's real
records. A pass on `template-city` is not a pass.

### What is already true, verified, not to be rebuilt

**This lens already reads live Bastrop data.** MyGov is granted to `bastrop_tx` at the KIND level
(`PLATFORM_MYGOV_PERMITS_GRANT` is `kind: "mygov"`), and it covers all five MyGov domains: permits, work
orders, inspections, code violations and business licenses. `src/server.mjs` registers all four
non-permit domains as live resources of kind `mygov` and gates them on the kind, and the dashboards
fetched all four from v1 on 2026-09-16. **Add no grants.** The planner first told this row it needed
four, and that was wrong (OPS-17 A-147).

So this row is correctness work on real records, not wiring.

### The work

**Measure the delta first, at a named ref, and state it before writing code.** G-123 shipped this lens
on 2026-09-14. The design was extended and corrected on 2026-09-15 and now stands at six artboards
(Pipeline, Inspections, Work orders, Code enforcement, Licenses, Empty). Read the shipped surface at
`origin/main` against the six boards and list every difference. Trust neither this mission's account nor
the row's.

**The design's four corrections are acceptance items**, and on live data they matter more than they did
on fixtures:

1. There is no Place tab. The product never had one.
2. No person is named on a published workload ranking. The live mapper passes `assignedOfficer`, a staff
   member's name, so check where it renders. A per-officer count on a published screen is the defect.
3. The license rows are in the design's sort order.
4. No resident is named beside an address.

**On personal data, what is already right and what to check.** The live code-violation mapper already
refuses the vendor's free-text `description` field, which is where citizens' names and complaint details
live (a G-123 finding), and falls back to the violation type instead. Do not weaken that. It does pass an
`isRepeatOffender` flag beside each address. Decide against the design whether that flag belongs on the
surface where it lands, and say why. Work orders carry citizen names and phone numbers in free-text
fields: confirm no work-order free text reaches a rendered field. **Department access is not enforced
today** (G-143 finding): every signed-in account can open this lens, so anything you render is visible to
every department.

`node _design/smartcity-dev-services/check.mjs` must pass. The G-156 lane made the finance-lens check
readable against the built surface (`--dir`); do the same here if the check cannot otherwise see what the
product renders, so it does not pass vacuously.

### Where it goes, and what is held

Build, merge to `main`, and prove on the non-production DigitalOcean app `d12-main-uat` against
`bastrop_tx`, reading back `services[0].source_commit_hash` (OPS-25 rule 13). **If you have no
DigitalOcean credential, stop at merged and say so.** A merged change is not a proven one.

**Do not ship to `dolphin-app`.** It serves `app.smartcityos.io`, and whether real Bastrop records with
staff names go to every department's staff before department access exists is the operator's call. It
is the same hold as G-156.

**Two lanes in one repo is how changes collide.** G-159 is waiting for you to merge before it touches
`smartcity-dashboards`. Keep your change to this lens, and do not refactor shared rendering in
`web/app.js` or `web/index.html` on the way through.

### Close

Declare your `leave_behind`. "None" is valid and cheap; the declaration is required regardless. File CP1
(the measured delta), CP2 and the close; a lane last week shipped good work and filed none.

Your close records: the delta, board by board; each of the four corrections proven by violation in both
directions on a real `bastrop_tx` record; the repeat-offender decision and its reason; the work-order
free-text check; the design check's matched-input count; and the non-production proof with
`source_commit_hash` read back verbatim.

State your snapshot in your first output: repository, branch, commit.
