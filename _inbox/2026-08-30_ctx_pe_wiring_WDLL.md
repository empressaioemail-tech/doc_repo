---
id: 2026-08-30_ctx_pe_wiring_WDLL
title: WDLL — CTX PE wiring (copy scope, Zone vs zoning, A1 default, yearBuilt)
date: 2026-08-30
last_updated: 2026-08-30
status: approved
applies_to: hauska-map (apps/property-explorer)
plan_row: F-06
depends_on: _decisions/2026-08-30_ctx_one_more_bake.md, _inbox/2026-08-30_ctx_w0_pe_probe.json, _inbox/2026-08-30_ctx_remainder_deep_review.md §3.3 §3.5
operator_go: 2026-08-30 (PE card under the CTX complete umbrella; Band 0 after review; does not wait on W0b reads)
snapshot: hauska-map origin/main; #310 merged 1a00b27; BFF drops stamp-missing / unmeasured; zoningFact declineReason never inspects a verdict
owner: property-seat subagent produces the diff; planner commits and deploys; customer-done is a live brief plus a deployed-bundle marker
---

# CTX PE wiring

Date: 2026-08-30  Status: approved

#310 widened a type union. It did not change a label. Redeploying current main changes nothing. This card is the missing change. It does not bake. It does not block Wave R publish. It blocks parent close.

## Done looks like

On live smartsite.cloud, Laird (48453:231086) names `stamp-missing`. Shoalwood (48453:493738) names `unmeasured`. Rainmaker (48021:8720522) does not say the area is unstamped while zoning is PDD; setbacks may still refuse. The header does not print land-use as "Zone" over the zoning row. The chip is not `A1 — A1` from a defaulted description. yearBuilt 2021 / 1910 is said when the wire has it. Travis golds are in the acceptance set, not only Bastrop. A deployed-bundle marker proves the serving JS contains the change.

## Acceptance items

1. **BFF admits the two verdicts.** `api/_lib/verdict-layer-merge.ts` no longer drops `stamp-missing` or `unmeasured`. `layerAbsenceFromRecord` returns a value for both. Fail-then-pass fixtures. | check: fail-then-pass on the BFF union | grade: [met — code; live after deploy]

2. **Grey box is per-row, not per-area, and is not one string.** Copy that keys `absent-uncovered` ∩ `inCoverageBlock` over landUse / zoning / setbacks does not print "in this area" for a per-parcel state. Zoning present + setbacks refused is two lines, not one collapsed "not stamped." Do not replace the whole Rainmaker string; the setbacks half is true. | check: fixtures for PDD+no-setback-row, SF-1+setbacks, unmeasured, stamp-missing | grade: [met — code]

3. **Zone vs zoning.** `inspectHighLevelLabel` does not return the literal `"Zone"` for `landUse` while the Zoning row exists. Land use and zoning are two labels. | check: fail-then-pass on the header path | grade: [met — code]

4. **No defaulted A1 — A1.** `description: landUseLabel ?? landUseCode` (or the equivalent that mints `A1 — A1`) is gone. A missing label is absent, not a repeated code. Three renderers of that field agree. | check: fail-then-pass; no `A1 — A1` on Laird or Pine | grade: [met — code]

5. **yearBuilt when the wire has it.** `structuralFact.yearBuilt` 2021 (Rainmaker) and 1910 (Pine) appear on the brief. Source is named. A missing year is not invented. | check: live brief on both parcels after deploy | grade: [partial — copy path exists; live brief owed]

6. **Travis is in the set.** Acceptance probes include 48453:231086 and 48453:493738, not only 48021 golds. A Bastrop-only pass is not this item. | check: live brief on both Travis golds | grade: [partial — list includes Travis; live briefs are item 7]

7. **Customer-done is a live brief plus a bundle marker.** Fetch the deployed index, fetch the bundle, assert a change-marker string that this PR adds. A merged PR is not the grade (#310). hauska-map prod-deploy must fire or the planner deploys. | check: `_inbox/2026-08-30_ctx_pe_live.json` with serving commit, bundle marker, and the four golds | grade: [ ]

8. **Handback.** Diff by file; tests for files touched; `leave_behind`. No commit, push, or deploy from the subagent. | check: handback | grade: [met]

## Do not

- Fix the grey box as a single replacement string.
- Treat #310 as done.
- Bake or publish.
- Invent a Rainmaker ring or setback table.
- Import the SmartCity kit.
- Write PE copy only against Bastrop.
---
