---
id: 2026-09-17_p249_canary_proof
title: P-249 canary proof (integration seat), 2026-09-17
date: 2026-09-17
last_updated: 2026-09-17
status: filed
kind: proof record
owner: nick
maintained_by: integration seat
programs: [OPS-24]
related:
  - _catalog/dispatch_missions/mission_p249_envelope_ok_unlock.md
  - _inbox/2026-09-16_p249-envelope-unlock_close.json
  - _inbox/2026-09-17_p249_canary_proof_cortex_leg.json
snapshot: LDT PR #701 integrated head f816c214 (image sha256:1dd13996, revision cortex-api-00819-wug, tag p249-f816c21, 0 percent traffic); hauska-map PR #409 head ee7e3c76 (preview deployment property-explorer-ocfnbe9et, asset index-DlPhgknT.js); production cortex-api-00817-niq and property-explorer deployment fyn3qud4j (asset index-CdRcxY5b.js); read 2026-09-17 13:22Z to 13:34Z
---

# P-249 canary proof

## How it was run

The operator ruled on 2026-09-17 that the proof runs on a canary with production data read-only and no writes. Staging was not usable as specified: the cortex `staging` revision reads the production atoms store, and nothing reads `STAGING_ATOMS_DATABASE_URL`, so a verified zero could only have been minted in production.

LDT #701 was merged with main (`f816c214`, 11 of 11 checks green). Its image was built by Cloud Build with BuildKit and deployed as `cortex-api-00819-wug`, tag `p249-f816c21`, at zero traffic. Its environment is identical to the serving revision's (67 variables, sensitive values compared by hash).

hauska-map #409 was deployed as a Property Explorer preview with `CORTEX_API_URL` set to that tag. The first preview failed every panel read with `retrieval_auth_failed`, because the Preview environment's `HAUSKA_RETRIEVAL_API_KEY` predates P-251's rotation. The preview was redeployed with the live key set on that deployment only; the project's Preview variable is unchanged and still stale.

Instruments: `p249-proof.mjs`, which grades the cortex route for fixed fixtures (self-test 9 of 9, including cases that must fail), and a panel-facets comparison of the preview against smartsite.cloud. Every read was a GET, or a POST to the envelope route, which writes nothing.

## Results

| Fixture | Cortex, production | Cortex, canary | Panel, production | Panel, preview | Verdict |
|---|---|---|---|---|---|
| (a) `48209:97658`, unverified zero (reasonless breadth-bake atom) | `no-buildable-area`, empty | `ok`, polygon drawn | declined, `envelope-unverified` | `ok`, `envelope-unverified`, `figureWithheld: true` | **PASS** |
| (b) verified zero minted on staging | not run | not run | not run | not run | **Graded on the two repos' fixture tests**, per the ruling. No real production verified zero could be searched: the atoms store was held by a publish lease, and the proof took no lease in contention |
| (c) validation-failed ring | `48021:8723767` draws | draws | `ok` | `ok` | **UNMEASURED.** This fixture's atom carries the R32 machine-verify diagnostic, which never emptied a live envelope (P-214). Its live ring does not fail validation today, so it is not a (c) case, and no parcel with a live failing ring is known |
| XD-2 Waco `48309:103015` (atom reason "no district on record, jurisdiction not yet onboarded"; setback on record) | `no-buildable-area`, empty | `ok`, polygon drawn | declined, `no-zoning-stamp` | declined, `no-zoning-stamp` | **FAIL at the panel** |
| Pflugerville `48453:427599` | draws | draws | `ok`, no area figure | `ok`, no area figure | **PASS** |

**Build identity** was checked by asset existence. Each build's `/assets/index-*.js` returns `application/javascript` only on its own host; the other host returns the HTML fallback with status 200, so the check keys on content type, not status.

**Rollback rehearsal:** a throwaway `vercel.app` alias was moved old, then new, then old, then removed, twice. Identity moved both ways and converged within 20 seconds each time. **For 5 to 20 seconds after each switch the alias served the previous build's HTML while that build's asset returned HTML**, so a browser loading in that window gets a broken page. This is the 2026-09-15 incident class (A-157). A production rollback should expect that window.

## Findings

1. **The two halves disagree on the "not onboarded" class** (about 153,775 of the 490,185 six-county atoms). LDT #701 treats it as unverified and draws; hauska-map's `atom-chain-to-facets` still declines it with `no-zoning-stamp` although the same payload's zoning facet holds the district (`R-1B`, `waco-tx`). This is the X8/XD-5 defect, and it is why XD-2 fails. The shared fixture lists `not-onboarded` as unverified, but the map reaches its own earlier decline branch before the predicate the fixture governs. So the fixture's divergence test cannot see it.
2. **The envelope route returns the derived area on every drawn envelope** (`payload.geojson.features[].properties.buildableAreaSqFt` and `buildableAreaPct`), and the route is reachable anonymously through Property Explorer's proxy (POST allowlist). Withholding is enforced only by the surfaces (the panel's `figureWithheld`, the MCP's `derivedFigures.denies`). An anonymous caller can read the figure the 2026-09-11 ruling withholds. This predates P-249.
3. **The Vercel Preview environment's `HAUSKA_RETRIEVAL_API_KEY` is stale** (P-251 fixed Production only), so every Property Explorer preview silently fails its atom-chain read.
4. **Envelope fixture 48021:8723767 is mislabelled for the staging proof.** It tests the atom predicate (a diagnostic reason), not a live failing ring.

## State left behind

- `cortex-api-00819-wug` (tag `p249-f816c21`) at zero traffic.
- Two Property Explorer preview deployments (`qwl9agk48` has the stale key; `ocfnbe9et` has the live key on the deployment only).
- Clones `P:/tmp/integration-p249-ldt-f816c21` and `P:/tmp/integration-p249-map-ee7e3c7` (its pulled `.env.local` was deleted).

No store was written. No alias remains.
