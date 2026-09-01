---
id: 2026-08-28_p85_aumentum_live_grid_dump
title: Live Bastrop Aumentum SearchResults grid dump
status: active
last_updated: 2026-08-28
---

# Live Aumentum grid (read, not guessed)

Snapshot: 2026-08-28T20:50Z. Portal `https://cc.co.bastrop.tx.us/RealEstate/SearchResults.aspx` after Grantor begins-with `PALMS PROPERTIES LLC` (parcel `48021:35481` owner). Page text: "Showing Records 1 through 21 ( 21 records found".

## What the grid is

Infragistics (`ig_ElectricBlueHeader`, `ig_ElectricBlueAlt igg_ElectricBlueAlt`). Not Telerik RadGrid. Zero `.RadGrid`, zero `tr.rgRow`, zero `.rgHeader`, zero `thead` on the data table.

Data table (innermost, no id): first tbody `tr` is headers as `th` (38 th nodes, many hidden). Next 21 `tr` are data. Alt rows carry `ig_ElectricBlueAlt igg_ElectricBlueAlt`. First data row cells:

`1 | View | (empty) | 202008880 | 202008880 | 202008880 | (empty) | (empty) | 06/05/2020 | DEED`

Published visible headers in order: `#`, `Image`, `Item Select`, `Instrument #`, `Instrument # Book-Page`, `Inst num`, `Book`, `Page`, `Date Filed`, `Document Type`, then name/legal/status plus hidden GLOBAL_ID fields.

## Why extract refuses

`EXTRACT_RESULT_ROWS_SOURCE` walked the whole document (`table tbody tr`). On this page it returned 39 rows: 25 with headers, 14 with `headers: null`. `extractIndexHitsFromPage` refuses when any row has null headers.

The 14 null-header rows are chrome, not results: site banner, Login / View Basket, Sort By, `igdd_ControlArea` dropdowns, Document Image, Copy Options, Logon button tables. The 21 instrument rows do have headers. The refuse is the chrome rows, not a missing Instrument # header.

Wrapper `Table1` also publishes those `th` (nested), so some chrome rows inherit a 31-name header list and a 800-cell dump of the whole grid. Those would bind garbage if the null-header refuse were removed without dropping chrome.

## Second mechanism considered

"Headers live in a sibling table the way Telerik does" is rejected. This page has no RadGrid split. The data table contains its own `th` row. The Telerik fixture still matters for Travis. Bastrop live is Infragistics plus document-wide chrome.

## Do not

Guess another `rgHeader` / `.RadGrid` selector from this dump. The next extract change must drop chrome rows (or scope to the innermost table that published Instrument # and has View-linked numbered rows) and keep a violation fixture of this page: login chrome + wrapper Table1 + the 21-row Infragistics table. Current extract must fail that fixture. After the change it must return 21 headed rows and first `cells` instrument `202008880`.
