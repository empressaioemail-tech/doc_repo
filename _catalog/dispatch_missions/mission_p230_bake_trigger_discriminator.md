## Mission — P-230: does the bake refresh on a cell write, or does nothing enqueue it

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

### Where you work

`legacy-design-tools`. No worktree exists yet for this lane. Clone fresh from `origin/main`,
cut your own branch, and declare the commit you started from before you write anything. A
concurrent lane (P-241, ETJ acquisition build) may still be in flight in this same repo,
scoped to `lib/cad-ingest/src/boundary/` and `lib/db/src/schema/` — do not touch either; this
row has no reason to.

### The defect, quoted from the row (A-153-era carding, do not weaken the framing)

"Cells are written, the gate sees them, and the customer surface serves a bake from before the
write. This has now fired on two independent rows and is the reason a close cannot be graded
on a gate verdict." Two real instances: **P-200** — after the Hays setback apply, `get_smart_site`
on the gold parcel returned `not-cut-over` with the identical `runId` and `bakedAt` as before
the apply. **P-211** — after a 107,544-cell envelope apply whose delta matched its dry-run
exactly, `get_smart_site` depth=node on `48209:100226` (a parcel independently confirmed
touched by direct SQL, `maxHeightFt = 25`) still read `maxHeightFtFact` and its siblings as
refused/not-cut-over with a `bakedAt` that **predates the apply**.

### Two hypotheses, do not assume the cheap one

"(a) the bake is scheduled and simply has not run for these parcels, in which case the gap is
latency and the fix is triggering or scheduling it; or (b) nothing re-bakes a parcel when its
cells change, in which case the gap is structural and a cell write must enqueue its parcel. Do
not assume (a) because it is cheaper." This is your actual job: discriminate, with a real read
of the bake's trigger code, not an inference from symptoms.

### What I traced this session, grounding you, not replacing your own read

Reviewing an unrelated PR (P-210, coverage-check endpoint) this session, I read the actual
`get_smart_site` call chain end to end: `get_smart_site` (smartsite-mcp) calls `POST /api/
property-explorer/v1/research/brief`, whose `assembleNodeBriefBody`
(`artifacts/api-server/src/routes/propertyExplorer.ts`) is gated by
`readBakedNodeFacetSnapshot` (`artifacts/api-server/src/routes/brokerageNodeFacets.ts`), whose
own query is `SELECT ... FROM place_layer_snapshots WHERE adapter_key IN (tier1, tier2) AND
place_key = 'node:{fips}:{propId}'`. **This confirms the row's framing: the serve reads a
BAKED, materialized table, not a live ledger cell — the open question is only whether and how
that table gets refreshed when the underlying cells change.** Separately, A-173 (2026-09-14)
names the writer of this exact table: `legacy-design-tools/artifacts/api-server/src/
nodeFacetBakeTier1ConformantCli.ts`, which reaches any environment only through
`hauska-factory`'s pinned `_LDT_SHA` — meaning the bake may run as a Factory-triggered job
rather than something this repo schedules on its own. Start there; do not assume the trigger
lives entirely in this repo without checking.

### Do not conflate this with the settled A-184 ruling

**A-184 (2026-09-16) already ruled on a related but DIFFERENT question**: whether counties
outside the six-county ledger (19 of them, per P-291, holding 5.14M Tier-1 bake rows with NO
ledger data at all) should keep serving bake-only answers. The operator ruled yes, with a
declared "not yet verified" disclosure. **That is not this row.** P-230 is about a county
WITH ledger writes — a real cell write landed, verified at the data layer — and the bake still
doesn't reflect it. Do not re-litigate A-184's scope question; this row is narrower and still
genuinely open: is there a working trigger that just hasn't fired yet for these two parcels, or
is the trigger itself missing.

### Predicate (quoted from the row, do not weaken it)

"The mechanism is named by reading the bake's trigger, a written cell demonstrably reaches
`get_smart_site` for a named parcel with a `bakedAt` LATER than the write, and any close that
claims a rail is served cites that read rather than a gate verdict."

### Falsifiers, pre-register your answers before you run anything

1. **Read the bake's trigger mechanism directly** — a cron, a Cloud Run job schedule, a queue
   consumer, a manual CLI invocation, or nothing at all. Name the exact file and mechanism.
2. **Reproduce hypothesis (a) or (b) live, don't infer it.** Pick one already-written, still-
   stale parcel (P-200's Hays gold parcel or P-211's `48209:100226`) and either (a) trigger
   whatever the real scheduling mechanism is and confirm the bake catches up, proving it's a
   latency gap and naming the real cadence, or (b) confirm nothing in the write path enqueues
   the parcel for a re-bake at all, proving it's structural.
3. **A fresh write, end to end.** Write (or find a way to safely trigger) a real cell change on
   a test parcel and time how long until `get_smart_site` reflects it with a `bakedAt` later
   than the write — or confirm it never does without manual intervention.
4. **Does this affect the six onboarded ledger counties specifically**, or only the broader
   19-county bake-only population A-184 already covers? This determines whether the fix is
   urgent for every close this program has graded so far, or narrower.

### Known traps

- Do not assume the fix is "just run the bake more often." If the mechanism is (b) — nothing
  enqueues a changed parcel — a faster schedule just narrows the window without closing the
  structural gap, and a full re-bake of the whole table on every schedule tick may be its own
  cost problem. Name which fix class actually applies before proposing a schedule change.
- `nodeFacetBakeTier1ConformantCli.ts` is reached "only through hauska-factory's pinned
  `_LDT_SHA`" per A-173 — if the trigger genuinely lives in hauska-factory (a job scheduling
  this CLI), say so and scope the fix there; do not force it into legacy-design-tools if the
  read doesn't support it.
- This row explicitly says "every close in this program graded on a gate verdict has been
  grading something the customer may not see." That includes P-201, P-206, P-242c, and
  everything else merged and deployed this session — if your read finds those are ALSO
  affected, say so plainly; that is exactly the kind of finding this row exists to surface.

### Do not

- Do not build the fix yet if the discriminator alone is a full session's work — naming the
  mechanism with real evidence is itself the close-worthy result this row asks for. If you have
  budget left after discriminating, propose the fix; do not feel obligated to ship it in the
  same pass.
- Do not touch `lib/cad-ingest/src/boundary/` or `lib/db/src/schema/` (P-241's scope).
- Do not deploy. Open the PR green (or file the finding, if no code changes) and hand it back.
- Do not spawn sub-agents.

### Close

State your snapshot (repo, branch, commit). Name the exact trigger mechanism (or its absence)
with a file citation. Paste the real timing/reproduction evidence from falsifier 2 and 3. State
plainly which hypothesis (a) or (b) is correct, or whether it's a mix. Declare `leave_behind`
explicitly, including whether this affects the six ledger counties' own closes retroactively.
