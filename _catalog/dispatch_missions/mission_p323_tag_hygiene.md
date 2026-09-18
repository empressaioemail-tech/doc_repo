## Mission — P-323: the named tags point at current revisions, the one-off tags stop accumulating

You launch no sub-agents (FAN-DEPTH 0). You change Cloud Run tag routing and deploy workflows. You do
NOT delete or repoint a tag until the enumeration in step 1 is done and recorded, because a tag URL
is a reachable production endpoint and you cannot tell from the tag name alone whether something
depends on it.

### The finding (P-279, measured live 2026-09-17)

`hauska-engine`'s canonical instrument `scripts/check-tagged-revision-env.mjs` measured, read-only:

- **`cortex-api`**: 18 tags, **15 failing**. Tag `staging` points at `cortex-api-00765-gip`, which is
  missing `RETRIEVAL_API_KEY`. `smoke4`, `pooling-fix`, `g60`, `p527`, `p538`–`p543`, `dbfix`,
  `dbfix2`, `canary-min1` each miss 5 to 15 credentials including `FACTORY_DATABASE_URL`,
  `ATOMS_DATABASE_URL`, `STRIPE_*`, `RESEND_API_KEY`, `PLAN_REVIEW_API_KEY`.
- **`smartsite-mcp`**: 33 tags, **30 failing** (`p527` … `p565b`), each missing
  `HAUSKA_MCP_SERVICE_KEY` and `HAUSKA_ENGINE_API_KEY`.

Every tag URL is reachable and runs the environment its revision was created with. This is the same
class as the earlier `hauska-engine-api` finding where the gate was enforced on the service URL while
**37 tag URLs stayed open**. P-251 removed that instance and, in the lane's own words, the class
returned on this repo's services **within hours** — which is the point of this row: the one-time
cleanup is the easy half, and it is not the half that matters.

### Two populations, and they get opposite treatment

A reference count across doc_repo canon (2026-09-17) separates them:

- **Named, reusable tags with real consumers.** `canary` (67 references) and `staging` (5) are named
  in runbooks and procedures as URLs a human or a workflow is told to smoke. **These are repointed to
  the current serving revision, never deleted.** `staging` failing is the most urgent single item
  here: anyone using the staging URL today is on a revision missing `RETRIEVAL_API_KEY`.
- **One-off per-row tags.** `p543`, `p542`, `p249-f816c21`, `smoke4`, `pooling-fix`, `dbfix2`,
  `p527`…`p565b` and the rest each appear once, in the session record that created them. Nothing
  consumes them. **These are the accumulation, and they are deleted.**

Do not take that reference count as sufficient. It reads doc_repo only. Before deleting any tag,
also check the places a URL can hide: Vercel project env in every project (`property-explorer`,
`command-center`, `cmdcenter` — note the two similarly named ones both hold key copies), other Cloud
Run services' env vars in BOTH `hauska-prod-497015` and `legacy-design-tools-prod`, and any scheduled
job or uptime check. Record what you searched; an enumeration you did not finish is a finding.

### What to build

1. **The enumeration.** Every tag on `cortex-api`, `smartsite-mcp`, `hauska-engine-api` and
   `hauska-retrieval-api`, in both projects, with its revision, its credential-check verdict, and
   whether anything references its URL. Say where you looked. This is recorded BEFORE anything is
   changed, and it is the artifact the operator reads to authorise the deletions.
2. **Repoint the named tags** (`canary`, `staging`, and any other with a real consumer) to the
   current serving revision of their service. Verify by curling the tag URL and getting the same
   answer as the service URL, not merely that the repoint command exited 0.
3. **Delete the unreferenced one-off tags.** This is a destructive, outward-facing change: it removes
   reachable URLs. **The operator authorised this class in advance on 2026-09-18 (OPS-16 A-215 ruling
   10, `_decisions/2026-09-18_phase0_closeout_rulings.md`): every tag on a revision missing a
   credential its serving revision carries is deleted, except tags the operator names as keepers.**
   So: record the enumeration (step 1) and the exact deletion set in CP2 before deleting anything;
   delete only tags that are in that class AND unreferenced AND not named as keepers; anything outside
   that class (a referenced tag, a tag whose revision carries every credential, a tag you cannot
   classify) is NOT deleted and is listed for the operator instead. Record what was deleted, when,
   and by what invocation. A count is not a record.
4. **Kill the generator, which is the actual row.** A deploy that creates a per-row canary tag
   removes its own tag once the traffic shift has completed and been verified. Without this, the
   population regrows and P-279's check goes red again within days, which is how a correct control
   gets reclassified as noise and then bypassed. Wire it into the two LDT deploy workflows that
   already run the P-279 check (`cloud-run-deploy.yml`, `cloud-run-deploy-smartsite-mcp.yml`).
5. **Name the venue gap for the other project, do not paper over it.** `hauska-engine` has NO deploy
   workflow — both `hauska-engine-api` and `hauska-retrieval-api` are deployed by hand with `gcloud`
   — so there is no CI venue in which P-279's check can run for them, and they carry 17 and 8 tags
   unchecked. Three checks in this fleet now need `gcloud` credentials and have no scheduled home:
   `check-staging-secret-drift.mjs` (P-276/P-316), `check-live-job-has-config.mjs`, and
   `check-gate-walk-image-drift.mjs` (P-274 F29). **Do not build a fourth homeless check.** Say in
   your close whether this belongs in P-316's scheduled venue (the operator's IAM grant is already
   done) and what it would take, rather than inventing a second venue.

### What you must not do

- **Do not make the P-279 check advisory, and do not add a bypass flag to it.** A control that blocks
  work it was meant to block is not over-broad. Widening it to admit a known-bad value would need a
  detector plus something that fails when the admitted value reaches a consumer, and that is strictly
  more work than fixing the tags.
- Do not delete a tag before step 1 and the deletion set are recorded, and never delete one outside
  the class ruling 10 authorises.
- Do not deploy `cortex-api` or `smartsite-mcp` as a side effect. Repointing traffic tags is not a
  deploy; if you find yourself needing a deploy to finish this, stop and report.
- Do not touch county 48491 in any store.

### Verify by violation

- After the repoint, point the checker at a tag you know is still stale and confirm it reports the
  violation; then run it clean and confirm it passes. A control observed only passing has not been
  observed working.
- For the ephemeral-tag change: show a deploy run that creates its tag and removes it, AND show that a
  failed or aborted shift does NOT remove the tag, because a tag removed while its revision is still
  serving is an outage.

### Close

Declare: the full enumeration with what you searched, the repoints with their curl verification, the
deletion list and the operator's authorisation, the generator fix with its both-direction proof, your
answer on the venue for the homeless gcloud checks, and `leave_behind`.
