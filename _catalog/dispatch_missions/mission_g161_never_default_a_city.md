## Mission: G-161, never default a city, everywhere

You launch no sub-agents (FAN-DEPTH 0). You work in `smartcity-dashboards`. You fix your own failed
builds rather than escalating them.

Read, in order: the G-161 row in `90_operations/OPS-17_govtech_stack_plan_of_record.md` and amendment
A-148; rule 3 of `_decisions/2026-09-18_bastrop_is_the_proving_pack.md`; the G-159 close
`_inbox/2026-09-18_g159-finance-bridge_close.json`, whose CP2 holds the enumeration this row starts from
(`_inbox/2026-09-18_g159-finance-bridge_cp2.json`, the `template-city` defaults list).

### Why this row exists

The first wave of SmartCity builds landed on `template-city` instead of Bastrop, partly because program
law told them to and partly because the product lets them. A caller who names no city is quietly served
the demo pack, and nothing on the page says so. Rule 3 now says a route that takes a `cityKey` refuses
when it is missing. G-159 fixed the finance route and counted the rest: seven more request-scoped
fallbacks in `src/server.mjs`, plus module-level defaults in four other files. Six of the seven are
unguarded.

### The work

1. **Re-measure first, at current `main`, and file it as CP1 before writing code.** Line numbers have
   moved since `7dda6db`. Enumerate by symbol AND by literal. One of the eight hid behind an imported
   `DEFAULT_CITY_KEY`, which a grep for `'template-city'` misses. Distinguish a fallback from an
   identity: `src/city-pack.mjs` names the template pack's own key, and `web/index.html`'s literals are
   asserted as demo identity by `city-identity.test.mjs`. Say which is which, and why.
2. **Enumerate every caller before refusing anything.** Every client call site in `web/app.js` and
   `web/index.html`, every script and test, and every embed that calls these routes. List which ones send
   a `cityKey` today. A server that starts refusing while a client still relies on the default is an
   outage.
3. **Where the client relied on the default, it names its city.** It takes the city, in this order, from
   an explicit choice (the URL or a selection); otherwise from the caller's resolved tenant, where a key
   or a sign-in names `bastrop_tx`; otherwise it shows a stated no-city state. It never quietly picks
   `template-city`, and a Bastrop caller never lands on the demo. **Measure what a bare visit to the app
   does today.** If the public demo depends on a bare visit landing on `template-city`, stop and put that
   to the operator as a question in CP1. Do not choose it yourself.
4. **Follow G-159's pattern on the server.** A missing, empty or whitespace-only `cityKey` refuses 400
   `city_key_required`, checked before the caller is resolved. A named unknown pack stays 404. A named
   pack is unchanged. `src/compose.mjs` defaults twice, so an empty string also becomes `template-city`;
   both must go. The CLI in `src/run-municode-calendar.mjs` refuses a missing argument rather than
   defaulting.
5. **A helper that ends in a tenant fallback cannot serve a caller that reports what it read** (G-159's
   lesson). Where legacy callers need the old behaviour, split the function: one version returns null,
   the other keeps the default for named legacy callers. Enumerate those callers.

### Proof

Tests prove each route by violation in both directions: missing, empty and whitespace are each refused,
and a named pack answers exactly as before. Then on the non-production app `d12-main-uat`, with
`services[0].source_commit_hash` read back and equal to the merge commit, each route answers:

- keyless: 400;
- `?cityKey=bastrop_tx` anonymously: 401, which proves the route resolved a real gated pack rather than
  folding it into the demo;
- `?cityKey=no-such-city`: 404;
- `?cityKey=template-city`: 200.

None of those cells needs a tenant key. If the G-135 verification key exists
(`_catalog/credential_access_index.json`), add the credentialed `bastrop_tx` cell. If it does not, that
cell is UNMEASURED, and you say so.

Run the paired control G-159 used: probe the deployed app BEFORE you deploy your change, so the defect
is shown on the surface and not only in a test runner.

### Where it goes, and what is held

Merge to `main`, and prove on `d12-main-uat`. **Do not deploy `dolphin-app`**, which serves
`app.smartcityos.io`. That ship is held for the operator's call (A-148).

**Another lane is in this repo at the same time.** `d14-d13-v1-reach` owns `src/vendor-live.mjs`,
`src/mygov-live.mjs`, `src/mygov-permits.mjs`, `src/property-map.mjs` and `src/adapters.mjs`. Do not edit
them. If a default you must remove lives in one of them, stop and say so in CP2. `d12-main-uat` is shared
with that lane: read `source_commit_hash` immediately before each probe, and redeploy if it moved.

### Close

CP1 (the re-measured enumeration and the caller list), CP2, and the close. The close records each
fallback with its before and after, each route's four cells with status codes, the bare-visit behaviour
before and after, and `source_commit_hash` read back verbatim.

Declare your `leave_behind`. "None" is valid and cheap; the declaration is required regardless.

State your snapshot in your first output: repository, branch, commit.
