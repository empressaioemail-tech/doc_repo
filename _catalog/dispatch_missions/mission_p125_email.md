## Mission — P-125: wire the signed-in account email onto the entitlement response

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

### Where you work

An existing git clone at `P:/tmp/legacy-design-tools-p125-entitlement-wire`
(repo: `empressaioemail-tech/legacy-design-tools`), already checked out on
branch `feat/p125-account-entitlement-email` from a fresh `origin/main`.
Declare the commit you started from before you write anything.

### The bug, verified against live/merged code before this mission was written

Property Explorer's Settings modal shows "Signed in as: Not read" for every
account. The CLIENT half already shipped (hauska-map PR #372, merged to its
main) — it reads `account.email` off the account-entitlement response and
falls back to "Not read" until the server sends it. Nothing server-side
sends it yet. Confirmed live: `apps/property-explorer/src/lib/accountEntitlementClient.ts`
on hauska-map's `origin/main` line 173 declares `email: string | null;` and
line 282 does `email: parseEmail(pick("email"))`. The wire contract is
locked: a top-level `email` field, string or null, on the account-only
entitlement body. Do not rename or reshape it.

### The fix

All in `artifacts/api-server/src/lib/peEntitlement.ts`, mirroring the
EXISTING `hasBillingAccount` field exactly (same file — read it before you
start).

1. Add `email: string | null;` to the `PeEntitlementSnapshot` type
   (~line 23-86, right after `hasBillingAccount`), with a doc comment
   explaining it is the account's signed-in email, account-body-only, same
   reasoning shape as `hasBillingAccount`'s own comment.

2. In `resolvePeEntitlement` (~line 147-206): the anonymous-caller early
   return (~line 152-167) sets `email: null` (no account, nothing to know —
   same reasoning as its neighboring `hasBillingAccount: false`). The
   authenticated branch (~line 184-205) sets `email` from the real account's
   stored email. Grep this repo for `getPeUserEmail`
   (`artifacts/api-server/src/lib/peIdentity.ts` is one call site, already
   used on every subscription purchase); read its actual signature before
   calling it, do not guess the shape. Call it keyed on the resolved
   `userId`.

3. In `peEntitlementAccountBody` (~line 286-310): add `email: string | null`
   to both the return type annotation and the returned object, positioned
   the same way `hasBillingAccount` is — added ONLY to the account body.
   `peEntitlementBaseBody` is contract-locked byte-identical per its own doc
   comment and MUST NOT change.

4. Tests: `peEntitlement.responseBody.unit.test.ts` already tests
   `hasBillingAccount` (true/false/anonymous cases). Add the equivalent for
   `email`, including the anonymous-returns-null case.

5. OUT OF SCOPE, do not touch: "renewal date." It needs a live Stripe API
   call design (the codebase deliberately avoids reading Stripe's
   `current_period_end` today — see the comment above
   `peBillingIntervalForPriceId` in `pePaywallStripe.ts` explaining why —
   this is separate, larger work, not a stored-field wire-up like this one).

6. OUT OF SCOPE, do not touch: `peEntitlementBaseBody`, the with-parcel
   response shape, or anything in the anonymous/per-property read path.

### Verification (exit-bounded — every command here must terminate on its own; no watch, tail, or serve)

Run the specific test file(s) you touched and confirm they pass — paste the
real exit code and pass count, not a summary. Run the repo's typecheck
script if `package.json` has one (`tsc --noEmit` otherwise) and confirm it
exits 0. Do not claim green without the actual command output in hand.

### Close

Commit (one focused commit, message style matching `git log --oneline -10`
in this repo), push the branch, open a PR with `gh pr create` (base `main`,
title matching the diff, body citing the client contract this closes and
the two out-of-scope items above so a reviewer doesn't wonder why they're
missing). Do NOT merge it yourself. Do NOT deploy.

If `getPeUserEmail` does not exist or has a different shape than expected,
STOP and report rather than inventing a substitute.

### Return

Write the close artifact named in this dispatch's CHECKPOINTS block
(the `CLOSE:` path) containing: the PR URL, the exact test/typecheck
command output you ran, the diff file list, and anything you stopped and
flagged instead of building. `leave_behind: none` if nothing else is
outstanding, or the standard block naming what is.
