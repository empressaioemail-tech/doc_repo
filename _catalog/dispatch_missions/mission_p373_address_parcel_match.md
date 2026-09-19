## Mission — P-373: the drawing route matches the right parcel from an address or a point

You launch no sub-agents (FAN-DEPTH 0). You build in `legacy-design-tools` and open one PR from current
`origin/main` with the SHA declared. **Start only once LDT main contains P-366's PR #726** (the seat
merges it): `git log origin/main --oneline | grep -c "P-366"` must not print 0. You do not merge, deploy
or write any store.

### What is wrong (P-366's close, `_inbox/2026-09-19_p366-codified-draw-declines_close.json`)

`POST /api/brokerage/v1/place/buildable-envelope` is keyed by a composed address or a record point.
Three parcels do not reach their own parcel:

| Parcel | Card | Route |
|---|---|---|
| `48055:40428` | Caldwell, the San Marcos part | `no-parcel`: the composed address never matched a parcel, so zoning never ran |
| `48055:27929` | Caldwell, Martindale | `no-parcel`, the same way |
| `48453:352594` | Travis, the Buda part | answered from the record point for the WRONG parcel, `48209:10757` (a different county) |

P-366's lane believes these share one cause. Test that; do not assume it.

### What to build

1. **Per parcel, the match path.** What the card sends (address string, point), what the route does
   with it (geocode, situs index, point-in-polygon, a county filter), and why it misses or lands
   elsewhere. A table before any code.
2. **Fix the match at its cause.** A request for a parcel the caller already identified should resolve
   that parcel by its identity where the identity is known, and a point match that lands in another
   county than the parcel's own is refused, never answered. Where the route genuinely cannot match, it
   declines with a named, true reason.
3. **The class.** Read-only, under a heavy-scan lease: how many P-254-style subjects (or a declared
   sample, with its method) hit `no-parcel` or a cross-county answer today. Area sweep, not parcel
   sample, where you can.

### Verify by violation

Pre-register: the three parcels resolve to themselves (or decline with a true reason); a point
deliberately placed in a neighbouring county is refused, not answered; a parcel with no address still
declines honestly. Grade after deploy with `scripts/surface-probe.mjs --rows P-254`.

### The three-question gate

What executes the match, what triggers it, what fails when it lands on the wrong parcel, and what
bypasses it (a surface resolving its own parcel first).

### Close

Declare: the start commit and PR, the per-parcel match table, the fix, the class count, the falsifiers
with both directions shown, the three-question gate answers, and `leave_behind`.
