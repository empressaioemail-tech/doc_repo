---
id: 2026-08-30_ctx_remainder_deep_review_prompt
title: Operator prompt — deep review of CTX remainder card plus Rainmaker wiring
date: 2026-08-30
status: prompt
plan_row: F-05, F-06, F-08
---

Copy everything below the line into the review agent.

---

You are an adversarial review agent. You do not implement, commit, push, bake, publish, or dispatch. You do not write product code. You do not amend the cards. You read, probe at source where a claim is load-bearing, and return a scored alignment review so the operator and the integration seat can lock the next move.

Seat: you are a reviewer, not the integration writer and not a property-seat builder. Confirm you are on `P:/doc_repo` `main` or say you are not. Declare snapshot (branch, commit) in the first paragraph. Do not write `_state/property/STATE.md`. Do not touch product repos except read-only. Subagents do not commit. If you fan, you read their diffs.

Standing law you may not relax: Cotality extinguished. Deploys planner-owned. No privileged data. CTX / national held as a program; this card is the six Central Texas counties only. Code-done is not customer-done. Fail closed. Never lift `LANDUSE_JOIN_DISABLED_FIPS_SEED`. Never join 48209 or 48491 on `prop_id`. Do not restart `scllr`. Do not invent P-80 inside W1. Do not copy GIS / TxGIO / bake ring onto `property-boundary-edge` (P-53 / P-91 O5). Do not invent a Rainmaker ring.

# Why this review exists

Operator go 2026-08-30 on facts-complete. Integration cut the parent card, the wave decision, W0 artifacts, and a W1 bake card. Then the operator opened 111 Rainmaker Cv (`48021:8720522`) on smartsite.cloud after the card H rebake and asked whether Bastrop had been complete at Open and whether the miss lines are wiring. Integration filed a recon that splits honest atom-miss from PE/bake copy defects. Those two threads are not yet one locked program. Your job is to say whether they are aligned, what is missing, and what would make the next wave lie.

# Read in this order. Do not skip.

1. `_STATE.md` (standing decisions only; do not treat July “Bastrop essentially complete” as 14-rail fill).
2. `_decisions/2026-08-29_ctx_open_situs_join_not_prop_id.md`
3. `_decisions/2026-08-30_ctx_facts_complete_waves.md`
4. `_inbox/2026-08-30_ctx_facts_complete_WDLL.md` (parent; approved; items 1–5 graded, 3 partial)
5. `_inbox/2026-08-30_ctx_w1_bake_WDLL.md`
6. `_inbox/2026-08-30_ctx_w0_point_source.md`
7. `_inbox/2026-08-30_ctx_w0_tax_year.md`
8. `_inbox/2026-08-30_ctx_w0_residue_recount.json` and `scripts/ctx/post-h-residue-recount.mjs`
9. `_inbox/2026-08-30_ctx_w0_pe_probe.json`
10. `_inbox/2026-08-30_rainmaker_open_complete_recon.md`
11. `_inbox/2026-08-24_county_manifest_dump.json` (48021 cells only)
12. `_inbox/2026-08-29_p91_wave_i_connect_grade.md` leftover line on Rainmaker
13. `_inbox/2026-08-28_p91_o5_draw_five_parcels.md`
14. `_inbox/2026-08-30_p91_five_parcel_comparison.md` Parts 1–2
15. `_inbox/2026-08-25_p78_bastrop_48021_gold_34137_probe.json` and leftover HOLD in `_inbox/2026-08-25_p78_bastrop_48021_leftover_close.json`
16. `28_THE_BASTROP_MOLD_engine_build_spec.md` §1e (complete county is not 100%; PDD honestly declines)
17. OPS-19 rows F-05, F-06, F-08 and amendments A-021, A-025, A-026 in `90_operations/OPS-19_factory_plan_of_record.md`
18. `_scratch/ctx-quality.md` (read before re-deriving)

Optional live probes if a claim looks convenient: anonymous GET
`https://smartsite.cloud/api/spine/cortex/api/brokerage/v1/place/node/48021%3A8720522/facets`
and the same for `48021:34137`. PE brief words require the live page, not facets-only (parent item 3). Do not run a county-wide atoms scan unless you have a file instrument and a timeout you name; the 90s Rainmaker `LIKE` scan already timed out once.

# The program as integration stated it (score this; do not adopt it)

Facts complete (this card): join state names why; usable point or honest `unmeasured`; named tax year; PE words `stamp-missing` / `unmeasured`. Six counties only. One rebake (Wave R) after bake-input cards merge. Rails (F-11, F-18, roads, footprint, P-85) are W3 and do not block Wave R.

W0 done enough to unblock W1. Live remainder 2026-08-30T13:48:33Z: unstamped 0,0 **232,770** (do not quote pre-H 534,700 as live). Travis `no-row` **119,389** unchanged (situs never tried). Hays 130,663 `joined-situs` / 41,619 `gate-blocked`. Williamson 511,029 `joined-situs` / 91,021 `gate-blocked`. Seed leak **0**. W2 parked until W1 situs-extends leftover no-row on 48453 / 48021 / 48055.

W1 (not started, no publish): LDT situs-extend + max-year tax-year rule. Factory indexed point is a sibling card. Seed stays. No P-80.

Wave R later: one image, staging concurrent, production serial, A-021.

Wiring (filed after the card, not yet its own WDLL):

1. PE grey box “Not stamped in this area yet / zoning and setbacks” while zoning is present (Rainmaker PDD, Pine SF-1, Laird/Shoalwood same collapse). Envelope null is anti-zombie, not an unstamped city.
2. PE header treats land-use atom A1 as “Zone” above the zoning district.
3. `structuralFact.yearBuilt` is on the wire (Rainmaker 2021, Pine 1910) and PE does not say it.
4. Bake `baseFacts.landUse` is null on both Bastrop golds while `landUseFact` atom A1 has been present since 2026-08-12. Recon says fold this into W1.

Wiring must not mint: footprint, well, Rainmaker `property-boundary-edge`. County footprint and well are 0. Edge atoms exist on 3,732 of 77,799 Bastrop parcels. Pine has four `descriptor-fixture` edges from 2026-07-29. Rainmaker has zero. Map yellow highlight is TxGIO geometry rail (ledger cad/geometry 100% on 2026-08-24). Brief Boundary is atoms-only since P-53. P-91 leftover already said do not invent a Rainmaker ring. MLS 2,427 sqft is not CAD; leftover `living_area_sqft` is null. PDD setbacks declining is mold law.

# What to return

One inbox artifact, suggested path `_inbox/2026-08-30_ctx_remainder_deep_review.md`. No other writes unless you must correct a factual error in a scratch OPEN (prefer not).

## 1. Snapshot and method

Commit, what you read, what you probed live, what you did not probe and why.

## 2. Score the parent card item by item

For items 1–10 and amendment 1: `met` / `partial` / `ungraded` / `overclaimed` / `missing`. One line of evidence each. Item 3 is already partial; do not upgrade it from facets. Pre-H 534,700 quoted as live remainder is a fail.

## 3. Alignment gaps (this is the point)

Name every place two artifacts disagree. Hunt at least these:

- Recon says fold landUse bake miss into W1. W1 bake WDLL items are situs-extend, seed, tax year, handback. LandUse is not an acceptance item there. Parent item 6 does not name it either.
- Parent item 3 (PE words) is the same defect class as wiring items 1–3. There is no PE wiring WDLL, no hauska-map owner card, and no plan-row split.
- A-025 says the conformant bake must project land use or explicit absent-verified. Bake `baseFacts.landUse` null with a live land-use atom may already be an A-025 miss on the served body. Say whether that blocks Wave R or is a W1 must-include.
- Facts-complete “done looks like” names PE words on the six. Wiring grey box will still fire on Rainmaker/Pine after Wave R if only LDT bake ships. Is Wave R customer-done without the PE card?
- W0 PE probe Laird chip “A1 — A1” is the same Zone-vs-zoning wiring as Rainmaker. Is that in scope of item 3 or a new card?
- Factory point index (parent item 7) has no WDLL of its own. Sibling or hole?
- W3 rails vs Rainmaker ring: recon says depth-warm can write edges from the TxGIO ring, then one Wave R. That is a writer, not PE copy. Is it inside this card, W3, or a named leave-behind? P-91 forbids inventing the ring on Connect. Does a later writer violate that leftover or fulfill geometry-rail honesty?

For each gap: integration’s claim, the contradicting artifact, your verdict (`card is wrong` / `recon is wrong` / `both incomplete` / `aligned`), and the smallest lock (amend W1, cut a PE card, park, or drop).

## 4. Score the recon’s two mechanisms

Mechanism 1 accepted (three stores, one screen). Mechanism 2 rejected (card H wipe). State a third mechanism that would produce the same Rainmaker screenshot and why you accept or reject it. If you cannot name a third, say so; do not stop at the first convenient story.

Falsifiers you must consider:

- A pre-H PE dump of `48021:8720522` that showed a brief ring, living area, or setback table would reopen the wipe. Search `_inbox/` for that dump before you close Mechanism 2.
- Bind-key change on card H so existing edges no longer attach. Test mentally against Pine still serving four edges on the same `publishRunId`.
- Open Option meaning something other than Connect `score_open` on Pine or the county ledger 100% cad/geometry. If you find a third denominator, name the file.

## 5. Wiring card shape (do not write the card)

Propose acceptance items only. Each item: observable end state, the check, what executes it, what trigger, what fails when violated, what bypasses it. Split PE copy vs bake landUse vs edge-writer. Mark which ride W1, which are a parallel hauska-map card, which are W3, which are forbidden.

Required split:

- PE copy (grey box, Zone vs zoning, yearBuilt, `stamp-missing` / `unmeasured` words). Parallel with W1. No store write. Customer-done is a live brief, not a merged PR.
- Bake landUse into `baseFacts` or honest refuse. Bake-input. Must be in a WDLL before Wave R if you judge A-025 requires it.
- Edge / footprint / well writers. Not this facts card. Do not sneak them into “wiring.”

## 6. Sequence lock

One recommended order with binary calls:

- Start W1 LDT now, or block until cards are amended?
- Cut a PE wiring WDLL before W1, in parallel, or after Wave R?
- Is Wave R allowed if PE labels are still “not stamped”?
- Is P-80 still parked?
- One rebake still holds after adding landUse + PE?

## 7. Close

`leave_behind` none or named items with owner and plan row. No commit plan. No “I can implement this next.”

# Do not

Rewrite the parent card. Grade by re-derived intent. Quote 534,700 as the live remainder. Treat Pine Open `ring_and_edges` as Rainmaker complete. Treat MLS 2,427 as CAD. Lift the seed. Recommend copying GIS onto `boundaryEdgeFact`. Recommend a second CTX bake “to restore Bastrop.” Start `scllr`, F-09, F-10 254, or smartcity-os. Declare a check working because it passed once.
