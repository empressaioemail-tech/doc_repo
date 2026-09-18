## Mission - G-152: build the Public works and Fire and EMS lenses

You launch no sub-agents (FAN-DEPTH 0). You WRITE in `smartcity-dashboards`. You write nothing in
`doc_repo` (`_design/` is planner-owned; `g148-design-instruments` has CLOSED and the four folders it
delivered now carry instruments that FAIL against their own boards, carded as G-164, so a failing
design instrument is not proof you broke something) and nothing in `smartcity-os`. Hand any `doc_repo`
edit back as a diff, uncommitted, and the planner commits it.

### READ THIS FIRST: the queue in front of you has CLEARED

Every SmartCity lens renders into two monolithic files, `web/app.js` and `web/index.html`, so two
dashboards lanes in parallel is a merge conflict generator rather than a speedup. That ruling is
OPS-17 A-144 and it stands, and it still means one dashboards lane at a time.

**`g153-fleet-police-lens` HAS CLOSED, and the wait this section used to impose is over.** Its close is
filed at `_inbox/2026-09-18_g153-fleet-police-lens_close.json`, `closedAt 2026-09-18T20:38:32Z`, seat
`cente-vsc-g153`, and the planner has committed the two `_design/*/check.mjs` it left uncommitted in
the integration tree. **You are the only dashboards lane. Do not wait for a close that is already on
disk.** Re-run `node scripts/lane-claim.mjs status` yourself before your first write: every claim in
the registry is STALE today and none of them is a SmartCity lane, which is the state you should expect.

**Two things g153's close tells you, and both bear on your run.** (1) It closed `CLOSED-PARTIAL` and
not `CLOSED`, for exactly the clause your own acceptance also ends with: the DO app still serves the
pre-fix build, because `deploy_on_push` is unset by D-12's deliberate posture. Expect the same shape.
Prove everything provable in a harness, name the deploy clause you could not reach, and do not claim a
live pass you did not observe. (2) Its largest `leave_behind` is unowned and is **not yours**: every
live fleet and patrol record fails its declared shape (102 of 102, including the status enum,
`operatorRef` and Samsara's `odometerBand`), so once Fleet and Police deploy, those two regions read
`refused` with the faults named. That is a declared absence and not a blank. Do not let a sibling
region's declared absence read to you as your own regression.

If you find an uncommitted tree in `smartcity-dashboards` that is not yours, that is a sibling lane's
work: STOP and report rather than cleaning, stashing or committing it.

Your lane's claim is the record that says you started. Claim it before your first write.

### What is true at source, and what the queue position changes

- Both designs are RATIFIED 2026-09-17 and both already carry a `check.mjs`:
  `_design/smartcity-public-works-lens/` (4 artboards) and `_design/smartcity-fire-ems-lens/`
  (2 artboards). The planner re-ran both on 2026-09-18T20:2xZ: **both pass, exit 0, with non-zero
  matched-input counts** (`pairs=14, badges=77, cells=69, numbers=188, cipIds=10, queueRefs=11`;
  `pairs=4, badges=37, chips=12, cells=72, numbers=116, faIds=12, stnRefs=15`). You inherit these
  instruments rather than rebuilding them.
- **These two folders carry `check.mjs` but NO `violate.mjs`.** Their violation proof is embedded as
  self-tests inside `check.mjs`, which prints `self-tests: N/N passed, both directions` before it
  reads a board. That is the older convention. A-139 records that Police and Fleet shipped a separate
  `violate.mjs` and recommends it become the convention; do not retrofit one here, and do not report
  the absence as a defect.
- Both designs draw their own vendor-blocked state as design content, verified at source 2026-09-17.

### What to build

The two designs, into the shipped product, on the DO app. Non-obvious things that are the point of
each design rather than decoration:

- **Public works carries two regions of different UNITS, so they SWITCH rather than stack.** Do not
  normalise them into one scale and do not stack them.
- **Its capital-projects matrix renders eight of twenty cells as CANNOT OCCUR by the product's own
  rule**, hatched, BESIDE four measured zeros. That is a fourth state next to absent, zero and
  unmeasured, and collapsing any two of them is the defect the design exists to prevent.
- **Its call analytics is drawn once as the grid its two shipped tables are the two margins of**,
  reconciling to 2,365 both ways.
- **No figure of money appears anywhere on Public works**, and its `check.mjs` refuses one.
- **Fire and EMS is small multiples per station, not a rollup**, because the domain module's own brief
  says a rollup cannot tell you which station is carrying the shortfall. Twelve of twelve on the page,
  nobody named.
- **Both blocked boards name the obstacle as a vendor ENTITLEMENT or an uncompleted OAuth consent, and
  say plainly that nobody reading the screen can fix it.** Do NOT convert either into an error state,
  a retry affordance, or a "contact support" path. GoTo (`goto_not_authorized`, nobody completed the
  consent) and FirstDue (403, the credential lacks the apparatus and assets scope) are
  vendor-onboarding work tracked outside this row.

### Acceptance, verbatim from the row

> Both `check.mjs` pass on the built surfaces with non-zero matched-input counts and fail against
> planted violations in both directions; the Public works matrix renders cannot-occur cells
> distinguishably from measured zeros and from unmeasured, proven by a fixture exercising all four
> states; no money figure appears on Public works anywhere; Fire and EMS renders twelve of twelve
> per-station multiples with nobody named; each blocked board states the obstacle as an entitlement or
> consent and offers no retry; and both are reached on the DO app per D-12

### Proving it, and the one thing you must not do

- **A merge to `main` ships nothing.** `deploy_on_push` is unset on all three apps by D-12's deliberate
  posture, so every ship below is a deliberate act with `source_commit_hash` read back byte for byte
  per OPS-25 rule 13.
- **The done-condition is the DO app at the post-D-12 commit, verified by edge header from a vantage
  point outside this fleet host, never by a merged PR.** Code-done is not customer-done.
- Read the authoritative record per side, never a proxy: the serving revision's image DIGEST, not the
  tag that was requested.
- **A vendor credential failing is not your defect to fix and must not be made to render as one.** If
  GoTo or FirstDue answers 403, the blocked board is correct and the run continues.

### Boundaries

- Write only in `smartcity-dashboards`. `doc_repo` edits come back uncommitted as a diff.
- You do not deploy, merge or publish unless the dispatch names you as the deployer. If you do not
  deploy, prove what is provable in a harness, name the exact clause that needs a deploy, and do not
  claim a live pass you did not observe.
- One PR, branched from `smartcity-dashboards` `origin/main` with the SHA declared.
- Declare your snapshot (repo, ref, moment read) in the check's own output.

### Evidence your close must carry

- Both `check.mjs` re-run on the built surfaces, pasted, with matched-input counts non-zero.
- The planted-violation run for each, named, so the instrument is shown able to fail.
- The four-state fixture for the Public works matrix (cannot-occur vs measured zero vs unmeasured vs
  absent), with the rendered output.
- Where the two blocked boards state entitlement/consent, quoted, plus the assertion that no retry
  affordance exists.
- The DO-app reachability evidence with its vantage point, or an explicit statement of which clause
  still needs a deploy.
- Your scratch block (LESSON / DEAD-END / GROUND-TRUTH with a timestamp / OPEN), returned in the close.
