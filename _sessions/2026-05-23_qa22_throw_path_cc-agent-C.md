---
title: Cortex QA close-out — QA-22 reopen network-throw capture (cc-agent-C)
date: 2026-05-23
agent: cc-agent-C
repo: legacy-design-tools
kind: session-summary-draft
status: draft — HR-11 report. Durable copy lives at
  legacy-design-tools/_research/2026-05-23_qa22_throw_path_session_close_cc-agent-C.md.
dispatch: 2026-05-23_cc-agent-C_qa22_throw_path
related: [43_cortex_qa_backlog, 2026-05-23_cc-agent-C_qa33_qa22_cleanup_batch, 2026-05-23_cc-agent-C_qa33_qa35_followon]
---

# Cortex QA close-out — cc-agent-C (QA-22 reopen follow-on)

Follow-on to the 2026-05-23 cleanup batches (PRs #87, #88, #90).
PR #88's `bodyExcerpt` path doesn't trigger on the four
QA-22-affected adapters — they fail at the Node fetch level with
no response object to read from. This session closes that
diagnostic gap.

| Item | PR | Branch | State |
|---|---|---|---|
| QA-22 reopen — network throw capture | #92 | `fix/qa22-throw-path-capture` | open for review |

## SCOPE A — what the diagnostic gap was

PR #88's `bodyExcerpt` path captures up to 256 chars of the
upstream response body when a non-OK HTTP response comes back.
That works for the schema-drift class of failures. It does NOT
work when the request never reaches the upstream's HTTP layer:

- **DNS failure** (`ENOTFOUND`) — `getaddrinfo` couldn't resolve
  the hostname.
- **TLS handshake reject** (`CERT_HAS_EXPIRED`, `DEPTH_ZERO_*`,
  version/cipher mismatch) — connection opened but handshake
  failed.
- **ECONNREFUSED** — connection rejected by the upstream
  (firewall, IP filtering against Cloud Run egress ranges).
- **ECONNRESET** — connection accepted then dropped mid-flight.
- **AbortError on attempt 1** — fetch aborted by per-adapter
  timeout.

In each case `node:undici` throws a `TypeError("fetch failed")`
whose `cause` carries `{ code, errno, syscall, address, port,
host, hostname }`. The current `AdapterRunError` message
includes only `err.message` — i.e. the literal string
`"fetch failed"` — and discards the cause entirely.
Operator-verified on cortex-api-00020-85n: all four adapters
surface as `fetch failed` or `did not respond in time` with no
diagnostic detail.

## Fix (PR #92)

Diagnostic-add only. No mitigation yet — held for operator
reproduce + mitigation choice in the next session.

### retry.ts (behind opt-in flag for backward-compat)

- `FetchWithRetryOptions.captureThrowsAsResult` (new, default
  false): when set, a final-attempt or non-transient fetch throw
  no longer surfaces as `AdapterRunError("network-error", …)`
  direct-from-helper. Instead the helper returns a synthetic
  599 response with `throwExcerpt` populated, collapsing the
  throw-path failure into the same `!res.ok` branch the caller
  already has for HTTP non-OK responses. Transient throws still
  retry exactly as before; only the *final-attempt* throw
  posture changes.
- `FetchWithRetryResult.throwExcerpt` (new): compact one-line
  summary extracted from `err.cause` via the new exported
  `readThrowExcerpt(err)` helper. Format `<code> <syscall>
  <host|address:port>` when cause-side fields are populated;
  `<name>: <message>` fallback when not.
- Caller-abort still wins over `captureThrowsAsResult` — the
  operator wants "did not respond in time" on a budget elapsed,
  not "Network error: AbortError".

### Adapter wiring (3 call sites cover all 4 affected adapters)

- `arcgis.ts` — backs `grand-county-ut:parcels` + `:zoning`
- `federal/epa-ejscreen.ts` — backs `epa:ejscreen`
- `federal/fcc-broadband.ts` — backs `fcc:broadband`

Each: passes `captureThrowsAsResult: true`, destructures
`throwExcerpt`, branches `!res.ok` to throw
`AdapterRunError("network-error", "<label> did not get a response
after N attempt(s). Network error: <throwExcerpt>. Use Force
refresh to retry.")` when populated.

Out-of-scope call sites (OSM Overpass roads fallback, USGS NED,
FEMA NFHL, state-tier lookups) keep the legacy throw posture —
the opt-in flag preserves their behavior unchanged.

### Tests (7 new)

In `describe("throwExcerpt capture (QA-22 follow-on)")`:

- DNS failure (`ENOTFOUND`) — captured + surfaced, retries to
  exhaustion, 599 returned.
- TLS failure (`CERT_HAS_EXPIRED`) — captured, no retry, 599
  on attempt 1.
- `ECONNREFUSED` with no host/hostname — falls back to
  `<address>:<port>`.
- Caller-abort still throws `AdapterRunError("timeout")` even
  when `captureThrowsAsResult` is set.
- `bodyExcerpt` path still works for response-bearing failures
  when `captureThrowsAsResult` is set (no regression).
- Legacy throw posture preserved when `captureThrowsAsResult`
  is NOT set.
- Fallback to `<name>: <message>` when the throw has no
  cause-side structure.

## Operator handoff

Merge → redeploy → re-run Generate Layers on Redd → read the
four failed-layer pills. The pill text now names the actual
network failure mode. Next session picks the mitigation:

| Pill text contains | Failure class | Mitigation candidate |
|---|---|---|
| `ENOTFOUND getaddrinfo …` | DNS | explicit `dns.lookup({family:4})` resolver, or Cloud Run init-container hosts pinning |
| `ECONNREFUSED` / `ECONNRESET` | Firewall/egress IP | VPC connector + Cloud NAT with allocated egress IP + per-vendor whitelisting |
| `CERT_HAS_EXPIRED` / `DEPTH_ZERO_SELF_SIGNED_CERT` | CA bundle | `NODE_EXTRA_CA_CERTS` with the upstream's CA chain |
| TLS handshake with no `cause.code` | Version/cipher | `https.Agent({minVersion:"TLSv1.2", ciphers:…})` |
| `AbortError` / timeout-class | Genuine slow upstream | different fix path — investigate the 45s floor headroom |

## Verification

- Branch off `origin/main` HEAD = `5f246f2` (includes PR #91's
  docs update) in an isolated worktree.
- Per-package typecheck via the Windows native-deps workaround —
  all 7 artifacts + scripts green.
- Adapters test suite: 224/224 passing (217 pre-existing + 7
  new).
- Workspace YAML + lockfile reverted post-verify.

## Held / not touched

- **QA-22 mitigation choice** — by design. Held for operator
  reproduce after PR #92 ships, per the dispatch's explicit
  hold-for-reproduce gate.
- **Cached-last-good fallback in `runner.ts`** — still a
  worthwhile follow-on but blocked on knowing the actual
  failure mode first.
- **Phase 3 features (QA-27 / 28 / 29)** — deferred behind
  2D-site-context.
- **2D-site-context Phase 2D.1** — fires after both cleanup
  dispatches close + verify.
