# Meta Pixel + campaign attribution: what is staged, what is not, and the pre-deploy decisions

**Author:** integration seat (SEAT-01), at operator direction
**Date:** 2026-09-17
**Status:** STAGED ON BRANCHES, NOT PUSHED, NOT DEPLOYED. Two items below need a decision before deploy.

## Decisions taken at hand-off (2026-09-17)

1. **Leave both branches local; the planning agent pushes when ready.** No push was performed. Reason: pushing the app branch creates a Vercel preview deployment that fires PageView into the live pixel id from preview URLs.
2. **On the share-identifier finding (3a): run the Pixel Helper probe on a preview first, then decide.** Not suppressed in advance.

Note the dependency between the two: **the probe in 3a needs a preview deployment, and a preview deployment needs the branch pushed.** So the order is: planning agent pushes, the preview builds, the probe is run against the preview, and the 3a decision is made on what the probe shows. The cost is that the preview will send a small number of PageViews tagged with preview URLs into the live pixel. If that is not acceptable, the alternative is to probe on a local `vite dev` server instead, which the tag also loads on.

---

## 1. What exists

Two branches, committed locally in worktrees. Neither is pushed (see section 5).

| Repo | Worktree | Branch | Commit |
|---|---|---|---|
| `hauska-map` | `P:/seat-worktrees/integration/hauska-map-meta-pixel` | `feat/meta-pixel-and-utm-source` | `369fd77` |
| `legacy-design-tools` | `P:/seat-worktrees/integration/ldt-utm-source` | `feat/utm-source-tag` | `c47b8c7b` |

Base: `origin/main` of each repo at fetch time (`hauska-map` `0489bc8`, `legacy-design-tools` `7219b707`).

### hauska-map, 12 files, +827/-4

Pixel:
- `apps/property-explorer/index.html` — Meta Pixel base code in `<head>`. `index.html` is the app's only entry point (vite builds it alone; `vercel.json` rewrites `/((?!api/).*)` to it), so one tag covers every route including `/share` and parcel deep links.
- `apps/property-explorer/vercel.json` — `https://connect.facebook.net` added to the catch-all `script-src`. Without it the browser blocks `fbevents.js` in production only, and nothing in CI notices.
- `apps/property-explorer/src/lib/meta-pixel-tag.test.ts` — new guard on the tag AND the CSP directive.

Campaign attribution:
- `apps/property-explorer/api/_lib/campaign.ts` — the pure half: sanitizer, parser, serializer. Lives in `api/_lib/` because `src/` already imports shared pure modules from there, so client and BFF share one implementation instead of two copies that drift.
- `apps/property-explorer/src/lib/campaign-attribution.ts` + `.test.ts` — the browser half: first-touch capture into localStorage, and the sign-in URL hand-off.
- `apps/property-explorer/src/main.tsx` — captures the campaign set once at boot, before render.
- `apps/property-explorer/src/lib/auth.ts` — `googleSignInUrl()` / `microsoftSignInUrl()` append the stored set.
- `apps/property-explorer/api/_lib/pkce.ts`, `api/auth.ts`, `api/_lib/cortex-exchange.ts` — the set rides the OIDC `state` payload, which `sealOidcState` signs with `OIDC_STATE_SECRET`, and is forwarded to cortex on `session-exchange`.

Legal:
- `apps/property-explorer/public/privacy.html` — new advertising-and-measurement section, campaign-parameter disclosure, effective date to 2026-09-17.

### legacy-design-tools, 8 files, +563/-17

- `artifacts/api-server/src/lib/peCampaignSource.ts` + test — resolves the campaign set to one of the four provisioned `source-*` tags, or reports `unmapped` / `no-campaign` explicitly.
- `artifacts/api-server/src/lib/peGhlContact.ts` — writes a source tag only when one resolved; omits the `tags` key entirely otherwise.
- `artifacts/api-server/src/lib/peSignInCompletion.ts` — options object instead of positional strings.
- `artifacts/api-server/src/routes/peAuth.ts` — accepts `campaign` on the exchange body.
- `artifacts/api-server/src/routes/peMagicLink.ts` — call site updated; see the named gap in section 4.
- `artifacts/api-server/src/__tests__/pe-campaign-source.test.ts` (new), `pe-ghl-contact.test.ts`, `pe-magic-link.test.ts`.

The defect fixed: `peGhlContact.ts` wrote a hardcoded `source-organic` tag on **every** new signup, so a click from a paid ad was filed as organic. That is a wrong value asserted as fact, not a missing one.

---

## 2. Evidence

Run against the commits above.

| Check | Result |
|---|---|
| `pnpm run test` (property-explorer, CI-equivalent: 3 node gates + vitest) | 217 files, 3190 pass, 1 todo |
| `pe-public-pages-guard.mjs` (P-108, 6 checks incl. the privacy prose) | pass |
| `pe-legal-pages.test.ts` (pinned privacy assertions, no em/en dash) | pass |
| `tsc -p tsconfig.json --noEmit` (api-server) | exit 0, clean |
| api-server campaign + GHL + magic-link suites vs real Postgres | 40 pass |
| `pe-paywall-stripe.test.ts` (covers the `installId` claim path the refactor touched) | 31 pass |

**The guards were verified by violating them**, not only by passing:

| Violation | Effect |
|---|---|
| Drop `connect.facebook.net` from `script-src` | 2 tests fail |
| Remove the pixel block from `index.html` | 4 tests fail |
| Leave the tag but remove `fbq("init")` | 2 tests fail |
| Restore the hardcoded `source-organic` tag | 3 tests fail |

Restored after each; all suites green on the committed state.

**To re-run the integration suites** (`pe-ghl-contact`, `pe-magic-link`, `pe-paywall-stripe`) a Postgres with `pgvector` and `postgis` is required; CI supplies one. Locally: `CREATE EXTENSION vector; CREATE EXTENSION postgis;` and use the **direct, non-pooled** URL, because the harness sets `search_path` as a startup parameter and Neon's pooler rejects it. A throwaway DB was used and is not written into any repo file.

---

## 3. Two things to decide before deploy

### 3a. The page URL the pixel reports includes the share grant id and the parcel id

This is the one I would not ship past without a decision.

`fbq("track","PageView")` sends the page address as `dl`. The app's deep links put identifiers in that address:

- a share landing is `/share?g=<grantId>`, or `/s/<uuid>`
- a parcel view carries `parcelNodeId` in the query string
- `/share#<token>` puts the human token in the fragment

So a recipient opening a shared link reports the grant id to Meta, and Meta learns that this browser opened that share. The grant id is a capability identifier, not a random analytics tag.

I did **not** implement a workaround, for two reasons. The operator instruction was explicitly "sitewide, so PageView fires on every route", and suppressing the pixel on share routes contradicts that. More importantly I have **not verified what `fbevents.js` sends** in `dl` (query string only, or fragment too), and shipping a mitigation against unverified behaviour is how the last set of confident wrong claims got made.

The precise probe, at deploy time, on a preview:
1. Open a `/share?g=<grantId>` link with the Meta Pixel Helper extension loaded.
2. Read the `dl` value on the PageView event.
3. If the grant id is present, decide between: suppress the pixel on share routes; strip the identifier from the address bar before the pixel fires; or accept and disclose.

**Decision taken: run this probe first, then decide.** The pixel is not suppressed on share routes in this change. A local `vite dev` server also loads the tag and is a cheaper place to run the probe, since it avoids putting preview URLs into the live pixel at all.

The privacy copy is written to be true either way. It does **not** claim that a share link is not sent, and it says plainly that if you opened a shared link, the page address is that shared link. An earlier draft of that paragraph did claim shares were not sent; it was removed because it was an overclaim of exactly the kind the P-108 guard exists to catch.

### 3b. Paid and social traffic currently resolves to NO tag

The GHL location has four `source-*` tags: `source-affiliate`, `source-share`, `source-agent`, `source-organic`. There is no paid or social member.

So `utm_source=facebook&utm_medium=paid` resolves to nothing and writes no tag. That is the honest outcome and it is deliberate, but it means **the paid channel is still not attributed to a tag** — the fix removes the false organic label without supplying a true one.

To close it: provision a tag in GHL, then add one rule to `SOURCE_TAG_RULES` in `peCampaignSource.ts` with the tag added to `PROVISIONED_SOURCE_TAGS`. Until then, every unmapped arrival is logged with the values that arrived, so the gap is visible in logs rather than silent.

Suggested name `source-paid`. That is a GHL change plus a one-line code change; it does not need to be bundled with this deploy.

---

## 4. Named gaps, not done

1. **Named conversion events** (signup, share, report requested, report delivered). Not implemented. PageView fires from the tag; the named events do not exist. `index.html` carries a comment saying so, so the next reader is not misled by the tag's presence. The app already has a funnel-event vocabulary (`gtmClient.ts`, `PROPERTY_EXPLORER_FUNNEL_EVENT_TYPES`) to map onto; it was not wired to `fbq`.
2. **Conversions API.** Not implemented. `gtmOutbound.ts` shows outbound sends are present but hard-disabled in v1, so there is no active server-side path to extend.
3. **Events Manager custom conversion** ("Smart Site Lead") and the **paid destination decision**. Both are console/strategy items, not code.
4. **Magic-link signups write no source tag.** A magic link is verified from an email click, potentially days later in a different browser than the one that landed on the ad, so the first-touch set is not available at that hop. Carrying it needs cortex to persist the set against the magic-link token row, a schema change not in this work. Documented at the call site. This is an omission, not a wrong value.
5. **GHL contact schema for real UTM fields.** Not investigated. Dedicated UTM `customFields` on the contact would be strictly better than one coarse tag, but the field ids are unverified and inventing them is prohibited. Needs a live schema read.
6. **Organic signup volume will drop.** Signups that arrive with no campaign parameters now get no source tag; previously every one was `source-organic`. The bucket becomes a measurement instead of a guess, and it shrinks. Expected, and worth saying out loud before someone reads the dashboard.
7. **Unresolved canon conflict**, raised earlier and still open: `_smartsite_masters/06` (corrected 2026-09-04 to permit low-touch sales machinery for Smart Site subscriber contacts) against the 2026-09-04 addendum in `_decisions/2026-08-31_gohighlevel_supersedes_pipedrive.md` (contact record only, no pipeline). `peGhlContact.ts` still carries the stricter "no pipeline" framing in its header. No code in this change depends on the resolution, but the two documents disagree.

---

## 5. Why the branches are not pushed, and what pushing does

Pushing the `hauska-map` branch triggers a **Vercel preview deployment**. That is not production, but it would run the pixel on a preview URL and fire PageView into the live pixel id, mixing preview traffic into the ad data the operator reads. Given the standing "do not redeploy" instruction and that side effect, the branches were left local.

**Decision taken: leave both local.** The planning agent pushes when ready, which is also the trigger for the 3a probe. Pushing is one command per repo:

```
git -C P:/seat-worktrees/integration/hauska-map-meta-pixel push -u origin feat/meta-pixel-and-utm-source
git -C P:/seat-worktrees/integration/ldt-utm-source push -u origin feat/utm-source-tag
```

`legacy-design-tools` needs its deploy lease checked before the cortex-api leg ships.

---

## 6. Deploy-time verification

Order matters: cortex first, then the app. If the app ships first, campaign parameters arrive at a `session-exchange` that ignores `campaign`.

1. Deploy `legacy-design-tools` (cortex-api) under a lease. Confirm `POST /auth/session-exchange` still returns 200/201 and that a new signup with no campaign still creates a GHL contact with no source tag.
2. Deploy `hauska-map` (Vercel). Confirm on the live site: view source shows the tag in `<head>`; the console has no CSP violation for `connect.facebook.net`; Meta Pixel Helper reports PageView.
3. Land on the live site with `?utm_source=share&utm_medium=share`, then sign in with a new account, then read the GHL contact: tag must be `source-share`.
4. Repeat with `?utm_source=facebook&utm_medium=paid`: the contact must have **no** source tag, and the log must carry the unmapped entry.
5. Run the `/share?g=` probe from 3a and decide.
6. Confirm the privacy page at `/privacy` still serves real HTML and shows the 17 September 2026 date.

---

## 7. Process notes, so the seat boundary is visible rather than silently crossed

`hauska-map` and `legacy-design-tools` are product repos with owning seats, and `_catalog/seat_register.json` describes the integration seat as "doc_repo primary checkout and merge target. **Not a planner seat.** ... Planner seats do not do seat work here." This work was performed directly by that seat at explicit operator direction, rather than dispatched to the property seat, because the operator asked for the work to be done and staged. Three consequences:

1. **No plan row was cited** in either commit message, because no dispatch was compiled. If the convention is enforced retroactively, both commits want an `OPS-16` row.
2. **No `_state` entry was written.** The integration seat has no `_state` namespace, and the gate "refuses writes into another seat's `_state` namespace from here", so `_state/property/STATE.md` is deliberately untouched. The property seat or the planner owes that entry for this work.
3. **Worktree shape deviates from the register's convention.** The established pattern for this seat is a *standalone clone* under `P:/tmp/`, and several register entries say the reason is that the gate "refuses git writes from every second worktree of one repo path". These two lanes used real `git worktree`s under `P:/seat-worktrees/integration/`, and the commits went through without objection, so nothing is blocked. Flagging it because either the convention or the gate deserves to be reconciled, and because the register should carry an entry per lane:

| Lane | Path | Branch | Commit |
|---|---|---|---|
| `hauska-map-meta-pixel` | `P:/seat-worktrees/integration/hauska-map-meta-pixel` | `feat/meta-pixel-and-utm-source` | `369fd77` |
| `ldt-utm-source` | `P:/seat-worktrees/integration/ldt-utm-source` | `feat/utm-source-tag` | `c47b8c7b` |

Files in `doc_repo` remain uncommitted for review, per the standing rule that doc_repo commits are presented before they are made. That includes this document.
