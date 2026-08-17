---
id: 2026-08-17_lane_b_dashboards_g64_g65_planner
title: Session close — Lane B G-64/G-65 plus UI-then-one-feed path
date: 2026-08-17
agent: planner
repo: docs
session_type: execute
memory_graded: none
rolled_up: false
rolled_up_into:
---

# Session: Lane B G-64/G-65 close and path correction

## What was done

Closed G-64. Dashboards development-services mounts plan-review-app. Serving `smartcity-dashboards-00007-8sc` @100%. Product PR **#6** squash `fdd615cc7928bdc48569252dbf285c12ce760027`. CI run **32059174854** check-run `test` conclusion **success**. Live GET `/?lens=development-services` auto-loads `https://plan-review-app-ten.vercel.app/` (Plan review persona gate, no Compose click). GET `/` still 908 PINE / APN 34137. Anon MCP `dashboards_compose_city_manager` `data.planReview.url` matches. City `00118-qox` unchanged.

Closed G-65. PermitFlow is dead as a Dashboards product. No G-65 product PR (kill already true after G-64). Served GET `/app.js` `permitflow=0`; GET `/permitflow` 404; GET `/permitflow/review` 404. Paired control: city bundle `permitflow=160`; GET `https://smartcityos.io/permitflow/review` 200. Zero city deploys. No `pf_*` DROP.

Operator aligned Compass as the doc 34 sidebar. Not a category. Not a card this wave.

Operator then rejected "Bastrop cutover" as the next approach. Filed path amendment `_decisions/2026-08-17_dashboards_ui_then_one_feed.md`: UI session first, then one data source at a time onto `template-city`. Gap map `_inbox/2026-08-17_dashboards_missing_pieces.md`. G-66 WDLL drafted `_inbox/2026-08-17_g66_dashboards_ui_WDLL.md` pending approval. OPS-17 A-052. Destination overlay still stands; its next-card sequence is amended.

Did not commit. Did not start a UI build, feed ingest, G-52, Compass, city deploy, or atoms `--apply`.

## What was learned (changes to ground truth)

Dashboards today is a proof of mounts over one gold parcel, not the doc 31 family of views. A city-wide Bastrop cutover would collapse three identities that are not the same job.

Demo / template is `template-city` on Dashboards. Gold `48021:34137` is public-record Bastrop used as a demo fixture. That is not Bastrop onboarded.

Live Bastrop is `smartcityos.io` / `00118-qox` / `tenant_id=2`. Staff still work there. Islands (Leaflet, `/permitflow/*`, MyGov/Samsara wallpaper, Compass chatbot) stay until each has a named replacement staff actually use.

Next city is a new pack plus adapter grants on the same Dashboards product. It is not a clone of `P:\smartcity-os`.

Copying scrapers is allowed later only as adapters that write records with provenance onto spine or files, granted on a pack. Destination is not Dashboards Neon.

## What's still open

G-66 WDLL is draft. Do not implement until operator approval.

After UI: first feed onto `template-city`. Lowest-sovereignty candidate from G-18 is municode calendar. Do not start with MyGov private ops.

Still OPEN and not this close: G-21 honesty (340 vs 12599 permits; 64 vs 0 overdue), G-24 zero, G-33, G-42, G-52, Compass sidebar, live Leaflet cut, live PermitFlow cut, AM housing, next-city pack, staff session on Dashboards beyond fixture-city.

L26 fill stopped. G-60 STOP. Cotality extinguished. Doc_repo dirty tree; commits remain a named list.

## Suggested canonical doc updates

`_STATE.md` standing decision and OPEN Lane B already patched this close. `00_current_state.md` regenerated. Product-line decision next-cards patched. OPS-17 A-052 inserted. Canvas next-work patched. Do not rewrite G-18 as-found.
