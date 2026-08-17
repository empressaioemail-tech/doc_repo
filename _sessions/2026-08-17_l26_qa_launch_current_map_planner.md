---
date: 2026-08-17
agent: planner
repo: portfolio
session_type: planning
memory_graded: none
rolled_up: false
---

# Session: L26 stop-fill, QA/launch on current map

## What was done

Operator ruled QA and launch on the current map. Remaining statewide PBF roads and CAMA loads are backfill. The Harris third restart was killed at 64k ways / 0 written. Roads drain is idle (98/254 landed, CAPCOG holds 48021 and 48055). Lease heartbeat L26 still live. No deploy this session.

Filed `_decisions/2026-08-17_qa_launch_current_map.md`. WDLL amendment 4 (Harris off serial PBF) and amendment 5 (QA/launch, roads/CAMA backfill). OPS-16 A-017. Pickup and scoreboard updated to idle.

Dallas CAD tail unpacked: A1 already wrote owner/land-use/cad-roll for 48113; L26 cad-roll re-apply never started; L21 2026 flip is blocked on engine `DECLARED_CAD_VINTAGES`; the UX gap is DCAD CAMA sqft/year (L9 zip never loaded).

## What was learned (changes to ground truth)

The two-week fill failure is one defect class: statewide cardinality in a Python or Node nested loop, controlled by wall-clock kill, scored as drain JSON rather than the customer map. Flood and pipelines left that class via PostGIS. Roads did not. Dallas scanned the same 713 MB PBF in 9.8 minutes; Harris burned hours on even-odd tests against a huge ring.

`taskkill` of a drain parent without `/T` still killed the writer tree on this spawn shape. Do not retry detach.

Live 2026-08-17T17:45Z: `https://smartsite.cloud` returns HTTP 200, `Server: Vercel`, `X-Vercel-Cache: HIT`, 1121-byte HTML. This supersedes the 2026-08-14 L19 observation that apex was a GoDaddy parking lander with no Vercel headers.

Stripe active catalog (L6 2026-08-12) is named Smart Site Solo/Studio/Team with zero Hauska strings, but unit amounts are still 2900/6500/9900, not the locked 4900/12900/29900. Unlock $15 product was not created. Source: `_inbox/2026-08-12_L6_gtm_polish_close.json`.

G4 is still open: no CRM of record for humanless Smart Site. Affiliate platform class is Rewardful/PromoteKit/FirstPromoter. Pipedrive is refused as a city feed (G-63), not a Smart Site GTM decision.

## What's still open

- Redesign roads backfill (prepared geometry or clipped PBF). Do not restart statewide PBF Harris.
- DCAD CAMA zip for Dallas/Tarrant after announce; engine vintage mirror before any cad-roll re-apply.
- Stripe amounts vs locked ladder; $15 unlock product; operator checkout E2E; Team self-serve seats; dunning.
- G4 CRM ruling: Stripe + affiliate platform, or a named CRM for Solutions/municipal only.
- Vercel plan (Hobby 12-function cap historically hit on PE #109) vs Pro; PE-facet load test still the 2026-08-05 historical number, not L19.
- Doc_repo commit of this capture (planner-owned; not committed this turn).

## Suggested canonical doc updates

- `_decisions/2026-08-11_texas_flush_launch_gate_amendment.md` DC-3: uniform-rail 254/254 for roads is post-launch; launch grades the footprint map plus honest not-yet with hasWriter.
- `_smartsite_masters/06` G2 copy: remove "sales CRM" for Smart Site.
- `76j` Workstream B item 4: domain is now on Vercel (this session HEAD); DC-11d parking-lander finding is stale.
- `00_current_state.md` Fire 1: L26 fill factory stopped; GTM/checkout is the live fire.
