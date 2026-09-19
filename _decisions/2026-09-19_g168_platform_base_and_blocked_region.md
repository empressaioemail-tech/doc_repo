---
decision_id: 2026-09-19_g168_platform_base_and_blocked_region
date: 2026-09-19
owner: Nick (ruling requested in session; measurement taken by the integration seat)
status: active
related_canonical:
  - 90_operations/OPS-17_govtech_stack_plan_of_record.md
  - _inbox/2026-09-18_HANDOFF_smartcity_planner.md
---

## Decision

`SMARTCITY_V1_PLATFORM_BASE` on `dolphin-app` stays pointed at `https://walrus-app-kzog6.ondigitalocean.app`. It is not repointed, because the base is not broken and the deployed app's own reads already succeed through it. The repoint is carded as conditional hygiene on G-171 with a trigger, not dispatched, and G-168 closes on a measurement that its own dependencies column said could not be taken.

## Context

G-168 was carded on 2026-09-19 as an orphan finding out of OPS-25 D-13: DigitalOcean's ingress replaced an application 5xx with its own page, so a vendor-blocked feed could not deliver its named refusal. G-163 closed that mechanism by re-issuing 502/503/504 as 424 with the handler's body untouched. What remained was the row's residual, stated in its dependencies column as an UNMEASURED deployed surface, and framed as a binary:

> It needs a probe from inside the DO network, or a decision to point the base at `https://smartcityos.io`.

The reason the region could not be read was recorded as the network: `dolphin-app` sets `SMARTCITY_V1_PLATFORM_BASE=walrus-app-kzog6.ondigitalocean.app`, and from the integration seat every leg against that host, including the healthy-sibling control, returned `ECONNRESET`, which the row read as placing the limit on the path rather than on any route.

The seat took a third option. The deployed dashboards app composes the region server-side for the real `bastrop_tx` pack when the caller presents a tenant identity, so the region's own `status` and `basis` are readable from outside if you have that identity and not because you can reach the default hostname. G-135's lane-verification key is that identity, read at point of use from Secret Manager and never persisted.

## What was measured

Four passes, deployed app `app.smartcityos.io` serving `smartcity-dashboards` at commit `ea27024f55223a51f6ab43d88bc26504ba53c7f9`, active deployment `ba9acf62-6662-408b-8c78-5615415b06d7`.

| Feed | Rendered status | Rendered basis | Records |
|---|---|---|---|
| `fire-apparatus` (FirstDue) | `unavailable` | the FirstDue scope sentence naming `dashboards@firstarriving.com` | 0 |
| `call-analytics` (GoTo) | `unavailable` | `goto_not_authorized` | 0 |
| `cip-projects` (PowerBI) | `ok` | `getCIPProjectData() (services/powerbi.ts)` | 14 |
| `fleet-vehicles` (Samsara) | `refused` | the record-shape guard refusing all 75 records | 0 |

All four readings were identical on all four passes. The two vendor-blocked feeds deliver their named refusal to the client, on DigitalOcean, in a body the client actually receives. G-168's acceptance item is met.

Read directly from the platform side, the mechanism is confirmed rather than inferred: `smartcityos.io/api/platform/firstdue/apparatus` answers `424` with `x-orig-status: 503` and the sentence in `body.message`, and `goto/call-summary` answers `424` with `x-orig-status: 503` and `error: goto_not_authorized`. That is G-163's edge re-issue, observed from outside the DO network.

## Why the base is not broken

Four separate feeds reached the platform through `https://walrus-app-kzog6.ondigitalocean.app`. `src/platform-base.mjs` reads one env var with no default and no fallback, so the configured host is the only address those reads could have used. The base works from where the app runs.

The `ECONNRESET` is real and external-only. `www.smartcityos.io` CNAMEs to that very hostname and answers `200` from the same seat over the same path. DigitalOcean masks the auto-generated `*.ondigitalocean.app` ingress to outside clients while the app itself reaches it. The recorded reading, that the limit is on the network path, is correct about the seat and wrong about the product, and the difference is what made a repoint look necessary.

## Why the repoint is still carded, and why it is not dispatched

The default hostname is masked to every external client, so the fleet cannot verify the address its own product reads, while `smartcityos.io` is the app's PRIMARY domain in the DigitalOcean API and is verifiable from anywhere. The `-kzog6` suffix is generated at app creation, so a recreated app changes the address under a config nobody re-reads, and `platform-base.mjs` exists precisely because a stale host stayed live after everyone believed it was off.

That is worth doing and it is not urgent. Changing an env var on `dolphin-app` triggers a rebuild and redeploy from `main`, and `main` is red until G-166 lands, so a config change today would ship a red tree to fix a hostname that is currently working. G-171 carries the trigger.

## What was recorded as transient rather than carded

The first pass of `cip-projects` returned `platform fetch failed: The operation was aborted due to timeout`, the dashboards' own 15s `AbortSignal` firing. The same route answered `200` with 14 records on the following four passes, and `231ms` when read directly. `walrus-app` reports `updated_at: 2026-09-19T11:41:38Z`, thirty-eight minutes before the reading. It is a redeploy artifact with a timestamp. Carding it would have converted a transient into a specification.

## Findings the measurement produced

One, the region's basis is recorded nowhere durable. `dolphin-app`'s RUN log carries two startup banners from 2026-09-18T22:37 and no request-time lines, so a server-composed region behind a tenant gate has no server-side record. That absence, not the base, is why this residual kept failing to close.

Two, `fleet-vehicles` renders zero records while Samsara answers with 75, stable across four passes. The record-shape guard requires the product's own invented status taxonomy while the module it lives in states that real vendor status is kept as-is and not force-mapped. The guard and the stance contradict each other and the guard wins on the deployed path. Carded as G-172.

## Structural commitment check

Sell reasoning, not data: served. The finding is that the region's basis, which is the reasoning the product sells, is rendered correctly for the two blocked feeds and is recorded nowhere durable, which is the gap now named.

Confidence is earned: served. The reading is taken from the deployed surface's own composition, not from the handler's intent or the app spec, which is the standard G-168 itself set.

Cost per jurisdiction: not touched.

Dual interface: not touched.

## Reversal criteria

Reverse the ruling and repoint immediately if the deployed app's platform reads begin failing through `walrus-app-kzog6.ondigitalocean.app`, evidenced by any of the four feeds rendering `platform fetch failed:` rather than a vendor sentence or a record count, on two consecutive passes more than five minutes apart. Reverse the deferral on G-171 earlier if `dolphin-app` is redeployed for any other reason after G-166 goes green, since the redeploy is then already being paid for.

## Instrument

`P:/tmp/g168-live-region.mjs` reads the region with a self-test that asserts both directions on the same route before reporting. `P:/tmp/g168-region-repeat.mjs` repeats the reading so a flapping result is visible as flapping rather than averaged into a verdict. `P:/tmp/g168-base-probe.mjs` established that the default hostname is reached by no client from this seat, with a reachable and an unreachable control.
