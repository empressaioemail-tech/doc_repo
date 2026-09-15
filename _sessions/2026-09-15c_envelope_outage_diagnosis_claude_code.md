---
id: 2026-09-15c_envelope_outage_diagnosis
title: Session — the envelope outage was a stale tab, the deploy state was not what the handoff said, and two envelope rows get carded
date: 2026-09-15
status: closed
kind: session
owner: nick
seat: doc_repo integration
---

# Session 2026-09-15c — the envelope outage, the deploy state, and the envelope arc

## What was reported

The buildable envelope stopped drawing on the Property Explorer map. The operator had been
working from about 10:00Z and had generated a site plan and a feasibility study at 11:29Z and
11:31Z for `48021:34049`, both showing a 19,052 sq ft envelope, so the feature was alive then.
By 14:00Z nothing drew, on any parcel, in any city. The previous seat had reported the cause as
P-216 and the remedy as a rollback; the rollback did not restore the drawing.

## What it actually was

The only infrastructure event in the window was the Vercel production deployment `dqiamq3s5` at
13:49:47Z carrying P-216 and P-218, rolled back before 14:00:26Z. Everything else is a clean
negative: zero Cloud Run revisions across all seven services, zero Cloud Run service mutations in
either project's audit log, zero Secret Manager versions, zero Vercel environment-variable
changes, and no envelope or setback writer job executed.

The operator's own envelope traffic sits inside that window. Excluding this seat's probes, eight
consecutive 404s at 13:54:20-13:54:31 and 13:58:31-13:58:40, then a 200 carrying a real polygon
at 14:34:35 after the rollback. The server was healthy before, during and after: a live POST for
`48021:34049` returns 200 with a Polygon and 19,052 sq ft, with and without session cookies.

The browser tab had loaded the 13:49:47Z build and never reloaded. The rollback restored the
server and left the tab running the superseded client against it. Confirmed resolved by the
operator on reload, on a Travis SF-3 parcel rendering "area withheld pending an atom", which is
the correct R-2 behaviour.

**Durable rule: a rolled-back deploy does not reload an open tab. A client and server pair can
stay mix-matched after the server is restored, and every server-side instrument will read
healthy while it does.**

## What the handoff got wrong

Recorded in full as A-157. Four load-bearing claims, one of which was the instrument the handoff
told the next seat to trust.

`legacy-design-tools` does not auto-deploy. `cortex-api` serves a revision created 12.4 hours
before P-214 merged, the workflow header states that push builds only, and the run's job record
shows all four deploy jobs skipped. A workflow named "Cloud Run Deploy (cortex-api)" reports
success on every merge while shipping nothing. Zero of the four merged fixes are live.

`Age:` cannot tell you which build is serving. The cache object is keyed to the deployment and
shared with the alias, so the rollback target returns the same `Age` and `Etag`. The sound
instrument is asset existence: the live build returns its unique bundle as `application/javascript`
while every other build falls through to the SPA handler as `text/html` with HTTP 200.

P-216 does not suppress the envelope map-wide. Its `declined` branch is gated on an outcome that
already failed the live-derive predicate, and its positive branch still sets `status: "ok"`,
gating only the area figures. Measured across seven parcels in two counties on the unaliased
build, only the four San Marcos parcels moved. P-216 already keeps the polygon drawn and
withholds only the figure, which is the fix the handoff demanded be written before redeploying.

## What this seat got wrong, and how it was caught

An early conclusion that the envelope had never rendered for Bastrop GC parcels was an overreach:
the live-derive 404 was measured, but the claim that it meant the polygon never drew was inferred
without reading the draw path. The operator's report that it had worked that morning refuted it.
The GC finding survives as a real coverage gap (P-225); the causal claim built on it did not.

A first discrimination run sent the same lat/lng for nine different parcels, so all nine resolved
to one parcel and the pre-registered falsifier fired on an SF-1 row. The instrument was wrong,
not the mechanism; re-run with per-parcel geocoding it discriminated cleanly.

A first attempt to verify the plan-row drift check by violation searched for a compact JSON
literal against a spaced file, changed nothing, and printed success. The check's `ok` was
therefore meaningless. Re-run with the write verified, the check produced `FAIL` and exit 1,
which is the first time it was actually observed working.

## What was carded

`P-225` the setback-table codification scrub. Every zoning district in every city across the six
onboarded counties, recorded as codified or uncodified, so the gap is countable rather than
discovered one parcel at a time. Measured cause, read in the write path: an uncodified district
returns `404 no-district` and draws nothing, and the atom chain's usable setbacks cannot be
reached because the candidate list is built after the codified-table gate.

`P-226` the envelope front line on curved frontages. On radius streets the drawn front edge lands
on or inside the street frontage rather than offset from the front property line. The row
requires the fix to state whether the defect is draw-time or write-time rather than patching
whichever layer is cheaper.

`OPS-24` row range extended from 200-225 to 200-230 in `_catalog/plan_registry.json` and
`scripts/enforcement/probe-close-gate.mjs` in the same change, with the drift check verified by
violation.

## Sequence agreed with the operator

P-211, the Hays six-county circle-back, runs next and brings Hays level with the other five. Then
the envelope arc, P-225 and P-226. Then the thread this session was opened for, onboarding more
counties. Nothing new is dispatched ahead of those.

## leave_behind

- item: Four merged fixes are unshipped. P-214 needs a workflow_dispatch canary plus a traffic
    shift on cortex-api; P-216 and P-218 need a hauska-map Vercel deploy from a clean worktree at
    origin/main; P-219 is in a repo with no deploy workflow at all.
  owner: doc_repo integration seat
  plan_row: P-214 / P-216 / P-218 / P-219
- item: The "Cloud Run Deploy (cortex-api)" workflow is named for something it does not do on
    push. A green check that reads as "deployed" and means "image built" has now cost one outage
    and one wrong handoff. Rename, or fail the push job loudly as build-only.
  owner: legacy-design-tools owning seat
  plan_row: UNCARDED
- item: `insetParcelBySetbacks` in `apps/property-explorer/src/browse/envelope-overlay.ts` is
    exported, tested, and called from nowhere in production. Its own module comment describes it
    as the fallback used when the server returns setbacks and a ring but no polygon. A dormant
    mechanism, found while reading the draw path.
  owner: hauska-map owning seat
  plan_row: UNCARDED, candidate member of P-226
- item: hauska-engine has no deploy workflow, so a merge there ships nothing and nothing says so.
  owner: hauska-engine owning seat
  plan_row: UNCARDED
