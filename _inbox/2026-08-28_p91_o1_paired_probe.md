---
id: 2026-08-28_p91_o1_paired_probe
title: P-91 item 7 O1 — paired live probe 48021:33223
date: 2026-08-28
status: evidence
plan_row: P-91
wdll_item: 7
decision: _decisions/2026-08-28_p91_o1_envelope_xray_must_refuse.md
payload: _inbox/2026-08-28_p91_o1_paired_probe.json
---

# O1 paired probe — 48021:33223 (927 MAIN ST, Bastrop)

Snapshot: 2026-08-28T17:02Z. Agent on `P:\doc_repo` main `843b3437`. No product code. No commit. No deploy. Companion JSON is redacted: no Authorization header, no key, no cookies.

Ruling B stays. This file does not flip `_decisions/2026-08-28_p91_o1_envelope_xray_must_refuse.md`.

## Falsifiers (stated before the results)

Pass B: MCP `get_smart_site` / R1 refuses envelope (`refused` / `atom_path_pending`, brief `setbacks-envelope` data null) and the X-ray still derives a lot-percentage. Disagreement. X-ray change still owed.

Pass A: both surfaces serve the same lot-percentage. That would falsify ruling B. Report it. Do not flip the decision from this probe.

Unmeasured X-ray: named if the composed sheet (`envelope.kind`, `areaPctOfLot`, verdict) cannot be hit without writing product code. Allowed.

## Serving observed

`gcloud run services describe --format=json` and `gcloud run revisions describe --format=json`. Fields read by name, not positional `--format=value`.

`status.traffic` names `revisionName` `cortex-api-00635-qux` at `percent` 100 with tag `canary`. `status.address.url` is `https://cortex-api-tds7av26va-uc.a.run.app`. Revision annotation `autoscaling.knative.dev/minScale` is `1`. `status.imageDigest` is `us-central1-docker.pkg.dev/legacy-design-tools-prod/apps/cortex-api@sha256:2437d70444edb18607cdae5e3a38058d47031ed3142b70d0d79135a4105d1d71`. `desiredReplicas` is 1. `MinInstancesProvisioned` is True.

`smartsite-mcp` traffic names `revisionName` `smartsite-mcp-00020-ced` at `percent` 100. Revision `status.imageDigest` is `us-central1-docker.pkg.dev/legacy-design-tools-prod/apps/smartsite-mcp@sha256:9d8c7abe0d28c47f3ce71eb79cf131d2b96f406c5b9e07237f6896ef0463491f`. Live `GET https://mcp.smartsite.cloud/health` returns `revision` `smartsite-mcp-00020-ced`.

That matches the expected serving revision.

## MCP / R1 (measured)

Instrument: `POST /api/property-explorer/v1/research/brief` on the production cortex URL. Same path `get_smart_site` calls. Service bearer plus operator PE user header. Key never printed and never written to a file.

200 in 692 ms. `parcelNodeId` `48021:33223`. `draw.label` `927 MAIN ST , BASTROP, TX 78602`. Draw ring present (4 vertices, matches the O5 store projection).

Envelope overlay: `id` `envelope`, `state` `refused`, `reason` `atom_path_pending`, `label` `Buildable envelope not computed`.

Brief section `setbacks-envelope`: `data` null. Refusal `code` `declined-in-bake`, `declineReason` `atom_path_pending`. Agent guidance says do not invent setback distances or a buildable polygon.

MCP envelope state is refuse. Pass A did not fire.

## X-ray / Studio fact sheet (composed fields unmeasured)

Reached the public PE facets BFF. Did not reach the composed Studio sheet.

`GET https://smartsite.cloud/api/spine/property-atoms/48021%3A33223/facets` returned 200. Header `X-Pe-Read-Path` `atom-chain-warm`. Body `source` `atom-chain`. `facets.envelope.status` `ok`. District `GC`. Setbacks front 20 / side 5 / rear 20. `buildableAreaSqFt` 1397. `buildableAreaPct` absent. `geojson` absent. Disclosure names live derive (`labelEdges+derive`). Lot acreage on the same payload is 3294 sqft (`shoelace-wgs84`). Those are facet inputs, not `envelope.kind`, `areaPctOfLot`, or verdict.

The Property panel on `https://smartsite.cloud/p/48021:33223` (anonymous browse) rendered chrome only. Page text was 44 characters (`SMART SITE` / nav). No 927, no Buildable, no envelope, no lot-percentage. Sign-in is still on the page. Composed sheet fields were not on the wire and not on the anonymous UI.

Optional live derive witness (`POST …/place/buildable-envelope` with `{ address: "927 MAIN ST, BASTROP, TX" }` only) returned 200 for a different node: `48491:R419407` / Liberty Hill. That is not 33223. Do not use it as this parcel's percentage.

Do not invent 42 percent from 1397 / 3294. That quotient is not a measured X-ray verdict.

## Which falsifier fired

`unmeasured_xray` fired. MCP refuse is measured. Composed X-ray (`kind` / `areaPctOfLot` / verdict) is not.

Pass B did not fire. A lot-percentage on the X-ray was not observed.

Pass A did not fire. MCP did not emit a percentage.

Ruling B is not falsified. The X-ray change is still owed. Wave C iframe stays blocked on that change, not on this record.

## Second mechanism, then why it was rejected

The observation is R1 refuse plus atom-chain facets `status: ok` with a square-foot number and no percentage. The mechanism I believe is the one the producer read already named: MCP reads bake (tier-1 envelope declined / `atom_path_pending`); the PE BFF reads the atom chain (setbacks present, geometry withheld, live derive named in disclosure). Different paths, same fact class.

The second mechanism that would look the same is a missing bake that still prints a refused overlay. Rejected: the brief is 200 with a baked snapshot (`bakedAt` 2026-08-28T15:09:57Z), a situs label, and a closed ring. A miss would 404 `baked_snapshot_not_found`.

A third mechanism is that the anonymous Property panel is the X-ray and it already refuses. Rejected: the panel had no parcel text at all. Absence of a percentage on an empty chrome shell is not a refuse.

## leave_behind

Composed Studio fact-sheet / X-ray for `48021:33223` (`envelope.kind`, `areaPctOfLot`, verdict). Owner property / hauska-map `fix/p91-o1-xray-refuse`. Plan row P-91 item 7. Anonymous `smartsite.cloud/p/48021:33223` Property panel did not mount the sheet.
