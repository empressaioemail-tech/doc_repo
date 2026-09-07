---
id: 2026-09-07_records-worker_fabricated-zero-guard-fails-open_finding
title: The fabricated-zero guard fails open in three ways, and nothing counts it
date: 2026-09-07
status: open, unruled
plan_row: P-120 (OPS-16), item 17b-gate
owner: planner (doc_repo, integration seat). Found while VERIFYING R-02's close, not by R-02, and not by the lane that wrote the guard.
snapshot: legacy-design-tools origin/main, read 2026-09-07. Files and lines cited below were read from that ref via `git show`, not from a working tree. No live probe was run for this finding; the two probe results quoted are R-02's, re-read from their filed close.
related:
  - _inbox/2026-09-07_r-02_close.json
  - _inbox/2026-09-07_reports_one_model_recut_WDLL.md
  - 61_enforcement_doctrine.md
---

# The fabricated-zero guard fails open in three ways

## Why this exists

P-120 item 17b-gate asked whether Hays carries the silent-fabricated-zero
defect class: the class that would report a real 1,706 record hit as empty.
R-02 traced the write path and established, correctly and verifiably, that
there is no county-specific code branch between the declared-count read and
the terminal-status decision. Hays and McLennan resolve to the same vendor
family, share one generic hint extractor, and reach the same finalize call
unconditionally.

I set that hypothesis and it was too narrow. The defect's suppression does
not depend on a code branch. It depends on the page.

## The guard

`artifacts/records-request-worker/src/recipes/searchPostProcess.ts`, in
`finalizeIndexSearchWithAcquisition`, on the `hits.length === 0` path:

    const totalResultsHint = await input.browser.extractTotalResultsHint?.();
    if (totalResultsHint != null && totalResultsHint > 0) {
      return { status: "needs-human",
               errorCode: "index-hit-extraction-unsupported", ... };
    }
    return { status: "complete", scopeSearched: scopeWithHits };

The intent is correct and the comment cites this doctrine by name: a genuine
zero and an unrecognised results grid are different states, so refuse rather
than report a fabricated zero.

`artifacts/records-request-worker/src/playwrightBrowser.ts:91-101` is the
whole of what that refusal rests on:

    const text = await page.evaluate(() => document.body?.innerText ?? "");
    const match = text.match(/([\d,]+)\s+Total\s+Results/i);
    if (!match) return null;
    ...
    } catch { return null; }

## Three fail-open paths

Every one lands on `status: "complete"` with zero records, which is the
fabricated zero the guard exists to prevent.

1. **Different wording.** The guard fires only when the page body literally
   contains "N Total Results". A vendor rendering "Showing 1-20 of 1,706",
   "1706 records found", or the count inside an iframe or shadow DOM outside
   `body.innerText` returns null and the guard is skipped.
2. **The extractor throws.** `catch { return null }` swallows any failure. A
   control that cannot run and silently passes is the defect; here what
   passes is "report zero records".
3. **The method is absent.** The call site uses optional chaining,
   `input.browser.extractTotalResultsHint?.()`. Any browser implementation
   lacking the method yields undefined, then null, and the guard is skipped.

The guard is a presence-shaped check against one hard-coded English string,
with a catch-all that defaults to the unsafe branch.

## What McLennan actually proved

Narrower than either R-02 or I first had it. McLennan proved the guard fires
and the shared decision refuses correctly WHEN THE VENDOR PAGE CARRIES THE
"N Total Results" STRING. We know McLennan's page carries it, because the
probe returned `portalDeclaredResultCount: 1706` with `indexHits: []` and
terminal `needs-human/index-hit-extraction-unsupported`.

We do not know Hays's page carries it, because the probe never reached that
step: it terminated at `needs-human/captcha-required`. Same vendor family
and the same Tyler self-service DOCSEARCH product make it likely. Likely is
not measured, and this gate exists precisely because an unmeasured county
was once reported as clean.

## Ruling withdrawn

I recommended to R-02 and was about to recommend to the operator that
17b-gate close as "defect class verified on the shared extraction path via
McLennan, Hays access tracked separately". **That recommendation is
withdrawn.** It rested on the code-path argument alone, which is necessary
and not sufficient, and it would have closed a correctness gate on the
strength of a check that fails open.

## The finding that matters more than Hays

Hays is one instance of a class, and the class is the control, not the
county. Every county whose portal wording differs from "N Total Results" is
exposed right now, on every job, and the exposure is invisible from the
outside because the failure produces a clean `complete` with a zero count.

**Nothing counts it.** A `complete` result carrying zero hits and a null
hint is indistinguishable, in anything downstream, from a genuine zero. So
the exposure is not merely unfixed, it is unobserved. That is the sentence
this finding exists to deliver.

## What a fix has to answer

Not proposed here, because changing refusal behaviour changes it for every
county on every job and that is an operator scope decision.

1. What executes it. The guard already runs on every zero-hit path, so a fix
   is a change to that guard, not a new mechanism needing a trigger.
2. What triggers it. Every index search returning zero rows.
3. What fails when violated. Today, nothing: it returns `complete`. Any real
   fix has to make the unmeasured case fail or record, not pass.
4. What bypasses it. All three paths above, plus any recipe that reaches a
   terminal status without routing through
   `finalizeIndexSearchWithAcquisition`.

The shape that would satisfy the doctrine is a second independently derived
signal for "the portal believes there are results", so that no single page
read can satisfy both sides, or making a null hint on a zero-hit result
refuse rather than complete. The second is cheaper and strictly safer, and
it will convert some genuine zeros into needs-human until a real signal
exists. That trade is the operator's call.

## Counting the exposure first

Before any fix, the cheap question is how large this already is: how many
stored jobs carry a terminal `complete` with zero hits and no
`portalDeclaredResultCount`. That is a read against existing job rows, it
needs no portal access and no live probe, and it converts this from a code
reading into a measured population. Counting first was right on the
dispatch-override log and it is right here.
