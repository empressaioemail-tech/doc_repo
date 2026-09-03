---
id: 2026-09-02_p108_public_pages_WDLL
title: WDLL — P-108: the privacy retention gap and the missing documentation page
date: 2026-09-02
last_updated: 2026-09-02
status: open
applies_to: hauska-map (apps/property-explorer public pages and routing)
plan_row: P-108
owner: property seat
---

# P-108 public pages

Two gaps found while preparing the connector directory listing. Both matter whether or not that listing is ever filed, which is why they are their own row rather than a dependency of P-88.

## Gap 1: the privacy policy has no data-retention section

The product is about to take live money and its privacy policy does not say how long data is kept or what happens on deletion. Anthropic's directory documentation names the absence as an immediate rejection, but that is the symptom rather than the reason to fix it.

## Gap 2: there is no documentation page

Nine candidate routes all serve the SPA shell. `/privacy` and `/terms` serve real HTML, so the mechanism for a real static page is proven and already in use. The gap is that nothing describes what the product does to a professional evaluating it.

## Done looks like

A retention section exists and is true of the system as built rather than aspirational. A documentation page serves real HTML at a stable URL and describes the product without claiming anything the masters do not support.

## Acceptance items

1. **Retention is described as it actually is.** Read the stores before writing the words. Name what is kept, for how long, and what deletion does. Where a retention period is not enforced by anything, say the truth rather than a target. An unenforced retention promise is worse than no promise, and it is the same defect class as the terms page promising a cancellation path the product did not have. | check: every claim traced to a store, a job, or a code path | grade: [ ]

2. **The documentation page serves real HTML, not the SPA shell.** Use the same mechanism `/privacy` and `/terms` already use. | check: curl against the deployed host returns HTML rather than the shell | grade: [ ]

3. **Only claims the masters support.** `_smartsite_masters/` governs and wins any conflict. Two reports generate live, the X-ray and Flood and Drainage. The connector is a door available at every rung including Free. No comps and no sold prices, because Texas is a non-disclosure state and the MLS route is closed. Coverage per master 06, which speaks of it as nationwide and forbids enumerating counties. Anything not traceable to a master is routed for a ruling rather than written fresh. | check: per-sentence provenance | grade: [ ]

4. **Do not touch `terms.html`.** A-062 ships a check that reads it, and two writers on one file is how the two halves drifted apart in the first place. If the retention work needs a terms change, STOP and report rather than making it. | check: `git status` shows no change to terms.html | grade: [ ]

5. **Verify by violation, both directions.** Every check above shown failing on a deliberate violation and passing on restore. | check: the close carries both directions per item | grade: [ ]

## Explicitly not this card

Do not write directory-listing copy; that is P-88 and it is already prepared. Do not add carousel images. Do not change any pricing, tier or capability claim. Do not add a cookie banner or consent UI; that is a separate decision.

## Leave behind

Declared at close per the contract, `none` being a valid answer.
