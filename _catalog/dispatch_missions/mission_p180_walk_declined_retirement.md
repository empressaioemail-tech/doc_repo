## Mission — the walk grades a DECLINED EARNED RETIREMENT as a meaning failure, so no gate-blocked county can ever walk green; fix the grade from two independent sources, and prove it in BOTH directions

You are the deepest worker in OPS-23 wave 6. You do not spawn sub-agents. The dispatch planner
supervises you and reviews CP1 and CP2.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that could
hang in `timeout`; never leave a watch, a tail, a dev server, an unwaited Cloud Run job or an
unwaited `verify-walk` behind.

### The finding you are fixing (planner, measured — artifact `_inbox/2026-09-14_step4_restamp_outcome.json`, plan amendment A-152)

The operator-authorised production restamp of 48209 (`publishRunId`
`bc47625c-2de9-4c59-bec9-1e5fe0b313ce`, walk `065523f5-2fd6-4b62-84e0-ac0183d1b41e`) landed and the
walk came back **RED** — but NOT on the family anyone predicted. `sFamilies.failed` is `{}` with
`S13` present in `ruleIds`, so the joint digest's S13 fix (PR #149, factory `63aca2c`) **worked**:
S13 failures went 16 -> 0. The 16 now fail as **`BP-MEANING-01` with `reason` literally `"HTTP 404"`**
in `walk_results`.

The two walks are otherwise identical, same county, same digest, same 86 parcels:

- staging `8eacb135` — `verdict pass`, `retiredCount 16`, grades `{BP-MEANING-01 pass 69, RETIRED pass 16, BP-VERIFY-01 pass 1}`
- production `065523f5` — `verdict fail`, `retiredCount 0`, grades `{BP-MEANING-01 pass 69, BP-MEANING-01 fail 16, BP-VERIFY-01 pass 1}`

**The only difference is those 16 rows.** Mechanism: the bake writes an earned retirement; the
production serve DECLINES it (`shouldDeclineRetiredRecordAtServe`, `serveGuards.ts:200-233`, with
`LANDUSE_JOIN_DISABLED_FIPS_SEED = {48491, 48209}` at `joinNormalize.ts:93`); the route answers
`404 {"error":"not_baked","errorClass":"no_coverage"}`; the walk reads **through the serve**, sees no
row, and grades a 404 as a *meaning* failure. Staging serves the same rows, so the staging cortex-api
revision does not carry the decline — which is why the same digest passes there and fails here.

**Consequence:** no production publish of 48209 or 48491 can produce a green walk at ANY pin. The
restamp is DONE; do not fire another publish. Your change is the companion to PR #149 on the same 16
rows.

### THE TWO CONDITIONS — operator ruling 2026-09-14, both non-optional

**CONDITION 1 — derive the grade from TWO INDEPENDENT SOURCES, never from an exclusion list.**
Accept a 404 only where the **store independently holds an earned retirement for that node**
(`recordRetirement.status` `retired`, `verdict` `absent-verified`, **with a vintage**). A grade that
accepts a 404 *because the node was excluded from the work list* is **presence-shaped**: the publish
would be satisfying both halves of its own check, and **one party acting alone must not be able to
pass it**. So the acceptance predicate must be the conjunction of (i) the serve's typed refusal on
**this** node and (ii) an earned retirement for **this** node read from a source that is NOT the
publish's own excluded-work-list. Say in your close exactly which source (ii) is, how you read it, and
why it is independent of (i). If the walk cannot reach a store in its environment, that is a FINDING
to report — not something to work around by falling back on the exclusion list.

**CONDITION 2 — prove it in BOTH directions.** Re-running the walk against `bc47625c` shows only that
it now PASSES. You must ALSO show the walk still **FAILS** on a node that 404s with **NO earned
retirement** in the store. **A check observed only passing has not been observed working.** Both
directions must discriminate: revert the change and show direction 1's test fires (as PR #149's lane
did with its negative control).

### Where you work

One `hauska-factory` worktree, new branch off `origin/main`. The walk is
`src/jobs/verify-walk.mjs` + `src/stages/grade/s-rules.mjs` + `src/stages/grade/v-rules.mjs`. Declare
your start commit. Note the deployed pin is now the JOINT digest `sha256:bb3d7148` (factory `63aca2c`
+ LDT `bae48d40`), pinned on `factory-bastrop-publish`, `factory-staging-reset` and
`factory-verify-walk`; if your change needs to run on a job, read the digest back from the JOB by
field name — `runs.image_digest` and `runs.ldt_sha` are NULL for this job shape and can never tell
you.

Worth reading before you start: `src/stages/grade/s-rules.mjs`'s `servedProvenanceTokens` and its
comment block (PR #149's own reasoning — a row that by construction serves no provenance should not
be graded as if it served nothing). Your change is the same argument one step further out, and the
two must not contradict each other. Quote the FUNCTION NAME, not a line range; the merged tree is
already 2 lines off the ranges quoted in the previous dispatch.

### What you build, in order

1. **The fix.** A declined earned retirement must be an ACCEPTABLE served outcome. Write it so it
   CANNOT silence a genuine `no_coverage` 404 that has no earned retirement behind it — the refusal
   body alone is not sufficient evidence, and neither is the work list.
2. **The two-directional test**, on the same footing as PR #149's: direction 1 (a 404 for a node with
   an earned retirement in the store -> acceptable), direction 2 (a 404 for a node with NO earned
   retirement -> still FAIL), plus a negative control with the change reverted. Merge on the
   conclusion string, quoting it — not `gh pr checks` printing "pass".
3. **Prove it against production's EXISTING run, which is a READ.** Run `factory-verify-walk` with
   `--target=production --county=48209 --publish-run=bc47625c`. This exercises the fix on production
   against a run that already exists — **no store write, no publish, nothing at risk.** Read the
   walk's overall verdict and paste it. Watch the gold requirement: county 48209 has NO registered
   gold (`GOLD_PARCELS` registers only `48021:34137`), so `--gold=48209:97658` is required or the run
   refuses `GOLD_REQUIRED`. If a walk is already in flight, do not start a second one.
4. **Both predicates, not just one.** (a) The walk's overall verdict is `pass` on `bc47625c`. (b) The
   surface still 404s on `48209:84629` and still 200s on `48209:97658` — your change fixes the GRADE,
   not the surface, and if the surface changed you have touched something you were not asked to.

### Falsifiers, pre-registered

- **PRESENCE-SHAPED (the operator's named failure):** if the acceptance can be satisfied by the
  node's presence in the publish's excluded-work-list alone, or by any source that is not independent
  of the publish's own bookkeeping, the row HAS NOT LANDED. Say so plainly rather than reporting a
  green walk.
- **If direction 2 does not fail** — a 404 with no earned retirement still passing — you have silenced
  a real signal and the fix is wrong, whatever the walk says about `bc47625c`.
- **If the walk's overall verdict on `bc47625c` is not `pass`**, this lane has not succeeded,
  regardless of how the individual counts look. This is the falsifier the predecessor's set was
  missing: on 2026-09-14 every pre-registered check cleared while the walk was still red, because the
  set tested the stamp and not the walk's grade families.
- If any of the 16 no longer grades as a retirement in the expected direction, say which and why.
- If your run needs the digest read back and it does not carry the joint pin, say so rather than
  attributing a result to a build that did not run.

### OUT OF SCOPE — and this one must NOT be closed by your change

**Production `get_smart_site` at the depth node returns `reason=parcel_not_found` and
`parcelExists=false` for `48209:84629` (measured today), while the store holds an earned retirement
for it.** That is the serving surface **collapsing a provenanced absence into never-had-it**, and it
is carded separately by the integration seat. **The walk fix must NOT be used to close it, must not
be cited as evidence about it, and is not a fix for it.** If your work touches it, stop and report.

Also out of scope: the record store and the P-183 source fix; the PRODUCTION publish (done — it was a
restamp, and another fire has nothing left to accomplish); Williamson (P-184); `FIGURE-IN-PAYLOAD`;
`NO-CONTAINING-POLYGON`; the seven `get_smart_site` card reads; the cortex-api shift (HELD — a shift
with no `_catalog/leases/cortex-api.json` is refused by the P-170 gate, and the lease directory holds
only its README).

### Close

`_inbox/<date>_p180-walk_declined_retirement_close.json`, `planRows` `["P-180"]`, with your start
commit, the fix PR and merge sha with its conclusion string, the two-directional test evidence and the
negative control, **exactly which source (ii) is and why it is independent**, the production walk
verdict against `bc47625c` with its walk id, the surface control reads, and the named open item you
did NOT close. `leave_behind` is required. If you stop at a checkpoint, write CP2 rather than a close.
