## Mission — P-242b: record request goes coming-soon on the web surface, disabled and labelled

### The ruling you are implementing

Operator ruling 2026-09-15, recorded at
`_decisions/2026-09-15_record_request_coming_soon_all_surfaces.md`:

1. **All surfaces.** Web and MCP connector both.
2. **Disabled AND labelled**, not labelled alone.
3. **MCP tools stay listed and return a declared coming-soon refusal**, not removed from the catalog.

**This lane is the WEB half only.** The MCP half is a separate lane in `legacy-design-tools`, which
is occupied right now by P-242's disclosure lane. Do not touch `artifacts/smartsite-mcp`.

### Why it is coming-soon, so you scope it correctly

The flow runs to completion and delivers nothing a customer can read. P-223 measured
`records_request_jobs` at 42 rows; the operator's own account owns two, **both `status=needs-human`,
both completed, both with zero artifacts.** This is not a mislabelled UI. Scope accordingly: the
goal is that a customer cannot start a flow that will not deliver, and is told why.

### Repo and the real paths

`hauska-map`. The mechanism already exists. **Verified against `origin/main` by the planner, and
note the paths are app-relative in the source note but repo-relative here:**

    apps/property-explorer/src/lib/pricing.ts                      (comingSoon: "Coming soon")
    apps/property-explorer/src/workbench/Workbench.tsx             (`${tool.label} · coming soon`)
    apps/property-explorer/src/workbench/tools/ReportsTool.tsx     ("Coming soon")
    apps/property-explorer/src/workbench/tools/reports-catalog.ts  ({ text: "Coming soon", color: MUTED })

`ReportsTool.tsx` line 1 carries the standing rule verbatim: **"Coming soon is not on the purchase
surface."** That rule is why labelled-alone is not the ask, and it is already canon in this file.

### Done looks like

Record request reads as coming-soon and **cannot be purchased or started** from the web app. The
label and the disablement land together; neither alone satisfies this row.

### Falsifiers, pre-register your answers before you run anything

1. **Try to buy it.** Drive the purchase path end to end as a customer and confirm it refuses. A
   greyed control that a direct route, a deep link, or a keyboard path still reaches is a label, not
   a disablement, and this row already rejected labels.
2. **Enumerate every entry point to the flow before you change one.** Tool tile, reports catalog
   row, any deep link, any CTA elsewhere in the workbench. A fix on one entry with three left open
   is the call-site defect class this program keeps finding. Name the full set in your close.
3. **Confirm the tool did not vanish.** The operator ruled for disclosure, not concealment: the
   customer should see record request labelled coming-soon, not find it missing. If your change
   removes it from view, that is the wrong half of the ruling.
4. **Do not let it read as an error or a lock.** Coming-soon is neither a failure nor an upgrade
   prompt. If the disabled state renders through an error or entitlement-refusal component, it will
   read as "you cannot afford this" or "something broke", both of which are false.
5. If you find record request is already unreachable from some surface, say so rather than adding a
   second mechanism on top. An honest no-op on that path is a result.

### Known traps

- **A claim in the upstream reconciliation did not survive verification, so do not inherit its
  siblings.** That doc cited a `LayersControl.tsx` disclosure mechanism as existing; the P-241 lane
  found **no such mechanism in current code**. Verify any pattern you intend to reuse actually
  exists at `origin/main` before you build on it.
- `P:/hauska-map` may be stale. Read `origin/main` after an explicit fetch, and cut your worktree
  from `origin/main`.
- **hauska-map does NOT auto-deploy.** Vercel ships by CLI from the repo root of a clean clone at
  `origin/main`, per app. Merged is not shipped; say so plainly in your close.
- `Age:` cannot tell you which build is serving. Use asset existence against the live alias: the
  live build returns `application/javascript` for its own `/assets/index-*.js`, every other build
  falls through to the SPA handler as `text/html` **with HTTP 200**.

### Do not

- Do not touch `artifacts/smartsite-mcp` or anything in `legacy-design-tools`. Another lane owns it.
- Do not change tier boundaries, pricing, or entitlement policy. Coming-soon is not an upgrade gate.
- Do not remove record request from view.
- Do not set or imply a return date. None was decided.
- Do not deploy or merge. Open the PR green and hand it back.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

Name every entry point you enumerated and what each does now. State how you proved the purchase
path refuses, including the direct or deep-link route if one exists. Confirm the tool is still
visible and reads as coming-soon rather than as an error or a lock. Declare `leave_behind`
explicitly. State your snapshot (repo, branch, commit).
