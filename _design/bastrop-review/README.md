# Bastrop design review — the compiled deliverable

**Not a design.** This folder holds no artboards. It compiles the populated screens from the
five design folders into one standalone file for the City of Bastrop to review.

**Outputs:** `SmartCity-design-review-Bastrop.html` (standalone, for attaching or printing)
and `artifact-body.html` (the same content shaped for publishing). Both gitignored and
regenerable; only `build.mjs` is tracked.
**Link:** https://claude.ai/artifact/5ofVnRw7ixRQ3jBcP1aK3Y
(private until shared. No export capability is declared, which is what lets the share dialog
offer a public link for recipients outside the organisation.)
**Rebuild:** `node build.mjs`
**Audience:** City of Bastrop staff. Written for them, not for us.

## What it includes

Populated states only. No empty, sparse, unlabelled or template artboards.

| Section | Screens |
|---|---|
| Overview | `smartcity-overview-lens/Main` |
| Development services | `smartcity-dev-services/Main`, `WorkOrders` |
| The map | `smartcity-map-dock/Main`, `Full` |
| Plan review | `plan-review/Main`, `Review` |
| Hotel occupancy filings | `smartcity-finance-filings/Main`, `Exceptions`, `Lodging` |

Screens are extracted from the generated `.dc.html` at build time and scaled to 70 percent.
Nothing is hand-copied, so re-running any design's `gen.mjs` and then `build.mjs` picks the
change up. The document's own copy is the only thing authored here.

## Sample data

Every figure in the document is sample data and the document says so prominently, at the top,
before any screen. The hotel occupancy figures in particular are entirely invented: that
connection is not built and no real filing has ever been read.

## The two things this build translates, and why it is not cosmetic

`_design/plan-review/gen.mjs` renders engine vocabulary and one internal annotation onto
screens a customer reads:

- `atom IBC-2018/1001.1` and `atom bastrop_tx-bdc-2026-adopted/14-02-003` in the review console,
  where the reader expects a code citation.
- `atom-chain resolved · bodyVerbatim=false`, which is entirely internal.
- `icc-demo is the QA tenant, not a city pack`, a note to ourselves sitting beside the
  Start a review button on the queue.

`RELABEL` in `build.mjs` translates them so this document is safe to send. **They should be
fixed in `plan-review/gen.mjs`** so the next person who shows those screens does not have to
know this file exists. Until then the translation lives here and is declared.

This is the same class of defect the Overview lens already fixed once, when the atom-type
Sources panel was replaced because it leaked engine vocabulary to a city manager.

## The guard

`BANNED` in `build.mjs` refuses to write the document if any internal term survives
composition. Verified in both directions 2026-09-15: disabling one `RELABEL` entry makes the
build throw, and the clean build writes. A leak reaching a customer is the one thing this
document has to get right, so it fails rather than ships.
