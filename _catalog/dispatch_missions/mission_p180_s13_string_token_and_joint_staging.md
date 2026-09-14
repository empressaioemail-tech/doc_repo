## Mission — the walk's S13 admits a non-string as a provenance token, so an earned retirement is graded as if it had served a bad provenance; fix that, then republish 48209 in ONE joint run and come back for the go

You are the deepest worker in OPS-23 wave 6, succeeding the `p178-publish` lane whose close is
`_inbox/2026-09-14_p178-publish_close.json` (status `blocked`, on this exact ruling). You do not
spawn sub-agents. The dispatch planner supervises you and reviews CP1 and CP2.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail, a dev server, or an unwaited Cloud Run job
behind. If you find a publish already in flight, do NOT start a second one — see step 3.

### The ruling you execute (operator, 2026-09-14 — S13 option (a))

The P-180 retirement pass (`A-146` option B) did what it was asked: the 16 excluded hollow nodes no
longer trip `BP-PUBLISH-RUN-01`, and the counts are exactly right. The walk is nonetheless RED, all
16 graded `S13`, and the mechanism is a false positive in the walk itself — the planner verified
both halves at source:

- `src/stages/grade/s-rules.mjs:698-705` — `servedProvenanceTokens` maps the three provenance keys
  and filters `.filter((t) => t != null && t !== false)`. A **non-string object survives that
  filter** and is handed to the provenance allowlist as though it were a token. An earned
  retirement is facts-free, so what it serves is a mirrored *refusal* object
  (`verdict: "refused"`, `authority: "unresolved"`, `serveLayer: "zoning"`), and the allowlist
  rejects it.
- `src/stages/grade/v-rules.mjs:74-76` — `isNonPassGrade` returns
  `grade === "FAIL" || grade === "KNOWN_OPEN"`, so `UNMEASURED` is NOT a non-pass grade.

So the chain is: admit only strings -> the refusal object yields **no** token -> `S13` lands on
`UNMEASURED` -> acceptable -> the 16 grade `RETIRED` and the walk goes green. **The operator ruled
option (a): make `servedProvenanceTokens` admit only string tokens.** An object can never be a
valid provenance token, and declining to grade provenance on a row that by construction has none is
correct rather than evasive — but see the falsifiers, because a filter that admits less is exactly
the shape of change that can silence a real signal.

### Where you work

One `hauska-factory` worktree, new branch off `origin/main`. The walk (`src/jobs/verify-walk.mjs`,
`src/stages/grade/s-rules.mjs`, `src/stages/grade/v-rules.mjs`) AND the publish pin
(`cloudbuild.publish.yaml _LDT_SHA`) both live in this one repo, so you need only the one checkout.
Declare your start commit. `_LDT_SHA` is already `bae48d406f7595af3d47111b558d0ebc3efd9c56` (P-183,
#148) on `origin/main` — confirm that, and do not move it.

Worth reading before you start: the worktree `hauska-factory-ctx-walkrule` on branch
`fix/ctx-walkrule-retired-grading`, which by its name has been near this grading before. If it
already carries a partial version of this change, say so and reconcile rather than re-deriving.

### What is true today (re-verify at your start; `_inbox/2026-09-14_p178-publish_cp2.json` and `..._close.json`)

- The staging publish `b0864dde` **baked successfully** (`publish_runs.status = succeeded`, walk id
  `c636b630`) and then **failed its walk**: `runs.refuse_code = WALK_FAILED`, 86 graded, 70 pass,
  16 fail, all `S13`. `BP-PUBLISH-RUN-01` occurs **0** times.
- The 16 are `48209:38774` and `48209:84629` through `84648` (gaps included: 84629, 84630, 84631,
  84635, 84636, 84637, 84639, 84641-84648). Every one has **zero** `txgio_parcel` rows for 48209 —
  they are exactly P-180's excluded population.
- Counts on staging: `173,050` current-run rows, `0` stale, `116,421` fact + `56,629` retirement =
  `173,050` exactly; `0 of 56,629` excluded nodes carry any fact-shaped key.
- The image that ran was built from LDT `84f4e7c9` (#686, P-180 only). **No image has ever been
  built from `bae48d40`**, so #148's P-183 own-row geometry fix is unexercised on staging — that is
  what this lane's joint run fixes.
- A second party ran the whole step-2/step-3 sequence against the shared project on 2026-09-14
  between 13:30Z and 13:43Z, including a staging reset that destroyed the prior mixed state. The
  predecessor correctly refused to double-run. Treat the staging store and the Cloud Run job as
  shared resources with no lease: take the job lease explicitly before you reset.

### What you build, in order

1. **The fix.** In `servedProvenanceTokens`, admit only string tokens (the function already filters
   `null`/`false`, so extend that filter rather than restructuring it). Add a test that fails when a
   non-string is passed through as a token, AND a companion test that a genuine off-allowlist
   **string** still fails `S13` — the change must reduce false positives, not silences. Merge on the
   conclusion string, and quote the conclusion strings, not `gh pr checks` printing "pass".
2. **The joint build, and PROVE it is joint.** Build the image from the current pin and read the
   **deployed digest** back — do not infer the pin from `origin/main`, which is precisely the error
   the predecessor's close records as *"a pin-merge is not a pin-deploy"*. Resolve which LDT SHA the
   digest you are about to run actually carries, and state both (factory merge sha and LDT sha)
   before the run. If the digest does not carry `bae48d40`, stop and report — the run would be
   P-180-only and would not exercise P-183.
3. **Staging publish, 48209, gold 97658.** Reset staging, take the job lease, publish, read the run
   row and the walk verdict, and paste the stamp counts. **If an identical publish is already in
   flight, do not start a second one** — wait it out with a bounded terminating poll and read its
   result, and say so.
4. **Both predicates, not just one.** (a) The walk's **overall verdict is `pass`** — see falsifiers.
   (b) P-183's own predicate, which is independent of the walk: the five Sturgeon nodes' served
   record points, read through the point-keyed leg. The predecessor established that a red walk does
   not prevent this measurement, so measure it either way.
5. **Return to the planner for the go.** Step 4 of the predecessor's mission (the PRODUCTION
   publish) is a serving-store write and is **NOT** in your scope. Stop at CP2 with the staging
   verdict and counts, and let the planner request the gate.

### Falsifiers, pre-registered

- **If the walk's overall verdict is not `pass` after step 3, this lane has not succeeded**,
  regardless of whether the individual counts are right. This is the falsifier the predecessor's set
  was missing: on 2026-09-14 every pre-registered check cleared while the walk was still red,
  because the set tested the stamp and not the walk's other grade families. Do not close a
  partial-green walk as green.
- **If a parcel that serves a genuinely off-allowlist *string* provenance no longer fails `S13`,
  you have silenced a real signal** and the fix is wrong. Demonstrate both directions.
- If any of the 16 no longer grades `RETIRED`, say which and why.
- If the current-run row count differs from `173,050`, or any excluded node serves facts, or
  `BP-PUBLISH-RUN-01` fires on any node, the retirement pass regressed — name the population.
- If the digest you ran does not carry `bae48d40`, the run is not joint; say so rather than
  attributing a green walk to P-183.

### Out of scope

The PRODUCTION publish (the planner requests the operator's go). The record store and the P-183
source fix — you consume #148, you do not change it. Williamson (P-184). `FIGURE-IN-PAYLOAD` and
`NO-CONTAINING-POLYGON` (other open items). The seven `get_smart_site` card reads, which the planner
does with its own connector. Which Bastrop source is right in law (F24 is resolved by A-148).

### Close

`_inbox/<date>_p180-joint_staging_close.json`, `planRows` `["P-180", "P-183"]`, with your start
commit, the fix PR and merge sha with its conclusion string, the two-directional test evidence, the
factory merge sha AND the LDT sha the deployed digest carries (both stated explicitly), the run id
and walk id, the walk's overall verdict, the stamp counts, the two predicates, and the planner's
probe artifact if it has run. `leave_behind` is required. If you stop at a checkpoint, write CP2
rather than a close.
