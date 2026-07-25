---
id: 2026-07-25_GATE_B_checkin_f1a_console_audit
title: GATE B check-in — F1a console audit + operator visual-QA trio
status: gate_checkin
date: 2026-07-25
applies_to: hauska-map/apps/command-center, hauska-map/apps/property-explorer, hauska-mcp-server, hauska-engine
implements: [27a_jurisdiction_factory_engine_spec, 27b_f1_command_center_completion_program]
wdll_items: [2]
guardrails: [G1, G5, G6]
owner: nick
related: [2026-07-25_GATE_A_checkin_f1_phase0_retrieval_restore, 2026-07-25_f1a_console_audit]
---

# GATE B check-in — F1a (to the doc_repo planner)

Receiving build planner halt. F1a is read-only and complete. Full audit: `_inbox/2026-07-25_f1a_console_audit.md`. Do not start F1b wiring until the operator reviews the drift-map and gives the go.

Cited: `27a` WDLL 2; G5 (true AND available in the app); G6 (one canonical id).

Gate A commit on doc_repo: `c1f2b96` (tally = G1 source of truth).

## Operator visual-QA trio (app surface — verbatim)

### QA-1 STALE-vs-LIVE READ — verdict: LIVE path, STALE SEMANTICS

Named parcel: `48453:1000032` (Travis SF-2) and `48209:156346` (Hays gold).

Live PE facets:

```
GET https://property-explorer-xi.vercel.app/api/spine/property-atoms/48453%3A1000032/facets
HTTP 200 X-PE-Read-Path=atom-chain
readPath=atom-chain source=atom-chain snapshotAt=2026-07-24T20:57:30.744Z
zoning={"district":"SF-2"}
envelope.status=ok
```

App screenshot (2026-07-25): Zoning **SF-2**, Setbacks **F 25' · S 5' · R 10'**, stamp **Verified · gate-passed · 2026-07-24**.

Finding: the card IS on the restored live atom-chain path (`X-PE-Read-Path: atom-chain`). The date is `bakedAt` / atom `fetchedAt` from the breadth bake, not a cache of the OOM-era backend. InspectCard hard-codes the label "Verified · gate-passed" + `bakedAt.slice(0,10)` (`InspectCard.tsx` provenance block). Operators misread bake provenance as "last verified the read path."

Wiring note for F1b (do not fix in F1a): split "atom provenance date" from "read-path freshness / retrieval revision."

### QA-2 SITE-PLAN `MCP response missing parcelNodeId` — verdict: ID-FLOW / ERROR-MASKING (G6 class); audit only

Error originates in PE BFF mapper, not as a raw MCP string:

```118:132:P:/hauska-map/apps/property-explorer/api/_lib/pe-site-plan-export-core.ts
export function mapMcpSitePlanPayload(...) {
  ...
  if (!parcelNodeId || !isValidParcelNodeId(parcelNodeId)) {
    return { ok: false, message: 'MCP response missing parcelNodeId.' }
  }
}
```

Drop / mask chain (read-only trace):

1. Engine `POST .../site-plan-export/refresh` returns `{ atom, artifacts, flags }` with **no top-level `parcelNodeId`** (id is only in the URL param).
2. MCP `refresh_parcel_site_plan_export` re-adds `parcelNodeId: parcel_node_id` inside ToolEnvelope `data` (`tools.ts` ~929–939), then `envelopeContent` JSON.stringifies the envelope.
3. PE `callMcpTool` (`mcp-server-client.ts` 115–127) parses **only** `content[0].text` and **drops MCP `isError`**. Plain-text MCP errors become `{ raw, meta }` → mapper reports "missing parcelNodeId" (false diagnosis).
4. Same false message is returned when an id is present but fails `isValidParcelNodeId` (missing conflated with invalid — G6).
5. Same false message is returned when an id is present but fails `isValidParcelNodeId` (missing conflated with invalid — G6).
6. Regex drift (G6): MCP tool `/^\d{5}:\d+$/` vs PE BFF `/^\d{5}:[^/]+$/`.
7. Hardening note for site-plan agent (not F1a): PE already validated `parcelNodeId` on POST — mapper can fall back to the **request** id when MCP envelope drifts; MCP tests should assert `data.parcelNodeId`.

Anon POST live: `POST /api/pe-site-plan-export` → **401 authentication_required** (healthy gate). Paid path not exercised this session (no session). Site-plan agent owns the fix; F1a records the shared-substrate seam.

### QA-3 "not verified here" on P-3 / known-good — verdict: APP READS LIVE DATA; UI VOCABULARY LIES

**P-3 Bastrop `48021:34169`** (operator named):

```
X-PE-Read-Path=atom-chain
zoning={"district":"P-3"}
envelope.status=no-buildable-area emptyReason=Setbacks consume the lot...
retrieval: zoningFact.district=P-3 setback.front=25 envelope.outcome.kind=no-buildable-area
```

App screenshot: Zoning **P-3**, Setbacks **F 25' · S 0' · R 0'**, yellow line **"Setbacks consume the lot — no buildable area remains."**, but Buildable row still **"not verified here"** and persona **"Setbacks and buildable area not verified here yet (P-3)"** — contradictory.

**Known-good Travis residential `48453:1000032`:**

App: Zoning SF-2 + setbacks live (proves restored data IS available in the app). Buildable row still "not verified here" because `toBakedCardModel` only marks buildable present when `buildableAreaPct` is a number (`baked-facets.ts` 204–207), while atom-chain adapter often omits pct when geometry is absent (`atom-chain-to-facets.ts` 252–267 disclosure: "geometry absent on proof atom").

**zoning_absence: 0** in Gate A tally: honest outcomes are encoded as envelope `outcome.kind` / empty district on zoning-fact, not as `entity_type=zoning-absence` rows. Not a missing read of restored data.

## Doc_repo planner adversarial note

Re-probed PE facets + browser screenshots independently of the build narrative. Backend healthy ≠ app-correct is confirmed. F1b must treat inspect vocabulary + site-plan id-flow as first-class wiring inputs, not polish.

## HALT — operator go required

Next on go: **F1b** per the wiring map in the audit doc (Node & Graph → retrieval, shared component fold-in, PE customer-safe Map|Ledger, one read-path). No F1b until go. No supply engines.
