## Mission - G-163: two platform routes fail opaquely where the GCP copy stated the reason

You launch no sub-agents (FAN-DEPTH 0). You WRITE in `smartcity-os`. You write nothing in
`smartcity-dashboards` and nothing in `doc_repo` (planner-owned: hand any doc edit back as a diff,
uncommitted). Hand the close to `_inbox/` in doc_repo without committing it.

### READ THIS FIRST: `smartcity-os` is a single-writer repo, and another lane is in it

`g162-v1-finance-honesty` is RUNNING against `smartcity-os` right now, fixing three production finance
defects. **A product repo has one owning seat (ENFORCEMENT.md).** Do not begin your first write until
that lane's close is filed.

Measured, so you know the real risk rather than a guessed one: the planner checked the file sets and
the primary files DO NOT overlap. G-162 works in `server/routes/finance.ts`, `server/routes/opengov-bnp.ts`
and `server/services/opengov-bnp.ts`; you work in `server/routes/firstdue.ts` and `server/routes/goto.ts`.
`server/routes/ai-assistant.ts` matches both greps, so read it before you touch it and prefer not to.
The serialization is a discipline choice, not a hard merge necessity, which is exactly why it is worth
respecting.

Claim your lane before your first write.

### The defect, and the falsifier that places it

Found by the D-13 ship acceptance on 2026-09-18 (OPS-25 A-10).

`GET /api/platform/firstdue/apparatus` and `GET /api/platform/goto/call-summary` on `smartcityos.io`
answer a **Cloudflare `504` HTML page in about a second, with no reason**, to a caller presenting the
canonical `PLATFORM_INTERNAL_API_KEY`.

The same routes on the GCP `smartcity-api` production, read until 2026-09-18, answered a structured
`503` naming the vendor permission:

> Apparatus data exists in FirstDue but current API credentials do not have access (contact
> dashboards@firstarriving.com to request apparatus/assets API scope)

and `goto_not_authorized, needsAuth: true`.

**The discriminating test, which is what places the defect INSIDE the handler rather than at the auth
path, and which you must reproduce as a paired control:**

| caller | `firstdue/apparatus` | `goto/call-summary` | `mygov/permits` | `powerbi/cip-projects` |
|---|---|---|---|---|
| canonical bearer | `504` | `504` | `200` | `200` |
| one-character-mutated bearer | `401 platform_internal_required` | `401 platform_internal_required` | `401` | `401` |

A mutated bearer still returns the gate's own `401` on both routes while the canonical bearer returns
`504`, so the gate runs and the HANDLER is reached. Two other routes on the same host are healthy in
both directions, so the host is healthy generally. **This is a handler defect, not an auth defect and
not an edge defect.**

### Why it matters beyond these two feeds, and why it is still worth fixing

The dashboards' `fetchLiveJson` fails closed correctly here: it reports `basis: "platform HTTP 504"`
and never a fabricated value. So the customer-visible effect is a domain reading `unavailable` with a
reason that names nothing actionable. Both domains (`fire-apparatus`, `call-analytics`) were already
`unavailable` on GCP.

**So this is lost diagnosis, not a broken feed.** Say that plainly in your close rather than
inflating it, and do not fix it by inventing a reason: a synthesised "vendor unavailable" would be a
worse defect than the opaque 504, because it would be an unearned statement about a third party.

### The shape to fix

**A vendor call whose failure must arrive as the vendor's own structured status, not as an edge
timeout's HTML.** The GCP copy had this property and the DO copy lost it. Find what changed in the
migration and restore the property rather than special-casing these two vendors.

Two things to establish at source before you write:

1. **Why the response becomes a 504 at all.** A ~1 second 504 is not a Cloudflare origin timeout at its
   default budget, so the timing itself is evidence. Establish the mechanism rather than assuming it.
2. **Whether the error path is shared.** If one error-shaping helper serves many platform routes, the
   fix belongs there and the two routes are the symptom you happened to probe. Prefer the general fix.

### Acceptance, verbatim from the row

> Both routes return a JSON status carrying the vendor's own error and message, proven by violating
> the vendor credential and reading the body, on `walrus-app` and after its next deploy; the gate's
> `401` on a mutated bearer is retained as the paired control

### Proving it, and what you must not do

- **Prove it by violating it.** Present a credential the vendor will refuse and read the BODY, so the
  vendor's own error and message are shown arriving intact. A run observed only succeeding has not
  been observed working.
- Retain the `401` on a mutated bearer as the paired control. Without it, a 200-shaped answer proves
  only that some request was answered.
- **Do not rotate, re-issue or move any credential.** FirstDue's 403 and GoTo's uncompleted OAuth
  consent are vendor-onboarding work tracked outside this row, and `goto_not_authorized, needsAuth:
  true` is a CORRECT answer that must keep arriving as itself.
- Do not change the auth gate's behaviour, and do not make a vendor entitlement failure into a 500.
- Read the authoritative record, never a proxy: the revision that serves a request is on that
  request's log line, and the image a revision runs is its digest, not the tag requested.

### Boundaries

- Write only in `smartcity-os`. One PR, branched from `smartcity-os` `origin/main` with the SHA declared.
- Your done-condition is the DO app, not a merged PR. `walrus-app` builds from `main` since D-14
  (deployment `e243db0a`, `source_commit_hash` `1f0262f`), so a merge can reach the app, but
  deploy-on-push is disabled and a ship is a deliberate act with the commit read back.
- If you do not hold the deploy, name the exact clause that needs one rather than claiming it.
- Declare your snapshot in the instrument's own output.

### Evidence your close must carry

- The two routes' actual response bodies before and after, pasted, with status codes and the request
  header used.
- The mutated-bearer control output for both routes.
- The mechanism you established for the 504, and the second plausible mechanism you rejected, with why.
- Whether the error path is shared, and if so where you fixed it.
- Your scratch block (LESSON / DEAD-END / GROUND-TRUTH with a timestamp / OPEN), returned in the close.
