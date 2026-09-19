## Mission — P-374: the MCP draw block draws where the route draws, and its prose agrees with the draw

You launch no sub-agents (FAN-DEPTH 0). You build in `legacy-design-tools` and open one PR from current
`origin/main` with the SHA declared. **Start only once LDT main contains P-339's PR #728 and P-366's
PR #726** (the seat merges them): both `grep -c` checks against `git log origin/main --oneline` must be
non-zero. You do not merge, deploy or write any store.

### What is wrong

- **The projection gap** (P-339's close, `_inbox/2026-09-19_p339-mcp-half_close.json`, leave_behind 2).
  After P-339 the MCP overlay's REASON is the attempt's own outcome, but the MCP still runs its own
  derivation. On the artifact of record, `48453:239852`'s route drew 38 vertices and `48453:367134`'s
  drew 7, while both MCP responses served a refused overlay.
- **Prose against the draw** (P-366's close, leave_behind 3). On `48309:187374`, `48453:239852` and
  `48055:27929` the MCP text says the rules are unruled beside a ruled table, or that geometry is
  withheld beside drawn geometry. The draw is right; the prose is wrong.

Both are one defect seen twice: two derivations for one answer. The standing rule
(`_decisions/2026-09-13_share_the_most_current_setback_resolver.md`; ENVELOPE DRAWN, FIGURE REFUSED)
is one resolution, served by every surface.

### What to build

1. **Per parcel, the two paths.** For the five parcels above: what the route computes, what the MCP
   computes, and where they diverge (ring, resolver, labelling, a gate the MCP applies and the route
   does not). A table before any code.
2. **One derivation.** The MCP draw block serves the route's own outcome (the drawn polygon with its
   disclosure, or the route's named decline), rather than re-deriving it. If the MCP must stay
   in-process, it calls the same function with the same inputs, and a divergence test fails when the
   two disagree on any fixture.
3. **The prose is generated from the outcome.** The text the MCP returns is derived from the same
   outcome object that drew (or declined), so it cannot say "withheld" beside a drawn polygon or
   "unruled" beside a ruled table. P-339's constraint stands: no new vocabulary token.

### Verify by violation

Pre-register: the five parcels' MCP answers equal the route's (draw for draw, decline for decline,
same reason); a fixture where the two paths are made to differ fails the divergence test; a genuinely
chain-absent parcel still reads `atom_path_pending`. Grade after deploy with
`node --use-system-ca scripts/surface-probe.mjs --rows P-254 --mcp-sign-in` (the operator signs in).

### The three-question gate

What executes the MCP's draw, what triggers it, what fails when the MCP and the route disagree, and
what bypasses it (the stub-depth envelope rail P-339 named, a surface drawing from its own source).

### Close

Declare: the start commit and PR, the per-parcel two-path table, the fix, the divergence test, the
falsifiers with both directions shown, the three-question gate answers, and `leave_behind`.
