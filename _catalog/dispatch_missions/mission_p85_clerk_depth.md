# Mission — clerk depth, because the loop has never run against a real document

## Why this card exists

P-85 Records Request is a per-request clerk-document path, largely built and live.
The bulk-acquisition fork (Local Government Code 191.008 agreements, PIA extracts)
was RETIRED 2026-08-31 as mis-scoped per OPS-16 amendment A-060. Cost is per
transaction and customer-initiated, so the cost-per-jurisdiction commitment is not
engaged. Do not reopen it and do not price a county extract.

What remains is small and engineering-shaped. The 2026-08-28 close named three
items in its own `leave_behind`: rebuild the worker from main now that #531 is in,
read the live Aumentum grid header DOM instead of guessing selectors, and capture
one document so the three-state classify probe becomes reachable.

**Two of those three have moved since that close was written, and the close does not
know it.** The close was filed at 2026-08-28T19:20Z. Five worker commits landed on
`origin/main` after it, four of them attacking exactly the header bind the close
left open. The serving worker has also moved four revisions past the digest the
close recorded. A fresh agent reading only the close will rebuild work that already
exists and will measure a revision that is not serving.

The one thing that has genuinely never happened is the third item. **No captured
document has ever existed.** Job `08023fab` failed at header bind with zero
artifacts. The pre-fix complete job `cbc08afe` projected 21 index hits and produced
zero artifacts. Vision read, classify, clause extraction, corridor geometry and the
GET wire's `classifyStatus` have therefore never run on a real artifact. That whole
layer's state is UNKNOWN, not working. A green unit suite is not evidence about it.

## What already exists — build into it, do not rebuild

Snapshot for every claim below: `legacy-design-tools` `origin/main` at `7fbcf56d`,
read 2026-08-31. Registered worktree `P:/seat-worktrees/property/legacy-design-tools`
(registered branch `seat/property`, currently checked out on `feat/p85-purchase-bind`
with untracked `lib/db/scripts/p85-*.mjs` helpers). **That worktree is behind main
and the files you need to read are not in it.** Read `origin/main` blobs, or move the
worktree, before you form any opinion about the extract code.

**The worker.** `artifacts/records-request-worker/`, a Playwright Cloud Run service.
Entry `src/worker.ts` and `src/run.ts`; job contract in `README.md`. It reads
`records_request_jobs` and transitions `queued → running → complete|failed|needs-human`.

**#531 is on main.** Merge commit `3cbbfbb49d3c7766f88a3e20752617a30fa8b31e`, merged
2026-08-28T20:59:12Z, confirmed an ancestor of `origin/main`. It replaced the
`page.content().includes("pay")` scan (which matched a Pay Taxes nav link and sent
every hit to the purchase branch) with a document-surface inspect. Do not re-derive it.

**Four more worker commits landed after #531, all post-close:**

| commit | authored | what it did |
|---|---|---|
| `6a5a8e79` | 08-28 20:56Z | drop clerk chrome rows so Infragistics headers can bind |
| `c8164488` | 08-28 21:28Z | dump null-header rows; ignore date-only chrome |
| `14ac924e` | 08-28 21:35Z | walk ancestors for Instrument # when the data table has no th |
| `5becba6d` | 08-28 22:05Z | refuse a Bastrop owner search that never leaves SearchEntry |
| `36289b37` | 08-31 14:36Z | BLOCK regex in `searchQueryPlan.ts` (also api-server) |

**The header work the close asks for is already written.** On `origin/main`,
`src/extractResultRowsSource.ts` now carries a `WRAPPER_CELL_LIMIT` of 40 and a
`looksLikeIndexData` predicate (lines 48-53), a `publishedIndexHeaders` gate that
only accepts a header list containing `instrument` or `document type` (66-74), a
twelve-level ancestor-plus-previous-sibling walk (87-97), and a row filter that
counts only direct-child cells (116-136). Its header comment names the live Bastrop
Infragistics page by date. **It has never been observed against the live grid.**

**Serving state, read by field name 2026-08-31.** `gcloud run services describe
records-request-worker --region=us-central1 --project=legacy-design-tools-prod`,
`status.traffic[]`:

    revisionName: records-request-worker-00017-ksk
    percent: 100
    image digest: sha256:92e6e4afcdcb713b8472f26afd9d5563daf549f1f8c9bdaecb4b1984e5d7ef5e

That digest carries Artifact Registry tag `p85-v17`, image created
2026-08-28T22:25:44Z. **It is not the `00013-qwc` / `sha256:6328f5b5…` / `p85-v13`
the close recorded.** Four revisions have shipped since.

What that creation time proves and does not prove: it is twenty minutes after
`5becba6d` and three days before `36289b37`, so the serving image **certainly lacks
the BLOCK fix** and **probably carries the header fixes**. Probably is not a
measurement. A build time bounds a commit; it does not name one. Cloud Build history
for this project records source uploads with no commit SHA, so provenance is not
recoverable from the build record. Settle it with a marker (work item 1), not with
arithmetic on timestamps.

**No CI deploy path exists for this service.** `.github/workflows/cloud-run-deploy.yml`
deploys `cortex-api` only; it touches the worker solely by setting
`RECORDS_REQUEST_WORKER_URL`. The worker is built from
`artifacts/records-request-worker/cloudbuild.yaml`, whose image tag is a hardcoded
literal, currently `p85-v12`, five tags behind what is serving. It also pushes
`:latest`. Bump the literal, and deploy by digest, never by `:latest`.

**The refuse path.** `src/recipes/indexHits.ts`. The constant
`UNRESOLVED_RESULT_ROW_HEADER` is line 18. Two sites raise it: `normalizeIndexHit`
throws `IndexHitHeaderRefuseError` when a row has no headers (lines 167-171), and
`extractIndexHitsFromPage` refuses the entire page when **any** row has null or
empty headers (lines 204-211). That all-or-nothing predicate is why fourteen chrome
rows killed twenty-one good instrument rows.

**The acquisition path.** `src/recipes/instrumentAcquisition.ts`. Per hit: no
`detailUrl` or a failed nav goes to `pendingHuman` (52-62); `inspectDocumentPurchase`
plus `documentRequiresPurchase` decide the branch (64-75); the free branch calls
`browser.captureFullPage` and `insertRecordsRequestArtifact` with
`acquisitionMethod: "capture"` (77-105). `PURCHASE_THRESHOLD_CENTS` is 5,000 and the
per-page cost is a hardcoded 350-cent placeholder (line 73), not a parsed portal price.

**The classifier.** `artifacts/api-server/src/lib/recordsRequestClassifyWrite.ts`.
The wire projection is `recordsRequestDocumentServe.ts`.

**Live jobs exist to work with.** `_inbox/2026-08-31_p85_block_job_audit.md` measured
36 issued jobs in `records_request_jobs` on cortex-prod (`fancy-fire-06136146`,
database `neondb`, branch `br-crimson-feather-aphfmy91`), of which fourteen on three
Bastrop parcels were planned without a BLOCK term they should have carried. That
card's `leave_behind` owes a re-run of those fourteen. One of them is your live run.

## The three classify states, and the two things they are not

`ArtifactClassifyStatus` at `recordsRequestClassifyWrite.ts:37` is
**`written` | `refused` | `skipped`**. The wire type
`ArtifactClassifyStatusWire` at `recordsRequestDocumentServe.ts:61` is those three
plus `null`.

`written` is produced only by a successful `recordedInstruments` insert.
`refused` is produced only by a caught `RecordsRequestClassifyRefuseError`.
`skipped` is produced only by `artifactAlreadyClassified` finding a prior instrument
for the same artifact id, and it carries `refuseCode: "already_classified"`.

**`null` is not a fourth state.** It means classify never ran, or ran and wrote
nothing onto `metadata.classify`. Never report `null` as a state and never let it
enter a count of the three.

**These are not the parcel three-state promise.** OPS-16 A-030 promises `populated`,
`absent-verified` with scope, or `lookup-failed` per parcel. That is a different
vocabulary at a different altitude. Conflating them will produce a report that reads
correct and answers a question nobody asked.

## Classify is DORMANT, and that is a separate defect from the missing document

`processRecordsRequestJobClassification` is reachable from exactly two routes, both
`requireServiceToken`: `propertyExplorer.ts:1213` (`internal/records-request/vision-read`)
and `propertyExplorer.ts:1240` (`internal/records-request/classify`). Grepping the
whole tree for both path strings returns the route definitions and their tests, and
nothing else. **Nothing in production code POSTs to either.** The worker does not.
Job completion does not.

So "capture one document" is necessary and not sufficient. A captured artifact will
sit with `metadata.classify` absent and `classifyStatus: null` on the wire forever
unless something calls. Report this as a dormant mechanism, and do not report the
classify layer as working on the strength of a manual curl unless you also say a
manual curl is its only trigger.

## The free-document answer, stated plainly

**A free path exists in code.** When `documentRequiresPurchase` returns false, the
worker screenshots and writes an artifact. No approval, no cost, no human.

**It is a screenshot, not a document.** `captureFullPage` in `playwrightBrowser.ts:67-84`
is `page.screenshot({ fullPage: true, type: "png" })`, hashed and stored as base64 in
`metadata.capturePngBase64`. There is no PDF download, no file save, and no
document-bytes path anywhere in the worker. Whatever the browser renders on the
detail page is what becomes the "document". Say "captured page image", never
"downloaded the instrument".

**Nothing checks that the captured page contains an instrument image.** The only
guard is `capture.ok && capture.sha256`. A detail page that shows metadata and a
"purchase to view" placeholder, without a cart control the inspect recognises, will
capture cleanly and enter classify as a document. That is how a non-document
artifact becomes a `written` instrument. Close it or declare it; do not leave it silent.

**Which county is free.** Per measurement X3 (`_inbox/2026-08-30_p91_measurement_x3_clerk_index.md`),
Travis is the only one of the six whose county publishes that online copies are free:
"Copies of online documents printed using your computer are free. These copies will
bear an 'unofficial copy' watermark." Bastrop's online image cost is recorded UNFOUND
in X3, and the portal seed declares Bastrop `"portal per-page purchase"` with
`"login required"` (`scripts/p85/p85-clerk-portals.mjs`). **The shortest path to one
free capture is `travis-tccsearch` (48453), not Bastrop.** Bastrop is where the header
work was done; Travis is where a free document plausibly exists. Those are two
different counties and this card needs both.

## Legal posture — the measured answer, and the part that is a ruling

Report this as written. Do not soften it and do not extend it.

**What the code does.** The worker presents a desktop Chrome user agent
(`playwrightBrowser.ts:147-148`) with matching `sec-ch-ua` client hints whose own
comment says they are there "for WAF-sensitive portals (e.g. Travis tccsearch)"
(lines 150-158). It does not identify as a bot. The string `robots` appears **zero
times** anywhere in the `legacy-design-tools` tree outside `node_modules`. The worker
never fetches, parses, or honours `robots.txt`. There is no crawl delay, no throttle
and no rate limiter in the worker.

**What gates it.** One control: `assertCountyPortalsAllowAutomatedSearch` in
`artifacts/api-server/src/lib/clerkPortalSearchGate.ts`, called from
`recordsRequestService.ts:84`, which refuses with `PORTAL_TERMS_MISSING`,
`PORTAL_TERMS_UNKNOWN`, `PORTAL_AUTOMATED_SEARCH_PROHIBITED` or
`PORTAL_CANARY_LOOKUP_FAILED`. It reads one column, `clerk_portal_terms.automated_search`.

**That column is hand-declared.** `scripts/p85/apply-operator-portal-rulings.mjs`
writes `'permitted'` for all six seeded portals in one loop under one note: "Operator
go 2026-08-26: all six counties permitted for automated index search (P-85 item 1)."
The same script writes `terms_text` as the literal string
`[P-85 placeholder terms text; run scripts/p85/fetch-clerk-portal-terms.mjs for
verbatim clerk terms]` unless the fetch script was run separately. The gate is
presence-shaped on a flag set by a blanket ruling. It is not derived from any
portal's published terms, and it has never read a `robots.txt`.

**Human-initiated per request is TRUE at the enqueue seam.**
`POST /property-explorer/v1/records-request` (`propertyExplorer.ts:1339`) sits behind
`requirePeAuthenticated`, resolves one signed-in user and one parcel, and creates one
job. **Retrieval is then fully automated:** up to three form-submitted queries per job
plus up to `MAX_INSTRUMENTS_PER_RUN = 25` detail-page navigations, headless, with no
pause between them.

**Citizen-portal path is TRUE in the narrow sense.** The recipes drive the same free
public web UI a citizen uses, accept the disclaimer, refuse to a `needs-human`
`login-required` result when a login wall appears (`aumentumIndexSearch.ts:210-230`),
and never cross a paywall.

**The conflict, stated.** Measurement X3, dated 2026-08-30, read `robots.txt` at all
three portals it could: Bastrop `User-agent: * / Disallow: /`; Travis a Cloudflare
content-signal block with `Content-Signal: search=yes,ai-train=no,use=reference`,
explicit `Disallow: /` for named agents including ClaudeBot and GPTBot, then a catch-all
`Disallow: /`; Williamson's GovOS host `Allow: /$` with `Disallow: /`. X3 also found
that no county page and no vendor page in scope carries a human-readable
anti-scraping clause. So the only machine-readable access statement any of them
publishes disallows what this worker does, and the worker does not read it.

**The blanket permitted ruling is dated 2026-08-26. The measurement is dated
2026-08-30. The ruling predates the evidence and was not re-taken against it.**

Whether the operation accepts that posture is an operator ruling, not a measurement,
and it is **NOT TAKEN**. Route it; do not decide it on this card, do not argue it in
either direction, and do not let the absence of a ruling stop the engineering items
below, which run on Travis and Bastrop under the existing 2026-08-26 permission.
If you produce any external-facing statement about how this product accesses clerk
portals, it carries the X3 finding, or it is not honest.

## Two divergences to report, not to fix here

**Williamson's default portal points at the wrong index.** `P85_DEFAULT_PORTAL_BY_COUNTY`
maps `48491` to `williamson-publicsearch`. X3 established that
`williamson.tx.publicsearch.us` is Williamson's **Commissioners Court minute books**,
not the deed and lien index, which sits in the Tyler land system from January 1984
forward. The `williamson-tylerhost` alternative returns HTTP 403 and is unresolved.
Say which is true after reading the code and X3 together. Do not re-point the default
on this card.

**Deploying cortex-api resets a limit.** `.github/workflows/cloud-run-deploy.yml:236`
hardcodes `CORTEX_USER_DAILY_API_LIMIT=50000` in `--set-env-vars`. The 2026-08-28
close recorded a deliberate revert to `10000`. Any cortex-api deploy through that
workflow restores 50000 silently. If this card deploys cortex-api, read the serving
value back by field name afterwards and say what it is.

## What to build, in dependency order

1. **Establish what the serving worker is actually running, by marker.** Before
   changing anything, put a version marker the running service can be asked for, or
   otherwise bind digest `sha256:92e6e4af…` to a commit by evidence rather than by
   build time. Report the commit. If you cannot establish it, say UNMEASURED and
   proceed to item 2, which makes the question moot by replacing the image. Do not
   report "the header fixes are deployed" without this.

2. **Rebuild the worker from `origin/main` and deploy by digest.** Bump the literal
   tag in `cloudbuild.yaml` past `p85-v17`. Build, then deploy the **digest**, never
   `:latest` and never the tag. Then read `status.traffic[]` by field name and
   confirm the digest you built is the one at 100 percent. A new revision name is not
   a new digest and a ready revision is not a serving revision.

3. **Prove the header bind on the live Bastrop grid.** The extract change is already
   written; this item is measurement, not construction. Run a real job against
   `48021:35481` (owner `PALMS PROPERTIES LLC`, the parcel the 08-28 dump was taken
   from) and read the result. Expected: 21 headed rows, first row instrument
   `202008880`. If the extract still refuses, **read the live DOM again and dump it**
   the way `_inbox/2026-08-28_p85_aumentum_live_grid_dump.md` did. Do not add another
   selector by inference.

4. **Keep a violation fixture of that page.** Login chrome plus wrapper `Table1` plus
   the 21-row Infragistics table. The pre-`6a5a8e79` extract must fail it and the
   current extract must pass it. A fixture only ever observed passing has not been
   observed working.

5. **Capture ONE free document, end to end, on Travis.** `travis-tccsearch`, county
   48453, a parcel with a resolvable owner name. The target is a single row in
   `records_request_artifacts` with `acquisitionMethod: "capture"` and a
   `capturePngBase64` that is genuinely the instrument image. **Open the PNG and look
   at it.** If it is a detail page or a purchase placeholder rather than a document,
   that is the finding, and it is a more important finding than a captured row.

6. **Make the classify probe reachable and say what made it reachable.** With one real
   artifact in hand, drive `POST /property-explorer/v1/internal/records-request/vision-read`
   (or `/classify` if vision text is already present) with the service token, then GET
   the job and read `artifacts[]` off the wire. Report the `classifyStatus` value you
   observe and which of the three it is. Then report, in the same breath, that nothing
   in production calls that route.

7. **Report the purchase path honestly and leave it alone.** `purchaseApproved: true`
   pushes the hit to `pendingHuman` and continues; it never checks out
   (`instrumentAcquisition.ts:67-71`, and `PURCHASE_APPROVED_ROUTES_TO_HUMAN` in
   `documentPurchase.ts:34`). The 350-cent per-page figure is a placeholder, not a
   parsed price, so `projectedPurchaseCostCents` is a fabricated number wearing a
   currency unit. Say so. Do not build checkout on this card.

## The falsifier, stated before you run anything

Two independent derivations of the same quantity, which no sentinel can satisfy:

**Falsifier A, the grid.** The 08-28 dump recorded, by reading the live page,
21 result rows and a first-row instrument number of `202008880` for a Grantor
begins-with search on `PALMS PROPERTIES LLC`. A live run of the current extract
against that same query must return **21** headed hits whose first `recordingRef` is
**`202008880`**. Any other count is a failure, including a larger one. 39 rows means
chrome is back. 25 means `MAX_INSTRUMENTS_PER_RUN` truncated silently and the cap
must be declared in the output. Zero with `status: complete` is the worst outcome and
must never be reported as a clean run.

**What would prove this check wrong rather than the code wrong:** if the live grid
now returns a different record count for that grantor because the county recorded new
instruments since 08-28. Check the "Showing Records 1 through N" line on the page
before scoring, and if N is not 21, say so and score against N.

**Falsifier B, the document.** A captured artifact is real only if all three hold:
a row exists in `records_request_artifacts` with `acquisitionMethod: "capture"`; its
`contentSha256` matches a re-hash of the stored bytes; and a human looked at the PNG
and it shows an instrument. If the first two pass and the third fails, the write path
is producing plausible non-documents and that is the finding.

**Pre-register this too.** If work items 2 and 3 both succeed on the first attempt,
that is the convenient result, and a convenient result is a reason to distrust the
instrument. Say what you did to try to break it.

## Do not

- Do not describe the purchase path as automated. `purchaseApproved` queues a human.
  It does not buy. No sentence in any output may imply otherwise.
- Do not guess a DOM selector. Read the live grid and dump it. Every selector on this
  surface that was inferred rather than read has cost a deploy cycle.
- Do not treat a missing store as a zero. If `DATABASE_URL` is unset or the store is
  unreachable, the answer is UNMEASURED and it goes in the output as UNMEASURED.
- Do not run any check before stating what result would prove it wrong.
- Do not degrade silently. A truncated set, a capped result count, a skipped county,
  a placeholder price: declare it in the output or do not ship it. Degradation is
  permitted only when declared.
- Do not reopen bulk acquisition. No 191.008 conversation, no PIA extract pricing,
  no counterparty. A-060 retired it.
- Do not decide the robots.txt posture. Report it and route it.
- Do not re-run the fourteen BLOCK-defect jobs as a batch. Use one, deliberately.
- Do not re-point Williamson's default portal, and do not spend this card on the
  Tyler 403.
- Do not read the worktree's `artifacts/records-request-worker` and believe it. It is
  on `feat/p85-purchase-bind` and predates four of the five commits that matter.
- Do not build checkout, an email provider, or a Stripe tier on this card.
- Do not touch any repository other than the registered property worktree you open.
  Smart Site changes belong to `hauska-map`, not here.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot (repository, branch, commit, and for anything live the serving revision and
image digest read by field name) in your first output. State the falsifier for each
check before running it. `leave_behind` named, `none` is valid and cheap. Subagents do
not commit. Verification does not delegate below the lane planner.
