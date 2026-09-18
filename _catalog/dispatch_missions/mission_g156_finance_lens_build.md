## Mission — G-156: build the Finance lens, the first row in the serial dashboards queue

You launch no sub-agents (FAN-DEPTH 0). You own `smartcity-dashboards` for this row only. You fix
your own failed builds rather than escalating them. **You do not ship to production**; see "Where it
goes" below.

Read the G-156 row in `90_operations/OPS-17_govtech_stack_plan_of_record.md`, then
`_design/smartcity-finance-lens/README.md` in full, then OPS-17 A-144 for why you are running alone.

### You are the first of six, and you run alone on purpose

Every lens renders in two monolithic files, `web/app.js` (131,149 bytes) and `web/index.html`
(145,758 bytes). Six lanes in parallel would be a six-way merge conflict in those two files, so the
dashboards rows run one at a time: G-156, then G-149, G-153, G-154, G-152, G-151. **Your PR must be
merged and verified before the next row is dispatched**, so keep your change inside the Finance lens
and do not refactor shared rendering code on the way through. If you find you cannot build Finance
without touching shared structure in those files, stop and say so in CP1 rather than doing it; that
changes the queue for everyone behind you.

### What this lens is, and the stance that governs every call you make

`_design/smartcity-finance-lens/`, RATIFIED 2026-09-17, carrying a `check.mjs`. Drawn at FULL SHAPE
against `SmartCity OS Screenshots (2).pdf`, 25 pages of the v1 live Finance tab supplied by the
operator 2026-09-15, cited page by page in `capture-figures.json`.

**The operator correction that is the design's spine (2026-09-15): removing the v1 fabrications IS
the gap analysis, not the product.** v1 has one state, a number, and that is the defect expressed
once. This lens has every cell either measured or countably UNACCOUNTED, and every unaccounted cell
carries a named acquisition path.

**The failure this row exists to prevent is you "improving" it.** Every instinct will say fill the
cell nobody acquired, show a zero instead of a gap, round a figure into looking sourced. Do not. An
unaccounted cell is legitimate at rest and is the honest state of this data. Never render an
unaccounted cell as zero, and never convert it to a value to make the page look finished.

### Acceptance items, each verified by violating it

**Every money figure traces to `capture-figures.json`.** The design's check refuses any money figure
not traceable to the capture record. Plant an untraceable figure and confirm the check fails, remove
it and confirm it passes.

**Absent, zero and unaccounted are three different states and render three different ways.** Prove it
with a fixture that exercises all three on the same surface. A fabricated zero is worse than an
absence because it enters sums without announcing that it was invented.

**The fund ledger stays UNACCOUNTED.** The design records that v1 reads one of four required sources,
corrupts one and fabricates two, and that the fund ledger is absent in v1 with v1 itself saying so in
a caution. Carry that absence honestly; do not source it from anywhere to fill it.

**`node _design/smartcity-finance-lens/check.mjs` passes on the built surface** with a NON-ZERO
matched-input count, and fails against a planted violation in both directions. A check observed only
passing has not been observed working.

### Explicitly NOT this row

**The filings surface.** `smartcity-finance-filings` is RATIFIED and **G-138 still blocks its build**:
two figures are printed with citations to external authorities that trace to nothing, and one of
them, `Ordinance rate 7.00%`, drives a worklist that would accuse Bastrop's own taxpayers of filing at
the wrong rate, citing a rate we invented and attributed to their law. Build nothing from the filings
design, and do not wire the Localgov feed (G-137, blocked on credentials). If the Finance lens design
reserves a region for filings, render it as not yet connected, the way the lens already treats
absence.

Also out: RBAC (G-134, G-127, G-144), the city management board (G-157), any other lens, any
DigitalOcean configuration change, and any change to `sc-kit.css`, which is frozen and byte-identical
across three repos.

### Where it goes, and the one thing held for the operator

**Build, merge to `main`, prove on the non-production DigitalOcean app. Do NOT ship to `dolphin-app`.**

The D-12 lane left a non-production app, `d12-main-uat`, running as the repeatable proof target. Prove
your build there. `dolphin-app` serves `app.smartcityos.io`, which is production, and its
deploy-on-push is DISABLED, so your merge reaches no customer by itself.

**Why production is held:** the operator bundled proper RBAC into the same deliverable as Finance.
Finance is already a lead lens every signed-in user can see, and v1 shows its Finance tab to
everyone, so building it changes no exposure. But whether real financial data SHIPS before RBAC
exists is the operator's call, and it is made at ship time, not by this lane.

**On any DigitalOcean deploy, read back the commit it is actually running.** OPS-25 governing rule 13,
earned on D-12 this week: a deployment reported `build=SUCCESS deploy=SUCCESS`, went ACTIVE on branch
`main`, and was running a commit from BEFORE the change. Nothing in the deployment record said so.
Read `services[0].source_commit_hash` back and compare it to your merge commit. If they disagree,
`POST /v2/apps/{id}/deployments` with `force_build`. A successful deploy message is not evidence.

### Close

Declare your `leave_behind` block. "None" is valid and cheap; the declaration is required regardless.
**File CP1, CP2 and the close.** The G-150 lane shipped good work this week and filed none of them, so
its second gate has no record; do not repeat that.

Your close records: the merge commit; each acceptance item's violation in both directions, named per
item; the `check.mjs` matched-input count; the three-state fixture result; and the UAT proof with
`source_commit_hash` read back verbatim.

State your snapshot in your first output: repository, branch, commit.
