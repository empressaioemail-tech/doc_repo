---
id: 2026-09-16_scaleup-le_card_spec
title: L-E customer-experience card spec — what the property card, the MCP answer and the PDF must show
date: 2026-09-16
kind: spec
owner: dispatch-planner-le (OPS-24 lane scaleup-le-customer-experience)
plan_rows: [P-197]
status: draft, written before grading, per the lane's own step order
related:
  - _decisions/2026-09-11_ruling_b_reversed_polygon_only.md
  - _decisions/2026-09-11_setback_source_most_current_wins.md
  - _decisions/2026-09-11_ledger_as_serving_path_seven_steps.md
  - _decisions/2026-09-11_not_specified_semantics_and_no_approximation_state.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md (rows A-164, P-209, P-210, P-217)
  - _catalog/dispatch_missions/mission_p199_smartsite_auth_gate.md
  - _catalog/dispatch_missions/mission_p246_value_history_tier_gate.md
  - _inbox/2026-09-16_texas_scaleup_program_scope.md
---

# What a customer must see — the L-E spec

This is written BEFORE any fixture is graded, per the lane's own instruction. Every requirement
below cites the ruling or finding it comes from. A field with no citation is not in scope for
this spec and is not gradeable against it (it may still be recorded as an observation).

## 1. Address block

- **Full address, city, ZIP**, taken from the ledger's `situsAddress`, `situsCity`, `situsZip`
  — never composed from a county name alone. **Fails on**: a card that shows only the county
  and a raw street line with no city, e.g. "Travis County / 203 E Oxford Dr / SF-S" with no
  "Pflugerville" anywhere, although the ledger holds `situsCity` PFLUGERVILLE, `situsZip` 78660,
  `cityLimits` Pflugerville (`_inbox/2026-09-16_texas_scaleup_program_scope.md` §2e, "the card
  does not name the city"; X2 in the same doc's 4.5b table).
- **County**, named plainly (FIPS resolved to name), always present, even where the city is
  absent (unincorporated) or unresolved (refused).

## 2. Zoning, with its governing jurisdiction

- The zoning district code **and** the jurisdiction whose ordinance it belongs to
  (`zoningJurisdictionKey` resolved to a human city/ county name), on every surface. A district
  code with no named jurisdiction is not gradeable as "zoning shown" — a customer cannot look up
  an ordinance for a code with no city attached. Ledger source: `_decisions/2026-09-11_ledger_as_
  serving_path_seven_steps.md` step 3 (one reader) and step 5 (one vocabulary) — the same string
  must appear identically on the panel, the MCP and the PDF.
- **Fails on**: the Pflugerville card ("SF-S" with the county named but not the city) and any
  card where the district shown does not name which city's or county's table it comes from.

## 3. Setbacks, with citation and vintage

- Front / side / rear / corner, each with **the source it came from and that source's effective
  or edited date** (`_decisions/2026-09-11_setback_source_most_current_wins.md`). **The source
  with the most recently read date wins**; authority tier (ordinance text vs. per-parcel GIS
  record vs. atom chain) breaks ties only when dates are equal or unreadable.
- **When two producers disagree and no date resolves it, the card must show a conflict row
  carrying both values and both sources, explicitly labelled unresolved — never a silent pick.**
  This is the corner-lot case from the ruling's own example, `48021:34049` (1109 Pecan St,
  Bastrop, SF-1): 25/5/25/15 on one surface, 30/10/30/20 on another, no conflict shown anywhere
  — that is the exact defect the ruling exists to close.
- **A city or district with no table in our corpus must say so as a fact about the corpus**, not
  print a silent "no requirement" — see §8 (honest refusals) below; the parcel-grain measurement
  in the program-scope doc found 219,472 such cells across the six counties carrying a false
  "checked, none required" state.
- **A PUD, PC or PDD parcel reads the PUD message**, not the same silent miss a genuinely
  unacquired district gets (operator ruling A-164, 2026-09-15, OPS-16 row A-164): "your setbacks
  come from your PUD ordinance," not a district-table lookup. **Fails on**: `48209:100698`
  (5292 Hartson, Kyle, district PC R2), which as of the 2026-09-16 program-scope read showed the
  MCP returning `envelope: "absent-verified"` (a confirmed-absence claim) and the map showing
  Bastrop's own "layer-23" wording on a Kyle lot — neither is the PUD message and neither is
  honest about what is actually true of a planned-community parcel.

## 4. The envelope — drawn or declined, with the SPECIFIC true reason

- Per Ruling B reversed for the polygon only (`_decisions/2026-09-11_ruling_b_reversed_polygon_
  only.md`): **the map and the MCP draw block both draw the modelled buildable-envelope polygon
  from the same `place/buildable-envelope` call**, carrying that call's own disclosure text,
  wherever a zoning district and a setback table exist for the parcel. **The buildable-area
  figure and percent stay refused everywhere** until a `buildable-envelope` atom backs them —
  a numeric figure or percent printed anywhere is a defect (R-2 still stands for the number).
- Where the envelope is declined, **the decline reason must be the parcel's own actual reason**
  (no road-frontage edge labelling, no district, a stale/mislabelled atom, etc.), never another
  city's wording. **Fails on**: the Kyle PC R2 parcel reading Bastrop's "pending re-warm from
  city per-parcel record ... pre-layer-23 sources" wording, which was written for Bastrop's
  layer-23 migration and is nonsensical on a Hays County lot that never had a layer 23. Also
  fails if MCP and map disagree on drawn-vs-declined for the same parcel (a P-217 instance,
  logged per §9).
- Two implementations must not disagree: if the map's polygon and the MCP's draw-block polygon
  differ in vertex count or geometry for the same parcel, that is a P-153 regression, listed as
  a defect.

## 5. Flood, land use, lot size, year built

- **Flood**: state present/absent and, when present, the flood zone and whether the parcel sits
  in a Special Flood Hazard Area — never a bare boolean with no zone named (`floodHazardFact`,
  must-pass rail per `scripts/six-county-completeness.mjs` `RAIL_POLICY`).
- **Land use**: the land-use code/description and its source; where the rail is mid-cutover
  (`landUseDescription`, per `RAIL_POLICY`), the card must say the description is not yet served
  rather than leaving a blank that looks like "none."
- **Lot size**: `parcelAreaSqFt` / `acreageAcres`, with method where the method itself is a
  gradeable rail (`acreageMethod`).
- **Year built**: from the structural fact; present with a value, or a declared refusal/absence,
  never a blank cell with no state word next to it.

## 6. salesHistory — declared unavailable, not blank

- Per operator ruling 2026-09-14 (OPS-16 row P-209): a Texas parcel's `salesHistory` **must
  return a declared refusal naming the jurisdiction and both statutory citations**
  (Tex. Gov't Code § 552.149; Tex. Tax Code § 22.27), rendered as "Texas does not publish sale
  prices," alongside whatever transfer event the record does hold. **Never a blank, a null, a
  zero, or a bare absence.** This refusal is jurisdiction-scoped, not global — a non-Texas
  fixture must not inherit it (this program has no non-Texas fixture to test that side; noted as
  a limit of this lane's grading, not a pass).

## 7. Tier gating — what the operator's paid-Solo account should and should not see

- **Owner** and the four **tax-assessed valuation** rails (`marketValue`, `assessedValue`,
  `landValue`, `improvementValue`, on both `onRecord` and inside `valueHistoryFact` entries) are
  Studio/Team-only, or require an active Property Unlock on that specific parcel; a Solo account
  gets a typed `studio-gated` refusal on **every one of these fields on every surface that
  carries them**, including `valueHistoryFact` entries (mission `mission_p246_value_history_
  tier_gate.md`: the same loader served `valueHistoryFact` unconditionally next to a refused
  `onRecord.cadRoll.marketValue` in one response — a payload whose parts disagree, which this
  spec treats as a fail wherever observed, whether or not P-246 has shipped by the time this
  lane reads it).
- **Site-plan export** (`export_instrument`) needs an unlock on a Solo account; the X-ray/dossier
  kind is Solo-accessible per the P-199 finding, but any sheet inside it that prints a dollar
  value it should not is the same class of defect as §7's first bullet.
- **What is correctly public even to an anonymous or Solo caller**: zoning, setbacks, flood,
  land use, lot size, year built, and the envelope polygon with its disclosure — none of these
  carry an access pair today (P-199 finding, phase 2: these atoms are `public-free`), so a card
  that refuses them to a Solo caller is itself wrong in the other direction.
- Where this lane's session has no live MCP connector for a given check, the leg is marked
  **UNMEASURED with the reason**, never assumed pass or fail.

## 8. Honest refusals — every gated or missing field names what is missing

- A field that has no source anywhere (`easements`, `hoaDeedRestrictions`, `mineralRights`,
  `ossf`, `permits`, `terrain`, `treeProtection`, per `RAIL_POLICY` class `no-source`, P-203
  roadmap) must say so, not disappear.
- A field withheld by ruling (`buildableAreaSqFt`, `buildableAreaPct`, R-2) must say it is
  withheld pending a verified atom, not print a number and not print nothing.
- **A city or district with no table in our corpus is a fact about the corpus, not a fact about
  the lot** — "no requirement" and "not yet acquired for this jurisdiction" are different claims
  and only the second is ever true for `absent-verified` written by `buildNoRuledTableCells` /
  `buildResolvedCells` (`hauska-factory src/jobs/parcel-setback-cells.mjs`, named in the
  program-scope doc §2b). A card that states the corpus gap as if it were a legal fact about the
  parcel is a defect.
- No refusal string leaks an internal identifier, an unrounded float, or assertion syntax
  (P-214's own predicate: no `R\d+`-shaped rule id, no `!=`, no 4+-decimal float in
  customer-facing text).

## 9. Cross-surface agreement (P-217)

- The same parcel read on the map, the MCP and the PDF must agree on every fact both surfaces
  attempt to state — drawn-vs-declined, the setback values, the district, the jurisdiction name,
  the refusal reason. **Any disagreement between two surfaces on the same parcel is logged as a
  P-217 instance**, regardless of which surface is "more right."

## 10. Unincorporated parcels

- A parcel outside any city limit reads: county named, `situsCity` empty or the county's own
  "unincorporated" convention (never a fabricated city), zoning district `not-applicable` **with
  its reason stated** (Texas unincorporated land is typically unzoned — that is a fact, not a
  gap), setbacks `not-applicable` for the same reason, and every other rail graded normally.
  **Fails on**: an unincorporated parcel whose zoning/setback cells read as a silent absence
  indistinguishable from an unacquired city's gap — the `not-applicable` kind and its reason must
  be visible to the customer, not just present in the ledger.

## 11. An uncovered county / uncovered jurisdiction

- Per P-210 (`_inbox/2026-09-16_texas_scaleup_program_scope.md` §1, "Covered means what actually
  serves the customer"): an address outside the served set must answer **"not covered"**, an
  honest, specific statement, **never** a bare `no-hit` that reads the same as "we looked and
  found nothing at this address inside a covered area." The two are different claims and this
  spec fails a card that cannot tell them apart. This lane's six counties are themselves the
  covered set; an uncovered read is graded by fixture only if this lane finds a live example
  (a fixture just outside the six-county set), and otherwise recorded as spec-only, ungraded, for
  the next lane to falsify.

## Falsifier pre-registration (scored in the report, not here)

1. This spec must fail the Pflugerville card on the missing city (§1) and fail the Kyle PC R2
   card on both the MCP `absent-verified` envelope state (§4, since a confirmed-absence claim
   is not the PUD message and not a specific true reason) and the map's Bastrop-sourced wording
   (§4, §8). If either does not fail against this spec as written, the spec is too weak and must
   be tightened before grading proceeds.
2. At least one city must score well against this spec. The check parcel is Bastrop's own
   1109 Pecan St (`48021:34049`), which the operator has separately confirmed looks right.
3. Every defect found in grading must name the file that produces it; where the file cannot be
   found, the defect is still listed, marked "source not located."
