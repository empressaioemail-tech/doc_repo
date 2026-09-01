---
id: 2026-08-28_p91_screen_save_schema
title: P-91 / P-92 screen and save schema (fail-closed tool contract)
date: 2026-08-28
status: planner-reviewed
plan_row: P-91, P-92
wdll_items: 17-20, 28-30
decision: _decisions/2026-08-28_smartsite_mcp_app_screen_save_decouple.md
wdll: _inbox/2026-08-28_smartsite_mcp_app_WDLL.md
scope: _inbox/2026-08-28_smartsite_mcp_app_v1_scope.md
connector: _inbox/2026-08-26_smartsite_ai_connector_WDLL.md
snapshot: P:/doc_repo main 843b3437. Schema read from LDT peSavedProperties.ts and drizzle 0061. Workbench dossier status read from hauska-map propertyDossier.ts. No product code written.
owner: Wave A schema agent. Planner reviewed 2026-08-28. Wave B implements from this file.
---

# Screen and save schema

Date: 2026-08-28. Status: planner-reviewed. PLAN-ROW P-91 / P-92. WDLL items 17-20 and 28-30.

A screen is an intake record. A save is a CRM record. One write path cannot serve both. Creating a screen writes zero rows to `pe_saved_properties`. Saving writes zero rows to `pe_screens` / `pe_screen_rows`. `get_smart_site` reads neither table.

## Store

I4: durable state lives in the Smart Site / LDT Neon that already holds `pe_saved_properties` (cortex `api-server`, drizzle under `legacy-design-tools/lib/db`). Not the Claude sandbox. Not Factory Neon. Not `hauska_mcp.atoms`.

Migration filename at implement time: next free drizzle number after `origin/main`, suggested stem `pe_screens_and_saved_crm.sql`. Current LDT trees top out at `0087_p85_portal_canary.sql`. Do not guess the number in this spec.

## Extend versus add

**Extend `pe_saved_properties`.** Live table from drizzle `0061_property_explorer_auth.sql` / `lib/db/src/schema/peSavedProperties.ts`. Columns today: `id` uuid pk, `tenant_id`, `owner_user_id`, `parcel_node_id`, `label`, `snapshot` jsonb, `created_at`, `updated_at`. Unique `(tenant_id, owner_user_id, parcel_node_id)`. This is the saved list. Add two typed columns. Do not put CRM status or MCP note inside `snapshot`.

**Add `pe_screens` and `pe_screen_rows`.** No screen table exists. Do not overload `pe_workbench_state`. Do not add `screen_id` to `pe_saved_properties`. Do not add `saved_property_id` to a screen row.

**Do not extend `snapshot` for this card.** Workbench WB7 already stores `snapshot.status` as `researching | offer | passed` and `snapshot.notes` (4k). That vocabulary is not the WDLL CRM enum. MCP `set_property_status` writes the new column only. A silent map (`researching` to `Watching`) is a defect. Existing PUT `/saved-properties/:parcelNodeId` replaces `snapshot` on conflict (`propertyExplorer.ts` sets `snapshot` from `body.snapshot ?? {}`). MCP save and status must UPDATE columns and leave `snapshot` untouched. Routing them through that PUT as written wipes dossiers.

## Tables and keys

### `pe_screens` (add)

| Column | Type | Null | Rule |
|---|---|---|---|
| id | uuid pk default gen_random_uuid() | no | Screen id returned to tools |
| tenant_id | text | no | Same default `default` as saves |
| owner_user_id | text | no | Signed-in PE user. Anonymous refuses |
| name | text | no | Trimmed. Auto-name when input empty or punctuation-only |
| created_at | timestamptz | no | default now() |
| updated_at | timestamptz | no | default now() |
| deleted_at | timestamptz | yes | Soft delete. `list_screens` omits these |

Indexes: `(tenant_id, owner_user_id, updated_at desc)`. No unique on name. Cheap duplicates allowed.

No listing-feed columns. No search-cache columns.

### `pe_screen_rows` (add)

| Column | Type | Null | Rule |
|---|---|---|---|
| id | uuid pk | no | Board key for unresolved rows (no node id) |
| screen_id | uuid | no | FK `pe_screens(id)` ON DELETE CASCADE |
| ordinal | int | no | 0-based paste order. `add_to_screen` appends max+1 |
| query | text | no | Verbatim intake string. Never rewritten. Never dropped |
| parcel_node_id | text | yes | Set only when `resolution = resolved` |
| resolution | text | no | `resolved` \| `ambiguous` \| `unresolved` |
| source | text | no | `pasted` \| `chrome` \| `gmail` \| `file` \| `walk` \| `saved` |
| candidates | jsonb | yes | Only when `resolution = ambiguous` |
| created_at | timestamptz | no | default now() |

There is no status column. There is no note column. There is no FK to `pe_saved_properties`.

Indexes: `(screen_id, ordinal)`. Partial unique `(screen_id, parcel_node_id)` WHERE `parcel_node_id IS NOT NULL` (walk-add of the same neighbor is idempotent). Unresolved rows are not unique on `query`. Two identical pasted lines are two rows.

Check constraints (named, so a violation fails the write):

- `pe_screen_rows_resolution_chk`: resolution in the three values.
- `pe_screen_rows_source_chk`: source in the six values.
- `pe_screen_rows_resolved_node_chk`: `(resolution = 'resolved') = (parcel_node_id IS NOT NULL)`.
- `pe_screen_rows_ambiguous_candidates_chk`: `resolution = 'ambiguous'` if and only if `candidates` is a non-empty jsonb array. Resolved and unresolved store `candidates` null.
- `pe_screen_rows_query_present_chk`: `char_length(btrim(query)) > 0`. The unresolved punctuation case still has a preserved string. A zero-length query never inserts.

`candidates` item shape, only these keys: `{ parcelNodeId: string, label: string }`. Extra keys refuse the write. No price, days, mls, listing url, snippet.

### `pe_saved_properties` (extend)

| Column | Type | Null | Rule |
|---|---|---|---|
| crm_status | text | yes | `New` \| `Watching` \| `Chasing` \| `Passed`. Null on rows never touched by MCP save/status. Do not backfill existing saves as `New` |
| note | text | yes | MCP note, max 4000 chars. Null when unset. Independent of `snapshot.notes` |

Check: `pe_saved_properties_crm_status_chk` allows null or the four WDLL values. `researching`, `offer`, and lowercase `passed` refuse.

Existing unique `(tenant_id, owner_user_id, parcel_node_id)` stays the save identity. No `screen_id` column.

## Enums

**Resolution:** `resolved` | `ambiguous` | `unresolved`.

**Source:** `pasted` | `chrome` | `gmail` | `file` | `walk` | `saved`. Unknown source refuses the tool call with `error: "unknown_source"`. No default to `pasted`.

**CRM status:** `New` | `Watching` | `Chasing` | `Passed`. Exact spelling and capitalisation. Unknown status refuses with `error: "unknown_status"`.

v1 intake that may write: `create_screen` accepts `pasted` only. `add_to_screen` accepts `walk`, `saved`, and `pasted`. `chrome`, `gmail`, and `file` refuse with `error: "intake_not_implemented"` until a v2 intake card. The columns already store those values so v2 does not migrate.

## Resolution on `create_screen`

Preserve input order. Cap `queries` at 50. Over cap refuses the whole call (`error: "query_batch_cap"`, `cap: 50`). No silent truncate.

For each query string Q:

1. Store `query` as the exact received string (no trim-rewrite of the stored value). Leading and trailing whitespace may be trimmed for the resolver call only. The row keeps the original.
2. If Q is punctuation-only or whitespace-only (same class as `isPunctuationOnlySitusLabel`: empty, or only spaces and `, . - ; : ' " \``), write `resolution = unresolved`, `parcel_node_id = null`, `candidates = null`. Do not call `find_parcel`. Do not drop the row.
3. Otherwise call the existing situs resolver (`find_parcel` / cortex situs-search) with the trimmed Q. Do not expand street-type abbreviations. `Cv` stays `Cv`.
4. Zero matches: `unresolved`, node null, query preserved.
5. One match: `resolved`, `parcel_node_id` set, no candidates.
6. Two or more: `ambiguous`, node null, `candidates` filled from resolver hits (node id + label only).

A create that resolves thirty-four of forty still inserts forty rows. Unresolved and ambiguous stay on the screen.

Empty `queries` array is legal: a named empty screen. `add_to_screen` can fill it.

Name: if missing, empty, or punctuation-only, set `name` to `Screen YYYY-MM-DD` from `created_at` UTC date. Do not refuse.

`create_screen` writes `pe_screens` plus `pe_screen_rows` only. Assert in the same transaction that `pe_saved_properties` row count for that owner is unchanged.

## Tool contract

Connector item 12 authorises these five. `tools/list` stays 8 until they ship, then 13. No sixth tool. No `get_screen`. No `unsave_property`. No `delete_screen`. No listing-feed tool. No web-search tool.

Reopen path without a sixth tool: `list_screens` with optional `screenId` returns that screen's rows. That is not the banned `list_my_properties(screenId)`.

### `create_screen`

Input: `{ name?: string, queries: string[], source: ScreenSource }`. `additionalProperties` false.

Annotations: `readOnlyHint: false`, `destructiveHint: false`.

Output: `{ screen: Screen }`. `Screen` is `{ id, name, createdAt, updatedAt, rows: ScreenRow[] }`.

`ScreenRow`: `{ id, ordinal, parcelNodeId: string | null, query, resolution, source, candidates?: { parcelNodeId, label }[] }`.

Refuses: unknown source; v1 source not `pasted`; queries length > 50; unauthenticated.

### `add_to_screen`

Input: `{ screenId: string, parcelNodeId: string, source: ScreenSource }`. Node id required. No query field. Stored `query` is the node id string. `resolution` is `resolved`.

Annotations: `readOnlyHint: false`.

Output: `{ screenId, row: ScreenRow }`.

Idempotent on `(screen_id, parcel_node_id)`: a second walk-add of the same neighbor returns the existing row, does not bump ordinal, does not write a save.

Refuses: unknown source; v1 source not in `walk|saved|pasted`; unknown or deleted `screenId` (`not_found`); empty or over-128 node id; screen not owned by caller.

Does not require the node to be saved. Does not write `pe_saved_properties`.

### `list_screens`

Input: `{ screenId?: string }`. No other keys. `screenId` on this tool is a screen read, not a save filter.

Annotations: `readOnlyHint: true`.

Output without `screenId`: `{ screens: { id, name, rowCount, createdAt, updatedAt }[] }` for the caller, deleted omitted, newest `updated_at` first.

Output with `screenId`: `{ screen: Screen }` or refuse `not_found`.

### `save_property`

Input: `{ parcelNodeId: string, status?: CrmStatus, note?: string }`. No `screenId`.

Annotations: `readOnlyHint: false`.

Behaviour: upsert on `(tenant_id, owner_user_id, parcel_node_id)`. Insert sets `crm_status` to `status` or `New` if omitted. Update sets `crm_status` only when `status` is present, `note` only when `note` is present. Never writes `snapshot`. Never writes a screen row. A node that is not on any screen is legal (I6, origin-independent save).

`note` over 4000 refuses (`error: "note_too_long"`). Unknown status refuses.

Output: `{ parcelNodeId, status, note }` for the row after write.

### `set_property_status`

Input: `{ parcelNodeId: string, status: CrmStatus }`. Status required.

Annotations: `readOnlyHint: false`.

Behaviour: UPDATE `crm_status` where the save exists for this owner. If no save row, refuse `error: "saved_property_not_found"`. Do not implicit-save. A screen-only node has no status (A6). Does not touch screens. Does not touch `snapshot`.

Output: `{ parcelNodeId, status }`.

### `list_my_properties` (existing, shape change)

Input stays `{}`. If the client sends `screenId`, refuse `error: "screen_id_not_accepted"`. Do not ignore it.

Annotations stay `readOnlyHint: true`.

Output: array of saved rows only.

```
{
  id, parcelNodeId, label, situs,
  stub: { situs, zoning, landUse, flood, drainage, envelope },
  status: CrmStatus | null,
  note: string | null,
  updatedAt
}
```

`stub` is the existing five-state rail vector from `get_smart_site` depth `stub`. `status` is `crm_status`, not `snapshot.status`. `note` is the new column, not `snapshot.notes`. Length equals save count, not screen row count (item 20 / A5 isolation).

Unsave is not an MCP tool. The existing authenticated DELETE `/api/property-explorer/v1/saved-properties/:parcelNodeId` deletes the save row only. Soft-delete of a screen is not in this catalog; `deleted_at` exists so a later named tool can use it.

## I6

`get_smart_site` already draws a bare node id. Its read path must not SELECT `pe_screens`, `pe_screen_rows`, or `pe_saved_properties`, and must not 404 because those rows are absent. A11 is the fixture.

## Forbidden columns and tools

No `listPrice`, `askingPrice`, `daysOnMarket`, `mlsId`, `mls_id`, `listingId`, `listingUrl`, `zillow*`, `snippet`, `webSearch*`, `searchCache*`, on any of the three tables or on tool results from this set. Find listing history is a panel `ui/message`, not a stored row.

## Cortex routes MCP may call

Shared backends only. Suggested paths, same auth as saved-properties:

- `POST /api/property-explorer/v1/screens` body `{ name?, queries, source }`
- `GET /api/property-explorer/v1/screens`
- `GET /api/property-explorer/v1/screens/:screenId`
- `POST /api/property-explorer/v1/screens/:screenId/rows` body `{ parcelNodeId, source }`
- `POST /api/property-explorer/v1/saved-properties/:parcelNodeId/save` or a PATCH that sets `crm_status` / `note` without replacing `snapshot`
- existing DELETE for unsave

Do not add a board-only endpoint the conversation cannot call (I1).

## Fixtures

Gold node `48021:34137`. Neighbor for A13 is a `draw.edges[].neighbor` on that gold `draw` (today 34169 is the reciprocal shared-edge neighbor; the fixture binds the live `neighbor` string, not a remembered id). Abbreviation pair for A14: `111 Rainmaker Cv, Bastrop TX` and `111 Rainmaker Cove, Bastrop TX 78602`.

### A5 create forty, keep six

Forty pasted queries. Thirty-four resolve to a node. Six do not (mix of punctuation-only, invented situs, and at least one abbreviation-sensitive string). `create_screen` returns forty rows. Saved-list count for that owner is unchanged. Each unresolved row has `resolution: "unresolved"`, `parcelNodeId: null`, and `query` equal to the typed string. Source on every row is `pasted`.

### A12 save and unsave leave the screen (four sentences)

Create a screen from the A5 forty and snapshot `rowCount`, every `ordinal`, and every `query`. Call `save_property` on one resolved node that appears on that screen, then reload the screen: row count, ordinals, and queries are byte-identical, and `pe_saved_properties` gained exactly one row for that owner and node. DELETE that save through the existing authenticated saved-properties path, then reload the screen: the same row count, ordinals, and queries remain, and that node is gone from `pe_saved_properties`. A design that stored screen membership as a flag on the save row would change screen counts on unsave, so this fixture fails that design and passes only when the two writes hit different tables.

### A13 walk add

Open gold `48021:34137` via `get_smart_site` with no save and no prior screen membership (A11). `add_to_screen` with `source: "walk"` and `parcelNodeId` equal to a `draw.edges[].neighbor`. The screen gains one `resolved` row with that node and `source: "walk"`. `list_my_properties` length is unchanged.

### A14 query verbatim

A screen created from pasted text that includes `111 Rainmaker Cv, Bastrop TX` stores that string in `row.query` whether the resolver returns a node, zero hits, or ambiguous hits. The row is never omitted. The stored query is never rewritten to `Cove`. Pair with the Cove form as a second row so the two strings remain distinguishable.

### A6 / A11 (bind, already named on the WDLL)

A6: `set_property_status` on a saved id survives reload and appears on `list_my_properties`. A screen-only id refuses `saved_property_not_found` and the screen row still has no status field.

A11: `get_smart_site` on a node absent from both tables returns `draw` (or the honest miss the tool already returns). Save is a later turn.

## Three-question gate

1. What executes this? Cortex route plus MCP tool in `legacy-design-tools/artifacts/smartsite-mcp`. Postgres check constraints on write.
2. What triggers it? The five named tool calls, and the existing DELETE for the unsave half of A12.
3. What fails when violated? Unknown source or status: tool refuse, no row. Punctuation-only query dropped: A5/A14 fail. `create_screen` inserting a save: A5/A12 fail. `list_my_properties(screenId)` accepted: schema refuse test fails. `set_property_status` on a screen-only id succeeding: A6 fails. `get_smart_site` joining saves: A11 fails.
4. What bypasses it? Workbench PUT that writes `snapshot.status` in the old vocab. Raw SQL. A later sixth tool not on connector item 12. Those paths are named, not claimed as none.

## Falsifiers

A5 is wrong if the saved-list count rises, or if any of the six misses is missing from `rows`, or if an unresolved `query` does not equal the input string.

A12 is wrong if any screen `query` or `ordinal` changes across save or unsave, or if unsave deletes a `pe_screen_rows` row.

A13 is wrong if `source` is not `walk`, or if a save row appears.

A14 is wrong if `Cv` is stored as `Cove` or if the `Cv` row is absent.

A11 is wrong if `get_smart_site` returns not-found because no save or screen row exists.

## leave_behind

- item: workbench `snapshot.status` (`researching` \| `offer` \| `passed`) and MCP `crm_status` (`New` \| `Watching` \| `Chasing` \| `Passed`) are two fields. This card does not unify them.
  owner: planner
  plan_row: P-92
- item: no MCP `unsave_property` or `delete_screen`. A12 unsave uses existing REST DELETE. Screen soft-delete column is unused until a named tool exists.
  owner: Wave B implementer
  plan_row: P-92
- item: `list_screens(screenId?)` is the reopen path so the catalog stays at five new tools. Authorising `get_screen` is a connector amendment, not a silent sixth tool.
  owner: planner
  plan_row: P-92

## Planner review 2026-08-28

Accepted as the Wave B contract. Re-read this session: `peSavedProperties.ts` matches the listed columns and unique `(tenant_id, owner_user_id, parcel_node_id)`; `propertyExplorer.ts` PUT sets `snapshot` from `body.snapshot ?? {}` on conflict; `DossierStatus` is `researching | offer | passed`; drizzle tops out at `0087_p85_portal_canary.sql`. Two-table split, no `screen_id` on saves, no listing columns, I6 read path, and the A12 four-sentence fixture all bind.

Accepted leave-behinds (do not absorb):

1. Vocab stays split. No silent map.
2. No sixth tool. Reopen is `list_screens(screenId?)`. That optional argument is a planner widening of the WDLL `list_screens()` spelling, not `get_screen`.
3. Item 18 "deletable" is the `deleted_at` column plus a later named tool. v1 has no MCP delete.

Wave B constraints that are not new scope:

- MCP save and status must not call the existing PUT. A dedicated write that leaves `snapshot` untouched is required. A test that PUTs `{}` after an MCP save and still sees `crm_status` is the falsifier for column survival; a test that MCP save itself wipes `snapshot` fails this spec.
- `create_screen` of forty resolver calls inherits O4/O7 abort. Name parallelism and a per-query timeout. A hang that drops rows is an A5 fail. Do not silently truncate.
- `A20` in an earlier draft of this file meant item 20.

Wave B does not start until CP2 on the remaining Wave A honesty returns. No LDT write from this review.
