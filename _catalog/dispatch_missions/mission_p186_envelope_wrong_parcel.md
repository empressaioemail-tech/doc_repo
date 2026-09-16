## Mission — P-186: the address-keyed envelope leg answered for another county's parcel

You are the deepest worker on a new OPS-16 row opened by operator ruling 2026-09-14 (amendment
A-149). You do not spawn sub-agents. The dispatch planner supervises you and registers your
worktrees before you start.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### The finding (planner, running the P-167 row; artifact `_inbox/2026-09-14_132056_surface_probe.json`)

`POST {CORTEX_PROXY}/brokerage/v1/place/buildable-envelope` with `{ address }` for the Bastrop
probe parcel `48021:33223` returned `http 200 status ok` carrying
`parcelNodeId: "48491:R419407"` — Williamson, a different county — with setbacks 25/7/15/7,
6 vertices and `buildableAreaSqFt: 1182` in the payload. **Nothing in the response flags the
mismatch.** Only comparing the returned `parcelNodeId` against the parcel asked about reveals it,
which is the hazard the probe names: *"any consumer that does not compare node ids will serve
another lot"*.

### The root cause is NOT established — and the leading candidate is an address collision

Do not assume a node-id bug. This leg is **address-keyed by design**, and the address class is
measured-ambiguous at source: `GET /api/pe-situs-search?q=925%20MAIN%20ST` returns hits in Bastrop
(`48021:73722`), Dallas/Garland (`48113:26266500000070000`), Hempstead and Anthony, plus bare
`925 MAIN STREET, ,` rows — one bare street address resolves across four-plus counties. So the
observed cross-county answer is at least as consistent with the resolver picking a same-street
parcel in another county as with a broken id comparison.

### What you build — discriminating steps FIRST, fixes only after

1. **Find the exact address the leg sends.** Read the record situs the probe passes for
   `48021:33223` and record it verbatim, then test whether that exact string resolves to more than
   one county at source. This single measurement decides which of the two shapes this row is.
2. **Read the resolver's rule.** How does the address-keyed path order and disambiguate
   candidates — county awareness, state, ZIP, a bounding constraint, or first-hit? Record what it
   does, not what it should do.
3. **Compare the twin leg.** The point-keyed leg (`{ lat, lng }`) did NOT raise for the same
   parcel. Say why the two legs differ; the difference is evidence about the mechanism.
4. **Decide and fix the honest defect.** If the defect is the resolver's cross-county pick, fix
   it there; if it is a request that omits a county/state qualifier the resolver needs, fix the
   request path; if the response shape is the only problem, then the fix is the **contract**: a
   response whose `parcelNodeId` differs from the parcel asked about must be visible to the caller
   rather than silently `ok`. State which one you found and why the others were rejected.
5. **Sweep for extent.** Whether the same leg mis-answers for other parcels, and whether the
   point-keyed twin shares the shape. The P-167 parcel set was not chosen for this — it ran only
   because those are the probe's fixed parcels — so the extent is unknown until you measure it.

### Falsifiers

- If you cannot state the exact address string the failing call sent, you have not established the
  mechanism and the row is unmeasured, not fixed.
- If the address resolves to exactly one county at source and the endpoint still answered for
  another, then the mechanism is an id/identity defect and the address-collision hypothesis is
  contradicted — say so.
- If a consumer can still render another lot's values without comparing `parcelNodeId` after your
  change, the contract half of this row did not land.

### Out of scope

`FIGURE-IN-PAYLOAD` (the buildable-area figure travelling in the panel payload; recorded as O2 in
the wave-6 CP1, and R-2 law applies — the figure stays refused until an envelope atom backs it).
`NO-CONTAINING-POLYGON` on the two Bastrop parcels (carried into the `p183-querypoint` review).
New setback tables, and which Bastrop source is right in law (F24 is resolved by A-148).

### Close

`_inbox/<date>_p186-envelope_close.json`, `planRows` `["P-186"]`, with the address string sent
(verbatim), the resolution test at source, the resolver rule as read, the twin-leg comparison, the
fix with its PRs and merge SHAs and conclusion strings, the measured extent, and the probe's own
finding re-run to show it clears or is honestly re-stated. `leave_behind` is required.
