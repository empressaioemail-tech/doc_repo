---
id: 2026-08-16_ops17_four_lane_alignment
title: OPS-17 four-lane alignment — G-60 sits on C+D, A already ran, B stays last
status: active
last_updated: 2026-08-16
applies_to: portfolio
owner: nick
related: [90_operations/OPS-17_govtech_stack_plan_of_record, 2026-08-16_icc_demo_program_WDLL, 80_adrs/adr_023_cortex_reporting_repo_designation]
---

# OPS-17 four-lane alignment

Source: `90_operations/OPS-17_govtech_stack_plan_of_record.md` frozen 2026-08-14. Four lanes, five layers. G-60 does not replace that map.

## The four lanes (unchanged subjects)

| Lane | Subject | Original primary repo | Live housing 2026-08-16 | Sequence |
|---|---|---|---|---|
| **A** | Smart Files (twin documents) | LDT (prototype) | `empressaioemail-tech/smart-files`, Neon `snowy-bread-83475727`, GCP `smart-files-505619` | FIRST (A-007). Isolation G-58 CLOSED. QA rooms G-59 CLOSED on serving path. Sale G-53 OPEN. G-58b DROP waits L26. |
| **B** | SmartCity / Bastrop | `smartcity-os` | **absolute no-touch** | LAST. Consumes A, C, Smart Site. G-52 blocked on G-51. Not this wave. |
| **C** | Plan Review (twin adjudications) | LDT cortex-reporting (ADR-023) | Serving home is `empressaioemail-tech/plan-review`, GCP `plan-review-505715`, own Neon. ADR-023 still names LDT as the function *package*. Isolation is housing, same move as A. | Parallel to A once A can be mounted. A is mountable now. |
| **D** | ICC (licensed source, one ledger) | hauska-engine | Atoms stay on hauska_mcp. Meter at MCP. Activity portal is C's Vercel `/icc/activity`. | Parallel. G-50 keeps the SaaS/public-paid half. G-60 is the PoC demo half. |

Hauska MCP is not a fifth lane. It is the agent gate (S-5) in front of A and C, and the meter gate for D.

## Why A ran first (A-007 still true)

Three seams needed files before C/B: B consumes A; plan review document handling rides A; Bastrop document capture needs the artifact store. G-58/G-59 delivered the mount. G-60 C files-room uses that mount. Do not remount Smart Files onto Cortex (G-58 404 stands). Plan-review is the opposite: pull the BFF into `plan-review`, then remount `/api/plan-review` on cortex as a proxy (A-026). Do not treat PE save/share as Smart Files.

## What G-60 is on this map

Operator fused C + D + MCP into one demo because ICC's offer **is** complete plan review plus a finished MCP, watched on an activity portal.

| OPS-17 row | Lane | G-60 relationship |
|---|---|---|
| G-15, G-16, G-22, G-31, G-40, G-51 | C | Graded live by the G-60 WDLL. Host is Vercel `plan-review-app`, not LDT `artifacts/plan-review`. |
| G-17, G-23, G-30, G-41 residual | D | Graded live by G-60. IPMC `--apply` still waits L26. |
| G-50 | D | **Not** graded. Demo + signed SaaS stay glued in the baseline; G-60 is demo only. public-paid stays off. |
| G-52, G-18, G-21, G-33 | B | Out. No-touch `P:\smartcity-os`. |
| G-53, G-44, G-20 | A remainder | Out of G-60. Sale and Bastrop corpus capture are later A. |
| S-1 G-11 | shared | QA personas, not G-11. Same as G-59. |
| S-3 | shared | E6 compose from hauska-map in a clean worktree. Full SmartCity mapping adoption is B, later. |
| S-4 | D executes | G-60 item 19. |
| S-5 G-13 | shared | CLOSED 2026-08-17. Decision `_decisions/2026-08-17_g13_consumer_contract.md`. Caller split: UI HTTP/embed; agents on one Hauska MCP. |

## Drift this wave must not re-introduce

- Lane C serving from LDT or cortex-prod (L26 holds that store).
- A second MCP server.
- Command Center as the ICC portal (G-56/CC is operator console, not the ICC surface).
- PE ICC citations on (pre-SaaS).
- Claiming G-50 or G-53 closed.
- Editing the OPS-17 baseline lane table. Housing change is amendment A-025.

## Next on G-60 (after foundation SQL)

1. Cloud Run `plan-review` in `plan-review-505715` us-east1. Probe `GET /`.
2. MCP substrate: catalog true, health not ok-on-404, Cotality fail-closed (WDLL 14-15). Slot-free.
3. G-30 ingest-code fix slot-free; bounded ICC UPDATE only when L26 `--apply` is quiet.
4. F1-F7 + map + letter + files + `/icc/activity` on Vercel `plan-review-app`.
5. Codex tools retarget + Smart Files writes + `icc_activity_list`.
6. Walk. Honest close. G-51 becomes gradable. B still waits.
