# L4 slot-chain tee — scratch

## GROUND-TRUTH (2026-08-12T22:20Z)
- Flood scorer PR ldt #420 merged @ `1c22829` (CI Test/Typecheck/Build success).
- Flood crash dominant code `0xC000026B` = STATUS_DLL_INIT_FAILED_LOGOFF (host logoff), NOT STATUS_STACK_BUFFER_OVERRUN (`0xC0000409` = 0 events).
- Flood atoms: 2,524,094 / 181 counties; metros still 0; body.countyFips NULL on all.
- Footprint writer on main does NOT read `tx_building_footprint` (ML zip only) — writer gap.
- Close: `_inbox/2026-08-12_L4_slot_chain_tee_close.json`

## LESSON
- B1 prose crash-class labels must be re-checked against measured NTSTATUS hex before re-run plans.
- PowerShell UTF-16 capture corrupts `*.log` artifacts; parse with utf16le or avoid Tee-Object on Node.

## OPEN
- Drain legs when atoms slot free; footprint/wells blocked on writer gaps (L1/L5).
