# P-85 Records Request

## GROUND-TRUTH (2026-08-28T20:18Z)

- LDT #529 MERGED `5bd983ea`. Worker rebuilt FROM that main. Serving `records-request-worker-00013-qwc` @100% digest `sha256:6328f5b5` tag p85-v13. POST /run returns `{"error":"missing_job_id"}` HTTP 400.
- LDT #530 already baked `CORTEX_USER_DAILY_API_LIMIT=50000` into `--set-env-vars`. Serving cortex is still `00639-gez` until the next cortex deploy; traffic is PINNED.
- Purchase write-path: `pageIncludes`/`page.content().includes("pay")` is the 21/0 artifact blocker, not the header selector. #531 open.
- purchaseApproved does not checkout. WDLL item 6 amended.

## LESSON (2026-08-28T20:18Z)

- In-process harness cannot see what the real runtime injects. happy-dom `fn()` missed tsx `__name` in Chromium. Same class as Chromium-in-CI.

## GROUND-TRUTH (2026-08-28T20:50Z)

- Live Bastrop SearchResults for PALMS PROPERTIES LLC is Infragistics, not Telerik. 21 records. Data table has th in the first tbody row, data in the next 21. Classes `ig_ElectricBlueAlt igg_ElectricBlueAlt`. No `.RadGrid`, no `rgRow`.
- Worker extract on that live page: 39 rows, 14 with null headers. Those 14 are chrome (login, sort, logon). The 21 instrument rows have headers. `unresolved_result_row_header` is the chrome rows, not a missing Instrument # header.
- Dump: `_inbox/2026-08-28_p85_aumentum_live_grid_dump.md`.

## GROUND-TRUTH (2026-08-28T20:59Z)

- LDT #531 MERGED `3cbbfbb4`. Purchase bind is on main. Worker not rebuilt yet; waiting #533 so one image carries both.
- LDT #533 open: chrome-drop extract from the live Infragistics dump. Local worker tests 70/70.

## GROUND-TRUTH (2026-08-28T21:14Z)

- Worker serving `records-request-worker-00014-864` @100% (status.traffic[] by field name). Digest `sha256:7bb5e5b4`. Tag p85-v14. Built from worktree `6a5a8e79` (#531 + #533 rebase). POST /run `{}` → HTTP 400 `missing_job_id`.
- #531 MERGED `3cbbfbb4`. #533 still open (CI after rebase). Image already includes both.
- Enqueued `74b9f93d` for `48021:35481`.

## GROUND-TRUTH (2026-08-28T21:16Z)

- Live job `74b9f93d` on serving `00014-864` failed `unresolved_result_row_header`. 0 hits, 0 artifacts. Classify states still absent. The new image ran (revision logs at 21:15:40). Chrome-drop did not clear the live refuse.
- Suspected leak: date regex treats "as of 08/28/2026" chrome as index data. Not confirmed from a worker row dump. Do not guess another header selector.

## GROUND-TRUTH (2026-08-28T21:28Z)

- Owner page extract (same IIFE as serving): 21 headed, 0 null. Legal `BUILDING BLOCK 49 E W ST, ACRES 1.280`: 0 records found. Date-only chrome on that page is the later-query refuse that wiped owner hits.
- #534 open: instrument-shaped cells only; refuse dump; later header refuse does not wipe prior hits.

## GROUND-TRUTH (2026-08-28T21:41Z)

- Dump on `e79a5655` (v15): `nullHeaderRows=21/21` cells `1, View, , 202008880`. Real Infragistics rows. Playwright splits header/data; closest table has no th.
- v16 `00016-l7w` @100% digest `sha256:ec0ced91` ancestor walk. Job `370d191d` **complete**, not header-refused. Owner+legal resultCount 0. Owner capture 34KB vs legal 75KB; not the 21-row grid. Classify still absent.
- #534 open (dump + date-only drop + ancestor walk + later-query skip).

## GROUND-TRUTH (2026-08-28T22:05Z)

- Fill/wait card landed on LDT #534 `5becba6d` (rebased onto `fd750203`). Worker tests 79/79. `assertBastropSearchSettled` requires SearchResults.aspx plus a published records-found label. SearchEntry plus "Please enter search criteria" fails `search-fill-did-not-submit`. Playwright fill now string-evaluates `$find(id).set_value` and fails if readback does not match.
- #534 pushed `4aa64647...5becba6d`. CI after force-push not yet read. Do not enqueue until merge + v17 pin.

## GROUND-TRUTH (2026-08-28T22:32Z)

- LDT #534 MERGED `89e539f6`. Worker rebuilt FROM origin/main. Serving `records-request-worker-00017-ksk` @100% digest `sha256:92e6e4af`. Tag p85-v17. POST /run `{}` → HTTP 400 `missing_job_id`. Cortex traffic unread for this card beyond `00643-rib` @100% (not moved by this card).
- Live job `6eb07368` parcel `48021:35481` complete. Recipe `p85-aumentum-index-search-v3`. Owner 21 hits, legal 0. 21 artifacts, acquisitionMethod capture. After vision, GET `classifyStatus=written` on 21/21. Unclassified and refused absent on this job. Classified-only does not close the loop.

## GROUND-TRUTH (2026-08-28T23:05Z)

- Data planner + steering admin approved the narrower cortex wire card. Rejected status overloading, skip persistence on the artifact, and a production synthetic refuse. Decision `_decisions/2026-08-28_p85_classify_wire_not_status.md`.
- Item 8 bar: rows per run by type (met on `6eb07368`) and two refuse fixtures (unit tests). Three-state-on-one-job dropped.
- Amendment vs code: grantor-in-type writes unclassified at `89e539f6`, does not refuse.
- Item 18 wrongly homed; does not block the wire. `sourceAdapter` contract enum is R1..R5, not `records-request-v1`; parse-before-insert and keep-that-string are two substrate items.

## GROUND-TRUTH (2026-08-28T23:32Z)

- LDT #535 MERGED `68553d3d`. Cortex `cortex-api-00651-tor` @100% tag canary, digest `sha256:0008ca07` (image tag `68553d3d`, not latest). Worker still `records-request-worker-00017-ksk` @100%.
- Re-GET `6eb07368`: 21 artifacts. MEMORANDUM is `written` / `unclassified` / `MEMORANDUM`. DEED 10 written/deed/DEED. PARTIAL RELEASE written/release. EASEMENT 7 and CONSERVATION EASEMENT 2 are written with documentKind null and source label on the wire. No skipped. No refuse on this job.
- Wire card closed. Item 8 live bar (rows by type + two unit refuse fixtures) holds. Three-state-on-one-job not adopted.

## OPEN (2026-08-28T23:32Z)

- Next card, not this one: vocabulary-backed unclassified vs unresolved; sourceDocumentType on every classify route; contract parse (enum vs R1 are two items); capture-coverage marker; restamp the 21; optional ASSIGNMENT as first-class instrumentType; optional staging-only refuse POST.
- Item 18 still wrongly homed. Does not block.



## GROUND-TRUTH (2026-08-28T19:20Z)

- cortex serving `cortex-api-00639-gez` @100% image `f325413`; `CORTEX_USER_DAILY_API_LIMIT=10000` (manual 50000 reverted, intended).
- worker serving `records-request-worker-00012-zkv` @100% digest `sha256:ed2ef3f5` tag p85-v12. Traffic read from `status.traffic[]`, not latestReady.
- Live job `08023fab` parcel `48021:35481` failed `unresolved_result_row_header`. GET artifacts=[] — written/unclassified/refused all absent on the wire.
- Prior post-deploy: `c4959190` died `__name is not defined` (tsx + page.evaluate function). String evaluate killed that. Header bind still refuses on live Aumentum.
- PE #285 MERGED `f334ca89`. Dirty `hauska-map-records` not touched.
- Loop not closed. Leave-behind: live Aumentum header DOM, classify-on-artifacts probe, LDT source not on origin/main.

## LESSON (2026-08-28T19:20Z)

- A happy-dom in-process `fn()` test cannot catch tsx `__name` leaking into Chromium. The evaluate payload must be a string, and the test must refuse a function payload.
- `purchaseApproved` does not create artifacts on a paid Aumentum image. classifyStatus cannot appear on the GET wire until a capture row exists.

## OPEN (2026-08-28T19:20Z)

- Read the live Bastrop Aumentum grid DOM. Do not guess another selector.
- Land LDT #529 (string-evaluate + happy-dom pin) on main. catalog: still breaks Docker until then.
- Classify three-state live probe after a real artifact exists.

## GROUND-TRUTH (2026-08-28T17:40Z)

- LDT `feat/p85-extract-fail-closed` @ `8f5e796c` rebased on `origin/main` `4a7e789c`. Pathspec commit, 16 files. Findings A+B closed. Not pushed.

## GROUND-TRUTH (2026-08-28T17:05Z)

- Cards 1+2+3 LDT written on `feat/p85-extract-fail-closed` (from `63e14028`). Tests green: api-server classify 16/16, documentServe+routes 26/26, worker suite 56/56. Not committed. Not deployed.
- PE PdfViewer handoff: `_inbox/2026-08-28_p85_records_documenturl_pe_handoff.md`.

## OPEN (2026-08-28T17:05Z)

- Pathspec commit + rebase onto origin/main + PR. Worktree was already dirty; do not `git add` all. `playwrightBrowser.ts` still carries pre-existing Chrome UA dirty work.
- Deploy worker + cortex after merge.
- PE half on `hauska-map-records`.

## OPEN (2026-08-28T16:55Z)

- Dispatch `_dispatches/2026-08-28_p85-records_dispatch.md` executing from integration on `P:/doc_repo` main `843b343`.
- LDT worktree `P:/seat-worktrees/property/legacy-design-tools` at `feat/p85-worker-v8-tag` `63e14028`, dirty with pre-existing Chrome-UA work. This card uses `feat/p85-extract-fail-closed` and pathspec-only commits.
- Cards 1+2 must ship together. Card 3 PE PdfViewer is a handoff to `hauska-map-records`.

## LESSON (2026-08-28T16:55Z)

- A leftover `parties` join is the visible half. The dangerous half is positional `documentType` plus classify fallthrough-to-deed. Fixing only the dump sends `null` into the empty branch and fabricates a deed. Verify by violation: `SMITH JOHN A` must refuse, not become `deed`.

- **#502 MERGED** — cloudbuild tag p85-v8 on main
- **Pecan smoke @ 22:45Z:** job **`bab70fd3`** · mode `index-search` · **2 index hits** · fee gate $7.00
- **PE #256 MERGED** — spine-deep allowlist for records-request approve/decline POST (fee button fix)
- **Operator bypass @ 22:48Z:** manual approve + worker invoke · job re-ran · **`needs-human`** again (human clerk checkout on Bastrop portal — expected post-approve)

## GROUND-TRUTH (2026-08-27T20:55Z)

- **Worker p85-v8 DEPLOYED prod:**
  - rev **`records-request-worker-00008-sc6`** @100%, image **p85-v8** · Cloud Build **`4db68ab9`**
  - env: `RECORDS_REQUEST_VISION_URL` + **`RECORDS_REQUEST_NOTIFY_URL`** (notify route wired; Resend key still on cortex)
  - #500 run-cost + canary gate now live on worker
- **Wave A DONE** · Pecan `21eb218a` · Chestnut `beb04339` · both header-only complete
- **RESEND_API_KEY** in GSM (cortex deploy wire still pending for live sends)

## GROUND-TRUTH (2026-08-27T20:50Z)

## GROUND-TRUTH (2026-08-27T20:25Z)

- **W2 + W3 MERGED:**
  - LDT **#499** vision+classify · cortex **`33109586204`**
  - LDT **#500** canary+run cost · cortex **`33111104901`** · migration **0087** via **`33111194806`** SUCCESS
  - PE **#248** chat citations · PE sync **`33110505255`** SUCCESS
  - LDT **#501** corridor geometry (item 9) · merged · cortex auto-deploy pending
- **Worker still p85-v7** — #500 run-cost + canary gate need **p85-v8** Cloud Build + traffic shift
- **Next:** W4 ten-run grade (item 15) · Resend env wiring · re-run Chestnut/Pecan with full pipeline

## GROUND-TRUTH (2026-08-27T20:05Z)

## GROUND-TRUTH (2026-08-27T19:05Z)

- **W1 CLOSED** — operator graded fee path on **1101 Chestnut St** (Approve + Decline) · items 1A–1C + 6 **met**
- **LDT #497 MERGED** — Williamson publicsearch grading scaffold (item 5)
- **W2 OPEN PRs:**
  - LDT **#499** vision + classify (items 7–8)
  - LDT **#500** canary + run cost (item 14) · needs migration **0087**
  - PE **#248** chat recordingRef citations (item 12)

## GROUND-TRUTH (2026-08-27T19:00Z)

## GROUND-TRUTH (2026-08-27T18:40Z)

- **~50% wave MERGED** (subagent fan + parent rebase/merge):
  - LDT **#496** → Resend completion email (item 11) · cortex auto-deploy **`33103649339`** SUCCESS
  - PE **#239** → verdict cards (item 10) + copy guard CI (item 16)
  - PE **#242** → live GIS hits in acknowledgement (items 2–3)
  - PE **#243** → Studio gate on REC in Tools group (item 13) · PE sync triggered **`33104633282`**
  - LDT **#497** OPEN — Williamson grading scaffold (item 5) · CI Test still running on run **`33103743567`**
- **Still operator:** 1101 Chestnut Approve/Decline tap (items 1A–1C proof)
- **Still env:** `RESEND_API_KEY` on cortex + `RECORDS_REQUEST_NOTIFY_URL` on worker for live email sends

## GROUND-TRUTH (2026-08-27T18:00Z)

- **W1 lanes 1A–1C MERGED + DEPLOYED prod:**
  - LDT **#494** → main `f18d55db` (approve/decline API + worker resume)
  - PE **#236** → main (Approve/Decline UI) · GHA PE sync **`33095334991`** SUCCESS
  - **records-request-worker** rev **`00007-8z5`** @100%, image **p85-v7** · Cloud Build **`9d467b15`**
  - **cortex-api** canary deploy **`33095139148`** + shift **`33095335080`** SUCCESS · healthz green
- **W1 parallel lanes opened:**
  - LDT **#496** (Resend email item 11) · PE **#239** (verdict cards item 10 + copy guard item 16)
- **Operator proof next:** hard refresh smartsite → **1101 Chestnut** paused-fees → Approve / Decline

## GROUND-TRUTH (2026-08-27T17:45Z)

- **W1 kicked off** — fee approve/decline spine + UI on branches (not merged/deployed):
  - **LDT** `feat/p85-w1-fee-spine`: `POST approve-purchase` / `decline-purchase`, worker `purchaseApproved` resume, cloudbuild **p85-v7**
  - **hauska-map** `feat/p85-w1-fee-ui`: Approve/Decline card on `paused-fees`, client wired to deep proxy
  - **Contract frozen:** `_inbox/2026-08-27_p85_records_request_fee_approve_contract.md`
  - **Tests green:** `recordsRequestPurchaseDecision.test.ts` (5), `instrumentAcquisition.test.ts` (4 incl. fee-approved human route)
- **Canvas:** wave W1–W4 lanes + queue at `canvases/p85-records-request.canvas.tsx` (filter defaults W1)
- **Operator proof pending post-deploy:** 1101 Chestnut — Approve → requeue; Decline → header-only complete

## GROUND-TRUTH (2026-08-27T16:20Z)

- **Operator fee gate proof:** **1101 Chestnut St, Bastrop** — job paused **paused-fees** · worker copy *"Portal purchase path detected; bot does not drive checkout on this card"*. Index search + paywall detect working; **approve/decline UI not built** (item 6 P0).
- **905 Pecan (48021:34161):** index search + ~2 hits + PE instrument rows (#232) · may also hit fee pause on acquire.

## GROUND-TRUTH (2026-08-27T14:38Z)

- **#489 + #232 MERGED; p85-v6 + PE DEPLOYED prod:**
  - **records-request-worker** rev **`00006-mcq`** @100%, image **p85-v6** (strip leading THE from owner clerk search)
  - Cloud Build **`81742a30`** SUCCESS (2026-08-27T14:27Z)
  - **PE #232** merged hauska-map main **`04389d6`**; GHA PE sync runs **`33081792339`** + **`33081969891`** SUCCESS → smartsite.cloud
  - PE wires `scopeSearched.indexHits` → instrument rows + type filters
- **Operator:** hard refresh → **Run new search** on **48021:34161**. Expect **~2 index hits** (201905582, 199904322). Rows show "Index hit — image not acquired yet". Job may still pause on image acquisition (item 6).

## GROUND-TRUTH (2026-08-27T13:51Z)

- **#487 MERGED + p85-v5 DEPLOYED prod:**
  - **records-request-worker** rev **`00005-tt6`** @100%, image **p85-v5** (Bastrop SearchEntry disclaimer + grantor form)
  - Cloud Build **`bef42374`** SUCCESS (2026-08-27T13:49Z)
  - LDT main **`e4182d62`**
- **Operator:** hard refresh smartsite → **Run new search** on **48021:34161** (905 Pecan). Expect index search hits; job may still route **needs-human** / **awaiting-purchase-approval** on image acquisition (item 6).

## GROUND-TRUTH (2026-08-27T13:16Z)

- **Operator proof 48021:34161:** UI status strip updated correctly (#231). Job failed **`search-ui-not-found`** — root cause: Bastrop recipe opened `SearchTerms.aspx` without disclaimer session; real flow is disclaimer `#cph1_lnkAccept` → `SearchEntry.aspx` inline form (not Grantor link navigation).
- **Fix in progress (LDT worker):** `aumentumIndexSearch v2` — Bastrop SearchEntry separate grantor fill + live test finds 2 hits (201905582, 199904322) for DIOCESE OF AUSTIN. Deploy **p85-v5** required.
- **Operator decisions filed:** `_decisions/2026-08-27_p85_records_request_email_and_studio_pricing.md` — **Resend** for item 11 email; Records Request **included in existing Studio package** (item 13 not a separate SKU).

## GROUND-TRUTH (2026-08-28T02:05Z)

- **#511 + #512 MERGED** main @ `b8983157`
- **records-request-worker** rev **`00009-dp2`** @100%, image **p85-v9** · Cloud Build **`41d0db9a`**
- **cortex-api** @100% image **`b8983157`** (Resend secret wired) · deploy-canary `33134723267` + shift `33134787046`
- W4 re-run ready: Williamson (48491), Caldwell (48055), Hays (48209 captcha → needs-human)

## GROUND-TRUTH (2026-08-28T01:50Z)

- **#511 MERGED** worker **p85-v9** W4 recipes @ `535a02dc`:
  - Williamson entryUrl root (not `/terms`)
  - Hays ERSS: captcha detect + searchEntryUrl DOCSEARCH149S1
  - Caldwell: County.Clerk URL (fixes 403)
  - Chrome 147 UA + sec-ch-ua on browser context
- **#512 MERGED** Resend wire @ `b8983157` — `RESEND_API_KEY` in cloud-run-deploy.yml
- **Deploy in flight:** Cloud Build p85-v9; cortex deploy-canary run `33134042794` @ `b8983157`
- **Prior prod:** worker p85-v8 rev `00008-sc6`; cortex `08cd9104`

## GROUND-TRUTH (2026-08-27T12:48Z)

- **#486 MERGED** + **item 5 DEPLOYED prod:**
  - **records-request-worker** rev `00004-6jf` @100%, image **p85-v4** (Aumentum multi-query index search)
  - **cortex-api** canary shifted @100%, image `9d9432ff` (CAD-enriched `searchTerms` at enqueue); healthz 200
  - GHA: build `33072849327`, deploy-canary `33073306561`, shift-traffic `33073461108`
  - Worker cloud build `e162e045` SUCCESS

## GROUND-TRUTH (2026-08-27T12:26Z)

- **Operator run 48021:34161 @ ~7:22 local** — live enqueue on prod worker **p85-v3**; current prod Bastrop recipe is still **reachability scaffold** (mode `scaffold`). Expect quick complete without index hits until item 5 worker deploy lands.
- **Item 5 branch:** LDT `feat/p85-item5-index-search` — Aumentum multi-query (owner + legal + subdivision), CAD-enriched searchTerms at enqueue. PR pending.

## GROUND-TRUTH (2026-08-27T12:50Z)

- **P-85 items 6–7 DEPLOYED prod:**
  - Migration **0086** applied (GHA run `33068906374`, 2026-08-27T11:47Z)
  - **cortex-api** `00591-mih` @100% canary tag, image `ced0f7c1` (#483 merged); deploy runs `33068750917` canary + `33068971783` shift; healthz 200
  - **records-request-worker** rev `00003-zhm`, image **p85-v3**; env `RECORDS_REQUEST_VISION_URL` → cortex internal vision-read route; `SERVICE_API_KEY` secret mounted
  - LDT **#485 MERGED** — worker sends Bearer `SERVICE_API_KEY` on vision-read callback

## GROUND-TRUTH (2026-08-27T12:35Z)

- **LDT #483 MERGED** to main (squash) — items 6–7 scaffold:
  - Migration `0086_p85_records_request_artifacts.sql` + Drizzle schema
  - Post-search capture-first acquisition; purchase wall → `awaiting-purchase-approval` when projected cost > $50
  - Vision read: `recordsRequestArtifactVision.ts`, internal route `POST .../records-request/vision-read`, worker `triggerVisionReads()` on acquired captures
  - CI green (Test ~10m42s) after schema fixture blank-line + table-order fixes
- **LDT #482** + **hauska-map #228** merged earlier this session.
- **Not deployed** — planner queue: migration 0086, cortex-api, worker `p85-v3`, env `RECORDS_REQUEST_VISION_URL` on worker → cortex internal vision route.

## GROUND-TRUTH (2026-08-27T12:05Z)

- **LDT #482 MERGED** to main @ `c68d9357` (all CI green including 10m40s Test job).
- **hauska-map #228 MERGED** earlier this session.
- Branch `feat/p85-pe-records-bridge` reset to main + **item 6 scaffold** pushed:
  - Migration `0086_p85_records_request_artifacts.sql`
  - Post-search acquisition: capture-first, purchase threshold → `awaiting-purchase-approval`
  - **Not deployed** — planner must run migration 0086 + worker `p85-v3` + cortex searchTerms path.

## GROUND-TRUTH (2026-08-27T11:50Z)

- **hauska-map #228 MERGED** — devRole studio grant + honest Records Request status (rebased on main, CI green).
- **LDT #482 updated** (not merged): lockfile fix + Williamson default `williamson-publicsearch` + Tyler/publicsearch index-search recipes (item 5 partial).
- Worker now supports `needs-human` terminal status; cortex enqueues `searchTerms` from TxGIO at job create.
- **Next:** merge #482 when CI green → planner deploy worker image → operator-run reachability on Travis/Hays/Caldwell → Tyler login proof on prod.

## GROUND-TRUTH (2026-08-27T01:50Z)

- **dev_role granted prod** for `empressaioemail@gmail.com` and `dev@smartcityos.io` (was false — solo/paid tier blocked terrain + Studio rows).
- PE deploy **smartsite.cloud** `dpl_68wKekUURW8GL8oKY3GbChRkpYMC` — devRole clears all generatable report gates; REC live status copy.
- PRs: LDT **#482**, hauska-map **#228**.

## GROUND-TRUTH (2026-08-27T01:40Z)

- **records-request-worker** Cloud Run live: `https://records-request-worker-1062716564162.us-central1.run.app` revision `records-request-worker-00002-nzx`, image `p85-v2` (Playwright pinned 1.59.1).
- **cortex-api** env `RECORDS_REQUEST_WORKER_URL=.../run` set (revision update 2026-08-27); also baked in `cloud-run-deploy.yml` (uncommitted on `feat/p85-pe-records-bridge`).
- Recipe registry: all **5 CAPCOG + McLennan** portals registered (`p85Portals.ts` + reachability scaffold). Default county→portal map live in worker image.
- Drain: 3 queued jobs reset + rerun — **2× Bastrop (48021) complete** (bastrop-aumentum scaffold); **1× Williamson (48491) failed** `portal-unreachable` HTTP 403 on TylerHost disclaimer (bot block; try `williamson-publicsearch` next).
- New enqueues from cortex now fire-and-forget to worker (no longer no-op).

## GROUND-TRUTH (2026-08-27T00:52Z)

- Migration **0084_p85_records_request.sql** applied prod (run `33027876179`, 2026-08-27T00:46:05Z).
- Cortex **cortex-api-00586-dip** @100% tag canary, image `5ac814f8` (deploy-canary `33027953411` + shift `33028106417`). healthz 200.
- Portal rulings: 7 rows `automated_search=permitted` applied prod via `apply-operator-portal-rulings.mjs`.
- PE smartsite.cloud **dpl_EDSnVJNcBgobJ3uJdawGMTjougu5** aliased prod, bundle `index-EqJEab1m.js` (includes Records Request UI).
- Live probe: `GET /api/property-explorer/v1/records-request` → 401 `authentication_required` (expected without session).

## GROUND-TRUTH (2026-08-27T00:10Z)

- [Tyler worker scaffold](e02fd521-9202-4208-86eb-2602fba23a0f) committed on LDT #480 @ `6b13a79a` (worker) + CI fixes @ `064ee4fb`.
- hauska-map #225 MERGED @ `65a69174` — REC row UI + spine-deep wire to `/property-explorer/v1/records-request`.
- LDT #480 OPEN on `feat/p85-pe-records-bridge`: PE bridge + worker + catalog/typecheck fixes; Test job in flight.
- Worker: `artifacts/records-request-worker/`; `RECORDS_REQUEST_WORKER_URL` no-op when unset.
- Williamson TylerHost stub recipe only; other P-85 counties fail `portal-unresolved`.

## GROUND-TRUTH (2026-08-26T21:50Z)

- Scope amended: Records Request (all recorded docs), live GIS (no ingestion), browser agent + portal recipes.
- LDT branch `feat/p85-records-request` from `seat/property` @ 9f85f487 (NOT pricing worktree).
- Dropped: parcel_easement_gis_hits, easement_research_jobs, Factory easement landing.
- Salvaged: clerk portal terms + gate; added liveEasementGisQuery.ts + records_request_jobs.
- Substrate request: `_inbox/2026-08-26_substrate_request_p85_adr020_instrument_type_extension.md`
- CP1 amended with interruption recovery: `_inbox/2026-08-26_p85-easements_cp1.json`
- Pricing ladder dirty work stashed: `stash@{0}` on former feat/p85-easements branch name

## OPEN

- Operator prod proof on **48021:34161** (search terms, captures sha256, artifact rows, vision metadata)
- Operator-run reachability proofs: Travis, Hays, Caldwell (recipes registered)
- Tyler login + live search proof on Williamson (publicsearch) + Hays after worker deploy
- WDLL items **8–10** classify / geometry / verdicts — not started
- Email provider (item 11)
- Stripe Studio price ids (item 13)

## CANON

- Status canvas: `_inbox/2026-08-27_p85_records_request_status_canvas.md`
- Handoff: `_inbox/2026-08-27_p85_records_request_handoff.md`

## DEAD-END

- Factory GIS landing on P-85 card — superseded by live query amendment
