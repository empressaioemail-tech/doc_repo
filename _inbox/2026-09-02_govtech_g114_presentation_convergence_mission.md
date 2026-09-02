## Mission: presentation convergence (WDLL item 14)

Plan row G-114 (OPS-17, added 2026-09-02 A-099). Grounded in a real,
confirmed defect, not the WDLL's abstract framing — read the finding below
before designing a fix.

### Context verified 2026-09-02, trust this over any assumption about how mounts work

- `smartcity-dashboards/src/mounts.mjs`: `planReviewEmbedUrl(envMap)` and
  `smartFilesEmbedUrl(envMap)` both return a **static origin URL** built
  from env vars (`PLAN_REVIEW_EMBED_ORIGIN`, `SMART_FILES_EMBED_ORIGIN`)
  plus an `embed=1` query param. Neither function takes or threads through
  a `cityKey`. `compose.mjs` calls both with just `env`, no city argument:
  ```
  planReview: { contract: "embed", url: planReviewEmbedUrl(env) },
  smartFiles: { contract: "embed", url: smartFilesEmbedUrl(env) },
  ```
- This means every city's Dashboards compose response embeds the exact
  same Plan Review and Smart Files URL, regardless of which city's data is
  being viewed. Today, with `template-city` as the only real tenant, this
  is invisible. It becomes a real scope trap the moment a second city
  (Bastrop or otherwise) is onboarded — there's no signal in the embed URL
  itself for the embedded app to know which city's data to show.
- Read `plan-review`'s and `smart-files`'s own persona/tenant resolution
  before assuming the fix is "just add `?cityKey=` to the URL" — confirm
  whether either downstream app already has a way to consume a city
  parameter from its own URL (plan-review's `orgId`/`userId` persona system
  is a candidate; check whether it can be driven by a URL param today, or
  whether that's new work on the OTHER side of this seam too).
- `G-13`'s consumer-contract ruling (`_decisions/2026-08-17_g13_consumer_contract.md`)
  already establishes iframe embed as an accepted pattern — this row is not
  about removing iframes, it's about making the embed genuinely
  city-scoped instead of silently static.

### Scope

1. Thread the actual composing request's `cityKey` through
   `planReviewEmbedUrl()` and `smartFilesEmbedUrl()` (as a query param, or
   whatever shape the downstream apps can actually consume — confirm with
   step 2 before committing to a shape) so the embed URL is genuinely
   scoped to the city being viewed, not a static origin.
2. Confirm (read source, don't assume) whether `plan-review` and
   `smart-files` can resolve a caller's tenant/city from a URL parameter
   today. If not, that's a small addition on their side too — both are
   `govtech` repos, in scope for this same dispatch.
3. Verify each product still deploys and runs standalone: `plan-review`
   and `smart-files` must serve their own core flows without requiring the
   Dashboards origin, per R-F and G-13.

### Acceptance

1. Live probe: Dashboards' compose response for `template-city` embeds a
   URL that carries `template-city`'s own identity, not a bare static
   origin — verified on the deployed service, not the diff.
2. Live probe: `$PLAN_REVIEW_URL` and `$SMART_FILES_URL` each serve their
   core flows directly, with no Dashboards origin in the request path.
3. Close names the three independent SKUs this row keeps sellable
   separately: `SCOS-PLAN-DEP`, `SCOS-FILE-DEP`, `SCOS-DASH-DEP` — state
   explicitly that none of them now requires another to function.

### Out of scope

Do not attempt a second city's actual onboarding (Bastrop cutover) —
this row proves the mechanism works for more than one city, it doesn't
onboard one. Do not touch the ICC ledger work (already closed). Do not
attempt G-113 (seam vocabulary) — separate dispatch, can run in parallel
with this one since they touch different files. Live Bastrop is absolute
no-touch.
