---
title: SmartCity staff identity on WorkOS
last_updated: 2026-09-19
status: staging-configured, production-pending
owner: govtech planner
source: "decision _decisions/2026-09-14_staff_identity_and_department_rbac.md; WorkOS Staging configuration pass 2026-09-19; issuer verified by measurement 2026-09-19"
---

# SmartCity staff identity on WorkOS

This is the operator-facing setup record for staff sign-in on `app.smartcityos.io`. It states what is
configured, what the code actually reads, what is verified, and the exact things still owed. It is
written so that the Production pass is a repeat of Staging rather than a re-derivation.

The binding decision is `_decisions/2026-09-14_staff_identity_and_department_rbac.md`. The code is
provider-agnostic by construction, so nothing here is WorkOS-specific except the values.

## What is configured in WorkOS Staging

A project named **SmartCity OS**, with Staging and Production environments. Only Staging is set up.

| Item | Value |
| --- | --- |
| Sign-in page (AuthKit) | on, email and password |
| Self-registration | OFF |
| MFA | Required for every user |
| Organization | "City of Bastrop", External ID `bastrop_tx` |
| Roles | `development-services`, `finance`, `public-works`, `parks`, `police`, `fire-ems`, `fleet`, `city-manager`, `admin` |
| Redirect URIs | `https://app.smartcityos.io/auth/callback`, `http://localhost:3000/auth/callback` |

There is also a WorkOS default role called `member` that cannot be removed. It is not one of the nine,
so a user who is never assigned a role is refused rather than let in. That is the correct failure
direction and needs no action.

## The rule that made the tenant claim work

The `city_key` claim is produced by a WorkOS **JWT template**, not by mapping code:

```json
{ "city_key": "{{ organization.external_id }}" }
```

Because the organization's External ID is the literal `bastrop_tx`, the token carries
`city_key: "bastrop_tx"`, which is exactly the string `src/tenancy.mjs` compares a caller's tenant
against. This is why the trap did not need a code change.

## The environment variables, and where each one goes

Set these on `dolphin-app` (and on `d12-main-uat` if UAT should be sign-in capable).

| Variable | Value | Notes |
| --- | --- | --- |
| `SHELL_IDENTITY_PROVIDER` | `https://api.workos.com/user_management/client_01M2X7GNPZ297887ZMZ8TVAFRX` | VERIFIED, see below. This is the **issuer**, not the discovery URL. |
| `STAFF_TENANT_CLAIM` | `city_key` | matches the JWT template above |
| `STAFF_ROLE_CLAIM` | `role` | see the open question on role shape |
| `WORKOS_CLIENT_ID` | `client_01M2X7GNPZ297887ZMZ8TVAFRX` | used to build the authorize URL |
| `WORKOS_API_KEY` | *(not yet available to any agent)* | used BOTH as the Admin API bearer and as the OAuth `client_secret` in the code exchange |
| `WORKOS_ORGANIZATION_ID` | `org_01M2X7MP3X9FM2BEC0QNFCRQ99` | for Admin API calls scoped to the organization |
| `WORKOS_REDIRECT_URI` | `https://app.smartcityos.io/auth/callback` | must also be registered in WorkOS |

`STAFF_IDENTITY_JWKS_URL` is an optional override and does not need to be set. Discovery supplies it.

## The issuer is verified, not assumed

The setup pass reported the issuer as "likely". It has since been measured, and it is correct:

- `GET https://api.workos.com/user_management/client_01M2X7GNPZ297887ZMZ8TVAFRX/.well-known/openid-configuration`
  returns HTTP 200 with `"issuer": "https://api.workos.com/user_management/client_01M2X7GNPZ297887ZMZ8TVAFRX"`.
- Its `jwks_uri` is `https://api.workos.com/sso/jwks/client_01M2X7GNPZ297887ZMZ8TVAFRX`, which serves
  **one RSA key with `alg=RS256`, `use=sig`**.

Both halves matter. `src/staff-identity.mjs` compares the token's `iss` against
`SHELL_IDENTITY_PROVIDER` **exactly** (normalising only a trailing slash), so the issuer string must be
character-for-character right, and it **hardcodes RS256**, so a provider signing with anything else
would fail closed. Both conditions are satisfied.

## Two things remain unconfirmed until a real token is decoded

1. **Role shape.** WorkOS "Multiple roles" is off, which should make `role` a single string. The code
   requires a string and refuses an array, so this must be seen rather than assumed.
2. **`city_key` resolution.** The JWT template should produce `bastrop_tx`. It has not been observed.

Neither is a design problem; both are the kind of thing that looks fine on paper and 401s in
production. Decoding one real token settles both at once, along with the issuer.

## What is owed, and by whom

**Owed to the operator, and blocking. `WORKOS_API_KEY` must be placed in Secret Manager.** No agent
has this value: the setup pass reported it was not copied, and it exists only in the WorkOS dashboard's
API-keys tab, which agents cannot reach. Until it is stored, nothing can mint a test user, assign a
role, or call the Admin API. Suggested secret name and project are the operator's choice; whatever is
chosen, record it in `_catalog/credential_access_index.json` with a `howToUse` and a `howToRevoke`, as
that index's convention requires.

**Owed to the operator. Create one test user, sign in once, and decode the token.** This is the step
that closes both open questions. Assign the user a role from the nine so the role claim has a value.

**Owed to the govtech planner. Verify at the deployed surface.** Once a token exists, the check that
matters is not that it decodes, it is that `app.smartcityos.io` accepts it and refuses the wrong ones:
a token for `bastrop_tx` reads the pack, a token without a role is refused, and a token for a tenant
that has no pack is refused rather than served an empty 200.

**Later. The Production pass.** Repeat the Staging configuration in the Production environment, then
move the environment variables from Staging values to Production values. Production was deliberately
not started, which was the right call.

## What is NOT needed

- No mapping code for the tenant claim, because the JWT template handles it.
- No code change for the API key doubling as the client secret.
- No custom MFA implementation. WorkOS enforces it.
- No `STAFF_IDENTITY_JWKS_URL` override.
- No role for the WorkOS default `member` role to be removed.
