---
id: 2026-08-16_icc_demo_planner_pickup
title: Planner pickup — ICC demo program (G-60 in flight)
status: active
last_updated: 2026-08-16
applies_to: portfolio
owner: nick
related: [2026-08-16_icc_demo_program_WDLL, 2026-08-16_icc_demo_adversarial_review]
---

# Planner pickup: complete plan review + finished MCP = ICC portal

Read this first. Then the program WDLL. Then the container that owns your items. Do not re-derive the done line.

## Gate

Gate is open (WDLL approved, decision active, G-60 in OPS-17). Planner executes in this chat unless a compiled dispatch is handed off: `node scripts/dispatch.mjs --plan OPS-17 --lane <ID> --plan-row G-60`.

DSN is on disk. Foundation SQL applied. Cloud Run live 2026-08-16 (`plan-review-00003-ws8`, `GET /` 200). Vercel `plan-review-app` live at `https://plan-review-app-ten.vercel.app`. MCP Codex tools retargeted at plan-review on `hauska-mcp-server-00072-puy`. Extract-remount A-026 DONE on serving `cortex-api-00519-muq` (WDLL 24). G-30 still waits L26.

## Neon DSN on disk (operator)

```
powershell -File P:\plan-review\scripts\put-dsn.ps1
```

Paste the Neon URL at the prompt. File: `%USERPROFILE%\.empressa\plan-review.database_url`. Never git. Then:

```
cd P:\plan-review
node scripts\apply-sql.mjs sql\001_foundation.sql
```

## Equation

Complete plan review (spec 48 F1-F7 + E6 + letter + Smart Files, basic visual, own Vercel) plus a finished MCP (dead ends gone, catalog true, Smart Files writes, Codex tools retargeted at that surface) **is** the ICC offer. ICC watches it on `/icc/activity`.

A one-engagement stub with a meter pane is not this card.

## Files

| File | Role |
|---|---|
| `_inbox/2026-08-16_icc_demo_program_WDLL.md` | Start card |
| `_inbox/2026-08-16_blueprint_plan_review.md` | Container A. Items 1-13, 21 |
| `_inbox/2026-08-16_blueprint_mcp_icc.md` | Container B. Items 14-17 |
| `_inbox/2026-08-16_blueprint_icc_compliance.md` | Container C. Items 18-21 |
| `_inbox/2026-08-16_icc_demo_walk.md` | Script. Fill LIVE first |
| `_inbox/2026-08-16_mcp_honest_current_state.md` | Recon. Re-pin live |
| `_scratch/icc_demo.md` | Tier 2 |
| `_inbox/2026-08-16_ops17_four_lane_alignment.md` | OPS-17 A/B/C/D vs G-60 (A-025) |
| `_decisions/2026-08-16_plan_review_extract_and_remount.md` | Pull BFF into plan-review, remount cortex (A-026) |
| `_inbox/2026-08-16_plan_review_cortex_callable_inventory.md` | Live cortex routes to elevate |

Superseded: `_inbox/2026-08-16_c_wdll_lane_c_plan_review.md`, `_inbox/2026-08-16_mcp_wdll_monetizable_tested_discoverable.md`. First-pass F10 (stub functions) is reversed by WDLL A-003.

## Execution order

1. **DONE 2026-08-16.** GitHub `empressaioemail-tech/plan-review`, Neon DSN on disk, GCP `plan-review-505715`, foundation SQL applied.
2. **DONE 2026-08-16.** Cloud Run live. Serving now `plan-review-00003-ws8` @100% (source header). `GET /` 200 at `https://plan-review-ozx33wafia-ue.a.run.app`. Prior `00002-nbr`.
3. **DONE 2026-08-16 (API).** Elevate BFF with Smart Files as the document plane (A-027). Live intakes + upload + dataroom-atoms. Files `smart-files-00004-npd` has icc-demo personas.
4. **DONE 2026-08-16.** Vercel project `plan-review-app` (`prj_zn2fPbov1Egj8hyym8Qu3HTKixQJ`) production `https://plan-review-app-ten.vercel.app`. Unauthed `/icc/activity` 401. WDLL 3 met. WDLL 4 queue met. E6 map still honest-empty.
5. **DONE 2026-08-16.** MCP Codex retarget + Smart Files writes + `icc_activity_list` on serving `hauska-mcp-server-00072-puy` @100% tag `g60`. WDLL 14-17 met. Keys minted: reviewer `fda41e99-190b-4d8e-abe8-3048f1e9a1d6`, observer `5f180044-f15c-4800-82da-d281a424aab3` (raw on disk, not git).
6. **DONE 2026-08-16.** Cortex remount (WDLL 24). Serving `cortex-api-00519-muq` @100% tag `g60`. Prod queue `x-plan-review-proxied: 1`. Files still 404. LDT PR **#436 MERGED** squash `85c5d1a8` (Test conclusion `success`). MCP PR **#68 MERGED** squash `12156a02`. plan-review origin `e0c8e9d`. Dirty checkout untouched.
7. **NEXT.** G-30 code fix slot-free. Bounded ICC UPDATE only when L26 `--apply` is not live. Then G-17 + G-23.
8. Fill remaining walk LIVE. Dry-run. Program close.

## Slot / dirty trees

- L26 holds `--apply`. No second writer. No IPMC ingest.
- Never clean/stash dirty LDT. Never deploy from dirty hauska-map (property-explorer).
- E6 comes from a **clean** hauska-map worktree or published component into `plan-review-app`.
- Never touch `P:\smartcity-os`.
- Doc_repo commits planner-owned.

## Answers so you do not ask

- Two parcels: `48021:28286` (A) and `48021:27303` (B). B exists so F5 is true.
- Housing: own repo/Neon/GCP/Vercel. Not LDT artifacts.
- ADR-023 still names LDT as function home. Isolation is housing.
- Personas share tenant `icc-demo`.
- Rate `0.01` fixture unless the decision says otherwise.
- IBC live, IPMC typed absence in the code library. Do not claim two books populated.
- ICC portal is `/icc/activity`, not Command Center, not a pane glued to one engagement.
- PE ICC citations stay off.
- One MCP server. Codex tools retarget; reporting tools stay; Cotality dies.
- Circle / DNS / directory / SaaS / public-paid are not this card.
