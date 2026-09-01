---
id: 2026-08-24_phase_close_CP1
title: Phase-close live QA CP1 — design freeze before isolated builds
date: 2026-08-24
plan_row: P-60
wdll: _inbox/2026-08-24_phase_close_live_qa_WDLL.md
---

# CP1

Seat: integration planner. doc_repo `main` @ `d1c6b93`. Operator go: land owner gate, checkout popup, labeled chat web-search; canvas is the durable history.

## Product freeze

1. Owner name is Studio or Team. Identified is not enough. Unlock and Solo refuse. Write path to read: `ownerFactRead.ts` + `brokerageNodeFacets.ts` + InspectCard Owner row. Mechanism that would look the same: GIS `ParcelCardData.owner` paint. Rejected if the row still keys `ownerFact` only; then the leak is serve, not bake.
2. Checkout chrome is a modal sibling of PricingModal. Money path unchanged (`elements`, webhook, prices). Do not invent card fields.
3. PE chat corpus-miss uses the existing labeled web-search path (2026-06-17 brief). Citation is `websearch:`. Allowlist is official civic domains. No ICC body.
4. Find 404 toast on an already-mapped Chestnut parcel is a separate PE item on the same tree as checkout.

## Scout-verified write paths (2026-08-24)

Planner re-read the cited serve/chat gates. GIS/CAD owner paint is rejected: Inspect keys `ownerFact` only; facets strip bake owner keys.

1. **Owner leak:** `brokerageNodeFacets.ts` `isIdentifiedOwnerFactCaller` is `authenticatedBrokerageUserId != null` (any signed-in PE user). Then `loadOwnerFactAtom`. No Studio/Team check. Paint: `fact-sheet-resolver.ts` `ownerFromInspectWire` when `state === present`.
2. **Chat miss:** PE `POST api/brokerage/v1/research/chat` (`chat-research.ts`). Handler `brokerageBrief.ts` `/research/chat` loops `retrieveAtomsForQuestion` only. Brief web-search (`brokerageBriefLocalCode.ts` / `supplementCodeSectionsWithReasoningGrounding`) is not imported on that route.
3. **Find 404:** Address fallback `lib/parcel-lookup.ts` → `fetchBuildableEnvelope` → POST `/brokerage/v1/place/buildable-envelope` 404 `no-parcel`. Situs search swallows errors. Exact toast string `Error fetch property search results: 404` is not in serving SHA; live banner is the envelope miss mapped through `ExplorerMap` `lookupError`.

## Isolated trees

- LDT: `P:/tmp/ldt-phase-close` from `origin/main` (items 1, 4)
- PE: `P:/tmp/hauska-map-phase-close` from `origin/main` (items 2, 3, 5)

Sub-agents do not commit. Do not write property seat checkouts.
