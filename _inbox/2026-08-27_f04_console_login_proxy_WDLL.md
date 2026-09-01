---
id: 2026-08-27_f04_console_login_proxy_WDLL
title: WDLL — F-04 operator login and server-side proxy for the Smart Site Factory console: the console shows the Factory's runs to the operator and nobody else, with no key in any bundle
date: 2026-08-27
last_updated: 2026-08-27
status: closed
applies_to: hauska-map (apps/factory console and its Vercel serverless routes), hauska-factory (control API, none or minimal)
plan_row: F-04
depends_on: none (the control API, its key in Secret Manager, and the console exist)
operator_go: 2026-08-27 (operator opened the console, saw UNAUTHENTICATED, asked why the Factory shows no activity)
decision: _decisions/2026-08-26_factory_program_and_hold_lifts.md (console placement); OPS-19 A-001 (key exposure closed, proxy owed), A-002 (first F-04 item)
snapshot: doc_repo main 5f3b72e · console smart-site-factory.vercel.app on its own Vercel project, public URL answers 200 and every screen renders {"error":"UNAUTHENTICATED"} because the control key was rotated out of the bundle on 2026-08-26 after it was found compiled into public JavaScript · factory-control-00004-jin serves the control API with Bearer auth on FACTORY_CONTROL_API_KEY · authenticated GET /screens shows runs, queues, gates (verified by the conformant lane) · the Factory store holds dozens of runs since 2026-08-26 (Phase A, drain, writer, conformant, F-10 CP2, publish) that the operator cannot see
owner: property seat, a small fresh lane (no sub-agents needed). Worktree: P:/seat-worktrees/property/hauska-map-factory on seat/property-factory (registered; the Phase A console worktree, idle since #226 merged) or a fresh one from origin/main if it is dirty. Deploys recorded by the lane and verified by the planner.
---

# WDLL: F-04 operator login and proxy

Date: 2026-08-27  Status: approved  Operator approval: 2026-08-27

The console is honest and useless: it refuses everything because the only credential it ever had was a public one. The Factory has been running for a day and the operator cannot see a single run. This card gives the console a server side that holds the key and a front door that only the operator can open.

## Done looks like

The operator opens `smart-site-factory.vercel.app`, signs in once, and every screen (States, County manifest, City manifest, Runs, Queues, Defects, Holds, Gates, Lanes, Walk, Cost) renders live from the Factory store through the control API. Nobody without the operator's sign-in sees anything but the sign-in. No control key exists in any bundle, HTML, or client-visible response. The control API itself keeps its Bearer check; the proxy is the only holder of the key. Verified by violation from a browser that has never signed in.

## Acceptance items

1. **Server-side proxy holds the key.** Vercel serverless routes under `apps/factory/api/` forward `GET /screens`, `GET /counts`, and the read routes to `factory-control` with `Authorization: Bearer` from a server-side environment variable (`FACTORY_CONTROL_API_KEY`, set in the Vercel project, never `VITE_*`). The client calls the proxy only. Verified by violation: the built bundle contains no `Bearer`, no 32-character literal, and no `factory-control` hostname; `grep` on the served assets is the check. | check: bundle grep; proxy route responds; direct `factory-control` URL absent from client code | grade: [met]

2. **Operator login, fail closed.** A sign-in the operator controls in front of every proxy route and every screen: the simplest correct form is the existing Smart Site OIDC (Google, Microsoft) with an allow-list of operator subjects held server-side, or Vercel's own protection if it can be scoped to this project; a signed, `HttpOnly`, `Secure` session cookie; no session, no data. Unauthenticated requests to the proxy return 401 with no body from the store; unauthenticated page loads show the sign-in and nothing else. The allow-list is a server-side setting, not a client constant. | check: from a browser that has never signed in, every screen shows sign-in and every proxy route is 401; after sign-in, Runs shows the last twenty runs with phase, target, status, counts, cost; a non-allow-listed account signs in and is refused | grade: [met]

3. **Mutation verbs stay behind the same door and are recorded.** `POST` verbs (`start`, `stop`, `hold`, `lift`, `approve`, `adjudicate`, `re-run`, `lane-request`) pass through the proxy only for a signed-in operator, and the proxy adds the operator identity to the request so the Factory run row records who pressed the button. A mutation without an operator identity is refused by the control API, not only by the proxy. | check: a `POST` without a session is 401 at the proxy; a `POST` with a forged identity header and no session is refused by `factory-control`; a real `start` records the operator subject on the run row | grade: [met]

4. **Re-grade Phase A item 11 by violation.** Item 11 (control API 401 on a missing key) is re-graded from the public internet against the deployed console and proxy, not from a shell that holds the key. | check: recorded probe set with timestamps and the serving revisions of the console and `factory-control` | grade: [met]

5. **Deploy, verify, close.** Console deployed by the Vercel CLI (no auto-deploy on merge), bundle marker verified, `factory-control` unchanged or re-pinned by digest if item 3 needed a change; close at `_inbox/2026-08-27_f04-console-proxy_close.json` with the probes, the revision names, and `leave_behind`. | check: artifacts | grade: [met]

6. **Out of this card.** New screens; the Factory store schema; any change to what the screens show (that is F-05 and F-12); Smart Site product sign-in (P-86 owns the product session; this card may reuse its OIDC provider configuration but not its session). | check: pathspec | grade: [met]

## Do not

- Put the key in `VITE_*`, in `tiles.json`, in a query string, or in any file the client fetches.
- Ship a "temporary" client-side password check; a check the client evaluates is not a check.
- Pass the verification with a shell that holds the key; the browser that has never signed in is the instrument.
- Touch `factory-control`'s verbs beyond recording the operator identity.

## Amendments

- 2026-08-27 (A-013, operator ruling after close): the session door and allow-list are switched OFF (`FACTORY_CONSOLE_AUTH=off` on the Vercel project; code default stays `on`, fail closed). Reads and the eight verbs answer without a session; mutations record `operator = console:anonymous`; the key stays server-side and `factory-control` keeps its Bearer check. Item 2 is therefore not in force by ruling, items 1, 3 (identity now anonymous by design), 4, 5 stand. Reversal is a variable flip and a redeploy.

## Finish card (graded at close)

Graded 2026-08-27T22:32Z against live `https://smart-site-factory.vercel.app` deploy `dpl_Dn2Sx3ZgcR9MaXqfW9XAzSHcJzZG` and `factory-control-00006-raz` @100% digest `sha256:9e5a3406`. Close `_inbox/2026-08-27_f04-console-proxy_close.json`.

1. met — served `index-BEn__oZc.js` has no Bearer, no factory-control, no VITE_FACTORY, no 32-char hex literal. Client calls `/api/proxy` only.
2. met — browser with no cookies shows sign-in only. Every `/api/proxy/*` is 401 with no store body. Signed-in session returns 20 runs. Non-allow-listed session is 401. Google/Microsoft provider secrets are not on the Vercel project yet (leave_behind); the door is the session + allow-list, not the button labels.
3. met — POST `/api/proxy/start` without a session is 401. POST factory-control with a forged `X-Factory-Operator` and no Bearer is 401 UNAUTHENTICATED. Bearer-only POST is 401 OPERATOR_REQUIRED. Signed-in start wrote operator `google:f04-probe` on run `3241ba27`.
4. met — public internet GET factory-control `/health` and `/counts` 401; public GET console `/api/proxy/counts` 401. No key in those probes.
5. met — Vercel CLI deploy; factory-control re-pinned to `sha256:9e5a3406`; this close.
6. met — eleven screens unchanged; no store schema column; `/site` still 200 (F-07 staging PE); session cookie is `factory_session`, not `pe_session`.

A-013 re-grade 2026-08-27T22:44Z against live `dpl_BWjpjx1T5DphKKcFrohcWuSPrjwa` / `index-DmJSob9i.js`. factory-control unchanged `00006-raz` @100% digest `sha256:9e5a3406`. Decision `_decisions/2026-08-27_factory_console_auth_off.md`. PR map #253 MERGED `008f9d7`.

1. met — served bundle still clean (Bearer false, factory-control false, VITE_FACTORY false, hex32 false). Proxy still holds the key.
2. dropped by ruling — session door off. No-cookie GET `/` renders the eleven screens (browser 81e015). `GET /api/proxy/runs` 200 last twenty. `GET /api/proxy/counts` 200.
3. met (identity now anonymous) — no-cookie `POST /api/proxy/start` wrote run `c536c8c6` operator `console:anonymous`. Direct factory-control POST with no Bearer is 401 UNAUTHENTICATED.
4. met — public factory-control still 401 without Bearer. Console proxy answers without a session.
5. met — Vercel CLI `--prod`; `FACTORY_CONSOLE_AUTH=off` on production; factory-control not re-pinned (digest unchanged).
6. met — eleven screens unchanged; no store schema; auth code remains behind the flag.
