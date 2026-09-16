## Mission — P-269: an unaccounted dollar cell refuses; it never falls back to the legacy value

You launch no sub-agents (FAN-DEPTH 0). You build in `legacy-design-tools` (and in `hauska-map`
only if your CP1 read shows a surface there cannot render the new state) and open PRs. You do
not deploy.

### Where you work

Fresh clone from `origin/main` under `P:/tmp/` into a NEW directory, branch
`fix/p269-dollar-rails-refuse`. Declare the start commit (LDT main was `9ce30b8` at compile).
Register the clone in `_catalog/seat_register.json` under the property seat, and remove the entry
at close. P-249 (PR #701) is open on `artifacts/api-server/src/lib/buildableEnvelope/`, and P-296
may open on the ETJ path. You touch neither. If you need hauska-map, the P-249 map branch
(PR #409) is open on `apps/property-explorer/api/_lib/atom-chain-to-facets.ts`'s envelope
branch; stay out of that branch.

### The defect (read at LDT `9ce30b8`)

`artifacts/api-server/src/lib/cadRollFactFromParcelRecord.ts`:

- `dollarFactFromParcelRecord` (line 68): a `refused` cell (unaccounted, engine-refused,
  store-not-configured) returns `null`, and the header says "the caller keeps the legacy value
  in that case". A `value` cell whose payload does not coerce also returns `null`, so the legacy
  value is served there too.
- `resolveValueBasisFromParcelRecord` (line 121): any assessedValue cell that is not a present
  dollar defaults `valueBasis` to `stratmap-redistributed`, a label nothing verified.
- `livingAreaSqftFromParcelRecord` (line 144) and `yearBuiltFromParcelRecord` (line 163) have the
  same refused-becomes-legacy shape.

OPS-23 law (the ledger is the serving path) says an unslated or unaccounted rail refuses and
never falls to legacy. The teardown confirmed this at `0bf2377f`.

### What to build

1. **CP1 first:** list every caller of the four functions above (the serve cutover modules,
   `cadRollServeCutover.ts` and any `*FactServeCutover.ts`), and every surface that renders the
   resulting wire: the facets payload, the smartsite MCP payload, and the hauska-map card that
   reads the facets. Say for each what it does today with `null`, and what a declared refusal
   will look like there.
2. An `unaccounted` or otherwise refused dollar cell, on a slated pair, reaches the customer as a
   declared refusal with its reason on every surface in your CP1 list, never as the legacy value.
   Pick the wire shape from what the repo already uses for a refusal (name it in CP1); do not
   invent a fourth absence state if one exists.
3. A `value` cell that does not coerce is a refusal with a named reason, not a silent legacy
   fallback.
4. `valueBasis` is absent when the store asserts nothing about assessedValue (refused or
   unaccounted). Whether an `absent` assessedValue cell still supports `stratmap-redistributed`
   is a question you answer in CP1 from the CTX-B1 ruling (A1) and the StratMap adapter's own
   reach; do not change it without that answer.
5. `livingAreaSqft` and `yearBuilt`: same treatment if your CP1 list shows the same serve path;
   otherwise report them as a named follow-on.
6. Tests assert each case, including one that fails if a refused cell ever yields the legacy value.

### The consequence you must measure before claiming anything

A-186 measured that every dollar floor rail reads `pass` in all six counties, so this change
should be invisible there today. Confirm it: count, read-only, the unaccounted and refused cells
on the four dollar rails and the two structural rails for slated pairs in the six counties
(factory store, `FACTORY_DATABASE_URL_RO`, index-bounded `place_key` ranges, statement timeout set).
If the count is not zero, the PR changes what customers see there; state the counts per county
in the PR body.

### Falsifiers, pre-register your answers first

1. A slated pair whose `marketValue` cell is `unaccounted` serves a declared refusal, not the
   legacy dollar figure.
2. A slated pair whose `assessedValue` cell is refused serves no `valueBasis` label.
3. A `pass` county's dollar values are byte-identical before and after on a fixture parcel.
4. Deleting the refusal branch fails a test.

### Do not

- Change the slate, the allowlist, or any factory writer.
- Touch `buildableEnvelope/` or the P-249 map branch.
- Deploy, or launch sub-agents.

### Close

Snapshot per repo; files touched; each PR with every CI check's literal conclusion string; the
CP1 caller and surface list; the read-only counts with the SQL and its snapshot time; the four
falsifiers with evidence. `status`: `closed-partial` until deployed and graded on the served
surface. `probe`: `{"notApplicable": "build lane, PR not deployed; graded by P-254 fixtures on a
slated pair once deployed"}`. `subAgents`. `leave_behind`.
