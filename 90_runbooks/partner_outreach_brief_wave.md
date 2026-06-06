---
id: partner_outreach_brief_wave
title: Partner outreach — Property Brief data wave (2026-05-30)
status: active
last_updated: 2026-05-29
applies_to: portfolio
related: [73_partnerships, 75c_property_brief_data_backlog, 77_place_graph_strategy, 49b_encumbrance_ingestion_pipeline]
owner: nick
---

# Partner outreach — Property Brief data wave (2026-05-30)

> **Operator use.** One-page asks for tomorrow's partner calls. Full backlog: [`75c_property_brief_data_backlog.md`](../75c_property_brief_data_backlog.md). Partnership policy: [`73_partnerships.md`](../73_partnerships.md).

## Hauska position (30 seconds)

We are building a **place graph**: resolve an address → cited layers (law, parcel, environment, private restrictions, operational precedent). Property Brief is the broker-facing taste; the substrate is MCP + licensor rev-share. We **pay licensors on agent consumption**; we do not host code or recorder data without a deal.

---

## 1. General Code (eCode360) — highest leverage for Central TX

**Why now:** Largest **access-blocked** bucket in Texas ingest. Smithville, Pflugerville, Cedar Park, Kyle, Buda, Liberty Hill, Bee Cave, McAllen, and Dallas-city track all sit behind eCode360 bot policy.

**Ask:**

1. **Integrator catalog license** — programmatic TOC + section HTML/JSON for atomization (not browser scrape).
2. **Change notifications** — webhook or feed when a city amends code.
3. **Atomize + derivative rights** — `code-section` atoms in Hauska catalog with `ll_uuid`/jurisdiction join; MCP retrieval for agents.
4. **Revenue share** — metered Layer 2 agent retrieval; Hauska pays on consumption (contrast with UpCodes-style free hosting).
5. **Pilot cities** — name 3 unlock cities for 30-day proof: **Kyle, Pflugerville, Smithville** (Central TX broker corridor).

**Do not ask for:** national scrape rights, PDF bulk without structure, exclusive.

**Fallback:** city-by-city MOU if corporate deal is slow; still route through GC where city is on eCode360.

---

## 2. ICC (International Code Council)

**Why now:** Layer 1 model code blocked on API credentials; every Texas brief needs **effective IRC/IBC/IECC** stack.

**Ask:**

1. **Code Connect API** — OAuth + OpenAPI; ingest path ready in `hauska-engine` (`icc-code-connect` adapter).
2. **Adoption metadata** — which edition each Texas city adopts (feeds effective-code resolution).
3. **Agent metering partnership** — ICC paid on agent retrieval volume through Hauska SDK (pitch in [`73_partnerships.md`](../73_partnerships.md) § Standards-body).

**Lead with:** "We pay you on agent retrieval; we keep ICC as citable source of truth."

---

## 3. County clerk (Bastrop, Travis, Williamson)

**Why now:** Plane B (deed restrictions, easements) and mineral index require **legal description**, not street address.

**Ask:**

1. **Recorded instrument search API** or scheduled bulk by legal description / APN.
2. **MOU template** — same revenue-share shape as Bastrop city; Layer 2 on encumbrance queries.
3. **Pilot scope** — index-only triage ("hits 1980–today" vs "none indexed"); not title insurance.

**Start county:** **Williamson** (Round Rock / Georgetown pilot demos) or **Bastrop** (existing relationship).

---

## 4. Bastrop city (operational precedent)

**Why now:** Only partnership city with live SmartCity data.

**Ask:**

1. Enrichment APIs for **permits + plan review findings** on the `property-workspace` place node only (no parallel brief stack).
2. GIS layers on **Generate Layers** first; brief inherits via place graph when ready.

**Reference:** wave 0e rule in [`73_partnerships.md`](../73_partnerships.md) § Property Brief place-node enrichment.

---

## 5. HOA / management company (one subdivision pilot)

**Why now:** Brokers ask "is there an HOA?" — Regrid cannot answer restrictions.

**Ask:**

1. One **master-planned community** CC&R + design guidelines corpus (PDF or structured).
2. License to atomize into `restriction-corpus` linked to subdivision plat ID.
3. Optional: resale certificate metadata feed (advisory, not legal advice).

**Target profile:** Large Williamson or Hays HOA (operator picks community with Valerie deal flow).

---

## 6. American Legal Publishing (optional if GC call goes well)

**Ask:** Same integrator shape as General Code for **Harker Heights** and cities on `codelibrary.amlegal.com`. Lower priority than GC.

---

## Call order (recommended)

1. General Code  
2. ICC  
3. Williamson or Bastrop county clerk  
4. Bastrop city (Sylvia path)  
5. HOA pilot (warm intro via Valerie network)

---

## Internal do-not-commit on calls

- Do not promise title insurance or clear-title outcomes.
- Do not promise Dallas city code until AmLegal/GC deal exists.
- Do not scrape eCode360 if call fails — stay partnership-track per Commitment #2.

---

## Revision history

- **2026-05-29:** Filed for operator outreach wave tied to [`75c_property_brief_data_backlog.md`](../75c_property_brief_data_backlog.md) P1 items PB-101–107.
