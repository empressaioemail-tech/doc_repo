---
id: 2026-06-17_radar_national_baseline_qa_loop_deploys
title: Session — radar execution coordination, national-baseline coverage, free-brief tier, extension QA loop, deploys
date: 2026-06-17
type: session
applies_to: portfolio
related: [75i_investor_radar_prelaunch_sprint, 61a_central_tx_coverage_program, 76g_investor_radar_landing_and_webstore, _decisions/2026-06-17_brief_national_baseline_websearch_coverage, _decisions/2026-06-16_investor_radar_name_and_pricing]
---

# Session — radar execution, national-baseline, free-brief, extension QA loop

Continuation of the 2026-06-17 radar arc ([`first session record`](2026-06-17_investor_radar_v1_coverage_and_deploys_claude_code.md)). This chat ran as the coordinating planner driving a tight build-deploy-QA loop with cc-agent-C and extension-agent against live prod. The operator QA-ed each surface in real time; the planner verified every close against live (gh, gcloud, prod endpoints), not report text, repeatedly catching stale or wrong-shape claims.

## Arc

The operator's goal: a landing page to an installed extension that fires on all cylinders against live prod. The session drove the extension from v0.6.11 to v0.6.15 and cortex-api through three production deploys, clearing every app-side blocker found in live QA.

## What shipped (all verified live)

- **National-baseline coverage** ([`decision`](../_decisions/2026-06-17_brief_national_baseline_websearch_coverage.md)). The jurisdiction 403 allowlist was killed. The brief now fires on any address: Central TX served by cited engine atoms, everywhere else by a labeled web-scraped websearch fallback (commitment-one compliant, 0.35 asserted). Pflugerville went 403 to 200 with `localCodeSource: websearch`; Bastrop stays cited corpus; out-of-state returns baseline plus websearch. Geocode and key resolution fixed so real cities resolve.
- **Free-brief tier wired into the gate.** The entitlement layer existed but the gate went straight to the wallet debit, blocking the first brief at balance 0. Now the first 3 briefs are free (`BROKERAGE_FREE_BRIEFS_CAP`, env-overridable) before an `upgrade_required` (402, not `insufficient_balance`). Verified live: fresh install runs briefs 1 to 3 free, brief 4 hits the upgrade signal. The extension reads the entitlement snapshot and shows "N free briefs remaining" with Run enabled.
- **Zillow address fix.** The extractor took the first page `h1` (a sidebar card, "103 Kamaiki Dr / 419 sqft") instead of the listing. Now derives the canonical address from the homedetails URL slug. Verified on the 205 Javelina and 103 Kamaiki pages.
- **Deep-dive page fixed.** Landed blank from missing imports causing a ReferenceError in the chat render path. Now hydrates the panel brief on landing or auto-runs, and the inline chat posts to a loosened `/research/chat` contract (accepts `{address, message, history}`).
- **Brief failure state.** No more infinite spinner; a real terminal error or, for degraded coverage, a success-with-banner.
- **Attachment upload.** Presign to GCS PUT to complete-upload wired with progress and a doc row; complete-upload now returns 422 `pdf_unparseable` on bad PDFs instead of a 500.
- **Panel UX.** Wider panel, capped and scrollable verdict card (was clipped), click-to-expand signal cards, inline conversation, a working "Research a property" CTA.
- **Max map hero.** A 960x400 hero rendering cited reasoning overlays (not raw geometry), Max-gated; QA via the `extension-agent-map-max-qa` allowlist install id.

## Deploys (cortex-api, canary sequence each)

- `00192-zan` (and earlier `00194` reference) national-baseline brief, then `00194-diw` free-brief gate (PR #192, migration 0042), then `00197-hex` deep-dive contract plus complete-upload 422 plus map-data Max (PR #193). Rollback handles carried at each step. ENGINE_API_URL stable host confirmed throughout.

## Extension

v0.6.15 committed and pushed (`96df5ae`, branch `extension/unified-signin-v067`), verified against prod #193 with fresh install ids. Operator owes the `chrome-extension://` screen captures (the planner and agents cannot screenshot that surface).

## Decisions and collateral filed

- [`_decisions/2026-06-17_brief_national_baseline_websearch_coverage`](../_decisions/2026-06-17_brief_national_baseline_websearch_coverage.md) (the coverage model).
- [`76g_investor_radar_landing_and_webstore`](../76g_investor_radar_landing_and_webstore.md) (landing page plus Web Store listing copy, drafted for the Vercel build and the store submission).

## Open threads (carried)

- **Corridor deepen never resumed.** PR #190 (safe deepen, no-downgrade guard) merged and Austin repaired to 45.5%, but cc-agent-C was pulled into the brief-gate and deploy chain; the full Tier-A corridor warm did not run. cc-agent-C is free now; re-kick with `-AllowBatch`.
- **Commercialization connectors** (Stripe consumer subscription, Pipedrive CRM) still queued; operator holds the creds until the connectors land. Free-brief tier is independent and already live.
- **Operator launch items:** Vercel landing (copy now drafted in 76g), Web Store listing (drafted), G2 Cotality consumer-display license, ICC `ICC_CODE_CONNECT_*` secrets (operator waiting on ICC to send), General Code partnership (13 eCode360 cities).
- **Map-data** independent verification: the planner confirmed the chat and brief flips live but could not re-confirm the Max map 200 without replicating the extension's request builder; relied on cc-agent-C's two passing smoke scripts plus the pending operator visual capture.

## Memories saved

`always-copy-paste-ready-handoff-blocks`, `brief-coverage-websearch-fallback`.
