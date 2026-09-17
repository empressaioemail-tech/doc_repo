## Mission — P-270, P-272, P-291: the card tells the truth about where it is and what backs it

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-map` and `legacy-design-tools` and open
ONE PR per repo. You do not merge and you do not deploy; the integration seat does both.

### Where you work

Fresh clones from `origin/main` under `P:/tmp/` into NEW directories: `hauska-map` (main
`3ee35d5e` at compile) on branch `fix/card-truth-p270-p272-p291`, and `legacy-design-tools` (main
`7219b707` at compile) on the same branch name. Register each clone under the property seat and
remove the entries at close.

**Open lanes to stay clear of.** P-318 holds `hauska-map/.github/workflows/**` — never touch a
workflow file. P-254 holds doc_repo `scripts/surface-probe.mjs`; you write NO doc_repo file. A
Williamson identity lane (P-271) is reading the bake and the address compose path: you own the card
TEXT and the draw gate, never the parcel identity or the bake.

### The three rows, and what "done" means for each

**P-270 — the card names its governing city and its citation's date.** Measured: the Pflugerville
card read "Travis County" while the ledger holds `situsCity`, `situsZip`, `cityLimits` and
`zoningJurisdictionKey` (XD-8), and the Pflugerville setback citation carries no effective date
(XD-11). Done: the address line takes city and ZIP from the ledger; the zoning and setback rows name
the jurisdiction they are ruled by; every setback citation prints its effective date, or a declared
"date unreadable" conflict row (never a blank).

**P-272 — an unreadable situs no longer stops the draw.** A parcel whose zoning and setbacks resolve
draws nothing because its situs reads ", ," (XD-9). Done: a malformed situs never blocks the
envelope draw, and the card says the address is unreadable rather than printing punctuation. Find
the gate that couples the address to the draw and say in the close why it was coupled.

**P-291 — a bake-only answer says so on the surface.** Nineteen Texas counties hold Tier-1 bake rows
(5.14M) and thirteen of them are outside the six this program grades; Bell (48027) is one and serves
real facts on `get_smart_site` today. Operator ruling A-184: keep serving them, each with a visible
"not yet verified" statement. Done: a county outside the graded six carries that statement on the
card and in the MCP payload, worded once and read from one place; a graded county carries nothing
new. You are NOT moving Bell off the bake (Phase 2) and NOT changing what is served.

### Ground truth you start from (2026-09-17, integration seat)

- cortex-api serves `00824-qay` (LDT `7219b707`), Property Explorer serves `mfesp954e` (map
  `3ee35d5e`), retrieval `00098-cat`, engine-api `00249-kiw`.
- P-256's applies landed today: every setback cell that claimed an unearned absence is now a value,
  a refusal, `not-applicable`, or `unaccounted`. Cards in the six counties may therefore show
  refusals where they used to show a bare absence; that is correct and is not yours to hide.
- P-304 withholds the buildable-area figure without a verified atom, and P-303 draws the
  "not onboarded" class. Do not re-open either.

### Falsifiers — pre-register your predictions before building

1. A Pflugerville fixture renders its own city and ZIP from the ledger, and a parcel in another city
   renders that city (the string is not hardcoded anywhere).
2. A setback citation with no readable effective date renders the declared conflict row, and one
   with a date renders the date (both by test).
3. A `", ,"` situs fixture draws its envelope and prints "address unreadable"; reverting the change
   fails that test.
4. A Bell (48027) fixture carries the "not yet verified" statement; a Bastrop (48021) fixture does
   not; the statement exists in exactly one place in each repo.

### Do not

- Merge, deploy, write any store, or touch a workflow file.
- Change what is SERVED (values, dispositions, geometry) — this lane changes what the card SAYS.
- Launch sub-agents.

### Close

Snapshot per repo; files touched; each PR with every CI check's literal conclusion string; the
falsifiers with evidence; the parcels you rendered against. `status`: `closed-partial` until the
integration seat deploys and P-254's fixtures grade the three on the live surfaces. `probe`:
`{"notApplicable": "card lane; graded by P-254 fixtures after deploy"}`. `subAgents`.
`leave_behind`.
