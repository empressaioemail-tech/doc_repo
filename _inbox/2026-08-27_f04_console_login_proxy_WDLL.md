---
id: 2026-08-27_f04_console_login_proxy_WDLL
title: WDLL — F-04 operator login and server-side proxy for the Smart Site Factory console: the console shows the Factory's runs to the operator and nobody else, with no key in any bundle
date: 2026-08-27
last_updated: 2026-08-27
status: approved
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

1. **Server-side proxy holds the key.** Vercel serverless routes under `apps/factory/api/` forward `GET /screens`, `GET /counts`, and the read routes to `factory-control` with `Authorization: Bearer` from a server-side environment variable (`FACTORY_CONTROL_API_KEY`, set in the Vercel project, never `VITE_*`). The client calls the proxy only. Verified by violation: the built bundle contains no `Bearer`, no 32-character literal, and no `factory-control` hostname; `grep` on the served assets is the check. | check: bundle grep; proxy route responds; direct `factory-control` URL absent from client code | grade: [ ]

2. **Operator login, fail closed.** A sign-in the operator controls in front of every proxy route and every screen: the simplest correct form is the existing Smart Site OIDC (Google, Microsoft) with an allow-list of operator subjects held server-side, or Vercel's own protection if it can be scoped to this project; a signed, `HttpOnly`, `Secure` session cookie; no session, no data. Unauthenticated requests to the proxy return 401 with no body from the store; unauthenticated page loads show the sign-in and nothing else. The allow-list is a server-side setting, not a client constant. | check: from a browser that has never signed in, every screen shows sign-in and every proxy route is 401; after sign-in, Runs shows the last twenty runs with phase, target, status, counts, cost; a non-allow-listed account signs in and is refused | grade: [ ]

3. **Mutation verbs stay behind the same door and are recorded.** `POST` verbs (`start`, `stop`, `hold`, `lift`, `approve`, `adjudicate`, `re-run`, `lane-request`) pass through the proxy only for a signed-in operator, and the proxy adds the operator identity to the request so the Factory run row records who pressed the button. A mutation without an operator identity is refused by the control API, not only by the proxy. | check: a `POST` without a session is 401 at the proxy; a `POST` with a forged identity header and no session is refused by `factory-control`; a real `start` records the operator subject on the run row | grade: [ ]

4. **Re-grade Phase A item 11 by violation.** Item 11 (control API 401 on a missing key) is re-graded from the public internet against the deployed console and proxy, not from a shell that holds the key. | check: recorded probe set with timestamps and the serving revisions of the console and `factory-control` | grade: [ ]

5. **Deploy, verify, close.** Console deployed by the Vercel CLI (no auto-deploy on merge), bundle marker verified, `factory-control` unchanged or re-pinned by digest if item 3 needed a change; close at `_inbox/2026-08-27_f04-console-proxy_close.json` with the probes, the revision names, and `leave_behind`. | check: artifacts | grade: [ ]

6. **Out of this card.** New screens; the Factory store schema; any change to what the screens show (that is F-05 and F-12); Smart Site product sign-in (P-86 owns the product session; this card may reuse its OIDC provider configuration but not its session). | check: pathspec | grade: [ ]

## Do not

- Put the key in `VITE_*`, in `tiles.json`, in a query string, or in any file the client fetches.
- Ship a "temporary" client-side password check; a check the client evaluates is not a check.
- Pass the verification with a shell that holds the key; the browser that has never signed in is the instrument.
- Touch `factory-control`'s verbs beyond recording the operator identity.

## Amendments

- None yet.

## Finish card (graded at close)

(not yet)
