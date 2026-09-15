---
id: 2026-09-15_reports_and_envelope_WDLL
title: WDLL — the reports and envelope arc. Rows, rulings, findings, owed items, each with done-looks-like and an instrument.
date: 2026-09-15
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

| Row | Serving | Instrument that verified it |
|---|---|---|
| P-214 | `cortex-api-00805-jil` | envelope disclosure is human prose, no raw diagnostic |
| P-216 + P-218 | `property-explorer-8r0btsuy9` | asset existence on the live alias, NOT `Age:` |
| P-219 | `hauska-engine-api-00228-zat` | decoded PDF: 30/10/30 cited Ord. 2026-06; **0** occurrences of repealed `2019-51`, stale `19,052`, retired `bastrop-per-parcel` |
| P-229 | both writer jobs, `af5fd158…` / `b35bc2d0…` | proven BY VIOLATION on the deployed image: `UNKNOWN_ARGUMENT` exit(1), `COUNTY_UNKNOWN` exit(1), and a valid `--county` still runs scopedly |
| **P-232** | `cortex-api-00805-jil` | **1010 Chestnut St (GC): 404 no-district → 200 ok, Polygon, 20/5/20, 16,965 sq ft matching the facets route.** 3,825 Bastrop parcels |
| P-221 + P-234 | `hauska-engine-api-00230-cic` + `hauska-mcp-server-00094-nis` | **the X-ray generates**: `pdf-dossier`, 3 sheets, verdict verbatim, `FRONT SETBACK 30'` agreeing with Feasibility, and **all 10 Studio-only markers ABSENT** from the Solo SKU |
| P-228 | `hauska-engine-api-00230-cic` | chrome masthead renders on the dossier; footer counter verified `01/10`..`10/10` on a 10-sheet Feasibility by the lane. Dossier footer gap → **P-238** |

---

## MERGED AND DEPLOYED — nothing is sitting unshipped

As of 2026-09-15 evening every merged row is live. Serving revisions, read by field:

```
hauska-engine-api   00230-cic   (P-219 + P-221 + P-228)
hauska-mcp-server   00094-nis   (P-234)
cortex-api          00805-jil   (P-214 + P-232)
property-explorer   8r0btsuy9   (P-216 + P-218)
factory writer jobs af5fd158… / b35bc2d0…  (P-229)
```

## IN FLIGHT

None. `g131-tenant-resolution` has shown as claimed since **2026-09-15T01:06Z** — treat as a
stale claim and confirm before assuming a lane is live.

---

## THE QUEUE, in the order I would run it

Each carries done-looks-like and the instrument. Repo is the sequencing constraint: one owning
seat per repo, so same-repo rows serialize.

### P-235 — the write-time envelope fix · legacy-design-tools
**Not hauska-engine.** P-226 traced the live call and contradicted its own dispatch's repo
attribution; the implementation is entirely in `artifacts/api-server/src/lib/buildableEnvelope/
{derive,geometry,edgeLabeling}.ts`. Candidate cause, **named and explicitly unverified**:
`geometry.ts`'s `buildForbiddenStrips` per-edge rectangle-strip union has no mitred or rounded
join at ring vertices, so it can under-cover the forbidden area at each convex joint of a
multi-chord curved frontage.
**Done:** on a named radius-street parcel the drawn front edge is offset from the frontage by
the front setback and never crosses it; a straight-frontage parcel is unchanged.
**Instrument:** a fixture built from that parcel's REAL ring that fails before and passes after.
**Do not:** wire up `insetParcelBySetbacks` (confirmed dead code, uniform inset, cannot produce
a correct front setback by construction).

### Flood async port · hauska-engine
**Scope it to cover SITE-PLAN EXPORT as well.** It is not flood-specific — see pattern 2.
**Done:** the route returns immediately and the client polls a download, per P-155's pattern.
**Instrument:** the engine's own request log, showing the client no longer aborts.

### P-231 — the standalone site-plan caller · repo TBD, NOT hauska-engine
**Done:** a customer-visible standalone site plan prints the parcel's real address and county.
**Instrument:** the caller is named with file and function, and why the composed path populates
the descriptor while the standalone path does not.
**Do not:** fix it in the renderer. A renderer that invents an address it was not given is the
fabrication class this program refuses.

### P-230 — cells written, customer served a pre-write bake · hauska-engine + LDT
**Done:** a written cell demonstrably reaches `get_smart_site` with a `bakedAt` LATER than the
write, and any close claiming a rail is served cites that read rather than a gate verdict.
**Instrument:** read the bake's trigger. Two mechanisms to discriminate — the bake is merely
late, or nothing re-bakes a parcel when its cells change. **Do not assume the cheaper one.**

### P-236 — the county coverage floor · hauska-factory
A Travis bake with only Pflugerville and Lakeway stamped would overwrite ~233k zoned nodes with
~35k, and **the existing row-level monotonic guard would not catch it**, because every row it
wrote would be valid.
**Done:** a county column REFUSES to promote when its zoned-node count falls below a declared
fraction (recommended 95 percent) of the prior bake.
**Instrument:** proven BY VIOLATION against a deliberately undersized bake. A **refusal**, not a
detector — this operation has a long record of detectors later found dormant or starved.

### P-222 — five remaining reporting defects · hauska-engine
D5, D7, D8, D9, D11 are untouched (D3 split to P-231). D7, D8 and D9 share one shape: **the
facet has the data and the report does not ask.** Probably one lane, not five.

### P-233 — the setback acquisition program · scoping, then acquisition
**RULED 2026-09-15 (operator):** a PUD parcel gets an honest *"your setbacks come from your PUD
ordinance"* message for now, **not** per-parcel acquisition. That disposes of the largest bucket
(35 districts, 9,485 parcels) without acquiring anything.
Remaining: **acquire 131 districts / 5,095 parcels**, sequenced by parcel count, not district
count.

### Austin re-acquisition · engineering, NOT a credential
**Measured 2026-09-15, anonymously, no token:** org `0L95CJ0VTaxqcmED`,
`PLANNINGCADASTRE_zoning_large_map_scale/FeatureServer/0`, HTTP 200, **22,504 polygons**,
`wkid 102739 / latestWkid 2277`.
**The schema check has two halves.** `ZONING_BASE` carries COLLAPSED codes (`SF`, `MF`, no
numeric suffix) and our table keys on SF-1/2/3 and MF-1..6 **which carry different setbacks** —
stamping from it would be fabrication. `ZONING_ZTYPE` carries the full code (SF-1, SF-2, SF-3,
MF-1, MF-3, MF-6 all present) across **557 compound values** appending overlay districts, so the
base must be parsed off a prefix. **A naive split on `-` yields `CS` where the base is `CS-1`.**
`SF-6` (153 polygons) is a genuine uncodified district, not a parser miss.
**Fallback:** Path 1 remains viable — the org's `tokenServicesUrl` is
`www.arcgis.com/sharing/generateToken`, i.e. ArcGIS Online, not a city portal.
**STANDING RULE until P-236 exists: Travis stays OUT of any bake while Austin is unmeasured.**

---

## RULINGS IN FORCE

- **PUD parcels** (operator, 2026-09-15): an honest *"your setbacks come from your PUD
  ordinance"* message for now, **not** per-parcel acquisition. Disposes of P-233's largest
  bucket — 35 districts, 9,485 parcels — without acquiring anything.
- **X-ray metering** (operator, 2026-09-15, P-237): **accept** the meter tick on a hollow
  refresh. A tick costs nothing today — verified on deployed main: `handleSettledOveragePayment`
  has zero call sites, `amount_minor` lands `null` with `graceTerms: "pending-rate"`.
  **TRIGGER, and it is unenforced today: moving metering after the engine's verdict must land
  BEFORE any real `perReferenceRateMinor` is set.** The moment a rate exists those rows stop
  being free and start being wrong. "Someone remembers" is not a control — the enforcing check
  (CI fails when a finite rate resolves while the metering order is unchanged) is owed.
  Option (c), a cheap pre-engine hollow pre-check, is **refused**: it is the shape of the
  defect P-234 removed.
- **Travis stays OUT of any bake** while Austin is unmeasured, until P-236 exists.

## OWED, and not to be quietly folded into something else

1. **Lockhart.** Its ArcGIS service is gone from its org entirely (`400 Invalid URL`). No public
   replacement has been searched for. **This is NOT resolved by Austin's answer.**
2. **The 7 remaining Hays cities** for the envelope group (P-211 leave_behind).
3. **`surface-probe.mjs` has no leg** for P-214, P-216, P-218, P-219, P-221 or P-228. Six rows
   shipped that it could not confirm. Named by four separate closes now.
4. **`derive.ts` does not read `max_lot_coverage_pct`'s own `not_specified` provenance** —
   affects real codified Bastrop rows today. Found by P-232, not fixed.
5. **`zoning-layers.ts` carries a false "verified" claim** about a Georgetown `RL` code the live
   table no longer holds. A wrong verification claim is worse than an absent one.
6. **`insetParcelBySetbacks`** is exported, tested and called from nowhere. Decide: delete or
   revive.
7. **The "Cloud Run Deploy (cortex-api)" workflow is named for something it does not do on
   push.** Rename it or make the push job state build-only.

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
