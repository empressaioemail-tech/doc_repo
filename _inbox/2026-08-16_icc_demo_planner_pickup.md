---
id: 2026-08-16_icc_demo_planner_pickup
title: Planner pickup — ICC demo program (G-60 CLOSED_ON_DEMO_PATH)
status: active
last_updated: 2026-08-16
applies_to: portfolio
owner: nick
related: [2026-08-16_icc_demo_program_WDLL, 2026-08-16_icc_demo_adversarial_review]
---

# Planner pickup: complete plan review + finished MCP = ICC portal

Read this first. Then the program WDLL. Then the container that owns your items. Do not re-derive the done line.

## Gate

Gate is closed on the demo path (WDLL walk/close 2026-08-16). Residuals (store UPDATE, F4 ingest, E6) stay named. Planner executes those only when L26 is quiet or as slot-free optional work. Compiled dispatch if handed off: `node scripts/dispatch.mjs --plan OPS-17 --lane <ID> --plan-row G-60`.

DSN is on disk. Foundation SQL applied. Cloud Run live 2026-08-16 (`plan-review-00006-duj` @100% tag `g60c`, `GET /` 200). Vercel `plan-review-app` live at `https://plan-review-app-ten.vercel.app` (`dpl_GKnnEH6Z38yPDfJQB9NtuX3FkwzX`). MCP `hauska-mcp-server-00074-tar` @100% tag `g60d` (anon ICC withhold, PR #69 `0316d0a`). Extract-remount A-026 DONE on serving `cortex-api-00519-muq` (WDLL 24). G-30 ingest hardcode gone on engine main **#346** `ebe6d63`. Store UPDATE is a residual (A-008 / A-028). Do not wait on L26.

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
2. **DONE 2026-08-16.** Cloud Run live. Serving now `plan-review-00006-duj` @100% tag `g60c`. `GET /` 200 at `https://plan-review-ozx33wafia-ue.a.run.app`. Origin `8cf82e7` (share hotfix `1a6ac83` + escapeHtml). Prior `00004-xez` tag `g60b` @0%, then `00003-ws8`.
3. **DONE 2026-08-16 (API).** Elevate BFF with Smart Files as the document plane (A-027). Live intakes + upload + dataroom-atoms. Files `smart-files-00004-npd` has icc-demo personas. Share POST 201 `{store:smart-files}`.
4. **DONE 2026-08-16.** Vercel project `plan-review-app` (`prj_zn2fPbov1Egj8hyym8Qu3HTKixQJ`) production `https://plan-review-app-ten.vercel.app` `dpl_GKnnEH6Z38yPDfJQB9NtuX3FkwzX`. Unauthed `/icc/activity` 401. WDLL 3 met. WDLL 4 queue met. E6 map is envelope overlay (item 11 partial).
5. **DONE 2026-08-16.** MCP Codex retarget + Smart Files writes + `icc_activity_list` on serving `hauska-mcp-server-00072-puy` @100% tag `g60`. WDLL 14-17 met. Keys minted: reviewer `fda41e99-190b-4d8e-abe8-3048f1e9a1d6`, observer `5f180044-f15c-4800-82da-d281a424aab3` (raw on disk, not git).
6. **DONE 2026-08-16.** Cortex remount (WDLL 24). Serving `cortex-api-00519-muq` @100% tag `g60`. Prod queue `x-plan-review-proxied: 1`. Files still 404. LDT PR **#436 MERGED** squash `85c5d1a8` (Test conclusion `success`). MCP PR **#68 MERGED** squash `12156a02`.
7. **DONE 2026-08-16 (code half).** G-30 ingest no longer hardcodes public-free. Engine PR **#346 MERGED** squash `ebe6d63` 2026-08-16T17:11:33Z (check-run conclusion SUCCESS). Store UPDATE is a residual (A-008). WDLL 5-6, 8-10, 12-13, 20-21 met on serving. WDLL 7/11/18/19 partial. WDLL 22-23 open.
8. **DONE 2026-08-16 (read-path).** MCP anon ICC withhold live. PR **#69 MERGED** squash `0316d0a`. Serving `hauska-mcp-server-00074-tar` @100% tag `g60d`. Anon list omits `icc-model-code`. Anon `get_atom` on `did:hauska:jurisdiction-corpus:icc-model-code` holds the body. Reviewer key still reads. Store UPDATE still residual.
9. **DONE 2026-08-16 (walk/close).** LIVE filled 2026-08-16T19:53Z. Close `_inbox/2026-08-16_icc_demo_close.json`. WDLL 22 met with same-planner caveat. WDLL 23 met. G-60 CLOSED_ON_DEMO_PATH. Residuals: store UPDATE, F4 pending DID, E6 not hauska-map compose. No second `--apply`. No G-58b DROP.

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
