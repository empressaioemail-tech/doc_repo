# Mission — B-SLATE1: the first five rails cut over, each with its retirement

Decision `_decisions/2026-09-02_step7_consumer_c_then_b.md`. Gated on PARCEL-B-READER
and PARCEL-B-GATE-SCHED. Slate 1: cityLimits/jurisdiction, flood zone + floodway,
wells, specialDistricts, valueHistory. Dollar rails are slate 2 and wait for
PARCEL-S6-COLLISION — not this card, no exceptions.

Per rail, in order, one at a time:
1. Confirm the gate verdict PASSES for the rail in the counties being cut (a refused
   county-rail stays legacy — that is the system working, record it and move on).
2. Flip the allowlist to record for passing county-rails; staging first, then
   production, probing REAL parcels on the deployed surface (gold 48021:34137 plus a
   per-county spot set) before and after each flip; paste wire output verbatim.
3. RETIREMENT in the same card (the ENFORCEMENT rule): identify the legacy path the
   rail replaced (the old bake fields / compose branch), repoint any remaining
   consumers, and retire it by decline — a probe of the retired path must FAIL, and a
   divergence test between old and new must have run before the retirement. Rails
   with no legacy path (valueHistory) record retirement: none, net-new.
4. Caldwell stays legacy on geometry-dependent rails until the txgio backfill lands;
   its refusal is expected and honest.

Close: _inbox/2026-09-02_parcel-b-slate1_close.json with per-rail per-county cutover
and retirement evidence.
