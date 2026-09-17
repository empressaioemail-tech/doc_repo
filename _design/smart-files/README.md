# Smart Files

**Artifact:** https://claude.ai/artifact/DcXLJ7uAJFdZ1eVMJVGas4
**Decision:** none yet, operator review owed
**Status:** RATIFIED 2026-09-17, `_decisions/2026-09-17_design_ratification_all_approved.md`. Not dispatched; implementation row to allocate.
**Source:** `smart-files` at `origin/main` `61c84f6`, read 2026-09-15: `README.md`,
`src/identity.mjs`, `src/extract.mjs`, `web/index.html`.

Five artboards: the room, search, one document, the two refusals, and what is not built.

## The dashboards nav item is a mount point, not this product

`smartcity-dashboards` says so on itself, at `web/index.html:1419-1445`:

> This view mounts the serving Smart Files host with its own product top bar suppressed. It
> does not copy the browser.

So designing "Files" in dashboards would be designing a frame. Smart Files is its own repo, its
own database and its own serving process, and that is what these artboards are drawn against.

## The thesis

**Smart Files is not a file browser, and its best properties are exactly the ones a browser has
nowhere to put.** It knows whether a document's text can be searched and *why not*, in three
named reasons. It knows that a second upload under the same slug is a **revision of one
document** rather than a sibling. It knows who captured a file, when, from what kind of source
and in what declared role, and it **refuses the write** when any of that is missing. It knows
what a document is **placed against**, not only which folder it sits in.

A browser shows name, size and date. The filing is the product.

## Coverage before results

The sharpest consequence, and the whole Search artboard: **a search box over a corpus where some
documents were never indexed is a box that lies by omission.** Three results can mean three
matches, or it can mean twenty-eight documents were never searched, and nothing in the category
can tell you which.

Smart Files can, because `search_text IS NULL` — never the empty string — is its one honest
not-indexed value, and the reason is named on the row. So the page states what it searched over
before it states anything else. In the drawn example, **six of the seven documents with no text
layer are plan sets**, which is exactly where a drainage easement would be drawn.

The three reasons are not the same thing and the design keeps them apart:

| Code | Means | Fix |
|---|---|---|
| `content-type-not-indexable` | a JSON meeting record was never eligible | nothing failed |
| `no-text-layer` | a scanned PDF | OCR nobody has built |
| `extraction-failed` | a corrupt PDF | something tried and broke |

Different owners, different fixes, different answers to *can we find it*. Collapsing them into
"no results" is the default everywhere else.

## Regenerate and check

    node gen.mjs
    node check.mjs

`check.mjs` self-tests in both directions, then enforces **closed vocabularies**. The product
declares exactly four scope types, four provenance source kinds, three not-indexed reasons and
five required provenance keys, all in code rather than in prose. A canvas showing a fifth source
kind or a fourth reason has invented a product capability.

`source-facts.json` is the second, independently derived input, read out of the code with
citations. The artboards are the first. The check asks whether they agree.

**One check was starved and the fix improved the design.** The not-indexed reason predicate had
zero inputs on every artboard: the canvas rendered the display forms ("no text layer") and never
the product's actual codes, so the predicate ran and did nothing. The fix was to render the real
codes, which is both more precise for an operator and what makes the check live. Verified by
violation afterwards: one altered code, exit 1.

## The two refusals

Both are better product than the thing they prevent, and neither is drawn today, so both read as
errors instead of as the guarantee they are.

**A read outside your scope** returns 403 for anonymous and wrong-tenant alike, and the service
is default-deny: an environment that has not configured its identities reads nothing, by design,
rather than keeping the old defect as a silent default. The refusal should name the scope held
and the scope required. A silent empty list is the alternative, and it teaches the caller that
nothing is there.

**An upload with incomplete provenance** returns 400. Four of five keys supplied means not
filed, because a provenance record with an invented field is worse than none. `sourceKind` is
additionally checked against a closed set, so a caller cannot invent a category either.

## Kept verbatim, because it did not need redesigning

The product already wrote the right line about itself, on the People and access view:

> Every grant, every link, every revoke, with a name and a time. This is the page a city
> attorney opens.

That is the correct posture for a government filing system. What it needed was the rest of the
product brought up to it.

## What is not built, and it is an artboard

Four capabilities landed in the service and have no surface, or have a surface that is chrome.
Named rather than drawn as working, because a design that shows a capability as finished is how
a capability stops being built. The distinction the artboard turns on is **owner**: three are
surfacing work in this repo, one is a caller in `smartcity-dashboards`, and one needs a ruling.

The `smartcity-dashboards` one is worth naming here because it is already visible to a customer:
the municode scraper still uploads meeting documents without saying which meeting, so they land
folder-only. The service has accepted `targetType` and `targetId` since the placement-target
change. Only the caller is missing.

## Pinned, deliberately not designed here

Bring files beyond its current state. The page is chrome against fixture data and says so; a
live Drive sync is a build, not a design.

The instrument scope. It is real and writable and it belongs to the trading side rather than to
a city, so drawing it beside Bastrop folders would make one product look like two.

Share link creation and revocation flows. The access rail and the People and access view already
state the right rule, and the flows are their own pass.
