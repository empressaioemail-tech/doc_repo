# MISSION — G-135: distribute the tenant key, and fix the reason nobody found it

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

## What G-133 established, so you do not re-derive it

**The key was never missing.** G-133 closed 2026-09-15 and found that v1 and v2 are gated by
**two completely unrelated credentials, both working correctly**:

- **v1** (`smartcityos.io`) requires a logged-in **Google OAuth session cookie** — a global gate in
  `server/routes.ts`. `esri.ts`'s own middleware is wide open; the gate is elsewhere.
- **v2** (`smartcity-dashboards`) requires a **Hauska product key scoped to
  `jurisdiction_tenant=bastrop_tx`**, carried in `HAUSKA_TENANT_KEY` and validated by
  `src/tenancy.mjs:43` against `hauska-mcp-server`'s `/auth/whoami`. Verified at source.

A lane's `curl` carries neither. That is the entire reason the map works in the operator's browser
and 401s for a lane, and **nothing is broken**.

**And the key exists.** Active, created **2026-09-03 — the same day G-116's close said it did not
exist** — and used successfully at **20:31 UTC 2026-09-14**, hours before the recon ran.

So this is a **distribution problem, not a provisioning one.** Three lanes were degraded to
`closed-partial` for a credential that was sitting there working.

## DO NOT HAND OUT THE EXISTING KEY

It is labelled **"Nick, bastrop_tx staff pilot"** and belongs to the operator's own account.

A human's pilot credential is the wrong shape for automated verification. It ties every lane's
ability to work to one person's account, and the day it is rotated or revoked every lane breaks at
once with no obvious cause.

**Mint a separate, verification-scoped credential.** Same tenant scope, distinct identity,
distinct label, so it can be rotated or revoked without touching the operator's own access.

## Scope, and the seat boundary is real

**Minting happens in `hauska-mcp-server`, which the SUBSTRATE seat owns.** If you are not that
seat, **do not write to that repo** — request the mint from the owning seat and say so in your
close. This program's own rule: product repositories have one owning seat.

**Distribution and documentation are doc_repo and `smartcity-dashboards`**, and are in scope
either way.

## What to deliver

**1. A verification-scoped `bastrop_tx` credential**, minted or requested per the seat boundary
above. Record its **id, label, tenant scope and location** in your close. **Never its value.**

**2. Put it where lanes actually look.** Not one place — the places a lane already checks:
- Secret Manager, in the project the serving revision reads from
- `.env.example` in `smartcity-dashboards`, naming `HAUSKA_TENANT_KEY` with a comment saying what
  it is for and where to obtain it — the name is already read by the code, so a lane grepping for
  it should find guidance rather than silence
- The dispatch preamble or `_catalog`, so it travels with dispatches rather than being remembered

**3. Prove it works.** A full-shell authenticated probe on `bastrop_tx` that **mounts the map
iframe.** That has never once happened, and G-128's close records it as an open item. This is the
acceptance test for the whole row, not a nicety.

**4. Correct the two closes that assert a falsehood.** G-116's close (2026-09-03) and G-128's
close (2026-09-14) both state the key does not exist. It did, in both cases, at the time each was
written. Annotate them — do not rewrite history, add a dated correction — because the next reader
inherits a false absence otherwise.

## THE STRUCTURAL FINDING, which is bigger than the key

Nobody found the credential because it lives in `hauska-mcp-server`, a different repo under a
different seat, **outside every dashboards lane's dispatch scope.**

**The lanes did enumerate. Their enumeration boundary was the seat boundary.**

"Enumerate before asserting absence" is the rule this operation leans on hardest, and it holds only
as far as a lane's scope reaches. Three independent lanes hit the same edge and not one of them
could see past it.

**Build the cheap fix: a credential and access index in `_catalog`.** What exists, which seat owns
it, which repo it lives in, which env var carries it, and how to obtain it. **Names, owners and
locations only — never values.** It does not need to be complete to be useful; it needs to exist so
a lane asking "is there a credential for X" has somewhere to look that is not another seat's
private knowledge.

If you think a different mechanism serves that better, propose it in your close rather than
building something else.

## Method

**Never print secret VALUES.** Ids, labels, tenant scopes, env var names, locations and timestamps
only. G-133 managed this while querying an `api_keys` table directly; hold the same line.

**Verify by violation.** The new credential is accepted for `bastrop_tx` and **refused for another
tenant**. A credential observed only working has not been observed scoped.

ENUMERATE BEFORE ASSERTING ABSENCE — and given this row exists because that rule hit a boundary,
**say explicitly which repos and seats your enumeration covered and which it did not.**

State the mechanism explaining an observation, then a second mechanism that would produce the same
observation and why you rejected it.

Every verification command exit-bounded (`timeout 120 ...`).

## Why this is urgent rather than tidy

**Two lanes are live right now that need this.** G-129 (flood mount) was told to fall back to
`template-city` if it hit the 401. G-134 (WorkOS wiring) is the one that most needs authenticated
Bastrop verification of anything in the program.

Without this row both close `closed-partial` for the same reason three lanes already did — except
now we know the credential exists, which makes a fourth repeat a choice rather than an accident.

## Out of scope

Rotating or revoking the operator's existing pilot key. Anything about WorkOS or staff identity
(G-134). v1's session-cookie gate — that is v1's own design and it is working.

## Close

Write your close to the path named in the CHECKPOINTS AND CLOSE block above — that is the
machine-checkable one, and this mission deliberately does not name a second.

State: the credential's id, label, tenant scope and location, with **no value**; every place you
put it; the violation test showing it is refused for another tenant; **the full-shell probe that
mounted the map iframe**, which is the acceptance test; what you annotated on G-116's and G-128's
closes; and what your enumeration covered and did not.
