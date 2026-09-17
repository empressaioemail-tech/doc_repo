## Mission — deploy the engine (P-260 and P-263's code) to retrieval-api and engine-api

You launch no sub-agents (FAN-DEPTH 0). You deploy, you verify, and you fix your own failed deploys.
You do NOT escalate a deploy to the operator: "failed on X, fixing X" is the posture. You write to no
store and you run no writer. Deploying is planner-owned; this dispatch hands you that ownership for
these two services only.

### What is already true (do not re-derive, but DO re-read before acting)

- `hauska-engine` main is at or after `50a0ba91` (PR #471, P-260 + P-263). A later controls PR (#472,
  P-273 edge-starvation) may also have landed — read main yourself and declare the SHA you deploy.
- **Nothing auto-deploys on merge in this repo.** There is no deploy workflow in `hauska-engine`
  (only `ci.yml` and `block13-cert-grade.yml`). Both services are deployed by hand with `gcloud`.
- The currently serving revisions, read by field 2026-09-17 ~21:30Z:
  - `hauska-retrieval-api` — `00100-hut`, digest `c0d4648e…`, built from engine `3809275f`.
  - `hauska-engine-api` — `00251-qed`, digest `38469252…`, built from engine `3809275f`.
- Project `hauska-prod-497015`, region `us-central1`.

### THE TRAP THAT WILL BITE YOU FIRST

**The two services have OPPOSITE traffic modes, and the doc_repo record had them backwards until
2026-09-17 21:40Z.** Read them yourself with `--format=json` and read the fields by name; never read
multi-field gcloud output through a positional `--format="value(...)"` formatter, because a blank
field shifts every column after it and that has already produced two wrong reports to the operator.

Measured 21:30Z:

- `hauska-engine-api` traffic is `{"latestRevision": true, "percent": 100}`. **It FOLLOWS LATEST.** A
  new revision takes ALL production traffic the moment it is ready. You must pass `--no-traffic` (and
  a `--tag`) or the deploy ships itself to every customer with no canary.
- `hauska-retrieval-api` traffic is an explicit `{"percent": 100, "revisionName":
  "hauska-retrieval-api-00100-hut"}` with no `latestRevision`. **It is PINNED.** A new revision takes
  no traffic until you shift it explicitly.

Re-measure both before you deploy. If what you read disagrees with the above, the live read wins and
you say so in your close.

### THE SECOND TRAP: a `--source` deploy can rotate a key downstream callers hold

Both services were last deployed with `gcloud run deploy --source` (the serving images are in
`cloud-run-source-deploy`). A `--source` redeploy of a keyed service has twice re-minted the Bearer
key downstream consumers hold, producing a **silent 401 that degrades a surface with no visible
error** — Command Center's Node and Graph panel showed DEGRADED for a day from exactly this.

So: after the deploy, do not stop at "the deploy succeeded". Curl each downstream consumer's
dependent endpoint and confirm a 200, not a 401. Consumers hold copies of the retrieval key in at
least Vercel project env (`property-explorer`, and the Command Center projects) and in other Cloud
Run services' env. If you get a 401 anywhere, resync the key to EVERY holder, not only the one that
surfaced the symptom. `90_runbooks/key_rotation_all_environments.md` is the procedure.

### THE THIRD TRAP: deploy from a fresh clone, never from the working checkout

`P:/hauska-engine` was **228 commits behind origin/main** on 2026-09-17, and `P:/hauska-map` was 370
behind, one commit AHEAD, and dirty. A `--source` deploy from either ships that stale tree and
reports success. Clone fresh from `origin/main` into a NEW directory under `P:/tmp/` (a recycled
directory has burned this fleet before), verify `git rev-parse HEAD` equals the SHA you intend, and
declare it.

### What to do

1. **Read and declare**: engine main SHA, both services' traffic JSON by field, both serving
   revisions and digests. This is your snapshot and it goes in your close.
2. **Fresh clone** at main into a new `P:/tmp/` directory. Verify the SHA.
3. **retrieval-api first.** Deploy with `--no-traffic --tag <something-short>`. Smoke the TAG URL, not
   the service URL — the tag URL is the only thing that proves you are exercising the new revision.
4. **Shift retrieval-api traffic.** A traffic shift needs its lease file written at
   `_catalog/leases/<service>.json` in a SEPARATE tool call BEFORE the shift command: the hook
   inspects the command string, so writing the lease and shifting in one command is refused.
5. **Verify retrieval-api at the customer surface**, then run the downstream 401 probe above.
6. **engine-api second**, same shape, but remember it follows LATEST: `--no-traffic --tag` is
   mandatory, and after the shift you should decide and STATE whether you leave it following latest
   or pin it. Say which you chose and why; do not change it silently.
7. **Grade P-260 at the surface.** The row's point is that the engine's jurisdiction descriptors
   stopped reading a hand-kept 15-key table and now resolve from `@empressaio/setback-corpus@1.4.0`
   (43 keys). Before the fix, Hays boundary-edge atoms carried *"No setback table configured for
   jurisdiction descriptor"*. Find a Hays parcel whose jurisdiction the corpus serves and show that
   string is gone and a table resolves; then show a genuinely table-less jurisdiction still says so.
   A fix that makes everything resolve is not a fix.

### What you must NOT do

- **Do not run P-263's apply.** The 490,185-atom correction is a separate, operator-authorised write.
  This deploy ships the write-side guard only. Retrieval's serving file is NOT changed by #471, so
  the legacy atoms will still print "Setbacks consume the lot" after your deploy — **that is expected
  and is not a failed deploy.** Do not chase it.
- **Do not deploy cortex-api or smartsite-mcp.** P-279 merged a post-deploy check that exits 1 when a
  tag points at a revision missing a credential the serving revision carries, and those two services
  carry 15 and 30 such tags. Their next deploy goes red at that step until the operator rules on the
  tags. It is not your call and it is not your deploy.
- **Do not touch county 48491 in any store.** It was restored from a point-in-time branch on
  2026-09-17 after a publish retired the whole county.
- Do not take, renew or release a lease belonging to another seat.

### Verify by violation

Before you trust your own smoke probe, make it fail once: point it at a revision or path that should
not satisfy it and confirm it reports failure. A probe observed only passing has not been observed
working, and this session has already produced confident wrong answers from instruments that returned
the expected result and were therefore not interrogated. Pre-register what result would prove your
grade wrong, before you run it.

### Close

Declare: the snapshot (engine SHA, both traffic JSONs, both serving revisions and digests, before and
after), the tag URLs you smoked, the traffic shifts with their lease files, the downstream 401 probe
results per consumer, the P-260 grade in both directions, what you chose for engine-api's traffic
mode and why, your probe's violation proof, and `leave_behind`.
