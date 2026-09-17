## Mission — P-260 and P-263: one setback source, and envelope outcomes that mean what they say

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-engine` and open ONE PR. You do not
merge, do not deploy, and **you do not apply any write to a store**: P-263's correction runs as a
DRY RUN whose counts come back to the operator.

### Where you work

`hauska-engine`, fresh clone from `origin/main` under `P:/tmp/` into a NEW directory, branch
`fix/p260-p263-setbacks-and-envelopes`. Declare the start commit (engine main `3809275f` at
compile, which carries P-299's corpus pin and re-vendored slate, P-308 and P-275). Register the
clone under the property seat and remove the entry at close. Heavy reads take a heavy-scan lease
keyed on the store's HOST (P-307). A controls lane (P-273/P-274) is also open in this repo on the
edge-starvation self-compare; stay out of that file and say in your close if you must touch it.

### Row P-260 — one setback registry, and a row for every wired city

The engine's jurisdiction descriptors read their OWN tables, which is why all 509,928 Hays
boundary-edge atoms carry "No setback table configured for jurisdiction descriptor", and verified
promotion is registered only for Bastrop, Elgin and Lockhart. P-299 (merged today) already pinned
the engine to `@empressaio/setback-corpus@1.4.0` exactly and corrected the 14 vendored tables, and
its close measured the distance that pin closed: 87 districts the corpus had and the engine did not,
9 renames, 56 districts with changed fields, 91 per-field state transitions.

**Done:** the engine reads the corpus the factory writes from, rather than a parallel copy; a
divergence test fails when one side is edited alone; per-edge setbacks match the record on the Hays
test parcel; and every wired city in the six counties has a registry row whose cohort count matches
the ledger. Where a city has no ruled table, the registry says so rather than being silent.

### Row P-263 — retire the mislabelled breadth-bake envelope outcomes

490,185 `no-buildable-area` atoms in the six counties, mostly "unzoned" (208,868) or "not onboarded"
(153,775). **Done:** `unzoned` becomes `not-applicable` with its reason; `not onboarded` becomes
whatever the current ledger supports; a writer can no longer emit `no-buildable-area` without a
computed, verified zero; no atom carries `no-buildable-area` with a "no district" or "unzoned"
reason; and P-253's false-zero guard goes red if one is written.

**The apply is not yours.** Run it as a dry run under P-213's blast-radius refusal and P-281's
heavy-scan lease, and report per county: how many atoms move, from which reason to which state, and
how many the change cannot classify. The operator authorises the write.

### What changed today that you must not re-derive

- P-256's applies landed: the six counties' setback cells are now value / refused / not-applicable /
  unaccounted, and every previously unearned absence is gone (219,472 parcels).
- P-303 draws the "not onboarded" class on the panel and P-304 withholds the area figure without a
  verified atom. Your correction is at the SOURCE; do not undo either surface behaviour.
- The engine now omits a flagged height rather than serving the 999 placeholder (P-299).

### Falsifiers — pre-register your predictions before building

1. A Hays boundary-edge fixture resolves a setback table through the corpus (the "No setback table
   configured" string does not appear), and a city with genuinely no table still says so.
2. Editing one side of the setback pair alone makes the divergence test fail.
3. A writer asked to emit `no-buildable-area` with an "unzoned" reason fails a test.
4. The P-263 dry run's per-county totals sum to the 490,185 population, with every atom in exactly
   one bucket, and the run writes nothing (prove it by reading the store after).

### Do not

- Apply P-263's correction, publish, or write any store.
- Merge or deploy.
- Edit the factory or LDT.
- Launch sub-agents.

### Close

Snapshot; files touched; the PR with every CI check's literal conclusion string; P-260's registry
table (city, rows, cohort count, ledger count); P-263's per-county dry-run movement table with its
counting rule; the falsifiers with evidence. `status`: `closed-partial` until the integration seat
merges, deploys and runs P-263's apply on the operator's go. `probe`: `{"notApplicable": "engine
build lane; graded by the apply and by P-264's re-derive"}`. `subAgents`. `leave_behind`.
