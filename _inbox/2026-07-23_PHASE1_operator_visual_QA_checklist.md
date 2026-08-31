---
id: 2026-07-23_PHASE1_operator_visual_QA_checklist
title: Phase 1 hold — operator visual QA checklist
status: cleared
date: 2026-07-23
applies_to: property-explorer, hauska-mcp-server
related: [2026-07-23_PHASE1_FINISH_checkin_property_reasoning_substrate]
owner: nick
---

# Phase 1 hold — operator visual QA

**CLEARED 2026-07-23 (operator).** All checklist items checked out. Standing by — Phase 2 still not opened until operator call.

Base PE: https://property-explorer-xi.vercel.app

## 1. Known-good envelope (Hays) — use the Find bar or deep-link

**Do not rely on “709 Uhland Rd” map click alone.** That situs is shared by more than one CAD prop (map can land on APN **12236**). Gold atom parcel is **`48209:156346`**.

**Preferred (product UX):**  
1. Open https://property-explorer-xi.vercel.app (dismiss cold-open if shown).  
2. Top Find bar → paste **`48209:156346`** → Find.  
3. Inspect card should open with zoning **RS**, setbacks **25 / 5 / 10**.

**Or deep-link:** https://property-explorer-xi.vercel.app/?parcelNodeId=48209:156346  

**Facets JSON (optional):** https://property-explorer-xi.vercel.app/api/spine/property-atoms/48209%3A156346/facets → `readPath: "atom-chain"`.

## 2. Honest absence (Bexar)

Open parcel **`48029:410119`**.

You should see: zoning **absent** / “no zoning stamp” (or equivalent honest empty), **not** a fabricated district. Envelope declined for that reason. No I-2 / invent.

## 3. Cited reasoning chain

On the Hays parcel inspect card, read the zoning → setback → envelope story.

You should see: district cited, setbacks tied to a **code citation** (not a bare unlabeled number), envelope presented as derived from those inputs. Looks like a chain, not three disconnected facts.

## 4. MCP catalog tool (external caller)

In Cursor (or any MCP client) against live Hauska MCP, call **`get_property_atom_chain`** with `parcel_node_id`: **`48209:156346`**.

You should see: `status: ready` with zoning-fact (RS), setback-rule, and buildable-envelope atoms, stable `did:hauska:…` IDs. Anonymous / public is enough for this check.

## 5. Same tool, honest absence

Call **`get_property_atom_chain`** with `parcel_node_id`: **`48029:410119`**.

You should see: zoning-fact with **`no-zoning-stamp`** (or absence), setback/envelope pending or empty — **not** a fake district.

## 6. ICC accrual (source meter)

After any successful Hays chain read (PE inspect or MCP tool above), check the inbound obligation ledger (operator path you already use for MCP Neon / admin logs — `source_obligation_ledger` or the `source_obligation_accrual` log line).

You should see: a fresh row for **`did:hauska:actor:org:icc`** tied to the setback (or cited code) reference, tier **`free_anonymous`** or public, amount pending-rate OK.

## 7. No-atom parcel (anti-zombie sanity)

Open a parcel with no atom bake, e.g. **`48055:99991`**.

You should see: honest **pending / no atom path** for envelope — not a multiply-era invent and not a silent blank that looks like “no zoning exists.”

---

**Hold outcome:** cleared by operator 2026-07-23. Next move (PARTIALs vs Phase 2) waits on operator call.
