---
id: 2026-08-17_g73_shell_design_review
title: G-73 shell design review (Claude Design, serving 00011-nzs)
status: active
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    2026-08-17_g73_shell_homes_WDLL,
    2026-08-17_g18_shell_homes,
    2026-08-17_g18_smartcity_inventory,
    2026-08-17_bastrop_dashboard_layout_inventory,
    2026-08-17_shell_before_feeds,
    30c_smartcity_platform_ia,
  ]
---

# G-73 shell design review

Source: Claude Design, 2026-08-17, against serving Dashboards `smartcity-dashboards-00011-nzs`. Method: served HTML, JS, CSS, and API. No screenshots. Wiring, copy, and state-vocabulary only. Pure visual judgments (density, rhythm, hierarchy) were not made.

This does not reopen G-73. G-73 closed against its WDLL. Several defects below are hydration or later-named holds that the G-73 HTML GET could not fire. Instrument finding: G-73 items 3 and 5 graded markup, so A1 (compose hydration of Bastrop meetings) did not fail the card. That is a check-method gap, not a silent WDLL fail.

## Planner disposition (not part of the review)

File this. Next card is identity leak, not another feed, not a chrome polish dump.

Do now (proposed G-74, WDLL still owed):

1. A1. Stop rendering Bastrop meetings on template-city Overview. This is the G-71 HOLD becoming a named wipe/retarget card. Do not fetch a replacement clerk host on this card unless the operator names a non-Bastrop source.
2. A2. Remove 1311 Chestnut Street from the Citizen lens. Honest-absence, not a fictional counter with a real city's address.
3. A3. Remove the word Bastrop from demo-visible Connections copy.

Ride-along only if it stays one line and does not expand the card: C1, pass `embed=1` on the Plan Review mount. The CSS is already on plan-review-app.

Hold for later named cards:

- B1 to B7, D, E: honesty vocabulary and inert affordances.
- F: export, feedback, Courts ruling.
- G: split Connections into customer Coverage vs internal Function register. The 30c override stays for this wave. Do not hide City group.
- C2, C3: Plan review work-route vs dual-on nav; drop document-level theme flip.

Do not start G-52. Do not fill G-24. Live Bastrop no-touch. L26 not taken.

---

## What is right, and worth protecting

`shell.css` declares zero hex colors, zero `rgb()` values, and zero token definitions. 15KB of layout that consumes `--sc-*` and nothing else. 30b §1's rule that no component declares a color outside a token is fully honored. That is unusual, and the temptation to break it will come from the first component that needs a shade that isn't in the kit. Hold the line there.

The empty states are the best work in the build. Every one is state key, one-line what, a paragraph of why, and a Basis: line. Finance's "That is not a zero balance" and Assets' "Empty is the designed state. A truck on a vendor feed is not a city asset record" are 30b law 5 executed properly. No sample rows, no `$0`, no invented counts anywhere probed. G-24 holds at zero.

Connections carries all 67 rows and the tallies match the file's counting rule exactly (primary 31, review-product 7, products 6, feeds 12, other 11).

Also worth correcting the record: the layout inventory says plan-review-app is a "white page, no design system." That is stale. Both mount hosts now serve `sc-kit.css` with `data-theme="dark"` and `class="sc"`. They are on the system.

## A. Live Bastrop content is on the demo right now

### A1. Overview renders five real Bastrop meetings. Fix first.

`GET /api/lenses/city-manager/compose?cityKey=template-city` returns:

```
"meetings": { "status": "ok", "honesty": "read", "recordCount": 5,
  "records": [
    { "title": "Planning and Zoning Commission", "when": "2026-08-27T18:00:00-05:00",
      "source": "https://bastrop-tx.municodemeetings.com/" },
    { "title": "Main Street Advisory Board", ... },
    { "title": "Parks and Recreation / Public Tree Advisory Board", ... },
    { "title": "Regular City Council Meeting", "when": "2026-09-08T18:30:00-05:00", ... },
    { "title": "Public Library Board", ... } ] }
```

`renderMeetings()` in `app.js` hides the empty state, unhides the list, and prints each record's source in bold. So City of Template's Overview shows Bastrop's council calendar with `bastrop-tx.municodemeetings.com` printed as the provenance on every row. Because honesty is `"read"` and not `"partial"`, the Partial chip stays hidden too. No caveat at all.

The G-71 hold is documented in `_inbox/2026-08-17_g18_shell_homes.md` under Holds. What this review reports is that it is not a dormant hold, it is rendering. And the static HTML says the opposite: "Calendar unread. No meeting packet has been read." That empty state is what a GET of the HTML shows, which is exactly the check method the G-73 WDLL acceptance items used. The grade was clean because the leak is in hydration, not in markup.

Job: `shell_homes` primary row 4, City calendar, Mounted. The home shape is right. The content identity is wrong.

### A2. Bastrop's street address is hardcoded on the Citizen lens.

"Fees are paid at the Development Services counter, 1311 Chestnut Street, weekdays 8am to 5pm." 1311 Chestnut is Bastrop; the layout inventory's own probe address is 1308 Chestnut. This one is not a grant artifact, it is authored copy. It is also the single place in the build where honest-absence breaks into a specific, checkable, false claim: a fictional city with real counter hours.

### A3. The word Bastrop is printed on the Connections page.

"Every live Bastrop staff job from the G-18 Homes tables has a named home here." Internal provenance language on a demo-visible surface. A prospect city reading Connections learns the name of the reference customer and reads the product as a Bastrop derivative.

## B. The honesty system contradicting itself

The discipline is good enough that its self-contradictions are the loudest defects on the page.

### B1. Three "of 4" counters, two of them hardcoded.

Nav footer says "0 of 4 sources read." Overview's Sources panel says "0 of 4 read." Finance says "0 of 4 required sources connected." Only the Finance four are real and named (adopted budget, fund ledger, permit fee revenue, department spend). The other two are static markup that no JS ever updates. `shell_homes` other row 66 rules the status-bar count: "Never a hardcoded count." The old sin was a hardcoded "7 integrations." It has been replaced with a hardcoded "0 of 4."

There is no denominator of 4 anywhere in the register, which lists 12 feeds. A reader who counts will not be able to reconstruct it.

### B2. "Sources 0 of 4 read" sits directly above "9 atoms."

Same panel. The head is static; the body is filled by JS from `atoms.atomCount: 9` with nine named types (zoning-fact, setback-rule, flood-hazard-fact and six more). The panel header says nothing has been read while the panel body lists nine things that were.

### B3. Nav badges and page-header chips disagree on half the destinations.

| Destination | Nav badge | Page header chip |
|---|---|---|
| Overview | none | Preview |
| Development services | none | Preview |
| Finance | none | No source connected |
| Citizen | Preview | no page header at all |
| Plan review | Preview | inherits the DS header |
| Files | Preview | Preview |
| Assets | none | Empty |
| Connections | none | Register |

Overview and Development services read as fully built in the nav and Preview on the page. Citizen reads Preview in the nav and has no page header to state anything. These are the two places a user looks to answer "how real is this," and they disagree.

The deeper issue: the nav's badge vocabulary has three values (none, Preview, Not built) but "none" is doing double duty for Mounted and for Empty. Finance is honest-empty and carries no nav badge, so in the nav it is indistinguishable from Overview. An empty home that looks identical to a built home is a home that is too quiet to count.

### B4. The register renders ten disposition values where six were declared.

The file declares Mounted, Empty, Not built, Island, Killed, Not connected. The live page renders those six plus "Mounted / Empty," "Mounted chrome," "Home exists," and "Chrome only," copied verbatim from the source table's Disposition column rather than normalized. On a page whose whole job is a scannable accounting, you cannot group or count by disposition. Normalize to six and push the nuance into the row's home text.

### B5. Four rows print their home as "none."

Rows 38 (nested review product chrome), 43 (3D city model product), 56 (CRM feed), 61 (Design lab). All four are Killed, which is a legitimate home under the file's own definition. But on the page that claims nothing is homeless, four rows literally say "none." That is a copy fix, not a policy change: print the ruling in the home column, "Killed, nested product chrome," not the bare word.

### B6. Row 64 asserts something that was killed.

"Citizen twelve tiles | Citizen | Mounted." The file's disposition is "Mounted lens. Tile grid killed." Keeping the row named "twelve tiles" and marking it Mounted states that twelve tiles are mounted. Rename the row to the job (Citizen services) or mark the tile grid Killed on its own row.

### B7. Two rows drop the qualifier that carries the honesty.

Row 32 Reviewer queue renders "Mounted" where the file says "Mounted (iframe residual)." Row 41 AI Plan Review renders "Mounted" where the file says "Mounted iframe residual. Native console later." The parenthetical is the whole truth content of those rows.

## C. Nested product chrome, the PermitFlow sin reproduced

### C1. The Plan review mount shows two top bars, and the fix is already deployed.

`planReviewIframeSrc()` in `staff-review.mjs` returns `https://plan-review-app-ten.vercel.app/` with no embed parameter. plan-review-app already ships the suppression rule:

```
html[data-embed="1"] .shell-top { display: none; }
html[data-embed="1"] .shell-main { padding-top: var(--sc-4); }
```

But its HTML contains zero occurrences of "embed" (no detection script), and Dashboards never passes the parameter, so the attribute is never set. The result at `/?lens=development-services&tab=review` and via Work > Plan review is the Dashboards top bar stacked on Plan Review's own top bar: two brand seals, two Demo badges, two navs. Because both are now on the SmartCity kit, both bars look native, which makes it more confusing than PermitFlow's obviously-foreign slate-900 header, not less.

**Correction 2026-08-17 (G-75):** the detection script is on the serving host. `web/app.js` has carried `embedParam` / `isEmbedded` / `applyEmbedChrome` since the kit pass. `?embed=1` hides `.shell-top` today. The missing half was Dashboards never passing the parameter. No plan-review PR. See `_inbox/2026-08-17_g75_shell_mounts_motion.md`.

Smart Files does this correctly and is the working reference: `smartFilesIframeSrc()` appends `?embed=1`, Smart Files' HTML has a detection script (query param, then frame check, then referrer), and its CSS hides `#app > .shell-top`. Mirror it in `planReviewIframeSrc`. One line. Detection on plan-review-app is already live; passing the parameter is the remaining half.

### C2. Two nav items are current at the same time.

From `applyLens()`:

```
const sameLens = el.dataset.lens === lens;
const wantsTab = el.dataset.tab;
el.classList.toggle("on", Boolean(sameLens && (!wantsTab || wantsTab === tab)));
```

"Development services" has `data-lens` and no `data-tab`, so it is on for every DS tab including review. "Plan review" has `data-lens` plus `data-tab="review"`, so it is also on. At the review tab both light up, in two different nav groups. A Work item that navigates into a Lens tab can never be unambiguously here. Either give Plan review its own work route and mount it there, or drop the Work entry and let the DS Review tab be the only home. Reviewer recommendation: give it the work route, because the register homes it in Work (rows 32 and 41) and because Plan Review is a product, not a tab of Development services.

### C3. The Citizen lens flips the whole document to light.

`document.documentElement.dataset.theme = lens === "citizen" ? "light" : "dark"`. The Citizen section already carries `class="cz sc-light"`, which is exactly the 30b §1.9 subtree mechanism and is the right call for a public-facing lens. The document-level flip is redundant, and it is what drags the staff top bar and sidebar from dark to light as a consequence of navigation. Delete the line, keep the scoped class.

## D. Affordances that promise a function with no home

### D1. The top-bar search is inert, and it contradicts the nav.

"Search records, parcels, cases" has no handler in `app.js`, `staff-map.mjs`, or `staff-review.mjs`. Three hundred pixels below it, Records search is badged Not built. Two contradictory statements about the same capability in one viewport. It is also the only chrome element on the shell with no corresponding row in the 67: a home with no job. Either wire it to the record search when that exists, or badge it the way everything else on this build gets badged.

### D2. The Citizen "Look up" is inert too.

Its caption explains vocabulary ("Address lookup is public vocabulary only") rather than saying nothing will happen. Every panel on this build explains its absence; the two input affordances are the exceptions.

### D3. The Compass sheet has a Maximize button on a card that says "Answers are not generated on this card. The sheet is chrome only."

### D4. "Viewing as: City manager" is not a persona switcher.

`setText("lens-switch-label", ...)` sets it to the current lens or work label, so on the Assets page it reads "Viewing as: Assets." It sits directly above a group labelled Lenses and reads as a role control. It is a breadcrumb echo of the thing immediately below it.

## E. A panel that claims an accounting and gives 44% of one

Overview's "Across departments, what each lens reads and whether it read" lists four rows: Development services, Plan review, Finance, Public works. The roster has nine lenses. Citizen, Parks, Police, Fire and EMS, and Fleet are absent. Given that this panel is the Overview-level expression of the same accounting Connections makes, showing four of nine reads as a sample, and a reader cannot tell whether the other five were omitted or do not exist.

## F. Still homeless

The register claims 67 of 67 Homes-table rows, and that is true. But the Homes tables themselves do not cover everything in the layout inventory:

- Print and PDF export. Layout inventory Layout 3 captures "print/PDF export" for Development Services, and Layout 6 captures "PDF export" for Compass. No row in any Homes table names export. No home on the shell. For a product whose metaphor is a book of record, getting a record out is not a minor feature.
- Feedback (screenshot plus category). Shell item 4 of the layout inventory. Homes row 65 names "Auth / session / notifications / theme / sign out" and does not include feedback.
- Municipal court. Row 63 folds `/departments/*` into "Parks; Courts on Connections." G-73 promoted Parks to a Not built lens in the nav but left Courts with a register row as its only home. Same source row, two different shapes. Court is a real department with real revenue, and it will be asked about. Not recommending a lens this wave, but the asymmetry should be a deliberate ruling rather than a side effect.

## G. The 30c conflict, named

30c §1 says a demo visitor must never see Assets, Connections, or People. The operator ruled the opposite so the IA is complete before feeds.

The override is right for this wave and wrong as a permanent rule, and the reason is not visibility. It is that Connections is two documents wearing one name.

What is on the demo today is an internal build ledger: G-18 row numbers in the DOM, the phrase "live Bastrop staff job," killed-product archaeology (3D city model, CRM feed, Design lab), and a list of eight vendor products marked Not connected. Every row is true. But a prospect city reading it gets: here is everything this product does not do, here is the city it was actually built for, and here are our vendors we have not wired. That is not the message the completeness argument is trying to make.

The completeness argument is real and should not be given up. Split the document instead of hiding it:

- Coverage, customer-facing, stays on the demo. What the product covers, what is connected for this city, what is on the roster and not yet built. No row numbers, no Bastrop, no killed-product history, no vendor roll.
- Function register, the full 67 rows with dispositions and rulings, stays internal. It lives in the file today and can move to a staff route once People and access exists.

That satisfies the operator's goal, the IA is provably complete on the product before any feed, without shipping the build ledger as demo content. And because People and access is Not built, there is no gate to hide behind right now, which is precisely why the split has to be by document rather than by visibility.

## Reviewer's fix order

1. Urgent: A1 Bastrop meetings off the demo Overview, A2 Chestnut Street line. These are the exact failure the shell-before-feeds decision was written to prevent, and they are live.
2. Then cheapest with most effect: C1 `embed=1` on the Plan review mount (CSS already deployed), B1/B2 hardcoded "0 of 4", B3 nav badge vocabulary (whether an empty home reads as a home at all).
