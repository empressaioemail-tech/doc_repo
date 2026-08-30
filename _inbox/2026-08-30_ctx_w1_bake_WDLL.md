---
id: 2026-08-30_ctx_w1_bake_WDLL
title: WDLL — CTX W1: last bake inputs (situs, tax year, landUse, honest point)
date: 2026-08-30
last_updated: 2026-08-30
status: amended
applies_to: legacy-design-tools (conformant tier 1 bake)
plan_row: F-06, F-08
depends_on: _inbox/2026-08-30_ctx_facts_complete_WDLL.md items 6 and 11, _inbox/2026-08-30_ctx_w0b_prebake_review_WDLL.md, _inbox/2026-08-30_ctx_w0_point_source.md, _inbox/2026-08-30_ctx_w0_tax_year.md, _decisions/2026-08-30_ctx_one_more_bake.md, _decisions/2026-08-30_ctx_cad_txgio_alias.md, _inbox/2026-08-30_ctx_w1_alias_WDLL.md
operator_go: 2026-08-30 (parent one-more-bake; start only after W0b)
snapshot: integration P:/doc_repo; live remainder 232770 unstamped 0,0; Travis 119389 no-row; ~58461 gate-blocked non-sentinel points; seed unlifted
owner: property-seat subagent produces the diff; planner commits
---

# CTX W1 bake

Date: 2026-08-30  Status: amended

Parent item 6. One LDT PR. No publish. No P-80. Starts after W0b.

This reverses a locked `joinNormalize` decision (`if (!blockedFips.has(countyFips)) return null`). It does not "extend" a path that already runs on 48021 / 48055 / 48453. Blast radius includes the conformant bake, the old bake, and `parcelsPmtilesBakeCli`.

## Done looks like

Leftover `no-row` on 48021 / 48055 / 48453 that carry a situs key, and that passed the W0b owner-agree sample, run the owner-gated situs path. A recovered row is `joined-situs`. A refused row stays `no-row` or `gate-blocked` with the basis named. 48209 and 48491 still fail a `prop_id` join in tests. Tax year follows `_inbox/2026-08-30_ctx_w0_tax_year.md`. landUse is projected from the source W0b named, or written absent-verified, never `null` plus `coverage: false`. A `gate-blocked` or sentinel write does not keep a prior non-zero query point. Recovery that writes zero recovered rows fails the card. A new `joined-situs` emits a bind record for the alias persist card. This PR does not write `identity.alias` atoms.

## Acceptance items

1. **Situs recovery on leftover no-row.** After W0b go per FIPS: leftover no-row on 48021, 48055, 48453 may fetch `txgio_parcel` by normalized situs and pass the row only after `ownersAgree`. Fixtures: situs match used, `prop_id` match on a blocked FIPS ignored, punctuation-only situs still refused. A FIPS that W0b marked no-go is not coded. | check: fail-then-pass fixtures; W0b go/no-go cited | grade: [W0b: 48021 no-go 0.688 n=32; 48055 no-go 0.721 n=43; 48453 unmeasured. Do not code situs-extend on any of the three.]

2. **Seed stays.** Tests still fail a `prop_id` join on 48209 and 48491. `LANDUSE_JOIN_DISABLED_FIPS_SEED` unchanged. | check: existing seed tests plus a new not-vacuous case | grade: [met — c7685e6a; seed {48209,48491}; 48021 still joins]

3. **Tax year.** Max-year rule from the W0 draft. Disagree refuses. Provenance records `taxYear` and `taxYearRule`. Winner is deterministic (ORDER BY), not arbitrary-wins. | check: fixtures for singleton, agree, disagree, unyeared | grade: [met — max-year / agree / disagree / unyeared; winner entity_id ASC]

4. **landUse from the named source.** W0b item 1 names the source. The bake projects that field or writes absent-verified (verdict, authority, scopeSearched, asOf, basis). `landUse: null` plus `coverage: false` fails the fixtures. `landUseGateBlocked` is not hardcoded false. A-025(1) is the authority. | check: fail-then-pass on Pine and Rainmaker A1; Travis blank is a fail if the source is present | grade: [met — named A1; null+false illegal; gate follows join]

5. **Non-vacuous recovery.** The PR reports recovered-row counts per FIPS. A run that recovers zero on a go FIPS fails this item. `fetchCountyLandUseByAddress` returning an empty-but-truthy map is a fail. No `?? "48021"` county default. | check: fixture where recovery is empty must fail the card | grade: [n/a — no go FIPS]

6. **Honest point on refuse.** When the new row is `gate-blocked` or a 0,0 sentinel, the upsert does not keep a prior non-zero point (`CASE WHEN EXCLUDED = 0,0 THEN keep prior` is gone or gated). Gate-blocked writes 0,0 or omits the point. This is the 58,461 clear. Name `parcelsPmtilesBakeCli` in the blast-radius note. | check: fail-then-pass; a prior fabricated centroid is overwritten | grade: [met — KEEP-PRIOR CASE gone; EXCLUDED coords; PMTiles named]

7. **Handback.** Diff by file; typecheck; vitest for files touched; `leave_behind`. No commit, push, bake. | check: handback | grade: [met — `_inbox/2026-08-30_ctx_w1_band0_handback.md`; planner committed c7685e6a]

8. **Alias first, then situs.** If an open `landing_cad_txgio_alias` / `identity.alias` exists for the CAD node, join from that TxGIO key (`source: cad-txgio-alias`). Situs plus `ownersAgree` runs only on unbound rows. Each new success emits the bind record `_inbox/2026-08-30_ctx_w1_alias_WDLL.md` item 4 consumes. | check: fixture alias hit skips situs fetch; new bind is in the emit set | grade: [met — READ only; empty emit legal]

## Amendments

1. 2026-08-30: Added landUse, non-vacuous recovery, honest-point upsert. Re-scoped item 1 from extend to reverse-a-locked-decision. Reason: remainder review findings 1, 3, and 5; operator one-more-bake lock.

2. 2026-08-30: Item 8. Bake reads the durable alias first. Recovery still finds unbound rows. Atoms stay on the alias card. Reason: operator yes to persist CAD to TxGIO binds as aliases.

3. 2026-08-30: W0b item 2 graded. Situs-extend is off for 48021 / 48055 (below 0.86 leftover owner-agree) and 48453 (unmeasured). Item 5 non-vacuous does not apply to a no-go FIPS. landUse / tax year / honest point / seed / alias-first still run. Reason: leftover numbered-street sample `_inbox/2026-08-30_ctx_w0b_owner_agree.json` 2026-08-30T15:50:35Z.

## Do not

- Start before W0b grades.
- Lift the seed or join 48209 / 48491 on `prop_id`.
- Invent a Travis `geo_id` join.
- Bake or publish.
- Touch hauska-map (PE is a sibling card).
- Touch Factory walk grades (W1-walk is a sibling card).
- Leave a gate-blocked non-zero point for a later card.
---
