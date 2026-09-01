You MUST NOT spawn sub-agents. Do not git add / commit / push. Do not deploy. Do not vercel. Do not occupy P:/hauska-map or P:/seat-worktrees/property/hauska-map. Do not occupy P:/legacy-design-tools. Do not atoms --apply. Do not start P-52. Do not flip texas-rrc. Do not flip mud-pid.

Plan row P-54. Occupancy: isolated worktree P:/hauska-map-worktrees/serve-pe-p54 branch serve-pe-p54 tracking origin/main (must include PR 181 / boundaryEdgeFact). Create that worktree if it is missing. Doc_repo writes: your _inbox JSON only. Do not paste a live ownerName or mailing into those files. Redact PII.

WDLL: P:/doc_repo/_inbox/2026-08-22_serve_ident_qa_WDLL.md item 7. Cortex is already serving. Execute `_inbox/2026-08-22_p54_cortex_execute.json`. Planner review ACCEPT `_inbox/2026-08-22_p54_cortex_planner_review.json`. Pattern: hauska-map PR 181 boundaryEdgeFact copy.

## Mission

Copy cortex-root `ownerFact` onto SmartSite inspect. This is the PE half of S7. Implement against fixtures. Do not wait.

S7 is identified-session inspect only. Anonymous browse and anonymous inspect never render owner. Fail if anonymous sees owner. Fail if identified is a CAD-roll bake (`cad-parcel-roll` / `cad_property` / GIS `ParcelCardData.owner`) presented as the atom.

Cortex anonymous gold is already `ownerFact.state=refused` `code=identified-session-required` `source=owner-fact` with no ownerName. Identified cortex GET was not run from this seat. Gold store hit is `48021:34137:2025`. Writer key is `${parcelNodeId}:${taxYear}`. Do not copy the special-district `:sd:` picker. Do not copy pipeline `ANY` bind. Do not share the `texas-rrc` key.

The PE BFF must not treat a service key / `X-Hauska-Key` as identified. Cortex `authenticatedBrokerageUserId` requires a dotted session Bearer (`tier=user`, not `anon_`). If the BFF always sends an operator key, owner stays the anonymous refusal. That is correct. For identified inspect, forward the existing user session Bearer to cortex. Quote the existing PE session mechanism. Do not invent Clerk/Stripe.

1. `mergeBakedBaseFacts` (and cortex-off / strip path if live) forwards `ownerFact` from the cortex JSON ROOT. If the root field is missing, leave it absent. Never adopt bake / CAD / `cad-parcel-roll` / GIS owner as that field.

2. Inspect shows an Owner row from `ownerFact` only. Label `Owner`. testid `inspect-owner`.
   - Anonymous (no session, or cortex `code=identified-session-required`): no owner body. Do not render `ownerName` or mailing. A named miss that cites `owner-fact` is allowed. A missing field stays missing.
   - Identified session + cortex `state=present` `source=owner-fact` `entityId=48021:34137:2025` `taxYear=2025`: inspect cites that atom. Display non-PII you already show for other facts; PII only on this identified path.
   - Typed `state=refused` `code=atom-miss` stays visible as an honest miss that names `owner-fact`.
   - A bake / CAD-roll / GIS owner object parked on the root without `state`, or with `source` other than `owner-fact`, is rejected.

3. Dual grammar: integer gold is the live probe. Alias retries when `ownerFact` is missing even if flood / land-use / special-district / pipeline / well / footprint / boundary are already present.

4. `texas-rrc` stays `live:false`. Owner does not share that key. Do not add a GIS owner overlay.

5. Project for a later planner deploy is `property-explorer` / `prj_vcZGXbqdffk5C20WzaplEpzFynK3`. You do not deploy.

Tests: merge copies a fixture `ownerFact` and does not copy bake / CAD-roll / GIS owner onto that field. Anonymous fixture (`identified-session-required`) has no ownerName. Identified gold-shaped present fixture cites `owner-fact` `48021:34137:2025`. Atom-miss fixture does not render a CAD-roll name. Alias retries when `ownerFact` is missing even if the other root facts are already present.

Leave the diff uncommitted.

## Return

CP1 before edits: occupancy SHA, files you will touch, identified-forward quote, anonymous has no owner body, CAD-roll is not the atom, what you will violate. CP2 after tests. CLOSE quotes files and tests. leave_behind: planner PR/deploy PE. Live anonymous smartsite.cloud gold must have no owner body. Live identified must cite `owner-fact` `48021:34137:2025`. WDLL item 7 is not met until those paired probes. Do not start P-52.
