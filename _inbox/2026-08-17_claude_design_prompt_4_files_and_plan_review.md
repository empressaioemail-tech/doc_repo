---
id: 2026-08-17_claude_design_prompt_4_files_and_plan_review
title: Claude Design prompt 4 — Smart Files + Plan Review at product and city
status: draft
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    2026-08-17_claude_design_prompt_1_design_system,
    2026-08-17_claude_design_prompt_2_platform,
    2026-08-17_claude_design_prompt_3_compass,
    _decisions/2026-08-17_smartcity_visual_law,
    _decisions/2026-08-17_smartcity_product_line_design_system,
    _decisions/2026-08-15_smart_files_is_a_product,
    _decisions/2026-08-16_plan_review_is_smart_files_first_consumer,
    _smartcity_masters/33a_smartcity_plan_review,
    _smartcity_masters/34_smartcity_smart_files_and_foundation,
    48_cortex_reporting_plan_review_spec,
    30b_smartcity_design_system,
    30c_smartcity_platform_ia,
  ]
---

# Prompt 4 — paste this as one complete Files + Plan Review pass

You already set the SmartCity product-line design system and the platform IA. **Use only those tokens and components.** Frozen law stays frozen. Do not reopen type, density, inverted matrix, environment badge, or the Compass sheet. Do not invent a second look.

This session designs the two **net-new products**: **Smart Files** and **Plan Review**. Dashboards already has layouts. Compass is a separate pass. Asset Management stays the empty inventory already designed. Do not restyle live `smartcityos.io`. Do not write production code. Do not commit.

Each product is designed at **two altitudes**. Same components. Different chrome around them.

1. **Product altitude.** The app a person opens as Smart Files, or as Plan Review. Own URL. Own first screen. Kit shell. Environment badge. Category switcher still present so it is clearly one line, but the landing work is this product.
2. **City altitude.** The same product composed into SmartCity Dashboards: Files under Work, Review as the Development services Review tab and as the native review console. No iframe. No second header. No `plan-review-app` or `smart-files-app` looking like a foreign site.

A staff person who used the product yesterday and opens it from the city today must not relearn it. Sold as line items. Must not look like line items.

Live QA UIs are **as-found, not the product.** Replace them.

- Files today: `https://smart-files-app.vercel.app` (persona select, two-column rooms, upload, share token). That is a proof of create/upload/share. It is not a file browser.
- Plan Review today: `https://plan-review-app-ten.vercel.app` (white page, persona gate, Queue/Library/Code/Applicant/Gate). That is a function harness. It is not the examiner console.

30c already sketched search, rooms, file record, share-read-only, the review queue, and the console. **Keep those jobs.** This pass makes them a real product: a file browser people will actually use, drive-link ingest, access that is a pleasure, and Plan Review as a full product that mounts Files instead of owning documents.

---

# Altitude rule (do not collapse)

| Surface | Product altitude | City altitude |
|---|---|---|
| Smart Files | App lands on the browser: places, search, current folder, access rail | Dashboards Work → Files mounts the same browser, scoped to the city tenant. A Files region on a place or a review is a picker or a referenced list, not a second browser |
| Plan Review | App lands on the queue. Console is the product. Applicant is a thin public view | Development services → Review tab mounts queue + console functions. Overview "overdue reviews" deep-links into the same console. Citizen My requests is the applicant view |
| Documents on a review | The review's Documents tab **is** Smart Files: a room on that engagement | Same tab, same picker, same access inheritance. Never `pf_documents`, never a GCS table inside review |
| Share | Product mints the link. Shared view is kit, no staff nav | City staff share from the same dialog. The link does not become a SmartCity session |

Do not design two file UIs. Do not design two review consoles. Design one of each, then show it in both chromes.

---

# Part A — Smart Files

## What the product is

A file browser for a city's records. One place to search. A document lives once. Revise once and it is current everywhere; the prior version is still there. Tenant-private by default. Widening access is an explicit act with a name and a time.

It is also how files from somewhere else **become** Smart Files. A clerk pastes a Google Drive, Dropbox, OneDrive, or shared-folder link. The product fetches what it is allowed to fetch and lands each file as a Smart File: one record, versions, access policy, provenance pointing at the source link. After that, Smart Files is the system of record. The drive is a source, not a live mount and not the place staff keep working.

Customer language from the master (use this, invent nothing else):

- Search all your smart files from one easy-to-use interface.
- Revise once and it is updated everywhere, and what it was before is still there.
- Your data is yours.

Never say storage layer, substrate, atom, node, graph, IPFS, CID, or content-addressed in the UI. Provenance can say "from a Google Drive folder, brought in on {date}."

## The browser (this is the product)

Think Finder or a calm Explorer, not a SaaS card grid and not the QA two-column rooms page.

**Places rail (left, inside the product, not a second app nav).**

- Search (one field, what this tenant can see)
- Recents
- My files (rooms this tenant owns)
- Shared with me
- Shared by me
- A room list under My files (department or project filing places). Customer word is folder or room, not "org room"
- Bring files (the ingest entry). Not buried in a settings page

**Main.** Breadcrumb. List is the default (name, kind, current version, who can see it, last revised, referenced-by count). Optional comfortable grid for drawings and sheets. Multi-select. Open a file in place (preview region). Open a room by drilling the list.

**Access rail (right, always on when a room or file is selected).** Who can see it. Tenant private is the stated default. Each widening is a row: person or group, permission (view / comment / edit), granted by, when. Revoke is a first-class control. A share link is one more row, not a magic URL with no record.

This rail is the "really nice sharing and access" job. Spend the session here. It must feel as considered as the browser itself.

## Bring files (drive links become Smart Files)

This is net-new. 30c did not design it. Design the whole job. Do not pretend a live Google OAuth connector is shipped.

**Entry.** From Places: Bring files. Also an empty-room action: "Bring a folder from a drive." Also paste-on-empty: if the main pane is empty, a quiet affordance accepts a link.

**What the user does.** Paste a link. Optionally name the destination room (or create one). Confirm. That is the whole happy path.

**Source register** (same honesty as Finance). Each source is a row with a state, not a logo wall.

| Source | Design it | Honest default on demo |
|---|---|---|
| Paste a share link (Google Drive, Dropbox, OneDrive, any https file or folder link) | First path. Works without an account connection if the link is reachable | Demo: one successful bring, one permission-denied, one unsupported host |
| Connected Google Drive / Dropbox / OneDrive | Second path. "Connect" is an explicit act. Not connected is a real state | Demo: Google Drive **Not connected**. Do not fake a connected account |
| Upload from this computer | Always available. Already exists. Keep it quieter than Bring | |

**Job states, all designed, none skipped.**

1. Link received
2. Checking the link
3. Folder seen: N files (or "this link is one file")
4. Bringing in (determinate: 12 of 40). Name the room they are landing in
5. Converted: each file is now a Smart File. Source link is provenance, not the open path
6. Partial: 37 of 40 landed; 3 denied or unsupported. List the three
7. Failed: permission denied on the source; unsupported host; link expired. Basis and a next step (ask the owner to share, or upload)

After convert, staff work in Smart Files. Opening the original drive is a provenance action ("Open original source"), not the default click on the file.

**What this is not.**

- Not a live two-way sync. We do not keep editing in Drive.
- Not "mount Drive as the file system."
- Not a vendor wallpaper of Drive's own UI.
- Not an OAuth settings page as the product.
- Not a claim that every host works. Unsupported host is an honest empty with the host named.

Demo fixture: one brought-in room labelled as a demo bring, environment badge Demo, with provenance "from a Google Drive folder." Do not present it as Bastrop's drive.

## File record (keep, deepen)

Preview. Version history: current everywhere it is referenced; a review that cited v2 still resolves to v2. Where referenced: this review, this asset, this lens. Access inherited from the room; attaching to a review does **not** re-grant. Kind-specific preview: PDF, image, sheet, CAD/download. No fake BIM viewer.

## Share and access (the bar)

Design these as first-class layouts, not a toast with a URL.

1. **Share dialog** on a room or a file. People (name + permission). Link (view only by default; edit is a named extra). Expiry optional. A one-line preview of what the recipient will see. Copy link is a control, not the whole feature.
2. **People and access** as a page for the room: everyone, every link, every revoke, every grant time. This is also what a city attorney would open.
3. **Shared read-only view** (already in 30c). Same tokens. City identity. Read-only pill. Who shared it. No staff nav. No implication of an application behind it.
4. **Request access** from honest-empty and from a link the user cannot open. Not a 404.
5. **Applicant / outside user** later uses the same shared view and the same grant model. Do not invent a portal skin.

Acting-as is the session. The QA persona `<select>` stays a demo fixture panel, labelled as absent in a city deployment.

## City altitude for Files

Show the **same browser** inside SmartCity:

- Work → Files: full browser, city tenant, environment badge says Demo or Live.
- Development → a selected case → Documents: not a second browser. A scoped list of the engagement room plus "Attach from Files" (picker).
- Place panel / later AM as-builts: "Files on this place" is a referenced list. Click opens the file record. "Open in Files" jumps to the product browser on that room.

Picker rules: only what the acting tenant can see. Creating a file from Review or from a lens still lands in Smart Files. There is no upload that writes into the review app.

## Honest empty

No rooms owned and none shared. Basis count. Create a room. Bring files. Request access. Demo visitor may preview search and a shared read-only fixture, never a private room.

---

# Part B — Plan Review

## What the product is

How a city reviews what gets built, against its own adopted code, with every finding cited and every decision kept. The reviewer decides. The system proposes, cites, and remembers. We do not approve, permit, or certify.

Money and capacity are why the city buys it. Do not put savings percentages on the UI. Do not say "cut cycles in half."

Functions (internal names, do not print F1–F7 on the chrome): queue, intake, applicability, adjudication, findings library, code library, reasoning. Documents are Smart Files.

## Product altitude

Land on the **queue**. Stages: Submitted, In review, Approved, Approved with conditions, Denied. Metric strip on the console counts outcomes, not vanity throughput: Fails, Uncertain, Unchecked, Passed last.

**Intake.** Project type + place. SmartSite map region. Public-record / SmartSite id. No parcel form as the product. **No upload required to start.** Creating the engagement creates a Smart Files room for it. Sheets arrive later through Attach from Files or Bring files into that room.

**Console.** Inverted matrix, grouped by corpus. Default filter: Unresolved only. Pass quiet (gray, no rail). Uncertain amber. Unchecked diagonal hatch (nobody has been here; louder than Fail). Fail is a real fail, not the loudest thing on the page. Override disabled until a reason is written. Reason is recorded with name and time.

**Documents tab.** Smart Files engagement room. Picker. Where referenced on the file points back here. New version becomes current everywhere; a finding that cited v2 keeps v2.

**Findings library.** Prior findings on the same section. Canned templates.

**Code library.** Full canonical title. **No body slot** for licensed ICC. Local UDC may quote; chip marks local. Template UDC + 2018 IBC citation-only is fine for **internal** demo. If a mock will leave the building, strip ICC titles.

**Reasoning.** Source, derivation, confidence with state (baseline / provenance-backed / earned), timestamp, source count. No bare number. Atom chips follow SmartSite language if you show evidence (prompt 3). Do not rebuild Compass here.

**Comment letter.** Finding row is the unit: severity rail, finding id in mono, one sentence, citation chip, sheet reference, status, basis, accept/override. This is a layout, not a Word clone.

**Applicant (thin).** Public vocabulary only. Waiting on you. No reviewer name. No matrix. Comment letter in plain language. Upload revisions via Smart Files into the engagement room (or a shared link to that room). Status becomes In review.

**icc-demo is not a city.** Do not mint it as template-city. Demo city is template-city. A review fixture may say Demo.

## City altitude for Plan Review

Same console, composed:

- Development services → Review: queue + open-console. Same matrix, same adjudication, same Documents-from-Files.
- Overview → overdue review row: deep-link into that console, drawer or navigate, no second chrome.
- Citizen → My requests: the applicant view.
- Place on a parcel: "Reviews on this place" as related records. Open review is the console.

Do not iframe `plan-review-app-ten.vercel.app`. Do not nest PermitFlow chrome. PermitFlow is dead as a product; its jobs live here.

Cotality is extinguished. Parcel resolve is public record / SmartSite.

## Serve the reviewer

The reviewer's judgment governs. Accept and Override sit at equal weight. A determination is a starting position, not a verdict. Never claim the product is the authority.

---

# Part C — What to produce this session

One artifact. Kit tokens only. Desktop plus one phone breakpoint.

**Smart Files, product altitude**

1. Browser: places rail, list, access rail, a room with mixed files
2. File record: preview, versions, where referenced (a review + a place)
3. Bring files: paste-link happy path, plus Partial, plus Failed (permission denied), plus source register with Google Drive Not connected
4. Share dialog + People and access page
5. Shared read-only view
6. Honest empty (create / bring / request)

**Smart Files, city altitude**

7. Work → Files: the same browser in the city shell
8. Review Documents tab: scoped room + Attach from Files picker (not a second browser)

**Plan Review, product altitude**

9. Queue
10. Console: unresolved matrix, reasoning, adjudication with reason-required override
11. Documents tab using Files
12. Comment-letter layout
13. Applicant thin view

**Plan Review, city altitude**

14. Development → Review mounting the same console
15. Overview deep-link into that console

**Cross-product flow (required)**

16. Examiner attaches a sheet from Files. File Where referenced shows the review. Clerk brings a Drive folder; one of those files is the sheet. Access on the room stays tenant-private until someone shares. Applicant opens a share link, not the staff console.

Also patch 30b/30c in place if you own them: add Bring files, the access rail, and the two-altitude note. Do not raise motion caps. Do not add charts.

## Stop

When a stranger can use the Files browser, bring a link, share with a named person, and see the same files on a review without a second document table: **stop**.

Do not `git add`. Do not commit. Do not push. Do not copy tokens into product repos. Do not restyle `smartcityos.io`. Do not design Compass again. Do not design Asset ingest. Do not invent hydrants, payments, or a live Drive sync. Do not use old Compass. Do not use the QA persona select as product chrome.

If Compass (prompt 3) is still mid-artifact, do not wait on it. Files and Plan Review do not depend on the sheet motion.
