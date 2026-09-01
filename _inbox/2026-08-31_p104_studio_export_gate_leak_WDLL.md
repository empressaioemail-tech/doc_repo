---
id: 2026-08-31_p104_studio_export_gate_leak_WDLL
title: WDLL — P-104: Studio export gate is unenforced on the web; Solo gets CAD and terrain
date: 2026-08-31
last_updated: 2026-08-31
status: open
applies_to: hauska-map (property-explorer BFF + workbench catalog), legacy-design-tools (entitlement contract)
plan_row: P-104
depends_on: _inbox/2026-09-01_p101-scope_close.json risk 4, _decisions/2026-08-31_smartsite_ladder_recut_studio_works_a_list.md
operator_go: 2026-08-31 ("fix site plan cad to what it should be")
snapshot: verified read-only against hauska-map 8740558d and legacy-design-tools 26068a1e
owner: property seat (lane planner); planner verifies and commits doc_repo
---

# P-104 the Studio export gate is unenforced on the web

Date: 2026-08-31  Status: open

The operator asked to fix site plan CAD "to what it should be". What it should be is Studio. Establishing that turned a suspected display inconsistency into a live revenue leak on two of Studio's four differentiators.

## What is actually true

**The web export gate admits Solo.** `apps/property-explorer/api/_lib/pe-site-plan-export-core.ts:430` is `if (input.entitlement.tier !== 'paid')` then 402. A Solo subscriber is `paid`. Solo therefore passes and receives site plan CAD.

**Terrain has the same gate.** The same file at :395-396 says "Same public-paid entitlement tier as terrain export — no new tier this wave." Terrain is equally unenforced on the web; its `studioGated: true` drives only `ReportsTool.tsx:300`, a client lock. A direct call skips it.

**The BFF cannot express Studio at all.** `apps/property-explorer/api/_lib/pe-entitlement.ts:3` declares `export type PeEntitlementTier = 'free' | 'paid'`. `git grep -nic "studio\|subscriptionTier" origin/main -- apps/property-explorer/api` exits 1: zero occurrences anywhere under the BFF.

**Site plan lacks even the cosmetic lock.** Every `engine: "terrain"` catalog entry carries `studioGated: true` (TERRAIN, TERGLB, TERIFC, TERDXF). Every `engine: "site-plan"` entry carries none (SITEPLAN, SPPDF, SPDXF, SPIFC). Four entries.

**Two comments assert the opposite, and both are wrong.** `artifacts/api-server/src/lib/peEntitlement.ts:29-30` and `artifacts/api-server/src/routes/propertyExplorer.ts:276-277` both state that the PE BFF gates Studio-only surfaces, naming CAD, terrain and owner data, on studio-or-team and never on bare tier. The server does supply `subscriptionTier` on `/entitlement`. The BFF never reads it.

**The MCP does enforce it.** `STUDIO_EXPORT_KINDS = ["siteplan","terrain","dossier"]` refuses a Solo caller at `tools.ts:851`. So the same capability is correctly gated on the connector and open on the web.

That last point is worth stating plainly because it inverts an assumption: the connector, which was ruled a free door, is the surface enforcing Studio correctly. The workbench is the leaky one.

## Why this is the worst shape in the doctrine

This is not an absent control. It is a control that is documented as working, has its input supplied, has a plausible-looking client artifact (`studioGated`), and enforces nothing. It passes review, answers "do we gate CAD" affirmatively, and cannot fail. Two independent comments would have satisfied any reader who checked by reading rather than by violating.

## Done looks like

A Solo subscriber calling the site plan export endpoint directly, with a valid session, is refused with a stated reason. So is the same call for terrain. A Studio or Team subscriber is served. Both statements are proven by a test shown failing when the gate is removed, and by a live probe on the deployed host, not by a source diff.

## Acceptance items

1. **The server computes the predicate; consumers do not re-implement it.** `/property-explorer/v1/entitlement` gains a computed boolean (`studioGranted`) derived from `subscriptionTierGrantsStudio` server-side. The BFF consumes the answer. Do NOT add a studio predicate to the BFF: three copies of `subscriptionTierGrantsStudio` already exist (`peEntitlement.ts:52`, `smartsite-mcp/entitlement.ts:27`, `entitlementClient.ts:90`) and a fourth in the BFF is the defect this card should not deepen. | check: definition count is 3 before and 3 after | grade: [ ]

2. **The BFF type is widened so the state is representable.** `PeEntitlementTier = 'free' | 'paid'` cannot express Studio, which is why the gate could not be written. Carry `studioGranted` through `PeEntitlementResult` and `PeEntitlementDetail`. An unrepresentable state gets made representable, never encoded in a sentinel. | check: `tsc` clean; the type carries the field | grade: [ ]

3. **Site plan export requires Studio.** `pe-site-plan-export-core.ts:430` requires `studioGranted`, not bare `paid`. A Solo caller gets 402 with a reason naming Studio, distinguishable from the free-tier 402. | check: fail-then-pass with a Solo fixture and a Studio fixture | grade: [ ]

4. **Terrain export requires Studio.** Same change, same file family. Do not fix site plan and leave terrain, which would make the leak harder to see rather than smaller. | check: fail-then-pass, Solo and Studio fixtures | grade: [ ]

5. **The dossier export path is checked, not assumed.** `dossier` is a Studio export kind on the MCP but on PE is the X-ray report engine (`reports-catalog.ts:91`), which is a Solo capability. Establish which the PE dossier export actually is before gating it, and state the answer. Gating the X-ray to Studio would be a regression that takes a Solo capability away. | check: the finding, with file:line, and the gate applied or explicitly not applied | grade: [ ]

6. **The four site-plan catalog entries get `studioGated: true`.** SITEPLAN, SPPDF, SPDXF, SPIFC. This is the UI half and it is NOT the fix; it is honesty in the surface once the server actually refuses. Landing this alone would be the defect this card exists to remove. | check: the four entries carry the flag and the locked UI renders | grade: [ ]

7. **Correct the two false comments in the same card.** `peEntitlement.ts:29-30` and `propertyExplorer.ts:276-277` describe a BFF gate that did not exist. Once items 1 to 4 land they become true; if any item is deferred, the comment is corrected to say what is actually enforced. A comment that describes an intended state as a present one is how this defect survived. | check: the comments match the shipped behaviour | grade: [ ]

8. **Prove by violation and on the deployed surface.** Every gate is shown refusing a Solo session and serving a Studio session, with verbatim output, plus a live probe against the deployed host with the deployment id recorded. Code-done is not customer-done. | check: both directions per gate, plus the live probe | grade: [ ]

9. **Report the exposure honestly.** State how long the leak has been live if it can be established from git history, and whether any Solo account actually exercised it. If that cannot be measured, say unmeasured rather than implying zero. Absent, zero, and unmeasured are three different states. | check: the statement, with its instrument or its absence named | grade: [ ]

## Explicitly not this card

Consolidating the three copies of `subscriptionTierGrantsStudio`, which is named but not fixed here. Owner data, which IS correctly enforced server-side at `brokerageNodeFacets.ts:210-215`. The screens gate, which is P-101. Studio seats, which is P-102. The retired-price seam, which is P-103. Any pricing change.

## Leave behind

Declared at close per the contract, `none` being a valid answer.
