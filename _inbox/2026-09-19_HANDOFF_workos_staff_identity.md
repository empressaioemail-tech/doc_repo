---
id: HANDOFF_2026-09-19_workos_staff_identity
title: "HANDOFF — WorkOS staff identity: wire the vars, mint a real token, grade G-134"
status: active
last_updated: 2026-09-19T19:00:00Z
owner: govtech-planner-integration
---

# HANDOFF — WorkOS staff identity

Written at the close of the session that filed G-149's and G-169's stranded closes, merged both
G-169 PRs and closed G-169 on a green deploy run. This block was NOT started, on purpose: it writes
production secrets and the session was already long. Everything below is the state it left.

## Snapshot

`doc_repo` `main` at `d230366e`. Work happens in the doc_repo seat's own worktree. Read `_STATE.md`
first as always, then `90_runbooks/smartcity_staff_identity_workos.md` (the runbook for this
subject), then this file.

## Read first

1. `90_runbooks/smartcity_staff_identity_workos.md` — the configured values, the JWT template, and
   the two claims that a real token is still needed to settle.
2. `scripts/govtech/staff-identity-verify.mjs` — the instrument. Run its `--self-test` first; it
   drives `inspectClaims` in BOTH directions on synthetic tokens.
3. `scripts/govtech/do-deploy.mjs` — the deploy guard. Its `--set-env` path is the piece that needs
   extending.

## What is true right now

- **The WorkOS Staging environment is configured** (operator pass, 2026-09-19): AuthKit on,
  self-registration off, MFA Required, organization `City of Bastrop` with external ID
  `bastrop_tx`, the nine roles created, redirect URIs `https://app.smartcityos.io/auth/callback`
  and `http://localhost:3000/auth/callback`.
- **The JWT template is set to `{ "city_key": "{{ organization.external_id }}" }`**, so
  `STAFF_TENANT_CLAIM=city_key` should be correct. A token has never been decoded to confirm it.
- **`WORKOS_API_KEY` is in Secret Manager** (operator action). **Confirm the secret's NAME before
  wiring it** — this handoff does not assert it, because it was not verified here.
- **None of the seven identity environment variables is set on `dolphin-app`.** That was measured,
  not assumed.
- **The dev host can reach everything it needs.** Measured 2026-09-19: `vercel whoami` succeeds
  (Vercel CLI 54.20.1, team `empressaioemail-tech`); `gcloud` is authenticated as
  `empressaioemail@gmail.com`. An earlier claim that Vercel fails here on a TLS certificate does
  not reproduce; do not repeat it.
- **`scripts/govtech/do-deploy.mjs` can rewrite an EXISTING env var but REFUSES TO ADD ONE.** Its
  `--set-env` path fails closed when the key is absent, which is correct for its original purpose
  (G-171 changed a base URL that existed) and wrong for this one (all seven are absent).

## The work, in order

1. **Extend `do-deploy.mjs` to permit a deliberate ADDITION.** Do not simply relax the refusal. It
   should take an explicit flag that names the keys being added, refuse anything not named, keep the
   existing leaf-diff guard so only the intended entries change, refuse to write `SECRET`-typed
   entries, and carry a self-test that FAILS when the addition guard is reverted. The existing
   byte-for-byte round-trip check on every other env entry must survive.
2. **Wire the seven variables to `dolphin-app`**: `SHELL_IDENTITY_PROVIDER`,
   `STAFF_TENANT_CLAIM`, `STAFF_ROLE_CLAIM`, `WORKOS_CLIENT_ID`, `WORKOS_API_KEY`,
   `WORKOS_ORGANIZATION_ID`, `WORKOS_REDIRECT_URI`. Values and the issuer shape are in the runbook.
   `WORKOS_API_KEY` must arrive as a secret reference, never a literal in the spec.
3. **Provision a real test user** in the `City of Bastrop` organization with one of the nine roles,
   via the WorkOS Admin API.
4. **Sign in once** and capture the token. **THIS STEP NEEDS A HUMAN AT A BROWSER**: it involves
   setting a password, and no agent can complete it.
5. **Run `staff-identity-verify.mjs` against the real token.** This is the step that settles the two
   things the WorkOS dashboard cannot show, because the dashboard shows what was CONFIGURED and the
   questions are what the TOKEN CARRIES: whether `role` arrives as a single string (WorkOS "Multiple
   roles" is off, which should produce a string) and whether `city_key` resolves to `bastrop_tx`. It
   also probes the DEPLOYED app, which is the only way to know whether any of it is wired through.
6. **Re-grade G-134** against the probe, then retire the shared persona.

## The blocking item

Step 4. Everything before it is agent-doable; the token is not. Plan for the operator to be
available at that point rather than discovering it mid-run.

## Traps

- **Fails closed means the deploy guard refusing an addition is CORRECT today.** Extending it is a
  deliberate widening of scope, not a bug fix, and it needs a detector that fails when the new
  permission is abused. A guard that blocks work it was never meant to reach teaches the fleet to
  use the bypass flag.
- **Do not accept a presence-shaped pass here.** "The env var is set" and "the token carries the
  claim" are different claims from different derivations, and the entire point of this block is the
  second one.
- **`member` is a WorkOS default role that is not one of the nine.** A user who is never assigned a
  role must be REFUSED, not defaulted. Verify that path rather than assuming it.
- **Production environment is untouched.** Only Staging is configured. A `sk_live_` key is needed
  before that pass, and it is a separate decision.
