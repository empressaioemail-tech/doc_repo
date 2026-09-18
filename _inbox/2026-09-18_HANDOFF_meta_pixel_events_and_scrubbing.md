---
id: 2026-09-18_HANDOFF_meta_pixel_events_and_scrubbing
title: Handoff — Meta share-URL scrubbing and the four named events (browser plus Conversions API)
date: 2026-09-18
last_updated: 2026-09-18
status: staged, not pushed, not deployed
kind: handoff
owner: nick
from: integration seat, 2026-09-18 11:55Z
programs: [OPS-16]
related:
  - _catalog/dispatch_missions/mission_p324_pixel_attribution_deploy.md (the mission this work EXTENDS; see section 6, it excludes this work as written)
  - _inbox/2026-09-17_smartsite_meta_pixel_utm_handoff.md (the pixel base tag and UTM capture, already in the deploy queue)
  - _dispatches/2026-09-17_p324-pixel-attribution-deploy_dispatch.md
snapshot: hauska-map worktree P:/seat-worktrees/integration/hauska-map-meta-pixel, branch feat/meta-pixel-and-utm-source, HEAD 369fd77 (the undeployed pixel commit) plus the uncommitted work described here; read 2026-09-18
---

# Handoff: share-URL scrubbing and the four named events

Everything here is staged in the worktree and **not committed, not pushed, not deployed**. The
operator's standing instruction was to do the work, stage it, and hand the deploy to the planner.

**Production carries no pixel at all**, confirmed before starting: `https://smartsite.cloud/`
returns 200, 1,850 bytes, and its HTML contains neither `1124306790022968` nor
`connect.facebook.net` (it does contain `promotekit`, so the fetch read the real head). The
operator's belief that the previous work is still undeployed is correct, and this work is built on
top of it.

## 1. What was built

### Item 1 — no route-scoped secret reaches Meta

The rule is general, not a patch list. `api/_lib/analytics-url.ts` reports an origin and a
normalised path and nothing else: **no query string, no fragment, ever**. Three secrets already
exist in this app's addresses (a share grant in `?g=`, a share HMAC in the fragment, a resolvable
grant uuid in `/s/<id>`), so an allow-list of token parameters would have to name all three today
and would miss the fourth invented next month. Stripping is the default, which is why a future
route that grows a token is safe without anyone remembering this file.

| Where | What it does |
|---|---|
| `api/_lib/analytics-url.ts` | `scrubReportedUrl` (query, fragment, identifier paths), `scrubPath`, `mayFireBrowserPixel` |
| `api/_lib/meta-capi.ts` | `buildMetaEvent` runs every `event_source_url` through the scrubber, so the rule is applied in **one** place for all server-side events |
| `api/pe-meta.ts` | `resolveEventSourceUrl` scrubs all three branches: the client's page URL, **this request's HTTP referrer**, then the configured origin |
| `src/lib/meta-events.ts` | `mayFireBrowserPixel` suppresses the browser leg on an identifier-bearing address **or referrer**; the CAPI leg still fires |
| `index.html` | the static `fbq("track","PageView")` was **removed**; `PageView` now fires from `src/main.tsx` through the same gate |
| `vercel.json` | `Referrer-Policy: strict-origin-when-cross-origin`, because the `<noscript>` fallback image cannot be gated from static HTML |

The referrer branch is the one the brief called out and the one that is easy to miss: after a
visitor lands on `/share?g=...`, the share URL rides along as the referrer on the next event. It is
scrubbed server-side, and the browser leg stands down there too.

### Item 2 — the four moments, both legs, one dedup id

| Moment | Event | Fired from | Browser leg |
|---|---|---|---|
| Free account signup | `CompleteRegistration` | `api/auth.ts`, both the OAuth callback and the magic-link verify | **none, deliberately** |
| Inspect card opened | `ViewContent` | `src/browse/ExplorerMap.tsx`, in the inspect handler | yes |
| Report requested | `Lead` | `src/workbench/tools/RecordsRequestSection.tsx`, after the backend accepts the run | yes |
| Share created | `Share` (custom) | `src/workbench/tools/ShareTool.tsx`, inside the persisted-grant branch | yes |

`CompleteRegistration` has no browser twin on purpose. An account being CREATED is a fact only the
server decides: cortex's session-exchange returns 201 exactly when it inserted the `users` row, and
`ExchangeResult.isNewAccount` carries that (`api/_lib/cortex-exchange.ts`). The `/?signed_in=1`
landing looks identical for a first sign-in and a fiftieth, so firing there would count every
returning sign-in as a registration. Its dedup protection is that it has no browser twin to double
it. The other three send both legs with **one** `event_id`.

Files: `src/lib/meta-events.ts` (client, both legs), `api/_lib/meta-capi.ts` (payload build and
send), `api/_lib/meta-server.ts` (server-only, `node:crypto` hashing), `api/pe-meta.ts` (the BFF).

Requirements, and where each is enforced:

- **On the action, not a route change.** Each call sits inside its handler; the guard test asserts
  the call site is positioned after the action's own precondition.
- **`event_time`, `event_source_url` (scrubbed), `action_source`.** All three set in `buildMetaEvent`;
  `action_source` is `website`.
- **User data.** SHA-256 of the lowercased, trimmed address on `CompleteRegistration` and `Lead`
  only; `fbp`/`fbc` from the cookies when present; nothing else. A malformed digest is dropped
  rather than forwarded, because Meta silently fails to match one and the field would then only look
  like matching data.
- **Non-identifying custom parameters.** `county` is passed on `ViewContent`; the sanitizer refuses
  parcel ids, addresses, owner names, grant ids and emails in any spelling, and the refusals are
  returned and logged, never silently dropped.
- **Failures silent.** Both leg senders swallow everything and report what each leg did, so a
  suppression is distinguishable from a failure. Nothing is awaited on a user path.
- **Token server-side.** Read from `process.env.META_CAPI_ACCESS_TOKEN` inside `api/pe-meta.ts`. The
  parse shape has nowhere for a caller-supplied credential to land, so a body cannot redirect the
  token at another pixel.

**One deviation worth naming.** The brief asked for the hashed email on `Lead` "where we have it".
The browser does not have it: `GET /api/auth/session` deliberately returns only
`{ authenticated, hasSession }`, so there is no address client-side to hash. `Lead` therefore fires
from the browser with no email, and `CompleteRegistration` carries one because it fires server-side.
This is the brief's own escape hatch, but it is a real gap: if email matching on `Lead` matters, the
fix is to have the records-run endpoint accept an event id from the client and fire server-side, so
one id still covers both legs. Not built, because it means touching the records endpoint.

## 2. The three reporting answers

### Which events fired, with names and dedup ids

From the recorded run (`src/lib/meta-moments-e2e.test.ts`, driven through the real `/api/pe-meta`
handler; ids are per-run random values):

```
  event                 browser leg id                           server leg id                            event_source_url
  CompleteRegistration  (suppressed)                             pe-srv-mu6wisb2-xf3mq6jafp               https://smartsite.cloud/
  ViewContent           e009aaea-3d6e-4a90-a8b3-dd6b513b14ad     e009aaea-3d6e-4a90-a8b3-dd6b513b14ad     https://smartsite.cloud/
  Lead                  7ff0f27b-f397-4b66-9b74-46ab669c1296     7ff0f27b-f397-4b66-9b74-46ab669c1296     https://smartsite.cloud/
  Share                 f4ae284e-43f7-483c-a6f1-e0c54d67c5d9     f4ae284e-43f7-483c-a6f1-e0c54d67c5d9     https://smartsite.cloud/
```

All four legs are recorded; all four ids are distinct; each pair matches.

### No share route URL carries the grant id

Confirmed in the outbound payload for a share landing
(`https://smartsite.cloud/share?g=8f3a1c2e-4b5d-4e6f-8a9b-0c1d2e3f4a5b`): the browser leg fires
**nothing at all** on that route, and the server leg's `event_source_url` is
`https://smartsite.cloud/share`. The whole serialised payload is asserted not to contain the grant
id, and a second case asserts the same for the referrer form (land on the share link, then act:
source URL `https://smartsite.cloud/`, no grant anywhere).

### Weekly count of free account signups

Measured against `cortex-prod` at 2026-09-18 11:5xZ, not quoted from an earlier session.

**3 accounts created in the last 7 days, 11 in the last 14, 13 all-time** (first signup 2026-09-04).
Of the 13, four are internal (`nick@hauska.io`, `nick@smartcityos.io`, `nickdraft3@gmail.com`,
`admin@smartcityos.io`) and three paid. Genuinely external free accounts, all-time: **four**
(`info@dennisfletcherdesignstudio.com` 09-16, `cwinover@yahoo.com` 09-09, `hoffmanshomes@gmail.com`
09-06, `valeriethompsontx@gmail.com` 09-04), plus `ida.dahl.title@gmail.com` (09-15) which signed up
and went straight to solo.

**So: roughly one external free signup per week.** That is nowhere near an optimization signal.
Meta's guidance is that an ad set wants about 50 optimization events per week to leave the learning
phase; at this rate `CompleteRegistration` would carry a handful of events per month, and every cost
per registration would be noise.

Existing volume, for choosing the alternative (last 7 / last 30 days, from `gtm_events`):

| Event | 7d | 30d | All time |
|---|---|---|---|
| `pe_browse_started` | 3,187 | 16,499 | 17,166 |
| `pe_upgrade_started` | 4 | 72 | 75 |
| `pe_signup_intent` | 4 | 31 | 46 |
| `pe_save_property` | 1 | 16 | 34 |
| `pe_research_clicked` | 1 | 15 | 54 |
| `share_viewed` | 4 | 14 | 14 |
| `share_created` | 0 | 2 | 9 |

**Recommendation: start the ads on `ViewContent`, not `CompleteRegistration`.** It is the highest
volume of the four and it is the intent signal the top of the funnel actually produces. Keep
`CompleteRegistration` firing, because it is the one that will matter once volume exists, but do not
tune on it yet.

**Stated limit on that recommendation:** the inspect-action rate is not in any table I could find.
`pe_activation_events` holds only one type (`shown`, 91 rows) and `gtm_events` has no per-inspect
event, so `pe_browse_started` at 3,187/week is an upper bound on browsing sessions, not a count of
parcel inspections. `ViewContent`'s true rate becomes measurable only after this ships. If the
inspect action turns out to be as rare as `share_created`, the honest answer is that this pixel has
no optimization event at all yet and the ads should run on a click-through objective until one
exists.

## 3. Deploy prerequisites, and the one that fails silently

**Set these in the Property Explorer Vercel project before or with the deploy. Without the first
two, the entire server leg returns 503 and does nothing, visibly to nothing but the logs.**

| Var | Required | Effect if missing |
|---|---|---|
| `META_CAPI_ACCESS_TOKEN` | yes | `503 capi_not_configured`, named in the response and the log. No event sent. |
| `META_PIXEL_ID` | yes | same; `1124306790022968` |
| `PE_SITE_ORIGIN` | optional | falls back to the forwarded host, then `https://smartsite.cloud`. Set it to `https://smartsite.cloud` for stable reporting. |
| `META_TEST_EVENT_CODE` | optional | set only to route events into Events Manager's Test Events tab; **leave unset in production** or real events land in the test stream. |

The 503 is deliberate and names the missing variable rather than reporting a silent success. That is
the intended behaviour, but it also means a deploy that forgets the token looks like a working pixel
with no conversions. Check it by calling `POST /api/pe-meta` with
`{"name":"Lead","eventId":"deploy-probe-1"}` and reading the status: `200` with `eventsReceived`,
not `503`.

`vercel.json` carries the `/api/pe-meta` rewrite and the CSP already admits `connect.facebook.net`;
the SPA catch-all excludes `api/`, so no rewrite is needed beyond what is staged.

## 4. Evidence, and how the checks were verified

`pnpm test` **passes in full, exit 0.** That command is not `vitest run` alone: it runs four node
gate scripts first (`pe-chrome-kit-gate`, `seam-retired-guard`, `pe-public-pages-guard`,
`vocab-copy-retired-guard`) and then the suite. All four gates pass and report their own positive
controls, and the suite reports `224 test files, 3,295 tests passing, 1 todo`. Two of those gates
count files and rewrites this work adds to (`api/` function count, `/api/*` rewrites in
`vercel.json`), and both passed.

`tsc --noEmit` is clean apart from pre-existing `TS2307` errors for `@hauska/map-renderer` in files
this work does not touch (the sibling package is not built in this worktree).

New suites: `api/_lib/analytics-url.test.ts` (22), `api/_lib/meta-capi.test.ts` (18),
`api/_lib/meta-server.test.ts` (11), `api/pe-meta.test.ts` (12), `src/lib/meta-events.test.ts` (22),
`src/lib/meta-moments.test.ts` (10), `src/lib/meta-moments-e2e.test.ts` (4).

**Every new guard was verified by violating it**, per ENFORCEMENT:

- Made `scrubReportedUrl` return the raw URL: **10 failures** across `analytics-url`,
  `meta-capi` and `meta-server`.
- Made the browser leg mint its own id instead of reusing the caller's: `meta-events` dedup test
  fails, **and** the e2e test fails on the id read off the outgoing Meta payload.
- Put `parcelNodeId` into the `ViewContent` payload and renamed `Share` to a non-standard name:
  **3 failures** in `meta-moments`.

Two harness defects were found and fixed during this, both of which would have produced a green test
that proved nothing: `globalThis.fetch` is read by the BFF itself and cannot be injected, so the e2e
test initially made a **real** call to Meta with a fake token and recorded nothing; and the first
draft drove `CompleteRegistration` through the client path, which is not how the app fires it.

One real defect was found by `tsc` that the unit tests could not see: `browserMetaEnv` read
`w.location`/`w.document` off a type that declared only `fbq`. Vitest transpiles without
type-checking, so the suite would never have caught it.

## 5. What is not verified

- **Nothing has been deployed or exercised in a browser against real Meta.** Every claim above is a
  local test run. `fbq` is a captured stub; Meta's own dedup has not been observed accepting a pair.
- **The `dl` probe from Gate 1 of the mission has not been run.** It is now moot for the leak, and
  that is the stronger result: the static `PageView` is gone and the browser leg stands down on
  identifier-bearing routes, so no PageView fires there regardless of what `fbevents.js` copies into
  `dl`. But the mission asks for the verbatim `dl` values as close evidence, and I have none. If the
  mission is to close as written, either run the probe or amend the mission to record that
  suppression made it moot. Do not paste a claim about `dl` that nobody observed.
- **No Events Manager custom conversion has been defined.** "Smart Site Lead" is a dashboard action,
  not a code change.
- **GHL is untouched.** No event here reaches GHL.

## 6. Conflict with the mission of record — the planner must amend it

`_catalog/dispatch_missions/mission_p324_pixel_attribution_deploy.md` says, under "What you must not
do":

> Do not implement named conversion events or the Conversions API. Both are named gaps, not this
> deploy (gap 1 and 2 in the handoff).

The operator has since instructed exactly this work, in an ad-hoc session, which supersedes the
mission. A lane planner reading the mission as written would refuse it. **Amend the mission before
any dispatch cites the event work**, or the next reader inherits a document that conflicts with the
shipped code.

The mission's Gate 1 ordering ("do not push before Gate 1 is answered") is also overtaken: the
mitigation chosen is the mission's own option one, **suppress the pixel on identifier-bearing
routes**, plus server-side scrubbing, so the push no longer depends on the probe's outcome. Gate 2
(the cortex leg waiting on P-323) is unaffected by this work and still stands for the attribution
half in the queue.

## 7. Deploy order

1. Land the pixel base tag and UTM capture already in the queue (the `369fd77` half), which this
   work sits on top of. It is a prerequisite, not an alternative: without it there is no `fbq` to
   fire and no campaign attribution to read.
2. Set the four env vars in section 3.
3. Deploy `hauska-map` Property Explorer. Project `prj_vcZGXbqdffk5C20WzaplEpzFynK3`, org
   `team_4TH5lNnFHcBGx4EKNapJ2MVG`, Root Directory `apps/property-explorer`, from a fresh clone.
   Judge success by the live alias, never by the CLI exit code.
4. Verify on the live site: the tag is in `<head>`; no CSP violation for `connect.facebook.net`;
   Meta Pixel Helper reports PageView on the map. Open a parcel and confirm Pixel Helper shows
   `ViewContent`; open a share link and confirm it shows **no** PageView and that the address bar
   grant does not appear in any reported URL.
5. Confirm the server leg is live by watching for a `200` (not `503`) from `/api/pe-meta` in the
   function logs, and by Events Manager receiving the events. Events Manager's Test Events tab, with
   `META_TEST_EVENT_CODE` set temporarily, is the cheapest way to see both legs deduplicate into one
   event.
6. Land with `?utm_source=share&utm_medium=share`, sign up, and read the GHL contact (the queued
   UTM work's check, unchanged).

## 8. Leave behind

- `leave_behind: none` in the product repos. The staged worktree is
  `P:/seat-worktrees/integration/hauska-map-meta-pixel` on `feat/meta-pixel-and-utm-source`, and it
  is the deliverable, not a stray branch.
- One thing for the planner, not a branch: the `Lead` email-matching gap in section 1, which needs
  the records-run endpoint to accept an event id if it is to be closed.
- This doc is written into `_inbox/` **uncommitted**. Doc-repo commits are planner-owned; the
  operator has not reviewed a commit batch for this session.
