---
id: 2026-08-18_g88_shell_css_cache
title: G-88 investigation — the shell.css cache premise is false, measured
status: active
last_updated: 2026-08-18
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _inbox/2026-08-18_g88_surface_inventory,
    _inbox/2026-08-18_g88_translation_boundary,
  ]
---

# G-88 investigation: the shell.css cache defect is real and its stated consequence is not

Read-only investigation, fanned at G-88 scoping (A-070). The claim under test, carried since amendment A-061 and restated in the G-88 order of work: `/shell.css` ships with no `cache-control` and no fingerprint, so a returning browser holds a stale stylesheet across every CSS deploy, and therefore every design change landed is invisible to a returning operator until it is fixed.

## The premise is false, and it was measured rather than reasoned

A real Chrome with a persistent profile, driven over CDP against the live Cloud Run service, was tested in three scenarios: cold profile, full browser restart on the same profile, and an in-session deploy with the tab already open. **In all three the browser fetched fresh CSS and rendered the new value.** A detectable marker was appended to `shell.css` between visits and the returning browser picked it up every time.

The mechanism is the reason, and it is worth keeping because it is counter-intuitive. RFC 9111 heuristic freshness is computed from `Last-Modified`. The service sends no `Last-Modified`, no `ETag` and no explicit freshness directive, so Chrome has no basis on which to assign any heuristic freshness at all and revalidates. With no validator to revalidate against, that revalidation degrades to a full unconditional GET. The absence of caching headers does not produce staleness here; it produces the opposite, permanently and expensively.

**The defect is real but inverted.** There is no caching at all and a `304` is structurally impossible, so every navigation re-transfers roughly 145 KB: `index.html` 75,687, `app.js` 33,214, `shell.css` 27,269, `sc-kit.css` 4,709, `staff-review.mjs` 3,668. Zero reuse, forever.

## Consequence for the plan

**G-88 step 3 is not a blocker on the design pass and should not be sequenced as one.** Whatever design work lands is visible to a returning operator immediately. The fix is still worth shipping, but it is a performance and correctness card, not a prerequisite, and the "or you will debug ghosts" rationale does not hold on the operator's actual path.

## Why it cannot 304

One hand-rolled helper serves every static asset, `src/server.mjs` lines 41-51. `res.writeHead(200, ...)` is unconditional and the function never receives `req`, so it structurally cannot read `If-None-Match` or `If-Modified-Since`. Four conditional forms were probed against the live service, including `If-None-Match: *`, which is the strongest possible conditional; every one returned a full `200`.

The codebase already knows how to do this. The JSON helper three lines above sets `cache-control: no-store`. `sendFile` was simply never given the same treatment.

Six routes are affected identically, so `shell.css` is not special: `/` and `/index.html`, `/app.js`, `/sc-kit.css`, `/shell.css`, `/staff-map.mjs`, `/staff-review.mjs`. All are exact-match string comparisons with no user input reaching the path, so there is no traversal exposure. Worth a separate ruling: the last two are served out of `src/`, not `web/`, so two source modules double as browser assets.

## The recommended fix

`cache-control: no-cache` plus a strong content-hash `ETag`. `no-cache` means store it but always revalidate, which is exactly the wanted contract: never stale by construction, near-zero cost when unchanged. Roughly twelve lines in `sendFile`, threading `req` through six call sites, hashing with built-in `node:crypto`. No build step, no filename changes, no HTML rewriting, no new dependency. All thirteen existing `src/server.test.mjs` tests pass unmodified against the patched copy.

Fingerprinting with a build step is rejected: it buys about one round trip per asset over the above, costs a build step in a repo whose entire character is not having one, and does not remove the need for the header work anyway, because `index.html` is the entry document and can never be fingerprinted. A query-string `?v=` param is rejected as actively worse: it needs a human to hand-edit `index.html` on every CSS change, and it is circular, since the `?v=` lives inside the document any stale cache would be holding.

Do not reuse the JSON helper's `no-store`. That forbids storage entirely and throws away the `304` benefit, leaving the 145 KB problem exactly where it is.

A regression assertion belongs with it, in the existing `serves /sc-kit.css as text/css` case, or this silently regresses the next time someone touches `sendFile`.

## The probe, and the leg of it that can fail

Three HTTP legs. First, the asset advertises `cache-control: no-cache` and an `ETag`. Second, a conditional GET with that ETag returns `304` with no body. **Third, a conditional GET with a STALE ETag must return `200` with a full body and a different ETag.**

The third leg is what makes this a probe rather than a rubber stamp. A hardcoded or constant `ETag` is the obvious way to implement this wrong, it would cause permanent staleness, and it sails through the first two legs and fails only on the third.

Before-state, measured: leg 1 fails outright, leg 2 cannot even be constructed because the ETag comes back empty, and the strongest conditional returns `200`.

After-fix, measured on a returning browser with a full restart and a deploy in the middle: visit 1 cold transfers 68,860 bytes; visit 2 returning with no deploy transfers 1,200 bytes, all four assets `304`; visit 3 returning after a CSS deploy renders the new marker and re-downloads only the file that changed, still `304`ing the other three. That discriminates, which is the point: a constant ETag would show the old marker at visit 3.

## Honest limits on the measurement

Chrome and Chromium only. Edge shares the engine; Firefox and Safari were not measured, and Safari has historically been the most aggressive with validator-less responses. No corporate or intermediary proxy was in the path, and a city IT proxy applying a default TTL to a validator-less `200` could serve stale. That risk is real and unquantified. So staleness is not impossible in every context; it is simply not what happens on the operator's actual path, which is what the card asserted.

## The pattern worth keeping

Nobody measured a browser before queuing this at A-061. The inference that a missing `cache-control` means staleness is intuitive, general, and wrong in this specific configuration. It is the same shape as the `has_writer` hand-declared-versus-derived finding and the vacuous special-district verify: a property asserted from reasoning about how a system generally behaves, never checked against how this one actually does, and then carried forward as a fact through two closes.
