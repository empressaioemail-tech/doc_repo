---
decision_id: 2026-08-27_factory_console_auth_off
date: 2026-08-27
owner: operator
status: active
related_canonical:
  - 90_operations/OPS-19_factory_plan_of_record.md
  - _inbox/2026-08-27_f04_console_login_proxy_WDLL.md
  - _inbox/2026-08-27_f04-console-proxy_close.json
---

## Decision

The Smart Site Factory console answers reads and the eight control verbs without a session. Sign-in is a flag, not a deletion: `FACTORY_CONSOLE_AUTH` defaults on in code and is set to `off` on the smart-site-factory Vercel project.

## Context

F-04 closed with a session door and an allow-list. The operator then ruled the door off entirely (OPS-19 A-013) and will treat public exposure later. The planner had recommended reads open and writes gated. The operator chose fully open. The control key and the operator stamp are not auth and stay.

## Structural commitment check

Sell reasoning, not data: the console is an operator surface, not a catalog product. No Layer 1/2 change.
Confidence is earned, not asserted: a mutation with no session records `console:anonymous`, which is an honest absence of a particular subject, never a fabricated identity.
Tenant sovereignty: no tenant data path in this change.
MCP-first: not in scope.

## Reasoning

A forgotten environment variable must re-lock, so the code default is on (fail closed) and only the exact value `off` disables the door. Deleting the OIDC and session code would make re-enable a rebuild. The proxy still holds `FACTORY_CONTROL_API_KEY` and still refuses to put Bearer, the factory-control hostname, or a 32-character literal in the served bundle. factory-control still requires Bearer and still refuses a POST with no operator header. With auth off the proxy stamps `X-Factory-Operator: console:anonymous` on every mutation. `console:anonymous` is not in the factory-control sentinel set (`api`, `unknown`, `anonymous`, `system`, `operator`, empty), which is exact-match after lowercasing, so the stamp is accepted.

## Reversal criteria

The operator says the word. Flip `FACTORY_CONSOLE_AUTH` off the project (or to any value other than `off`) and redeploy. The OIDC values and Google redirect URI named in the original F-04 close are the path back to a signed-in door. They are not an owed leave-behind while the flag is off.

## Dependencies

Depends on F-04 proxy and factory-control operator refuse (hauska-map PR 252, hauska-factory PR 13). Supersedes F-04 item 2 (sign-in required) while the flag is off. Does not change factory-control image or verbs.
