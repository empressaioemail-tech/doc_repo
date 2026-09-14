## Mission — P-205: a county we have not onboarded must say so, instead of claiming it looked

You are a lane of OPS-24. You do not spawn sub-agents. The integration seat supervises you,
reviews CP1 and CP2, and runs the verification itself. You produce artifacts and a diff.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### The finding you are acting on, measured 2026-09-14

A Killeen, TX 76541 address through `find_parcel` returns:

```
{"hits":[],"missClass":"no-hit"}
```

The server's own served vocabulary (`docs://smartsite/vocabulary-p91v3.json`) defines
`no-hit` as looked-and-found-nothing, and defines `out_of_coverage` as never-had-coverage-to-
look, calling it in its own words "the honest opposite of no-hit."

Killeen is in Bell County 48027. Measured against the factory store the same day: Bell has
**zero rows in `parcel_record`** and **zero rows in `parcel_gate_verdict`**. The serving ledger
holds exactly six counties — Travis 380,917, Williamson 282,570, Hays 116,420, McLennan
114,254, Bastrop 62,256, Caldwell 24,988 — and nothing else in Texas.

So the honest answer is the second class and the customer receives the first. This is the
absent-versus-unmeasured collapse at county scale, and it is the load-bearing half of holding
the other 248 counties correctly: they must say they are not covered, not imply we searched.

### What makes this hard, and it is the whole design problem

`out_of_coverage` today is a STATE-level class. Its own definition says the query "resolved to
a state Smart Site's parcel store has not reached yet," with Phoenix, AZ as the example. Bell
is in Texas, so it does not trip it. You need a county-level honest refusal and you must decide
whether that is a widened `out_of_coverage` or a new class. Either is defensible. Pick one,
state why, and update the served vocabulary resource in the same change — a token that exists
in code and not in the vocabulary is a silent degradation.

**THE TRAP THAT WILL ROT THIS IF YOU GET IT WRONG: coverage must be DERIVED, never declared.**
A hardcoded list of six county FIPS is correct today and wrong the moment Burnet lands, and
nobody will notice, because a stale allowlist fails by being silently narrow. This operation
has already been bitten by hand-declared state that nobody refreshed. Derive coverage from
what the store actually holds. If you cannot derive it on the read path for a real reason,
that reason is a finding and you report it rather than hardcoding around it.

### Also true, and do not conflate it

`find_parcel` already has a third state: when an address is known but binds to no parcel, it
returns `located` rows with `missClass: located-unbound`. Killeen returned no `located` rows
either, because address points are loaded for six of 254 counties. **That is a different gap
and it is not yours.** Do not "fix" it by loading address points, and do not let a
`located-unbound` response stand in for the coverage refusal.

### Done looks like

An address in a Texas county absent from the serving ledger returns a coverage-class refusal
that names the county and its state, and never `no-hit`.

An address in an onboarded county with genuinely no matching parcel still returns `no-hit`.
Both halves are required; a change that makes everything a coverage refusal is worse than the
defect, because it would hide real misses in the six counties that work.

### Falsifiers, pre-register your answers before you run anything

- If the refusal fires for an address inside one of the six onboarded counties, you have made
  coverage narrower than it is and real misses are now invisible.
- If it does NOT fire for a county the store demonstrably has no rows for, the coverage source
  you derived from is not the one that decides serving.
- If your coverage check passes on an empty result from a query that could also be empty for
  another reason, you have a presence-shaped check. Coverage and no-rows-matched must be
  distinguishable from two independently derived inputs, not one.

### Do not

Write to any repository you do not own. Touch `smartcity-os` or `smartcity-dashboards`. Load
address points for anything. Widen coverage claims, in code or in copy, beyond the counties the
store actually holds. Deploy without the operator's go.

### Close

`_inbox/<date>_p205-coverage-refusal_close.json`, `planRows` `["P-205"]`, with: the class you
chose and why, the derivation source for coverage and why it is authoritative, the vocabulary
diff, a live read of a Bell address and of an onboarded-county address that genuinely misses,
the PRs with merge SHAs and CI conclusion strings, and the violation test in both directions.
`leave_behind` is required, and `none` is a valid and cheap answer.
