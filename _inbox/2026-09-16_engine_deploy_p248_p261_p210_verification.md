---
id: 2026-09-16_engine_deploy_p248_p261_p210_verification
title: Engine and retrieval deploy for P-248, P-261 and P-210, verified on the served revisions
date: 2026-09-16
last_updated: 2026-09-16
status: deployed and verified, with one leg of P-261 not capturable live (named below)
kind: deploy-record
owner: integration seat
plan_rows: [P-248, P-261, P-210]
snapshot: hauska-engine d88cf6503f60c4835c8b2ce9c7b7643dcc099d39 (main, CI "typecheck + test" success), built from a fresh clone; deploy and probes 2026-09-16T18:54Z to 19:12Z
---

# Engine and retrieval deploy, 2026-09-16

## What was deployed

| Service | Image | Revision | Before |
|---|---|---|---|
| hauska-engine-api | `hauska-engine-api@sha256:f24c0f22…` (Cloud Build `cloudbuild.engine-api.yaml`, `services/engine-api/Dockerfile`, tag = the full SHA) | `00247-san`, 100 percent | `00245-hox`, image `f60971c3…` built from `422c7d3a` (before P-248, P-261) |
| hauska-retrieval-api | `hauska-retrieval-api@sha256:6e9ba2ef…` (root Dockerfile, tag = the full SHA) | `00092-lag`, 100 percent | `00090-pop`, image `d0575cf2…` built 2026-09-13 (before P-210) |

Both were deployed by digest with no traffic under a tag, probed on the tag URL, then shifted. Traffic
was read back by field. Traffic leases were taken and released. Secrets and settings were carried
over unchanged; the gate token and retrieval key resolve to the value rotated earlier today
(P-251).

## P-210, the coverage endpoint (tag URL, then service URL)

| Query | Answer |
|---|---|
| no Authorization header | 401 |
| Austin 78701 | `covered` (the first call returned an empty body, cold start; repeat calls 0.1 to 4.2 s) |
| Bastrop 78602 | `covered` |
| Killeen 76541 (Bell) | `covered`, from the July bake (P-291) |
| Cameron 76520 (Milam) | `not-covered`, county 48331 |
| Marble Falls 78654 (Burnet) | `indeterminate`: the ZIP spans 48053 (11,391 rows) and 48453 (1,850) with no dominant county |
| Denver 80202 | `indeterminate`, outside Texas |

The Property Explorer facets route (which calls retrieval) returned 200 after the shift.
**Finding for Burnet:** Marble Falls resolves `indeterminate`, so a Burnet address will read
"coverage check unavailable" once P-205 is deployed unless the locality rule handles a
ZIP split like this one. Carried to the roadmap.

## P-248 and P-261, on exported PDFs

Exports were refreshed on the new revision (the same action a customer export takes) and the
PDFs decoded with the lane's own decoder (`decode-pdf-text.ts`, glyph-to-Unicode remap).

| Parcel | Envelope data | What the PDF shows |
|---|---|---|
| 908 Pine, `48021:34137` | buildable 9,350, verified | Footprint drawn with the label "EXISTING STRUCTURE · ML-DERIVED · UNSURVEYED" and the legend row "Existing structure · ML-derived, unsurveyed". Area withheld: "the buildable-envelope atom on file was derived from setback values this study no longer follows" (the P-219 refusal, kept ahead of the new check by design). 9,350 absent. |
| `48021:34049` | buildable 19,052, verified | Footprint drawn with the same label; area withheld for the same P-219 reason; 19,052 absent. |
| `48209:156346` (Hays) | buildable 5,100, not verified | Legend "Existing structure — none mapped · the footprint source was checked and maps no structure here" (the vacant-lot leg). Area unavailable: "No setback rule on file". 5,100 absent. |
| `48055:103652` (Lockhart) | buildable 3,014, verified | **"3,014 sq ft" printed** as the buildable area: the verified leg of P-261, live. |

**Not captured live:** an unverified buildable atom with a setback rule on file, which is the
case P-261's new check alone decides. Every candidate tried failed to compose. Pflugerville
`48453:427599` hit a database statement timeout and did the same on the previous revision;
Caldwell `48055:18931` hit a USGS 3DEP 504, and a 502 on the previous revision; Williamson
`48491:R400009` hit the same statement timeout and was not re-run on the previous revision. These
look pre-existing (the P-244 class) and external rather than regressions. The lane's regenerated-PDF probe
covers that leg; the live leg stays owed.

## Side effects, stated

Nine site-plan export refreshes ran against production data (seven on the new revision, two on
the old revision for comparison), each rewriting that parcel's export record exactly as a customer
export would. The `envelope-canary` tag follows the latest revision and now points at
`00247-san`.
