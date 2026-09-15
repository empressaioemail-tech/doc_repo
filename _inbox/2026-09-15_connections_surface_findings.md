---
id: 2026-09-15_connections_surface_findings
title: Connections — what ships, and four findings that need engineering thought before any design
date: 2026-09-15
status: findings only. No design, no ruling, nothing proposed for build.
kind: findings
owner: nick
programs: [OPS-17]
snapshot:
  repo: smartcity-dashboards
  ref: origin/main
  commit: f776b4bf24114ed4061609d28c0429f84eb431b7
  read: 2026-09-15
  files:
    [
      web/index.html,
      web/app.js,
      src/adapters.mjs,
      src/city-pack.mjs,
      scripts/bake-connections.mjs,
    ]
related:
  - _design/INDEX.md
  - _decisions/2026-09-03_bastrop_tx_dashboards_pack_ratified.md
---

# Connections: findings

Operator ruling 2026-09-15: **this needs engineering thought before design.** This card is the
input to that thinking. It proposes nothing and decides nothing.

## Why the card exists

Connections was picked as the next design surface on the stated grounds that it is undesigned
and that the ratified Overview lens depends on it. Reading the source first, **both halves of
that premise were wrong**, and the second was wrong in a way worth recording because it was
asserted to the operator before it was checked.

## Correction 1: Connections is not a missing screen

It ships as a **function-homes register**: 75 rows, baked from `src/shell-homes.mjs` by
`scripts/bake-connections.mjs`, with a stated counting rule, six dispositions (Mounted, Empty,
Not built, Island, Killed, Not connected) and a test asserting `web/index.html` is a fixed point
of the bake. `src/shell-homes.test.mjs` additionally asserts that two retired integration counts
appear nowhere in the document.

It is one of the more rigorous surfaces in the product. "Undesigned" was true only in the narrow
sense that no record exists in `_design/`.

## Correction 2: the Overview dependency does not fire for Bastrop

The claim made to the operator was that on day one the city manager opens Overview, its largest
element promotes Connections, and Connections is undrawn. **That is false for Bastrop.**

`web/app.js:161` `placeOverviewConnections()` computes `const connected = granted > 0`. The lead
paragraph, *"This page is quiet because no source has been read. Connecting a source fills the
lens it feeds"*, is shown only when `connected` is false, and the panel promotes only in that
same state.

Bastrop's pack grants **seven** adapters (`src/city-pack.mjs:127`): municode calendar, MyGov
permits, Samsara fleet, Spireon patrol, FirstDue apparatus, Power BI CIP, GoTo calls. So
`granted` is 7, `connected` is true, the lead paragraph is hidden and the panel demotes.

The promotion behaviour is real and correct. It fires on a zero-grant pack. It does not fire on
Bastrop. The design dependency that was used to prioritise this surface therefore does not exist
for the pilot city.

## Finding 1: the register is an internal artefact rendered to a customer

The rows are our build decisions and our kill rulings, in our vocabulary. Verbatim from
`web/index.html`:

| Row | Text | Disposition |
|---|---|---|
| 30 | Public morning brief. No home. Leaked live operations without a session. | Killed |
| 61 | Design lab. No home. Internal playground. | Killed |
| 35 | Code enforcement (duplicate product) | Not built |
| 15 | Second parcel map stack. No product home. Stays on the city until a named cut. | Island |
| 38 | Nested review product chrome. No home. One shell, one top bar. | Killed |
| 3 | Workspace launch cards. No home. Navigation lives in the sidebar only. | Killed |

Row 30 is a defect confession. Row 61 is an internal tool. Row 35 is a roadmap duplication. The
standing separation is that Command Center is the internal operator console and the dashboards
are the customer app, and these rows are Command Center's vocabulary sitting in a city's nav.

Not proposed here: where the register should live. That is the engineering question.

## Finding 2: two counts named "sources connected" that measure different populations

Three figures on the shipped product use that phrasing. One is sound. Two disagree.

| Where | Figure | Provenance | Population |
|---|---|---|---|
| `index.html:339` Overview | `7 of 10` for Bastrop | **runtime**, `app.js:167` from the pack | adapter grants on THIS city |
| `index.html:1591` Connections | `1 of 12 sources connected` | **baked**, asserted by `bake-connections.mjs:25`, never written by `app.js` | feeds table of the register, product wide |
| `index.html:908` Finance | `0 of 4 required sources connected` | scoped, and the basis line says so | that lens only |

The Finance figure is the well built one: it is lens scoped and declares it.

The other two share a phrase, sit one click apart, and are not measuring the same thing. On
Bastrop's own instance Overview reads 7 of 10 and Connections reads 1 of 12, and the second
number is not about Bastrop at all. A city manager has no way to reconcile them, and the
likeliest reading is that something is broken.

Both measures are individually defensible. The collision is in the words.

## Finding 3: the denominators differ, and deliberately

`ADAPTER_KINDS` in `src/adapters.mjs:13` holds **10** kinds: mygov, samsara, opengov, esri,
municode, firstdue, verkada, spireon, goto, powerbi. Its own comment excludes an eleventh:

> The eleventh vendor family on the live surface is Anthropic, which the G-18 register
> dispositions as chrome only and explicitly not a city feed; cataloguing it would declare an
> adapter kind that writes no records anywhere.

The register's feeds table holds **12** rows: those 10, plus Anthropic, plus a CRM feed that is
itself marked `Killed`.

So the Connections denominator counts a vendor the adapter catalog deliberately refuses to count
and a feed that has been killed. That is defensible for an internal inventory and is the reason
the two numbers cannot be reconciled by arithmetic.

## Finding 4: Mounted and granted are different states, counted as one

Esri is `Mounted` on register row 51, because the map renders through the SmartSite mount. Esri
is **not** in Bastrop's `grantedAdapters`. Neither is OpenGov nor Verkada.

So the single connected count on the Connections header is 1 because a mount exists, while the
adapter grant model says that kind is not granted on this pack. A mount is a code path the
product has built. A grant is a feed a city has authorised. The product currently lets the first
be counted as the second depending on which page is being read.

This is the finding with the most engineering in it, because it is not a copy problem. It is two
models of "connected" that were built for different purposes and now overlap.

## The questions this leaves, unanswered on purpose

1. Does the function-homes register belong in the customer product at all, or is it Command
   Center's? If it stays, what makes it safe to show a city?
2. Is there one definition of "connected", or are mounted and granted permanently two axes that
   both need naming on screen?
3. Which population is the customer-facing denominator, and what is the counting rule?
4. Does a city-facing connect surface exist as a separate thing, and if so does it replace this
   page, share it, or sit beside it?
5. What does connecting a source actually involve operationally, and who acts? Bastrop has seven
   grants already, so the answer is partly known and is not written down anywhere read here.

## What is deliberately not in this card

No design. No artboards. No recommendation on where the register lives. No proposal for a
connect surface. Those wait on the engineering pass the operator called for.
