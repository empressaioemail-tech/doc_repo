## Mission — P-246: the valuation gate covers the current-value rails and not the history rail

### The finding, measured live on the customer connector

On 2026-09-16 the operator moved the test account to paid Solo (P-245). The server confirms it: every
refusal on that account now carries `"subscriptionTier":"solo"`. The first `get_smart_site` read on
that account, `48021:34137` (908 PINE, Bastrop) at depth `node`, served by `smartsite-mcp-00124-bub`,
returned this in ONE response:

    onRecord.cadRoll.marketValue      {"state":"refused","code":"studio-gated",
                                       "reason":"County tax-assessed valuation (market/land/
                                       improvement/assessed value) is Studio or Team only.
                                       Anonymous, free, Solo, unlock, and identified-only
                                       callers receive no dollar value."}
    (same refusal on assessedValue, landValue, improvementValue, and on the same four keys in draw.attrs)

    valueHistoryFact.entries[0]       {"taxYear":2025,"marketValue":511345,"assessedValue":null,
                                       "landValue":106715,"improvementValue":404630,
                                       "viaCrosswalk":false}

**The response refuses a Solo caller the dollar value and then hands it over one field later.** The
2025 entry is the current roll year, so these are the exact numbers the refusal withholds. This is a
paid-tier gate that is bypassed on the same wire, and it is also P-217's predicate: a served payload
whose parts disagree.

### What the integration seat read, so you do not re-derive it

Read against `legacy-design-tools` `origin/main` at `ba39b4f5`.

- `artifacts/api-server/src/routes/propertyExplorer.ts`, `assembleNodeBriefBody`: the four dollar
  rails on `onRecord` go through `serializeTwinOnRecord(..., grantsCadRollValuation)`, and `ownerFact`
  is only loaded when `grantsCadRollValuation` is true. **`loadValueHistoryFactForServe(parcelNodeId)`
  is called unconditionally and `valueHistoryFact` is placed on the response unchanged.** The
  parity-audit comment (2026-09-07, D1) that added it says "same loader, reused rather than
  re-derived", and it did not carry the gate across.
- `artifacts/api-server/src/routes/brokerageNodeFacets.ts`, the facets route, also serves
  `valueHistoryFact`. Its `sanitizeNodeFacetPayload` strips owner-shaped keys only.
- `artifacts/smartsite-mcp/src/tool-honesty.ts:544`, the P-220 owner strip, says in its own doc that
  "`valueHistoryFact` and every valuation rail survive." That was deliberate for owner scope, so the
  MCP layer currently trusts upstream for valuation, and upstream does not gate this rail.
- The PE web app (`hauska-map` `origin/main` `f7fbcbff`) has no `valueHistory` reference under
  `apps/property-explorer/src`, so the browser does not RENDER it. Whether the facets route's JSON
  reaches a sub-Studio browser session is for you to establish, not assumed either way.

### The ruling in force

`propertyExplorer.ts`'s own doc for `grantsCadRollValuation`: Studio or Team, OR an active Property
Unlock for this specific parcel, "widened 2026-09-05, Solo stays excluded, confirmed deliberate"
(OPS-16 A-103 item 5 and A-104). The rails-v2 template
(`_decisions/2026-09-01_parcel_record_rails_v2_template.md`) makes `valueHistory` a companion of the
same dollar kinds by tax year and names no separate access pair for it. **No ruling makes value
history public.**

Default for this lane, and reversible by a later operator ruling: **gate every dollar key on every
entry with the same predicate.** Keep `taxYear`, `viaCrosswalk` and the entry itself, and replace
each dollar key with a typed `studio-gated` refusal per field, the convention `serializeTwinOnRecord`
already follows. If you find a ruling that makes prior-year values public, STOP and report it rather
than gating.

### Done looks like

For a caller where `grantsCadRollValuation` is false, no CAD dollar value reaches the wire on any
surface that caller can reach. Every dollar key in `valueHistoryFact` is a typed per-field refusal on
BOTH routes, with the entries and their tax years intact. For a granted caller (Studio, Team, or an
active unlock on that parcel) nothing changes. The smartsite-mcp composer carries a defense-in-depth
strip for these keys, mirroring P-220's posture, so a future upstream regression does not reach an
agent.

### Falsifiers, pre-register your answers before you run anything

1. **Both directions, at the level where entitlement is resolved.** A Solo fixture, a free fixture, a
   Studio fixture and a Property-Unlock-on-this-parcel fixture, each asserted. **The suite's default
   fixture is Studio-tier (P-245), which is how P-220 survived; do not inherit it.** Name the fixture
   each assertion uses.
2. **Delete the gate and confirm a test goes RED with a real dollar value visible in the failure.**
   Do it on the api-server gate and on the smartsite-mcp strip separately; each must fail on its own.
3. **Enumerate every served surface that carries a CAD dollar value and is reachable by a sub-Studio
   caller**, and state gated or not with evidence for each. At minimum: `get_smart_site` at node depth,
   single and batch; the facets route; `run_report`; `export_instrument kind=dossier` (the X-ray is
   Solo-accessible, so check whether its sheets print valuation); `find_parcels` (an ordered filter on
   a gated dollar rail leaks the value by bisection even if the value is never printed);
   `agValuationFact` where slated; `salesHistory` if served. A fix on one surface leaves the others
   lying.
4. **Batch reads.** P-220's leave-behind says a batch `get_smart_site` read checks account-wide tier
   only, not per-parcel unlock. Confirm `valueHistoryFact` in batch mode behaves the same way as
   `onRecord` does, and say which way that is.
5. **The live check is the planner's, after deploy**, on the operator's Solo account against
   `48021:34137`. Hand over the exact call and the exact expected fields. Do not report the row closed
   on fixtures alone.

### Known traps

- **`legacy-design-tools` does NOT auto-deploy.** Push runs build-and-push only; the workflow is
  NAMED "Cloud Run Deploy" and shows deploy jobs skipped. Merged is not shipped.
- The root `tsc --build` is vacuous (`files: []`); use `pnpm run typecheck`. api-server tests are not
  green locally; compare against a main baseline, and treat CI as authoritative.
- Read Cloud Run traffic BY FIELD, never a positional `--format=value`, and never trust
  `latestReadyRevisionName`.
- The vocabulary block riding on every call is P-243's, not yours.

### Do not

- **Do not start until P-243 has released `legacy-design-tools`.** One repo, one writer.
- Do not change tier boundaries: `canRunStudioReport`, `grantsOwnerCoGatedFields` and
  `subscriptionTierGrantsStudio` stay byte-identical, and you add no new tier check. Reuse the
  predicate that exists.
- Do not delete `valueHistoryFact` or its entries. A bare delete is silent degradation; the state is a
  typed refusal.
- Do not touch owner handling (P-220, shipped).
- Do not deploy or merge. Open the PR green and hand it back.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

Show the `valueHistoryFact` block for `48021:34137` under the Solo and the Studio fixture, before and
after. List every surface from falsifier 3 with its verdict and evidence. Name every file changed.
Give the planner the exact live check. Declare `leave_behind` explicitly. State your snapshot (repo,
branch, commit).
