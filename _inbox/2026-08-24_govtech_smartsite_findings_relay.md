---
id: 2026-08-24_govtech_smartsite_findings_relay
title: Govtech-thread SmartSite findings — filed onto PE canvases
status: active
date: 2026-08-24
from: govtech seat planner (relayed)
to: SmartSite / integration planner
plan_row: P-60
---

# Govtech findings that land on SmartSite

Source: govtech seat planner, 2026-08-24. Nine read-only code reviews at named commits plus a five-agent remediation pass. Snapshots they named: hauska-engine `60adb1f` then main `cfa18bc` after PR #361; hauska-map `origin/main` `57ca035` with open PRs #211 and #183; hauska-mcp-server `bdbb99d` then main after PR #75; smartcity-os `e2fcdd1` (read-only).

This file is the durable source the canvases cite. It does not start a fourth program. Findings go onto the recalibration board (hygiene / parked / kit / govtech-relay view) and, where they are parcel-store claims, onto the public-facts register.

Anything the SmartSite planner did not re-measure in this session is marked RELAYED.

## This-session checks (2026-08-24 ~18:30)

- hauska-map #211 squash-merged `d22fe2d`. Production `dpl_6auCPAsahr45ia8eyrUzYtSZPZdt` aliased to https://smartsite.cloud. Live HTML serves `index-daRWF8c7.js`.
- PE ICC citations are OFF. `iccCitationStatus()` is live only when `VITE_ICC_CITATIONS_ENABLED === "true"`. The A2 modal on that same bundle prints the hold-list footnote. Section 6 is theoretical for SmartSite until that flag is on.
- Travis identity-join is still draft only: `_inbox/2026-08-24_lane3_travis_identity_join_WDLL.md` (`operator_go: needed`). Not started.

## Findings

### 1. Access-policy fail-open — new writes refuse, old rows not backfilled

VERIFIED by govtech at source, pre and post engine PR #361 (`cfa18bc`). Pre-fix `resolveAccessPolicy` returned `maybePolicy ?? "public-free"` at both INSERT sites. DB column DEFAULT `'public-free'` is a second layer. `atomize()` stamped the jurisdiction-corpus atom only.

Migration 010 NOT applied. Backfill NOT run. Old rows still mis-stamped.

WHY THIS REACHES SMARTSITE: parcel / road / flood / boundary atoms are correctly public-free, so the default was invisible there. The exposure is the code corpus, not the property corpus. Do not tell the SmartSite lane that ~100M rows are mis-stamped.

Size it on Neon db `hauska_mcp` (not `neondb`). Read the BODY, not the column. `access_policy` is write-only; the gate reads JSONB.

```sql
SELECT entity_type,
       body->>'jurisdictionTenant' AS tenant,
       body->>'accessPolicy'       AS body_policy,
       access_policy               AS column_policy,
       count(*)
FROM atoms
WHERE entity_type IN ('code-section','code-edition',
                      'code-definition','code-cross-reference')
GROUP BY 1,2,3,4 ORDER BY 5 DESC;
```

Board: recalibration hygiene + govtech-relay. Not a public-facts row.

### 2. Two SmartSite-territory defaults still on engine main

VERIFIED by govtech after #361:

- `packages/engine-core/src/road-intake/descriptor-from-registry.ts:71` — `defaultAccessPolicy: row.defaultAccessPolicy ?? "public-free"` (OSM statewide roads from Geofabrik)
- `packages/engine-core/src/depth-warm/emit-boundary-edges-from-warm.ts:85` — `descriptor.defaultAccessPolicy ?? "public-free"`

Govtech classified both DEFENSIBLE (public OSM / public boundary). That is a SmartSite data-posture ruling made inside a govtech thread. SmartSite should confirm or overturn. If confirmed, convert to explicit declarations rather than `??` so the next audit does not re-open them.

Planner recommendation (not a closed ruling): CONFIRM, then make them explicit. OSM roads and public boundary edges are public-record. A silent `??` is the defect, not the value.

Board: recalibration parked + govtech-relay. Owed ruling.

### 3. load-snapshot-into-pg.mjs bypasses the new refusal

VERIFIED by govtech. `packages/storage/scripts/load-snapshot-into-pg.mjs:107` and `:197` write `inst.accessPolicy ?? "public-free"` straight to Postgres and do not call `resolveAccessPolicyOrRefuse`. Three references in-repo. Likely ops, not live ingest. It is still the answer to "what bypasses this control," and it touches the whole atoms store including SmartSite data.

Planner recommendation: treat as ops-only until a live caller is named; still close the `??` on that script so the bypass is none.

Board: recalibration hygiene leave_behind. Property-owned.

### 4. Site-plan PDF (G-104) — measured, unfixed

RELAYED from 2026-08-20 VPAT/ACR. Server-side pdf-lib from engine-api. `render.ts:373` draws tracked runs glyph by glyph; 64.4% of extracted lines are a single character (268 of 416). A tagged version would pass automated 504.2.2 and still be unreadable.

Sequence: `setTitle` / `setLanguage` first (kills two of five failures); glyph-run drawing is its own card.

Identity: PE `filenameFor` → `48021_34649_site_plan.pdf`; `render.ts:1152` builds `SP-48021-34649`.

Engine PR #352 (`feat/g103-tagged-pdf`, head `4e0f4555`) is still open and deliberately unmerged. Six new files, zero modified, opt-in, zero callers, CI success. 2026-08-20 ruling: site-plan generator is working software; remediation is ADDITIVE AND OPT-IN. Do not merge as a drive-by.

Board: recalibration parked + design-drop / Reports adjacency. Do not fold into Option D IA.

### 5. SmartSite is the one mount G-13 actually names

VERIFIED by govtech against `_decisions/2026-08-17_g13_consumer_contract.md`. Application column names an embed for exactly one supplier: SmartSite via `smartsite.cloud/?parcelNodeId=`. Smart Files is HTTP + service key. Plan review is Cloud Run HTTP + Codex tools.

SmartSite's iframe is contract-conformant. Plan-review and Smart Files iframes are the deviations. If govtech converges its presentation plane, SmartSite's embed stays.

ACR/VPAT: Dashboards mounts SmartSite in an iframe, so a Dashboards user reaches the untagged pdf-lib PDF without leaving the product. Conformance scope cannot stop at "Dashboards emits no documents."

Board: recalibration sc-kit.

### 6. ICC meter cannot tell ICC what SmartSite cited

RELAYED, partially verified by govtech. ICC is metered across SmartSite and Plan Review (OPS-17 shared leg S-4).

- Ledger records the served atom, not the cited ICC atom. `citedAtomDid` triggers accrual and is discarded. No `book_id` / `section_id` column. Setback-driven accruals are the property surface's main ICC route.
- `sourceActorDid` is populated in one function (`atom-shape.ts:117`) reached by 3 of 26 envelope builders. `search_atoms` nulls the adapter, so a search returning real ICC sections is gated as ICC and accrues zero.

MCP PR #75 merged the meter bypass and detector split. The book/section gap and builder starvation are NOT closed.

Standing constraint: do not set a real per-reference ICC rate until bypass and detectors are closed.

This session: PE citations are OFF. Section 6 is not urgent for SmartSite until `VITE_ICC_CITATIONS_ENABLED` is true.

Board: recalibration parked / govtech-relay.

### 7. Live Bastrop city app cannot reach SmartSite

RELAYED from G-18 inventory 2026-08-17, not re-verified this session. Live smartcityos.io CSP `connect-src` is self + `smartcity-api-*.run.app` only. No smartsite.cloud, no plan-review-app, no smart-files, no cortex-api. Live bundle `smartsite.cloud=0`, leaflet=11, arcgisonline=16.

The live city runs its own Leaflet + Esri stack. G-45 closed "Dashboards staff map is SmartSite" for the TEMPLATE product, not the live city. Do not read G-45 as Bastrop being on SmartSite.

Board: recalibration sc-kit + public-facts callout.

### 8. Two substrates share a writer

Observation, not a request. hauska-engine carries the jurisdictional code corpus (govtech, contested policy) and the physical parcel/road/boundary corpus (SmartSite, nearly all public). They share a writer, which is why an ICC-motivated card reached road-intake. Whether that seam becomes a repo split is a SmartSite-thread question. Flag the coupling. Do not propose the surgery.

Board: recalibration hygiene.

## Three asks for this lane

1. Confirm or overturn the two public-data defaults in section 2.
2. Decide whether `load-snapshot-into-pg.mjs` is live or ops-only, then close the `??` either way.
3. Confirmed this session: PE ICC citations are still off. Section 6 waits on that flag.
