## Mission — P-324: the pixel, campaign attribution, the four conversion events and share-URL scrubbing, as one change

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-map` and `legacy-design-tools`, one PR
per repo. You do not merge or deploy; the integration seat merges, deploys (cortex-api first, then
Property Explorer) and runs the live checks you name. Any doc_repo change is handed back as a diff in
your close.

**Recompiled 2026-09-18 under OPS-16 A-222.** The operator ruled that P-324 takes in the conversion
events, the Conversions API and share-URL scrubbing staged on top of the pixel commit, and that both
halves ship together (`_decisions/2026-09-18_phase0_closeout_rulings.md`, "P-324 scope"). The first
compile's Gate 1 (probe `dl` before pushing) and its "do not implement conversion events or the
Conversions API" are superseded by that ruling. Read both handoffs in full before anything else:

- `_inbox/2026-09-17_smartsite_meta_pixel_utm_handoff.md`: the base tag and first-touch UTM
  attribution, and the defect it fixes (`peGhlContact.ts` wrote a hardcoded `source-organic` tag on
  every new signup, so a paid click was filed as organic, a wrong value asserted as fact).
- `_inbox/2026-09-18_HANDOFF_meta_pixel_events_and_scrubbing.md`: the events, CAPI and scrubbing,
  what was verified by violation, what was not, and the deploy prerequisites.

### Step 0: bring the work into your own worktrees, byte for byte

None of it is on origin, and part of it is not even committed. It lives in the integration seat's
worktrees, which you may read and must not write:

| Repo | Integration worktree (read only) | Branch | What is there |
|---|---|---|---|
| hauska-map | `P:/seat-worktrees/integration/hauska-map-meta-pixel` | `feat/meta-pixel-and-utm-source` | commit `369fd77` (base tag + UTM), plus **uncommitted** changes: 9 modified and 12 untracked files under `apps/property-explorer` (the events work) |
| legacy-design-tools | `P:/seat-worktrees/integration/ldt-utm-source` | `feat/utm-source-tag` | commit `c47b8c7b` (the source tag resolved from first-touch campaign data), clean |

Create your own registered worktrees. Carry `369fd77` and `c47b8c7b` over as commits
(`git format-patch` or a fetch from the local clone) and the uncommitted events work as a second
hauska-map commit, then prove the transfer: the tree of your two hauska-map commits equals the
integration worktree's working tree for every file under `apps/property-explorer` (a hash comparison,
not a visual one). Only then rebase: both mains have moved (map `0489bc8` to `163fde32` at compile,
through #410 to #420; LDT `7219b707` to `25d1782f`). #416 and #419 changed Property Explorer files
near the ones this touches (`fact-sheet-resolver.ts`, `atom-chain-to-facets.ts`, `pe-record-to-facets.ts`);
declare what moved and resolve conflicts without changing either side's meaning.

### What the change is (verify it, do not re-derive it)

- **No route-scoped secret reaches Meta.** `api/_lib/analytics-url.ts` reports origin plus normalised
  path, never a query string or fragment; `api/_lib/meta-capi.ts` scrubs every `event_source_url`;
  `api/pe-meta.ts` scrubs the client URL, the request referrer and the configured origin;
  `src/lib/meta-events.ts` suppresses the browser leg on an identifier-bearing address or referrer;
  the static `fbq("track","PageView")` is gone from `index.html` and fires from `src/main.tsx` through
  the gate; `vercel.json` sets `Referrer-Policy: strict-origin-when-cross-origin`.
- **Four events, both legs, one dedup id**: `CompleteRegistration` (server only, from cortex's 201 on
  session-exchange, `isNewAccount`), `ViewContent` (inspect card), `Lead` (records request accepted),
  `Share` (grant persisted).
- **Named gap, not built:** `Lead` carries no hashed email from the browser (the session endpoint
  does not return one). Closing it means the records-run endpoint accepts an event id and fires
  server-side. Leave it named.

### Gate 1, as ruled: prove the leak is closed, locally

Suppression replaced the `dl` question, but "moot" is a claim until observed. On a local `vite dev`
server (never a preview: a preview fires the live pixel id with preview URLs), with the real
`fbevents.js` loading, record verbatim what leaves the browser for: `/share?g=<id>`, `/share#<token>`,
`/s/<uuid>`, a parcel deep link carrying `parcelNodeId`, and a plain map load. For the suppressed
routes the record is that no Meta request fired; for the others it is the verbatim `dl` value, which
must carry no identifier. Then the referrer case: land on a share link, act, and show the next event's
URLs carry no grant. Record requests, not summaries.

### Gate 2: the cortex leg's post-deploy check

The canary job's P-279 tagged-revision check runs and must read clean. The shift job's copy cannot run
until P-362 lands (no checkout; its failure reads as "violation"). Say whether P-362 has merged when
you close. If not, the seat checks tagged revisions by hand after the shift, by field, as it did on
2026-09-18.

### Suites

Re-run after the rebase: hauska-map `pnpm test` in Property Explorer (four node gate scripts, then
vitest; 3,295 tests passed before the rebase) and `tsc --noEmit` (pre-existing `TS2307` for
`@hauska/map-renderer` only; name anything new). LDT: the `pe-ghl-contact`, `pe-magic-link` and
`pe-paywall-stripe` integration suites need Postgres with `pgvector` and `postgis` on the **direct,
non-pooled** URL (the harness sets `search_path` as a startup parameter; Neon's pooler rejects it).
Never write that credential into any file.

### Hand the seat the deploy

The seat deploys cortex-api first (session-exchange must accept `campaign` before the app sends it),
graded with `scripts/cortex-canary-compare.mjs`, then Property Explorer. Give the seat, exactly:

1. The Property Explorer env vars, and which are required: `META_CAPI_ACCESS_TOKEN` (the operator
   supplies it from Events Manager), `META_PIXEL_ID` (`1124306790022968`), `PE_SITE_ORIGIN`
   (`https://smartsite.cloud`); `META_TEST_EVENT_CODE` never in production except for a timed test.
   Without the first two the server leg returns `503 capi_not_configured`: a deploy that forgets the
   token looks like a working pixel with no conversions.
2. The live checks, each with its expected result: `POST /api/pe-meta` with
   `{"name":"Lead","eventId":"deploy-probe-1"}` returns 200 with `eventsReceived`, not 503; the tag is
   in `<head>` on the map and absent from share routes; no CSP violation for `connect.facebook.net`;
   a signup with no campaign creates a GHL contact with **no** source tag; `?utm_source=share&utm_medium=share`
   tags `source-share`; `?utm_source=facebook&utm_medium=paid` writes no source tag and logs the
   unmapped entry; `/privacy` serves and shows the 17 September 2026 date. Mark which checks need the
   operator (Events Manager's Test Events view, Pixel Helper in a browser).

### Say this out loud in your close

Organic signup volume **will drop**: signups with no campaign parameters get no source tag where every
one used to be `source-organic`. And from the events handoff: external free signups run about one a
week, far below the roughly 50 a week an ad set needs to optimise, so `ViewContent` is the candidate
optimisation event and `CompleteRegistration` should fire without being tuned on. That is the
operator's call; report it, do not act on it.

### What you must not do

- Do not deploy, and do not ship the base tag without the events work (A-222's reversal: if the
  combined change cannot pass, stop and report; neither half ships alone).
- Do not write in the integration seat's worktrees.
- Do not build the `Lead` server-side email path, a `source-paid` tag, magic-link source tags or GHL
  UTM customFields.
- Do not touch county 48491 in any store.

### Close

Declare: the transfer proof, the rebase result and what moved, both PRs and their suite results, the
verbatim Gate 1 records, whether P-362 has merged, the seat's env var list and live-check list with
expected results, the organic-volume and optimisation-event notes, and `leave_behind`.
