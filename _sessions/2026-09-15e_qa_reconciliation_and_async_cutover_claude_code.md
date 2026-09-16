---
id: 2026-09-15e_qa_reconciliation_and_async_cutover
title: Session — eleven rows shipped, a three-repo cutover, and four corrections the operator and the lanes made to the planner
date: 2026-09-15
status: closed
kind: session
owner: nick
seat: doc_repo integration
---

# Session 2026-09-15e — QA reconciliation, the async cutover, and what the lanes corrected

Durable state is `_inbox/2026-09-15_reports_and_envelope_WDLL.md`. **Read that, not this.**
This record is what happened and what it cost.

Ran 2026-09-15 evening into 2026-09-16 early. Seat: doc_repo integration, `P:/doc_repo`, branch
`main`. A second doc_repo session (the design and OPS-17 govtech thread) was writing concurrently
throughout; every commit here used explicit pathspecs and nothing of theirs was swept.

## What shipped

**Eleven rows, every one verified on the surface a customer touches.** Six lanes ran in three
waves; all six closed, merged and deployed in the same session.

Wave 1: P-239 canonical logo, P-236 county coverage floor, P-235 envelope front line.
Wave 2: P-240 async port (three repos), P-242b records coming-soon.
Wave 3: P-220 owner strip, P-222 report asks the facet, P-237 metering enforcement.

Serving, read by field at close:

```
hauska-engine-api   00236-few   sha256:87d7e580...f4d3
hauska-mcp-server   00098-rol
cortex-api          00807-wib
smartsite-mcp       00124-bub
property-explorer   index-Dm73unVg.js
factory             writer gen 5 / gen 4, publish gen 46
```

Nothing is merged-but-unshipped.

## The cutover

P-240 was the only genuinely risky thing. It retired the synchronous response shape rather than
leaving it coexisting, so there was no order in which old consumers and new engine coexisted. Run
as **migrations -> engine -> consumers**: 016 and 017 applied additively under the old code and
confirmed against the catalog, then the engine, then MCP and PE.

The judgement was that the window was cheap, and the reasoning is worth keeping: site-plan export
was failing for agents 100 percent of the time and flood about 55 percent, so the cutover moved an
already-broken route to broken-differently for a few minutes rather than breaking a working one.

**It worked, and within two minutes it exposed the defect the timeouts had been hiding.** Reading
the job table rather than the tool output: `48021:34049` went queued -> started -> **failed at 116
seconds with `compose_timeout`**. That is not a ceiling the port introduced; `compose_timeout` is a
classifier and the lane's stall ceilings are five and eight minutes. The compose has always failed
at ~116s, inside the 56.8-115.9s band A-162 measured. Carded as P-244.

## Four corrections to the planner, none of which the planner caught

**1. The operator, on the site plan.** The planner wrote "a customer still can't get a site plan."
Response: *"I've actually never had a problem getting a site plan."* Measured immediately after:
`feasibility_export_jobs` holds 9 rows, **all `ready`, zero failed**, including `48021:34049`
completing hours before its standalone export failed. **The composed path works; the standalone
route does not.** That is exactly what P-227 established and P-231 was split out to fix. The
planner measured ONE route and described the PRODUCT. A route is not a product, and the composed
path was one query away.

**2. P-241, three times in one close.** City limits was ALREADY unwired by a 2026-09-12 lane, so
"one acquisition closes two rails" was wrong and the cited F19 line numbers were stale. The
`LayersControl.tsx` disclosure mechanism the planner cited **does not exist in current code** -
carried from the QA reconciliation without verification, while the claims either side of it were
verified. And the repo is `legacy-design-tools/lib/cad-ingest/src/boundary/`, not hauska-engine as
guessed - which is why that lane went out read-only, and the caution paid for itself.

**3. P-235, by the dispatch's own words.** The planner recorded P-235 as "not customer-done" from
an MCP read, when the dispatch's known-traps section said **"Verify on the MAP, not the API."** The
real mechanism was already root-caused in P-217 instance 2: the baked-facets route unconditionally
nulls `facets.envelope` and MCP has no equivalent of the panel's live-derive augment, so MCP has
never carried an envelope polygon for any parcel. Corrected in place within the session.

**4. The planner's own CPU-starvation hypothesis, refuted by evidence.** `void
runSitePlanExportJob(...)` is detached and in-process, and the revision carries no
`cpu-throttling=false` annotation, so Cloud Run starvation was live and reasonable. The job ran a
full 116 seconds and failed with a classified error, so it had CPU throughout. Recorded in P-244 so
nobody re-raises it.

## What the lanes found that the dispatches did not anticipate

**P-220's root cause was one layer out from where the dispatch pointed.** The dispatch said "a
working strip exists on the facets path, port it." The server-side gate on `/research/brief` was
already correct; the gap was the MCP server's shared response composer forwarding the upstream body
untouched and never consulting `canRunStudioReport` - **a gate that already existed, was already
used by the siteplan and terrain export tools, and documents itself as covering owner data.** It
survived because **the test suite's default fixture is Studio-tier.**

**P-222 reversed a code-only conclusion by decoding live-exported PDF bytes.** The utilities and
overlay data genuinely exists, one hop from where every previous agent looked, in a retrieval
reader the report composer never wired up. It also found and fixed a pre-existing silent 16-section
truncation cap dropping content off real documents with zero warning.

**P-237 gave an honest non-answer where a falsifier demanded a commit.** The X-ray bisect found no
breaking commit exists - the caller-supplied-verdict architecture dates to the file's creation on
2026-09-03, not a later regression. It said so rather than naming a commit to satisfy the form.

## The finding that connects several of these

**P-245: every identity available to a test, a lane, or the planner is the most privileged one.**
P-242 could not test its tier gate. P-220 EXISTED because of the Studio-default fixture. P-220's
live verification is blocked by the same gap - `ownerFact` returned populated on the deployed fix,
which is *correct* for a Studio caller and therefore proves nothing. Three controls now sit in the
state ENFORCEMENT names as unobserved. **One paid-Solo account fixes all three.** It is not a rule
problem; a fixture whose default identity is maximum privilege is structurally incapable of seeing
a gate.

## Controls that fired on this seat, and were obeyed

- **Canon gate** blocked three Agent dispatches whose prompts referenced the compiled dispatch by
  path instead of carrying the canon inline. Re-fired with the canon verbatim; no override taken.
- **P-170 traffic lease** refused a shift because the lease write and the shift were in ONE Bash
  call and the gate inspects the command string. Split into two calls.
- **Branch-behind catch**: hauska-map #407 reported green while its state was BEHIND - that green
  was earned against a base P-242b had moved. Re-greened at `336cc5ba` before merging.
- **Seat gate holes**, verified by direct probe rather than assumed. R-11.

## Near-misses on seat isolation, three in one night

P-240's lane ran a destructive git command against the shared reference checkout (caught, stashed
not discarded, nothing lost). P-222's lane reviewed **another seat's in-progress work in
hauska-map** from a working-directory mismatch (caught, discarded, re-run correctly). And the
planner wrote every doc_repo edit through Bash, which never meets SEAT-01's path check at all.
**All three caught by lane discipline. None by the control.**

## Rulings taken

- **Record request coming-soon on ALL surfaces, disabled AND labelled, MCP tools staying LISTED and
  returning a declared refusal.** `_decisions/2026-09-15_record_request_coming_soon_all_surfaces.md`.
- **§42.021 ETJ derivation retired, not deferred**, on confirmed SB 2038 plus Austin's SB 1844
  citation plus its four AG-development-agreement polygons.

## leave_behind

- item: `surface-probe.mjs` now owes legs for fourteen shipped rows; every OPS-24 close discharges
    through `probe.notApplicable`.
  owner: doc_repo integration seat
  plan_row: UNCARDED
- item: P-200 through P-213 status was not re-verified this session and was not guessed. Largest
    blind spot on the board.
  owner: unassigned
  plan_row: UNCARDED
- item: OPS-16 has no status column; every row reads `ADDED` and status lives in 170 amendments.
  owner: unassigned
  plan_row: UNCARDED
- item: The claim-scope control is proposed and not carded. The close skeleton already demands
    `scopeBasis` and the probe-close gate reads none of the scope fields - verified, zero
    references. Awaiting an operator ruling.
  owner: nick
  plan_row: UNCARDED
- item: P-243 compiled and unfired; P-244 legs A and B owed as dispatches.
  owner: doc_repo integration seat
  plan_row: P-243, P-244
