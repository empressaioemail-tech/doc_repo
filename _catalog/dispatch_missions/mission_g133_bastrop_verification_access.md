# MISSION — G-133: why can nobody verify Bastrop, when Bastrop works

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

## The observation that makes this a recon and not a provisioning ticket

**The v1 dashboard's property map worked last week with real Bastrop data.** Operator, 2026-09-14.
It is serving right now at `smartcityos.io` with a live Leaflet map, real parcels, real zoning.

And yet **three separate lanes have now failed to verify authenticated Bastrop behaviour in v2**,
all blocked on the same thing, each reporting it as a standing gap rather than a new one:

- **G-116** close, 2026-09-03 — listed "Real Hauska tenant key for `bastrop_tx`" as a leave-behind.
- **G-128** close, 2026-09-14 — `GET /api/property-map/summary` returns 401 without one, and the
  shell's own compose call is gated behind the same thing, so **the map iframe never mounted in a
  full-shell live probe.**
- Earlier the same day, the planner's own read-only probes hit 401 on every `bastrop_tx` route.

**Those two facts cannot both be casually true.** Either the data path and the verification path
are different things and we have been conflating them, or a credential exists and is not reaching
anyone, or it does not exist and something else has been serving Bastrop this whole time.

**Do not start by trying to obtain a key.** Start by establishing what is actually true. The
provisioning answer, if that is what it turns out to be, falls out of the recon.

## What to establish

**1. What actually gates the `bastrop_tx` routes in `smartcity-dashboards`.** `src/server.mjs`
calls `packContentReadStatus(pack, caller)` before composing, on at least nine routes;
`src/tenancy.mjs` carries `resolveCaller`, `canReadPack` and `isServiceBearer`. Read them. State
precisely what a caller must present, in what header, issued by what, and what distinguishes a
service bearer from a product key from an anonymous caller. Quote the code.

**2. Where v1 gets its Bastrop map data, and whether it needs any Hauska credential at all.**
`smartcity-os` `server/routes/esri.ts` exists and `property-map.mjs`'s own header says the upstream
parcel, zoning and flood queries are **hardcoded to Bastrop's ArcGIS services**. If v1 goes
straight to Esri, then v1 needs no Hauska key and never did — which would mean the "missing key"
blocks *verification of v2's gate*, not access to Bastrop data. **Confirm or refute that; it is
the crux.**

**3. Whether the credential exists.** Enumerate where a `bastrop_tx` product or tenant key would
live — Secret Manager in each GCP project, Cloud Run env on the serving revisions, `.env.example`,
the tenant-registry Neon store. **Never print a secret value; report presence, name and location
only.** If one exists, the finding is distribution, not absence. If none exists, say what has been
answering for `bastrop_tx` on the live service, because something is.

**4. How the live service answers today.** The deployed `smartcity-dashboards` serves
`bastrop_tx` content to somebody — the operator sees it in a browser. Establish **what that
browser is presenting** that a lane's `curl` is not. A session cookie, a header injected by a
front door, an IAP, a logged-in identity. That difference is probably the whole answer.

**5. Why three lanes each reported it as standing rather than escalating it.** Not to assign
blame — to find whether there is a missing mechanism. A gap that three closes name and nobody
owns is the "artifact that exists, is correct, and does nothing" class.

## Method

**Read the authoritative record, never a proxy.** The revision that served a request is on that
request's own log line, not `latestReadyRevisionName`. Cloud Run traffic is read from JSON **by
field name**, never a positional `value()` formatter — that exact misread produced a false reading
on this service earlier today.

**ENUMERATE BEFORE ASSERTING ABSENCE.** "No key exists" is only acceptable with the list of places
you looked. This whole row exists because an absence was asserted three times without being traced.

**State the mechanism, then a second mechanism that would produce the same observation and why you
rejected it.** For this row specifically: "the key is missing" and "the key exists and lanes do not
have it" and "no key is needed and the gate is doing something else" all produce an identical 401.

**Never print secret VALUES.** Names, locations and presence only. This row is entirely about
credentials and that rule is not decorative here.

Every verification command exit-bounded (`timeout 120 ...`).

## Scope

**Read-only across `smartcity-dashboards`, `smartcity-os` and the relevant GCP projects.**

`smartcity-os` is under ABSOLUTE NO-TOUCH with a narrow read-only exception recorded in
`_catalog/repo_intents.md`. Reading `server/routes/esri.ts` and the platform handlers is inside it.
Changing anything there is not.

**Change nothing.** If the answer is "provision a key", that is a follow-on with its own row —
report what would need creating, where, and who can do it. Do not create credentials.

If G-122 is running on `smartcity-os` while you work, **coordinate: do not both touch that repo.**

## Close

Write your close to the path named in the CHECKPOINTS AND CLOSE block above — that is the
machine-checkable one, and this mission deliberately does not name a second.

Lead with the crux in one sentence: **why Bastrop's map works for the operator in a browser and
401s for a lane with curl.** Then the five items. Then state, plainly, whether this is a
provisioning problem, a distribution problem, or a misunderstanding about what the gate is for —
and what it would cost to make authenticated Bastrop verification routinely available to any lane,
because three closes have now been degraded for want of it.
