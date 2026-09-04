---
decision_id: 2026-09-04_p112_auth_options_ruling
date: 2026-09-04
owner: operator
status: active
related_canonical:
  - _smartsite_gtm/08_open_scope
  - 90_operations/OPS-16_texas_market_plan_of_record
---

# Decision

P-112 ("more ways in") carried one governing fork since it was carded 2026-09-02: whether WorkOS becomes the front door for every sign-in provider, or every provider stays a direct build. That fork is what sized the row — under WorkOS, Apple and email become configuration inside one integration; direct, each is its own build with its own maintenance.

Operator ruled 2026-09-04, asked directly what the decision actually meant, then chose: **direct builds, no WorkOS front door.**

- **Google** — already live, unaffected.
- **Microsoft** — already built (`api/auth.ts`'s `/api/auth/microsoft/start`/`callback`, PKCE, correctly-gated UI button), unconfigured in production. Needs a real Azure AD app registration plus `MICROSOFT_OIDC_CLIENT_ID`/`MICROSOFT_OIDC_CLIENT_SECRET` in Vercel prod. Not a build; a credential.
- **Email** — a real build, ours to own. Sender exists (`RESEND_API_KEY`, Secret Manager). Magic link vs one-time code is a separate open call, not resolved by this ruling.
- **Apple** — explicitly out of scope. Not carded further. Its JWT-based client secret (expires at six months, needs generation and rotation) was the single biggest driver toward the WorkOS option; ruled out along with WorkOS, its cost stays ours to not pay by not building it.
- **WorkOS** — stays exactly what it is today: connector OAuth completion (`workos-complete.ts`) and the smartsite-mcp AuthKit bearer validation (P-87). Never becomes the web sign-in broker under this ruling.

## Reasoning

Operator's own framing: "how about we just do google msft and email and we build and manage. that should be enough options for signups." Three providers is judged sufficient friction reduction without taking on a vendor migration (WorkOS would have meant ripping out the Google/Microsoft code that already works, not just adding to it) or a platform dependency on something as core as sign-in.

## Reversal criteria

Revisit the WorkOS posture if a fourth provider is ever requested (Apple specifically, or enterprise SAML SSO for an org customer) — at that point the per-provider-build cost this ruling accepted compounds again, and WorkOS's original case (one integration, one bill, rotation not ours) becomes worth re-weighing.

## Dependencies

Blocks nothing that was not already blocked. Unblocks P-112's Microsoft leg (a credential ask, not a build — someone with Azure access needs to register an app) and its email leg (the magic-link-vs-code call still needs an answer before dispatch).

## 2026-09-04 addendum — email mechanism ruled; Microsoft deferred, not just credential-blocked

Operator asked directly what the WorkOS choice actually meant before ruling it; the same session then asked the email-mechanism question directly rather than leaving this decision file's own "still needs an answer" line to be resolved by inference. **Magic link, ruled.** No password anywhere in this flow; a build agent dispatched against this ruling should treat magic link as settled, not open.

**Microsoft correction**: operator had not realized an Azure AD app registration was a real prerequisite before this ruling ("drop msft for now we will do that ad app and account later i didnt realize that was a prerequsite"). This is not merely "a credential ask" as this file originally characterized it — it is deferred, with no dispatch expected until the operator has registered the app and can hand over the client id/secret. Do not treat Microsoft as in-progress or blocked-on-a-quick-ask; treat it as parked.
