---
id: 2026-09-15_reports_and_envelope_WDLL
title: WDLL — the reports and envelope arc. Rows, rulings, findings, owed items, each with done-looks-like and an instrument.
date: 2026-09-15 (updated 2026-09-16)
status: durable card — read this before touching any reports or envelope row
kind: wdll
owner: nick
audience: the doc_repo integration seat and any lane planner dispatched into this arc
---

# WDLL — reports and envelope, 2026-09-15

**Read this first.** It is the durable state of the arc that ran 2026-09-15. Every row below
carries what done looks like and the instrument that decides it. Nothing here is a plan
without a predicate.

---

## THE THREE PATTERNS THAT EXPLAIN MOST OF THIS ARC

Learn these before reading the rows. Most findings below are instances, not independent bugs.

### 1. Fixing a producer does not fix a product when a consumer refuses first

Three measured instances in one day:

- **P-227 / site plan.** The engine is symmetric — both routes call
  `composeSitePlanModelForParcel`, whose own doc says "Caller-supplied only." The caller
  builds the descriptor. → **P-231**.
- **P-230 / cells.** Cells written, gate green, customer served a pre-write bake. Fired on
  two independent rows (P-200, P-211) with identical `runId`/`bakedAt` after an apply.
- **P-221 / X-ray.** Engine rebuilt correctly, merged, **deployed and verified** — and the
  X-ray still refuses, because the gate never asks the engine. → **P-234**.

**Consequence: a close that verifies at the code level is not a close that verifies at the
customer.** Verify on the surface the customer uses, never the API behind it.

### 2. A synchronous route that outruns its client's abort, with an error string naming the wrong mechanism

The client aborts at **55,000 ms**. Three instances:

| Route | Measured | Status |
|---|---|---|
| feasibility refresh | 85–154 s Travis, 201 | **fixed** (P-155, async + poll-download) |
| flood-drainage refresh | 56–75 s, **11 of 11 returned 201**, 6 of 11 over the abort | open, inside P-227 |
| site-plan export | 56.8–115.9 s, all 201 | open, **must be added to the async port scope** |

Every one of these reports a "timeout" or "cold start" and **the engine never failed once.**
P-155 already recorded that the cold-start wording "names the wrong mechanism." Do not accept
a timeout string at face value on any of these routes: read the engine's own request log.

### 3. No repo in this portfolio auto-deploys on merge

Asserted three times on 2026-09-15 by three different seats; wrong every time.

- `legacy-design-tools`: push runs build-and-push only. The workflow is NAMED "Cloud Run
  Deploy" and reports `success` while all four deploy jobs show **skipped**. Deploy is a
  `workflow_dispatch` canary with the FULL 40-char sha, then `shift-traffic`.
- `hauska-factory`: only `ci.yml` (tests) and `ldt-pin-staleness.yml`. `gcloud builds triggers
  list` returns EMPTY. Jobs ship from manual `cloudbuild.parcel-*-cells.yaml`.
- `hauska-engine`: **no deploy workflow at all.** Manual Cloud Build via
  `cloudbuild.engine-api.yaml` using `services/engine-api/Dockerfile` (NOT the repo-root one).
- `hauska-map`: Vercel CLI from the REPO ROOT of a clean clone at origin/main.

**Costly in both directions:** believing a merge ships leaves fixes unshipped while everyone
thinks they are live (P-214 sat 12.4 h); believing a merge is dangerous leaves correct PRs
unmerged for fear of a deploy that cannot happen (PR #154).

---

## LIVE AND VERIFIED ON THE CUSTOMER SURFACE

Read by field on 2026-09-16. Every row below was verified on the surface a customer touches, never
on the API behind it.

| Row | Serving | Instrument that verified it |
|---|---|---|
| P-214 | `cortex-api-00807-wib` | envelope disclosure is human prose, no raw diagnostic |
| P-216 + P-218 | `property-explorer` alias `index-Dm73unVg.js` | asset existence on the live alias, NOT `Age:` |
| P-219 | `hauska-engine-api-00236-few` | decoded PDF: 30/10/30 on Ord. 2026-06, **0** occurrences of repealed `2019-51` |
| P-229 | factory jobs gen 5 / gen 4 | proven BY VIOLATION on the deployed image: `UNKNOWN_ARGUMENT` exit(1) |
| P-232 | `cortex-api-00807-wib` | 1010 Chestnut: 404 -> 200, Polygon, 20/5/20, 16,965 sq ft matching facets |
| P-221 + P-234 | engine + `hauska-mcp-server-00098-rol` | the X-ray generates: 3 sheets, verdict verbatim, 10 Studio markers absent from Solo |
| P-228 | `hauska-engine-api-00236-few` | chrome masthead on the dossier; footer counter `01/10`..`10/10` on a 10-sheet Feasibility |
| **P-235** | `cortex-api-00807-wib` | real-ring fixture FAILED before / PASSED after; straight-frontage control **byte-identical** |
| **P-236** | factory `factory-parcel-*-cells` gen 46 | refusal proven by violation both ways; build digest `sha256:10e6911c` matched by field |
| **P-239** | `hauska-engine-api-00236-few` | decoded a LIVE dossier for `48021:34137`: stroke 4x30/76, all four ticks `7.10526` |
| **P-240** | engine `00236-few` + mcp `00098-rol` + PE | site-plan export returns immediately with a stable jobRef instead of blocking past the 55s abort |
| **P-242** | `smartsite-mcp-00124-bub` | broke it live: `artifact_id_malformed`, no table name, no columns, no driver text |
| **P-242b** | PE `index-Dm73unVg.js` | served bundle carries `catalogStatus:"coming"` twice + `reports-coming-soon-button` disabled |
| **P-220** | `smartsite-mcp-00124-bub` | **CODE-LEVEL ONLY.** Lane deleted the fix, 8 tests red with owner data visible, restored, 203/203. **The live failing direction is unverifiable - see P-245** |
| **P-222** | `hauska-engine-api-00236-few` | D5, D7, D8, D11 fixed; lane decoded live-exported PDF bytes and REVERSED a code-only conclusion |
| **P-237** | `hauska-mcp-server-00098-rol` | metering-order check proven by breaking the real handler and watching it go RED |

Bold shipped 2026-09-15 into 2026-09-16. **Eleven rows this session.**

## SERVING REVISIONS, read by field 2026-09-16

```
hauska-engine-api   00236-few   digest sha256:87d7e580...f4d3   (P-219 P-228 P-239 P-240 P-222)
hauska-mcp-server   00098-rol                                   (P-234 P-240 P-237)
cortex-api          00807-wib                                   (P-214 P-232 P-235)
smartsite-mcp       00124-bub                                   (P-242 P-220)
property-explorer   alias serves index-Dm73unVg.js              (P-216 P-218 P-240 P-242b)
factory writer jobs gen 5 / gen 4 / publish gen 46              (P-229 P-236)
```

**Nothing is merged-but-unshipped.** Every PR opened this session is merged AND deployed.

## IN FLIGHT

None. Four lanes ran 2026-09-15 into 09-16 (P-240, P-242b, then P-220 / P-222 / P-237) and all
closed, merged and deployed. No open lane claims.



## THE QUEUE, as of 2026-09-16 01:30Z

**Repo is the sequencing constraint: one owning seat per repo, so same-repo rows serialise.**

### DISPATCH-READY

**P-243 — the MCP app is published and never bound · legacy-design-tools · COMPILED, UNFIRED**
Three compounding causes, one lane. `ui://smartsite/app-p562.html` exists and serves (its sibling
probe returns `probe-ok`) and NO tool result references it. The vocabulary is resource-addressable
at `docs://smartsite/vocabulary-p91v3.json` and is inlined anyway on EVERY call, roughly 5 KB,
measured riding along with a four-line refusal. And there is no response shaping, so the model
improvises from 30-plus raw rails plus a glossary.
**Done: the panel RENDERS on the operator's client.** Not that the resource resolves - it already
does, and the operator still sees nothing.

**P-244 leg A — site-plan compose fails at ~116s · hauska-engine**
**P-244 leg B — a declared wait is returned as `status: error` · hauska-mcp-server**
See the P-244 row. Leg B is small and high-value: every agent and UI currently reads a healthy
queued job as a failure.

**P-241 — the ETJ build · legacy-design-tools `lib/cad-ingest/src/boundary/`**
Repo established by the P-241 enumeration lane, NOT hauska-engine as the planner had guessed.
**20 of 23 wired cities publish a directly queryable ETJ layer**; 4 combine city limits and ETJ in
one layer as Austin does; only Round Rock and Cedar Park publish none; only Lockhart is unresolved
behind `Token Required`. City limits was ALREADY unwired by a 2026-09-12 lane - only ETJ remains
hardcoded, at `report-model.ts:966` and `feasibility.ts:210-212`, plus **5 more duplicate hardcode
sites** the lane found beyond those two. SB 2038 (2023) is CONFIRMED against capitol.texas.gov and
Austin cites SB 1844 (2025) for a separate subset, which RETIRES the §42.021 derivation rather than
deferring it.

**P-242c — coming-soon, the MCP half · legacy-design-tools**
Per the 2026-09-15 ruling: tools stay LISTED and return a declared coming-soon refusal.

**P-238 — dossier footer counter and deep link · hauska-engine**

**R-11 — the SEAT-01 gate's three verified holes · doc_repo**
Over-broad (`ownerOfRepoPath` returns the FIRST seat-product entry per repoPath) plus two silent
halves (the gate never parses `git -C`, and shell mode gates only git writes so heredoc/sed/python
writes never meet the path check). **Three near-misses on seat isolation in one night**: P-240's
lane ran a destructive git command against the shared reference checkout, the P-222 lane reviewed
another seat's in-progress work in hauska-map from a working-directory mismatch, and the planner
wrote every doc_repo edit through Bash. All three caught by lane discipline, none by the control.

### NEEDS SCOPING BEFORE A LANE

P-231 standalone site-plan caller (repo still TBD; P-227 established the engine is symmetric) ·
P-230 cells written vs pre-write bake · P-217 instances 8 and 9 · P-233's 131 districts ·
P-225 uncodified districts · P-223 / P-224 from the QA passes · P-215 two nodes one lot ·
the Austin parser (`ZONING_BASE` carries COLLAPSED codes; a naive split on `-` yields `CS` where
the base is `CS-1`).

### OPERATOR ACTION, NOT A LANE

**P-245 — one paid-Solo account, ideally a free-tier too.** Unblocks three stuck verifications and
is the cheapest row on the board.

### INHERITED, STATUS NOT RE-VERIFIED

**P-200 through P-213.** OPS-24 rails, the `excluded` taxonomy, the capability roadmap, the SEV-1
mass false retirement (P-212) and the blast-radius refusal (P-213, which P-236's lane recorded as
still unbuilt). **The 2026-09-15 session did not verify any of these and did not guess.**
Re-establishing this block is its own task and is the largest blind spot on the board.

**Structural note that makes all of the above harder than it should be: OPS-16 HAS NO STATUS
COLUMN.** Every row from P-200 to P-245 carries `ADDED` in its third field; real status lives
scattered across 170 amendments and the lane closes. "Where are we" cannot be queried, only
re-read. That is an instrument gap, and it is why every handoff so far has re-derived the board by
archaeology.


## RULINGS IN FORCE

- **PUD parcels** (operator, 2026-09-15): an honest *"your setbacks come from your PUD
  ordinance"* message for now, **not** per-parcel acquisition. Disposes of P-233's largest
  bucket — 35 districts, 9,485 parcels — without acquiring anything.
- **X-ray metering** (operator, 2026-09-15, P-237): **accept** the meter tick on a hollow
  refresh. A tick costs nothing today — verified on deployed main: `handleSettledOveragePayment`
  has zero call sites, `amount_minor` lands `null` with `graceTerms: "pending-rate"`.
  **TRIGGER, ENFORCED AS OF 2026-09-16 (P-237 shipped, `hauska-mcp-server-00098-rol`): moving
  metering after the engine's verdict must land BEFORE any real `perReferenceRateMinor` is set,
and a CI check now fails when it does not.** The lane proved it by breaking the real handler and
  watching the check go RED, then reverting. **Its named hole: the rate's VALUE lives in an
  external npm package (`@empressaio/atom-contract`), so the check can never see a dependency
  bump that introduces a real rate.** That is a separate, real hole, recorded as a leave-behind. The moment a rate exists those rows stop
  being free and start being wrong. "Someone remembers" is not a control — the enforcing check
  (CI fails when a finite rate resolves while the metering order is unchanged) is owed.
  Option (c), a cheap pre-engine hollow pre-check, is **refused**: it is the shape of the
  defect P-234 removed.
- **Travis stays OUT of any bake** while Austin is unmeasured. **P-236 now EXISTS and is armed**
  (`factory-parcel-*-cells` gen 46), so re-read this rule before the next Travis bake rather than
  inheriting it; its precondition has changed.
- **Record request is coming-soon on ALL surfaces, DISABLED AND LABELLED, with the MCP tools
  STAYING LISTED and returning a declared coming-soon refusal** (operator, 2026-09-15, P-242,
  recorded at `_decisions/2026-09-15_record_request_coming_soon_all_surfaces.md`). Basis: the flow
  completes and delivers nothing readable - 42 `records_request_jobs`, the operator owns 2, both
  `needs-human`, both completed, **both with zero artifacts**. Point three follows this repo's
  disclosure posture over the reflex to unregister a dead tool. **The web half SHIPPED (P-242b);
  the MCP half is P-242c and is NOT done.**
- **The §42.021 ETJ derivation is RETIRED, not deferred.** SB 2038 (2023) confirmed against
  capitol.texas.gov, and Austin cites SB 1844 (2025) for a separate parcel subset, so ETJ is shaped
  by two statutes plus per-parcel agreements. A population-keyed buffer would contradict the
  cities' own published data. Per-city GIS is the path: 20 of 23 wired cities publish a layer.

## OWED, and not to be quietly folded into something else

1. **Lockhart.** Its ArcGIS service is gone from its org entirely (`400 Invalid URL`). No public
   replacement has been searched for. **This is NOT resolved by Austin's answer.**
2. **The 7 remaining Hays cities** for the envelope group (P-211 leave_behind).
3. **`surface-probe.mjs` has no leg** for P-214, P-216, P-218, P-219, P-221, P-228, and now
   P-220, P-222, P-235, P-236, P-237, P-239, P-240 and P-242. **Fourteen rows shipped that it
   could not confirm**, and every OPS-24 close now discharges its predicate through
   `probe.notApplicable`. Named by seven separate closes. **The program's own Law 1 finish line
   does not exist for most of what ships.**
4. **`derive.ts` does not read `max_lot_coverage_pct`'s own `not_specified` provenance** —
   affects real codified Bastrop rows today. Found by P-232, not fixed.
5. **`zoning-layers.ts` carries a false "verified" claim** about a Georgetown `RL` code the live
   table no longer holds. A wrong verification claim is worse than an absent one.
6. **`insetParcelBySetbacks`** is exported, tested and called from nowhere. Decide: delete or
   revive.
7. **The "Cloud Run Deploy (cortex-api)" workflow is named for something it does not do on
   push.** Rename it or make the push job state build-only.
8. **No sub-privileged identity exists anywhere** — P-245. Blocked three verifications in two days
   and is the reason P-220 existed at all (the test fixture defaults to Studio-tier, so no test
   ever ran a Solo or free caller against `get_smart_site` or `run_report`). **Operator action.**
9. **P-222's residue**, confirmed real and deliberately not fixed in that lane: D9 traces to a
   DIFFERENT service's stale cache, not hauska-engine's code; the setback edge3-vs-4 inconsistency
   needs a write-path atom fix, too broad for a report-composer lane. The 7-vs-13 page question
   closed as a partial no-op (7 vs 12 now, drifted from 13) — the gap is caller-side.
10. **P-220's leave-behind**: a batch (multi-parcel) `get_smart_site` read checks account-wide tier
    only, not per-parcel property-unlock. Conservative (never-leaks) narrowness, documented.
11. **The claim-scope control is PROPOSED, NOT CARDED.** DEV_PROCESS 1.1 says a coverage figure
    travels with its denominator; the general rule is that EVERY claim does. The close skeleton
    already demands `scopeBasis`, `completionPredicate`, `missionPremise` and `contradicted`, and
    **the probe-close gate reads NONE of them** — zero references, verified. Awaiting an operator
    ruling on whether to build it.
12. **OPS-16 has no status column.** Every row P-200..P-245 carries `ADDED`; status lives scattered
    across 170 amendments. "Where are we" cannot be queried, only re-read.

---

## MEASUREMENT NOTES THAT WILL SAVE THE NEXT LANE A DAY

- **`Age:` cannot tell you which build is serving.** The CDN cache object is keyed to the
  deployment and shared with the alias. Use **asset existence**: request each candidate build's
  unique `/assets/index-*.js` against the alias; the live build returns
  `application/javascript` and every other falls through to the SPA handler as `text/html`
  **with HTTP 200**.
- **A 200 is not a success.** `smartsite.app` returns 200 and is a 114-byte parked stub
  redirecting to `/lander`. Re-confirmed independently by the P-228 lane. Verify by SERVED
  CONTENT.
- **These PDFs use Identity-H CID fonts; drawn text is NOT greppable.** A grep for
  `SHEET 01 / 13` returns nothing on a perfectly correct PDF. Decode via the ToUnicode CMap:
  inflate the FlateDecode streams, parse `beginbfchar` into a CID→Unicode map, decode each
  `<hex> Tj` operand.
- **AND THE COROLLARY, found by the P-228 lane:** pdf-lib's `StandardFonts` carry **no ToUnicode
  CMap at all**, so text drawn in them is **silently invisible to that very verification
  method**. Caught by the test suite, fixed by aliasing to the already-embedded Barlow fonts.
  *The instrument that produced a claim is part of the claim* — here the font choice could have
  made a correct report unverifiable and an incorrect one look clean.
- **A single probe on a 0-percent Cloud Run revision proves nothing.** It cold-starts; the first
  attempt returned curl `000` while three retries returned 200 in ~0.12 s.
- **GitHub code search is NOT exhaustive.** It returned zero matches for a string that exists in
  a repo. Confirm by reading before treating a hit as the sole emitter.
- **Read Cloud Run traffic BY FIELD**, never a positional `--format=value`, and never trust
  `latestReadyRevisionName` as the serving revision.

- **The factory writer jobs are `factory-parcel-envelope-cells` and `factory-parcel-setback-cells`,
  in project `hauska-prod-497015`, region `us-east4`.** Not `parcel-*-cells`, and not us-central1.
  Measured 2026-09-15 by the integration seat: probing the short name in us-central1 returns
  `ERROR: Cannot find job [parcel-envelope-cells]` and `gcloud run jobs list` returns `[]` — **a
  false absence indistinguishable from a decommissioned job.** The authoritative record is
  `cloudbuild.parcel-envelope-cells.yaml` at origin/main, which names both the job and `_REGION`.
  Read the cloudbuild config before probing for a job. Confirmed by field once corrected:
  envelope-cells generation 5 at `sha256:af5fd158…0520f`, setback-cells generation 4 at
  `sha256:b35bc2d0…c235d`, both pinned by DIGEST rather than tag, matching P-229's close.
- **`P:/hauska-factory`'s local `main` is rewound to `3653f12 "Initial commit"` — a working tree
  holding only `README.md` — while `origin/main` carries the full repo.** Measured 2026-09-15. A
  lane that cuts a worktree from local `main`, or that greps that checkout to establish what the
  repo contains, gets a near-empty answer that looks like a finding. **Always cut from
  `origin/main` after an explicit fetch, and read history with `git show origin/main:<path>`.**
- **Asset existence is sound and was proven BY VIOLATION on the live PE alias**, 2026-09-15:
  `smartsite.cloud/assets/index-BiEor6XQ.js` returns `application/javascript` at 2,052,673 bytes,
  while a fabricated `index-ZZZZZZZZ.js` returns **HTTP 200** `text/html` at 1,856 bytes — the SPA
  fallback. The negative control is what makes the instrument trustworthy; run it every time.
  Note the limit of this particular read: it establishes WHICH ASSET the alias serves, and does
  not by itself tie that asset to deployment `8r0btsuy9`. Pair it with the deployment's own asset
  listing if the deployment identity is the claim.
