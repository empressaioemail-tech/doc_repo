---
id: 2026-07-23_pe_map_truth_setbacks_handoff
title: Handoff — PE map-truth / no-honest-empty setbacks (for planning feedback)
status: active
date: 2026-07-23
applies_to: legacy-design-tools, property-explorer, doc_repo planning
related:
  - 2026-07-21_property_explorer_v1_sprint_WDLL
  - 2026-07-21_property_explorer_v1_sprint_STATUS
  - 2026-07-23_pe_no_honest_empty_setbacks_WDLL_amendment
owner: nick
---

# Handoff — PE map-truth / no-honest-empty setbacks

Filed: 2026-07-23  
From: Cursor Grok (doc_repo / LDT execution)  
To: planning agent (feedback)  
Re: Central-TX setback table population + honesty fixes; what landed vs what remains

## Flight status (this workstream)

**Yes — everything opened for the no-honest-empty / map-truth setback push has landed.**

| Artifact | State | Ref |
|---|---|---|
| Cortex serving tip | LIVE 100% | `cortex-api-00426-din` (canary tag) |
| Unmatched GIS decline (no invent) | MERGED | LDT [#346](https://github.com/empressaioemail-tech/legacy-design-tools/pull/346) `dbf46bb0` |
| Mono force-replace invented priors | MERGED + Caldwell rebake | LDT [#347](https://github.com/empressaioemail-tech/legacy-design-tools/pull/347) `328a45c9` |
| San Marcos legacy + Kyle deepen | MERGED + Hays rebake | LDT [#348](https://github.com/empressaioemail-tech/legacy-design-tools/pull/348) `d7ac73d4` |
| Kyle bare R-1 omit (R-1-T invent) | MERGED + Hays re-rebake | LDT [#349](https://github.com/empressaioemail-tech/legacy-design-tools/pull/349) `39f4391a` |
| County rebakes | EXIT 0 | 48055, 48491, 48453, 48209; Bexar full ~703k/709k |
| Open setback PRs | none | (unrelated open: #319 Tier-2 bake, #276 OZ — not this flight) |

Live PE: https://property-explorer-xi.vercel.app  
Prod DB: `DEPLOYMENT_DATABASE_URL` → Neon (node keys `node:{fips}:{prop_id}`)

## 1. Conversation summary

Operator raised the bar from "populated OR honest-empty" to **populate citation-backed setback tables everywhere possible**, rebake, track until done, and defer operator QA until the planner called map-truth done. Execution filled Central-TX empty tables, deepened high-frequency GIS codes, fixed unmatched invent (PDD painted as RHD), fixed monotonic bake keeping invented priors, and cleared a Kyle R-1-T prefix collision.

WDLL 51–53 are graded **met** for table population in STATUS. Remaining gaps are documented hard holds (conditional ordinance / plan districts), not empty city tables. Separately, Overpass road-anchor was found **regressed on tip** (STATUS had said met; `OVERPASS_URL` absent on serving revision) — that is outside the setback-table flight but load-bearing for envelope confidence design.

## 2. Decisions / outcomes reached

1. **No honest-empty target for Central-TX PE setback tables** — populate scalars where ordinance allows; omit conditional rules with an explicit table `note`; unmatched GIS codes decline `setback-table-pending` rather than invent a district. Owner: Nick (operator). Reversal: amend WDLL 51–54.

2. **Explicit unmatched zoning declines; absent zoning keeps conservative fallback** (#346 `mapDistrict` → null). Owner: LDT. Reversal: would reintroduce invent.

3. **Monotonic bake must force-promote honest declines over invented ok envelopes** (#347 `isUnmatchedZoningCorrection`). Owner: LDT. Reversal: only if a different integrity model replaces mono scoring.

4. **Do not ship Kyle bare `R-1` row** — it prefix-matches `R-1-T` into a false Ord.92 envelope (#349). Bare `R-1` GIS may still prefix to `R-1-1` (pre-existing matcher). Owner: LDT. Reversal: only with exact-match-only or holdout list in `mapDistrict`.

5. **Planner call: map-truth table population ready for operator envelope QA**; Overpass remount is a separate pickup. Owner: Nick.

## 3. Open questions (for planning feedback)

1. **Should `mapDistrict` prefix matching be tightened globally?** Kyle R-1-T and SA-style `C-3NA→C-3` both depend on prefix rules; length floors break one or the other. Recommended: design a explicit combining-district / holdout policy before more deepen.

2. **Absent-zoning conservative fallback (e.g. Bexar null zoning → I-2)** — honest "no stamp" path or unacceptable invent at county scale? ~500k+ Bexar null-zoning rows use I-2 fallback.

3. **Overpass remount** — durable fix is workflow/Secret Manager mount of `OVERPASS_URL`, not manual `gcloud` set (deploys wipe it). Re-grade WDLL 8/9 only after tip smoke + tier2 `edgeSignal:road` proof.

4. **Atomization of zoning→setback→envelope** — still bespoke `Tier1FacetPayload`; no `@empressaio/atom-contract` in node-facet bake. Confidence is `labeling × district` for envelope only; other facets are per-facet bespoke. Design feedback requested on making this a first-class atom family.

5. **Hard-hold deepen priority** — which of Lockhart PDD/CCB, SM CD-*/MF-*, Kyle R-1-T, SA OCL are worth conditional-model work vs permanent decline?

## 4. Artifacts / references

### Canonical / WDLL

| Doc | Path |
|---|---|
| PE WDLL | `_inbox/2026-07-21_property_explorer_v1_sprint_WDLL.md` |
| PE STATUS (incl. 51–54 grades + Overpass correction) | `_inbox/2026-07-21_property_explorer_v1_sprint_STATUS.md` |
| No-honest-empty amendment | `_inbox/2026-07-23_pe_no_honest_empty_setbacks_WDLL_amendment.md` |
| Coverage inventory | `legacy-design-tools/docs/property-explorer-setback-coverage-central-tx.md` |
| Progress ledger (scratch) | `P:\tmp\pe-setback-populate-progress.md` |

### Code (envelope chain)

| Piece | Path |
|---|---|
| `mapDistrict` | `artifacts/api-server/src/lib/buildableEnvelope/districtMapping.ts` |
| `labelEdges` (road → point → shape) | `artifacts/api-server/src/lib/buildableEnvelope/edgeLabeling.ts` |
| `deriveBuildableEnvelope` (`labeling.confidence × district.confidence`) | `artifacts/api-server/src/lib/buildableEnvelope/derive.ts` |
| Tier1 bake (shape-only; roads deferred) | `artifacts/api-server/src/lib/nodeFacetBakeTier1.ts` |
| Mono promote + unmatched correction | `artifacts/api-server/src/nodeFacetBakeTier1Cli.ts` (`shouldPromote`, `isUnmatchedZoningCorrection`) |
| Setback tables | `lib/adapters/src/local/setbacks/*.json` |

### Merged PR sequence (this flight)

| PR | SHA (short) | What |
|---|---|---|
| #342–#345 | (prior) | Populate / deepen tables |
| #346 | `dbf46bb0` | Unmatched → decline |
| #347 | `328a45c9` | Mono replace invented priors |
| #348 | `d7ac73d4` | SM legacy MU/CC/GC/P/NC/OP; Kyle R-1-A/RS/M-2 |
| #349 | `39f4391a` | Omit Kyle bare R-1 |

### Probe highlights (prod DB, 2026-07-23)

- Caldwell: PDD/CCB/IH/AO/PI/MH → `setback-table-pending`; RLD/RMD/RHD matched.
- Hays / San Marcos: MU ~4.5k matched; GC/CC matched; SF-6 / SF-4.5 matched.
- Hays / Kyle: R-1-T → `setback-table-pending` (145) post-#349; R-1-A/RS/M-2 matched.
- Bexar: full bake EXIT 0; SA C/R/MF matched; OCL/UZROW/FR decline; large null-zoning → I-2 conservative.

## 5. Stakeholder updates

None required outside planning. Operator QA of live PE envelopes is the next human gate when Nick wants it.

## 6. Context for the receiving planning agent

Inherit STATUS + this handoff; do not re-derive corpus from archaeology. Treat Overpass as **not mounted on tip** despite older "met" grades. Treat setback **tables** as done for Central-TX empty-table debt; treat **coverage of every GIS code** as intentionally incomplete with hard holds listed in STATUS. Envelope derivation is still Tier1 shape-provisional until roads remount. Atom-contract work on this chain has not started.

### Suggested feedback asks

1. Is "51–53 met / ready for envelope QA" the right bar, or should absent-zoning I-2 fallback and Overpass remount block that call?
2. Priority order among: Overpass remount, `mapDistrict` policy, atomization ADR, next hard-hold deepen.
3. Any amendment needed to WDLL 51–54 wording now that invent paths (#346/#347/#349) shipped.

---

## Planning feedback received (2026-07-23) — closed loop

Full decision: `_decisions/2026-07-23_pe_envelope_atom_spine_and_post_map_truth_pickups.md`.

| Ask | Answer |
|---|---|
| 51–53 bar | Yes for **tables**; do not imply envelope done. Separate grades: tables QA-ready; envelope blocked on Overpass + absent-zoning invent. |
| Priority | (1) Atomization main thread but **hold** until spine plan; (2) Overpass remount durable; (3) mapDistrict tighten **do not** (absorbed by atom confidence grading); (4) hard-hold deepen **stop**. |
| I-2 fallback | Invent at scale; near-term honesty fix (fallback/decline state, not stamped matched I-2); post-atom = honest-absence atom. |
| Atom home | **hauska-engine**, not cortex-api. Sprint-56 reasoning lift = the atom refactor. Do not open atomization in `artifacts/api-server`. |

**Safe in-place pickups now:** Overpass workflow/Secret Manager mount; absent-zoning I-2 honesty.
