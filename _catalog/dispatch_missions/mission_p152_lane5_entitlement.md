## Mission — P-152 lane 5: entitlement reaches the engine, and the MCP checks it before it calls

You are the deepest worker in OPS-23 wave 4. You do not spawn sub-agents. The dispatch
planner supervises you and reviews your CP1 design before any code, because this change is
security-relevant.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### Where you work

`legacy-design-tools-p152-entitlement` (branch `feat/p152-mcp-entitlement-check`) and
`hauska-engine-p152-entitlement` (branch `feat/p152-engine-access-tier-gate`), both from
`origin/main`, start commits declared.

### What is true today (P-152 lane 3 close, `_inbox/2026-09-12_p152-rails_close.json`, leave_behind)

- The Property Explorer BFF is fully gated: `requireStudioSession` rejects unentitled callers
  before the export header is built, so the static `x-hauska-access-tier: public-paid` it sends
  is accurate for every caller that reaches it.
- smartsite-mcp has NO entitlement check before calling the engine.
- The engine parses `x-hauska-access-tier` but no route or composer reads it to gate anything;
  the report's dollar-rail composition is ungated, as is the substrate path before it.
- Building the engine-side gate means threading `GateFrontContext` through `parcel-terrain.ts`,
  deciding which of the four access-tier values denotes Studio-or-better, and a typed refusal
  shape. The lane reserved it for review rather than ship it unverified.
- Fleet memory: gate what you SERVE, never what proves you; `X-Hauska-Key` is the MCP's own
  auth header, not Bearer; a wrong header silently falls to public.

### What you build

1. **CP1 design, before code.** Which tier values mean what (from `08_tiered_access_model.md`
   and P-119's package definition), the refusal shape (typed, with `reason`, never a null),
   which composers gate (dollars, owner, and any rail the tier model names), and the negative
   tests: an unentitled call gets the refusal, an entitled call gets the value, a missing header
   gets the refusal (fail closed).
2. **Engine.** The gate reads the tier from the request context on every gated composer; the
   header is not trusted on its own where a signed context exists (`GATE_CONTEXT_SIGNING_KEY`
   is mounted on `hauska-engine-api`; read how it is used before deciding). Tests both
   directions. Deploy under the planner's lease.
3. **smartsite-mcp.** Resolve the caller's entitlement before calling the engine; pass the tier
   the engine expects; on refusal, surface the engine's typed refusal as the MCP's own
   `refused` with `upgrade_required`, matching the vocabulary the connector already publishes.
   Tests both directions. Deploy through the workflow, one lease.
4. **Verify by violation, live.** With a free-tier key (the operator supplies one, or the
   planner uses the anonymous path), call `run_report` and `get_smart_site` for `48021:34049`
   and paste the refusals; with the operator's Studio key, paste the values. Both reads go in
   the close.

### Falsifiers

- If an unentitled live call returns a dollar or owner value from the engine after step 2,
  the gate is not in the path.
- If a missing header returns a value, the gate fails open.
- If the entitled path returns a refusal for the operator's own account, the tier mapping is
  wrong.

### Out of scope

The panel's own gating (P-152 lane 4). Pricing or tier definitions (P-119 is authoritative).

### Close

`_inbox/<date>_p152-entitlement_close.json`, `planRows` `["P-152"]`, with the CP1 design, both
PRs with merge SHAs and conclusion strings, both serving revisions read by field, the live
violation reads, and the planner's probe artifact. `leave_behind` is required.
