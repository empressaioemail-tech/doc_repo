# P-91 / P-92 screen-save schema scratch (Wave A)

PLAN-ROW: P-91 / P-92. Inbox spec `_inbox/2026-08-28_p91_screen_save_schema.md`. No product code.

## LESSON

Workbench dossier status lives in `pe_saved_properties.snapshot.status` as `researching | offer | passed` (`propertyDossier.ts`). WDLL CRM is `New | Watching | Chasing | Passed`. They are different types. Putting CRM in `snapshot` mixes them and inherits the PUT that replaces the whole jsonb.

## LESSON

Existing cortex PUT `/saved-properties/:parcelNodeId` does `onConflictDoUpdate` of `snapshot` from `body.snapshot ?? {}`. An MCP save routed through that PUT wipes drawings, chat threads, and pins. Wave B must UPDATE `crm_status` / `note` columns and leave `snapshot` alone.

## GROUND-TRUTH

2026-08-28: `pe_saved_properties` columns are id, tenant_id, owner_user_id, parcel_node_id, label, snapshot, created_at, updated_at. Unique (tenant_id, owner_user_id, parcel_node_id). No screen table exists. Connector item 12 authorises five tools, not shipped. `tools/list` is still 8.

## OPEN

Planner review closed 2026-08-28. Vocab stays split. Reopen is `list_screens(screenId?)`. Wave B waits CP2.
