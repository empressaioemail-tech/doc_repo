# Lane 3 Wave 1 + 3b — planner board

## GROUND-TRUTH (2026-08-25T01:45Z)

Seat: integration planner. doc_repo `main` @ `ee9b17d`. Operator go: red-card approved; 3b WDLL; screenshot Lane 3 items in flight.

## GROUND-TRUTH (2026-08-25T01:50Z) — 3b PE CP1 verified

Planner read `_inbox/2026-08-24_3b_pe_CP1.md` then the cited files. Confirmed: `startPeCheckout` 200 is `ok: true` with no URL/secret check (`billingClient.ts` L114-121). Unlock uses `isStripeCheckoutUrl`. Both CTAs `location.assign(checkoutUrl)`. No `/checkout`, no `@stripe/stripe-js`. Banner only while `checking`.

## GROUND-TRUTH (2026-08-25T02:00Z) — 3b PE scaffold reviewed

[3b PE scaffold](1fd3fc70-1d80-4b47-ab7b-8c8f6f83009a) tree `P:/tmp/hauska-map-checkout-3b`. Planner re-ran 11 files: 83 passed. Secret in sessionStorage, not query. Item 7 met. Items 4-6, 8-9 partial (empty Element slot). Review: `_inbox/2026-08-24_3b_pe_planner_review.md`.

## GROUND-TRUTH (2026-08-25T02:05Z) — 3b PE mount wired

Same isolated PE tree. `loadStripe` / `initCheckout` / Payment Element mount + confirm. Missing secret/key/element never reaches Stripe. 97/97 focused. Hosted assign stays. Live wallets wait on a serving cortex secret. Review: `_inbox/2026-08-24_3b_pe_mount_planner_review.md`.

## GROUND-TRUTH (2026-08-25T02:33Z) — 3b serving for 4242 test

Cortex `cortex-api-00573-gok` @100% image digest `sha256:6e2d48188f0b5a254c24be3fd99569d273c426c31f638259985b488c87c6d908` = LDT #472 merge `980f4040`. PE `dpl_5DMV1JUdcEoxVbc7NoAVBEnzEdbF` aliased smartsite.cloud, HTML `index-CPJk83VO.js`, CSP has js.stripe.com. Test-mode keys. Live-mode swap not done.

## GROUND-TRUTH (2026-08-25T02:58Z) — 3b elements hotfix serving

Stripe 2026-03-25 retired Session `ui_mode=custom`. Live Start Studio failed on that string. Cortex `#473` merge `85a0d2b` serving `cortex-api-00575-yar` @100%, digest `sha256:cc153bc547ac8f2f5f18bf4dfa98bd44580741c50f5ff37cc997fc3a95f04126` matches SHA tag. PE `#219` merge `5a6d476` aliased `dpl_4F3C6f6c3UjW9qzRfhVA8CoWr9Tt`, HTML `index-C0Pq2VgH.js`, live bundle `uiMode:"elements"`. Test-mode keys. Live-mode swap not done.

## GROUND-TRUTH (2026-08-25T03:15Z) — phase-close write paths

Scout [Write-path scout](e7ec7c52-a62b-4559-9a52-2380dd55fe47). Planner re-read `isIdentifiedOwnerFactCaller` and `/research/chat` retrieval. Owner leak is identified-session ownerFact, not GIS/CAD. Chat is corpus-only; brief websearch is unwired. Find 404 is buildable-envelope `no-parcel`, not situs-search.

## GROUND-TRUTH (2026-08-25T03:25Z) — cortex phase-close reviewed

Planner read `callerGrantsOwnerFact` and `/research/chat` `resolveResearchChatWebSearchBackup`. WDLL 1 and 4 met on `P:/tmp/ldt-phase-close`. No commit. Dev-role still Team. Civic table Bastrop/Georgetown/TEA.

## GROUND-TRUTH (2026-08-25T03:28Z) — PE phase-close reviewed

Planner re-ran 117 focused tests. WDLL 2/3/5 met on `P:/tmp/hauska-map-phase-close`. Hosted assign leftover. Situs match is includes-both-ways.

## GROUND-TRUTH (2026-08-25T03:36Z) — Reports dock 4a/4b on PE tree

Operator: do `_temp/Smart Site Reports Dock.html` before deploy. Newest frames are 4a download-button standard and 4b flood deliverable-first. Implemented on `P:/tmp/hauska-map-phase-close` (uncommitted). Focused 68/68. WDLL `_inbox/2026-08-24_reports_dock_4a_4b_WDLL.md`. Sentence splitter first failed on `9.5` then passed after the decimal guard. Phase-close PRs still unmerged.

## GROUND-TRUTH (2026-08-25T03:50Z) — phase-close + 4a/4b serving

LDT [#474](https://github.com/empressaioemail-tech/legacy-design-tools/pull/474) squash `fdb68497736e29c7cb6262eb7f6c03bcffed0a07`. Canary `cortex-api-00577-baf` digest `sha256:f9d5d138ae9799ddf2807324709fab8d55002289d99391cbd69c33483dee992b` matched Artifact Registry SHA tag. Canary healthz 200. `status.traffic[]` field read: `revisionName=cortex-api-00577-baf` `percent=100` (tag canary retained). Prod healthz 200. No migrations.

PE [#220](https://github.com/empressaioemail-tech/hauska-map/pull/220) squash `54f55a14bc868d9dd7758eec10ddf8bacbdf2886` (4a/4b `6dd809b` + typecheck `b253697`). Vercel `dpl_6svLZDbaH8D3LE7ttmhvXD7fJ4Zi` aliased smartsite.cloud. Live HTML `/assets/index-NLDSTywB.js`. Operator walk leftover (hard-refresh).

## GROUND-TRUTH (2026-08-25T03:59Z) — operator landed phase-close + 4a/4b

Operator: everything landed. Canvas updated. Customer-done on the walk. P-75/P-76 remain isolated code-done, not serving.

## GROUND-TRUTH (2026-08-25T04:11Z) — P-75/P-76 PRs opened

P-75 LDT [#475](https://github.com/empressaioemail-tech/legacy-design-tools/pull/475) `2c56c78a` (typecheck fix: asMeasured). P-76 LDT [#476](https://github.com/empressaioemail-tech/legacy-design-tools/pull/476) `435f4cba` (queryPoint optional). First CI failed Typecheck on both. Fixes pushed. No migrate. No `--apply`.

## OPEN

- Two-track handoff filed `_inbox/2026-08-24_two_track_handoff.md`. Recalibration is Track A (PE hold + 4242 leftover). This file is Track B close of P-75/P-76.
- Phase-close walk: operator landed 2026-08-24 22:59.
- 3b leftover (Track A): 4242 on the popup (not /checkout); success card + entitlement; hosted-kill after that; wallets/promo; billing portal leave_behind.
- P-75 LDT #475 OPEN. Test fail is schema fixture drift for `tx_utility_territory_staging`. Live gold leftover.
- P-76 LDT #476 OPEN. Live gold leftover. ETJ unresolved. PE origin/main does not copy cityLimitsFact.
- Travis join WDLL stays draft / write-path HELD.
- Subagents do not commit. Planner reviews diffs.

## Do not

- Start P-09 or P-25.
- Write property checkouts.
- Invent card fields on PE.
