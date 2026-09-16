## Mission — P-220: owner data crosses the MCP wire on a tool whose contract says it never does

### The finding, and it is confirmed twice on two counties by two independent readers

`get_smart_site`'s own description states **twice** that the tool never contains owner data, and that
owner is a separate Studio/Team-gated read not carried at any depth. W2 records owner as stripped at
serve by design.

It is not stripped. Measured:

- **Travis `48453:289990`**, integration seat, 2026-09-15 via the live connector at depth `node`:
  `ownerFact` returned `state: "present"` carrying `ownerName`, `ownerMailingAddress`, `taxYear` and
  the full `exemptionFlags` block.
- **Bastrop `48021:34137`**, an independent operator walk the same day: same shape, owner name,
  mailing address and exemption flags.

**This is NOT a missing control, and that is what makes it findable.** The PE facets path at
`/api/spine/property-atoms/{node}/facets` strips it CORRECTLY — `ownerName`,
`ownerMailingAddress` and `exemptionFlags` are all absent there, read live 2026-09-15. So a working
strip exists in this codebase on one serve path and does not run on the other. **You are porting a
strip, not designing one.**

### Why this is P1 rather than cosmetic

Three separate problems in one defect. It is a **privacy exposure**: owner name and mailing address
reaching any authenticated caller. It is a **commercial giveaway**: owner of record is a Studio-tier
feature being handed out at a lower tier. And it is an **honesty defect**: a tool description
asserting something its own output contradicts, which is the class this program refuses everywhere
else.

### Repo

`legacy-design-tools` — `artifacts/smartsite-mcp` plus whichever serve layer applies the strip.
Trace the live call before editing. **Find the facets-path strip first and read it**, because it is
the reference implementation and the answer is probably "call the same thing".

### Done looks like

Either every serve path applies the same strip, proven by violation on both paths with the same
parcel, **or** the contract text is corrected to describe what is actually served.

**Pick one and make them agree. Do not leave a tool description asserting something its output
contradicts.** The row's own predicate says so. The integration seat's read is that stripping is
obviously right here, because the facets path already proves the product works without owner on this
surface — but if you find a real consumer depending on owner over MCP, that is a finding worth
reporting rather than breaking.

### Falsifiers, pre-register your answers before you run anything

1. **Prove it on BOTH paths with the SAME parcel.** Facets and MCP, `48021:34137` and
   `48453:289990`, before and after. A fix demonstrated on one parcel in one county is how this
   defect survived being "stripped at serve by design" in the first place.
2. **Enumerate every depth and every tool that can carry `ownerFact`.** `get_smart_site` at `stub`
   and at `node`, `run_report`, and anything else that composes the same facet bundle. P-220's
   original measurement found it on `get_smart_site` **and** `run_report`. A fix on one is half.
3. **Delete your strip and confirm a test goes red.** A strip observed only on a parcel that has no
   owner record proves nothing.
4. **Confirm nothing else vanished.** Removing owner must not remove `taxYear` or valuation rails
   that legitimately belong on this surface. Diff the served payload before and after and name every
   field that changed.
5. If you conclude the contract text should change instead of the behaviour, say so with the
   reasoning and **do not do both**. Silently stripping AND rewriting the description hides which one
   was the defect.

### Known traps

- **`exemptionFlags` is owner-adjacent and easy to miss.** Homestead and senior/disability status is
  personal information about the occupant. It was present in both measurements. Strip it with the
  rest unless you can state why it is not owner data.
- Two other defects are live on this exact surface and are **NOT yours**: the MCP app never binds
  (**P-243**), and `pipelineFact` contradicts the pipeline overlay in the same response
  (**P-217** instance nine). Do not fix them, do not hide them.
- LDT's root `tsc --build` is VACUOUS (`files: []`). Use `pnpm run typecheck`.
- esbuild conditions stay `["workspace"]`. Broadening them boot-crashes pg ESM.
- api-server tests are not fully green locally. Baseline-compare against main; CI is authoritative.
- **This repo does NOT auto-deploy.** Push runs build-and-push only; the workflow is NAMED "Cloud Run
  Deploy" and reports success while the deploy jobs show skipped.

### Do not

- Do not fix P-243 or P-217 here.
- Do not change tier boundaries or entitlement policy.
- Do not deploy or merge. Open the PR green and hand it back.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

Paste the served payload before and after, for both serve paths, on both named parcels, with the
owner fields visibly gone. List every tool and depth you enumerated. State what you deleted to prove
the strip can fail. Declare `leave_behind` explicitly. State your snapshot (repo, branch, commit).
