## Mission: D-14 then D-13. Put v1 `main` on `walrus-app`, then point the dashboards at it

You launch no sub-agents (FAN-DEPTH 0). You work in two repos, in this order: `smartcity-os` (v1, for
D-14), then `smartcity-dashboards` (v2, for D-13). You deploy and fix your own failed deploys; you do not
escalate a deploy. You fix your own failed builds.

Read, in order: rows D-13 and D-14 in `90_operations/OPS-25_cloud_infrastructure_and_cost_program.md`,
and its governing rules 3, 9, 10, 11 and 13; OPS-17 amendments A-146 and A-148; the G-159 close
`_inbox/2026-09-18_g159-finance-bridge_close.json`, especially `fleetMemory`. OPS-25 in this clone
carries a large uncommitted amendment from another seat (A-8: the full GCP exit, rules 15 to 20, rows
D-15 to D-32). Read it, because D-20 and D-21 are what follow you. It is not yours to edit, and it is not
your scope.

### Why these two, and why together

Bastrop's budget is live in v1 and readable (G-159 proved it: 12 budgets, the operator's capture
reproduced to the digit). v1 now has platform routes for it on `main` (`a400f7be`). Two things stand
between that and a Bastrop staff member seeing it. D-14: `walrus-app`, which serves `smartcityos.io`,
builds from side branch `d9-api-8bea7fa`, so nothing merged to v1 `main` reaches production. D-13: the
dashboards read every Bastrop feed from the GCP copy of v1, through a host hardcoded in five files. They
are one path, and the proof that matters runs across both, so one lane holds both.

### D-14, in `smartcity-os`

Follow the row's five steps.

1. Land the healthcheck fix on `main`. It is on the pin branch and not on `main`. Merge only on CI
   conclusion strings read per job, against the current base.
2. Before touching production, prove `main` builds, starts and serves on a NON-production DigitalOcean
   app. Payloads must be identical to `walrus-app` for the same requests, compared as payload, not
   framing (rule 11). Anything you create carries its own removal, or is declared in `leave_behind`.
3. Repoint `walrus-app` at `main`. Read `services[0].source_commit_hash` back from the deployment object
   and compare it to the `main` tip byte for byte (rule 13). A deploy once reported SUCCESS while running
   a commit from before the change, and on these apps a merge does not deploy anything at all.
4. From outside this fleet host (rule 10), `smartcityos.io` and `www` serve the same payloads as before
   the repoint.
5. Keep deploy-on-push disabled, and leave the GCP `smartcity-api` untouched (rule 3).

Before step 3, state the rollback: repoint to `d9-api-8bea7fa` and read the hash back.

Once `walrus-app` runs `main`, confirm G-159's routes are present from outside without a key. G-159's
recorded tell: a route that exists answers 401 JSON, and an unknown `/api/platform/*` path answers the
SPA shell with 200.

**Do not "tidy" `getBnpApiKey()`.** It reads `OPENGOV_API_KEY` first, and that is the only reason BNP
answers for Bastrop. The key named for BNP returns zero budgets. **Do not touch `server/routes/finance.ts`**
either: its clamp and its tenant default are G-162, which waits for you so that your repoint changes no
behaviour.

### D-13, in `smartcity-dashboards`

1. Replace the hardcoded GCP host in all five files named in the row (`src/vendor-live.mjs`,
   `src/mygov-live.mjs`, `src/mygov-permits.mjs`, `src/property-map.mjs`, `src/adapters.mjs`) with ONE
   configured base for the v1 platform routes, read from the environment. **No default.** An unset base
   makes each feed refuse, with its basis stated on the region. It never falls back to a host. The
   `sourceUrl` shown to users is provenance, so it must name the host actually read. `code-refs.mjs`
   reads zero for the GCP host.
2. Set the base on `d12-main-uat` to `walrus-app`. Confirm `walrus-app` accepts the
   `PLATFORM_INTERNAL_API_KEY` the dashboards send.
3. **Instrument, per the row:** every feed returns the same records through `walrus-app` as through GCP,
   compared as payload. Read them against the v1 platform routes directly with the platform-internal key,
   which needs no tenant key. Then the end-to-end leg: the dashboards read `bastrop_tx` through
   `d12-main-uat`. That needs the G-135 verification key. Check `_catalog/credential_access_index.json`.
   If it is not minted yet, that leg is UNMEASURED and you say so; nothing substitutes for it.
4. **Files you do not touch:** G-161 is running in this repo at the same time and owns `src/server.mjs`,
   `src/compose.mjs`, `src/staff-map.mjs`, the municode calendar files, `web/app.js` and
   `web/index.html`. You own the five files above. If you need a change in theirs, stop and say so in
   CP2. `d12-main-uat` is shared with G-161: read `source_commit_hash` immediately before each probe, and
   redeploy if it moved.

### The production step, and the hold on it

`dolphin-app` serves `app.smartcityos.io` and runs `3d3ec62`. That commit still renders the vendor's
free-text work-order title, where residents write names and phone numbers, which `main` no longer does
(A-148). Shipping `main` there is the operator's call.

- **If OPS-17 carries an amendment dated 2026-09-18 or later recording the operator's ruling that `main`
  ships to `dolphin-app`**, do it as ONE deploy. Add the configured base to `dolphin-app`'s spec, deploy
  `main` in the same act, read `source_commit_hash` back, and repeat the D-12 checks: the `web/` blobs,
  and the host discrimination from outside.
- **If there is no such amendment, stop at `d12-main-uat`.** Write the exact spec change for `dolphin-app`
  into your close, with secrets redacted. Say plainly that, once your D-13 change is on `main`, any
  `dolphin-app` deploy without the base fails closed on every feed.

Read the amendment at source. Do not take this mission's word, or a chat message, for it.

### Not yours

The `bastrop_tx` finance grant (G-159's leave-behind, dispatched after you land). GCP decommissioning (D-20).
Config and secrets as code (D-21), except that your close records the spec you applied, secrets
redacted, so D-21 starts from it. G-162.

### Close

CP1: the D-14 drift between `main` and the pin, measured before any change. CP2: D-14 done, with its hash
read back. Then the close, covering both rows.

The close records, for each feed, the payload comparison with its record counts. It records every
`source_commit_hash` read back verbatim, and the end-to-end leg with its verdict (MEASURED, or UNMEASURED
and why). It says which production branch ran.

Declare your `leave_behind`. "None" is valid and cheap; the declaration is required regardless.

State your snapshot in your first output: repository, branch, commit, for both repos.
