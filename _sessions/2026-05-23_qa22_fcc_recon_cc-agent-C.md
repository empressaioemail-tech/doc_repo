---
title: cc-agent-C QA-22 FCC recon — three-step report
date: 2026-05-23
agent: cc-agent-C
repo: legacy-design-tools
kind: session-summary
dispatch: 2026-05-23_cc-agent-C_qa22_fcc_recon
related: [43_cortex_qa_backlog, 2026-05-23_cc-agent-C_qa22_upstream_probe, 2026-05-23_cc-agent-C_qa22_throw_path]
---

# QA-22 SCOPE B follow-up — FCC three-step recon

PR #94 (90s timeout + 15-min in-mem cache) shipped on
cortex-api-00023-6l4, but operator reproduced on Redd:
3 force-refreshes, all failed with `did not respond in time during
attempt 1`. Cache can't warm because there's no successful response.

Dispatch held a three-step recon for the next operator decision —
no fix yet, per "Held for operator merge + redeploy + re-test
before any further fix lands."

Shipped: **PR #96** ([`fix/qa22-fcc-recon-logging`](https://github.com/empressaioemail-tech/legacy-design-tools/pull/96)) — STEP 2 only (structured logging). STEP 1 and STEP 3 are diagnostic, not code.

## STEP 1 — Exact URL the adapter constructs

Adapter source: [`lib/adapters/src/federal/fcc-broadband.ts`](https://github.com/empressaioemail-tech/legacy-design-tools/blob/main/lib/adapters/src/federal/fcc-broadband.ts)

```
const FCC_BDC_AVAILABILITY_ENDPOINT =
  "https://broadbandmap.fcc.gov/nbm/map/api/published/location/availability";

// In run():
const url = new URL(FCC_BDC_AVAILABILITY_ENDPOINT);
url.searchParams.set("lat", String(ctx.parcel.latitude));
url.searchParams.set("lng", String(ctx.parcel.longitude));
```

For Redd (`38.5733, -109.5498`), the constructed URL is:

```
https://broadbandmap.fcc.gov/nbm/map/api/published/location/availability?lat=38.5733&lng=-109.5498
```

Headers sent with the request:

- `User-Agent: smartcity-plan-review/1.0 (+https://cortex.empressa.io)`
- `Accept: application/json, */*;q=0.1`

## STEP 2 — Structured logging (PR #96)

Three JSON-line log events emitted from `fccBroadbandAdapter.run`:

| Event | Level | Fields |
|---|---|---|
| `fcc:broadband request start` | info | `url`, `lat`, `lng`, `timeout_ms` |
| `fcc:broadband request ok` | info | `url`, `http_status`, `attempts`, `duration_ms`, `response_size_bytes`, `provider_count` |
| `fcc:broadband request failed` | warn | `url`, `error_type` (`network` \| `status` \| `parse`), `http_status` (when known), `attempts`, `duration_ms`, plus `throw_excerpt` (from PR #92) or `body_excerpt` (from PR #88) — whichever applies |

Implementation: small `fccLogEvent(level, msg, fields)` helper at
the top of the file, dispatching to `console.info` /
`console.warn` with a JSON-stringified field bag. The adapters
package has been IO-free apart from injected `fetch`; adding a
logger dependency just for this would over-couple. Cloud Run's
logs explorer auto-parses JSON-formatted stdout lines as
structured entries, so the operator filter idiom
(`jsonPayload.msg="…"`) works identically to a pino entry.

Defensive against non-serializable fields (circular refs, Symbols)
— falls back to a minimal `{level, msg, adapter_key}` entry rather
than throwing inside the adapter's hot path.

No behavior change. PR #92's caller-abort-wins invariant
untouched. 227/227 adapter tests pass; workspace typecheck clean.

## STEP 3 — Workstation curl results

Curled the exact URL from STEP 1 (Windows schannel, used
`--ssl-no-revoke` for the second attempt onward because
schannel's OCSP responder reachability is a workstation-specific
quirk irrelevant to Cloud Run's OpenSSL).

### Attempt 1 — adapter UA + `Accept: application/json, */*;q=0.1`

```
http_code=000
size_download=0
content_type=
time_namelookup=0.005s
time_connect=0.041s    (TCP handshake fine)
time_appconnect=0.125s (TLS handshake fine)
time_starttransfer=0.000s
time_total=19.375s
remote_ip=23.209.15.124  (Akamai edge)
curl: (56) Recv failure: Connection was reset
```

Server held the connection ~19s, then sent **TCP RST**. Zero
bytes received.

### Attempt 2 — browser UA (Chrome 130) + Referer + Accept-Language

```
http_code=000
size_download=0
time_appconnect=0.326s (TLS handshake fine)
time_starttransfer=0.000s
time_total=60.014s
remote_ip=23.209.15.124  (same Akamai edge)
curl: (28) Operation timed out after 60013 ms with 0 bytes received
```

Server held the connection the full **60s timeout** with no
response and no RST. Different behavior from attempt 1 but same
end result: zero bytes.

### Attempt 3 — FCC homepage `https://broadbandmap.fcc.gov/` HEAD with adapter UA

```
curl: (28) Operation timed out after 30002 ms with 0 bytes received
```

**Same hang pattern on the homepage**, with the same adapter UA.
So the failure isn't endpoint-specific — `broadbandmap.fcc.gov` as
a whole drops our connection silently from this workstation.

### Interpretation

| Layer | Status |
|---|---|
| DNS resolution | ✅ Works (~5ms after cache) |
| TCP connect | ✅ Works (~40ms) |
| TLS handshake | ✅ Works (~125ms once revocation check disabled) |
| HTTP request sent | ✅ Sent |
| First byte of response | ❌ Never arrived in any variant |

This is **NOT** a "slow upstream that needs >90s." A slow upstream
would eventually respond. This is the server **silently holding
or RST-ing** the connection after a configurable interval. Pattern
fits Akamai edge bot-mitigation behavior:

- Default UA → RST at ~19s (Akamai's bot manager marks the request
  as automation and tears the connection down).
- Browser UA + Referer → hold-without-response for the full
  duration (Akamai may be waiting on a JS challenge token the
  client never produces).
- Homepage with default UA → same hold-without-response (the WAF
  is gating the entire host, not just the API endpoint).

Reconciling with the dispatch's four hypotheses:

| Hypothesis | Recon verdict |
|---|---|
| (a) FCC API genuinely takes >90s for the Redd lat/lng | ❌ Not slow — server actively RSTs at 19s or holds indefinitely |
| (b) Adapter is hitting a stale/wrong API URL that never responds | ✅ Most likely — endpoint may have rotated; OR Akamai WAF is blocking the request shape |
| (c) FCC API is throttling / blocking Cloud Run egress IPs | ❌ My workstation gets the same behavior; not Cloud-Run-specific |
| (d) Adapter failing instantly inside 90s budget but runner mis-reports as "time budget exceeded" | ❌ PR #92's throwExcerpt would have surfaced any real network throw; the runner correctly reports timeout when the upstream hangs |

## Recommended next dispatch (operator decides)

1. **Identify the current FCC BDC v2 endpoint** — the documented
   path `https://broadbandmap.fcc.gov/nbm/map/api/published/location/availability`
   doesn't work programmatically from any client variant I tried.
   FCC's published API docs at
   `https://broadbandmap.fcc.gov/data-download/nationwide-data` may
   reference a different URL (or may require API-key auth now).
2. **Or accept that BDC v2 is no longer programmatically
   accessible** and either:
   - Switch to BDC bulk-download CSV path (different access
     pattern, requires periodic download + ingest).
   - Drop the FCC adapter entirely (perma-`no-coverage` row).
3. **The 90s timeout + 15-min cache from PR #94 are still
   correct** even if the underlying endpoint changes — both will
   apply to whatever the new endpoint is.

## Deploy + verification

- **PR #96** opens the structured-logging surface; operator merge
  + redeploy required before the next Redd retry will emit the
  new events.
- After deploy, expected new events on next Redd Generate Layers:
  - `fcc:broadband request start` carrying the exact URL.
  - `fcc:broadband request failed` carrying `error_type` (likely
    `network` with `throw_excerpt` "UND_ERR_HEADERS_TIMEOUT" or
    similar undici code) and `duration_ms` ≈ 90000 (the timeout
    floor).
- Operator can then filter Cloud Run logs for these events and
  decide the next mitigation off the structured payload — no more
  guessing whether the upstream is slow vs. unreachable.

## Verification (this PR)

- Branch off `origin/main` HEAD `79b5208` (includes PR #95) in
  isolated worktree per the workspace-hygiene memory.
- `pnpm --filter @workspace/adapters run typecheck` — clean.
- `pnpm --filter @workspace/adapters test` — 227/227 passing.
- `pnpm run typecheck` (workspace-wide) — all 7 artifacts +
  scripts green.
- Workspace YAML + lockfile reverted per
  `project_windows_test_natives` workaround.

## Out of scope (confirmed not touched)

- QA-33 / QA-35 (closed in prior sessions).
- QA-22 SCOPE A EPA (still operator decision — EJScreen
  hostname decommissioned, no successor found).
- QA-22 SCOPE C Grand County (still operator infra — VPC + NAT +
  whitelist).
- 2D-site-context (cc-agent-C2 territory).
- Any fix to the FCC adapter beyond the recon logging — held
  for next dispatch per "no fix yet."
