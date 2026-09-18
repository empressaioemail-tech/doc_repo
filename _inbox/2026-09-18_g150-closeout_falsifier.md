# G-150 close-out — pre-registered falsifier

Filed BEFORE any probe of the live surface, per the dispatch's instruction
("Pre-register your falsifier before you probe").

- Lane: `g150-closeout`
- Seat: `cente-vsc-g150`
- Plan row: G-150
- Written: 2026-09-18T01:03Z (before the first request to the live surface)

## What I am claiming

GAP 2 is the question of which of two mechanisms produced the planner's
observation (root route, HTTP 200, none of the reasoner markers):

1. The console lives behind an engagement id and the root is the queue, so the
   markers are correctly absent there.
2. The deploy is partial and the reasoner path is not actually served.

The build lane deployed `plan-review-00029-gom` @100% (tag `g150-reasoner`) and
PR #18 (`99c156ba`) is merged to `plan-review` `origin/main`. My claim is that
**mechanism 1 holds**: the reasoner path IS served, and reaching it requires an
engagement id.

Important: the Cloud Run service `plan-review` does not and has never served a
console. `GET /` on it returns `{"ok":true,"service":"plan-review"}` and every
path outside `/api/plan-review/*` and `/api/icc/*` is a 404. The console is the
Vercel-hosted web app (`https://plan-review-app-ten.vercel.app`) whose BFF
(`/api/backend`) attaches the service bearer token. So a text search of the
Cloud Run root for markers could never find any, under either mechanism — that
observation on its own is uninformative.

## The falsifier (the probe that can contradict me)

Reach the reasoner path **for a real engagement**, on the live serving revision,
and read the composed payload.

I expect, on the serving revision confirmed from the request's own log line:

- `GET https://plan-review-app-ten.vercel.app/api/backend?path=/api/plan-review/engagements/<id>/reasoner`
  returns **HTTP 200** for at least one reachable real engagement, with a
  `findings` array; and
- every finding row carries a `badge` field; and
- **exactly the front-setback row (`BASTROP-UDC:14-02-003`) carries `LIVE CHECK`**;
- **every other row carries `NO ADJUDICATOR`**; and
- at least one row carries `citationOwed: true` with no citation (the
  "a section is owed before this can enter a letter" line); and
- the front-setback row's `determination` is `Pass` or `Fail` (an adjudicator
  ran), while no other row is `Pass` or `Fail` on the machine path.

**The falsifier FIRES — mechanism 2, partial deploy — if any of these hold on the
serving revision:**

- **(a) Route absent:** the reasoner path returns 404 through the BFF.
- **(b) Route unreachable:** it returns a non-200 for EVERY real engagement I can
  reach (e.g. 500 `reasoner_contract` on all of them), so no console can be
  reached at all.
- **(c) Markers absent:** a 200 payload carries **no** row with
  `badge === "NO ADJUDICATOR"`, or the front-setback row is **not**
  `LIVE CHECK` — i.e. the badge is not being derived from the registry.
- **(d) Wrong route server:** the serving revision is not the reasoner revision
  named in the dispatch and the payload lacks the reasoner fields.

If (a)–(d) do not hold, mechanism 1 holds and I will say so.

## Bounded by construction

The probe is exit-bounded (single requests with timeouts), reads only public
surfaces, and holds no secret: it goes through the BFF, which holds the service
bearer server-side, and never obtains, prints, or stores that key.
