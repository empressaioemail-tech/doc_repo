---
id: 2026-08-31_p101_ladder_build_WDLL
title: WDLL — P-101: implement the ladder re-cut (gates and copy, seats split out)
date: 2026-08-31
last_updated: 2026-08-31
status: open
applies_to: legacy-design-tools (api-server routes, smartsite-mcp), hauska-map (property-explorer pricing surface)
plan_row: P-101
depends_on: _decisions/2026-08-31_smartsite_ladder_recut_studio_works_a_list.md and its 2026-08-31 amendment, _inbox/2026-09-01_p101-scope_close.json
operator_go: 2026-08-31 (calls 1 and 2 ruled)
snapshot: scoped read-only against legacy-design-tools 26068a1e and hauska-map 8740558d
owner: property seat (lane planner); planner verifies and commits doc_repo
---

# P-101 ladder build

Date: 2026-08-31  Status: open

Implements the ruled re-cut: Solo answers one parcel, Studio works a list. Prices do not change. Studio two seats is NOT in this card; it is P-102.

Do not re-derive the scope. `_inbox/2026-09-01_p101-scope_close.json` is the inventory and it corrected two claims in the ruling itself. Read it and the decision's amendment before starting.

## Operator rulings that bind this card

**Call 1, ruled 2026-08-31.** Gate `create_screen` and `add_to_screen`. Leave `list_screens` OPEN. The panel must still mount for a free connector user, so the connector keeps the top-of-funnel role the connector ruling assigned it, and a free user meets an upgrade prompt in context rather than meeting nothing. Nothing real is given away, because `list_screens` on a free account returns an empty list. The job Studio sells is building the list, not reading one you could never create.

**Call 2, ruled 2026-08-31.** Studio two seats is split out to P-102 and is not in this card. It is four coordinated server changes plus an unresolved Stripe product question, sitting behind a 409, with a unit test pinning the current behaviour. Bundling makes the fast half wait on the slow half, and two seats is the weakest line in the re-cut. The pitch is "Solo answers one parcel, Studio works a list", not "Studio gets a second seat".

## Done looks like

A free connector user can still open the Smart Site panel and see an empty screen list, and is refused with a stated reason the moment they try to create one or add to one. A Studio or Team user is not refused. The pricing surface renders four groups, one of which names the records package, and Studio is no longer badged "The packet". Every one of those statements is proven by a test that has been shown to fail when the behaviour is removed.

## Acceptance items

1. **Gate at the route, never as a fourth predicate.** The gate lives on the api-server screens routes. `POST /property-explorer/v1/screens` (`propertyExplorer.ts:546`) and `POST /property-explorer/v1/screens/:screenId/rows` (`:624`) gain a Studio gate in the second middleware position. `GET /screens` (`:574`) and `GET /screens/:screenId` (`:596`) do NOT, per call 1. There is no existing Studio middleware; one is created. It must call the api-server's own `subscriptionTierGrantsStudio`, never a new copy. | check: fail-then-pass per route; a free caller is refused on the two POSTs and served on the two GETs | grade: [ ]

2. **The MCP does not grow a parallel gate.** `create_screen` and `add_to_screen` inherit the route refusal. This works because the trusted-service path carries `X-PE-User-Id` and `resolvePeEntitlement` reads the real tier from `pe_user_entitlements` (`peServiceUserId.ts:28-39`); the tier is never taken from a header. The shipped precedent is `get_smart_site`, which has no local gate and is enforced upstream. If the lane concludes a local MCP refusal envelope is required for refusal quality, it STOPS and reports rather than adding one, because that is the connector-is-a-door ruling's territory. | check: no new `canRun*` call site in `tools.ts`; the refusal reaches the connector | grade: [ ]

3. **The three-copy finding is named, and not made worse.** `subscriptionTierGrantsStudio` exists three times: `peEntitlement.ts:52`, `smartsite-mcp/src/entitlement.ts:27`, `hauska-map entitlementClient.ts:90`. This card MUST NOT add a fourth. It is not required to fix the three, but it reports whether its change makes drift more or less likely. The existing test named "matches api-server predicate" (`smartsite-mcp/tests/entitlement.test.ts:101`) is internal consistency, not a divergence test: it asserts hardcoded booleans against its own local copy and the only occurrence of "api-server" in it is its own title. Do not cite it as coverage. | check: count of definitions before and after is 3 and 3 | grade: [ ]

4. **The gate must be falsifiable, which today it is not.** `smartsite-mcp/tests/tools.test.ts:23-29` defaults every caller to `subscriptionTier: "studio"`, so adding a gate to the screen tools produces ZERO failures in the current suite. Add free-tier cases per gated tool, in the both-directions shape already at `tools.test.ts:501-576`: free is refused AND `expect(mockCortexFetch).not.toHaveBeenCalled()`, Studio is allowed and reaches cortex. A gate that no test can fail is not shipped. | check: new tests fail when the gate is removed | grade: [ ]

5. **Invert the two tests that pin the defect, never delete them.** `propertyExplorerScreensStubs.test.ts:47-61` mocks the paid gate to 402 with a comment declaring a gate on these routes "is a defect". `propertyExplorerScreensLookup.test.ts:36-48` mocks `resolvePeEntitlement` to return undefined, so any in-handler tier read throws. Both are rewritten to assert the NEW behaviour and shown failing on the old. Adding a pass-through to the mock so the file goes green is refused: that converts a defect-pinning test into a test that checks nothing. | check: both files fail before the gate lands and pass after | grade: [ ]

6. **The pricing regroup is a CODE change, not a config edit.** `PricingModal.tsx:61-65` hand-writes the three groups as a literal array with hardcoded testids, and nothing anywhere iterates `PE_PRICING.groups`. Editing only `pricing.ts` ships a fourth group that renders nowhere while the existing modal test still passes. Both files change. Four groups render: Answer this parcel, Work a list of them (screens, owner data, records), Hand it off (site plan CAD, terrain), Work as a firm. | check: a rendered-output assertion on the new group, not a config assertion | grade: [ ]

7. **The records row is named for the shipped label.** Call it "Records request", matching `reports-catalog.ts:128-140`, not `dossier`. The two surfaces mean different things by `dossier`: on the MCP it is a Studio export kind, on PE it is the X-ray report engine (`reports-catalog.ts:91`) and is not studio-gated. Naming the row after the export kind would inherit that ambiguity into the price list. | check: the row label matches the workbench label | grade: [ ]

8. **The badge assertion must not go vacuous.** `pricing-modal.test.tsx:70` is `expect(html).toContain(PE_PRICING.studio.badge)`. If the badge is emptied to `""` rather than replaced, `toContain("")` passes on anything. It becomes a positive assertion on the new badge string plus a negative on `"The packet"`. | check: the test fails if the badge is emptied | grade: [ ]

9. **The free-user panel still mounts.** `create_screen` and `list_screens` are two of three `APP_HOST_TOOLS` (`mcp-app.ts:28-32`) that attach the panel resource. With call 1 applied, `list_screens` keeps the panel reachable for a free user. Prove it: a free-tier connector call to `list_screens` returns 200 with an empty list and the panel `_meta.ui` attached. | check: fail-then-pass; a free caller is not left with zero panel entry points | grade: [ ]

10. **The dead control gets an upgrade path.** `mcp-app.ts:627` renders "Add to screen" on every row unconditionally, and `mcp-app.ts` has no entitlement input at all. Either the button reflects entitlement, or the refusal renders in the panel using the existing `upgrade_required` path at `mcp-app.ts:2282-2286`. `UPGRADE_TO_OPEN` ("Upgrade to open this parcel", `mcp-app.ts:307`) is about a parcel and needs a sibling string for a screen; it is not reused verbatim. | check: a free user clicking it meets a stated reason, not a bare failure | grade: [ ]

11. **Stale marketing copy is corrected in the same card.** `ClaudeSyncTool.tsx:405` `CLAUDE_CAN_DO` promises every connected user "Screen a pasted list" and "Keep a screen" with no tier qualifier. Its own file header says a card naming a capability the product cannot deliver is a promise it cannot keep. Those rows are qualified or removed. | check: the existing guard test still passes and the copy no longer over-promises for free | grade: [ ]

12. **Prospect is doc-only here.** "Prospect" appears in zero shipped surfaces in either repo. If a monitoring row is added to the comparison table, `cells.comingSoon` is the mechanism and it currently has zero consumers, so it is a live dormant mechanism this card may feed. If a coming-soon row is added, check it against the three tests that assert "Coming soon" stays off the purchase surface (`reports-catalog.test.ts:17-28`, `claude-sync-tool.test.tsx:133`, `lock-matrix.test.tsx:360`) rather than discovering them in CI. | check: either no row and it is stated, or a row plus those three re-checked | grade: [ ]

13. **Verify by violation, both directions, verbatim.** Every check above is shown failing on a deliberate violation and passing on restore, with the failure text quoted. A check observed only passing has not been observed working. | check: the close carries both directions per item | grade: [ ]

## Explicitly not this card

Studio two seats, which is P-102. The three-copy consolidation of `subscriptionTierGrantsStudio`, which is named in item 3 but not fixed here. The site plan CAD sold-versus-enforced divergence (`pricing.ts:167-171` sells it Studio-only, the PE workbench catalog carries no `studioGated` flag on `SITEPLAN`, `SPPDF`, `SPDXF`, `SPIFC`), which predates this ruling and is routed as its own item. The retired-price seam retirement, which is P-103. Prices, which are locked and untouched.

## Leave behind

Declared at close per the contract, `none` being a valid answer.
