# P-167 strings observation — planner reading, OPS-23 wave 6 (pre-change)

    date: 2026-09-14
    authored: dispatch planner
    machine-readable companion: `_inbox/2026-09-14_p167_strings_pre_observation.json`
    raw panel legs: `_inbox/2026-09-14_p167_panel_legs.json`
    status: PARTIALLY MEASURED — panel leg measured live; MCP and PDF legs credential-gated.
            The row must read UNMEASURED, never PASS by default.

This is a **pre-change baseline**, not a grade: the `p154-conflict` lane's A-148 amendment
changes these strings, so the graded reading belongs after that lane deploys.

## What is measured, and how

**Panel leg — MEASURED live** at `https://smartsite.cloud/api/spine/property-atoms/<id>/facets`
for all five probe parcels, all five returning `readPath: "record"` (the reader's own path, so
P-152's premise holds while this row is judged). Full payloads saved in the companion files.

**Vocabulary globals — MEASURED at `origin/main`:**

- `parityLockDeleted: true`. No `buildable-display-vocab.parity.lock.json` is tracked on
  `origin/main` in `hauska-map` or `legacy-design-tools`; `hauska-engine` tracks
  `packages/engine-core/src/site-plan/__tests__/buildable-display-vocab-retired.test.ts` — a
  retirement test, not a pin. **The `.parity.lock.json` files still sitting in working checkouts
  are stale side-branch artifacts and are not on `origin/main`**; reading the working tree instead
  of `origin/main` here would have produced a false FAIL.
- Every consumer specs `@empressaio/atom-contract ^1.34.0` (`hauska-map` 1 specifier,
  `hauska-engine` 11, `legacy-design-tools` 7), and npm `latest` is `1.34.0`. So all three named
  importers are on the shared vocabulary.

**MCP leg — NOT MEASURABLE here.** The Smart Site MCP
(`https://smartsite-mcp-tds7av26va-uc.a.run.app/mcp`, serving revision `smartsite-mcp-00119-naf`
at 100%, canary `smartsite-mcp-00121-vef`) answers `401 {"error":"unauthorized",
"reason":"missing_bearer"}`: it requires OAuth and refuses unresolvable credentials. The reachable
MCP host on the panel's `MCP_URL` default serves a *different* 90-tool catalog (cortex tools:
`generate_property_brief`, `get_property_atom_chain`, …) that does not carry `get_smart_site`.
The Cursor MCP connector for it also fails live discovery. This matches the probe's own contract —
`get_smart_site` is an operator-run leg that enters via `--observations`.

**PDF leg — NOT MEASURABLE here.** An `export_instrument` call, operator-run by design.

## Finding 1 — the Bastrop conflict sentence is composed somewhere else (this IS the P-167 divergence)

Two sentences sit side by side on the live panel today, from two different mechanisms:

| sentence | where it comes from |
|---|---|
| "No zoning district observed for parcel — honest absence, no fallback district invented." | the shared vocabulary: `hauska-atom-contract/src/display/wire.ts:61` (+ `pdfLabel`, snapshot lines 61/63) |
| "Drawn from OnClick (layer 23). The city's Revisions layer (83) specifies front 30 / interior side 10 / corner side 20 / rear 30 for SF-1; **the two city schedules conflict — verify which is in effect with the city.**" | the **engine**, hardcoded: `hauska-engine/packages/adapters/src/local/setbacks/bastrop-per-parcel-record.ts:570`, and baked into fixtures (`packages/engine-core/src/registry/__fixtures__/block13-offline.json` lines 715, 1628, 2195, 2761) |

Grepping the string across all four repos returns hits in `hauska-engine` only, and **nothing in
`hauska-atom-contract`**. So the panel does *not* draw its display sentences from one vocabulary
today. That is the divergence P-167 exists to retire, and it is measured, not inferred.

Corroboration from the engine's own inventory (`artifacts/ss-w11/inventory.json:414`, `origin/main`),
which already names the shape: "the CONFLICT here is INSIDE the record … A duplicate subject inside
ONE record is outside this detector's shape and belongs on the backlog, not in a store pair."

## Finding 2 — A-148 makes that engine-composed sentence wrong, so the amendment is load-bearing

The sentence's advice ("the two city schedules conflict — verify which is in effect with the
city") is exactly what F24's resolution supersedes: the city named `Zone_Types/FeatureServer/25`
as its current layer, its TEXT fields say 30/10/30/20 and its unrefreshed numeric columns say
25/5/25 which the One Click join reads, and **the operator confirmed it with the city on
2026-09-14**. So the panel is currently telling a customer to go verify a conflict that has been
resolved.

This is not cosmetic for the lane either: the `p154-conflict` lane's committed `2132cd2`
(`feat/p154-conflict-row-vocab`) encodes the **superseded** form in the vocabulary package —

    displayText template: "The city's <card> shows <front>/<side>/<rear>[/<corner>] citing Ord. <ordinance> (repealed <effective-date>)."
    worked example:       "The city's One Click card shows 25/5/25/15 citing Ord. 2019-51 (repealed 2026-04-14)."

with a comment describing "(Ord. 2026-06 … which repealed 2019-51)". A-148 requires the new
sentence: 25/5/25 (three axes — **there is no numeric corner column**), "unrefreshed numeric
columns of its zoning layer", and the current ordinance that the text fields reflect. Without the
amendment the lane would have shipped a correct-looking, wrong sentence. The lane has been resumed
with the exact sentence and told to amend `2132cd2` in place rather than redo the type work.

## Finding 3 — the no-conflict control behaves

`48453:367134` (Austin, SF-2) carries `secondSource: null`. The conflict note must not appear where
sources agree, which is the dispatch's own falsifier; the control parcel holds.

## Open item — R-2 figure question on the two Bastrop parcels (now probe-confirmed, not just open)

`48021:34049` and `48021:33223` carry `envelope.buildableAreaSqFt` / `buildableAreaPct`
(19052 / 63.5 and 1397 / 42.4) while `48453:367134` carries neither. R-2 is "ENVELOPE DRAWN,
FIGURE REFUSED — buildable area and percent stay refused until an envelope atom backs them."

Running the row (`scripts/surface-probe.mjs --rows P-167 --observations …`, artifact
`_inbox/2026-09-14_132056_surface_probe.json`) raised this from an open question to the probe's own
recorded FINDING, twice:

    FIGURE-IN-PAYLOAD  48021:34049  buildableAreaSqFt travels in the panel payload; the figure is
                                     refused by ruling and must not be printed by any surface
                                     (P-153 observation figurePrinted)
    FIGURE-IN-PAYLOAD  48021:33223  (same)

So the tension is named by an instrument, not by me. What remains unestablished is only the
narrower question of whether those figures are atom-backed; the fact that the figure travels in the
payload at all is now measured.

## Findings from the same probe run (not P-167's precondition, but recorded so they are not lost)

- `WRONG-PARCEL 48021:33223` — the envelope endpoint answered `ok` for `48491:R419407` when asked
  about `48021:33223`; a **different county's node id**. "Any consumer that does not compare node
  ids will serve another lot." This is a live mis-serving path, not a P-167 matter; escalated to the
  operator and recorded in `_inbox/2026-09-14_ops23-wave6_cp1.json`.
- `NO-CONTAINING-POLYGON` on both Bastrop parcels — the live Bastrop County parcel layer returned
  44 and 42 features around the record point and **none contains it** (nearest 64 m and 24 m away).
  "Either the layer has a hole at this parcel or the record point is wrong; the probe does not
  choose." This is direct, independent corroboration for the `p183-querypoint` mission (the record
  store's query point), so it is carried into that lane's CP2 review and the wave record rather than
  left in this note alone.

## What the operator must supply before P-167 can be graded

1. The MCP `get_smart_site` string and the PDF `export_instrument` string for `48021:34049`
   (plus `48453:367134` as the no-conflict control) — then the per-parcel
   `displayStringsIdentical` can be judged rather than left UNMEASURED.
2. Which credential the probe's operator-run legs should carry for the Smart Site MCP, given it
   refuses `missing_bearer`.
