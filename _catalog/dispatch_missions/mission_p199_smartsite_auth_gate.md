## Mission — P-199 / AUTH-GATE: name the cause, fix only the unambiguous one

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

**This row is a DIAGNOSIS. Three mutually exclusive causes produce three different fixes, and
picking the wrong one is worse than waiting.** You have conditional fix authority, defined
below, and it applies to exactly one of the three.

### The observation

Operator, 2026-09-14, two screenshots. An **incognito** session at
`smartsite.cloud/?via=empressa` opens **1006 HILL ST, BASTROP, TX 78602** (APN `34841`,
Bastrop County) and, after clicking **"More facts"**, reads the entire brief with no
authentication:

```
zoning MU · setbacks F 15 / S 5 / R 15 · buildable · special district · pipeline
well · footprint · boundary · city limits · who-serves · school district
utility service · overlay districts · agValuation · maxImperviousCover
```

Operator intent: **the brief should require sign-in.**

### The clue that should shape your whole approach

**Two gates are visible and only one fires.**

- **Owner** and **tax-assessed value** ARE gated: "Owner data is on Studio. Upgrade to see
  who owns this parcel."
- The **sign-in** gate fires only on the deep-research **tool**, not on the brief.

So the gating machinery exists and works. **The question is not "why is there no gate." It is
"why does the working gate cover exactly two fields and nothing else."** Answer that and the
cause usually falls out.

### Phase 1 — one minute, do this before anything else

Incognito load of the test parcel **with** `?via=empressa` and **without** it. Compare what
the brief serves in each.

`?via=empressa` is a PromoteKit affiliate param, and **p185 deployed PromoteKit to BOTH the PE
site and cortex-api on 2026-09-14**, the same day as the observation. If behaviour differs
between the two loads, this is a fresh regression from today's deploy, the cause is settled,
and you should stop investigating and go to the fix.

If behaviour is identical, hypothesis 1 is eliminated. Say so explicitly and continue.

### Phase 2 — read the policy, not the UI

Read the `accessPolicy` on the atoms actually backing the served fields: zoning, setbacks,
who-serves, utility service, overlay districts.

**`accessPolicy` gates a WHOLE ATOM, never a field.** If those atoms carry `public-free`, then
**the surface is correctly serving what the policy says** and the defect is upstream in the
policy rather than in the UI. This matters enormously for the fix: a gate added at the surface
would leave every other consumer still serving the same body, the **MCP catalog tools
included**, because returning the body whole is their job by design.

### Phase 3 — find the working mechanism

Determine exactly how owner and tax-assessed value come to be gated when the rest are not.
That path is the working example. Name the mechanism, name where it is applied, and name why
it does not extend to the other fields.

### Fix authority — CONDITIONAL, read carefully

**Fix ONLY if phase 1 shows a regression introduced by p185.** That case is unambiguous: a
deploy landed today and changed behaviour, and restoring it is repair.

**If the cause is (2) an atom-policy question or (3) a tier-width question, STOP and hand
back with the cause named.** An atom-policy change and a pricing ruling are both outside this
lane. Reporting the cause precisely IS the deliverable in those two cases and is worth more
than a fix that papers over it.

**Never fix this by adding a field stripper at the surface.** Protection that lives downstream
of the policy only covers the consumers that implement it. If a field must be gated, the
correct fix is to move it to a correctly-policied atom — and that is not this row.

### Proportion — state it, do not assume it

Texas property records are public, and the brief already serves owner free from `cad_property`
on other paths. So this class is usually **paid-tier integrity rather than a privacy breach**.
Your close must say which one this is. It changes the urgency and it changes who owns the fix.

### Related, already established — do not re-derive

`accessPolicy` is atom-level, not field-level. MCP catalog tools (`get_atom`,
`get_property_atom_chain`, `atom_trace`, `atom_export`) return bodies whole with no field
strip. `engine-api` gate headers are spoofable and are not the enforcement point. An auth
deploy needs the anonymous path and the claim flow together, or it strands existing anonymous
work.

### Bounded and out of scope

Read-mostly. No atom-policy change. No tier or pricing decision. **No write to `smartcity-os`
or `smartcity-dashboards`** — both are another lane's, and `smartcity-os` is under an absolute
no-touch. No deploy without the operator's explicit go. Every command must exit on its own.

### Close

A close naming **exactly one** of the three causes, carrying the evidence that eliminated the
other two, plus the phase-3 answer on why owner and tax-assessed value are gated and the rest
are not. If you fixed under the conditional authority, say what changed and how you proved it
by violation: the same incognito load must now refuse.
