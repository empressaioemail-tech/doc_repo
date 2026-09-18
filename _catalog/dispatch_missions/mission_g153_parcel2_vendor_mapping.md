## Mission - G-153 parcel 2: the vendor mapping, which is what decides whether the two lenses are useful

You launch no sub-agents (FAN-DEPTH 0). You WRITE in `smartcity-dashboards`. You write nothing in
`doc_repo` (`_design/` is planner-owned; hand any doc edit back as a diff, uncommitted) and nothing in
`smartcity-os`.

### READ THIS FIRST: you are the next dashboards lane, and only one may run
    10|
Every SmartCity lens renders into two monolithic files, `web/app.js` and `web/index.html`, so two
dashboards lanes in parallel is a merge conflict generator rather than a speedup (OPS-17 A-144).
**`g152-public-works-fire-ems` holds the dashboards slot when this dispatch is written. Do not begin your
first write until its close is filed.** Read `_inbox/2026-09-18_g152-public-works-fire-ems_close.json`
(and its CP1/CP2) before you start: its close is the current record of what the shared files look like,
and it will have changed `web/app.js` and `web/index.html` under you. **If that close is not in this
repo's `_inbox`, check `P:/seat-worktrees/dispatch-planner/doc_repo/_inbox/` before concluding it is
missing** closes have stranded inside a lane's own worktree before, where nothing in this repo reads them
(OPS-17 A-161), and that is where this queue's lanes file.

This parcel exists because of a measurement, not a preference. `g153` built the Fleet and Police lenses
and then proved, by violation against the REAL live records rather than fixtures, that **102 of 102 live
fleet and patrol records fail their declared shape.** The guard it added is correct and does its job: it
refuses them with the faults named. So the delivered lenses answer `refused` on both regions, which is a
declared absence and not a blank, and until this parcel lands the two lenses show nothing useful. This is
the next unit of work; it is not another guard.

### The measured faults, which you must reproduce before you change anything
    20|
The three faults were produced by the branch's own `recordShapeFaults` over the live payloads, 75 Samsara
and 27 Spireon:

- `102x status must be one of out-of-service, inspection-due, in-shop, in-service`. Samsara reads
  `unknown`; Spireon reads `Stopped` / `Idle` / `Moving` / `Unknown`.
- `75x fleet-vehicle requires operatorRef` and `27x patrol-vehicle requires operatorRef`. `operatorRef`
  is populated on **0 of 102** records.
- `75x fleet-vehicle requires odometerBand`. Declared, and never populated by Samsara.

**Re-run the refusal yourself against the live payloads before you map anything, and paste it.** The
counts above are a claim about 2026-09-18 and the vendors are live; if they have moved, say so.

### The question this parcel actually has to answer, and it is not "write a mapper"

The three faults are not the same kind of thing, and collapsing them is the defect this operation keeps
producing.

1. **The status enums are genuinely a translation.** Samsara's and Spireon's vocabularies are different
   FROM each other and from the declared enum. Mapping them is real work. **Map only states you can
   justify from the vendor's own documentation or payload semantics, and refuse the ones you cannot.**
   Samsara's `unknown` is not a state: it is the absence of one. **Do not map `unknown` onto a member of
   the enum** it would be a fabricated value that reads as measured, which is the exact defect class
   `ENFORCEMENT.md` opens with. If it must reach the surface, it is the absent case, named.
2. **`operatorRef` on 0 of 102 is not obviously a mapping problem.** Before you synthesize anything,
   establish whether the vendor payload carries an operator identity AT ALL. If it does not, then **the
   declared shape is wrong and the data is right**, and the correct fix is to declare the absence
   truthfully rather than to invent a reference from a nearby field. A reference you construct from
   something that is not an operator identity is a binding that was not resolved, and `ENFORCEMENT.md`
   prohibits exactly that. Resolve this by reading the payload, and state which of the two it is.
3. **`odometerBand` is declared and never populated.** A required field no source ever supplies is
   either a missing upstream capability or a shape that over-declares. Same rule: decide which, from the
   payload, and say so.

**The one thing you must not do is make the guard stop firing by loosening it.** Widening
`recordShapeFaults` or the declared shape so that live records pass is the defect this whole program is
about. The guard is the second derivation; if you weaken it the finding disappears and nothing was fixed.
If you conclude a shape clause is itself wrong, that is a legitimate and important finding: change the
shape deliberately, keep the guard strict against the new shape, and put the reasoning in your close.

### Acceptance, verbatim from the row (parcel 2 adds no new row)

> Both `check.mjs` pass on the built surfaces with non-zero matched-input counts and fail against planted
> violations in both directions; the Live Fleet and Police regions render records rather than `refused`,
> with any remaining refusal naming its fault; and both are reached on the DO app per D-12

### Proving it, and what a merge does not do

- **A merge to `main` ships nothing.** `deploy_on_push` is unset on all three apps by D-12's deliberate
  posture, so any ship is a deliberate act with `source_commit_hash` read back byte for byte per OPS-25
  rule 13.
- **Prove on a NON-PRODUCTION DigitalOcean app** (A-146 rule 4), never on `walrus-app` and never on
  production traffic. Prove the refusal first, on the pre-fix commit, so the guard is shown able to fire
  before you change what it sees.
- Read the authoritative record per side: the serving revision's image DIGEST, not the tag requested.
- The `bastrop_tx` verification key is recorded in `_catalog/credential_access_index.json` with a
  one-command `howToUse`. You do not need to ask a human for it, and you must not place your own key in a
  file under `P:\tmp`.

### Boundaries

- Write only in `smartcity-dashboards`. `doc_repo` edits come back uncommitted as a diff.
- You do not deploy, merge or publish unless the dispatch names you as the deployer. If you do not
  deploy, prove what is provable in a harness, name the clause that needs a deploy, and do not claim a
  live pass you did not observe.
- One PR, branched from `smartcity-dashboards` `origin/main` with the SHA declared.
- **The two design dumps in `doc_repo` are NOT yours to recapture.** They currently declare the bare
  `OPR-\d{2}` reference form while the code mints `FL-OPR-nn` and `PV-OPR-nn`. A recapture is
  planner-owned and is deliberately deferred until this code settles, so that one recapture serves both.
- Declare your snapshot (repo, ref, moment read) in the check's own output.

### Evidence your close must carry

- The reproduced refusal over the live payloads, with the three fault counts.
- For each of the three faults: what you concluded (translation, wrong shape, or missing upstream) and
  the payload evidence that decided it. `operatorRef` and `odometerBand` must have an explicit verdict.
- Before-and-after renders of the Fleet and Police regions, or a named statement of the clause that still
  needs a deploy.
- Both `check.mjs` re-run with non-zero matched-input counts, and the planted-violation run for each.
- The DO-app reachability evidence with its vantage point, or the unmeasured clause named.
- Your scratch block (LESSON / DEAD-END / GROUND-TRUTH with a timestamp / OPEN), returned in the close.
