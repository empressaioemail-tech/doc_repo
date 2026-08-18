---
id: 2026-08-17_g75_shell_mounts_motion
title: G-75 Dashboards shell, mounts and map motion
status: active
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    2026-08-17_g73_shell_design_review,
    2026-08-17_g18_shell_homes,
    2026-08-17_bastrop_dashboard_layout_inventory,
    30b_smartcity_design_system,
    30c_smartcity_platform_ia,
    _decisions/2026-08-17_shell_before_feeds,
  ]
---

# G-75 Dashboards shell, mounts and map motion

Chrome and mount pass on `template-city`. No feed, no adapter grant, no city deploy, no atoms apply. Live Bastrop stays on `smartcityos.io`.

PR [13](https://github.com/empressaioemail-tech/smartcity-dashboards/pull/13) on branch `g75/shell-mounts-motion`, head `d2a63be`. CI check-run conclusion `success`. Not merged. Not deployed. Planner owns both.

Identity regression check on serving `00012-9dk` before any work: `Bastrop`, `Chestnut`, `1311`, `bastrop-tx`, `municodemeetings`, `permitflow`, `CitizenConnect`, `leaflet`, `pipedrive`, `stripe.com` all zero on the served HTML, and the compose API returns `meetings.status=empty` with `recordCount=0`. G-74 held. Nothing was re-added.

## Mounts, before and after

Measured in Chrome at 1600x1000 against the local server, reading computed rects rather than reading the stylesheet.

| Mount | before | after | container | second top bar |
|---|---|---|---|---|
| SmartSite, Overview rail | 378 x 220 | 378 x 502 | fills its anchor exactly | none |
| SmartSite, Place rail | 378 x 220 | 378 x 626 | fills its anchor exactly | none |
| Plan Review | 1310 x 220 | 1294 x 671 | fills its anchor exactly | resolved |
| Smart Files | 1310 x 220 | 1294 x 671 | fills its anchor exactly | none |

The cause was a chain, not a single rule. `.region-canvas` carried `min-height: 220px`, `.region` carried `min-height: 280px`, and `.shell-regions` used `align-items: start` inside a `.shell-main` with no height constraint, so the grid row never stretched and every mount took its floor rather than its share. On Files the region held 291 of 778 available pixels and the iframe held 220 of them.

The shell is now a real application frame: `100dvh`, top bar and page header fixed, columns scrolling independently, work surface filling what is left. Stage and anchor rects match exactly at 820, 1280 and 1600 wide, with no horizontal document overflow at any of the three.

### The stage change is structural, not cosmetic

Each product now mounts in one persistent stage positioned over whichever anchor is on screen, rather than one iframe per view. Three consequences worth recording:

One SmartSite iframe now serves both the Overview rail and the Place rail. The old shell had `#overview-site` and `#place-site` both loading `smartsite.cloud`, so the same map was fetched twice per session.

The stages sit outside the receding wrapper. A transformed or filtered ancestor breaks `position: fixed` for its descendants, so a mount that lived inside the wrapper could not both recede and grow. That is also why the iframe is never reparented: moving an iframe in the DOM reloads it, which would have reset the mounted product on every expand.

The anchors are watched by a `ResizeObserver` and a capturing scroll listener. Below 900px the work surface becomes one scrolling column with the map stacked under the content, so without the scroll listener the fixed stage would not follow.

### Plan Review needed no change in its own repo

The dispatch premise was that the detection script was missing on `plan-review-app` and the CSS was already there. The CSS is there, and so is the detection: `web/app.js` has carried `embedParam` / `isEmbedded` / `applyEmbedChrome` since the kit pass, and the deployed build honours `?embed=1` today. Verified by rendering the deployed host both ways: top level shows the product top bar, `?embed=1` hides it.

The missing half was entirely on the Dashboards side, where `planReviewEmbedUrl` and `planReviewIframeSrc` returned a bare origin. Both now mirror the Smart Files contract. The plan-review clone was reverted to `origin/main` and no PR was opened there. The G-73 design review said the detection script was missing; that was wrong, and this note is the correction.

## Map motion, states proven

Same spring the Compass sheet uses, `springEase(320, 32, 0.9, 60)`. No second easing was introduced. Measured by driving the controls and reading rects at each state.

| State | rect at 1600x1000 | radius | recession |
|---|---|---|---|
| collapsed | 378 x 502 at (1185, 210) | `--sc-r` | none |
| presented | 1080 x 760 at (252, 73) | `--sc-r-lg` | scale 1.03, brightness 0.72 |
| maximized | 1312 x 829 at (260, 64) | `--sc-r-lg` | held |
| dismissed | 378 x 502 at (1185, 210) | `--sc-r` | released |

Maximized starts at nav width plus inset and top-bar height plus inset, so the sidebar and the environment badge stay visible per 30c section 6.2. Dismiss returns to the source rect exactly. FLIP from the anchor rect, radius interpolation, content fade at 35 percent of settle, escape and scrim and a region-bar control all dismiss, and reduced motion presents instantly.

Two geometry defects were found and fixed by this measurement rather than by reading the code. Maximize computed its frame from bounding rects read through the receding wrapper, so it landed about three percent off; it now reads `offsetWidth` and `offsetHeight`, which are transform-free. Dismiss measured the anchor while the wrapper was still scaled, so it returned to 389 x 517 instead of 378 x 502; the recession is now cleared before the destination rect is measured.

**Interruptibility is partial and should not be graded as done.** A transition can be cancelled and re-flipped from its current visual rect, which gives real reversal from position. Velocity preservation and drag-to-dismiss are not implemented. 30c section 6.4 says as much about the hand-rolled path and names Framer `layoutId` as the production route. That remains a later card.

## 30c layouts: present, and still not built

Present as designed chrome on this build:

| 30c layout | State on Dashboards |
|---|---|
| City manager, Overview | Metric strip of four, decision queue, public meetings, Across departments, map rail, sources |
| Development services | Metric strip of four, six tabs, place rail with related records, review mount |
| Finance, honest-empty | State pill instead of a strip, honest-empty, four-source register with Partial |
| Citizen | Scoped light, single column, lookup, requests, payment, meetings |
| Asset Management, inventory | Tabs, header actions, honest-empty, record-shape register, map region with no asset layer |
| Asset Management, asset record | Reachable only from the Demo fixture tab, amber badge, empty live-state slot |
| Plan Review, city altitude | Mounted at Work and as the Development services Review tab, one shell |
| Smart Files, city altitude | Mounted at Work, one shell |
| Compass chrome | Top-bar source control and sheet, scoped to city and lens |
| Phone, under 900px | Sidebar behind the menu control, rail below the primary region, metrics in two columns |

Still Not built, named and routable rather than mocked: Public works, Parks, Police, Fire and EMS, Fleet, Records search, People and access. Each is a real view stating what it is and which jobs wait on it, not a dead chip.

Native surfaces 30c specifies that this pass deliberately did not build, because they are their own cards: Plan Review queue and console at product altitude (F1 through F7), the Smart Files browser, Bring files, the share dialog, and the applicant view. Those remain mounts of the serving hosts.

## Design review items closed

B1 and B2, the hardcoded counters. Both `0 of 4` values are gone. The nav footer and the Connections header are derived from the register at bake time and currently read `1 of 12 sources connected`, with the counting rule stated on the page. B3, nav badge and page chip now agree on every destination and a test enforces the table. B4, the disposition vocabulary is closed at six values. B5, no row prints its home as `none`. B6, the twelve-tile row no longer asserts a killed grid is mounted. B7, the iframe-residual qualifier is kept on both Plan review rows.

C1, the Plan Review mount. C2, one nav item is current; Work items no longer carry a lens. C3, the document theme flip is gone and Citizen is scoped light on its own surface, which also fixed light-theme ink rendering on the dark canvas above the panels.

D1 through D4, the record search and the citizen lookup are disabled and say so, Compass no longer offers to maximize a card that generates nothing, and "Viewing as" is removed. E, Across departments lists all fourteen entries on the roster rather than four of nine. F, the three homeless jobs are named as addenda, so the register is 67 Homes-table rows plus 3 addenda.

## Nothing needs operator approval before merge

No WDLL amendment is required. This card changed no ruling, granted no adapter, and touched no city. Two judgement calls are recorded here rather than asked as questions, and either can be reversed cheaply.

Roster departments became routable views rather than dead chips. The dispatch allowed a one-panel honest-empty view if it was cheaper than a dead chip; it was, and a named department that cannot be opened reads as broken rather than as honest.

The register grew to 70 rows. `67 of 67` stays true and is still displayed as such; the three addenda are counted and labelled separately so the Homes-table denominator is not quietly inflated.

## Carried forward

The Smart Files mount fills its region, but the mounted app lays out to its content height, so roughly half the region is empty ground at 1600x1000. That is the Files UI card, not this one; the fix is on the Smart Files side, where `html[data-embed="1"]` already exists.

SmartSite renders its own search field, wordmark and tab bar inside the map region. It has no embed mode: fetching the host with `embed=1` returns no `data-embed` handling. That is the same nested-chrome shape Plan Review had, and the same one-parameter fix would close it, but `smartsite.cloud` is not in this card's housing.

The Overview `Sources` panel reports `Not read` because `HAUSKA_RETRIEVAL_URL` is unset on the local run. On serving Dashboards the retrieval mount answers, so this will read a record count after deploy. It is derived from the compose response either way and is never a hardcoded number.

Plan Review shows two engagements on the demo through its own store, on parcels in the 48021 range. That is the established demo fixture space, the same one the gold parcel sits in, and the mounted app labels its tenant. Flagged rather than changed, since the plan-review store is not this card's housing.
