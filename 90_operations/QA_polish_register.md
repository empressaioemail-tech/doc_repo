---
id: QA_polish_register
title: QA polish register — small items deferred by design
date: 2026-08-10
status: living register
owner: planner
memory_graded: pending
related:
  [
    90_operations/OPS-14_texas_flush_game_plan,
    90_operations/OPS-15_owner_and_rrc_rail_gap_analysis,
    _decisions/2026-08-09_texas_flush_launch_gate,
  ]
---

# QA polish register

Small, real, non-blocking defects found while browsing the live product. **Operator ruling 2026-08-10: do NOT stop the build path for these.** They accumulate here and get worked as a batch, or when someone is already in the relevant file.

Entry rules: one line per item, name the surface and the exact string or behavior, and say what "done" looks like. If an item turns out to be load-bearing (wrong number, wrong claim, legal exposure), it is NOT polish — promote it out of this file and into the active lane.

## Open

| # | Surface | Item | Done looks like | Found |
|---|---|---|---|---|
| Q1 | Flood & drainage PDF | Sheet header reads `FLOOD & DRAINAGE · SHEET 1 OF 2` but omits the `SMART SITE` brand prefix the site-plan sheet carries (`SMART SITE · SITE PLAN · SHEET 1 OF 4`) | Both report families lead with the same `SMART SITE ·` prefix; one shared header composer, not two | 2026-08-10 operator |
| Q2 | PE AI chat | Markdown is not rendered — replies show literal `**Identify the current zoning district**` asterisks instead of bold | Chat renders markdown bold/lists (the brief pane already does); no raw `**` reaches the user | 2026-08-10 operator |

## GTM readiness — surface polish carried in this register (added 2026-08-10)

Operator ruling 2026-08-10: **GTM readiness surface items batch here with the rest of the polish.** Same rules apply — one line, name the exact string or surface, say what done looks like, and promote anything load-bearing out of the register rather than batching it.

Scope of this section: brand strings, link and URL correctness, copy that contradicts a locked ruling, and CRM/tooling wiring. It is **not** the GTM build. The launch-blocking builds (funnel events with consent flags, activation instrumentation, the self-serve pricing popup, dunning, team seat management, share-loop attribution) are program work under `76j` and the humanless handoff, NOT polish — they never enter this table.

Source of truth for every item below: `_inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED.md` and `_inbox/2026-08-10_smartsite_humanless_gtm_handoff.md`.

| # | Surface | Item | Done looks like | Found |
|---|---|---|---|---|
| G1 | Stripe product catalog | ~~Product reads **"Hauska Pro"**~~ **CLOSED 2026-08-12 L6** — active catalog is Smart Site Solo / Studio / Team; zero active Hauska strings (P-28). Unlock $15 product not created (no new billing products this lane; 76j). | Product and price nicknames read Smart Site, matching the locked ladder (Solo / Studio / Team / unlock). Rides the operator branding scope | 2026-08-10 GTM lock; closed L6 |
| G2 | `_smartsite_masters/06` line 58 | Copy reads "qualified signal flows to the **sales CRM**" — describes a motion the humanless ruling forbids (no sales team on this product, ever) | Funnel copy names the affiliate + share-loop motion; CRM language either removed or scoped explicitly to Empressa Solutions / SmartCity OS, which DO get a sales team | 2026-08-10 planner, reading 06 against the lock |
| G3 | `_smartsite_masters/06` line 54 + pricing page | Coverage answer is "**confirmed on request**" — a human in the loop by definition, and the exact gap the humanless handoff names as condition 1 | A self-serve coverage answer: checkable map or a plain statement of how rolling coverage works, with per-parcel honest-absence named as the safeguard. No "ask us" path | 2026-08-10 GTM lock |
| G4 | CRM / GTM tooling | **RULED 2026-08-17:** Pipedrive is the Smart Site subscriber CRM. Stripe webhook writes a person with tag `smartsite` plus user tier (`free` / `solo` / `studio` / `team`). Not a city feed (G-63 stands). Affiliate platform (Rewardful class) remains the unpaid-acquisition tool. | Pipedrive person exists after checkout with both tags; no Pipedrive secret in the PE bundle; Dashboards still has zero Pipedrive city feed | 2026-08-10 open; closed-as-decision 2026-08-17 |
| G5 | Domain / URLs | `smartsite.cloud` is purchased but canonical-URL usage is not swept — collateral, share links, Stripe receipts, and PE/CC surfaces may still carry older hosts | One canonical public URL, used identically in share links, billing receipts, affiliate links and collateral; no stale host reaches a user | 2026-08-10 planner |
| G6 | Share link copy | Share is a **free function** and the loop is the acquisition channel; the recipient path is built to display, not to convert | Recipient-facing copy states the shared analysis is full-fidelity and names what the recipient would need an account to do themselves. Copy only — the attribution BUILD is program work, not polish | 2026-08-10 GTM lock |
| G7 | Unlock expiry copy | The 30-day unlock must surface as a **freshness property**, never as a paywall — "verified on [date]", because data changes (Bastrop repealed its zoning and the corpus served the dead version for six weeks) | No expiry string in the product reads as billing pressure; expiry presents as verification recency with a renewal that reads obvious rather than punitive | 2026-08-10 GTM lock |
| G8 | Tier naming sweep | Product, entitlement map, paywall copy and collateral still carry the retired ladder (Browse / Free account / Pro $149-99 / $15-forever unlock) | Every surface reads Free / Solo $49 / Studio $129 / Team $299 / unlock $15-for-30-days. The entitlement-map and Stripe REBUILD are program work; this row is the copy sweep behind it | 2026-08-10 GTM lock |

**Two of these are not really polish and are marked so deliberately.** G1 is a hard gate — it is small to fix and batched here for that reason, but it blocks external testers, so it does not wait for a batch window. G3 is the copy half of a launch-blocking condition; the copy fix belongs here, the self-serve coverage surface behind it does not. G4 is decided (Pipedrive + tags); the webhook is program work.

## Open — NOT polish, load-bearing (do not batch with the above)

_(none open — L1 resolved 2026-08-10, see below)_

## Resolved

## L1 — RESOLVED 2026-08-10 (eng #298)

Fixed UPSTREAM as directed: `isZeroInsetEnvelope()` in `site-model.ts` returns null for `buildableAreaSqFt` when the offset ring is geometrically identical to the property ring, so the header's existing honest `NONE` branch fires. No header special-case — every consumer (header, sheet-2, layout callout, DXF/IFC, PE vocab) reads the same corrected field.

**Planner verification at source (not taken from the report):**

| Parcel | LOT | BUILDABLE | Verdict |
|---|---|---|---|
| 48021:34137 (has SF-1 setbacks 25/5/25) | 16,673 SF | **14,680 SF** | regression clean — real envelope still real |
| 48113:007701000B0010000 (no setback atom) | 1,722,107 SF | **NONE** | defect gone (was 1,722,104 SF) |

**Tolerance audited, not assumed.** The fix uses a `1e-9` RELATIVE area delta. Planner tested the worst realistic case: a **1-inch** setback on a 39.5-acre parcel produces a relative delta of **2.54e-4** — five orders of magnitude above the threshold, so it is correctly kept as a real envelope. Pure float noise sits at **1.09e-15**, correctly suppressed. The threshold is safe at both ends; a smaller epsilon would have been fragile and a larger one would have eaten real setbacks.

Also fixed: sheet-2 now routes honest-absence to the `noSetbackRule` chip instead of falsely reporting "setbacks consume lot".

### The flagged residual — RESOLVED, and the report had the wrong file

The close report flagged `depth-warm/consume.ts` setting `buildableAreaSqFt = inset.areaSqFt`. **That file does not exist.** The real hits are in `depth-warm/warm-compute.ts`:

- **Line 216** `buildableAreaSqFt: good.parcelAreaSqFt` — reads alarming (literally lot area) but it is inside **`injectBadWarmCandidate`**, a DELIBERATE test fixture that fabricates this exact defect so the verify gate can be proven to catch it. It is the RED demo, not a live path. Leave it.
- **Line 160** `buildableAreaSqFt: inset.areaSqFt` — the real warm path. This is CORRECT and is not the L1 class: it only runs when a setback rule resolved (the inset comes from `buildFlatSetbackFallback(descriptor, district)` with per-edge front/rear/side values). A parcel with no setback rule never reaches this path, which is precisely why Dallas had no bogus buildable-envelope ATOM — only a bogus PDF header.

**Verdict: no follow-up owed.** The residual as described was a misread of a test fixture. The genuine defensive gap — a warm path promoting a full-lot zero-inset ring — is already covered by the verify-mechanical gate that `injectBadWarmCandidate` exists to exercise.


## Promoted out of this register (were not polish)

_(none yet)_
