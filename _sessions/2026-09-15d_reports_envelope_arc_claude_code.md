---
id: 2026-09-15d_reports_envelope_arc
title: Session — the envelope outage, six deploys, eight lanes, and the pattern that explains them
date: 2026-09-15
status: closed
kind: session
owner: nick
seat: doc_repo integration
---

# Session 2026-09-15d — reports and envelope

Durable state is `_inbox/2026-09-15_reports_and_envelope_WDLL.md`. **Read that, not this.**
This record is what happened and what it cost; the card is what to do next.

## How it opened

The operator asked why the buildable envelope was not rendering on `1010 CHESTNUT ST`. The
inherited handoff said production was on a deliberate rollback, that P-216 had suppressed the
envelope map-wide, and that a merge is proved by reading the `Age:` header.

Three of those were wrong, and finding that out took most of the session.

## What the outage actually was

Not a server regression. The sole infrastructure event in the window was a Vercel deploy at
13:49:47Z and its rollback before 14:00:26Z. Zero Cloud Run revisions across seven services,
zero audit-log mutations, zero secret versions, zero env-var changes, no writer job. The
operator's eight consecutive envelope 404s fall inside that window and a 200 with a real
polygon follows the rollback.

**The browser tab had loaded the deployed build and never reloaded.** Confirmed by the operator
on reload. **A rollback restores the server; it does not reload an open tab**, and every
server-side instrument reads healthy while that is true.

## Four handoff claims refuted, recorded as A-157

1. **"legacy-design-tools auto-deploys"** — false. Its workflow header says push "runs
   build-and-push only", and the run's job record shows all four deploy jobs SKIPPED. P-214 sat
   merged and unshipped for 12.4 hours on this belief.
2. **"read `Age:` to see which build serves"** — a false instrument. The CDN cache object is
   keyed to the deployment and shared with the alias. Asset existence is the sound instrument.
3. **"P-216 suppressed the envelope map-wide"** — not supported. Its `declined` branch is gated
   on an outcome that already failed the live-derive predicate, and its positive branch still
   sets `status: "ok"`. Measured on the unaliased build across seven parcels in two counties.
4. **The outage cause**, per above.

## The three patterns

These are in the durable card in full. Naming them here because they are the session's actual
output.

1. **Fixing a producer does not fix a product when a consumer refuses first.** Three measured
   instances in one day: site plan (P-227 → P-231), cells (P-230, fired on two rows), X-ray
   (P-221 deployed and verified, still blocked until P-234).
2. **A synchronous route outruns the 55,000 ms client abort and the error names the wrong
   mechanism.** Feasibility (fixed, P-155), flood (11 of 11 returned 201), site-plan export
   (56.8–115.9 s, all 201). The engine never failed once in any of them.
3. **No repo auto-deploys on merge.** Asserted three times by three seats, wrong every time,
   costly in both directions.

## Shipped and verified on the customer surface

Six deploys, each verified on the surface a customer uses rather than the API behind it.

| Row | Serving | Instrument |
|---|---|---|
| P-214 | `cortex-api-00805-jil` | disclosure is human prose, no raw diagnostic |
| P-216 + P-218 | `property-explorer-8r0btsuy9` | asset existence on the alias |
| P-219 | `hauska-engine-api-00230-cic` | decoded PDF: 30/10/30 cited Ord. 2026-06, **zero** occurrences of the repealed `2019-51`, the stale `19,052`, or the retired `bastrop-per-parcel` |
| P-229 | both factory writer jobs | proven BY VIOLATION on the deployed image: `UNKNOWN_ARGUMENT` exit(1), `COUNTY_UNKNOWN` exit(1), valid `--county` still scoped |
| P-232 | `cortex-api-00805-jil` | **1010 Chestnut St: 404 → 200, Polygon, 20/5/20, 16,965 sq ft matching the facets route** |
| P-221 + P-234 | `00230-cic` + `hauska-mcp-server-00094-nis` | **the X-ray generates**: 3 sheets, verdict verbatim, all 10 Studio markers absent from the Solo SKU |
| P-228 | `hauska-engine-api-00230-cic` | chrome frame live; footer counters verified on a 10-sheet Feasibility by the lane |

**The session opened and closed on the same parcel.** `1010 CHESTNUT ST` returned
`404 no-district` at the start and a real polygon at the end, and the 16,965 sq ft it now
serves matches what the facets route had been serving all along — so the fix closed a
served-answer-contradicts-itself instance rather than creating one.

## Controls that fired on this seat, and were obeyed

- **P-170 traffic lease** refused an engine traffic shift for want of a lease. Twice, counting
  a one-command write-then-shift the gate correctly read as un-leased.
- **Probe-close gate** refused a commit claiming `closed` with no probe artifact, and refused a
  chained `add && commit`.
- **Plan-row drift check** refused a registry/hook mismatch — and was verified BY VIOLATION
  before being trusted.
- **Seat gate** refused a push from an unregistered ad-hoc worktree. That worktree was removed
  rather than registered to get around it.

## Errors this seat made

Recorded because the pattern matters more than the individual slips.

- **Claimed "the envelope never rendered for GC parcels."** An overreach: the 404 was measured,
  the conclusion that the polygon never drew was inferred without reading the draw path. The
  operator's report that it had worked that morning refuted it.
- **Reasoned about the alias from the `Age:` header** and told the operator the deploy never
  took the alias. Wrong, and it inverted the causal story until a subagent flagged it.
- **Built a violation test that violated nothing** — it searched for a compact JSON literal
  against a spaced file, changed nothing, and printed success. The check's "ok" was therefore
  meaningless until re-run properly.
- **Sent the same lat/lng for nine parcels** in a discrimination run, so all nine resolved to
  one parcel. The pre-registered falsifier caught it.
- **Compiled a fix lane against a diagnostic mission file** (P-235 against P-226's mission,
  which says "stop if write-time"). Caught before dispatch.
- **Saved Claude Design's redrawn logo SVGs as the row's assets** without comparing them to the
  canonical brand file, so the P-228 lane shipped a hand-redrawn mark in good faith. That is
  P-239.

Every one was caught by a falsifier, a control, a lane, or the operator. None was caught by
re-reading a conclusion.

## Rulings taken this session

- **PUD parcels** get an honest "your setbacks come from your PUD ordinance" message for now,
  not per-parcel acquisition. Disposes of P-233's largest bucket without acquiring anything.
- **X-ray metering** (P-237): accept the tick. Verified on deployed main that
  `handleSettledOveragePayment` has zero call sites and rows land `amount_minor: null`. **The
  trigger — reorder before any real rate is set — is currently UNENFORCED and the row says so.**
- **Travis stays out of any bake** while Austin is unmeasured.

## Rows carded

P-225 through P-239, plus amendments A-157 through A-168. The OPS-24 range was extended
200→250 in the registry and the close-gate literal together, verified by violation.

## leave_behind

- item: `surface-probe.mjs` has no leg for P-214, P-216, P-218, P-219, P-221 or P-228. Six rows
    shipped that it could not confirm. Named by four separate closes now.
  owner: doc_repo integration seat
  plan_row: UNCARDED
- item: Lockhart's zoning service is gone from its org. No public replacement searched for.
    Must not be folded into Austin's answer.
  owner: unassigned
  plan_row: P-233
- item: The 7 remaining Hays cities for the envelope group.
  owner: hauska-factory
  plan_row: P-211 leave_behind
- item: The "Cloud Run Deploy (cortex-api)" workflow is named for something it does not do on
    push. Rename, or make the push job state build-only.
  owner: legacy-design-tools
  plan_row: UNCARDED
- item: `verdict_line` and `brief` remain documented, accepted and ignored in the MCP tool
    schema — a parameter that is accepted and ignored is its own honesty defect.
  owner: hauska-mcp-server
  plan_row: P-237
- item: The P-237 enforcement check (CI fails when a finite `perReferenceRateMinor` resolves
    while the metering order is unchanged) does not exist. The ruling carries an unenforced
    precondition.
  owner: hauska-mcp-server
  plan_row: P-237
